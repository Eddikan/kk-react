import React, { useEffect, useState } from 'react';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card, CardBody } from 'react-bootstrap';
import '../Assets/styles/DesignerCalendar/style.css'
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
import { CiCreditCard2 } from "react-icons/ci";
import '../Assets/styles/Cart/style.css';
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate, useParams, Link } from 'react-router-dom';
import User from '../Assets/images/user.png';
import { GoHeart, GoAlertFill, GoShareAndroid } from 'react-icons/go';
import { CiSearch, CiBookmark, CiSettings } from 'react-icons/ci';
import axios from "axios";
import toast from 'react-hot-toast';

const initialCheckOut = {
    card_name: '',
    card_number: '',
    date: ''
};

const ToastCss = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

const Messages = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const userDetails = cookies.userDetails;
    const { designerId } = useParams();
    const [reloadCount, setReloadCount] = useState(0);
    const [formStatus, setFormStatus] = useState('standby');
    const [radioButtonValue, setRadioButtonValue] = useState(0);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [checkOutFormData, setCheckOutFormData] = useState(initialCheckOut);

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    const getAddCarts = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + '/#');
    };

    const postCheckOut = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + '/#', data);
    };

    const handleChangePaymentInfo = (e) => {
        const { name, value } = e.target;
        setCheckOutFormData({
            ...checkOutFormData,
            [name]: value,
        });
    }

    useEffect(() => {
        document.body.classList.add('designer-calendar-body');
    }, []);

    const addBusinessHoursSubmitPost = (e) => {
        // e.preventDefault();
        setFormStatus('loading');
        postCheckOut(checkOutFormData).then(response => {
            const status = response.data.status;
            if (status === "Success") {
                setFormStatus('standby');
                setReloadCount(reloadCount + 1);
                setCheckOutFormData(initialCheckOut);
                toast.success('Availability added successfully!');
            } else {
                setFormStatus('standby');
                toast.error('There has been an error saving the appointment, please try again!');
            }
        }).catch(() => {
            toast.error('There has been an error saving the appointment, please try again!');
        });
    }


    useEffect(() => {
        // getAddCarts()
        //     .then((response) => {
        //         const selectedOrders = response.data.data;
        //         if (selectedOrders) {
        //             setOrders(selectedOrders);
        //         } else {
        //             toast.error('There has been an error getting the date, please try again!');
        //         }
        //     })
        //     .catch((error) => {
        //         toast.error('There has been an error getting the date, please try again!');
        //     });
    }, [reloadCount]);

    return (
        <LayoutNoFooter>
            <section>
                <Container>
                    <Row>
                        <Col lg={12} className="designer-calendar-container">
                            <Row className="pb-4">
                                <Col md={6} className='d-flex justify-content-left align-items-center'>
                                    <h3 className="fs-30 fw-600 text-black mb-0">Messages</h3>
                                </Col>
                                <Col md={6} className="text-right">
                                    <GoBack fallBack="/#" />
                                </Col>
                            </Row>
                        </Col>
                        <hr />
                    </Row>

                    <Row>
                        <Col lg={12}>
                            <Card>
                                <Card.Body>
                                    <Row>
                                        <Col lg={5}>
                                            <Col lg={12}>
                                                <div
                                                    className=' w-100'
                                                    style={{ position: 'relative' }}
                                                >

                                                    <input
                                                        className='search-bar form-control'
                                                        type="text"
                                                        placeholder="Search"
                                                    />

                                                    <CiSearch size="20px"
                                                        style={{
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '92%',
                                                            transform: 'translateY(-50%)',
                                                        }}
                                                    />
                                                </div>
                                            </Col>

                                            <Col lg={12} className='mt-3'>
                                                <div className='d-flex'>
                                                    <div className='d-flex justify-content-center align-items-center'>
                                                        <img src={User} className='user-placeholder-header' />
                                                    </div>
                                                    <div className='ms-3 fs-14 body-text-bell'>Marie Salazar<span className='hours-bell mt-1'>1 day ago - 3:25 PM</span>
                                                        <div className='mt-1'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Col>

                                        <Col lg={7}>
                                            ewqeqw
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
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
                    <button type='button' className='close react-modal-close' onClick={() => setUnderConstructionShow(false)} data-dismiss='modal' aria-label='Close'>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <h4 className='fs-25 fw-600 mb-3'>{modalHeading}</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>

        </LayoutNoFooter >
    );
};

export default Messages;