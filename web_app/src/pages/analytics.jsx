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
            <p className='head'>Analytics Con Cu so 2</p>
            <p id="AddressLine">House Address</p>         

            <BaseCard width={600} height={400}>
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
            <p className='comp-name'>Energy Usage, Inport/Export</p>
            <CombChart/>
            </BaseCard>

            <BaseCard width={400} height={400}>
            <p className='comp-name'>Devices Consumption</p>
            <CircuitsChart/>
            </BaseCard>
        </div>
    );
};

export default Analytics;
