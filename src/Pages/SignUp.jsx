import React, { useEffect, useState } from 'react';
import { Email, domains } from '@smastrom/react-email-autocomplete'
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import '../Assets/styles/SignUp/style.css';
import GoogleIcon from '../Assets/images/google-icon.png';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import KoutureLogo from 'Assets/images/kouture-konect-icon.png';
import { IoEyeOutline, IoEyeOffOutline, IoInformationCircle  } from "react-icons/io5";
import { connectFirestoreEmulator } from '@firebase/firestore';
import { FcGoogle } from "react-icons/fc";
import Layout from '../Components/Layout/Layout';

const initialRegisterData = Object.freeze({
  email: '',
  password: '',
  password_confirmation: '',
  event_date: '',
  over_18: ''
});

const SignUp = () => {
  const navigate = useNavigate();
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();
  const redirectTo = query.get('redirect_to') || "";

  const location = useLocation();

  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'tempFavorites', 'tempCart', 'tempFavorites', 'over_18']);

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
  const [infoModalShow, setInfoModalShow] = useState(false);

  const currentUser = cookies.currentUser;
  const isLoggedIn = cookies.isLoggedIn;
  const userDetails = cookies.userDetails;
  const userRole = cookies.userRole;
  const token = cookies.token;
  const [tempCart, setTempCart] = useState(cookies.tempCart ?? []);
  const [tempFavorites, setTempFavorites] = useState(cookies.tempFavorites ?? []);
  const over_18 = cookies.over_18;

  const [selectedOption, setSelectedOption] = useState('');

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

  const handleChangeOver18 = (e) => {
    setRegisterFormData({
      ...registerFormData,
      over_18: e,
    })
  }

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

        if (selectedOption === 'Yes') {
          if (redirectTo && redirectTo != "" & redirectTo != null) {
            if (signupOption && signupOption != "") {
              navigate(`/questionnaire?option=${signupOption}&redirect_to=${encodeURIComponent(redirectTo)}`);
            } else {
              navigate(`/questionnaire?redirect_to=${encodeURIComponent(redirectTo)}`);
            }
          } else {
            if (signupOption && signupOption != "") {
              navigate("/questionnaire?option=" + signupOption);
            } else {
              navigate("/questionnaire");
            }
          }
        } else {
          if (redirectTo && redirectTo != "" & redirectTo != null) {
            if (signupOption && signupOption != "") {
              navigate("/" + signupOption);
            } else {
              navigate(redirectTo);
            }
          } else {
            if (signupOption && signupOption != "") {
              navigate("/" + signupOption);
            } else {
              navigate("/user/profile");
            }
          }
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

    var completed_questionnaire = 0
    if (selectedOption === 'No') {
      completed_questionnaire = 1;
    }

    axios.post(process.env.REACT_APP_API_ENDPOINT + 'register', { ...registerFormData, interested_in: interestedIn, completed_questionnaire: completed_questionnaire }).then((response) => {
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

  const toggleInfoModal = (e) => {
    setInfoModalShow(!infoModalShow);
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

  const handleChangeSetUpShop = (event) => {
    setSelectedOption(event.target.value);

    if (event.target.value === 'Yes') {
      setInterestedIn([]);
      setRegisterFormData({ ...registerFormData, event_date: '' })
    }
  };

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

  useEffect(() => {
    if (signupType == "seller" || signupType == "designer" || signupType == "designer_seller") {
      setSelectedOption("Yes");
    } else if (signupType == "customer") {
      setSelectedOption("No");
    }
  }, [signupType])

  return (
    <LayoutNoFooter>
      <section id='signup' className='d-flex align-items-center'>
        <Container fluid>
          <Row style={{ minHeight: '100vh' }}>
            <Col lg='12' className='d-flex flex-column justify-content-center py-4'>
              <div className='sign-up-container'>
                {/* <Link to="/">
                  <img src={KoutureLogo} className="kouture-icon" alt="Kouture Konect" />
                </Link> */}
                <>
                  {over_18 == "No" ?
                    <>
                      <div className="top-alert alert small lh-1-7" role="alert">
                        You are now creating an account as the parent/guardian of the owner.
                      </div>
                      <hr />
                    </>
                    :
                    null
                  }
                  <h1 className='text-center'>Sign up to Kouture Konect</h1>
                  <p className="text-center small fs-16 mb-0">
                    Join Kouture Konect to view more Designers, Designs and Fabrics!
                  </p>
                  {googleLoginLoading ?
                    <Button className='w-100 mt-3' variant='secondary' type='button'>Signing up using Google...</Button>
                    :
                    <Button className='custom-hover-btn-google w-100 mt-5 px-5 ' type='button' onClick={login}>
                      <FcGoogle  size={30} className='mx-2'/>
                        Continue with Google
                    </Button>
                  }
                  <p className="text-muted fs-13">By clicking Continue with Google, you agree to Kouture Konect’s Terms of Use and Privacy Policy.</p>
                  {/* <div className="divider-small mb-4 mt-3"></div> */}
                  <div className="custom-divider">or</div>
                </>
                <Form style={{marginTop: '30px' }}onSubmit={registerSubmit}>
                  {/* {registerFormData.over_18 && registerFormData.over_18 != "" ? */}
                    {/* <> */}
                      {/* <Form.Group className="mb-3 mt-4">
                        <Card className="text-center">
                          <Card.Body>
                            <div className="py-3">
                              <Form.Label>Are you over 18? <IoInformationCircle className="cursor-pointer" onClick={toggleInfoModal} /></Form.Label>
                              <Row className="mt-3 justify-content-center">
                                <Form.Group as={Col} lg={3}>
                                  {registerFormData.over_18 == "Yes" ?
                                    <Button style={{minWidth: 'auto'}} onClick={() => handleChangeOver18("Yes")} className='w-100 bg-white text-gold border-gold' variant='secondary' type='button'>Yes</Button>
                                    :
                                    <Button style={{minWidth: 'auto'}} onClick={() => handleChangeOver18("Yes")} className='w-100 bg-gold border-gold' variant='secondary' type='button'>Yes</Button>
                                  }
                                </Form.Group>
                                <Form.Group as={Col} lg={3}>
                                  {registerFormData.over_18 == "No" ?
                                    <Button style={{minWidth: 'auto'}} onClick={() => handleChangeOver18("No")} className='w-100 bg-white text-black' variant='secondary' type='button'>No</Button>
                                    :
                                    <Button style={{minWidth: 'auto'}} onClick={() => handleChangeOver18("No")} className='w-100 bg-black border-black' variant='secondary' type='button'>No</Button>
                                  }
                                </Form.Group>
                              </Row>
                            </div>
                          </Card.Body>
                        </Card>
                      </Form.Group> */}
                      {/* {over_18 == "No" ?
                        <>
                          <div className="alert alert-primary small lh-1-7" role="alert">
                            You are now creating an account as the parent/guardian of the owner.
                          </div>
                          <hr />
                        </>
                        :
                        null
                      } */}
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
                        <div className="show-password">
                          <FormControl type={showPassword ? 'text' : 'password'} name='password' onChange={handleChange} className='mr-sm-2' required />
                          {showPassword ?
                            <IoEyeOutline className="form-input-icon cursor-pointer hi-eye off-eye" onClick={function () { setShowPassword(false); }} />
                            :
                            <IoEyeOffOutline className="form-input-icon cursor-pointer hi-eye-off off-eye" onClick={function () { setShowPassword(true); }} />
                          }
                        </div>
                      </Form.Group>
                      <Form.Group className='mb-4'>
                        <Form.Label>Confirm Password</Form.Label>
                        <div className="show-password">
                          <FormControl type={showConfirmPassword ? 'text' : 'password'} name='password_confirmation' onChange={handleChange} className='mr-sm-2' required />
                          {showConfirmPassword ?
                            <IoEyeOutline className="form-input-icon cursor-pointer hi-eye off-eye" onClick={function () { setShowConfirmPassword(false); }} />
                            :
                            <IoEyeOffOutline className="form-input-icon cursor-pointer hi-eye-off off-eye" onClick={function () { setShowConfirmPassword(true); }} />
                          }
                        </div>
                      </Form.Group>
                      {signupType != "seller" && signupType != "designer" && signupType != "designer_seller" && signupType != "customer" && (
                        <>
                          <Form.Group>
                            <Card className='mb-4'>
                              <Card.Body>
                                <Form.Label>Do you want to set up a shop?</Form.Label>
                                <Row className="mt-2">
                                  <Form.Group as={Col} lg={3}>
                                    <Form.Check
                                      className="cursor-pointer"
                                      type="radio"
                                      label="Yes"
                                      name="set_up_shop"
                                      value="Yes"
                                      required
                                      checked={selectedOption === 'Yes'}
                                      onChange={handleChangeSetUpShop}
                                    />
                                  </Form.Group>
                                  <Form.Group as={Col} lg={3}>
                                    <Form.Check
                                      className="custom-radio cursor-pointer"
                                      type="radio"
                                      label="No"
                                      name="set_up_shop"
                                      value="No"
                                      required
                                      checked={selectedOption === 'No'}
                                      onChange={handleChangeSetUpShop}
                                    />
                                  </Form.Group>
                                </Row>
                              </Card.Body>
                            </Card>
                          </Form.Group>
                        </>
                      )}
                      {selectedOption === 'No' && (
                        <>
                          <Form.Group>
                            <Card className='mb-4'>
                              <Card.Body>
                                <Form.Label className='mb-2 fs-18'>
                                  Clothing Preferences
                                </Form.Label>
                                <Row className="align-items-center mt-1">
                                  <Col md="6">
                                    <Form.Label className="me-3" style={{ minWidth: '90px' }}>
                                      <input
                                        type="checkbox"
                                        checked={interestedIn.includes('Men')}
                                        onChange={() => handleInterestChange('Men')}
                                        className="d-inline-block vertical-align-middle me-1"
                                      />
                                      <span>Men's Clothing</span>
                                    </Form.Label>
                                  </Col>
                                  <Col md="6">
                                    <Form.Label style={{ minWidth: '90px' }}>
                                      <input
                                        type="checkbox"
                                        checked={interestedIn.includes('Baby/Toddlers')}
                                        onChange={() => handleInterestChange('Baby/Toddlers')}
                                        className="d-inline-block vertical-align-middle me-1"
                                      />
                                      <span>Baby/Toddler Clothing</span>
                                    </Form.Label>
                                  </Col>
                                </Row>
                                <Row className="align-items-center">
                                  <Col md="6">
                                    <Form.Label className="me-3" style={{ minWidth: '90px' }}>
                                      <input
                                        type="checkbox"
                                        checked={interestedIn.includes('Women')}
                                        onChange={() => handleInterestChange('Women')}
                                        className="d-inline-block vertical-align-middle me-1"
                                      />
                                      <span>Women's Clothing</span>
                                    </Form.Label>
                                  </Col>
                                  <Col md="6">
                                    <Form.Label style={{ minWidth: '90px' }}>
                                      <input
                                        type="checkbox"
                                        checked={interestedIn.includes('Others')}
                                        onChange={() => handleInterestChange('Others')}
                                        className="d-inline-block vertical-align-middle me-1"
                                      />
                                      <span>Others</span>
                                    </Form.Label>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                            <Card className='mb-4'>
                              <Card.Body>
                                <Form.Label className='mb-2 fs-18'>
                                  Event Date
                                </Form.Label>
                                <Row className="align-items-center mb-3">
                                  <Col md="12">
                                    <FormControl type='date' name='event_date' onChange={handleChange} className='mr-sm-2' />
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </Form.Group>
                        </>
                      )}
                      <div className="alert alert-primary bg-white text-black mb-0 small lh-1-7" role="alert">
                        As part of our ongoing commitment to security and user safety, we are requiring users to provide a valid identification document for access to certain enhanced features on our platform.
                      </div>
                      {registerFormLoading ?
                        <Button className='w-100 mt-4' variant='primary' type='submit'>Signing up...</Button>
                        :
                        <Button className='w-100 mt-4' variant='primary' type='submit'>Sign up</Button>
                      }
                      {/* {googleLoginLoading ?
                        <Button className='w-100 mt-3' variant='secondary' type='button'>Signing up using Google...</Button>
                        :
                        <Button className='w-100 mt-3' variant='secondary' type='button' onClick={login}>Sign up with Google</Button>
                      } */}
                    {/* </> */}
                    {/* : */}
                    {/* <Form.Group className="mb-3 mt-4">
                      <Card className="text-center">
                        <Card.Body>
                          <div className="py-3">
                            <Form.Label>Are you over 18 years of age? <IoInformationCircle className="cursor-pointer" onClick={toggleInfoModal} /></Form.Label>
                            <Row className="mt-3 justify-content-center">
                              <Form.Group as={Col} lg={3}>
                                {registerFormData.over_18 == "Yes" ?
                                  <Button style={{minWidth: 'auto'}} onClick={() => handleChangeOver18("Yes")} className='w-100 bg-white text-gold border-gold' variant='secondary' type='button'>Yes</Button>
                                  :
                                  <Button style={{minWidth: 'auto'}} onClick={() => handleChangeOver18("Yes")} className='w-100 bg-gold border-gold' variant='secondary' type='button'>Yes</Button>
                                }
                              </Form.Group>
                              <Form.Group as={Col} lg={3}>
                                {registerFormData.over_18 == "No" ?
                                  <Button style={{minWidth: 'auto'}} onClick={() => handleChangeOver18("No")} className='w-100 bg-white text-black' variant='secondary' type='button'>No</Button>
                                  :
                                  <Button style={{minWidth: 'auto'}} onClick={() => handleChangeOver18("No")} className='w-100 bg-black border-black' variant='secondary' type='button'>No</Button>
                                }
                              </Form.Group>
                            </Row>
                          </div>
                        </Card.Body>
                      </Card>
                    </Form.Group>
                  } */}
                  <p className='mb-0 mt-4 text-center fs-14 text-dgray'>Already have an account? <Link className='login' to={`/login?redirect_to=${encodeURIComponent(redirectTo)}`}>Log In</Link></p>
                </Form>
              </div>
            </Col>
            {/* <Col lg="4" className='with-bg'>
            </Col> */}
          </Row>
        </Container>
      </section>
      <Modal show={infoModalShow} fullscreen={false} onHide={() => setInfoModalShow(false)}>
        <Modal.Header closeButton className="pb-0">
          &nbsp;
          {/* <Modal.Title><h5 className='modal-title text-left rufina-family fs-22'>Can Minors Sell on Kouture Konect?</h5></Modal.Title> */}
        </Modal.Header>
        <Modal.Body className="pt-0">
          <h2 className='modal-title fs-25 fw-600 pb-2 text-center'>Can Minors Sell on Kouture Konect?</h2>
          <Card>
            <Card.Body className='bg-lgray'>
              <Row className="h-100">
                <Col lg="12">
                  <p>Kouture Konect welcomes minors between the ages of 13 and 17 to buy and sell on Kouture Konect as long as you have the permission and direct supervision of your parent or legal guardian. </p>
                  <p>Your parent or legal guardian must register for the account with their information, and they're responsible for any and all of your activity on the account. All Kouture Konect account owners must be at least 18 years of age, as stated in Kouture Konect's <a href="/about-kouture-konect">Terms of Use</a>. </p>
                  <p>The account you use must meet the following criteria:</p>
                  <ul className="mb-0">
                    <li className="mb-2">
                      All financial information on the account must be under the parent or legal guardian's name.
                    </li>
                    <li className="mb-2">
                      The preferred name on the account must be the parent or legal guardian's name.
                    </li>
                    <li className="mb-2">
                      All shop members must be listed in the shop's <a href="/about-kouture-konect">About section</a>, and your parent or legal guardian must be the shop owner.
                    </li>
                    <li className="mb-1">
                      The email address on the account must belong to the parent or legal guardian.
                    </li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    </LayoutNoFooter>
  );
};

export default SignUp;