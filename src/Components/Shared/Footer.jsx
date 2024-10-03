import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
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
import AmericanExpressLogo from 'Assets/images/icons/American-Express-logo.png';
import DinersClubLogo from 'Assets/images/icons/diners-club-logo.png';
import JCBLogo from 'Assets/images/icons/jcb-logo.png';
import MaestroLogo from 'Assets/images/icons/maestro-logo.png';
import MasterCardLogo from 'Assets/images/icons/Mastercard-logo.png';
import PayPalLogo from 'Assets/images/icons/PayPal-Logo.png';
import VisaLogo from 'Assets/images/icons/visa-logo.png';



const Footer = (props) => {
    return (
        <>
            <section className="bg-white text-white py-3 border-top">
                <Container>
                    <Row>
                        <Col lg="3" className="pt-4 ps-5">
                            <Link href="/">
                                <img src={FooterLogo} alt="Kouture Konect"  className="footer-logo ps-1" />
                            </Link>
                        </Col>
                        <Col lg="6" className="pt-4">
                            <div className="footer-link-container d-flex justify-content-center">
                                <div className="footer-link">
                                    <Link href="/" className="text-decoration-none fs-16">
                                        About Us
                                    </Link>
                                </div>
                                <div className="footer-link">
                                    <Link href="/" className="text-decoration-none fs-16">
                                        Designers
                                    </Link>
                                </div>
                                <div className="footer-link">
                                    <Link href="/" className="text-decoration-none fs-16">
                                        Fabrics
                                    </Link>
                                </div>
                                <div className="footer-link">
                                    <Link href="/" className="text-decoration-none fs-16">
                                        Designs
                                    </Link>
                                </div>
                                <div className="footer-link">
                                    <Link href="mailto:kouturekonnect@gmail.com" className="text-decoration-none fs-16">
                                        Create a Shop
                                    </Link>
                                </div>
                            </div>
                            <div className="payment-options-container d-flex justify-content-center mt-3 mb-4">
                                <div className="footer-payment bg-white">
                                    <Link href="/">
                                        <img src={PayPalLogo} className="footer-payment-img"  alt="" />                                                                      
                                    </Link>
                                </div>
                                <div className="footer-payment bg-white">
                                    <Link href="/">
                                        <img src={VisaLogo} className="footer-payment-img"  alt="" />                                                                    
                                    </Link>
                                </div>
                                <div className="footer-payment bg-white">
                                    <Link href="/">
                                        <img src={MaestroLogo} className="footer-payment-img"  alt="" />                                    
                                    </Link>
                                </div>
                                <div className="footer-payment bg-white">
                                    <Link href="/">
                                        <img src={AmericanExpressLogo} className="footer-payment-img"  alt="" />                                      
                                    </Link>
                                </div>
                                <div className="footer-payment bg-white">
                                    <Link href="/">
                                        <img src={DinersClubLogo} className="footer-payment-img"  alt="" />    
                                    </Link>
                                </div>
                                <div className="footer-payment bg-white">
                                    <Link href="/">
                                        <img src={MasterCardLogo} className="footer-payment-img"  alt="" />
                                    </Link>
                                </div>
                                <div className="footer-payment bg-white">
                                    <Link href="/">
                                        <img src={JCBLogo} className="footer-payment-img"  alt="" />  
                                    </Link>
                                </div>
                            </div>
                        </Col>
                        <Col lg="3" className="pt-3 text-center">
                            <div className="footer-social-container mb-4">
                                <div className="footer-social bg-white">
                                    <Link href="/">
                                        <FaFacebookSquare size="25px" color='black'/>
                                    </Link>
                                </div>
                                <div className="footer-social bg-white">
                                    <Link href="/">
                                        <FaInstagramSquare size="25px" color='black'/>
                                    </Link>
                                </div>
                                <div className="footer-social bg-white">
                                    <Link href="/">
                                        <FaSquareXTwitter size="25px" color='black'/>
                                    </Link>
                                </div>
                                <div className="footer-social bg-white">
                                    <Link href="/">
                                        <FaLinkedin size="25px" color='black'/>
                                    </Link>
                                </div>
                                <div className="footer-social bg-white">
                                    <Link href="/">
                                        <FaYoutubeSquare  size="25px" color='black'/>
                                    </Link>
                                </div>
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
                            <Col lg="12" className="d-flex px-5 justify-content-between">
                                <p className="fs-13">© 2023 Kouture Konect</p>
                                <div className="footer-link-container d-flex">
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
                                </div>
                            </Col>
                        </Row>
                    </section>
                </Container>
                
            </section>

        </>
    );
};

export default Footer;