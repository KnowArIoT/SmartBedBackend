var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const fetch = require('node-fetch')
var bodyParser = require('body-parser');
var log4js = require('log4js');

log4js.configure({
  appenders: { 'file': { type: 'file', filename: 'logs/app_client.log' } },
  categories: { default: { appenders: ['file'], level: 'debug' } }
});
var logger = log4js.getLogger();
logger.level = 'debug';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


socket = null;

http.listen(8080, function(){
  console.log('listening on *:8080');
});

app.get('/', function(req, res){
  res.send("KnowIot backend service is running!");
  console.log("calling root /");
  res.send({});
});

app.get('/toggleLightOn', function(req, res){
  console.log("calling toggleLightOn");
  socket.emit('message', {type: "light", value: true});
  res.send({});
});

app.get('/toggleLightOff', function(req, res){
  console.log("calling toggleLightOff");
  socket.emit('message', {type: "light", value: false});
  res.send({});
});

app.get('/dimLight/:dimValue', function(req, res){
  console.log("calling dimLight");
  var dimValue = req.params.dimValue
  socket.emit('message', {type: "light", dimValue: dimValue});
  res.send({});
});

app.get('/toggleHeatOn', function(req, res){
  console.log("calling toggleHeatOn");
  socket.emit('message', {type: "heat", value: true});
  res.send({});
});

app.get('/toggleHeatOff', function(req, res){
  console.log("calling toggleHeatOff");
  socket.emit('message', {type: "heat", value: false});
  res.send({});
});

app.get('/setHeadAngle/:value', function(req, res){
  console.log("calling setHeadAngle");
  var value = req.params.value;
  socket.emit('message', {type: "headAngle", headAngleValue: value});
  res.send({});
});

app.get('/setFeetAngle/:value', function(req, res){
  console.log("calling setFeetAngle");
  var value = req.params.value;
  socket.emit('message', {type: "feetAngle", feetAngleValue: value});
  res.send({});
});

app.get('/setAlarm/:time', function(req, res){
  console.log("calling setAlarm");
  var time = req.params.time;
  socket.emit('message', {type: "setAlarm", time: time});
  res.send({});
});
app.get('/scene/wakeup', function(req, res){
  console.log("calling wakeup");
  socket.emit('message', {type: "wakeup"});
  res.send({});
});
app.get('/scene/sleep', function(req, res){
  console.log("calling sleep");
  socket.emit('message', {type: "sleep"});
  res.send({});
});

app.post('/bed', function(req, res){
  var startOrStop = req.body.startOrStop;
  var headOrFeet = req.body.headOrFeet;
  var direction = req.body.direction;
  socket.emit('message', {type: "bed", startOrStop: startOrStop, headOrFeet: headOrFeet, direction: direction});
  res.send({});
});

io.sockets.on('connection', function (newSocket) {
    console.log('A client is connected!');
    socket = newSocket;
    socket.emit('message', 'You are connected!');
    // When the server receives a “message” type signal from the client
    socket.on('message', function (message) {
        const strMessage = {...message}
        console.log('A client is speaking to me! They’re saying:\n ' + JSON.stringify(strMessage));
        console.log("type: " + message.type);

        if (message.type == "sensorData") {
          var pressure = parseInt(message.pressure)
          var light = parseInt(message.light)
          var flex = parseInt(message.flex)
          var temperature = parseFloat(message.temperature)
          var humidity = message.humidity
          if (humidity.indexOf("\r\n") !== -1) {
            humidity = humidity.slice(0, -4);
          }
          humidity = parseFloat(humidity);
          obj = {
          bed_id: "ariot_seng",
          data: [
            {
                name: "pressure",
                value: pressure
            },
            {
                "name": "light",
                "value": light
            },
            {
                "name": "flex",
                "value": flex
            },
            {
                "name": "temperature",
                "value": temperature
            },
            {
                name: "humidity",
                value: humidity
            }
          ]
        }
          httpPost('http://localhost:8081/sensorData/insertValues', JSON.stringify(obj));
      }
    });
});

function httpGet(url)
{
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      console.log(myJson);
    })
    .catch((error) => {
      console.log("error " + error);
    });
}

function httpPost(url, data)
{
  fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: data,
    method: 'POST'
  })
    .then(function(response) {
      const strMessage = {...response}
      console.log("response " + JSON.stringify(strMessage))
      console.log(response.status);
    })
    .catch((error) => {
      console.log("error " + error);
    });
}
