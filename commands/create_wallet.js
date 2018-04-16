/**
 * Command - Create Wallet in the background.
 * Pulls from a specific topic in the Stream.
 * This will be a lambda that is triggered every few seconds.
 **/
const moment = require('moment');
const async = require('async');

const DataStream = require('../utils/DataStream');
const { Wallet } = require('../db');
const { WALLET_CREATE_STREAM } = require('../constants');

/**
 * Process each data item by grabbing the data
 * and then saving that data into the DB
 **/
const saveData = (data, cb) => {
  // Save data to DB we need to log this so we can go back
  // and audit...just in case.
  const { userId, type } = JSON.parse(data.Data.toString())
    Wallet.query().insert({ userId, type })
    .then(data => {
      // Log the success..
      return cb()
    })
    .catch(error => {
      // Log this..
      console.error(error)
      return cb();
    });
}

/**
 * Handle the completion of saving everything
 **/
const done = (error) => {
  process.exit(0);
}

/**
 * Look up content starting X time ago.
 **/
const atTime = moment().utc().subtract(10, 'minutes').format();
DataStream.readAtTimeStamp(WALLET_CREATE_STREAM, atTime)
.then(resp => {
    if (!resp.length) return;

    // Foreach element in the response, save it.
    async.each(
      resp,
      (data, cb) => saveData(data, cb),
      (error) => done(error)
    );
})
.catch(error => {
  // Log any errors with fetching the stream.
  console.error(error);
});
