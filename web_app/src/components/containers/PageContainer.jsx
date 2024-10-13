import React from 'react';

const PageContainer = ({children, className}) => {
    return (
        <div className={`bg-container-gray h-full p-[50px] ${className}`}>
            {children}
        </div>
    );
};

export default PageContainer;