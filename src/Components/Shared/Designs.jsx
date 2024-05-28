import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Button, ModalHeader, Card, ModalFooter } from 'react-bootstrap';
import UserPlaceholder from 'Assets/images/placeholders/user.png';
import toast from 'react-hot-toast';
import GetDesignsData from 'Utils/GetDesignsData';
import { GoAlertFill, GoHeart, GoStar } from "react-icons/go";
import PinIcon from 'Assets/images/pin.png';
import { useCookies } from 'react-cookie';
import Modal from 'react-bootstrap/Modal';
import User from 'Assets/images/user.png';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import { AiFillMessage } from "react-icons/ai";
import { PiNotepadFill } from "react-icons/pi";
import { ImEmbed2 } from "react-icons/im";
import DressPlaceholder from 'Assets/images/placeholder-dress.jpeg';
import { BsCartPlus } from 'react-icons/bs';
import { IoShareSocial, IoInformationOutline, IoVideocam, IoCloseOutline } from "react-icons/io5";
import 'Assets/styles/Design/style.css';
import Carousel from 'react-multi-carousel';
import CopyTo from 'Utils/CopyLink';
import MeetingChat from 'Components/Chat/MeetingChat';
import axios from 'axios';

const Designs = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'tempFavorites']);
    const navigate = useNavigate();
    const reloadCount = props.reloadCount;
    const currentUser = props.currentUser;
    const userRole = cookies.userRole;
    const limit = props.limit ?? 16;
    const [designs, setDesigns] = useState([]);
    const [designsLoading, setDesignsLoading] = useState(true);

    const [portfoliosImage, setPortfolioImage] = useState(false);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [singleDesign, setSingleDesign] = useState('');
    const [designImages, setDesignImages] = useState([]);
    const [activeImage, setActiveImage] = useState('');
    const [messageShow, setMessageShow] = useState(false);
    const [descriptionShow, setDescriptionShow] = useState(false);
    const [isDesignCurrentUser, setIsDesignCurrentUser] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [profileViewShow, setProfileViewShow] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);
    const [tempFavorites, setTempFavorites] = useState(cookies.tempFavorites ?? []);

    const [shareShowModal, setShareShowModal] = useState(false);
    const [copyEmbedLink, setCopyEmbedLink] = useState(false);
    const [copy, setCopy] = useState(false);

    let iframeLink = `<iframe src="https://kouture-konect.web.app/view-design/${singleDesign.portfolioId}" height="316" width="404" allowfullscreen lazyload frameborder="0" allow="clipboard-write" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
            slidesToSlide: 1
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
            slidesToSlide: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1
        }
    };

    const showSignupModal = (e) => {
        props.onSignup(e);
    }

    function toggleDescription() {
        setDescriptionShow(true);
    }

    function toggleCopyEmbedLinkModal() {
        setCopyEmbedLink(true);
    }

    function toggleShareModal() {
        setShareShowModal(true);
    }

    function toggleMessage() {
        setMessageShow(true);
    }

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    function togglePortfolioImage(portfolioId, id, first_name, last_name, image_urls, image, address_line_1, province, tags, description, userId, userWishlist) {
        setPortfolioImage(true);
        setInWishlist(userWishlist);
        setSingleDesign({
            id: id ?? 0,
            portfolioId: portfolioId ?? 0,
            userId: userId ?? 0,
            first_name: first_name ?? '-',
            last_name: last_name ?? '-',
            image: image ?? '-',
            address_line_1: address_line_1 ?? '-',
            province: province ?? '-',
            tags: tags ?? '-',
            description: description ?? '-'

        })
        setDesignImages(image_urls);
        if (image_urls?.[0]?.image_url) {
            setActiveImage(process.env.REACT_APP_STORAGE_URL + 'portfolio/' + image_urls[0].image_url);
        } else {
            setActiveImage(PlaceholderImage);
        }

        if (currentUser == userId) {
            setIsDesignCurrentUser(true);
        } else {
            setIsDesignCurrentUser(false);
        }
    }

    const fetchData = async (e) => {
        try {
            const designsData = await GetDesignsData(e);
            if (designsData) {
                setDesigns(designsData);
                setDesignsLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setDesignsLoading(false);
            }
        } catch (error) {
            toast.error('An error occured. Please try again or contact the administrator.');
            setDesignsLoading(false);
        }
    };

    async function toggleSortDesigns(type, sort) {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'portfolio/design' + type + sort).then((response) => {
            const selectedDesigns = response.data.data;
            if (selectedDesigns) {
                setDesigns(selectedDesigns);
                setDesignsLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setDesignsLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setDesignsLoading(false);
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

    async function favoriteDesignUpdate(e) {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'portfolio/item/wishlist/update', e).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                fetchData(currentUser);
                setInWishlist(!inWishlist);
            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
        }).catch((error) => {
            toast.error('Something went wrong, please contact the administrator!');
        });
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
        fetchData(currentUser);
    }, [reloadCount]);

    return (
        <>
            <div id="profile-designs">
                <p className="fs-20 text-center text-dark mb-2 proximanova-family"> Looking for Designs? <span className="text-dark">Explore now </span></p >
                <h2 className="fs-35 fw-500 text-center text-black discover-design">Discover Captivating Designs</h2>
                {designsLoading ?
                    <>
                        <p className='text-center mb-3 mt-3'>
                            Loading...
                        </p>
                    </>
                    :
                    <>
                        {designs && designs.length > 0 ?
                            <>
                                <Row className="designs-row">
                                    {/* {currentUser ?
                                        <Col lg="12" className='d-flex justify-content-end'>
                                            <div style={{ position: "relative" }}>
                                                <select
                                                    className="form-control mb-3 me-2 sort-input"
                                                    onChange={(e) => {
                                                        const selectedOption = e.target.value;
                                                        if (selectedOption === "New") {
                                                            toggleSortDesigns("?date=", "desc");
                                                        } else if (selectedOption === "Most Viewed") {
                                                            toggleSortDesigns("?views=", "desc");
                                                        } else if (selectedOption === "Most Liked") {
                                                            toggleSortDesigns("?likes=", "desc");
                                                        } else {
                                                            toggleSortDesigns("", "");
                                                        }
                                                    }}
                                                >
                                                    <option value="">All</option>
                                                    <option value="New">Recent Design</option>
                                                    <option value="Most Viewed">Most Viewed</option>
                                                    <option value="Most Liked">Most Liked</option>
                                                </select>   
                                                <div style={{ position: "absolute", right: "20px", top: "10px", pointerEvents: "none" }} >
                                                    <IoIosArrowDown />
                                                </div>
                                            </div>
                                        </Col>
                                        :
                                        null
                                    } */}
                                    {/* <img src={object.url} className='designs-img'/> */}
                                    {designs.slice(0, 8).map((design, index) => {
                                        if (design.image_urls?.[0]?.image_url) {
                                            var designImage = process.env.REACT_APP_STORAGE_URL + 'portfolio/' + design.image_urls[0].image_url;
                                        } else {
                                            var designImage = PlaceholderImage;
                                        }
                                        var wishlist_user_ids = design.wishlist_user_ids ?? [];
                                        const userWishlist = wishlist_user_ids.includes(currentUser);

                                        return (
                                            <>
                                                {index < limit ?
                                                    <Col className="designs-grid mb-3" xs="12" md="3">
                                                        {userRole !== 'Admin' ?
                                                            <>
                                                                <div className="position-relative">
                                                                    <div className='portfolio-link cursor-pointer'>
                                                                        <div className="designs-grid-div w-100" style={{ backgroundImage: "url(" + designImage + ")", minHeight: '200px' }}>
                                                                            <div className="designs-grid-placeholder" 
                                                                                onClick={function () {
                                                                                    togglePortfolioImage(
                                                                                        design.id,
                                                                                        design.designer.id,
                                                                                        design.user.first_name,
                                                                                        design.user.last_name,
                                                                                        design.image_urls,
                                                                                        design.user.image,
                                                                                        design.user.address_line_1,
                                                                                        design.user.province,
                                                                                        design.tags,
                                                                                        design.description,
                                                                                        design.user.id,
                                                                                        userWishlist
                                                                                    );
                                                                                    toggleAddViewCount(design.id);
                                                                                }}
                                                                            ></div>
                                                                        </div>
                                                                        {userRole !== 'Admin' && design.user.id != currentUser ?
                                                                            <>
                                                                                {currentUser ?
                                                                                    <>
                                                                                        <div className='save-link'>
                                                                                            {userWishlist ?
                                                                                                <div className="kouture-tooltip">
                                                                                                    <div className="action-button bg-gold"
                                                                                                        onClick={function () { favoriteDesignUpdate({ user_id: currentUser, portfolio_item_id: design.id }); }}
                                                                                                    >
                                                                                                        <GoStar className="text-white" />
                                                                                                    </div>
                                                                                                    <div className="kouture-tooltiptext" style={{width: '200px', left: '-25px'}}>
                                                                                                        Remove from Favorites
                                                                                                    </div>
                                                                                                </div>
                                                                                                :
                                                                                                <div className="kouture-tooltip">
                                                                                                    <div className="action-button bg-white"
                                                                                                        onClick={function () { favoriteDesignUpdate({ user_id: currentUser, portfolio_item_id: design.id }); }}
                                                                                                    >
                                                                                                        <GoStar className="text-black" />
                                                                                                    </div>
                                                                                                    <div className="kouture-tooltiptext" style={{width: '200px', left: '-25px'}}>
                                                                                                        Add to Favorites
                                                                                                    </div>
                                                                                                </div>
                                                                                            }
                                                                                        </div>
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                        <div className='save-link'>
                                                                                            {tempFavorites.some(favItem => favItem.id === design.id) ?
                                                                                                <div className="kouture-tooltip">
                                                                                                    <div
                                                                                                        className="action-button bg-gold"
                                                                                                        onClick={function () { toggleTempFavorite({id: design.id, user_id: currentUser, name: design.name, description: design.description, image_urls: design.image_urls[0], designer_user_id: design.user.id}); }}
                                                                                                    >
                                                                                                        <GoStar className="text-white" />
                                                                                                    </div>
                                                                                                    <div className="kouture-tooltiptext" style={{width: '200px', left: '-25px'}}>
                                                                                                        Remove from Favorites
                                                                                                    </div>
                                                                                                </div>
                                                                                                :
                                                                                                <div className="kouture-tooltip">
                                                                                                    <div
                                                                                                        className="action-button bg-white"
                                                                                                        onClick={function () { toggleTempFavorite({id: design.id, user_id: currentUser, name: design.name, description: design.description, image_urls: design.image_urls[0], designer_user_id: design.user.id}); }}
                                                                                                        >
                                                                                                        <GoStar className="text-black" />
                                                                                                    </div>
                                                                                                    <div className="kouture-tooltiptext" style={{width: '200px', left: '-25px'}}>
                                                                                                        Add to Favorites
                                                                                                    </div>
                                                                                                </div>
                                                                                            }
                                                                                        </div>
                                                                                    </>
                                                                                }
                                                                                
                                                                            </>
                                                                            :
                                                                            <>

                                                                            </>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </>
                                                            :
                                                            <>
                                                                <div
                                                                    className='portfolio-link cursor-pointer' onClick={function () { toggleAddViewCount(design.id); navigate('/admin/portfolio/' + design.id); }}
                                                                >
                                                                    <div className="designs-grid-div w-100" style={{ backgroundImage: "url(" + designImage + ")", minHeight: '200px' }}></div>
                                                                </div>
                                                            </>

                                                        }
                                                        <div className="design-details">
                                                            <div className='d-flex align-items-center justify-content-between'>
                                                                <p className="text-black fs-18 fw-600 mb-0 text-ellipsis rufina-family">{design.name ?? '-'}</p>
                                                                {/* {currentUser ?
                                                                    <div className='d-flex align-items-center'>
                                                                        <span className='fs-14 text-no-wrap mx-2'>
                                                                            <IoHeartOutline /> 0
                                                                        </span>
                                                                        <span className='fs-14 text-no-wrap'>
                                                                            <IoEyeOutline /> {design.views}
                                                                        </span>
                                                                    </div>
                                                                    :
                                                                    null
                                                                }    */}
                                                            </div>

                                                            <div className="star-ratings mt-1">
                                                                {/* <Rating
                                                                    initialValue={0}
                                                                    readonly={true}
                                                                    allowFraction={true}
                                                                    size={20}
                                                                    className="star-rating"
                                                                    showTooltip={true}
                                                                    emptyColor="#dddddd"
                                                                    fillColor="#cea835"
                                                                    tooltipArray={[
                                                                        0, 1, 2, 3, 4, 5
                                                                    ]}
                                                                    tooltipDefaultText="0.0"
                                                                /> */}
                                                            </div>

                                                            {/* {currentUser ?
                                                                <div className='d-flex align-items-center mt-1'>
                                                                    {design.user.image ?
                                                                        <div className='designer-photo-small' style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'user/'+design.user.image+")"}} ></div>
                                                                        :
                                                                        <div className='designer-photo-small' style={{ backgroundImage: "url("+UserPlaceholder+")"}} ></div>
                                                                    }
                                                                    &nbsp;&nbsp;
                                                                    <p className="text-black fs-14 mb-0">{design.user.first_name && design.user.first_name != "" ? design.user.first_name : "-"} {design.user.last_name && design.user.last_name != "" ? design.user.last_name : "-"}</p>
                                                                </div>
                                                                :
                                                                null
                                                            } */}
                                                        </div>
                                                    </Col>
                                                    :
                                                    null
                                                }
                                            </>
                                        )
                                    })}
                                    <Col lg={12} className="text-center mt-4">
                                        {currentUser ?
                                            <Link to="/designs">
                                                <Button className="btn-primary" variant="primary">View All</Button>
                                            </Link>
                                            :
                                            <Button className="btn-primary" variant="primary" onClick={() => showSignupModal('user_design')}>View More</Button>
                                        }
                                    </Col>
                                </Row>
                            </>
                            :
                            <p className="text-center mb-3 mt-3">No records found.</p>
                        }
                    </>
                }
            </div>

            <Modal
                show={portfoliosImage}
                fade={false}
                className='modal-full-width'
                id="bg-transparent-card"
            >
                <ModalHeader className='pt-2 pb-3 bg-transparent-card d-flex align-items-start'>
                    <a href={`/designer-profile?user_id=${singleDesign.userId}`} className='text-decoration-none'>
                        <div className='d-flex justify-content-center align-items-center user-image'>

                            {singleDesign.image !== '' && singleDesign.image !== '-' ? (
                                <div
                                    className='user-photo'
                                    style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                >
                                </div>
                            ) : (
                                <img src={User} className='placeholder-img ' />
                            )}

                            <div className='ms-3'>
                                <div className='modal-title text-left fs-20 fw-600 text-white'>{singleDesign.first_name} {singleDesign.last_name}</div>
                                <div className='fashion-designer fs-16'>Fashion Designer</div>
                            </div>
                        </div>
                    </a>

                    <button type='button' className='close modal-close close-button-image bg-black' aria-label='Close' onClick={() => setPortfolioImage(false)}>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                </ModalHeader>

                <Modal.Body className='p-0'>
                    <Row>
                        <Col lg={11} className='image-fabrics'>
                            <div>
                                {designImages && designImages.length > 0 ?
                                    <>
                                        <Carousel
                                            swipeable={false}
                                            draggable={false}
                                            responsive={responsive}
                                            ssr={true}
                                            autoPlaySpeed={1000}
                                        >
                                            {designImages.map((image, index) => {
                                                return (
                                                    <>
                                                        <div
                                                            key={index}
                                                            className="single-image-slider-fabrics"
                                                            style={{
                                                                backgroundImage:
                                                                    `url(${process.env.REACT_APP_STORAGE_URL}portfolio/${image.image_url})`
                                                            }}
                                                        >
                                                        </div>
                                                    </>
                                                )
                                            })}
                                        </Carousel>;
                                    </>
                                    :
                                    <>
                                        <img src={DressPlaceholder} className='w-100 img-placeholder-height' />
                                    </>
                                }

                                <div>
                                    <div className='text-white book-consultation-bar w-100 d-flex justify-content-center'>
                                        <p className='request d-flex justify-content-between mb-5'>
                                            <a href={`/designer-profile?user_id=${singleDesign.userId}`} className='text-decoration-none'>
                                                <div className='d-flex justify-content-center align-items-center user-image'>
                                                    {singleDesign.image !== '' && singleDesign.image !== '-' ? (
                                                        <div
                                                            className='user-photo'
                                                            style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                                        >
                                                        </div>
                                                    ) : (
                                                        <img src={User} className='placeholder-img ' />
                                                    )}
                                                    <div className='ms-3'>
                                                        <div className='modal-title text-left fs-20 fw-600 text-white'>{singleDesign.first_name} {singleDesign.last_name}</div>
                                                        <div className='fashion-designer fs-16'>Fashion Designer</div>
                                                    </div>
                                                </div>
                                            </a>

                                            {isDesignCurrentUser ?
                                                null
                                                :
                                                <>
                                                    <div className='btn-book-bar'>
                                                        {/* <a href={`/appointment/schedule/${singleDesign.id}`}> */}
                                                        <a href={`/designer/${singleDesign.id}/appointment/schedule/0`}>
                                                            <button className='btn btn-book-consultation'>Book a Consultation</button>
                                                        </a>
                                                    </div>
                                                </>
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={1}>
                            {profileViewShow &&
                                <>
                                    <div>
                                        <Card className="table_content file-action mt-3 me-0 card-profile-designer">
                                            <Card.Header className='card-hr bg-white'>
                                                <button
                                                    type='button'
                                                    className='close react-modal-close'
                                                    onClick={() => setProfileViewShow(false)}
                                                >
                                                    <IoCloseOutline color="#7e7e7e" size={25} />
                                                </button>
                                            </Card.Header>
                                            <Card.Body className="action_container font-weight">
                                                <Row>
                                                    <Col>
                                                        <div className='user-image-modal text-center'>
                                                            {singleDesign.image !== '' && singleDesign.image !== '-' ? (
                                                                <div
                                                                    className='user-photo-modal mb-2 '
                                                                    style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                                                >
                                                                </div>
                                                            ) : (
                                                                <img src={User} className='placeholder-img-side mb-2' />
                                                            )}
                                                        </div>
                                                        <div className='modal-title text-center fs-18 fw-600 text-black'>{singleDesign.first_name} {singleDesign.last_name}</div>
                                                        <div className='fs-14 text-center mt-2'>
                                                            <img src={PinIcon} alt="location pin" className='me-2' />
                                                            {singleDesign.address_line_1}{singleDesign.province}</div>
                                                        <div className="mb-2 text-center">
                                                            {singleDesign.tags ?
                                                                <>
                                                                    {singleDesign.tags.length > 0 ?
                                                                        <>
                                                                            {singleDesign.tags.map((tag, index) => (
                                                                                <span className="design-tags bg-light fs-14 categories-color mt-2">
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

                                                        {isDesignCurrentUser ?
                                                            null
                                                            :
                                                            <>
                                                                <hr />
                                                                <div className='text-center'>
                                                                    {/* <a className='book-consultation btn-book btn w-100'
                                                                        href={`/appointment/schedule/${singleDesign.id}`}
                                                                    > */}
                                                                    <a
                                                                        href={`/designer/${singleDesign.id}/appointment/schedule/0`}
                                                                        className='book-consultation btn-book btn w-100'>

                                                                        <IoVideocam className="me-2" color="#ffffff" />Book a Consultation</a>
                                                                </div>

                                                                <div className='text-center mt-2'
                                                                    onClick={() => { toggleUnderConstruction("Message"); setProfileViewShow(false); }}
                                                                >
                                                                    <a className='book-consultation btn-message-designer btn w-100'
                                                                    >
                                                                        <AiFillMessage className="me-2" />Send Message</a>
                                                                </div>
                                                            </>
                                                        }
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </>
                            }

                            <div>
                                <div>
                                    <div className='user-image-side thumbnail-table text-center cursor-pointer' onClick={() => setProfileViewShow(true)}>
                                        {singleDesign.image !== '' && singleDesign.image !== '-' ? (
                                            <div
                                                className='user-photo-side mb-4 '
                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                            >
                                            </div>
                                        ) : (
                                            <img src={User} className='placeholder-img-side mb-4' />
                                        )}


                                    </div>
                                </div>

                                {isDesignCurrentUser ?
                                    null
                                    :
                                    <>
                                        <div className='text-center mb-4' >
                                            {/* <a href={`/appointment/schedule/${singleDesign.id}`}> */}
                                            <a href={`/designer/${singleDesign.id}/appointment/schedule/0`}>
                                                <div className="action-button-designs bg-white">
                                                    <PiNotepadFill className="text-black mt-2" size={30} />
                                                </div>
                                            </a>
                                            <div className='icon-name-color fs-12 mt-2 fw-600'>Consultation</div>
                                        </div>

                                        <div className='text-center mb-4' onClick={() => toggleUnderConstruction("Message")}>
                                            <div className="action-button-designs bg-white">
                                                <AiFillMessage className="text-black mt-2" size={30} />
                                            </div>
                                            <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Message</div>
                                        </div>
                                    </>
                                }

                                <div className='text-center mb-4'
                                    onClick={toggleShareModal}
                                >
                                    <div className="action-button-designs bg-white">
                                        <IoShareSocial className="text-black mt-2" size={30} />
                                    </div>
                                    <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Share</div>
                                </div>

                                <div className='text-center mb-4' onClick={toggleDescription}>
                                    <div className="action-button-designs bg-white">
                                        <IoInformationOutline className="text-black mt-2" size={30} />
                                    </div>
                                    <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Description</div>
                                </div>
                                {userRole !== 'Admin' && !isDesignCurrentUser ?
                                    <>
                                        {currentUser ?
                                            <>  
                                                {inWishlist ?
                                                    <div className='text-center mb-4' onClick={function () { favoriteDesignUpdate({ user_id: currentUser, portfolio_item_id: singleDesign.portfolioId }); }}>
                                                        <div className="action-button-designs bg-gold">
                                                            <GoStar className="text-white mt-2" size={30} />
                                                        </div>
                                                        <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Remove from Favorites</div>
                                                    </div>
                                                    :
                                                    <div className='text-center mb-4' onClick={function () { favoriteDesignUpdate({ user_id: currentUser, portfolio_item_id: singleDesign.portfolioId }); }}>
                                                        <div className="action-button-designs bg-white">
                                                            <GoStar className="text-black mt-2" size={30} />
                                                        </div>
                                                        <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Add to Favorites</div>
                                                    </div>
                                                }
                                            </>
                                            :
                                            <>
                                                {tempFavorites.some(favItem => favItem.id === singleDesign.portfolioId) ?
                                                    <div className='text-center mb-4' onClick={function () { toggleTempFavorite({id: singleDesign.portfolioId, user_id: currentUser, name: singleDesign.name, description: singleDesign.description, image_urls: singleDesign.image[0], designer_user_id: singleDesign.userId}); }}>
                                                        <div className="action-button-designs bg-gold">
                                                            <GoStar className="text-white mt-2" size={30} />
                                                        </div>
                                                        <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Remove from Favorites</div>
                                                    </div>
                                                    :
                                                    <div className='text-center mb-4' onClick={function () { toggleTempFavorite({id: singleDesign.portfolioId, user_id: currentUser, name: singleDesign.name,  description: singleDesign.description, image_urls: singleDesign.image[0], designer_user_id: singleDesign.userId}); }}>
                                                        <div className="action-button-designs bg-white">
                                                            <GoStar className="text-black mt-2" size={30} />
                                                        </div>
                                                        <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Add to Favorites</div>
                                                    </div>
                                                }
                                            </>
                                        }
                                        
                                    </>
                                    :
                                    <></>
                                }
                                {/* {!isDesignCurrentUser ?
                                    <div className='text-center mb-4'>
                                        <div className="action-button-designs bg-white">
                                            <BsCartPlus className="text-black mt-2" size={30} />
                                        </div>
                                        <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Add to Cart</div>
                                    </div>
                                    :
                                    null
                                } */}
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal >

            <Modal
                show={messageShow}
                className='modal-preview'
                fade={false}
                size="sm"
                id="under-construction"
            >
                <Modal.Header className="py-0">
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={() => setMessageShow(false)}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} />
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <Card className='border-none'>
                        <Card.Body className="text-center py-5 pt-2 pb-2">
                            <div className='user-image-message thumbnail-table'>
                                {singleDesign.image && (
                                    <div
                                        className='user-photo-message mb-2 '
                                        style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                    >
                                    </div>
                                )}
                            </div>
                            <div className='modal-title text-center fs-20 fw-600 text-black mb-3'>{singleDesign.first_name} {singleDesign.last_name}</div>
                            {/* <textarea className='form-control text-height' placeholder='Your message'></textarea> */}
                            {/* <MeetingChat
                                currentUser={currentUser}
                                appointmentId={appointmentId}
                                user={userDetails}
                            /> */}
                        </Card.Body>
                    </Card>
                </Modal.Body>

                <ModalFooter>
                    <div className='text-right'>
                        {/* <Button className="btn-cancel-message btn me-2" onClick={() => { setMessageShow(false); }}>Cancel</Button>
                        <Button className="btn-primary btn" onClick={() => { toggleUnderConstruction(); setMessageShow(false); }}>Send Message</Button> */}

                        <button
                            className="btn btn-secondary border-black btn-style bg-white text-black me-3"
                            onClick={() => { setMessageShow(false); }}
                            type="button"
                        >
                            Cancel
                        </button>
                        {/* {portfolioSendLoading ?
                            <button className="btn btn-primary" type="button" style={{ minWidth: '100px', padding: '9px 20px' }}>Sending...</button>
                            : */}
                        <button
                            className="btn btn-primary btn-style"
                            type="button"
                            onClick={() => { toggleUnderConstruction(); setMessageShow(false); }}
                        >
                            Send Message
                        </button>
                        {/* } */}
                    </div>
                </ModalFooter>
            </Modal>

            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
                id="under-construction"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-left fs-22 mt-2'>{modalHeading}</h5>
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={() => setUnderConstructionShow(false)}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} />
                    </button>
                </Modal.Header>

                <Modal.Body className='pt-2'>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>

            <Modal
                show={descriptionShow}
                fade={false}
                centered
                id="description-card"
            >
                <Modal.Header className="py-0">
                    <button
                        type='button'
                        className='close react-modal-close description-close'
                        onClick={() => setDescriptionShow(false)}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} />
                    </button>
                </Modal.Header>

                <Modal.Body className='card-description d-flex align-items-center'>
                    <p className='text-white fw-400 p-3 fs-14 mb-0'>{singleDesign.description}</p>
                </Modal.Body>
            </Modal>

            <Modal
                show={copyEmbedLink}
                id='modal-preview-embed'
                fade={false}
                centered
                className='embed-modal-view'

            >
                <Modal.Header className="p-3 pb-0">
                    <h5 className='mb-0 rufina-family fs-22 text-black'>Embed Design</h5>
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={() => setCopyEmbedLink(false)}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} />
                    </button>
                </Modal.Header>
                <Modal.Body className='pb-0 pt-4'>
                    <Row>
                        <Col lg='12' className='px-3'>
                            <textarea className='text-area-embed'>
                                {iframeLink}
                            </textarea>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="text-right border-none">
                    <button
                        className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
                        onClick={() => setCopyEmbedLink(false)}
                        type="button" >
                        Cancel
                    </button>

                    <CopyTo
                        text={iframeLink}
                        classes="btn btn-primary btn-style"
                        standbyTitle="Copy"
                        icon={false}
                        onCopy={() => setCopy(true)}
                        loadingTitle="Embed Copied"
                        closeModal={() => setCopyEmbedLink(false)}
                    />
                </Modal.Footer>
            </Modal >

            <Modal
                show={shareShowModal}
                className='modal-preview-share'
                fade={false}
                centered
                id='share-modal'
            >
                <Modal.Header className="pb-0">
                    <Modal.Title className='rufina-family fs-22 text-black'>Share Design</Modal.Title>
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={function () { setShareShowModal(false); }}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body className='padding-share-card'>
                            <div>
                                {designImages && designImages.length > 0 ?
                                    <>
                                        <Carousel
                                            swipeable={false}
                                            draggable={false}
                                            responsive={responsive}
                                            ssr={true}
                                            autoPlaySpeed={1000}
                                        >
                                            {designImages.map((image, index) => {

                                                return (
                                                    <>
                                                        <div key={index} className="single-image-slider-share mb-4"
                                                            style={{
                                                                backgroundImage:
                                                                    `url(${process.env.REACT_APP_STORAGE_URL}portfolio/${image.image_url})`
                                                            }}
                                                        >
                                                        </div>

                                                        <div className='d-flex user-image-share image-share-popup'>

                                                            {singleDesign.image !== '' && singleDesign.image !== '-' ? (
                                                                <div
                                                                    className='user-photo-share mt-1'
                                                                    style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                                                >
                                                                </div>
                                                            ) : (
                                                                <img src={UserPlaceholder} className='placeholder-img-share' alt="User Placeholder" />
                                                            )}

                                                            <div className='ms-2'>
                                                                <div className='modal-title text-left fs-16 fw-600 text-white'>{singleDesign.first_name} {singleDesign.last_name}</div>
                                                                <div>
                                                                    {singleDesign.tags ?
                                                                        <>
                                                                            {singleDesign.tags.length > 0 ?
                                                                                <>

                                                                                    {singleDesign.tags.slice(0, 3).map((tag, index) => (
                                                                                        <span key={index} className="design-tags-view-bar bg-light fs-12 categories-color text-black">
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
                                                    </>
                                                )
                                            })}
                                        </Carousel>
                                    </>
                                    :
                                    <>

                                    </>
                                }

                                <div lg='12' className='text-center'>
                                    <CopyTo
                                        text={`https://kouture-konect.web.app/view-design/${singleDesign.portfolioId}`}
                                        classes="btn btn-copy-link border-black bg-white text-black mt-2 w-100"
                                        standbyTitle="Copy Link"
                                        icon={true}
                                        closeModal={() => setShareShowModal(false)}
                                    />

                                    <button
                                        className="btn btn-copy-link border-black bg-white text-black mt-2 w-100"
                                        type="button"
                                        onClick={() => {
                                            toggleCopyEmbedLinkModal();
                                            setShareShowModal(false);
                                        }}
                                    >
                                        <ImEmbed2 className='me-2' size={17} />
                                        Copy Embed Code
                                    </button>
                                </div >
                            </div >
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Designs;