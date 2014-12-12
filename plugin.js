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
var metrics = require('./lib/metrics');

/*******************************************************************************
 *
 * Plugin
 * 
 ******************************************************************************/

module.exports = {
    description:  "Aerospike Server",
    command:      "node . --interval $(pollInterval)",
    postExtract:  "npm install",
    ignore:       "node_modules",
    metrics:      _.keys(metrics),
    dashboards: [
      { name: "Aerospike Overview",
        layout: "d-w=3&d-h=3&d-pad=5&d-bg=none&d-sg-cpu=0-0-1-1&d-sg-ni=1-0-1-1-t&d-sg-no=1-0-1-1-b&d-sg-hdrb=2-0-1-1-t&d-sg-hdwb=2-0-1-1-b&d-g-AEROSPIKE_MEM_TOTAL=0-1-1-1-t&d-g-AEROSPIKE_MEM_USED=0-1-1-1-b&d-g-AEROSPIKE_MEM_USED_INDEX=1-1-1-1-t&d-g-AEROSPIKE_MEM_USED_DATA=1-1-1-1-b&d-g-AEROSPIKE_OBJECTS=2-1-1-1-t&d-g-AEROSPIKE_OBJECTS_EVICTED=2-1-1-1-b&d-g-AEROSPIKE_CLIENTS=0-2-1-1&d-g-AEROSPIKE_PROXIES=2-2-1-1&d-g-AEROSPIKE_TXNS=1-2-1-1"
      },
      { name: "Aerospike Transactions",
        layout: "d-w=3&d-h=3&d-pad=5&d-bg=none&d-g-AEROSPIKE_TXNS=0-1-1-1&d-g-AEROSPIKE_OBJECTS=1-0-1-1&d-g-AEROSPIKE_CLIENTS=0-0-1-1&d-g-AEROSPIKE_MEM_USED=2-0-1-1&d-g-AEROSPIKE_READ_1MS=2-1-1-1-t&d-g-AEROSPIKE_READS_8MS=2-1-1-1-b&d-g-AEROSPIKE_WRITE_1MS=2-2-1-1-t&d-g-AEROSPIKE_WRITE_8MS=2-2-1-1-b&d-g-AEROSPIKE_PROXIES=0-2-1-1&d-g-AEROSPIKE_WRITES=1-2-1-1-t&d-g-AEROSPIKE_WRITES_ERR=1-2-1-1-b&d-g-AEROSPIKE_READS=1-1-1-1-t&d-g-AEROSPIKE_READS_ERR=1-1-1-1-b"
      }
    ]
};
