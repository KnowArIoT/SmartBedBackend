require('dotenv').config();
const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const logger = require('./utils/log4js');
const { getSensorData, setSensorData } = require('./db-helper');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let socket = null;

http.listen(8080, () => {
  console.log('listening on *:8080');
});

app.get('/', (req, res) => {
  res.send('KnowIot backend service is running!');
  console.log('calling root /');
  res.send({});
});

app.get('/sensorData/:days', async (req, res) => {
  const { days } = req.params;
  //const dateOffset = 24 * 60 * 60 * 1000 * parseInt(days, 10);
  //const myDate = new Date();
  // myDate.setTime(myDate.getTime() - dateOffset);
  const dateNow = new Date().toISOString();
  console.log(dateNow);
  // Sebastian, get sensordata på dette formatet

  const obj = {
    sensorStatistics: [
      {
        sensor_id: 'flex',
        history: []
      },
      {
        sensor_id: 'pressure',
        history: []
      },
      {
        sensor_id: 'temperature',
        history: []
      },
      {
        sensor_id: 'humidity',
        history: []
      },
      {
        sensor_id: 'light',
        history: []
      }
    ],
  };

  const sensorData = await getSensorData(days);
  for (let i = 0, len = sensorData.rows.length; i < len; i++) {
      const sensorReading = sensorData.rows[i];
      obj.sensorStatistics.find((item) => item.sensor_id === sensorReading.sensor_id).history.push({minuteOfTime: sensorReading.trunc_minute, averageSensorValue: sensorReading.avg_value});
  }

  res.send(obj);
});

app.get('/toggleLightOn', (req, res) => {
  console.log('calling toggleLightOn');
  socket.emit('message', { type: 'light', value: true });
  res.send({});
});

app.get('/toggleLightOff', (req, res) => {
  console.log('calling toggleLightOff');
  socket.emit('message', { type: 'light', value: false });
  res.send({});
});

app.get('/toggleLedOn', (req, res) => {
  console.log('calling toggleLedOn');
  socket.emit('message', { type: 'led', value: true });
  res.send({});
});

app.get('/toggleLedOff', (req, res) => {
  console.log('calling toggleLedOff');
  socket.emit('message', { type: 'led', value: false });
  res.send({});
});

app.get('/dimLight/:dimValue', (req, res) => {
  console.log('calling dimLight');
  const { dimValue } = req.params;
  socket.emit('message', { type: 'light', dimValue });
  res.send({});
});

app.get('/toggleHeatOn', (req, res) => {
  console.log('calling toggleHeatOn');
  socket.emit('message', { type: 'heat', value: true });
  res.send({});
});

app.get('/toggleHeatOff', (req, res) => {
  console.log('calling toggleHeatOff');
  socket.emit('message', { type: 'heat', value: false });
  res.send({});
});

app.get('/setAlarm/:time', (req, res) => {
  console.log('calling setAlarm');
  const { time } = req.params;
  socket.emit('message', { type: 'setAlarm', time });
  res.send({});
});
app.get('/scene/wakeup', (req, res) => {
  console.log('calling wakeup');
  socket.emit('message', { type: 'wakeup' });
  res.send({});
});
app.get('/scene/sleep', (req, res) => {
  console.log('calling sleep');
  socket.emit('message', { type: 'sleep' });
  res.send({});
});

app.post('/bed', (req, res) => {
  const { startOrStop, headOrFeet, direction } = req.body;
  socket.emit('message', {
    type: 'bed',
    startOrStop,
    headOrFeet,
    direction,
  });
  res.send({});
});

io.sockets.on('connection', newSocket => {
  console.log('A client is connected!');
  socket = newSocket;
  socket.emit('message', 'You are connected!');
  // When the server receives a “message” type signal from the client
  socket.on('message', message => {
    const strMessage = { ...message };
    console.log(
      `A client is speaking to me! They’re saying:\n ${JSON.stringify(
        strMessage,
      )}`,
    );
    console.log(`type: ${message.type}`);

    if (message.type === 'sensorData') {
        const pressure = parseInt(message.pressure, 10);
        const light = parseInt(message.light, 10);
        const flex = parseInt(message.flex, 10);
        const temperature = parseFloat(message.temperature);
        const humidity = parseFloat(message.humidity);

        setSensorData('pressure', pressure);
        setSensorData('light', light);
        setSensorData('flex', flex);
        setSensorData('temperature', temperature);
        setSensorData('humidity', humidity);
    }
  });
});
