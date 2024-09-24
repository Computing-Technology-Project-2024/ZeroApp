import React from 'react';

const DashboardCard = ({ title, value, statusText, statusColor, statusIcon }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-4xl font-bold">{value}</p>
      <div className={`text-${statusColor}-500`}>
        {statusIcon} {statusText}
      </div>
    </div>
  );
};

export default DashboardCard;
