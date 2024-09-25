import React from 'react';

const BaseCard = ({width, height, children, className}) => {
    return (
        <div className={`rounded-lg bg-white p-[16px] ${className}`}>
            {children}
        </div>

    );
};

export default BaseCard;