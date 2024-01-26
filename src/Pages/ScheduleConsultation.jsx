import React from 'react';
import 'Assets/styles/ScheduleConsultation/style.css';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import ConsultationCalendar from 'Components/Shared/ConsultationCalendar';
import GoBack from 'Components/Shared/GoBack';

const ScheduleConsultation = () => {

    return (
        <Layout>
            <section id="schedule-consultation">
                {/* Tentative layout */}
                <Container>
                        <Row>
                            <Col lg="6">
                                <h1>Set an Appointment</h1>
                            </Col>
                            <Col lg="6" className="text-right">
                                <GoBack fallBack="/" />
                            </Col>
                            <ConsultationCalendar />
                        </Row>
                </Container>
            </section>
        </Layout>
    );
};

export default ScheduleConsultation;
