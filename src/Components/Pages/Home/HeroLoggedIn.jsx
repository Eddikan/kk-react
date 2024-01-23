import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import Designers from 'Components/Shared/Designers';
import 'Assets/styles/Home/style.css'
import { useCookies } from 'react-cookie';
import HomeVideo from 'Assets/videos/kouture-homepage-video.mp4';

import FabricsVideo from 'Assets/videos/kouture-fabrics-video.mp4';
import DesignersVideo from 'Assets/videos/kouture-designers-video.mp4';
import DesignsVideo from 'Assets/videos/kouture-designs-video.mp4';

const HeroLoggedIn = () => {
    const navigate = useNavigate();

    return (
        <>
            <section id='home-loggedin'>
                <Container className='text-center'>
                    <Row>
                        <Col lg='4' className="hero-cards-column cursor-pointer" onClick={() => navigate('/designers')}>
                            <div className="hero-card position-relative h-100">
                                <video id="home-video" autoPlay={false} muted loop style={{zIndex: 1}}>
                                    <source src={DesignersVideo} type="video/mp4" />
                                    {/* Add additional source elements for other formats if needed */}
                                    Your browser does not support the video tag.
                                </video>
                                <div className="hero-cards">
                                    <h2 className="mb-3 text-white">Designers</h2>
                                </div>
                            </div>
                        </Col>
                        <Col lg='4' className="hero-cards-column cursor-pointer" onClick={() => navigate('/fabrics')}>
                            <div className="hero-card position-relative h-100">
                                <video id="home-video" autoPlay={false} muted loop style={{zIndex: 1}}>
                                    <source src={FabricsVideo} type="video/mp4" />
                                    {/* Add additional source elements for other formats if needed */}
                                    Your browser does not support the video tag.
                                </video>
                                <div className="hero-cards">
                                    <h2 className="mb-3 text-white">Fabrics</h2>
                                </div>
                            </div>
                        </Col>
                        <Col lg='4' className="hero-cards-column cursor-pointer" onClick={() => navigate('/designs')}>
                            <div className="hero-card position-relative h-100">
                                <video id="home-video" autoPlay={false} muted loop style={{zIndex: 1}}>
                                    <source src={DesignsVideo} type="video/mp4" />
                                    {/* Add additional source elements for other formats if needed */}
                                    Your browser does not support the video tag.
                                </video>
                                <div className="hero-cards">
                                    <h2 className="mb-3 text-white">Designs</h2>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );

}

export default HeroLoggedIn;