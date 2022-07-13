import React, { useState, useEffect } from 'react'

function TimeAndLocation() {
    const [now, setNow] = useState('');
    const [time, setTime] = useState('');
    useEffect(() => {
    let now = new Date().toLocaleDateString('en-us', { weekday:"long", month:"long", day:"numeric", year:"numeric"});
    let time = new Date().toLocaleDateString('en-us', { hour:"numeric",minute:"numeric"});
    setNow(now)
    setTime(time)
    });
        return (
        <div>
            <div className='flex items-center justify-center my-6'>
                <div className='text-white text-xl font extralight'>
                    <p>
                        {now} | {time}
                    </p>
                    <div className='flex items-center justify-center my-3'>
                        <p className='text-white text-3xl font-medium'>
                            
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TimeAndLocation