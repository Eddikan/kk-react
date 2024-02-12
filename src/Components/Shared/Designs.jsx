import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Form, ModalHeader, Card, ModalFooter } from 'react-bootstrap';
import UserPlaceholder from 'Assets/images/placeholders/user.png';
import toast from 'react-hot-toast';
import GetDesignsData from 'Utils/GetDesignsData';
import { GoHeart, GoAlertFill } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import PinIcon from '../../Assets/images/pin.png';
import Modal from 'react-bootstrap/Modal';
import { IoEyeOutline, IoHeartOutline } from "react-icons/io5";
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import { AiFillMessage } from "react-icons/ai";
import { PiNotepadFill } from "react-icons/pi";
import '../../Assets/styles/Design/style.css';
import { IoShareSocial, IoInformationOutline, IoVideocam } from "react-icons/io5";
import axios from 'axios';
import { Rating } from 'react-simple-star-rating';
import Carousel from 'react-multi-carousel';
import ImageSlider from '../../Components/Shared/ImageSlider';

const Designs = (props) => {
    const navigate = useNavigate();
    const reloadCount = props.reloadCount;
    const currentUser = props.currentUser;
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


    const showSignupModal = (e) => {
        props.onSignup(e);
    }

    function toggleDescription() {
        setDescriptionShow(true);
    }

    function toggleMessage() {
        setMessageShow(true);
    }

    function toggleUnderConstruction() {
        setUnderConstructionShow(true);
    }

    function togglePortfolioImage(id, first_name, last_name, image_urls, image, address_line_1, province, tags, description) {
        setPortfolioImage(true);
        setSingleDesign({
            id: id ?? 0,
            first_name: first_name ?? '-',
            last_name: last_name ?? '-',
            image: image ?? '-',
            address_line_1: address_line_1 ?? '-',
            province: province ?? '-',
            tags: tags ?? '-',
            description: description ?? '-'

        })
        setDesignImages([image_urls]);
        if (image_urls?.[0]?.image_url) {
            setActiveImage(process.env.REACT_APP_STORAGE_URL + 'portfolio/' + image_urls[0].image_url);
        } else {
            setActiveImage(PlaceholderImage);
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

    useEffect(() => {
        fetchData(currentUser);
    }, [reloadCount]);

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };

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
                                        return (
                                            <>
                                                {index < limit ?
                                                    <Col className="designs-grid mb-3" xs="12" md="3">
                                                        {currentUser ?
                                                            <>
                                                                <div className='portfolio-link cursor-pointer' onClick={function () { togglePortfolioImage(design.id, design.user.first_name, design.user.last_name, design.image_urls, design.user.image, design.user.address_line_1, design.user.province, design.tags, design.description); }}>
                                                                    <div className="designs-grid-div w-100" style={{ backgroundImage: "url(" + designImage + ")", minHeight: '200px' }}>
                                                                        {/* {currentUser ?
                                                                            <div className='save-link'>
                                                                                <div className="action-button bg-white me-2">
                                                                                    <GoBookmark className="text-black" />
                                                                                </div>
                                                                                <div className="action-button bg-white">
                                                                                    <GoHeart className="text-black" />
                                                                                </div>
                                                                            </div>
                                                                            :
                                                                            null
                                                                        } */}
                                                                    </div>
                                                                </div>
                                                            </>
                                                            :
                                                            <>
                                                                <div className="designs-grid-div cursor-pointer w-100" style={{ backgroundImage: "url(" + designImage + ")" }} onClick={() => showSignupModal('user_design')}>
                                                                    {/* {currentUser ?
                                                                        <div className='save-link'>
                                                                            <div className="action-button bg-white me-2">
                                                                                <GoBookmark className="text-black" />
                                                                            </div>
                                                                            <div className="action-button bg-white">
                                                                                <GoHeart className="text-black" />
                                                                            </div>
                                                                        </div>
                                                                        :
                                                                        null
                                                                    } */}
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
                <ModalHeader className='pt-2 pb-3 bg-transparent-card'>
                    <div className='d-flex justify-content-center align-items-center user-image'>
                        {singleDesign.image && (
                            <div
                                className='user-photo'
                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                            >
                            </div>
                        )}

                        <div className='ms-3'>
                            <div className='modal-title text-left fs-20 fw-600 text-white'>{singleDesign.first_name} {singleDesign.last_name}</div>
                            <div className='fashion-designer fs-16'>Fashion Designer</div>
                        </div>
                    </div>
                    <button type='button' className='close modal-close' aria-label='Close' onClick={() => setPortfolioImage(false)}>
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
                                            infinite={true}
                                            autoPlaySpeed={1000}
                                        >
                                            {designImages.map((image, index) => {

                                                return (
                                                    <>
                                                        <div className="single-image-slider-fabrics"
                                                            // style={{
                                                            //     backgroundImage:
                                                            //         `url(${process.env.REACT_APP_STORAGE_URL}portfolio/${image.image_url})`
                                                            // }}
                                                            style={{ backgroundImage: "url(" + activeImage + ")" }}
                                                        >
                                                        </div>

                                                    </>
                                                )
                                            })}
                                        </Carousel>;
                                    </>
                                    :
                                    <>
                                        <div className="single-image-slider" style={{ backgroundImage: "url(" + activeImage + ")" }}>
                                        </div>
                                    </>
                                }

                                <div>
                                    <div className='text-white book-consultation-bar w-100 d-flex justify-content-center'>
                                        <p className='request d-flex justify-content-between mb-5'>
                                            <div className='d-flex justify-content-center align-items-center user-image'>
                                                {singleDesign.image && (
                                                    <div
                                                        className='user-photo'
                                                        style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                                    >
                                                    </div>
                                                )}
                                                <div className='ms-3'>
                                                    <div className='modal-title text-left fs-20 fw-600 text-white'>{singleDesign.first_name} {singleDesign.last_name}</div>
                                                    <div className='fashion-designer fs-16'>Fashion Designer</div>
                                                </div>
                                            </div>

                                            <div className='btn-book-bar'>
                                                <a href={`/appointment/schedule/${singleDesign.id}`}>
                                                    <button className='btn btn-book-consultation'>Book a Consultation</button>
                                                </a>
                                            </div>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={1}>
                            <div>
                                <div>
                                    <div className='user-image-side thumbnail-table'>
                                        {singleDesign.image && (
                                            <div
                                                className='user-photo-side mb-4 '
                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                            >
                                            </div>
                                        )}

                                        <Card className="table_content file-action">
                                            <Card.Body className="action_container font-weight">
                                                <Row>
                                                    <Col>
                                                        {singleDesign.image && (
                                                            <div
                                                                className='user-photo-card mb-2 '
                                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                                            >
                                                            </div>
                                                        )}
                                                        <div className='modal-title text-center fs-20 fw-600 text-gold'>{singleDesign.first_name} {singleDesign.last_name}</div>
                                                        <div className='fs-14 text-center mt-2'>
                                                            <img src={PinIcon} alt="location pin" className='me-2' />
                                                            {singleDesign.address_line_1}{singleDesign.province}</div>
                                                        <div className='fs-18 fw-600 text-center mt-3'>Specialization and Expertise</div>
                                                        <div className="mb-2 text-center">
                                                            {singleDesign.tags ?
                                                                <>
                                                                    {singleDesign.tags.length > 0 ?
                                                                        <>
                                                                            {singleDesign.tags.map((tag, index) => (
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

                                                        <hr />
                                                        <div className='text-center'>
                                                            <a className='book-consultation btn-book btn'
                                                                href={`/appointment/schedule/${singleDesign.id}`}
                                                            ><IoVideocam className="me-2" color="#ffffff" />Book a Consultation</a>
                                                        </div>

                                                        <div className='text-center mt-2'
                                                            onClick={() => toggleMessage()}
                                                        >
                                                            <a className='book-consultation btn-message-designer btn'
                                                            ><AiFillMessage className="me-2" />Message Designer</a>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </div>

                                <div className='text-center mb-3' >
                                    <a href={`/appointment/schedule/${singleDesign.id}`}>
                                        <div className="action-button-designs bg-white">
                                            <PiNotepadFill className="text-black mt-2" size={30} />
                                        </div>
                                    </a>
                                    <div className='icon-name-color fs-12 mt-2 fw-600'>Consultation</div>
                                </div>

                                <div className='text-center mb-3' onClick={toggleMessage}>
                                    <div className="action-button-designs bg-white">
                                        <AiFillMessage className="text-black mt-2" size={30} />
                                    </div>
                                    <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Message</div>
                                </div>

                                <div className='text-center mb-3' onClick={() => toggleUnderConstruction()}>
                                    <div className="action-button-designs bg-white">
                                        <IoShareSocial className="text-black mt-2" size={30} />
                                    </div>
                                    <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Share</div>
                                </div>

                                <div className='text-center mb-3' onClick={toggleDescription} >
                                    <div className="action-button-designs bg-white">
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
                                {singleDesign.image && (
                                    <div
                                        className='user-photo-message mb-2 '
                                        style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                    >
                                    </div>
                                )}
                            </div>
                            <div className='modal-title text-center fs-20 fw-600 text-black mb-3'>{singleDesign.first_name} {singleDesign.last_name}</div>
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

            <Modal
                show={descriptionShow}
                fade={false}
                centered
                id="description-card"
            >
                <Modal.Header className="py-0">
                    <button type='button' className='close react-modal-close description-close' onClick={() => setDescriptionShow(false)} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>

                <Modal.Body className='card-description d-flex align-items-center'>
                    <p className='text-white fw-400 p-3 fs-14 mb-0'>{singleDesign.description}</p>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Designs;