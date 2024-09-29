import React from 'react';
import LineChart from '../components/charts/LineChart';
import BaseCard from "../components/cards/BaseCard";
import SolarChart from '../components/charts/SolarChart';


const Home = () => {
    return (
        <div>
            <h1>home</h1>
            <BaseCard width={400} height={400}>
                <LineChart/>
            </BaseCard>

            <BaseCard width={400} height={400}>
                <SolarChart/>
            </BaseCard>
        </div>

    );
};

export default Home;