import React, { useEffect, useState } from 'react';
import Layout from '../Components/Layout/Layout';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import '../Assets/styles/Home/style.css'

const Home = () => {
  return (
    <Layout>
      <section id='home' className='py-5 px-2 d-flex align-items-center mh650'>
        <Container className='text-center'>
          <Row>
            <Col lg='12'>
              <h1>Fashion Redefined <br/>Your Unique Look Starts Here</h1>
              <p className='subtitle'>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.</p>
            </Col>
          </Row>
          <Row className='narrow mt-4'>
            <Col lg='6'>
              <Button className='btn-outline' variant='secondary'>Start Selling</Button>
            </Col>
            <Col lg='6'>
              <Button className='btn-primary' variant='primary'>Find Designs</Button>
            </Col>
          </Row>
        </Container>
      </section>
      
    </Layout>
  );
};

export default Home;