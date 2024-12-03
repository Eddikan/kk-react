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

    const [selectedCartItems, setSelectedCartItems] = useState(orderItems);
    const [productCount, setProductCount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(order_amount);
    const [checkOutFormData, setCheckOutFormData] = useState(checkoutData);
    const [formStatus, setFormStatus] = useState('loading');
    const [reloadCount, setReloadCount] = useState(0);

    const postCheckOut = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'order', data);
    };


    const checkOutSubmitPaypal = (details, data) => {
        setFormStatus('loading');

        // postCheckOut({ ...checkOutFormData, user_id: user_id, subtotal_amount: subtotalAmount, total_amount: totalAmount, cart_item_ids: orderItems, product_count: productCount, payment_status: 'Paid', payment_details: details }).then(response => {
            postCheckOut({ ...checkOutFormData, user_id: user_id, subtotal_amount: subtotalAmount, total_amount: totalAmount, cart_item_ids: orderItems, product_count: totalQuantity, payment_status: 'Paid', payment_details: details, delivery_country_code: countryCode,product_count: totalQuantity, subtotal_amount: subtotalAmount, subtotal_amount_converted: subtotalAmountConverted,shipping_amount: totalShippingAmount, shipping_amount_converted: totalShippingAmountConverted,product_count: productCount, shipping_details: { ...shippingDetails },total_amount_converted: totalAmountConverted, currency: order_currency, currency_code: order_currency_code }).then(response => {
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


    return (
        <>
            <div>
                <div>
                    <Card style={{border:0}}>
                        <Card.Body>
                            <>
                                {selectedCartItems && selectedCartItems.length > 0 ?
                                    <>
                                        <PayPalButtons
                                            fundingSource="paypal"
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    purchase_units: [{
                                                        amount: {
                                                            value: totalAmountConverted // Replace with the actual amount
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

export default PaypalMobile;
