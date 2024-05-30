import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import 'Assets/styles/SignUp/style.css';
import GoogleIcon from 'Assets/images/google-icon.png';
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

const SignUp = (props) => {
    const navigate = useNavigate();
    const formRef = useRef(null);
    const signupType = props.type ?? 'normal';
    const [registerFormData, setRegisterFormData] = useState(initialRegisterData);
    const [registerFormLoading, setRegisterFormLoading] = useState(false);
    const [interestedIn, setInterestedIn] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    console.log(props.type);

    const handleChange = (e) => {
        setRegisterFormData({
            ...registerFormData,
            [e.target.name]: e.target.value,
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

    async function registerSubmit(e) {
        e.preventDefault();
        setRegisterFormLoading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'register', { ...registerFormData, interested_in: interestedIn }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                const data = response.data.data;
                const user = data.user;
                toast.success('Successfully signed up!');
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
                        navigate("/questionnaire");
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

    useEffect(() => {
        setRegisterFormData({
            ...registerFormData,
            signup_type: signupType,
            is_designer: signupType == "designer" ? 1 : 0,
            is_seller: signupType == "seller" ? 1 : 0,
            completed_questionnaire: signupType.includes("user") ? 1 : 0,
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
        <section id='signup' className='d-flex align-items-center' ref={formRef}>
            <Container fluid>
                {/*  style={{ minHeight: '100vh' }} */}
                <Row>
                    <Col lg='12' className='d-flex flex-column justify-content-center pb-4'>
                        <div className='sign-up-container'>
                            <Card className="border-none">
                                <Card.Body>
                                    <a href="/">
                                        <img src={KoutureLogo} className="kouture-icon" alt="Kouture Konect" style={{ maxWidth: '50px' }} />
                                    </a>
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
                                                <p className="text-center small mb-0">
                                                    Join Kouture Konect to view more Designers, Designs and Fabrics!
                                                </p>
                                                <div className="divider-small mb-4 mt-3"></div>
                                            </>
                                    }
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
                                        <p className='mb-0 mt-4 text-center fs-14 text-dgray'>Already have an account? <Link className='login' to='/login'>Sign In</Link></p>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>

    );
};

export default SignUp;