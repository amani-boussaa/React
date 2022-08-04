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
      text: 'Temperture Line Chart',
    }
  },
}


const serverBaseURL = "http://localhost:4000";
export function ReactChart() {
  const [chartData, setChartData] = useState({})
  const [listening, setListening] = useState(false)
  const [filter, setFilter] = useState({})
  // const [param, setParam] = useState({
  //   startDate: "",
  //   endtDate: "",
  //   date: ""
  // })
  const [param, setParam] = useState({})
  // const [filter, setFilter] = useState({
  //   params: {
  //     date: new Date().toJSON().slice(0, 10)
  //   }
  // })
  const [currentDate, setCurrentDate] = useState(new Date().toJSON().slice(0, 10));
  // const [startDate, setStartDate] = useState("");
  // const [endtDate, setEndDate] = useState("");
  const [state, setState] = useState({
    startDate: "",
    endtDate: "",
    date: ""
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
    console.log(evt.target.name == "startDate")
    if (evt.target.name == "date") {
      console.log("yes")
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
    // setState({
    //   ...state,
    //   [evt.target.name]: value
    // });
    setParam({
      ...param,
      [evt.target.name]: value
    })
    
    // setFilter({
    //   params: {
    //     param
    //   }
    // })
  }
  useEffect(() => {

    const sendGetRequest = async () => {
      try {
        console.log(param)
        const { data } = await Axios.get(`${serverBaseURL}/all_events`, { params: param });
        const arraydata = data.data
        var array_temp = arraydata.map((obj) => obj.temperature)
        var array_lab = arraydata.map((obj) => obj.createdAt)
        let new_arr = arraydata.map(
          obj => {
            var rObj = {};

            rObj["x"] = (obj.createdAt);
            // rObj["x"] = Date.parse(obj.createdAt);
            rObj["y"] = obj.temperature;
            return rObj;
          }
        )

        setChartData({
          datasets: [
            {
              fill: false,
              label: "Temperture in °C",
              data: new_arr,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
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
      <div>
        <label> filtrer par 1 date</label>
        {/* <input type="date" onChange={handleChange} defaultValue={currentDate} /> */}
        <input type="date" name="date" onChange={filterData} value={state.date} />
      </div>
      <div>
        <label> filtrer par 2 date</label>
        {/* <input type="date"  onChange={event => setStartDate(event.target.value)} defaultValue={currentDate} />
        <input type="date" onChange={event => setEndDate(event.target.value)} defaultValue={currentDate} /> */}
        <input type="datetime-local" name="startDate" value={state.startDate} onChange={filterData} />
        <input type="datetime-local" name="endtDate" value={state.endtDate} onChange={filterData} />

      </div>
      <Line options={options} data={chartData} />
    </>
  }
}
