import React, { useEffect } from "react";
import Header from '../Shared/Header'
import toast, { Toaster } from 'react-hot-toast';
import Tawkto from "Components/Chat/TawkTo";

const LayoutNoFooter = ({ children, className }) => {

  useEffect(() => {
    // Scroll to the top when the component mounts or updates
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Tawkto />
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <div style={{ minHeight: '100vh' }} className={className}>
        <div id="navigation">
          <Header />
        </div>
        <div id="main">
          {children}
        </div>
      </div>
    </>
  );
}

export default LayoutNoFooter;  