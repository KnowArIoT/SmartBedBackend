const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io-client');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const arduinoController = require('./arduino-controller');
const logger = require('./utils/log4js');
var player = require('play-sound')(opts = {})

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

app.get('/toggleLightOn', (req, res) => {
  console.log('calling toggleLightOn');
  httpGet('http://localhost:3000/switch/2/on');
  res.send({});
});

app.get('/toggleLightOff', (req, res) => {
  console.log('calling toggleLightOff');
  httpGet('http://localhost:3000/switch/2/off');
  res.send({});
});

app.get('/toggleLedOn', (req, res) => {
  console.log('calling toggleLedOn');
  httpGet('http://localhost:3000/switch/6/on');
  res.send({});
});

app.get('/toggleLedOff', (req, res) => {
  console.log('calling toggleLedOff');
  httpGet('http://localhost:3000/switch/6/off');
  res.send({});
});

app.get('/dimLight/:dimValue', (req, res) => {
  console.log('calling dimLight');
  const { dimValue } = req.params;
  httpGet(`http://localhost:3000/dim/2/${message.dimValue * parseInt(2.5, 10)}`);
  res.send({});
});

app.get('/toggleHeatOn', (req, res) => {
  console.log('calling toggleHeatOn');
  httpGet('http://localhost:3000/switch/1/on');
  res.send({});
});

app.get('/toggleHeatOff', (req, res) => {
  console.log('calling toggleHeatOff');
  httpGet('http://localhost:3000/switch/1/off');
  res.send({});
});

app.get('/scene/wakeup', (req, res) => {
  console.log('calling wakeup');
  player.play('quote.mp3');
  httpGet('http://smartbeddypi.local:8080/bed/start/head/up');
  httpGet('http://smartbeddypi.local:8080/bed/start/feet/up');
  setTimeout(function () {
    httpGet('http://smartbeddypi.local:8080/bed/stop/head/up');
    httpGet('http://smartbeddypi.local:8080/bed/stop/feet/up');
  }, 15000);
  // Turn lights on and off a couple of times
  var x = 0;
  var intervalID = setInterval(function () {
    if (x % 2 == 0) {
      httpGet('http://localhost:3000/switch/2/on');
      httpGet('http://localhost:3000/switch/6/on');
    }
    else {
      httpGet('http://localhost:3000/switch/2/off');
      httpGet('http://localhost:3000/switch/6/off');
    }
    if (++x === 7) {
      clearInterval(intervalID);
    }
  }, 2000);
});

app.get('/scene/sleep', (req, res) => {
  console.log('calling sleep');
  var x = 0;
  player.play('snoring.mp3');
  var intervalID = setInterval(function () {
    player.play('snoring.mp3');
    if (++x === 3) {
      clearInterval(intervalID);
    }
  }, 4000);
  var that = this;
  httpGet('http://smartbeddypi.local:8080/bed/start/head/down');
  httpGet('http://smartbeddypi.local:8080/bed/start/feet/down');
  setTimeout(function () {
    httpGet('http://smartbeddypi.local:8080/bed/stop/head/down');
    httpGet('http://smartbeddypi.local:8080/bed/stop/feet/down');
    httpGet('http://localhost:3000/switch/2/off');
    httpGet('http://localhost:3000/switch/6/off');
  }, 12000);
  res.send({});
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
