import React, { useEffect, useState } from 'react';
import Layout from '../Components/Layout/Layout';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import Logo from '../Assets/images/kouture-konect-logo.png';
import '../Assets/styles/EmailConfirmation/style.css'


const EmailConfirmation = () => {
  return (
    <Layout>
      <section id='email-confirmation' className='d-flex justify-content-center flex-column py-5 px-2 vh-100'>
        <Container className='text-center'>
          <Row>
            <Col lg='12'>
              <img src={Logo}/>  
            </Col>
          </Row>
          <Row className='narrow-600 p-5  mt-5 text-dgrey'>
            <Col lg='12'>
              <h1 className='pb-2'>Email Confirmation</h1>
              <p className='subtitle'>Thank you for signing up for Kouture Konect. Before we get started, we'll need to verify your email.</p>
              <Button href='/questionnaire' className='btn-primary fs-16' variant='primary'>Verify Email</Button>
            </Col>
          </Row>
        </Container>
      </section>
      
    </Layout>
  );
};

export default EmailConfirmation;