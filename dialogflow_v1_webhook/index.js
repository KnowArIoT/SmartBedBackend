
const fetch = require("node-fetch");


function fetchData(url, res, req) {
  fetch(url)
    .then((fetchResponse) => {
      if (fetchResponse.ok) {
        return fetchResponse.json()
      }
      throw new Error('Uventet feil');
    })
    .then((responseJson) => {
      console.log(responseJson);
      response = JSON.stringify(req.body.result.fulfillment.speech);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ "speech": response, "displayText": JSON.stringify(req.body.result.metadata.intentName) }));
      return null;
    })
    .catch((error) => {
      console.log(error);
    });
}


/*
* HTTP Cloud Function.
*
* @param {Object} req Cloud Function request context.
* @param {Object} res Cloud Function response context.
*/
exports.smartbedcontrol = function smartbedcontrol (req, res) {
  var baseUrl = "http://178.62.248.31:8080";
  var url = "";
  console.log(req.body);
  switch (req.body.result.metadata.intentName) {
    case "Turn light on":
      url = "/toggleLightOn";
      break;
    case "Turn light off":
      url = "/toggleLightOff";
      break;
    case "Turn ceiling light on":
      url = "/toggleCeilingLightOn";
      break;
    case "Turn ceiling light off":
      url = "/toggleCeilingLightOff";
      break;
    case "Turn bed on":
      url = "/toggleBedOn";
      break;
    case "Turn bed off":
      url = "/toggleBedOff";
      break;
    case "Turn heat right on":
      url = "/toggleHeatRightOn";
      break;
    case "Turn heat right off":
      url = "/toggleHeatRightOff";
      break;
    case "Turn heat left on":
      url = "/toggleHeatLeftOn";
      break;
    case "Turn heat left off":
      url = "/toggleHeatLeftOff";
      break;
    case "Turn sleep machine on":
      url = "/toggleSleepMachineOn";
      break;
    case "Turn sleep machine off":
      url = "/toggleSleepMachineOff";
      break;
    case "Turn speaker on":
      url = "/toggleSpeakerOn";
      break;
    case "Turn speaker off":
      url = "/toggleSpeakerOff";
      break;
    case "Go to sleep":
      url = "/sleep";
      break;
    case "Wake up":
      url = "/wakeup";
      break;
    case "Turn ledstrips on":
      url = "/toggleLedstripsOn";
      break;
    case "Turn ledstrips off":
      url = "/toggleLedstripsOff";
      break;
    default:
      return;
  }
  fetchData(baseUrl + url, res, req);
};
