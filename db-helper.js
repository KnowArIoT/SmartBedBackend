
const { Pool, Client } = require('pg')



const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '', <- passord fix
  port: 5432,
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
