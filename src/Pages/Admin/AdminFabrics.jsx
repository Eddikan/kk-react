import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Modal, Card } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { GoAlertFill } from 'react-icons/go';
import { IoCloseOutline } from "react-icons/io5";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import Pagination from 'Components/Pagination/Pagination';
import AdminSidebar from 'Components/Shared/AdminSidebar';
import LoadingPage from 'Components/Shared/LoadingPage';
import LayoutAdmin from 'Components/Layout/LayoutAdmin';
import GoBack from 'Components/Shared/GoBack';
import 'Assets/styles/AdminFabrics/style.css';
import toast from 'react-hot-toast';
import axios from "axios";

const AdminFabrics = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'token', 'userRole']);
    const currentUser = cookies.currentUser;
    const token = cookies.token;
    const userRole = cookies.userRole;
    const navigate = useNavigate();
    const [reloadCount, setReloadCount] = useState(0);
    const [fabrics, setFabrics] = useState([]);
    const [modalHeading, setModalHeading] = useState('');
    const [fabricsLoading, setFabricsLoading] = useState(true);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [productId, setProductId] = useState('');
    const [deleteConfirmShow, setDeleteConfirmShow] = useState(false);
    const [productDeleteLoading, setProductDeleteLoading] = useState(false);

    let PageSize = 10;

    const getProducts = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'product');
    };

    const deleteConfirm = (e) => {
        setDeleteConfirmShow(true);
        setProductId(e);
    };

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    const handleChangePage = (pageNumber) => {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'product?page=' + pageNumber + '&user_id=' + currentUser)
            .then((response) => {
                const data = response.data;
                setCurrentPage(pageNumber);
                const selectedProducts = response.data.data;
                if (selectedProducts) {
                    setFabrics(selectedProducts);
                    setCurrentPage(() => data.meta.current_page);
                    setPageCount(() => data.meta.total);
                    setPageSize(() => data.meta.per_page);
                    setFabricsLoading(false);
                } else {
                    setFabricsLoading(false);
                    toast.error('There has been an error getting the products, please try again!');
                }
            }).catch(error => {
                setFabricsLoading(false);
                toast.error('There has been an error getting the products, please try again!');
            });
    };

    async function ProductDeleteSubmit(e) {
        setProductDeleteLoading(true);
        axios.delete(process.env.REACT_APP_API_ENDPOINT + 'product/' + productId + '?user_id=' + currentUser + '&token=' + token).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                toast.success('Fabric deleted successfully!');
                setReloadCount((prevReloadCount) => prevReloadCount + 1);
                setProductDeleteLoading(false);
                setDeleteConfirmShow(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setProductDeleteLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setProductDeleteLoading(false);
        });
    };

    useEffect(() => {
        if (userRole !== 'Admin') {
            navigate('/')
        }
        getProducts()
            .then((response) => {
                setFabricsLoading(false);
                const selectedProducts = response.data.data;
                if (selectedProducts) {
                    setFabrics(selectedProducts);
                    setPageCount(() => response.data.meta.total);
                } else {
                    toast.error('There has been an error getting the products, please try again!');
                    setFabricsLoading(false);
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the products, please try again!');
                setFabricsLoading(false);
            });
    },
        [reloadCount]);

    return (
        <LayoutAdmin>
            {fabricsLoading ?
                <LoadingPage />
                :
                <>
                    <section className='bg-fabrics'>
                        <Container fluid>
                            <Row>
                                <Col lg={2} className='p-0'>
                                    <AdminSidebar />
                                </Col>

                                <Col lg={10} className='py-5 col-right-calendar mx-auto' style={{ maxWidth: '1440px' }}>
                                    <Row>
                                        <Col lg={12}>
                                            <Row className="pb-4">
                                                <Col md={6} className='d-flex justify-content-left align-items-center'>
                                                    <h3 className="fs-30 fw-600 text-black mb-0">Fabrics</h3>
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
                                                        <Col lg={5}>
                                                            <span className='fw-500'>Name</span>
                                                        </Col>

                                                        <Col lg={3}>
                                                            <span className='fw-500'>Country</span>
                                                        </Col>

                                                        <Col lg={3}>
                                                            <span className='fw-500'>Status</span>
                                                        </Col>

                                                        <Col lg={1}>
                                                            <span className='fw-500'>Action</span>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>

                                        <>
                                            {fabrics ?
                                                <>
                                                    {fabrics.length > 0 ?
                                                        <>
                                                            {fabrics.map((fabric) => {
                                                                if (fabric.image_urls?.[0]?.image_url) {
                                                                    var fabricImage = process.env.REACT_APP_STORAGE_URL + 'product/' + fabric.image_urls[0].image_url;
                                                                } else {
                                                                    var fabricImage = PlaceholderImage;
                                                                }

                                                                return (
                                                                    <Col lg={12}>
                                                                        <Card className='mt-3'>
                                                                            <Card.Body >
                                                                                <Row>
                                                                                    <Col lg={5}>
                                                                                        <Link to={`/product/${fabric.id}`} className='d-flex text-decoration-none'>
                                                                                            <div className=" image-fabrics-admin "
                                                                                                style={{ backgroundImage: "url(" + fabricImage + ")" }}
                                                                                            >
                                                                                            </div>

                                                                                            <div className='ms-3'>
                                                                                                <div className='mb-2'>
                                                                                                    <span className='fs-16 text-black'>{fabric.name}</span>
                                                                                                </div>

                                                                                                <div>
                                                                                                    {fabric.categories ?
                                                                                                        <>
                                                                                                            {fabric.categories.length > 0 ?
                                                                                                                <>
                                                                                                                    {fabric.categories.slice(0, 3).map((category, index) => (
                                                                                                                        <span key={index} className="fabrics-tags-view-bar bg-light fs-12 categories-color text-black">
                                                                                                                            {category}
                                                                                                                        </span>
                                                                                                                    ))}
                                                                                                                </>
                                                                                                                :
                                                                                                                null
                                                                                                            }
                                                                                                        </>
                                                                                                        :
                                                                                                        null
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                        </Link>

                                                                                    </Col>

                                                                                    <Col lg={3}>
                                                                                        {fabric.country}
                                                                                    </Col>

                                                                                    <Col lg={3}>
                                                                                        {fabric.status}
                                                                                    </Col>

                                                                                    <Col lg={1}>
                                                                                        <div className='d-flex'>
                                                                                            <Link className="text-decoration-none" to={`/user/center/product/${fabric.id}/edit`}>
                                                                                                <div className="fabrics-tooltip cursor-pointer">
                                                                                                    <span className="icon-tooltiptext fs-14">Edit</span>
                                                                                                    <BiSolidPencil className='me-3' color='#000000' size={20} />
                                                                                                </div>
                                                                                            </Link>

                                                                                            <div className="fabrics-tooltip cursor-pointer"
                                                                                                onClick={function () { deleteConfirm(fabric.id); }}
                                                                                            >
                                                                                                <span className="icon-tooltiptext fs-14">Delete</span>
                                                                                                <AiFillDelete className='me-3' color='#000000' size={20} />
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
                                        className="mt-4"
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
                            <p className="mb-0">Are you sure you want to delete this fabric?</p>
                        </Card.Body>
                    </Card>
                    <Card.Footer className="text-right mt-3">
                        <button className="btn btn-secondary border-black bg-white text-black me-3" onClick={() => setDeleteConfirmShow(false)} type="button" style={{ minWidth: '100px', padding: '9px 20px' }}>Cancel</button>
                        {productDeleteLoading ?
                            <button className="btn btn-primary btn-style" type="button">Deleting...</button>
                            :
                            <button className="btn btn-primary btn-style" type="button" onClick={ProductDeleteSubmit}>Delete</button>
                        }

                    </Card.Footer>
                </Modal.Body>
            </Modal>
        </LayoutAdmin>
    );
};

export default AdminFabrics;