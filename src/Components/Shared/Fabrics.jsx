import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, ModalFooter, ModalHeader, Card } from 'react-bootstrap';
import toast from 'react-hot-toast';
import GetFabricsData from 'Utils/GetFabricsData';
import Carousel from 'react-multi-carousel';
import PinIcon from '../../Assets/images/pin.png';
import { GoHeart, GoAlertFill } from "react-icons/go";
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import ImageSlider from 'Components/Shared/ImageSlider';
import { IoShareSocial, IoInformationOutline, IoVideocam } from "react-icons/io5";
import { AiFillMessage } from "react-icons/ai";
import { PiNotepadFill } from "react-icons/pi";
import '../../Assets/styles/FabricsHomePage/style.css';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { Rating } from 'react-simple-star-rating';

const Fabrics = (props) => {
    const navigate = useNavigate();
    const reloadCount = props.reloadCount;
    const currentUser = props.currentUser;
    const limit = props.limit ?? 16;
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [fabrics, setFabrics] = useState([]);
    const [fabricsLoading, setFabricsLoading] = useState(true);
    const [productsImage, setProductsImage] = useState(false);
    const [rating, setRating] = useState(5);
    const [messageShow, setMessageShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [activeImage, setActiveImage] = useState('');
    const [singleFabric, setSingleFabric] = useState('');
    const [fabricImages, setFabricImages] = useState([]);

    function toggleMessage() {
        setMessageShow(true);
    }

    function toggleUnderConstruction() {
        setUnderConstructionShow(true);
    }

    function toggleProductsImage(id, first_name, last_name, image_urls, image, address_line_1, province) {
        setProductsImage(true);
        setSingleFabric({
            id: id ?? 0,
            first_name: first_name ?? '-',
            last_name: last_name ?? '-',
            image: image ?? '-',
            address_line_1: address_line_1 ?? '-',
            province: province ?? '-'

        })
        setFabricImages([image_urls]);
        console.log("image_urls", image_urls);

        if (image_urls?.[0]?.image_url) {
            setActiveImage(process.env.REACT_APP_STORAGE_URL + 'product/' + image_urls[0].image_url);
        } else {
            setActiveImage(PlaceholderImage);
        }
    }

    const fetchData = async (e) => {
        try {
            const fabricsData = await GetFabricsData(e);
            if (fabricsData) {
                setFabrics(fabricsData);
                setFabricsLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setFabricsLoading(false);
            }
        } catch (error) {
            toast.error('An error occured. Please try again or contact the administrator.');
            setFabricsLoading(false);
        }
    };

    async function toggleSortFabrics(type, sort) {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'product/fabric' + type + sort).then((response) => {
            const selectedFabrics = response.data.data;
            if (selectedFabrics) {
                setFabrics(selectedFabrics);
                setFabricsLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setFabricsLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setFabricsLoading(false);
        });
    }


    async function toggleAddViewCount(id) {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'product/view/' + id).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
        });
    }

    const showSignupModal = (e) => {
        props.onSignup(e);
    }

    async function wishlistUpdate(e) {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'wishlist/update', e).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                fetchData(currentUser);
            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
        }).catch((error) => {
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    useEffect(() => {
        fetchData(currentUser);
    }, [reloadCount]);

    const handleActiveImageChange = (fabricImage) => {
        setActiveImage(fabricImage);
    };

    return (
        <>
            <div id="profile-designs">
                <p className="fs-20 text-center text-dark mb-2"> Searching for Fabrics?</p >
                <h2 className="fs-35 fw-500 text-center text-black explore-premium-fabrics">Explore Premium Fabrics</h2>
                {fabricsLoading ?
                    <>
                        <p className='text-center mb-3 mt-3'>
                            Loading...
                        </p>
                    </>
                    :
                    <>
                        {fabrics && fabrics.length > 0 ?
                            <>
                                <Row className="designs-row">
                                    {/* {currentUser ?
                                        <Col lg="12" className='d-flex justify-content-end mb-3'>
                                            <div style={{ position: "relative" }}>
                                                <select
                                                    className="form-control mb-3 me-2 sort-input"
                                                    onChange={(e) => {
                                                        const selectedOption = e.target.value;
                                                        if (selectedOption === "New") {
                                                            toggleSortFabrics("?date=", "desc"); 
                                                        } else if (selectedOption === "Price") {
                                                            toggleSortFabrics("?price=", "desc");
                                                        } else if (selectedOption === "Most Liked") {
                                                            toggleSortFabrics("?likes=", "desc");
                                                        } else {
                                                            toggleSortFabrics("", "");
                                                        }
                                                    }}
                                                >
                                                    <option value="">Sort By</option>
                                                    <option value="New">Date</option>
                                                    <option value="Price">Price</option>
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
                                    {fabrics.slice(0, 8).map((fabric, index) => {
                                        if (fabric.image_urls?.[0]?.image_url) {
                                            var fabricImage = process.env.REACT_APP_STORAGE_URL + 'product/' + fabric.image_urls[0].image_url;
                                        } else {
                                            var fabricImage = PlaceholderImage;
                                        }
                                        var wishlist_user_ids = fabric.wishlist_user_ids;
                                        const userWishlist = wishlist_user_ids.includes(currentUser);

                                        return (
                                            <>
                                                {index < limit ?
                                                    <Col className="designs-grid mb-3" xs="12" md="3">
                                                        {currentUser ?
                                                            <>
                                                                <div className="portfolio-link">
                                                                    <Link to={`/product/${fabric.id}`}>
                                                                        <div className="designs-grid-div w-100 cursor-pointer"
                                                                            onClick={function () { toggleAddViewCount(fabric.id); }}
                                                                            style={{ backgroundImage: "url(" + fabricImage + ")", minHeight: '200px' }}>
                                                                        </div>
                                                                    </Link>
                                                                    {currentUser ?
                                                                        <div className='save-link'>
                                                                            {/* <div className="action-button bg-white me-2">
                                                                                        <GoBookmark className="text-black" />
                                                                                    </div> */}
                                                                            {userWishlist ?
                                                                                <div className="action-button bg-gold" onClick={function () { wishlistUpdate({ user_id: currentUser, product_id: fabric.id }); }}>
                                                                                    <GoHeart className="text-white" />
                                                                                </div>
                                                                                :
                                                                                <div className="action-button bg-white" onClick={function () { wishlistUpdate({ user_id: currentUser, product_id: fabric.id }); }}>
                                                                                    <GoHeart className="text-black" />
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                        :
                                                                        null
                                                                    }
                                                                </div>
                                                            </>
                                                            :
                                                            <>
                                                                <div className="designs-grid-div  cursor-pointer w-100" style={{ backgroundImage: "url(" + fabricImage + ")" }} onClick={() => showSignupModal('user_design')}>
                                                                    {currentUser ?
                                                                        <div className='save-link'>
                                                                            {/* <div className="action-button bg-white me-2">
                                                                                <GoBookmark className="text-black" />
                                                                            </div> */}
                                                                            <div className="action-button bg-white">
                                                                                <GoHeart className="text-black" />
                                                                            </div>
                                                                        </div>
                                                                        :
                                                                        null
                                                                    }
                                                                </div>
                                                            </>
                                                        }
                                                        <div className="design-details">
                                                            <div className='d-flex align-items-center justify-content-between'>
                                                                <h4 className="text-black fs-18 fw-600 mb-0 text-ellipsis mt-2">{fabric.name ?? '-'}</h4>
                                                                {/* {currentUser ?
                                                                    <div className='d-flex align-items-center'>
                                                                        <span className='fs-14 text-no-wrap mx-2'>
                                                                            <IoHeartOutline /> {fabric.wishlist_count}
                                                                        </span>
                                                                        <span className='fs-14 text-no-wrap'>
                                                                            <IoEyeOutline /> {fabric.views}
                                                                        </span>
                                                                    </div>
                                                                    :
                                                                    null
                                                                }    */}
                                                            </div>
                                                            <div className="star-ratings mt-1">
                                                                <Rating
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
                                                                /* Available Props */
                                                                />
                                                            </div>
                                                            <h4 className="text-black fs-18 fw-600 mt-2 text-ellipsis">${fabric.price && fabric.price > 0 ? Number(fabric.price).toFixed(2) : '0.00'}</h4>
                                                            {/* {currentUser ?
                                                                <div className='d-flex align-items-center mt-1'>
                                                                    {fabric.user.image ?
                                                                        <div className='designer-photo-small' style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'user/'+fabric.user.image+")"}} ></div>
                                                                        :
                                                                        <div className='designer-photo-small' style={{ backgroundImage: "url("+UserPlaceholder+")"}} ></div>
                                                                    }
                                                                    &nbsp;&nbsp;
                                                                    <p className="text-black fs-14 mb-0">{fabric.user.first_name && fabric.user.first_name != "" ? fabric.user.first_name : "-"} {fabric.user.last_name && fabric.user.last_name != "" ? fabric.user.last_name : "-"}</p>
                                                                </div>
                                                                :
                                                                null
                                                            } */}
                                                        </div>
                                                    </Col >
                                                    :
                                                    null
                                                }
                                            </>
                                        )
                                    })}
                                    <Col lg={12} className="text-center mt-4">
                                        {currentUser ?
                                            <Link to="/fabrics">
                                                <Button className="btn-primary" variant="primary">View All</Button>
                                            </Link>
                                            :
                                            <Button className="btn-primary" variant="primary" onClick={() => showSignupModal('user_fabric')}>View More</Button>
                                        }
                                    </Col>
                                </Row>
                            </>
                            :
                            <p className="text-center mb-3 mt-3">No records found.</p>
                        }
                    </>
                }
            </div >


            <Modal
                show={productsImage}
                fade={false}
                className='modal-full-width'
            >
                <ModalHeader className='pt-2 pb-3 bg-black'>

                    <div className='d-flex user-image'>
                        {singleFabric.image && (
                            <div
                                className='user-photo'
                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleFabric.image})` }}
                            >
                            </div>
                        )}

                        <div className='ms-3'>
                            <div className='modal-title text-left fs-20 fw-600 text-white'>{singleFabric.first_name} {singleFabric.last_name}</div>
                            <div className='fashion-designer fs-16'>Fashion Designer</div>
                        </div>
                    </div>
                    <button type='button' className='close modal-close' aria-label='Close' onClick={() => setProductsImage(false)}>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                </ModalHeader>
                <Modal.Body className='p-0'>
                    <Row>
                        <Col lg={11} className='bg-black image-fabrics'>
                            <div>
                                {fabricImages && fabricImages.length > 0 ?
                                    <>
                                        <div className="single-image-slider-fabrics"
                                            style={{
                                                backgroundImage: "url(" + activeImage + ")"
                                            }}
                                        >
                                        </div>
                                    </>
                                    :
                                    <>
                                    </>
                                }

                                <div>
                                    <div className='text-white book-consultation-bar w-100 d-flex justify-content-center'>
                                        <p className='request d-flex justify-content-between mb-4'>
                                            <div className='d-flex justify-content-center align-items-center user-image'>
                                                {singleFabric.image && (
                                                    <div
                                                        className='user-photo'
                                                        style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleFabric.image})` }}
                                                    >
                                                    </div>
                                                )}

                                                <div className='ms-3'>
                                                    <div className='modal-title text-left fs-20 fw-600 text-white'>{singleFabric.first_name} {singleFabric.last_name}</div>
                                                    <div className='fashion-designer fs-16'>Fashion Designer</div>
                                                </div>
                                            </div>

                                            <div className='btn-book-bar'>
                                                <a href={`/appointment/schedule/${singleFabric.id}`}>
                                                    <button className='btn btn-book-consultation'>Book a Consultation</button>
                                                </a>
                                            </div>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={1} className='bg-black'>
                            <div>
                                <div>
                                    <div className='user-image-side thumbnail-table'>
                                        {singleFabric.image && (
                                            <div
                                                className='user-photo-side mb-4 '
                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleFabric.image})` }}
                                            >
                                            </div>
                                        )}

                                        <Card className="table_content file-action">
                                            <Card.Body className="action_container font-weight">
                                                <Row>
                                                    <Col>
                                                        {singleFabric.image && (
                                                            <div
                                                                className='user-photo-card mb-2 '
                                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleFabric.image})` }}
                                                            >
                                                            </div>
                                                        )}
                                                        <div className='modal-title text-center fs-20 fw-600 text-gold'>{singleFabric.first_name} {singleFabric.last_name}</div>
                                                        <div className='fs-14 text-center mt-2'><img src={PinIcon} alt="location pin" className='me-2' />{singleFabric.address_line_1}{singleFabric.province}</div>
                                                        <div className='fs-18 fw-600 text-center mt-3'>Specialization and Expertise</div>

                                                        <hr />
                                                        <div className='text-center'>
                                                            <a className='book-consultation btn-book btn'
                                                                href={`/appointment/schedule/${singleFabric.id}`}
                                                            ><IoVideocam className="me-2" color="#ffffff" />Book a Consultation</a>
                                                        </div>

                                                        <div className='text-center mt-2' onClick={() => toggleMessage()}>
                                                            <a className='book-consultation btn-message-designer btn'
                                                            ><AiFillMessage className="me-2" />Message Designer</a>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </div>

                                <div className='text-center mb-3' onClick={() => toggleUnderConstruction()}>
                                    <div className="action-button-fabrics bg-white">
                                        <PiNotepadFill className="text-black mt-2" size={30} />
                                    </div>
                                    <div className='icon-name-color fs-12 mt-2 fw-600'>Consultation</div>
                                </div>

                                <div className='text-center mb-3' onClick={toggleMessage}>
                                    <div className="action-button-fabrics bg-white">
                                        <AiFillMessage className="text-black mt-2" size={30} />
                                    </div>
                                    <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Message</div>
                                </div>

                                <div className='text-center mb-3' onClick={() => toggleUnderConstruction()}>
                                    <div className="action-button-fabrics bg-white">
                                        <IoShareSocial className="text-black mt-2" size={30} />
                                    </div>
                                    <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Share</div>
                                </div>

                                <div className='text-center mb-3' onClick={() => toggleUnderConstruction()}>
                                    <div className="action-button-fabrics bg-white">
                                        <IoInformationOutline className="text-black mt-2" size={30} />
                                    </div>
                                    <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Description</div>
                                </div>
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
            >
                <Modal.Header className="py-0">
                    <button type='button' className='close react-modal-close' onClick={() => setMessageShow(false)} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <Card className='border-none'>
                        <Card.Body className="text-center py-5 pt-2 pb-2">
                            <div className='user-image-message thumbnail-table'>
                                {singleFabric.image && (
                                    <div
                                        className='user-photo-message mb-2 '
                                        style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleFabric.image})` }}
                                    >
                                    </div>
                                )}
                            </div>
                            <div className='modal-title text-center fs-20 fw-600 text-black mb-3'>{singleFabric.first_name} {singleFabric.last_name}</div>
                            <textarea className='form-control text-height' placeholder='Your message'></textarea>
                        </Card.Body>
                    </Card>
                </Modal.Body>

                <ModalFooter>
                    <div className='text-right'>
                        <Button className="btn-cancel-message btn me-2" onClick={() => { setMessageShow(false); }}>Cancel</Button>
                        <Button className="btn-primary btn" onClick={() => { toggleUnderConstruction(); setMessageShow(false); }}>Send Message</Button>
                    </div>
                </ModalFooter>
            </Modal>

            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button type='button' className='close react-modal-close' onClick={() => setUnderConstructionShow(false)} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>

                <Modal.Body>
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

export default Fabrics;