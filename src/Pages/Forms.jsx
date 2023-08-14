import React from 'react';
import Layout from '../Components/Layout/Layout';
import Contact from "../Components/Pages/Forms/Contact";
import MultiFields from "../Components/Pages/Forms/MultiFields";
import { Container, Row, Col } from 'react-bootstrap';

const Forms = () => {
  return (
    <Layout>
      <Container>
        <h1>Forms</h1>
        <Row>
          <Col lg='6'>
            <Contact/>
          </Col>
          <Col lg='6'>
            <MultiFields/>
          </Col>
          <Col lg='6'></Col>
          <Col lg='6'></Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Forms;