# Boundary Plugin for Aerospike

This plugin was contributed by Aerospike. It collects metrics from Aerospike DB. Currently Aerospike is natively supported only on Linux systems.  

### Prerequisites

|     OS    | Linux | Windows | SmartOS | OS X |
|:----------|:-----:|:-------:|:-------:|:----:|
| Supported |   v   |    -    |    -    |  -   |


|  Runtime | node.js | Python | Java |
|:---------|:-------:|:------:|:----:|
| Required |    +    |        |      |

- [How to install node.js?](https://help.boundary.com/hc/articles/202360701)

### Plugin Setup

None

### Metrics

Sends the following metrics to Boundary:

- `AEROSPIKE_AGGS` - Number of aggregation transactions.
- `AEROSPIKE_AGGS_ERR` - Number of failed aggregation transactions.
- `AEROSPIKE_AGGS_OK` - Number of successful aggregation transactions.
- `AEROSPIKE_CLIENTS` - Number of connected clients.
- `AEROSPIKE_MEM_TOTAL` - Bytes of memory allocated.
- `AEROSPIKE_MEM_USED` - Bytes of memory used.
- `AEROSPIKE_MEM_USED_DATA` - Bytes of memory used for data.
- `AEROSPIKE_MEM_USED_INDEX` - Bytes of memory used for primary index.
- `AEROSPIKE_MEM_USED_SINDEX` - Bytes of memory used for secondary index.
- `AEROSPIKE_OBJECTS` - Number of objects.
- `AEROSPIKE_OBJECTS_EVICTED` - Number of evicted objects.
- `AEROSPIKE_OBJECTS_EXPIRED` - Number of expired objects.
- `AEROSPIKE_QUERIES` - Number of query transactions.
- `AEROSPIKE_QUERIES_ERR` - Number of failed query transactions.
- `AEROSPIKE_QUERIES_OK` - Number of successful query transactions.
- `AEROSPIKE_READS` - Number of read transactions.
- `AEROSPIKE_READS_ERR` - Number of failed read transactions.
- `AEROSPIKE_READS_OK` - Number of successful read transactions.
- `AEROSPIKE_READ_1MS` – Percent of read transaction with latency < 1ms
- `AEROSPIKE_READ_8MS` – Percent of read transaction with latency > 8ms
- `AEROSPIKE_READ_64MS` – Percent of read transaction with latency > 64ms
- `AEROSPIKE_TXNS` - Number of transactions executed.
- `AEROSPIKE_TXNS_WAITING` - Number of transactions waiting.
- `AEROSPIKE_WRITES` - Number of write transactions.
- `AEROSPIKE_WRITES_ERR` - Numer of failed write transactions.
- `AEROSPIKE_WRITES_OK` - Number of successful write transactions.
- `AEROSPIKE_WRITE_1MS` – Percent of write transaction with latency < 1ms
- `AEROSPIKE_WRITE_8MS` – Percent of write transaction with latency > 8ms
- `AEROSPIKE_WRITE_64MS` – Percent of write transaction with latency > 64ms

