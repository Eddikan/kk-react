import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Modal, Card } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { BiSolidPencil } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { MdOutlineEmail } from "react-icons/md";
import { IoCloseOutline, IoEye } from 'react-icons/io5';
import Pagination from 'Components/Pagination/Pagination';
import AdminSidebar from 'Components/Shared/AdminSidebar';
import LayoutAdmin from 'Components/Layout/LayoutAdmin';
import LoadingPage from 'Components/Shared/LoadingPage';
import UserPlaceholder from 'Assets/images/user.png';
import GoBack from 'Components/Shared/GoBack';
import 'Assets/styles/AdminDesigners/style.css';
import toast from 'react-hot-toast';
import axios from "axios";

const AdminDesigners = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'token', 'userRole']);
    const currentUser = cookies.currentUser;
    const current_user_id = cookies.currentUser;
    const token = cookies.token;
    const userRole = cookies.userRole;
    const navigate = useNavigate();
    const [reloadCount, setReloadCount] = useState(0);
    const [designers, setDesigners] = useState([]);
    const [designersLoading, setDesignersLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [deleteConfirmShow, setDeleteConfirmShow] = useState(false);
    const [designerId, setDesignerId] = useState('');
    const [designerDeleteLoading, setDesignerDeleteLoading] = useState(false);

    let PageSize = 10;

    const getDesigners = async () => {
        return await axios.get(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'designer?current_user_id=' + current_user_id + '&token=' + token);
    };

    const toggleGetUser = (e) => {
        window.location.href = "/designer-profile?user_id=" + e;
    }

    const deleteConfirm = (e) => {
        setDeleteConfirmShow(true);
        setDesignerId(e);
    };

    const handleChangePage = (pageNumber) => {
        axios.get(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'designer?page=' + pageNumber + '&current_user_id=' + current_user_id + '&token=' + token)
            .then((response) => {
                const data = response.data;
                setCurrentPage(pageNumber);
                const selectedDesigners = response.data.data;
                if (selectedDesigners) {
                    setDesigners(selectedDesigners);
                    setCurrentPage(() => data.meta.current_page);
                    setPageCount(() => data.meta.total);
                    setPageSize(() => data.meta.per_page);
                    setDesignersLoading(false);
                } else {
                    setDesignersLoading(false);
                    toast.error('There has been an error getting the designers, please try again!');
                }
            }).catch(error => {
                setDesignersLoading(false);
                toast.error('There has been an error getting the designers, please try again!');
            });
    };

    async function designerDeleteSubmit(id) {
        setDesignerDeleteLoading(true);
        axios.delete(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'designer/' + designerId + '?current_user_id=' + current_user_id + '&token=' + token).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                toast.success('Designer deleted successfully!');
                setReloadCount((prevReloadCount) => prevReloadCount + 1);
                setDesignersLoading(false);
                setDeleteConfirmShow(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setDesignerDeleteLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setDesignerDeleteLoading(false);
        });
    };

    useEffect(() => {
        if (userRole !== 'Admin') {
            navigate('/')
        }
        getDesigners()
            .then((response) => {
                setDesignersLoading(false);
                const selectedDesigners = response.data.data;
                if (selectedDesigners) {
                    setDesigners(selectedDesigners);
                    setPageCount(() => response.data.meta.total);
                } else {
                    toast.error('There has been an error getting the designers, please try again!');
                    setDesignersLoading(false);
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the designers, please try again!');
                setDesignersLoading(false);
            });
    },
        [reloadCount]);

    return (
        <LayoutAdmin>
            {designersLoading ?
                <LoadingPage />
                :
                <>
                    <section className='bg-designers'>
                        <Container fluid>
                            <Row>
                                <Col lg={2} className='p-0'>
                                    <AdminSidebar />
                                </Col>

                                <Col lg={10} className='py-5 mx-auto padding-right-admin max-width-column'>
                                    <Row>
                                        <Col lg={12}>
                                            <Row className="pb-4">
                                                <Col md={6} className='d-flex justify-content-left align-items-center'>
                                                    <h3 className="fs-30 fw-600 text-black mb-0">Designers</h3>
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
                                                        <Col lg={3}>
                                                            <span className='fw-500'>Name</span>
                                                        </Col>

                                                        <Col lg={2}>
                                                            <span className='fw-500'>Gender</span>
                                                        </Col>

                                                        <Col lg={2}>
                                                            <span className='fw-500'>Phone Number</span>
                                                        </Col>

                                                        <Col lg={2}>
                                                            <span className='fw-500'>Country</span>
                                                        </Col>

                                                        <Col lg={1} className='text-center'>
                                                            <span className='fw-500'>Status</span>
                                                        </Col>

                                                        <Col lg={2} className='text-right'>
                                                            <span className='fw-500 me-3'>Action</span>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>

                                        <>
                                            {designers ?
                                                <>
                                                    {designers.length > 0 ?
                                                        <>
                                                            {designers.map((designer) => {
                                                                return (
                                                                    <Col lg={12}>
                                                                        <Card className='mt-3'>
                                                                            <Card.Body >
                                                                                <Row>
                                                                                    <Col lg={3} className='d-flex justify-content-left align-items-center'>
                                                                                        <Link to={`/admin/profile/user/${designer.user.id}`} className='text-decoration-none'>
                                                                                            <div className='d-flex align-items-center designers-image-admin'>
                                                                                                {designer?.user?.image ?
                                                                                                    <div
                                                                                                        className='designer-photo-admin cursor-pointer'
                                                                                                        style={{ backgroundImage: `url(${import.meta.env.VITE_REACT_APP_STORAGE_URL}user/${designer?.user?.image})` }}
                                                                                                    >
                                                                                                    </div>
                                                                                                    :
                                                                                                    <div
                                                                                                        onClick={() => toggleGetUser(designer.user.id)}
                                                                                                        className='designer-photo-admin cursor-pointer'
                                                                                                        style={{ backgroundImage: `url(${UserPlaceholder})` }}
                                                                                                    >
                                                                                                    </div>
                                                                                                }
                                                                                            </div>
                                                                                        </Link>

                                                                                        <div className='ms-3'>
                                                                                            <Link to={`/admin/profile/user/${designer.user.id}`} className='text-decoration-none'>
                                                                                                <div className='cursor-pointer'>
                                                                                                    <div className='mt-0 mb-1 fs-18 text-black fw-500 admin-ellipsis-designer'>
                                                                                                        {designer.user.first_name}&nbsp;{designer.user.last_name}
                                                                                                    </div>
                                                                                                    <div className='fs-14 text-black admin-ellipsis-designer'>
                                                                                                        <MdOutlineEmail className="me-2 text-gold" size={18} />
                                                                                                        {designer.user.email}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </Link>
                                                                                        </div>
                                                                                    </Col>

                                                                                    <Col lg={2} className='d-flex justify-content-left align-items-center'>
                                                                                        <span className='fs-16 text-black'>{designer.user.gender}</span>
                                                                                    </Col>

                                                                                    <Col lg={2} className='d-flex justify-content-left align-items-center'>
                                                                                        <span className='fs-16 text-black '>{designer.user.phone_number}</span>
                                                                                    </Col>

                                                                                    <Col lg={2} className='d-flex justify-content-left align-items-center'>
                                                                                        <span className='fs-16 text-black'>{designer.user.country}</span>
                                                                                    </Col>

                                                                                    <Col lg={1} className='d-flex justify-content-center align-items-center'>
                                                                                        <div>
                                                                                            <span className='fs-16 text-black'>{designer.user.status}</span>
                                                                                        </div>
                                                                                    </Col>

                                                                                    <Col lg={2} className='d-flex justify-content-end align-items-center'>
                                                                                        <div className='d-flex'>
                                                                                            <Link to={`/admin/profile/user/${designer.user.id}`} className='text-decoration-none'>
                                                                                                <div className="designers-tooltip cursor-pointer"
                                                                                                >
                                                                                                    <span className="icon-tooltiptext fs-14">View</span>
                                                                                                    <IoEye className='me-3' color='#000000' size={20} />
                                                                                                </div>
                                                                                            </Link>

                                                                                            <Link to={`/admin/edit/designer/${designer.user.id}`}>
                                                                                                <div
                                                                                                    className="designers-tooltip cursor-pointer"
                                                                                                >
                                                                                                    <span className="icon-tooltiptext fs-14">Edit</span>
                                                                                                    <BiSolidPencil className='me-3' color='#000000' size={20} />
                                                                                                </div>
                                                                                            </Link>

                                                                                            <div
                                                                                                className="designers-tooltip cursor-pointer"
                                                                                                onClick={function () { deleteConfirm(designer.id); }}
                                                                                            >
                                                                                                <span className="icon-tooltiptext fs-14">Delete</span>
                                                                                                <AiFillDelete color='#000000' size={20} />
                                                                                            </div>
                                                                                        </div>
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
                show={deleteConfirmShow}
                className='modal-preview'
                fade={false}
                centered
            >
                <Modal.Header className="pb-0">
                    <Modal.Title className='rufina-family fs-22 text-black'>Confirm Delete</Modal.Title>
                    <button type='button' className='close react-modal-close' onClick={function () { setDeleteConfirmShow(false); }} >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <p className="mb-0">Are you sure you want to delete this designer?</p>
                        </Card.Body>
                    </Card>

                    <Card.Footer className="text-right mt-3">
                        <button className="btn btn-secondary border-black bg-white text-black me-3 btn-style" onClick={() => setDeleteConfirmShow(false)} type="button" >Cancel</button>
                        {designerDeleteLoading ?
                            <button className="btn btn-primary btn-style" type="button" >Deleting...</button>
                            :
                            <button className="btn btn-primary btn-style" type="button" onClick={designerDeleteSubmit} >Delete</button>
                        }
                    </Card.Footer>
                </Modal.Body>
            </Modal>
        </LayoutAdmin >
    );
};

export default AdminDesigners;