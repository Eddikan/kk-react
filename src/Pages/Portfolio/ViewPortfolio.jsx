import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { GoBookmark, GoHeart, GoAlertFill, GoShareAndroid } from 'react-icons/go';
import 'Assets/styles/Portfolio/ViewPortFolio/style.css';
import GoBack from 'Components/Shared/GoBack';
import GetSinglePortfolioData from 'Utils/GetSinglePortfolioData';
import toast from 'react-hot-toast';
import ImageSlider from 'Components/Shared/ImageSlider';
import { Card, Modal } from 'react-bootstrap';
import LoadingPage from 'Components/Shared/LoadingPage';
import { AiOutlinePlus, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { FaUserCircle } from "react-icons/fa";
import { CiFaceSmile } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { LiaSmileBeam } from "react-icons/lia";
import { IoIosAttach } from "react-icons/io";
import { VscSend } from "react-icons/vsc";
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import { useCookies } from 'react-cookie';
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';
import { BsArrowUpRightSquare } from "react-icons/bs";
import { AiOutlineMessage } from "react-icons/ai";

const ViewPortFolio = () => {
    const { portfolioId } = useParams();
    const [portfolio, setPortfolio] = useState('');
    const [portfolioLoading, setPortfolioLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [reloadCount, setReloadCount] = useState(0);
    const [activeImage, setActiveImage] = useState('');
    const [commentsTabShow, setCommentsTabShow] = useState(true);
    const [reviewsTabShow, setReviewsTabShow] = useState(true);
    const [askAQuestion, setAskAQuestion] = useState(false);
    const [formStatus, setFormStatus] = useState('standby');
    const [askQuestionShow, setAskQuestionShow] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');


    const currentUser = cookies.currentUser;

    const navigate = useNavigate();

    const handleActiveImageChange = (image) => {
        setActiveImage(image);
        // You can perform additional actions when the active image changes
    };

    const askQuestionModal = (e) => {
        setAskAQuestion(true);
    };

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
        console.log("Clicked! ", message);
        console.log("underConstructionShow! ", underConstructionShow);

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
            // Update state or perform other logic with portfolioData
        } catch (error) {
            toast.error('Portfolio item does not exist!');
            navigate('/user/profile');
            // Handle the error, if needed
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
                                                    <p className="mb-4 fs-16">
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
                                                    </div>

                                                    <div>
                                                        <div>
                                                            <div className="cursor-pointer" onClick={() => toggleUnderConstruction("Chat Designer")}>
                                                                <AiOutlineMessage className='me-2' color='#caa533' />Chat Designer
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                                <span>
                                                    <p className='btn btn-primary mt-4 mb-0 cursor-pointer fs-16 fw-400 bg-transparent text-black'
                                                        onClick={() => askQuestionModal(true)}
                                                        style={{ minWidth: '216px' }}>Request A Quote</p>
                                                </span>

                                                <span className='w-100'>
                                                    <a href="/appointment/schedule" className='btn mt-4 ms-3 btn-primary fs-16 fw-400'>Schedule A Consultation</a>
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


                                        <span className="cursor-pointer" onClick={() => toggleUnderConstruction("Review Item")}>
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
                                                <p className="fs-20 text-black no-available">No available reviews at this time</p>
                                            </div>
                                        </>
                                        :
                                        null
                                    }
                                </Col>

                                {askAQuestion ?
                                    <>

                                        <Card className='width-chat-card px-0'>
                                            <Card.Header className='header-chat bg-white'>
                                                <div className='d-flex justify-content-between'>
                                                    <div>
                                                        <span className='fw-500'>Dave Napoles</span>
                                                        <span className='ms-2 active-now fs-14 fw-400'>Active Now</span>
                                                    </div>
                                                    <div className="cursor-pointer" onClick={() => setAskAQuestion(false)}>
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

                                                <div className='mt-5 mb-4 text-right d-flex'>


                                                    <div>
                                                        <div className='time-chat-box fs-14 fw-400'>3:30 PM
                                                            <span className='ms-2 you-chat-box fw-600 fs-14'>You</span></div>
                                                        <div className='mt-2 welcome-chat'>
                                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                                                        </div>
                                                    </div>

                                                    <div className=' d-flex align-items-center portfolio-designer ms-3'>
                                                        {portfolio.user.image && (
                                                            <div
                                                                className='designer-photo'
                                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${portfolio.user.image})` }}
                                                            ></div>
                                                        )}
                                                    </div>


                                                </div>

                                                <div>
                                                    <span>
                                                        <FaUserCircle />
                                                        <span className='name-chat'>Dave Napoles</span>
                                                        <span className='ms-2 time-chat fw-400 fs-14'>4:00 PM</span>
                                                    </span>
                                                </div>

                                                <div className='mt-3'>
                                                    <input type="text" className='form-control' />
                                                </div>

                                                <div className='mt-3 d-flex justify-content-between'>

                                                    <div className='d-flex'>
                                                        <div className='cursor-pointer'><LiaSmileBeam className='me-2' /></div>
                                                        <div className='cursor-pointer'><IoIosAttach /></div>
                                                    </div>
                                                    <div>
                                                        <div className="cursor-pointer" onClick={() => toggleUnderConstruction("Send Message")}>
                                                            Send<VscSend className='ms-1' />
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

                    </section>
                </>
            }

        </Layout>
    );
};

export default ViewPortFolio;