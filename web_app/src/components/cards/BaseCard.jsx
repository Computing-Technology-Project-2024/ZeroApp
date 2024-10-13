import React from 'react';

const BaseCard = ({width, height, children, className}) => {
    return (
        <div className={`rounded-lg bg-white p-4 shadow-md ${className}`}>
            {children}
        </div>

    );
};

export default BaseCard;