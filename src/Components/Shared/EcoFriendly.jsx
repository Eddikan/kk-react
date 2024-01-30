import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import DesignerPlaceholder from 'Assets/images/designer-placeholder.jpg';
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';
import UnknownPlaceholder from 'Assets/images/placeholders/unknown-placeholder-1.png';
import toast from 'react-hot-toast';
import Ecofriendly from '../../Assets/images/echo-friendly-bg.png'
import GetDesignersData from 'Utils/GetDesignersData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";
import { IoDocumentOutline } from "react-icons/io5";

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const EcoFriendly = (props) => {
    const navigate = useNavigate();
    const reloadCount = props.reloadCount;
    const currentUser = props.currentUser;
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [designers, setDesigners] = useState([]);
    const [designersLoading, setDesignersLoading] = useState(true);


    return (
        <>
            <section style={{ backgroundImage: `url(${Ecofriendly})`, height: `300px` }}>
                <Container>
                    <Row>
                        <Col className='eco-col'>
                            <div className='text-center text-white mb-3 fs-40 rufina-family'>Embrace Eco-Friendly Fabrics!</div>

                            <div className='text-center text-white'>Elevate your fashion with fabrics that care for both you and the Earth. Embrace eco-friendly fashion today!</div>

                            <button className='btn-explore-now fs-15 explore-now'>Explore Now</button>
                        </Col>
                    </Row>


                </Container>
            </section>
        </>

    );
};

export default EcoFriendly;