import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from 'Components/Layout/Layout';
import FormControl from 'react-bootstrap/FormControl';
import { GoBookmark, GoHeart, GoAlertFill, GoShareAndroid, GoPencil } from 'react-icons/go';
import 'Assets/styles/Product/ViewProduct/style.css';
import GoBack from 'Components/Shared/GoBack';
import GetSingleProductData from 'Utils/GetSingleProductData';
import toast from 'react-hot-toast';
import ImageSlider from 'Components/Shared/ImageSlider';
import { Form, Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';
import LoadingPage from 'Components/Shared/LoadingPage';
import { IoCloseOutline, IoVideocam } from "react-icons/io5";
import { useCookies } from 'react-cookie';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';
import Loading from 'Components/Shared/Loading';
import { ImLeaf } from 'react-icons/im';
import { Rating } from 'react-simple-star-rating';
import UserPlaceholder from 'Assets/images/user.png';
import { BsArrowUpRightSquare } from "react-icons/bs";
import ResponsiveEmbedVideo from 'Components/Shared/ResponsiveEmbeddedVideo';
import ResponsiveVideo from 'Components/Shared/ResponsiveVideo';
import axios from 'axios';

const initialReviewData = Object.freeze({
    rating: 0,
    content: '',
});

const AdminViewFabrics = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'token', 'userRole','cartItemCount']);
    const { productId } = useParams();
    const [product, setProduct] = useState('');
    const [productPrice, setProductPrice] = useState(0.00);
    const [productLoading, setProductLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [activeImage, setActiveImage] = useState('');
    const [commentsTabShow, setCommentsTabShow] = useState(false);
    const [reviewsTabShow, setReviewsTabShow] = useState(true);
    const [userWishlist, setUserWishlist] = useState(false);
    const [addedToCartShow, setAddedToCartShow] = useState(false);
    const [shareModalShow, setShareModalShow] = useState(false);
    const [productReviews, setProductReviews] = useState([]);
    const [productReviewsLoading, setProductReviewsLoading] = useState(true);
    const [productReviewsPages, setProductReviewsPages] = useState([]);
    const [updateReview, setUpdateReview] = useState(false);
    const [reviewId, setReviewId] = useState('');
    const [addReviewLoading, setAddReviewLoading] = useState(false);
    const [reviewFormData, setReviewFormData] = useState(initialReviewData);
    const [reviewItemModal, setReviewItemModal] = useState(false);
    const [addReviewShow, setAddReviewShow] = useState(false);
    const [reviewText, setReviewText] = useState('Terrible');
    const [modalHeading, setModalHeading] = useState('');
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [unitMeasurement, setUnitMeasurement] = useState(1.00);
    const [yards, setYards] = useState(0.00);
    const [addToCartLoading, setAddToCartLoading] = useState(false);
    const [buyNowLoading, setBuyNowLoading] = useState(false);
    const [isProductCurrentUser, setIsProductCurrentUser] = useState(false);


    const currentUser = cookies.currentUser;
    const token = cookies.token;
    const userRole = cookies.userRole;
    const userDetails = cookies.userDetails;
    const navigate = useNavigate();

    const handleActiveImageChange = (image) => {
        setActiveImage(image);
    };

    // Catch Rating value
    const handlePointerMove = (value, index) => {
        setReviewFormData({
            ...reviewFormData,
            rating: value,
        });
    }

    const handleResetRating = () => {
        // Set the initial value
        setReviewFormData({
            ...reviewFormData,
            rating: 0,
        });
    }

    const toggleAddToCart = (e) => {
        setAddedToCartShow(!addedToCartShow);
    }

    const toggleShareModal = (e) => {
        setShareModalShow(!shareModalShow);
    }

    const toggleAddToReview = (e) => {
        setAddReviewShow(!addReviewShow);

        if (e?.[0]?.image_url) {
            setActiveImage(process.env.REACT_APP_STORAGE_URL + 'product/' + e[0].image_url);
        } else {
            setActiveImage(PlaceholderImage);
        }
    }

    function toggleReviewItem(message) {
        setReviewItemModal(true);
        setModalHeading(message);
    }

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    const handleChange = (e) => {
        const { value, name } = e.target;
        setUnitMeasurement(value);
        setYards(value * 1.09);
        if (product.unit_measurement == "centimeter") {
            setYards(value * 0.01)
        } else if (product.unit_measurement == "meter") {
            setYards(value * 1.096)
        } else if (product.unit_measurement == "inch") {
            setYards(value * 0.027)
        } else if (product.unit_measurement == "feet") {
            setYards(value * 0.333)
        } else if (product.unit_measurement == "yard") {
            setYards(value * 1)
        }
    }

    const handleChangeReview = (e) => {
        const { value, name } = e.target;
        setReviewFormData({
            ...reviewFormData,
            [name]: value,
        });
    }

    const handleSubtract = (e) => {
        var newUnitMeasurement = unitMeasurement - 1;
        setUnitMeasurement(newUnitMeasurement);
        setYards(newUnitMeasurement * 1.09)
    }

    const handleAdd = (e) => {
        var newUnitMeasurement = unitMeasurement + 1;
        setUnitMeasurement(newUnitMeasurement);
        setYards(newUnitMeasurement * 1.09)
    }

    const fetchData = async (e) => {
        try {
            const productData = await GetSingleProductData(e);
            if (productData.id) {
                setReviewFormData({
                    ...reviewFormData,
                    product_id: productData.id,
                    user_id: currentUser
                });
                setProduct(productData);
                setProductLoading(false);
                setImages(productData.image_urls);
                if (productData.price && productData.price > 0) {
                    setProductPrice(Number(productData.price).toFixed(2))
                }
                if (productData.image_urls?.[0]?.image_url) {
                    setActiveImage(process.env.REACT_APP_STORAGE_URL + 'product/' + productData.image_urls[0].image_url);
                } else {
                    setActiveImage(PlaceholderImage);
                }
                var wishlist_user_ids = productData.wishlist_user_ids;
                setUserWishlist(wishlist_user_ids.includes(currentUser));
                if (productData.unit_measurement) {
                    if (productData.unit_measurement == "centimeter") {
                        setYards(0.01)
                    } else if (productData.unit_measurement == "meter") {
                        setYards(1.096)
                    } else if (productData.unit_measurement == "inch") {
                        setYards(0.027)
                    } else if (productData.unit_measurement == "feet") {
                        setYards(0.333)
                    } else if (productData.unit_measurement == "yard") {
                        setYards(1)
                    }
                }

                if (currentUser == productData.user.id) {
                    setIsProductCurrentUser(true);
                } else {
                    setIsProductCurrentUser(false);
                }

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

    async function reviewUpdate() {
        setAddReviewLoading(true);
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'product/review/' + reviewId, reviewFormData).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                toast.success('Review updated successfully!');
                getProductReviews();
                setAddReviewLoading(false);
                toggleAddToReview();
            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
        }).catch((error) => {
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    async function reviewAdd() {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'product/review', reviewFormData).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                toast.success('Review added successfully!');
                getProductReviews();
                setAddReviewLoading(false);
                toggleAddToReview();
            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
        }).catch((error) => {
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    async function addToCart(e) {
        setAddToCartLoading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'cart', e).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                // navigate("/cart");
                toast.success("Fabric added to cart successfully!");
                const currentCartCount = cookies.cartItemCount ?? 0;
                const latestCartItemCount = parseInt(currentCartCount) +  parseInt(e.quantity);
                setCookie('cartItemCount', latestCartItemCount, { path: '/' });

            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
            setAddToCartLoading(false);
        }).catch((error) => {
            setAddToCartLoading(false);
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    async function buyNow(e) {
        setBuyNowLoading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'cart', e).then((response) => {
            const success = response.data.status;
            const data = response.data.data;
            if (success == 'Success') {
                const cart_item_id = data.cart_item.id;
                navigate("/cart?item=" + cart_item_id);
            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
            setBuyNowLoading(false);
        }).catch((error) => {
            toast.error('Something went wrong, please contact the administrator!');
            setBuyNowLoading(false);
        });
    }

    const getProductReview = async (e) => {
        await axios.get(process.env.REACT_APP_API_ENDPOINT + 'product/review/' + e + '?user_id=' + currentUser + '&token=' + token)
            .then((response) => {
                const result = response.data.data;
                if (result) {
                    setReviewFormData({
                        ...reviewFormData,
                        rating: result.rating,
                        content: result.content,
                    });
                    if (result.rating <= 1) {
                        setReviewText('Terrible');
                    } else if (result.rating > 1 && result.rating <= 2) {
                        setReviewText('Bad');
                    } else if (result.rating > 2 && result.rating <= 3) {
                        setReviewText('Average');
                    } else if (result.rating > 3 && result.rating <= 4) {
                        setReviewText('Great');
                    } else if (result.rating > 4 && result.rating <= 5) {
                        setReviewText('Great');
                    }
                }
            }).catch(() => {
                toast.error('Something went wrong, please contact the administrator!');
            });
    }

    const getProductReviews = async () => {
        await axios.get(process.env.REACT_APP_API_ENDPOINT + 'product/' + productId + '/review?user_id=' + currentUser + '&token=' + token)
            .then((response) => {
                const data = response.data;
                const result = data.data;
                const links = data.meta.links;
                if (result) {
                    setProductReviewsLoading(false);
                    setProductReviews(result);
                    const hasCurrentUserReview = result.some(review => review.user_id == currentUser);
                    setUpdateReview(hasCurrentUserReview);
                    if (hasCurrentUserReview) {
                        // Get the id of the first review with user_id equal to currentUser
                        const currentUserReviewId = hasCurrentUserReview
                            ? result.find(review => review.user_id === currentUser).id
                            : null;
                        setReviewId(currentUserReviewId)
                    }

                    if (links) {
                        setProductReviewsPages(links);
                    }
                }
            }).catch(() => {
                toast.error('Something went wrong, please contact the administrator!');
            });
    }

    useEffect(() => {
        fetchData(productId);
        getProductReviews();
    }, []);

    return (
        <Layout>
            {productLoading ?
                <LoadingPage />
                :
                <>
                    {/* <Container fluid>
                        <Row>
                            {isProductCurrentUser ?
                                <>

                                </>
                                :
                                <Col lg="12" className='text-center px-0'>
                                    <div className='this-is-preview bg-gold'>This is a Preview</div>
                                </Col>
                            }
                        </Row>
                    </Container> */}

                    <section id="single-product" className='py-5 px-2'>
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
                                            <ImageSlider type="product" slidesToShow={4} images={images} onActiveImageChange={handleActiveImageChange} />
                                        </>
                                        :
                                        <div className="single-image-slider" style={{ backgroundImage: "url(" + activeImage + ")" }}>
                                        </div>
                                    }
                                    {product.video_demo_type && product.video_demo_type != "" && product.video_demo_url && product.video_demo_url != "" && (
                                        <div className="mt-4">
                                            <>
                                                {
                                                    product.video_demo_type == "Youtube" || product.video_demo_type == "Vimeo" ?
                                                        <>
                                                            <ResponsiveEmbedVideo src={product.video_demo_url} title={product.name} />
                                                        </>
                                                        :
                                                        <>
                                                            <ResponsiveVideo src={process.env.REACT_APP_STORAGE_URL + 'products/videos/' + product.video_demo_url} />
                                                        </>
                                                }
                                            </>
                                        </div>
                                    )}
                                </Col>

                                <Col lg={7}>
                                    <Card>
                                        <Card.Body>
                                            <Row>
                                                <Col lg="12" className="d-flex justify-content-between">
                                                    <div className='mb-3 d-flex portfolio-designer'>
                                                        {product.user.image ? (
                                                            <div
                                                                className='designer-photo'
                                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${product.user.image})` }}
                                                            ></div>
                                                        ) : (
                                                            <div
                                                                className='designer-photo'
                                                                style={{ backgroundImage: `url(${product.user.gender === 'Female' ? FemalePlaceholder : MalePlaceholder})` }}
                                                            ></div>
                                                        )}
                                                        <div className="designer-info mx-2">
                                                            <p className="text-black fs-16 fw-600 mb-0">{product.user.first_name && product.user.first_name != "" ? product.user.first_name : "-"} {product.user.last_name && product.user.last_name != "" ? product.user.last_name : "-"}</p>
                                                            {currentUser !== product.user.id ?
                                                                <>
                                                                    <a className='text-decoration-none fs-12 follow-products'>Follow</a>
                                                                </>
                                                                :
                                                                <>
                                                                    <a className='text-decoration-none fs-12 you-products'>You</a>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>

                                                    {userRole !== 'Admin' &&
                                                        <>
                                                            {isProductCurrentUser ?
                                                                <>
                                                                    <div>
                                                                        <Link to={`/user/center/product/${product.id}/edit`} className="text-decoration-none">
                                                                            <div className="kouture-tooltip">
                                                                                <div className="action-button bg-smgray me-2">
                                                                                    <span className="kouture-tooltiptext fs-14">Edit</span>
                                                                                    <GoPencil className="text-black" />
                                                                                </div>

                                                                            </div>
                                                                        </Link>

                                                                        <div className="kouture-tooltip" onClick={toggleShareModal}>
                                                                            <div className="action-button bg-smgray me-2">
                                                                                <span className="kouture-tooltiptext fs-14">
                                                                                    Share
                                                                                </span>
                                                                                <GoShareAndroid className="text-black" />
                                                                            </div>

                                                                        </div>

                                                                        {userWishlist ?
                                                                            <div className="wishlist-tooltip" onClick={function () { wishlistUpdate({ user_id: currentUser, product_id: product.id }); }}>
                                                                                <div className="action-button bg-gold me-2" >
                                                                                    <span className="wishlist-tooltiptext fs-14">Remove from Wishlist</span>
                                                                                    <GoHeart className="text-white" />
                                                                                </div>
                                                                            </div>
                                                                            :
                                                                            <div className="wishlist-tooltip" onClick={function () { wishlistUpdate({ user_id: currentUser, product_id: product.id }); }}>
                                                                                <div className="action-button bg-smgray me-2">
                                                                                    <span className="wishlist-tooltiptext fs-14">Add to Wishlist</span>
                                                                                    <GoHeart className="text-black" />
                                                                                </div>

                                                                            </div>
                                                                        }
                                                                    </div>

                                                                </>
                                                                :
                                                                <>
                                                                    <div>

                                                                        <div className="kouture-tooltip" onClick={toggleShareModal}>
                                                                            <div className="action-button bg-smgray me-2">
                                                                                <span className="kouture-tooltiptext fs-14">  Share</span>
                                                                                <GoShareAndroid className="text-black" />
                                                                            </div>
                                                                        </div>

                                                                        {userWishlist ?
                                                                            <div className="wishlist-tooltip" onClick={function () { wishlistUpdate({ user_id: currentUser, product_id: product.id }); }}>
                                                                                <div className="action-button bg-gold me-2" >
                                                                                    <span className="wishlist-tooltiptext fs-14">Remove from Wishlist</span>
                                                                                    <GoHeart className="text-white" />
                                                                                </div>
                                                                            </div>
                                                                            :
                                                                            <div className="wishlist-tooltip" onClick={function () { wishlistUpdate({ user_id: currentUser, product_id: product.id }); }}>
                                                                                <div className="action-button bg-smgray me-2" >
                                                                                    <span className="wishlist-tooltiptext fs-14">Add to Wishlist</span>
                                                                                    <GoHeart className="text-black" />
                                                                                </div>

                                                                            </div>
                                                                        }
                                                                    </div>

                                                                </>
                                                            }
                                                        </>
                                                    }
                                                </Col>

                                                <Col lg="12">
                                                    <div className='d-flex align-items-center mb-2'>
                                                        <h2 className="fw-600 fs-25 mb-0 ">{product.name ?? "-"}</h2>
                                                        <div className='d-flex align-items-center'>
                                                            {product.eco_friendly != null && product.eco_friendly != '' && (
                                                                <span className='fs-14 text-no-wrap mx-2 green-leaf-tooltip'>
                                                                    <div className='tooltip-content'>
                                                                        <span className="green-leaf-tooltiptext">Eco-friendly fabric</span>
                                                                    </div>
                                                                    <ImLeaf color="#55d140" />
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {product.categories && product.categories.length > 0 ?
                                                        <div className="mb-3">
                                                            {product.categories.length > 0 ?
                                                                <>
                                                                    {product.categories.map((category, index) => (
                                                                        <span className="design-tag bg-light fs-14 categories-color">
                                                                            {category}
                                                                        </span>
                                                                    ))}
                                                                </>
                                                                :
                                                                null
                                                            }
                                                        </div>
                                                        :
                                                        null
                                                    }
                                                    <div className="mb-3">
                                                        <p className="fw-600 fs-25">${productPrice}<span className="text-muted-product fs-14 d-inline-block vertical-align-middle">/{product.unit_measurement}</span></p>
                                                    </div>
                                                    <hr />
                                                    <div>
                                                        <p className="mb-2 fs-16 fw-600">Description:</p>
                                                        <p className="mb-1 fs-16 fw-400 line-height-24">{product.description ?? "-"}</p>
                                                    </div>
                                                    <hr />
                                                    <div>
                                                        <p className="mb-2 fs-16 fw-600">Care Instructions:</p>
                                                        <p className="mb-1 fs-16 fw-400 line-height-24">{product.care_instructions ?? "-"}</p>
                                                    </div>
                                                    <hr />
                                                    <div>
                                                        <p className="mb-2 fs-16 fw-600">Measurements:</p>
                                                        <Row>
                                                            <Col sm={4}>
                                                                <p className="mb-0 fs-16 fw-400 line-height-24 text-muted">Length</p>
                                                                <p className="mb-1 fs-16 fw-400 line-height-24">{Math.trunc(product.length) ?? "-"} {product.unit_measurement ?? "-"}{product.unit_measurement == 'inch' && product.length > 1 ? 'es' : product.length > 1 ? "s" : null}</p>
                                                            </Col>
                                                            <Col sm={4}>
                                                                <p className="mb-0 fs-16 fw-400 line-height-24 text-muted">Width</p>
                                                                <p className="mb-1 fs-16 fw-400 line-height-24">{Math.trunc(product.width) ?? "-"} {product.unit_measurement ?? "-"}{product.unit_measurement == 'inch' && product.width > 1 ? 'es' : product.width > 1 ? "s" : null}</p>
                                                            </Col>
                                                            <Col sm={4}>
                                                                <p className="mb-0 fs-16 fw-400 line-height-24 text-muted">Weight</p>
                                                                <p className="mb-1 fs-16 fw-400 line-height-24">{Math.trunc(product.weight) ?? "-"} KG per sq. {product.unit_measurement ?? "-"}</p>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <hr />

                                                    {product.colors && product.colors.length > 0 ?
                                                        <>
                                                            <div className="mb-2">
                                                                <p className="mb-1 fs-16 fw-600">Colors:</p>
                                                                {product.colors.map((color) => (
                                                                    <span className="design-tag bg-light fs-14 categories-color">
                                                                        {color}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <hr />
                                                        </>
                                                        :
                                                        null
                                                    }

                                                    {product.certifications && product.certifications.length > 0 ?
                                                        <>
                                                            <div className="mb-2">
                                                                <p className="mb-1 fs-16 fw-600">Certifications (Organic, sustainable, etc):</p>
                                                                {product.certifications.map((certification) => (
                                                                    <span className="design-tag bg-light fs-14 categories-color mw-100">
                                                                        {certification}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <hr />
                                                        </>
                                                        :
                                                        null
                                                    }

                                                    <div>
                                                        <p className="mb-2 fs-16 fw-600">Specifications:</p>
                                                        <Row>
                                                            <Col sm={6}>
                                                                <p className="mb-0 fs-16 fw-400 line-height-24 text-muted">Primary Fiber</p>
                                                                <p className="mb-2 fs-16 fw-400 line-height-24">{product.composition ?? "-"}</p>
                                                            </Col>
                                                            <Col sm={6}>
                                                                <p className="mb-0 fs-16 fw-400 line-height-24 text-muted">Weave</p>
                                                                <p className="mb-2 fs-16 fw-400 line-height-24">{product.weave ?? "-"}</p>
                                                            </Col>
                                                            <Col sm={6}>
                                                                <p className="mb-0 fs-16 fw-400 line-height-24 text-muted">Pattern</p>
                                                                <p className="mb-2 fs-16 fw-400 line-height-24">{product.pattern ?? "-"}</p>
                                                            </Col>
                                                            <Col sm={6}>
                                                                <p className="mb-0 fs-16 fw-400 line-height-24 text-muted">Texture</p>
                                                                <p className="mb-2 fs-16 fw-400 line-height-24">{product.texture ?? "-"}</p>
                                                            </Col>
                                                            <Col sm={6}>
                                                                <p className="mb-0 fs-16 fw-400 line-height-24 text-muted">Opacity</p>
                                                                <p className="mb-2 fs-16 fw-400 line-height-24">{product.opacity ?? "-"}</p>
                                                            </Col>
                                                            <Col sm={6}>
                                                                <p className="mb-0 fs-16 fw-400 line-height-24 text-muted">Stretch</p>
                                                                <p className="mb-2 fs-16 fw-400 line-height-24">{product.stretch ?? "-"}</p>
                                                            </Col>
                                                            <Col sm={6}>
                                                                <p className="mb-0 fs-16 fw-400 line-height-24 text-muted">Drape</p>
                                                                <p className="mb-2 fs-16 fw-400 line-height-24">{product.drape ?? "-"}</p>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <hr />
                                                    {/* <div>
                                                        <p className="mb-2 fs-16 fw-600">Fabric Process Insight</p>
                                                        <p className="mb-4 fs-16 fw-400 line-height-24">{product.seller?.fabric_process_insights ?? "-"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="mb-2 fs-16 fw-600">Pricing Structure</p>
                                                        <p className="mb-4 fs-16 fw-400 line-height-24">{product.seller?.pricing_structure ?? "-"}</p>
                                                    </div> */}

                                                    <div>
                                                        <Row>
                                                            <Col lg="12">
                                                            {userRole !== 'Admin' &&
                                                                    <>
                                                                {!isProductCurrentUser ?
                                                                    <>
                                                                        <p className="mb-2 fs-16 fw-600">Measurement</p>
                                                                        {/* <Button className='btn-outline me-3 text-black border-black bg-black-hover text-white-hover px-5 w-auto min-width-auto' variant='secondary' onClick={() => handleAdd()}>
                                                                            -
                                                                        </Button> */}
                                                                        <FormControl min="1" defaultValue="1" type='number' name='count' onChange={handleChange} className='me-3 d-inline-block counter-input' required />
                                                                        {/* <Button className='btn-outline me-3 text-black border-black bg-black-hover text-white-hover px-5 w-auto min-width-auto' variant='secondary' onClick={() => handleAdd()}>
                                                                            +
                                                                        </Button> */}

                                                                        <span className="fs-18 fw-600">{Number(unitMeasurement)?.toFixed(2)} {
                                                                            product.unit_measurement !== 'inch' && product.unit_measurement !== 'feet'
                                                                                ? product.unit_measurement + 's'
                                                                                : product.unit_measurement === 'feet'
                                                                                    ? product.unit_measurement
                                                                                    : product.unit_measurement + 'es'
                                                                        } {product.unit_measurement != "yard" ? <span className="fs-14 fw-400 text-muted-product">({yards.toFixed(2)} yards)</span> : null}</span>
                                                                        <hr className="mb-4" />
                                                                    </>
                                                                    :
                                                                    null
                                                                }
                                                                </>
                                                            }
                                                            </Col>

                                                            <Col lg="12">
                                                                {userRole !== 'Admin' &&
                                                                    <>
                                                                        {!isProductCurrentUser ?
                                                                            <>
                                                                                {addToCartLoading ?
                                                                                    <Button
                                                                                        className="w-auto me-3 btn-primary fs-16"
                                                                                        type="button"
                                                                                    >
                                                                                        Adding to Cart...
                                                                                    </Button>
                                                                                    :
                                                                                    <Button
                                                                                        className="w-auto me-3 btn-primary fs-16"
                                                                                        onClick={() => addToCart({ user_id: currentUser, product_id: product.id, quantity: unitMeasurement })}
                                                                                    >
                                                                                        Add to Cart
                                                                                    </Button>
                                                                                }
                                                                                {buyNowLoading ?
                                                                                    <Button
                                                                                        className="w-auto me-3 btn-secondary fs-16"
                                                                                        type="button"
                                                                                    >
                                                                                        Adding to Cart...
                                                                                    </Button>
                                                                                    :
                                                                                    <Button
                                                                                        className="bg-gold border-gold text-white w-auto me-3 btn-secondary fs-16"
                                                                                        onClick={() => buyNow({ user_id: currentUser, product_id: product.id, quantity: unitMeasurement })}
                                                                                    >
                                                                                        Buy Now
                                                                                    </Button>
                                                                                }

                                                                            </>
                                                                            :
                                                                            null
                                                                        }
                                                                    </>
                                                                }
                                                                {/* <span className="fw-600 fs-24">${(unitMeasurement * productPrice).toFixed(2)} 
                                                            <span className="fs-16 fw-400 text-muted d-inline-block vertical-align-middle">(Total Price)</span></span> */}
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    {/* <p className="mb-2"><strong>Certifications</strong></p>
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
                                                </div> */}
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col lg="12" className='mt-4'>
                                    {/* <span className={`text-black cursor-pointer me-5 mb-3 fs-16 ${commentsTabShow ? 'fw-600' : ''}`} onClick={function () { showTab("comments"); }}>Comments</span> */}
                                    {/* <div className="d-flex justify-content-between w-100 align-item-center">
                                    <p className={`text-black cursor-pointer me-5 mt-3 mb-0 fs-16 ${reviewsTabShow ? 'fw-400' : ''}`} onClick={function () { showTab("reviews"); }}>Customer Reviews
                                        <BsArrowUpRightSquare className='ms-2' color="#caa533" />
                                    </p>
                                    {updateReview ?
                                        <Button className="w-auto mb-3 btn-primary" onClick={function () { getProductReview(reviewId); toggleAddToReview(); }}>Update Review</Button>
                                        :
                                        <Button className="w-auto mb-3 btn-primary" onClick={function () { toggleAddToReview(); }}>Add Review</Button>
                                    }

                                </div> */}


                                    <span
                                        className={`text-black cursor-pointer me-5 mb-3 fs-16 ${reviewsTabShow ? 'fw-400' : ''}`}
                                        onClick={function () { showTab("reviews"); }}
                                    >
                                        Customer Reviews

                                        {userRole !== 'Admin' &&
                                            <>
                                                {!isProductCurrentUser ?
                                                    <>
                                                        <span className="cursor-pointer reviews-tooltip" onClick={() => toggleAddToReview(product.image_urls)}>
                                                            <div className='tooltip-content'>
                                                                <span className="reviews-tooltiptext fs-14">Write Review</span>
                                                            </div>
                                                            <BsArrowUpRightSquare className='ms-2' color="#caa533" />
                                                        </span>
                                                    </>
                                                    :
                                                    null
                                                }
                                            </>
                                        }
                                    </span>

                                    <hr className='mt-2 mb-4' />
                                    {commentsTabShow ?
                                        <>
                                            <div className="text-center">
                                                <GoAlertFill size="60px" className="mb-3 mt-2 text-gold" />
                                                <p className="fs-20 text-black">No available comments at this time</p>
                                            </div>
                                        </>
                                        :
                                        null
                                    }
                                    {reviewsTabShow ?
                                        <>
                                            {productReviewsLoading ?
                                                <>
                                                    <Loading />
                                                </>
                                                :
                                                <>
                                                    {productReviews && productReviews.length > 0 ?
                                                        <>
                                                            {productReviews.map(({ rating, content, user }, index) => (
                                                                <>
                                                                    <div className="product-review-container mt-4 mb-3">
                                                                        <div className="d-flex">
                                                                            <div className="user">
                                                                                {user.image && user.image != "" ?
                                                                                    <div className="profile-image small" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'user/' + user.image + ")" }}></div>
                                                                                    :
                                                                                    <div className="profile-image small" style={{ backgroundImage: "url(" + UserPlaceholder + ")" }}></div>
                                                                                }
                                                                            </div>
                                                                            <div className="rating">
                                                                                <p className="text-black fs-14 mb-0 text-left">{user.first_name} {user.last_name}</p>
                                                                                <Rating
                                                                                    initialValue={rating}
                                                                                    readonly={true}
                                                                                    allowFraction={true}
                                                                                    size={22}
                                                                                    className="star-rating"
                                                                                    showTooltip={false}
                                                                                    emptyColor="#dddddd"
                                                                                    fillColor="#cea835"
                                                                                />
                                                                                {content && content != "" ?
                                                                                    <p className="mb-0 mt-3">{content}</p>
                                                                                    :
                                                                                    null
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {index + 1 < productReviews.length ?
                                                                        <hr />
                                                                        :
                                                                        null
                                                                    }
                                                                </>
                                                            ))}
                                                        </>
                                                        :
                                                        <div className="text-center">
                                                            <GoAlertFill size="60px" className="mb-3 mt-2 text-gold" />
                                                            <p className="text-black">No available reviews at this time</p>
                                                        </div>
                                                    }
                                                </>
                                            }
                                        </>
                                        :
                                        null
                                    }
                                </Col>
                            </Row>
                        </Container>
                    </section>
                </>
            }
            {/* Share to  */}
            <Modal
                show={shareModalShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button type='button' className='close react-modal-close' onClick={toggleShareModal} data-dismiss='modal' aria-label='Close'>
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-1' />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='fs-22 mb-3'>Share Product</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                            {/* <DateTimePicker onTimeChange={handleTimeChange} onDone={handleDoneTimeChange} availability={currentAvailability} /> */}
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>

            {/* Add to Cart */}
            <Modal
                show={addedToCartShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button type='button' className='close react-modal-close' onClick={toggleAddToCart} data-dismiss='modal' aria-label='Close'>
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-1' />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='text-center fs-25 fw-600 mb-3'>Added to Cart</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                            {/* <DateTimePicker onTimeChange={handleTimeChange} onDone={handleDoneTimeChange} availability={currentAvailability} /> */}
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>

            {/* Add Review Item */}
            <Modal
                show={addReviewShow}
                className='modal-preview'
                fade={false}
                centered
                size="lg"
            >
                <Modal.Header className="pb-0">
                    <h5 className='modal-title text-left fs-22'>{updateReview ? "Update Review" : "Review Item"}</h5>
                    <button type='button' className='close react-modal-close' onClick={toggleAddToReview} data-dismiss='modal' aria-label='Close'>
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>
                </Modal.Header>
                <Modal.Body className=''>
                    <Card>
                        <Card.Body className="text-center p-4">
                            <div className="product-review-container">
                                <div className='product-portfolio-image mb-3'>
                                    <span className='d-flex'>
                                        {images && images.length > 0 ?
                                            <>
                                                <div className="single-image-chat" style={{ backgroundImage: "url(" + activeImage + ")" }}>
                                                </div>
                                                <span className='name-of-portfolio ms-3 d-flex justify-content-center align-items-center'>{product.name ?? "-"}</span>
                                            </>
                                            :
                                            null
                                        }
                                    </span>
                                </div>

                                <div className="text-left mt-3">
                                    <span className="fs-14 me-3">Product Quality:</span> <Rating
                                        initialValue={reviewFormData.rating}
                                        allowFraction={true}
                                        size={25}
                                        className="star-rating"
                                        showTooltip={true}
                                        emptyColor="#dddddd"
                                        fillColor="#cea835"
                                        onClick={handlePointerMove}
                                        tooltipArray={[
                                            'Terrible',
                                            'Terrible',
                                            'Bad',
                                            'Bad',
                                            'Average',
                                            'Average',
                                            'Great',
                                            'Great',
                                            'Excellent',
                                            'Excellent'
                                        ]}
                                        tooltipDefaultText={reviewText}
                                    /* Available Props */
                                    />
                                    <Form.Control
                                        as="textarea"
                                        name="content"
                                        rows={5} // You can adjust the number of rows as needed
                                        value={reviewFormData.content}
                                        placeholder="Leave a comment about the product..."
                                        onChange={handleChangeReview}
                                        className="mt-3"
                                    />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card.Footer className="text-right bg-white px-0 pt-3 ">
                        <button className="btn btn-secondary border-black bg-white text-black me-3" onClick={() => setAddReviewShow(false)} type="button" style={{ minWidth: '100px', padding: '9px 20px' }}>Cancel</button>
                        {updateReview ?
                            <button className="btn btn-primary" type="button" onClick={function () { reviewUpdate(); }} style={{ minWidth: '100px', padding: '9px 20px' }}>{addReviewLoading ? "Updating..." : "Update"}</button>
                            :
                            <button className="btn btn-primary" type="button" onClick={function () { reviewAdd(); }} style={{ minWidth: '100px', padding: '9px 20px' }}>{addReviewLoading ? "Saving..." : "Submit"} </button>
                        }
                    </Card.Footer>
                </Modal.Body>
            </Modal>

            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left fs-25'></h5>
                    <button type='button' className='close react-modal-close' onClick={() => setUnderConstructionShow(false)} data-dismiss='modal' aria-label='Close'>
                        {/* <span aria-hidden='true'>&times;</span> */}
                        <IoCloseOutline color="#7e7e7e" size={25} />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='fs-22 mb-3'>{modalHeading}</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        </Layout>
    );
};

export default AdminViewFabrics;