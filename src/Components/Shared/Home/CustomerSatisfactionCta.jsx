import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import DesignerPlaceholder from 'Assets/images/designer-placeholder.jpg';
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';
import UnknownPlaceholder from 'Assets/images/placeholders/unknown-placeholder-1.png';
import toast from 'react-hot-toast';
import CustomerSatisfactionCtaBg from 'Assets/images/customer-satisfaction-cta-bg.png'
import GetDesignersData from 'Utils/GetDesignersData';
import { Modal } from 'react-bootstrap';
import { BsThreeDots } from "react-icons/bs";
import { GoAlertFill } from 'react-icons/go';
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";
import { IoDocumentOutline } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa6";

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const CustomerSatisfactionCta = (props) => {
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
            {/* <div style={{ backgroundImage: `url(${CustomerSatisfactionCtaBg})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} className="py-5 text-center"> */}
            <div className="text-center mb-5">
                <Container>
                    <Row>
                        <Col lg="12" className="text-center">
                            <div className='text-center mb-3'>
                                <h2 className="customer-satisfaction-title fs-40 mb-30">Help Us Improve – Share Your Experience!</h2>
                                <p className="customer-satisfaction-p text-center">Your experience means the world to us, and we're always looking to improve. Take a few moments</p>
                                <p className="customer-satisfaction-p text-center">to share your thoughts in our Customer Satisfaction Survey.</p>
                                <p className="customer-satisfaction-p text-center">Your insights not only help us serve you better but also shape the future of our offerings.</p>
                                <p className="customer-satisfaction-p text-center">Click below to make your voice heard.</p>
                                <p className="customer-satisfaction-p text-center my-4 fw-600">Thank you for helping us enhance your experience!</p>
                            </div>
                            <Link to="/customer-satisfaction-survey">
                                <Button className="btn-start-survey fs-15 mt-2">Start Survey <FaArrowRight style={{ color: 'white'}}/></Button>
                            </Link>
                        </Col>
                    </Row>
                </Container>
            </div>

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

export default CustomerSatisfactionCta;