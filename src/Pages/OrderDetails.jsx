import React, { useEffect, useState } from 'react';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import '../Assets/styles/DesignerCalendar/style.css'
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
import { CiCreditCard2 } from "react-icons/ci";
import '../Assets/styles/Cart/style.css';
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate, useParams, Link } from 'react-router-dom';
import User from '../Assets/images/user.png';
import { GoHeart, GoAlertFill, GoShareAndroid } from 'react-icons/go';
import { AiFillMessage } from "react-icons/ai";
import { CiSaveDown2 } from "react-icons/ci";
import { PiCircleDashedLight, PiTruckThin } from "react-icons/pi";
import { PiStarLight } from "react-icons/pi";
import PinIcon from '../Assets/images/pin.png';
import { BsTruck } from "react-icons/bs";
import { PiNotepadLight } from "react-icons/pi";
import { TfiLocationPin } from "react-icons/tfi";
import { BsTelephone } from "react-icons/bs";
import { IoMdStarOutline, IoIosAttach } from "react-icons/io";
import { LiaSmileBeam } from "react-icons/lia";
import { VscSend } from "react-icons/vsc";
import { IoEyeOutline } from "react-icons/io5";
import { IoCloseOutline, IoVideocam } from "react-icons/io5";
import '../Assets/styles/OrderDetails/style.css';
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

const OrderDetails = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const userDetails = cookies.userDetails;
    const { designerId } = useParams();
    const [reloadCount, setReloadCount] = useState(0);
    const [formStatus, setFormStatus] = useState('standby');
    const [radioButtonValue, setRadioButtonValue] = useState(0);
    const [chatBox, setChatBox] = useState(false);

    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [checkOutFormData, setCheckOutFormData] = useState(initialCheckOut);


    const chatBoxModal = () => {
        setChatBox(true);
    }

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
                                    <h3 className="fs-30 fw-600 text-black mb-0">Order Details</h3>
                                </Col>
                                <Col md={6} className="text-right">
                                    <GoBack fallBack="/#" />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row className='left-right-padding'>
                        <Col>
                            <div className="base-timeline">

                                <PiNotepadLight className='order-placed-icon' size={25} />
                                <div className="timeline-circle timeline-circle--data">
                                    <div className="order fw-600">Order Placed</div>
                                    <div className="date-details fs-14">December 13, 2023</div>
                                </div>

                                <PiCircleDashedLight className='processing-icon' size={25} />
                                <div className="timeline-circle timeline-circle--data timeline-circle--active">
                                    <div className="processing fw-600">Processing</div>
                                    <div className="date-details fs-14">December 13, 2023</div>
                                </div>

                                <PiTruckThin className='truck-icon' size={25} />
                                <div className="timeline-circle timeline-circle--data">
                                    <div className="order-shipped fw-600">Order Shipped</div>
                                    <div className="date-details fs-14">December 13, 2023</div>
                                </div>

                                <CiSaveDown2 className='delivered-icon' size={25} />
                                <div className="timeline-circle timeline-circle--data">
                                    <div className="delivered fw-600">Delivered</div>
                                    <div className="date-details fs-14">December 13, 2023</div>
                                </div>

                                <PiStarLight className='for-review-icon' size={25} />
                                <div className="timeline-circle timeline-circle--data">
                                    <div className="review fw-600">For Review</div>
                                    <div className="date-details text-nowrap fs-14">December 13, 2023</div>
                                </div>


                            </div>
                        </Col>

                    </Row>

                    <Row className='mt-5'>
                        <Col lg={12} className='mt-4'>
                            <Card className='mt-2'>
                                <Card.Header className='order-chat bg-light d-flex justify-content-between'>
                                    <span>
                                        <img src={User} className='user-placeholder-order me-2 order-user' />Dave Napoles
                                        <AiFillMessage className='ms-2 text-gold cursor-pointer' onClick={chatBoxModal} />
                                    </span>

                                    <div className='order-id d-flex align-items-center'>
                                        Order ID: 11002345CT
                                    </div>
                                </Card.Header>
                                <Card.Body className='bg-white'>
                                    <div className='text-black fs-18 rufina-family fw-600 mb-4'>Delivery Address</div>
                                    <Row>
                                        <Col lg={6} className='mt-2'>
                                            <div>
                                                <BsTelephone className='text-gold me-3' />
                                                +63999 999 1234
                                            </div>

                                            <div className='mt-2'>
                                                <TfiLocationPin className='text-gold me-3' size="20" />
                                                155, Cabrera Street, Subic, Agoncillo, Batangas
                                            </div>
                                        </Col>

                                        {/* <Col lg={6}>
                                            <div className='d-flex'>
                                                <div className='text-black me-4'>December 6, 2023</div>
                                                <div>Completed</div>
                                            </div>

                                            <div className='d-flex'>
                                                <div className='text-black me-4'>December 6, 2023</div>
                                                <div>Order Received</div>
                                            </div>

                                            <div className='d-flex'>
                                                <div className='text-black me-4'>December 6, 2023</div>
                                                <div>Completed</div>
                                            </div>
                                        </Col> */}

                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {chatBox ?
                        <>
                            <Card className='width-chat-card px-0'>
                                <Card.Header className='order-chat bg-white'>
                                    <div className='d-flex justify-content-between'>
                                        <div>
                                            <span className="fs-14 fw-500 mb-0 name-of-user-chat">
                                                {/* {portfolio.user.first_name && portfolio.user.first_name != "" ? portfolio.user.first_name : "-"} &nbsp;
                                                {portfolio.user.last_name && portfolio.user.last_name != "" ? portfolio.user.last_name : "-"} */}
                                                Dave Napoles
                                            </span>
                                            <span className='ms-3 active-now fs-14 fw-400'>Active Now</span>
                                        </div>
                                        <div className="cursor-pointer" onClick={() => setChatBox(false)}>
                                            <IoCloseOutline color="#39393A" />
                                        </div>
                                    </div>
                                </Card.Header>

                                <Card.Body >
                                    {/* <div className='product-portfolio-image'>
                                        <span className='d-flex'>

                                            {images && images.length > 0 ?
                                                    <>
                                                        <div className="single-image-chat" style={{ backgroundImage: "url(" + activeImage + ")" }}>
                                                        </div>
                                                        <span className='name-of-portfolio ms-3 d-flex justify-content-center align-items-center'>{portfolio.name ?? "-"}</span>
                                                    </>
                                                    :
                                                    null
                                                }
                                        </span>
                                    </div> */}

                                    <div>
                                        <div className='mt-0 d-flex portfolio-designer-chat'>
                                            {/* {portfolio.user.image && (
                                                    <div
                                                        className='designer-photo'
                                                        style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${portfolio.user.image})` }}
                                                    >
                                                    </div>
                                                )} */}

                                            <div className="designer-info mx-2">

                                                <div>
                                                    <p className="fs-14 fw-600 mb-0 name-of-user-chat ms-2">
                                                        {/* {portfolio.user.first_name && portfolio.user.first_name != "" ? portfolio.user.first_name : "-"} {portfolio.user.last_name && portfolio.user.last_name != "" ? portfolio.user.last_name : "-"} */}

                                                        <span className=''>Dave Napoles</span>
                                                        <span className='ms-3 fs-14 time-chat fw-400'>2:23 PM</span>
                                                    </p>
                                                </div>

                                                <div className='fs-14 ms-2 mt-2 name-of-user-chat'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam.</div>
                                            </div>

                                        </div>
                                    </div>

                                    <div className='mt-5 mb-4 text-right d-flex'>
                                        <div>
                                            <div className='time-chat-box fs-14 fw-400'>3:30 PM
                                                <span className='ms-2 you-chat-box fw-600 fs-14'>You</span></div>
                                            <div className='mt-2 welcome-chat'>
                                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                                            </div>
                                        </div>

                                        <img src={User} className='placeholder-chat ms-3' />
                                    </div>

                                    <div className='mt-3'>
                                        <input type="text" className='form-control' />
                                    </div>

                                    <div className='mt-3 d-flex justify-content-between'>
                                        <div className='d-flex'>
                                            <div className='cursor-pointer' onClick={() => toggleUnderConstruction("")}><LiaSmileBeam className='me-2' size={20} /></div>
                                            <div className='cursor-pointer' onClick={() => toggleUnderConstruction("")}><IoIosAttach size={20} /></div>
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

export default OrderDetails;