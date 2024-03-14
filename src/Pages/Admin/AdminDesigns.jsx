import React, { useEffect, useState } from 'react';
import LayoutAdmin from 'Components/Layout/LayoutAdmin';
import { Container, Row, Col, Button, Modal, Card, ModalFooter, ModalHeader, Placeholder } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from 'Components/Pagination/Pagination';
import GoBack from 'Components/Shared/GoBack';
import LoadingPage from 'Components/Shared/LoadingPage';
import { BiSolidPencil } from "react-icons/bi";
import { PiNotepadFill } from "react-icons/pi";
import { AiFillDelete, AiFillMessage } from "react-icons/ai";
import { GoAlertFill } from 'react-icons/go';
import { ImEmbed2 } from "react-icons/im";
import { IoShareSocial, IoInformationOutline, IoVideocam, IoCloseOutline, IoHeartOutline, IoEyeOutline, IoEye } from "react-icons/io5";
import CopyTo from 'Utils/CopyLink';
import AdminSidebar from 'Components/Shared/AdminSidebar';
import 'Assets/styles/AdminDesigns/style.css';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import DressPlaceholder from 'Assets/images/dress-placeholder.png';
import UserPlaceholder from 'Assets/images/user.png';
import PinIcon from 'Assets/images/pin.png';
import Carousel from 'react-multi-carousel';
import axios from "axios";
import toast from 'react-hot-toast';

const AdminDesigns = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'token', 'userRole']);
    const currentUser = cookies.currentUser;
    const token = cookies.token;
    const userRole = cookies.userRole;
    const navigate = useNavigate();
    const [reloadCount, setReloadCount] = useState(0);
    const [designs, setDesigns] = useState([]);
    const [modalHeading, setModalHeading] = useState('');
    const [designsLoading, setDesignsLoading] = useState(true);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [portfolioId, setPortfolioId] = useState('');
    const [deleteConfirmShow, setDeleteConfirmShow] = useState(false);
    const [portfolioDeleteLoading, setPortfolioDeleteLoading] = useState(false);

    const [copy, setCopy] = useState(false);
    const [copyEmbedLink, setCopyEmbedLink] = useState(false);
    const [designImages, setDesignImages] = useState([]);
    const [activeImage, setActiveImage] = useState('');
    const [isDesignCurrentUser, setIsDesignCurrentUser] = useState(false);
    const [portfoliosImage, setPortfolioImage] = useState(false);
    const [singleDesign, setSingleDesign] = useState('');
    const [profileViewShow, setProfileViewShow] = useState(false);
    const [descriptionShow, setDescriptionShow] = useState(false);
    const [shareShowModal, setShareShowModal] = useState(false);

    let PageSize = 10;
    let iframeLink = `<iframe src="https://kouture-konect.web.app/view-design/${singleDesign.portfolioId}" height="316" width="404" allowfullscreen lazyload frameborder="0" allow="clipboard-write" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
            slidesToSlide: 1
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
            slidesToSlide: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1
        }
    };

    const getPortfolio = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'portfolio/design');
    };

    function toggleShareModal() {
        setShareShowModal(true);
    }

    function toggleDescription() {
        setDescriptionShow(true);
    }

    const deleteConfirm = (e) => {
        setDeleteConfirmShow(true);
        setPortfolioId(e);
    };

    function toggleCopyEmbedLinkModal() {
        setCopyEmbedLink(true);
    }

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    function togglePortfolioImage(portfolioId, id, first_name, last_name, image_urls, image, address_line_1, province, tags, description, userId) {
        setPortfolioImage(true);
        setSingleDesign({
            id: id ?? 0,
            userId: userId ?? 0,
            portfolioId: portfolioId ?? 0,
            first_name: first_name ?? '-',
            last_name: last_name ?? '-',
            image: image ?? '-',
            address_line_1: address_line_1 ?? '-',
            province: province ?? '-',
            tags: tags ?? '-',
            description: description ?? '-'
        })

        setDesignImages(image_urls);
        if (image_urls?.[0]?.image_url) {
            setActiveImage(process.env.REACT_APP_STORAGE_URL + 'portfolio/' + image_urls[0].image_url);
        } else {
            setActiveImage(PlaceholderImage);
        }

        if (currentUser == userId) {
            setIsDesignCurrentUser(true);
        } else {
            setIsDesignCurrentUser(false);
        }
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

    async function PortfolioDeleteSubmit(e) {
        setPortfolioDeleteLoading(true);
        axios.delete(process.env.REACT_APP_API_ENDPOINT + 'portfolio_item/' + portfolioId + '?user_id=' + currentUser + '&token=' + token).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                toast.success('Design deleted successfully!');
                setReloadCount((prevReloadCount) => prevReloadCount + 1);
                setPortfolioDeleteLoading(false);
                setDeleteConfirmShow(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setPortfolioDeleteLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setPortfolioDeleteLoading(false);
        });
    };

    useEffect(() => {
        if (userRole !== 'Admin') {
            navigate('/')
        }
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

                                <Col lg={10} className='py-5 col-right-calendar mx-auto max-width-column'>
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
                                                        <Col lg={3}>
                                                            <span className='fw-500'>Name</span>
                                                        </Col>

                                                        <Col lg={2}>
                                                            <span className='fw-500'>Categories</span>
                                                        </Col>

                                                        <Col lg={3}>
                                                            <span className='fw-500'>Tags</span>
                                                        </Col>

                                                        <Col lg={2}>
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
                                                                                    <Col lg={3} className='d-flex justify-content-left align-items-center'>
                                                                                        <div className="cursor-pointer  image-design-admin"
                                                                                            onClick={function () {
                                                                                                togglePortfolioImage(
                                                                                                    design.id,
                                                                                                    design.designer.id,
                                                                                                    design.user.first_name,
                                                                                                    design.user.last_name,
                                                                                                    design.image_urls,
                                                                                                    design.user.image,
                                                                                                    design.user.address_line_1,
                                                                                                    design.user.province,
                                                                                                    design.tags,
                                                                                                    design.description,
                                                                                                    design.user.id
                                                                                                );
                                                                                            }}
                                                                                            style={{ backgroundImage: "url(" + designImage + ")" }}
                                                                                        >
                                                                                        </div>

                                                                                        <div className='ms-3'>
                                                                                            <div
                                                                                                className='d-flex mt-0 mb-1 fs-16 text-black cursor-pointer'
                                                                                                onClick={function () {
                                                                                                    togglePortfolioImage(
                                                                                                        design.id,
                                                                                                        design.designer.id,
                                                                                                        design.user.first_name,
                                                                                                        design.user.last_name,
                                                                                                        design.image_urls,
                                                                                                        design.user.image,
                                                                                                        design.user.address_line_1,
                                                                                                        design.user.province,
                                                                                                        design.tags,
                                                                                                        design.description,
                                                                                                        design.user.id
                                                                                                    );
                                                                                                }}
                                                                                            >
                                                                                                {design.name}
                                                                                            </div>

                                                                                            <Link
                                                                                                to={`/designer-profile?user_id=${design.user.id}`}
                                                                                                className="text-decoration-none">
                                                                                                <div className='d-flex align-items-center user-image-chat'>
                                                                                                    {design.user.image ?
                                                                                                        <div
                                                                                                            className='user-photo-chat'
                                                                                                            style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${design.user.image})` }}
                                                                                                        >
                                                                                                        </div>
                                                                                                        :
                                                                                                        <div
                                                                                                            className='user-photo-chat'
                                                                                                            style={{ backgroundImage: `url(${UserPlaceholder})` }}
                                                                                                        >
                                                                                                        </div>
                                                                                                    }
                                                                                                    <span className='name-user ms-2'>
                                                                                                        {design.user.first_name}
                                                                                                        &nbsp;
                                                                                                        {design.user.last_name}
                                                                                                    </span>
                                                                                                </div>
                                                                                            </Link>
                                                                                        </div>
                                                                                    </Col>

                                                                                    <Col lg={2} className='d-flex justify-content-left align-items-center'>
                                                                                        <div>
                                                                                            {design.categories ?
                                                                                                <>
                                                                                                    {design.categories.length > 0 ?
                                                                                                        <>
                                                                                                            {design.categories.slice(0, 3).map((category, index) => (
                                                                                                                <span key={index} className="designs-tags-view-bar bg-light mb-2 fs-16 categories-color text-black">
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

                                                                                    <Col lg={3} className='d-flex justify-content-left align-items-center'>

                                                                                        <div>
                                                                                            {design.tags ?
                                                                                                <>
                                                                                                    {design.tags.length > 0 ?
                                                                                                        <>
                                                                                                            {design.tags.slice(0, 3).map((tag, index) => (
                                                                                                                <span key={index} className="designs-tags-view-bar bg-light fs-16 mb-1 categories-color text-black">
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
                                                                                    </Col>

                                                                                    <Col lg={2} className='d-flex justify-content-left align-items-center'>
                                                                                        {design.status}
                                                                                    </Col>

                                                                                    <Col lg={2} className='d-flex justify-content-end align-items-center'>
                                                                                        <div className='d-flex'>

                                                                                            <div
                                                                                                className="design-tooltip cursor-pointer"
                                                                                                onClick={function () {
                                                                                                    togglePortfolioImage(
                                                                                                        design.id,
                                                                                                        design.designer.id,
                                                                                                        design.user.first_name,
                                                                                                        design.user.last_name,
                                                                                                        design.image_urls,
                                                                                                        design.user.image,
                                                                                                        design.user.address_line_1,
                                                                                                        design.user.province,
                                                                                                        design.tags,
                                                                                                        design.description,
                                                                                                        design.user.id
                                                                                                    );
                                                                                                }}
                                                                                            >
                                                                                                <span className="icon-tooltiptext fs-14">View</span>
                                                                                                <IoEye className='me-3' color='#000000' size={20} />
                                                                                            </div>

                                                                                            <Link className="text-decoration-none" to={`/admin/design/${design.id}/edit`}>
                                                                                                <div className="design-tooltip cursor-pointer">
                                                                                                    <span className="icon-tooltiptext fs-14">Edit</span>
                                                                                                    <BiSolidPencil className='me-3' color='#000000' size={20} />
                                                                                                </div>
                                                                                            </Link>

                                                                                            <div
                                                                                                className="design-tooltip cursor-pointer"
                                                                                                onClick={function () { deleteConfirm(design.id); }}
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
                            <p className="mb-0">Are you sure you want to delete this design?</p>
                        </Card.Body>
                    </Card>
                    <Card.Footer className="text-right mt-3">
                        <button className="btn btn-secondary border-black bg-white text-black me-3" onClick={() => setDeleteConfirmShow(false)} type="button" style={{ minWidth: '100px', padding: '9px 20px' }}>Cancel</button>
                        {portfolioDeleteLoading ?
                            <button className="btn btn-primary btn-style" type="button" >Deleting...</button>
                            :
                            <button className="btn btn-primary btn-style" type="button" onClick={PortfolioDeleteSubmit} >Delete</button>
                        }
                    </Card.Footer>
                </Modal.Body>
            </Modal>

            <Modal
                show={portfoliosImage}
                fade={false}
                className='modal-full-width'
                id="bg-transparent-card"
            >
                <ModalHeader className='pt-2 pb-3 bg-transparent-card d-flex align-items-start'>
                    <a href={`/designer-profile?user_id=${singleDesign.userId}`} className='text-decoration-none'>
                        <div className='d-flex user-image'>

                            {singleDesign.image !== '' && singleDesign.image !== '-' ? (
                                <div
                                    className='user-photo'
                                    style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                >
                                </div>
                            ) : (
                                <img src={UserPlaceholder} className='placeholder-img' alt="User Placeholder" />
                            )}

                            <div className='ms-3'>
                                <div className='modal-title text-left fs-20 fw-600 text-white'>{singleDesign.first_name} {singleDesign.last_name}</div>
                                <div className='fashion-designer fs-16'>Fashion Designer</div>
                            </div>
                        </div>
                    </a>
                    <button type='button' className='close modal-close close-button-image bg-black' aria-label='Close' onClick={() => setPortfolioImage(false)}>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                </ModalHeader>
                <Modal.Body className='p-0'>
                    <Row>
                        <Col lg={11} className='image-fabrics'>
                            <div>
                                {designImages && designImages.length > 0 ?
                                    <>
                                        <Carousel
                                            swipeable={false}
                                            draggable={false}
                                            responsive={responsive}
                                            ssr={true}
                                            autoPlaySpeed={1000}
                                        >
                                            {designImages.map((image, index) => {

                                                return (
                                                    <>
                                                        <div key={index} className="single-image-slider-fabrics"
                                                            style={{
                                                                backgroundImage:
                                                                    `url(${process.env.REACT_APP_STORAGE_URL}portfolio/${image.image_url})`
                                                            }}
                                                        >
                                                        </div>
                                                    </>
                                                )
                                            })}
                                        </Carousel>
                                    </>
                                    :
                                    <>
                                        <img src={DressPlaceholder} className='w-100 img-placeholder-height' />
                                    </>
                                }

                                <div>
                                    <div className='text-white book-consultation-bar w-100 d-flex justify-content-center'>
                                        <p className='request d-flex justify-content-between mb-5'>
                                            <a href={`/designer-profile?user_id=${singleDesign.userId} `} className='text-decoration-none'>
                                                <div className='d-flex justify-content-center align-items-center user-image'>

                                                    {singleDesign.image !== '' && singleDesign.image !== '-' ? (
                                                        <div
                                                            className='user-photo'
                                                            style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                                        >
                                                        </div>
                                                    ) : (
                                                        <img src={UserPlaceholder} className='placeholder-img' />
                                                    )}

                                                    <div className='ms-3'>
                                                        <div className='modal-title text-left fs-20 fw-600 text-white'>{singleDesign.first_name} {singleDesign.last_name}</div>
                                                        <div className='fashion-designer fs-16'>Fashion Designer</div>
                                                    </div>

                                                </div>
                                            </a>

                                            {isDesignCurrentUser ?
                                                null
                                                :
                                                <>
                                                    <div className='btn-book-bar'>
                                                        <a href={`/appointment/schedule/${singleDesign.id}`}>
                                                            <button className='btn btn-book-consultation'>Book a Consultation</button>
                                                        </a>
                                                    </div>
                                                </>
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={1}>
                            {profileViewShow &&
                                <>
                                    <div>
                                        <Card className="table_content file-action mt-3 me-0 card-profile-designer">
                                            <Card.Header className='card-hr bg-white'>
                                                <button
                                                    type='button'
                                                    className='close react-modal-close'
                                                    onClick={() => setProfileViewShow(false)}
                                                >
                                                    <IoCloseOutline color="#7e7e7e" size={25} />
                                                </button>
                                            </Card.Header>
                                            <Card.Body className="action_container font-weight">
                                                <Row>
                                                    <Col>
                                                        <div className='user-image-modal text-center'>
                                                            {singleDesign.image !== '' && singleDesign.image !== '-' ? (
                                                                <div
                                                                    className='user-photo-modal mb-2 '
                                                                    style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                                                >
                                                                </div>
                                                            ) : (
                                                                <img src={UserPlaceholder} className='placeholder-img-side mb-3' />
                                                            )}
                                                        </div>

                                                        <div className='modal-title text-center fs-18 fw-600 text-black'>{singleDesign.first_name} {singleDesign.last_name}</div>
                                                        <div className='fs-14 text-center mt-2'>
                                                            <img src={PinIcon} alt="location pin" className='me-2' />
                                                            {singleDesign.address_line_1}{singleDesign.province}</div>
                                                        <div className="mb-2 text-center">
                                                            {singleDesign.tags ?
                                                                <>
                                                                    {singleDesign.tags.length > 0 ?
                                                                        <>
                                                                            {singleDesign.tags.map((tag, index) => (
                                                                                <span className="design-tags bg-light fs-14 categories-color">
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

                                                        {isDesignCurrentUser ?
                                                            null
                                                            :
                                                            <>
                                                                <hr />
                                                                <div className='text-center'>
                                                                    <a className='book-consultation btn-book btn w-100'
                                                                        href={`/appointment/schedule/${singleDesign.id}`}
                                                                    >
                                                                        <IoVideocam className="me-2" color="#ffffff" />Book a Consultation</a>
                                                                </div>

                                                                <div className='text-center mt-2'
                                                                    onClick={() => { toggleUnderConstruction("Message"); setProfileViewShow(false); }}
                                                                >
                                                                    <a className='book-consultation btn-message-designer btn w-100'
                                                                    >
                                                                        <AiFillMessage className="me-2" />Send Message</a>
                                                                </div>
                                                            </>
                                                        }
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </>
                            }

                            <div>
                                <div>
                                    <div className='user-image-side thumbnail-table text-center cursor-pointer' onClick={() => setProfileViewShow(true)}>
                                        {singleDesign.image !== '' && singleDesign.image !== '-' ? (
                                            <div
                                                className='user-photo-side mb-4 '
                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                            >
                                            </div>
                                        ) : (
                                            <img src={UserPlaceholder} className='placeholder-img-side mb-4' />
                                        )}


                                    </div>
                                </div>

                                {isDesignCurrentUser ?
                                    null
                                    :
                                    <>
                                        <div className='text-center mb-4' >
                                            <a href={`/appointment/schedule/${singleDesign.id}`}>
                                                <div className="action-button-designs bg-white">
                                                    <PiNotepadFill className="text-black mt-2" size={30} />
                                                </div>
                                            </a>
                                            <div className='icon-name-color fs-12 mt-2 fw-600'>Consultation</div>
                                        </div>

                                        <div className='text-center mb-4' onClick={() => toggleUnderConstruction("Message")}>
                                            <div className="action-button-designs bg-white">
                                                <AiFillMessage className="text-black mt-2" size={30} />
                                            </div>
                                            <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Message</div>
                                        </div>
                                    </>
                                }

                                <div className='text-center mb-4'
                                    onClick={toggleShareModal}
                                >
                                    <div className="action-button-designs bg-white">
                                        <IoShareSocial className="text-black mt-2" size={30} />
                                    </div>
                                    <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Share</div>
                                </div>

                                <div className='text-center mb-4' onClick={toggleDescription}>
                                    <div className="action-button-designs bg-white">
                                        <IoInformationOutline className="text-black mt-2" size={30} />
                                    </div>
                                    <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Description</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>

            <Modal
                show={descriptionShow}
                fade={false}
                centered
                id="description-card"
            >
                <Modal.Header className="py-0">
                    <button
                        type='button'
                        className='close react-modal-close description-close'
                        onClick={() => setDescriptionShow(false)}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} />
                    </button>
                </Modal.Header>

                <Modal.Body className='card-description d-flex align-items-center'>
                    <p className='text-white fw-400 p-3 fs-14 mb-0'>{singleDesign.description}</p>
                </Modal.Body>
            </Modal>

            <Modal
                show={shareShowModal}
                className='modal-preview-share'
                fade={false}
                centered
                id='share-modal'
            >
                <Modal.Header className="pb-0">
                    <Modal.Title className='rufina-family fs-22 text-black'>Share Design</Modal.Title>
                    <button type='button' className='close react-modal-close' onClick={function () { setShareShowModal(false); }} >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body className='padding-share-card'>
                            <div>
                                {designImages && designImages.length > 0 ?
                                    <>
                                        <Carousel
                                            swipeable={false}
                                            draggable={false}
                                            responsive={responsive}
                                            ssr={true}
                                            autoPlaySpeed={1000}
                                        >
                                            {designImages.map((image, index) => {

                                                return (
                                                    <>
                                                        <div key={index} className="single-image-slider-share mb-4"
                                                            style={{
                                                                backgroundImage:
                                                                    `url(${process.env.REACT_APP_STORAGE_URL}portfolio/${image.image_url})`
                                                            }}
                                                        >
                                                        </div>

                                                        <div className='d-flex user-image-share image-share-popup'>

                                                            {singleDesign.image !== '' && singleDesign.image !== '-' ? (
                                                                <div
                                                                    className='user-photo-share mt-1'
                                                                    style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                                                >
                                                                </div>
                                                            ) : (
                                                                <img src={UserPlaceholder} className='placeholder-img-share' alt="User Placeholder" />
                                                            )}

                                                            <div className='ms-2'>
                                                                <div className='modal-title text-left fs-16 fw-600 text-white'>{singleDesign.first_name} {singleDesign.last_name}</div>
                                                                <div>
                                                                    {singleDesign.tags ?
                                                                        <>
                                                                            {singleDesign.tags.length > 0 ?
                                                                                <>

                                                                                    {singleDesign.tags.slice(0, 3).map((tag, index) => (
                                                                                        <span key={index} className="design-tags-view-bar bg-light fs-12 categories-color text-black">
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
                                                        </div>
                                                    </>
                                                )
                                            })}
                                        </Carousel>
                                    </>
                                    :
                                    <>
                                    </>
                                }

                                <div lg='12' className='text-center'>
                                    <CopyTo
                                        text={`https://kouture-konect.web.app/view-design/${singleDesign.portfolioId}`}
                                        classes="btn btn-copy-link border-black bg-white text-black mt-2 w-100"
                                        standbyTitle="Copy Link"
                                        icon={true}
                                    />

                                    <button
                                        className="btn btn-copy-link border-black bg-white text-black mt-2 w-100"
                                        type="button"
                                        onClick={toggleCopyEmbedLinkModal}
                                    >
                                        <ImEmbed2 className='me-2' size={17} />
                                        Copy Embed Code
                                    </button>
                                </div >
                            </div >
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>

            <Modal
                show={copyEmbedLink}
                id='modal-preview-embed'
                fade={false}
                centered
                className='embed-modal-view'

            >
                <Modal.Header className="p-3 pb-0">
                    <h5 className='mb-0 rufina-family fs-22 text-black'>Embed Design</h5>
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={() => setCopyEmbedLink(false)}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} />
                    </button>
                </Modal.Header>
                <Modal.Body className='pb-0 pt-4'>
                    <Row>
                        <Col lg='12' className='px-3'>
                            <textarea className='text-area-embed'>
                                {iframeLink}
                            </textarea>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="text-right border-none">
                    <button
                        className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
                        onClick={() => setCopyEmbedLink(false)}
                        type="button"
                    >
                        Cancel
                    </button>

                    <CopyTo
                        text={iframeLink}
                        classes="btn btn-primary btn-style"
                        standbyTitle="Copy"
                        icon={false}
                        onCopy={() => setCopy(true)}
                        loadingTitle="Embed Copied"
                    />
                </Modal.Footer>
            </Modal>
        </LayoutAdmin >
    );
};

export default AdminDesigns;