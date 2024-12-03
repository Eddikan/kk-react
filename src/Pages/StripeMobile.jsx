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
    const order_first_name = searchParams.get('order_first_name');
    const order_last_name = searchParams.get('order_last_name');
    const order_email = searchParams.get('order_email');
    const order_amount = searchParams.get('order_amount');
    const order_currency = searchParams.get('order_currency');
    const order_currency_code = searchParams.get('order_currency_code');
    const user_id = searchParams.get('user_id');
    const checkoutData = JSON.parse(decodeURIComponent(searchParams.get('checkout_data')));
    const orderItems = JSON.parse(searchParams.get('order_items'));
    const countryCode = searchParams.get('delivery_country_code');
    const totalQuantity  = searchParams.get('product_count');
    const subtotalAmount = searchParams.get('subtotal_amount');
    const subtotalAmountConverted = searchParams.get('subtotal_amount_converted'); 
    const totalAmountConverted = searchParams.get('total_amount_converted'); 
    const totalShippingAmount = searchParams.get('shipping_amount'); 
    const totalShippingAmountConverted = searchParams.get('shipping_amount_converted'); 
    const shippingDetails = JSON.parse(decodeURIComponent(searchParams.get('shipping_details'))); 

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'token', 'userDetails', 'userRole', 'selectedCartItems', 'tempCart', 'cookieCheckoutDesigner']);
    const [selectedCartItems, setSelectedCartItems] = useState(orderItems);
    const [currentUser, setCurrentUser] = useState(cookies.currentUser ?? null);
    const [productCount, setProductCount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(order_amount);
    const [cartItems, setCartItems] = useState([]);
    const [cartItemId, setCartItemId] = useState('');
    const [reloadCount, setReloadCount] = useState(0);
    const [cartLoading, setCartLoading] = useState(true);
    const [checkOutFormData, setCheckOutFormData] = useState(checkoutData);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const putCheckOut = async (data, orderID) => {
        return await axios.put(process.env.REACT_APP_API_ENDPOINT + 'order/' + orderID, data);
    };

    const postCheckOut = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'order', data);
    };

    const getUserOrder = async (orderID) => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'order/' + orderID);
    };


    const checkOutSubmitStripe = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

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
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false); 
            }, 1500);
            setIsSubmitting(false);
            return;
        }

        // Send payment method to your backend to create a payment intent
        try {
            const response = await axios.post(process.env.REACT_APP_API_ENDPOINT + 'create-intent', {
                payment_method_id: paymentMethod.id,
                total_amount: totalAmountConverted, // Example amount in cents (e.g., $50.00)
                currency: order_currency,
                first_name: order_first_name,
                last_name: order_last_name,
                receipt_email: order_email,
                description: 'Payment for Order',

            });

            if (response.data.error) {
                setErrorMessage(response.data.error);
            } else {
                const details = response.data.data;
                // postCheckOut({ ...checkOutFormData, user_id: user_id, subtotal_amount: subtotalAmount, total_amount: totalAmount, cart_item_ids: orderItems, product_count: productCount, payment_status: 'Paid', payment_details: details }).then(response => {
                postCheckOut({ ...checkOutFormData, user_id: user_id, subtotal_amount: subtotalAmount, total_amount: totalAmount, cart_item_ids: orderItems, product_count: totalQuantity, payment_status: 'Paid', payment_details: details, delivery_country_code: countryCode,product_count: totalQuantity, subtotal_amount: subtotalAmount, subtotal_amount_converted: subtotalAmountConverted,shipping_amount: totalShippingAmount, shipping_amount_converted: totalShippingAmountConverted,product_count: productCount, shipping_details: { ...shippingDetails },total_amount_converted: totalAmountConverted, currency: order_currency, currency_code: order_currency_code }).then(response => {
                    const success = response.data.status;
                    const data = response.data.data;
                    if (success == success) {
                        // toast.success('Order added successfully!');
                        // console.log("data", data);
                        setTimeout(() => {
                            setReloadCount(prevReloadCount => prevReloadCount + 1);
                            // navigate(`/stripe?order_id=${data.order.id}`);
                            window.ReactNativeWebView &&
                                window.ReactNativeWebView.postMessage(JSON.stringify(data));
                        }, 1000);
                    } else {
                        toast.error('There has been an error adding the order, please try again!');
                    }
                }).catch((error) => {
                    toast.error('There has been an error adding the order, please try again!');
                    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(error));
                });
            }
        } catch (err) {
            setErrorMessage('Payment failed. Please try again.');
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(err));
        }

        setIsSubmitting(false);
    };

    useEffect(() => {
        // setCartItems(checkout_data);
        console.log("checkoutFormData", checkOutFormData);
        if (checkOutFormData) {
            setCartLoading(false);
        }
    }, []);


    return (
        <>
            <div className='DemoWrapper'>
                <div className="Demo">
                    <Card>
                        <Card.Body>

                            <>
                                {selectedCartItems && selectedCartItems.length > 0 ?
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
                                                   
                                                </Col>
                                                <Col lg={12}>
                                                    <p>Total Amount: {order_currency_code}{totalAmountConverted}</p>
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
                                            <button type="submit" className="w-100" disabled={!stripe} style={{background: '#CEA835'}}>
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
                                                    <p className="text-center">Order not found</p>
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
