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
var util = require('util');

/*******************************************************************************
 *
 * Print the metrics for informational purposes.
 * 
 ******************************************************************************/

Object.keys(metrics).sort().forEach(function(key) {

    var metric = {
        name:               key,
        displayName:        metrics[key].display,
        displayNameShort:   metrics[key].displayShort,
        description:        metrics[key].description || "",
        unit:               metrics[key].unit || 'number',
        defaultAggregate:   metrics[key].defaultAggregate || 'avg'
    }

    var out = '';
    out += util.format('- `%s` - %s', metric.name, metric.description);
    console.log(out)
});