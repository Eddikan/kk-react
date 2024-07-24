import React, { useEffect, useState } from 'react';
import { Email, domains } from '@smastrom/react-email-autocomplete';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import '../Assets/styles/LogIn/style.css';
import GoogleIcon from '../Assets/images/google-icon.png';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import KoutureLogo from 'Assets/images/kouture-konect-icon.png';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const initialLoginData = Object.freeze({
  email: '',
  password: ''
});

const LogIn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse search string to get query parameters
  const searchParams = new URLSearchParams(location.search);
  // const referenceUrl = searchParams.get('reference_url');

  // Access individual query parameters using get method
  const redirect_to = searchParams.get('redirect_to') || "";

  const [loginFormData, setLoginFormData] = useState(initialLoginData);
  const [loginFormLoading, setLoginFormLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'tempFavorites', 'tempCart']);
  const [googleUser, setGoogleUser] = useState(null);
  const [googleProfile, setGoogleProfile] = useState(null);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleSignupProfile, setGoogleSignupProfile] = useState(null);
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
  const [tempCart, setTempCart] = useState(cookies.tempCart ?? []);
  const [tempFavorites, setTempFavorites] = useState(cookies.tempFavorites ?? []);

  const [showPassword, setShowPassword] = useState(false);

  const currentUser = cookies.currentUser;
  const isLoggedIn = cookies.isLoggedIn;
  const userDetails = cookies.userDetails;
  const userRole = cookies.userRole;
  const token = cookies.token;
  const deviceId = cookies.device_id;

  const postEmailCode = async (data) => {
    return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'email-2fa', data);
  };

  const handleChange = (e) => {
    setLoginFormData({
      ...loginFormData,
      [e.target.name]: e.target.value,
    })
  }

  const handleChangeEmail = (e) => {
    setLoginFormData({
      ...loginFormData,
      email: e,
    })
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

  const submitEmailCode = async (email) => {

    let uniqueId = deviceId;

    if (deviceId === undefined) {
      uniqueId = await generateUniqueId();
      setCookie('device_id', uniqueId, { path: '/' });
    }

    postEmailCode({ email: email, device_id: uniqueId }).then(response => {
      const success = response.data.status;
      if (success == "Success") {
        window.location.href = '/two-factor-authentication?redirect_to=' + redirect_to;
        setLoginFormLoading(false);
      } else {
        window.location.href = '/two-factor-authentication?redirect_to=' + redirect_to;
        setLoginFormLoading(false);
      }
    }).catch((error) => {
      alert(error);
      window.location.href = '/two-factor-authentication?redirect_to=' + redirect_to;
      setLoginFormLoading(false);
    });
  }

  async function loginSubmit(e) {
    e.preventDefault();
    setLoginFormLoading(true);
    axios.post(process.env.REACT_APP_API_ENDPOINT + 'login?device_id=' + deviceId, loginFormData).then((response) => {
      const success = response.data.status;
      if (success == 'Success') {
        const data = response.data.data;
        const user = data.user;
        if (data?.two_factor_authentication == 'email') {
          setCookie('email', data.user.email, { path: '/' });
          setCookie('two_factor', "email", { path: '/' });
          submitEmailCode(data.user.email);
        } else {
          if (tempCart && tempCart.length > 0) {
            addTempCartToCart({ order_items: tempCart, user_id: user.id });
            removeCookie('tempCart', { path: '/' });
          }

          if (tempFavorites && tempFavorites.length > 0) {
            addTempFavoritesToFavorites({ favorites: tempFavorites, user_id: user.id });
            removeCookie('tempFavorites', { path: '/' });
          }

          if (user.designer) {
            setCookie('currentUserDesigner', JSON.stringify(user.designer.id), { path: '/' });
          }
          if (user.seller) {
            setCookie('currentUserSeller', JSON.stringify(user.seller.id), { path: '/' });
          }
          if (user.role == 'Admin') {
            toast.success('Successfully signed in!');
            setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
            setCookie('userRole', JSON.stringify(user.role), { path: '/' });
            const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer }
            setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
            setCookie('isLoggedIn', true, { path: '/' });
            setCookie('token', data.token, { path: '/' });
            setCookie('signup_type', user.signup_type, { path: '/' });
            setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
            setCookie('token', data.token, { path: '/' });
            setTimeout(function () {
              navigate("/admin/users");
            }, 1000);
          } else {
            toast.success('Successfully signed in!');
            setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
            setCookie('userRole', JSON.stringify(user.role), { path: '/' });
            const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer, shop_completed: user.shop_completed, profile_completeness: user.profile_completeness }
            setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
            setCookie('isLoggedIn', true, { path: '/' });
            setCookie('token', data.token, { path: '/' });
            setCookie('signup_type', user.signup_type, { path: '/' });
            setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
            setCookie('token', data.token, { path: '/' });
            setTimeout(function () {
              if (redirect_to && redirect_to != "" && redirect_to != null) {
                // navigate("/"+redirect_to);
                navigate(redirect_to);
              } else {
                navigate("/");
              }
            }, 1000);
          }

          setLoginFormLoading(false);
        }

      } else {
        const errors = response.data.errors;
        if (errors.email) {
          toast.error(errors.email[0]);
        } if (errors.password) {
          toast.error(errors.password[0]);
        } else {
          errors.map((error, index) => {
            toast.error(error);
            return null; // React requires a return value, so we return null here
          });
        }

        setLoginFormLoading(false);
      }
      // setLoginFormLoading(false);
    }).catch((error) => {
      setLoginFormLoading(false);
      toast.error('Something went wrong, please contact the administrator!');
    });
  }

  async function createGoogleUser(e) {
    axios.post(process.env.REACT_APP_API_ENDPOINT + 'user/google/register', e).then((response) => {
      const success = response.data.status;
      if (success == 'Success') {
        const data = response.data.data;
        const user = data.user;
        if (data?.two_factor_authentication == 'email') {
          setCookie('email', data.user.email, { path: '/' });
          setCookie('two_factor', "email", { path: '/' });
          submitEmailCode(data.user.email);
        } else {
          if (user.designer) {
            setCookie('currentUserDesigner', JSON.stringify(user.designer.id), { path: '/' });
          }
          if (user.seller) {
            setCookie('currentUserSeller', JSON.stringify(user.seller.id), { path: '/' });
          }
          if (user.role == 'Admin') {
            toast.success('Successfully signed in!');
            setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
            setCookie('userRole', JSON.stringify(user.role), { path: '/' });
            const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer }
            setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
            setCookie('isLoggedIn', true, { path: '/' });
            setCookie('token', data.token, { path: '/' });
            setCookie('signup_type', user.signup_type, { path: '/' });
            setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
            setCookie('token', data.token, { path: '/' });
            setTimeout(function () {
              navigate("/admin/users");
              setGoogleLoginLoading(false);
            }, 1000);
          } else {
            toast.success('Successfully signed in!');
            setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
            setCookie('userRole', JSON.stringify(user.role), { path: '/' });
            const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer, shop_completed: user.shop_completed, profile_completeness: user.profile_completeness }
            setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
            setCookie('isLoggedIn', true, { path: '/' });
            setCookie('token', data.token, { path: '/' });
            setCookie('signup_type', user.signup_type, { path: '/' });
            setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
            setCookie('token', data.token, { path: '/' });
            setTimeout(function () {
              navigate("/");
              setGoogleLoginLoading(false);
            }, 1000);
          }
        }

      } else {
        const errors = response.data.errors;
        if (errors.email) {
          toast.error(errors.email[0]);
        } if (errors.password) {
          toast.error(errors.password[0]);
        } else {
          errors.map((error, index) => {
            toast.error(error);
            return null; // React requires a return value, so we return null here
          });
        }
      }
      setLoginFormLoading(false);
    }).catch((error) => {
      setLoginFormLoading(false);
      toast.error('Something went wrong, please contact the administrator!');
    });
  }

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setGoogleUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(() => {
    if (currentUser && currentUser != "") {
      // toast.error("You are already logged in!");
      navigate("/user/profile");
    }
  }, []);

  useEffect(() => {
    if (googleUser) {
      setGoogleLoginLoading(true);
      axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleUser.access_token}`, {
        headers: {
          Authorization: `Bearer ${googleUser.access_token}`,
          Accept: 'application/json'
        }
      })
        .then((res) => {
          setGoogleProfile(res.data);
          setGoogleEmail(res.data.email);
        })
        .catch((err) => console.log(err));
    }
  }, [googleUser]);

  useEffect(() => {
    if (googleSignupProfile) {
      createGoogleUser(googleSignupProfile);
    }
  }, [googleSignupProfile]);

  useEffect(() => {
    if (googleEmail) {
      const data = {
        email: googleEmail
      };
      axios.post(process.env.REACT_APP_API_ENDPOINT + 'user/email?device_id=' + deviceId, data).then((response) => {
        const success = response.data.status;
        if (success == 'Success') {
          const data = response.data.data;
          if (data) {
            const user = data.user;
            if (data?.two_factor_authentication == 'email') {
              setCookie('email', data.user.email, { path: '/' });
              setCookie('two_factor', "email", { path: '/' });
              submitEmailCode(data.user.email);
            } else {
              if (user.designer) {
                setCookie('currentUserDesigner', JSON.stringify(user.designer.id), { path: '/' });
              }
              if (user.seller) {
                setCookie('currentUserSeller', JSON.stringify(user.seller.id), { path: '/' });
              }
              if (user.role == 'Admin') {
                toast.success('Successfully signed in!');
                setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
                setCookie('userRole', JSON.stringify(user.role), { path: '/' });
                const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer }
                setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                setCookie('isLoggedIn', true, { path: '/' });
                setCookie('token', data.token, { path: '/' });
                setCookie('signup_type', user.signup_type, { path: '/' });
                setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
                setCookie('token', data.token, { path: '/' });
                setTimeout(function () {
                  navigate("/admin/users");
                  setGoogleLoginLoading(false);
                }, 1000);
              } else {
                toast.success('Successfully signed in!');
                setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
                setCookie('userRole', JSON.stringify(user.role), { path: '/' });
                const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer, shop_completed: user.shop_completed, profile_completeness: user.profile_completeness }
                setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                setCookie('isLoggedIn', true, { path: '/' });
                setCookie('token', data.token, { path: '/' });
                setCookie('signup_type', user.signup_type, { path: '/' });
                setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
                setCookie('token', data.token, { path: '/' });
                setTimeout(function () {
                  navigate("/");
                  setGoogleLoginLoading(false);
                }, 1000);
              }
            }

          }
        } else {
          setGoogleSignupProfile(googleProfile);
        }
      }).catch((err) => console.log(err));
    }
  }, [googleEmail]);

  const baseList = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'aol.com',
    'msn.com',
    'proton.me',
  ];

  return (
    <LayoutNoFooter>
      <section id='login' className='d-flex align-items-center'>
        <Container fluid>
          <Row style={{ minHeight: '100vh' }}>
            <Col id="login-column" lg='8' className='d-flex flex-column justify-content-center'>
              <div className='login-container'>
                <Link to="/">
                  <img src={KoutureLogo} className="kouture-icon" alt="Kouture Konect" />
                </Link>
                <h1 className='text-center'>Sign in to Kouture Konect</h1>
                <div className="divider-small mb-3 mt-4"></div>
                {/* <button className='login-google mt-3'>
                  <img src={GoogleIcon} />
                  <span className='subtitle'>Sign in with Google</span>
                </button>
                <hr className='mb-0 mt-5' />
                <p className='login-with-email'>or sign in with email</p> */}
                <Form onSubmit={loginSubmit}>
                  <Form.Group className='mb-3' controlId='formBasicEmail'>
                    <Form.Label>Email Address</Form.Label>
                    <Email
                      baseList={baseList}
                      refineList={domains}
                      onChange={(e) => handleChangeEmail(e)} // or (newValue) => customSetter(newValue)
                      value={loginFormData.email}
                      className="form-control mr-sm-2 email-suggestion"
                      required
                    />
                    {/* <FormControl type='email' name='email' value={loginFormData.email} className='mr-sm-2' onChange={handleChange} required /> */}
                  </Form.Group>
                  <Form.Group className='mb-3' controlId='formBasicPassword'>
                    <Form.Label>Password</Form.Label>
                    <div className="show-password">
                      <FormControl type={showPassword ? 'text' : 'password'} name='password' value={loginFormData.password} className='mr-sm-2' onChange={handleChange} required />
                      {showPassword ?
                        <IoEyeOutline className="form-input-icon cursor-pointer hi-eye off-eye" onClick={function () { setShowPassword(false); }} />
                        :
                        <IoEyeOffOutline className="form-input-icon cursor-pointer hi-eye-off off-eye" onClick={function () { setShowPassword(true); }} />
                      }
                    </div>
                  </Form.Group>
                  <a href="/forgot-password" className='forgot-password text-dgray fs-16'>Forgot Password</a>
                  {loginFormLoading ?
                    <Button className='w-100 mt-4' variant='primary' type='button'>Signing in...</Button>
                    :
                    <Button className='w-100 mt-4' variant='primary' type='submit'>Sign in</Button>
                  }
                  {googleLoginLoading ?
                    <Button className='w-100 mt-3' variant='secondary' type='button'>Logging in with Google...</Button>
                    :
                    <Button className='w-100 mt-3' variant='secondary' type='button' onClick={login}>Login with Google</Button>
                  }

                  <p className='mb-0 mt-4 text-center fs-14 text-dgray'>Don't have an account? <Link className='sign-up' to={`/sign-up?redirect_to=${encodeURIComponent(redirect_to)}`}>Sign Up</Link></p>
                </Form>
              </div>
            </Col>
            <Col lg="4" className='with-bg'>
            </Col>
          </Row>
        </Container>
      </section>

    </LayoutNoFooter>
  );
};

export default LogIn;