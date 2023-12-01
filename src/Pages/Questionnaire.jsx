import React, { useEffect, useState } from 'react';
import Layout from '../Components/Layout/Layout';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import Logo from '../Assets/images/kouture-konect-logo.png';
import '../Assets/styles/Questionnaire/style.css'


const Questionnaire = () => {
  return (
    <Layout>
      <section id='questionnaire' className='d-flex justify-content-center flex-column py-5 px-2 vh-100'>
        <Container className='text-center'>
          <Row>
            <Col lg='12'>
              <img src={Logo}/>  
            </Col>
          </Row>
        </Container>
        <Container className='q1 narrow-600 py-5 px-3 mt-5 text-dgrey'>
          <Row>
            <Col lg='12' className='text-center'>
              <h2 className='form-title pb-2'>Are you looking to shop for ready-to-wear, couture, or fabrics?</h2>
            </Col>
          </Row>
          <Row className='narrow-400 mt-3'>
            <Col lg='6' className='text-right'>
              <Button className='btn-outline'>No</Button>
            </Col>
            <Col lg='6' className='text-left'>
              <Button className='btn-primary'>Yes</Button>
            </Col>
          </Row>
        </Container>
        <Container className='hide q2 q1-no narrow-600 py-5 px-3 mt-5 text-dgrey'>
          <Row>
            <Col lg='12' className='text-center'>
              <h2 className='form-title pb-2'>Are you a fashion designer?</h2>
            </Col>
          </Row>
          <Row className='narrow-400 mt-3'>
            <Col lg='6' className='text-right'>
              <Button className='btn-outline'>No</Button>
            </Col>
            <Col lg='6' className='text-left'>
              <Button className='btn-primary'>Yes</Button>
            </Col>
          </Row>
        </Container>
        <Container className='hide q3 q2-no narrow-600 py-5 px-3 mt-5 text-dgrey'>
          <Row>
            <Col lg='12' className='text-center'>
              <h2 className='form-title pb-2'>Do you sell fabrics?</h2>
            </Col>
          </Row>
          <Row className='narrow-400 mt-3'>
            <Col lg='6' className='text-right'>
              <Button className='btn-outline'>No</Button>
            </Col>
            <Col lg='6' className='text-left'>
              <Button className='btn-primary'>Yes</Button>
            </Col>
          </Row>
        </Container>
      </section>
      
    </Layout>
  );
};

export default Questionnaire;