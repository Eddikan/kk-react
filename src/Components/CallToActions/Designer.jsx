import React, { } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';

const BecomeDesigner = () => {

    return (
        <>
            <Card className='w-100 cta-card-color-gold'>
                <Card.Body>
                    <Row>
                        <Col lg="8">
                            <span className='fs-18 fw-600'>Are you a designer?</span>
                            <br />
                            <span className='fs-14'>Set up your designer profile and add your portfolio.</span>
                        </Col>
                        <Col lg="4" className='text-end'>
                            <Button variant='primary' >PROCEED</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </>
    );
};

export default BecomeDesigner;