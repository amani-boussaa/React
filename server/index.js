const express = require('express')
const cors = require('cors');
const EventSource = require('eventsource');
const mongoose = require('mongoose');
const EventModel = require('./models/Event');

const date_fns = require("date-fns")


const utils = require('./lib/utils');

const app = express()
var port = 4000;

app.use(express.json())
var corsOptions = {
  origin: `http://localhost:${port}`,
  optionsSuccessStatus: 200,
  credentials: true, // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

mongoose.connect("mongodb+srv://new_user1:Q5tpeVkJOE6uOnp4@temperature.m6nm25j.mongodb.net/mydatabase?retryWrites=true&w=majority", {
  useNewUrlParser: true,
})

const writeEvent = (res, sseId) => {

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
    addEvent(data)
    const id = data.id;
    const temperature = data.temperature || 0;
    const humidity = data.humidity || 0;
    const readingId = data.readingId || 0;

    let new_data = null
    // console.log("donnee.temperature", donnee.temperature, "temperature", temperature)
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
// app.get('/all_events', (req, res) => {
//   EventModel.find({}, (err, result) => {
//     if (err) {
//       res.send(err)
//     }
//     res.send(result)
//   })

// });
app.get('/all_events', async (req, res) => {
  try {
    const body = req.query;
    console.log("body", body)
    const { startDate, endtDate, date } = body;
    var query = {}
    //ONLY DATE
    if (typeof req.query.date !== 'undefined' && req.query.date != "") {
      console.log("date  yes")
      query = {
        createdAt: {
          $gte: date_fns.startOfDay(new Date(date)),
          $lt: date_fns.endOfDay(new Date(date)),
        }
      }
    } else {
      // START DATE AND END DATE
      if (typeof body.startDate !== 'undefined' && typeof body.endtDate !== 'undefined' && body.startDate !== '' && body.endtDate !== '') {
        console.log("yess")
        query = {
          createdAt: {
            // $gte: date_fns.startOfDay(new Date(startDate)),
            // $lt: date_fns.endOfDay(new Date(endtDate)),
            $gte: (new Date(startDate)),
            $lt: (new Date(endtDate)),
          }
        }
      }
    }


    const data = await EventModel.find(query);

    res.status(200).send({
      data,

    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
const addEvent = async (data) => {
  // app.get("/", async (req, res) => {
  const id = data.id;
  const temperature = data.temperature;
  const humidity = data.humidity;
  const readingId = data.readingId;
  const event = new EventModel({ id: id, temperature: temperature, humidity: humidity, readingId: readingId });
  try {
    await event.save();
    // console.log("inserted data")
  } catch (error) {
    console.log(err)
  }
};

app.listen(port, function () {
  console.log("app listening on port " + port);
});

app.post('/search', async (req, res, next) => {
  const body = req.body;

  if (typeof body.year === 'undefined' || typeof body.month === 'undefined' || typeof body.day === 'undefined') {
    return res.json({
      error: 'Missing required parameters.'
    });
  }

  const { year, month, day } = body;


  if (!utils.validYear(year)) {
    return res.json({
      error: 'Invalid year parameter.'
    });
  }

  if (!utils.validValue(month, 'month')) {
    return res.json({
      error: 'Invalid month parameter.'
    });
  }

  if (!utils.validValue(day, 'day')) {
    return res.json({
      error: 'Invalid day parameter.'
    });
  }

  const dateStart = new Date();

  dateStart.setUTCFullYear(parseInt(year, 10));
  dateStart.setUTCMonth(parseInt(month, 10));
  dateStart.setUTCDate(parseInt(day, 10));

  dateStart.setUTCHours(0, 0, 0);

  const dateMax = new Date();

  dateMax.setUTCFullYear(parseInt(year, 10));
  dateMax.setUTCMonth(parseInt(month, 10));
  dateMax.setUTCDate(parseInt(day, 10));
  dateMax.setUTCHours(23, 59, 59);

  try {
    const query = {
      date: {
        $gte: dateStart, $lte: dateMax
      }
    };
    console.log(query)
    const results = await EventModel.find(query);
    res.json(results);
  } catch (err) {
    res.json(err);
  }
});