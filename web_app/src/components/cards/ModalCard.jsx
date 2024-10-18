import React from 'react';

const ModalBox = ({ isOpen, handleClose, children }) => {
    if (!isOpen) return null; // If modal is not open, don't render anything

    return (
        <>
            <style>
                {`
                    .modal {
                        display: block;
                        position: fixed;
                        z-index: 1000; 
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.4);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .modal-content {
                        background-color: #fefefe;
                        padding: 20px;
                        border: 1px solid #888;
                        width: 80%;
                        max-width: 600px;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                        z-index: 1010; /* Ensure content is above the overlay */
                        position: relative;
                    }

                    .close {
                        color: #aaaaaa;
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        font-size: 28px;
                        font-weight: bold;
                        cursor: pointer;
                    }

                    .close:hover,
                    .close:focus {
                        color: #000;
                        text-decoration: none;
                    }

                    .address-list {
                        max-height: 200px;
                        overflow-y: auto;
                    }

                    .address-item {
                        padding: 10px;
                        border-bottom: 1px solid #eee;
                    }

                    .address-item:hover {
                        background-color: #f0f0f0;
                    }

                    .search-bar {
                        width: 100%;
                        border: none;
                        outline: none;
                        padding: 10px;
                    }

                    /* Remove scrollbar */
                    ::-webkit-scrollbar {
                        display: none;
                    }

                    html {
                        -ms-overflow-style: none; /* For IE and Edge */
                    }

                    body {
                        scrollbar-width: none; /* For Firefox */
                    }
                `}
            </style>
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={handleClose}>
                        &times;
                    </span>
                    {children}
                </div>
            </div>
        </>
    );
};

export default ModalBox;
