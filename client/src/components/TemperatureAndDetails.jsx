import React, { useState, useEffect } from 'react'
import {
    UilTemperature,
    UilTear,
    UilWind,
    UilSun,
    UilSunset,
} from "@iconscout/react-unicons";
function TemperatureAndDetails() {
    const [facts, setFacts] = useState([]);
    const [listening, setListening] = useState(false);
    const [temperature, setTemperature] = useState('');
    const [realTemperature, setRealTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        if (!listening) {

            const events = new EventSource('http://192.168.100.21/events');

            events.addEventListener('new_readings', function (event) {

                const parsedData = JSON.parse(event.data);
                setFacts((facts) => facts.concat(parsedData));
                var humidity = parsedData.humidity
                var real_temperature = parsedData.temperature
                var fixed_temp = real_temperature.toFixed(2)
                setTemperature(fixed_temp)
                setRealTemperature(real_temperature)
                setHumidity(humidity)
                var date_ob = new Date();
                var hours = date_ob.getHours();
                var minutes = date_ob.getMinutes();
                var time = `${hours}:${minutes}`
                setTime(time)
            });

            setListening(true);

        }
    }, [listening, facts]);
    return (
        <div>
            <div className='flex items-center justify-center py-6 text-xl text-cyan-300'>
                {/* <p>Cloudy</p> */}
            </div>
            <div className='flex items-center justify-between text-white py-3'>
                <UilTemperature size={70} />
                <p className='text-5xl'>{temperature}°</p>
                <div className='flex flex-col space-y-2'>
                    <div className='flex font-light text-sm items-center justify-center'>
                        <UilTemperature size={18} className="mr-1" />
                        Real fell:
                        <span className='font-medium ml-1'>{realTemperature}°</span>
                    </div>
                    <div className='flex font-light text-sm items-center justify-center'>
                        <UilTear size={18} className="mr-1" />
                        Humidity:
                        <span className='font-medium ml-1'>{humidity}%</span>
                    </div>

                </div>
            </div>
            <div className='flex flex-row justify-center items-center space-x-2 text-white text-sm py-3'>
                <UilSunset />
                <p className='font-light'>
                    Time: <span className='font-medium ml-1'>{time}</span>
                </p>
            </div>
        </div>
    )
}

export default TemperatureAndDetails