const { Client } = require('pg');
const logger = require('./utils/log4js');

clientConnected = false;

const client = getNewClient()
client.connect(err => {
    if (err) {
        console.error('connection error', err.stack);
    }
    else {
      clientConnected = true;
    }
  });

function getNewClient() {
    return new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
    });
}

// eslint-disable-next-line
//async function setSensorData(pressure, light, flex, temperature, humidity) {
async function setSensorData(sensor_id, value) {
  const sql =
    'INSERT INTO zzzmartbed.sensor_data(sensor_id, value, datetime, user_id, bed_id)' +
    'VALUES ($1, $2, current_timestamp AT TIME ZONE \'Europe/Oslo\', $3, $4)';

  let results;
  if (clientConnected) {
    try {
      results = await client.query(sql, [sensor_id, value, 1, 1]);
      await client.end();
    } catch (e) {
      console.error(e.stack);
      logger.debug(`error ${e.stack}`);
      await client.end();
    }
    return results;
  }
}

// eslint-disable-next-line
async function getSensorData(days) {
  const sql = "SELECT sensor_id, AVG(value) as avg_value, date_trunc('minute', datetime) AT TIME ZONE 'Europe/Oslo' as trunc_minute FROM zzzmartbed.sensor_data WHERE datetime > (current_timestamp - ($1 || ' days')::interval) AT TIME ZONE 'Europe/Oslo' GROUP BY 1, 3 ORDER BY 3";
  let results;
  if (clientConnected) {
    try {
      results = await client.query(sql, [days]);
      //await client.end();
    } catch (e) {
      console.error(e.stack);
      //logger.debug(`error ${e.stack}`);
      //await client.end();
    }
    return results;
  }
}

module.exports = {
  setSensorData,
  getSensorData,
};
