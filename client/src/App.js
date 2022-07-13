
import React, { useState, useEffect } from "react";
import './App.css';
import UilReact from '@iconscout/react-unicons/icons/uil-react'
import TopButtons from './components/TopButtons';
import Inputs from './components/Inputs';
import TimeAndLocation from './components/TimeAndLocation';
import TemperatureAndDetails from './components/TemperatureAndDetails';
import Events from './components/Events';
import Forecast from './components/Forecast';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [listening, setListening] = useState(false);
  const [realTemperature, setRealTemperature] = useState('');

  useEffect(() => {
    if (!listening) {

      const events = new EventSource('http://192.168.100.21/events');

      events.addEventListener('new_readings', function (event) {
        const parsedData = JSON.parse(event.data);
        var real_temperature = parsedData.temperature
        setRealTemperature(real_temperature)
        toast.success('Successful temperature recovery!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      });

      setListening(true);


    }
  }, [listening]);
  const formatBackground = () => {
    if (!listening) return "from-cyan-700 to-blue-700"
    const threshold = 20;
    if (realTemperature <= threshold) return "from-cyan-700 to-blue-700"
    return "from-yellow-700 to-orange-700"
  }

  return (
    <div className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br  h-fit shadow-xl shadow-gray-400
    ${formatBackground()}`}>
      {/* <TopButtons />
      <Inputs /> */}
      <TimeAndLocation />
      <TemperatureAndDetails />
      <Forecast />
      

      <ToastContainer autoClose={5000} theme="colored" newestOnTop={true} />

    </div>
  );
}

export default App;
