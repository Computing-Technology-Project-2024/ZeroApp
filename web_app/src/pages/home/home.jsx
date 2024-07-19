import React from 'react';
import LineChart from '../../components/charts/LineChart';
import Sidebar from '../../components/charts/SideBar';


const Home = () => {
    return (
        <div>
            <Sidebar/>
            <LineChart />
        </div>
    );
};

export default Home;