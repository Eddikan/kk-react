import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Card, Modal } from 'react-bootstrap';
import UserPlaceholder from 'Assets/images/placeholders/user.png';
import toast from 'react-hot-toast';
// import getDesignsData from 'Utils/GetDesignsData';
import GetDesignsData from 'Utils/GetDesignsData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { IoEyeOutline, IoHeartOutline } from "react-icons/io5";
import KKLogoLight from 'Assets/images/kouture-konect-logo-light.png';
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaLinkedin, FaPhoneAlt, FaFacebookSquare, FaInstagramSquare, FaYoutubeSquare } from "react-icons/fa";
import { FaXTwitter, FaInstagram, FaPhone, FaSquareXTwitter  } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { useCookies } from 'react-cookie';
import axios from 'axios';
import FooterLogo from 'Assets/images/logos/koutor konect 2.png';
import TextLogo from 'Assets/images/logos/kouture-text-logo.png';
import AmericanExpressLogo from 'Assets/images/icons/American-Express-logo.png';
import DinersClubLogo from 'Assets/images/icons/diners-club-logo.png';
import JCBLogo from 'Assets/images/icons/jcb-logo.png';
import MaestroLogo from 'Assets/images/icons/maestro-logo.png';
import MasterCardLogo from 'Assets/images/icons/Mastercard-logo.png';
import PayPalLogo from 'Assets/images/icons/PayPal-Logo.png';
import VisaLogo from 'Assets/images/icons/visa-logo.png';
import DesignerModalIcon from 'Assets/images/icons/designer-modal-icon-purple.png';
import FabricModalIcon from 'Assets/images/icons/fabric-modal-icon-purple.png';
import DesignerVendorModalIcon from 'Assets/images/icons/sewing-modal-icon-purple.png';



const Footer = (props) => {
  const navigate = useNavigate();

  const [setupShopShow, setSetupShopShow] = useState(false);

  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'userDetails', 'userRole', 'isLoggedIn', 'selectedCartItems', 'tempCart', 'tempFavorites', 'selectedCountry', 'selectedCountryCode', 'selectedLanguage', 'selectedCurrency', 'selectedCurrencyCode', 'cartItemCount', 'favoriteItemCount', 'over_18']);
  const currentUser = cookies.currentUser;
  


    return (
        <>
            <section className="bg-white text-white py-3 border-top">
                <Container>
                    <Row>
                        <Col lg="3" className="pt-4 ps-5">
                            <Link href="/">
                                {/* <img src={FooterLogo} alt="Kouture Konect"  className="footer-logo ps-1" /> */}
                                <img src={TextLogo} alt="Kouture Konect"  className="footer-logo ps-1" />
                            </Link>
                        </Col>
                        <Col lg="6" className="pt-4">
                            <div className="footer-link-container d-flex justify-content-center">
                                <div className="footer-link">
                                    <Link to="/about" className="text-decoration-none fs-13">
                                        About Us
                                    </Link>
                                </div>
                                <div className="footer-link">
                                    <Link to="/designers" className="text-decoration-none fs-13">
                                        Designers
                                    </Link>
                                </div>
                                <div className="footer-link">
                                    <Link to="/fabrics" className="text-decoration-none fs-13">
                                        Fabrics
                                    </Link>
                                </div>
                                <div className="footer-link">
                                    <Link to="/designs" className="text-decoration-none fs-13">
                                        Designs
                                    </Link>
                                </div>
                                <div className="footer-link">
                                    <Link className="text-decoration-none fs-13" onClick={() => setSetupShopShow(!setupShopShow)}>
                                        Create a Shop
                                    </Link>
                                </div>
                            </div>
                            <div className="payment-options-container d-flex justify-content-center mt-3 mb-4">
                                <div className="footer-payment bg-white"> 
                                    <img src={PayPalLogo} className="footer-payment-img"  alt="" />
                                </div>
                                <div className="footer-payment bg-white">    
                                    <img src={VisaLogo} className="footer-payment-img"  alt="" />
                                </div>
                                <div className="footer-payment bg-white">
                                    <img src={MaestroLogo} className="footer-payment-img"  alt="" />   
                                </div>
                                <div className="footer-payment bg-white">
                                    <img src={AmericanExpressLogo} className="footer-payment-img"  alt="" />
                                </div>
                                <div className="footer-payment bg-white">
                                    <img src={DinersClubLogo} className="footer-payment-img"  alt="" />
                                </div>
                                <div className="footer-payment bg-white">
                                    <img src={MasterCardLogo} className="footer-payment-img"  alt="" />
                                </div>
                                <div className="footer-payment bg-white">
                                    <img src={JCBLogo} className="footer-payment-img"  alt="" />  
                                </div>
                            </div>
                        </Col>
                        <Col lg="3" className="pt-3 text-center">
                            <div className="footer-social-container mb-4">
                                <a href="https://www.facebook.com">
                                    <div className="footer-social bg-white">
                                        <FaFacebookSquare size="25px" color='black'/>
                                    </div>
                                </a>
                                <a href="https://www.instagram.com/kouturekonect/">
                                    <div className="footer-social bg-white">
                                        <FaInstagramSquare size="25px" color='black'/>
                                    </div>
                                </a>
                                <a href="https://www.x.com">
                                    <div className="footer-social bg-white">
                                        <FaSquareXTwitter size="25px" color='black'/>
                                    </div>
                                </a>
                                <a href="https://www.linkedin.com/in/kouture-konect-0978752a7">
                                    <div className="footer-social bg-white">
                                        <FaLinkedin size="25px" color='black'/>
                                    </div>
                                </a>
                                <a href="https://www.youtube.com/">
                                    <div className="footer-social bg-white">
                                        <FaYoutubeSquare  size="25px" color='black'/>
                                    </div>
                                </a>
                            </div>
                        </Col>
                        {/* <Col lg="12" className="text-center">
                            <Link href="/">
                                <img src={KKLogoLight} alt="Kouture Konect" className="footer-logo" />
                            </Link>
                            <div className="footer-social-container mb-4">
                                <div className="footer-social bg-white">
                                    <Link href="/">
                                        <FaFacebookF />
                                    </Link>
                                </div>
                                <div className="footer-social bg-white">
                                    <Link href="/">
                                        <FaInstagram />
                                    </Link>
                                </div>
                                <div className="footer-social bg-white">
                                    <Link href="/">
                                        <FaXTwitter />
                                    </Link>
                                </div>
                                <div className="footer-social bg-white">
                                    <Link href="/">
                                        <FaLinkedinIn />
                                    </Link>
                                </div>
                                <div className="footer-social bg-white">
                                    <Link href="/">
                                        <FaYoutube />
                                    </Link>
                                </div>
                            </div>
                            <div className="footer-link-container">
                                <div className="footer-link">
                                    <Link href="/" className="text-white text-decoration-none fs-13">
                                        Terms of Use
                                    </Link>
                                </div>
                                <div className="footer-link">
                                    <Link href="/" className="text-white text-decoration-none fs-13">
                                        Privacy Policy
                                    </Link>
                                </div>
                                <div className="footer-link">
                                    <Link href="/" className="text-white text-decoration-none fs-13">
                                        FAQs
                                    </Link>
                                </div>
                                <div className="footer-link">
                                    <Link href="/" className="text-white text-decoration-none fs-13">
                                        <FaPhone size="12px" /> 123-456-7890
                                    </Link>
                                </div>
                                <div className="footer-link">
                                    <Link href="mailto:kouturekonnect@gmail.com" className="text-white text-decoration-none fs-13">
                                        <IoIosMail size="12px" /> kouturekonnect@gmail.com
                                    </Link>
                                </div>
                            </div>
                            <hr className="border-white" />
                            <p className="fs-13">© 2023 Kouture Konect</p>
                        </Col> */}
                    </Row>
                    <section className="bg-white text-gray pt-3 border-top">
                        <Row>
                            <Col lg="12" className="d-flex px-5 justify-content-start">
                                <p className="fs-13">© 2024 Kouture Konect</p>
                                {/* <div className="footer-link-container d-flex">
                                    <div className="footer-link">
                                        <Link href="/" className="text-decoration-none text-gray fs-13">
                                            Terms of Use
                                        </Link>
                                    </div>
                                    <div className="footer-link">
                                        <Link href="/" className="text-decoration-none text-gray fs-13">
                                            Privacy Policy
                                        </Link>
                                    </div>
                                    <div className="footer-link">
                                        <Link href="/" className="text-decoration-none text-gray fs-13">
                                            FAQs
                                        </Link>
                                    </div>
                                </div> */}
                            </Col>
                        </Row>
                    </section>
                </Container>
                
            </section>
        {/* Setup Shop  */}
      <Modal show={setupShopShow} backdrop="static" centered size="lg" fullscreen={false} onHide={() => setSetupShopShow(false)}>
        {currentUser ?
          <Modal.Body className="pt-5 pb-4">
            <button type="button" className="btn-close no-header-close" onClick={() => setSetupShopShow(false)} aria-label="Close"></button>
            <Container className="narrow-850 h-100">
              <Row className=" align-items-center h-100">
                <Col lg="12">
                  {/* <h3 className="text-center fw-600 mb-5">I am looking for...</h3> */}
                  <h3 className="shop-modal-intro text-center fw-bold mt-5 mb-2">Join as a Designer, Fabric Vendor or both</h3>
                  <p className="modal-subtitle text-center mb-50">To get started, please select one of the options:</p>
                  <Row>
                    <Col lg="4" className="mb-90">
                      {/* onClick={() => showSignupModal('user_designer')} */}
                      <Card onClick={() => navigate('/user/designer-form')} className="shop-modal-card cursor-pointer bg-white">
                        <Card.Body className="shop-modal-card-body">
                          <img src={DesignerModalIcon} alt="Designers" className="shop-card-icon" />
                          <div className="user-box shop-modal-card-content text-center justify-content-center">
                            <div className="text-start w-100">
                              <p className="mb-0 fs-12">I am a</p>
                              <h3 className="shop-modal-title fs-30 fw-600 lh-35 mt-2">Designer</h3>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg="4" className="mb-90">
                      {/* onClick={() => handleShowFabrics()} */}
                      <Card onClick={() => navigate('/user/seller-form')} className="shop-modal-card cursor-pointer bg-white">
                        <Card.Body className="shop-modal-card-body">
                          <img src={FabricModalIcon} alt="Fabrics" className="shop-card-icon" />
                          <div className="user-box shop-modal-card-content text-center justify-content-center">
                            <div className="text-start w-100">
                              <p className="mb-0 fs-12">I am a</p>
                              <h3 className="shop-modal-title fs-30 fw-600 lh-35 mt-2">Fabric Vendor</h3>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg="4" className="mb-90">
                      {/* onClick={() => handleShowDesigns()} */}
                      <Card onClick={() => navigate('/user/designer-form?type=designer_seller')} className="shop-modal-card cursor-pointer bg-white">
                        <Card.Body className="shop-modal-card-body">
                          <img src={DesignerVendorModalIcon} alt="Designs" className="shop-card-icon" />
                          <div className="user-box shop-modal-card-content text-center justify-content-center">
                            <div className="text-start w-100">
                              <p className="mb-0 fs-12">I am both a</p>
                              <h3 className="shop-modal-title fs-30 fw-600 lh-35 mt-2">Designer & <br /> Fabric Vendor</h3>
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
          <Modal.Body className="pt-5 pb-4">
            <button type="button" className="btn-close no-header-close" onClick={() => setSetupShopShow(false)} aria-label="Close"></button>
            <Container className="narrow-850 h-100">
              <Row className=" align-items-center h-100">
                <Col lg="12">
                  {/* <h3 className="text-center fw-600 mb-5">I am looking for...</h3> */}
                  <h3 className="shop-modal-intro text-center fw-bold mt-5 mb-2">Join as a Designer, Fabric Vendor or both</h3>
                  <p className="modal-subtitle text-center mb-50">To get started, please select one of the options:</p>
                  <Row>
                    <Col lg="4" className="mb-90">
                      {/* onClick={() => showSignupModal('user_designer')} */}
                      <Card onClick={() => navigate('/sign-up?type=designer')} className="shop-modal-card cursor-pointer bg-white">
                        <Card.Body className="shop-modal-card-body">
                          <img src={DesignerModalIcon} alt="Designers" className="shop-card-icon" />
                          <div className="user-box shop-modal-card-content text-center justify-content-center">
                            <div className="text-start w-100">
                              <p className="mb-0 fs-12">I am a</p>
                              <h3 className="shop-modal-title fs-30 fw-600 lh-35 mt-2">Designer</h3>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg="4" className="mb-90">
                      {/* onClick={() => handleShowFabrics()} */}
                      <Card onClick={(e) => { navigate('/sign-up?type=seller'); }} className="shop-modal-card cursor-pointer bg-white">
                        <Card.Body className="shop-modal-card-body">
                          <img src={FabricModalIcon} alt="Fabrics" className="shop-card-icon" />
                          <div className="user-box shop-modal-card-content text-center justify-content-center">
                            <div className="text-start w-100">
                              <p className="mb-0 fs-12">I am a</p>
                              <h3 className="shop-modal-title fs-30 fw-600 lh-35 mt-2">Fabric Vendor</h3>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg="4" className="mb-90">
                      {/* onClick={() => handleShowDesigns()} */}
                      <Card onClick={() => navigate('/sign-up?type=designer_seller')} className="shop-modal-card cursor-pointer bg-white">
                        <Card.Body className="shop-modal-card-body">
                          <img src={DesignerVendorModalIcon} alt="Designs" className="shop-card-icon" />
                          <div className="user-box shop-modal-card-content text-center justify-content-center">
                            <div className="text-start w-100">
                              <p className="mb-0 fs-12">I am both a</p>
                              <h3 className="shop-modal-title fs-30 fw-600 lh-35 mt-2">Designer & <br /> Fabric Vendor</h3>
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
        }

      </Modal>
        </>
        
    );
};

export default Footer;