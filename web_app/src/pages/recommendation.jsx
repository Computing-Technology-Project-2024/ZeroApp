import React from 'react';
import Speedometer from "../components/charts/Speedometer"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: '0', uv: 400, pv: 240, amt: 2400 },
  { name: '1', uv: 300, pv: 456, amt: 2400 },
  { name: '2', uv: 200, pv: 139, amt: 2400 },
  { name: '3', uv: 278, pv: 390, amt: 2400 },
  { name: '4', uv: 189, pv: 480, amt: 2400 },
  { name: '5', uv: 239, pv: 380, amt: 2400 },
  { name: '6', uv: 349, pv: 430, amt: 2400 },
]; // replace this with api data

const Recommendation = () => {
  return (
    <div className="container mx-auto">
      <h3 className="text-2xl font-bold mb-4 text-left">Recommendation tttt</h3>
      
      {/* Flex container for main content */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Left Side - Speedometer */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md overflow-hidden">
          <h5 className="text-lg font-medium">Wednesday</h5>
          <p className="text-sm">22 May</p>
          <div className="mt-4">
            <Speedometer value={12.8}/>
            <p className="text-center mt-4">2% more to reach your goal!</p>
            <p className="mt-4 text-sm text-gray-600">
              Do you know solar panels can produce energy even without direct sunlight? Solar panels generate
              30%-50% and 10%-20% of their full potential on cloudy and rainy days, respectively.
            </p>
          </div>
        </div>

        {/* Right Side - Cards and Chart */}
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(4)
              .fill()
              .map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-md">
                  <h5 className="text-lg font-medium">5 KWH</h5>
                  <p className="text-sm text-gray-600">is not consumed</p>
                  <p className="text-sm text-green-600">Export the extra energy to save money</p>
                  <div className="text-green-600 text-xl">✔️</div>
                </div>
              ))}
          </div>

          {/* Bar Chart in Responsive Container */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h5 className="text-lg font-medium mb-4">Chart</h5>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pv" fill="#8884d8" />
                  <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
