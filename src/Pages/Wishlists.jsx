import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Layout from 'Components/Layout/Layout';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import toast from 'react-hot-toast';
// import getDesignsData from 'Utils/GetUserWishlistsData';
import GetUserWishlistsData from 'Utils/GetUserWishlistsData';
import LoadingPage from 'Components/Shared/LoadingPage';
import GoBack from 'Components/Shared/GoBack';
import { GoHeart, GoBookmark } from "react-icons/go";
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
          // Update state or perform other logic with userData
        } catch (error) {
            toast.error('An error occured. Please try again or contact the administrator.');
            setWishlistsLoading(false);
          // Handle the error, if needed
        }
    };

    async function wishlistUpdate(e) {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'wishlist/update', e).then((response) => {
          const success = response.data.status;
          if (success == 'Success') {
            fetchData({currentUser: currentUser, token: token});
          } else {
            toast.error('Something went wrong, please contact the administrator!');
          }
        }).catch((error) => {
          toast.error('Something went wrong, please contact the administrator!');
        });
    }

    async function toggleAddViewCount(id) {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'product/view/'+id).then((response) => {
            const success = response.data.status;
            if(success == 'Success') {
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

    useEffect(() => {
        fetchData({currentUser: currentUser, token: token});
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
                                    <h2 className='fs-30'>Wishlist</h2>
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
                                                    {/* <img src={object.url} className='designs-img'/> */}
                                                    {wishlists.map((wishlist, index) => {
                                                        if (wishlist.product?.image_urls) {
                                                            var wishlist_images = JSON.parse(wishlist.product?.image_urls);
                                                            if (wishlist_images?.[0]) {
                                                                var wishlistImage = process.env.REACT_APP_STORAGE_URL+'product/'+wishlist_images[0].image_url;
                                                            } else {
                                                                var wishlistImage = PlaceholderImage;
                                                            }
                                                        } else {
                                                            var wishlistImage = PlaceholderImage;
                                                        }

                                                        return (
                                                            <>
                                                                <Col className="designs-grid mb-3" xs="12" md="3">
                                                                     <div className="portfolio-link">
                                                                        <div className="designs-grid-div w-100 cursor-pointer" onClick={function() {toggleAddViewCount(wishlist.product.id); navigate('/product/'+wishlist.product.id); }} style={{ backgroundImage: "url("+wishlistImage+")"}}>
                                                                            
                                                                        </div>
                                                                        <div className='save-link'>
                                                                            {/* <div className="action-button bg-white me-2">
                                                                                <GoBookmark className="text-black" />
                                                                            </div> */}
                                                                            <div className="action-button bg-gold" onClick={function() { wishlistUpdate({user_id: currentUser, product_id: wishlist.product.id}); removeWishlist(wishlist.product.id) }}>
                                                                                <GoHeart className="text-white" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="design-details">
                                                                        <div className='d-flex align-items-center justify-content-between'>
                                                                            <p className="text-black fs-18 fw-600 mb-0 text-ellipsis">{wishlist.product?.name ?? '-'}</p>
                                                                            <div className='d-flex align-items-center'>
                                                                                <span className='fs-14 text-no-wrap mx-2'>
                                                                                    <IoHeartOutline /> {wishlist.wishlist_count}
                                                                                </span>
                                                                                <span className='fs-14 text-no-wrap'>
                                                                                    <IoEyeOutline /> {wishlist.product?.views}
                                                                                </span>
                                                                            </div>
                                                                            
                                                                        </div>
                                                                        <div className='d-flex align-items-center mt-1'>
                                                                            {wishlist.user.image ?
                                                                                <div className='designer-photo-small' style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'user/'+wishlist.user.image+")"}} ></div>
                                                                                :
                                                                                <div className='designer-photo-small' style={{ backgroundImage: "url("+UserPlaceholder+")"}} ></div>
                                                                            }
                                                                            &nbsp;&nbsp;
                                                                            <p className="text-black fs-14 mb-0">{wishlist.user.first_name && wishlist.user.first_name != "" ? wishlist.user.first_name : "-"} {wishlist.user.last_name && wishlist.user.last_name != "" ? wishlist.user.last_name : "-"}</p>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </>
                                                        )
                                                    })}
                                                </Row>
                                            </>
                                            :
                                            <p className="text-center mb-3 mt-3">No records found.</p>
                                        }
                                    </>
                                }
                            </div>
                        </Container>
                    </section>
                </>
            }
        </Layout>
    );
};

export default Wishlists;