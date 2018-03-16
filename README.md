app.js må kjøres med "node app.js" på serveren på google cloud.
App_client må kjøres på Raspberry pien på sengen med "node app_client.js"

app.js is ran with the command "node app.js" on the
Google cloud server.
app_client is running on the Raspberry pi. It is started with the command: "node app_client.js"

app.js is starting a socket server and a rest service. This have to run before the client server is started in order to connect. The PI is registering as a client to a socket ran on the GC server. This way we do not have to configure the network with port forwarding as that is a pain in the ass when we do not own the router.
The PI and the GC server can now communicate seamlessly.

In addition to the socket communication both services are running a rest service in order to communicate with different modules both running on the PI and the GC server.

Our native app is calling the GC server, this server is communication the request to the PI via the socket setup. Then the PI calls a rest service that controls the power outlets.

We also have an arduino connected to 5 sensors. This arduino is runnning the program sensor_gathering.ino in order to collect data and writing it to the serial port. This port is being listened to by the python script read_arduino_serial.py and sent to the app_client server. This server is then sending it via the socket to the GC server which registers it in the database. The data is available to the dashboard in the app from another endpoint in app.js
