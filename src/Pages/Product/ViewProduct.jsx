import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { GoBookmark, GoHeart, GoAlertFill, GoShareAndroid } from 'react-icons/go';
import 'Assets/styles/Product/ViewProduct/style.css';
import GoBack from 'Components/Shared/GoBack';
import GetSingleProductData from 'Utils/GetSingleProductData';
import toast from 'react-hot-toast';
import ImageSlider from 'Components/Shared/ImageSlider';
import { Card, CardBody } from 'reactstrap';
import LoadingPage from 'Components/Shared/LoadingPage';
import { useCookies } from 'react-cookie';
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';
import axios from 'axios';

const ViewProduct = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState('');
    const [productLoading, setProductLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [reloadCount, setReloadCount] = useState(0);
    const [activeImage, setActiveImage] = useState('');
    const [commentsTabShow, setCommentsTabShow] = useState(true);
    const [reviewsTabShow, setReviewsTabShow] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);
    const [userWishlist, setUserWishlist] = useState(false);
    const currentUser = cookies.currentUser;

    const navigate = useNavigate();

    const handleActiveImageChange = (image) => {
        setActiveImage(image);
        // You can perform additional actions when the active image changes
    };

    const fetchData = async (e) => {
        try {
          const productData = await GetSingleProductData(e);
          if (productData.id) {
            setProduct(productData);
            setProductLoading(false);
            setImages(productData.image_urls);
            setActiveImage(productData.image_urls[0].image_url);
            var wishlist_user_ids = productData.wishlist_user_ids;
            setUserWishlist(wishlist_user_ids.includes(currentUser));
          } else {
            setProductLoading(false);
            toast.error('Product does not exist!');
            navigate('/user/profile');
          }
          // Update state or perform other logic with productData
        } catch (error) {
            toast.error('Product item does not exist!');
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

    async function wishlistUpdate(e) {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'wishlist/update', e).then((response) => {
          const success = response.data.status;
          if (success == 'Success') {
            fetchData(productId);
          } else {
            toast.error('Something went wrong, please contact the administrator!');
          }
        }).catch((error) => {
          toast.error('Something went wrong, please contact the administrator!');
        });
    }

    useEffect(() => {
        fetchData(productId);
    }, [reloadCount]);

    return (
        <Layout>
            {productLoading ?
                <LoadingPage />
                :
                <section id="single-product" className='py-5 px-2'>
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
                                        <div className="single-image-slider" style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'product/'+activeImage+")"}}>

                                        </div>
                                        <ImageSlider type="product" images={images} onActiveImageChange={handleActiveImageChange} />
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
                                                {/* <div className='mb-3 d-flex portfolio-designer'>
                                                    {product.user.image ? (
                                                        <div
                                                            className='designer-photo'
                                                            style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${product.user.image})` }}
                                                        ></div>
                                                        ) : (
                                                        <div
                                                            className='designer-photo'
                                                            style={{ backgroundImage: `url(${product.user.gender === 'Female' ? FemalePlaceholder : MalePlaceholder })` }}
                                                        ></div>
                                                    )}
                                                    <div className="designer-info mx-2">
                                                        <p className="text-black fs-18 fw-600 mb-0">{product.user.first_name && product.user.first_name != "" ? product.user.first_name : "-"} {product.user.last_name && product.user.last_name != "" ? product.user.last_name : "-"}</p>
                                                        {currentUser !== product.user.id ?
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
                                                <div>
                                                    <h2 className="fw-600 fs-30">{product.name ?? "-"}</h2>
                                                </div>
                                                <div>
                                                    <div className="action-button bg-smgray me-2">
                                                        <GoShareAndroid className="text-black" />
                                                    </div>
                                                    {userWishlist ?
                                                        <div className="action-button bg-gold me-2" onClick={function() { wishlistUpdate({user_id: currentUser, product_id: product.id}); }}>
                                                            <GoHeart className="text-white" />
                                                        </div>
                                                        :
                                                        <div className="action-button bg-smgray me-2" onClick={function() { wishlistUpdate({user_id: currentUser, product_id: product.id}); }}>
                                                            <GoHeart className="text-black" />
                                                        </div>
                                                    }
                                                    <div className="action-button bg-smgray">
                                                        <GoBookmark className="text-black" />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg="12">
                                                <div className="mb-4">
                                                    {product.categories ?
                                                        <>
                                                            {product.categories.length > 0 ?
                                                                <>
                                                                    {product.categories.map((category, index) => (
                                                                        <span className="design-tag bg-light fs-12">
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
                                                <p className="mb-4">
                                                    {product.description ?? "-"}
                                                </p>
                                                
                                                <p className="mb-2"><strong>Colors</strong></p>
                                                <div className="mb-4">
                                                    {product.colors ?
                                                        <>
                                                            {product.colors.length > 0 ?
                                                                <>
                                                                    {product.colors.map((color, index) => (
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
                                                <p className="mb-2"><strong>Certifications</strong></p>
                                                <div className="mb-4">
                                                    {product.certifications ?
                                                        <>
                                                            {product.certifications.length > 0 ?
                                                                <>
                                                                    {product.certifications.map((certification, index) => (
                                                                        <p className="mb-2">
                                                                            - {certification}
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
                                <p className="mb-2"><strong>Process Insights</strong></p>
                                <p className="mb-4">{product.seller?.fabric_process_insights ?? "-"}</p>

                                <p className="mb-2"><strong>Pricing Structure</strong></p>
                                <p className="mb-4">{product.seller?.pricing_structure ?? "-"}</p>
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

export default ViewProduct;