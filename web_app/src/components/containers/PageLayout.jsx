import React from 'react';
import SearchBar from "../searchs/searchBar";
import Sidebar from "../sideBars/SideBar";
import PageContainer from "./PageContainer";

const PageLayout = ({children}) => {
    return (
        <div className="flex flex-row">
            <Sidebar/>
            <div className="flex flex-col w-full">
                <SearchBar/>
                <PageContainer>
                    {children}
                </PageContainer>
            </div>
        </div>
    );
};

export default PageLayout;