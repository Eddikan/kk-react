import React, { useMemo, useState, useEffect } from "react";
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../Assets/styles/Stripe/stripe.css'
import { Col, Row, Card } from 'react-bootstrap';
import axios from "axios";
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import Loading from 'Components/Shared/Loading';
import KoutureLogo from 'Assets/images/kouture-konect-icon.png';
import CurrencyConverter from "Utils/CurrencyConverter";

import useResponsiveFontSize from "../useResponsiveFontSize";

const useOptions = () => {
    const fontSize = useResponsiveFontSize();
    return useMemo(
        () => ({
            style: {
                base: {
                    fontSize,
                    color: "#424770",
                    letterSpacing: "0.025em",
                    fontFamily: "Source Code Pro, monospace",
                    "::placeholder": {
                        color: "#aab7c4"
                    }
                },
                invalid: {
                    color: "#9e2146"
                }
            }
        }),
        [fontSize]
    );
};

const StripeMobile = () => {
    const stripe = useStripe();
    const stripeElements = useElements();
    const options = useOptions();
    const navigate = useNavigate();
    const location = useLocation();

    // Parse search string to get query parameters
    const searchParams = new URLSearchParams(location.search);

    // Access individual query parameters using get method
    const item = searchParams.get('item');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [totalAmount, setTotalAmount] = useState();
    const [cartItems, setCartItems] = useState([]);
    const [checkOutFormData, setCheckOutFormData] = useState([]);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [shippingData, setShippingData] = useState([]);
    const [errors, setErrors] = useState([]);
    const [shippingRate, setShippingRate] = useState([]);
    const [reloadCount, setReloadCount] = useState(0);

    const putCheckOut = async (data, orderID) => {
        return await axios.put(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'order/' + orderID + '?current_user_id=' + data.user_id + '&token=' + data.token, data);
    };

    const postCheckOut = async (data) => {
        return await axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'order?current_user_id=' + data.user_id + '&token=' + data.token, data);
    };

    const getUserOrder = async (orderID) => {
        return await axios.get(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'order/' + orderID);
    };

    const createUpsInternationalShipment = async (data) => {
        return await axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'ups/v2/create/shipment/international?current_user_id=' + data.user_id + '&token=' + data.token, data);
    };

    const createGigmShipment = async (data) => {
        return await axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'gigm/v2/create/shipment?current_user_id=' + data.user_id + '&token=' + data.token, data);
    };

    const getUserCartItems = async (userID,token) => {
        return await axios.get(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'user/' + userID + '/cart?current_user_id' + userID + '&token=' + token);
    };

    const checkOutSubmitStripe = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify('Checkout submit'));
        if (!stripe || !stripeElements) {
            setIsSubmitting(false);
            return;
        }

        // Create payment method using the card element
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: stripeElements.getElement(CardNumberElement),
        });

        if (error) {
            setErrorMessage(error.message);
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(error.message));
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 1500);
            setIsSubmitting(false);
            return;
        }

        // Send payment method to your backend to create a payment intent
        if (checkOutFormData) {
            try {
                const response = await axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'create-intent?current_user_id=' + checkOutFormData.user_id + '&token=' + checkOutFormData.token, {
                    payment_method_id: paymentMethod.id,
                    total_amount: checkOutFormData.total_amount_converted, // Example amount in cents (e.g., $50.00)
                    currency: checkOutFormData.currency_conversions ?? 'USD',
                    first_name: checkOutFormData.delivery_first_name,
                    last_name: checkOutFormData.delivery_last_name,
                    receipt_email: checkOutFormData.delivery_email,
                    description: 'Payment for Order',

                });

                if (response.data.error) {
                    setErrorMessage(response.data.error);
                    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({error: response.data.error}));
                } else {
                    const details = response.data.data;
                    if (checkOutFormData.shipping_option == "UPS") {
                        createUpsInternationalShipment(shippingData).then(response => {
                            const status = response.data.status;
                            const data = response.data;
                            if (status == "Success" && data.shipment_errors.length == 0) {

                                const checkOutOrderItems = cartItems.map((cartItem, index) => {
                                    const cartItemShippingRate = shippingRate[index] || {};
                                    const cartItemShipmentResults = data[index] || {};
                                    const cartItemTrackingDetails = data.total_charges?.data[index] || {};

                                    const cart_item_shipping_price = parseFloat(cartItemShippingRate?.RateResponse?.RatedShipment?.TotalCharges?.MonetaryValue) || 0;
                                    const cart_item_shipping_currency = cartItemShippingRate?.RateResponse?.RatedShipment?.TotalCharges?.CurrencyCode || 'USD';
                                    const cart_item_shipment_price = parseFloat(cartItemShipmentResults?.ShipmentResponse?.ShipmentResults?.ShipmentCharges?.TotalCharges?.MonetaryValue) || 0;
                                    const cart_item_shipment_currency = cartItemShipmentResults?.ShipmentResponse?.ShipmentResults?.ShipmentCharges?.TotalCharges?.CurrencyCode || 'USD';
                                    //no conversion yet
                                    // const cart_item_shipping_price_converted = CurrencyConverter(cart_item_shipping_price, cart_item_shipping_currency, cookies);
                                    // const cart_item_shipment_price_converted = CurrencyConverter(cart_item_shipment_price, cart_item_shipment_currency, cookies);
                                    const cart_item_shipping_price_converted = cart_item_shipping_price;
                                    const cart_item_shipment_price_converted = cart_item_shipment_price;
                                    return {
                                        product_id: cartItem.product.id,
                                        quantity: cartItem.quantity,
                                        tracking_details: cartItemTrackingDetails,
                                        shipping_details: {
                                            shipping_amount: cart_item_shipping_price,
                                            // shipping_amount_converted: cart_item_shipping_price_converted.price_raw,
                                            shipping_amount_converted: cart_item_shipping_price_converted,
                                            shipment_amount: cart_item_shipment_price,
                                            // shipment_amount_converted: cart_item_shipment_price_converted.price_raw,
                                            shipment_amount_converted: cart_item_shipment_price_converted,
                                            shipping_details: cartItemShippingRate,
                                            shipment_details: cartItemShipmentResults,
                                        }
                                    };
                                });

                                // postCheckOut({ ...checkOutFormData, user_id: user_id, subtotal_amount: subtotalAmount, total_amount: totalAmount, cart_item_ids: orderItems, product_count: productCount, payment_status: 'Paid', payment_details: details }).then(response => {
                                postCheckOut({ ...checkOutFormData, payment_status: 'Paid', payment_details: details, checkout_order_items: checkOutOrderItems }).then(response => {
                                    const status = response.data.status;
                                    const data = response.data.data;
                                    if (status == "Success") {
                                        // toast.success('Order added successfully!');
                                        // console.log("data", data);
                                        setTimeout(() => {
                                            setReloadCount(prevReloadCount => prevReloadCount + 1);
                                            // navigate(`/stripe?order_id=${data.order.id}`);
                                            window.ReactNativeWebView &&
                                                window.ReactNativeWebView.postMessage(JSON.stringify(data));
                                        }, 1000);
                                    } else {
                                        const errors = response.data.errors;
                                        if (errors && errors.length > 0) {
                                            errors.map((error, index) => {
                                                toast.error(error);
                                                return null; // React requires a return value, so we return null here
                                            });
                                            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({error:errors}));
                                        } else {
                                            toast.error('There has been an error adding the order, please try again!');
                                            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify('Checkout Error: There has been an error adding the order, please try again!'));
                                        }
                                    }
                                }).catch((error) => {
                                    const errorDetails = {
                                        message: error.message,
                                        stack: error.stack,
                                        response: error.response ? {
                                            status: error.response.status,
                                            data: error.response.data,
                                            headers: error.response.headers,
                                        } : null,
                                    };
                                    toast.error('There has been an error adding the order, please try again!');
                                    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({error:errorDetails}));
                                });
                            } else {
                                const errors = response.data.shipment_errors;
                                if (errors) {
                                    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({error:errors}));
                                } else {
                                    toast.error('There has been an error adding the order, please try again!');
                                    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify('UPS error: There has been an error adding the order, please try again!'));
                                }
                            }
                        }).catch((error) => {
                            const errorDetails = {
                                message: error.message,
                                stack: error.stack,
                                response: error.response ? {
                                    status: error.response.status,
                                    data: error.response.data,
                                    headers: error.response.headers,
                                } : null,
                            };
                            toast.error('There has been an error adding the order, please try again!');
                            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({error:errorDetails}));
                        });

                    } else if (checkOutFormData.shipping_option == "GIGM") {
                        createGigmShipment(shippingData).then(response => {
                            const status = response.data.status;
                            const data = response.data;
                            const checkOutOrderItems = cartItems.map((cartItem, index) => {
                                try {
                                    const cartItemShippingRate = shippingRate.data[index] || {};
                                    const cartItemShipmentResults = data.responses[index].data || {};
                                    const cartItemTrackingDetails = data.responses[index].data || {};

                                    const cart_item_shipping_price = parseFloat(cartItemShippingRate?.total_charges_amount) || 0;
                                    const cart_item_shipping_currency = cartItemShippingRate?.currency_code || 'USD';

                                    const cart_item_shipment_price = cart_item_shipping_price;
                                    const cart_item_shipment_currency = cart_item_shipping_currency;

                                    // Doesn't have conversion yet
                                    // const cart_item_shipping_price_converted = CurrencyConverter(cart_item_shipping_price, cart_item_shipping_currency, cookies);
                                    // const cart_item_shipment_price_converted = CurrencyConverter(cart_item_shipment_price, cart_item_shipment_currency, cookies);
                                    const cart_item_shipping_price_converted = cart_item_shipping_price;
                                    const cart_item_shipment_price_converted = cart_item_shipment_price;
                                    // Return the object you're constructing for each cart item
                                    return {
                                        product_id: cartItem.product.id,
                                        quantity: cartItem.quantity,
                                        tracking_details: cartItemTrackingDetails,
                                        shipping_details: {
                                            shipping_amount: cart_item_shipping_price,
                                            // shipping_amount_converted: cart_item_shipping_price_converted.price_raw,
                                            shipping_amount_converted: cart_item_shipping_price_converted,
                                            shipment_amount: cart_item_shipment_price,
                                            // shipment_amount_converted: cart_item_shipment_price_converted.price_raw,
                                            shipment_amount_converted: cart_item_shipment_price_converted,
                                            shipping_details: cartItemShippingRate,
                                            shipment_details: cartItemShipmentResults,
                                        }
                                    };
                                } catch (error) {
                                    const errorDetails = {
                                        message: error.message,
                                        stack: error.stack,
                                        response: error.response ? {
                                            status: error.response.status,
                                            data: error.response.data,
                                            headers: error.response.headers,
                                        } : null,
                                    };
                                    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({error:errorDetails}));
                                    console.error("Error in map function: ", error);
                                    throw error;  // You can throw the error again to catch it outside the map
                                }
                            });
                            if (status == "Success") {
                                // postCheckOut({ ...checkOutFormData, user_id: user_id, subtotal_amount: subtotalAmount, total_amount: totalAmount, cart_item_ids: orderItems, product_count: productCount, payment_status: 'Paid', payment_details: details }).then(response => {
                                postCheckOut({ ...checkOutFormData, payment_status: 'Paid', payment_details: details, checkout_order_items: checkOutOrderItems }).then(response => {
                                    const status = response.data.status;
                                    const data = response.data.data;
                                    if (status == "Success") {
                                        // toast.success('Order added successfully!');
                                        // console.log("data", data);
                                        setTimeout(() => {
                                            setReloadCount(prevReloadCount => prevReloadCount + 1);
                                            // navigate(`/stripe?order_id=${data.order.id}`);
                                            window.ReactNativeWebView &&
                                                window.ReactNativeWebView.postMessage(JSON.stringify(data));
                                        }, 1000);
                                    } else {
                                        const errors = response.data.errors;
                                        if (errors && errors.length > 0) {
                                            errors.map((error, index) => {
                                                toast.error(error);
                                                return null; // React requires a return value, so we return null here
                                            });
                                            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({error:errors}));
                                        } else {
                                            toast.error('There has been an error adding the order, please try again!');
                                            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify('There has been an error adding the order, please try again!'));
                                        }
                                    }
                                }).catch((error) => {
                                    const errorDetails = {
                                        message: error.message,
                                        stack: error.stack,
                                        response: error.response ? {
                                            status: error.response.status,
                                            data: error.response.data,
                                            headers: error.response.headers,
                                        } : null,
                                    };
                                    toast.error('There has been an error adding the order, please try again!');
                                    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({error:errorDetails}));
                                });
                            } else {
                                const errors = response.data.errors;
                                if (errors) {
                                    const errors = response.data.errors;
                                    if (errors) {
                                        setErrors(errors);
                                    }
                                    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({error:errors}));
                                } else {
                                    toast.error('There has been an error adding the order, please try again!');
                                    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify('There has been an error adding the order, please try again!'));
                                }
                            }
                        }).catch((error) => {
                            const errorDetails = {
                                message: error.message,
                                stack: error.stack,
                                response: error.response ? {
                                    status: error.response.status,
                                    data: error.response.data,
                                    headers: error.response.headers,
                                } : null,
                            };
                            toast.error('There has been an error adding the order, please try again!');
                            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({error:errorDetails}));
                            toast.error('There has been an error adding the order, please try again!');
                        });
                    }
                }
            } catch (error) {
                const errorDetails = {
                    message: error.message,
                    stack: error.stack,
                    response: error.response ? {
                        status: error.response.status,
                        data: error.response.data,
                        headers: error.response.headers,
                    } : null,
                };
                setErrorMessage('Payment failed. Please try again.');
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({error:errorDetails}));
            }
        } else {
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify('Checkout form data is empty'));
        }

        setIsSubmitting(false);
    };

    // useEffect(() => {
    //     // setCartItems(checkout_data);
    //     console.log("checkoutFormData", checkOutFormData);
    //     if (checkOutFormData) {
    //         setCartLoading(false);
    //     }
    // }, []);

    useEffect(() => {
        const handleMessage = (event) => {
            try {
                const message = JSON.parse(event.data);

                if (message.type === 'FROM_RN') {
                    //   console.log('Received message from React Native:', message.payload);
                    //   alert(JSON.stringify(message.payload));
                    if (message.payload.checkout_data) {
                        setCheckOutFormData(message.payload.checkout_data);
                        setTotalAmount(message.payload.checkout_data.total_amount_converted);
                        if (message.payload.checkout_data.user_id) {
                            getUserCartItems(message.payload.checkout_data.user_id,message.payload.checkout_data.token)
                                .then((response) => {
                                    const cartItemsData = response.data.data;
                                    if (cartItemsData) {
                                        const filteredCartItems = cartItemsData.filter(item => message.payload.checkout_data.cart_item_ids.includes(item.id));
                                        setCartItems(filteredCartItems);
                                    } else {
                                        toast.error('There has been an error getting the products, please try again!');
                                        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify('There has been an error getting the products, please try again!'));
                                    }
                                })
                                .catch((error) => {
                                    const errorDetails = {
                                        message: error.message,
                                        stack: error.stack,
                                        response: error.response ? {
                                            status: error.response.status,
                                            data: error.response.data,
                                            headers: error.response.headers,
                                        } : null,
                                    };
                                    toast.error('There has been an error getting the products, please try again!');
                                    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({error:errorDetails}));
                                });
                        } else {
                            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify('Undefined User ID'));
                        }
                    }

                    if (message.payload.checkout_data.shipping_details) {
                        setShippingData(message.payload.checkout_data.shipping_details);
                    }

                    if (message.payload.shipping_rate) {
                        setShippingRate(message.payload.shipping_rate);
                    }
                }
            } catch (error) {
                const errorDetails = {
                    message: error.message,
                    stack: error.stack,
                    response: error.response ? {
                        status: error.response.status,
                        data: error.response.data,
                        headers: error.response.headers,
                    } : null,
                };
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({error:errorDetails}));   
                console.error('Error processing message:', error);
            }

        };

        // Listen for messages
        document.addEventListener('message', handleMessage);
        return () => {
            // Cleanup the event listener
            document.removeEventListener('message', handleMessage);
            setIsPageLoading(false);
        };

    }, []);
    // alert(JSON.stringify(shippingData));

    return (
        <>
            <div className='DemoWrapper'>
                <div className="Demo">
                    <Card>
                        <Card.Body>
                            <>
                                {checkOutFormData ?
                                    <>
                                        <form onSubmit={checkOutSubmitStripe}>
                                            <Row>
                                                <Col lg={12}>
                                                    <img src={KoutureLogo} className="kouture-icon" alt="Kouture Konect Logo" />
                                                    <div className="mb-3 mt-2">
                                                        {showErrorMessage && (
                                                            <p className="alert alert-danger mt-3 mb-0 text-center" style={{ fontSize: '14px' }}>{errorMessage}</p>
                                                        )}
                                                    </div>
                                                    {errors && errors.length > 0 &&
                                                        <>
                                                            <div className="mb-3 mt-2">
                                                                {errors.map((error, index) => (
                                                                    <p className="alert alert-danger mt-3 mb-0 text-center" style={{ fontSize: '14px' }} key={index}>{error.message}</p>
                                                                ))}
                                                            </div>
                                                        </>
                                                    }

                                                </Col>
                                                <Col lg={12}>
                                                    {totalAmount && totalAmount != "" ?
                                                        <p>Total Amount: {checkOutFormData.currency_code ?? '$'}{totalAmount}</p>
                                                        :
                                                        <p>Total Amount: ...</p>
                                                    }
                                                </Col>
                                                <Col lg='12'>
                                                    <label className='w-100'>
                                                        Card number
                                                        <CardNumberElement
                                                            options={options}
                                                        />
                                                    </label>
                                                </Col>
                                                <Col lg='8'>
                                                    <label className='w-100'>
                                                        Expiration date
                                                        <CardExpiryElement
                                                            options={options}
                                                        />
                                                    </label>
                                                </Col>
                                                <Col lg='4'>
                                                    <label className='w-100'>
                                                        CVC
                                                        <CardCvcElement
                                                            options={options}
                                                        />
                                                    </label>
                                                </Col>
                                            </Row>
                                            <button type="submit" className="w-100" disabled={!stripe} style={{ background: '#CEA835' }}>
                                                {isSubmitting ? 'Loading...' : 'Pay'}
                                            </button>
                                        </form>
                                    </>
                                    :
                                    <div className='DemoWrapper'>
                                        <div className="Demo">
                                            <Row>
                                                <Col lg={12}>
                                                    <img src={KoutureLogo} className="kouture-icon" alt="Kouture Konect Logo" />
                                                </Col>
                                                <Col lg={12}>
                                                    <p className="text-center">No records found</p>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                }

                            </>


                        </Card.Body>
                    </Card>

                </div>
            </div>


        </>

    );
};

export default StripeMobile;
