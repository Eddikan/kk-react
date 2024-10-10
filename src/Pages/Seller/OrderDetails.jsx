import React, { useEffect, useState } from 'react';
import { useNavigate, useParams,Link,useLocation } from 'react-router-dom';
import LayoutNoFooter from 'Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Modal, Card } from 'react-bootstrap';
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
import CurrencyConverter from 'Utils/CurrencyConverter';

const initialStatus = {
    status: ''
};

const initialOrderStatus = {
    status: 'Pending'
};

const initialLogStatus = {
    status: ''
};

const OrderDetails = (props) => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [cookies, setCookie, removeCookie] = useCookies(['userCurrency', 'userCurrencyCode', 'currencyConversions', 'selectedCurrency', 'selectedCurrencyCode', 'currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'selectedCountry', 'tempCart', 'cartItemCount']);
    const token = cookies.token;
    const currentUser = cookies.currentUser;
    const currencyConversions = cookies.currencyConversions;
    const [reloadCount, setReloadCount] = useState(0);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [chatBox, setChatBox] = useState(false);

    const [orders, setOrders] = useState('');
    const [order, setOrder] = useState('');
    const [orderItemId, setOrderItemId] = useState('');
    const [orderItemsId, setOrderItemsId] = useState('');
    const [singleOrderItem, setSingleOrderItem] = useState('');
    const [orderItemLog, setOrderItemLog] = useState('');
    const [orderStatus, setOrderStatus] = useState('');
    const [orderLoading, setOrderLoading] = useState(true);
    const [orderItemLogFormData, setOrderItemLogFormData] = useState(initialLogStatus);
    const [orderFormData, setOrderFormData] = useState(initialOrderStatus);
    const [updateStatusShow, setUpdateStatusShow] = useState(false);
    const [updateOrderStatusShow, setUpdateOrderStatusShow] = useState(false);
    const [orderItemCompleteStatus, setOrderItemCompleteStatus] = useState('');

    const [orderCompleteStatus, setOrderCompleteStatus] = useState('');

    const [orderItemsLog, setOrderItemsLog] = useState('');


    const [survey, setSurvey] = useState('');
    const [user, setUser] = useState('');
    const [reorderLoading, setReorderLoading] = useState(false);
    const [disabledSurvey,setDisabledSurvey] = useState(false);

    const [item, setItem] = useState('');
    const [itemStatus, setItemStatus] = useState('');

    function toggleUpdateStatus(order_item_id) {
        setUpdateStatusShow(true);
        setOrderItemId(order_item_id);

        getOrderStatus(order_item_id)
            .then((response) => {
                setOrderLoading(false);
                const status = response.data.status;
                if (status === 'Success') {
                    const data = response.data.data;
                    setItem(data.item);
                    setItemStatus(data.item.status)

                    console.log(data.item);
                } else {
                    toast.error('There has been an error getting the order item log, please try again!');
                    setOrderLoading(false);
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the order item log, please try again!');
                setOrderLoading(false);
            });



        // getOrderItemLog(order_item_id)
        //     .then((response) => {
        //         setOrderLoading(false);
        //         const selectedOrderItemLog = response.data.data;
        //         if (selectedOrderItemLog) {
        //             setOrderItemCompleteStatus(selectedOrderItemLog.order_item_log ?? initialLogStatus);
        //             setOrderItemLog(selectedOrderItemLog.order_item_log ?? initialLogStatus);
        //             setOrderItemLogFormData(selectedOrderItemLog.order_item_log ?? initialLogStatus);

        //             console.log("order_item_id",order_item_id);
        //         } else {
        //             toast.error('There has been an error getting the order item log, please try again!');
        //             setOrderLoading(false);
        //         }
        //     })
        //     .catch((error) => {
        //         toast.error('There has been an error getting the order item log, please try again!');
        //         setOrderLoading(false);
        //     });
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
                    setOrderFormData({status: selectedOrder[0].order.status});
                    setOrderCompleteStatus({status: selectedOrder[0].order.status});
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
        setItem({
            [name]: value,
        });
    };

    const handleChangeOrderStatus = (e) => {
        console.log(e);
        const { name, value } = e.target;
        console.log(value);
        setOrderFormData({
            ...orderFormData,
            [name]: value,
        });
    };

    const getOrder = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'order/' + orderId);
    };

    const getOrderStatus = async (order_item_id) => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'item/' + order_item_id );
    };

    const getOrderItemLog = async (order_item_log) => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'order/item/' + order_item_log + '/log');
    };

    // const getOrderItemLogs = async (id) => {
    //     return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'order/item/' + id + '/log');
    // };

    const postOrderItemLog = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'order/item/log', data);
    };

    const putOrder = async (data) => {
        return await axios.put(process.env.REACT_APP_API_ENDPOINT + 'order/' + orderId ,data);
    };

    const putOrderStatus = async (data) => {
        return await axios.put(process.env.REACT_APP_API_ENDPOINT + 'item/' + orderItemId + '/status/update',data);
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

    // const statusSubmit = (e) => {
    //     setOrderLoading(true);
    //     postOrderItemLog({ ...orderItemLogFormData, order_id: orderId, user_id: currentUser, order_item_id: orderItemId }).then(response => {
    //         const status = response.data.status;
    //         if (status === "Success") {
    //             setOrderLoading(false);
    //             setOrderItemLogFormData(initialLogStatus);
    //             toast.success('Status updated successfully!');
    //             setReloadCount((prevReloadCount) => prevReloadCount + 1);
    //             setUpdateStatusShow(false);
    //         } else {
    //             setUpdateStatusShow(false);
    //             setOrderLoading(false);
    //             toast.error('There has been an error saving the status, please try again!');
    //         }
    //     }).catch(() => {
    //         toast.error('There has been an error saving the status, please try again!');
    //     });
    // }

    const statusOrderSubmit = (e) => {
        setOrderLoading(true);
        putOrder({ ...orderFormData, id: orderFormData.id}).then(response => {
            const status = response.data.status;
            if (status === "Success") {
                setOrderLoading(false);
                setOrderFormData(initialOrderStatus);
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

    const orderStatusSubmit = (e) => {
        setOrderLoading(true);
        putOrderStatus({ ...item }).then(response => {
            const status = response.data.status;
            if (status === "Success") {
                setOrderLoading(false);
                setOrderItemLogFormData(initialLogStatus);
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
                    setOrderFormData({status: selectedOrder[0].order.status});
                    setOrderLoading(false);
                    setOrderItemsLog(selectedOrder[0].order_items[0].id);
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
                                        {/* <button className='btn btn-primary mb-3' disabled>
                                            <PiEyeSlash  className="me-2" size={20}/>
                                            View Survey
                                        </button> */}
                                    </>
                                    : 
                                    <>
                                        <Link to={`/view/order/${orderId}/survey/${survey.id}`} className="text-decoration-none">
                                            <button className='btn btn-primary mb-3'>
                                            <PiEyeLight className="me-2" size={20}/>View Survey
                                            </button>
                                        </Link>
                                     </> 
                                }

                                {order.status === "Completed" ?
                                <>
                                </>
                                :
                                <>
                                <button 
                                    className='btn btn-primary mb-3 ms-3' 
                                    onClick={() => toggleUpdateOrderStatus(order.id)}
                                    >
                                        Order Status
                                    </button>
                                </>
                            }
                                    
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
                                                                                            &nbsp;
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
                                                                                        var order = order_item.order;
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

                                                                                                        <span className='d-flex text-black ms-3'>
                                                                                                            {order_item_product.name}
                                                                                                        </span>
                                                                                                    </Col>

                                                                                                    <Col lg={3} className="text-right">
                                                                                                        <span className='text-black'>{convertedPrice.currency_code}{convertedPrice.price}</span>
                                                                                                    </Col>

                                                                                                    <Col lg={2} className="text-right">
                                                                                                        <span className='text-black'>{order_item.quantity}</span>
                                                                                                    </Col>

                                                                                                    <Col lg={3}>
                                                                                                        <a href={`/product/${order_item_product.id}`} className="cursor-pointer check-datails-decoration" >
                                                                                                            <p className='text-gold mb-1'>
                                                                                                                <IoEyeOutline className='me-2 mb-1' size={20} />
                                                                                                                View Product
                                                                                                            </p>
                                                                                                        </a>
                                                                                                        <a href={`/order/${order_item.id}/track`} className="cursor-pointer check-datails-decoration">
                                                                                                            <p className='text-black mb-1'>
                                                                                                                <CgTrack className='me-2 mb-1' size={20} />
                                                                                                                Track
                                                                                                            </p>
                                                                                                        </a>

                                                                                                        {order_items[0].status === "Completed" ?
                                                                                                            null
                                                                                                            :
                                                                                                            <>
                                                                                                         <div className="cursor-pointer" onClick={() => toggleUpdateStatus(order_item.id)}>
                                                                                                            <p className='text-black mb-0'>
                                                                                                                <GrStatusInfo className='gr-status-icon mb-1' size={15} />
                                                                                                                Update Status
                                                                                                            </p>
                                                                                                        </div>
                                                                                                        </>
                                                                                                        }

                                                                                                
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

                            {item.status === "Completed" ?
                                <>
                                    <div><strong>Status:</strong>&nbsp;Completed</div>
                                </>
                                :
                                <>
                                    <label htmlFor="orderStatus" className='mb-2'>Status:</label>
                                        <select
                                            id="orderStatus"
                                            name='status'
                                            className='form-control mb-1'
                                            value={item.status}
                                            onChange={handleChangeStatus}
                                        >
                                            {itemStatus == "Pending" ?
                                                <>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Processing">Processing</option>
                                                </>
                                                : itemStatus== "Processing" ?
                                                <>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Order Shipped</option>
                                                </>
                                                : itemStatus == "Shipped" ?
                                                <>
                                                    <option value="Shipped">Order Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                </>
                                                : itemStatus == "Delivered" ?
                                                <>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Completed">Completed</option>
                                                </>
                                                : itemStatus == "Completed" ?
                                                <>
                                                    <option value="Completed">Completed</option>
                                                </>
                                                :
                                                null
                                            }
                                        </select>
                                </>
                            }
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
                                onClick={orderStatusSubmit}
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
                                {orderCompleteStatus.status === "Completed" ?
                                <>
                                    <div><strong>Status:</strong>&nbsp;Completed</div>
                                </>
                                :
                                <>
                                    <label htmlFor="orderStatus" className='mb-2'>Status:</label>
                                        <select
                                            id="orderStatus"
                                            name='status'
                                            className='form-control mb-1'
                                            value={orderFormData.status}
                                            onChange={handleChangeOrderStatus}
                                        >
                                            {order.status == "Pending" ?
                                                <>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Processing">Processing</option>
                                                </>
                                                : order.status == "Processing" ?
                                                <>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Order Shipped</option>
                                                </>
                                                : order.status == "Shipped" ?
                                                <>
                                                    <option value="Shipped">Order Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                </>
                                                : order.status == "Delivered" ?
                                                <>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Completed">Completed</option>
                                                </>
                                                :
                                                null
                                            }
                                        </select>
                                </>
                                }
                                
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