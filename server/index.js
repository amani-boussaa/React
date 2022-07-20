const express = require('express')
const cors = require('cors');
const EventSource = require('eventsource');
const { json } = require('stream/consumers');

const app = express()
var port = 4000;

app.use(express.json())
var corsOptions = {
  origin: `http://localhost:${port}`,
  optionsSuccessStatus: 200,
  credentials: true, // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

const SEND_INTERVAL = 2000;
//new ads

var array = [];
const writeEvent = (res, sseId) => {
  // res.write(`id: ${sseId}\n\n`);
  // res.write(`retry: 1000\n\n`);
  const donnee = {
    id: 0,
    temperature: 0,
    humidity: 0,
    readingId: 0,
    sent: 0
  };
  var source = new EventSource('http://192.168.100.21/events');
  source.addEventListener('new_readings', function (e) {

    var data = JSON.parse(e.data);
    const id = data.id;
    const temperature = data.temperature || 0;
    const humidity = data.humidity || 0;
    const readingId = data.readingId || 0;

    let new_data = null
    console.log("donnee.temperature", donnee.temperature, "temperature", temperature)
    if (donnee.temperature != temperature) {
      donnee.id = id
      donnee.temperature = temperature
      donnee.humidity = humidity
      donnee.readingId = readingId
      donnee.sent = id
      new_data = donnee
      // const sseId = new Date().toDateString();
      // res.write(`id: ${sseId}\n\n`);
    } else if (donnee.humidity != humidity) {
      donnee.id = id
      donnee.temperature = temperature
      donnee.humidity = humidity
      donnee.readingId = readingId
      donnee.sent = id
      new_data = donnee
    }
    if (new_data) {
      res.write(`data: ${JSON.stringify(new_data)}\n\n`);
    }

  })
};

const sendEvent = (_req, res) => {
  res.writeHead(200, {
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
  });
  const sseId = new Date().toDateString();
  writeEvent(res, sseId);
};

app.get('/sse', (req, res) => {
  if (req.headers.accept === 'text/event-stream') {
    sendEvent(req, res);
  } else {
    res.json({ new_readings: 'Ok' });
  }
});
app.get('/first_event', (req, res) => {
  try {
    res.send(donnee)

  } catch (err) {
    res.send(err);
  }

});
/********-*********************** */


app.listen(port, function () {
  console.log("app listening on port " + port);
});