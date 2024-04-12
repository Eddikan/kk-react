import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';

const BecomeSeller = () => {

    return (
        <>
            <Card className='w-100 cta-card-color'>
                <Card.Body>
                    <Row>
                        <Col lg="8">
                            <span className='fs-18 fw-600'>Are you a fabric seller?</span>
                            <br />
                            <span className='fs-14'>Set up your seller profile and add your products</span>
                        </Col>
                        <Col lg="4" className='text-end'>
                            <Button className='cta-button' href='/user/seller-form' >PROCEED</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </>
    );
};

export default BecomeSeller;