import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col } from "react-bootstrap";
import { useCookies } from 'react-cookie';
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { FaLock } from "react-icons/fa6";
import toast from 'react-hot-toast';
import GoBack from 'Components/Shared/GoBack';

const initialFormDataLogin = Object.freeze({
  email: '', password: '',
});

const TwoFactorVerification = () => {
  const cookies = useCookies(['currentUser', 'isLoggedIn', 'userRole', 'token']);
  const setCookies = (name, data, options) => cookies[1](name, data, options);
  const removeCookies = (name, options) => cookies[2](name, options);

  const [formDataLogin, setFormDataLogin] = useState(initialFormDataLogin);
  const [formStatus, setFormStatus] = useState('standby');
  const [reloadCount, setReloadCount] = useState(1);

  const [timer, setTimer] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [showSendCode, setShowSendCode] = useState(false);

  const [tempCart, setTempCart] = useState(cookies.tempCart ?? []);
  const [tempFavorites, setTempFavorites] = useState(cookies.tempFavorites ?? []);

  const siteCookies = cookies[0];
  const isLoggedIn = siteCookies.isLoggedIn;
  const currentUser = siteCookies.currentUser;
  const roleLink = siteCookies.roleLink;
  const email = siteCookies.email;
  const deviceId = siteCookies.device_id;
  const [twoFactor, setTwoFactor] = useState(siteCookies.two_factor);
  const userRole = siteCookies.userRole;

  const navigate = useNavigate();  
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const redirect_to = searchParams.get('redirect_to') || "";

  useEffect(() => {
    if (!email) {
      // if (userRole === 'Admin') {
      //     navigate("/admin/users");
      // } else if (userRole === 'User') {
      //   if (redirect_to && redirect_to != "" && redirect_to != null) {
      //     navigate(redirect_to);
      //   } else {
      //     navigate("/");
      //   }
      // } else {
      //   if (redirect_to && redirect_to != "" && redirect_to != null) {
      //     navigate(redirect_to);
      //   } else {
      //     navigate("/");
      //   }
      // }

      window.history.back();
    }
    
    console.log('userRole', userRole);

  }, []);  

  useEffect(() => {
    // ComponentDidMount logic goes here
    // This will be executed after the component is mounted 
    // You can keep your other useEffect hooks below this one

    return () => {
      // ComponentWillUnmount logic goes here (optional)
      // This will be executed before the component is unmounted
    };
  }, []);

  const handleChangeLogin = (e) => {
    setFormDataLogin({
      ...formDataLogin, [e.target.name]: e.target.value,
    });
  }

  const postLogin = async (data) => {
    return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'login-2fa?device_id='+deviceId, data);
  };

  const postSMSLogin = async (data) => {
    return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'login-sms-2fa?device_id='+deviceId, data);
  };

  const postSMSCode = async (data) => {
    return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'sms-2fa', data);
  };

  const postEmailCode = async (data) => {
    return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'email-2fa', data);
  };

  async function addTempCartToCart(data) {
    // setReorderLoading(true);
    axios.post(process.env.REACT_APP_API_ENDPOINT + 'cart/bulk', { order_items: data.order_items, user_id: data.user_id }).then((response) => {
        const success = response.data.status;
        if (success == 'Success') {
            const data = response.data.data;
        } else {
            const errors = response.data.errors;
            errors.map((error, index) => {
                toast.error(error);
                return null; // React requires a return value, so we return null here
            });
        }
        // setReorderLoading(false);
    }).catch((error) => {
        // setReorderLoading(false);
        toast.error('Something went wrong, please contact the administrator!');
    });
  }

  async function addTempFavoritesToFavorites(data) {
    // setReorderLoading(true);
    axios.post(process.env.REACT_APP_API_ENDPOINT + 'portfolio/item/wishlist/bulk', { favorites: data.favorites, user_id: data.user_id }).then((response) => {
        const success = response.data.status;
        if (success == 'Success') {
            const data = response.data.data;
        } else {
            const errors = response.data.errors;
            errors.map((error, index) => {
                toast.error(error);
                return null; // React requires a return value, so we return null here
            });
        }
        // setReorderLoading(false);
    }).catch((error) => {
        // setReorderLoading(false);
        toast.error('Something went wrong, please contact the administrator!');
    });
  }

  const loginSubmit = (e) => {
    e.preventDefault();
    setFormStatus('loading');
    postLogin({ ...formDataLogin, email: email }).then(response => {
      const success = response.data.status;
      const errors = response.data.errors;
      setFormStatus('standby');
      setReloadCount(reloadCount + 1);
      setFormDataLogin(initialFormDataLogin);
      if (success == "Success") {
        const result = response.data.data;
        const user = result.user;

        if (tempCart && tempCart.length > 0) {
          addTempCartToCart({order_items: tempCart, user_id: user.id});
          removeCookies('tempCart', { path: '/' });
        }

        if (tempFavorites && tempFavorites.length > 0) {
          addTempFavoritesToFavorites({favorites: tempFavorites, user_id: user.id});
          removeCookies('tempFavorites', { path: '/' });
        }

        if (user.designer) {
          setCookies('currentUserDesigner', JSON.stringify(user.designer.id), { path: '/' });
        }
        if (user.seller) {
          setCookies('currentUserSeller', JSON.stringify(user.seller.id), { path: '/' });
        }

        setFormStatus('standby');
        setReloadCount(reloadCount + 1);
        setFormDataLogin(initialFormDataLogin);
        var userRole = result.user.role;

        if (userRole == "Admin") {
          toast.success('Successfully signed in!');
          setCookies('currentUser', JSON.stringify(user.id), { path: '/' });
          setCookies('userRole', JSON.stringify(user.role), { path: '/' });
          const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer }
          setCookies('userDetails', JSON.stringify(user_details), { path: '/' });
          setCookies('isLoggedIn', true, { path: '/' });
          setCookies('token', result.token, { path: '/' });
          setCookies('signup_type', user.signup_type, { path: '/' });
          setCookies('completed_questionnaire', user.completed_questionnaire, { path: '/' });
          setCookies('token', result.token, { path: '/' });
          
          removeCookies('email', { path: '/' });
          removeCookies('two_factor', { path: '/' });

          setTimeout(function () {
            navigate("/admin/users");
          }, 1000);
        } else {
          toast.success('Successfully signed in!');
          setCookies('currentUser', JSON.stringify(user.id), { path: '/' });
          setCookies('userRole', JSON.stringify(user.role), { path: '/' });
          const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer, shop_completed: user.shop_completed, profile_completeness: user.profile_completeness }
          setCookies('userDetails', JSON.stringify(user_details), { path: '/' });
          setCookies('isLoggedIn', true, { path: '/' });
          setCookies('token', result.token, { path: '/' });
          setCookies('signup_type', user.signup_type, { path: '/' });
          setCookies('completed_questionnaire', user.completed_questionnaire, { path: '/' });
          setCookies('token', result.token, { path: '/' });
          
          removeCookies('email', { path: '/' });
          removeCookies('two_factor', { path: '/' });

          setTimeout(function () {
            if (redirect_to && redirect_to != "" && redirect_to != null) {
              navigate(redirect_to);
            } else {
              navigate("/");
            }
          }, 1000);
        }
      } else if (errors == 'OTP expired') {
        toast.error('OTP expired!');
      } else {
        setFormStatus('standby');
        toast.error('OTP does not exist!');
      }
    }).catch((error) => {
      alert(error);
      toast.error('Something went wrong, please contact the administrator!');
    });
  }

  const loginSMSSubmit = (e) => {
    e.preventDefault();
    setFormStatus('loading');
    postSMSLogin({ otp: formDataLogin.otp, email: email }).then(response => {
      const success = response.data.status;
      const errors = response.data.errors;
      setFormStatus('standby');
      setReloadCount(reloadCount + 1);
      setFormDataLogin(initialFormDataLogin);
      if (success == "Success") {
        const result = response.data.data;
        const user = result.user;

        if (tempCart && tempCart.length > 0) {
          addTempCartToCart({order_items: tempCart, user_id: user.id});
          removeCookies('tempCart', { path: '/' });
        }

        if (tempFavorites && tempFavorites.length > 0) {
          addTempFavoritesToFavorites({favorites: tempFavorites, user_id: user.id});
          removeCookies('tempFavorites', { path: '/' });
        }

        if (user.designer) {
          setCookies('currentUserDesigner', JSON.stringify(user.designer.id), { path: '/' });
        }
        if (user.seller) {
          setCookies('currentUserSeller', JSON.stringify(user.seller.id), { path: '/' });
        }

        setFormStatus('standby');
        setReloadCount(reloadCount + 1);
        setFormDataLogin(initialFormDataLogin);
        var userRole = result.user.role;

        if (userRole == "Admin") {
          toast.success('Successfully signed in!');
          setCookies('currentUser', JSON.stringify(user.id), { path: '/' });
          setCookies('userRole', JSON.stringify(user.role), { path: '/' });
          const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer }
          setCookies('userDetails', JSON.stringify(user_details), { path: '/' });
          setCookies('isLoggedIn', true, { path: '/' });
          setCookies('token', result.token, { path: '/' });
          setCookies('signup_type', user.signup_type, { path: '/' });
          setCookies('completed_questionnaire', user.completed_questionnaire, { path: '/' });
          setCookies('token', result.token, { path: '/' });
          
          removeCookies('email', { path: '/' });
          removeCookies('two_factor', { path: '/' });

          setTimeout(function () {
            navigate("/admin/users");
          }, 1000);
        } else {
          toast.success('Successfully signed in!');
          setCookies('currentUser', JSON.stringify(user.id), { path: '/' });
          setCookies('userRole', JSON.stringify(user.role), { path: '/' });
          const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer, shop_completed: user.shop_completed, profile_completeness: user.profile_completeness }
          setCookies('userDetails', JSON.stringify(user_details), { path: '/' });
          setCookies('isLoggedIn', true, { path: '/' });
          setCookies('token', result.token, { path: '/' });
          setCookies('signup_type', user.signup_type, { path: '/' });
          setCookies('completed_questionnaire', user.completed_questionnaire, { path: '/' });
          setCookies('token', result.token, { path: '/' });
          
          removeCookies('email', { path: '/' });
          removeCookies('two_factor', { path: '/' });
          
          setTimeout(function () {
            if (redirect_to && redirect_to != "" && redirect_to != null) {
              navigate(redirect_to);
            } else {
              navigate("/");
            }
          }, 1000);
        }
      } else if (errors == 'OTP expired') {
        toast.error('OTP expired!');
      } else {
        setFormStatus('standby');
        toast.error('OTP does not exist!');
      }
    }).catch((error) => {
      alert(error);
      setFormStatus('standby');
      toast.error('Something went wrong, please contact the administrator!');
    });
  }

  const generateUniqueId = () => {
    const hexValues = '0123456789abcdef';
    let uuid = '';

    for (let i = 0; i < 36; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        uuid += '-';
      } else if (i === 14) {
        uuid += '4';
      } else if (i === 19) {
        uuid += hexValues[(Math.floor(Math.random() * 4) + 8)];
      } else {
        uuid += hexValues[Math.floor(Math.random() * 16)];
      }
    }

    const currentTime = Date.now().toString(16);
    uuid += `-${currentTime}`;

    return uuid.toUpperCase();
  };

  const submitEmailCode = () => {
    setShowSendCode(true);

    let uniqueId = deviceId;

    if (deviceId === undefined) {
      uniqueId = generateUniqueId();
      setCookies('device_id', uniqueId, { path: '/' });
    }

    postEmailCode({ email: email, device_id: uniqueId }).then(response => {
      const success = response.data.status;
      if (success === "Success") {
        toast.success('Send Code Successfully!');
        startTimer();
      } else {
        setShowSendCode(false);
        toast.error('Something went wrong, please contact the administrator!');
      }
    }).catch((error) => {
      alert(error);
      setShowSendCode(false);
      toast.error('Something went wrong, please contact the administrator!');
    });
  }

  const submitPhoneCode = async () => {
    setShowSendCode(true);

    let uniqueId = deviceId;

    if (deviceId === undefined) {
      uniqueId = await generateUniqueId();
      setCookies('device_id', uniqueId, { path: '/' });
    }

    postSMSCode({ email: email, device_id: uniqueId }).then(response => {
      const success = response.data.status;
      const errors = response.data.errors;
      if (success === "Success") {
        toast.success('Send Code Successfully!');
        startTimer();
      } else if (errors === "Phone number does not exist") {
        setShowSendCode(false);
        toast.error('Phone number does not exist!');
      } else if (errors === "Failed to send SMS") {
        setShowSendCode(false);
        toast.error('Failed to send SMS!'); 
      } else {
        setShowSendCode(false);
        toast.error('Something went wrong, please contact the administrator!');
      }
    }).catch((error) => {
      alert(error);
      setShowSendCode(false);
      toast.error('Something went wrong, please contact the administrator!');
    });
  }

  useEffect(() => {
    let interval;
    if (showTimer) {
      interval = setInterval(() => {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showTimer]);

  const startTimer = () => {
    setTimer(60);
    setShowTimer(true);
    setTimeout(() => setShowTimer(false), 60000);
    setShowSendCode(false);
  };

  const emailAuthenticationClick = () => {
    setTwoFactor('email');

    let uniqueId = deviceId;

    if (deviceId === undefined) {
      uniqueId = generateUniqueId();
      setCookies('device_id', uniqueId, { path: '/' });
    }

    postEmailCode({ email: email, device_id: uniqueId }).then(response => {
      const success = response.data.status;
      if (success === "Success") {
      } else {
        toast.error('Something went wrong, please contact the administrator!');
      }
    }).catch((error) => {
      alert(error);
      toast.error('Something went wrong, please contact the administrator!');
    });
  }

  const smsAuthenticationClick = () => {
    setTwoFactor('SMS');
        let uniqueId = deviceId;

      if (deviceId === undefined) {
        uniqueId = generateUniqueId();
        setCookies('device_id', uniqueId, { path: '/' });
      }

    postSMSCode({ email: email, device_id: uniqueId }).then(response => {
      const success = response.data.status;
      const errors = response.data.errors;
      if (success === "Success") {
      } else if (errors === "Phone number does not exist") {
        toast.error('Phone number does not exist!');
      } else if (errors === "Failed to send SMS") {
        toast.error('Failed to send SMS!'); 
      } else {
        toast.error('Something went wrong, please contact the administrator!');
      }
    }).catch((error) => {
      alert(error);
      toast.error('Something went wrong, please contact the administrator!');
    });
  }

  return (
    <div>
      { twoFactor === 'both' ?
        <>
          <Row>
            <Col lg="12" className="text-center">
              <span className="text-center">Which do you prefer to use?</span>
              <Row className="mt-4">
                <Col lg="6">
                  <Button variant="primary" onClick={emailAuthenticationClick} type="button">Email Authentication</Button>
                </Col>
                <Col lg="6">
                  <Button variant="primary" onClick={smsAuthenticationClick} type="button">SMS Authentication</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      : twoFactor === 'email' ?
        <Form onSubmit={loginSubmit} id="loginForm">
          <Form.Group className="mb-2" controlId="formBasicEmail">
            <label className="mb-4"
            // style={{ width: '101%' }}
            >An email containing the OTP code has been sent to your inbox. Please check your email for the code.</label>
            <div className="row d-flex justify-content-center">
              <div className="col-12">
                <div className="d-flex justify-content-between">
                  <div className="input-group border-light" style={{ width: '420px' }}>
                    <span className="input-group-text bg-light border-none" id="basic-addon1"><FaLock color="#A0A2A5" /></span>
                    <input
                      type="text"
                      name='otp'
                      value={formDataLogin.otp}
                      className="form-control border-none bg-light ps-0"
                      style={{ marginRight: '1px', borderTopRightRadius: '5px', borderBottomRightRadius: '5px' }}
                      onChange={handleChangeLogin}
                      placeholder="One Time Password"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      required />
                  </div>
                  <div className="d-flex justify-content-center">
                    {showTimer || showSendCode ? (
                      <div className="d-flex align-items-center" style={{ cursor: 'not-allowed', opacity: '0.5' }}>
                        <label className="mb-0 ms-1" style={{ cursor: 'not-allowed' }}>Resend&nbsp;</label>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={submitEmailCode}>
                        <label className="mb-0 ms-1" style={{ cursor: 'pointer' }}>Resend</label>
                      </div>
                    )}
                    {showTimer && (
                      <div className="d-flex align-items-center" style={{ opacity: '0.5' }}>
                        <span>{timer}s</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Form.Group>
          <div className="mt-4 d-flex justify-content-center">
            {formStatus !== "standby" ? 
              <Button variant="primary" className='' type="button"
                style={{ width: '-webkit-fill-available' }}
              >Signing in...</Button> :
              <Button variant="primary" className='' style={{ width: '-webkit-fill-available' }} type="submit">Sign in</Button>
            }
          </div>
        </Form>
        :
        <Form onSubmit={loginSMSSubmit} id="loginForm">
          <Form.Group className="mb-2" controlId="formBasicEmail">
            <label className="mb-4"
            >A message containing the OTP code has been sent to your phone. Please check your messages for the code.</label>
            <div className="row d-flex justify-content-center">
              <div className="col-12">
                <div className="d-flex justify-content-between">
                  <div className="input-group border-light" style={{ width: '420px' }}>
                    <span className="input-group-text bg-light border-none" id="basic-addon1"><FaLock color="#A0A2A5" /></span>
                    <input
                      type="text"
                      name='otp'
                      value={formDataLogin.otp}
                      className="form-control border-none bg-light ps-0"
                      style={{ marginRight: '1px', borderTopRightRadius: '5px', borderBottomRightRadius: '5px' }}
                      onChange={handleChangeLogin}
                      placeholder="One Time Password"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      required />
                  </div>
                  <div className="d-flex justify-content-center">
                    {showTimer || showSendCode ? (
                      <div className="d-flex align-items-center" style={{ cursor: 'not-allowed', opacity: '0.5' }}>
                        <label className="mb-0 ms-1" style={{ cursor: 'not-allowed' }}>Resend&nbsp;</label>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={submitPhoneCode}>
                        <label className="mb-0 ms-1" style={{ cursor: 'pointer' }}>Resend</label>
                      </div>
                    )}
                    {showTimer && (
                      <div className="d-flex align-items-center" style={{ opacity: '0.5' }}>
                        <span>{timer}s</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Form.Group>
          <div className="mt-4 d-flex justify-content-center">
            {formStatus !== "standby" ? 
              <Button variant="primary" className='' type="button"
                style={{ width: '-webkit-fill-available' }}
              >Signing in...</Button> :
              <Button variant="primary" className='' style={{ width: '-webkit-fill-available' }} type="submit">Sign in</Button>
            }
          </div>
        </Form>
      }
    </div>
  );
};

export default TwoFactorVerification;
