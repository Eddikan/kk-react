import React from "react";
import Header from '../Shared/Header'

const Layout = ({ children }) => {
  return (
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
  );
}

export default Layout;