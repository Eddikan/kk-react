import React, { useEffect, useState } from 'react';
import Layout from '../Components/Layout/Layout';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import '../Assets/styles/SignUp/style.css';
import GoogleIcon from '../Assets/images/google-icon.png';

const SignUp = () => {
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
                    <Form className='mt-4'>
                        <Form.Group className='mb-3' controlId='formBasicEmail'>
                            <Form.Label>Email Address</Form.Label>
                            <FormControl type='email' className='mr-sm-2' />
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='formBasicPassword'>
                            <Form.Label>Password</Form.Label>
                            <FormControl type='password' className='mr-sm-2' />
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='formBasicPassword'>
                            <Form.Label>Confirm Password</Form.Label>
                            <FormControl type='password' className='mr-sm-2' />
                        </Form.Group>
                        <Button href='/email-confirmation' className='w-100 mt-4' variant='primary' type='submit'>Register</Button>
                        <p className='mb-0 mt-3 text-center fs-16 text-dgrey'>Already have an account? <a className='login' href='/login'>Log In</a></p>
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