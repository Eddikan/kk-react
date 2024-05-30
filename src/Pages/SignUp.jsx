import React, { useEffect, useState } from 'react';
import { Email, domains } from '@smastrom/react-email-autocomplete'
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

  const [signupType, setSignupType] = useState(query.get("type"));
  const [signupOption, setSignupOption] = useState(query.get("option"));
  const [registerFormData, setRegisterFormData] = useState(initialRegisterData);
  const [registerFormLoading, setRegisterFormLoading] = useState(false);
  const [interestedIn, setInterestedIn] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'tempFavorites', 'tempCart', 'tempFavorites']);

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
        if (selectedUser.signup_type == "user_designer") {
          navigate("/designers");
        } else if (selectedUser.signup_type == "user_fabric") {
          navigate("/fabrics");
        } else if (selectedUser.signup_type == "user_design") {
          navigate("/designs");
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
        if (signupType == "user" && signupOption == "designers") {
          signupTypeOption = "user_designer";
        } else if (signupType == "user" && signupOption == "fabrics") {
          signupTypeOption = "user_fabric";
        } else if (signupType == "user" && signupOption == "designs") {
          signupTypeOption = "user_design";
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
      if (signupType == "user" && signupOption == "designers") {
        navigate("/designers");
      } else if (signupType == "user" && signupOption == "fabrics") {
        navigate("/fabrics");
      } else if (signupType == "user" && signupOption == "designs") {
        navigate("/designs");
      }
    } else if (!signupType) {
      setSignupType("normal");
    }

    let signupTypeOption = "";
    if (signupType && signupOption) {
      if (signupType == "user" && signupOption == "designers") {
        signupTypeOption = "user_designer";
      } else if (signupType == "user" && signupOption == "fabrics") {
        signupTypeOption = "user_fabric";
      } else if (signupType == "user" && signupOption == "designs") {
        signupTypeOption = "user_design";
      }
    } else if (signupType) {
      signupTypeOption = signupType;
    } else {
      signupTypeOption = "normal"
    }

    setRegisterFormData({
      ...registerFormData,
      signup_type: signupTypeOption,
      is_designer: signupType == "designer" ? 1 : 0,
      is_seller: signupType == "seller" ? 1 : 0,
      completed_questionnaire: signupType == "user" ? 1 : 0,
    });
  }, [currentUser, signupType]);

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
      <section id='signup' className='d-flex align-items-center'>
        <Container fluid>
          <Row style={{ minHeight: '100vh' }}>
            <Col lg='8' className='d-flex flex-column justify-content-center py-4'>
              <div className='sign-up-container'>
                <Link to="/">
                  <img src={KoutureLogo} className="kouture-icon" alt="Kouture Konect" />
                </Link>
                {signupType == "designer" ?
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
                }

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
                    <FormControl type='password' name='password' onChange={handleChange} className='mr-sm-2' required />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label>Confirm Password</Form.Label>
                    <FormControl type='password' name='password_confirmation' onChange={handleChange} className='mr-sm-2' required />
                  </Form.Group>
                  <Form.Group className='mb-3'>
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
                  </Form.Group>
                  <div className="alert alert-primary mb-0 small lh-1-7" role="alert">
                    As part of our ongoing commitment to security and user safety, we are requiring users to provide a valid identification document for access to certain enhanced features on our platform.
                  </div>
                  {registerFormLoading ?
                    <Button className='w-100 mt-4' variant='primary' type='submit'>Signing up...</Button>
                    :
                    <Button className='w-100 mt-4' variant='primary' type='submit'>Sign up</Button>
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