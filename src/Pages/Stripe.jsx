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

const SplitForm = () => {
  const stripe = useStripe();
  const stripeElements = useElements();
  const options = useOptions();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse search string to get query parameters
  const searchParams = new URLSearchParams(location.search);

  // Access individual query parameters using get method
  const item = searchParams.get('item');
  const order_id = searchParams.get('order_id');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'token', 'userDetails', 'userRole', 'selectedCartItems', 'tempCart', 'cookieCheckoutDesigner']);
  const [selectedCartItems, setSelectedCartItems] = useState(cookies.selectedCartItems ?? []);
  const [currentUser, setCurrentUser] = useState(cookies.currentUser ?? null);
  const [productCount, setProductCount] = useState(0);
  const [subtotalAmount, setSubtotalAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [cartItemId, setCartItemId] = useState('');
  const [reloadCount, setReloadCount] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);
  const [orderPaymentStatus, setOrderPaymentStatus] = useState('');

  const current_user_id = cookies.currentUser;
  const token = cookies.token;

  const putCheckOut = async (data, orderID) => {
    return await axios.put(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'order/' + orderID + '?current_user_id=' + current_user_id + '&token=' + token, data);
  };

  const getUserOrder = async (orderID) => {
    return await axios.get(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'order/' + orderID + '?current_user_id=' + current_user_id + '&token=' + token);
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
      setIsSubmitting(false);
      return;
    }

    // Send payment method to your backend to create a payment intent
    try {
      const response = await axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'create-intent?current_user_id=' + current_user_id + '&token=' + token, {
        payment_method_id: paymentMethod.id,
        total_amount: totalAmount, // Example amount in cents (e.g., $50.00)
        currency: 'USD',
        first_name: cookies.userDetails?.first_name,
        last_name: cookies.userDetails?.last_name,
        receipt_email: cookies.userDetails?.email,
        description: 'Payment for Order#'+order_id,

      });

      if (response.data.error) {
        setErrorMessage(response.data.error);
      } else {
        const details = response.data.data;
        putCheckOut({ payment_status: 'Paid', payment_details: details }, order_id).then(response => {
          const success = response.data.status;
          const data = response.data.data;
          if (success == success) {
            toast.success('Order added successfully!');
            setTimeout(() => {
              setReloadCount(prevReloadCount => prevReloadCount + 1);
              removeCookie('setSelectedCartItems', { path: '/' });
              removeCookie('cookieCheckoutDesigner', { path: '/' });
              navigate(`/thank-you?order_id=${data.order.id}`);
            }, 1000);
          } else {
            toast.error('There has been an error adding the order, please try again!');
          }
        }).catch(() => {
          toast.error('There has been an error adding the order, please try again!');
        });
      }
    } catch (err) {
      setErrorMessage('Payment failed. Please try again.');
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    getUserOrder(order_id)
      .then((response) => {
        const cartItemsData = response.data;
        if (cartItemsData) {
          setCartItems(cartItemsData);
          console.log("cartItemsData", cartItemsData);
          setTotalAmount(cartItemsData[0].order_items_total.toFixed(2));
          setOrderPaymentStatus(cartItemsData[0].order.payment_status);
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
  }, [reloadCount, item]);

  return (
    <>
      <div className='DemoWrapper'>
        <div className="Demo">
          <Card>
            <Card.Body>
              {cartLoading ?
                <Loading />
                :
                <>
                  {cartItems.length > 0 && cartItems ?
                    <>
                      {orderPaymentStatus != "Paid"?
                        <>
                          <form onSubmit={checkOutSubmitStripe}>
                            <Row>
                              <Col lg={12}>
                                <img src={KoutureLogo} className="kouture-icon" alt="Kouture Konect Logo" />
                              </Col>
                              <Col lg={12}>
                                <p>Total Amount: ${totalAmount}</p>
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
                            <button type="submit" className="w-100" disabled={!stripe}>
                              {isSubmitting ? 'Loading...': 'Pay'}
                            </button>
                          </form>
                          {errorMessage && (
                            <p className="alert alert-danger mt-3 mb-0 text-center" style={{ fontSize: '14px' }}>{errorMessage}</p>
                          )}
                        </>

                        :
                        <div className='DemoWrapper'>
                          <div className="Demo">

                            <Row>
                              <Col lg={12}>
                                <img src={KoutureLogo} className="kouture-icon" alt="Kouture Konect Logo" />
                              </Col>
                              <Col lg={12}>
                                <p className="text-center">Order already been paid!</p>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      }
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

              }

            </Card.Body>
          </Card>

        </div>
      </div>


    </>

  );
};

export default SplitForm;
