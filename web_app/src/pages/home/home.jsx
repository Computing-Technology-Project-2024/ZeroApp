import React from 'react';
import LineChart from '../../components/charts/LineChart';
import Sidebar from '../../components/sideBars/SideBar';


const Home = () => {
    return (
        <div>
            <Sidebar/>
            <LineChart />
            <BarChart />
        </div>
    );
};

export default Home;