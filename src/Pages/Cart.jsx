import React, { useEffect, useState } from 'react';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import '../Assets/styles/DesignerCalendar/style.css'
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
import { CiCreditCard2 } from "react-icons/ci";
import '../Assets/styles/Cart/style.css';
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate, useParams, Link } from 'react-router-dom';
import User from '../Assets/images/user.png';
import { GoHeart, GoAlertFill, GoShareAndroid } from 'react-icons/go';
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

const Cart = (props) => {
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
                                    <h3 className="fs-30 fw-600 text-black mb-0">Cart</h3>
                                </Col>
                                <Col md={6} className="text-right">
                                    <GoBack fallBack="/#" />
                                </Col>
                            </Row>
                        </Col>

                        <Col lg={9}>
                            <Card>
                                <Card.Body className='bg-light'>
                                    <Row>
                                        <Col lg={1}>
                                            <input
                                                type="checkbox"
                                                className="cursor-pointer check-box accented me-2 ms-3"

                                            />
                                        </Col>
                                        <Col lg={3}>
                                            Item
                                        </Col>

                                        <Col lg={2}>
                                            Price
                                        </Col>

                                        <Col lg={2}>
                                            Size
                                        </Col>

                                        <Col lg={2}>
                                            Total
                                        </Col>

                                        <Col lg={2} className='text-center'>
                                            Action
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            <Card className='mt-2'>
                                <Card.Body>
                                    <Row>
                                        <Col lg={1}>
                                            <input
                                                type="checkbox"
                                                className="cursor-pointer check-box accented me-2 ms-3"
                                            />
                                        </Col>
                                        <Col lg={3}>
                                            <div className='d-flex'>
                                                <div>image</div>
                                                <div className='ms-2'>
                                                    <div className='mb-1'>
                                                        Name
                                                    </div>

                                                    <div>
                                                        <img src={User} className='placeholder-cart' />
                                                        <span className='name-user ms-2'>David Taylor</span>
                                                    </div>

                                                </div>
                                            </div>
                                        </Col>

                                        <Col lg={2}>
                                            $9.00
                                        </Col>

                                        <Col lg={2}>
                                            12 metre
                                        </Col>

                                        <Col lg={2}>
                                            $108.00
                                        </Col>

                                        <Col lg={2}>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            <Card className='mt-2'>
                                <Card.Body className='bg-light'>
                                    <Row>
                                        <Col lg={1}>
                                        </Col>
                                        <Col lg={5}>
                                        </Col>
                                        <Col lg={2}>
                                            <span className='fs-18'>Total Amount</span>
                                        </Col>
                                        <Col>
                                            <span className='total-price fs-20 fw-600'>$120.00</span>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>


                        <Col lg={3}>
                            <Card>
                                <Card.Body>
                                    <div className='fs-22 rufina-family fw-600'>Payment Info</div>
                                    <hr className='mt-2' />
                                    <div>Payment Method</div>
                                    <div className='mt-3 d-flex'>
                                        <div className='d-flex'>
                                            <input
                                                type="radio"
                                                name="visa"
                                                onChange={(e) => { setRadioButtonValue(1); }}
                                            />
                                        </div>

                                        <div className='ms-3'>
                                            <CiCreditCard2 size={20} />
                                        </div>

                                        <div className='ms-2'>
                                            VISA
                                        </div>
                                    </div>

                                    {radioButtonValue == 1 &&
                                        <div>
                                            <hr />

                                            <div className='mb-4'>
                                                <div className='mb-2'>Card Name:</div>
                                                <input
                                                    type="text"
                                                    className='form-control'
                                                    name="card_name"
                                                    value={checkOutFormData.card_name}
                                                    onChange={handleChangePaymentInfo}
                                                />
                                            </div>
                                            <hr />

                                            <div>
                                                <div className='mb-2'>Card Number:</div>
                                                <input
                                                    type="text"
                                                    name="card_number"
                                                    className='form-control mb-2'
                                                    value={checkOutFormData.card_number}
                                                    onChange={handleChangePaymentInfo}
                                                    maxLength={15}
                                                    pattern="[0-9]*"
                                                />
                                            </div>

                                            <div className='mt-3'>
                                                <div className='mb-2'>Expiration Date:</div>
                                                <input
                                                    type="date"
                                                    className='form-control'
                                                    name="date"
                                                    value={checkOutFormData.date}
                                                    onChange={handleChangePaymentInfo}
                                                />
                                            </div>

                                        </div>
                                    }
                                    <div className='text-center mt-4' onClick={() => toggleUnderConstruction("Check Out")}>
                                        <button className='btn btn-primary w-100'>Check Out</button>
                                    </div>
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

export default Cart;