/**
 * Absraction layer to write to stream mechanism
 * Allows us to move away from Kinesis or Kafka when ready.
 *
 *
 * THIS WILL BE A SHARED MODULED
 * SERVICE MUST INJECT STREAM SERVICE OBJECT INTO MODULE
 **/
 const AWS = require('aws-sdk');
 const Kinesis = new AWS.Kinesis({
   region: '',
   accessKeyId: '',
   secretAccessKey: '',
 });


/**
 * Write to Stream wrapper
 **/
const write = async (streamName, data) => {
  const params = {
    Data: JSON.stringify(data),
    StreamName: streamName,
    PartitionKey: "1"
  }

  try {
    return await Kinesis.putRecord(params).promise();
  } catch (error) {
    // Log
    console.error(error);
  }
}

/**
 * Access the stream and read from it
 **/
const _read = async (shardIterator, topic, limit) => {
  const params = {
    ShardIterator: shardIterator,
    Limit: limit
  }

  const records = await Kinesis.getRecords(params).promise();
  return records.Records;
}

const readAtTimeStamp = async (topic, timeStamp, limit=100) => {
  const shardIterator = await _getShardIterator(topic, 'AT_TIMESTAMP', timeStamp);
  return await _read(shardIterator, topic, limit);
}


/**
 * Get Shard Iterator
 **/
const _getShardIterator = async (streamName, type, typeValue) => {
  const streamInfo = await _getStreamInfo(streamName);
  const shards = streamInfo.StreamDescription.Shards;
  const shardId = shards[0].ShardId; // We only have 1 shard at the moment.

  const params = {
    ShardId: shardId,
    StreamName: streamName,
  }

  if(type === 'AT_TIMESTAMP') {
    params.ShardIteratorType = 'AT_TIMESTAMP';
    params.Timestamp = typeValue;
  } else {
    params.ShardIteratorType = 'TRIM_HORIZON';
  }

  const shardInfo = await Kinesis.getShardIterator(params).promise();
  return shardInfo.ShardIterator;
}


/**
 * Fetch Stream info. Used when fetching shard id for later use.
 **/
const _getStreamInfo = async (streamName) => {
  return await Kinesis.describeStream({
    StreamName: streamName
  }).promise();
}

module.exports = {
  write,
  readAtTimeStamp,
}
