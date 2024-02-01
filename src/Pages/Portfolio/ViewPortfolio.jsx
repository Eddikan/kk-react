import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';
import LoadingPage from 'Components/Shared/LoadingPage';
import { GoHeart, GoAlertFill, GoShareAndroid } from 'react-icons/go';
import 'Assets/styles/Portfolio/ViewPortFolio/style.css';
import { ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import GoBack from 'Components/Shared/GoBack';
import GetSinglePortfolioData from 'Utils/GetSinglePortfolioData';
import toast from 'react-hot-toast';
import { Rating } from 'react-simple-star-rating';
import ImageSlider from 'Components/Shared/ImageSlider';
import { Card, Modal } from 'react-bootstrap';
import { IoCloseOutline, IoVideocam } from "react-icons/io5";
import { LiaSmileBeam } from "react-icons/lia";
import { IoIosAttach } from "react-icons/io";
import { VscSend } from "react-icons/vsc";
import { useCookies } from 'react-cookie';
import { BsArrowUpRightSquare } from "react-icons/bs";
import { AiFillMessage } from "react-icons/ai";
import { PiNotepadFill } from "react-icons/pi";
import User from '../../Assets/images/user.png';

const ViewPortFolio = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);
    const { portfolioId } = useParams();
    const [images, setImages] = useState([]);
    const [reloadCount, setReloadCount] = useState(0);
    const [portfolio, setPortfolio] = useState('');
    const [activeImage, setActiveImage] = useState('');
    const [modalHeading, setModalHeading] = useState('');
    const [chatBox, setChatBox] = useState(false);
    const [reviewsTabShow, setReviewsTabShow] = useState(true);
    const [commentsTabShow, setCommentsTabShow] = useState(true);
    const [reviewItemModal, setReviewItemModal] = useState(false);
    const [portfolioLoading, setPortfolioLoading] = useState(true);
    const [requestAQuoteModal, setRequestAQuoteModal] = useState(false);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);

    const currentUser = cookies.currentUser;
    const navigate = useNavigate();

    const handleActiveImageChange = (image) => {
        setActiveImage(image);
    };

    const chatBoxModal = (e) => {
        setChatBox(true);
    };

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    function toggleReviewItem(message) {
        setReviewItemModal(true);
        setModalHeading(message);
    }

    function toggleRequestAQuote(message) {
        setRequestAQuoteModal(true);
        setModalHeading(message);

    }

    const fetchData = async (e) => {
        try {
            const portfolioData = await GetSinglePortfolioData(e);
            if (portfolioData.id) {
                setPortfolio(portfolioData);
                setPortfolioLoading(false);
                setImages(portfolioData.image_urls);
                if (portfolioData.image_urls?.[0]?.image_url) {
                    setActiveImage(process.env.REACT_APP_STORAGE_URL + 'portfolio/' + portfolioData.image_urls[0].image_url);
                } else {
                    setActiveImage(PlaceholderImage);
                }

            } else {
                setPortfolioLoading(false);
                toast.error('Portfolio item does not exist!');
                navigate('/user/profile');
            }
        } catch (error) {
            toast.error('Portfolio item does not exist!');
            navigate('/user/profile');
        }
    };

    const showTab = (tab) => {
        if (tab == "comments") {
            setCommentsTabShow(true);
            setReviewsTabShow(false);
        } else if (tab === "reviews") {
            setReviewsTabShow(true);
            setCommentsTabShow(false);
        }
    }

    useEffect(() => {
        fetchData(portfolioId);
    }, [reloadCount]);

    return (
        <Layout>
            {portfolioLoading ?
                <LoadingPage />
                :
                <>
                    <section id="single-portfolio" className='py-5 px-2'>
                        <Container>
                            <Row>
                                <Col lg="12" className='text-right'>
                                    <GoBack fallBack="/user/profile" />
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={5}>
                                    {images && images.length > 0 ?
                                        <>
                                            <div className="single-image-slider mb-4" style={{ backgroundImage: "url(" + activeImage + ")" }}>
                                            </div>
                                            <ImageSlider images={images} onActiveImageChange={handleActiveImageChange} />
                                        </>
                                        :
                                        <div className="single-image-slider" style={{ backgroundImage: "url(" + activeImage + ")" }}>

                                        </div>
                                    }
                                </Col>
                                <Col lg={7}>
                                    <Card className="height-portfolio">
                                        <Card.Body>
                                            <Row>
                                                <Col lg="12" className="d-flex justify-content-between">
                                                    <div className='mb-0 d-flex portfolio-designer'>
                                                        {/* {portfolio.user.image ? (
                                                        <div className='designer-photo' style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${portfolio.user.image})` }}
                                                        >
                                                        </div>
                                                    ) : (
                                                        <div className='designer-photo' style={{ backgroundImage: `url(${portfolio.user.gender === 'Female' ? FemalePlaceholder : MalePlaceholder})` }}
                                                        ></div>
                                                    )}
                                                    <div className="designer-info mx-2">
                                                        <p className="text-black fs-18 fw-600 mb-0">{portfolio.user.first_name && portfolio.user.first_name != "" ? portfolio.user.first_name : "-"} {portfolio.user.last_name && portfolio.user.last_name != "" ? portfolio.user.last_name : "-"}</p>
                                                        {currentUser !== portfolio.user.id ?
                                                            <>
                                                                <a className='text-decoration-none fs-14'>Follow</a>
                                                            </>
                                                            :
                                                            <>
                                                                <a className='text-decoration-none fs-14'>You</a>
                                                            </>
                                                        }
                                                    </div>
                                                </div> */}
                                                        <h2 className="fw-600 fs-30">{portfolio.name ?? "-"}</h2>
                                                    </div>
                                                    <div>
                                                        <div className="action-button bg-smgray" onClick={() => toggleUnderConstruction("Share Portfolio")}>
                                                            <GoShareAndroid className="text-black" />
                                                        </div>
                                                        {/* <div className="action-button bg-smgray" onClick={() => toggleUnderConstruction("Add to wishlist")}>
                                                            <GoHeart className="text-black" />
                                                        </div> */}
                                                    </div>

                                                </Col>

                                                <Col lg="12">
                                                    <div className="mb-4">
                                                        {portfolio.tags ?
                                                            <>
                                                                {portfolio.tags.length > 0 ?
                                                                    <>
                                                                        {portfolio.tags.map((tag, index) => (
                                                                            <span className="design-tag bg-light fs-14 categories-color">
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
                                                    <p className="mb-4 fs-16 line-height-24">
                                                        {portfolio.description ?? "-"}
                                                    </p>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>

                                    <Col lg={12} className='mt-3'>
                                        <Card className="height-portfolio">
                                            <Card.Body>
                                                <div className='d-flex justify-content-between'>
                                                    <div className='mb-0 d-flex portfolio-designer'>
                                                        {portfolio.user.image ? (
                                                            <div className='designer-photo' style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${portfolio.user.image})` }}
                                                            >
                                                            </div>
                                                        ) : (
                                                            <div className='designer-photo' style={{ backgroundImage: `url(${portfolio.user.gender === 'Female' ? FemalePlaceholder : MalePlaceholder})` }}
                                                            ></div>
                                                        )}
                                                        <div className="designer-info mx-2">
                                                            <p className="text-black fs-16 fw-600 mb-0">{portfolio.user.first_name && portfolio.user.first_name != "" ? portfolio.user.first_name : "-"} {portfolio.user.last_name && portfolio.user.last_name != "" ? portfolio.user.last_name : "-"}</p>
                                                            {currentUser !== portfolio.user.id ?
                                                                <>
                                                                    <a className='text-decoration-none fs-12 follow'>Follow</a>
                                                                </>
                                                                :
                                                                <>
                                                                    <a className='text-decoration-none fs-12 you'>You</a>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div>
                                                            <div className="cursor-pointer" onClick={() => chatBoxModal("Chat Designer")}>
                                                                <AiFillMessage className='me-2 mb-1' color='#caa533' />Chat Designer
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <span>
                                                    <p className='btn request-quote-btn mt-4 mb-0 cursor-pointer fs-16 fw-400 bg-transparent text-black request-a-quote'
                                                        onClick={() => toggleRequestAQuote(true)}
                                                    >
                                                        <PiNotepadFill color="#000000" className='me-2 pi-note-pad' size="20" />
                                                        Request A Quote
                                                    </p>
                                                </span>

                                                <span className='w-100'>
                                                    <a
                                                        href={`/appointment/schedule/${portfolio.designer.id}`}
                                                        className='btn mt-4 ms-3 btn-primary fs-16 fw-400 consultation-btn'
                                                    >
                                                        <IoVideocam color="#ffffff" className='me-2' size="20" />Schedule A Consultation</a>
                                                </span>

                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Col>


                                {/* <Col lg={12} className="mt-4">
                                <p className="mb-2"><strong>Lead Time</strong></p>
                                <p className="mb-4">{portfolio.designer?.lead_time ?? "-"}</p>

                                <p className="mb-2"><strong>Pricing Structure</strong></p>
                                <p className="mb-4">{portfolio.designer?.pricing_structure ?? "-"}</p>
                            </Col> */}
                                <Col lg="12" className='mt-5'>
                                    {/* <span className={`text-black cursor-pointer me-5 mb-3 fs-16 ${commentsTabShow ? 'fw-600' : ''}`} onClick={function () { showTab("comments"); }}>Comments</span> */}
                                    <span className={`text-black reviews-product cursor-pointer me-5 mb-3 fs-16 ${reviewsTabShow ? 'fw-400' : ''}`} onClick={function () { showTab("reviews"); }}>Customer Reviews


                                        <span className="cursor-pointer reviews-tooltip" onClick={() => toggleReviewItem()}>
                                            <div className='tooltip-content'>
                                                <span className="reviews-tooltiptext fs-14">Write Review</span>
                                            </div>
                                            <BsArrowUpRightSquare className='ms-2' color="#caa533" />
                                        </span>

                                    </span>
                                    <hr className='mt-2' />
                                    {/* {commentsTabShow ?
                                    <>
                                        <div className="text-center">
                                            <GoAlertFill size="60px" color="#000000" className="mb-3 mt-2" />
                                            <p className="fs-20 text-black">No available comments at this time</p>
                                        </div>
                                    </>
                                    :
                                    null
                                } */}

                                    {reviewsTabShow ?
                                        <>
                                            <div className="text-center">
                                                <GoAlertFill size="60px" className="mb-3 mt-2 text-gold" />
                                                <p className="fs-20 text-black">No available reviews at this time</p>
                                            </div>
                                        </>
                                        :
                                        null
                                    }
                                </Col>

                                {chatBox ?
                                    <>
                                        <Card className='width-chat-card px-0'>
                                            <Card.Header className='header-chat bg-white'>
                                                <div className='d-flex justify-content-between'>
                                                    <div>
                                                        <span className="fs-14 fw-500 mb-0 name-of-user-chat">
                                                            {portfolio.user.first_name && portfolio.user.first_name != "" ? portfolio.user.first_name : "-"} &nbsp;
                                                            {portfolio.user.last_name && portfolio.user.last_name != "" ? portfolio.user.last_name : "-"}
                                                        </span>
                                                        <span className='ms-3 active-now fs-14 fw-400'>Active Now</span>
                                                    </div>
                                                    <div className="cursor-pointer" onClick={() => setChatBox(false)}>
                                                        <IoCloseOutline color="#39393A" />
                                                    </div>
                                                </div>
                                            </Card.Header>

                                            <Card.Body >
                                                <div className='product-portfolio-image'>
                                                    <span className='d-flex'>
                                                        {images && images.length > 0 ?
                                                            <>
                                                                <div className="single-image-chat" style={{ backgroundImage: "url(" + activeImage + ")" }}>
                                                                </div>
                                                                <span className='name-of-portfolio ms-3 d-flex justify-content-center align-items-center'>{portfolio.name ?? "-"}</span>
                                                            </>
                                                            :
                                                            null
                                                        }
                                                    </span>
                                                </div>

                                                <div>
                                                    <div className='mt-4 d-flex portfolio-designer-chat'>
                                                        {portfolio.user.image && (
                                                            <div
                                                                className='designer-photo'
                                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${portfolio.user.image})` }}
                                                            >
                                                            </div>
                                                        )}
                                                        <div className="designer-info mx-2">
                                                            <div>
                                                                <p className="fs-14 fw-600 mb-0 name-of-user-chat ms-2">{portfolio.user.first_name && portfolio.user.first_name != "" ? portfolio.user.first_name : "-"} {portfolio.user.last_name && portfolio.user.last_name != "" ? portfolio.user.last_name : "-"}
                                                                    <span className='ms-3 fs-14 time-chat fw-400'>2:23 PM</span>
                                                                </p>
                                                            </div>

                                                            <div className='fs-14 ms-2 mt-2 name-of-user-chat'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam.</div>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className='mt-5 mb-4 text-right d-flex'>
                                                    <div>
                                                        <div className='time-chat-box fs-14 fw-400'>3:30 PM
                                                            <span className='ms-2 you-chat-box fw-600 fs-14'>You</span></div>
                                                        <div className='mt-2 welcome-chat'>
                                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                                                        </div>
                                                    </div>

                                                    <img src={User} className='placeholder-chat ms-3' />
                                                </div>

                                                <div className='mt-3'>
                                                    <input type="text" className='form-control' />
                                                </div>

                                                <div className='mt-3 d-flex justify-content-between'>
                                                    <div className='d-flex'>
                                                        <div className='cursor-pointer' onClick={() => toggleUnderConstruction("")}><LiaSmileBeam className='me-2' size={20} /></div>
                                                        <div className='cursor-pointer' onClick={() => toggleUnderConstruction("")}><IoIosAttach size={20} /></div>
                                                    </div>
                                                    <div>
                                                        <div
                                                            className="cursor-pointer fw-500"
                                                            onClick={() => toggleUnderConstruction("Send Message")}
                                                        >
                                                            Send
                                                            <VscSend className='ms-1' />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </>
                                    :
                                    null
                                }
                            </Row>
                        </Container>

                        <Modal
                            show={underConstructionShow}
                            className='modal-preview'
                            fade={false}
                            centered
                            size="sm"
                        >
                            <Modal.Header className="py-0">
                                <h5 className='modal-title text-uppercase text-left'></h5>
                                <button type='button' className='close react-modal-close' onClick={() => setUnderConstructionShow(false)} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
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

                        <Modal
                            show={reviewItemModal}
                            className='modal-preview'
                            fade={false}
                            size="sm"
                        >
                            <ModalHeader className='pt-2 pb-2'>
                                <h5 className='modal-title text-left fs-25 rufina-family fw-600 '>Review Item</h5>
                                <button
                                    type='button'
                                    className='close react-review-items-close'
                                    data-dismiss='modal' aria-label='Close'
                                    onClick={() => setReviewItemModal(false)}
                                >
                                    <span aria-hidden='true'>&times;</span>
                                </button>
                            </ModalHeader>

                            <hr className="mt-0 mb-2" />
                            <Modal.Body className='pt-4 pb-2'>
                                <div className='product-portfolio-image mb-4'>
                                    <span className='d-flex'>
                                        {images && images.length > 0 ?
                                            <>
                                                <div className="single-image-chat" style={{ backgroundImage: "url(" + activeImage + ")" }}>
                                                </div>
                                                <span className='name-of-portfolio ms-3 d-flex justify-content-center align-items-center'>{portfolio.name ?? "-"}</span>
                                            </>
                                            :
                                            null
                                        }
                                    </span>
                                </div>

                                <div className='d-flex mb-2'>
                                    <div className='d-flex justify-content-center align-items-center'>
                                        Product Quality:
                                    </div>

                                    <div className='mx-4'>
                                        <Rating
                                            // initialValue={rating}
                                            readonly={true}
                                            allowFraction={true}
                                            size={30}
                                            className="star-rating"
                                            showTooltip={false}
                                            emptyColor="#cea835"
                                            fillColor="#cea835"
                                        />
                                    </div>

                                    <div className='d-flex justify-content-center align-items-center'>
                                        Excellent
                                    </div>
                                </div>
                                <div className='mb-4'>
                                    <textarea
                                        type="text"
                                        name="description"
                                        className="d-block form-control bg-white"
                                        placeholder='Leave a comment about the product...'
                                    />
                                </div>
                            </Modal.Body>
                            <ModalFooter className=''>
                                <div className='text-right'>
                                    <Button className="cancel-btn me-2" onClick={() => setReviewItemModal(false)}>Cancel</Button>
                                    <Button className="btn-save" onClick={() => { toggleUnderConstruction("Submit"); setReviewItemModal(false); }}>Submit</Button>
                                </div>
                            </ModalFooter>
                        </Modal>

                        <Modal
                            show={requestAQuoteModal}
                            className='modal-preview'
                            fade={false}
                            size="sm"
                        >
                            <ModalHeader className='pt-2 pb-2'>
                                <h5 className='modal-title text-left fs-25 rufina-family fw-600 '>New Quote</h5>
                                <button type='button' className='close react-review-items-close' data-dismiss='modal' aria-label='Close' onClick={() => setRequestAQuoteModal(false)}>
                                    <span aria-hidden='true'>&times;</span>
                                </button>
                            </ModalHeader>
                            <hr className="mt-0 mb-0" />
                            <Modal.Body className='pt-4 pb-2'>
                                <Row>
                                    <Col>
                                        <div className='mb-2'>Title</div>
                                        <div>
                                            <input type="text" className='form-control' name="title" />
                                        </div>

                                        <div className='mt-3 mb-2'>Details</div>
                                        <div>
                                            <textarea
                                                type="text"
                                                name="description"
                                                className="d-block form-control bg-white"
                                                placeholder='Provide design details'
                                            />
                                        </div>

                                        <div
                                            className="image-drop-container-quote cursor-pointer mt-4"
                                        // onDrop={handleDrop}
                                        // onDragOver={handleDragOver}
                                        >
                                            <input
                                                // type="file"
                                                // key={fileInputKey} // Add a key to the file input
                                                id="fileInput"
                                                // onChange={handleFileInput}
                                                className="file-input d-block opacity-0"
                                                accept="image/*"
                                                multiple
                                            />
                                            <label
                                                htmlFor="fileInput"
                                                className="file-label d-block text-center cursor-pointer"
                                            >
                                                <p className="text-black rufina-family fs-18 mb-3 fw-600">Design Preference</p>
                                                <p className="text-black fs-16 mb-3">Share your design preferences to the designer.</p>
                                                <button
                                                    className="btn btn-primary mb-4"
                                                    onClick={() => { toggleUnderConstruction("Upload Design"); setRequestAQuoteModal(false); }}
                                                >
                                                    Upload Design
                                                </button>
                                            </label>
                                        </div>
                                    </Col>
                                </Row>

                            </Modal.Body>
                            <ModalFooter className='mt-4'>
                                <div className='text-right'>
                                    <Button className="cancel-btn me-2" onClick={() => setRequestAQuoteModal(false)}>Cancel</Button>
                                    <Button className="btn-save" onClick={() => { toggleUnderConstruction("Request a Quote"); setRequestAQuoteModal(false); }}>Request a Quote</Button>
                                </div>
                            </ModalFooter>
                        </Modal>
                    </section>
                </>
            }
        </Layout>
    );
};

export default ViewPortFolio;