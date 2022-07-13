const express = require('express')
const cors = require('cors');
const EventSource = require('eventsource');

const app = express()
var port = 4000;

app.use(express.json())
var corsOptions = {
  origin: `http://localhost:${port}`,
  optionsSuccessStatus: 200,
  credentials: true, // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

app.listen(port, function () {
  console.log("app listening on port " + port);
});


app.get('/events', function (req, res) {
  var source = new EventSource('http://192.168.100.21/events');
  source.addEventListener('new_readings',function (e) {
    console.log(e.data)
   
  });
  
});
