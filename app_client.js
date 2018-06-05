
var app = require('express')();
var server = require('http').Server(app);
var http = require('http')
const fetch = require('node-fetch')
var bodyParser = require('body-parser');
var arduinoMotorControl = require('./arduino-motor-controller');
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

socket = io.connect('http://35.187.83.210/');
arduinoMotorControl.connectToMotorArduino(logger);

server.listen(8080, function(){
  logger.debug('listening on *:8080');
});

app.post('/registerSensorData', function(req, res) {
  logger.debug("sending sensor Data " + JSON.stringify(req.body));
  res.send("ok")
  socket.emit('message', {type: "sensorData", pressure: req.body.pressure, light: req.body.light, flex: req.body.flex, temperature: req.body.temperature, humidity: req.body.humidity});
});

socket.on('message', function(message) {
  logger.debug("server says " + JSON.stringify(message));
  if (message.type == "light") {
    logger.debug("light");
    if (message.dimValue) {
      logger.debug("calling dimLight");
      httpGet('http://192.168.100.210:3000/dim/2/' + (message.dimValue * parseInt(2.5)));
    }
    else if (message.value) {
      logger.debug("calling toggleLight On");
      httpGet('http://192.168.100.210:3000/switch/2/on');
    }
    else if (!message.value) {
      logger.debug("calling toggleLight Off");
      httpGet('http://192.168.100.210:3000/switch/2/off');
    }
  }
  else if (message.type == "heat") {
    logger.debug("heat");
    if (message.value) {
      logger.debug("calling toggleHeat On");
      httpGet('http://192.168.100.210:3000/switch/1/on');
    }
    else if (!message.value) {
      logger.debug("calling toggleHeat Off");
      httpGet('http://192.168.100.210:3000/switch/1/off');
    }
  }
  else if (message.type == "bed") {

  }
  // else if (message.type == "headAngle") {
  //   logger.debug("calling headAngle");
  //   httpGet('http://192.168.100.210:3000/angle/' + 'A/'+ (message.headAngleValue));
  // }
  // else if (message.type == "feetAngle") {
  //   logger.debug("calling feetAngle");
  //   httpGet('http://192.168.100.210:3000/angle/' + 'B/'+ (message.feetAngleValue));
  // }
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
