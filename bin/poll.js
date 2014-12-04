#!/usr/bin/env node
/*******************************************************************************
 * Copyright 2013-2014 Aerospike, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

var yargs = require('yargs');
var net = require('net');
var metrics = require('../lib/metrics');

/*******************************************************************************
 *
 * Options parsing
 * 
 ******************************************************************************/

var argp = yargs
    .usage("Poll Aerospike for Metrics to send to Boundary.\n\n$0 [options]")
    .options({
        'help': {
            boolean: true,
            describe: "Display this message."
        },
        'host': {
            alias: "h",
            default: "127.0.0.1",
            describe: "Aerospike database address."
        },
        'debug': {
            alias: "d",
            default: false,
            describe: "Enable debugging."
        },
        'port': {
            alias: "p",
            default: 3003,
            describe: "Aerospike database port."
        },
        'timeout': {
            alias: "t",
            default: 10,
            describe: "Timeout in milliseconds."
        },
        'interval': {
            default: 1000,
            describe: "Polling interval."
        }
    });

var argv = argp.argv;

var clientOptions = { host: argv.host, port: argv.port };

var client;

/*******************************************************************************
 *
 * Poll the server and emit metrics
 * 
 ******************************************************************************/

var log;
if (argv.debug) {
    log = console.log;
} else {
    log = function(){};
}

var BACKOFF = 0;        // backoff multiplier
var BACKOFF_STEP = 1;   // backoff step, added to each backoff
var BACKOFF_MAX = 60;   // upper backoff factor

var STATE = null; // initial state
var STATS = null; // initial stats

function next() {
    if ( STATE === null ) {
        STATE = 0;
        STATS = {};
    }
    else if ( STATE >= states.length -1 ) {
        render(STATS);
        STATE = null;
        STATS = null;
    }
    else {
        STATE += 1;
    }

    if ( STATE !== null ) {
        client.write(states[STATE].req + '\r\n');
    }
    else {
        setTimeout(next, argv.interval);
    }
}

function render(stats) {
    for ( var key in metrics ) {
        var val = metrics[key].value(stats);
        if ( val !== undefined ) {
            console.log(key + " " + val);
        }
    }
}

function processReadLatency(response) {
    var parts, data;

    parts = response.toString("utf-8").split(";");
    if ( parts.length >= 2 ) {
        data = parts[1].split(",");
        STATS['latency_read_1ms'] = (100.00 - data[2]) / 100;
        STATS['latency_read_8ms'] = data[3] / 100;
        STATS['latency_read_64ms'] = data[4] / 100;
    }

    next();
}

function processWriteLatency(response) {
    var parts, data;

    parts = response.toString("utf-8").split(";");
    if ( parts.length >= 2 ) {
        data = parts[1].split(",");
        STATS['latency_write_1ms'] = (100.00 - data[2]) / 100;
        STATS['latency_write_8ms'] = data[3] / 100;
        STATS['latency_write_64ms'] = data[4] / 100;
    }

    next();
}

function processStatistics(response) {

    response.toString("utf-8").split(";").forEach(function(pairString) {
        var pair = pairString.split("=");
        STATS[pair[0]] = pair[1];
    });
    
    next();
}

function process(response) {
    if ( STATE !== null && STATE < states.length ) {
        BACKOFF = 1;
        states[STATE].res(response);
    }
}

var states = [
    {   req: 'statistics',
        res: processStatistics
    },
    {   req: 'latency:hist=reads;back=10;duration=1;slice=1;',
        res: processReadLatency
    },
    {   req: 'latency:hist=writes;back=10;duration=1;slice=1;',
        res: processWriteLatency
    },
];

function connect() {
    try {

        client = net.connect(clientOptions, next);

        client.on('data', process);

        client.on('error', function(e) {
            STATE = null;
            STATS = null;
            
            console.error("* " + e);
            log(e);
            client.end();
            BACKOFF += (BACKOFF <= BACKOFF_MAX ? BACKOFF_STEP : 0);
            var retry = argv.interval * BACKOFF;
            setTimeout(connect, retry);
        });

        client.on('end', function() {
            log('client disconnected');
        });
    }
    catch(e) {
        log(e)
        setTimeout(connect, argv.interval);
    }
}

connect();