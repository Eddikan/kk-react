import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import UserPlaceholder from 'Assets/images/placeholders/user.png';
import toast from 'react-hot-toast';
// import getDesignsData from 'Utils/GetDesignsData';
import GetDesignsData from 'Utils/GetDesignsData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { IoEyeOutline, IoHeartOutline } from "react-icons/io5";
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Rating } from 'react-simple-star-rating';

const Designs = (props) => {
    const navigate = useNavigate();
    const reloadCount = props.reloadCount;
    const currentUser = props.currentUser;
    const limit = props.limit ?? 16;
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [designs, setDesigns] = useState([]);
    const [designsLoading, setDesignsLoading] = useState(true);

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
            // Update state or perform other logic with userData
        } catch (error) {
            toast.error('An error occured. Please try again or contact the administrator.');
            setDesignsLoading(false);
            // Handle the error, if needed
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

    const handleActionClick = (index) => {
        // Toggle the selected item index
        setSelectedItemIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const addDesigner = () => {
        navigate('/designs/add')
    }

    const showSignupModal = (e) => {
        props.onSignup(e);
    }

    useEffect(() => {
        fetchData(currentUser);
    }, [reloadCount]);

    return (
        <>
            <div id="profile-designs">
                <p className="fs-20 text-center text-dark mb-2 proximanova-family"> Looking for Designs? <span className="text-gold">Explore now </span></p >
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
                                                                <Link to={`/portfolio/${design.id}`} className='portfolio-link' onClick={function () { toggleAddViewCount(design.id); }}>
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
                                                                </Link>
                                                            </>
                                                            :
                                                            <>
                                                                <div className="designs-grid-div  cursor-pointer w-100" style={{ backgroundImage: "url(" + designImage + ")" }} onClick={() => showSignupModal('user_design')}>
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
                                                                <p className="text-black fs-18 fw-600 mb-0 text-ellipsis">{design.name ?? '-'}</p>
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
                                                <Button className="btn-primary" variant="primary">View More</Button>
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
        </>
    );
};

export default Designs;