import React from 'react';
import SearchBar from "../searchs/searchBar";
import Sidebar from "../sideBars/SideBar";
import PageContainer from "./PageContainer";

const PageLayout = ({children}) => {
    return (
      <main className="absolute flex h-screen w-full">
        <Sidebar className={`fixed top-0 left-0 w-60`}/>
        <div className="relative ml-60 w-full">
          <SearchBar className={``}/>
          <PageContainer className={``}>
            {children}
          </PageContainer>
        </div>
      </main>
    );
};

export default PageLayout;