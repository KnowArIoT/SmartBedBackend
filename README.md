app.js må kjøres med "node app.js" på serveren på google cloud.
App_client må kjøres på Raspberry pien på sengen med "node app_client.js"

App.js starter en socket server og en resttjeneste. Denne må kjøres før klienten på PIen. Når pien starter opp registerer den seg som en klient på serveren, og kommunikasjon mellom serveren og PIen kan skje sømløst frem og tilbake uten netverkskonfigurering her på hotellet eller noe.

Gangen nå er at appen kaller på serveren på GC, så emitter serveren en medling til senge-klienten. denne kaller så på en resttjeneste som også kjører der for å skru av og på lys osv.
