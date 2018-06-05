var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline

arduinoMotorPortConnected = false;
arduinoSensorPortConnected = false;

var socket = null;

var arduinoMotorPort = new SerialPort('/dev/arduinoMotorControl', {
  baudRate: 9600
});
var arduinoSensorPort = new SerialPort('/dev/arduinoSensorControl', {
  baudRate: 9600
});

arduinoMotorPort.on('open', function () {
  arduinoMotorPortConnected = true;
});
arduinoSensorPort.on('open', function () {
  arduinoSensorPortConnected = true;
});

function writeToMotorArduino(data, logger) {
  if (arduinoMotorPortConnected) {
    arduinoMotorPort.write(data + "");
  }
}

function setSocket(newSocket) {
  socket = newSocket;
}

var parser = new Readline()
arduinoSensorPort.pipe(parser)
parser.on('data', function (data) {
  if (socket != null && data != null) {
    data = data.slice(0, -2);
    var sensorData = data.split(',');
    // socket.emit('message', {type: "sensorData", pressure: sensorData[0], light: sensorData[1], flex: sensorData[2], temperature: sensorData[3], humidity: sensorData[4]});
  }
})

module.exports = {
  writeToMotorArduino: writeToMotorArduino,
  setSocket: setSocket
}
