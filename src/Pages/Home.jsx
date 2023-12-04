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
              <h1 className="text-white mb-3">Fashion Redefined <br/>Your Unique Look Starts Here</h1>
              <p className='subtitle text-white'>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.</p>
            </Col>
          </Row>
          <div className='narrow-510 mt-4'>
            <Button className='btn-outline me-3 text-white border-white border-black-hover' variant='secondary'>Find Tailors</Button>
            <Button className='btn-primary text-black bg-white border-white' variant='primary'>Find Fashion Designers</Button>
          </div>
        </Container>
      </section>
      
    </Layout>
  );
};

export default Home;