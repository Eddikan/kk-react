import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { GoBookmark, GoHeart, GoAlertFill, GoShareAndroid } from 'react-icons/go';
import 'Assets/styles/Portfolio/ViewPortFolio/style.css';
import GoBack from 'Components/Shared/GoBack';
import GetSinglePortfolioData from 'Utils/GetSinglePortfolioData';
import toast from 'react-hot-toast';
import ImageSlider from 'Components/Shared/ImageSlider';
import { Card, CardBody } from 'reactstrap';
import LoadingPage from 'Components/Shared/LoadingPage';
import UserPlaceholder from 'Assets/images/placeholders/user.png';
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
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);
    const currentUser = cookies.currentUser;

    const navigate = useNavigate();

    const handleActiveImageChange = (image) => {
        setActiveImage(image);
        // You can perform additional actions when the active image changes
    };

    const fetchData = async (e) => {
        try {
          const portfolioData = await GetSinglePortfolioData(e);
          if (portfolioData.id) {
            setPortfolio(portfolioData);
            setPortfolioLoading(false);
            setImages(portfolioData.image_urls);
            setActiveImage(portfolioData.image_urls[0].image_url);
          } else {
            setPortfolioLoading(false);
            toast.error('Portfolio item does not exist!');
          }
          // Update state or perform other logic with portfolioData
        } catch (error) {
            toast.error('Portfolio item does not exist!');
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
                            <Col lg={6}>
                                {images && images.length > 0 ?
                                    <>
                                        <div className="single-image-slider" style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'portfolio/'+activeImage+")"}}>

                                        </div>
                                        <ImageSlider images={images} onActiveImageChange={handleActiveImageChange} />
                                    </>
                                    
                                    :
                                    null
                                }
                            </Col>
                            <Col lg={6}>
                                <Card className="h-100">
                                    <CardBody>
                                        <Row>
                                            <Col lg="12" className="d-flex justify-content-between">
                                                <div className='mb-3 d-flex portfolio-designer'>
                                                    {portfolio.user.image ? (
                                                        <div
                                                            className='designer-photo'
                                                            style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${portfolio.user.image})` }}
                                                        ></div>
                                                        ) : (
                                                        <div
                                                            className='designer-photo'
                                                            style={{ backgroundImage: `url(${portfolio.user.gender === 'Female' ? FemalePlaceholder : MalePlaceholder })` }}
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
                                                    <div className="action-button bg-smgray me-2">
                                                        <GoHeart className="text-black" />
                                                    </div>
                                                    <div className="action-button bg-smgray">
                                                        <GoBookmark className="text-black" />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg="12">
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
                                                <p className="mb-2"><strong>Season</strong></p>
                                                <p className="mb-4">{portfolio.season ?? "-"}</p>
                                                
                                                <p className="mb-2"><strong>Colors</strong></p>
                                                <div className="mb-4">
                                                    {portfolio.colors ?
                                                        <>
                                                            {portfolio.colors.length > 0 ?
                                                                <>
                                                                    {portfolio.colors.map((color, index) => (
                                                                        <p className="mb-2">
                                                                            - {color}
                                                                        </p>
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
                                                <p className="mb-2"><strong>Materials</strong></p>
                                                <div className="mb-4">
                                                    {portfolio.materials ?
                                                        <>
                                                            {portfolio.materials.length > 0 ?
                                                                <>
                                                                    {portfolio.materials.map((material, index) => (
                                                                        <p className="mb-2">
                                                                            - {material}
                                                                        </p>
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
                            <Col lg="12" className='mt-4'>
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
                            </Col>
                        </Row>
                    </Container> 
                </section>
            }
        </Layout>
    );
};

export default ViewPortFolio;