
var app = require('express')();
var server = require('http').Server(app);
var http = require('http')
var xmlHttpRequest = require("xmlhttprequest");
const fetch = require('node-fetch')

var io = require('socket.io-client'),
socket = io.connect('http://35.187.83.210/');

app.get('/', function(req, res){
  console.log("i am client /");
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
