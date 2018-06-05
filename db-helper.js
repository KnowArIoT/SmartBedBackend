const { Client } = require('pg');
const logger = require('./utils/log4js');

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

client.connect(err => {
  if (err) {
    console.error('connection error', err.stack);
  } else {
    console.log('connected');
  }
});

// eslint-disable-next-line
async function setSensorData(pressure, light, flex, temperature, humidity) {
  const sql =
    'INSERT INTO zzzmartbed.sensor_data(sensor_id, value, datetime, user_id, bed_id)' +
    'VALUES ()';

  let results;
  try {
    results = await client.query(sql);
    client.end();
  } catch (e) {
    console.error(e.stack);
    logger.debug(`error ${e.stack}`);
    client.end();
  }
  return results;
}

// eslint-disable-next-line
async function getSensorData(days) {
  const sql = 'SELECT * FROM zzzmartbed.sensor_data';
  let results;
  try {
    results = await client.query(sql);
    client.end();
  } catch (e) {
    console.error(e.stack);
    logger.debug(`error ${e.stack}`);
    client.end();
  }
  return results;
}

module.exports = {
  setSensorData,
  getSensorData,
};
