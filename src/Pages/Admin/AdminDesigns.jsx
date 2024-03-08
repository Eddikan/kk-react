import React, { useEffect, useState } from 'react';
import LayoutAdmin from 'Components/Layout/LayoutAdmin';
import { Container, Row, Col, Button, Modal, Card, ModalFooter, ModalHeader, Placeholder } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import Pagination from 'Components/Pagination/Pagination';
import GoBack from 'Components/Shared/GoBack';
import { useParams } from 'react-router-dom';
import LoadingPage from 'Components/Shared/LoadingPage';
import { BiSolidPencil } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { GoAlertFill } from 'react-icons/go';
import { IoCloseOutline } from 'react-icons/io5';
import AdminSidebar from 'Components/Shared/AdminSidebar';
import 'Assets/styles/AdminDesigns/style.css';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import axios from "axios";
import toast from 'react-hot-toast';

const AdminDesigns = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'token', 'userRole']);
    const currentUser = cookies.currentUser;
    const [reloadCount, setReloadCount] = useState(0);
    const [designs, setDesigns] = useState([]);
    const [modalHeading, setModalHeading] = useState('');
    const [designsLoading, setDesignsLoading] = useState(true);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(1);

    let PageSize = 10;

    const getPortfolio = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'portfolio/design');
    };

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    const handleChangePage = (pageNumber) => {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'portfolio/design?page=' + pageNumber + '&user_id=' + currentUser)
            .then((response) => {
                const data = response.data;
                setCurrentPage(pageNumber);
                const selectedPortfolio = response.data.data;
                if (selectedPortfolio) {
                    setDesigns(selectedPortfolio);
                    setCurrentPage(() => data.meta.current_page);
                    setPageCount(() => data.meta.total);
                    setPageSize(() => data.meta.per_page);
                    setDesignsLoading(false);
                } else {
                    setDesignsLoading(false);
                    toast.error('There has been an error getting the designs, please try again!');
                }
            }).catch(error => {
                setDesignsLoading(false);
                toast.error('There has been an error getting the designs, please try again!');
            });
    };

    useEffect(() => {
        getPortfolio()
            .then((response) => {
                setDesignsLoading(false);
                const selectedPortfolio = response.data.data;
                if (selectedPortfolio) {
                    setDesigns(selectedPortfolio);
                    setPageCount(() => response.data.meta.total);
                } else {
                    toast.error('There has been an error getting the designs, please try again!');
                    setDesignsLoading(false);
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the designs, please try again!');
                setDesignsLoading(false);
            });
    },
        [reloadCount]);

    return (
        <LayoutAdmin>
            {designsLoading ?
                <LoadingPage />
                :
                <>
                    <section className='bg-design'>
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
                                                    <h3 className="fs-30 fw-600 text-black mb-0">Portfolio</h3>
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
                                                            <span className='fw-500'>Categories</span>
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
                                            {designs ?
                                                <>
                                                    {designs.length > 0 ?
                                                        <>
                                                            {designs.map((design) => {
                                                                if (design.image_urls?.[0]?.image_url) {
                                                                    var designImage = process.env.REACT_APP_STORAGE_URL + 'portfolio/' + design.image_urls[0].image_url;
                                                                } else {
                                                                    var designImage = PlaceholderImage;
                                                                }

                                                                return (
                                                                    <Col lg={12}>
                                                                        <Card className='mt-3'>
                                                                            <Card.Body >
                                                                                <Row>
                                                                                    <Col lg={5} className='d-flex'>
                                                                                        <div className=" image-design-admin"
                                                                                            style={{ backgroundImage: "url(" + designImage + ")" }}
                                                                                        >
                                                                                        </div>

                                                                                        <div className='ms-3'>
                                                                                            <div>
                                                                                                <span className='d-flex mt-0 mb-1 fs-16 text-black'>
                                                                                                    {design.name}
                                                                                                </span>
                                                                                            </div>
                                                                                            <div>
                                                                                                {design.tags ?
                                                                                                    <>
                                                                                                        {design.tags.length > 0 ?
                                                                                                            <>
                                                                                                                {design.tags.slice(0, 3).map((tag, index) => (
                                                                                                                    <span key={index} className="designs-tags-view-bar bg-light fs-12 categories-color text-black">
                                                                                                                        {tag}
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
                                                                                    </Col>

                                                                                    <Col lg={3}>
                                                                                        <div>
                                                                                            {design.categories ?
                                                                                                <>
                                                                                                    {design.categories.length > 0 ?
                                                                                                        <>
                                                                                                            {design.categories.slice(0, 3).map((category, index) => (
                                                                                                                <span key={index} className="designs-tags-view-bar bg-light fs-16 categories-color text-black">
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
                                                                                    </Col>

                                                                                    <Col lg={3}>
                                                                                        {design.status}
                                                                                    </Col>

                                                                                    <Col lg={1}>
                                                                                        <div className='d-flex'>
                                                                                            <div className="design-tooltip cursor-pointer" onClick={() => { toggleUnderConstruction("Edit") }}>
                                                                                                <span className="icon-tooltiptext fs-14">Edit</span>
                                                                                                <BiSolidPencil className='me-3' color='#000000' size={20} />
                                                                                            </div>
                                                                                            <div className="design-tooltip cursor-pointer" onClick={() => { toggleUnderConstruction("Delete") }}>
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
        </LayoutAdmin >
    );
};

export default AdminDesigns;