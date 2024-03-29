import React, { useEffect, useState } from 'react';
import Layout from '../Components/Layout/Layout';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import Designers from 'Components/Shared/Designers';
import '../Assets/styles/Home/style.css'
import Designs from 'Components/Shared/Designs';
import Fabrics from 'Components/Shared/Fabrics';
import EcoFriendly from 'Components/Shared/EcoFriendly';
import HomeVideo from 'Assets/videos/kouture-homepage-video.mp4'
import ShopByCategory from 'Components/Shared/ShopByCategory';
import { useCookies } from 'react-cookie';
import DesignIcon from 'Assets/images/user-box/dress.png';
import FabricIcon from 'Assets/images/user-box/fabric.png';
import DesignerIcon from 'Assets/images/user-box/edit-tools.png';
import KoutureLogo from 'Assets/images/kouture-konect-logo.png';
import DesignsPreview from 'Components/Grids/DesignsPreview';
import FabricsPreview from 'Components/Grids/FabricsPreview';
import Signup from 'Components/Forms/User/Signup'
import HeroLoggedIn from 'Components/Pages/Home/HeroLoggedIn';

const Home = (props) => {
  const [fullscreen, setFullscreen] = useState(true);
  const [userModalShow, setUserModalShow] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
  const [reloadCount, setReloadCount] = useState(0);
  const [userDesignerLink, setUserDesignerLink] = useState("/sign-up?type=user&option=designers");
  const [userFabricLink, setUserFabricLink] = useState("/sign-up?type=user&option=fabrics");
  const [userDesignLink, setUserDesignLink] = useState("/sign-up?type=user&option=designs");
  const [designerLink, setDesignerLink] = useState("/sign-up?type=designer");
  const [fabricVendorLink, setFabricVendorLink] = useState("/sign-up?type=seller");

  const [fabricsModalShow, setFabricsModalShow] = useState(false);
  const [designsModalShow, setDesignsModalShow] = useState(false);

  const [signupModalShow, setSignupModalShow] = useState(false);
  const [signupType, setSignupType] = useState('');

  const currentUser = cookies.currentUser;

  const handleShowUser = () => {
    setUserModalShow(true);
  }

  const handleShowFabrics = () => {
    setFabricsModalShow(true);
  }

  const handleShowDesigns = () => {
    setDesignsModalShow(true);
  }

  const showSignupModal = (e) => {
    setSignupType(e);
    setSignupModalShow(true);
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
      {/* <HeroSection /> */}
      {currentUser ?
        <HeroLoggedIn />
        :
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
                  <Button className='btn-outline me-3 text-white border-gold border-white-hover bg-gold bg-transparent-hover text-white-hover px-5' variant='secondary' onClick={() => handleShowUser()}>I'm Just Browsing</Button>
                  <Button className='btn-outline me-3 text-white border-white border-gold-hover bg-gold-hover text-white-hover px-5' variant='secondary' onClick={() => showSignupModal('designer')} >I'm a Designer</Button>
                  <Button className='btn-outline me-3 text-white border-white border-gold-hover bg-gold-hover text-white-hover px-5' variant='secondary' onClick={() => showSignupModal('seller')} >I'm a Fabric Vendor</Button>
                </>
              }
            </div>
          </Container>
        </section>
      }
      {/* <section id="designers" className="pt-5 pb-3">
        <Container>
          <Row>
            <Col lg="12">
              <Designers />
            </Col>
          </Row>
        </Container>
      </section> */}
      <section id="fabrics" className="pt-5 mb-5 mt-xl-5">
        <Container>
          <Row>
            <Col lg="12">
              <Fabrics currentUser={currentUser} onSignup={showSignupModal} />
            </Col>
          </Row>
        </Container>
      </section>

      <section id="eco" className="py-5 mb-0">
        <Row>
          <Col lg="12">
            <EcoFriendly currentUser={currentUser} onSignup={showSignupModal} />
          </Col>
        </Row>
      </section>

      <section id="designs" className="py-5 mb-5">
        <Container>
          <Row>
            <Col lg="12">
              <Designs currentUser={currentUser} onSignup={showSignupModal} />
            </Col>
          </Row>
        </Container>
      </section>
      <section id="recent-designs" className="py-5 mb-5">
        <Container>
          <Row>
            <Col lg="12">
              <div>
                <p className="fs-20 text-center text-dark mb-2 proximanova-family"> Want to see the latest live streams of your favorite designers?</p >
                <h2 className="fs-35 fw-500 text-center text-black discover-design">Recent Live Streams</h2>
              </div>
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
              <Col lg="12">
                <h3 className="text-center fw-600 mb-5">I am looking for...</h3>
                <Row>
                  <Col lg="4">
                    <Card className="cursor-pointer bg-white border-gold-hover border-solid-2" onClick={() => showSignupModal('user_designer')}>
                      <Card.Body>
                        <div className="user-box">
                          <div>
                            <img src={DesignerIcon} alt="Designers" />
                            <h3 className="fw-600">Designers</h3>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg="4">
                    <Card className="cursor-pointer bg-white border-gold-hover border-solid-2" onClick={() => handleShowFabrics()}>
                      <Card.Body>
                        <div className="user-box">
                          <div>
                            <img src={FabricIcon} alt="Fabrics" />
                            <h3 className="fw-600">Fabrics</h3>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg="4">
                    <Card className="cursor-pointer bg-white border-gold-hover border-solid-2" onClick={() => handleShowDesigns()}>
                      <Card.Body>
                        <div className="user-box">
                          <div>
                            <img src={DesignIcon} alt="Designs" />
                            <h3 className="fw-600">Designs</h3>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
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
            <Row className="h-100">
              <Col lg="12" className="pb-100">
                <h2 className="mb-4 fw-600">Featured Fabrics</h2>
                <FabricsPreview limit="20" onSignup={showSignupModal} />
                <Col lg={12} className="text-right mt-4 mb-4">
                  <div className="preview-button fixed">
                    <div className="container">
                      <Button className="btn-primary" variant="primary" onClick={() => showSignupModal('user_fabric')}>View More</Button>
                    </div>
                  </div>
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
          <Container className="h-100">
            <Row className="h-100">
              <Col lg="12" className="pb-100">
                <h2 className="mb-4 fw-600">Featured Designs</h2>
                <DesignsPreview limit="20" onSignup={showSignupModal} />
              </Col>
              <Col lg={12} className="text-right mt-4 mb-4">
                <div className="preview-button fixed">
                  <div className="container">
                    <Button className="btn-primary" variant="primary" onClick={() => showSignupModal('user_design')}>View More</Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>

      {/* Signup */}
      <Modal show={signupModalShow} fullscreen={true} onHide={() => setSignupModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="h-100">
            <Row className="h-100">
              <Col lg="12">
                <Signup type={signupType} />
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default Home;