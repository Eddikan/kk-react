import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';
import Layout from 'Components/Layout/Layout';
import FormControl from 'react-bootstrap/FormControl';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import toast from 'react-hot-toast';
import GoBack from '../Components/Shared/GoBack';
import GetSinglePortfolioData from 'Utils/GetSinglePortfolioData';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../Assets/styles/Design/style.css';
import UserPlaceholder from 'Assets/images/user.png';
import userEvent from '@testing-library/user-event';

const ViewDesign = (props) => {
    const navigate = useNavigate();
    const [designer, setDesigner] = useState('');
    const [reloadCount, setReloadCount] = useState(0);

    const [portfolio, setPortfolio] = useState('');
    const [activeImage, setActiveImage] = useState('');
    const [images, setImages] = useState([]);
    const [portfolioLoading, setPortfolioLoading] = useState(true);

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const { designerId } = useParams();
    const { portfolioId } = useParams();
    const [design, setDesign] = useState('');
    const currentUser = cookies.currentUser;
    const token = cookies.token;

    const fetchData = async (e) => {
        try {
            const portfolioData = await GetSinglePortfolioData(e);
            if (portfolioData) {
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
                // navigate('/user/profile');
            }
        } catch (error) {
            toast.error('Portfolio item does not exist!');
            // navigate('/user/profile');
        }
    };

    useEffect(() => {
        fetchData(portfolioId);
    }, [reloadCount]);

    return (
        <Layout>
            <div className='py-5 px-2'>
                <section>
                    <Container>
                        <Row className='mb-3'>
                            <Col lg="12">
                                {/* <a href={`/designer-profile?user_id=${singleDesign.userId}`} className='text-decoration-none'> */}
                                <div className='d-flex user-image mb-4'>

                                    {/* {portfolio?.user?.image !== '' && portfolio?.user?.image !== null ? (
                                        <div
                                            className='user-photo'
                                            style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${portfolio?.user?.image})` }}
                                        >
                                        </div>
                                    ) : (
                                        <img src={UserPlaceholder} className='placeholder-img' alt="User Placeholder" />
                                    )} */}

                                    <div>
                                        <div className='modal-title text-left mb-1 fs-18 fw-600 text-black'>
                                            {portfolio?.name}</div>
                                        <div>
                                            {portfolio.tags ?
                                                <>
                                                    {portfolio.tags.length > 0 ?
                                                        <>
                                                            {portfolio.tags.map((tag, index) => (
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
                                    </div>
                                </div>
                                {/* </a> */}
                            </Col>

                            <Col className='position-relative'>
                                {images.map((image, index) => {

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

                                <div>
                                    <div className='text-white book-consultation-bar w-100 d-flex justify-content-center'>
                                        <p className='request d-flex justify-content-between mb-5'>
                                            {/* <a href={`/designer-profile?user_id=${singleDesign.userId}`} className='text-decoration-none'> */}
                                            <div className='d-flex justify-content-center align-items-center user-image'>

                                                {/* {singleDesign.image !== '' && singleDesign.image !== '-' ? (
                                                        <div
                                                            className='user-photo'
                                                            style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                                        >
                                                        </div>
                                                    ) : (
                                                        <img src={UserPlaceholder} className='placeholder-img' />
                                                    )} */}

                                                <div>
                                                    <div className='modal-title text-left fs-20 fw-600 text-white'>{portfolio?.name}</div>
                                                    <div>
                                                        {portfolio.tags ?
                                                            <>
                                                                {portfolio.tags.length > 0 ?
                                                                    <>
                                                                        {portfolio.tags.map((tag, index) => (
                                                                            <span className="design-tags bg-light fs-14 categories-color text-black mb-3">
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
                                            {/* </a> */}


                                            {/* {isDesignCurrentUser ?
                                                null
                                                :
                                                <> */}
                                            <div className='btn-book-bar'>

                                                <button className='btn btn-book-consultation'>Sign up to view more</button>
                                            </div>
                                            {/* </>
                                            } */}
                                        </p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </div>
        </Layout >
    );
};

export default ViewDesign;