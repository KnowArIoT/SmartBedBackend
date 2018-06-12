const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io-client');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const arduinoController = require('./arduino-controller');
const logger = require('./utils/log4js');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const socket = io.connect('https://ariot.knowit.no/');

function httpGet(url) {
  fetch(url)
    .then(response => response.json())
    .then(myJson => {
      console.log(myJson);
    })
    .catch(error => {
      console.log(`error ${error}`);
    });
}

function bedControl(startOrStop, headOrFeet, direction) {
  const defaultCode = 0;
  const startFeetUp = 2;
  const startHeadUp = 1;
  const stopFeetUp = 6;
  const stopHeadUp = 5;
  const startFeetDown = 4;
  const startHeadDown = 3;
  const stopFeetDown = 8;
  const stopHeadDown = 7;

  if (startOrStop === 'start' && headOrFeet === 'feet' && direction === 'up') {
    // arduinoController.writeToMotorArduino(stopFeetUp);
    arduinoController.writeToMotorArduino(startFeetUp);
  } else if (
    startOrStop === 'start' &&
    headOrFeet === 'head' &&
    direction === 'up'
  ) {
    // arduinoController.writeToMotorArduino(stopHeadUp);
    arduinoController.writeToMotorArduino(startHeadUp);
  } else if (
    startOrStop === 'stop' &&
    headOrFeet === 'feet' &&
    direction === 'up'
  ) {
    arduinoController.writeToMotorArduino(stopFeetUp);
  } else if (
    startOrStop === 'stop' &&
    headOrFeet === 'head' &&
    direction === 'up'
  ) {
    arduinoController.writeToMotorArduino(stopHeadUp);
  } else if (
    startOrStop === 'start' &&
    headOrFeet === 'feet' &&
    direction === 'down'
  ) {
    // arduinoController.writeToMotorArduino(stopFeetDown);
    arduinoController.writeToMotorArduino(startFeetDown);
  } else if (
    startOrStop === 'start' &&
    headOrFeet === 'head' &&
    direction === 'down'
  ) {
    // arduinoController.writeToMotorArduino(stopHeadDown);
    arduinoController.writeToMotorArduino(startHeadDown);
  } else if (
    startOrStop === 'stop' &&
    headOrFeet === 'feet' &&
    direction === 'down'
  ) {
    arduinoController.writeToMotorArduino(stopFeetDown);
  } else if (
    startOrStop === 'stop' &&
    headOrFeet === 'head' &&
    direction === 'down'
  ) {
    arduinoController.writeToMotorArduino(stopHeadDown);
  } else {
    arduinoController.writeToMotorArduino(defaultCode, logger);
  }
}

app.get('/', (req, res) => {
  res.send('KnowIot client service is running!');
});

app.post('/bed', (req, res) => {
  const { startOrStop, headOrFeet, direction } = req.body;
  bedControl(startOrStop, headOrFeet, direction);
  res.send({});
});

app.get('/bed/:startOrStop/:headOrFeet/:direction', (req, res) => {
  const { startOrStop, headOrFeet, direction } = req.params;
  bedControl(startOrStop, headOrFeet, direction);
  res.send({});
});

server.listen(8080, () => {
  console.log('listening on *:8080');
});

app.post('/registerSensorData', (req, res) => {
  console.log(`sending sensor Data ${JSON.stringify(req.body)}`);
  socket.emit('message', {
    type: 'sensorData',
    pressure: req.body.pressure,
    light: req.body.light,
    flex: req.body.flex,
    temperature: req.body.temperature,
    humidity: req.body.humidity,
  });
  res.send('ok');
});

socket.on('connect', () => {
  console.log('Connected to socket');
  arduinoController.setSocket(socket);
});

socket.on('message', message => {
  console.log(`server says ${JSON.stringify(message)}`);
  if (message.type === 'light') {
    console.log('light');
    if (message.dimValue) {
      console.log('calling dimLight');
      httpGet(
        `http://localhost:3000/dim/2/${message.dimValue * parseInt(2.5, 10)}`,
      );
    } else if (message.value) {
      console.log('calling toggleLight On');
      httpGet('http://localhost:3000/switch/2/on');
    } else if (!message.value) {
      console.log('calling toggleLight Off');
      httpGet('http://localhost:3000/switch/2/off');
    }
  } else if (message.type === 'led') {
    console.log('led');
    if (message.value) {
      console.log('calling toggleLed On');
      httpGet('http://localhost:3000/switch/6/on');
    } else {
      console.log('calling toggleLed Off');
      httpGet('http://localhost:3000/switch/6/off');
    }
  } else if (message.type === 'heat') {
    console.log('heat');
    if (message.value) {
      console.log('calling toggleHeat On');
      httpGet('http://localhost:3000/switch/1/on');
    } else if (!message.value) {
      console.log('calling toggleHeat Off');
      httpGet('http://localhost:3000/switch/1/off');
    }
  } else if (message.type === 'bed') {
    bedControl(message.startOrStop, message.headOrFeet, message.direction);
  } else if (message.type === 'setAlarm') {
    console.log('calling setAlarm');
    if (message.time === 0) {
      // slett alarm
    } else {
      // Set alarm
    }
    // Peder fix set alarm
  } else if (message.type === 'wakeup') {
    console.log('calling wakeup');
    httpGet('http://localhost:3000/scene/wakeup');
  } else if (message.type === 'sleep') {
    console.log('calling sleep');
    httpGet('http://localhost:3000/scene/sleep');
  }
});
