import React, { useEffect } from "react";
import Header from '../Shared/Header'
import HeaderSeller from "Components/Shared/ShopManagerHeader";
import Footer from '../Shared/Footer'
import toast, { Toaster } from 'react-hot-toast';

const LayoutAdmin = ({ children }) => {

    useEffect(() => {
        // Scroll to the top when the component mounts or updates
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <div style={{ minHeight: '100vh' }}>
                <div id="navigation">
                    <HeaderSeller />
                </div>
                <div id="main">
                    {children}
                </div>
                <div id="footer">
                    <Footer />
                </div>
            </div>
        </>
    );
}

export default LayoutAdmin;  