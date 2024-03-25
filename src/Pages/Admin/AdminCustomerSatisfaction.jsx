import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Modal, Card, ModalFooter, ModalHeader } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { GoAlertFill } from 'react-icons/go';
import { BiSolidPencil } from 'react-icons/bi';
import { MdOutlineEmail } from "react-icons/md";
import { IoCloseOutline, IoEye } from 'react-icons/io5';
import AdminSidebar from 'Components/Shared/AdminSidebar';
import LayoutAdmin from 'Components/Layout/LayoutAdmin';
import LoadingPage from 'Components/Shared/LoadingPage';
import UserPlaceholder from 'Assets/images/user.png';
import 'Assets/styles/AdminGeneralSurvey/style.css';
import GoBack from 'Components/Shared/GoBack';
import toast from 'react-hot-toast';
import axios from "axios";


const AdminCustomerSatisfaction = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const userDetails = cookies.userDetails;
    const [reloadCount, setReloadCount] = useState(0);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [customerSurveys, setCustomerSurveys] = useState([]);
    const [customerSurveysLoading, setCustomerSurveysLoading] = useState(true);

    const getCustomerSurvey = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'customer-satisfaction-survey');
    };

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    };

    useEffect(() => {
        if (currentUser) {
            getCustomerSurvey()
                .then((response) => {
                    setCustomerSurveysLoading(false);
                    const selectedCustomerSurvey = response.data.data;
                    if (selectedCustomerSurvey) {
                        setCustomerSurveys(selectedCustomerSurvey);
                    } else {
                        toast.error('There has been an error getting the surveys, please try again!');
                        setCustomerSurveysLoading(false);
                    }
                })
                .catch((error) => {
                    toast.error('There has been an error getting the surveys, please try again!');
                    setCustomerSurveysLoading(false);
                });
        }
    },
        [reloadCount]);


    return (
        <LayoutAdmin>
            {customerSurveysLoading ?
                <LoadingPage />
                :
                <>
                    <section className='bg-survey'>
                        <Container fluid>
                            <Row>
                                <Col lg={2} className='p-0'>
                                    <AdminSidebar />
                                </Col>

                                <Col lg={10} className='py-5 mx-auto max-width-column padding-right-admin'>
                                    <Row>
                                        <Col lg={12}>
                                            <Row className="pb-4">
                                                <Col md={6} className='d-flex justify-content-left align-items-center'>
                                                    <h3 className="fs-30 fw-600 text-black mb-0">Customer Satisfaction Survey</h3>
                                                </Col>
                                                <Col md={6} className="text-right">
                                                    <GoBack fallBack="/#" />
                                                </Col>
                                            </Row>
                                        </Col>

                                        <Col lg={12}>
                                            <Card>
                                                <Card.Body className='bg-light'>
                                                    <Row>
                                                        <Col lg={4}>
                                                            <span className='fw-500'>Name</span>
                                                        </Col>

                                                        <Col lg={4}>
                                                            <span className='fw-500'>Created Date</span>
                                                        </Col>

                                                        <Col lg={2}>
                                                            <span className='fw-500'>Status</span>
                                                        </Col>

                                                        <Col lg={2} className='text-right'>
                                                            <span className='fw-500'>Action</span>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <>
                                            {customerSurveys ?
                                                <>
                                                    {customerSurveys.length > 0 ?
                                                        <>
                                                            {customerSurveys.map((customerSurvey) => {

                                                                const options = {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                };
                                                                const today = (new Date(customerSurvey.created_at)).toLocaleDateString('en-ES', options);

                                                                return (
                                                                    <Col lg={12}>
                                                                        <Card className='mt-3'>
                                                                            <Card.Body >
                                                                                <Row className="align-items-center">
                                                                                    <Col lg={4}>
                                                                                        <div className='d-flex survey-user-image'>
                                                                                            {customerSurvey.user?.image != '' && customerSurvey.user?.image != null ? (
                                                                                                <div
                                                                                                    className='user-photo-survey'
                                                                                                    style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${customerSurvey.user?.image})` }}
                                                                                                >
                                                                                                </div>
                                                                                            ) : (
                                                                                                <img src={UserPlaceholder} className='placeholder-img' alt="User Placeholder" />
                                                                                            )}

                                                                                            <div>
                                                                                                <span className='ms-3 mt-0 mb-1 fs-18 text-black fw-500'>
                                                                                                    {customerSurvey.user?.first_name}
                                                                                                    &nbsp;
                                                                                                    {customerSurvey.user?.last_name}
                                                                                                </span>
                                                                                                <div className='ms-3 mt-1 fs-16 text-black'>
                                                                                                    <span className='me-1'>
                                                                                                        <MdOutlineEmail className="me-2 text-gold" size={18} />
                                                                                                        {customerSurvey.user?.email}
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </Col>

                                                                                    <Col lg={4}>
                                                                                        <span className='text-black'>{today}</span>
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>{customerSurvey.status}</span>
                                                                                    </Col>

                                                                                    <Col lg={2} className='d-flex justify-content-end'>
                                                                                        <Link to={`/admin/view/customer-satisfaction-survey/${customerSurvey.id}`} className="text-decoration-none">
                                                                                            <div className="survey-tooltip cursor-pointer">
                                                                                                <span className="icon-tooltiptext fs-14">View</span>
                                                                                                <IoEye className='me-3' color='#000000' size={20} />
                                                                                            </div>
                                                                                        </Link>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    </Col>
                                                                );
                                                            })}
                                                        </>
                                                        :
                                                        <>
                                                            <Col lg={12}>
                                                                <Card className='mt-3'>
                                                                    <Card.Body>
                                                                        <p className="text-center mb-0">No records found.</p>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        </>
                                                    }
                                                </>
                                                :
                                                <>
                                                    <Col lg={12}>
                                                        <Card className='mt-3'>
                                                            <Card.Body>
                                                                <p className="text-center mb-0">No records found.</p>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                </>
                                            }
                                        </>
                                    </Row>
                                </Col>
                            </Row>
                        </Container>
                    </section>
                </>
            }

            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={() => setUnderConstructionShow(false)}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-1' />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='fs-22 rufina-family mb-3'>{modalHeading}</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        </LayoutAdmin >
    );
};

export default AdminCustomerSatisfaction;