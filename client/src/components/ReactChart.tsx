import React, { useState, useEffect } from "react";
import Axios from 'axios'

import {
  Chart as ChartJS,

  registerables,

} from 'chart.js';
import { Line } from 'react-chartjs-2';
import faker from "faker";
import 'chartjs-adapter-date-fns';
import { enGB } from 'date-fns/locale';
import { Bar } from 'react-chartjs-2';

//this sets the display language. In the documentation it uses "de", which will display dates in German.
ChartJS.register(...registerables);


export const options = {
  maintainAspectRatio:false,
  scales: {
    x: {
      type: 'time',
      time: {
        displayFormats: {
          quarter: 'MMM YYYY'
        }
      }
    }
  },
  // scales: {
  //   x: {
  //     type: 'time',
  //     position: 'bottom',
  //     time: {
  //       displayFormats: {
  //         'day': 'MM/yy'
  //       },
  //       tooltipFormat: 'DD/MM/YY',
  //       unit: 'day',
  //     },

  //   }
  // },
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Temperature and humidity Line Chart',
    }
  },
}


const serverBaseURL = "http://localhost:4000";
export function ReactChart() {
  const [chartData, setChartData] = useState({})
  const [listening, setListening] = useState(false)
  const [filter, setFilter] = useState({})
  const [currentDate, setCurrentDate] = useState(new Date().toJSON().slice(0, 10));
  const [param, setParam] = useState({ date: currentDate })
  const [state, setState] = useState({
    startDate: "",
    endtDate: "",
    date: currentDate
  })
  function handleChange(event) {
    setFilter({
      params: {
        date: event.target.value
      }
    })
  }
  function filterData(evt) {
    const value = evt.target.value;
    if (evt.target.name == "date") {
      setState({
        startDate: "",
        endtDate: "",
        date: value
      })
      setParam({
        date: value
      })
    } else if (evt.target.name == "startDate" || evt.target.name == "endtDate") {
      setState({
        ...state,
        date: "",
        [evt.target.name]: value
      });
      setParam({
        ...param,
        date: "",
        [evt.target.name]: value
      });
    }
  }
  useEffect(() => {

    const sendGetRequest = async () => {
      try {
        const { data } = await Axios.get(`${serverBaseURL}/all_events`, { params: param });
        const arraydata = data.data
        var array_temp = arraydata.map((obj) => obj.temperature)
        var array_lab = arraydata.map((obj) => obj.createdAt)
        let new_arr = arraydata.map(
          obj => {
            var rObj = {};
            rObj["x"] = (obj.createdAt);
            rObj["y"] = obj.temperature;
            return rObj;
          }
        )
        //humidity
        let new_arr2 = arraydata.map(
          obj2 => {
            var rObj2 = {};
            rObj2["x"] = (obj2.createdAt);
            rObj2["y"] = obj2.humidity;
            return rObj2;
          }
        )
        setChartData({
          datasets: [
            {
              fill: false,
              label: "Temperature in °C",
              data: new_arr,
              borderColor: 'green',
              tension: 0.1
            },
            {
              fill: false,
              label: "Humidity in %",
              data: new_arr2,
              borderColor: 'rgb(20, 192, 192)',
              tension: 0.1
            },
          ]
        });
        if (chartData) {
          setListening(true)
        }


      } catch (err) {
        console.error(err);
      }
    };
    sendGetRequest();
  }, [listening, param])

  if (listening) {
    return <>
      <div className="mx-auto">
        <div className="flex items-center justify-center">
          <div className="max-w-7xl mx-auto  sm:px-6 lg:px-8  pt-6 " >
            <div className="mt-10 sm:mt-0">
              <div className="md:grid md:gap-6">
                <div className="mt-5 md:mt-0 md:col-span-2">

                  <div className="shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-4">
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Filter by one date
                          </label>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Date
                          </label>

                          <input type="date" name="date" id="date" onChange={filterData} value={state.date} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />

                        </div>
                       
                        <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Filter by two dates
                          </label>
                          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            start Date
                          </label>

                          <input type="datetime-local" id="startDate" name="startDate" onChange={filterData} value={state.startDate} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />

                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <br></br>
                          <label htmlFor="endtDate" className="block text-sm font-medium text-gray-700">
                            End Date
                          </label>

                          <input type="datetime-local" name="endtDate" onChange={filterData} value={state.endtDate} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mx-auto  mt-4  px-10 bg-gradient-to-br  h-fit shadow-xl pb-5 shadow-gray-400' id="canvas-container">
      <Line options={options} data={chartData} />
      </div>
    </>
  }
}
