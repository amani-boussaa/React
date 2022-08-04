
import React, { useState, useEffect } from "react";
import './App.css';
import TimeAndLocation from './components/TimeAndLocation';
import TemperatureAndDetails from './components/TemperatureAndDetails';
import Forecast from './components/Forecast';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Axios from 'axios'
import Chart from "./components/Chart";
import ErrorBoundary from './components/ErrorBoundary'
import { ReactChart } from './components/ReactChart.tsx';


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
  const [chartData, setChartData] = useState({})



  useEffect(() => {
    fetchPrices()

    const source = new EventSource(`${serverBaseURL}/sse`);

    source.addEventListener('open', () => {
    });
    source.addEventListener('message', (e) => {
      const parsedData = JSON.parse(e.data);
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
      source.close();
    });
    return () => {
      source.close();
    };

  }, []);
  const formatBackground = () => {
    if (!realTemperature) return "from-cyan-700 to-blue-700"
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
  const fetchPrices = async () => {
    const res = await fetch(`${serverBaseURL}/all_events`)
    const data = await res.json()
    let arraydata = data.data
    setChartData({
      labels: arraydata.map((crypto) => crypto.createdAt),
      datasets: [
        {
          label: "Temperture in °C",
          data: arraydata.map((crypto) => crypto.temperature),
          backgroundColor: [
            "#ffbb11",
            "#ecf0f1",
            "#50AF95",
            "#f3ba2f",
            "#2a71d0"
          ]
        }
      ]
    });
  };
  return (
    <div>
      <div className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br  h-fit shadow-xl shadow-gray-400
     ${formatBackground()}`}
      >
        {/* <TopButtons />
      <Inputs /> */}

        <TimeAndLocation />


        <TemperatureAndDetails temperature={temperature} realTemperature={realTemperature} humidity={humidity} />

        <Forecast facts={facts} />
        {/* <Chart facts={facts} aray_temperature={aray_temperature} /> */}
        <ToastContainer autoClose={5000} theme="colored" newestOnTop={true} />

        {/* <ErrorBoundary> */}
        {/* </ErrorBoundary> */}

      </div>
      <div className='mx-auto  mt-4 py-5 px-32 bg-gradient-to-br  h-fit shadow-xl shadow-gray-400'>
        <ReactChart chartData={chartData} />
      </div>
    </div>
  );
}

export default App;
