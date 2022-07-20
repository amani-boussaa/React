import React, { useState, useEffect } from "react";
import { UilTemperaturePlus } from '@iconscout/react-unicons'
import { UilRaindropsAlt } from '@iconscout/react-unicons'
function Forecast(props) {
    return (
        <div>
            <div className="flex items-center justify-start mt-6">
                <p className="text-white font-medium uppercase">HOURLY Temperature</p>
            </div>
            <hr className="my-2" />

            <div className="flex flex-row items-center justify-between text-white overflow-x-scroll">


                {props.facts.map((item, index) => (
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


                {props.facts.map((item, index) => (
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