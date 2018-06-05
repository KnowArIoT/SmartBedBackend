var app = require('express')();
var server = require('http').Server(app);
var http = require('http')
const fetch = require('node-fetch')
var bodyParser = require('body-parser');
var arduinoController = require('./arduino-controller');
var log4js = require('log4js');

log4js.configure({
  appenders: { 'file': { type: 'file', filename: 'logs/app_client.log' } },
  categories: { default: { appenders: ['file'], level: 'debug' } }
});
var logger = log4js.getLogger();
logger.level = 'debug';
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var io = require('socket.io-client'),
socket = io.connect('https://ariot.knowit.no/');

app.get('/', function(req, res){
  res.send("KnowIot client service is running!");
});

app.post('/bed', function(req, res){
  var startOrStop = req.body.startOrStop;
  var headOrFeet = req.body.headOrFeet;
  var direction = req.body.direction;
  bedControl(startOrStop, headOrFeet, direction);
  res.send({});
});

app.get('/bed/:startOrStop/:headOrFeet/:direction', function(req, res){
  var startOrStop = req.params.startOrStop;
  var headOrFeet = req.params.headOrFeet;
  var direction = req.params.direction;
  bedControl(startOrStop, headOrFeet, direction);
  res.send({});
});

server.listen(8080, function(){
  logger.debug('listening on *:8080');
});

app.post('/registerSensorData', function(req, res) {
  logger.debug("sending sensor Data " + JSON.stringify(req.body));
  socket.emit('message', {type: "sensorData", pressure: req.body.pressure, light: req.body.light, flex: req.body.flex, temperature: req.body.temperature, humidity: req.body.humidity});
  res.send("ok")
});

socket.on('connect', function() {
  logger.debug("Connected to socket");
  arduinoController.setSocket(socket);
});

socket.on('message', function(message) {
  logger.debug("server says " + JSON.stringify(message));
  if (message.type == "light") {
    logger.debug("light");
    if (message.dimValue) {
      logger.debug("calling dimLight");
      httpGet('http://localhost:3000/dim/2/' + (message.dimValue * parseInt(2.5)));
    }
    else if (message.value) {
      logger.debug("calling toggleLight On");
      httpGet('http://localhost:3000/switch/2/on');
    }
    else if (!message.value) {
      logger.debug("calling toggleLight Off");
      httpGet('http://localhost:3000/switch/2/off');
    }
  }
  else if (message.type == "led") {
    logger.debug("led");
    if (message.value) {
      logger.debug("calling toggleLed On");
      httpGet('http://localhost:3000/switch/6/on');
    }
    else {
      logger.debug("calling toggleLed Off");
      httpGet('http://localhost:3000/switch/6/off');
    }
  }
  else if (message.type == "heat") {
    logger.debug("heat");
    if (message.value) {
      logger.debug("calling toggleHeat On");
      httpGet('http://localhost:3000/switch/1/on');
    }
    else if (!message.value) {
      logger.debug("calling toggleHeat Off");
      httpGet('http://localhost:3000/switch/1/off');
    }
  }
  else if (message.type == "bed") {
    bedControl(message.startOrStop, message.headOrFeet, message.direction);
  }
  else if (message.type == "setAlarm") {
    logger.debug("calling setAlarm");
    if (message.time == 0) {
      //slett alarm
    }
    else {
      // Set alarm
    }
    // Peder fix set alarm
  }
  else if (message.type == "wakeup") {
    logger.debug("calling wakeup");
    httpGet('http://192.168.100.210:3000/scene/wakeup');
  }
  else if (message.type == "sleep") {
    logger.debug("calling sleep");
    httpGet('http://192.168.100.210:3000/scene/sleep');
  }
});


function httpGet(url)
{
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      logger.debug(myJson);
    })
    .catch((error) => {
      logger.debug("error " + error);
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


  if (startOrStop == 'start' && headOrFeet == 'feet' && direction == 'up') {
    arduinoController.writeToMotorArduino(stopFeetUp);
    arduinoController.writeToMotorArduino(startFeetUp);
    return;
    //s = 2;
  }
  else if (startOrStop == 'start' && headOrFeet == 'head' && direction == 'up') {
    arduinoController.writeToMotorArduino(stopHeadUp);
    arduinoController.writeToMotorArduino(startHeadUp);
    return;
    //s = 1;
  }
  else if (startOrStop == 'stop' && headOrFeet == 'feet' && direction == 'up') {
      arduinoController.writeToMotorArduino(stopFeetUp);
      return;
  }
  else if (startOrStop == 'stop' && headOrFeet == 'head' && direction == 'up') {
      arduinoController.writeToMotorArduino(stopHeadUp);
      return;
  }
  else if (startOrStop == 'start' && headOrFeet == 'feet' && direction == 'down') {
      arduinoController.writeToMotorArduino(stopFeetDown);
      arduinoController.writeToMotorArduino(startFeetDown);
      return;
  }
  else if (startOrStop == 'start' && headOrFeet == 'head' && direction == 'down') {
      arduinoController.writeToMotorArduino(stopHeadDown);
      arduinoController.writeToMotorArduino(startHeadDown);
      return;
  }
  else if (startOrStop == 'stop' && headOrFeet == 'feet' && direction == 'down') {
      arduinoController.writeToMotorArduino(stopFeetDown);
      return;
  }
  else if (startOrStop == 'stop' && headOrFeet == 'head' && direction == 'down') {
      arduinoController.writeToMotorArduino(stopHeadDown);
      return;
  }

  arduinoController.writeToMotorArduino(defaultCode, logger);
}
