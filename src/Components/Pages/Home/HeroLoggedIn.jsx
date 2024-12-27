import {  useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import 'Assets/styles/Home/style.css'
import FindFashionDesigners from 'Assets/images/find-fashion-designers.png';
import ShopFabrics from 'Assets/images/shop-fabrics.png';
import ExploreDesigns from 'Assets/images/explore-designs.png';

import { FaArrowRightLong } from 'react-icons/fa6';

const HeroLoggedIn = () => {
    const navigate = useNavigate();

    return (
        <>
            <section id='home-loggedin' className="px-5 mb-5">
                <Container className='text-center'>
                    <Row>
                        <Col lg='4' className="cursor-pointer" onClick={() => navigate('/designers')}>
                            <div className="hero-card-designers position-relative h-100"
                                style={{ 
                                    backgroundImage: `url(${FindFashionDesigners})`, 
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {/* <video id="home-video" autoPlay={false} muted loop style={{ zIndex: 1 }}>
                                    <source src={DesignersVideo} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video> */}
                                <div className="hero-cards">
                                    <h2 className="mb-3 text-white text-left fs-40" style={{lineHeight: '45px', marginTop: '50px'}}>Find<br />Fashion<br />Designers <FaArrowRightLong size="35" className="ms-3"/></h2>
                                </div>
                            </div>
                        </Col>
                        <Col lg='4' className="hero-cards-column cursor-pointer" onClick={() => navigate('/fabrics')}>
                            <div className="hero-card-fabrics position-relative h-100"
                                style={{ 
                                    backgroundImage: `url(${ShopFabrics})`, 
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {/* <video id="home-video" autoPlay={false} muted loop style={{ zIndex: 1 }}>
                                    <source src={FabricsVideo} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video> */}
                                <div className="hero-cards">
                                    <h2 className="mb-3 text-white text-left fs-40" style={{lineHeight: '45px', marginTop: '90px'}}>Shop<br />Fabrics <FaArrowRightLong size="35" className="ms-3"/></h2>
                                </div>
                            </div>
                        </Col>
                        <Col lg='4' className="cursor-pointer" onClick={() => navigate('/designs')}>
                            <div className="hero-card-design position-relative h-100"
                                style={{ 
                                    backgroundImage: `url(${ExploreDesigns})`, 
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {/* <video id="home-video" autoPlay={false} muted loop style={{ zIndex: 1 }}>
                                    <source src={DesignsVideo} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video> */}
                                <div className="hero-cards">
                                    <h2 className="mb-3 text-white text-left fs-40" style={{lineHeight: '45px', marginTop: '90px'}}>Explore<br />Designs <FaArrowRightLong size="35" className="ms-3"/></h2>
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