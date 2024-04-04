import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Modal, Card } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { BiSolidPencil } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { GoAlertFill } from 'react-icons/go';
import { TbNeedleThread, TbUserDollar } from "react-icons/tb";
import { MdOutlineEmail } from "react-icons/md";
import { IoCloseOutline, IoEye } from 'react-icons/io5';
import Pagination from 'Components/Pagination/Pagination';
import AdminSidebar from 'Components/Shared/AdminSidebar';
import LayoutAdmin from 'Components/Layout/LayoutAdmin';
import LoadingPage from 'Components/Shared/LoadingPage';
import UserPlaceholder from 'Assets/images/user.png';
import GoBack from 'Components/Shared/GoBack';
import 'Assets/styles/AdminUsers/style.css';
import toast from 'react-hot-toast';
import axios from "axios";

const Users = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'token', 'userRole']);
    const currentUser = cookies.currentUser;
    const userRole = cookies.userRole;
    const navigate = useNavigate();
    const [reloadCount, setReloadCount] = useState(0);
    const [users, setUsers] = useState([]);
    const [modalHeading, setModalHeading] = useState('');
    const [usersLoading, setUsersLoading] = useState(true);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [deleteConfirmShow, setDeleteConfirmShow] = useState(false);
    const [userId, setUserId] = useState('');
    const [userDeleteLoading, setUserDeleteLoading] = useState(false);

    let PageSize = 10;

    const getUsers = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user');
    };

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    const deleteConfirm = (e) => {
        setDeleteConfirmShow(true);
        setUserId(e);
    };

    const handleChangePage = (pageNumber) => {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'user?page=' + pageNumber + '&user_id=' + currentUser)
            .then((response) => {
                const data = response.data;
                setCurrentPage(pageNumber);
                const selectedUsers = response.data.data;
                if (selectedUsers) {
                    setUsers(selectedUsers);
                    setCurrentPage(() => data.meta.current_page);
                    setPageCount(() => data.meta.total);
                    setPageSize(() => data.meta.per_page);
                    setUsersLoading(false);
                } else {
                    setUsersLoading(false);
                    toast.error('There has been an error getting the users, please try again!');
                }
            }).catch(error => {
                setUsersLoading(false);
                toast.error('There has been an error getting the users, please try again!');
            });
    };

    async function userDeleteSubmit(id) {
        setUserDeleteLoading(true);
        axios.delete(process.env.REACT_APP_API_ENDPOINT + 'user/' + userId).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                toast.success('User deleted successfully!');
                setReloadCount((prevReloadCount) => prevReloadCount + 1);
                setUsersLoading(false);
                setDeleteConfirmShow(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setUserDeleteLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setUserDeleteLoading(false);
        });
    };

    useEffect(() => {
        if (userRole !== 'Admin') {
            navigate('/')
        }
        getUsers()
            .then((response) => {
                setUsersLoading(false);
                const selectedUsers = response.data.data;
                if (selectedUsers) {
                    setUsers(selectedUsers);
                    setPageCount(() => response.data.meta.total);
                } else {
                    toast.error('There has been an error getting the users, please try again!');
                    setUsersLoading(false);
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the users, please try again!');
                setUsersLoading(false);
            });
    },
        [reloadCount]);

        const toggleGetUser = (e) => {
            window.location.href = "/admin/profile/users?user_id=" + e;
        }

    return (
        <LayoutAdmin>
            {usersLoading ?
                <LoadingPage />
                :
                <>
                    <section className='bg-users'>
                        <Container fluid>
                            <Row>
                                <Col lg={2} className='p-0'>
                                    <AdminSidebar />
                                </Col>

                                <Col lg={10} className='py-5 padding-right-admin mx-auto max-width-column'>
                                    <Row>
                                        <Col lg={12}>
                                            <Row className="pb-4">
                                                <Col md={6} className='d-flex justify-content-left align-items-center'>
                                                    <h3 className="fs-30 fw-600 text-black mb-0">Users</h3>
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

                                                        <Col lg={2} className='px-0'>
                                                            <span className='fw-500'>Country</span>
                                                        </Col>

                                                        <Col lg={1} className='px-0'>
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
                                            {users ?
                                                <>
                                                    {users.length > 0 ?
                                                        <>
                                                            {users.map((user) => {
                                                                return (
                                                                    <Col lg={12}>
                                                                        <Card className='mt-3'>
                                                                            <Card.Body >
                                                                                <Row>
                                                                                    <Col lg={3} className='d-flex justify-content-left align-items-center'>
                                                                                        <Link to={`/admin/profile/user/${user.id}`}>
                                                                                            <div className='d-flex align-items-center user-image-admin'>
                                                                                                {user.image ?
                                                                                                    <div
                                                                                                        className='user-photo-admin'
                                                                                                        style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${user.image})` }}
                                                                                                    >
                                                                                                    </div>
                                                                                                    :
                                                                                                    <div
                                                                                                        className='user-photo-admin'
                                                                                                        style={{ backgroundImage: `url(${UserPlaceholder})` }}
                                                                                                    >
                                                                                                    </div>
                                                                                                }
                                                                                            </div>
                                                                                        </Link>

                                                                                        <div className='ms-3'>
                                                                                            <Link to={`/admin/profile/user/${user.id}`} className='text-decoration-none'>
                                                                                                <div className='mb-2'>
                                                                                                    <span className='mt-0 mb-1 fs-18 text-black admin-ellipsis-user fw-500'>
                                                                                                        {user.first_name}&nbsp;{user.last_name}
                                                                                                    </span>
                                                                                                </div>

                                                                                                <div className='mb-2'>
                                                                                                    <span className='fs-14 text-black admin-ellipsis-user'><MdOutlineEmail className="me-2 text-gold" size={18} />{user.email}</span>
                                                                                                </div>

                                                                                                <div className='mb-2'>
                                                                                                    {user.is_designer == 1 &&
                                                                                                        <>
                                                                                                            <span className='fs-14 text-black'><TbNeedleThread className="me-2 text-gold" size={18} />Designer</span>
                                                                                                        </>
                                                                                                    }
                                                                                                </div>

                                                                                                <div>
                                                                                                    {user.is_seller == 1 &&
                                                                                                        <>
                                                                                                            <span className='fs-14 text-black'><TbUserDollar className="me-2 text-gold" size={18} />Seller</span>
                                                                                                        </>
                                                                                                    }
                                                                                                </div>
                                                                                            </Link>
                                                                                        </div>
                                                                                    </Col>

                                                                                    <Col lg={2} className='d-flex justify-content-left align-items-center'>
                                                                                        <span className='fs-16 text-black'>{user.gender}</span>
                                                                                    </Col>

                                                                                    <Col lg={2} className='d-flex justify-content-left align-items-center admin-ellipsis-user'>
                                                                                        <span className='fs-16 text-black '>{user.phone_number}</span>
                                                                                    </Col>

                                                                                    <Col lg={2} className='d-flex justify-content-left align-items-center'>
                                                                                        <span className='fs-16 text-black'>{user.country}</span>
                                                                                    </Col>

                                                                                    <Col lg={1} className='d-flex justify-content-left align-items-center'>
                                                                                        <div>
                                                                                            <span className='fs-16 text-black'>{user.status}</span>
                                                                                        </div>
                                                                                    </Col>

                                                                                    <Col lg={2} className='d-flex justify-content-end align-items-center'>
                                                                                        <div className='d-flex'>

                                                                                            <Link to={`/admin/profile/user/${user.id}`} className="text-decoration-none">

                                                                                                <div className="users-tooltip cursor-pointer">
                                                                                                    <span className="icon-tooltiptext fs-14">View</span>
                                                                                                    <IoEye className='me-3' color='#000000' size={20} />
                                                                                                </div>
                                                                                            </Link>

                                                                                            <Link to={`/admin/edit/user/${user.id}`}>
                                                                                                <div
                                                                                                    className="users-tooltip cursor-pointer"
                                                                                                >
                                                                                                    <span className="icon-tooltiptext fs-14">Edit</span>
                                                                                                    <BiSolidPencil className='me-3' color='#000000' size={20} />
                                                                                                </div>
                                                                                            </Link>

                                                                                            <div
                                                                                                className="users-tooltip cursor-pointer"
                                                                                                onClick={function () { deleteConfirm(user.id); }}
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
                            <p className="mb-0">Are you sure you want to delete this user?</p>
                        </Card.Body>
                    </Card>

                    <Card.Footer className="text-right mt-3">
                        <button className="btn btn-secondary border-black bg-white text-black me-3 btn-style" onClick={() => setDeleteConfirmShow(false)} type="button" >Cancel</button>
                        {userDeleteLoading ?
                            <button className="btn btn-primary btn-style" type="button" >Deleting...</button>
                            :
                            <button className="btn btn-primary btn-style" type="button" onClick={userDeleteSubmit} >Delete</button>
                        }
                    </Card.Footer>
                </Modal.Body>
            </Modal>
        </LayoutAdmin >
    );
};

export default Users;