import React, { useState } from 'react';
import ModalBox from '../components/cards/ModalCard';
import Search from '../components/searchFunc/search';

import BaseCard from '../components/cards/BaseCard';
import BarCombChart from '../components/charts/BarCombChart';
import CombChart from '../components/charts/CombChart';
import CircuitsChart from '../components/charts/CircuitsChart';
import StackedBar from '../components/charts/StackedBar';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import the styles
import '../scripts/analytics_Style.css';
import { color } from 'd3';

const Analytics = ({ addressList = [], isAdminMode }) => {
    const [activeButton, setActiveButton] = useState('Day');
    const [selectedDate, setSelectedDate] = useState(new Date());

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
                <p id="AddressLine">{selectedAddress.site_address}
                    {isAdminMode && (
                        <span
                            style={{ color: "white", cursor: "pointer", marginLeft: "10px", textDecoration: "underline" }}
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
                <BarCombChart timeframe={activeButton} selectedDate={selectedDate} />
            </BaseCard>

            <BaseCard className={`mb-4 w-auto`}>
                <p className='comp-name'>Devices Consumption</p>
                {/* Pass both the timeframe and selectedDate to the CircuitsChart */}
                <CircuitsChart timeframe={activeButton} selectedDate={selectedDate} />
            </BaseCard>

            <BaseCard className={`mb-4 w-auto`}>
                <p className='comp-name'>Devices Consumption Stacked Chart</p>
                {/* Pass both the timeframe and selectedDate to the CircuitsChart */}
                <StackedBar timeframe={activeButton} selectedDate={selectedDate} />
            </BaseCard>
        </div>
    );
};

export default Analytics;