import React, { useEffect } from "react";
import Header from '../Shared/Header'
import toast, { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
  
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
      <div>
          <div id="navigation">
              <Header />
          </div>
          <div id="main">
              {children}
          </div>
          <div id="footer">

          </div>
      </div>
    </>
  );
}

export default Layout;