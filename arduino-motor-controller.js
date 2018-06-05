var SerialPort = require('serialport');

var port = null;

function connectToMotorArduino(logger) {
  var newPort = new SerialPort('/dev/arduinoMotorControl', function (err) {
    if (err) {
      return logger.debug('Error: ', err.message);
    }
    else {
      logger.debug("connected to arduinoMotorControl");
      port = newPort;
    }
  });
}

function writeToMotorArduino(data, logger) {
  if (port != null) {
    port.write(data + "");
  }
}

module.exports = {
  connectToMotorArduino: connectToMotorArduino,
  writeToMotorArduino: writeToMotorArduino
}
