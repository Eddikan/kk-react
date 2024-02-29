import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col, Button, Card, Modal, ModalHeader } from 'react-bootstrap';
import toast from 'react-hot-toast';
import GetUserPortfolioData from 'Utils/GetUserPortfolioData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus, GoAlertFill } from "react-icons/go";
import { IoShareSocial, IoInformationOutline, IoVideocam, IoCloseOutline, IoDocumentOutline } from "react-icons/io5";
import { AiFillMessage } from "react-icons/ai";
import { PiNotepadFill } from "react-icons/pi";
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import Loading from '../Loading';
import '../../../Assets/styles/Portfolio/ViewPortFolio/style.css';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import PinIcon from '../../../Assets/images/pin.png';
import UserPlaceholder from 'Assets/images/user.png';
import { useCookies } from 'react-cookie';

const PortfolioGrid = (props) => {
    const navigate = useNavigate();
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [portfolio, setPortfolio] = useState([]);
    const [portfolioLoading, setPortfolioLoading] = useState(true);
    const [portfolioDraftLoading, setPortfolioDraftLoading] = useState(false);
    const [portfolioPublishLoading, setPortfolioPublishLoading] = useState(false);
    const [portfolioDeleteLoading, setPortfolioDeleteLoading] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [deleteConfirmShow, setDeleteConfirmShow] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'token']);
    const [portfolioId, setPortfolioId] = useState('');

    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [isDesignCurrentUser, setIsDesignCurrentUser] = useState(false);
    const [profileViewShow, setProfileViewShow] = useState(false);
    const [singleDesign, setSingleDesign] = useState('');
    const [descriptionShow, setDescriptionShow] = useState(false);
    const [designImages, setDesignImages] = useState([]);
    const [activeImage, setActiveImage] = useState('');
    const [portfoliosImage, setPortfolioImage] = useState(false);

    const currentUser = cookies.currentUser;
    const token = cookies.token;

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

    // const useQuery = () => {
    //     return new URLSearchParams(useLocation().search);
    // }
    // let query = useQuery();
    // const user_id = query.get('user_id');


    const fetchData = async (e) => {
        setPortfolioLoading(true);
        try {
            const portfolioData = await GetUserPortfolioData(e);
            if (portfolioData) {
                setPortfolio(portfolioData);
                setPortfolioLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setPortfolioLoading(false);
            }
            // Update state or perform other logic with userData
        } catch (error) {
            toast.error('An error occured. Please try again or contact the administrator.');
            setPortfolioLoading(false);
            // Handle the error, if needed
        }
    };

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    function toggleDescription() {
        setDescriptionShow(true);
    }

    const handleActionClick = (index) => {
        // Toggle the selected item index
        setSelectedItemIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const addNewPortfolio = () => {
        navigate('/user/center/design/add')
    };

    const deleteConfirm = (e) => {
        setDeleteConfirmShow(true);
        setPortfolioId(e);
    };

    function togglePortfolioImage(id, first_name, last_name, image_urls, image, address_line_1, province, tags, description, userId) {
        setPortfolioImage(true);
        setSingleDesign({
            id: id ?? 0,
            userId: userId ?? 0,
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
            setPortfolioDraftLoading(false);
        });
    };

    async function PortfolioDraftSubmit(e) {
        setPortfolioDraftLoading(true);
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'portfolio_item/' + e + '?user_id=' + currentUser + '&token=' + token, { status: 'Draft' }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                toast.success('Design saved as draft successfully!');
                setReloadCount((prevReloadCount) => prevReloadCount + 1);
                setPortfolioDraftLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setPortfolioDraftLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setPortfolioDraftLoading(false);
        });
    };

    async function PortfolioPublishSubmit(e) {
        setPortfolioPublishLoading(true);
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'portfolio_item/' + e + '?user_id=' + currentUser + '&token=' + token, { status: 'Active' }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                toast.success('Design published successfully!');
                setReloadCount((prevReloadCount) => prevReloadCount + 1);
                setPortfolioPublishLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setPortfolioPublishLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setPortfolioPublishLoading(false);
        });
    };

    useEffect(() => {
        fetchData(currentUser);
    }, [reloadCount]);

    return (
        <>
            <div id="profile-portfolio">
                {portfolioLoading ?
                    <>
                        <p className='text-center mb-3 mt-3'>
                            <Loading className="bg-white loading-height" />
                        </p>
                    </>
                    :
                    <>
                        {portfolio && portfolio.length > 0 ?
                            <>
                                <Row className="portfolio-row">
                                    {portfolio.map((object, index) => {
                                        if (object.image_urls?.[0]?.image_url) {
                                            var portfolioImage = process.env.REACT_APP_STORAGE_URL + 'portfolio/' + object.image_urls[0].image_url;
                                        } else {
                                            var portfolioImage = PlaceholderImage;
                                        }
                                        return (
                                            <Col className={`portfolio-grid mb-3`} xs="4" md="2">

                                                <div onClick={function () { togglePortfolioImage(object.designer.id, object.user.first_name, object.user.last_name, object.image_urls, object.user.image, object.user.address_line_1, object.user.province, object.tags, object.description, object.user.id); }}>
                                                    <div className={`portfolio-grid-div cursor-pointer w-100 ${object.collection_type == "Limited" ? "limited" : " "} ${object.status == "Draft" ? "draft" : ""}`} style={{ backgroundImage: "url(" + portfolioImage + ")" }}>
                                                        <div className="portfolio-overlay">
                                                            <div className="portfolio-actions">
                                                                <BsThreeDots className="cursor-pointer action-menu" color="#ffffff" size="30px" onClick={() => handleActionClick(index)} />
                                                                {selectedItemIndex === index && (
                                                                    <div className="action-box">
                                                                        <Link className="text-decoration-none" to={`/user/center/design/${object.id}/edit`}>
                                                                            <p className="mb-3 text-decoration-none"><GoPencil /> Edit</p>
                                                                        </Link>
                                                                        <p className="mb-3 cursor-pointer" onClick={function () { deleteConfirm(object.id); }}><GoTrash /> Delete</p>
                                                                        {object.status != "Draft" ?
                                                                            <p className="mb-0 cursor-pointer" onClick={function () { PortfolioDraftSubmit(object.id); }}><IoDocumentOutline /> {portfolioDraftLoading ? "Drafting..." : "Draft"}</p>
                                                                            :
                                                                            <p className="mb-0 cursor-pointer" onClick={function () { PortfolioPublishSubmit(object.id); }}><IoDocumentOutline /> {portfolioPublishLoading ? "Publishing..." : "Publish"}</p>
                                                                        }


                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="portfolio-details">
                                                                {object.status == "Draft" ?
                                                                    <span className="text-warning small fw-600">Draft</span>
                                                                    :
                                                                    null
                                                                }

                                                                {currentUser != object.user.id ?
                                                                    <div className="other-actions">
                                                                        <div className="action-button bg-white me-2">
                                                                            <GoHeart className="text-black" />
                                                                        </div>
                                                                        <div className="action-button bg-white">
                                                                            <GoBookmark className="text-black" />
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    null
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='margin-img ellipsis-portfolio'>
                                                    <span className="text-black text-decoration-none portfolio-name-img">{object.name ?? "-"}</span>
                                                </div>
                                            </Col>
                                        )
                                    })}
                                    <Col className="portfolio-grid mb-3" xs="4" md="2">
                                        <div onClick={addNewPortfolio} className="portfolio-grid-div add-more-box w-100 text-center cursor-pointer background-dashed">
                                            <GoPlus color="#a4a4a4" size="150px" className="mt-3" />
                                            <p className="text-dgray" style={{ marginTop: '-15px' }}>Add More</p>
                                        </div>
                                    </Col>
                                </Row>
                            </>
                            :
                            <>
                                <div className="text-center">
                                    <p className="text-center mb-3 mt-3">No records found.</p>
                                    <Link to="/user/center/design/add">
                                        <Button className="btn btn-primary">Add Portfolio</Button>
                                    </Link>
                                </div>
                            </>
                        }
                    </>
                }
            </div>
            {/* Confirm Delete */}
            <Modal
                show={deleteConfirmShow}
                className='modal-preview'
                fade={false}
                centered
            >
                <Modal.Header className="pb-0">
                    <h5 className='modal-title text-left fs-22 text-black'>Confirm Delete</h5>
                    <button type='button' className='close react-modal-close' onClick={function () { setDeleteConfirmShow(false); }} data-dismiss='modal' aria-label='Close'>
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
                            <button className="btn btn-primary" type="button" style={{ minWidth: '100px', padding: '9px 20px' }}>Deleting...</button>
                            :
                            <button className="btn btn-primary" type="button" onClick={PortfolioDeleteSubmit} style={{ minWidth: '100px', padding: '9px 20px' }}>Delete</button>
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
                                        </Carousel>;
                                    </>
                                    :
                                    <>

                                    </>
                                }

                                <div>
                                    <div className='text-white book-consultation-bar w-100 d-flex justify-content-center'>
                                        <p className='request d-flex justify-content-between mb-5'>
                                            <a href={`/designer-profile?user_id=${singleDesign.userId}`} className='text-decoration-none'>
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
                                                <button type='button' className='close react-modal-close' onClick={() => setProfileViewShow(false)} data-dismiss='modal' aria-label='Close'>
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
                                                        <div className="mb-3 text-center">
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

                                        <div className='text-center mb-4' onClick={() => toggleUnderConstruction("Share")}>
                                            <div className="action-button-designs bg-white">
                                                <IoShareSocial className="text-black mt-2" size={30} />
                                            </div>
                                            <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Share</div>
                                        </div>
                                    </>
                                }

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
                    <button type='button' className='close react-modal-close description-close' onClick={() => setDescriptionShow(false)} data-dismiss='modal' aria-label='Close'>
                        <IoCloseOutline color="#7e7e7e" size={25} />
                    </button>
                </Modal.Header>

                <Modal.Body className='card-description d-flex align-items-center'>
                    <p className='text-white fw-400 p-3 fs-14 mb-0'>{singleDesign.description}</p>
                </Modal.Body>
            </Modal>

            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
                id="under-construction"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-left fs-22 mt-2'>{modalHeading}</h5>
                    <button type='button' className='close react-modal-close' onClick={() => setUnderConstructionShow(false)} data-dismiss='modal' aria-label='Close'>
                        <IoCloseOutline color="#7e7e7e" size={25} />
                    </button>
                </Modal.Header>

                <Modal.Body className='pt-2'>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default PortfolioGrid;