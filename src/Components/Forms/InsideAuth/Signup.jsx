import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import 'Assets/styles/SignUp/style.css';
import GoogleIcon from 'Assets/images/google-icon.png';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import KoutureLogo from 'Assets/images/kouture-konect-icon.png';
import { IoEyeOutline, IoEyeOffOutline, IoInformationCircle  } from "react-icons/io5";

const initialRegisterData = Object.freeze({
    email: '',
    password: '',
    password_confirmation: '',
    event_date: '',
    over_18: ''
});

const SignUp = ({ onSignup, showLogin }) => {
    const navigate = useNavigate();
    const formRef = useRef(null);
    const signupType = onSignup.type || 'normal';
    const [registerFormData, setRegisterFormData] = useState(initialRegisterData);
    const [registerFormLoading, setRegisterFormLoading] = useState(false);
    const [interestedIn, setInterestedIn] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'tempCart', 'tempFavorites']);
    const [tempCart, setTempCart] = useState(cookies.tempCart ?? []);
    const [tempFavorites, setTempFavorites] = useState(cookies.tempFavorites ?? []);
    const [infoModalShow, setInfoModalShow] = useState(false);

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
    };

    const handleInterestChange = (value) => {
        if (interestedIn.includes(value)) {
            // Remove the value if it's already checked
            setInterestedIn(interestedIn.filter(item => item !== value));
        } else {
            // Add the value if it's not checked
            setInterestedIn([...interestedIn, value]);
        }
    };

    const getUserCartItems = async (e) => {
        return await axios.get(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'user/' + e + '/cart');
    };

    async function addTempCartToCart(data) {
        // setReorderLoading(true);
        axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'cart/bulk', { order_items: data.order_items, user_id: data.user_id }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                getUserCartItems(data.user_id).then((response) => {
                    const cartItemsData = response.data.data;
                    if (cartItemsData) {
                        setTimeout(function () {
                            onSignup({ user_id: data.user_id, cart_items: cartItemsData });
                        }, 1000)
                    } else {
                        toast.error('There has been an error getting the cart items, please try again!');
                    }
                })
                    .catch((error) => {
                        toast.error('There has been an error getting the cart items, please try again!');
                    });

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
        axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'portfolio/item/wishlist/bulk', { favorites: data.favorites, user_id: data.user_id }).then((response) => {
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
        axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'register', { ...registerFormData, interested_in: interestedIn }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                const data = response.data.data;
                const user = data.user;
                toast.success('Successfully signed up!');

                if (tempCart && tempCart.length > 0) {
                    addTempCartToCart({ order_items: tempCart, user_id: user.id });
                    removeCookie('tempCart', { path: '/' });
                }

                if (tempFavorites && tempFavorites.length > 0) {
                    addTempFavoritesToFavorites({ favorites: tempFavorites, user_id: user.id });
                    removeCookie('tempFavorites', { path: '/' });
                }

                setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
                setCookie('userRole', JSON.stringify(user.role), { path: '/' });
                const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type }
                setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                setCookie('signup_type', signupType, { path: '/' });
                setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
                setCookie('isLoggedIn', true, { path: '/' });
                setCookie('token', data.token, { path: '/' });
                setTimeout(function () {
                    // navigate("/email-confirmation");
                    if (signupType == "user_designer") {
                        navigate("/designers");
                    } else if (signupType == "user_fabric") {
                        navigate("/fabrics");
                    } else if (signupType == "user_design") {
                        navigate("/designs");
                    } else {
                        // navigate("/questionnaire");
                        navigate("/checkout");
                    }
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
    };

    const toggleInfoModal = (e) => {
        setInfoModalShow(!infoModalShow);
    }

    useEffect(() => {
        setRegisterFormData({
            ...registerFormData,
            signup_type: signupType,
            is_designer: signupType == "designer" ? 1 : 0,
            is_seller: signupType == "seller" ? 1 : 0,
            // completed_questionnaire: signupType.includes("user") ? 1 : 0,
            completed_questionnaire: 1,
        });
    }, []);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            // Your resize logic here
        });

        if (formRef.current) {
            resizeObserver.observe(formRef.current);
        }

        return () => {
            if (formRef.current) {
                resizeObserver.unobserve(formRef.current);
            }
        };
    }, []);

    return (
        <>
            <section id='signup' className='d-flex align-items-center' ref={formRef}>
                <div className='sign-up-container'>
                    <a href="/">
                        <img src={KoutureLogo} className="kouture-icon" alt="Kouture Konect" style={{ maxWidth: '50px' }} />
                    </a>
                    <>
                        <h1 className='text-center'>Sign up to Kouture Konect</h1>
                        <p className="text-center small mb-0 fs-15">
                            Join Kouture Konect to view more Designers, Designs and Fabrics!
                        </p>
                        <div className="divider-small mb-4 mt-3"></div>
                    </>
                    <Form style={{marginTop: '30px'}} onSubmit={registerSubmit}>
                        {registerFormData.over_18 && registerFormData.over_18 != "" ?
                            <>
                                <Form.Group className="mb-3 mt-4">
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
                                </Form.Group>
                                {registerFormData.over_18 == "No" ?
                                    <>
                                        <div className="alert alert-primary small lh-1-7" role="alert">
                                            You are now creating an account as the parent/guardian of the owner.
                                        </div>
                                        <hr />
                                    </>
                                    :
                                    null
                                }
                                <Form.Group className='mb-3' controlId='formBasicEmail'>
                                    <Form.Label>Email Address</Form.Label>
                                    <FormControl type='email' name='email' onChange={handleChange} className='mr-sm-2' required />
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Password</Form.Label>
                                    <FormControl type='password' name='password' onChange={handleChange} className='mr-sm-2' required />
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Confirm Password</Form.Label>
                                    <FormControl type='password' name='password_confirmation' onChange={handleChange} className='mr-sm-2' required />
                                </Form.Group>
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
                                        <Row className="align-items-center mb-2">
                                            <Col md="12">
                                                <FormControl type='date' name='event_date' onChange={handleChange} className='mr-sm-2' />
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                                <div className="alert alert-primary mb-0 small lh-1-7" role="alert">
                                    As part of our ongoing commitment to security and user safety, we are requiring users to provide a valid identification document for access to certain enhanced features on our platform.
                                </div>
                                {registerFormLoading ?
                                    <Button className='w-100 mt-4' variant='primary' type='submit'>Signing up...</Button>
                                    :
                                    <Button className='w-100 mt-4' variant='primary' type='submit'>Sign up</Button>
                                }
                            </>
                            :
                            <Form.Group className="mb-3 mt-4">
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
                            </Form.Group>
                        }
                        <p className='mb-0 mt-4 text-center fs-14 text-dgray'>Already have an account? <span className='login' style={{ cursor: 'pointer' }} onClick={() => showLogin(0)}>Sign In</span></p>
                    </Form>
                </div>
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
        </>
    );
};

export default SignUp;