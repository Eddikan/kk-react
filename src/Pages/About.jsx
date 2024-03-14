import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Card, CardBody } from 'reactstrap';
import 'Assets/styles/About/style.css';
import GoBack from 'Components/Shared/GoBack';
import Professionalism from 'Assets/images/boy-icon.png';
import Integrity from 'Assets/images/integrity.png';
import Speed from 'Assets/images/response.png';
import Reliability from 'Assets/images/reliability.png';
import Excellence from 'Assets/images/excellence.png';
import SuperiorQuality from 'Assets/images/high-standard.png';
import CustomerExperience from 'Assets/images/customer-experience.png';



const About = () => {
  return (
    <Layout>
      <section className='go-back-section'>
        <Container>
          <Row>
            <Col className='text-right'>
              <GoBack fallBack="/" />
            </Col>
          </Row>
        </Container>
      </section>
      <section className='height-section'>
        <Container id="about-kouture" className="your-container-class">
          <Row>
            <Col md="12" className='d-flex justify-content-center align-items-center flex-column about-kouture-col '>
              <h1 className='about-title mb-4 text-center'>About Kouture Konnect</h1>
              <p className='mb-0 text-center about-kouture text-black'>Kouture Konect is a groundbreaking platform that redefines the fashion industry by
                seamlessly connecting fashion enthusiasts with talented designers. Our mission is
                to make every client's fashion dreams a reality, especially for those seeking access
                to top-tier, custom-made attire. Simultaneously, we empower designers, in Africa,
                Europe, Asia, North America, to showcase their exceptional craftsmanship on a
                global stage.</p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className='section2'>
        <Container id="mission-vision" className="your-container-class">
          <Row>
            <Col lg="4" className='problem-col'>
              <Card className='h-100 border-none'>
                <CardBody className='problem-card-body'>
                  <div className='rufina-family fs-40 mb-3 text-black the-problem'>The Problem We Are Solving</div>
                  <p className='mb-0 body-height  text-black content-center'>Kouture Konect addresses the challenges faced by those seeking access to top-tier
                    fashion designers and the struggles encountered by designers aiming to showcase
                    their craftsmanship globally. We bridge these gaps by providing a platform that
                    empowers a global community of fashion enthusiasts and creators, fostering
                    connections, creativity, and collaboration.</p>

                  {/* <p className='body-height  proximanova-family'>Feel free to explore our platform and join us in redefining the future of personalized,
                    global fashion.</p> */}
                </CardBody>
              </Card>
            </Col>

            <Col lg="4" className='mission-col'>
              <Card className='black-card h-100 '>
                <CardBody className='mission-cb'>
                  <div className='rufina-family fs-40 mb-3 text-white mission'>Mission</div>
                  <p className='mb-0 body-height  text-white content-center'>At Kouture Konect, our mission is to bridge the gap between fashion enthusiasts and
                    gifted designers worldwide. We strive to empower a global community of fashion
                    lovers and creators by facilitating seamless connections, fostering creativity, and
                    transforming sartorial dreams into reality.</p>
                </CardBody>
              </Card>
            </Col>

            <Col lg="4" className='vision-col'>
              <Card className='black-card h-100'>
                <CardBody className='vision-cb'>
                  <div className='rufina-family fs-40 mb-3 text-white vision'>Vision</div>
                  <p className='mb-0 body-height  text-white content-center'>We envision a future where personalized, global fashion collaboration is the norm.
                    Kouture Konect aspires to be the leading platform that transcends geographical
                    boundaries, providing a curated selection of pre-qualified designers and empowering
                    clients to choose their creative partners from around the world.</p>
                </CardBody>
              </Card>
            </Col>
          </Row>

        </Container>
      </section>


      <section className='section3'>
        <Container id="core-values-container" className="your-container-class">
          <div className='core-values text-center rufina-family fs-40 text-black mb-4'>Core Values</div>
          <Row>
            <Col lg="3" className='mb-4 card-left-right'>
              <Card className='box-height border-color'>
                <CardBody>
                  <div className='mb-2'>
                    <img src={Professionalism} className='core-values-icon' />
                  </div>

                  <div className='rufina-family fw-600 fs-25 mb-2 professionalism height-seven-card'>Professionalism</div>

                  <p className='mb-0 fs-16 body-height  content-card'>Upholding high standards in all interactions.</p>
                </CardBody>
              </Card>
            </Col>

            <Col lg="3" className='mb-4 card-left-right'>
              <Card className='box-height border-color'>
                <CardBody>
                  <div className='mb-2'>
                    <img src={Integrity} className='core-values-icon' />
                  </div>

                  <div className='rufina-family fw-600 fs-25 mb-2 integrity height-seven-card'>Integrity</div>

                  <p className='mb-0 fs-16 body-height  content-card'>Operating with honesty and transparency.</p>
                </CardBody>
              </Card>
            </Col>

            <Col lg="3" className='mb-4 card-left-right'>
              <Card className='box-height border-color'>
                <CardBody>
                  <div className='mb-2'>
                    <img src={Speed} className='core-values-icon' />
                  </div>

                  <div className='rufina-family fw-600 fs-25 mb-2 speed height-seven-card'>Speed</div>

                  <p className='mb-0 fs-16 body-height  content-card'>Ensuring timely responses and delivery.</p>
                </CardBody>
              </Card>
            </Col>

            <Col lg="3" className='mb-4 card-left-right'>
              <Card className='box-height border-color'>
                <CardBody>
                  <div className='mb-2'>
                    <img src={Reliability} className='core-values-icon' />
                  </div>

                  <div className='rufina-family fw-600 fs-25 mb-2 reliability height-seven-card'>Reliability</div>

                  <p className='mb-0 fs-16 body-height  content-card'>Consistency in meeting commitments.</p>
                </CardBody>
              </Card>
            </Col>

            <Col lg="3" className='mb-4 card-left-right'>
              <Card className='box-height border-color'>
                <CardBody>
                  <div className='mb-2'>
                    <img src={Excellence} className='core-values-icon' />
                  </div>

                  <div className='rufina-family fw-600 fs-25 mb-2 excellence height-seven-card'>Excellence</div>

                  <p className='mb-0 fs-16 body-height  content-card'>Striving for top-quality, custom-made designs.</p>
                </CardBody>
              </Card>
            </Col>

            <Col lg="3" className='mb-4 card-left-right'>
              <Card className='box-height border-color'>
                <CardBody>
                  <div className='mb-2'>
                    <img src={SuperiorQuality} className='core-values-icon' />
                  </div>

                  <div className='rufina-family fw-600 fs-25 mb-2 superior height-seven-card'>Superior Quality</div>

                  <p className='mb-0 fs-16 body-height  content-card'>Commitment to the highest standards.</p>
                </CardBody>
              </Card>
            </Col>

            <Col lg="3" className='card-left-right'>
              <Card className='box-height border-color'>
                <CardBody>
                  <div className='mb-2'>
                    <img src={CustomerExperience} className='core-values-icon' />
                  </div>
                  <div className='rufina-family fw-600 fs-25 mb-2 exceptional height-seven-card'>Exceptional Customer Experience</div>
                  <p className='mb-0 fs-16 body-height  content-card'>Going the extra mile for satisfaction.</p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>



    </Layout >
  );
};

export default About;