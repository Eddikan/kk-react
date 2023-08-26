import React, { useEffect, useState } from 'react';
import Layout from '../Components/Layout/Layout';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import '../Assets/styles/Home/style.css'

const VictorHero = () => {
  return (
    <Layout>
      <Container id="your-container-id" class="your-container-class">
        <Row>
          <Col md="12">
            <h1>Victor Hero Section</h1>
            <Button className="me-2" variant="primary">Primary</Button>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default VictorHero;