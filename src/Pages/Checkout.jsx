import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LayoutNoFooter from 'Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card, FormGroup, FormControl } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import 'Assets/styles/DesignerCalendar/style.css'
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
import { CiCreditCard2 } from "react-icons/ci";
import LoadingPage from 'Components/Shared/LoadingPage';
import 'Assets/styles/Cart/style.css';
import { IoCloseOutline } from "react-icons/io5";
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import UserPlaceholder from 'Assets/images/user.png';
import { AiOutlineDelete } from "react-icons/ai";
import { useParams } from 'react-router-dom';
import Countries from 'Utils/Countries';
import axios from "axios";
import toast from 'react-hot-toast';

const initialCheckOut = {
    card_name: '',
    card_number: '',
    date: '',
    ship_to: '',
    
    first_name: '',
    last_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    province: '',
    postal_code: '',
    country: '',
    email: '',
    phone: '',

    delivery_first_name: '',
    delivery_last_name: '',
    delivery_address_line_1: '',
    delivery_address_line_2: '',
    delivery_city: '',
    delivery_province: '',
    delivery_postal_code: '',
    delivery_country: '',
    delivery_email: '',
    delivery_phone: '',
    needs_designer: '',

    product_count: 0,
};

const Cart = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const formRef = useRef(null);

    // Parse search string to get query parameters
    const searchParams = new URLSearchParams(location.search);

    // Access individual query parameters using get method
    const item = searchParams.get('item');

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'token', 'userDetails', 'userRole', 'checkoutStep', 'selectedCartItems', 'tempCart']);
    const currentUser = cookies.currentUser;
    const [reloadCount, setReloadCount] = useState(0);
    const [formStatus, setFormStatus] = useState('standby');
    const [radioButtonValue, setRadioButtonValue] = useState(0);
    const [cartItems, setCartItems] = useState('');
    const [cartItemId, setCartItemId] = useState('');
    const [checkOutFormData, setCheckOutFormData] = useState(initialCheckOut);
    const [cartItemModalDelete, setCartItemModalDelete] = useState(false);
    const [cartLoading, setCartLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [subtotalAmount, setSubtotalAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [checkoutStep, setCheckoutStep] = useState(cookies.checkoutStep ?? 1);
    const [selectedCartItems, setSelectedCartItems] = useState(cookies.selectedCartItems ?? []);
    const [tempCartItems, setTempCartItems] = useState(cookies.tempCart ?? []);
    const [tempCartTotal, setTempCartTotal] = useState(0.00);
    const [designerId, setDesignerId] = useState('');
    const [selectedDesigner, setSelectedDesigner] = useState(null);

    const getTotalQuantity = (cartItems) => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const toggleDeleteCartItem = (id) => {
        setCartItemId(id);
        setCartItemModalDelete(!cartItemModalDelete);
    }

    const getUserCartItems = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '/cart');
    };

    const postCheckOut = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'order', data);
    };

    const updateQuantity = async (data) => {
        return await axios.put(process.env.REACT_APP_API_ENDPOINT + 'cart/' + data.id, data);
    };

    const deleteCartItem = async () => {
        return await axios.delete(process.env.REACT_APP_API_ENDPOINT + 'cart/' + cartItemId);
    };

    const handleChangePaymentInfo = (e) => {
        const { name, value } = e.target;
        setCheckOutFormData({
            ...checkOutFormData,
            [name]: value,
        });
    }

    const checkOutSubmit = (e) => {
        e.preventDefault();
        setFormStatus('loading');
        const uniqueSelectedCartItems = [...new Set(selectedCartItems)];
        postCheckOut({ ...checkOutFormData, user_id: currentUser, subtotal_amount: subtotalAmount, total_amount: totalAmount, cart_item_ids: uniqueSelectedCartItems }).then(response => {
            const success = response.data.status;
            const data = response.data.data;
            if (success == success) {
                toast.success('Order added successfully!');
                console.log("data", data);
                setTimeout(() => {
                    setReloadCount(prevReloadCount => prevReloadCount + 1);
                    removeCookie('setSelectedCartItems', { path: '/' });
                    navigate(`/thank-you?order_id=${data.order.id}`);
                }, 1000);
            } else {
                toast.error('There has been an error adding the order, please try again!');
            }
        }).catch(() => {
            toast.error('There has been an error adding the order, please try again!');
        });
    }

    const handleChangeDesigner = (e) => {
        const { name, value } = e.target;
        setCheckOutFormData({
            ...checkOutFormData,
            [name]: value,
        });

        if (value != "") {
            setCheckoutStep(2);
            setCookie('checkoutStep', 2, { path: '/' });
        } else {
            setCheckoutStep(1);
            setCookie('checkoutStep', 1, { path: '/' });
        }
    }

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            // Your resize logic here
        });

        if (formRef.current) {
            resizeObserver.observe(formRef.current);
        }

        return () => {
            if (formRef.current) {
                resizeObserver.unobserve(formRef.current);
            }
        };
    }, []);

    useEffect(() => {
        document.body.classList.add('designer-calendar-body');
    }, []);

    useEffect(() => {
        let cart_total = 0;
        if (cartItems.length > 0 && selectedCartItems.length > 0) {
            cart_total = cartItems.reduce((acc, item) => {
                if (selectedCartItems.includes(item.id)) {
                    const subtotal = item.product.price * item.quantity;
                    return acc + subtotal;
                }
                return acc;
            }, 0);
        }
        if (cart_total > 0) {
            setTotalAmount(cart_total.toFixed(2));
            setSubtotalAmount(cart_total.toFixed(2));
        }
    }, [selectedCartItems, item, reloadCount, cartItems]);

    useEffect(() => {
        getUserCartItems()
            .then((response) => {
                const cartItemsData = response.data.data;
                if (cartItemsData) {
                    setCartItems(cartItemsData);
                    setCartLoading(false);
                } else {
                    toast.error('There has been an error getting the products, please try again!');
                    setCartLoading(false);
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the products, please try again!');
                setCartLoading(false);
            });
    }, [cookies, reloadCount, item]);

    useEffect(() => {
        if (!currentUser && tempCartItems) {
            let cart_total = 0;
            if (tempCartItems.length > 0 && tempCartItems.length > 0) {
                cart_total = tempCartItems.reduce((acc, item) => {
                    if (selectedCartItems.includes(item.id)) {
                        const subtotal = parseInt(item.price) * parseInt(item.quantity);
                        return acc + subtotal;
                    }
                    return acc;
                }, 0);

            }
            if (cart_total > 0) {
                setTempCartTotal(cart_total.toFixed(2));
            } else {
                setTempCartTotal(0.00);
            }
        }

    }, [cookies, tempCartItems, selectedCartItems, reloadCount, item]);

    return (
        <LayoutNoFooter>
            {cartLoading ?
                <>
                    <LoadingPage />
                </>
                :
                <>
                    <section>
                        <Container className='top-bottom'>
                            <Row>
                                <Col lg={12}>
                                    <Row className="pb-4">
                                        <Col md={6} className='d-flex justify-content-left align-items-center'>
                                            <h3 className="fs-30 fw-600 text-black mb-0">Checkout</h3>
                                        </Col>
                                        <Col md={6} className="text-right">
                                            <GoBack fallBack="/#" />
                                        </Col>
                                    </Row>
                                </Col>

                                <Col lg={6}>
                                    <Card>
                                        <Card.Body className='bg-light'>
                                            <Row>
                                                <Col lg={8}>
                                                    Item
                                                </Col>

                                                <Col className="text-right" lg={4}>
                                                    Total
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    {currentUser ?
                                        <>
                                            {cartItems ?
                                                <>
                                                    {cartItems.length > 0 && selectedCartItems.length > 0 ?
                                                        <>
                                                            {cartItems.map((cartItem) => {
                                                                
                                                                if (selectedCartItems.includes(cartItem.id)) {
                                                                    var cart_product = cartItem.product;
                                                                    if (cart_product.image_urls) {
                                                                        var image_urls = JSON.parse(cart_product.image_urls);
                                                                        var fabricImage = process.env.REACT_APP_STORAGE_URL + 'product/' + image_urls[0].image_url;
                                                                    } else {
                                                                        var fabricImage = PlaceholderImage;
                                                                    }

                                                                    return (
                                                                        <Card className='mt-2'>
                                                                            <Card.Body>
                                                                                <Row className="align-items-center">
                                                                                    <Col lg={8}>
                                                                                        <div className='d-flex'>
                                                                                            <div className="designs-grid-div fabric-image"
                                                                                                style={{ backgroundImage: "url(" + fabricImage + ")", width: '100px', height: '100px' }}>
                                                                                            </div>

                                                                                            <div className='ms-3'>
                                                                                                <div className='mb-1 fw-500 text-black'>
                                                                                                    {cartItem.product.name}
                                                                                                </div>
                                                                                                <div className="">
                                                                                                    <p>Qty. {cartItem.quantity} {cartItem.product.unit_measurement}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </Col>

                                                                                    <Col lg={4} className="text-right">
                                                                                        <h3><strong>${(cartItem.product.price * cartItem.quantity).toFixed(2)}</strong></h3>
                                                                                        {cartItem.quantity > 1 ?
                                                                                            <p className="small text-muted">${cartItem.product.price} each</p>
                                                                                            :
                                                                                            null
                                                                                        }
                                                                                    </Col>
                                                                                </Row>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    );
                                                                }
                                                            })}

                                                        </>
                                                        :
                                                        <>
                                                            <div className='text-center my-3'>
                                                                Your cart is empty.
                                                            </div>
                                                        </>
                                                    }
                                                </>
                                                :
                                                <>
                                                    <div className='text-center my-3'>
                                                        Your cart is empty.
                                                    </div>
                                                </>
                                            }
                                        </>
                                        :
                                        <>
                                            {tempCartItems ?
                                                <>
                                                    {tempCartItems.length > 0 && selectedCartItems.length > 0 ?
                                                        <>
                                                            {tempCartItems.map((cartItem) => {
                                                                
                                                                if (selectedCartItems.includes(cartItem.id)) {
                                                                    var cart_product = cartItem;
                                                                    if (cart_product.images) {
                                                                        var image = cart_product.images;
                                                                        var fabricImage = process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url;
                                                                    } else {
                                                                        var fabricImage = PlaceholderImage;
                                                                    }

                                                                    return (
                                                                        <Card className='mt-2'>
                                                                            <Card.Body>
                                                                                <Row className="align-items-center">
                                                                                    <Col lg={8}>
                                                                                        <div className='d-flex'>
                                                                                            <div className="designs-grid-div fabric-image"
                                                                                                style={{ backgroundImage: "url(" + fabricImage + ")", width: '100px', height: '100px' }}>
                                                                                            </div>

                                                                                            <div className='ms-3'>
                                                                                                <div className='mb-1 fw-500 text-black'>
                                                                                                    {cartItem.name}
                                                                                                </div>
                                                                                                <div className="">
                                                                                                    <p>Qty. {cartItem.quantity} {cartItem.unit_measurement}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </Col>

                                                                                    <Col lg={4} className="text-right">
                                                                                        <h3><strong>${(cartItem.price * cartItem.quantity).toFixed(2)}</strong></h3>
                                                                                        {cartItem.quantity > 1 ?
                                                                                            <p className="small text-muted">${cartItem.price} each</p>
                                                                                            :
                                                                                            null
                                                                                        }
                                                                                    </Col>
                                                                                </Row>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    );
                                                                }
                                                            })}

                                                        </>
                                                        :
                                                        <>
                                                            <div className='text-center my-3'>
                                                                Your cart is empty.
                                                            </div>
                                                        </>
                                                    }
                                                </>
                                                :
                                                <>
                                                    <div className='text-center my-3'>
                                                        Your cart is empty.
                                                    </div>
                                                </>
                                            }
                                        </>
                                    }
                                    {currentUser ?
                                        <Card className='mt-2'>
                                            <Card.Body className='bg-light'>
                                                <Row>
                                                    <Col lg="12" className='text-right'>
                                                        <span className='fs-18 me-3'>Total Amount: </span><span className='total-price fw-600'><h3 className="total-price fw-600 d-inline-block">${totalAmount}</h3></span>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                        :
                                        <Card className='mt-2'>
                                            <Card.Body className='bg-light'>
                                                <Row>
                                                    <Col lg="12" className='text-right'>
                                                        <span className='fs-18 me-3'>Total Amount: </span><span className='total-price fw-600'><h3 className="total-price fw-600 d-inline-block">${tempCartTotal}</h3></span>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    }
                                    
                                </Col>

                                <Col lg={6}>
                                    <Form onSubmit={checkOutSubmit} ref={formRef}>
                                        <Card className="mb-3">
                                            <Card.Body>
                                                <div className='fs-22 rufina-family fw-600'>Designer</div>
                                                <hr className='mt-2' />
                                                <FormGroup>
                                                    <Form.Label htmlFor="ship_to" className='mb-2'>
                                                        Need a Designer?
                                                    </Form.Label>
                                                    <select id="ship_to" name="ship_to" value={checkOutFormData.needs_designer} onChange={handleChangeDesigner} className="form-control mb-3" required>
                                                        <option value=""></option>
                                                        <option value="Yes">Yes</option>
                                                        <option value="No">No</option>
                                                    </select>
                                                </FormGroup>
                                            </Card.Body>
                                        </Card>
                                        {checkoutStep != 1 ?
                                            <>
                                                <Card className="mb-3">
                                                    <Card.Body>
                                                        <div className='fs-22 rufina-family fw-600'>Shipping Information</div>
                                                        <hr className='mt-2' />
                                                        <FormGroup>
                                                            <Form.Label htmlFor="ship_to" className='mb-2'>
                                                                Ship to
                                                            </Form.Label>
                                                            <select id="ship_to" name="ship_to" value={checkOutFormData.ship_to} onChange={handleChangePaymentInfo} className="form-control mb-3" required>
                                                                <option value=""></option>
                                                                <option value="Ship to my address">Ship to my address</option>
                                                                <option value="Ship to designer">Ship to designer</option>
                                                            </select>
                                                        </FormGroup>
                                                        {checkOutFormData.ship_to != "" ?
                                                            <>
                                                                <hr className='mt-2' />
                                                                <Form.Label className='mb-2'>
                                                                    <strong>Shipping Address</strong>
                                                                </Form.Label>
                                                                <FormGroup className="mb-3">
                                                                    <Row>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="first_name" className='mb-2'>
                                                                                First Name
                                                                            </Form.Label>
                                                                            <FormControl
                                                                                type="text"
                                                                                name="first_name"
                                                                                value={checkOutFormData.delivery_first_name}
                                                                                onChange={handleChangePaymentInfo}
                                                                                id="first_name"
                                                                                required
                                                                            />
                                                                        </Col>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="last_name" className='mb-2'>
                                                                                Last Name
                                                                            </Form.Label>
                                                                            <FormControl
                                                                                type="text"
                                                                                name="last_name"
                                                                                value={checkOutFormData.delivery_last_name}
                                                                                onChange={handleChangePaymentInfo}
                                                                                id="last_name"
                                                                                required
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </FormGroup>
                                                                <FormGroup className="mb-3">
                                                                    <Row>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="email" className='mb-2'>
                                                                                Email
                                                                            </Form.Label>
                                                                            <FormControl
                                                                                type="email"
                                                                                name="email"
                                                                                value={checkOutFormData.delivery_email}
                                                                                onChange={handleChangePaymentInfo}
                                                                                id="email"
                                                                                required
                                                                            />
                                                                        </Col>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="phone" className='mb-2'>
                                                                                Phone Number
                                                                            </Form.Label>
                                                                            <FormControl
                                                                                type="text"
                                                                                name="phone"
                                                                                value={checkOutFormData.delivery_phone}
                                                                                onChange={handleChangePaymentInfo}
                                                                                id="phone"
                                                                                required
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </FormGroup>
                                                                <FormGroup className="mb-3">
                                                                    <Form.Label htmlFor="address_line_1" className='mb-2'>
                                                                        Address Line 1
                                                                    </Form.Label>
                                                                    <FormControl
                                                                        type="text"
                                                                        name="address_line_1"
                                                                        value={checkOutFormData.delivery_address_line_1}
                                                                        onChange={handleChangePaymentInfo}
                                                                        id="address_line_1"
                                                                        required
                                                                    />
                                                                </FormGroup>
                                                                <FormGroup className="mb-3">
                                                                    <Form.Label htmlFor="address_line_2" className='mb-2'>
                                                                        Address Line 2
                                                                    </Form.Label>
                                                                    <FormControl
                                                                        type="text"
                                                                        name="address_line_2"
                                                                        value={checkOutFormData.delivery_address_line_2}
                                                                        onChange={handleChangePaymentInfo}
                                                                        id="address_line_2"
                                                                        required
                                                                    />
                                                                </FormGroup>
                                                                <FormGroup className="mb-3">
                                                                    <Row>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="city" className='mb-2'>
                                                                                City
                                                                            </Form.Label>
                                                                            <FormControl
                                                                                type="text"
                                                                                name="city"
                                                                                value={checkOutFormData.delivery_city}
                                                                                onChange={handleChangePaymentInfo}
                                                                                id="city"
                                                                                required
                                                                            />
                                                                        </Col>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="province" className='mb-2'>
                                                                                Province/State
                                                                            </Form.Label>
                                                                            <FormControl
                                                                                type="text"
                                                                                name="province"
                                                                                value={checkOutFormData.delivery_province}
                                                                                onChange={handleChangePaymentInfo}
                                                                                id="province"
                                                                                required
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </FormGroup>
                                                                <FormGroup className="mb-3">
                                                                    <Row>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="postal_code" className='mb-2'>
                                                                                ZIP/Postal Code
                                                                            </Form.Label>
                                                                            <FormControl
                                                                                type="text"
                                                                                name="postal_code"
                                                                                value={checkOutFormData.delivery_postal_code}
                                                                                onChange={handleChangePaymentInfo}
                                                                                id="postal_code"
                                                                                required
                                                                            />
                                                                        </Col>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="province" className='mb-2'>
                                                                                Country
                                                                            </Form.Label>
                                                                            <Form.Control as='select' name='country' value={checkOutFormData.delivery_country} className='' onChange={handleChangePaymentInfo} required>
                                                                                <option value=''>Select Country</option>
                                                                                {Countries.map((country, index) => (
                                                                                    <option key={country + "-" + index} value={country}>
                                                                                        {country}
                                                                                    </option>
                                                                                ))}
                                                                            </Form.Control>
                                                                        </Col>
                                                                    </Row>
                                                                </FormGroup>
                                                            </>
                                                            :
                                                            null
                                                        }
                                                    </Card.Body>
                                                </Card>
                                                <Card>
                                                    <Card.Body>
                                                        <div className='fs-22 rufina-family fw-600'>Payment Info</div>
                                                        <hr className='mt-2' />
                                                        <div>Payment Method</div>
                                                        <div className='mt-3 d-flex'>
                                                            <div className='d-flex'>
                                                                <input
                                                                    type="radio"
                                                                    name="payment_method"
                                                                    value="visa"
                                                                    onChange={(e) => { setRadioButtonValue("visa"); handleChangePaymentInfo(e); }}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className='ms-3'>
                                                                <CiCreditCard2 size={20} />
                                                            </div>

                                                            <div className='ms-2'>
                                                                VISA
                                                            </div>
                                                        </div>

                                                        <div className='mt-2 d-flex'>
                                                            <div className='d-flex'>
                                                                <input
                                                                    type="radio"
                                                                    name="payment_method"
                                                                    value="mastercard"
                                                                    onChange={(e) => { setRadioButtonValue("mastercard"); handleChangePaymentInfo(e); }}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className='ms-3'>
                                                                <CiCreditCard2 size={20} />
                                                            </div>

                                                            <div className='ms-2'>
                                                                MasterCard
                                                            </div>
                                                        </div>

                                                        {radioButtonValue != "" && radioButtonValue != "Cash on Delivery" ?
                                                            <div>
                                                                <hr />
                                                                <div className='mb-4'>
                                                                    <div className='mb-2'>Card Name:</div>
                                                                    <input
                                                                        type="text"
                                                                        className='form-control'
                                                                        name="card_name"
                                                                        value={checkOutFormData.card_name}
                                                                        onChange={handleChangePaymentInfo}
                                                                    />
                                                                </div>
                                                                <hr />

                                                                <div>
                                                                    <div className='mb-2'>Card Number:</div>
                                                                    <input
                                                                        type="text"
                                                                        name="card_number"
                                                                        className='form-control mb-2'
                                                                        value={checkOutFormData.card_number}
                                                                        onChange={handleChangePaymentInfo}
                                                                        maxLength={15}
                                                                        pattern="[0-9]*"
                                                                    />
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <div className='mb-2'>Expiration Date:</div>
                                                                    <input
                                                                        type="date"
                                                                        className='form-control'
                                                                        name="date"
                                                                        value={checkOutFormData.date}
                                                                        onChange={handleChangePaymentInfo}
                                                                    />
                                                                </div>

                                                            </div>
                                                            :
                                                            null
                                                        }
                                                        <div className='text-center mt-4'>
                                                            <Row>
                                                                <Col lg="6">
                                                                    {selectedCartItems.length < 1 || cartItems.length < 1 ?
                                                                        <button type="button" className='btn btn-primary w-100' disabled={true}>{formStatus != "standby" ? "Loading..." : "Check Out"}</button>
                                                                        :
                                                                        <button type="submit" className='btn btn-primary w-100'>{formStatus != "standby" ? "Loading..." : "Check Out"}</button>
                                                                    }
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Link to="/designers">
                                                                        <button
                                                                            className="btn btn-secondary w-100"
                                                                            type="button"
                                                                        >
                                                                            Connect to a Designer
                                                                        </button>
                                                                    </Link>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </>
                                            :
                                            null
                                        }
                                        
                                    </Form>
                                </Col>
                            </Row>
                        </Container>
                    </section>
                </>
            }

        </LayoutNoFooter >
    );
};

export default Cart;