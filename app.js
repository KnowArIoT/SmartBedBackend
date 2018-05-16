var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const fetch = require('node-fetch')



app.get('/', function(req, res){
  res.send("KnowIot backend service is running!");
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
