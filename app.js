var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


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
});
