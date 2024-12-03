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

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'token', 'userDetails', 'userRole', 'selectedCartItems', 'tempCart', 'cookieCheckoutDesigner']);
    const [currentUser, setCurrentUser] = useState(cookies.currentUser ?? null);
    const [productCount, setProductCount] = useState(0);
    const [totalAmount, setTotalAmount] = useState();
    const [cartItems, setCartItems] = useState([]);
    const [cartItemId, setCartItemId] = useState('');
    const [reloadCount, setReloadCount] = useState(0);
    const [cartLoading, setCartLoading] = useState(true);
    const [checkOutFormData, setCheckOutFormData] = useState([]);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);

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
        if(checkOutFormData) {
            try {
                const response = await axios.post(process.env.REACT_APP_API_ENDPOINT + 'create-intent', {
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
                    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(response.data.error));
                } else {
                    const details = response.data.data;
                    // postCheckOut({ ...checkOutFormData, user_id: user_id, subtotal_amount: subtotalAmount, total_amount: totalAmount, cart_item_ids: orderItems, product_count: productCount, payment_status: 'Paid', payment_details: details }).then(response => {
                    postCheckOut({ ...checkOutFormData, payment_status: 'Paid', payment_details: details }).then(response => {
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
                    setCheckOutFormData(message.payload);
                    setTotalAmount(message.payload.total_amount_converted);
                   
                    // Send a response back to React Native
                    //   window.ReactNativeWebView.postMessage(
                    //     JSON.stringify({ type: 'FROM_WEB', payload: 'Data received!' })
                    //   );
                   
                }
            } catch (error) {
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

    // alert(JSON.stringify(checkOutFormData));

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

                                                    </Col>
                                                    <Col lg={12}>
                                                        <p>Total Amount: {checkOutFormData.currency_code ?? '$'}{totalAmount}</p>
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
