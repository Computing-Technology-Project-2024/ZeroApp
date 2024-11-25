import React, { useState } from 'react';
import ModalBox from '../components/cards/ModalCard';
import Search from '../components/searchFunc/search';

import BaseCard from '../components/cards/BaseCard';
import BarCombChart from '../components/charts/BarCombChart';
import CircuitsChart from '../components/charts/CircuitsChart';
import LineChart from '../components/charts/LineChart';

import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import the styles
import '../scripts/analytics_Style.css';

const Analytics = ({ addressList = [], isAdminMode }) => {
    const [activeButton, setActiveButton] = useState('Day');
    const [selectedDate, setSelectedDate] = useState(new Date());

    // New state variables for user inputs
    const [tariffRate, setTariffRate] = useState(0.05);          // Default value: $0.05 per kWh
    const [electricityCost, setElectricityCost] = useState(0.4); // Default value: $0.40 per kWh
    const [lineRent, setLineRent] = useState(1);                 // Default value: $1 per day


    // -------HANDLE CHANGE ADDRESS - ADMIN---------
    const [selectedAddress, setSelectedAddress] = useState(addressList[0] || {});
    const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility

    const handleClick = (label) => {
        setActiveButton(label);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleAddressChange = (address) => {
        setSelectedAddress(address);
        setIsModalOpen(false); // Close modal after selecting
    };

    return (
        <div className='analytics'>
            <div className={`mb-4`}>
                <p className='head font-bold pb-4'>Analytics</p>

                {/* TODO: add dynamic site address here */}
                <p id="AddressLine">
                    {/* this is just a placeholder */}
                    {addressList.length === 0 ? (
                        <span>5A Naismith St, Footscray VIC 3011, Australia</span>
                    ) : (
                        selectedAddress.site_address
                    )}
                    {isAdminMode && addressList.length > 0 && (
                        <span
                            style={{
                                color: "white",
                                cursor: "pointer",
                                marginLeft: "10px",
                                textDecoration: "underline",
                            }}
                            onClick={() => setIsModalOpen(true)}
                        >
                            Change
                        </span>
                    )}
                </p>
            </div>

            {/* Use ModalBox Component */}
            {isAdminMode && (
                <ModalBox isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)}>
                    <Search />

                    <div className="address-list">
                        {addressList.map((address) => (
                            <div
                                key={address.id}
                                className="address-item"
                                onClick={() => handleAddressChange(address)}
                                style={{ cursor: "pointer" }}
                            >
                                {address.site_address}
                            </div>
                        ))}
                    </div>
                </ModalBox>
            )}

            <BaseCard className={`mb-4 w-auto`}>
                <div className="control-group">
                    <div className="button-group">
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="yyyy/MM/dd"
                            className="date-picker"
                        />
                        {['Day', 'Week', 'Month'].map(label => (
                            <button
                                key={label}
                                className={`custom-button ${activeButton === label ? 'active' : ''}`}
                                onClick={() => handleClick(label)}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                <p className='comp-name'>Total daily energy import and export</p>
                {/* Pass both the timeframe and selectedDate to the CombChart */}
                <BarCombChart timeframe={activeButton} selectedDate={selectedDate} />
            </BaseCard>

            <BaseCard className={`mb-4 w-auto`}>
                <p className='comp-name'>Total circuits consumption</p>
                {/* Pass both the timeframe and selectedDate to the CircuitsChart */}
                <CircuitsChart timeframe={activeButton} selectedDate={selectedDate} />
            </BaseCard>

            ;

            <BaseCard className={`mb-4 w-auto`}>
                <p className="comp-name">Expense</p>
                {/* Input Fields for User Rates */}
                <div style={{ display: "flex", marginBottom: "20px" }}>
                    <div className="input-container">
                        <label className="input-label">Tariff Rate ($/kWh):</label>
                        <input
                            type="number"
                            value={tariffRate}
                            onChange={(e) => setTariffRate(parseFloat(e.target.value))}
                            step="0.01"
                            className="input-field"
                        />
                    </div>
                    <div className="input-container">
                        <label className="input-label">Electricity Cost ($/kWh):</label>
                        <input
                            type="number"
                            value={electricityCost}
                            onChange={(e) => setElectricityCost(parseFloat(e.target.value))}
                            step="0.01"
                            className="input-field"
                        />
                    </div>
                    <div className="input-container">
                        <label className="input-label">Line Rent ($/day):</label>
                        <input
                            type="number"
                            value={lineRent}
                            onChange={(e) => setLineRent(parseFloat(e.target.value))}
                            step="0.01"
                            className="input-field"
                        />
                    </div>
                </div>

                {/* Pass the rates to LineChart */}
                <LineChart
                    timeframe={activeButton}
                    selectedDate={selectedDate}
                    tariffRate={tariffRate}
                    electricityCost={electricityCost}
                    lineRent={lineRent}
                />
            </BaseCard>;
        </div>
    );
};

export default Analytics;