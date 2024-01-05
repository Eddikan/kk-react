import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Layout from 'Components/Layout/Layout';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import toast from 'react-hot-toast';
// import getDesignersData from 'Utils/GetDesignersData';
import GetDesignersData from 'Utils/GetDesignersData';
import LoadingPage from 'Components/Shared/LoadingPage';
import GoBack from 'Components/Shared/GoBack';
import { GoHeart, GoBookmark } from "react-icons/go";
import { IoEyeOutline, IoHeartOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';
import axios from 'axios';
import DesignersGrid from 'Components/Grids/Designers';

const Designers = (props) => {
    return (
        <Layout>
            <section className='py-5 px-2'>
                <Container>
                    <Row className='mb-3'>
                        <Col lg="8" className=''>
                            <h2 className='fs-30'>Designers</h2>
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