import React, { useState } from 'react';
import BaseCard from '../components/cards/BaseCard';
import CombChart from '../components/charts/CombChart';
import CircuitsChart from '../components/charts/CircuitsChart';
import '..//scripts/analytics_Style.css'


const Analytics = () => {
    const [activeButton, setActiveButton] = useState('Day');

    const handleClick = (label) => {
        setActiveButton(label);
    };

    return (
        <div className='analytics'>
          <div className={`mb-4`}>
            <p className='head font-bold pb-4'>Analytics</p>
            {/* TODO: add dynamic site address here */}
            <p id="AddressLine">House Address</p>
          </div>

          <BaseCard className={`mb-4 w-auto`}>
            <div className="button-group">
                {['Day', 'Week', 'Month', 'Year'].map(label => (
                    <button
                        key={label}
                        className={`custom-button ${activeButton === label ? 'active' : ''}`}
                        onClick={() => handleClick(label)}>
                        {label}
                    </button>
                ))}
            </div>
            <p className='comp-name'>Energy Usage, Import/Export</p>
            <CombChart/>
          </BaseCard>

          <BaseCard className={`w-auto`}>
            <p className='comp-name'>Devices Consumption</p>
            <CircuitsChart/>
          </BaseCard>
        </div>
    );
};

export default Analytics;
