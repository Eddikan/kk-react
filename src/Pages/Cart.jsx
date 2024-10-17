import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LayoutNoFooter from 'Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
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
import axios from "axios";
import toast from 'react-hot-toast';
import CurrencyConverter from 'Utils/CurrencyConverter';

const initialCheckOut = {
    card_name: '',
    card_number: '',
    date: ''
};

const Cart = (props) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Parse search string to get query parameters
    const searchParams = new URLSearchParams(location.search);

    // Access individual query parameters using get method
    const item = searchParams.get('item');

    const [cookies, setCookie, removeCookie] = useCookies(['userCurrency', 'userCurrencyCode', 'currencyConversions', 'selectedCurrency', 'selectedCurrencyCode', 'currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'selectedCountry', 'tempCart', 'cartItemCount']);
    const currentUser = cookies.currentUser;
    const currency = cookies.selectedCurrency || cookies.userCurrency || 'USD';
    const currencyCode = cookies.selectedCurrencyCode || cookies.userCurrencyCode || '$';
    const [reloadCount, setReloadCount] = useState(0);
    const [formStatus, setFormStatus] = useState('standby');
    const [radioButtonValue, setRadioButtonValue] = useState(0);
    const [cartItems, setCartItems] = useState('');
    const [cartItemId, setCartItemId] = useState('');
    const [checkOutFormData, setCheckOutFormData] = useState(initialCheckOut);
    const [selectedCartItems, setSelectedCartItems] = useState(cookies.selectedCartItems ?? []);
    const [cartItemModalDelete, setCartItemModalDelete] = useState(false);
    const [cartLoading, setCartLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [subtotalAmount, setSubtotalAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [tempCartItems, setTempCartItems] = useState(cookies.tempCart ?? []);
    const [tempCartTotal, setTempCartTotal] = useState(0.00);

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

    const deleteTempCartItem = (id) => {
        const tempCart = tempCartItems;

        // Filter out the item with the given id
        const updatedCart = tempCart.filter(item => item.id !== id);
        toast.success('Cart item deleted successfully!');

        // Set the updated cart in cookies
        setCookie('tempCart', JSON.stringify(updatedCart), { path: '/' });
        setTempCartItems(updatedCart);
    };

    const updateTempItemQuantity = (data) => {
        const tempCart = tempCartItems;

        // Map over tempCart to update the quantity of the item with the specified id
        const updatedCart = tempCart.map(item => {
            if (item.id === data.id) {
                return { ...item, quantity: data.quantity, total: data.quantity * item.price };
            }
            return item;
        });


        // Set the updated cart in cookies
        setCookie('tempCart', JSON.stringify(updatedCart), { path: '/' });
        setTempCartItems(updatedCart);
    }

    const handleChangePaymentInfo = (e) => {
        const { name, value } = e.target;
        setCheckOutFormData({
            ...checkOutFormData,
            [name]: value,
        });
    }

    const handleCheckboxChange = (id) => {
        if (selectedCartItems.includes(id)) {
            setSelectedCartItems(selectedCartItems.filter((cartItemId) => cartItemId !== id));
        } else {
            setSelectedCartItems([...selectedCartItems, id]);
        }
    };

    // const formatPrice = (price) => {
    //     let priceStr = price.toString();
    //     const decimalSeparator = priceStr.includes(',') ? ',' : '.';
    //     let parts = priceStr.split(decimalSeparator);

    //     if (parts.length > 1) {
    //         parts[1] = parts[1].substring(0, 2); // Keep only the first two decimal digits
    //     } else {
    //         parts[1] = '00'; // If there are no decimal parts, add "00"
    //     }

    //     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
    //     let finalPrice = parts.join(decimalSeparator);

    //     if (!finalPrice.includes(decimalSeparator)) {
    //         finalPrice += decimalSeparator + "00"; // If there are no decimals, add ".00"
    //     } else if (parts[1].length === 1) {
    //         finalPrice += "0"; // If there is only one decimal, add another zero
    //     }

    //     return finalPrice;
    // };

    const formatPrice = (price) => {
        // Ensure the price is rounded to two decimal places
        let priceStr = parseFloat(price).toFixed(2);
    
        // Use a period as the decimal separator
        const decimalSeparator = '.';
        let parts = priceStr.split(decimalSeparator);
    
        // Add thousands separator to the integer part
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
        // Rejoin the integer and decimal parts
        let finalPrice = parts.join(decimalSeparator);
    
        return finalPrice;
    };
    
    const updateItemQuantity = (data) => {
        updateQuantity({ user_id: currentUser, quantity: data.quantity, id: data.id }).then(response => {
            const success = response.data.status;
            if (success == success) {
                setReloadCount(reloadCount + 1);
            } else {
                toast.error('There has been an error adding the order, please try again!');
            }
        }).catch(() => {
            toast.error('There has been an error adding the order, please try again!');
        });
    }

    const deleteCartItemSubmit = (cartItemId) => {
        setDeleteLoading(true);
        deleteCartItem(cartItemId).then(response => {
            const success = response.data.status;
            if (success) {
                setFormStatus('standby');
                setReloadCount(reloadCount + 1);
                setDeleteLoading(false);
                toast.success('Cart item deleted successfully!');
                setCartItemModalDelete(false);
            } else {
                setFormStatus('standby');
                toast.error('There has been an error getting the item, please try again!');
                setDeleteLoading(false);
            }
        }).catch(() => {
            toast.error('There has been an error getting the item, please try again!');
            setDeleteLoading(false);
        });
    }

    useEffect(() => {
        document.body.classList.add('designer-calendar-body');
    }, []);

    useEffect(() => {
        let cart_total = 0;
        if (cartItems.length > 0 && selectedCartItems.length > 0) {
            console.log(cartItems);
            cart_total = cartItems.reduce((acc, item) => {
                if (selectedCartItems.includes(item.product.id)) {
                    const fabricPrice = item.product.price ?? '0';
                    const fabricCurrency = item.product.currency ?? 'USD';

                    const convertedPrice = CurrencyConverter(fabricPrice, fabricCurrency, cookies);
                    const subtotal = convertedPrice.price_raw * item.quantity;

                    return acc + subtotal;
                }
                return acc;
            }, 0);

        }
        if (cart_total > 0) {
            setTotalAmount(cart_total);
            setSubtotalAmount(formatPrice(cart_total));
        } else {
            setTotalAmount(0.00);
            setSubtotalAmount(0.00);
        }
    }, [cookies, selectedCartItems, item, reloadCount, cartItems]);

    useEffect(() => {
        if (currentUser) {
            getUserCartItems()
            .then((response) => {
                const cartItemsData = response.data.data;
                if (cartItemsData) {
                    setCartItems(cartItemsData);
                    if (item && item !== "") {
                        // Extract item ids from cartItemsData and add parseInt(item)
                        const updatedSelectedCartItems = [...cartItemsData.map(cartItem => cartItem.product.id), parseInt(item)];
                        setSelectedCartItems(updatedSelectedCartItems);
                        setCartLoading(false);
                    } else {
                        // Map over cartItemsData to extract item ids and add them to selectedCartItems
                        if (!selectedCartItems || selectedCartItems.length < 1) {
                            const updatedSelectedCartItems = cartItemsData.map(cartItem => cartItem.product.id);
                            setSelectedCartItems(updatedSelectedCartItems);
                        }
                        setCartLoading(false);
                    }

                } else {
                    toast.error('There has been an error getting the products, please try again!');
                    setCartLoading(false);
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the products, please try again!');
                setCartLoading(false);
            });
        } else {
            if (tempCartItems) {
                if (!selectedCartItems || selectedCartItems.length < 1) {
                    const updatedSelectedCartItems = tempCartItems.map(cartItem => cartItem.id);
                    setSelectedCartItems(updatedSelectedCartItems);
                }
                setCartLoading(false);
            }
            
        }
    }, [reloadCount, item]);

    useEffect(() => {
        if (!currentUser && tempCartItems) {
            let cart_total = 0;
            if (tempCartItems.length > 0 && tempCartItems.length > 0) {
                cart_total = tempCartItems.reduce((acc, item) => {
                    if (selectedCartItems.includes(item.id)) {
                        const fabricPrice = item.price ?? '0';
                        const fabricCurrency = item.currency ?? 'USD';
                        const convertedPrice = CurrencyConverter(fabricPrice, fabricCurrency, cookies);
                        const subtotal = convertedPrice.price_raw * item.quantity;
                        return acc + subtotal;
                    }
                    return acc;
                }, 0);

            }
            if (cart_total > 0) {
                setTempCartTotal(formatPrice(cart_total));
                setTotalAmount(cart_total);
                setSubtotalAmount(formatPrice(cart_total));

            } else {
                setTempCartTotal(0.00);
                setTotalAmount(0.00);
                setSubtotalAmount(0.00);
            }
        }

    }, [cookies, tempCartItems, selectedCartItems, reloadCount, item]);

    useEffect(() => {
        setCookie('selectedCartItems', JSON.stringify(selectedCartItems), { path: '/' });
    }, [selectedCartItems]);

    return (
        <LayoutNoFooter>
            {cartLoading ?
                <>
                    <LoadingPage />
                </>
                :
                <>
                    <section className="px-5">
                        <Container className='top-bottom'>
                            <Row>
                                <Col lg={12}>
                                    <Row className="pb-4">
                                        <Col md={6} className='d-flex justify-content-left align-items-center'>
                                            <h3 className="fs-30 fw-600 text-black mb-0">Cart</h3>
                                        </Col>
                                        <Col md={6} className="text-right">
                                            <GoBack fallBack="/#" />
                                        </Col>
                                    </Row>
                                </Col>

                                <Col lg={12}>
                                    <Card>
                                        <Card.Body className='bg-light'>
                                            <Row>
                                                <Col lg={1}>
                                                    {currentUser ?
                                                        <input
                                                            type="checkbox"
                                                            className="check-box check-box-color date-width mb-1"
                                                            checked={selectedCartItems.length === cartItems.length && cartItems.length > 0}
                                                            onChange={() => {
                                                                if (selectedCartItems.length === cartItems.length) {
                                                                    setSelectedCartItems([]);
                                                                } else {
                                                                    setSelectedCartItems(cartItems.map((cartItem) => cartItem.product.id));
                                                                }
                                                            }}
                                                        />
                                                        :
                                                        <input
                                                            type="checkbox"
                                                            className="check-box check-box-color date-width mb-1"
                                                            checked={selectedCartItems.length === tempCartItems.length && tempCartItems.length > 0}
                                                            onChange={() => {
                                                                if (selectedCartItems.length === tempCartItems.length) {
                                                                    setSelectedCartItems([]);
                                                                } else {
                                                                    setSelectedCartItems(tempCartItems.map((cartItem) => cartItem.id));
                                                                }
                                                            }}
                                                        />
                                                    }
                                                    
                                                </Col>
                                                <Col lg={4}>
                                                    Item
                                                </Col>

                                                <Col lg={2}>
                                                    Price
                                                </Col>

                                                <Col lg={2}>
                                                    Size
                                                </Col>

                                                <Col lg={2}>
                                                    Total
                                                </Col>

                                                <Col lg={1} className='text-center'>
                                                    Action
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>

                                    <>
                                        {currentUser ?
                                            <>
                                                {cartItems ?
                                                    <>
                                                        {cartItems.length > 0 ?
                                                            <>
                                                                {cartItems.map((cartItem) => {
                                                                    var cart_product = cartItem.product;
                                                                    if (cart_product.image_urls) {
                                                                        var image_urls = JSON.parse(cart_product.image_urls);
                                                                        var fabricImage = process.env.REACT_APP_STORAGE_URL + 'product/' + image_urls[0].image_url;
                                                                    } else {
                                                                        var fabricImage = PlaceholderImage;
                                                                    }

                                                                    const fabricPrice = cart_product.price ?? '0';
                                                                    const fabricCurrency = cart_product.currency ?? 'USD';

                                                                    const convertedPrice = CurrencyConverter(fabricPrice, fabricCurrency, cookies);
                                                                    const subtotal = convertedPrice.price_raw * cartItem.quantity;
                                                                    const formattedSubtotal = formatPrice(subtotal);

                                                                    return (
                                                                        <Card className='mt-2'>
                                                                            <Card.Body>
                                                                                <Row className="align-items-center">
                                                                                    <Col lg={1}>
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            className="check-box me-2 check-box-color cursor-pointer"
                                                                                            checked={selectedCartItems.includes(cartItem.product.id)}
                                                                                            onChange={(e) => { handleCheckboxChange(cartItem.product.id); }}
                                                                                        />
                                                                                    </Col>
                                                                                    <Col lg={4}>
                                                                                        <div className='d-flex'>
                                                                                            <div className="designs-grid-div fabric-image"
                                                                                                style={{ backgroundImage: "url(" + fabricImage + ")" }}>
                                                                                            </div>

                                                                                            <div className='ms-3'>
                                                                                                <div className='mb-1 fw-500 text-black'>
                                                                                                    {cartItem.product.name}
                                                                                                </div>

                                                                                                <div className='d-flex align-items-center user-image-chat'>
                                                                                                    {cartItem.seller.image ?
                                                                                                        <div
                                                                                                            className='user-photo-chat'
                                                                                                            style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${cartItem.seller.image})` }}
                                                                                                        >
                                                                                                        </div>
                                                                                                        :
                                                                                                        <div
                                                                                                            className='user-photo-chat'
                                                                                                            style={{ backgroundImage: `url(${UserPlaceholder})` }}
                                                                                                        >
                                                                                                        </div>
                                                                                                    }
                                                                                                    <span className='name-user ms-2'>
                                                                                                        {cartItem.seller.first_name}
                                                                                                        &nbsp;
                                                                                                        {cartItem.seller.last_name}
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        {convertedPrice.currency_code}{convertedPrice.price}
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        <input
                                                                                            type="number"
                                                                                            className="form-control p-2 me-2 d-inline-block"
                                                                                            min="1"
                                                                                            style={{ maxWidth: 60 }}
                                                                                            defaultValue={cartItem.quantity}
                                                                                            onChange={(e) => updateItemQuantity({ quantity: e.target.value, id: cartItem.id })}
                                                                                        />
                                                                                        {cartItem.product.unit_measurement}
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        {convertedPrice.currency_code}{formattedSubtotal}
                                                                                    </Col>

                                                                                    <Col lg={1} className='text-center cursor-pointer delete-tooltip'
                                                                                        onClick={function () { toggleDeleteCartItem(cartItem.id); }}
                                                                                    >
                                                                                        <span className="icon-tooltiptext fs-14">Delete</span>
                                                                                        <AiOutlineDelete size="20" />
                                                                                    </Col>
                                                                                </Row>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    );
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
                                                        {tempCartItems.length > 0 ?
                                                            <>
                                                                {tempCartItems.map((cartItem) => {
                                                                    var cart_product = cartItem;
                                                                    if (cart_product.images) {
                                                                        var image = cart_product.images;
                                                                        var fabricImage = process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url;
                                                                    } else {
                                                                        var fabricImage = PlaceholderImage;
                                                                    }

                                                                    const fabricPrice = cart_product.price ?? '0';
                                                                    const fabricCurrency = cart_product.currency ?? 'USD';

                                                                    const convertedPrice = CurrencyConverter(fabricPrice, fabricCurrency, cookies);
                                                                    const subtotal = convertedPrice.price_raw * cartItem.quantity;
                                                                    const formattedSubtotal = formatPrice(subtotal);

                                                                    return (
                                                                        <Card className='mt-2'>
                                                                            <Card.Body>
                                                                                <Row className="align-items-center">
                                                                                    <Col lg={1}>
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            className="check-box me-2 check-box-color cursor-pointer"
                                                                                            checked={selectedCartItems.includes(cartItem.id)}
                                                                                            onChange={(e) => { handleCheckboxChange(cartItem.id); }}
                                                                                        />
                                                                                    </Col>
                                                                                    <Col lg={4}>
                                                                                        <div className='d-flex'>
                                                                                            <div className="designs-grid-div fabric-image"
                                                                                                style={{ backgroundImage: "url(" + fabricImage + ")" }}>
                                                                                            </div>

                                                                                            <div className='ms-3'>
                                                                                                <div className='mb-1 fw-500 text-black'>
                                                                                                    {cartItem.name}
                                                                                                </div>

                                                                                                <div className='d-flex align-items-center user-image-chat'>
                                                                                                    {cartItem.user_image ?
                                                                                                        <div
                                                                                                            className='user-photo-chat'
                                                                                                            style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${cartItem.user_image})` }}
                                                                                                        >
                                                                                                        </div>
                                                                                                        :
                                                                                                        <div
                                                                                                            className='user-photo-chat'
                                                                                                            style={{ backgroundImage: `url(${UserPlaceholder})` }}
                                                                                                        >
                                                                                                        </div>
                                                                                                    }
                                                                                                    <span className='name-user ms-2'>
                                                                                                        {cartItem.user_first_name}
                                                                                                        &nbsp;
                                                                                                        {cartItem.user_last_name}
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        {convertedPrice?.currency_code}{convertedPrice?.price}
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        <input
                                                                                            type="number"
                                                                                            className="form-control p-2 me-2 d-inline-block"
                                                                                            min="1"
                                                                                            style={{ maxWidth: 60 }}
                                                                                            defaultValue={cartItem.quantity}
                                                                                            onChange={(e) => updateTempItemQuantity({ id: cartItem.id, quantity: e.target.value })}
                                                                                        />
                                                                                        {cartItem.unit_measurement}
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        {convertedPrice.currency_code}{formattedSubtotal}
                                                                                    </Col>

                                                                                    <Col lg={1} className='text-center cursor-pointer delete-tooltip'
                                                                                        onClick={function () { deleteTempCartItem(cartItem.id); }}
                                                                                    >
                                                                                        <span className="icon-tooltiptext fs-14">Delete</span>
                                                                                        <AiOutlineDelete size="20" />
                                                                                    </Col>
                                                                                </Row>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    );
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
                                    </>
                                    <Card className='mt-2'>
                                        <Card.Body className='bg-light'>
                                            <Row>
                                                <Col lg={1}>
                                                </Col>
                                                <Col lg={6}>
                                                </Col>
                                                {currentUser ?
                                                    <Col className='text-right'>
                                                        <span className='fs-18 me-3'>Total Amount</span><span className='total-price fs-20 fw-600'>{currencyCode}{subtotalAmount}</span>
                                                    </Col>
                                                    :
                                                    <Col className='text-right'>
                                                        <span className='fs-18 me-3'>Total Amount</span><span className='total-price fs-20 fw-600'>{currencyCode}{subtotalAmount}</span>
                                                    </Col>
                                                }
                                                
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <div className="text-right">
                                        {totalAmount > 0 ?
                                            <Link to="/checkout">
                                                <button className='btn btn-primary mt-3'>Check Out</button>
                                            </Link>
                                            :
                                            <button className='btn btn-primary mt-3' disabled={true}>Check Out</button>
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </section>
                </>
            }

            <Modal
                show={cartItemModalDelete}
                size='lg'
                centered
            >
                <Modal.Header className='pb-0'>
                    <h5 className='modal-title text-left fs-22'>Delete Item</h5>
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={function () { setCartItemModalDelete(false); }}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <p className="mb-0">Are you sure you want to delete this fabric?</p>
                        </Card.Body>
                    </Card>
                    <Card.Footer className="text-right mt-3">
                        <button
                            className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
                            onClick={() => setCartItemModalDelete(false)} type="button"
                        >
                            Cancel
                        </button>

                        {deleteLoading ?
                            <button className="btn btn-primary btn-style" type="button">Deleting...</button>
                            :
                            <button className="btn btn-primary btn-style" type="button" onClick={deleteCartItemSubmit}>Delete</button>
                        }
                    </Card.Footer>
                </Modal.Body>
            </Modal>

        </LayoutNoFooter >
    );
};

export default Cart;