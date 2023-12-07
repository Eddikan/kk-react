import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import '../Assets/styles/SignUp/style.css';
import GoogleIcon from '../Assets/images/google-icon.png';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';

const initialRegisterData = Object.freeze({
  email: '',
  password: '',
  password_confirmation: '',
  first_name: 'Jeno',
  last_name: 'Cabrera'
});

const SignUp = () => {
  const navigate = useNavigate();

  const [registerFormData, setRegisterFormData] = useState(initialRegisterData);
  const [registerFormLoading, setRegisterFormLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn','userDetails','userRole']);

  const currentUser = cookies.currentUser;
  const isLoggedIn = cookies.isLoggedIn;
  const userDetails = cookies.userDetails;
  const userRole = cookies.userRole;
  const token = cookies.token;

  const handleChange = (e) => {
    setRegisterFormData({
      ...registerFormData,
      [e.target.name]: e.target.value,
    })
  }

  async function registerSubmit(e) {
    e.preventDefault();
    setRegisterFormLoading(true);
    axios.post(process.env.REACT_APP_API_ENDPOINT + 'register', registerFormData).then((response) => {
      const success = response.data.status;
      if (success == 'Success') {
        const data = response.data.data;
        const user = data.user;
        toast.success('Successfully signed up!');
        setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
        setCookie('userRole', JSON.stringify(user.role), { path: '/' });
        setCookie('userDetails', JSON.stringify(user), { path: '/' });
        setCookie('isLoggedIn', true, { path: '/' });
        setCookie('token', data.token, { path: '/' });
        setTimeout(function(){
          navigate("/email-confirmation");
        }, 1500);
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

  }, [isLoggedIn]);

  return (
    <Layout>
      <section id='signup' className='d-flex align-items-center'>
        <Container fluid>
          <Row className='vh-100'>
            <Col lg='8' className='d-flex flex-column justify-content-center'>
                <div className='sign-up-container'>
                    <h1 className='text-center'>Sign up to Kouture Konect</h1>
                    <button className='sign-in-google mt-3'>
                        <img src={GoogleIcon}/>
                        <span className='subtitle'>Sign in with Google</span>
                    </button>
                    <hr className='mb-0 mt-5'/>
                    <p className='sign-up-with-email'>or create an account</p>
                    <Form className='mt-4' onSubmit={registerSubmit}>
                        <Form.Group className='mb-3' controlId='formBasicEmail'>
                            <Form.Label>Email Address</Form.Label>
                            <FormControl type='email' name='email' onChange={handleChange} className='mr-sm-2' required />
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='formBasicPassword'>
                            <Form.Label>Password</Form.Label>
                            <FormControl type='password' name='password' onChange={handleChange} className='mr-sm-2' required />
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='formBasicPassword'>
                            <Form.Label>Confirm Password</Form.Label>
                            <FormControl type='password' name='password_confirmation' onChange={handleChange} className='mr-sm-2' required />
                        </Form.Group>
                        {registerFormLoading ?
                          <Button className='w-100 mt-4' variant='primary' type='submit'>Signing up...</Button>
                          :
                          <Button className='w-100 mt-4' variant='primary' type='submit'>Sign up</Button>
                        }
                        <p className='mb-0 mt-4 text-center fs-14 text-dgray'>Already have an account? <a className='login' href='/login'>Log In</a></p>
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

export default SignUp;