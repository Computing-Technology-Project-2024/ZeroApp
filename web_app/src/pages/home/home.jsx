import React from 'react';
import LineChart from '../../components/charts/LineChart';
import Sidebar from '../../components/charts/SideBar';
import SolarStatus from '../../components/charts/SolarStatus';
import SolarChart from '../../components/charts/SolarChart';


const Home = () => {
    return (
        <div>
            <Sidebar/>
            <LineChart />
            <SolarStatus/>
            <SolarChart/>
        </div>
    );
};

export default Home;