import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { IoIosCheckmarkCircle } from "react-icons/io";
import Layout from 'Components/Layout/Layout';


const ThankYou = (props) => {

    return (
        <Layout>
        <section>
            <Container className='py-5 pt-0 thank-you-profile'>
                <Row>
                    <Col lg={12} className='text-center'>
                        <div className='text-gold mt-1'>
                            <IoIosCheckmarkCircle size={70} />
                        </div>
                    </Col>
                    <Col lg={12} className='text-center mb-4'>
                        <div className='fs-50 rufina-family mt-3'>
                            Thank you for completing your profile!
                        </div>
                    </Col>

                    <Col lg={12} className='text-center mt-4'>
                        <button className='btn btn-view-profile me-3'>View Profile</button>
                        <button className='btn btn-set-up'>Setup your Shop </button>
                    </Col>
                </Row>
            </Container>
        </section>
    </Layout >
    );
};

export default ThankYou;