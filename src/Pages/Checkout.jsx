import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LayoutNoFooter from 'Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card, FormGroup, FormControl } from 'react-bootstrap';
import { PayPalButtons } from "@paypal/react-paypal-js";
import Form from 'react-bootstrap/Form';
import 'Assets/styles/DesignerCalendar/style.css';
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
import SignUp from 'Components/Forms/InsideAuth/Signup';
import Login from 'Components/Forms/InsideAuth/Login';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaTruck, FaCcStripe, FaGooglePay } from "react-icons/fa";
import LoadingPage from 'Components/Shared/LoadingPage';
import 'Assets/styles/Cart/style.css';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import DesignersConnect from 'Components/Shared/DesignersConnect';
import UserPlaceholder from 'Assets/images/user.png';
import { AiOutlineDelete } from "react-icons/ai";
import { useParams } from 'react-router-dom';
import Countries from 'Utils/Countries';
import CountryCodes from 'Utils/CountryCodes';
import axios from "axios";
import toast from 'react-hot-toast';
import CurrencyConverter from 'Utils/CurrencyConverter';
import GooglePayButton from "@google-pay/button-react";

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
    province_code: '',
    postal_code: '',
    country: '',
    email: '',
    phone: '',

    designer_id: '',

    delivery_first_name: '',
    delivery_last_name: '',
    delivery_address_line_1: '',
    delivery_address_line_2: '',
    delivery_city: '',
    delivery_province: '',
    delivery_province_code: '',
    delivery_postal_code: '',
    delivery_country: '',
    delivery_country_code: '',
    delivery_email: '',
    delivery_phone: '',
    needs_designer: '',

    currency: '',
    currency_code: '',
    shipping_option: '',
};

const initialShippingDetails = {
    recipient: '',
    shipments: '',
    shipping_details: '',
    shipping_rate_data: '',
};

const initialLatLon = Object.freeze({
    latitude: 0,
    longitude: 0,
});

const Cart = ({ props }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const formRef = useRef(null);

    // Parse search string to get query parameters
    const searchParams = new URLSearchParams(location.search);

    // Access individual query parameters using get method
    const item = searchParams.get('item');
    const [cookies, setCookie, removeCookie] = useCookies(['userCurrency', 'userCurrencyCode', 'currencyConversions', 'selectedCurrency', 'selectedCurrencyCode', 'currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'selectedCountry', 'tempCart', 'cartItemCount', 'selectedCartItems', 'cookieCheckoutDesigner']);
    const currency = cookies.selectedCurrency || cookies.userCurrency || 'USD';
    const currencyCode = cookies.selectedCurrencyCode || cookies.userCurrencyCode || '$';
    const [reloadCount, setReloadCount] = useState(0);
    const [formStatus, setFormStatus] = useState('standby');
    const [radioButtonValue, setRadioButtonValue] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [cartItemId, setCartItemId] = useState('');
    const [checkOutFormData, setCheckOutFormData] = useState(initialCheckOut);
    const [cartItemModalDelete, setCartItemModalDelete] = useState(false);
    const [cartLoading, setCartLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [subtotalAmount, setSubtotalAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalAmountDisplay, setTotalAmountDisplay] = useState("0.00");
    const [subtotalAmountDisplay, setSubtotalAmountDisplay] = useState("0.00");
    const [checkoutStep, setCheckoutStep] = useState(1);
    const [selectedCartItems, setSelectedCartItems] = useState(cookies.selectedCartItems ?? []);
    const [tempCartItems, setTempCartItems] = useState(cookies.tempCart ?? []);
    const [tempCartTotal, setTempCartTotal] = useState(0.00);
    const [designerId, setDesignerId] = useState('');
    const [selectedDesigner, setSelectedDesigner] = useState(null);
    const [authModalShow, setAuthModalShow] = useState(false);
    const [activeAuth, setActiveAuth] = useState('login');
    const [currentUser, setCurrentUser] = useState(cookies.currentUser ?? null);
    const [productCount, setProductCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState();
    const [userLoading, setUserLoading] = useState(true);

    const [totalAmountConverted, setTotalAmountConverted] = useState(0);
    const [subtotalAmountConverted, setSubtotalAmountConverted] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [countryName, setCountryName] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [provinceName, setProvinceName] = useState('');
    const [provinceCode, setProvinceCode] = useState('');
    const [cityName, setCityName] = useState('');
    const [geonameId, setGeonameId] = useState('');
    const [shipmentError, setShipmentError] = useState(true);

    const [internationalShippingRate, setInternationalShippingRate] = useState();
    const [internationalShippingRateData, setInternationalShippingRateData] = useState();

    const [gigmShippingRate, setGigmShippingRate] = useState();
    const [gigmShippingRateData, setGigmShippingRateData] = useState();

    const [totalShippingAmount, setTotalShippingAmount] = useState(0.00);
    const [totalShippingAmountConverted, setTotalShippingAmountConverted] = useState(0.00);
    const [shippingLoading, setShippingLoading] = useState(false);
    const [shipments, setShipments] = useState([]);
    const [recipient, setRecipient] = useState([]);
    const [shippingDetails, setShippingDetails] = useState(initialShippingDetails);
    const [errors, setErrors] = useState([]);

    // Locations
    const [cities, setCities] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [coordinates, setCoordinates] = useState(initialLatLon);
    const [emptyCities, setEmptyCities] = useState(false);

    const [provincesLoading, setProvincesLoading] = useState(false);
    const [citiesLoading, setCitiesLoading] = useState(false);

    // Ordered Items
    const [orderedItems, setOrderedItems] = useState([]);

    const [showModal, setShowModal] = useState(0);

    const showSignup = (e) => {
        setShowModal(e)
    }

    const showLogin = (e) => {
        setShowModal(e)
    }

    const getTotalQuantity = (cartItems) => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const toggleDeleteCartItem = (id) => {
        setCartItemId(id);
        setCartItemModalDelete(!cartItemModalDelete);
    };

    const handleChangeAuth = (e) => {
        setActiveAuth(e);
    };

    const handleLogin = (e) => {
        setCurrentUser(e.user_id);
        setCartItems(e.cart_items);
        toggleAuthModal();
    }

    const toggleAuthModal = (e) => {
        setAuthModalShow(!authModalShow);
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

    const getCountryCode = (countryName) => {
        // Find the country code based on the country name
        const entries = Object.entries(CountryCodes);
        for (const [code, name] of entries) {
            if (name.toLowerCase() === countryName.toLowerCase()) {
                return code; // Return the corresponding country code
            }
        }
        return null; // Return null if no match is found
    };

    const getCountryStates = async (requestData) => {
        try {
            setProvincesLoading(true);
            const response = await axios.post(
                process.env.REACT_APP_LOCATION_API_ENDPOINT + 'countries/states',
                requestData, // JSON body with country
                {
                    headers: {
                        'Content-Type': 'application/json', // Ensure it's sending as JSON
                    },
                }
            );

            const { error, data } = response.data;

            if (!error) {
                setProvinces(data.states); // Assuming the response has the states in `data.states`
                setProvincesLoading(false);
            } else {
                const errors = response.data.errors;
                if (errors) {
                    // setErrors(errors);
                    toast.error('There has been an error getting the states, please try again!');
                } else {
                    toast.error('There has been an error getting the states, please try again!');
                }
                setProvincesLoading(false);
            }
        } catch (err) {
            toast.error('There has been an error getting the states, please try again!');
            setProvincesLoading(false);
        }
    };

    const getStateCities = async (requestData) => {
        try {
            setCitiesLoading(true);
            const response = await axios.post(
                process.env.REACT_APP_LOCATION_API_ENDPOINT + 'countries/state/cities',
                requestData, // JSON body with country and state
                {
                    headers: {
                        'Content-Type': 'application/json', // Ensure it's sending as JSON
                    },
                }
            );

            const { error, data } = response.data;

            if (!error) {
                setCities(data); // Assuming the response has the cities in `data`
                setCitiesLoading(false);
                if (data && data.length < 1) {
                    setEmptyCities(true);
                } else {
                    setEmptyCities(false);
                }
            } else {
                const errors = response.data.errors;
                if (errors) {
                    // setErrors(errors);
                    toast.error('There has been an error getting the cities, please try again!');
                } else {
                    toast.error('There has been an error getting the cities, please try again!');
                }
                setCitiesLoading(false);
            }
        } catch (err) {
            toast.error('There has been an error getting the cities, please try again!');
            setCitiesLoading(false);
        }
    };

    const getCoordinates = async (requestData) => {
        const API_KEY = '7ba22fb46e866c41cd6bd744126fa733'; // Replace with your OpenWeatherMap API key
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${requestData}&appid=${API_KEY}`;
        setFormStatus("loading")
        try {
            const response = await axios.get(url);
            const { lat, lon } = response.data.coord; // Extracting latitude and longitude
            if (response.status == 200) {
                setCoordinates({
                    ...coordinates,
                    latitude: lat,
                    longitude: lon,
                });
            } else {
                toast.error('Failed to fetch coordinates. Please check the city name and try again.');
            }
            setFormStatus("standby");

        } catch (error) {
            toast.error('Failed to fetch coordinates. Please check the city name and try again.');
            console.error(error);
            setFormStatus("standby");
        }
    };

    const getUserCartItems = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '/cart');
    };

    const getUser = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser);
    };

    const getInternationalRates = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'ups/v2/get/rating/international', data);
    };

    const getGigmRates = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'gigm/v2/get/shipment/price', data);
    };

    const createUpsInternationalShipment = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'ups/v2/create/shipment/international', data);
    };

    const createGigmShipment = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'gigm/v2/create/shipment', data);
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

    const postIntent = async (data) => await axios.post(process.env.REACT_APP_API_ENDPOINT + 'create-intent', data);

    const imperialCountries = ['US', 'UK', 'LR', 'MM']; // Add more countries as needed

    function getUnitOfMeasurement(countryCode) {
        if (imperialCountries.includes(countryCode)) {
            return true;
        } else {
            return false;
        }
    };

    const convertToCm = (value, unit) => {
        switch (unit.toLowerCase()) {
            case 'cm':
            case 'centimeter':
                return value;
            case 'inch':
            case 'in':
                return value * 2.54;
            case 'ft':
            case 'feet':
                return value * 30.48;
            case 'yard':
            case 'yd':
                return value * 91.44;
            case 'meter':
            case 'm':
                return value * 100;
            case 'mm':
            case 'millimeter':
                return value * 0.1;
            default:
                throw new Error('Invalid unit of measurement for cm conversion.');
        }
    };

    const convertToInch = (value, unit) => {
        switch (unit.toLowerCase()) {
            case 'cm':
            case 'centimeter':
                return value * 0.3937;
            case 'inch':
            case 'in':
                return value;
            case 'ft':
            case 'feet':
                return value * 12;
            case 'yard':
            case 'yd':
                return value * 36;
            case 'meter':
            case 'm':
                return value * 39.3701;
            case 'mm':
            case 'millimeter':
                return value * 0.03937;
            default:
                throw new Error('Invalid unit of measurement for inch conversion.');
        }
    };

    const handleChangePaymentInfo = (e) => {
        const { name, value } = e.target;
        if (name == "ship_to" && value == "Ship to my address") {
            if (user) {
                setCheckOutFormData({
                    ...checkOutFormData,
                    delivery_first_name: user.first_name,
                    delivery_last_name: user.last_name,
                    delivery_email: user.email,
                    delivery_phone: user.phone_number,
                    delivery_address_line_1: user.address_line_1,
                    delivery_address_line_2: user.address_line_2,
                    delivery_city: user.city,
                    delivery_province: user.province,
                    delivery_province_code: user.province_code,
                    delivery_postal_code: user.postal_code,
                    delivery_country: user.country,
                    delivery_country_code: user.country_code,
                    [name]: value,
                });
                setCountryName(user.country);
            } else {
                setCheckOutFormData({
                    ...checkOutFormData,
                    [name]: value,
                });
            }
        } else if (name == "ship_to" && value == "Ship to designer") {
            setCheckOutFormData({
                ...checkOutFormData,
                delivery_first_name: '',
                delivery_last_name: '',
                delivery_email: '',
                delivery_phone: '',
                delivery_address_line_1: '',
                delivery_address_line_2: '',
                delivery_city: '',
                delivery_province: '',
                delivery_province_code: '',
                delivery_postal_code: '',
                delivery_country: '',
                delivery_country_code: '',
                [name]: value,
            });
        } else if (name == "delivery_country") {
            var country_code = getCountryCode(value);

            setCheckOutFormData({
                ...checkOutFormData,
                [name]: value,
                delivery_country_code: country_code,
                delivery_province: "",
                delivery_province_code: "",
                delivery_city: "",
                shipping_option: ""
            });
        } else if (name == "delivery_province") {
            const selectedProvince = e.target.selectedOptions[0];
            const provinceCode = selectedProvince.getAttribute('data-province-code');

            setCheckOutFormData({
                ...checkOutFormData,
                [name]: value,
                delivery_province_code: provinceCode,
                delivery_city: "",
                shipping_option: ""
            });

        } else {
            setCheckOutFormData({
                ...checkOutFormData,
                [name]: value
            });
        }
    };

    const checkOutSubmit = (e) => {
        e.preventDefault();
        setFormStatus('loading');
        const uniqueSelectedCartItems = [
            ...new Set(
                cartItems
                    .filter(item => selectedCartItems.includes(item.product.id))
                    .map(item => item.id)
            )
        ];

        const shipping_data = {
            recipient: recipient,
            shipments: shipments
        }

        if (checkOutFormData.shipping_option == "UPS") {
            createUpsInternationalShipment(shipping_data).then(response => {
                const status = response.data.status;
                const data = response.data;

                if (status == "Success") {

                    const checkOutOrderItems = cartItems.map((cartItem, index) => {
                        const cartItemShippingRate = internationalShippingRate[index] || {};
                        const cartItemShipmentResults = data[index] || {};
                        const cartItemTrackingDetails = data.total_charges?.data[index] || {};

                        const cart_item_shipping_price = parseFloat(cartItemShippingRate?.RateResponse?.RatedShipment?.TotalCharges?.MonetaryValue) || 0;
                        const cart_item_shipping_currency = cartItemShippingRate?.RateResponse?.RatedShipment?.TotalCharges?.CurrencyCode || 'USD';
                        const cart_item_shipment_price = parseFloat(cartItemShipmentResults?.ShipmentResponse?.ShipmentResults?.ShipmentCharges?.TotalCharges?.MonetaryValue) || 0;
                        const cart_item_shipment_currency = cartItemShipmentResults?.ShipmentResponse?.ShipmentResults?.ShipmentCharges?.TotalCharges?.CurrencyCode || 'USD';

                        const cart_item_shipping_price_converted = CurrencyConverter(cart_item_shipping_price, cart_item_shipping_currency, cookies);
                        const cart_item_shipment_price_converted = CurrencyConverter(cart_item_shipment_price, cart_item_shipment_currency, cookies);

                        return {
                            product_id: cartItem.product.id,
                            quantity: cartItem.quantity,
                            tracking_details: cartItemTrackingDetails,
                            shipping_details: {
                                shipping_amount: cart_item_shipping_price,
                                shipping_amount_converted: cart_item_shipping_price_converted.price_raw,
                                shipment_amount: cart_item_shipment_price,
                                shipment_amount_converted: cart_item_shipment_price_converted.price_raw,
                                shipping_details: cartItemShippingRate,
                                shipment_details: cartItemShipmentResults,
                            }
                        };
                    });

                    postCheckOut({ ...checkOutFormData, delivery_country_code: countryCode, user_id: currentUser, product_count: totalQuantity, subtotal_amount: subtotalAmount, subtotal_amount_converted: subtotalAmountConverted, total_amount: totalAmount, total_amount_converted: totalAmountConverted, shipping_amount: totalShippingAmount, shipping_amount_converted: totalShippingAmountConverted, cart_item_ids: uniqueSelectedCartItems, product_count: productCount, shipping_details: { ...shippingDetails, shipping_data: data }, currency_conversions: cookies.currencyConversions, checkout_order_items: checkOutOrderItems }).then(response => {
                        const status = response.data.status;
                        const data = response.data.data;
                        if (status == "Success") {
                            toast.success('Order added successfully!');
                            setTimeout(() => {
                                setReloadCount(prevReloadCount => prevReloadCount + 1);
                                removeCookie('setSelectedCartItems', { path: '/' });
                                removeCookie('cookieCheckoutDesigner', { path: '/' });
                                navigate(`/thank-you?order_id=${data.order.id}`);
                            }, 1000);
                        } else {
                            const errors = response.data.errors;
                            if (errors && errors.length > 0) {
                                errors.map((error, index) => {
                                    toast.error(error);
                                    return null; // React requires a return value, so we return null here
                                });
                            } else {
                                toast.error('There has been an error adding the order, please try again!');
                            }
                            setFormStatus('standby');

                        }
                    }).catch((error) => {
                        console.log(error);
                        toast.error('There has been an error adding the order, please try again!');
                    });
                } else {
                    const errors = response.data.errors;
                    if (errors) {
                        const errors = response.data.errors;
                        if (errors) {
                            setErrors(errors);
                        }
                        setFormStatus('standby');
                    } else {
                        toast.error('There has been an error adding the order, please try again!');
                        setFormStatus('standby');
                    }
                }
            }).catch(() => {
                toast.error('There has been an error adding the order, please try again in the catchchchchc!');
                setFormStatus('standby');
            });

        } else if (checkOutFormData.shipping_option == "GIGM") {
            createGigmShipment(shipping_data).then(response => {
                const status = response.data.status;
                const data = response.data;
                if (status == "Success") {

                    const checkOutOrderItems = cartItems.map((cartItem, index) => {
                        try {
                            const cartItemShippingRate = gigmShippingRate.data[index] || {};
                            const cartItemShipmentResults = data.responses[index].data || {};
                            const cartItemTrackingDetails = data.responses[index].data || {};
                    
                            const cart_item_shipping_price = parseFloat(cartItemShippingRate?.total_charges_amount) || 0;
                            const cart_item_shipping_currency = cartItemShippingRate?.currency_code || 'USD';
                    
                            const cart_item_shipment_price = cart_item_shipping_price;
                            const cart_item_shipment_currency = cart_item_shipping_currency;
                    
                            const cart_item_shipping_price_converted = CurrencyConverter(cart_item_shipping_price, cart_item_shipping_currency, cookies);
                            const cart_item_shipment_price_converted = CurrencyConverter(cart_item_shipment_price, cart_item_shipment_currency, cookies);
                    
                            // Return the object you're constructing for each cart item
                            return {
                                product_id: cartItem.product.id,
                                quantity: cartItem.quantity,
                                tracking_details: cartItemTrackingDetails,
                                shipping_details: {
                                    shipping_amount: cart_item_shipping_price,
                                    shipping_amount_converted: cart_item_shipping_price_converted.price_raw,
                                    shipment_amount: cart_item_shipment_price,
                                    shipment_amount_converted: cart_item_shipment_price_converted.price_raw,
                                    shipping_details: cartItemShippingRate,
                                    shipment_details: cartItemShipmentResults,
                                }
                            };
                        } catch (error) {
                            console.error("Error in map function: ", error);
                            throw error;  // You can throw the error again to catch it outside the map
                        }
                    });
                    

                    postCheckOut({ ...checkOutFormData, delivery_country_code: countryCode, user_id: currentUser, product_count: totalQuantity, subtotal_amount: subtotalAmount, subtotal_amount_converted: subtotalAmountConverted, total_amount: totalAmount, total_amount_converted: totalAmountConverted, shipping_amount: totalShippingAmount, shipping_amount_converted: totalShippingAmountConverted, cart_item_ids: uniqueSelectedCartItems, product_count: productCount, shipping_details: { ...shippingDetails, shipping_data: data }, currency_conversions: cookies.currencyConversions, checkout_order_items: checkOutOrderItems }).then(response => {
                        const status = response.data.status;
                        const data = response.data.data;
                        if (status == "Success") {
                            toast.success('Order added successfully!');
                            setTimeout(() => {
                                setReloadCount(prevReloadCount => prevReloadCount + 1);
                                removeCookie('setSelectedCartItems', { path: '/' });
                                removeCookie('cookieCheckoutDesigner', { path: '/' });
                                navigate(`/thank-you?order_id=${data.order.id}`);
                            }, 1000);
                        } else {
                            const errors = response.data.errors;
                            if (errors && errors.length > 0) {
                                errors.map((error, index) => {
                                    toast.error(error);
                                    return null; // React requires a return value, so we return null here
                                });
                            } else {
                                toast.error('There has been an error adding the order, please try again!');
                            }
                            setFormStatus('standby');

                        }
                    }).catch(() => {
                        toast.error('There has been an error adding the order, please try again!');
                    });
                } else {
                    const errors = response.data.errors;
                    if (errors) {
                        const errors = response.data.errors;
                        if (errors) {
                            setErrors(errors);
                        }
                    } else {
                        toast.error('There has been an error adding the order, please try again!');
                    }
                }
            }).catch(() => {
                toast.error('There has been an error adding the order, please try again!');
            });
        } else {
            postCheckOut({ ...checkOutFormData, delivery_country_code: countryCode, user_id: currentUser, product_count: totalQuantity, subtotal_amount: subtotalAmount, subtotal_amount_converted: subtotalAmountConverted, total_amount: totalAmount, total_amount_converted: totalAmountConverted, shipping_amount: totalShippingAmount, shipping_amount_converted: totalShippingAmountConverted, cart_item_ids: uniqueSelectedCartItems, product_count: productCount, currency_conversions: cookies.currencyConversions }).then(response => {
                const status = response.data.status;
                const data = response.data.data;
                if (status == "Success") {
                    toast.success('Order added successfully!');
                    setTimeout(() => {
                        setReloadCount(prevReloadCount => prevReloadCount + 1);
                        removeCookie('setSelectedCartItems', { path: '/' });
                        removeCookie('cookieCheckoutDesigner', { path: '/' });
                        navigate(`/thank-you?order_id=${data.order.id}`);
                    }, 1000);
                } else {
                    const errors = response.data.errors;
                    if (errors && errors.length > 0) {
                        errors.map((error, index) => {
                            toast.error(error);
                            return null; // React requires a return value, so we return null here
                        });
                    } else {
                        toast.error('There has been an error adding the order, please try again!');
                    }
                    setFormStatus('standby');

                }
            }).catch(() => {
                toast.error('There has been an error adding the order, please try again!');
            });
        }
    };

    const checkOutSubmitPaypal = (details, data) => {
        setFormStatus('loading');
        const uniqueSelectedCartItems = [
            ...new Set(
                cartItems
                    .filter(item => selectedCartItems.includes(item.product.id))
                    .map(item => item.id)
            )
        ];

        const shipping_data = {
            recipient: recipient,
            shipments: shipments
        }

        if (checkOutFormData.shipping_option == "UPS") {
            createUpsInternationalShipment(shipping_data).then(response => {
                const status = response.data.status;
                const data = response.data;
                if (status == "Success") {

                    const checkOutOrderItems = cartItems.map((cartItem, index) => {
                        const cartItemShippingRate = internationalShippingRate[index] || {};
                        const cartItemShipmentResults = data[index] || {};
                        const cartItemTrackingDetails = data.total_charges?.data[index] || {};

                        const cart_item_shipping_price = parseFloat(cartItemShippingRate?.RateResponse?.RatedShipment?.TotalCharges?.MonetaryValue) || 0;
                        const cart_item_shipping_currency = cartItemShippingRate?.RateResponse?.RatedShipment?.TotalCharges?.CurrencyCode || 'USD';
                        const cart_item_shipment_price = parseFloat(cartItemShipmentResults?.ShipmentResponse?.ShipmentResults?.ShipmentCharges?.TotalCharges?.MonetaryValue) || 0;
                        const cart_item_shipment_currency = cartItemShipmentResults?.ShipmentResponse?.ShipmentResults?.ShipmentCharges?.TotalCharges?.CurrencyCode || 'USD';

                        const cart_item_shipping_price_converted = CurrencyConverter(cart_item_shipping_price, cart_item_shipping_currency, cookies);
                        const cart_item_shipment_price_converted = CurrencyConverter(cart_item_shipment_price, cart_item_shipment_currency, cookies);

                        return {
                            product_id: cartItem.product.id,
                            quantity: cartItem.quantity,
                            tracking_details: cartItemTrackingDetails,
                            shipping_details: {
                                shipping_amount: cart_item_shipping_price,
                                shipping_amount_converted: cart_item_shipping_price_converted.price_raw,
                                shipment_amount: cart_item_shipment_price,
                                shipment_amount_converted: cart_item_shipment_price_converted.price_raw,
                                shipping_details: cartItemShippingRate,
                                shipment_details: cartItemShipmentResults,
                            }
                        };
                    });

                    postCheckOut({ ...checkOutFormData, payment_status: 'Paid', delivery_country_code: countryCode, user_id: currentUser, product_count: totalQuantity, subtotal_amount: subtotalAmount, subtotal_amount_converted: subtotalAmountConverted, total_amount: totalAmount, total_amount_converted: totalAmountConverted, shipping_amount: totalShippingAmount, shipping_amount_converted: totalShippingAmountConverted, cart_item_ids: uniqueSelectedCartItems, product_count: productCount, shipping_details: { ...shippingDetails, shipping_data: data }, currency_conversions: cookies.currencyConversions, payment_details: details, checkout_order_items: checkOutOrderItems }).then(response => {
                        const status = response.data.status;
                        const data = response.data.data;
                        if (status == "Success") {
                            toast.success('Order added successfully!');
                            setTimeout(() => {
                                setReloadCount(prevReloadCount => prevReloadCount + 1);
                                removeCookie('setSelectedCartItems', { path: '/' });
                                removeCookie('cookieCheckoutDesigner', { path: '/' });
                                navigate(`/thank-you?order_id=${data.order.id}`);
                            }, 1000);
                        } else {
                            const errors = response.data.errors;
                            if (errors && errors.length > 0) {
                                errors.map((error, index) => {
                                    toast.error(error);
                                    return null; // React requires a return value, so we return null here
                                });
                            } else {
                                toast.error('There has been an error adding the order, please try again!');
                            }
                            setFormStatus('standby');

                        }
                    }).catch(() => {
                        toast.error('There has been an error adding the order, please try again!');
                    });
                } else {
                    const errors = response.data.errors;
                    if (errors) {
                        const errors = response.data.errors;
                        if (errors) {
                            setErrors(errors);
                        }
                    } else {
                        toast.error('There has been an error adding the order, please try again!');
                    }
                }
            }).catch(() => {
                toast.error('There has been an error adding the order, please try again!');
            });

        } else if (checkOutFormData.shipping_option == "GIGM") {
            createGigmShipment(shipping_data).then(response => {
                const status = response.data.status;
                const data = response.data;
                if (status == "Success") {
                    postCheckOut({ ...checkOutFormData, payment_status: 'Paid', delivery_country_code: countryCode, user_id: currentUser, product_count: totalQuantity, subtotal_amount: subtotalAmount, subtotal_amount_converted: subtotalAmountConverted, total_amount: totalAmount, total_amount_converted: totalAmountConverted, shipping_amount: totalShippingAmount, shipping_amount_converted: totalShippingAmountConverted, cart_item_ids: uniqueSelectedCartItems, product_count: productCount, shipping_details: { ...shippingDetails, shipping_data: data }, currency_conversions: cookies.currencyConversions, payment_details: details }).then(response => {
                        const status = response.data.status;
                        const data = response.data.data;
                        if (status == "Success") {
                            toast.success('Order added successfully!');
                            setTimeout(() => {
                                setReloadCount(prevReloadCount => prevReloadCount + 1);
                                removeCookie('setSelectedCartItems', { path: '/' });
                                removeCookie('cookieCheckoutDesigner', { path: '/' });
                                navigate(`/thank-you?order_id=${data.order.id}`);
                            }, 1000);
                        } else {
                            const errors = response.data.errors;
                            if (errors && errors.length > 0) {
                                errors.map((error, index) => {
                                    toast.error(error);
                                    return null; // React requires a return value, so we return null here
                                });
                            } else {
                                toast.error('There has been an error adding the order, please try again!');
                            }
                            setFormStatus('standby');

                        }
                    }).catch(() => {
                        toast.error('There has been an error adding the order, please try again!');
                    });
                } else {
                    const errors = response.data.errors;
                    if (errors) {
                        const errors = response.data.errors;
                        if (errors) {
                            setErrors(errors);
                        }
                    } else {
                        toast.error('There has been an error adding the order, please try again!');
                    }
                }
            }).catch(() => {
                toast.error('There has been an error adding the order, please try again!');
            });
        } else {
            postCheckOut({ ...checkOutFormData, delivery_country_code: countryCode, user_id: currentUser, product_count: totalQuantity, subtotal_amount: subtotalAmount, subtotal_amount_converted: subtotalAmountConverted, total_amount: totalAmount, total_amount_converted: totalAmountConverted, shipping_amount: totalShippingAmount, shipping_amount_converted: totalShippingAmountConverted, cart_item_ids: uniqueSelectedCartItems, product_count: productCount, payment_status: 'Paid', payment_details: details }).then(response => {
                const status = response.data.status;
                const data = response.data.data;
                if (status == "Success") {
                    toast.success('Order added successfully!');
                    setTimeout(() => {
                        setReloadCount(prevReloadCount => prevReloadCount + 1);
                        removeCookie('setSelectedCartItems', { path: '/' });
                        removeCookie('cookieCheckoutDesigner', { path: '/' });
                        navigate(`/thank-you?order_id=${data.order.id}`);
                    }, 1000);
                } else {
                    const errors = response.data.errors;
                    if (errors && errors.length > 0) {
                        errors.map((error, index) => {
                            toast.error(error);
                            return null; // React requires a return value, so we return null here
                        });
                    } else {
                        toast.error('There has been an error adding the order, please try again!');
                    }
                    setFormStatus('standby');

                }
            }).catch(() => {
                toast.error('There has been an error adding the order, please try again!');
            });
        }
    };

    const checkOutSubmitStripe = async event => {
        setFormStatus('loading');
        const uniqueSelectedCartItems = [
            ...new Set(
                cartItems
                    .filter(item => selectedCartItems.includes(item.product.id))
                    .map(item => item.id)
            )
        ];

        const shipping_data = {
            recipient: recipient,
            shipments: shipments
        }

        if (checkOutFormData.shipping_option == "UPS") {
            createUpsInternationalShipment(shipping_data).then(response => {
                const status = response.data.status;
                const data = response.data;
                if (status == "Success") {

                    const checkOutOrderItems = cartItems.map((cartItem, index) => {
                        const cartItemShippingRate = internationalShippingRate[index] || {};
                        const cartItemShipmentResults = data[index] || {};
                        const cartItemTrackingDetails = data.total_charges?.data[index] || {};

                        const cart_item_shipping_price = parseFloat(cartItemShippingRate?.RateResponse?.RatedShipment?.TotalCharges?.MonetaryValue) || 0;
                        const cart_item_shipping_currency = cartItemShippingRate?.RateResponse?.RatedShipment?.TotalCharges?.CurrencyCode || 'USD';
                        const cart_item_shipment_price = parseFloat(cartItemShipmentResults?.ShipmentResponse?.ShipmentResults?.ShipmentCharges?.TotalCharges?.MonetaryValue) || 0;
                        const cart_item_shipment_currency = cartItemShipmentResults?.ShipmentResponse?.ShipmentResults?.ShipmentCharges?.TotalCharges?.CurrencyCode || 'USD';

                        const cart_item_shipping_price_converted = CurrencyConverter(cart_item_shipping_price, cart_item_shipping_currency, cookies);
                        const cart_item_shipment_price_converted = CurrencyConverter(cart_item_shipment_price, cart_item_shipment_currency, cookies);

                        return {
                            product_id: cartItem.product.id,
                            quantity: cartItem.quantity,
                            tracking_details: cartItemTrackingDetails,
                            shipping_details: {
                                shipping_amount: cart_item_shipping_price,
                                shipping_amount_converted: cart_item_shipping_price_converted.price_raw,
                                shipment_amount: cart_item_shipment_price,
                                shipment_amount_converted: cart_item_shipment_price_converted.price_raw,
                                shipping_details: cartItemShippingRate,
                                shipment_details: cartItemShipmentResults,
                            }
                        };
                    });

                    postCheckOut({ ...checkOutFormData, payment_status: 'Processing', delivery_country_code: countryCode, user_id: currentUser, product_count: totalQuantity, subtotal_amount: subtotalAmount, subtotal_amount_converted: subtotalAmountConverted, total_amount: totalAmount, total_amount_converted: totalAmountConverted, shipping_amount: totalShippingAmount, shipping_amount_converted: totalShippingAmountConverted, cart_item_ids: uniqueSelectedCartItems, product_count: productCount, shipping_details: { ...shippingDetails, shipping_data: data }, currency_conversions: cookies.currencyConversions, checkout_order_items: checkOutOrderItems }).then(response => {
                        const status = response.data.status;
                        const data = response.data.data;
                        if (status == "Success") {
                            toast.success('Order added successfully!');
                            setTimeout(() => {
                                setReloadCount(prevReloadCount => prevReloadCount + 1);
                                removeCookie('setSelectedCartItems', { path: '/' });
                                removeCookie('cookieCheckoutDesigner', { path: '/' });
                                navigate(`/thank-you?order_id=${data.order.id}`);
                            }, 1000);
                        } else {
                            const errors = response.data.errors;
                            if (errors && errors.length > 0) {
                                errors.map((error, index) => {
                                    toast.error(error);
                                    return null; // React requires a return value, so we return null here
                                });
                            } else {
                                toast.error('There has been an error adding the order, please try again!');
                            }
                            setFormStatus('standby');

                        }
                    }).catch(() => {
                        toast.error('There has been an error adding the order, please try again!');
                    });
                } else {
                    const errors = response.data.errors;
                    if (errors) {
                        const errors = response.data.errors;
                        if (errors) {
                            setErrors(errors);
                        }
                    } else {
                        toast.error('There has been an error adding the order, please try again!');
                    }
                }
            }).catch(() => {
                toast.error('There has been an error adding the order, please try again!');
            });

        } else if (checkOutFormData.shipping_option == "GIGM") {
            createGigmShipment(shipping_data).then(response => {
                const status = response.data.status;
                const data = response.data;
                if (status == "Success") {
                    postCheckOut({ ...checkOutFormData, payment_status: 'Processing', delivery_country_code: countryCode, user_id: currentUser, product_count: totalQuantity, subtotal_amount: subtotalAmount, subtotal_amount_converted: subtotalAmountConverted, total_amount: totalAmount, total_amount_converted: totalAmountConverted, shipping_amount: totalShippingAmount, shipping_amount_converted: totalShippingAmountConverted, cart_item_ids: uniqueSelectedCartItems, product_count: productCount, shipping_details: { ...shippingDetails, shipping_data: data }, currency_conversions: cookies.currencyConversions }).then(response => {
                        const status = response.data.status;
                        const data = response.data.data;
                        if (status == "Success") {
                            toast.success('Order added successfully!');
                            setTimeout(() => {
                                setReloadCount(prevReloadCount => prevReloadCount + 1);
                                removeCookie('setSelectedCartItems', { path: '/' });
                                removeCookie('cookieCheckoutDesigner', { path: '/' });
                                navigate(`/thank-you?order_id=${data.order.id}`);
                            }, 1000);
                        } else {
                            const errors = response.data.errors;
                            if (errors && errors.length > 0) {
                                errors.map((error, index) => {
                                    toast.error(error);
                                    return null; // React requires a return value, so we return null here
                                });
                            } else {
                                toast.error('There has been an error adding the order, please try again!');
                            }
                            setFormStatus('standby');

                        }
                    }).catch(() => {
                        toast.error('There has been an error adding the order, please try again!');
                    });
                } else {
                    const errors = response.data.errors;
                    if (errors) {
                        const errors = response.data.errors;
                        if (errors) {
                            setErrors(errors);
                        }
                    } else {
                        toast.error('There has been an error adding the order, please try again!');
                    }
                }
            }).catch(() => {
                toast.error('There has been an error adding the order, please try again!');
            });
        } else {
            postCheckOut({ ...checkOutFormData, delivery_country_code: countryCode, user_id: currentUser, product_count: totalQuantity, subtotal_amount: subtotalAmount, subtotal_amount_converted: subtotalAmountConverted, total_amount: totalAmount, total_amount_converted: totalAmountConverted, shipping_amount: totalShippingAmount, shipping_amount_converted: totalShippingAmountConverted, cart_item_ids: uniqueSelectedCartItems, product_count: productCount, payment_status: 'Processing' }).then(response => {
                const status = response.data.status;
                const data = response.data.data;
                if (status == "Success") {
                    toast.success('Order added successfully!');
                    setTimeout(() => {
                        setReloadCount(prevReloadCount => prevReloadCount + 1);
                        removeCookie('setSelectedCartItems', { path: '/' });
                        removeCookie('cookieCheckoutDesigner', { path: '/' });
                        navigate(`/thank-you?order_id=${data.order.id}`);
                    }, 1000);
                } else {
                    const errors = response.data.errors;
                    if (errors && errors.length > 0) {
                        errors.map((error, index) => {
                            toast.error(error);
                            return null; // React requires a return value, so we return null here
                        });
                    } else {
                        toast.error('There has been an error adding the order, please try again!');
                    }
                    setFormStatus('standby');

                }
            }).catch(() => {
                toast.error('There has been an error adding the order, please try again!');
            });
        }

    };

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
        if (countryName != "" && checkOutFormData.delivery_country_code != "" && checkOutFormData.delivery_province_code != "" && checkOutFormData.delivery_postal_code != "" && checkOutFormData.delivery_city != "" && checkOutFormData.delivery_address_line_1 != "" && checkOutFormData.delivery_shipping_option != "") {
            if (checkOutFormData.shipping_option == "UPS") {
                setErrors([]);
                setShipmentError(true);
                setShippingLoading(true);
                setCountryCode(getCountryCode(countryName));
                setInternationalShippingRate();
                setInternationalShippingRateData();
                var country_code = getCountryCode(countryName);

                const _recipient = {
                    name: checkOutFormData.delivery_first_name + " " + checkOutFormData.delivery_last_name,
                    phone: checkOutFormData.delivery_phone,
                    address_line: checkOutFormData.delivery_address_line_1,
                    city: checkOutFormData.delivery_city,
                    state_code: checkOutFormData.delivery_province_code,
                    postal_code: checkOutFormData.delivery_postal_code,
                    country_code: country_code,
                    residential: "true"
                };

                setRecipient(_recipient);

                if (currentUser && cartItems) {
                    const _shipments = cartItems.reduce((itemsArray, item) => {
                        if (selectedCartItems.includes(item.product.id)) {
                            // var length = (item.product.length > 0 ? item.product.length : 1) * item.quantity;
                            // var width = (item.product.width > 0 ? item.product.width : 1) * item.quantity;
                            // var weight = (item.product.weight ?? 1) * item.quantity;
                            var length = item.quantity;
                            var width = item.quantity;
                            var weight = (item.product.weight ?? 1) * item.quantity;

                            const product_unit_measurement = item.product.unit_measurement;
                            const is_imperial = getUnitOfMeasurement(item.seller.country_code);

                            if (is_imperial) {
                                const unit_measurement = 'IN';
                                let converted_length = convertToInch(parseFloat(length), product_unit_measurement);
                                let converted_width = convertToInch(parseFloat(width), product_unit_measurement);

                                if (converted_length > 0) {
                                    converted_length = converted_length.toFixed(2);
                                }

                                if (converted_width > 0) {
                                    converted_width = converted_width.toFixed(2);
                                }

                                const shipment_item = {
                                    seller: {
                                        id: item.seller.id,
                                        name: item.seller.first_name + " " + item.seller.last_name,
                                        phone: item.seller.phone_number,
                                        address_line: item.seller.address_line_1,
                                        city: item.seller.city,
                                        state_code: item.seller.province_code,
                                        postal_code: item.seller.postal_code,
                                        country_code: item.seller.country_code,
                                    },
                                    package: {
                                        weight: String(weight),
                                        description: item.product.description,
                                        dimensions: {
                                            length: String(converted_length),
                                            width: String(converted_width),
                                            unit_of_measurement: unit_measurement
                                        }
                                    }

                                }

                                itemsArray.push(shipment_item);

                            } else {
                                const unit_measurement = 'CM';
                                const converted_length = convertToCm(parseFloat(length), product_unit_measurement);
                                const converted_width = convertToCm(parseFloat(width), product_unit_measurement);

                                const shipment_item = {
                                    seller: {
                                        id: item.seller.id,
                                        name: item.seller.first_name + " " + item.seller.last_name,
                                        phone: item.seller.phone_number,
                                        address_line: item.seller.address_line_1,
                                        city: item.seller.city,
                                        state_code: item.seller.province_code,
                                        postal_code: item.seller.postal_code,
                                        country_code: item.seller.country_code,
                                    },
                                    package: {
                                        weight: String(weight),
                                        description: item.product.description,
                                        dimensions: {
                                            length: String(converted_length),
                                            width: String(converted_width),
                                            unit_of_measurement: unit_measurement
                                        }
                                    }

                                }

                                itemsArray.push(shipment_item);
                            }

                        }
                        return itemsArray;
                    }, []);


                    const data = {
                        recipient: _recipient,
                        shipments: _shipments,
                    };

                    setShipments(_shipments);
                    setRecipient(_recipient);

                    getInternationalRates(data).then(response => {
                        const status = response.data.status;
                        const data = response.data.data;
                        const international_shipping_rate = response.data.data;
                        const international_shipping_rate_data = response.data
                        if (status == "Success") {
                            setInternationalShippingRate(international_shipping_rate);
                            setInternationalShippingRateData(international_shipping_rate_data);
                            setShippingDetails({
                                ...shippingDetails,
                                shipments: _shipments,
                                recipient: _recipient,
                                shipping_rate_data: international_shipping_rate_data
                            });

                            const hasFailed = international_shipping_rate.some(rate => rate.status && rate.status === "Fail");
                            if (hasFailed) {
                                setShipmentError(true);
                            } else {
                                setShipmentError(false);
                            }

                            setShippingLoading(false);
                        } else {
                            const errors = response.data.errors;
                            if (errors) {
                                setErrors(errors);
                            }
                            // toast.error('There has been an error getting the shipping rates, please try again!');
                            setShippingLoading(false);
                        }
                    }).catch(() => {
                        toast.error('There has been an error getting the shipping rates, please try again!');
                        setShippingLoading(false);
                    });
                } else if (!currentUser && tempCartItems) {
                    const _shipments = tempCartItems.reduce((itemsArray, item) => {
                        if (selectedCartItems.includes(item.id)) {
                            // var length = (item.length > 0 ? item.length : 1) * item.quantity;
                            // var width = (item.width > 0 ? item.width : 1) * item.quantity;
                            // var weight = (item.weight ?? 1) * item.quantity;
                            var length = item.quantity;
                            var width = item.quantity;
                            var weight = (item.product.weight ?? 1) * item.quantity;

                            const product_unit_measurement = item.unit_measurement;
                            const is_imperial = getUnitOfMeasurement(item.user_country_code);

                            if (is_imperial) {
                                const unit_measurement = 'IN';
                                let converted_length = convertToInch(parseFloat(length), product_unit_measurement);
                                let converted_width = convertToInch(parseFloat(width), product_unit_measurement);

                                if (converted_length > 0) {
                                    converted_length = converted_length.toFixed(2);
                                }

                                if (converted_width > 0) {
                                    converted_width = converted_width.toFixed(2);
                                }

                                const shipment_item = {
                                    seller: {
                                        id: item.user_id,
                                        name: item.user_first_name + " " + item.user_last_name,
                                        phone: item.user_phone_number,
                                        address_line: item.user_address_line_1,
                                        city: item.user_city,
                                        state_code: item.user_province_code,
                                        postal_code: item.user_postal_code,
                                        country_code: item.user_country_code
                                    },
                                    package: {
                                        weight: String(weight),
                                        description: item.description,
                                        dimensions: {
                                            length: String(converted_length),
                                            width: String(converted_width),
                                            unit_of_measurement: unit_measurement
                                        }
                                    }

                                }
                                itemsArray.push(shipment_item);
                            } else {
                                const unit_measurement = 'CM';
                                const converted_length = convertToCm(parseFloat(length), product_unit_measurement);
                                const converted_width = convertToCm(parseFloat(width), product_unit_measurement);

                                const shipment_item = {
                                    seller: {
                                        id: item.user_id,
                                        name: item.user_first_name + " " + item.user_last_name,
                                        phone: item.user_phone_number,
                                        address_line: item.user_address_line_1,
                                        city: item.user_city,
                                        state_code: item.user_province_code,
                                        postal_code: item.user_postal_code,
                                        country_code: item.user_country_code
                                    },
                                    package: {
                                        weight: String(weight),
                                        description: item.description,
                                        dimensions: {
                                            length: String(converted_length),
                                            width: String(converted_width),
                                            unit_of_measurement: unit_measurement
                                        }
                                    }

                                }
                                itemsArray.push(shipment_item);
                            }
                        }
                        return itemsArray;
                    }, []);


                    const data = {
                        recipient: _recipient,
                        shipments: _shipments,
                    };

                    setShipments(_shipments);
                    setRecipient(_recipient);

                    getInternationalRates(data).then(response => {
                        const success = response.data.status;
                        const data = response.data.data;
                        const international_shipping_rate = response.data.data
                        const international_shipping_rate_data = response.data
                        if (success == success) {
                            setInternationalShippingRate(international_shipping_rate);
                            setInternationalShippingRateData(international_shipping_rate_data);
                            setShippingDetails({
                                ...shippingDetails,
                                shipments: _shipments,
                                recipient: _recipient,
                                shipping_rate_data: international_shipping_rate_data
                            });
                            setShippingLoading(false);
                            const hasFailed = international_shipping_rate.some(rate => rate.status && rate.status === "Fail");
                            if (hasFailed) {
                                setShipmentError(true);
                            } else {
                                setShipmentError(false);
                            }
                        } else {
                            toast.error('There has been an error getting the shipping rates, please try again!');
                            setShippingLoading(false);
                        }
                    }).catch(() => {
                        toast.error('There has been an error getting the shipping rates, please try again!');
                        setShippingLoading(false);
                    });
                }

            } else if (checkOutFormData.shipping_option == "GIGM") {
                setErrors([]);
                setShipmentError(false);
                setShippingLoading(true);
                setCountryCode(getCountryCode(countryName));
                setGigmShippingRate();
                setGigmShippingRateData();
                var country_code = getCountryCode(countryName);

                const _recipient = {
                    name: checkOutFormData.delivery_first_name + " " + checkOutFormData.delivery_last_name,
                    phone: checkOutFormData.delivery_phone,
                    address_line: checkOutFormData.delivery_address_line_1,
                    city: checkOutFormData.delivery_city,
                    state: checkOutFormData.delivery_province,
                    postal_code: checkOutFormData.delivery_postal_code,
                    country: checkOutFormData.delivery_country,
                    residential: "true",
                    lat: coordinates.latitude,
                    lon: coordinates.longitude
                };

                setRecipient(_recipient);

                if (currentUser && cartItems) {
                    const _shipments = cartItems.reduce((itemsArray, item) => {
                        if (selectedCartItems.includes(item.product.id)) {
                            // var length = (item.product.length > 0 ? item.product.length : 1) * item.quantity;
                            // var width = (item.product.width > 0 ? item.product.width : 1) * item.quantity;
                            // var weight = (item.product.weight ?? 1) * item.quantity;

                            var length = item.quantity;
                            var width = item.quantity;
                            var weight = (item.product.weight ?? 1) * item.quantity;
                            const product_unit_measurement = item.product.unit_measurement;
                            const is_imperial = getUnitOfMeasurement(item.seller.country_code);

                            if (is_imperial) {
                                const unit_measurement = 'IN';
                                let converted_length = convertToInch(parseFloat(length), product_unit_measurement);
                                let converted_width = convertToInch(parseFloat(width), product_unit_measurement);

                                if (converted_length > 0) {
                                    converted_length = converted_length.toFixed(2);
                                }

                                if (converted_width > 0) {
                                    converted_width = converted_width.toFixed(2);
                                }

                                const shipment_item = {
                                    shipper: {
                                        id: item.seller.id,
                                        name: item.seller.first_name + " " + item.seller.last_name,
                                        phone: item.seller.phone_number,
                                        address_line: item.seller.address_line_1,
                                        city: item.seller.city,
                                        state: item.seller.province,
                                        postal_code: item.seller.postal_code,
                                        country: item.seller.country,
                                        lat: item.seller.latitude,
                                        lon: item.seller.longitude,
                                    },
                                    package: {
                                        name: item.product.name,
                                        description: item.product.description,
                                        weight: String(weight),
                                        dimensions: {
                                            length: String(converted_length),
                                            width: String(converted_width),
                                            unit_of_measurement: unit_measurement
                                        }
                                    }

                                }

                                itemsArray.push(shipment_item);

                            } else {
                                const unit_measurement = 'CM';
                                const converted_length = convertToCm(parseFloat(length), product_unit_measurement);
                                const converted_width = convertToCm(parseFloat(width), product_unit_measurement);

                                const shipment_item = {
                                    shipper: {
                                        id: item.seller.id,
                                        name: item.seller.first_name + " " + item.seller.last_name,
                                        phone: item.seller.phone_number,
                                        address_line: item.seller.address_line_1,
                                        city: item.seller.city,
                                        state: item.seller.province,
                                        postal_code: item.seller.postal_code,
                                        country: item.seller.country,
                                    },
                                    package: {
                                        name: item.product.name,
                                        description: item.product.description,
                                        weight: String(weight),
                                        dimensions: {
                                            length: String(converted_length),
                                            width: String(converted_width),
                                            unit_of_measurement: unit_measurement
                                        }
                                    }

                                }

                                itemsArray.push(shipment_item);
                            }

                        }
                        return itemsArray;
                    }, []);

                    const data = {
                        recipient: _recipient,
                        shipments: _shipments,
                    };

                    setShipments(_shipments);
                    setRecipient(_recipient);

                    getGigmRates(data).then(response => {
                        const status = response.data.status;
                        const data = response.data.data;
                        if (data) {
                            const gigm_shipping_rate = response.data.total_charges;
                            const gigm_shipping_rate_data = response.data;

                            setGigmShippingRate(gigm_shipping_rate);
                            setGigmShippingRateData(gigm_shipping_rate_data);

                            setShippingDetails({
                                ...shippingDetails,
                                shipments: _shipments,
                                recipient: _recipient,
                                shipping_rate_data: gigm_shipping_rate_data
                            });
                            setShippingLoading(false);
                        } else {
                            const errors = response.data.errors;
                            if (errors) {
                                setErrors(errors);
                            }
                            // toast.error('There has been an error getting the shipping rates, please try again!');
                            setShippingLoading(false);
                        }
                    }).catch(() => {
                        toast.error('There has been an error getting the shipping rates, please try again!');
                        setShippingLoading(false);
                    });

                } else if (!currentUser && tempCartItems) {
                    const _shipments = tempCartItems.reduce((itemsArray, item) => {
                        if (selectedCartItems.includes(item.id)) {
                            var length = (item.length > 0 ? item.length : 1) * item.quantity;
                            var width = (item.width > 0 ? item.width : 1) * item.quantity;
                            var weight = (item.weight ?? 1) * item.quantity;
                            const product_unit_measurement = item.unit_measurement;
                            const is_imperial = getUnitOfMeasurement(item.user_country_code);

                            if (is_imperial) {
                                const unit_measurement = 'IN';
                                let converted_length = convertToInch(parseFloat(length), product_unit_measurement);
                                let converted_width = convertToInch(parseFloat(width), product_unit_measurement);

                                if (converted_length > 0) {
                                    converted_length = converted_length.toFixed(2);
                                }

                                if (converted_width > 0) {
                                    converted_width = converted_width.toFixed(2);
                                }

                                const shipment_item = {
                                    seller: {
                                        id: item.user_id,
                                        name: item.user_first_name + " " + item.user_last_name,
                                        phone: item.user_phone_number,
                                        address_line: item.user_address_line_1,
                                        city: item.user_city,
                                        state_code: item.user_province_code,
                                        postal_code: item.user_postal_code,
                                        country_code: item.user_country_code
                                    },
                                    package: {
                                        weight: String(weight),
                                        description: item.description,
                                        dimensions: {
                                            length: String(converted_length),
                                            width: String(converted_width),
                                            unit_of_measurement: unit_measurement
                                        }
                                    }

                                }
                                itemsArray.push(shipment_item);
                            } else {
                                const unit_measurement = 'CM';
                                const converted_length = convertToCm(parseFloat(length), product_unit_measurement);
                                const converted_width = convertToCm(parseFloat(width), product_unit_measurement);

                                const shipment_item = {
                                    seller: {
                                        id: item.user_id,
                                        name: item.user_first_name + " " + item.user_last_name,
                                        phone: item.user_phone_number,
                                        address_line: item.user_address_line_1,
                                        city: item.user_city,
                                        state_code: item.user_province_code,
                                        postal_code: item.user_postal_code,
                                        country_code: item.user_country_code
                                    },
                                    package: {
                                        weight: String(weight),
                                        description: item.description,
                                        dimensions: {
                                            length: String(converted_length),
                                            width: String(converted_width),
                                            unit_of_measurement: unit_measurement
                                        }
                                    }

                                }
                                itemsArray.push(shipment_item);
                            }
                        }
                        return itemsArray;
                    }, []);


                    const data = {
                        recipient: _recipient,
                        shipments: _shipments,
                    };

                    setShipments(_shipments);
                    setRecipient(_recipient);

                    getGigmRates(data).then(response => {
                        const status = response.data.status;
                        const data = response.data.data;
                        if (status == "Success") {
                            const gigm_shipping_rate = response.data.total_charges;
                            const gigm_shipping_rate_data = response.data;

                            setGigmShippingRate(gigm_shipping_rate);
                            setGigmShippingRateData(gigm_shipping_rate_data);

                            setShippingDetails({
                                ...shippingDetails,
                                shipments: _shipments,
                                recipient: _recipient,
                                shipping_rate_data: gigm_shipping_rate_data
                            });
                            setShippingLoading(false);
                        } else {
                            toast.error('There has been an error getting the shipping rates, please try again!');
                            setShippingLoading(false);
                        }
                    }).catch(() => {
                        toast.error('There has been an error getting the shipping rates, please try again!');
                        setShippingLoading(false);
                    });
                }
            }
        } else {
            setInternationalShippingRate();
            setInternationalShippingRateData();
            setGigmShippingRate();
            setGigmShippingRateData();
        }
    }, [countryName, checkOutFormData.delivery_country_code, checkOutFormData.delivery_province_code, checkOutFormData.delivery_postal_code, checkOutFormData.delivery_city, checkOutFormData.delivery_address_line_1, checkOutFormData.shipping_option]);

    useEffect(() => {
        setCheckOutFormData({
            ...checkOutFormData,
            currency: currency,
            currency_code: currencyCode,
        });
    }, [cookies]);

    useEffect(() => {
        if (currentUser) {
            let cart_total = 0;
            let cart_total_converted = 0;
            let cart_total_quantity = 0;
            let total_shipping_amount = 0;
            let total_shipping_amount_converted = 0;

            if (cartItems.length > 0 && selectedCartItems.length > 0) {

                cart_total_quantity = cartItems.reduce((ctq, item) => {
                    if (selectedCartItems.includes(item.product.id)) {
                        const quantity = item.quantity;

                        return ctq + quantity;
                    }
                    return ctq;
                }, 0);

                cart_total = cartItems.reduce((ct, item) => {
                    if (selectedCartItems.includes(item.product.id)) {
                        const subtotal = item.product.price * item.quantity;

                        return ct + subtotal;
                    }
                    return ct;
                }, 0);

                if (internationalShippingRate && checkOutFormData.shipping_option == "UPS") {
                    total_shipping_amount = cartItems.reduce((tsa, item, index) => {
                        if (selectedCartItems.includes(item.product.id)) {
                            let shippingPriceConverted = 0.00;
                            let total_shipping_price = 0.00;
                            let total_shipping_price_converted = 0.00;

                            let shipping_currency = 'USD';

                            if (internationalShippingRate && internationalShippingRate.length > 0) {
                                var shippingRate = internationalShippingRate[index];

                                if (shippingRate) {
                                    total_shipping_price = parseFloat(shippingRate?.RateResponse?.RatedShipment?.TotalCharges?.MonetaryValue) || 0;
                                    shipping_currency = shippingRate?.RateResponse?.RatedShipment?.TotalCharges?.CurrencyCode ?? 'USD';

                                }
                            }

                            return parseFloat(tsa) + parseFloat(total_shipping_price);
                        }
                    }, 0);

                    total_shipping_amount_converted = cartItems.reduce((tsa, item, index) => {
                        if (selectedCartItems.includes(item.product.id)) {
                            let total_shipping_price = 0.00;
                            let total_shipping_price_converted = 0.00;
                            let shipping_currency = 'USD';

                            if (internationalShippingRate && internationalShippingRate.length > 0) {
                                const shippingRate = internationalShippingRate[index];

                                if (shippingRate) {
                                    total_shipping_price = parseFloat(shippingRate?.RateResponse?.RatedShipment?.TotalCharges?.MonetaryValue) || 0; // Ensure it's a float
                                    shipping_currency = shippingRate?.RateResponse?.RatedShipment?.TotalCharges?.CurrencyCode || 'USD';

                                    total_shipping_price_converted = CurrencyConverter(total_shipping_price, shipping_currency, cookies);
                                }
                            }

                            // Return accumulated total
                            return tsa + (parseFloat(total_shipping_price_converted.price_raw) || 0); // Ensure we add a float
                        }

                        // Return tsa if the item is not included in selectedCartItems
                        return tsa;
                    }, 0); // Initial value is 0

                } else if (gigmShippingRate && checkOutFormData.shipping_option == "GIGM") {
                    let shipping_currency = 'NGN';

                    total_shipping_amount = gigmShippingRate.overall_amount;
                    const shipping_amount_conversion = CurrencyConverter(total_shipping_amount, shipping_currency, cookies);
                    total_shipping_amount_converted = shipping_amount_conversion.price_raw;

                }

                cart_total_converted = cartItems.reduce((ctc, item) => {
                    if (selectedCartItems.includes(item.product.id)) {
                        const fabricPrice = item.product.price ?? '0';
                        const fabricCurrency = item.product.currency ?? 'USD';

                        const convertedPrice = CurrencyConverter(fabricPrice, fabricCurrency, cookies);
                        const subtotal = convertedPrice.price_raw * item.quantity;

                        return ctc + subtotal;
                    }
                    return ctc;
                }, 0);
            }
            if (cart_total > 0) {
                setTotalQuantity(cart_total_quantity);
                setTotalAmount(parseFloat(parseFloat(cart_total) + parseFloat(total_shipping_amount_converted)));
                setTotalAmountConverted(parseFloat(parseFloat(cart_total_converted) + parseFloat(total_shipping_amount_converted)));
                setSubtotalAmount(cart_total);
                setSubtotalAmountConverted(cart_total_converted);

                setTotalAmountDisplay(formatPrice(parseFloat(parseFloat(cart_total_converted) + parseFloat(total_shipping_amount_converted))));
                setSubtotalAmountDisplay(formatPrice(cart_total_converted));
                setTotalShippingAmount(parseFloat(total_shipping_amount));
                setTotalShippingAmountConverted(parseFloat(total_shipping_amount_converted));
            } else {
                setTotalQuantity(0);
                setTotalAmount(0.00);
                setTotalAmountConverted(0.00);
                setSubtotalAmount(0.00);
                setSubtotalAmountConverted(0.00);
                setTotalAmountDisplay("0.00");
                setSubtotalAmountDisplay("0.00");
                setTotalShippingAmount(0.00);
                setTotalShippingAmountConverted(0.00);
            }
        }
    }, [cookies, selectedCartItems, item, reloadCount, cartItems, internationalShippingRate, gigmShippingRate, checkOutFormData]);

    useEffect(() => {
        if (currentUser) {
            setUserLoading(true);
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

            getUserCartItems()
                .then((response) => {
                    const cartItemsData = response.data.data;
                    if (cartItemsData) {
                        const filteredCartItems = cartItemsData.filter(item => selectedCartItems.includes(item.product.id));
                        setCartItems(filteredCartItems);
                        setCartLoading(false);
                        cartItemsData.map((cartItem) => {
                            if (selectedCartItems.includes(cartItem.product.id)) {
                                setProductCount((prevProductCount) => prevProductCount + cartItem.quantity);
                            }
                        });
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
            setUserLoading(false);
            setCartLoading(false);
        }
    }, [reloadCount, item, currentUser]);

    useEffect(() => {
        if (!currentUser && tempCartItems) {
            let cart_total = 0;
            let cart_total_converted = 0;
            let cart_total_quantity = 0;
            let total_shipping_amount = 0;
            let total_shipping_amount_converted = 0;

            if (tempCartItems.length > 0 && tempCartItems.length > 0) {

                cart_total_quantity = tempCartItems.reduce((ctq, item) => {
                    const quantity = item.quantity;

                    return ctq + quantity;

                    return ctq;
                }, 0);

                cart_total = tempCartItems.reduce((ct, item) => {
                    const subtotal = item.price * item.quantity;
                    return ct + subtotal;

                    return ct;
                }, 0);

                if (internationalShippingRate && checkOutFormData.shipping_option == "UPS") {
                    total_shipping_amount = tempCartItems.reduce((tsa, item, index) => {
                        if (item) {
                            let shippingPriceConverted = 0.00;
                            let total_shipping_price = 0.00;
                            let total_shipping_price_converted = 0.00;

                            let shipping_currency = 'USD';

                            if (internationalShippingRate && internationalShippingRate.length > 0) {
                                var shippingRate = internationalShippingRate[index];

                                if (shippingRate) {
                                    total_shipping_price = parseFloat(shippingRate?.RateResponse?.RatedShipment?.TotalCharges?.MonetaryValue) || 0;
                                    shipping_currency = shippingRate?.RateResponse?.RatedShipment?.TotalCharges?.CurrencyCode ?? 'USD';

                                }
                            }

                            return parseFloat(tsa) + parseFloat(total_shipping_price);
                        }

                    }, 0);

                    total_shipping_amount_converted = tempCartItems.reduce((tsa, item, index) => {
                        if (item) {
                            let total_shipping_price = 0.00;
                            let total_shipping_price_converted = 0.00;
                            let shipping_currency = 'USD';

                            if (internationalShippingRate && internationalShippingRate.length > 0) {
                                const shippingRate = internationalShippingRate[index];

                                if (shippingRate) {
                                    total_shipping_price = parseFloat(shippingRate?.RateResponse?.RatedShipment?.TotalCharges?.MonetaryValue) || 0; // Ensure it's a float
                                    shipping_currency = shippingRate?.RateResponse?.RatedShipment?.TotalCharges?.CurrencyCode || 'USD';

                                    total_shipping_price_converted = CurrencyConverter(total_shipping_price, shipping_currency, cookies);
                                }
                            }

                            return tsa + (parseFloat(total_shipping_price_converted.price_raw) || 0); // Ensure we add a float
                        }

                        // Return tsa if the item is not included in selectedCartItems
                        return tsa;
                    }, 0); // Initial value is 0

                } else if (gigmShippingRate && checkOutFormData.shipping_option == "GIGM") {
                    let shipping_currency = 'NGN';

                    total_shipping_amount = gigmShippingRate.overall_amount;
                    const shipping_amount_conversion = CurrencyConverter(total_shipping_amount, shipping_currency, cookies);
                    total_shipping_amount_converted = shipping_amount_conversion.price_raw;
                }

                cart_total_converted = tempCartItems.reduce((ctc, item) => {
                    if (item) {
                        const fabricPrice = item.price ?? '0';
                        const fabricCurrency = item.currency ?? 'USD';

                        const convertedPrice = CurrencyConverter(fabricPrice, fabricCurrency, cookies);
                        const subtotal = convertedPrice.price_raw * item.quantity;

                        return ctc + subtotal;
                    }
                    return ctc;
                }, 0);

            }

            if (cart_total > 0) {
                setTotalQuantity(cart_total_quantity);
                setTotalAmount(parseFloat(parseFloat(cart_total) + parseFloat(total_shipping_amount_converted)));
                setTotalAmountConverted(parseFloat(parseFloat(cart_total_converted) + parseFloat(total_shipping_amount_converted)));
                setSubtotalAmount(cart_total);
                setSubtotalAmountConverted(cart_total_converted);
                setTotalAmountDisplay(formatPrice(parseFloat(parseFloat(cart_total_converted) + parseFloat(total_shipping_amount_converted))))
                setTotalShippingAmount(parseFloat(total_shipping_amount));
                setSubtotalAmountDisplay(formatPrice(cart_total_converted));
                setTotalShippingAmountConverted(parseFloat(total_shipping_amount_converted));
            } else {
                setTotalQuantity(0);
                setTotalAmount(0.00);
                setTotalAmountConverted(0.00);
                setSubtotalAmount(0.00);
                setSubtotalAmountConverted(0.00);
                setTotalAmountDisplay("0.00");
                setTotalShippingAmount(0.00);
                setTotalShippingAmountConverted(0.00);
                setSubtotalAmountDisplay("0.00");
            }
        }

    }, [cookies, tempCartItems, selectedCartItems, reloadCount, item, internationalShippingRate, checkOutFormData]);

    useEffect(() => {
        var deliveryCountry = checkOutFormData.delivery_country;

        if (deliveryCountry && deliveryCountry != "") {
            var data = {
                country: deliveryCountry
            };
            setProvinces([]);
            setCities([]);

            getCountryStates(data);
        }
    }, [checkOutFormData.delivery_country]);

    useEffect(() => {
        var deliveryCountry = checkOutFormData.delivery_country;
        var deliveryProvince = checkOutFormData.delivery_province;

        if (deliveryCountry && deliveryCountry != "" && deliveryProvince && deliveryProvince != "") {
            var data = {
                country: deliveryCountry,
                state: deliveryProvince
            };
            setCities([]);

            getStateCities(data);
        }
    }, [checkOutFormData.delivery_country, checkOutFormData.delivery_province]);

    useEffect(() => {
        var deliveryCity = checkOutFormData.delivery_city;

        if (deliveryCity && deliveryCity != "") {
            var data = deliveryCity;
            getCoordinates(data);
        }
    }, [checkOutFormData.delivery_city]);

    useEffect(() => {
        const filteredTempCartItems = tempCartItems.filter(item => selectedCartItems.includes(item.id));
        setTempCartItems(filteredTempCartItems);

    }, [selectedCartItems]);
    return (
        <LayoutNoFooter>
            {cartLoading || userLoading ?
                <>
                    <LoadingPage />
                </>
                :
                <>
                    <section className="pb-5 pt-30 px-5" ref={formRef}>
                        <Container>
                            <Row>
                                <Col lg={12}>
                                    <Row className="pb-4">
                                        <Col md={6} className='d-flex justify-content-left align-items-center'>
                                            <h3 className="fs-30 fw-600 text-black mb-0">Check Out</h3>
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
                                                <Col lg={7}>
                                                    Item
                                                </Col>
                                                {/* <Col className="text-right" lg={2}>
                                                    Price
                                                </Col>
                                                <Col className="text-right" lg={2}>
                                                    Shipping
                                                </Col> */}
                                                <Col className="text-right" lg={5}>
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
                                                            {cartItems.map((cartItem, index) => {
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

                                                                let cart_item_total = 0;
                                                                let shippingPriceConverted = 0.00;
                                                                let totalShippingPrice = 0.00;
                                                                let totalShippingPriceConverted = 0.00;

                                                                let shippingCurrency = 'USD';

                                                                cart_item_total = parseFloat(subtotal);

                                                                return (
                                                                    <Card className='mt-2'>
                                                                        <Card.Body>
                                                                            <Row className="align-items-center">
                                                                                <Col lg={7}>
                                                                                    <div className='d-flex'>
                                                                                        <div className="designs-grid-div fabric-image"
                                                                                            style={{ backgroundImage: "url(" + fabricImage + ")", width: '126px', height: '126px' }}>
                                                                                        </div>

                                                                                        <div className='ms-3'>
                                                                                            <div className='mb-1 fw-500 text-black'>
                                                                                                {cartItem.product.name}
                                                                                            </div>
                                                                                            <div className="">
                                                                                                <p className="small">Qty. {cartItem.quantity} {cartItem.product.unit_measurement == "inch" ? cartItem.product.unit_measurement + "(es)" : cartItem.product.unit_measurement + "(s)"}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                                {/* <Col lg={2} className="text-right">
                                                                                    <h3 className="rufina-family fs-18"><strong>{convertedPrice.currency_code}{formattedSubtotal}</strong></h3>
                                                                                </Col>
                                                                                <Col lg={2} className="text-right">
                                                                                    {checkOutFormData.shipping_option == "UPS" && totalShippingPriceConverted.price_raw && totalShippingPriceConverted.price_raw > 0 ?
                                                                                        <h3 className="rufina-family fs-18"><strong>{convertedPrice.currency_code}{totalShippingPriceConverted.price}</strong></h3>
                                                                                        :
                                                                                        <h3 className="rufina-family fs-18"><strong>{convertedPrice.currency_code}0.00</strong></h3>
                                                                                    }

                                                                                </Col> */}
                                                                                <Col lg={5} className="text-right">
                                                                                    <h3 className="rufina-family"><strong>{convertedPrice.currency_code}{formatPrice(cart_item_total)}</strong></h3>
                                                                                    {cartItem.quantity > 1 ?
                                                                                        <p className="small text-muted">{convertedPrice.currency_code}{convertedPrice.price} each</p>
                                                                                        :
                                                                                        null
                                                                                    }
                                                                                </Col>
                                                                            </Row>
                                                                        </Card.Body>
                                                                    </Card>
                                                                );

                                                            })}

                                                        </>
                                                        :
                                                        <>
                                                            <Card className='mt-2'>
                                                                <Card.Body>
                                                                    <Row>
                                                                        <Col lg="12" className='text-center'>
                                                                            <span>Your cart is empty.</span>
                                                                        </Col>
                                                                    </Row>
                                                                </Card.Body>
                                                            </Card>
                                                        </>
                                                    }
                                                </>
                                                :
                                                <>
                                                    <Card className='mt-2'>
                                                        <Card.Body>
                                                            <Row>
                                                                <Col lg="12" className='text-center'>
                                                                    <span>Your cart is empty.</span>
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </>
                                            }
                                        </>
                                        :
                                        <>
                                            {tempCartItems ?
                                                <>
                                                    {tempCartItems.length > 0 && selectedCartItems.length > 0 ?
                                                        <>
                                                            {tempCartItems.map((cartItem, index) => {

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

                                                                let cart_item_total = 0;
                                                                let shippingPriceConverted = 0.00;
                                                                let totalShippingPrice = 0.00;
                                                                let totalShippingPriceConverted = 0.00;

                                                                let shippingCurrency = 'USD';

                                                                cart_item_total = parseFloat(subtotal);

                                                                return (
                                                                    <Card className='mt-2'>
                                                                        <Card.Body>
                                                                            <Row className="align-items-center">
                                                                                <Col lg={7}>
                                                                                    <div className='d-flex'>
                                                                                        <div className="designs-grid-div fabric-image"
                                                                                            style={{ backgroundImage: "url(" + fabricImage + ")", width: '126px', height: '126px' }}>
                                                                                        </div>

                                                                                        <div className='ms-3'>
                                                                                            <div className='mb-1 fw-500 text-black'>
                                                                                                {cartItem.name}
                                                                                            </div>
                                                                                            <div className="">
                                                                                                <p className="small">Qty. {cartItem.quantity} {cartItem.unit_measurement} {cartItem.unit_measurement == "inch" ? cartItem.unit_measurement + "(es)" : cartItem.unit_measurement + "(s)"}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                                {/* <Col lg={2} className="text-right">
                                                                                    <h3 className="rufina-family fs-18"><strong>{convertedPrice.currency_code}{formattedSubtotal}</strong></h3>
                                                                                </Col>
                                                                                <Col lg={2} className="text-right">
                                                                                    {checkOutFormData.shipping_option == "UPS" && totalShippingPriceConverted.price_raw && totalShippingPriceConverted.price_raw > 0 ?
                                                                                        <h3 className="rufina-family fs-18"><strong>{convertedPrice.currency_code}{totalShippingPriceConverted.price}</strong></h3>
                                                                                        :
                                                                                        <h3 className="rufina-family fs-18"><strong>{convertedPrice.currency_code}0.00</strong></h3>
                                                                                    }

                                                                                </Col> */}

                                                                                <Col lg={5} className="text-right">
                                                                                    <h3 className="rufina-family"><strong>{convertedPrice.currency_code}{formattedSubtotal}</strong></h3>
                                                                                    {cartItem.quantity > 1 ?
                                                                                        <p className="small text-muted">{convertedPrice.currency_code}{convertedPrice.price} each</p>
                                                                                        :
                                                                                        null
                                                                                    }
                                                                                </Col>
                                                                            </Row>
                                                                        </Card.Body>
                                                                    </Card>
                                                                );
                                                            })}

                                                        </>
                                                        :
                                                        <>
                                                            <Card className='mt-2'>
                                                                <Card.Body>
                                                                    <Row>
                                                                        <Col lg="12" className='text-center'>
                                                                            <span>Your cart is empty.</span>
                                                                        </Col>
                                                                    </Row>
                                                                </Card.Body>
                                                            </Card>
                                                        </>
                                                    }
                                                </>
                                                :
                                                <>
                                                    <Card className='mt-2'>
                                                        <Card.Body>
                                                            <Row>
                                                                <Col lg="12" className='text-center'>
                                                                    <span>Your cart is empty.</span>
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </>
                                            }
                                        </>
                                    }
                                    <Card className='mt-2'>
                                        <Card.Body className='bg-light'>
                                            <Row>
                                                <Col lg="12" className='text-right'>
                                                    <span className='fs-18 me-3'>Subtotal Amount: </span><span className='total-price fw-600'><h3 className="rufina-family total-price fw-600 d-inline-block">{currencyCode}{subtotalAmountDisplay}</h3></span>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col lg={6}>
                                    {checkOutFormData.ship_to && checkOutFormData.ship_to != "" && checkOutFormData.delivery_first_name && checkOutFormData.delivery_first_name != "" && checkOutFormData.delivery_email && checkOutFormData.delivery_email != "" && checkOutFormData.delivery_phone && checkOutFormData.delivery_phone != "" && checkOutFormData.delivery_address_line_1 && checkOutFormData.delivery_address_line_1 != "" && checkOutFormData.delivery_city && checkOutFormData.delivery_city != "" && checkOutFormData.delivery_province && checkOutFormData.delivery_province != "" && checkOutFormData.delivery_postal_code && checkOutFormData.delivery_postal_code != "" && checkOutFormData.delivery_country && checkOutFormData.delivery_country != "" && checkOutFormData.delivery_province_code && checkOutFormData.delivery_province_code != "" && checkOutFormData.delivery_city != "" && checkOutFormData.shipping_option != "" && checkOutFormData.shipping_option && checkOutFormData.payment_method && checkOutFormData.payment_method != "" ?
                                        null
                                        :
                                        <div className="mb-2 alert alert-warning" role="alert">
                                            Please fill up all the required information.
                                        </div>
                                    }
                                    <Form onSubmit={checkOutSubmit}>
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
                                                        {checkOutFormData.ship_to != "Ship to designer" || !selectedDesigner ?
                                                            <>
                                                                <hr className='mt-2' />
                                                                <Form.Label className='mb-2'>
                                                                    <strong>Shipping Address</strong>
                                                                </Form.Label>
                                                                <FormGroup className="mb-3">
                                                                    <Row>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="first_name" className='mb-2'>
                                                                                First Name <span className="text-danger">*</span>
                                                                            </Form.Label>
                                                                            <FormControl
                                                                                type="text"
                                                                                name="delivery_first_name"
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
                                                                                name="delivery_last_name"
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
                                                                                Email <span className="text-danger">*</span>
                                                                            </Form.Label>
                                                                            <FormControl
                                                                                type="email"
                                                                                name="delivery_email"
                                                                                value={checkOutFormData.delivery_email}
                                                                                onChange={handleChangePaymentInfo}
                                                                                id="email"
                                                                                required
                                                                            />
                                                                        </Col>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="phone" className='mb-2'>
                                                                                Phone Number <span className="text-danger">*</span>
                                                                            </Form.Label>
                                                                            <FormControl
                                                                                type="text"
                                                                                name="delivery_phone"
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
                                                                        Address Line 1 <span className="text-danger">*</span>
                                                                    </Form.Label>
                                                                    <FormControl
                                                                        type="text"
                                                                        name="delivery_address_line_1"
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
                                                                        name="delivery_address_line_2"
                                                                        value={checkOutFormData.delivery_address_line_2}
                                                                        onChange={handleChangePaymentInfo}
                                                                        id="address_line_2"
                                                                    />
                                                                </FormGroup>
                                                                <FormGroup className="mb-3">
                                                                    <Row>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="province" className='mb-2'>
                                                                                Country <span className="text-danger">*</span>
                                                                            </Form.Label>
                                                                            <Form.Control as='select' name='delivery_country' value={checkOutFormData.delivery_country} className=''
                                                                                onChange={function (e) {
                                                                                    setCountryName(e.target.value);
                                                                                    handleChangePaymentInfo(e);
                                                                                }} required>
                                                                                <option value='' disabled>Select Country</option>
                                                                                {Countries.map((country, index) => (
                                                                                    <option key={country + "-" + index} value={country}>
                                                                                        {country}
                                                                                    </option>
                                                                                ))}
                                                                            </Form.Control>
                                                                        </Col>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="province" className='mb-2'>
                                                                                Province/State <span className="text-danger">*</span>
                                                                            </Form.Label>
                                                                            {provincesLoading ?
                                                                                <>
                                                                                    <Form.Control as='select' id="province" name='delivery_province' value="" className='mr-sm-2' disabled required>
                                                                                        <option value='' selected>Loading...</option>
                                                                                    </Form.Control>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    {checkOutFormData.delivery_country && provinces && provinces.length > 0 ?
                                                                                        <Form.Control as='select' name='delivery_province' value={checkOutFormData.delivery_province} onChange={handleChangePaymentInfo} required>
                                                                                            <option value='' disabled>Select Province</option>
                                                                                            {provinces.map((province, index) => {
                                                                                                if (province.name != "American Samoa") {
                                                                                                    return (
                                                                                                        <option key={province.name + "-" + index} value={province.name} data-province-code={province.state_code}>
                                                                                                            {province.name}
                                                                                                        </option>
                                                                                                    )
                                                                                                }
                                                                                            })}
                                                                                        </Form.Control>
                                                                                        :
                                                                                        <Form.Control as='select' name='delivery_province' value="" disabled required>
                                                                                            <option value='' selected>Please select country first</option>
                                                                                        </Form.Control>
                                                                                    }
                                                                                </>
                                                                            }
                                                                        </Col>
                                                                    </Row>
                                                                </FormGroup>
                                                                <FormGroup className="mb-3">
                                                                    <Row>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="delivery_city" className='mb-2'>
                                                                                City <span className="text-danger">*</span>
                                                                            </Form.Label>
                                                                            {citiesLoading ?
                                                                                <>
                                                                                    <Form.Control as='select' name='delivery_city' value="" disabled required>
                                                                                        <option value='' selected>Loading...</option>
                                                                                    </Form.Control>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    {emptyCities ?
                                                                                        <>
                                                                                            <FormControl
                                                                                                type="text"
                                                                                                name="delivery_city"
                                                                                                value={checkOutFormData.delivery_city}
                                                                                                onChange={handleChangePaymentInfo}
                                                                                                id="city"
                                                                                                required
                                                                                            />
                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                            {checkOutFormData.delivery_province && cities && cities.length > 0 ?
                                                                                                <Form.Control as='select' name='delivery_city' value={checkOutFormData.delivery_city} onChange={handleChangePaymentInfo} required>
                                                                                                    <option value='' disabled>Select City</option>
                                                                                                    {cities.map((city, index) => (
                                                                                                        <option key={city + "-" + index} value={cities.name}>
                                                                                                            {city}
                                                                                                        </option>
                                                                                                    ))}
                                                                                                </Form.Control>
                                                                                                :
                                                                                                <Form.Control as='select' name='delivery_city' value="" disabled required>
                                                                                                    <option value='' selected>Please select a province first</option>
                                                                                                </Form.Control>
                                                                                            }
                                                                                        </>
                                                                                    }
                                                                                </>
                                                                            }
                                                                        </Col>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="postal_code" className='mb-2'>
                                                                                ZIP/Postal Code <span className="text-danger">*</span>
                                                                            </Form.Label>
                                                                            <FormControl
                                                                                type="text"
                                                                                name="delivery_postal_code"
                                                                                value={checkOutFormData.delivery_postal_code}
                                                                                onChange={handleChangePaymentInfo}
                                                                                id="postal_code"
                                                                                required
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </FormGroup>
                                                            </>
                                                            :
                                                            null
                                                        }

                                                    </>
                                                    :
                                                    null
                                                }
                                            </Card.Body>
                                        </Card>
                                        {checkOutFormData.ship_to && checkOutFormData.ship_to != "" ?
                                            <Card className="mb-3">
                                                <Card.Body>
                                                    <div className='fs-22 rufina-family fw-600'>Shipping Method</div>
                                                    <hr className='mt-2' />
                                                    <FormGroup>
                                                        <Row>
                                                            <Col lg="12">
                                                                <label className="mb-2 form-label" htmlFor="shipping_option">Shipping Provider <span className="text-danger">*</span></label>
                                                                {checkOutFormData.ship_to && checkOutFormData.ship_to != "" && checkOutFormData.delivery_first_name && checkOutFormData.delivery_first_name != "" && checkOutFormData.delivery_email && checkOutFormData.delivery_email != "" && checkOutFormData.delivery_phone && checkOutFormData.delivery_phone != "" && checkOutFormData.delivery_address_line_1 && checkOutFormData.delivery_address_line_1 != "" && checkOutFormData.delivery_city && checkOutFormData.delivery_city != "" && checkOutFormData.delivery_province && checkOutFormData.delivery_province != "" && checkOutFormData.delivery_postal_code && checkOutFormData.delivery_postal_code != "" && checkOutFormData.delivery_country && checkOutFormData.delivery_country != "" && checkOutFormData.delivery_province_code && checkOutFormData.delivery_province_code != "" && checkOutFormData.delivery_city != "" ?
                                                                    <Form.Control as='select' name='shipping_option' value={checkOutFormData.shipping_option} className='' onChange={handleChangePaymentInfo} required>
                                                                        <option value=''>Select Shipping Option</option>
                                                                        <option value='UPS'>UPS</option>
                                                                        <option value='GIGM'>GIGM</option>
                                                                    </Form.Control>
                                                                    :
                                                                    <>
                                                                        <Form.Control as='select' name='shipping_option' value={checkOutFormData.shipping_option} className='' disabled required>
                                                                            <option value=''>Select Shipping Option</option>
                                                                            <option value='UPS'>UPS</option>
                                                                            <option value='GIGM'>GIGM</option>
                                                                        </Form.Control>
                                                                        <p className="fs-12 text-warning mb-0 mt-2">Please fill up Shipping Information before choosing your Shipping Provider.</p>
                                                                    </>
                                                                }
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Card.Body>
                                            </Card>
                                            :
                                            null
                                        }
                                        {checkOutFormData.ship_to && checkOutFormData.ship_to != "" && checkOutFormData.delivery_first_name && checkOutFormData.delivery_first_name != "" && checkOutFormData.delivery_email && checkOutFormData.delivery_email != "" && checkOutFormData.delivery_phone && checkOutFormData.delivery_phone != "" && checkOutFormData.delivery_address_line_1 && checkOutFormData.delivery_address_line_1 != "" && checkOutFormData.delivery_city && checkOutFormData.delivery_city != "" && checkOutFormData.delivery_province && checkOutFormData.delivery_province != "" && checkOutFormData.delivery_postal_code && checkOutFormData.delivery_postal_code != "" && checkOutFormData.delivery_country && checkOutFormData.delivery_country != "" && checkOutFormData.delivery_province_code && checkOutFormData.delivery_province_code != "" && checkOutFormData.shipping_option && checkOutFormData.shipping_option != "" ?
                                            <>

                                                <Card className="mb-3">
                                                    <Card.Body>
                                                        <div className='fs-22 rufina-family fw-600'>Shipping</div>
                                                        <hr className='mt-2' />
                                                        <div>
                                                            <Card className="mb-2">
                                                                <Card.Body className='bg-light'>
                                                                    <Row>
                                                                        <Col lg={3}>
                                                                            Item
                                                                        </Col>
                                                                        <Col className="text-right" lg={3}>
                                                                            Price
                                                                        </Col>
                                                                        <Col className="text-right" lg={3}>
                                                                            Shipping
                                                                        </Col>
                                                                        <Col className="text-right" lg={3}>
                                                                            Total
                                                                        </Col>
                                                                    </Row>
                                                                </Card.Body>
                                                            </Card>
                                                            {shippingLoading ?
                                                                <Card className='mb-2'>
                                                                    <Card.Body>
                                                                        <Row>
                                                                            <Col lg="12" className='text-center'>
                                                                                <span className="fs-14">Loading...</span>
                                                                            </Col>
                                                                        </Row>
                                                                    </Card.Body>
                                                                </Card>
                                                                :
                                                                <>
                                                                    {currentUser ?
                                                                        <>
                                                                            {cartItems.length > 0 && selectedCartItems.length > 0 ?
                                                                                <>
                                                                                    {cartItems.map((cartItem, index) => {
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

                                                                                        let cart_item_total = 0;
                                                                                        let shippingPriceConverted = 0.00;
                                                                                        let totalShippingPrice = 0.00;
                                                                                        let totalShippingPriceConverted = 0.00;

                                                                                        let shippingCurrency = 'USD';

                                                                                        let item_errors = [];

                                                                                        if (internationalShippingRate && internationalShippingRate.length > 0 && checkOutFormData.shipping_option == "UPS") {
                                                                                            var shippingRate = internationalShippingRate[index];

                                                                                            if (shippingRate) {
                                                                                                totalShippingPrice = parseFloat(shippingRate?.RateResponse?.RatedShipment?.TotalCharges?.MonetaryValue) || 0;
                                                                                                shippingCurrency = shippingRate?.RateResponse?.RatedShipment?.TotalCharges?.CurrencyCode ?? 'USD';

                                                                                                totalShippingPriceConverted = CurrencyConverter(totalShippingPrice, shippingCurrency, cookies);

                                                                                                cart_item_total = parseFloat(subtotal) + parseFloat(totalShippingPriceConverted.price_raw);

                                                                                                if (shippingRate.status == "Fail") {
                                                                                                    item_errors = shippingRate?.data?.response?.errors ?? [];
                                                                                                }
                                                                                            }

                                                                                        } else if (gigmShippingRate && checkOutFormData.shipping_option == "GIGM") {
                                                                                            var shippingRate = gigmShippingRate.data[index];

                                                                                            shippingCurrency = shippingRate.currency_code;
                                                                                            totalShippingPrice = shippingRate.total_charges_amount;

                                                                                            totalShippingPriceConverted = CurrencyConverter(totalShippingPrice, shippingCurrency, cookies);

                                                                                            cart_item_total = parseFloat(subtotal) + parseFloat(totalShippingPriceConverted.price_raw);
                                                                                        } else {
                                                                                            cart_item_total = parseFloat(subtotal);
                                                                                        }


                                                                                        // if (errors && errors.shipment_errors?.length > 0) {
                                                                                        //     const shipment_errors = errors.shipment_errors;
                                                                                        //     item_errors = shipment_errors[index];
                                                                                        // }

                                                                                        return (
                                                                                            <Card className="mb-3">
                                                                                                <Card.Body className="py-3">
                                                                                                    <Row className="align-items-center">
                                                                                                        <Col lg={3}>
                                                                                                            <div className='d-flex'>
                                                                                                                <div>
                                                                                                                    <div className='mb-0 fw-500 text-black fs-14'>
                                                                                                                        {cartItem.product.name}
                                                                                                                    </div>
                                                                                                                    <div className="">
                                                                                                                        <p className="mb-0 fs-12">Qty. {cartItem.quantity} {cartItem.product.unit_measurement == "inch" ? cartItem.product.unit_measurement + "(es)" : cartItem.product.unit_measurement + "(s)"}</p>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </Col>
                                                                                                        <Col lg={3} className="text-right">
                                                                                                            <p className="mb-0 fs-14 fw-500">{convertedPrice.currency_code}{formattedSubtotal}</p>
                                                                                                        </Col>
                                                                                                        <Col lg={3} className="text-right">
                                                                                                            {checkOutFormData.shipping_option == "UPS" && totalShippingPriceConverted.price_raw && totalShippingPriceConverted.price_raw > 0 ?
                                                                                                                <p className="mb-0 fs-14 fw-500">{convertedPrice.currency_code}{totalShippingPriceConverted.price}</p>
                                                                                                                : checkOutFormData.shipping_option == "GIGM" && totalShippingPriceConverted.price_raw && totalShippingPriceConverted.price_raw > 0 ?
                                                                                                                    <p className="mb-0 fs-14 fw-500">{convertedPrice.currency_code}{totalShippingPriceConverted.price}</p>
                                                                                                                    :
                                                                                                                    <p className="mb-0 fs-14 fw-500">{convertedPrice.currency_code}0.00</p>
                                                                                                            }

                                                                                                        </Col>
                                                                                                        <Col lg={3} className="text-right">
                                                                                                            <p className="mb-0 fs-14 fw-500">{convertedPrice.currency_code}{formatPrice(cart_item_total)}</p>
                                                                                                            {cartItem.quantity > 1 ?
                                                                                                                <p className="fs-12 text-muted mb-0">{convertedPrice.currency_code}{convertedPrice.price} each</p>
                                                                                                                :
                                                                                                                null
                                                                                                            }
                                                                                                        </Col>
                                                                                                    </Row>
                                                                                                    {item_errors && item_errors.length > 0 ? (
                                                                                                        <>
                                                                                                            {item_errors.map((error, index) => (
                                                                                                                <p className="fs-12 mt-1 mb-0 text-danger lh-15" key={index}>{error.message}</p>
                                                                                                            ))}
                                                                                                        </>
                                                                                                    ) : null}
                                                                                                </Card.Body>
                                                                                            </Card>
                                                                                        );

                                                                                    })}

                                                                                </>
                                                                                :
                                                                                <>
                                                                                    <Card className="mb-3">
                                                                                        <Card.Body>
                                                                                            <Row>
                                                                                                <Col lg="12" className='text-center'>
                                                                                                    <span>Your cart is empty.</span>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </Card.Body>
                                                                                    </Card>
                                                                                </>
                                                                            }
                                                                        </>
                                                                        :
                                                                        <>
                                                                            {!currentUser && tempCartItems ?
                                                                                <>
                                                                                    {tempCartItems.length > 0 && tempCartItems.length > 0 ?
                                                                                        <>
                                                                                            {tempCartItems.map((cartItem, index) => {
                                                                                                var cart_product = cartItem;
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

                                                                                                let cart_item_total = 0;
                                                                                                let shippingPriceConverted = 0.00;
                                                                                                let totalShippingPrice = 0.00;
                                                                                                let totalShippingPriceConverted = 0.00;

                                                                                                let shippingCurrency = 'USD';
                                                                                                let item_errors = [];

                                                                                                if (internationalShippingRate && internationalShippingRate.length > 0 && checkOutFormData.shipping_option == "UPS") {
                                                                                                    var shippingRate = internationalShippingRate[index];

                                                                                                    if (shippingRate) {
                                                                                                        totalShippingPrice = parseFloat(shippingRate?.RateResponse?.RatedShipment?.TotalCharges?.MonetaryValue) || 0;
                                                                                                        shippingCurrency = shippingRate?.RateResponse?.RatedShipment?.TotalCharges?.CurrencyCode ?? 'USD';

                                                                                                        totalShippingPriceConverted = CurrencyConverter(totalShippingPrice, shippingCurrency, cookies);

                                                                                                        cart_item_total = parseFloat(subtotal) + parseFloat(totalShippingPriceConverted.price_raw);

                                                                                                        if (shippingRate.status == "Fail") {
                                                                                                            item_errors = shippingRate?.data?.response?.errors ?? [];
                                                                                                        }
                                                                                                    }

                                                                                                } else if (gigmShippingRate && checkOutFormData.shipping_option == "GIGM") {
                                                                                                    var shippingRate = gigmShippingRate.data[index];

                                                                                                    shippingCurrency = shippingRate.currency_code;
                                                                                                    totalShippingPrice = shippingRate.total_charges_amount;

                                                                                                    totalShippingPriceConverted = CurrencyConverter(totalShippingPrice, shippingCurrency, cookies);

                                                                                                    cart_item_total = parseFloat(subtotal) + parseFloat(totalShippingPriceConverted.price_raw);
                                                                                                } else {
                                                                                                    cart_item_total = parseFloat(subtotal);
                                                                                                }

                                                                                                // let item_errors = [];
                                                                                                // if (errors && errors.shipment_errors?.length > 0) {
                                                                                                //     const shipment_errors = errors.shipment_errors;
                                                                                                //     item_errors = shipment_errors[index];
                                                                                                // }
                                                                                                
                                                                                                return (
                                                                                                    <Card className="mb-2">
                                                                                                        <Card.Body className="py-3">
                                                                                                            <Row className="align-items-center">
                                                                                                                <Col lg={5}>
                                                                                                                    <div className='d-flex'>
                                                                                                                        <div>
                                                                                                                            <div className='mb-0 fs-14 fw-500 text-black'>
                                                                                                                                {cartItem.name}
                                                                                                                            </div>
                                                                                                                            <div className="">
                                                                                                                                <p className="mb-0 fs-12">Qty. {cartItem.quantity} {cartItem.unit_measurement == "inch" ? cartItem.unit_measurement + "(es)" : cartItem.unit_measurement + "(s)"}</p>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </Col>
                                                                                                                <Col lg={2} className="text-right">
                                                                                                                    <p className="mb-0 fs-14 fw-500">{convertedPrice.currency_code}{formattedSubtotal}</p>
                                                                                                                </Col>
                                                                                                                <Col lg={2} className="text-right">
                                                                                                                    {checkOutFormData.shipping_option == "UPS" && totalShippingPriceConverted.price_raw && totalShippingPriceConverted.price_raw > 0 ?
                                                                                                                        <p className="mb-0 fs-14 fw-500">{convertedPrice.currency_code}{totalShippingPriceConverted.price}</p>
                                                                                                                        : checkOutFormData.shipping_option == "GIGM" && totalShippingPriceConverted.price_raw && totalShippingPriceConverted.price_raw > 0 ?
                                                                                                                            <p className="mb-0 fs-14 fw-500">{convertedPrice.currency_code}{totalShippingPriceConverted.price}</p>
                                                                                                                            :
                                                                                                                            <p className="mb-0 fs-14 fw-500">{convertedPrice.currency_code}0.00</p>
                                                                                                                    }

                                                                                                                </Col>
                                                                                                                <Col lg={3} className="text-right">
                                                                                                                    <p className="mb-0 fs-14 fw-500">{convertedPrice.currency_code}{formatPrice(cart_item_total)}</p>
                                                                                                                    {cartItem.quantity > 1 ?
                                                                                                                        <p className="fs-12 text-muted mb-0">{convertedPrice.currency_code}{convertedPrice.price} each</p>
                                                                                                                        :
                                                                                                                        null
                                                                                                                    }
                                                                                                                </Col>
                                                                                                            </Row>
                                                                                                            {item_errors && item_errors.length > 0 ? (
                                                                                                                <>
                                                                                                                    {item_errors.map((error, index) => (
                                                                                                                        <p className="mt-1 mb-0 text-danger fs-12 lh-15" key={index}>{error.message}</p>
                                                                                                                    ))}
                                                                                                                </>
                                                                                                            ) : null}
                                                                                                        </Card.Body>
                                                                                                    </Card>
                                                                                                );

                                                                                            })}

                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                            <Card className="mb-3">
                                                                                                <Card.Body>
                                                                                                    <Row>
                                                                                                        <Col lg="12" className='text-center'>
                                                                                                            <span>Your cart is empty.</span>
                                                                                                        </Col>
                                                                                                    </Row>
                                                                                                </Card.Body>
                                                                                            </Card>
                                                                                        </>
                                                                                    }
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    <Card className="mb-2">
                                                                                        <Card.Body>
                                                                                            <Row>
                                                                                                <Col lg="12" className='text-center'>
                                                                                                    <span>Your cart is empty.</span>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </Card.Body>
                                                                                    </Card>
                                                                                </>
                                                                            }
                                                                        </>
                                                                    }

                                                                    <Card>
                                                                        <Card.Body className='bg-light'>
                                                                            <Row>
                                                                                <Col className="text-right" lg={12}>
                                                                                    <span><span className="me-3">Total Amount: </span> <span className="fw-500">{currencyCode}{totalAmountDisplay}</span></span>
                                                                                </Col>
                                                                            </Row>
                                                                        </Card.Body>
                                                                    </Card>
                                                                </>
                                                            }
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                                <Card>
                                                    <Card.Body>
                                                        <div className='fs-22 rufina-family fw-600'>Payment Info</div>
                                                        <hr className='mt-2' />
                                                        <div>Payment Method <span className="text-danger">*</span></div>
                                                        {/* <div className='mt-3 d-flex'>
                                                            <div className='d-flex'>
                                                                <input
                                                                    type="radio"
                                                                    name="payment_method"
                                                                    value="VISA"
                                                                    onChange={(e) => { setRadioButtonValue("VISA"); handleChangePaymentInfo(e); }}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className='ms-3'>
                                                                <FaCcVisa size={20} />
                                                            </div>

                                                            <div className='ms-2'>
                                                                VISA
                                                            </div>
                                                        </div> */}

                                                        <label className='mt-2 d-flex cursor-pointer'>
                                                            <div className='d-flex'>
                                                                <input
                                                                    type="radio"
                                                                    name="payment_method"
                                                                    value="Paypal"
                                                                    onChange={(e) => { setRadioButtonValue("Paypal"); handleChangePaymentInfo(e); }}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className='ms-3'>
                                                                <FaCcPaypal size={20} />
                                                            </div>

                                                            <div className='ms-2'>
                                                                Paypal
                                                            </div>
                                                        </label>

                                                        <label className='mt-2 d-flex cursor-pointer'>
                                                            <div className='d-flex'>
                                                                <input
                                                                    type="radio"
                                                                    name="payment_method"
                                                                    value="Stripe"
                                                                    onChange={(e) => { setRadioButtonValue("Stripe"); handleChangePaymentInfo(e); }}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className='ms-3'>
                                                                <FaCcStripe size={20} />
                                                            </div>

                                                            <div className='ms-2'>
                                                                Stripe
                                                            </div>
                                                        </label>

                                                        {/* <div className='mt-2 d-flex'>
                                                            <div className='d-flex'>
                                                                <input
                                                                    type="radio"
                                                                    name="payment_method"
                                                                    value="MasterCard"
                                                                    onChange={(e) => { setRadioButtonValue("MasterCard"); handleChangePaymentInfo(e); }}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className='ms-3'>
                                                                <FaCcMastercard size={20} />
                                                            </div>

                                                            <div className='ms-2'>
                                                                MasterCard
                                                            </div>
                                                        </div> */}
                                                        <label className='mt-2 d-flex cursor-pointer'>
                                                            <div className='d-flex'>
                                                                <input
                                                                    type="radio"
                                                                    name="payment_method"
                                                                    value="Google Pay"
                                                                    onChange={(e) => { setRadioButtonValue("Google Pay"); handleChangePaymentInfo(e); }}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className='ms-3'>
                                                                <FaGooglePay size={20} />
                                                            </div>

                                                            <div className='ms-2'>
                                                               Google Pay
                                                            </div>
                                                        </label>

                                                        <label className='mt-2 d-flex cursor-pointer'>
                                                            <div className='d-flex'>
                                                                <input
                                                                    type="radio"
                                                                    name="payment_method"
                                                                    value="Cash on Delivery"
                                                                    onChange={(e) => { setRadioButtonValue("Cash on Delivery"); handleChangePaymentInfo(e); }}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className='ms-3'>
                                                                <FaTruck size={20} />
                                                            </div>

                                                            <div className='ms-2'>
                                                                Cash on Delivery
                                                            </div>
                                                        </label>

                                                        {radioButtonValue != "" && radioButtonValue != "Cash on Delivery" && radioButtonValue != "Paypal" && radioButtonValue != "Stripe" && radioButtonValue != "Google Pay" ?
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
                                                        <div className='mt-4'>
                                                            <Row>
                                                                <Col lg="12">
                                                                    {errors && (errors.shipment_errors || errors.recipient_errors || shipmentError) ?
                                                                        <button type="button" className='btn btn-primary' disabled={true}>{formStatus != "standby" ? "Loading..." : "Check Out"}</button>
                                                                        :
                                                                        <>
                                                                            {shippingLoading ?
                                                                                <button type="button" className='btn btn-primary' disabled={true}>Loading...</button>
                                                                                :
                                                                                <>
                                                                                    {totalAmount < 1 ?
                                                                                        <button type="button" className='btn btn-primary' disabled={true}>{formStatus != "standby" ? "Loading..." : "Check Out"}</button>
                                                                                        :
                                                                                        <>
                                                                                            {radioButtonValue != "" ?
                                                                                                <>
                                                                                                    {radioButtonValue == "Paypal" ?
                                                                                                        <>
                                                                                                            {currentUser ?
                                                                                                                <>
                                                                                                                    {user?.profile_complete == 1 ?
                                                                                                                        <PayPalButtons
                                                                                                                            fundingSource="paypal"
                                                                                                                            createOrder={(data, actions) => {
                                                                                                                                return actions.order.create({
                                                                                                                                    purchase_units: [{
                                                                                                                                        amount: {
                                                                                                                                            value: totalAmount // Replace with the actual amount
                                                                                                                                        },
                                                                                                                                    }],
                                                                                                                                });
                                                                                                                            }}
                                                                                                                            onApprove={(data, actions) => {
                                                                                                                                return actions.order.capture().then((details) => {
                                                                                                                                    // alert("Transaction completed by " + details.payer.name.given_name);
                                                                                                                                    checkOutSubmitPaypal(details, data);
                                                                                                                                    // Call your backend API to save the transaction details
                                                                                                                                });
                                                                                                                            }}
                                                                                                                        />
                                                                                                                        :
                                                                                                                        <Link to="/user/complete-profile">
                                                                                                                            <button type="button" className='btn btn-primary'>Complete Profile to Check Out</button>
                                                                                                                        </Link>
                                                                                                                    }
                                                                                                                </>

                                                                                                                :
                                                                                                                <Link to="/login?redirect_to=/checkout">
                                                                                                                    <button type="button" className='btn btn-primary'>{formStatus != "standby" ? "Loading..." : "Sign in to Check Out"}</button>
                                                                                                                </Link>
                                                                                                                // <button type="button" onClick={toggleAuthModal} className='btn btn-primary'>{formStatus != "standby" ? "Loading..." : "Sign in to Check Out"}</button>
                                                                                                            }
                                                                                                        </>
                                                                                                        : radioButtonValue == "Stripe" ?
                                                                                                            <>
                                                                                                                {currentUser ?
                                                                                                                    <>
                                                                                                                        {user?.profile_complete == 1 ?
                                                                                                                            <button type="button" className='btn btn-primary' onClick={() => checkOutSubmitStripe()}>{formStatus != "standby" ? "Loading..." : "Check Out"}</button>
                                                                                                                            :
                                                                                                                            <Link to="/user/complete-profile">
                                                                                                                                <button type="button" className='btn btn-primary'>Complete Profile to Check Out</button>
                                                                                                                            </Link>
                                                                                                                        }
                                                                                                                    </>

                                                                                                                    :
                                                                                                                    <Link to="/login?redirect_to=/checkout">
                                                                                                                        <button type="button" className='btn btn-primary'>{formStatus != "standby" ? "Loading..." : "Sign in to Check Out"}</button>
                                                                                                                    </Link>
                                                                                                                    // <button type="button" onClick={toggleAuthModal} className='btn btn-primary'>{formStatus != "standby" ? "Loading..." : "Sign in to Check Out"}</button>
                                                                                                                }
                                                                                                            </>
                                                                                                            : radioButtonValue == "Google Pay" ?
                                                                                                                <>
                                                                                                                    {currentUser ?
                                                                                                                        <>
                                                                                                                        {user?.profile_complete == 1 ?
                                                                                                                            <>
                                                                                                                                <GooglePayButton
                                                                                                                                environment="TEST"  // Ensure this is set to TEST
                                                                                                                                buttonType="checkout"
                                                                                                                                paymentRequest={{
                                                                                                                                    apiVersion: 2,
                                                                                                                                    apiVersionMinor: 0,
                                                                                                                                    allowedPaymentMethods: [
                                                                                                                                        {
                                                                                                                                            type: 'CARD',
                                                                                                                                            parameters: {
                                                                                                                                                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                                                                                                                                allowedCardNetworks: ['MASTERCARD', 'VISA'],
                                                                                                                                            },
                                                                                                                                            tokenizationSpecification: {
                                                                                                                                                type: 'PAYMENT_GATEWAY',
                                                                                                                                                parameters: {
                                                                                                                                                    gateway: 'example',  // Mock gateway
                                                                                                                                                    gatewayMerchantId: 'exampleGatewayMerchantId',
                                                                                                                                                },
                                                                                                                                            },
                                                                                                                                        },
                                                                                                                                    ],
                                                                                                                                    merchantInfo: {
                                                                                                                                        merchantId: 'TEST',  // Mock merchant ID
                                                                                                                                        merchantName: 'Sample Merchant',
                                                                                                                                    },
                                                                                                                                    transactionInfo: {
                                                                                                                                        totalPriceStatus: 'FINAL',
                                                                                                                                        totalPrice: totalAmountDisplay,
                                                                                                                                        currencyCode: 'USD',
                                                                                                                                        countryCode: countryCode,
                                                                                                                                    },
                                                                                                                                }}
                                                                                                                                onLoadPaymentData={(paymentData) => {
                                                                                                                                    console.log('Payment data loaded:', paymentData);
                                                                                                                                }}
                                                                                                                                onError={(reason) => {
                                                                                                                                    console.log('Payment Error:', reason);
                                                                                                                                }}
                                                                                                                                onCancel={(reason) => {
                                                                                                                                    console.log('Payment Cancelled:', reason);
                                                                                                                                }}
                                                                                                                                />
                                                                                                                            </>
                                                                                                                            :
                                                                                                                            <Link to="/user/complete-profile">
                                                                                                                                <button type="button" className='btn btn-primary'>Complete Profile to Check Out</button>
                                                                                                                            </Link>
                                                                                                                        }
                                                                                                                        </>
                                                                                                                        :
                                                                                                                        <Link to="/login?redirect_to=/checkout">
                                                                                                                            <button type="button" className='btn btn-primary'>{formStatus != "standby" ? "Loading..." : "Sign in to Check Out"}</button>
                                                                                                                        </Link>
                                                                                                                    }
                                                                                                                </>
                                                                                                                :
                                                                                                            <>
                                                                                                                {currentUser ?
                                                                                                                    <>
                                                                                                                        {user?.profile_complete == 1 ?
                                                                                                                            <button type="submit" className='btn btn-primary'>{formStatus != "standby" ? "Loading..." : "Check Out"}</button>
                                                                                                                            :
                                                                                                                            <Link to="/user/complete-profile">
                                                                                                                                <button type="button" className='btn btn-primary'>Complete Profile to Check Out</button>
                                                                                                                            </Link>
                                                                                                                        }
                                                                                                                    </>
                                                                                                                    :
                                                                                                                    <Link to="/login?redirect_to=/checkout">
                                                                                                                        <button type="button" className='btn btn-primary'>{formStatus != "standby" ? "Loading..." : "Sign in to Check Out"}</button>
                                                                                                                    </Link>
                                                                                                                    // <button type="button" onClick={toggleAuthModal} className='btn btn-primary'>{formStatus != "standby" ? "Loading..." : "Sign in to Check Out"}</button>
                                                                                                                }
                                                                                                            </>
                                                                                                    }
                                                                                                </>
                                                                                                :
                                                                                                <button type="button" className='btn btn-primary' disabled={true}>Check Out</button>
                                                                                            }

                                                                                        </>

                                                                                    }
                                                                                </>
                                                                            }
                                                                        </>
                                                                    }

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

            {/* Login */}
            <Modal show={authModalShow} fullscreen={false} onHide={() => setAuthModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className="h-100">
                        <Row className="h-100">
                            <Col lg="12">
                                {/* <Login onLogin={handleLogin} /> */}
                                {showModal === 1 ? <SignUp onSignup={handleLogin} showLogin={(e) => showLogin(e)} /> : <Login showSignup={(e) => showSignup(e)} onLogin={handleLogin} onCloseModal={(e) => setAuthModalShow(e)} />}
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </LayoutNoFooter >
    );
};

export default Cart;