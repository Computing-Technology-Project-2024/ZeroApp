import React from 'react';

const PageContainer = ({children}) => {
    return (
        <div className="flex w-full p-[50px]">
            {children}
        </div>
    );
};

export default PageContainer;