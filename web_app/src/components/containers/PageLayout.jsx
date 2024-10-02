import React from 'react';
import SearchBar from "../searchs/searchBar";
import Sidebar from "../sideBars/SideBar";
import PageContainer from "./PageContainer";
// sub-route
import { Outlet } from 'react-router-dom';

const PageLayout = ({ children }) => {
    return (
        <div className="flex flex-row">
            <Sidebar />
            <div className="flex flex-col w-full">
                <SearchBar />
                <PageContainer>
                    {/* children */}
                    <Outlet />
                </PageContainer>
            </div>
        </div>
    );
};

export default PageLayout;