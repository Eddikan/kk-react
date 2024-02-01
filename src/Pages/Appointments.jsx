import React, { useEffect, useState } from 'react';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import '../Assets/styles/DesignerCalendar/style.css'
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
import { CiCreditCard2 } from "react-icons/ci";
import { GoHeart, GoAlertFill, GoShareAndroid } from 'react-icons/go';
import '../Assets/styles/Appointments/style.css';
import { FaUserCircle } from "react-icons/fa";
import User from '../Assets/images/user.png';
import { LiaSmileBeam } from "react-icons/lia";
import { VscSend } from "react-icons/vsc";
import { IoMdVideocam, IoIosAttach } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { AiFillMessage } from "react-icons/ai";

const ToastCss = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

const Appointments = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const [reloadCount, setReloadCount] = useState(0);
    const [askAQuestion, setAskAQuestion] = useState(false);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');

    const askQuestionModal = (e) => {
        setAskAQuestion(true);
    };

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);

    }

    useEffect(() => {
        document.body.classList.add('designer-calendar-body');
    }, []);


    useEffect(() => {

    }, [reloadCount]);

    return (
        <LayoutNoFooter>
            <section>
                <Container>
                    <Row>
                        <Col lg={12} className="designer-calendar-container">
                            <Row className="pb-4">
                                <Col md={6} className='d-flex justify-content-left align-items-center'>
                                    <h3 className="fs-30 fw-600 text-black mb-0">Appointments</h3>
                                </Col>
                                <Col md={6} className="text-right">
                                    <GoBack fallBack="/#" />
                                </Col>
                            </Row>
                        </Col>

                        <Col lg={12}>
                            <Card>
                                <Card.Body className='bg-light'>
                                    <Row>
                                        <Col lg={4}>
                                            <span>Fashion Designer</span>
                                        </Col>

                                        <Col lg={4}>
                                            <span>Appointment Date & Time</span>
                                        </Col>

                                        <Col lg={2}>
                                            <span>Status</span>
                                        </Col>

                                        <Col lg={2}>

                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={12}>
                            <Card className='mt-2'>
                                <Card.Body className='bg-white'>
                                    <Row>
                                        <Col lg={4}>
                                            <div className='d-flex'>
                                                <img src={User} className='placeholder-appointments' />

                                                <div>
                                                    <div className='ms-3 mb-1 fs-18'>Dave Napoles</div>
                                                    <div className='ms-3 fs-16'>
                                                        Date Created: December 23, 2023
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>

                                        <Col lg={4}>
                                            February 8, 2024 10:00 AM
                                        </Col>

                                        <Col lg={2}>
                                            Scheduled
                                        </Col>

                                        <Col lg={2} className='d-flex justify-content-end'>
                                            <div className="cursor-pointer appointments-tooltip" onClick={() => toggleUnderConstruction("Enter video conferencing")}>
                                                <span className="icon-tooltiptext fs-14">Enter video conferencing</span>
                                                <IoMdVideocam className='video-cam me-3' size={20} />
                                            </div>

                                            <div className="cursor-pointer icon-tooltiptext" onClick={() => toggleUnderConstruction("Chat Designer")}>
                                                <span><AiFillMessage size={20} /></span>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {askAQuestion ?
                        <>

                            <Card className='width-chat-card px-0'>
                                <Card.Header className='header-chat bg-white'>
                                    <div className='d-flex justify-content-between'>
                                        <div>
                                            <span className='fw-500'>Dave Napoles</span>
                                            <span className='ms-2 active-now fs-14 fw-400'>Active Now</span>
                                        </div>
                                        <div className="cursor-pointer" onClick={() => setAskAQuestion(false)}>
                                            <IoCloseOutline color="#39393A" />
                                        </div>
                                    </div>
                                </Card.Header>
                                <Card.Body >
                                    <div className='product-portfolio-image'>
                                        <span className='d-flex'>
                                            {/* {images && images.length > 0 ?
                                                <>
                                                    <div className="single-image-chat" style={{ backgroundImage: "url(" + activeImage + ")" }}>
                                                    </div>
                                                    <span className='name-of-portfolio ms-3 d-flex justify-content-center align-items-center'>{portfolio.name ?? "-"}</span>
                                                </>
                                                :
                                                null
                                            } */}
                                        </span>
                                    </div>

                                    <div className='mt-5 mb-4 text-right d-flex'>


                                        <div>
                                            <div className='time-chat-box fs-14 fw-400'>3:30 PM
                                                <span className='ms-2 you-chat-box fw-600 fs-14'>You</span></div>
                                            <div className='mt-2 welcome-chat'>
                                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                                            </div>
                                        </div>

                                        <div className=' d-flex align-items-center portfolio-designer ms-3'>
                                            {/* {portfolio.user.image && (
                                                <div
                                                    className='designer-photo'
                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${portfolio.user.image})` }}
                                                >
                                                </div>
                                            )} */}
                                        </div>
                                    </div>

                                    <div>
                                        <span>
                                            <FaUserCircle />
                                            <span className='name-chat'>Dave Napoles</span>
                                            <span className='ms-2 time-chat fw-400 fs-14'>4:00 PM</span>
                                        </span>
                                    </div>

                                    <div className='mt-3'>
                                        <input type="text" className='form-control' />
                                    </div>

                                    <div className='mt-3 d-flex justify-content-between'>

                                        <div className='d-flex'>
                                            <div className='cursor-pointer' onClick={() => toggleUnderConstruction("")}><LiaSmileBeam className='me-2' /></div>
                                            <div className='cursor-pointer' onClick={() => toggleUnderConstruction("")}><IoIosAttach /></div>
                                        </div>
                                        <div>
                                            <div
                                                className="cursor-pointer fw-500"
                                                onClick={() => toggleUnderConstruction("Send Message")}
                                            >
                                                Send
                                                <VscSend className='ms-1' />
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>

                        </>
                        :
                        null
                    }
                </Container>
            </section>

            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button type='button' className='close react-modal-close' onClick={() => setUnderConstructionShow(false)} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='fs-25 fw-600 mb-3'>{modalHeading}</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>


        </LayoutNoFooter >
    );
};

export default Appointments;