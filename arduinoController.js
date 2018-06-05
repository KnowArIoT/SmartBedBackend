var SerialPort = require('serialport');

var port = null;

function connectToMotorArduino(logger) {
  var newPort = new SerialPort('/dev/MotorArduino', function (err) {
    if (err) {
      return logger.debug('Error: ', err.message);
    }
    else {
      port = newPort;
    }
  });
}

function writeToMotorArduino(data) {
  if (port != null) {
    port.write(data);
  }
}
