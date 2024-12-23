import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import Layout from 'Components/Layout/Layout';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import toast from 'react-hot-toast';
import GetUserWishlistsData from 'Utils/GetUserWishlistsData';
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';
import LoadingPage from 'Components/Shared/LoadingPage';
import GoBack from 'Components/Shared/GoBack';
import { GoHeart, GoAlertFill } from "react-icons/go";
import { IoEyeOutline, IoHeartOutline } from "react-icons/io5";
import UserPlaceholder from 'Assets/images/placeholders/user.png';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const DesignerWishlists = (props) => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'token', 'tempDesignerWishlist']);
    const reloadCount = props.reloadCount;
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [designerWishlists, setDesignerWishlists] = useState([]);
    const [designerWishlistsLoading, setDesignerWishlistsLoading] = useState(true);
    const [connectShow, setConnectShow] = useState(false);

    const [tempDesignerWishlist, setTempDesignerWishlist] = useState(cookies.tempDesignerWishlist ?? []);
    const currentUser = cookies.currentUser;
    const current_user_id = cookies.currentUser;
    const token = cookies.token;

    const fetchData = async (e) => {
        try {
            const designerWishlistsData = await GetUserWishlistsData(e);
            if (designerWishlistsData) {
                setDesignerWishlists(designerWishlistsData.designer_wishlists);
                setDesignerWishlistsLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setDesignerWishlistsLoading(false);
            }

        } catch (error) {
            toast.error('An error occured. Please try again or contact the administrator.');
            setDesignerWishlistsLoading(false);
        }
    };

    async function designerWishlistUpdate(e) {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'designer/wishlist/update?current_user_id=' + current_user_id + '&token=' + token, e).then((response) => {
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
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'portfolio/view/' + id + '?current_user_id=' + current_user_id + '&token=' + token).then((response) => {
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

    const removeDesignerWishlist = (e) => {
        // Assuming designerWishlists is your array of objects
        setDesignerWishlists(prevDesignerWishlists => prevDesignerWishlists.filter(item => item.id !== e));
    };

    const handleActionClick = (index) => {
        // Toggle the selected item index
        setSelectedItemIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const toggleConnectShow = (e) => {
        setConnectShow(!connectShow);
    };

    const toggleTempDesignerWishlist = (item) => {
        // Check if the item ID already exists in the array
        const itemExists = tempDesignerWishlist.some(wishlistItem => wishlistItem.id === item.id);

        let updatedDesignerWishlists;
        if (itemExists) {
            // Remove the item from the array
            updatedDesignerWishlists = tempDesignerWishlist.filter(wishlistItem => wishlistItem.id !== item.id);
        } else {
            // Add the new item to the array
            updatedDesignerWishlists = [...tempDesignerWishlist, item];
        }

        // Set the updated designerWishlists array in cookies
        setCookie('tempDesignerWishlist', JSON.stringify(updatedDesignerWishlists), { path: '/' });
        // Update the local state
        setTempDesignerWishlist(updatedDesignerWishlists);
    };

    useEffect(() => {
        if (currentUser) {
            fetchData({ currentUser: currentUser, token: token });
        } else {
            setDesignerWishlistsLoading(false);
            console.log(tempDesignerWishlist);
        }
    }, [reloadCount]);


    return (
        <>
            <div className="wishlist-container">
                <p className='title-designer mb-1 lh-25'>Wishlist </p>
                <div className="mt-15">
                    <div className="mb-4">
                        {designerWishlistsLoading ?
                            <>
                                <Card className="mt-3 mb-3">
                                    <Card.Body>
                                        <p className="mb-0 text-center">Loading...</p>
                                    </Card.Body>
                                </Card>
                            </>
                            :
                            <>
                                {currentUser ?
                                    <>
                                        {designerWishlists && designerWishlists.length > 0 ?
                                            <>
                                                <Row className="designs-row">
                                                    {designerWishlists.map((designerWishlist, index) => {
                                                        var designerWishlist_image = designerWishlist.user?.image;
                                                        var user = designerWishlist.user;
                                                        if (user.image) {
                                                            var designerWishlistImage = process.env.REACT_APP_STORAGE_URL + 'user/' + user.image;
                                                        } else {
                                                            if (user.gender == "Female") {
                                                                var designerWishlistImage = FemalePlaceholder;
                                                            } else {
                                                                var designerWishlistImage = MalePlaceholder;
                                                            }
                                                        }

                                                        return (
                                                            <>
                                                                <Col className="designs-grid mb-3" xs="12" md="6" key={index}>
                                                                    <div className="bg-lgray rounded p-3">
                                                                        <div className="portfolio-link">
                                                                            <Row>
                                                                                <Col lg="4" xs="12">
                                                                                    {/* <div className="designs-grid-div w-100 cursor-pointer" onClick={function () { toggleAddViewCount(designerWishlist.portfolio_item.id); navigate('/design/' + designerWishlist.portfolio_item.id); }} style={{ backgroundImage: "url(" + designerWishlistImage + ")", minHeight: '100%' }}>

                                                                                        </div> */}
                                                                                    <Link to={'/designer-profile?user_id=' + user.id}>
                                                                                        <div className="designs-grid-div w-100" style={{ backgroundImage: "url(" + designerWishlistImage + ")", minHeight: '200px' }}>

                                                                                        </div>
                                                                                    </Link>
                                                                                </Col>
                                                                                <Col lg="8" xs="12">
                                                                                    <div className="favorite-details">
                                                                                        <div className='d-flex align-items-center justify-content-between'>
                                                                                            <Link to={'/designer-profile?user_id=' + user.id} className="text-decoration-none">
                                                                                                <p className="text-black fs-18 fw-600 mb-0 text-ellipsis">{user?.first_name ?? '-'} {user?.last_name ?? '-'}</p>
                                                                                            </Link>                                                                                    </div>
                                                                                        <div className='d-flex align-items-center mt-1' >
                                                                                            <p className="text-black fs-14 mb-3 favorite-description">{user?.long_bio ?? '-'}</p>
                                                                                        </div>
                                                                                        <Button
                                                                                            className="w-auto me-3 mt-2 btn-primary fs-16"
                                                                                            onClick={() => navigate('/designer-profile?user_id=' + user.id)}
                                                                                        >
                                                                                            Connect with Designer
                                                                                        </Button>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                            <div className='save-link' style={{ opacity: 1, bottom: 'unset', top: '0', right: '0' }}>
                                                                                <div className="kouture-tooltip">
                                                                                    <div className="action-button bg-gold" onClick={function () { designerWishlistUpdate({ user_id: currentUser, designer_id: designerWishlist.designer_id }); removeDesignerWishlist(designerWishlist.id) }}>
                                                                                        <GoHeart className="text-white" />
                                                                                    </div>
                                                                                    <div className="kouture-tooltiptext" style={{ width: '190px', left: '-22px' }}>
                                                                                        Remove from Wishlist
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
                                                <p className="fs-20 text-black">No wishlist at this time</p>
                                            </div>
                                        }
                                    </>
                                    :
                                    <div className="text-center mt-5">
                                        <GoAlertFill size="120px" className="mb-4 mt-5 text-gold" />
                                        <p className="fs-20 text-black">No wishlist at this time</p>
                                    </div>
                                }
                            </>
                        }
                    </div>
                </div>
            </div>
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
    );
};

export default DesignerWishlists;