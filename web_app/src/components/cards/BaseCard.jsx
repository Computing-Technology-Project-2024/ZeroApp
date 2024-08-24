import React from 'react';

const BaseCard = ({width, height, children}) => {
    return (
        <div className="rounded-lg bg-white p-[16px]">
            {children}
        </div>

    );
};

export default BaseCard;