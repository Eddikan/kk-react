import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Modal, Card } from 'react-bootstrap';
import 'Assets/styles/DesignerCalendar/style.css'
import GoBack from 'Components/Shared/GoBack';
import 'Assets/styles/Order/style.css';
import User from 'Assets/images/user.png';
import { useCookies } from 'react-cookie';
import { AiFillMessage } from "react-icons/ai";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { GoAlertFill } from 'react-icons/go';
import { IoCloseOutline } from "react-icons/io5";
import { IoMdStarOutline, IoIosAttach } from "react-icons/io";
import { VscSend } from "react-icons/vsc";
import InputEmoji from 'react-input-emoji'
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import toast from 'react-hot-toast';
import axios from "axios";


const initialCheckOut = {
    card_name: '',
    card_number: '',
    date: ''
};

const Orders = (props) => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'token', 'userRole']);
    const token = cookies.token;
    const currentUser = cookies.currentUser;
    const [reloadCount, setReloadCount] = useState(0);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');

    const [allShow, setAllShow] = useState(true);
    const [pendingShow, setPendingShow] = useState(false);
    const [processShow, setProcessShow] = useState(false);
    const [shippedShow, setShippedShow] = useState(false);
    const [deliveredShow, setDeliveredShow] = useState(false);
    const [reviewShow, setReviewShow] = useState(false);
    const [completedShow, setCompletedShow] = useState(false);
    const [chatBox, setChatBox] = useState(false);
    const [fabrics, setFabrics] = useState('');
    const [orders, setOrders] = useState('');
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [designerName, setDesignerName] = useState('');
    const [text, setText] = useState('');
    const [reorderLoading, setReorderLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState('All');


    const showTab = (tab) => {
        if (tab == "all") {
            setAllShow(true);
            setPendingShow(false);
            setProcessShow(false);
            setShippedShow(false);
            setDeliveredShow(false);
            setReviewShow(false);
            setCompletedShow(false);
            setOrderStatus('All');

        } else if (tab === "pending") {
            setAllShow(false);
            setPendingShow(true);
            setProcessShow(false);
            setShippedShow(false);
            setDeliveredShow(false);
            setReviewShow(false);
            setCompletedShow(false);
            setOrderStatus('Pending');

        } else if (tab === "processing") {
            setAllShow(false);
            setPendingShow(false);
            setProcessShow(true);
            setShippedShow(false);
            setDeliveredShow(false);
            setReviewShow(false);
            setCompletedShow(false);
            setOrderStatus('Processing');

        } else if (tab === "shipped") {
            setAllShow(false);
            setPendingShow(false);
            setProcessShow(false);
            setShippedShow(true);
            setDeliveredShow(false);
            setReviewShow(false);
            setCompletedShow(false);
            setOrderStatus('Shipped');

        } else if (tab === "delivered") {
            setAllShow(false);
            setPendingShow(false);
            setProcessShow(false);
            setShippedShow(false);
            setDeliveredShow(true);
            setReviewShow(false);
            setCompletedShow(false);
            setOrderStatus('Delivered');

        } else if (tab === "review") {
            setAllShow(false);
            setPendingShow(false);
            setProcessShow(false);
            setShippedShow(false);
            setDeliveredShow(false);
            setReviewShow(true);
            setCompletedShow(false);
            setOrderStatus('Reviewed');

        } else if (tab === "completed") {
            setAllShow(false);
            setPendingShow(false);
            setProcessShow(false);
            setShippedShow(false);
            setDeliveredShow(false);
            setReviewShow(false);
            setCompletedShow(true);
            setOrderStatus('Completed');
        }
        setReloadCount(reloadCount + 1);
    }

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    function handleOnEnter(text) {
        console.log('enter', text)
    }

    const getOrders = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '/order?status='+orderStatus);
    };

    const chatBoxModal = (first_name, last_name, image) => {
        setChatBox(true);

        setDesignerName({
            first_name: first_name || '-',
            last_name: last_name || '-',
            image: image || '-'
        })
    };

    async function reorderProducts(e) {
        // setReorderLoading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'cart/bulk', { order_items: e, user_id: currentUser }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                const data = response.data.data;
                navigate("/cart");
            } else {
                const errors = response.data.errors;
                errors.map((error, index) => {
                    toast.error(error);
                    return null; // React requires a return value, so we return null here
                });

            }
            // setReorderLoading(false);
        }).catch((error) => {
            // setReorderLoading(false);
            toast.error('Something went wrong, please contact the administrator!');
        });

    }

    useEffect(() => {
        document.body.classList.add('designer-calendar-body');
    }, []);

    useEffect(() => {
        setOrdersLoading(true);
        getOrders()
            .then((response) => {
                const selectedOrders = response.data.data;
                if (selectedOrders) {
                    setOrders(selectedOrders);
                    setOrdersLoading(false);
                } else {
                    toast.error('There has been an error getting the orders');
                    setOrdersLoading(false);
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the orders');
                setOrdersLoading(false);
            });
    }, [reloadCount]);

    return (
        <LayoutNoFooter className='bg-white'>
            <section className='bg-white'>
                <Container className='container-order position-relative'>
                    <Row>
                        <Col lg={12}>
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
                        <Col lg={3}>
                            <Row className="mb-3">
                                <Col>
                                    <Card>
                                        <Card.Body className='bg-light'>
                                            <span className='fw-500 text-black'>Status</span>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            <Card className='mb-3'>
                                <Card.Body>
                                    <p className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${allShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("all"); }}>All</p>
                                    <p className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${pendingShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("pending"); }}>Pending</p>
                                    <p className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${processShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("processing"); }}>Processing</p>
                                    <p className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${shippedShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("shipped"); }}>Shipped</p>
                                    <p className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${deliveredShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("delivered"); }}>Delivered</p>
                                    <p className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${reviewShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("review"); }}>Review and Feedback</p>
                                    <p className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${completedShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("completed"); }}>Completed</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={9}>
                            <Row className="mb-2">
                                <Col>
                                    <Card>
                                        <Card.Body className='bg-light'>
                                            <Row>
                                                <Col lg={3}>
                                                    <span className='fw-500 text-black'>Date</span>
                                                </Col>

                                                <Col lg={3} className="text-right">
                                                    <span className='fw-500 text-black'># of Items</span>
                                                </Col>

                                                <Col lg={3} className="text-right">
                                                    <span className='fw-500 text-black'>Total Amount</span>
                                                </Col>

                                                <Col lg={3} className="text-right">
                                                    <span className='fw-500 text-black'></span>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            {ordersLoading ?
                                <>
                                    <Card className="mt-3">
                                        <Card.Body>
                                            <p className="mb-0 text-center">Loading...</p>
                                        </Card.Body>
                                    </Card>
                                </>
                                :
                                <>
                                    {orders ?
                                        <>
                                            {orders.length > 0 ?
                                                <>
                                                    {orders.map((order) => {
                                                        var order_items = order.order_items;
                                                        var order_product = order_items[0].product;
                                                        if (order_product.image_urls) {
                                                            var image_urls = JSON.parse(order_product.image_urls);
                                                            var cartItemImage = process.env.REACT_APP_STORAGE_URL + 'product/' + image_urls[0].image_url;
                                                        } else {
                                                            var cartItemImage = PlaceholderImage;
                                                        }

                                                        const options = {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        };
                                                        const created_at = (new Date(order.created_at)).toLocaleDateString('en-ES', options);

                                                        // Use map() to extract quantities from each item
                                                        var quantities = order_items.map(function(item) {
                                                            return parseInt(item.quantity);
                                                        });

                                                        // Use reduce() to calculate the sum of quantities
                                                        var number_of_items = quantities.reduce(function(total, quantity) {
                                                            return total + quantity;
                                                        }, 0);


                                                        return (

                                                            <Row className='mb-2'>
                                                                <Col lg={12}>
                                                                    <Card className='mt-2 border-card'>
                                                                        <Card.Header className='order-chat d-flex justify-content-between'>
                                                                            <div>
                                                                                <strong>Order #{order.id}</strong>
                                                                            </div>
                                                                        </Card.Header>
                                                                        <Card.Body className='bg-white card-body-border'>
                                                                            <Row>
                                                                                <Col lg={3}>
                                                                                    <span className='text-black'>{created_at}</span>
                                                                                </Col>

                                                                                <Col lg={3} className="text-right">
                                                                                    <span className='text-black'>{number_of_items}</span>
                                                                                </Col>

                                                                                <Col lg={3} className="text-right">
                                                                                    <span className='text-black'>${order.total_amount}</span>
                                                                                </Col>

                                                                                <Col lg={3} className='text-right'>
                                                                                    <a href={`/order/${order.id}/details`} className="cursor-pointer check-datails-decoration" >
                                                                                        <span className='text-gold'><IoEyeOutline className='me-2' size={20} />View Details</span>
                                                                                    </a>
                                                                                    {/* {reorderLoading ?
                                                                                        <button type="button" className='btn btn-primary'>Loading...</button>
                                                                                        :
                                                                                        <button onClick={() => { reorderProducts(order_items); }}className='btn btn-primary'>Buy Again</button>
                                                                                    } */}
                                                                                </Col>
                                                                            </Row>
                                                                        </Card.Body>
                                                                    </Card>
                                                                </Col>
                                                            </Row>
                                                        );
                                                    })}

                                                </>
                                                :
                                                <>
                                                    <Card className='mt-3'>
                                                        <Card.Body>
                                                            <p className="mb-0 text-center">No records found.</p>
                                                        </Card.Body>
                                                    </Card>
                                                </>
                                            }
                                        </>
                                        :
                                        <>
                                            <Card className='mt-3'>
                                                <Card.Body>
                                                    <p className="mb-0 text-center">No records found.</p>
                                                </Card.Body>
                                            </Card>
                                        </>
                                    }
                                </>
                            }
                        </Col>
                    </Row>

                    {chatBox ?
                        <>
                            <Card className='width-chat-card px-0'>
                                <Card.Header className='order-chat bg-white pt-3 pb-3'>
                                    <div className='d-flex justify-content-between'>
                                        <div>
                                            <span className="fs-14 fw-500 mb-0 name-of-user-chat">
                                                <span className='fw-500'>{designerName.first_name} {designerName.last_name}</span>
                                            </span>
                                            {/* <span className='ms-3 active-now fs-14 fw-400'>Active Now</span> */}
                                        </div>
                                        <div className="cursor-pointer" onClick={() => setChatBox(false)}>
                                            <IoCloseOutline color="#39393A" />
                                        </div>
                                    </div>
                                </Card.Header>

                                <Card.Body >
                                    <div>
                                        <span className='d-flex user-image'>
                                            {designerName.image && (
                                                <div
                                                    className='user-photo'
                                                    style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${designerName.image})` }}
                                                >
                                                </div>
                                            )}

                                            <div className="designer-info mx-2">

                                                <div>
                                                    <p className="fs-14 fw-600 mb-0 name-of-user-chat ms-3">
                                                        <span className=''>{designerName.first_name}{designerName.last_name}</span>
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

export default Orders;