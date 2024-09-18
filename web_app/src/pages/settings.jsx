import React from 'react';
import BaseCard from '../components/cards/BaseCard';

const Settings = () => {
    return (
        <div>
            <p className='head'>Settings</p>

            <BaseCard>
            <label for="fname">First Name</label>
            <input type="text" id="fname" name="fname"></input>
            </BaseCard>

        </div>
    );
};

export default Settings;