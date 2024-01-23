import React, { useEffect, useState } from 'react';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import ShopByCategory from 'Components/Shared/ShopByCategory';
import { useCookies } from 'react-cookie';
import '../Assets/styles/SellerCenter/style.css';
import Sidebar from 'Components/Shared/Sidebar';


const SellerCenter = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
  const currentUser = cookies.currentUser;

  return (
    <LayoutNoFooter>
      <Container>
        <Row>
          <Col className='mt-5'>
            <span className='appointments'>Appointments</span>
          </Col>
        </Row>
      </Container>

      {/* <Sidebar /> */}
    </LayoutNoFooter>



  );
};

export default SellerCenter;