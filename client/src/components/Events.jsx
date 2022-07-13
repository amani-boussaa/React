import React, { useState, useEffect } from 'react';

function Events() {
  const [ facts, setFacts ] = useState([]);
  const [ listening, setListening ] = useState(false);

  useEffect( () => {
    if (!listening) {

      const events = new EventSource('http://192.168.100.21/events');

      events.addEventListener('new_readings',function (event){

        const parsedData = JSON.parse(event.data);

        setFacts((facts) => facts.concat(parsedData));
      });

      setListening(true);
    }
  }, [listening, facts]);

  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>temperature</th>
          <th>humidity</th>
        </tr>
      </thead>
      <tbody>
        {
          facts.map((fact, i) =>
            <tr key={i}>
              <td>{fact.temperature}</td>
              <td>{fact.humidity}</td>
            </tr>
          )
        }
      </tbody>
    </table>
  );
}

export default Events;