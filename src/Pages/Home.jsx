import React, { useEffect, useState } from 'react';
import Layout from '../Components/Layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import Designers from 'Components/Shared/Designers';
import '../Assets/styles/Home/style.css'
import Designs from 'Components/Shared/Designs';
import Fabrics from 'Components/Shared/Fabrics';
import EcoFriendly from 'Components/Shared/EcoFriendly';
import CustomerSatisfactionCta from 'Components/Shared/Home/CustomerSatisfactionCta';
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
import HeroImg from 'Assets/images/hero-img.png';
import ShopIcon from 'Assets/images/icons/shop.png';
import { IoIosSearch } from "react-icons/io";
import BrowseDesigners from "Assets/images/home-modal/browse-designers.png";
import ShopFabrics from "Assets/images/home-modal/shop-fabrics.png";
import ExploreDesigns from "Assets/images/home-modal/explore-designs.png";

const Home = (props) => {
  const navigate = useNavigate();
  const [fullscreen, setFullscreen] = useState(true);
  const [userModalShowold, setUserModalShowold] = useState(false);
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
  const [setupShopShow, setSetupShopShow] = useState(false);

  const [signupModalShow, setSignupModalShow] = useState(false);
  const [signupType, setSignupType] = useState('');

  const currentUser = cookies.currentUser;

  const handleShowUser = () => {
    setUserModalShow(true);
  }
  
  const handleShowFabrics = () => {
    setFabricsModalShow(true);
  }

  const toggleSetupShopShow = () => {
    setSetupShopShow(!setupShopShow);
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
        <section id='home' className='py-5 px-5 d-flex align-items-center mh650'>
          <Container>
            <Row>
              <Col lg='6' className="my-auto" >
                <div className="mt-5 align-text-center">
                  <h1 className="mb-3 fw-bold">Fashion Redefined</h1>
                  <h2 className="fw-bold">Your Unique Look Starts Here</h2>
                  <p className='mx-0 mt-5 pb-5 text-justify subtitle'>Discover premium fabrics, connect with top fashion designers, 
                    and get personalized style consultations all in one place.</p>
                </div>
                <div className='my-5'>
                  {currentUser ?
                    null
                    :
                    <>
                      <Button className='explore-button btn me-3 text-white bg-black bg-gray-hover px-5' variant='secondary' onClick={() => handleShowUser()}><IoIosSearch size={25}/>Explore Marketplace</Button>
                      <Button className='btn-outline me-3 border-secondary border-gold-hover bg-transparent-hover text-black-hover px-5' variant='secondary' onClick={() => toggleSetupShopShow()}> <img src={ShopIcon} className="mx-1" height="29px" alt="shop-icon"></img> Create Shop </Button>
                    </>
                    // <>
                    //   <Button className='btn-outline me-3 text-white border-gold border-white-hover bg-gold bg-transparent-hover text-white-hover px-5' variant='secondary' onClick={() => handleShowUser()}>I'm Just Browsing</Button>
                    //   <Button className='btn-outline me-3 text-white border-white border-gold-hover bg-gold-hover text-white-hover px-5' variant='secondary' onClick={() => showSignupModal('designer')} >I'm a Designer</Button>
                    //   <Button className='btn-outline me-3 text-white border-white border-gold-hover bg-gold-hover text-white-hover px-5' variant='secondary' onClick={() => showSignupModal('seller')} >I'm a Fabric Vendor</Button>
                    // </>
                  }
                </div>
              </Col>
              <Col lg='6' className="text-end">
                <img className="hero-img img-fluid"  src={HeroImg} alt="hero-img" />
              </Col>
            </Row>
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
      <section id="fabrics" className="mb-5 mt-xl-2 px-5">
        <Container>
          <Row>
            <Col>
              <Fabrics currentUser={currentUser} onSignup={showSignupModal} />
            </Col>
          </Row>
        </Container>
      </section>

      <section id="eco" className="py-5 mb-0">
        <EcoFriendly currentUser={currentUser} onSignup={showSignupModal} />
      </section>

      <section id="designs" className="py-5 px-5">
        <Container>
          <Row>
            <Col lg="12">
              <Designs currentUser={currentUser} onSignup={showSignupModal} />
            </Col>
          </Row>
        </Container>
      </section>

      <section id="customer-satisfaction-cta" className="py-5 mb-0">
        <CustomerSatisfactionCta />
      </section>

      <section id="recent-designs" className="py-5 mb-5 px-2">
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
      <Modal show={userModalShow} backdrop="static" centered size="lg" fullscreen={false} onHide={() => setUserModalShow(false)}>
        <Modal.Body className="py-5">
          <button type="button" className="btn-close no-header-close" onClick={() => setUserModalShow(false)} aria-label="Close"></button>
          <Container className="narrow-850 h-100">
            <Row className=" align-items-center h-100">
              <Col lg="12">
                {/* <h3 className="text-center fw-600 mb-5">I am looking for...</h3> */}
                <h3 className="modal-title text-center fw-bold mb-3">Select an option to get started</h3>
                <p className="modal-subtitle text-center mb-5">Welcome to our fashion marketplace! Please select one of the options below to explore our offerings. Whether you're looking for talented designers, unique patterns, or quality fabrics, you're in the right place</p>
                <Row>
                  <Col lg="4">
                    <Link to="/designers" onClick={() => setUserModalShow(false) } className="text-decoration-none">
                      {/* onClick={() => showSignupModal('user_designer')} */}
                      <Card className="modal-card cursor-pointer bg-white border-solid-2">
                        <Card.Body className="rounded d-flex align-items-center justify-content-center fashion-card" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${BrowseDesigners})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                          <div className="modal-box text-center align-items-center">
                              <h3 className="text-white">Browse Designers</h3>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                  <Col lg="4">
                    <Link to="/fabrics" onClick={() => setUserModalShow(false)} className="text-decoration-none">
                      {/* onClick={() => handleShowFabrics()} */}
                      <Card className="modal-card cursor-pointer bg-white border-solid-2">
                      <Card.Body className="rounded d-flex align-items-center justify-content-center fashion-card" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${ShopFabrics})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                          <div className="modal-box">
                              <h3 className="text-white">Shop Fabrics</h3>
                          </div>
                      </Card.Body>
                  </Card>
                    </Link>
                  </Col>
                  <Col lg="4">
                    <Link to="/designs" onClick={() => setUserModalShow(false)} className="text-decoration-none">
                      {/* onClick={() => handleShowDesigns()} */}
                      <Card className="modal-card cursor-pointer bg-white bg-black-hover border-solid-2">
                        <Card.Body className="rounded d-flex align-items-center justify-content-center fashion-card" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${ExploreDesigns})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                          <div className="modal-box">
                              <h3 className="text-white">Explore Designs</h3>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
      
      {/* User Box */}
      <Modal show={userModalShowold} backdrop="static" centered size="lg" fullscreen={false} onHide={() => setUserModalShow(false)}>
        <Modal.Body className="py-5">
          <button type="button" className="btn-close no-header-close" onClick={() => setUserModalShow(false)} aria-label="Close"></button>
          <Container className="narrow-850 h-100">
            <Row className=" align-items-center h-100">
              <Col lg="12">
                {/* <h3 className="text-center fw-600 mb-5">I am looking for...</h3> */}
                <h3 className="text-center fw-600 mb-5">I am interested in...</h3>
                <Row>
                  <Col lg="4">
                    <Link to="/designers" onClick={() => setUserModalShow(false) } className="text-decoration-none">
                      {/* onClick={() => showSignupModal('user_designer')} */}
                      <Card className="cursor-pointer bg-white border-gold-hover border-solid-2">
                        <Card.Body>
                          <div className="user-box">
                            <div>
                              <img src={DesignerIcon} alt="Designers" />
                              <h3 className="fw-600">Designers</h3>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                  <Col lg="4">
                    <Link to="/fabrics" onClick={() => setUserModalShow(false)} className="text-decoration-none">
                      {/* onClick={() => handleShowFabrics()} */}
                      <Card className="cursor-pointer bg-white border-gold-hover border-solid-2">
                        <Card.Body>
                          <div className="user-box">
                            <div>
                              <img src={FabricIcon} alt="Fabrics" />
                              <h3 className="fw-600">Fabrics</h3>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                  <Col lg="4">
                    <Link to="/designs" onClick={() => setUserModalShow(false)} className="text-decoration-none">
                      {/* onClick={() => handleShowDesigns()} */}
                      <Card className="cursor-pointer bg-white border-gold-hover border-solid-2">
                        <Card.Body>
                          <div className="user-box">
                            <div>
                              <img src={DesignIcon} alt="Designs" />
                              <h3 className="fw-600">Designs</h3>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>

      {/* Fabrics */}
      <Modal show={fabricsModalShow} fullscreen={false} onHide={() => setFabricsModalShow(false)}>
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
      <Modal show={designsModalShow} fullscreen={false} onHide={() => setDesignsModalShow(false)}>
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
      <Modal show={signupModalShow} fullscreen={false} onHide={() => setSignupModalShow(false)}>
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

      {/* Setup Shop  */}
      <Modal show={setupShopShow} backdrop="static" centered size="lg" fullscreen={false} onHide={() => setSetupShopShow(false)}>
        <Modal.Body className="py-5">
          <button type="button" className="btn-close no-header-close" onClick={() => setSetupShopShow(false)} aria-label="Close"></button>
          <Container className="narrow-850 h-100">
            <Row className=" align-items-center h-100">
              <Col lg="12">
                {/* <h3 className="text-center fw-600 mb-5">I am looking for...</h3> */}
                <h3 className="text-left fw-600 mb-5">Set Up Shop</h3>
                <Row>
                  <Col lg="12" className="mb-3">
                    {/* onClick={() => showSignupModal('user_designer')} */}
                    <Card onClick={() => navigate('/sign-up?type=designer') } className="cursor-pointer bg-white border-gold-hover border-solid-2">
                      <Card.Body>
                        <div className="user-box">
                          <div>
                            <img src={DesignerIcon} alt="Designers" />
                            <h3 className="fw-600">I am a designer</h3>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg="12" className="mb-3">
                    {/* onClick={() => handleShowFabrics()} */}
                    <Card onClick={() => navigate('/sign-up?type=seller') } className="cursor-pointer bg-white border-gold-hover border-solid-2">
                      <Card.Body>
                        <div className="user-box">
                          <div>
                            <img src={FabricIcon} alt="Fabrics" />
                            <h3 className="fw-600">I am a fabric vendor</h3>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg="12">
                    {/* onClick={() => handleShowDesigns()} */}
                    <Card onClick={() => navigate('/sign-up?type=designer_seller') } className="cursor-pointer bg-white border-gold-hover border-solid-2">
                      <Card.Body>
                        <div className="user-box">
                          <div>
                            <img src={DesignIcon} alt="Designs" />
                            <h3 className="fw-600">I am both a designer and a fabric vendor</h3>
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
    </Layout>
  );
};

export default Home;