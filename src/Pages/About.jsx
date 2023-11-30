import React, { useEffect, useState } from 'react';
import Layout from '../Components/Layout/Layout';
import Section2 from '../Components/Shared/Section2';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import '../Assets/styles/Home/style.css'

const About = () => {
  return (
    <Layout>
      <section>
        <Container id="your-container-id" className="your-container-class">
            <Row>
            <Col md="12">
                <h1>About</h1>
                <Button className="me-2" variant="primary">Primary</Button>
            </Col>
            </Row>
        </Container>
      </section>
      <Section2/>
    </Layout>
  );
};

export default About;