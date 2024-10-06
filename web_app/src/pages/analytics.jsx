import React, { useState } from 'react';
import BaseCard from '../components/cards/BaseCard';
import BarCombChart from '../components/charts/BarCombChart';
import CombChart from '../components/charts/CombChart';
import CircuitsChart from '../components/charts/CircuitsChart';
import StackedBar from '../components/charts/StackedBar';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import the styles
import '../scripts/analytics_Style.css';

const Analytics = () => {
    const [activeButton, setActiveButton] = useState('Day');
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleClick = (label) => {
        setActiveButton(label);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className='analytics'>
            <p className='head'>Analytics</p>
            <p id="AddressLine">House Address</p>

            <BaseCard width={600} height={400}>
                <div className="control-group">
                    
                <p>Choose Date:</p>
                    <div className="button-group">
                        
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy/MM/dd"
                        className="date-picker"
                    />
                        {['Day', 'Week', 'Month', 'Year'].map(label => (
                            <button
                                key={label}
                                className={`custom-button ${activeButton === label ? 'active' : ''}`}
                                onClick={() => handleClick(label)}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                <p className='comp-name'>Consumption, Import/Export</p>
                {/* Pass both the timeframe and selectedDate to the CombChart */}
                <BarCombChart timeframe={activeButton} selectedDate={selectedDate}/>
            </BaseCard>

            <BaseCard width={400} height={400}>
                <p className='comp-name'>Devices Consumption</p>
                {/* Pass both the timeframe and selectedDate to the CircuitsChart */}
                <CircuitsChart timeframe={activeButton} selectedDate={selectedDate} />
            </BaseCard>

            <BaseCard width={400} height={400}>
                <p className='comp-name'>Devices Consumption Stacked Chart</p>
                {/* Pass both the timeframe and selectedDate to the CircuitsChart */}
                <StackedBar timeframe={activeButton} selectedDate={selectedDate} />
            </BaseCard>
        </div>
    );
};

export default Analytics;
