import React from 'react';
import 'Assets/styles/ScheduleConsultation/style.css';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import ConsultationCalendar from 'Components/Shared/ConsultationCalendar';
import { useCookies } from 'react-cookie';

const ScheduleConsultation = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    return (
        <Layout>
            <section id="schedule-consultation">
                {/* Tentative layout */}
                <Container>
                        <Row>
                            <Col lg="12">
                                <h1>Set an Appointment</h1>
                            </Col>
                            <ConsultationCalendar />
                        </Row>
                </Container>
            </section>
        </Layout>
    );
};

export default ScheduleConsultation;
