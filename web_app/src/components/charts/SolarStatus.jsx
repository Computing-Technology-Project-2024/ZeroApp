import React, { useState, useEffect } from 'react';

const SolarStreamData = () => {
  const [gridStatus, setGridStatus] = useState('');
  const [consumptionPower, setConsumptionPower] = useState('');

  useEffect(() => {
    // Fetch the content of the Solar_Stream.txt file
    fetch(`${process.env.PUBLIC_URL}/Solar_Stream.txt`)
      .then(response => response.text()) // Read the file content as text
      .then(data => {
        // Parse the text data to JSON
        const parsedData = JSON.parse(data);
        
        // Access the required fields from the JSON
        const gridStatus = parsedData.data.data.grid_status;
        const consumptionPower = parsedData.data.data.consumption_power;

        // Set state to display data
        setGridStatus(gridStatus);
        setConsumptionPower(consumptionPower);
      })
      .catch(error => {
        console.error('Error fetching or parsing Solar_Stream.txt:', error);
      });
  }, []);

  return (
    <div>
      <h3>Solar Stream Data</h3>
      <p><strong>Grid Status:</strong> {gridStatus}</p>
      <p><strong>Consumption Power:</strong> {consumptionPower} kW</p>
    </div>
  );
};

export default SolarStreamData;
