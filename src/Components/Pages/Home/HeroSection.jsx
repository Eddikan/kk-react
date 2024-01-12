import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import Designers from 'Components/Shared/Designers';
import 'Assets/styles/Home/style.css'
import { useCookies } from 'react-cookie';
import HomeVideo from 'Assets/videos/kouture-homepage-video.mp4'

const HeroSection = () => {

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const [userModalShow, setUserModalShow] = useState(false);
    const [signupType, setSignupType] = useState('');
    const [signupModalShow, setSignupModalShow] = useState(false);

    const handleShowUser = () => {
        setUserModalShow(true);
    }

    const showSignupModal = (e) => {
        setSignupType(e);
        setSignupModalShow(true);
      }

    return (
        <>
        {currentUser ?
                <>
                    <section id='home-loggedin' className='mh650'>
                        <Container className='text-center'>
                            <Row>
                                <Col lg='4' className="hero-cards-column">
                                    <div className="hero-cards">
                                        <h2 className="mb-3 text-white">Designers</h2>
                                    </div>
                                </Col>
                                <Col lg='4' className="hero-cards-column">
                                    <div className="hero-cards">
                                        <h2 className="mb-3 text-white">Fabrics</h2>
                                    </div>
                                    
                                </Col>
                                <Col lg='4' className="hero-cards-column">
                                    <div className="hero-cards">
                                        <h2 className="mb-3 text-white">Designs</h2>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </section>
                </>
            :
                <>
                    <section id='home' className='py-5 px-2 d-flex align-items-center mh650'>
                        <video id="home-video" autoPlay muted loop>
                            <source src={HomeVideo} type="video/mp4" />
                            {/* Add additional source elements for other formats if needed */}
                            Your browser does not support the video tag.
                        </video>
                        <Container className='text-center'>
                            <Row>
                                <Col lg='12'>
                                <h1 className="text-white mb-3">Fashion Redefined <br />Your Unique Look Starts Here</h1>
                                <p className='subtitle text-white'>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.</p>
                                </Col>
                            </Row>
                            <div className='narrow-750 mt-4'>
                                {currentUser ?
                                null
                                :
                                <>
                                    <Button className='btn-outline me-3 text-white border-white border-gold-hover bg-gold-hover text-white-hover px-5' variant='secondary' onClick={() => handleShowUser()}>I'm Just Browsing</Button>
                                    <Button className='btn-outline me-3 text-white border-white border-gold-hover bg-gold-hover text-white-hover px-5' variant='secondary' onClick={() => showSignupModal('designer')} >I'm a Designer</Button>
                                    <Button className='btn-outline me-3 text-white border-white border-gold-hover bg-gold-hover text-white-hover px-5' variant='secondary' onClick={() => showSignupModal('seller')} >I'm a Fabric Vendor</Button>
                                </>
                                }
                            </div>
                        </Container>
                    </section>
                </>
        }
        </>
    );

}

export default HeroSection;