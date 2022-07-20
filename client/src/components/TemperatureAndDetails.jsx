import React, { useState, useEffect } from 'react'
import {
    UilTemperature,
    UilTear,
    UilWind,
    UilSun,
    UilSunset,
} from "@iconscout/react-unicons";
function TemperatureAndDetails(props) {
   
    return (
        <div>
            <div className='flex items-center justify-between text-white py-3'>
                <UilTemperature size={70} />
                <p className='text-5xl'>{props.temperature}°</p>
                <div className='flex flex-col space-y-2'>
                    <div className='flex font-light text-sm items-center justify-center'>
                        <UilTemperature size={18} className="mr-1" />
                        Real fell:
                        <span className='font-medium ml-1'>{props.realTemperature}°</span>
                    </div>
                    <div className='flex font-light text-sm items-center justify-center'>
                        <UilTear size={18} className="mr-1" />
                        Humidity:
                        <span className='font-medium ml-1'>{props.humidity}%</span>
                    </div>

                </div>
            </div>
            
        </div>
    )
}

export default TemperatureAndDetails