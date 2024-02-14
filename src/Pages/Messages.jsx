import React, { useEffect, useState } from 'react';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card, CardBody } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
import { CiCreditCard2 } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate, useParams, Link } from 'react-router-dom';
import User from '../Assets/images/user.png';
import { LiaSmileBeam } from "react-icons/lia";
import { VscSend } from "react-icons/vsc";
import { IoIosAttach } from "react-icons/io";
import { GoHeart, GoAlertFill, GoShareAndroid } from 'react-icons/go';
import { CiSearch, CiBookmark, CiSettings } from 'react-icons/ci';
import '../Assets/styles/Message/style.css';
import axios from "axios";
import toast from 'react-hot-toast';

const initialCheckOut = {
    card_name: '',
    card_number: '',
    date: ''
};

const ToastCss = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

const Messages = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const userDetails = cookies.userDetails;
    const { designerId } = useParams();
    const [reloadCount, setReloadCount] = useState(0);
    const [formStatus, setFormStatus] = useState('standby');
    const [radioButtonValue, setRadioButtonValue] = useState(0);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [checkOutFormData, setCheckOutFormData] = useState(initialCheckOut);

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    const getAddCarts = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + '/#');
    };

    const postCheckOut = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + '/#', data);
    };

    const handleChangePaymentInfo = (e) => {
        const { name, value } = e.target;
        setCheckOutFormData({
            ...checkOutFormData,
            [name]: value,
        });
    }

    useEffect(() => {
        document.body.classList.add('designer-calendar-body');
    }, []);

    const addBusinessHoursSubmitPost = (e) => {
        // e.preventDefault();
        setFormStatus('loading');
        postCheckOut(checkOutFormData).then(response => {
            const status = response.data.status;
            if (status === "Success") {
                setFormStatus('standby');
                setReloadCount(reloadCount + 1);
                setCheckOutFormData(initialCheckOut);
                toast.success('Availability added successfully!');
            } else {
                setFormStatus('standby');
                toast.error('There has been an error saving the appointment, please try again!');
            }
        }).catch(() => {
            toast.error('There has been an error saving the appointment, please try again!');
        });
    }


    useEffect(() => {
        // getAddCarts()
        //     .then((response) => {
        //         const selectedOrders = response.data.data;
        //         if (selectedOrders) {
        //             setOrders(selectedOrders);
        //         } else {
        //             toast.error('There has been an error getting the date, please try again!');
        //         }
        //     })
        //     .catch((error) => {
        //         toast.error('There has been an error getting the date, please try again!');
        //     });
    }, [reloadCount]);

    return (
        <LayoutNoFooter>
            <section>
                <Container>
                    <Row>
                        <Col lg={12} className="designer-calendar-container">
                            <Row className="pb-4">
                                <Col md={6} className='d-flex justify-content-left align-items-center'>
                                    <h3 className="fs-30 fw-600 text-black mb-0">Messages</h3>
                                </Col>
                                <Col md={6} className="text-right">
                                    <GoBack fallBack="/#" />
                                </Col>
                            </Row>
                        </Col>
                        <hr />
                    </Row>

                    <Row>
                        <Col lg={12} className='d-flex'>
                            <Card className='message-width'>
                                <Card.Body className='px-0'>
                                    <Row>
                                        <Col lg={12}>
                                            <div
                                                className=' w-100'
                                                style={{ position: 'relative' }}
                                            >

                                                <input
                                                    className='search-bar form-control'
                                                    type="text"
                                                    placeholder="Search"
                                                />

                                                <CiSearch size="20px"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '88%',
                                                        transform: 'translateY(-50%)',
                                                    }}
                                                />
                                            </div>
                                        </Col>
                                    </Row>

                                    <hr className='mb-1' />
                                    <Row>
                                        <Col lg={12} className='mt-3'>
                                            <Row>
                                                <Col lg={2} className='d-flex justify-content-center align-items-center'>
                                                    <img src={User} className='user-placeholder-message ms-3' />
                                                </Col>

                                                <Col lg={10}>
                                                    <div className='w-100 d-flex justify-content-between'>
                                                        <div className='fs-14 body-text-bell'>Marie Salazar</div>
                                                        <div className='date-day me-3'>1 day ago - 3:25 PM</div>
                                                    </div>
                                                    <div className='body-chat me-3 mt-2'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy et...</div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>


                                    <hr className='mb-1' />
                                    <Row>
                                        <Col lg={12} className='mt-3'>
                                            <Row>
                                                <Col lg={2}>
                                                    <img src={User} className='user-placeholder-message ms-3' />
                                                </Col>

                                                <Col lg={10}>
                                                    <div className='w-100 d-flex justify-content-between'>
                                                        <div className='fs-14 body-text-bell'>Jeric Tolentno</div>
                                                        <div className='date-day me-3'>1 day ago - 3:25 PM</div>
                                                    </div>
                                                    <div className='body-chat me-3 mt-2'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy et...</div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                    <hr className='mb-1' />

                                    <Row>
                                        <Col lg={12} className='mt-3'>
                                            <Row>
                                                <Col lg={2}>
                                                    <img src={User} className='user-placeholder-message ms-3' />
                                                </Col>

                                                <Col lg={10}>
                                                    <div className='w-100 d-flex justify-content-between'>
                                                        <div className='fs-14 body-text-bell'>Ronald Randal</div>
                                                        <div className='date-day me-3'>1 day ago - 3:25 PM</div>
                                                    </div>
                                                    <div className='body-chat me-3 mt-2'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy et...</div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>


                            <Card className='chat-box-width'>
                                <Card.Body className='px-0'>
                                    <Row>
                                        <Col lg={12} className='ms-3'>
                                            <div className='mb-1 fs-14'>
                                                Cristopher Baruda
                                            </div>
                                            <div className='date-day'>
                                                Last seen 5hrs ago - 2:23 AM
                                            </div>
                                        </Col>
                                    </Row>
                                    <hr className='mt-3 mb-4' />

                                    <Row>
                                        <Col lg={2} className='text-center'>
                                            <img src={User} className='user-placeholder-chat ms-3' />
                                        </Col>

                                        <Col lg={10}>
                                            <div className='fs-14 body-text-bell fw-600'>Cristopher Baruda</div>
                                            <div className='body-chat me-4 mt-2'>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
                                        </Col>

                                        <Col lg={12}>
                                            <div className='mt-5 mb-4 text-right d-flex'>
                                                <div>
                                                    <div className='time-chat-box fs-14 fw-400'>3:30 PM
                                                        <span className='ms-2 you-chat-box fw-600 fs-14'>You</span></div>
                                                    <div className='mt-2 welcome-chat ms-4 '>
                                                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                                                    </div>
                                                </div>

                                                <img src={User} className='user-placeholder-you ms-3' />
                                            </div>
                                        </Col>

                                        <Col>
                                            <input className='chat-type ms-3' type="text" />

                                        </Col>

                                        <Col lg={12}>
                                            <div className='mt-3 ms-3 me-3 d-flex justify-content-between'>
                                                <div className='d-flex'>
                                                    <div className='cursor-pointer'
                                                    // onClick={() => toggleUnderConstruction("")}
                                                    >
                                                        <LiaSmileBeam className='me-2' size={20} />
                                                    </div>

                                                    <div className='cursor-pointer'
                                                    // onClick={() => toggleUnderConstruction("")}
                                                    >
                                                        <IoIosAttach size={20} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div
                                                        className="cursor-pointer fw-500"
                                                    // onClick={() => toggleUnderConstruction("Send Message")}
                                                    >
                                                        Send
                                                        <VscSend className='ms-1' />
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section >

            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button type='button' className='close react-modal-close' onClick={() => setUnderConstructionShow(false)} data-dismiss='modal' aria-label='Close'>
                        <span aria-hidden='true'>&times;</span>
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

export default Messages;