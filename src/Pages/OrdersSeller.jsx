import React, { useEffect, useState } from 'react';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import '../Assets/styles/DesignerCalendar/style.css'
import { useCookies } from 'react-cookie';
import { GoHeart, GoAlertFill, GoShareAndroid } from 'react-icons/go';
import '../Assets/styles/Orders/style.css';
import { FaUserCircle } from "react-icons/fa";
import User from '../Assets/images/user.png';
import { LiaSmileBeam } from "react-icons/lia";
import { VscSend } from "react-icons/vsc";
import { IoIosAttach } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { AiFillMessage } from "react-icons/ai";
import Sidebar from 'Components/Shared/Sidebar';
import { CiSearch, CiBookmark, CiSettings } from 'react-icons/ci';
import '../Assets/styles/AppointmentList/style.css';
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import toast from 'react-hot-toast';
import axios from "axios";


const ToastCss = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

const OrdersSeller = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const [reloadCount, setReloadCount] = useState(0);
    const [askAQuestion, setAskAQuestion] = useState(false);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [appointmentList, setAppointmentList] = useState('');
    const [inputClicked, setInputClicked] = useState(false);

    const [allShow, setAllShow] = useState(true);
    const [activeShow, setActiveShow] = useState(false);
    const [processShow, setProcessShow] = useState(false);
    const [shippedShow, setShippedShow] = useState(false);
    const [deliveredShow, setDeliveredShow] = useState(false);
    const [reviewShow, setReviewShow] = useState(false);



    const [orders, setOrders] = useState('');
    const [chatBox, setChatBox] = useState(false);
    const [query, setQuery] = useState('');

    const siteCookies = cookies[0];
    // const currentUser = siteCookies.currentUser;

    const getAllOrders = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + '/#');
    };

    const chatBoxModal = (e) => {
        setChatBox(true);
    };

    const askQuestionModal = (e) => {
        setAskAQuestion(true);
    };

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);

    }

    const showTab = (tab) => {
        if (tab == "all") {
            setAllShow(true);
            setActiveShow(false);
            setProcessShow(false);
            setShippedShow(false);
            setDeliveredShow(false);
            setReviewShow(false);

        } else if (tab === "active") {
            setAllShow(false);
            setActiveShow(true);
            setProcessShow(false);
            setShippedShow(false);
            setDeliveredShow(false);
            setReviewShow(false);

        } else if (tab === "processing") {
            setAllShow(false);
            setActiveShow(false);
            setProcessShow(true);
            setShippedShow(false);
            setDeliveredShow(false);
            setReviewShow(false);

        } else if (tab === "shipped") {
            setAllShow(false);
            setActiveShow(false);
            setProcessShow(false);
            setShippedShow(true);
            setDeliveredShow(false);
            setReviewShow(false);

        } else if (tab === "delivered") {
            setAllShow(false);
            setActiveShow(false);
            setProcessShow(false);
            setShippedShow(false);
            setDeliveredShow(true);
            setReviewShow(false);

        } else if (tab === "review") {
            setAllShow(false);
            setActiveShow(false);
            setProcessShow(false);
            setShippedShow(false);
            setDeliveredShow(false);
            setReviewShow(true);
        }
    }

    // useEffect(() => {
    //     if (inputClicked) {
    //         fetchAppointmentList();
    //     }
    // }, [query, inputClicked]);

    // const fetchAppointmentList = async () => {
    //     try {
    //         const response = await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user?user_id=' + currentUser, {
    //             params: {
    //                 query: query
    //             }
    //         });

    //         setAppointmentList(response.data.data);
    //     } catch (error) {
    //         console.error('Error fetching appointment:', error);
    //     }
    // };

    useEffect(() => {
        document.body.classList.add('designer-calendar-body');
    }, []);


    useEffect(() => {
        // getAllOrders()
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
            <Sidebar />
            <section>
                <Container>
                    <Row>
                        <Col lg={12} className="designer-calendar-container">
                            <Row className="pb-4">
                                <Col md={12} className='d-flex justify-content-left align-items-center'>
                                    <h3 className="fs-30 fw-600 text-black mb-0">All Orders</h3>
                                </Col>
                            </Row>

                            <Row className="mb-4">
                                <Col lg='8'>
                                    <div className='w-100 d-flex'>
                                        <div className='d-flex justify-content-center align-items-center'>
                                            <div className='appointment-date fs-16 text-nowrap me-2 text-black'>Date Created</div>
                                        </div>

                                        <div className='w-100 d-flex'>
                                            <input
                                                type="date"
                                                className='form-control w-25 color-date'
                                                value="to"
                                            />
                                            &nbsp;
                                            <div className='d-flex justify-content-center align-items-center'>-</div>
                                            &nbsp;
                                            <input
                                                type="date"
                                                className='form-control w-25 color-date'
                                                value="from"
                                            />
                                        </div>

                                    </div>
                                </Col>

                                <Col lg='4'>
                                    <div
                                        className='d-flex align-items-end w-100 justify-content-end'
                                        style={{ position: 'relative' }}
                                    >

                                        <input
                                            className='search-bar'
                                            type="text"
                                            placeholder="Search"
                                            value={query}
                                            onChange={(e) => { setQuery(e.target.value); setInputClicked(true); }}
                                        />

                                        <CiSearch size="20px"
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '92%',
                                                transform: 'translateY(-50%)',
                                            }}
                                        />
                                    </div>
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
                            <hr />
                        </Col>
                    </Row>

                    <Row>
                        <Col lg={12}>
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
                                            <span className='fw-500 text-black'>Status <MdKeyboardArrowDown /></span>
                                        </Col>

                                        <Col lg={2} className='text-end'>
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
                                    <Card.Header className='header-chat bg-light d-flex justify-content-between'>
                                        <span>
                                            <span>
                                                <img src={User} className='user-placeholder-order me-2 order-user' />Dave Napoles
                                                <AiFillMessage className='ms-2 text-gold' />
                                            </span>
                                        </span>

                                        <div>
                                            Order ID: 11002345CT
                                        </div>
                                    </Card.Header>
                                    <Card.Body className='bg-white'>
                                        <Row>
                                            <Col lg={2}>
                                                <span className='text-black'>December 8, 2023</span>
                                            </Col>

                                            <Col lg={2} className='d-flex'>
                                                <img src={User} className='user-placeholder' />
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

                                            <Col lg={2} className='d-flex justify-content-end'>
                                                <div className="cursor-pointer icon-tooltiptext" onClick={() => toggleUnderConstruction("")}>
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
                                    <Card.Header className='header-chat bg-light d-flex justify-content-between'>
                                        <span>
                                            <span>
                                                <img src={User} className='user-placeholder-order me-2 order-user' />Olivia Miller
                                                <AiFillMessage className='ms-2 text-gold' />
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
                                                <img src={User} className='user-placeholder' />
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

                                            <Col lg={2} className='d-flex justify-content-end'>
                                                <div className="cursor-pointer icon-tooltiptext" onClick={() => toggleUnderConstruction("")}>
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
                                    <Card.Header className='header-chat bg-light d-flex justify-content-between'>
                                        <span>
                                            <span>
                                                <img src={User} className='user-placeholder-order me-2 order-user' />Olivia Miller
                                                <AiFillMessage className='ms-2 text-gold' />
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
                                                <img src={User} className='user-placeholder' />
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

                                            <Col lg={2} className='d-flex justify-content-end'>
                                                <div className="cursor-pointer icon-tooltiptext" onClick={() => toggleUnderConstruction("")}>
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
                                    <Card.Header className='header-chat bg-light d-flex justify-content-between'>
                                        <span>
                                            <span>
                                                <img src={User} className='user-placeholder-order me-2 order-user' />Olivia Miller
                                                <AiFillMessage className='ms-2 text-gold' />
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
                                                <img src={User} className='user-placeholder' />
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

                                            <Col lg={2} className='d-flex justify-content-end'>
                                                <div className="cursor-pointer icon-tooltiptext" onClick={() => toggleUnderConstruction("")}>
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
                                    <Card.Header className='header-chat bg-light d-flex justify-content-between'>
                                        <span>
                                            <span>
                                                <img src={User} className='user-placeholder-order me-2 order-user' />Olivia Miller
                                                <AiFillMessage className='ms-2 text-gold' />
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
                                                <img src={User} className='user-placeholder' />
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

                                            <Col lg={2} className='d-flex justify-content-end'>
                                                <div className="cursor-pointer icon-tooltiptext" onClick={() => toggleUnderConstruction("")}>
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
                                    <Card.Header className='header-chat bg-light d-flex justify-content-between'>
                                        <span>
                                            <span>
                                                <img src={User} className='user-placeholder-order me-2 order-user' />Olivia Miller
                                                <AiFillMessage className='ms-2 text-gold' />
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
                                                <img src={User} className='user-placeholder' />
                                                <span className='d-flex justify-content-center text-black align-items-center ms-2'>Crystal Cascade SleeveGuard</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>December 25, 2023</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>$10.30</span>
                                            </Col>

                                            <Col lg={2}>
                                                <span className='text-black'>Complete</span>
                                            </Col>

                                            <Col lg={2} className='d-flex justify-content-end'>
                                                <div className="cursor-pointer icon-tooltiptext" onClick={() => toggleUnderConstruction("")}>
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


                    {chatBox ?
                        <>
                            <Card className='width-chat-card px-0'>
                                <Card.Header className='header-chat bg-white'>
                                    <div className='d-flex justify-content-between'>
                                        <div>
                                            <span className="fs-14 fw-500 mb-0 name-of-user-chat">
                                                Dave Napoles
                                            </span>
                                            <span className='ms-3 active-now fs-14 fw-400 text-gold'>Active Now</span>
                                        </div>
                                        <div className="cursor-pointer" onClick={() => setChatBox(false)}>
                                            <IoCloseOutline color="#39393A" />
                                        </div>
                                    </div>
                                </Card.Header>

                                <Card.Body >
                                    <div className='height-cb'>
                                    </div>

                                    <div>
                                        <input type="text" className='form-control' />
                                        <div className='mt-3  d-flex justify-content-between'>
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
                                    </div>
                                </Card.Body>
                            </Card>
                        </>
                        :
                        null
                    }

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

export default OrdersSeller;