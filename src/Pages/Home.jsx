import React, { useEffect, useState } from 'react';
import Layout from '../Components/Layout/Layout';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import Designers from 'Components/Shared/Designers';
import '../Assets/styles/Home/style.css'
import Designs from 'Components/Shared/Designs';
import HomeVideo from 'Assets/videos/kouture-homepage-video.mp4'
import ShopByCategory from 'Components/Shared/ShopByCategory';
import { useCookies } from 'react-cookie';
import DesignerIcon from 'Assets/images/user-box/dress.png';
import FabricIcon from 'Assets/images/user-box/fabric.png';
import DesignIcon from 'Assets/images/user-box/edit-tools.png';
import KoutureLogo from 'Assets/images/kouture-konect-logo.png';
import DesignGrid from 'Components/Grids/Designs';

const Home = () => {
  const [fullscreen, setFullscreen] = useState(true);
  const [userModalShow, setUserModalShow] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
  const [reloadCount, setReloadCount] = useState(0);
  const [userDesignerLink, setUserDesignerLink] = useState("/sign-up?type=user&option=designers");
  const [userFabricLink, setUserFabricLink] = useState("/sign-up?type=user&option=fabrics");
  const [userDesignLink, setUserDesignLink] = useState("/sign-up?type=user&option=designs");
  const [designerLink, setDesignerLink] = useState("/sign-up?type=designer");
  const [fabricVendorLink, setFabricVendorLink] = useState("/sign-up?type=fabric_vendor");

  const [fabricsModalShow, setFabricsModalShow] = useState(false);
  const [designsModalShow, setDesignsModalShow] = useState(false);

  const currentUser = cookies.currentUser;
  const signupType = cookies.signup_type;

  const handleShowUser = () => {
    setUserModalShow(true);
  }

  const handleShowFabrics = () => {
    setFabricsModalShow(true);
  }

  const handleShowDesigns = () => {
    setDesignsModalShow(true);
  }

  useEffect(() => {
    if (currentUser) {
      setUserDesignerLink('/designers');
      setUserFabricLink('/fabrics');
      setUserDesignLink('/designs');
      setDesignerLink('/user/profile');
      setFabricVendorLink('/user/profile');
    }

  }, [reloadCount]);

  return (
    <Layout>
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
                <Button href={designerLink} className='btn-outline me-3 text-white border-white border-gold-hover bg-gold-hover text-white-hover px-5' variant='secondary'>I'm a Designer</Button>
                <Button href={fabricVendorLink} className='btn-outline me-3 text-white border-white border-gold-hover bg-gold-hover text-white-hover px-5' variant='secondary'>I'm a Fabric Vendor</Button>
              </>
            }
          </div>
        </Container>
      </section>
      <section id="designers" className="pt-5 pb-3">
        <Container>
          <Row>
            <Col lg="12">
              <Designers />
            </Col>
          </Row>
        </Container>
      </section>
      <section id="designs" className="pt-5">
        <Container>
          <Row>
            <Col lg="12">
              <ShopByCategory />
            </Col>
          </Row>
        </Container>
      </section>
      <section id="designs" className="py-5">
        <Container>
          <Row>
            <Col lg="12">
              <Designs />
            </Col>
          </Row>
        </Container>
      </section>
      {/* User Box */}
      <Modal show={userModalShow} fullscreen={true} onHide={() => setUserModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="narrow-850 h-100">
            <Row className=" align-items-center h-100">
              <Col lg="4">
                <a href={userDesignerLink} className="text-decoration-none">
                  <Card className="cursor-pointer bg-lgray border-none">
                    <Card.Body>
                      <div className="user-box text-center">
                        <div>
                          <img src={DesignerIcon} alt="Designers" />
                          <h3 className="fw-600">Designers</h3>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </a>
              </Col>
              <Col lg="4">
                <Card className="cursor-pointer bg-lgray border-none" onClick={() => handleShowFabrics()}>
                  <Card.Body>
                    <div className="user-box text-center">
                      <div>
                        <img src={FabricIcon} alt="Fabrics" />
                        <h3 className="fw-600">Fabrics</h3>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg="4">
                <Card className="cursor-pointer bg-lgray border-none" onClick={() => handleShowDesigns()}>
                  <Card.Body>
                    <div className="user-box text-center">
                      <div>
                        <img src={DesignIcon} alt="Designs" />
                        <h3 className="fw-600">Designs</h3>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
      
      {/* Fabrics */}
      <Modal show={fabricsModalShow} fullscreen={true} onHide={() => setFabricsModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="h-100">
            <Row className=" align-items-center h-100">
              <Col lg="12" id="under-construction">
                <div className="under-construction-container text-center bg-lgray py-4">
                  <div className="construction-content">
                    <img
                      src={KoutureLogo}
                      alt="Kouture Konect"
                      className="construction-image mb-4"
                    />
                    <h1>Under Construction</h1>
                    <p>We're working on something awesome. Please check back later!</p>
                  </div>
                </div>
                <Col lg={12} className="text-right mt-4 mb-4">
                  <Link to={userFabricLink}>
                    <Button className="btn-primary" variant="primary">{currentUser ? "View All" : "Sign Up"}</Button>
                  </Link>
                </Col>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>

      {/* Designs */}
      <Modal show={designsModalShow} fullscreen={true} onHide={() => setDesignsModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col lg="12" id="under-construction">
                {/* <p className="fs-18 text-center text-dark mb-3"> Looking for Designs? <span className="text-gold">Explore now </span></p >
                <h2 className="fs-40 text-center text-black mb-30">Discover Captivating Designs.</h2> */}
                <DesignGrid limit="20" />
              </Col>
              <Col lg={12} className="text-right mt-4 mb-4">
                <Link to={userDesignLink}>
                    <Button className="btn-primary" variant="primary">{currentUser ? "View All" : "Sign Up"}</Button>
                </Link>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default Home;