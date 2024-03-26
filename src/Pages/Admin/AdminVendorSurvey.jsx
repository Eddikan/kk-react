import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Modal, Card } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { GoAlertFill } from 'react-icons/go';
import { MdOutlineEmail } from "react-icons/md";
import { IoCloseOutline, IoEye } from 'react-icons/io5';
import AdminSidebar from 'Components/Shared/AdminSidebar';
import Pagination from 'Components/Pagination/Pagination';
import LayoutAdmin from 'Components/Layout/LayoutAdmin';
import LoadingPage from 'Components/Shared/LoadingPage';
import UserPlaceholder from 'Assets/images/user.png';
import GoBack from 'Components/Shared/GoBack';
import toast from 'react-hot-toast';
import axios from "axios";


const AdminVendorSurvey = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const [reloadCount, setReloadCount] = useState(0);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [vendorFeedBacks, setVendorFeedBacks] = useState([]);
    const [vendorFeedBackLoading, setVendorFeedBackLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(1);

    let PageSize = 10;

    const getVendorSurvey = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'vendor-feedback-survey');
    };

    const handleChangePage = (pageNumber) => {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'vendor-feedback-survey?page=' + pageNumber + '&user_id=' + currentUser)
            .then((response) => {
                const data = response.data;
                setCurrentPage(pageNumber);
                const selectedVendorSurvey = response.data.data;
                if (selectedVendorSurvey) {
                    setVendorFeedBacks(selectedVendorSurvey);
                    setCurrentPage(() => data.meta.current_page);
                    setPageCount(() => data.meta.total);
                    setPageSize(() => data.meta.per_page);
                    setVendorFeedBackLoading(false);
                } else {
                    setVendorFeedBackLoading(false);
                    toast.error('There has been an error getting the surveys, please try again!');
                }
            }).catch(error => {
                setVendorFeedBackLoading(false);
                toast.error('There has been an error getting the surveys, please try again!');
            });
    };

    useEffect(() => {
        if (currentUser) {
            getVendorSurvey()
                .then((response) => {
                    setVendorFeedBackLoading(false);
                    const selectedVendorSurvey = response.data.data;
                    if (selectedVendorSurvey) {
                        setVendorFeedBacks(selectedVendorSurvey);
                        setPageCount(() => response.data.meta.total);
                    } else {
                        toast.error('There has been an error getting the surveys, please try again!');
                        setVendorFeedBackLoading(false);
                    }
                })
                .catch((error) => {
                    toast.error('There has been an error getting the surveys, please try again!');
                    setVendorFeedBackLoading(false);
                });
        }
    },
        [reloadCount]);

    return (
        <LayoutAdmin>
            {vendorFeedBackLoading ?
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
                                                    <h3 className="fs-30 fw-600 text-black mb-0">Vendor FeedBack Survey</h3>
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
                                            {vendorFeedBacks ?
                                                <>
                                                    {vendorFeedBacks.length > 0 ?
                                                        <>
                                                            {vendorFeedBacks.map((vendorFeedBack) => {

                                                                const options = {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                };
                                                                const today = (new Date(vendorFeedBack.created_at)).toLocaleDateString('en-ES', options);

                                                                return (
                                                                    <Col lg={12}>
                                                                        <Card className='mt-3'>
                                                                            <Card.Body >
                                                                                <Row className="align-items-center">
                                                                                    <Col lg={4}>
                                                                                        <Link to={`/admin/profile/user/${vendorFeedBack.user.id}`} className='text-decoration-none'>
                                                                                            <div className='d-flex survey-user-image'>
                                                                                                {vendorFeedBack.user?.image != '' && vendorFeedBack.user?.image != null ? (
                                                                                                    <div
                                                                                                        className='user-photo-survey'
                                                                                                        style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${vendorFeedBack.user?.image})` }}
                                                                                                    >
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <img src={UserPlaceholder} className='placeholder-img-survey' alt="User Placeholder" />
                                                                                                )}

                                                                                                <div>
                                                                                                    <span className='ms-3 mt-0 mb-1 fs-18 text-black fw-500'>
                                                                                                        {vendorFeedBack.user?.first_name}
                                                                                                        &nbsp;
                                                                                                        {vendorFeedBack.user?.last_name}
                                                                                                    </span>
                                                                                                    <div className='ms-3 mt-1 fs-16 text-black'>
                                                                                                        <span className='me-1'>
                                                                                                            <MdOutlineEmail className="me-2 text-gold" size={18} />
                                                                                                            {vendorFeedBack.user?.email}
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </Link>
                                                                                    </Col>

                                                                                    <Col lg={4}>
                                                                                        <span className='text-black'>{today}</span>
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>{vendorFeedBack.status}</span>
                                                                                    </Col>

                                                                                    <Col lg={2} className='d-flex justify-content-end'>
                                                                                        <Link to={`/admin/view/vendor-feedback-survey/${vendorFeedBack.id}`} className="text-decoration-none">
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

                                    <Pagination
                                        className="mt-4 mb-0"
                                        currentPage={currentPage}
                                        totalCount={pageCount}
                                        pageSize={PageSize}
                                        onPageChange={page => handleChangePage(page)}
                                    />

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

export default AdminVendorSurvey;