import React, { useEffect, useState } from 'react';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import '../Assets/styles/Home/style.css'
import ShopByCategory from 'Components/Shared/ShopByCategory';
import { useCookies } from 'react-cookie';
import Sidebar from 'Components/Shared/Sidebar';


const SellerCenter = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;

  return (
    <LayoutNoFooter>
      <Sidebar />
    </LayoutNoFooter>
  );
};

export default SellerCenter;