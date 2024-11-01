import React, { useState, useEffect, useCallback } from 'react';
import DashboardCard from '../components/cards/DashboardCard';
import { AreaChart, Area, XAxis, YAxis, Label, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ----------------------------------------------------------
//The idea is to implement a toggle button for Admin-User mode for testing purpose first.
//Basically, if Admin, fetch all data to display a list of address and able to change address in Analytics.
//If User, then show the previous display that Kim did.

const Dashboard = () => {
  const [addresses, setAddresses] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Define fetchAddresses as a useCallback hook to prevent it from being re-created on every render.
  const fetchAddresses = useCallback(async () => {
    try {
      const response = await fetch(
          `https://api.edgeapi-v1.com/swinburn/sites`,
          {
            method: 'GET',
            headers: { 'x-api-key': 'JjsFazxTPd7GVoPYGdEI34HrudDZHq695FqKKnmU' },
          }
      );

      const data = await response.json();
      setAddresses(data);
      setAddressList(data); // Pass addresses to App.js via setAddressList
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  }, [setAddressList]);

  // Fetch addresses in admin mode
  useEffect(() => {
    if (isAdminMode) {
      void fetchAddresses();
    }
  }, [isAdminMode, fetchAddresses]);

  // useStates
  const [fetchedConsumptionData, setFetchedConsumptionData] = useState(null);
  const [fetchedDataDevices, setFetchedDataDevices] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [processedData, setProcessedData] = useState(null);
  const [finalTotals, setFinalTotals] = useState({ totalCost: 0, totalConsumptionkWh: 0 });

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const midnightTimestamp = Math.floor(midnight.getTime() / 1000);

  //API call to get data from midnight to current time:
  useEffect(() => {
    if (currentTimestamp && midnightTimestamp && !fetchedConsumptionData) {
      const apiUrl = `https://api.edgeapi-v1.com/swinburn/getloaddata/interval/2385?starttime=${midnightTimestamp}&endtime=${currentTimestamp}`;
      const apiKey = 'JjsFazxTPd7GVoPYGdEI34HrudDZHq695FqKKnmU';

      fetch(apiUrl, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
        },
      })
          .then((response) => response.json())
          .then((data) => {
            setFetchedConsumptionData(data); // Save API response data to state
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
    }
  }, [currentTimestamp, midnightTimestamp, fetchedConsumptionData]);

  useEffect(() => {
    const apiUrl = `https://api.edgeapi-v1.com/swinburn/devices`;
    const apiKey = 'JjsFazxTPd7GVoPYGdEI34HrudDZHq695FqKKnmU';

    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    })
        .then((response) => response.json())
        .then((data) => {
          setFetchedDataDevices(data); // Save API response data to state
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
  }, []);

  //function to process devices data for table
  const prepareDevicesData = (fetchedDataDevices) => {
    if (!fetchedDataDevices) return [];

    return fetchedDataDevices.map(device => ({
      deviceSerialId: device.device_serialid,
      installDate: new Date(device.install_date * 1000).toLocaleString(), // Convert timestamp to human-readable date
      latitude: device.lat,
      longitude: device.lng,
      siteAddress: device.site_address,
      siteType: device.site_type || 'N/A', // Provide a default if site_type is missing
    }));
  };

  const processedDevicesData = prepareDevicesData(fetchedDataDevices);

  // Helper function to convert a timestamp to a specific hour (group by hour)
  const getHourFromTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    return `${date.getHours().toString().padStart(2, '0')}:00`;  // Hour in HH:00 format
  };

  // Function to process consumption data for all devices and aggregate by hour
  const processTotalConsumptionData = (fetchedData) => {
    const hourlyData = {};

    // Iterate over each device in the fetchedData object
    Object.entries(fetchedData).forEach(([deviceName, deviceData]) => {
      // Loop through each data point of the device and group by hour
      deviceData.forEach((entry) => {
        const hour = getHourFromTimestamp(entry.timestamp);

        if (!hourlyData[hour]) {
          hourlyData[hour] = { totalWatt: 0, totalCost: 0 };  // Initialize hourly totals
        }

        // Ensure watt and cost are treated as numbers for summation
        hourlyData[hour].totalWatt += Number(entry.watt);
        hourlyData[hour].totalCost += Number(entry.cost);
      });
    });

    // Convert the hourly data to an array format suitable for the chart, rounding cost to 2 decimal places
    const processedData = Object.entries(hourlyData).map(([hour, totals]) => ({
      hour,                                  // The hour (time)
      totalWatt: totals.totalWatt,           // The sum of all devices' wattage for that hour
      totalCost: parseFloat(totals.totalCost.toFixed(2)),  // The sum of all devices' cost for that hour, rounded to 2 decimal places
    }));

    return processedData;
  };

  // Function to prepare the data for the chart
  const prepareChartData = (fetchedConsumptionData) => {
    if (!fetchedConsumptionData) return [];

    // Process the consumption data by aggregating total wattage and cost for each hour
    const processedData = processTotalConsumptionData(fetchedConsumptionData);

    return processedData;
  };

  // Function to calculate final total consumption and total cost
  const calculateFinalTotals = (processedData) => {
    const finalTotals = processedData.reduce(
      (acc, curr) => {
        acc.totalWatt += curr.totalWatt;
        acc.totalCost += curr.totalCost;
        return acc;
      },
      { totalWatt: 0, totalCost: 0 }
    );

    // Convert total watts to kWh (1 kWh = 1000 watts)
    const totalConsumptionkWh = finalTotals.totalWatt / 1000;

    return {
      totalCost: parseFloat(finalTotals.totalCost.toFixed(2)),  // Round total cost to 2 decimal places
      totalConsumptionkWh: totalConsumptionkWh,  // Round total consumption to 2 decimal places
    };
  };


  useEffect(() => {
    if (fetchedConsumptionData) {
      //update processed consumption data
      const processed = prepareChartData(fetchedConsumptionData);
      setProcessedData(processed);

      //calculate total watts and costs
      const totals = calculateFinalTotals(processed);
      setFinalTotals(totals);
    }
  }, [fetchedConsumptionData]);

  // Custom Tooltip to show total cost in the tooltip
  const CustomTooltip = ({ active, payload}) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip p-2 bg-white rounded shadow-lg">
          <p className="intro text-custom-purple">{`Total Watt: ${payload[0].value}W`}</p>
          <p className="desc text-custom-green">{`Total Cost: $${payload[0].payload.totalCost}`}</p> {/* Display total cost */}
        </div>
      );
    }

    return null;
  };


  //function to convert to normal time:
  function convertTimestampToNormalTime(timestamp) {
    const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds

    // You can format it manually if you want more control over the format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Return the formatted string
    return `${hours}:${minutes}, ${day}/${month}/${year} `;
  }

  const normalTime = convertTimestampToNormalTime(currentTimestamp);

  const itemsToShow = showMore ? processedDevicesData.length : 5; //default showing 5 records on the table

  //function to export table data to csv
  const exportToCSV = () => {
    const csvRows = [];
    const headers = ['Device Serial ID', 'Install Date', 'Latitude', 'Longitude', 'Site Address', 'Site Type'];
    csvRows.push(headers.join(','));

    processedDevicesData.forEach(device => {
      const row = [
        device.deviceSerialId,
        device.installDate,
        device.latitude,
        device.longitude,
        device.siteAddress,
        device.siteType,
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'devices_data.csv');
    a.click();
  };

  // Function to export chart data to CSV
  const exportChartDataToCSV = () => {
    const csvRows = [];
    const headers = ['Hour', 'Total Watt', 'Total Cost'];
    csvRows.push(headers.join(','));

    processedData.forEach((dataPoint) => {
      const row = [
        dataPoint.hour,
        dataPoint.totalWatt,
        dataPoint.totalCost,
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'chart_data.csv');
    a.click();
  };


  return (
    <div className=" bg-container-gray min-h-screen w-full overflow-hidden ">
      {/* i edit mx-auto up there hehe sr about that */}
      <h3 className="text-2xl font-bold mb-4 text-left">Dashboard</h3>

      {/* ---------TOGGLE BUTTON FOR USERMODE--------- */}
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
        onClick={() => setIsAdminMode(!isAdminMode)}
      >
        {isAdminMode ? 'Switch to User Mode' : 'Switch to Admin Mode'}
      </button>

      {isAdminMode ? (
        // Admin Mode: Show address list
        <div>
          <h4 className="text-xl font-semibold mb-4">Addresses</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Count</th>
                  <th className="py-3 px-6 text-left">Site ID</th>
                  <th className="py-3 px-6 text-left">Address</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {addresses.map((address, index) => (
                  <tr key={address.site_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                    <td className="py-3 px-6 text-left">{index + 1}</td>
                    <td className="py-3 px-6 text-left">{address.site_id}</td>
                    <td className="py-3 px-6 text-left">{address.site_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        //------------USER MODE------------------
        <div>
          {/* Dashboard Header */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <DashboardCard
              title="Power Imported From Grid"
              value="2.5kWh"
              statusText="↑ 8.5% Up from yesterday"
              statusColor="green"
              statusIcon="🔋"
            />
            <DashboardCard
              title="Power Exported From Grid"
              value="2.5 kWh"
              statusText="↓ 4.3% Down from yesterday"
              statusColor="red"
              statusIcon="⏳"
            />
            <DashboardCard
              title="Total Consumption"
              value={`${finalTotals.totalConsumptionkWh} kW`}
              statusText="↑ 8.5% Up from yesterday"
              statusColor="green"
              statusIcon="⚡"
            />
            <DashboardCard
              title="Total Consumption Cost"
              value={`$${finalTotals.totalCost}`}
              statusText="↑ 8.5% Up from yesterday"
              statusColor="green"
              statusIcon="💰"
            />
          </div>

          {/* Consumption Chart */}
          <div className="p-6 bg-white rounded-lg shadow-md mb-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold mb-1">Today's Hourly Consumption Summary</h2>
              <button
                onClick={exportChartDataToCSV}
                className="px-4 py-2 bg-custom-green text-white rounded hover:bg-custom-green-dark transition-colors duration-300"
              >
                Export to CSV
              </button>
            </div>
            <h3 className="text-s font-light mt-1">*Total consumption and associated cost of all devices</h3>

            {/* Responsive container for the chart */}
            <div className="h-80 w-full bg-gray-100 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={processedData}  // Use the processed data for the chart
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorWatt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#35AA3F" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#35AA3F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" />
                  <YAxis>
                  <Label
                    value="Total Watt (W)"  // Label text
                    angle={-90}             // Rotate the label vertically
                    position="insideLeft"    // Position the label inside the Y-axis
                    style={{ textAnchor: 'middle' }}  // Center the text
                    />
                  </YAxis>
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip content={<CustomTooltip />} /> {/* Custom Tooltip */}
                  <Area
                    type="monotone"
                    dataKey="totalWatt"
                    name="Total Watt"
                    stroke="#35AA3F"
                    fillOpacity={1}
                    fill="url(#colorWatt)"
                  />
                </AreaChart>
              </ResponsiveContainer>

              <h3 className="mt-1 font-extralight italic">*Data updated from 00:00 to {normalTime}</h3>
            </div>
          </div>

          {/* Devices Table */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            {/* Flex container for header and export button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Devices List</h2>

              {/* Export to CSV Button */}
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-custom-green text-white rounded hover:bg-custom-green-dark transition-colors duration-300"
              >
                Export to CSV
              </button>
            </div>

            <table className="w-full text-left table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Device Serial ID</th>
                  <th className="px-4 py-2">Install Date</th>
                  <th className="px-4 py-2">Site Address</th>
                  <th className="px-4 py-2">Site Type</th>
                </tr>
              </thead>
              <tbody>
                {processedDevicesData.length > 0 ? (
                  processedDevicesData.slice(0, itemsToShow).map((device, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{device.deviceSerialId}</td>
                      <td className="border px-4 py-2">{device.installDate}</td>
                      <td className="border px-4 py-2">{device.siteAddress}</td>
                      <td className="border px-4 py-2">{device.siteType}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Show more / less button */}
            {processedDevicesData.length > 5 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className= "px-4 py-2 bg-custom-green hover:bg-custom-green-dark text-white rounded transition-colors duration-300"
                >
                  {showMore ? 'Show Less' : 'Show More'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
