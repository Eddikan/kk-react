import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Modal, Card } from 'react-bootstrap';
import '../Assets/styles/DesignerCalendar/style.css'
import GoBack from 'Components/Shared/GoBack';
import '../Assets/styles/Order/style.css';
import User from '../Assets/images/user.png';
import { useCookies } from 'react-cookie';
import { AiFillMessage } from "react-icons/ai";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { GoAlertFill } from 'react-icons/go';
import { IoCloseOutline } from "react-icons/io5";
import { IoMdStarOutline, IoIosAttach } from "react-icons/io";
import { CgTrack } from "react-icons/cg";

import { VscSend } from "react-icons/vsc";
import InputEmoji from 'react-input-emoji'
import PlaceholderImage from '../Assets/images/placeholders/image.png';
import toast from 'react-hot-toast';
import axios from "axios";
import CurrencyConverter from 'Utils/CurrencyConverter';
import { FaBoxOpen } from "react-icons/fa6";


const initialCheckOut = {
    card_name: '',
    card_number: '',
    date: ''
};

const Orders = (props) => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [cookies, setCookie, removeCookie] = useCookies(['userCurrency', 'userCurrencyCode', 'currencyConversions', 'selectedCurrency', 'selectedCurrencyCode', 'currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'selectedCountry', 'tempCart', 'cartItemCount']);
    const token = cookies.token;
    const currentUser = cookies.currentUser;
    const current_user_id = cookies.currentUser;
    const currencyConversions = cookies.currencyConversions ?? {};
    const selectedCurrencyCode = cookies.selectedCurrencyCode || cookies.userCurrencyCode || '$'
    const [reloadCount, setReloadCount] = useState(0);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');

    const [chatBox, setChatBox] = useState(false);
    const [fabrics, setFabrics] = useState('');
    const [orders, setOrders] = useState('');
    const [order, setOrder] = useState('');
    const [user, setUser] = useState('');
    const [orderLoading, setOrderLoading] = useState(true);
    const [designerName, setDesignerName] = useState('');
    const [text, setText] = useState('');
    const [reorderLoading, setReorderLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState('All');

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    function handleOnEnter(text) {
        console.log('enter', text)
    }

    const getOrder = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'order/' + orderId + '?current_user_id=' + current_user_id + '&token=' + token);
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
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'cart/bulk?current_user_id=' + current_user_id + '&token=' + token, { order_items: e, user_id: currentUser }).then((response) => {
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
        setOrderLoading(true);
        getOrder()
            .then((response) => {
                const selectedOrder = response.data;
                if (selectedOrder) {
                    setOrders(selectedOrder);
                    setOrder(selectedOrder[0].order);
                    setUser(selectedOrder[0].user);
                    setOrderLoading(false);
                } else {
                    toast.error('There has been an error getting the orders');
                    setOrderLoading(false);
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the orders');
                setOrderLoading(false);
            });
    }, [reloadCount]);

    return (
        <LayoutNoFooter className='bg-white'>
            <section className='bg-white pb-5 pt-30 px-5'>
                <Container className='position-relative'>
                    <Row>
                        <Col lg={12}>
                            <Row className="pb-4">
                                <Col md={6} className='d-flex justify-content-left align-items-center'>
                                    <h3 className="fs-30 fw-600 text-black mb-0">Order Details</h3>
                                </Col>
                                <Col md={6} className="text-right">
                                    <GoBack fallBack="/#" />
                                </Col>
                            </Row>
                            <h4 className="fs-20 mb-3"><strong>Order #{orderId}</strong></h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={8}>
                            <Row className="mb-2">
                                <Col lg={12}>
                                    <Card>
                                        <Card.Body className='bg-light'>
                                            <Row>
                                                <Col lg={4}>
                                                    <span className='fw-500 text-black'>Item</span>
                                                </Col>

                                                <Col lg={3} className="text-right">
                                                    <span className='fw-500 text-black'>Price</span>
                                                </Col>

                                                <Col lg={2} className="text-right">
                                                    <span className='fw-500 text-black'>Quantity</span>
                                                </Col>

                                                <Col lg={3} className="">
                                                    <span className='fw-500 text-black'>Action</span>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            {orderLoading ?
                                <>
                                    <Card className="mt-2">
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
                                                        const created_at = (new Date(order.order.created_at)).toLocaleDateString('en-ES', options);

                                                        return (
                                                            <Row className="mb-2">
                                                                <Col lg={12}>
                                                                    <Card className='mt-2 border-card'>
                                                                        <Card.Header className='order-chat d-flex justify-content-between'>
                                                                            <div>
                                                                                <div className='d-flex align-items-center user-image-order'>
                                                                                    {order.user.image && (
                                                                                        <div
                                                                                            className='user-photo-order me-2'
                                                                                            style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${order.user.image})` }}
                                                                                        >
                                                                                        </div>
                                                                                    )}
                                                                                    <div className=''><strong> {order.user.first_name}  {order.user.last_name} </strong></div>
                                                                                    {/* <AiFillMessage className='ms-2 text-gold cursor-pointer'
                                                                                onClick={function () { chatBoxModal(order.user.first_name, order.user.last_name, order.user.image) }}
                                                                            /> */}
                                                                                </div>
                                                                            </div>
                                                                        </Card.Header>
                                                                        <Card.Body className='bg-white card-body-border'>
                                                                            {order_items && order_items.length > 0 ?
                                                                                <>
                                                                                    {order_items.map((order_item, index) => {
                                                                                        var order_item_product = order_item.product;
                                                                                        if (order_item_product.image_urls) {
                                                                                            var image_urls = JSON.parse(order_item_product.image_urls);
                                                                                            var orderItemImage = process.env.REACT_APP_STORAGE_URL + 'product/' + image_urls[0].image_url;
                                                                                        } else {
                                                                                            var orderItemImage = PlaceholderImage;
                                                                                        }

                                                                                        const productPrice = order_item_product.price ?? '0';

                                                                                        const productCurrency = order_item_product.currency ?? 'USD';

                                                                                        const convertedPrice = CurrencyConverter(productPrice, productCurrency, cookies);

                                                                                        return (
                                                                                            <>
                                                                                                <Row className='align-items-center'>
                                                                                                    <Col lg={4} className='d-flex align-items-center'>
                                                                                                        <div className="designs-grid-div fabric-image"
                                                                                                            style={{ backgroundImage: "url(" + orderItemImage + ")", minHeight: '55px' }}>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <span className='d-flex text-black ms-3'>
                                                                                                                {order_item_product.name}
                                                                                                            </span>
                                                                                                            <p className='text-black ms-3'>
                                                                                                                <FaBoxOpen /> {order_item.status}
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    </Col>

                                                                                                    <Col lg={3} className="text-right">
                                                                                                        <span className='text-black'>{convertedPrice.currency_code}{convertedPrice.price}</span>
                                                                                                    </Col>

                                                                                                    <Col lg={2} className="text-right">
                                                                                                        <span className='text-black'>{order_item.quantity}</span>
                                                                                                    </Col>

                                                                                                    <Col lg={3}>
                                                                                                        <a href={`/product/${order_item_product.id}`} className="cursor-pointer check-datails-decoration" >
                                                                                                            <p className='text-gold mb-1'><IoEyeOutline className='me-2' size={20} />View Product</p>
                                                                                                        </a>
                                                                                                        <a href={`/order/${order_item.id}/track`} className="cursor-pointer check-datails-decoration">
                                                                                                            <p className='text-black mb-0'><CgTrack className='me-2' size={20} />Track</p>
                                                                                                        </a>
                                                                                                        {/* {reorderLoading ?
                                                                                                            <button type="button" className='btn btn-primary'>Loading...</button>
                                                                                                            :
                                                                                                            <button onClick={() => { reorderProducts(order_items); }}className='btn btn-primary'>Buy Again</button>
                                                                                                        } */}
                                                                                                    </Col>
                                                                                                </Row>
                                                                                                {order_items.length > 1 && index + 1 < order_items.length ?
                                                                                                    <hr />
                                                                                                    :
                                                                                                    null
                                                                                                }
                                                                                            </>
                                                                                        );
                                                                                    })}
                                                                                </>
                                                                                :
                                                                                <p className="text-center mb-0">No records found.</p>
                                                                            }
                                                                        </Card.Body>
                                                                    </Card>
                                                                </Col>
                                                            </Row>
                                                        );
                                                    })}

                                                </>
                                                :
                                                <>
                                                    <Card className='mt=2'>
                                                        <Card.Body>
                                                            <p className="mb-0 text-center">No records found.</p>
                                                        </Card.Body>
                                                    </Card>
                                                </>
                                            }
                                        </>
                                        :
                                        <>
                                            <Card className='mt-2'>
                                                <Card.Body>
                                                    <p className="mb-0 text-center">No records found.</p>
                                                </Card.Body>
                                            </Card>
                                        </>
                                    }
                                </>
                            }
                        </Col>
                        <Col lg={4}>
                            <Row>
                                <Col lg={12}>
                                    <Card className="mb-3">
                                        <Card.Body className='bg-light'>
                                            <Row>
                                                <Col lg={12}>
                                                    <span className='fw-500 text-black'>Billing Address</span>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className='mb-3'>
                                        <Card.Body>
                                            <p className="mb-2"><strong>Payment Status: </strong>{order.payment_status ?? 'Pending'}</p>
                                            {order.first_name && order.last_name ?
                                                <>
                                                    <p className="mb-1">{order?.first_name} {order?.last_name}</p>
                                                </>
                                                :
                                                <>
                                                    <p className="mb-1">{user?.first_name} {user?.last_name}</p>
                                                </>
                                            }
                                            {order.address_line_1 && order.city && order.province && order.country && order.postal_code ?
                                                <>
                                                    <p className="mb-0">{order?.address_line_1}</p>
                                                    <p className="mb-0">{order.city}, {order.province} {order.postal_code}</p>
                                                    <p className="mb-0">{order.country}</p>
                                                </>
                                                :
                                                <>
                                                    <p className="mb-0">{user?.address_line_1}</p>
                                                    <p className="mb-0">{user.city}, {user.province} {user.postal_code}</p>
                                                    <p className="mb-0">{user.country}</p>
                                                </>
                                            }

                                        </Card.Body>
                                    </Card>
                                    <Card className="mb-3">
                                        <Card.Body className='bg-light'>
                                            <Row>
                                                <Col lg={12}>
                                                    <span className='fw-500 text-black'>Shipping Address</span>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className='mb-3'>
                                        <Card.Body>
                                            <p className="mb-2"><strong>Fulfillment Status: </strong>{order.status ?? 'Pending'}</p>
                                            {order.delivery_first_name && order.delivery_last_name ?
                                                <>
                                                    <p className="mb-1">{order?.delivery_first_name} {order?.delivery_last_name}</p>
                                                </>
                                                :
                                                <>
                                                    <p className="mb-1">{user?.first_name} {user?.last_name}</p>
                                                </>
                                            }
                                            {order.delivery_address_line_1 && order.delivery_city && order.delivery_province && order.delivery_country && order.delivery_postal_code ?
                                                <>
                                                    <p className="mb-0">{order?.delivery_address_line_1}</p>
                                                    <p className="mb-0">{order.delivery_city}, {order.delivery_province} {order.delivery_postal_code}</p>
                                                    <p className="mb-0">{order.delivery_country}</p>
                                                </>
                                                :
                                                <>
                                                    <p className="mb-0">{user?.address_line_1}</p>
                                                    <p className="mb-0">{user.city}, {user.province} {user.postal_code}</p>
                                                    <p className="mb-0">{user.country}</p>
                                                </>
                                            }

                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
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