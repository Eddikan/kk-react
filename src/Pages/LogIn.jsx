import React, { useEffect, useState } from 'react';
import Layout from '../Components/Layout/Layout';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import '../Assets/styles/LogIn/style.css'; 
import GoogleIcon from '../Assets/images/google-icon.png';

const LogIn = () => {
  return (
    <Layout>
      <section id='login' className='d-flex align-items-center'>
        <Container fluid>
          <Row className='vh-100'>
            <Col lg='8' className='d-flex flex-column justify-content-center'>
                <div className='login-container'>
                    <h1 className='text-center'>Sign in to Kouture Konect</h1>
                    <button className='login-google mt-3'>
                        <img src={GoogleIcon}/>
                        <span className='subtitle'>Sign in with Google</span>
                    </button>
                    <hr className='mb-0 mt-5'/>
                    <p className='login-with-email'>or sign in with email</p>
                    <Form className='mt-4'>
                        <Form.Group className='mb-3' controlId='formBasicEmail'>
                            <Form.Label>Email Address</Form.Label>
                            <FormControl type='email' className='mr-sm-2' />
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='formBasicPassword'>
                            <Form.Label>Password</Form.Label>
                            <FormControl type='password' className='mr-sm-2' />
                        </Form.Group>
                        <a className='forgot-password text-dgrey fs-16'>Forgot Password</a>
                        <Button className='w-100 mt-4' variant='primary' type='submit'>Sign in</Button>
                        <p className='mb-0 mt-3 text-center fs-16 text-dgrey'>Don't have an account? <a className='sign-up' href='/sign-up'>Sign Up</a></p>
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