
import React, { useState, useEffect } from "react";
import './App.css';
import TimeAndLocation from './components/TimeAndLocation';
import TemperatureAndDetails from './components/TemperatureAndDetails';
import Forecast from './components/Forecast';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Axios from 'axios'
import Chart from "./components/Chart";


const serverBaseURL = "http://localhost:4000";
function App() {
  var date_ob = new Date();
  var hours = date_ob.getHours();
  var minutes = date_ob.getMinutes();
  const [listening, setListening] = useState(false);
  const [realTemperature, setRealTemperature] = useState('');
  const [facts, setFacts] = useState([]);
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [aray_temperature, setAray_temperature] = useState([]);

  function callApi() {
    Axios.get(`${serverBaseURL}/first_event`).then((res) => {
      setListening(true)
      const data1 = res.data;
      console.log("data from axios", data1)

      setRealTemperature(data1.temperature)
      setFacts((facts) => facts.concat(data1));
      setAray_temperature((aray_temperature) => aray_temperature.concat(data1.temperature));

      var fixed_temp = data1.temperature.toFixed(2)
      setTemperature(fixed_temp)
      setHumidity(data1.humidity)
      var date_ob = new Date();
      var hours = date_ob.getHours();
      var minutes = date_ob.getMinutes();
      var time = `${hours}:${minutes}`
      Object.assign(data1, { time: time })
      alert(data1.temperature, data1.humidity)

    }).catch(error => {
      console.log(error.message);
    });
  }
  useEffect(() => {
    // callApi()
    const source = new EventSource(`${serverBaseURL}/sse`);

    source.addEventListener('open', () => {
      console.log("open")
    });
    source.addEventListener('message', (e) => {
      const parsedData = JSON.parse(e.data);
      console.log("parsedData from event", parsedData)

      const data = JSON.parse(e.data);
      setRealTemperature(data.temperature)
      alert(data.temperature, data.humidity)
      setFacts((facts) => facts.concat(data));
      setAray_temperature((aray_temperature) => aray_temperature.concat(data.temperature));
      var fixed_temp = data.temperature.toFixed(2)
      setTemperature(fixed_temp)
      setHumidity(data.humidity)
      var date_ob = new Date();
      var hours = date_ob.getHours();
      var minutes = date_ob.getMinutes();
      var time = `${hours}:${minutes}`
      Object.assign(data, { time: time })
    });
    source.addEventListener('error', (e) => {
      console.log('Error: ', e);
      source.close();
    });
    return () => {
      source.close();
    };
  }, []);
  const formatBackground = () => {
    if (!listening) return "from-cyan-700 to-blue-700"
    const threshold = 20;
    if (realTemperature <= threshold) return "from-cyan-700 to-blue-700"
    return "from-yellow-700 to-orange-700"
  }
  const alert = (msg = "", humidity = "") => {
    toast.success('temperature = ' + msg + '° ' + ' humidity = ' + humidity + "%", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br  h-fit shadow-xl shadow-gray-400
    ${formatBackground()}`}
    >
      {/* <TopButtons />
      <Inputs /> */}

      <TimeAndLocation />
      <TemperatureAndDetails temperature={temperature} realTemperature={realTemperature} humidity={humidity} />
      <Forecast facts={facts} />
      <Chart facts={facts} aray_temperature={aray_temperature} />


      <ToastContainer autoClose={5000} theme="colored" newestOnTop={true} />

    </div>
  );
}

export default App;
