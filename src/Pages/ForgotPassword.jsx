import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LayoutNoFooter from 'Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import 'Assets/styles/LogIn/style.css';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import KoutureLogo from 'Assets/images/kouture-konect-icon.png';

const initialForgotPassword = Object.freeze({
    email: '',
});

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [forgotPasswordFormData, setForgotPasswordFormData] = useState(initialForgotPassword);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [reloadCount, setReloadCount] = useState(true);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;

    const postForgotPassword = async (data) => {
        return await axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'password/forgot', data);
    };

    const handleChangePassword = (e) => {
        setForgotPasswordFormData({
            ...forgotPasswordFormData,
            [e.target.name]: e.target.value,
        })
    }

    const forgotPasswordSubmit = (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        postForgotPassword({ ...forgotPasswordFormData }).then(response => {
            const status = response.data.status;

            if (status === 'Success') {
                var result = response.data.data;
                setReloadCount(reloadCount + 1);
                setForgotPasswordFormData(initialForgotPassword);
                toast.success('Please check your email for password reset instructions!');
                setTimeout(function () {
                    window.location.href = "/";
                }, 2000)

            } else {
                var errors = response.data.errors;
                if (errors.email) {
                    var email_errors = errors.email;
                    email_errors.map((error, index) => {
                        toast.error('Something went wrong, please contact the administrator!');
                    });
                }
                if (errors.password) {
                    var password_errors = errors.password;
                    password_errors.map((error, index) => {
                        toast.error('Something went wrong, please contact the administrator!');
                    });
                }

                if (!errors.email && !errors.password) {
                    var all_errors = errors;
                    all_errors.map((error, index) => {
                        toast.error('Something went wrong, please contact the administrator!');
                    });
                }
            }
        }).catch((error) => {
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    useEffect(() => {
        if (currentUser && currentUser != "") {
            navigate("/user/profile");
        }
    }, []);

    return (
        <LayoutNoFooter>
            <section id='login' className='d-flex align-items-center'>
                <Container fluid>
                    <Row style={{ minHeight: '100vh' }}>
                        <Col id="login-column" lg='8' className='d-flex flex-column justify-content-center'>
                            <div className='login-container'>
                                <a href='/'>
                                    <img src={KoutureLogo} className="kouture-icon" alt="Kouture Konect" />
                                </a>

                                <h1 className='text-center'>Forgot Password</h1>
                                <div className="divider-small mb-3 mt-4"></div>

                                <Form onSubmit={forgotPasswordSubmit}>
                                    <Form.Group className='mb-0 mt-0' controlId='formBasicEmail'>
                                        <Form.Label>Email Address</Form.Label>
                                        <FormControl
                                            type='email'
                                            name='email'
                                            value={forgotPasswordFormData.email}
                                            className='mr-sm-2'
                                            onChange={handleChangePassword}
                                            required
                                        />
                                    </Form.Group>

                                    {submitLoading ?
                                        <Button className='w-100 mt-4' variant='primary' type='button'>Submitting...</Button>
                                        :
                                        <Button className='w-100 mt-4' variant='primary' type='submit'>Submit</Button>
                                    }
                                    <p className='mb-0 mt-4 text-center fs-14 text-dgray'>Already have an account? <Link className='login' to='/login'>Sign in</Link></p>
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

export default ForgotPassword;