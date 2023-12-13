import React, { useEffect, useState } from 'react';
import Layout from '../Components/Layout/Layout';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import Designers from 'Components/Shared/Designers';
import '../Assets/styles/Home/style.css'
import Designs from 'Components/Shared/Designs';
import HomeVideo from 'Assets/videos/kouture-homepage-video.mp4'
import ShopByCategory from 'Components/Shared/ShopByCategory';

const Home = () => {
  return (
    <Layout>
      <section id='home' className='py-5 px-2 d-flex align-items-center mh650'>
        <video id="home-video" autoPlay muted loop>
          <source src={HomeVideo} type="video/mp4" />
          {/* Add additional source elements for other formats if needed */}
          Your browser does not support the video tag.
        </video>
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
      <section id="designers" className="pt-5 pb-3">
        <Container>
          <Row>
            <Col lg="12">
              <Designers />
            </Col>
          </Row>
        </Container>
      </section>
      <section id="designs" className="pt-5">
        <Container>
          <Row>
            <Col lg="12">
              <ShopByCategory />
            </Col>
          </Row>
        </Container>
      </section>
      <section id="designs" className="py-5">
        <Container>
          <Row>
            <Col lg="12">
              <Designs />
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
};

export default Home;