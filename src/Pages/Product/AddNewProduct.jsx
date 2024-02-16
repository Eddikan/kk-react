import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import GoBack from 'Components/Shared/GoBack';
import NewProductNormal from 'Components/Forms/Product/NewProductNormal';
import AddNewDesign from 'Components/Forms/Product/AddNewDesign';

const AddNewProduct = () => {
    const navigate = useNavigate();

    const addSuccess = (e) => {
        if (e) {
            setTimeout(function () {
                navigate("/user/profile");
            }, 1000);
        }
    };

    const reloadPage = (e) => {

    };

    const cancel = (e) => {
        navigate("/user/profile");
    };

    return (
        <Layout>
            <section id='profile' className='py-5 px-2'>
                <Container>
                    <Row>
                        <Col lg="8" className='mb-3'>
                            <h2 className='fs-30 mb-2'>Add Design</h2>
                        </Col>
                        <Col lg="4" className='mb-3 text-right'>
                            <GoBack fallBack="/user/profile" />
                        </Col>
                    </Row>
                    <NewProductNormal size="normal" withDraft={true} onSuccess={addSuccess} onReloadPage={reloadPage} onCancel={cancel} />
                </Container>
            </section>
        </Layout>
    );
};

export default AddNewProduct;