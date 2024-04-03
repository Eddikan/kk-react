import React, { useEffect, useState } from 'react';
import { useNavigate, useParams,Link,useLocation } from 'react-router-dom';
import LayoutNoFooter from 'Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Modal, Card } from 'react-bootstrap';
import 'Assets/styles/DesignerCalendar/style.css'
import GoBack from 'Components/Shared/GoBack';
import 'Assets/styles/Order/style.css';
import User from 'Assets/images/user.png';
import { useCookies } from 'react-cookie';
import { IoEyeOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { CgTrack } from "react-icons/cg";
import { GrStatusInfo } from "react-icons/gr";
import { PiEyeSlash,PiEyeLight  } from "react-icons/pi";
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import toast from 'react-hot-toast';
import axios from "axios";

const initialStatus = {
    status: ''
};

const initialOrderStatus = {
    status: ''
};

const OrderDetails = (props) => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'token', 'userRole']);
    const token = cookies.token;
    const currentUser = cookies.currentUser;
    const [reloadCount, setReloadCount] = useState(0);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [chatBox, setChatBox] = useState(false);

    const [orders, setOrders] = useState('');
    const [order, setOrder] = useState('');
    const [orderItemId, setOrderItemId] = useState('');
    const [orderItems, setOrderItems] = useState('');
    const [orderStatus, setOrderStatus] = useState('');
    const [orderLoading, setOrderLoading] = useState(true);
    const [orderItemsFormData, setOrderItemsFormData] = useState(initialStatus);
    const [orderStatusFormData, setOrderStatusFormData] = useState(initialOrderStatus);
    const [updateStatusShow, setUpdateStatusShow] = useState(false);
    const [updateOrderStatusShow, setUpdateOrderStatusShow] = useState(false);

    const [survey, setSurvey] = useState('');
    const [user, setUser] = useState('');
    const [reorderLoading, setReorderLoading] = useState(false);
    const [disabledSurvey,setDisabledSurvey] = useState(false);
    
    // const [orderStatus, setOrderStatus] = useState('All');

    function toggleUpdateStatus(order_item_id) {
        setUpdateStatusShow(true);
        setOrderItemId(order_item_id);

        getOrderItemLog(order_item_id)
            .then((response) => {
                setOrderLoading(false);
                const selectedOrderItemLog = response.data.data;
                if (selectedOrderItemLog) {
                    setOrderItems(selectedOrderItemLog);
                } else {
                    // toast.error('There has been an error getting the order item log, please try again!');
                    setOrderLoading(false);
                }
                console.log("response",selectedOrderItemLog);
            })
            .catch((error) => {
                // toast.error('There has been an error getting the order item log, please try again!');
                setOrderLoading(false);
            });
    }

    function toggleUpdateOrderStatus() {
        setUpdateOrderStatusShow(true);

        getOrder()
            .then((response) => {
                const selectedOrder = response.data;
                if (selectedOrder) {
                    setOrders(selectedOrder);
                    setDisabledSurvey(selectedOrder);
                    setOrderStatus(selectedOrder);
                    setOrder(selectedOrder[0].order);
                    setUser(selectedOrder[0].user);
                    setSurvey(selectedOrder[0].survey);
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
    }

    const handleChangeStatus = (e) => {
        const { name, value } = e.target;
        setOrderItemsFormData({
            ...orderItemsFormData,
            [name]: value,
        });
    };

    const handleChangeOrderStatus = (e) => {
        const { name, value } = e.target;
        setOrderStatusFormData({
            ...orderStatusFormData,
            [name]: value,
        });
    };

    const getOrder = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'order/' + orderId);
    };

    const getOrderItemLog = async (order_item_id) => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'order/item/log/' + order_item_id);
    };

    const postOrderItemLog = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'order/item/log', data);
    };

    const putOrder = async (data) => {
        return await axios.put(process.env.REACT_APP_API_ENDPOINT + 'order/' + orderId,data);
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

    const statusSubmit = (e) => {
        setOrderLoading(true);
        postOrderItemLog({ ...orderItemsFormData, order_id: orderItems.id, user_id: currentUser, order_item_id: orderItemId }).then(response => {
            const status = response.data.status;
            if (status === "Success") {
                setOrderLoading(false);
                setOrderItemsFormData(initialStatus);
                toast.success('Status updated successfully!');
                setReloadCount((prevReloadCount) => prevReloadCount + 1);
                setUpdateStatusShow(false);
            } else {
                setUpdateStatusShow(false);
                setOrderLoading(false);
                toast.error('There has been an error saving the status, please try again!');
            }
        }).catch(() => {
            toast.error('There has been an error saving the status, please try again!');
        });
    }

    const statusOrderSubmit = (e) => {
        setOrderLoading(true);
        putOrder({ ...orderStatusFormData, order_id: order.id}).then(response => {
            const status = response.data.status;
            if (status === "Success") {
                setOrderLoading(false);
                setOrderStatusFormData(initialOrderStatus);
                toast.success('Order Status updated successfully!');
                setUpdateOrderStatusShow(false);
                setReloadCount((prevReloadCount) => prevReloadCount + 1);
            } else {
                setOrderLoading(false);
                toast.error('There has been an error saving the status, please try again!');
            }
        }).catch(() => {
            toast.error('There has been an error saving the status, please try again!');
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
                    setSurvey(selectedOrder[0].survey);
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
            <section className='bg-white'>
                <Container className='container-order position-relative'>
                    <Row>
                        <Col lg={12}>
                            <Row className="pb-2">
                                <Col md={6} className='d-flex justify-content-left align-items-center'>
                                    <h3 className="fs-30 fw-600 text-black mb-0">Order Details</h3>
                                </Col>
                                <Col md={6} className="text-right">
                                    <GoBack fallBack="/#" />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6} className='d-flex align-items-center'>
                                    <h4 className="fs-20 mb-3"><strong>Order #{orderId}</strong></h4>
                                </Col>

                                <Col md={6} className='text-right'>
                                {survey === '' ?
                                    <>
                                        <button className='btn btn-primary mb-3 me-3' disabled>
                                            <PiEyeSlash  className="me-2" size={20}/>
                                            View Survey
                                        </button>
                                    </>
                                    : 
                                    <>
                                        <Link to={`/view/order/${orderId}/survey/${survey.id}`} className="text-decoration-none">
                                            <button className='btn btn-primary mb-3 me-3'>
                                            <PiEyeLight className="me-2" size={20}/>View Survey
                                            </button>
                                        </Link>
                                     </> 
                                }
                                    <button 
                                    className='btn btn-primary mb-3' 
                                    onClick={() => toggleUpdateOrderStatus(order.id)}
                                    >
                                        Order Status
                                    </button>
                                </Col>
                            </Row>
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

                                                        console.log(order);

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
                                                                                    <div className=''>
                                                                                        <strong> 
                                                                                            {order.user.first_name}  
                                                                                            {order.user.last_name} 
                                                                                            </strong>
                                                                                            </div>
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

                                                                                        return (
                                                                                            <>
                                                                                                <Row className='align-items-center'>
                                                                                                    <Col lg={4} className='d-flex align-items-center'>
                                                                                                        <div className="designs-grid-div fabric-image"
                                                                                                            style={{ backgroundImage: "url(" + orderItemImage + ")", minHeight: '55px' }}>
                                                                                                        </div>

                                                                                                        <span className='d-flex text-black ms-3'>
                                                                                                            {order_item_product.name}
                                                                                                        </span>
                                                                                                    </Col>

                                                                                                    <Col lg={3} className="text-right">
                                                                                                        <span className='text-black'>${order_item_product.price}</span>
                                                                                                    </Col>

                                                                                                    <Col lg={2} className="text-right">
                                                                                                        <span className='text-black'>{order_item.quantity}</span>
                                                                                                    </Col>

                                                                                                    <Col lg={3}>
                                                                                                        <a href={`/product/${order_item_product.id}`} className="cursor-pointer check-datails-decoration" >
                                                                                                            <p className='text-gold mb-1'><IoEyeOutline className='me-2' size={20} />View Product</p>
                                                                                                        </a>
                                                                                                        <a href={`/order/${order_item.id}/track`} className="cursor-pointer check-datails-decoration">
                                                                                                            <p className='text-black mb-1'><CgTrack className='me-2' size={20} />Track</p>
                                                                                                        </a>

                                                                                                        <div className="cursor-pointer" onClick={() => toggleUpdateStatus(order_item.id)}>
                                                                                                            <p className='text-black mb-0'><GrStatusInfo className='gr-status-icon' size={15} />Update Status</p>
                                                                                                        </div>
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
                                                    <p className="mb-0">{user?.city}, {user?.province} {user?.postal_code}</p>
                                                    <p className="mb-0">{user?.country}</p>
                                                </>
                                            }
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Modal
                show={updateStatusShow}
                className='modal-preview'
                fade={false}
                centered
            >
                <Modal.Header className="pb-0">
                    <Modal.Title className='rufina-family fs-22 text-black'>Update Status</Modal.Title>
                    <button type='button' className='close react-modal-close' onClick={function () { setUpdateStatusShow(false); }} >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <div>
                                <label htmlFor="orderStatus" className='mb-2'>Status:</label>
                                    <select
                                        id="orderStatus"
                                        name='status'
                                        className='form-control mb-1'
                                        value={orderItems.status}
                                        onChange={handleChangeStatus}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Order Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card.Footer className="text-right mt-3">
                        <button
                            className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
                            onClick={() => setUpdateStatusShow(false)}
                            type="button"
                        >
                            Cancel
                        </button>

                        {orderLoading ?
                            <button
                                className="btn btn-primary btn-style"
                                type="button"
                            >
                                Saving...
                            </button>
                            :
                            <button
                                className="btn btn-primary btn-style"
                                type="button"
                                onClick={statusSubmit}
                            >
                                Save
                            </button>
                        }
                    </Card.Footer>
                </Modal.Body>
            </Modal>


            <Modal
                show={updateOrderStatusShow}
                className='modal-preview'
                fade={false}
                centered
            >
                <Modal.Header className="pb-0">
                    <Modal.Title className='rufina-family fs-22 text-black'>Update Order Status</Modal.Title>
                    <button type='button' className='close react-modal-close' onClick={function () { setUpdateOrderStatusShow(false); }} >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <div>
                                <label htmlFor="orderStatus" className='mb-2'>Status:</label>
                                    <select
                                        id="orderStatus"
                                        name='status'
                                        className='form-control mb-1'
                                        value={orderStatus.status}
                                        onChange={handleChangeOrderStatus}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Order Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card.Footer className="text-right mt-3">
                        <button
                            className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
                            onClick={() => setUpdateOrderStatusShow(false)}
                            type="button"
                        >
                            Cancel
                        </button>

                        {orderLoading ?
                            <button
                                className="btn btn-primary btn-style"
                                type="button"
                            >
                                Saving...
                            </button>
                            :
                            <button
                                className="btn btn-primary btn-style"
                                type="button"
                                onClick={statusOrderSubmit}
                            >
                                Save
                            </button>
                        }
                    </Card.Footer>
                </Modal.Body>
            </Modal>
        </LayoutNoFooter >
    );
};

export default OrderDetails;