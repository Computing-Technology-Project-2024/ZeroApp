import React, { useState } from 'react'; 
import BaseCard from '../components/cards/BaseCard';
import BarCombChart from '../components/charts/BarCombChart';
import CircuitsChart from '../components/charts/CircuitsChart';
import StackedBar from '../components/charts/StackedBar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../scripts/analytics_Style.css';

const Analytics_admin = () => {
    const [activeButton, setActiveButton] = useState('Day');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showPopup, setShowPopup] = useState(false); // State for popup visibility
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [addresses] = useState([ // List of addresses
        "7 Rayner Footscray VIC 3011",
        "5 Rayner Footscray VIC 3011",
        "3 Rayner Footscray VIC 3011",
        "3/47 Derrimut Street",
        "4/47 Derrimut Street",
        "5/47 Derrimut Street"
    ]);

    const handleClick = (label) => {
        setActiveButton(label);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handlePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter addresses based on the search term
    const filteredAddresses = addresses.filter(address =>
        address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='analytics'>
            <p className='head'>Analytics</p>
            <p id="AddressLine">
                House Address
                <button onClick={handlePopup} className="change-button">Change</button>
            </p>

            {showPopup && (
    <>
        <div className="overlay" onClick={handlePopup}></div> {/* Overlay */}
        <div className="popup">
            <p className="popup-lable">Search Address</p>
            <button className="close-button" onClick={handlePopup}>×</button> {/* Close button */}
            <input 
                type="text" 
                placeholder="Search" 
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
            />
            <ul className="address-list">
                {filteredAddresses.map((address, index) => (
                    <li key={index}>{address}</li>
                ))}
            </ul>
        </div>
    </>
)}



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
                <BarCombChart timeframe={activeButton} selectedDate={selectedDate}/>
            </BaseCard>

            <BaseCard width={400} height={400}>
                <p className='comp-name'>Devices Consumption</p>
                <CircuitsChart timeframe={activeButton} selectedDate={selectedDate} />
            </BaseCard>

            <BaseCard width={400} height={400}>
                <p className='comp-name'>Devices Consumption Stacked Chart</p>
                <StackedBar timeframe={activeButton} selectedDate={selectedDate} />
            </BaseCard>
        </div>
    );
};

export default Analytics_admin;
