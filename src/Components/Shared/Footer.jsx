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
import { FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter, FaInstagram, FaPhone } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { useCookies } from 'react-cookie';
import axios from 'axios';

const Footer = (props) => {
    return (
        <>
            <section className="bg-black text-white py-3">
                <Container>
                    <Row>
                        <Col lg="12" className="text-center">
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
                        </Col>
                    </Row>
                </Container>
                
            </section>
        </>
    );
};

export default Footer;