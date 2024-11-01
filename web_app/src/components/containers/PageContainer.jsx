import React from 'react';

const PageContainer = ({children}) => {
    return (
        <div className="flex h-full w-full p-[50px]">
            {children}
        </div>
    );
};

export default PageContainer;