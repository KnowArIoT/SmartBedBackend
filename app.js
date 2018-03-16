var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const fetch = require('node-fetch')


app.get('/', function(req, res){
  console.log("calling root /");
});



http.listen(8080, function(){
  console.log('listening on *:8080');
});

io.sockets.on('connection', function (socket) {
    console.log('A client is connected!');
    socket.emit('message', 'You are connected!');
    // When the server receives a “message” type signal from the client
    socket.on('message', function (message) {
        console.log('A client is speaking to me! They’re saying: ' + message);

        if (message.type == "sensorData") {
          console.log("received Sensor data " + JSON.stringify(message));
          httpPost('http://localhost/sensorData/insertValues', JSON.stringify({
        bed_id: "ariot_seng",
        data: [
          {
              name: "pressure",
              value: message.pressure
          },
          {
              "name": "light",
              "value": message.light
          },
          {
              "name": "flex",
              "value": message.flex
          },
          {
              "name": "temperature",
              "value": message.temperature
          },
          {
              name: "humidity",
              value: message.humidity
          }
        ]
        });
        }
    });

    app.get('/toggleLightOn', function(req, res){
      console.log("calling toggleLightOn");
      socket.emit('message', {type: "light", value: true});
    });

    app.get('/toggleLightOff', function(req, res){
      console.log("calling toggleLightOff");
      socket.emit('message', {type: "light", value: false});
    });

    app.get('/dimLight/:dimValue', function(req, res){
      console.log("calling dimLight");
      var dimValue = req.params.dimValue
      socket.emit('message', {type: "light", dimValue: dimValue});
    });

    app.get('/toggleHeatOn', function(req, res){
      console.log("calling toggleHeatOn");
      socket.emit('message', {type: "heat", value: true});
    });

    app.get('/toggleHeatOff', function(req, res){
      console.log("calling toggleHeatOff");
      socket.emit('message', {type: "heat", value: false});
    });

    app.get('/setHeadAngle/:value', function(req, res){
      console.log("calling setHeadAngle");
      var value = req.params.value;
      socket.emit('message', {type: "headAngle", headAngleValue: value});
    });

    app.get('/setFeetAngle/:value', function(req, res){
      console.log("calling setFeetAngle");
      var value = req.params.value;
      socket.emit('message', {type: "feetAngle", feetAngleValue: value});
    });

    app.get('/setAlarm/:time', function(req, res){
      console.log("calling setAlarm");
      var time = req.params.time;
      socket.emit('message', {type: "setAlarm", time: time});
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
    });
}

function httpPost(url, data)
{
  fetch(url, {
    body: data,
    method: 'POST'
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      console.log(myJson);
    });
}
