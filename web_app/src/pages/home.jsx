import React from 'react';

import PageLayout from "../components/containers/PageLayout";
import BaseCard from "../components/cards/BaseCard";


const Home = () => {
    return (
        <div>
            <h1>home</h1>
            <BaseCard width={400} height={400}>
                <h2>inside card</h2>
            </BaseCard>
        </div>
    );
};

export default Home;