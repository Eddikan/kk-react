import React from "react";
import { Container, Row, Col, Button, Form, Accordion } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import '../../Assets/styles/Sidebar/style.css'

const Sidebar = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;

  return (
    <>
        <div id="sidebar">
            
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Appointments</Accordion.Header>
                    <Accordion.Body>
                        <p>Appointment Lists</p>
                        <p>Calendar</p>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Orders</Accordion.Header>
                    <Accordion.Body>

                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <div>
                <p>Orders</p>
            </div>
            <div>
                <p>Orders</p>
            </div>
               <div>
                <p>Orders</p>
            </div>
        </div>
    </>
  )
}

export default Sidebar;