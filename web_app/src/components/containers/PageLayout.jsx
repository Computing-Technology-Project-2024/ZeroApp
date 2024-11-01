import React from 'react';
import SearchBar from "../searchs/searchBar";
import Sidebar from "../sideBars/SideBar";
import PageContainer from "./PageContainer";
// sub-route
import {Outlet} from 'react-router-dom';

const PageLayout = ({ children }) => {
  return (
        <main className=" h-screen overflow-y-auto flex flex-grow w-full">
            <Sidebar className={`fixed top-0 left-0 w-60`}/>
            <div className="ml-60 h-full overflow-y-auto bg-container-gray w-[calc(100%-240px)]">
                <SearchBar className={``}/>
                <PageContainer className={``}>
                    {children}
                    <Outlet />
                </PageContainer>
            </div>
        </main>

    );
};

export default PageLayout;