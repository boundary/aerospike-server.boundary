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

var https = require('https');
var yargs = require('yargs');
var metrics = require('../lib/metrics');

/*******************************************************************************
 *
 * Options parsing
 * 
 ******************************************************************************/

var argp = yargs
    .usage("Update the metrics in Boundary.\n\n$0 [options]")
    .options({
        'help': {
            boolean: true,
            describe: "Display this message."
        },
        'email': {
            demand: true,
            describe: "e-mail address to use for publishing the metrics."
        },
        'token': {
            demand: true,
            describe: "api-token to use for publishing the metrics."
        }
    });

var argv = argp.argv;

/*******************************************************************************
 *
 * Establish a connection to the cluster.
 * 
 ******************************************************************************/

function update(email, token, path, object, done) {

    var options = {
        method: 'PUT',
        host: 'premium-api.boundary.com',
        path: path,
        auth: email +':'+ token,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var callback = function(response) {

        var output = [];

        response.setEncoding('utf8');
        
        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            output.push(chunk);
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            done(path, output.join(''));
        });
    }

    req = https.request(options, callback);
    req.on('error', function(e) {
        console.error(e);
    })
    req.write(JSON.stringify(object));
    req.end();
}

function print(label, response) {
    console.log(label, response);
}

if (argv._.length == 0) {
    for ( var key in metrics ) {

        var metric = {
            name:               key,
            displayName:        metrics[key].display,
            displayNameShort:   metrics[key].displayShort,
            description:        metrics[key].description || "",
            unit:               metrics[key].unit || 'number',
            defaultAggregate:   metrics[key].defaultAggregate || 'avg'
        }

        update(argv['email'], argv['token'], '/v1/metrics/' + key, metric, print);
    }
}
else {
    argv._.forEach(function(key) {

        var metric = {
            name:               key,
            displayName:        metrics[key].display,
            displayNameShort:   metrics[key].displayShort,
            description:        metrics[key].description || "",
            unit:               metrics[key].unit || 'number',
            defaultAggregate:   metrics[key].defaultAggregate || 'avg'
        }

        update(argv['email'], argv['token'], '/v1/metrics/' + key, metric, print);
    });
}