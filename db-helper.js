const { Pool, Client } = require('pg')

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS
  port: process.env.DB_PORT
})
client.connect()


function setSensorData(pressure, light, flex, temperature, humidity) {
  var sql = 'INSERT INTO zzzmartbed.sensor_data(sensor_id, value, datetime, user_id, bed_id)' +
  'VALUES ()'
  client.query(sql, (err, res) => {
    console.log(err, res)
    client.end()
  })
}

function getSensorData() {
  var sql = 'SELECT * FROM zzzmartbed.sensor_data';
  client.query(sql, (err, res) => {
    console.log(err, res)
    client.end()
  })
}

module.exports = {
  setSensorData: setSensorData,
  getSensorData: getSensorData
}
