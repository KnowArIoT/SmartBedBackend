
var app = require('express')();
var server = require('http').Server(app);
var http = require('http')
var xmlHttpRequest = require("xmlhttprequest");
const fetch = require('node-fetch')
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var io = require('socket.io-client'),
socket = io.connect('http://35.187.83.210/');

app.get('/', function(req, res){
  console.log("i am client /");
});

server.listen(8080, function(){
  console.log('listening on *:8080');
});

app.post('/registerSensorData', function(req, res) {
  console.log("sending sensor Data " + JSON.stringify(req.body));
  res.send("ok")
  socket.emit('message', {type: "sensorData", pressure: req.body.pressure, light: req.body.light, flex: req.body.flex, temperature: req.body.temperature, humidity: req.body.humidity});
});

socket.on('message', function(message) {
  console.log("server says " + JSON.stringify(message));
  if (message == "You are connected!") {
    socket.emit('message', 'Hi server, how are you?');
  }
  else if (message.type == "light") {
    console.log("light");
    if (message.dimValue) {
      console.log("calling dimLight");
      httpGet('http://192.168.100.210:3000/dim/2/' + (message.dimValue * parseInt(2.5)));
    }
    else if (message.value) {
      console.log("calling toggleLight On");
      httpGet('http://192.168.100.210:3000/switch/2/on');
    }
    else if (!message.value) {
      console.log("calling toggleLight Off");
      httpGet('http://192.168.100.210:3000/switch/2/off');
    }
  }
  else if (message.type == "heat") {
    console.log("heat");
    if (message.value) {
      console.log("calling toggleHeat On");
      httpGet('http://192.168.100.210:3000/switch/1/on');
    }
    else if (!message.value) {
      console.log("calling toggleHeat Off");
      httpGet('http://192.168.100.210:3000/switch/1/off');
    }
  }
  else if (message.type == "headAngle") {
    console.log("calling headAngle");
    httpGet('http://192.168.100.210:3000/angle/' + 'A/'+ (message.headAngleValue));
  }
  else if (message.type == "feetAngle") {
    console.log("calling feetAngle");
    httpGet('http://192.168.100.210:3000/angle/' + 'B/'+ (message.feetAngleValue));
  }
  else if (message.type == "setAlarm") {
    console.log("calling setAlarm");
    if (message.time == 0) {
      //slett alarm
    }
    else {
      // Set alarm
    }
    // Peder fix set alarm
  }
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
