import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import GoBack from 'Components/Shared/GoBack';

const WhyWorkWithKK = (props) => {

    return (
        <Layout>
            <section className='py-5'>
                    <Container>
                        <Row>
                            <Col lg="11">
                                <h2 className='fs-40 text-left mb-3'>Why Work With KK</h2>
                            </Col>

                            <Col lg="1" className='text-right'>
                                <GoBack fallBack="/" />
                            </Col>
                        </Row>
                    </Container>
                </section>
        </Layout>
    );
};

export default WhyWorkWithKK;