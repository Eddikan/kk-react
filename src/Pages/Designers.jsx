import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Layout from 'Components/Layout/Layout';
import GoBack from 'Components/Shared/GoBack';
import DesignersGrid from 'Components/Grids/Designers';

const Designers = (props) => {
    return (
        <Layout>
            <section className='py-5 px-2'>
                <Container>
                    <Row className='mb-3'>
                        <Col lg="8" className=''>
                            <h2 className='fs-40'>Designers</h2>
                        </Col>
                        <Col lg="4" className='text-right'>
                            <GoBack fallBack="/" />
                        </Col>
                    </Row>
                    <div id="profile-designers">
                        <DesignersGrid />
                    </div>
                </Container>
            </section>
        </Layout>
    );
};

export default Designers;