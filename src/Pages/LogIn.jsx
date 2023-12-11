import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import '../Assets/styles/LogIn/style.css';
import GoogleIcon from '../Assets/images/google-icon.png';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';

const initialLoginData = Object.freeze({
  email: '',
  password: ''
});

const LogIn = () => {
  const navigate = useNavigate();

  const [loginFormData, setLoginFormData] = useState(initialLoginData);
  const [loginFormLoading, setLoginFormLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);

  const currentUser = cookies.currentUser;
  const isLoggedIn = cookies.isLoggedIn;
  const userDetails = cookies.userDetails;
  const userRole = cookies.userRole;
  const token = cookies.token;

  const handleChange = (e) => {
    setLoginFormData({
      ...loginFormData,
      [e.target.name]: e.target.value,
    })
  }

  async function loginSubmit(e) {
    e.preventDefault();
    setLoginFormLoading(true);
    axios.post(process.env.REACT_APP_API_ENDPOINT + 'login', loginFormData).then((response) => {
      const success = response.data.status;
      if (success == 'Success') {
        const data = response.data.data;
        const user = data.user;
        toast.success('Successfully signed in!');
        setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
        setCookie('userRole', JSON.stringify(user.role), { path: '/' });
        setCookie('userDetails', JSON.stringify(user), { path: '/' });
        setCookie('isLoggedIn', true, { path: '/' });
        setCookie('token', data.token, { path: '/' });
        setTimeout(function () {
          navigate("/user/profile");
        }, 1000);
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

  useEffect(() => {
    if (currentUser && currentUser != "") {
      toast.error("You are already logged in!");
      navigate("/user/profile");
    }
  }, [isLoggedIn]);

  return (
    <Layout>
      <section id='login' className='d-flex align-items-center'>
        <Container fluid>
          <Row className='vh-100'>
            <Col id="login-column" lg='8' className='d-flex flex-column justify-content-center'>
              <div className='login-container'>
                <h1 className='text-center'>Sign in to Kouture Konect</h1>
                {/* <button className='login-google mt-3'>
                  <img src={GoogleIcon} />
                  <span className='subtitle'>Sign in with Google</span>
                </button>
                <hr className='mb-0 mt-5' />
                <p className='login-with-email'>or sign in with email</p> */}
                <Form className='mt-4' onSubmit={loginSubmit}>
                  <Form.Group className='mb-3' controlId='formBasicEmail'>
                    <Form.Label>Email Address</Form.Label>
                    <FormControl type='email' name='email' value={loginFormData.email} className='mr-sm-2' onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className='mb-3' controlId='formBasicPassword'>
                    <Form.Label>Password</Form.Label>
                    <FormControl type='password' name='password' value={loginFormData.password} className='mr-sm-2' onChange={handleChange} required />
                  </Form.Group>
                  <a className='forgot-password text-dgray fs-16'>Forgot Password</a>
                  {loginFormLoading ?
                    <Button className='w-100 mt-4' variant='primary' type='button'>Signing in...</Button>
                    :
                    <Button className='w-100 mt-4' variant='primary' type='submit'>Sign in</Button>
                  }
                  <p className='mb-0 mt-4 text-center fs-14 text-dgray'>Don't have an account? <a className='sign-up' href='/sign-up'>Sign Up</a></p>
                </Form>
              </div>
            </Col>
            <Col lg="4" className='with-bg'>
            </Col>
          </Row>
        </Container>
      </section>

    </Layout>
  );
};

export default LogIn;