import React, { useEffect, useState } from 'react';
import Layout from '../Components/Layout/Layout';
import { Container, Row, Col, Button, Modal, Card }  from 'react-bootstrap';
import Designers from 'Components/Shared/Designers';
import '../Assets/styles/Home/style.css'
import Designs from 'Components/Shared/Designs';
import HomeVideo from 'Assets/videos/kouture-homepage-video.mp4'
import ShopByCategory from 'Components/Shared/ShopByCategory';
import { FaPenFancy } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import { GiClothes } from "react-icons/gi";

const Home = () => {
  const [fullscreen, setFullscreen] = useState(true);
  const [userModalShow, setUserModalShow] = useState(false);

  const handleShowUser = () => {
    setUserModalShow(true);
  }

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
          <div className='narrow-750 mt-4'>
            <Button className='btn-outline me-3 text-white border-white border-black-hover' variant='secondary' onClick={() => handleShowUser()}>I'm just browsing</Button>
            <Button className='btn-primary me-3 text-black bg-white border-white' variant='primary'>I'm a designer</Button>
            <Button className='btn-outline text-white border-white border-black-hover' variant='secondary'>I'm a fabric vendor</Button>
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
      <Modal show={userModalShow} fullscreen={true} onHide={() => setUserModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="narrow-850 h-100">
            <Row className=" align-items-center h-100">
              <Col lg="4">
                <Card className="cursor-pointer">
                  <Card.Body>
                    <div className="user-box text-center">
                      <FaPenFancy size="50px" className='mb-3 mt-2' />
                      <p>Designers</p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg="4">
                <Card className="cursor-pointer">
                  <Card.Body>
                    <div className="user-box text-center">
                      <GiClothes size="50px" className='mb-3 mt-2' />
                      <p>Fabrics</p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg="4">
                <Card className="cursor-pointer">
                  <Card.Body>
                    <div className="user-box text-center">
                      <IoIosColorPalette size="50px" className='mb-3 mt-2' />
                      <p>Designs</p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default Home;