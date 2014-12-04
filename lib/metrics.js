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

var _ = require('lodash');

/*******************************************************************************
 *
 * Functions
 * 
 ******************************************************************************/

// read the value for specified key
function $(key) {
    return function(obj) {
        return obj[key];
    }
}

// compute the difference between to requests
// will cache the result. 
// if cache is empty, then return nothing.
function diff(fn) {
    var cache;
    return function(obj) {
        var current = fn(obj);
        if ( cache === undefined ) {
            cache = current;
            return undefined;
        }
        else {
            var prior = cache;
            cache = current;
            if ( current - prior < 0 ) {
                return undefined;
            }
            return current - prior;
        }
    }
}

// calculate the sum of each argument
function sum() {
    var args = arguments;
    return function(obj) {
        return _(args).map(function(arg) {
            return arg(obj);
        }).reduce(function(a,b) {
            return a + b;
        })
    }
}

/******************************************************************************
 *
 * Metrics
 * 
 ******************************************************************************/

module.exports = {

    /**************************************************************************
     * READS
     **************************************************************************/

    AEROSPIKE_READS: {
        display:        "Aerospike Reads",
        displayShort:   "ASD Reads",
        description:    "Number of read transactions.",
        unit:           "number",
        value:          diff($('stat_read_reqs')),
    },

    AEROSPIKE_READS_OK: {
        display:        "Aerospike Reads OK",
        displayShort:   "ASD Reads OK",
        description:    "Number of successful read transactions.",
        unit:           "number",
        value:          diff($('stat_read_success')),
    },

    AEROSPIKE_READS_ERR: {
        display:        "Aerospike Reads ERR",
        displayShort:   "ASD Reads ERR",
        description:    "Number of failed read transactions.",
        unit:           "number",
        value:          diff(sum($('stat_read_errs_notfound'), $('stat_read_errs_other'))),
    },

    /**************************************************************************
     * READS
     **************************************************************************/

    AEROSPIKE_WRITES: {
        display:        "Aerospike Writes",
        displayShort:   "ASD Writes",
        description:    "Number of write transactions.",
        unit:           "number",
        value:          diff($('stat_write_reqs')),
    },

    AEROSPIKE_WRITES_OK: {
        display:        "Aerospike Writes OK",
        displayShort:   "ASD Writes OK",
        description:    "Number of successful write transactions.",
        unit:           "number",
        value:          diff($('stat_write_success')),
    },

    AEROSPIKE_WRITES_ERR: {
        display:        "Aerospike Writes ERR",
        displayShort:   "ASD Writes ERR",
        description:    "Numer of failed write transactions.",
        unit:           "number",
        value:          diff($('stat_write_errs')),
    },

    /**************************************************************************
     * QUERIES
     **************************************************************************/

    AEROSPIKE_QUERIES: {
        display:        "Aerospike Queries",
        displayShort:   "ASD Queries",
        description:    "Number of query transactions.",
        unit:           "number",
        value:          diff($('query_reqs')),
    },

    AEROSPIKE_QUERIES_OK: {
        display:        "Aerospike Queries OK",
        displayShort:   "ASD Queries OK",
        description:    "Number of successful query transactions.",
        unit:           "number",
        value:          diff($('query_success')),
    },

    AEROSPIKE_QUERIES_ERR: {
        display:        "Aerospike Queries ERR",
        displayShort:   "ASD Queries ERR",
        description:    "Number of failed query transactions.",
        unit:           "number",
        value:          diff($('query_fail')),
    },

    /**************************************************************************
     * AGGREGATIONS
     **************************************************************************/

    AEROSPIKE_AGGS: {
        display:        "Aerospike Aggregations",
        displayShort:   "ASD Aggr",
        description:    "Number of aggregation transactions.",
        unit:           "number",
        value:          diff($('query_agg')),
    },

    AEROSPIKE_AGGS_OK: {
        display:        "Aerospike Aggregations OK",
        displayShort:   "ASD Aggr OK",
        description:    "Number of successful aggregation transactions.",
        unit:           "number",
        value:          diff($('query_agg_success')),
    },

    AEROSPIKE_AGGS_ERR: {
        display:        "Aerospike Aggregations ERR",
        displayShort:   "ASD Aggr ERR",
        description:    "Number of failed aggregation transactions.",
        unit:           "number",
        value:          diff($('query_agg_err')),
    },

    /**************************************************************************
     * PROXIED TRANSACTIONS
     **************************************************************************/

    AEROSPIKE_PROXIES: {
        display:        "Aerospike Proxies",
        displayShort:   "ASD Proxies",
        description:    "Number of proxied transactions.",
        unit:           "number",
        value:          diff($('stat_proxy_reqs')),
    },
    
    AEROSPIKE_PROXIES_OK: {
        display:        "Aerospike Proxies OK",
        displayShort:   "ASD Proxies OK",
        description:    "Number of successful proxied transactions.",
        unit:           "number",
        value:          diff($('stat_proxy_success')),
    },
    
    AEROSPIKE_PROXIES_ERR: {
        display:        "Aerospike Proxies ERR",
        displayShort:   "ASD Proxies ERR",
        description:    "Number of failed proxied transactions.",
        unit:           "number",
        value:          diff($('stat_proxy_errs')),
    },

    /**************************************************************************
     * MEMORY
     **************************************************************************/

    AEROSPIKE_MEM_TOTAL: {
        display:        "Aerospike Memory Total",
        displayShort:   "ASD Memory Total",
        description:    "Bytes of memory allocated.",
        unit:           "bytecount",
        value:          $('total-bytes-memory'),
    },

    AEROSPIKE_MEM_USED: {
        display:        "Aerospike Memory Used",
        displayShort:   "ASD Memory Used",
        description:    "Bytes of memory used.",
        unit:           "bytecount",
        value:          $('used-bytes-memory'),
    },

    AEROSPIKE_MEM_USED_DATA: {
        display:        "Aerospike Memory Data",
        displayShort:   "ASD Memory Data",
        description:    "Bytes of memory used for data.",
        unit:           "bytecount",
        value:          $('data-used-bytes-memory'),
    },

    AEROSPIKE_MEM_USED_INDEX: {
        display:        "Aerospike Memory Index",
        displayShort:   "ASD Memory Index",
        description:    "Bytes of memory used for primary index.",
        unit:           "bytecount",
        value:          $('index-used-bytes-memory'),
    },

    AEROSPIKE_MEM_USED_SINDEX: {
        display:        "Aerospike Memory SIndex",
        displayShort:   "ASD Memory Sindex",
        description:    "Bytes of memory used for secondary index.",
        unit:           "bytecount",
        value:          $('sindex-used-bytes-memory'),
    },

    /**************************************************************************
     * OBJECTS
     **************************************************************************/

    AEROSPIKE_OBJECTS: {
        display:        "Aerospike Objects",
        displayShort:   "ASD Objects",
        description:    "Number of objects.",
        unit:           "number",
        value:          $('objects'),
    },

    AEROSPIKE_OBJECTS_EXPIRED: {
        display:        "Aerospike Objects Expired",
        displayShort:   "ASD Objects Exp",
        description:    "Number of expired objects.",
        unit:           "number",
        value:          $('stat_expired_objects'),
    },

    AEROSPIKE_OBJECTS_EVICTED: {
        display:        "Aerospike Objects Evicted",
        displayShort:   "ASD Objects Evict",
        description:    "Number of evicted objects.",
        unit:           "number",
        value:          $('stat_evicted_objects'),
    },

    /**************************************************************************
     * CLIENTS AND TRANSACTIONS
     **************************************************************************/

    AEROSPIKE_CLIENTS: {
        display:        "Aerospike Clients",
        displayShort:   "ASD Clients",
        description:    "Number of connected clients.",
        unit:           "number",
        value:          $('client_connections'),
    },

    AEROSPIKE_TXNS: {
        display:        "Aerospike Transactions",
        displayShort:   "ASD Txns",
        description:    "Number of transactions executed.",
        unit:           "number",
        value:          diff($('transactions')),
    },

    AEROSPIKE_TXNS_WAITING: {
        display:        "Aerospike Transactions Waiting",
        displayShort:   "ASD Txns Waiting",
        description:    "Number of transactions waiting.",
        unit:           "number",
        value:          diff($('waiting_transactions')),
    },


    /**************************************************************************
     * READ LATENCY
     **************************************************************************/

    AEROSPIKE_READ_1MS: {
        display:        "Aerospike Read Latency < 1ms",
        displayShort:   "ASD Read 1ms",
        description:    "Percentage of read operations completed in less than 1ms",
        unit:           "percent",
        value:          $('latency_read_1ms'),
    },

    AEROSPIKE_READS_8MS: {
        display:        "Aerospike Read Latency > 8ms",
        displayShort:   "ASD Read 8ms",
        description:    "Percentage of read operations completed in more than 8ms",
        unit:           "percent",
        value:          $('latency_read_8ms'),
    },

    AEROSPIKE_READS_64MS: {
        display:        "Aerospike Read Latency > 64ms",
        displayShort:   "ASD Read 64ms",
        description:    "Percentage of read operations completed in more than 64ms",
        unit:           "percent",
        value:          $('latency_read_64ms'),
    },

    /**************************************************************************
     * WRITE LATENCY
     **************************************************************************/

    AEROSPIKE_WRITE_1MS: {
        display:        "Aerospike Write Latency < 1ms",
        displayShort:   "ASD Write 1ms",
        description:    "Percentage of write operations completed in less than 1ms",
        unit:           "percent",
        value:          $('latency_write_1ms'),
    },

    AEROSPIKE_WRITE_8MS: {
        display:        "Aerospike Write Latency > 8ms",
        displayShort:   "ASD Write 8ms",
        description:    "Percentage of write operations completed in more than 8ms",
        unit:           "percent",
        value:          $('latency_write_8ms'),
    },

    AEROSPIKE_WRITE_64MS: {
        display:        "Aerospike Write Latency > 64ms",
        displayShort:   "ASD Write 64ms",
        description:    "Percentage of write operations completed in more than 64ms",
        unit:           "percent",
        value:          $('latency_write_64ms'),
    },

};

