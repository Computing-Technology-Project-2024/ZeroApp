import React, { useState, useEffect } from 'react';

const SolarStreamData = () => {
  const [gridStatus, setGridStatus] = useState('');
  const [consumptionPower, setConsumptionPower] = useState('');
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the content of the Solar_Stream.txt file
        const response = await fetch(`${process.env.PUBLIC_URL}/Solar_Stream.txt`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.text(); // Read the file content as text
        const parsedData = JSON.parse(data); // Parse the text data to JSON

        // Access the required fields from the JSON
        const gridStatus = parsedData.data.data.grid_status;
        const consumptionPower = parsedData.data.data.consumption_power;

        // Set state to display data
        setGridStatus(gridStatus);
        setConsumptionPower(consumptionPower);
      } catch (err) {
        console.error('Error fetching or parsing Solar_Stream.txt:', err);
        setError('Failed to load data'); // Set an error state
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Solar Stream Data</h3>
      <p><strong>Grid Status:</strong> {gridStatus}</p>
      <p><strong>Consumption Power:</strong> {consumptionPower} kW</p>
    </div>
  );
};

export default SolarStreamData;
