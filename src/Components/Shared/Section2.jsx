import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button }  from 'react-bootstrap';

const Section2 = () => {
  return (
    
      <section id="section2-home">
        <Container id="your-container-id" className="your-container-class">
          <Row>
            <Col md="12">
              <h2>Home Section 2</h2>
              <Button className="me-2" variant="primary">Primary</Button>
            </Col>
          </Row>
        </Container>
      </section>
   
  );
};

export default Section2;