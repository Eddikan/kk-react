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
import { PayPalButtons } from "@paypal/react-paypal-js";

const PaypalMobile = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Parse search string to get query parameters
    const searchParams = new URLSearchParams(location.search);
    const item = searchParams.get('item');
    const [totalAmount, setTotalAmount] = useState();
    const [checkOutFormData, setCheckOutFormData] = useState();
    const [formStatus, setFormStatus] = useState('loading');
    const [reloadCount, setReloadCount] = useState(0);

    const postCheckOut = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'order', data);
    };


    const checkOutSubmitPaypal = (details, data) => {
        setFormStatus('loading');

        // postCheckOut({ ...checkOutFormData, user_id: user_id, subtotal_amount: subtotalAmount, total_amount: totalAmount, cart_item_ids: orderItems, product_count: productCount, payment_status: 'Paid', payment_details: details }).then(response => {
            postCheckOut({ ...checkOutFormData, payment_status: 'Paid', payment_details: details }).then(response => {
            const success = response.data.status;
            const data = response.data.data;
            if (success == "Success") {
                // toast.success('Order added successfully!');
                setTimeout(() => {
                    setReloadCount(prevReloadCount => prevReloadCount + 1);
                    window.ReactNativeWebView &&
                    window.ReactNativeWebView.postMessage(JSON.stringify(data));
                }, 1000);
            } else {
                toast.error('There has been an error adding the order, please try again!');
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify('There has been an error adding the order, please try again!'));
            }
        }).catch((err) => {
            toast.error('There has been an error adding the order, please try again!');
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(err));
        });
    }

    // useEffect(() => {
    //     if (checkOutFormData) {
    //         setCartLoading(false);
    //     }
    // }, []);

    useEffect(() => {
        const handleMessage = (event) => {
            try {
                const message = JSON.parse(event.data);

                if (message.type === 'FROM_RN') {
                    setCheckOutFormData(message.payload);
                    setTotalAmount(message.payload.total_amount_converted);
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
        };
        
    }, []);

    return (
        <>
            <div>
                <div>
                    <Card style={{border:0}}>
                        <Card.Body>
                            <>
                                {checkOutFormData ?
                                    <>
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
                                                    checkOutSubmitPaypal(details, data);
                                                    // Call your backend API to save the transaction details
                                                });
                                            }}
                                        />
                                    </>
                                    :
                                    <div className='DemoWrapper'>
                                        <div className="Demo">
                                            <Row>
                                                <Col lg={12}>
                                                    <img src={KoutureLogo} className="kouture-icon" alt="Kouture Konect Logo" />
                                                </Col>
                                                <Col lg={12}>
                                                    <p className="text-center">No records found.</p>
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

export default PaypalMobile;
