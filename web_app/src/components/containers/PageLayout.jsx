import React from 'react';
import SearchBar from "../searchs/searchBar";
import Sidebar from "../sideBars/SideBar";
import PageContainer from "./PageContainer";
// sub-route
import { Outlet } from 'react-router-dom';

const PageLayout = ({ children }) => {
    return (
      <main className="absolute flex flex-grow w-full">
        <Sidebar className={`fixed top-0 left-0 w-60`}/>
        <div className="relative ml-60 h-auto w-full">
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