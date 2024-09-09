import React, {useMemo} from "react";
import {CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe} from "@stripe/react-stripe-js";
import '../Assets/styles/Stripe/stripe.css'
import {Col, Row} from 'react-bootstrap';
import axios from "axios";

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
  const elements = useElements();
  const options = useOptions();

  const handleSubmit = async event => {
    event.preventDefault();


    if (!stripe || !elements) {
      return;
    }

    const {error: submitError} = await elements.submit();
    if (submitError) {
      // Show error to your customer
      console.log(submitError);
      return;
    }

    const payload = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement)
    });

    const res = await axios.post('https://api.stripe.com/v1/payment_intents', {
      amount: 100,
      currency: 'EUR',
      payment_method_types: [
        'card'
      ],
      payment_method: payload.paymentMethod.id,
      description: 'test',
      confirm: 'true',
      capture_method: 'automatic',
      return_url: 'http://localhost:3000/',
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic'
        }
      }
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer sk_test_51KH5FQEHRDNky8yNhRC5uPHYTMyvOWVoQbXYN9feNaJER79TCoQS3vjqieSxzkRJtEdzoRftMQ3Hw2MkNUZRZUaQ00XAa3UUKA'
      }
    });

    console.log("[PaymentIntent]", res);
  };

  return (
    <div className='DemoWrapper'>
      <div className="Demo">
        <form onSubmit={handleSubmit}>
          <Row>
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
            Pay
          </button>
        </form>
      </div>
    </div>
  );
};

export default SplitForm;
