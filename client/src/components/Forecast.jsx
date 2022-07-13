import React, { useState, useEffect } from "react";
import { UilTemperaturePlus } from '@iconscout/react-unicons'
import { UilRaindropsAlt } from '@iconscout/react-unicons'
function Forecast() {
    const [facts, setFacts] = useState([]);
    const [listening, setListening] = useState(false);
    useEffect(() => {
       

            const events = new EventSource('http://192.168.100.21/events');

            events.addEventListener('new_readings', function (event) {
                var date_ob = new Date();
                var hours = date_ob.getHours();
                var minutes = date_ob.getMinutes();
                var seconds = date_ob.getSeconds();
                var time = `${hours}:${minutes}:${seconds}`
                let data = JSON.parse(event.data)
                Object.assign(data, { time: time })

                setFacts((facts) => facts.concat(data));

            });

            setListening(true);
        
    }, [facts]);
    return (
        <div>
            <div className="flex items-center justify-start mt-6">
                <p className="text-white font-medium uppercase">HOURLY Temperature</p>
            </div>
            <hr className="my-2" />

            <div className="flex flex-row items-center justify-between text-white overflow-x-scroll">


                {facts.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col  w-1/4 items-center justify-center mr-7"
                    >
                        <p className="font-light text-sm">{item.time}</p>
                        <UilTemperaturePlus />
                        <p className="font-medium">{`${item.temperature.toFixed()}°`}</p>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-start mt-6">
                <p className="text-white font-medium uppercase">HOURLY HUMIDITY</p>
            </div>
            <hr className="my-2" />
            <div className="flex flex-row items-center justify-between text-white overflow-x-scroll">


                {facts.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col w-1/4 items-center justify-center mr-7 "
                    >
                        <p className="font-light text-sm">{item.time}</p>
                        <UilRaindropsAlt />
                        <p className="font-medium">{`${item.humidity.toFixed()}%`}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Forecast;