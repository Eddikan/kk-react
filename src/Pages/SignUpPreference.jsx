import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import BrowseDesigners from 'Assets/images/home-modal/browse-designers.png';
import ShopFabrics from 'Assets/images/home-modal/shop-fabrics.png';
import ExploreDesigns from 'Assets/images/home-modal/explore-designs.png';
import DesignerModalIcon from 'Assets/images/icons/designer-modal-icon-purple.png';
import FabricModalIcon from 'Assets/images/icons/fabric-modal-icon-purple.png';
import DesignerVendorModalIcon from 'Assets/images/icons/sewing-modal-icon-purple.png';

import '../Assets/styles/SignUpPreference/style.css';

const SignUpPreference = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const [userModalShow, setUserModalShow] = useState(false);
    const [setupShopShow, setSetupShopShow] = useState(false);
    
    const currentUser = cookies.currentUser;

    const toggleSetupShopShow = () => {
        setSetupShopShow(!setupShopShow);
    }

    const handleShowUser = () => {
        setUserModalShow(true);
    }

    const navigate = useNavigate();

    useEffect(() => {
          if (!currentUser) {
            navigate('/sign-up');
          }
      }, []);

    return (
        <LayoutNoFooter>
        {currentUser?
            <section className='d-flex align-items-center'>
                <Container>
                    <Row>
                        <div className="preference-container text-center">
                            <Col lg='12' className='d-flex flex-column mt-5 mb-4'>
                            <div className="text-center">
                                <h1>Choose how you would like to get started</h1>
                                <p>To get started, please select one of the options</p>
                            </div>
                            </Col>
                            <Row>
                                <Col lg="6">
                                    <Card className="pref-card cursor-pointer bg-white border-solid-2" onClick={toggleSetupShopShow}>
                                        <Card.Body className="rounded d-flex align-items-center justify-content-center">
                                            <div className="pref-box text-center align-items-center">
                                                <h3 className="lh-38">Create a Shop</h3>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col lg="6">
                                    <Card className="pref-card cursor-pointer bg-white border-solid-2" onClick={handleShowUser}>
                                        <Card.Body className="rounded d-flex align-items-center justify-content-center">
                                            <div className="pref-box text-center align-items-center">
                                                <h3 className="lh-38">Explore the Marketplace</h3>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Row>
                </Container>
            </section>
            :
            <>
            </>
        }
        <Modal show={userModalShow} backdrop="static" centered size="lg" fullscreen={false} onHide={() => setUserModalShow(false)}>
            <Modal.Body className="py-5">
            <button type="button" className="btn-close no-header-close" onClick={() => setUserModalShow(false)} aria-label="Close"></button>
            <Container className="narrow-850 h-100">
                <Row className=" align-items-center h-100">
                <Col lg="12">
                    {/* <h3 className="text-center fw-600 mb-5">I am looking for...</h3> */}
                    <h3 className="explore-modal-title text-center fw-bold mb-3">Select an option to get started</h3>
                    <p className="modal-subtitle text-center mb-5">Welcome to our fashion marketplace! Please select one of the options below to explore our offerings. Whether you're looking for talented designers, unique patterns, or quality fabrics, you're in the right place</p>
                    <Row>
                    <Col lg="4">
                        <Link to="/designers" onClick={() => setUserModalShow(false)} className="text-decoration-none">
                        {/* onClick={() => showSignupModal('user_designer')} */}
                        <Card className="modal-card cursor-pointer bg-white border-solid-2">
                            <Card.Body className="rounded d-flex align-items-center justify-content-center fashion-card" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${BrowseDesigners})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
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
        {/* Setup Shop  */}
        <Modal show={setupShopShow} backdrop="static" centered size="lg" fullscreen={false} onHide={() => setSetupShopShow(false)}>
            {currentUser ?
            <Modal.Body className="pt-5 pb-4">
                <button type="button" className="btn-close no-header-close" onClick={() => setSetupShopShow(false)} aria-label="Close"></button>
                <Container className="narrow-850 h-100">
                    <Row className="align-items-center h-100">
                        <Col lg="12">
                            {/* <h3 className="text-center fw-600 mb-5">I am looking for...</h3> */}
                            <h3 className="shop-modal-intro text-center fw-bold mt-5 mb-2">Join as a Designer, Fabric Vendor or both</h3>
                            <p className="modal-subtitle text-center mb-70">To get started, please select one of the options:</p>
                            <Row>
                                <Col lg="4" className="mb-90">
                                {/* onClick={() => showSignupModal('user_designer')} */}
                                <Card onClick={() => navigate('/user/designer-form')} className="shop-modal-card cursor-pointer bg-white">
                                    <Card.Body className="shop-modal-card-body">
                                        <img src={DesignerModalIcon} alt="Designers" className="shop-card-icon"/>
                                        <div className="user-box shop-modal-card-content text-center justify-content-center">
                                            <div className="text-start w-100">
                                                <p className="mb-0 fs-12">I am a</p>
                                                <h3 className="shop-modal-title fs-30 fw-600 lh-32">Designer</h3>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                                </Col>
                                <Col lg="4" className="mb-90">
                                {/* onClick={() => handleShowFabrics()} */}
                                <Card onClick={() => navigate('/user/seller-form')}  className="shop-modal-card cursor-pointer bg-white">
                                    <Card.Body className="shop-modal-card-body">
                                        <img src={FabricModalIcon} alt="Fabrics" className="shop-card-icon"/>
                                        <div className="user-box shop-modal-card-content text-center justify-content-center">
                                            <div className="text-start w-100">
                                                <p className="mb-0 fs-12">I am a</p>
                                                <h3 className="shop-modal-title fs-30 fw-600 lh-32">Fabric Vendor</h3>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                                </Col>
                                <Col lg="4" className="mb-90">
                                {/* onClick={() => handleShowDesigns()} */}
                                <Card onClick={() => navigate('/user/designer-form?type=designer_seller')} className="shop-modal-card cursor-pointer bg-white">
                                    <Card.Body className="shop-modal-card-body">
                                        <img src={DesignerVendorModalIcon} alt="Designs" className="shop-card-icon"/>
                                        <div className="user-box shop-modal-card-content text-center justify-content-center">
                                            <div className="text-start w-100">
                                                <p className="mb-0 fs-12">I am both a</p>
                                                <h3 className="shop-modal-title fs-30 fw-600 lh-32">Designer and <br /> Fabric Vendor</h3>
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
            :
            <>
            </>
            }
          </Modal>
        </LayoutNoFooter>
        
    );
};

export default SignUpPreference;