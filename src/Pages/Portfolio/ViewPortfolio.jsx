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
import { Card, CardBody, ModalHeader, CardFooter, ModalBody, Modal } from 'reactstrap';
import LoadingPage from 'Components/Shared/LoadingPage';
import { AiOutlinePlus, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { FaUserCircle } from "react-icons/fa";
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import { useCookies } from 'react-cookie';
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';

const ViewPortFolio = () => {
    const { portfolioId } = useParams();
    const [portfolio, setPortfolio] = useState('');
    const [portfolioLoading, setPortfolioLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [reloadCount, setReloadCount] = useState(0);
    const [activeImage, setActiveImage] = useState('');
    const [commentsTabShow, setCommentsTabShow] = useState(true);
    const [reviewsTabShow, setReviewsTabShow] = useState(false);
    const [askAQuestion, setAskAQuestion] = useState(false);
    const [formStatus, setFormStatus] = useState('standby');
    const [askQuestionShow, setAskQuestionShow] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);

    const currentUser = cookies.currentUser;

    const navigate = useNavigate();

    const handleActiveImageChange = (image) => {
        setActiveImage(image);
        // You can perform additional actions when the active image changes
    };

    const askQuestionModal = (e) => {
        setAskQuestionShow(true);
    };

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
                                    <CardBody>
                                        <Row>
                                            <Col lg="12" className="d-flex justify-content-between">
                                                <div className='mb-3 d-flex portfolio-designer'>
                                                    {portfolio.user.image ? (
                                                        <div className='designer-photo' style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${portfolio.user.image})` }}
                                                        ></div>
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
                                                    <div className="action-button bg-smgray me-2">
                                                        <GoShareAndroid className="text-black" />
                                                    </div>
                                                    <div className="action-button bg-smgray">
                                                        <GoHeart className="text-black" />
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col lg="12">
                                                <div></div>
                                                <h2 className="fw-600 fs-30">{portfolio.name ?? "-"}</h2>
                                                <div className="mb-4">
                                                    {portfolio.tags ?
                                                        <>
                                                            {portfolio.tags.length > 0 ?
                                                                <>
                                                                    {portfolio.tags.map((tag, index) => (
                                                                        <span className="design-tag bg-light fs-12">
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
                                                <p className="mb-4">
                                                    {portfolio.description ?? "-"}
                                                </p>


                                                <div className='text-center mt-5' >
                                                    <p className='ask-question mb-1 cursor-pointer' onClick={() => askQuestionModal(portfolio.id)}>Ask A Question</p>
                                                </div>

                                                <div className='w-100'>
                                                    <a href="/appointment/schedule" className='btn btn-primary w-100'>Schedule A Consultation</a>
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg={12} className="mt-4">
                                <p className="mb-2"><strong>Lead Time</strong></p>
                                <p className="mb-4">{portfolio.designer?.lead_time ?? "-"}</p>

                                <p className="mb-2"><strong>Pricing Structure</strong></p>
                                <p className="mb-4">{portfolio.designer?.pricing_structure ?? "-"}</p>
                            </Col>
                            {/* <Col lg="12" className='mt-4'>
                                <span className={`text-black cursor-pointer me-5 mb-3 fs-16 ${commentsTabShow ? 'fw-600' : ''}`} onClick={function () { showTab("comments"); }}>Comments</span>
                                <span className={`text-black cursor-pointer me-5 mb-3 fs-16 ${reviewsTabShow ? 'fw-600' : ''}`} onClick={function () { showTab("reviews"); }}>Reviews</span>
                                <hr className='mt-2' />
                                {commentsTabShow ?
                                    <>
                                        <div className="text-center">
                                            <GoAlertFill size="60px" color="#000000" className="mb-3 mt-2" />
                                            <p className="fs-20 text-black">No available comments at this time</p>
                                        </div>
                                    </>
                                    :
                                    null
                                }
                                {reviewsTabShow ?
                                    <>
                                        <div className="text-center">
                                            <GoAlertFill size="60px" color="#000000" className="mb-3 mt-2" />
                                            <p className="fs-20 text-black">No available reviews at this time</p>
                                        </div>
                                    </>
                                    :
                                    null
                                }
                            </Col> */}

                            {/* <Card className='width-chat-card'>
                                <CardBody>
                                    <div>Dave Napoles</div>
                                    <hr />

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
                                            }</span>
                                    </div>
                                    <div className='mt-5 text-right'>
                                        <span>3:30 PM</span>
                                        <span className='ms-2'>You</span>
                                        <br />
                                        <p className='mt-2 welcome-chat'>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
                                    </div>

                                    <div>
                                        <span>
                                            <FaUserCircle />
                                            <span>Dave Napoles</span>
                                        </span>
                                    </div>

                                </CardBody>
                            </Card> */}
                        </Row>



                    </Container>
                </section>
            }
        </Layout>
    );
};

export default ViewPortFolio;