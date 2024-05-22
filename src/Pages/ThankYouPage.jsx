import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { IoIosCheckmarkCircle } from "react-icons/io";
import axios from "axios";
import toast from 'react-hot-toast';


const ThankYouPage = (props) => {

    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery();
    const order_id = query.get('order_id');

    return (
        <Layout>
            <section>
                <Container className='py-5 thank-you-height'>
                    <Row>
                        <Col lg={12} className='text-center'>
                            <div className='text-gold mt-1'>
                                <IoIosCheckmarkCircle size={70} />
                            </div>
                        </Col>
                        <Col lg={12} className='text-center mb-4'>
                            <div className='fs-50 rufina-family mt-2'>
                                Thankyou for your purchase!
                            </div>
                        </Col>

                        <Col lg={12}>
                            <p className='fs-20 thank-you text-center mb-5 mt-5'>
                                Thank you for your purchase! You'll be receiving an email from us shortly. We greatly value your feedback and would appreciate it if you could take a moment to fill out our survey.
                            </p>
                        </Col>

                        {/* <Col lg={12} className='text-center mt-5'>
                            <Link to={`/post-purchase-survey?order_id=${order_id}`}>
                                <div>
                                    <button className='btn btn-primary'>Start Survey</button>
                                </div>
                            </Link>
                        </Col> */}
                        <Col lg={12} className='text-center mt-5'>
                            <Link to="/">
                                <div>
                                    <button className='btn btn-primary'>Back to Home</button>
                                </div>
                            </Link>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Layout >
    );
};

export default ThankYouPage;