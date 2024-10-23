import React, { useState, useEffect, useCallback } from 'react';
import DashboardCard from '../components/cards/DashboardCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for the chart ---- in User mode ------
const data = [
  { time: '5k', export: 30, import: 50 },
  { time: '10k', export: 20, import: 40 },
  { time: '15k', export: 40, import: 30 },
  { time: '20k', export: 60, import: 20 },
  { time: '25k', export: 50, import: 60 },
  { time: '30k', export: 70, import: 40 },
  { time: '35k', export: 40, import: 60 },
  { time: '40k', export: 50, import: 70 },
  { time: '45k', export: 70, import: 40 },
  { time: '50k', export: 60, import: 80 },
  { time: '55k', export: 80, import: 60 },
  { time: '60k', export: 90, import: 70 },
];

// ----------------------------------------------------------
//The idea is to implement a toggle button for Admin-User mode for testing purpose first. 
//Basically, if Admin, fetch all data to display a list of address and able to change address in Analytics.
//If User, then show the previous display that Kim did.

const Dashboard = ({ setAddressList, isAdminMode, setIsAdminMode }) => {
  const [addresses, setAddresses] = useState([]);

  // Define fetchAddresses as a useCallback hook to prevent it from being re-created on every render.
  const fetchAddresses = useCallback(async () => {
    try {
      console.log("API Key:", process.env.REACT_APP_API_KEY); // Check if the key is being read correctly

      const response = await fetch(
        `https://api.edgeapi-v1.com/swinburn/sites`,
        {
            method: 'GET',
            headers: { 'x-api-key': process.env.REACT_APP_API_KEY },
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
      fetchAddresses(); 
    }
  }, [isAdminMode, fetchAddresses]); 

  return (
    <div className=" bg-gray-100 min-h-screen w-full">
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
              title="Battery life"
              value="70%"
              statusText="↑ 8.5% Up from yesterday"
              statusColor="green"
              statusIcon="🔋"
            />
            <DashboardCard
              title="Device runtime"
              value="2.5 hours"
              statusText="↓ 4.3% Down from yesterday"
              statusColor="red"
              statusIcon="⏳"
            />
            <DashboardCard
              title="Consumption cost"
              value="$10.24"
              statusText="↑ 8.5% Up from yesterday"
              statusColor="green"
              statusIcon="💰"
            />
            <DashboardCard
              title="Solar energy"
              value="200 kWh"
              statusText="↑ 8.5% Up from yesterday"
              statusColor="green"
              statusIcon="☀️"
            />
          </div>

          {/* Consumption Chart */}
          <div className="p-6 bg-white rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Consumption</h2>
            <div className="h-80 w-full bg-gray-100 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorExport" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorImport" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="export"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorExport)"
                  />
                  <Area
                    type="monotone"
                    dataKey="import"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorImport)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Other Section */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Other section</h2>
            <table className="w-full text-left table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">Date - Time</th>
                  <th className="px-4 py-2">Piece</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {/* Example Data */}
                <tr>
                  <td className="border px-4 py-2">Item 1</td>
                  <td className="border px-4 py-2">Location 1</td>
                  <td className="border px-4 py-2">Date - Time</td>
                  <td className="border px-4 py-2">Piece 1</td>
                  <td className="border px-4 py-2">$10.00</td>
                  <td className="border px-4 py-2">Active</td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
        </div>
      )
      }
    </div>
  );
};

export default Dashboard;
