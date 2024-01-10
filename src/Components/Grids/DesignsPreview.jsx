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
import PlaceholderImage from 'Assets/images/placeholders/image.png'
import axios from 'axios';

const Designs = (props) => {
    const navigate = useNavigate();
    const reloadCount = props.reloadCount;
    const currentUser = props.currentUser;
    const limit = props.limit;
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

    const showSignupModal = (e) => {
        props.onSignup(e);
    }

    async function toggleSortDesigns(type, sort) {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'portfolio/design' +type+sort).then((response) => {
            const selectedDesigns = response.data.data;
            if(selectedDesigns) {
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
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'portfolio/view/'+id).then((response) => {
            const success = response.data.status;
            if(success == 'Success') {
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

    useEffect(() => {
        fetchData(currentUser);
    }, [reloadCount]);

    return (
        <>
            <div id="profile-designs">
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
                                {limit ?
                                    <>
                                        <Row className="designs-row">
                                            {designs.map((design, index) => {
                                                if (design.image_urls?.[0]?.image_url) {
                                                    var designImage = process.env.REACT_APP_STORAGE_URL+'portfolio/'+design.image_urls[0].image_url;
                                                } else {
                                                    var designImage = PlaceholderImage;
                                                }
                                                return (
                                                    <>
                                                        {index < limit ?
                                                            <Col className="designs-grid mb-3 cursor-pointer" xs="4" md="3" onClick={() => showSignupModal('user_design')}>
                                                                <div className="designs-grid-div w-100" style={{ backgroundImage: "url("+designImage+")"}}>
                                                                    
                                                                </div>
                                                                <div className="design-details">
                                                                    <div className='d-flex align-items-center justify-content-between'>
                                                                        <p className="text-black fs-18 fw-600 mb-0 text-ellipsis">{design.name ?? '-'}</p>
                                                                        
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            :
                                                            null
                                                        }
                                                    </>
                                                )
                                            })}
                                        </Row>
                                    </>
                                    :
                                    <Row className="designs-row">
                                        {designs.map((design, index) => {
                                            if (design.image_urls?.[0]?.image_url) {
                                                var designImage = process.env.REACT_APP_STORAGE_URL+'portfolio/'+design.image_urls[0].image_url;
                                            } else {
                                                var designImage = PlaceholderImage;
                                            }
                                            return (
                                                <>
                                                    <Col className="designs-grid mb-3 cursor-pointer" xs="4" md="3" onClick={() => showSignupModal('user_design')}>
                                                        <div className="designs-grid-div w-100" style={{ backgroundImage: "url("+designImage+")"}}>
                                                            
                                                        </div>
                                                        <div className="design-details">
                                                            <div className='d-flex align-items-center justify-content-between'>
                                                                <p className="text-black fs-18 fw-600 mb-0 text-ellipsis">{design.name ?? '-'}</p>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </>
                                            )
                                        })}
                                    </Row>
                                }
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