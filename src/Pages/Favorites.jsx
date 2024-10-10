import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import Layout from 'Components/Layout/Layout';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import toast from 'react-hot-toast';
import GetUserWishlistsData from 'Utils/GetUserWishlistsData';
import LoadingPage from 'Components/Shared/LoadingPage';
import GoBack from 'Components/Shared/GoBack';
import { GoStar, GoAlertFill } from "react-icons/go";
import { IoEyeOutline, IoHeartOutline } from "react-icons/io5";
import UserPlaceholder from 'Assets/images/placeholders/user.png';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const Favorites = (props) => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'token', 'tempFavorites']);
    const reloadCount = props.reloadCount;
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [favoritesLoading, setFavoritesLoading] = useState(true);
    const [connectShow, setConnectShow] = useState(false);

    const [tempFavorites, setTempFavorites] = useState(cookies.tempFavorites ?? []);
    const currentUser = cookies.currentUser;
    const token = cookies.token;

    const fetchData = async (e) => {
        try {
            const favoritesData = await GetUserWishlistsData(e);
            if (favoritesData) {
                setFavorites(favoritesData.portfolio_item_wishlists);
                setFavoritesLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setFavoritesLoading(false);
            }

        } catch (error) {
            toast.error('An error occured. Please try again or contact the administrator.');
            setFavoritesLoading(false);
        }
    };

    async function favoriteUpdate(e) {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'portfolio/item/wishlist/update', e).then((response) => {
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
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'portfolio/view/' + id).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                // toast.success('Design saved as draft successfully!');
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
        });
    }

    const removeFavorite = (e) => {
        // Assuming favorites is your array of objects
        setFavorites(prevFavorites => prevFavorites.filter(item => item.id !== e));
    };

    const handleActionClick = (index) => {
        // Toggle the selected item index
        setSelectedItemIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const toggleConnectShow = (e) => {
        setConnectShow(!connectShow);
    };

    const toggleTempFavorite = (item) => {
        // Check if the item ID already exists in the array
        const itemExists = tempFavorites.some(favItem => favItem.id === item.id);
    
        let updatedFavorites;
        if (itemExists) {
          // Remove the item from the array
          updatedFavorites = tempFavorites.filter(favItem => favItem.id !== item.id);
        } else {
          // Add the new item to the array
          updatedFavorites = [...tempFavorites, item];
        }
    
        // Set the updated favorites array in cookies
        setCookie('tempFavorites', JSON.stringify(updatedFavorites), { path: '/' });
        // Update the local state
        setTempFavorites(updatedFavorites);
    };

    useEffect(() => {
        if (currentUser) {
            fetchData({ currentUser: currentUser, token: token });
        } else {
            setFavoritesLoading(false);
            console.log(tempFavorites);
        }
    }, [reloadCount]);


    return (
        <Layout>
            {favoritesLoading ?
                <LoadingPage />
                :
                <>
                    <section className='pb-5 pt-30 px-5 bg-white'>
                        <Container>
                            <Row className='mb-3'>
                                <Col lg="8" className=''>
                                    <h2 className='fs-30 fw-600'>Favorites</h2>
                                </Col>
                                <Col lg="4" className='text-right'>
                                    <GoBack fallBack="/" />
                                </Col>
                            </Row>
                            <div id="profile-designs">
                                {favoritesLoading ?
                                    <>
                                        <p className='text-center mb-3 mt-3'>
                                            Loading...
                                        </p>
                                    </>
                                    :
                                    <>
                                        {currentUser ?
                                            <>
                                                {favorites && favorites.length > 0 ?
                                                    <>
                                                        <Row className="designs-row">
                                                            {favorites.map((favorite, index) => {
                                                                if (favorite.portfolio_item?.image_urls) {
                                                                    var favorite_images = JSON.parse(favorite.portfolio_item?.image_urls);
                                                                    if (favorite_images?.[0]) {
                                                                        var favoriteImage = process.env.REACT_APP_STORAGE_URL + 'portfolio/' + favorite_images[0].image_url;
                                                                    } else {
                                                                        var favoriteImage = PlaceholderImage;
                                                                    }
                                                                } else {
                                                                    var favoriteImage = PlaceholderImage;
                                                                }

                                                                return (
                                                                    <>
                                                                        <Col className="designs-grid mb-3" xs="12" md="6" key={index}>
                                                                            <div className="bg-lgray rounded p-3">
                                                                                <div className="portfolio-link">
                                                                                    <Row>
                                                                                        <Col lg="3" xs="12">
                                                                                            {/* <div className="designs-grid-div w-100 cursor-pointer" onClick={function () { toggleAddViewCount(favorite.portfolio_item.id); navigate('/design/' + favorite.portfolio_item.id); }} style={{ backgroundImage: "url(" + favoriteImage + ")", minHeight: '100%' }}>

                                                                                            </div> */}
                                                                                            <div className="designs-grid-div w-100" style={{ backgroundImage: "url(" + favoriteImage + ")", minHeight: '200px' }}>

                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col lg="9" xs="12">
                                                                                            <div className="favorite-details">
                                                                                                <div className='d-flex align-items-center justify-content-between'>
                                                                                                    <p className="text-black fs-18 fw-600 mb-0 text-ellipsis">{favorite.portfolio_item?.name ?? '-'}</p>
                                                                                                    {/* <div className='d-flex align-items-center'>
                                                                                                        <span className='fs-14 text-no-wrap mx-2'>
                                                                                                            <IoHeartOutline /> {favorite.favorite_count}
                                                                                                        </span>
                                                                                                        <span className='fs-14 text-no-wrap'>
                                                                                                            <IoEyeOutline /> {favorite.product?.views}
                                                                                                        </span>
                                                                                                    </div> */}
                                                                                                </div>
                                                                                                <div className='d-flex align-items-center mt-1' >
                                                                                                    {/* {favorite.user.image ?
                                                                                                        <div className='designer-photo-small' style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'user/'+favorite.user.image+")"}} ></div>
                                                                                                        :
                                                                                                        <div className='designer-photo-small' style={{ backgroundImage: "url("+UserPlaceholder+")"}} ></div>
                                                                                                    }
                                                                                                    &nbsp;&nbsp; */}
                                                                                                    {/* <p className="text-black fs-14 mb-0">{favorite.user.first_name && favorite.user.first_name != "" ? favorite.user.first_name : "-"} {favorite.user.last_name && favorite.user.last_name != "" ? favorite.user.last_name : "-"}</p> */}
                                                                                                    <p className="text-black fs-14 mb-3 favorite-description">{favorite.portfolio_item?.description ?? '-'}</p>
                                                                                                </div>
                                                                                                <Button
                                                                                                    className="w-auto me-3 mt-2 btn-primary fs-16"
                                                                                                    onClick={() => navigate('/designer-profile?user_id='+favorite.portfolio_item.user_id)}
                                                                                                >
                                                                                                    Connect with Designer
                                                                                                </Button>

                                                                                            </div>
                                                                                        </Col>
                                                                                    </Row>
                                                                                    <div className='save-link' style={{ opacity: 1, bottom: 'unset', top: '0', right: '0' }}>
                                                                                        <div className="kouture-tooltip">
                                                                                            <div className="action-button bg-gold" onClick={function () { favoriteUpdate({ user_id: currentUser, portfolio_item_id: favorite.portfolio_item.id }); removeFavorite(favorite.portfolio_item.id) }}>
                                                                                                <GoStar className="text-white" />
                                                                                            </div>
                                                                                            <div className="kouture-tooltiptext" style={{width: '200px', left: '-25px'}}>
                                                                                                Remove from Favorites
                                                                                            </div>
                                                                                        </div>
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
                                                        <p className="fs-20 text-black">No favorite at this time</p>
                                                    </div>
                                                }
                                            </>
                                            :
                                            <>
                                                {tempFavorites && tempFavorites.length > 0 ?
                                                    <>
                                                        <Row className="designs-row">
                                                            {tempFavorites.map((favorite, index) => {
                                                                if (favorite?.image_urls) {
                                                                    var favorite_images = favorite.image_urls;
                                                                    if (favorite_images) {
                                                                        var favoriteImage = process.env.REACT_APP_STORAGE_URL + 'portfolio/' + favorite_images.image_url;
                                                                    } else {
                                                                        var favoriteImage = PlaceholderImage;
                                                                    }
                                                                } else {
                                                                    var favoriteImage = PlaceholderImage;
                                                                }

                                                                return (
                                                                    <>
                                                                        <Col className="designs-grid mb-3" xs="12" md="6" key={index}>
                                                                            <div className="bg-lgray rounded p-3">
                                                                                <div className="portfolio-link">
                                                                                    <Row>
                                                                                        <Col lg="3" xs="12">
                                                                                            {/* <div className="designs-grid-div w-100 cursor-pointer" onClick={function () { toggleAddViewCount(favorite.portfolio_item.id); navigate('/design/' + favorite.portfolio_item.id); }} style={{ backgroundImage: "url(" + favoriteImage + ")", minHeight: '100%' }}>

                                                                                            </div> */}
                                                                                            <div className="designs-grid-div w-100" style={{ backgroundImage: "url(" + favoriteImage + ")", minHeight: '200px' }}>

                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col lg="9" xs="12">
                                                                                            <div className="favorite-details">
                                                                                                <div className='d-flex align-items-center justify-content-between'>
                                                                                                    <p className="text-black fs-18 fw-600 mb-0 text-ellipsis">{favorite?.name ?? '-'}</p>
                                                                                                    {/* <div className='d-flex align-items-center'>
                                                                                                        <span className='fs-14 text-no-wrap mx-2'>
                                                                                                            <IoHeartOutline /> {favorite.favorite_count}
                                                                                                        </span>
                                                                                                        <span className='fs-14 text-no-wrap'>
                                                                                                            <IoEyeOutline /> {favorite.product?.views}
                                                                                                        </span>
                                                                                                    </div> */}
                                                                                                </div>
                                                                                                <div className='d-flex align-items-center mt-1' >
                                                                                                    {/* {favorite.user.image ?
                                                                                                        <div className='designer-photo-small' style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'user/'+favorite.user.image+")"}} ></div>
                                                                                                        :
                                                                                                        <div className='designer-photo-small' style={{ backgroundImage: "url("+UserPlaceholder+")"}} ></div>
                                                                                                    }
                                                                                                    &nbsp;&nbsp; */}
                                                                                                    {/* <p className="text-black fs-14 mb-0">{favorite.user.first_name && favorite.user.first_name != "" ? favorite.user.first_name : "-"} {favorite.user.last_name && favorite.user.last_name != "" ? favorite.user.last_name : "-"}</p> */}
                                                                                                    <p className="text-black fs-14 mb-3 favorite-description">{favorite?.description ?? '-'}</p>
                                                                                                </div>
                                                                                                <Button
                                                                                                    className="w-auto me-3 mt-2 btn-primary fs-16"
                                                                                                    onClick={() => navigate('/designer-profile?user_id='+favorite.designer_user_id)}
                                                                                                >
                                                                                                    Connect with Designer
                                                                                                </Button>

                                                                                            </div>
                                                                                        </Col>
                                                                                    </Row>
                                                                                    <div className='save-link' style={{ opacity: 1, bottom: 'unset', top: '0', right: '0' }}>
                                                                                        <div className="kouture-tooltip">
                                                                                            <div className="action-button bg-gold"
                                                                                                onClick={function () { toggleTempFavorite({id: favorite.id}); }}
                                                                                            >
                                                                                                <GoStar className="text-white" />
                                                                                            </div>
                                                                                            <div className="kouture-tooltiptext" style={{width: '200px', left: '-25px'}}>
                                                                                                Remove from Favorites
                                                                                            </div>
                                                                                        </div>
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
                                                        <p className="fs-20 text-black">No favorite at this time</p>
                                                    </div>
                                                }
                                            </>
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

export default Favorites;