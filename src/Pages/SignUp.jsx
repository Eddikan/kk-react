import React, { useEffect, useState } from 'react';
import { Email, domains } from '@smastrom/react-email-autocomplete'
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import '../Assets/styles/SignUp/style.css';
import GoogleIcon from '../Assets/images/google-icon.png';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import KoutureLogo from 'Assets/images/kouture-konect-icon.png';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const initialRegisterData = Object.freeze({
  email: '',
  password: '',
  password_confirmation: '',
  event_date: ''
});

const SignUp = () => {
  const navigate = useNavigate();
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();
  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'tempFavorites', 'tempCart', 'tempFavorites']);

  const [signupType, setSignupType] = useState(query.get("type"));
  const [signupOption, setSignupOption] = useState(query.get("option"));
  const [registerFormData, setRegisterFormData] = useState(initialRegisterData);
  const [googleRegisterFormData, setGoogleRegisterFormData] = useState(null);
  const [registerFormLoading, setRegisterFormLoading] = useState(false);
  const [interestedIn, setInterestedIn] = useState([]);
  // Signup with Google
  const [loginFormLoading, setLoginFormLoading] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [googleProfile, setGoogleProfile] = useState(null);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleSignupProfile, setGoogleSignupProfile] = useState(null);
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
      
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const currentUser = cookies.currentUser;
  const isLoggedIn = cookies.isLoggedIn;
  const userDetails = cookies.userDetails;
  const userRole = cookies.userRole;
  const token = cookies.token;
  const [tempCart, setTempCart] = useState(cookies.tempCart ?? []);
  const [tempFavorites, setTempFavorites] = useState(cookies.tempFavorites ?? []);

  const handleInterestChange = (value) => {
    if (interestedIn.includes(value)) {
      // Remove the value if it's already checked
      setInterestedIn(interestedIn.filter(item => item !== value));
    } else {
      // Add the value if it's not checked
      setInterestedIn([...interestedIn, value]);
    }
  };

  const handleChange = (e) => {
    setRegisterFormData({
      ...registerFormData,
      [e.target.name]: e.target.value,
    })
  };

  const handleChangeEmail = (e) => {
    setRegisterFormData({
      ...registerFormData,
      email: e,
    })
  }

  const getUser = async (e) => {
    return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + e);
  };

  const getUserDetails = (e) => {
    getUser(e).then(response => {
      const selectedUser = response.data.data;
      if (selectedUser) {
        const user_details = { currentUser: selectedUser.id, id: selectedUser.id, first_name: selectedUser.first_name, last_name: selectedUser.last_name, image: selectedUser.image, email_verified_at: selectedUser.email_verified_at }
        setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
        setCookie('signup_type', selectedUser.signup_type, { path: '/' });
        if (signupOption && signupOption != "") {
          navigate("/questionnaire?option=" + signupOption);
        } else {
          navigate("/questionnaire");
        }

      } else {
        const message = 'There has been an error getting the user, please try again!';
        toast.error(message);
      }
    }).catch((error) => {
      const message = 'There has been an error getting the user, please try again!';
      toast.error(message);
    });
  }

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

  async function registerSubmit(e) {
    e.preventDefault();
    setRegisterFormLoading(true);
    axios.post(process.env.REACT_APP_API_ENDPOINT + 'register', { ...registerFormData, interested_in: interestedIn }).then((response) => {
      const success = response.data.status;
      if (success == 'Success') {
        const data = response.data.data;
        const user = data.user;
        if (tempCart && tempCart.length > 0) {
          addTempCartToCart({ order_items: tempCart, user_id: user.id });
          removeCookie('tempCart', { path: '/' });
        }

        if (tempFavorites && tempFavorites.length > 0) {
          addTempFavoritesToFavorites({ favorites: tempFavorites, user_id: user.id });
          removeCookie('tempFavorites', { path: '/' });
        }

        toast.success('Successfully signed up!');
        setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
        setCookie('userRole', JSON.stringify(user.role), { path: '/' });
        const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type }
        setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
        let signupTypeOption = "";
        if (signupType == "designer") {
          signupTypeOption = "designer";
        } else if (signupType == "seller") {
          signupTypeOption = "seller";
        } else if (signupType == "designer_seller") {
          signupTypeOption = "designer_seller";
        } else {
          signupTypeOption = signupType;
        }
        setCookie('signup_type', signupTypeOption, { path: '/' });
        setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
        setCookie('isLoggedIn', true, { path: '/' });
        setCookie('token', data.token, { path: '/' });
        setTimeout(function () {
          getUserDetails(user.id);
        }, 500);
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
      setRegisterFormLoading(false);
    }).catch((error) => {
      setRegisterFormLoading(false);
      toast.error('Something went wrong, please contact the administrator!');
    });
  }

  useEffect(() => {
    if (currentUser && currentUser !== "") {
      // toast.error("You are already logged in!");
      if (signupType == "customer") {
        navigate("/");
      } else if (signupType == "designer") {
        navigate("/user/center/calendar");
      } else if (signupType == "seller") {
        navigate("/user/center/calendar");
      } else if (signupType == "designer_seller") {
        navigate("/user/center/calendar");
      } else {
        navigate("/user/center/calendar");
      }
    }

    let signupTypeOption = "";
    if (signupType == "designer") {
      signupTypeOption = "designer";
    } else if (signupType == "seller") {
      signupTypeOption = "seller";
    } else if (signupType == "designer_seller") {
      signupTypeOption = "designer_seller";
    } else {
      signupTypeOption = signupType;
    }

    setRegisterFormData({
      ...registerFormData,
      signup_type: signupTypeOption,
      is_designer: signupType == "designer" || signupType == "designer_seller" ? 1 : 0,
      is_seller: signupType == "seller" || signupType == "designer_seller" ? 1 : 0,
    });

    setGoogleRegisterFormData({
      ...googleRegisterFormData,
      signup_type: signupTypeOption,
      is_designer: signupType == "designer" || signupType == "designer_seller" ? 1 : 0,
      is_seller: signupType == "seller" || signupType == "designer_seller" ? 1 : 0,
    });

  }, []);

  const baseList = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'aol.com',
    'msn.com',
    'proton.me',
  ];

  async function createGoogleUser(e) {
    axios.post(process.env.REACT_APP_API_ENDPOINT + 'user/google/register', { ...e, ...googleRegisterFormData }).then((response) => {
      const success = response.data.status;
      if (success == 'Success') {
        const data = response.data.data;
        const user = data.user;
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
            getUserDetails(user.id);
            setGoogleLoginLoading(false);
          }, 500);
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
      axios.post(process.env.REACT_APP_API_ENDPOINT + 'user/email', data).then((response) => {
        const success = response.data.status;
        if (success == 'Success') {
          const data = response.data.data;
          if (data) {
            const user = data.user;
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
                getUserDetails(user.id);
                setGoogleLoginLoading(false);
              }, 500);
            }

          }
        } else {
          setGoogleSignupProfile(googleProfile);
        }
      }).catch((err) => console.log(err));
    }
  }, [googleEmail]);

  return (
    <LayoutNoFooter>
      <section id='signup' className='d-flex align-items-center'>
        <Container fluid>
          <Row style={{ minHeight: '100vh' }}>
            <Col lg='8' className='d-flex flex-column justify-content-center py-4'>
              <div className='sign-up-container'>
                <Link to="/">
                  <img src={KoutureLogo} className="kouture-icon" alt="Kouture Konect" />
                </Link>
                {/* {signupType == "designer" ?
                  <>
                    <h1 className='text-center'>Designer Registration</h1>
                    <p className="text-center small mb-0">
                      Thank you for your interest in becoming a designer with Kouture Konect.
                    </p>
                    <div className="divider-small mb-4 mt-3"></div>
                  </>
                  : signupType == "seller" ?
                    <>
                      <h1 className='text-center'>Fabric Vendor Registration</h1>
                      <p className="text-center small mb-0">
                        Thank you for your interest in becoming a vendor with Kouture Konect.
                      </p>
                      <div className="divider-small mb-4 mt-3"></div>
                    </>
                    :
                    <>
                      <h1 className='text-center'>Sign up to Kouture Konect</h1>
                      <div className="divider-small mb-4 mt-4"></div>
                    </>
                } */}
                <>
                  <h1 className='text-center'>Sign up to Kouture Konect</h1>
                  <p className="text-center small mb-0">
                    Join Kouture Konect to view more Designers, Designs and Fabrics!
                  </p>
                  <div className="divider-small mb-4 mt-3"></div>
                </>
                {/* <button className='sign-in-google mt-3'>
                      <img src={GoogleIcon}/>
                      <span className='subtitle'>Sign in with Google</span>
                  </button>
                  <hr className='mb-0 mt-5'/>
                  <p className='sign-up-with-email'>or create an account</p> */}
                <Form onSubmit={registerSubmit}>
                  {/* <Row>
                        <Col lg="6">
                          <Form.Group className='mb-3' controlId='formBasicFirstName'>
                            <Form.Label>First Name</Form.Label>
                            <FormControl type='text' name='first_name' onChange={handleChange} className='mr-sm-2' required />
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className='mb-3' controlId='formBasicLastName'>
                            <Form.Label>Last Name</Form.Label>
                            <FormControl type='text' name='last_name' onChange={handleChange} className='mr-sm-2' required />
                          </Form.Group>
                        </Col>
                      </Row> */}
                  <Form.Group className='mb-3' controlId='formBasicEmail'>
                    <Form.Label>Email Address</Form.Label>
                    <Email
                      baseList={baseList}
                      refineList={domains}
                      onChange={(e) => handleChangeEmail(e)} // or (newValue) => customSetter(newValue)
                      value={registerFormData.email}
                      className="form-control mr-sm-2 email-suggestion"
                      required
                    />
                    {/* <FormControl type='email' name='email' onChange={handleChange} className='mr-sm-2' required /> */}
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label>Password</Form.Label>
                      <div class="show-password">
                        <FormControl type={showPassword ? 'text' : 'password'} name='password' onChange={handleChange} className='mr-sm-2' required />
                        {showPassword ?
                            <IoEyeOutline className="form-input-icon cursor-pointer hi-eye off-eye" onClick={function () { setShowPassword(false); }} />
                            :
                            <IoEyeOffOutline className="form-input-icon cursor-pointer hi-eye-off off-eye" onClick={function () { setShowPassword(true); }} />
                        }
                      </div>
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label>Confirm Password</Form.Label>
                    <div class="show-password">
                      <FormControl type={showConfirmPassword ? 'text' : 'password'} name='password_confirmation' onChange={handleChange} className='mr-sm-2' required />
                      {showConfirmPassword ?
                          <IoEyeOutline className="form-input-icon cursor-pointer hi-eye off-eye" onClick={function () { setShowConfirmPassword(false); }} />
                          :
                          <IoEyeOffOutline className="form-input-icon cursor-pointer hi-eye-off off-eye" onClick={function () { setShowConfirmPassword(true); }} />
                      }
                    </div>
                  </Form.Group>
                  {/* <Form.Group className='mb-3'>
                    <Form.Label className="mb-3">I'm interested in...</Form.Label>
                    <div className="interests">
                      <Form.Label className="me-3" style={{minWidth: '90px'}}>
                        <input
                          type="checkbox"
                          checked={interestedIn.includes('Men')}
                          onChange={() => handleInterestChange('Men')}
                          className="d-inline-block vertical-align-middle me-1"
                        />
                        <span>Men</span>
                      </Form.Label>
                      <Form.Label style={{minWidth: '90px'}}>
                        <input
                          type="checkbox"
                          checked={interestedIn.includes('Baby/Toddlers')}
                          onChange={() => handleInterestChange('Baby/Toddlers')}
                          className="d-inline-block vertical-align-middle me-1"
                        />
                        <span>Baby/Toddlers</span>
                      </Form.Label>
                      <br />
                      <Form.Label className="me-3" style={{minWidth: '90px'}}>
                        <input
                          type="checkbox"
                          checked={interestedIn.includes('Women')}
                          onChange={() => handleInterestChange('Women')}
                          className="d-inline-block vertical-align-middle me-1"
                        />
                        <span>Women</span>
                      </Form.Label>
                      <Form.Label style={{minWidth: '90pxs'}}>
                        <input
                          type="checkbox"
                          checked={interestedIn.includes('Others')}
                          onChange={() => handleInterestChange('Others')}
                          className="d-inline-block vertical-align-middle me-1"
                        />
                        <span>Others</span>
                      </Form.Label>
                    </div>
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label>Event Date</Form.Label>
                    <FormControl type='date' name='event_date' onChange={handleChange} className='mr-sm-2' required />
                  </Form.Group> */}
                  <div className="alert alert-primary mb-0 small lh-1-7" role="alert">
                    As part of our ongoing commitment to security and user safety, we are requiring users to provide a valid identification document for access to certain enhanced features on our platform.
                  </div>
                  {registerFormLoading ?
                    <Button className='w-100 mt-4' variant='primary' type='submit'>Signing up...</Button>
                    :
                    <Button className='w-100 mt-4' variant='primary' type='submit'>Sign up</Button>
                  }
                  {googleLoginLoading ?
                    <Button className='w-100 mt-3' variant='secondary' type='button'>Signing up using Google...</Button>
                    :
                    <Button className='w-100 mt-3' variant='secondary' type='button' onClick={login}>Sign up with Google</Button>
                  }
                  <p className='mb-0 mt-4 text-center fs-14 text-dgray'>Already have an account? <Link className='login' to='/login'>Log In</Link></p>
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

export default SignUp;