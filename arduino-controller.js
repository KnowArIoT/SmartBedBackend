const SerialPort = require('serialport');

const { Readline } = SerialPort.parsers;

let arduinoMotorPortConnected = false;
let arduinoSensorPortConnected = false; // eslint-disable-line

let socket = null;

const arduinoMotorPort = new SerialPort('/dev/arduinoMotorControl', {
  baudRate: 9600,
});
const arduinoSensorPort = new SerialPort('/dev/arduinoSensorControl', {
  baudRate: 9600,
});

arduinoMotorPort.on('open', () => {
  arduinoMotorPortConnected = true;
});
arduinoSensorPort.on('open', () => {
  arduinoSensorPortConnected = true;
});

function writeToMotorArduino(data) {
  if (arduinoMotorPortConnected) {
    arduinoMotorPort.write(`${data}`);
  }
}

function setSocket(newSocket) {
  socket = newSocket;
}

const parser = new Readline();
arduinoSensorPort.pipe(parser);
parser.on('data', data => {
  if (socket != null && data != null) {
    data.slice(0, -2);
    // const sensorData = data.split(',');
    // socket.emit('message', {type: "sensorData", pressure: sensorData[0], light: sensorData[1], flex: sensorData[2], temperature: sensorData[3], humidity: sensorData[4]});
  }
});

module.exports = {
  writeToMotorArduino,
  setSocket,
};
