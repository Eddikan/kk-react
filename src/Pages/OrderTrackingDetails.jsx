import React, { useEffect, useState } from 'react';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import 'Assets/styles/DesignerCalendar/style.css'
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
import { useNavigate, useParams, Link } from 'react-router-dom';
import User from '../Assets/images/user.png';
import { GoAlertFill } from 'react-icons/go';
import { AiFillMessage } from "react-icons/ai";
import { CiSaveDown2 } from "react-icons/ci";
import { GiMagnifyingGlass } from "react-icons/gi";
import { PiStarLight, PiCheckBold, PiNotepadLight, PiCircleDashedLight, PiTruckThin } from "react-icons/pi";
import { TfiLocationPin } from "react-icons/tfi";
import { BsTelephone, BsPerson } from "react-icons/bs";
import { IoIosAttach } from "react-icons/io";
import { VscSend } from "react-icons/vsc";
import { IoCloseOutline } from "react-icons/io5";
import '../Assets/styles/OrderDetails/style.css';
import 'Assets/styles/OrderTracking/style.css';
import InputEmoji from 'react-input-emoji';
import axios from "axios";
import toast from 'react-hot-toast';

const OrderTracking = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const { orderItemId } = useParams();
    const [reloadCount, setReloadCount] = useState(0);
    const [chatBox, setChatBox] = useState(false);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [orderPlaced, setOrderPlaced] = useState('');
    const [orderItemLogs, setOrderItemLogs] = useState([]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [isShipped, setIsShipped] = useState(false);
    const [isDelivered, setIsDelivered] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const [isProcessingDate, setIsProcessingDate] = useState('');
    const [isShippedDate, setIsShippedDate] = useState('');
    const [isDeliveredDate, setIsDeliveredDate] = useState('');
    const [isCompletedDate, setIsCompletedDate] = useState('');

    const [text, setText] = useState('');
    const [orderItem, setOrderItem] = useState('');
    const [order, setOrder] = useState('');
    const [user, setUser] = useState('');
    const [orderLoading, setOrderLoading] = useState(true);

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

    // const getUser = async () => {
    //     return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + designerId);
    // };

    const getOrderItem = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'order/item/' + orderItemId);
    };

    function handleOnEnter(text) {
        console.log('enter', text)
    }

    function convertDateTime(datetTme) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        const convertedDateTime = (new Date(datetTme)).toLocaleDateString('en-ES', options);

        return convertedDateTime;
    }

    useEffect(() => {
        document.body.classList.add('designer-calendar-body');
    }, []);

    useEffect(() => {
        getOrderItem()
            .then((response) => {
                const selectedOrderItem = response.data.data;
                if (selectedOrderItem) {
                    setOrderItem(selectedOrderItem.order_item);
                    setOrder(selectedOrderItem.order);
                    setUser(selectedOrderItem.order.user);
                    setOrderLoading(false);

                    const options = {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    };
                    const created_at = (new Date(selectedOrderItem.order.created_at)).toLocaleDateString('en-ES', options);
                    setOrderPlaced(created_at);

                    if (selectedOrderItem.order_item.logs) {
                        setOrderItemLogs(selectedOrderItem.order_item.logs);
                        const logs = selectedOrderItem.order_item.logs;
                        const processingLog = logs.find(log => log.status === 'Processing');
                        const shippedLog = logs.find(log => log.status === 'Shipped');
                        const deliveredLog = logs.find(log => log.status === 'Delivered');
                        const completedLog = logs.find(log => log.status === 'Completed');

                        const processingDate = processingLog ? processingLog.created_at : null;
                        const shippedDate = shippedLog ? shippedLog.created_at : null;
                        const deliveredDate = deliveredLog ? deliveredLog.created_at : null;
                        const completedDate = completedLog ? completedLog.created_at : null;

                        if (processingDate) {
                            setIsProcessingDate(convertDateTime(processingDate));
                        }

                        if (shippedDate) {
                            setIsShippedDate(convertDateTime(shippedDate));
                        }

                        if (deliveredDate) {
                            setIsDeliveredDate(convertDateTime(deliveredDate));
                        }

                        if (completedDate) {
                            setIsCompletedDate(convertDateTime(completedDate));
                        }

                        setIsProcessing(!!processingLog);
                        setIsShipped(!!shippedLog);
                        setIsDelivered(!!deliveredLog);
                        setIsCompleted(!!completedLog);
                    }

                } else {
                    toast.error('There has been an error getting the user, please try again!');
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the user, please try again!');
            });
    }, [reloadCount]);

    return (
        <LayoutNoFooter>
            <section id="details-order">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <Row className="pb-4">
                                <Col md={6} className='d-flex justify-content-left align-items-center'>
                                    <h3 className="fs-30 fw-600 text-black mb-0">Tracking Details</h3>
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

                                <PiNotepadLight className='order-placed-icon tracking-icon active' size={25} />
                                <div className="timeline-circle timeline-circle--data timeline-circle--active">
                                    <div className="order fw-600 tracking-status text-center">Order Placed</div>
                                    <div className="date-details fs-14 text-center tracking-status">{orderPlaced}</div>
                                </div>

                                {isProcessing ?
                                    <>
                                        <PiCircleDashedLight className='processing-icon tracking-icon active' size={25} />
                                        <div className="timeline-circle timeline-circle--data timeline-circle--active">
                                            <div className="processing fw-600 tracking-status text-center">Processing</div>
                                            <div className="date-details fs-14 text-center tracking-status">{isProcessingDate}</div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <PiCircleDashedLight className='processing-icon tracking-icon' size={25} />
                                        <div className="timeline-circle timeline-circle--data">
                                            <div className="processing fw-600 tracking-status text-center">Processing</div>
                                            {/* <div className="date-details fs-14">December 13, 2023</div> */}
                                        </div>
                                    </>
                                }

                                {isShipped ?
                                    <>
                                         <PiTruckThin className='truck-icon tracking-icon active' size={25} />
                                        <div className="timeline-circle timeline-circle--data timeline-circle--active">
                                            <div className="order-shipped fw-600 tracking-status text-center">Order Shipped</div>
                                            <div className="date-details fs-14 tracking-status">{isShippedDate}</div>
                                        </div>
                                    </>
                                    :
                                    <>
                                         <PiTruckThin className='truck-icon tracking-icon' size={25} />
                                        <div className="timeline-circle timeline-circle--data">
                                            <div className="order-shipped fw-600 tracking-status text-center">Order Shipped</div>
                                            {/* <div className="date-details fs-14">December 25, 2023</div> */}
                                        </div>
                                    </>
                                }

                                {isDelivered ?
                                    <>
                                        <CiSaveDown2 className='delivered-icon tracking-icon active' size={25} />
                                        <div className="timeline-circle timeline-circle--data timeline-circle--active">
                                            <div className="order-received fw-600 tracking-status text-center">Delivered</div>
                                            <div className="date-details fs-14 tracking-status">{isDeliveredDate}</div>
                                        </div>

                                        <PiStarLight className='for-review-icon tracking-icon active' size={25} />
                                        <div className="timeline-circle timeline-circle--data timeline-circle--active">
                                            <div className="order-complete fw-600 tracking-status text-center">For Review</div>
                                            <div className="date-details fs-14">{isDeliveredDate}</div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <CiSaveDown2 className='delivered-icon tracking-icon' size={25} />
                                        <div className="timeline-circle timeline-circle--data">
                                            <div className="order-received fw-600 tracking-status text-center">Delivered</div>
                                            {/* <div className="date-details fs-14">December 25, 2023</div> */}
                                        </div>
                                        <PiStarLight className='for-review-icon tracking-icon' size={25} />
                                        <div className="timeline-circle timeline-circle--data">
                                            <div className="order-complete fw-600 tracking-status text-center">For Review</div>
                                            {/* <div className="date-details fs-14">December 25, 2023</div> */}
                                        </div>
                                    </>
                                }

                                {isCompleted ?
                                    <>
                                        <PiCheckBold className='for-review-icon tracking-icon active' size={25} />
                                        <div className="timeline-circle timeline-circle--data timeline-circle--active ">
                                            <div className="processing fw-600 tracking-status text-center">Completed</div>
                                            <div className="date-details fs-14">{isCompletedDate}</div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <PiCheckBold className='for-review-icon tracking-icon' size={25} />
                                        <div className="timeline-circle timeline-circle--data ">
                                            <div className="processing fw-600 tracking-status text-center">Completed</div>
                                            {/* <div className="date-details fs-14">December 26, 2023</div> */}
                                        </div>
                                    </>
                                }

                                
                            </div>
                        </Col>
                    </Row>

                    <Row className='mt-5'>
                        <Col lg={12} className='mt-4'>
                            <Card className='mt-2 card-details-border'>
                                <Card.Header className='order-chat card-border bg-header d-flex justify-content-between'>
                                    {/* <div className='d-flex align-items-center user-image-order'>
                                        {user.image && (
                                            <div
                                                className='user-photo-order me-2'
                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${user.image})` }}
                                            >
                                            </div>
                                        )}

                                        {user.first_name}
                                        &nbsp;
                                        {user.last_name}
                                        <AiFillMessage className='ms-2 text-gold cursor-pointer' onClick={chatBoxModal} />
                                    </div> */}

                                    <div className='d-flex align-items-center'>
                                        <strong>Order #{orderItemId}</strong>
                                    </div>
                                </Card.Header>
                                <Card.Body className='bg-white radius-border'>
                                    <div className='text-black fs-18 rufina-family fw-600'>Delivery Details</div>
                                    <Row>
                                        <Col lg={5} className='mt-2 border-right'>
                                            {order.delivery_first_name && order.delivery_last_name ?
                                                <>
                                                    <p className="mb-1">{order?.delivery_first_name} {order?.delivery_last_name}</p>
                                                    <div>
                                                        <BsPerson className='text-gold me-3' />
                                                        {order?.delivery_first_name} {order?.delivery_last_name}
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <p className="mb-1">{order?.delivery_first_name} {order?.delivery_last_name}</p>
                                                    <div>
                                                        <BsPerson className='text-gold me-3' />
                                                        {user?.first_name} {user?.last_name}
                                                    </div>
                                                </>
                                            }
                                            {order.phone  ?
                                                <>
                                                    <p className="mb-1">{order?.phone}</p>
                                                    <div>
                                                        <BsTelephone className='text-gold me-3' />
                                                        {order?.phone}
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <p className="mb-1">{user?.phone}</p>
                                                    <div>
                                                        <BsTelephone className='text-gold me-3' />
                                                        {user?.phone ?? "-"}
                                                    </div>
                                                </>
                                            }
                                            {order.delivery_address_line_1 && order.delivery_city && order.delivery_province && order.delivery_country && order.delivery_postal_code ?
                                                <>
                                                    <div className='mt-2'>
                                                        <TfiLocationPin className='text-gold me-3' size="20" />
                                                        {order?.delivery_address_line_1} {order.delivery_city}, {order.delivery_province} {order.delivery_country} {order.delivery_postal_code}
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <div className='mt-2'>
                                                        <TfiLocationPin className='text-gold me-3' size="20" />
                                                        {user?.address_line_1} {user?.city}, {user?.province} {user?.country} {order.delivery_postal_code}
                                                    </div>
                                                </>
                                            }
                                             {/* <Card>
                                                <Card.Body className="text-center py-5">
                                                    <GoAlertFill size="60px" color="#000" className="mb-2" />
                                                    <p className="fs-20 text-black">Under Construction</p>
                                                </Card.Body>
                                            </Card> */}
                                        </Col>

                                        <Col lg={7}>
                                            <div className="wrap">
                                                <ul className="timeline">

                                                    {/* <li>
                                                        <div className='d-flex'>
                                                            <div className="me-3">December 25, 2023</div>
                                                            <div className='fs-14'>Completed</div>
                                                        </div>
                                                    </li>

                                                    <li>
                                                        <div className='d-flex'>
                                                            <div className="me-3">December 20, 2023</div>
                                                            <div className='color-order'>Order Received
                                                                <br />
                                                                <span className='fs-14'>The order has been delivered.<span className='text-gold'> View Proof of Delivery</span></span>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li>
                                                        <div className='d-flex'>
                                                            <div className="me-3">December 18, 2023</div>
                                                            <div className='color-order'>Order Ship Out
                                                                <br />
                                                                <span className='fs-14'>The order is out for delivery.</span>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li>
                                                        <div className='d-flex'>
                                                            <div className="me-3">December 13, 2023</div>
                                                            <div className='color-order fs-14'>Processing
                                                                <br />
                                                                <span className='fs-14'>The order is being processed.</span>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li>
                                                        <div className='d-flex'>
                                                            <div className="me-3">December 13, 2023</div>
                                                            <div className='color-order'>Payment has been received.
                                                            </div>
                                                        </div>
                                                    </li> */}

                                                    <li>
                                                        <div className='d-flex'>
                                                            <div className="me-3 completed">{orderPlaced}</div>
                                                            <div className='color-order text-black fs-16'><span className="fw-600">Order Placed</span>
                                                                <br />
                                                                <span className='fs-14'>Order Placed.</span>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    {isProcessing ?
                                                        <li>
                                                            <div className='d-flex'>
                                                                <div className="me-3 completed">{isProcessingDate}</div>
                                                                <div className='color-order text-black fs-16'><span className="fw-600">Processing</span>
                                                                    <br />
                                                                    <span className='fs-14'>The order is being processed.</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        :
                                                        null
                                                    }

                                                    {isShipped ?
                                                        <li>
                                                            <div className='d-flex'>
                                                                <div className="me-3 completed">{isShippedDate}</div>
                                                                <div className='color-order text-black fs-16'><span className="fw-600">Order Shipped</span>
                                                                    <br />
                                                                    <span className='fs-14'>The order is out for delivery.</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        :
                                                        null
                                                    }

                                                    {isDelivered ?
                                                         <li>
                                                            <div className='d-flex'>
                                                                <div className="me-3 completed">{isDeliveredDate}</div>
                                                                <div className='color-order text-black fs-16'><span className="fw-600">Delivered</span>
                                                                    <br />
                                                                    {/* <span className='fs-14'>The order has been delivered.<span className='text-gold'> View Proof of Delivery</span></span> */}
                                                                    <span className='fs-14'>The item has been delivered.</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        :
                                                        null
                                                    }

                                                    {isCompleted ?
                                                         <li>
                                                            <div className='d-flex'>
                                                                <div className="me-3 completed">{isCompletedDate}</div>
                                                                <div className='color-order text-black fs-16'><span className="fw-600">Completed</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        :
                                                        null
                                                    }

                                                </ul>
                                            </div>
                                        </Col>
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
                                                {user.first_name}
                                                &nbsp;
                                                {user.last_name}
                                            </span>
                                            <span className='ms-3 active-now fs-14 fw-400'>{user.status}</span>
                                        </div>
                                        <div className="cursor-pointer" onClick={() => setChatBox(false)}>
                                            <IoCloseOutline color="#39393A" />
                                        </div>
                                    </div>
                                </Card.Header>

                                <Card.Body>
                                    <div>
                                        <span className='d-flex user-image'>
                                            {user.image && (
                                                <div
                                                    className='user-photo'
                                                    style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${user.image})` }}
                                                >
                                                </div>
                                            )}

                                            <div className="designer-info mx-2">

                                                <div>
                                                    <p className="fs-14 fw-600 mb-0 name-of-user-chat ms-2">
                                                        <span className=''>{user.first_name}{user.last_name}</span>
                                                        <span className='ms-3 fs-14 time-chat fw-400'>2:23 PM</span>
                                                    </p>
                                                </div>

                                                <div className='fs-14 ms-2 mt-2 name-of-user-chat'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam.</div>
                                            </div>
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

                                        <img src={User} className='placeholder-chat ms-3' />
                                    </div>

                                    <div>
                                        <InputEmoji
                                            value={text}
                                            onChange={setText}
                                            cleanOnEnter
                                            onEnter={handleOnEnter}
                                            placeholder="Type a message"
                                            className="emoji-picker"
                                        />
                                        <div className='cursor-pointer position-absolute attach-icon' onClick={() => toggleUnderConstruction("")}><IoIosAttach size={20} /></div>
                                        <div>
                                            <div
                                                className="cursor-pointer fw-500 position-absolute send-button"
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

export default OrderTracking;