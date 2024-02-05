import React, { useEffect, useState } from 'react';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import '../Assets/styles/DesignerCalendar/style.css'
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
import '../Assets/styles/Cart/style.css';
import { useNavigate, useParams, Link } from 'react-router-dom';
import User from '../Assets/images/user.png';
import { AiFillMessage } from "react-icons/ai";
import { IoEyeOutline } from "react-icons/io5";
import { GoHeart, GoAlertFill, GoShareAndroid } from 'react-icons/go';
import '../Assets/styles/Order/style.css';
import { IoCloseOutline, IoVideocam } from "react-icons/io5";
import PlaceholderSquare from '../Assets/images/square-placeholder.jpg';
import { IoMdStarOutline, IoIosAttach } from "react-icons/io";
import { LiaSmileBeam } from "react-icons/lia";
import { VscSend } from "react-icons/vsc";
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

const Orders = (props) => {
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

    const [allShow, setAllShow] = useState(true);
    const [activeShow, setActiveShow] = useState(false);
    const [processShow, setProcessShow] = useState(false);
    const [shippedShow, setShippedShow] = useState(false);
    const [deliveredShow, setDeliveredShow] = useState(false);
    const [reviewShow, setReviewShow] = useState(false);
    const [completedShow, setCompletedShow] = useState(false);
    const [chatBox, setChatBox] = useState(false);


    const showTab = (tab) => {
        if (tab == "all") {
            setAllShow(true);
            setActiveShow(false);
            setProcessShow(false);
            setShippedShow(false);
            setDeliveredShow(false);
            setReviewShow(false);
            setCompletedShow(false);

        } else if (tab === "active") {
            setAllShow(false);
            setActiveShow(true);
            setProcessShow(false);
            setShippedShow(false);
            setDeliveredShow(false);
            setReviewShow(false);
            setCompletedShow(false);

        } else if (tab === "processing") {
            setAllShow(false);
            setActiveShow(false);
            setProcessShow(true);
            setShippedShow(false);
            setDeliveredShow(false);
            setReviewShow(false);
            setCompletedShow(false);

        } else if (tab === "shipped") {
            setAllShow(false);
            setActiveShow(false);
            setProcessShow(false);
            setShippedShow(true);
            setDeliveredShow(false);
            setReviewShow(false);
            setCompletedShow(false);

        } else if (tab === "delivered") {
            setAllShow(false);
            setActiveShow(false);
            setProcessShow(false);
            setShippedShow(false);
            setDeliveredShow(true);
            setReviewShow(false);
            setCompletedShow(false);

        } else if (tab === "review") {
            setAllShow(false);
            setActiveShow(false);
            setProcessShow(false);
            setShippedShow(false);
            setDeliveredShow(false);
            setReviewShow(true);
            setCompletedShow(false);

        } else if (tab === "completed") {
            setAllShow(false);
            setActiveShow(false);
            setProcessShow(false);
            setShippedShow(false);
            setDeliveredShow(false);
            setReviewShow(false);
            setCompletedShow(true);
        }
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

    const chatBoxModal = () => {
        setChatBox(true);
    }

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
    }, [reloadCount]);

    return (
        <LayoutNoFooter>
            <section>
                <Container>
                    <Row>
                        <Col lg={12} className="designer-calendar-container">
                            <Row className="pb-4">
                                <Col md={6} className='d-flex justify-content-left align-items-center'>
                                    <h3 className="fs-30 fw-600 text-black mb-0">Orders</h3>
                                </Col>
                                <Col md={6} className="text-right">
                                    <GoBack fallBack="/#" />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${allShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("all"); }}>All</span>
                            <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${activeShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("active"); }}>Active</span>
                            <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${processShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("processing"); }}>Processing</span>
                            <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${shippedShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("shipped"); }}>Shipped</span>
                            <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${deliveredShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("delivered"); }}>Delivered</span>
                            <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${reviewShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("review"); }}>Review and Feedback</span>
                            <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${completedShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("completed"); }}>Completed</span>
                            <hr />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Card>
                                <Card.Body className='bg-light'>
                                    <Row>
                                        <Col lg={2}>
                                            <span className='fw-500 text-black'>Date Created</span>
                                        </Col>

                                        <Col lg={2}>
                                            <span className='fw-500 text-black'>Item Title</span>
                                        </Col>

                                        <Col lg={2}>
                                            <span className='fw-500 text-black'>Order Date</span>
                                        </Col>

                                        <Col lg={2}>
                                            <span className='fw-500 text-black'>Total</span>
                                        </Col>

                                        <Col lg={2}>
                                            <span className='fw-500 text-black'>Status</span>
                                        </Col>

                                        <Col lg={2}>
                                            <span className='fw-500 text-black'>Action</span>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>


                    {allShow ?
                        <Row>
                            <Col lg={12}>
                                <Card className='mt-2'>
                                    <Card.Header className='order-chat bg-light d-flex justify-content-between'>
                                        <span>
                                            <img src={User} className='user-placeholder-order me-2 order-user' />Dave Napoles
                                            <AiFillMessage className='ms-2 text-gold cursor-pointer' onClick={chatBoxModal} />
                                        </span>

                                        <div className='order-id'>
                                            Order ID: 11002345CT
                                        </div>
                                    </Card.Header>
                                    <Card.Body className='bg-white'>
                                        <Row>
                                            <Col lg={2}>
                                                <span className='text-black'>December 8, 2023</span>
                                            </Col>

                                            <Col lg={2} className='d-flex'>
                                                <img src={PlaceholderSquare} className='square-placeholder me-2' />
                                                <span className='d-flex justify-content-center text-black align-items-center ms-2'>Crystal Cascade SleeveGuard</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>December 25, 2023</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>$10.30</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>To Ship</span>
                                            </Col>

                                            <Col lg={2}>
                                                <div className="cursor-pointer icon-tooltiptext" onClick={() => toggleUnderConstruction("Check Details")}>
                                                    <span className='text-gold'><IoEyeOutline className='me-2' size={20} />Check Details</span>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        :
                        null
                    }

                    {activeShow ?
                        <Row>
                            <Col lg={12}>
                                <Card className='mt-2'>
                                    <Card.Header className='order-chat bg-light d-flex justify-content-between'>
                                        <span>
                                            <span>
                                                <img src={User} className='user-placeholder-order me-2 order-user' />David Taylor
                                                <AiFillMessage className='ms-2 text-gold cursor-pointer' onClick={chatBoxModal} />
                                            </span>
                                        </span>

                                        <div className='order-id'>
                                            Order ID: 11002345CT
                                        </div>
                                    </Card.Header>
                                    <Card.Body className='bg-white'>
                                        <Row>
                                            <Col lg={2}>
                                                <span className='text-black'>December 6, 2023</span>
                                            </Col>

                                            <Col lg={2} className='d-flex'>
                                                <img src={PlaceholderSquare} className='square-placeholder me-2' />
                                                <span className='d-flex justify-content-center text-black align-items-center ms-2'>Crystal Cascade SleeveGuard</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>December 25, 2023</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>-</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>New</span>
                                            </Col>

                                            <Col lg={2}>
                                                <div className="cursor-pointer icon-tooltiptext" onClick={() => toggleUnderConstruction("Check Details")}>
                                                    <span className='text-gold'><IoEyeOutline className='me-2' size={20} />Check Details</span>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        :
                        null
                    }

                    {processShow ?
                        <Row>
                            <Col lg={12}>
                                <Card className='mt-2'>
                                    <Card.Header className='order-chat bg-light d-flex justify-content-between'>
                                        <span>
                                            <span>
                                                <img src={User} className='user-placeholder-order me-2 order-user' />David Taylor
                                                <AiFillMessage className='ms-2 text-gold cursor-pointer' onClick={chatBoxModal} />
                                            </span>
                                        </span>

                                        <div className='order-id'>
                                            Order ID: 11002345CT
                                        </div>
                                    </Card.Header>
                                    <Card.Body className='bg-white'>
                                        <Row>
                                            <Col lg={2}>
                                                <span className='text-black'>December 6, 2023</span>
                                            </Col>

                                            <Col lg={2} className='d-flex'>
                                                <img src={PlaceholderSquare} className='square-placeholder me-2' />
                                                <span className='d-flex justify-content-center text-black align-items-center ms-2'>Crystal Cascade SleeveGuard</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>December 25, 2023</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>-</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>Processing</span>
                                            </Col>

                                            <Col lg={2}>
                                                <div className="cursor-pointer icon-tooltiptext" onClick={() => toggleUnderConstruction("Check Details")}>
                                                    <span className='text-gold'><IoEyeOutline className='me-2' size={20} />Check Details</span>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        :
                        null
                    }

                    {shippedShow ?
                        <Row>
                            <Col lg={12}>
                                <Card className='mt-2'>
                                    <Card.Header className='order-chat bg-light d-flex justify-content-between'>
                                        <span>
                                            <span>
                                                <img src={User} className='user-placeholder-order me-2 order-user' />David Taylor
                                                <AiFillMessage className='ms-2 text-gold cursor-pointer' onClick={chatBoxModal} />
                                            </span>
                                        </span>

                                        <div className='order-id'>
                                            Order ID: 11002345CT
                                        </div>
                                    </Card.Header>
                                    <Card.Body className='bg-white'>
                                        <Row>
                                            <Col lg={2}>
                                                <span className='text-black'>December 6, 2023</span>
                                            </Col>

                                            <Col lg={2} className='d-flex'>
                                                <img src={PlaceholderSquare} className='square-placeholder me-2' />
                                                <span className='d-flex justify-content-center text-black align-items-center ms-2'>Crystal Cascade SleeveGuard</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>December 25, 2023</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>$10.30 </span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>Shipped</span>
                                            </Col>

                                            <Col lg={2}>
                                                <div className="cursor-pointer icon-tooltiptext" onClick={() => toggleUnderConstruction("Check Details")}>
                                                    <span className='text-gold'><IoEyeOutline className='me-2' size={20} />Check Details</span>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        :
                        null
                    }

                    {deliveredShow ?
                        <Row>
                            <Col lg={12}>
                                <Card className='mt-2'>
                                    <Card.Header className='order-chat bg-light d-flex justify-content-between'>
                                        <span>
                                            <span>
                                                <img src={User} className='user-placeholder-order me-2 order-user' />David Taylor
                                                <AiFillMessage className='ms-2 text-gold cursor-pointer' onClick={chatBoxModal} />
                                            </span>
                                        </span>

                                        <div className='order-id'>
                                            Order ID: 11002345CT
                                        </div>
                                    </Card.Header>
                                    <Card.Body className='bg-white'>
                                        <Row>
                                            <Col lg={2}>
                                                <span className='text-black'>December 6, 2023</span>
                                            </Col>

                                            <Col lg={2} className='d-flex'>
                                                <img src={PlaceholderSquare} className='square-placeholder me-2' />
                                                <span className='d-flex justify-content-center text-black align-items-center ms-2'>Crystal Cascade SleeveGuard</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>December 25, 2023</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>$10.30</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>Delivered</span>
                                            </Col>

                                            <Col lg={2}>
                                                <div className="cursor-pointer icon-tooltiptext" onClick={() => toggleUnderConstruction("Check Details")}>
                                                    <span className='text-gold'><IoEyeOutline className='me-2' size={20} />Check Details</span>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        :
                        null
                    }

                    {reviewShow ?
                        <Row>
                            <Col lg={12}>
                                <Card className='mt-2'>
                                    <Card.Header className='order-chat bg-light d-flex justify-content-between'>
                                        <span>
                                            <span>
                                                <img src={User} className='user-placeholder-order me-2 order-user' />David Taylor
                                                <AiFillMessage className='ms-2 text-gold cursor-pointer' onClick={chatBoxModal} />
                                            </span>
                                        </span>

                                        <div className='order-id'>
                                            Order ID: 11002345CT
                                        </div>
                                    </Card.Header>
                                    <Card.Body className='bg-white'>
                                        <Row>
                                            <Col lg={2}>
                                                <span className='text-black'>December 6, 2023</span>
                                            </Col>

                                            <Col lg={2} className='d-flex'>
                                                <img src={PlaceholderSquare} className='square-placeholder me-2' />
                                                <span className='d-flex justify-content-center text-black align-items-center ms-2'>Crystal Cascade SleeveGuard</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>December 25, 2023</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>$10.30</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>Completed</span>
                                            </Col>

                                            <Col lg={2}>
                                                <a className="cursor-pointer write-review-decoration" href="/rate-review">
                                                    <span className='text-gold'><IoMdStarOutline className='me-2' size={20} />Write Review</span>
                                                </a>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        :
                        null
                    }

                    {completedShow ?
                        <Row>
                            <Col lg={12}>
                                <Card className='mt-2'>
                                    <Card.Header className='order-chat bg-light d-flex justify-content-between'>
                                        <span>
                                            <span>
                                                <img src={User} className='user-placeholder-order me-2 order-user' />David Taylor
                                                <AiFillMessage className='ms-2 text-gold cursor-pointer' onClick={chatBoxModal} />
                                            </span>
                                        </span>

                                        <div className='order-id'>
                                            Order ID: 11002345CT
                                        </div>
                                    </Card.Header>
                                    <Card.Body className='bg-white'>
                                        <Row>
                                            <Col lg={2}>
                                                <span className='text-black'>December 6, 2023</span>
                                            </Col>

                                            <Col lg={2} className='d-flex'>
                                                <img src={PlaceholderSquare} className='square-placeholder me-2' />
                                                <span className='d-flex justify-content-center text-black align-items-center ms-2'>Crystal Cascade SleeveGuard</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>December 25, 2023</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>$10.30</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>Completed</span>
                                            </Col>

                                            <Col lg={2} onClick={() => toggleUnderConstruction("Buy Again")}>
                                                <button className='btn btn-primary'>Buy Again</button>
                                            </Col>

                                            {/* <Col lg={2}>
                                                <div className="cursor-pointer icon-tooltiptext" onClick={() => toggleUnderConstruction("")}>
                                                    <span className='text-gold'><IoEyeOutline className='me-2' size={20} />Check Details</span>
                                                </div>
                                            </Col> */}
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        :
                        null
                    }

                    {chatBox ?
                        <>
                            <Card className='width-chat-card px-0'>
                                <Card.Header className='order-chat bg-white'>
                                    <div className='d-flex justify-content-between'>
                                        <div>
                                            <span className="fs-14 fw-500 mb-0 name-of-user-chat">
                                                {/* {portfolio.user.first_name && portfolio.user.first_name != "" ? portfolio.user.first_name : "-"} &nbsp;
                                                {portfolio.user.last_name && portfolio.user.last_name != "" ? portfolio.user.last_name : "-"} */}
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

export default Orders;