import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import Layout from 'Components/Layout/Layout';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import toast from 'react-hot-toast';
import GetUserWishlistsData from 'Utils/GetUserWishlistsData';
import LoadingPage from 'Components/Shared/LoadingPage';
import GoBack from 'Components/Shared/GoBack';
import { GoHeart, GoBookmark, GoAlertFill } from "react-icons/go";
import { IoEyeOutline, IoHeartOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';
import UserPlaceholder from 'Assets/images/placeholders/user.png';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const Wishlists = (props) => {
    const navigate = useNavigate();
    const reloadCount = props.reloadCount;
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [wishlists, setWishlists] = useState([]);
    const [wishlistsLoading, setWishlistsLoading] = useState(true);
    const [connectShow, setConnectShow] = useState(false);
    const [addToCartLoading, setAddToCartLoading] = useState(false);
    const [isWishlistCurrentUser, setIsWishlistCurrentUser] = useState(false);
    const [clickedCartButtonIndex, setClickedCartButtonIndex] = useState();

    const [unitMeasurement, setUnitMeasurement] = useState(1.00);

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'token']);
    const currentUser = cookies.currentUser;
    const token = cookies.token;

    const fetchData = async (e) => {
        try {
            const wishlistsData = await GetUserWishlistsData(e);
            if (wishlistsData) {
                setWishlists(wishlistsData);
                setWishlistsLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setWishlistsLoading(false);
            }

            // if (currentUser == wishlistsData.user.id) {
            //     setIsWishlistCurrentUser(false);
            // } else {
            //     setIsWishlistCurrentUser(true);
            // }

        } catch (error) {
            toast.error('An error occured. Please try again or contact the administrator.');
            setWishlistsLoading(false);
        }
    };


    async function addToCart(e) {
        setAddToCartLoading(true);
        setClickedCartButtonIndex(e.index);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'cart', e).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                navigate("/cart");

            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
            setAddToCartLoading(false);
        }).catch((error) => {
            setAddToCartLoading(false);
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    async function wishlistUpdate(e) {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'wishlist/update', e).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                fetchData({ currentUser: currentUser, token: token });
            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
        }).catch((error) => {
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    async function toggleAddViewCount(id) {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'product/view/' + id).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                // toast.success('Fabric saved as draft successfully!');
                // setReloadCount((prevReloadCount) => prevReloadCount + 1);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
        });
    }

    const removeWishlist = (e) => {
        // Assuming wishlists is your array of objects
        setWishlists(prevWishlists => prevWishlists.filter(item => item.id !== e));
    };

    const handleActionClick = (index) => {
        // Toggle the selected item index
        setSelectedItemIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const addDesigner = () => {
        navigate('/designs/add')
    }

    const toggleConnectShow = (e) => {
        setConnectShow(!connectShow);
    }

    useEffect(() => {
        fetchData({ currentUser: currentUser, token: token });
    }, [reloadCount]);


    return (
        <Layout>
            {wishlistsLoading ?
                <LoadingPage />
                :
                <>
                    <section className='py-5 px-2'>
                        <Container>
                            <Row className='mb-3'>
                                <Col lg="8" className=''>
                                    <h2 className='fs-30 fw-600'>Wishlist</h2>
                                </Col>
                                <Col lg="4" className='text-right'>
                                    <GoBack fallBack="/" />
                                </Col>
                            </Row>
                            <div id="profile-designs">
                                {wishlistsLoading ?
                                    <>
                                        <p className='text-center mb-3 mt-3'>
                                            Loading...
                                        </p>
                                    </>
                                    :
                                    <>
                                        {wishlists && wishlists.length > 0 ?
                                            <>
                                                <Row className="designs-row">
                                                    {wishlists.map((wishlist, index) => {
                                                        if (wishlist.product?.image_urls) {
                                                            var wishlist_images = JSON.parse(wishlist.product?.image_urls);
                                                            if (wishlist_images?.[0]) {
                                                                var wishlistImage = process.env.REACT_APP_STORAGE_URL + 'product/' + wishlist_images[0].image_url;
                                                            } else {
                                                                var wishlistImage = PlaceholderImage;
                                                            }
                                                        } else {
                                                            var wishlistImage = PlaceholderImage;
                                                        }

                                                        return (
                                                            <>
                                                                <Col className="designs-grid mb-3" xs="12" md="6" key={index}>
                                                                    <div className="bg-lgray rounded p-3">
                                                                        <div className="portfolio-link">
                                                                            <Row>
                                                                                <Col lg="3" xs="12">
                                                                                    <div className="designs-grid-div w-100 cursor-pointer" onClick={function () { toggleAddViewCount(wishlist.product.id); navigate('/product/' + wishlist.product.id); }} style={{ backgroundImage: "url(" + wishlistImage + ")", minHeight: '140px' }}>

                                                                                    </div>
                                                                                </Col>
                                                                                <Col lg="9" xs="12">
                                                                                    <div className="design-details">
                                                                                        <div className='d-flex align-items-center justify-content-between cursor-pointer' onClick={function () { toggleAddViewCount(wishlist.product.id); navigate('/product/' + wishlist.product.id); }}>
                                                                                            <p className="text-black fs-18 fw-600 mb-0 text-ellipsis">{wishlist.product?.name ?? '-'}</p>
                                                                                            {/* <div className='d-flex align-items-center'>
                                                                                                <span className='fs-14 text-no-wrap mx-2'>
                                                                                                    <IoHeartOutline /> {wishlist.wishlist_count}
                                                                                                </span>
                                                                                                <span className='fs-14 text-no-wrap'>
                                                                                                    <IoEyeOutline /> {wishlist.product?.views}
                                                                                                </span>
                                                                                            </div> */}
                                                                                        </div>
                                                                                        <div className='d-flex align-items-center mt-1' >
                                                                                            {/* {wishlist.user.image ?
                                                                                                <div className='designer-photo-small' style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'user/'+wishlist.user.image+")"}} ></div>
                                                                                                :
                                                                                                <div className='designer-photo-small' style={{ backgroundImage: "url("+UserPlaceholder+")"}} ></div>
                                                                                            }
                                                                                            &nbsp;&nbsp; */}
                                                                                            {/* <p className="text-black fs-14 mb-0">{wishlist.user.first_name && wishlist.user.first_name != "" ? wishlist.user.first_name : "-"} {wishlist.user.last_name && wishlist.user.last_name != "" ? wishlist.user.last_name : "-"}</p> */}
                                                                                            <p className="text-black fs-14 mb-0 wishlist-description">{wishlist.product?.description ?? '-'}</p>
                                                                                        </div>

                                                                                        {/* {isWishlistCurrentUser ?
                                                                                            <> */}
                                                                                        {addToCartLoading && clickedCartButtonIndex == index ? (
                                                                                            <Button
                                                                                                className="w-auto me-3 mt-2 btn-primary fs-16"
                                                                                                type="button"
                                                                                            >
                                                                                                Adding to Cart...
                                                                                            </Button>
                                                                                        ) : (
                                                                                            <Button
                                                                                                className="w-auto me-3 mt-2 btn-primary fs-16"
                                                                                                onClick={() => addToCart({ user_id: currentUser, product_id: wishlist.product.id, quantity: unitMeasurement, index })}
                                                                                            >
                                                                                                Add to Cart
                                                                                            </Button>
                                                                                        )}
                                                                                        {/* </>
                                                                                            :
                                                                                            null
                                                                                        } */}

                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                            <div className='save-link' style={{ opacity: 1, bottom: 'unset', top: '0', right: '0' }}>
                                                                                {isWishlistCurrentUser ?
                                                                                    <>
                                                                                        <div className="action-button bg-gold" onClick={function () { wishlistUpdate({ user_id: currentUser, product_id: wishlist.product.id }); removeWishlist(wishlist.product.id) }}>
                                                                                            <GoHeart className="text-white" />
                                                                                        </div>
                                                                                    </>
                                                                                    :
                                                                                    null
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Col >
                                                            </>
                                                        )
                                                    })}
                                                </Row>
                                            </>
                                            :
                                            <div className="text-center mt-5">
                                                <GoAlertFill size="120px" className="mb-4 mt-5 text-gold" />
                                                <p className="fs-20 text-black no-wishlist">No wishlist at this time</p>
                                            </div>
                                        }
                                    </>
                                }
                            </div>
                        </Container>
                    </section>
                    {/* Connect with Fashion Designer */}
                    <Modal
                        show={connectShow}
                        className='modal-preview'
                        fade={false}
                        centered
                        size="sm"
                    >
                        <Modal.Header className="py-0">
                            <h5 className='modal-title text-uppercase text-left'></h5>
                            <button type='button' className='close react-modal-close' onClick={toggleConnectShow} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                            </button>
                        </Modal.Header>
                        <Modal.Body>
                            <h4 className='text-left fs-25 fw-600 mb-3'>Connect with Fashion Designer</h4>
                            <Card>
                                <Card.Body className="text-center py-5">
                                    <GoAlertFill size="60px" className="mb-2 text-gold" />
                                    <p className="fs-20 text-black">Under Construction</p>
                                </Card.Body>
                            </Card>
                        </Modal.Body>
                    </Modal>
                </>
            }
        </Layout >
    );
};

export default Wishlists;