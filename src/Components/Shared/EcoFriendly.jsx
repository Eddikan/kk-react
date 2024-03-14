import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import DesignerPlaceholder from 'Assets/images/designer-placeholder.jpg';
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';
import UnknownPlaceholder from 'Assets/images/placeholders/unknown-placeholder-1.png';
import toast from 'react-hot-toast';
import Ecofriendly from 'Assets/images/echo-friendly-bg.png'
import GetDesignersData from 'Utils/GetDesignersData';
import { Modal } from 'react-bootstrap';
import { BsThreeDots } from "react-icons/bs";
import { GoAlertFill } from 'react-icons/go';
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
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState();


    function toggleUnderConstruction(message) {
        // message.preventDefault();
        setUnderConstructionShow(!underConstructionShow);
        setModalHeading(message);
        console.log("Message", message);
    }

    const showSignupModal = (e) => {
        props.onSignup(e);
    }

    return (
        <>
            <section style={{ backgroundImage: `url(${Ecofriendly})`, height: `350px` }}>
                <Container>
                    <Row>
                        <Col className='eco-col'>
                            <div className='text-center text-white mb-3 fs-40 rufina-family'>Embrace Eco-Friendly Fabrics!</div>

                            <div className='text-center text-white'>Elevate your fashion with fabrics that care for both you and the Earth. Embrace eco-friendly fashion today!</div>
                            <Link to="/eco-friendly">
                                <Button className="btn-explore-now fs-15 explore-now" variant="primary">Explore Now</Button>
                            </Link>
                            {/* <a className='btn-explore-now fs-15 explore-now' onClick={() => toggleUnderConstruction("Eco-Friendly Fabrics!")}>Explore Now</a> */}
                        </Col>
                    </Row>
                </Container>
            </section>

            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button type='button' className='close react-modal-close' onClick={() => toggleUnderConstruction("")} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='fs-25 fw-600 mb-3'>{modalHeading}</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                            {/* <DateTimePicker onTimeChange={handleTimeChange} onDone={handleDoneTimeChange} availability={currentAvailability} /> */}
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        </>

    );
};

export default EcoFriendly;