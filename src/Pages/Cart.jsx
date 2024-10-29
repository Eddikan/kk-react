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
import { IoTrashOutline } from "react-icons/io5";
import { useParams } from 'react-router-dom';
import axios from "axios";
import toast from 'react-hot-toast';
import CurrencyConverter from 'Utils/CurrencyConverter';
import { Rating } from 'react-simple-star-rating';
import CartIcon from 'Assets/images/icons/cart.png';
import FormControl from 'react-bootstrap/FormControl';

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
    const [quantityLoading, setQuantityLoading] = useState(false);
    const [subtotalAmount, setSubtotalAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [tempCartItems, setTempCartItems] = useState(cookies.tempCart ?? []);
    const [tempCartTotal, setTempCartTotal] = useState(0.00);
    const [user, setUser] = useState();
    const [userLoading, setUserLoading] = useState(true);

    const toggleDeleteCartItem = (id) => {
        setCartItemId(id);
        setCartItemModalDelete(!cartItemModalDelete);
    }

    const getUserCartItems = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '/cart');
    };

    const getUser = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser);
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

    const getTotalQuantity = (cartItems) => {
        return cartItems.reduce((total, item) => parseInt(total) + parseInt(item.quantity), 0);
    }
    const getTotalTempQuantity = (tempCartItems) => {
        return tempCartItems.reduce((total, item) => parseInt(total) + parseInt(item.quantity), 0);
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
        setCartItems(prevItems => {
            // Create a copy of the current cart items array
            const updatedItems = [...prevItems];
        
            // Update the quantity of the item at the specified index
            updatedItems[data.index].quantity = data.quantity;
        
            // Set the new updated cart items array
            return updatedItems;
        });
        updateQuantity({ user_id: currentUser, quantity: data.quantity, id: data.id, unit_measurement: data.unit_measurement}).then(response => {
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
    const convertToYards = (value, unit) => {
        let convertedYards = value;
    
        switch (unit) {
            case "millimeter":
                convertedYards = value / 914.4; 
                break;
            case "centimeter":
                convertedYards = value / 91.44;
                break;
            case "meter":
                convertedYards = value * 1.09361
                break;
            case "inch":
                convertedYards = value / 36;
                break;
            case "feet":
                convertedYards = value / 3;
                break;
            case "yard":
                convertedYards = value;
                break;
            default:
                break;
        }
    
        return convertedYards;
    };

    const handleInputDefault = (value) => {
        const itemQuantityDefault = Math.max(1, parseInt(value) || 1);
        return itemQuantityDefault;
    };

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
        getUser()
            .then((response) => {
                const userData = response.data.data;
                if (userData) {
                    setUser(userData);
                    setUserLoading(false);
                } else {
                    setUserLoading(false);
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the user, please try again!');
                setCartLoading(false);
                setUserLoading(false);
            });
    }, [reloadCount, item]);

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
    }, [reloadCount, currentUser]);

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
                                {currentUser && user && user?.profile_completeness >= 0 && user?.profile_completeness < 100 ?
                                    <>
                                        <Col md={12} className='d-flex justify-content-left align-items-center'>
                                            <p className="mb-3 fs-14 fw-500"><Link className="text-decoration-none text-muted" to="/">Home</Link> / Cart</p>
                                        </Col>
                                        <Col lg={12} className="mb-20">
                                            <div className="alert alert-warning d-flex justify-content-between" role="alert">
                                                <p className="my-auto">You have to complete your profile before making a transaction.</p>
                                                <a href="/user/complete-profile">
                                                    <Button className="btn-primary ms-80" >Complete Profile</Button>
                                                </a>
                                            </div>
                                        </Col>
                                    </>
                                    :
                                    <>
                                        <Col md={12} className='d-flex justify-content-left align-items-center'>
                                            <p className="mb-35 fs-14 fw-500"><Link className="text-decoration-none text-muted" to="/">Home</Link> / Cart</p>
                                        </Col>
                                    </>
                                }

                                {/* <Col md={6} className="text-right">
                                    <GoBack fallBack="/#" />
                                </Col> */}

                                <Col lg="8">
                                    <Row>
                                        <Col lg={12}>
                                            {/* <Row>
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
                                            </Row> */}

                                            <>
                                                {currentUser ?
                                                    <>
                                                        {cartItems ?
                                                            <>
                                                                {cartItems.length > 0 ?
                                                                    <>
                                                                        {cartItems.map((cartItem, index) => {
                                                                            var cart_product = cartItem.product;
                                                                            if (cart_product.image_urls) {
                                                                                var image_urls = JSON.parse(cart_product.image_urls);
                                                                                var fabricImage = process.env.REACT_APP_STORAGE_URL + 'product/' + image_urls[0].image_url;
                                                                            } else {
                                                                                var fabricImage = PlaceholderImage;
                                                                            }
                                                                            const itemQuantity = cartItem.quantity;
                                                                            const yards = convertToYards(cartItem.quantity,cartItem.product.unit_measurement);
                                                                            const fabricPrice = cart_product.price ?? '0';
                                                                            const fabricCurrency = cart_product.currency ?? 'USD';


                                                                            const convertedPrice = CurrencyConverter(fabricPrice, fabricCurrency, cookies);
                                                                            const subtotal = convertedPrice.price_raw * cartItem.quantity;
                                                                            const formattedSubtotal = formatPrice(subtotal);
                                                                            
                                                                            let colorsArray;

                                                                            if (Array.isArray(cartItem.product.colors)) {
                                                                                colorsArray = cartItem.product.colors.filter(color => color.trim() !== "");
                                                                            } else if (typeof cartItem.product.colors === 'string') {
                                                                                try {
                                                                                    colorsArray = JSON.parse(cartItem.product.colors).filter(color => color.trim() !== "");
                                                                                } catch (e) {
                                                                                    colorsArray = []; // Fallback if parsing fails
                                                                                }
                                                                            } else {
                                                                                colorsArray = [];
                                                                            }

                                                                            return (
                                                                                <>
                                                                                    <Row className="align-items-center">
                                                                                        <Col lg={1}>
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                className="check-box me-2 check-box-color cursor-pointer"
                                                                                                checked={selectedCartItems.includes(cartItem.product.id)}
                                                                                                onChange={(e) => { handleCheckboxChange(cartItem.product.id); }}
                                                                                            />
                                                                                        </Col>
                                                                                        <Col lg={11}>
                                                                                            <div className='d-flex'>
                                                                                                <div className="designs-grid-div fabric-image"
                                                                                                    style={{ backgroundImage: "url(" + fabricImage + ")" }}>
                                                                                                </div>
                                                                                                <div className='ms-4 w-100'>
                                                                                                    <Row>
                                                                                                        <Col lg="12">
                                                                                                            <div className='fw-500 text-black'>
                                                                                                                <h3 className="product-name fs-18">{cartItem.product.name}</h3>
                                                                                                            </div>
                                                                                                        </Col>
                                                                                                        <Col lg="12">
                                                                                                            <div className="star-ratings mt-2">
                                                                                                                <Rating
                                                                                                                    initialValue={0}
                                                                                                                    readonly={true}
                                                                                                                    allowFraction={true}
                                                                                                                    size={20}
                                                                                                                    className="star-rating"
                                                                                                                    showTooltip={true}
                                                                                                                    emptyColor="#dddddd"
                                                                                                                    fillColor="#cea835"
                                                                                                                    tooltipArray={[
                                                                                                                        0, 1, 2, 3, 4, 5
                                                                                                                    ]}
                                                                                                                    tooltipDefaultText="0.0"
                                                                                                                /* Available Props */
                                                                                                                />
                                                                                                            </div>
                                                                                                        </Col>
                                                                                                        <Col lg="12" className="color-column-keep-height">
                                                                                                            {colorsArray && colorsArray.length > 0 ?
                                                                                                                <>
                                                                                                                    <p className="mb-3 mt-2 fs-12">Color:{" "}
                                                                                                                        {colorsArray.length > 1 ? (
                                                                                                                            colorsArray.join(", ")
                                                                                                                        ) : (
                                                                                                                            colorsArray[0]
                                                                                                                        )}
                                                                                                                    </p>
                                                                                                                </>
                                                                                                                :
                                                                                                                null
                                                                                                            }
                                                                                                        </Col>
                                                                                                    </Row>
                                                                                                    <Row className="vertical-align-middle align-items-center justify-content-center">
                                                                                                        <Col lg="3">
                                                                                                            <div className="product-price">
                                                                                                                <p className="fw-600 fs-18 mb-0 lh-27">{convertedPrice.currency_code}{convertedPrice.price}</p>
                                                                                                            </div>
                                                                                                        </Col>
                                                                                                        <Col lg="8">
                                                                                                            <div className="measurement-input d-flex">
                                                                                                                <button
                                                                                                                    className='text-black p-0 measurement-btns'
                                                                                                                    // variant='secondary'
                                                                                                                    onClick={function() {
                                                                                                                        updateItemQuantity({ quantity: Math.max(1, cartItem.quantity - 1), id: cartItem.id, index: index });
                                                                                                                    }} 
                                                                                                                >
                                                                                                                    -
                                                                                                                </button>
                                                                                                                <input
                                                                                                                    type="number"
                                                                                                                    className="form-control d-inline-block cart-quantity-input"
                                                                                                                    min="1"
                                                                                                                    style={{ maxWidth: 65 }}
                                                                                                                    value={itemQuantity}
                                                                                                                    onChange={(e) => updateItemQuantity({ quantity: e.target.value, id: cartItem.id, index: index })}
                                                                                                                    // Change Value to 1 when user leaves the input empty or with a negative number
                                                                                                                    onBlur={(e) => {const newQuantity = handleInputDefault(e.target.value);
                                                                                                                        updateItemQuantity({ quantity: newQuantity, id: cartItem.id, index: index });
                                                                                                                    }}
                                                                                                                />
                                                                                                                <button
                                                                                                                    className='text-black p-0 measurement-btns'
                                                                                                                    // variant='secondary'
                                                                                                                    onClick={() => {
                                                                                                                        const currentQuantity = parseInt(itemQuantity) || 1; 
                                                                                                                        updateItemQuantity({ quantity: currentQuantity + 1, id: cartItem.id, index: index });
                                                                                                                    }} 
                                                                                                                >
                                                                                                                    +
                                                                                                                </button>
                                                                                                                
                                                                                                                <span className="fs-14 ms-2 my-auto fw-600">{Number(cartItem.quantity)?.toFixed(2)} {
                                                                                                                    cartItem.product.unit_measurement !== 'inch' && cartItem.product.unit_measurement !== 'feet'
                                                                                                                    ? cartItem.product.unit_measurement + 's'
                                                                                                                    : cartItem.product.unit_measurement === 'feet'
                                                                                                                        ? cartItem.product.unit_measurement
                                                                                                                        : cartItem.product.unit_measurement + 'es'
                                                                                                                } {cartItem.product.unit_measurement != "yard" ? <span className="fs-14 fw-400 text-muted-product">({yards.toFixed(2)} yards)</span> : null}</span>
                                                                                                                
                                                                                                            </div>
                                                                                                        </Col>
                                                                                                        <Col lg="1" className="text-end">
                                                                                                            <div className='text-center cursor-pointer my-auto delete-tooltip' onClick={function () { toggleDeleteCartItem(cartItem.id); }}>
                                                                                                                <span className="icon-tooltiptext fs-14">Delete</span>
                                                                                                                <IoTrashOutline size="14" />
                                                                                                            </div>
                                                                                                        </Col>
                                                                                                        {/* <div className="price-measurement-container d-flex justify-content-between">
                                                                                                        
                                                                                                        <div className="measurement-input d-flex">
                                                                                                            <input
                                                                                                                type="number"
                                                                                                                className="form-control p-2 me-2 d-inline-block"
                                                                                                                min="1"
                                                                                                                style={{ maxWidth: 60 }}
                                                                                                                defaultValue={cartItem.quantity}
                                                                                                                onChange={(e) => updateItemQuantity({ quantity: e.target.value, id: cartItem.id })}
                                                                                                            />
                                                                                                            <p className="my-auto">{cartItem.product.unit_measurement}</p>
                                                                                                        </div>
                                                                                                        <div className='text-center cursor-pointer my-auto delete-tooltip' onClick={function () { toggleDeleteCartItem(cartItem.id); }}>
                                                                                                            <span className="icon-tooltiptext fs-14">Delete</span>
                                                                                                            <IoTrashOutline size="20" />
                                                                                                        </div>
                                                                                                    </div> */}
                                                                                                    </Row>

                                                                                                    {/* <div className='d-flex align-items-center user-image-chat'>
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
                                                                                                </div> */}
                                                                                                </div>

                                                                                            </div>
                                                                                        </Col>

                                                                                        {/* <Col lg={2}>
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
                                                                                    </Col> */}

                                                                                        {/* <Col lg={2}>
                                                                                        {convertedPrice.currency_code}{formattedSubtotal}
                                                                                    </Col> */}

                                                                                        {/* <Col lg={1} className='text-center cursor-pointer delete-tooltip'
                                                                                        onClick={function () { toggleDeleteCartItem(cartItem.id); }}
                                                                                    >
                                                                                        <span className="icon-tooltiptext fs-14">Delete</span>
                                                                                        <IoTrashOutline size="20" />
                                                                                    </Col> */}
                                                                                    </Row>
                                                                                    {index < cartItems.length - 1 &&
                                                                                        <div className="dotted-hr my-3"></div>
                                                                                    }
                                                                                </>
                                                                            );
                                                                        })}
                                                                    </>
                                                                    :
                                                                    <>
                                                                         <Card>
                                                                            <Card.Body>
                                                                                <div className='text-center'>
                                                                                    <img src={CartIcon} style={{width: '80px'}} className="mt-20" />
                                                                                    <h3 className="mt-30">Your cart is empty.</h3>
                                                                                    <Link to="/fabrics">
                                                                                        <button className='d-block mx-auto btn btn-primary mb-20 mt-4'>Shop Now</button>
                                                                                    </Link>
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    </>
                                                                }
                                                            </>
                                                            :
                                                            <>
                                                                <Card>
                                                                    <Card.Body>
                                                                        <div className='text-center'>
                                                                            <img src={CartIcon} style={{width: '80px'}} className="mt-20" />
                                                                            <h3 className="mt-30">Your cart is empty.</h3>
                                                                            <Link to="/fabrics">
                                                                                <button className='d-block mx-auto btn btn-primary mb-20 mt-4'>Shop Now</button>
                                                                            </Link>
                                                                        </div>
                                                                    </Card.Body>
                                                                </Card>
                                                            </>
                                                        }
                                                    </>
                                                    :
                                                    <>
                                                        {tempCartItems ?
                                                            <>
                                                                {tempCartItems.length > 0 ?
                                                                    <>
                                                                        {tempCartItems.map((cartItem, index) => {
                                                                            var cart_product = cartItem;
                                                                            if (cart_product.images) {
                                                                                var image = cart_product.images;
                                                                                var fabricImage = process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url;
                                                                            } else {
                                                                                var fabricImage = PlaceholderImage;
                                                                            }

                                                                            const yards = convertToYards(cartItem.quantity,cartItem.unit_measurement);
                                                                            const fabricPrice = cart_product.price ?? '0';
                                                                            const fabricCurrency = cart_product.currency ?? 'USD';

                                                                            let colorsArray;

                                                                            if (Array.isArray(cartItem.colors)) {
                                                                                colorsArray = cartItem.colors.filter(color => color.trim() !== "");
                                                                            } else if (typeof cartItem.colors === 'string') {
                                                                                try {
                                                                                    colorsArray = JSON.parse(cartItem.colors).filter(color => color.trim() !== "");
                                                                                } catch (e) {
                                                                                    colorsArray = [];
                                                                                }
                                                                            } else {
                                                                                colorsArray = [];
                                                                            }

                                                                            const convertedPrice = CurrencyConverter(fabricPrice, fabricCurrency, cookies);
                                                                            const subtotal = convertedPrice.price_raw * cartItem.quantity;
                                                                            const formattedSubtotal = formatPrice(subtotal);

                                                                            return (
                                                                                <>
                                                                                    <Row className="align-items-center">
                                                                                        <Col lg={1}>
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                className="check-box me-2 check-box-color cursor-pointer"
                                                                                                checked={selectedCartItems.includes(cartItem.id)}
                                                                                                onChange={(e) => { handleCheckboxChange(cartItem.id); }}
                                                                                            />
                                                                                        </Col>
                                                                                        <Col lg={11}>
                                                                                            <div className='d-flex'>
                                                                                                <div className="designs-grid-div fabric-image"
                                                                                                    style={{ backgroundImage: "url(" + fabricImage + ")" }}>
                                                                                                </div>

                                                                                                <div className='ms-4 w-100'>
                                                                                                    <Row>
                                                                                                        <Col lg="12">
                                                                                                            <div className='fw-500 text-black'>
                                                                                                                {cartItem.name}
                                                                                                            </div>
                                                                                                        </Col>
                                                                                                        <Col lg="12">
                                                                                                            <div className="star-ratings mt-2">
                                                                                                                <Rating
                                                                                                                    initialValue={0}
                                                                                                                    readonly={true}
                                                                                                                    allowFraction={true}
                                                                                                                    size={20}
                                                                                                                    className="star-rating"
                                                                                                                    showTooltip={true}
                                                                                                                    emptyColor="#dddddd"
                                                                                                                    fillColor="#cea835"
                                                                                                                    tooltipArray={[
                                                                                                                        0, 1, 2, 3, 4, 5
                                                                                                                    ]}
                                                                                                                    tooltipDefaultText="0.0"
                                                                                                                /* Available Props */
                                                                                                                />
                                                                                                            </div>
                                                                                                        </Col>
                                                                                                        <Col lg="12" className="color-column-keep-height">
                                                                                                            {cartItem.colors && cartItem.colors.length > 0 ?
                                                                                                                <>
                                                                                                                    <p className="mb-3 mt-2 fs-12">Color:{" "}
                                                                                                                        {colorsArray.length > 1 ? (
                                                                                                                            colorsArray.join(", ")
                                                                                                                        ) : (
                                                                                                                            colorsArray[0]
                                                                                                                        )}
                                                                                                                    </p>
                                                                                                                </>
                                                                                                                :
                                                                                                                null
                                                                                                            }
                                                                                                        </Col>
                                                                                                    </Row>
                                                                                                    <Row className="vertical-align-middle align-items-center justify-content-center">
                                                                                                        <Col lg="3">
                                                                                                            <div className="product-price">
                                                                                                                <p className="fw-600 fs-18 mb-0 lh-27">{convertedPrice.currency_code}{convertedPrice.price}</p>
                                                                                                            </div>
                                                                                                        </Col>
                                                                                                        <Col lg="8">
                                                                                                            <Button
                                                                                                                    className='text-black p-0 measurement-btns'
                                                                                                                variant='secondary'
                                                                                                                onClick={() => {
                                                                                                                    if (cartItem.quantity > 1) {
                                                                                                                        updateTempItemQuantity({ id: cartItem.id, quantity: parseInt(cartItem.quantity) - 1 });
                                                                                                                    }
                                                                                                                }} 
                                                                                                            >
                                                                                                                -
                                                                                                            </Button>
                                                                                                            <input
                                                                                                                type="number"
                                                                                                                className="form-control d-inline-block cart-quantity-input"
                                                                                                                min="1"
                                                                                                                style={{ maxWidth: 65 }}
                                                                                                                value={cartItem.quantity}
                                                                                                                onChange={(e) => updateTempItemQuantity({ id: cartItem.id, quantity: e.target.value })}
                                                                                                                onBlur={(e) => {const newQuantity = handleInputDefault(e.target.value);
                                                                                                                    updateTempItemQuantity({ quantity: newQuantity, id: cartItem.id, index: index });
                                                                                                                }}
                                                                                                            />
                                                                                                            <Button
                                                                                                                className='text-black p-0 measurement-btns'
                                                                                                                variant='secondary'
                                                                                                                onClick={() => updateTempItemQuantity({ id: cartItem.id, quantity: parseInt(cartItem.quantity) + 1 })}
                                                                                                            >
                                                                                                                +
                                                                                                            </Button>

                                                                                                            <span className="fs-14 my-auto ms-1 fw-600">{Number(cartItem.quantity)?.toFixed(2)} {
                                                                                                                cartItem.unit_measurement !== 'inch' && cartItem.unit_measurement !== 'feet'
                                                                                                                    ? cartItem.unit_measurement + 's'
                                                                                                                    : cartItem.unit_measurement === 'feet'
                                                                                                                        ? cartItem.unit_measurement
                                                                                                                        : cartItem.unit_measurement + 'es'
                                                                                                            } {cartItem.unit_measurement != "yard" ? <span className="fs-14 fw-400 text-muted-product">({yards.toFixed(2)} yards)</span> : null}</span>
                                                                                                            {/* <input
                                                                                                                type="number"
                                                                                                                className="form-control p-2 me-2 d-inline-block"
                                                                                                                min="1"
                                                                                                                style={{ maxWidth: 60 }}
                                                                                                                defaultValue={cartItem.quantity}
                                                                                                                onChange={(e) => updateTempItemQuantity({ id: cartItem.id, quantity: e.target.value })}
                                                                                                            />
                                                                                                            {cartItem.unit_measurement} */}
                                                                                                        </Col>
                                                                                                        <Col lg={1} className="text-end">
                                                                                                            <div className='text-center cursor-pointer delete-tooltip' onClick={function () { deleteTempCartItem(cartItem.id); }}>
                                                                                                                <span className="icon-tooltiptext fs-14">Delete</span>
                                                                                                                <IoTrashOutline size="14" />
                                                                                                            </div>
                                                                                                        </Col>
                                                                                                    </Row>


                                                                                                    {/* <div className='d-flex align-items-center user-image-chat'>
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
                                                                                                </div> */}
                                                                                                </div>
                                                                                            </div>
                                                                                        </Col>

                                                                                        {/* <Col lg={2}>
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
                                                                                        <IoTrashOutline size="20" />
                                                                                    </Col> */}
                                                                                    </Row>
                                                                                    {index < tempCartItems.length - 1 &&
                                                                                        <div className="dotted-hr my-3"></div>
                                                                                    }
                                                                                </>
                                                                            );
                                                                        })}

                                                                    </>
                                                                    :
                                                                    <>
                                                                        <Card>
                                                                        <Card.Body>
                                                                            <div className='text-center'>
                                                                                <img src={CartIcon} style={{width: '80px'}} className="mt-20" />
                                                                                <h3 className="mt-30">Your cart is empty.</h3>
                                                                                <Link to="/fabrics">
                                                                                    <button className='d-block mx-auto btn btn-primary mb-20 mt-4'>Shop Now</button>
                                                                                </Link>
                                                                            </div>
                                                                        </Card.Body>
                                                                    </Card>
                                                                </>
                                                                }
                                                            </>
                                                            :
                                                            <>
                                                                <Card>
                                                                    <Card.Body>
                                                                        <div className='text-center'>
                                                                            <img src={CartIcon} style={{width: '80px'}} className="mt-20" />
                                                                            <h3 className="mt-30">Your cart is empty.</h3>
                                                                            <Link to="/fabrics">
                                                                                <button className='d-block mx-auto btn btn-primary mb-20 mt-4'>Shop Now</button>
                                                                            </Link>
                                                                        </div>
                                                                    </Card.Body>
                                                                </Card>
                                                            </>
                                                        }
                                                    </>
                                                }
                                            </>
                                            {/* <Card className='mt-2'>
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
                                            </Card> */}
                                            {/* <div className="text-right">
                                                {totalAmount > 0 ?
                                                    <Link to="/checkout">
                                                        <button className='btn btn-primary mt-3'>Check Out</button>
                                                    </Link>
                                                    :
                                                    <button className='btn btn-primary mt-3' disabled={true}>Check Out</button>
                                                }
                                            </div> */}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg="4" className="d-flex justify-content-end">
                                    <Card className="cart-card">
                                        <Card.Body>
                                            <Row>
                                                <Col lg="12">
                                                    <p className="fs-18 fw-600 mb-0">Summary of Purchase</p>
                                                    <hr className="mt-2" />
                                                </Col>
                                                <Col lg="12">
                                                    {currentUser ?
                                                        <>
                                                            {cartItems ?
                                                                <>
                                                                    {cartItems.length > 0 ?
                                                                        <>
                                                                            {cartItems.map((cartItem, index) => {
                                                                                var cart_product = cartItem.product;
                                                                                if (selectedCartItems.includes(cart_product.id)) {
                                                                                    const fabricPrice = cart_product.price ?? '0';
                                                                                        const fabricCurrency = cart_product.currency ?? 'USD';

                                                                                        const convertedPrice = CurrencyConverter(fabricPrice, fabricCurrency, cookies);
                                                                                        const subtotal = convertedPrice.price_raw * cartItem.quantity;
                                                                                        const formattedSubtotal = formatPrice(subtotal);

                                                                                        return (
                                                                                            <>
                                                                                                <Row>
                                                                                                    <Col lg="6">
                                                                                                        <p className="fs-14 text-muted mb-10">{cartItem.product.name} x {cartItem.quantity}</p>
                                                                                                    </Col>
                                                                                                    <Col lg="6">
                                                                                                        <p className="fs-14 text-right mb-10 fw-600">{convertedPrice.currency_code}{formattedSubtotal}</p>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                            </>
                                                                                        );
                                                                                }
                                                                            })}
                                                                        </>
                                                                        :
                                                                        <Row>
                                                                            <Col lg="12">
                                                                                <p className="fs-14 text-muted mb-0">Your cart is empty.</p>
                                                                            </Col>
                                                                        </Row>
                                                                    }
                                                                </>
                                                                :
                                                                <Row>
                                                                    <Col lg="12">
                                                                        <p className="fs-14 text-muted mb-0">Your cart is empty.</p>
                                                                    </Col>
                                                                </Row>
                                                            }
                                                        </>
                                                        :
                                                        <>
                                                            {tempCartItems ?
                                                                <>
                                                                    {tempCartItems.length > 0 ?
                                                                        <>
                                                                            {tempCartItems.map((cartItem, index) => {
                                                                                var cart_product = cartItem;

                                                                                if (selectedCartItems.includes(cart_product.id)) {

                                                                                    const fabricPrice = cart_product.price ?? '0';
                                                                                    const fabricCurrency = cart_product.currency ?? 'USD';

                                                                                    const convertedPrice = CurrencyConverter(fabricPrice, fabricCurrency, cookies);
                                                                                    const subtotal = convertedPrice.price_raw * cartItem.quantity;
                                                                                    const formattedSubtotal = formatPrice(subtotal);

                                                                                    return (
                                                                                        <>
                                                                                            <Row>
                                                                                                <Col lg="6">
                                                                                                    <p className="fs-14 text-muted mb-10">{cartItem.name} x {cartItem.quantity}</p>
                                                                                                </Col>
                                                                                                <Col lg="6">
                                                                                                    <p className="fs-14 text-right mb-10 fw-600">{convertedPrice.currency_code}{formattedSubtotal}</p>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </>
                                                                                    );
                                                                                }
                                                                            })}

                                                                        </>
                                                                        :
                                                                        <Row>
                                                                            <Col lg="12">
                                                                                <p className="fs-14 text-muted mb-0">Your cart is empty.</p>
                                                                            </Col>
                                                                        </Row>
                                                                    }
                                                                </>
                                                                :
                                                                <Row>
                                                                    <Col lg="12">
                                                                        <p className="fs-14 text-muted">Your cart is empty.</p>
                                                                    </Col>
                                                                </Row>
                                                            }
                                                        </>
                                                    }
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="12">
                                                    <hr className="mt-50 mb-3 w-100" />
                                                </Col>
                                            </Row>
                                            <Row className="vertical-align-middle align-items-center justify-content-center">
                                                <Col lg="4">
                                                    <p className="fs-14 mb-0 text-muted">Subtotal </p>
                                                </Col>
                                                {currentUser ?
                                                    <Col lg="8">
                                                        <p className="subtotal-amount fs-18 mb-0 text-right fw-600">{currencyCode}{subtotalAmount}</p>
                                                    </Col>
                                                    :
                                                    <Col lg="8">
                                                        <p className="subtotal-amount fs-18 mb-0 text-right fw-600">{currencyCode}{subtotalAmount}</p>
                                                    </Col>
                                                }
                                                <Col lg="12">
                                                    {currentUser ? (
                                                        totalAmount > 0 && user && user?.profile_completeness === 100 ? (
                                                            <Link to="/checkout">
                                                                <button className='checkout-btn btn btn-primary mt-3'>Check Out</button>
                                                            </Link>
                                                        ) : (
                                                            <>
                                                                {userLoading ? 
                                                                    <>
                                                                        <button className='checkout-btn btn btn-primary mt-3' disabled={true}>Loading...</button>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <button className='checkout-btn btn btn-primary mt-3' disabled={true}>Check Out</button>
                                                                    </>
                                                                }
                                                            </>
                                                            
                                                        )
                                                    ) : 
                                                        <Link to="/login?redirect_to=/checkout">
                                                            <button className='checkout-btn btn btn-primary mt-3'>Sign in to Check Out</button>
                                                        </Link>
                                                    }
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
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