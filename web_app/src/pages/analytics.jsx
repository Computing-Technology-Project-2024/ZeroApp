import React from 'react';
import Recommendation from "./recommendation";
import Speedometer from "../components/charts/Speedometer"

const Analytics = () => {
    return (
        <div>
            <h1><b>Voltage Health</b></h1>
            <Speedometer />
        </div>
    );
};

export default Analytics;