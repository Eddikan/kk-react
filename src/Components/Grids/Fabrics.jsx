import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import UserPlaceholder from 'Assets/images/placeholders/user.png';
import toast from 'react-hot-toast';
// import getFabricsData from 'Utils/GetFabricsData';
import GetFabricsData from 'Utils/GetFabricsData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { IoEyeOutline, IoHeartOutline } from "react-icons/io5";
import PlaceholderImage from 'Assets/images/placeholders/image.png'
import axios from 'axios';

const Fabrics = (props) => {
    const navigate = useNavigate();
    const reloadCount = props.reloadCount;
    const currentUser = props.currentUser;
    const limit = props.limit;
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [fabrics, setFabrics] = useState([]);
    const [fabricsLoading, setFabricsLoading] = useState(true);

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
          // Update state or perform other logic with userData
        } catch (error) {
            toast.error('An error occured. Please try again or contact the administrator.');
            setFabricsLoading(false);
          // Handle the error, if needed
        }
    };

    async function toggleSortFabrics(type, sort) {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'portfolio/design' +type+sort).then((response) => {
            const selectedFabrics = response.data.data;
            if(selectedFabrics) {
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
        navigate('/fabrics/add')
    }

    useEffect(() => {
        fetchData(currentUser);
    }, [reloadCount]);

    return (
        <>
            <div id="profile-fabrics">
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
                                {limit ?
                                    <>
                                        <Row className="designs-row">
                                            {fabrics.map((design, index) => {
                                                if (design.image_urls?.[0]?.image_url) {
                                                    var designImage = process.env.REACT_APP_STORAGE_URL+'product/'+design.image_urls[0].image_url;
                                                } else {
                                                    var designImage = PlaceholderImage;
                                                }
                                                return (
                                                    <>
                                                        {index < limit ?
                                                            <Col className="designs-grid mb-3" xs="4" md="3">
                                                                <Link to={`/product/${design.id}`} className='portfolio-link'>
                                                                    <div className="designs-grid-div w-100" style={{ backgroundImage: "url("+designImage+")"}}>
                                                                        <div className='save-link'>
                                                                            <div className="action-button bg-white me-2">
                                                                                <GoBookmark className="text-black" />
                                                                            </div>
                                                                            <div className="action-button bg-white">
                                                                                <GoHeart className="text-black" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                                <div className="design-details">
                                                                    <div className='d-flex align-items-center justify-content-between'>
                                                                        <p className="text-black fs-18 fw-600 mb-0 text-ellipsis">{design.name ?? '-'}</p>
                                                                        <div className='d-flex align-items-center'>
                                                                            <span className='fs-14 text-no-wrap mx-2'>
                                                                                <IoHeartOutline /> 0
                                                                            </span>
                                                                            <span className='fs-14 text-no-wrap'>
                                                                                <IoEyeOutline /> {design.views}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className='d-flex align-items-center mt-1'>
                                                                        {design.user.image ?
                                                                            <div className='designer-photo-small' style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'user/'+design.user.image+")"}} ></div>
                                                                            :
                                                                            <div className='designer-photo-small' style={{ backgroundImage: "url("+UserPlaceholder+")"}} ></div>
                                                                        }
                                                                        &nbsp;&nbsp;
                                                                        <p className="text-black fs-14 mb-0">{design.user.first_name && design.user.first_name != "" ? design.user.first_name : "-"} {design.user.last_name && design.user.last_name != "" ? design.user.last_name : "-"}</p>
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
                                        {fabrics.map((design, index) => {
                                            if (design.image_urls?.[0]?.image_url) {
                                                var designImage = process.env.REACT_APP_STORAGE_URL+'portfolio/'+design.image_urls[0].image_url;
                                            } else {
                                                var designImage = PlaceholderImage;
                                            }
                                            return (
                                                <>
                                                    <Col className="designs-grid mb-3" xs="4" md="3">
                                                        <Link to={`/product/${design.id}`} className='portfolio-link'>
                                                            <div className="fabrics-grid-div w-100" style={{ backgroundImage: "url("+designImage+")"}}>
                                                                <div className='save-link'>
                                                                    <div className="action-button bg-white me-2">
                                                                        <GoBookmark className="text-black" />
                                                                    </div>
                                                                    <div className="action-button bg-white">
                                                                        <GoHeart className="text-black" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                        <div className="design-details">
                                                            <div className='d-flex align-items-center justify-content-between'>
                                                                <p className="text-black fs-18 fw-600 mb-0 text-ellipsis">{design.name ?? '-'}</p>
                                                                <div className='d-flex align-items-center'>
                                                                    <span className='fs-14 text-no-wrap mx-2'>
                                                                        <IoHeartOutline /> 0
                                                                    </span>
                                                                    <span className='fs-14 text-no-wrap'>
                                                                        <IoEyeOutline /> {design.views}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className='d-flex align-items-center mt-1'>
                                                                {design.user.image ?
                                                                    <div className='designer-photo-small' style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'user/'+design.user.image+")"}} ></div>
                                                                    :
                                                                    <div className='designer-photo-small' style={{ backgroundImage: "url("+UserPlaceholder+")"}} ></div>
                                                                }
                                                                &nbsp;&nbsp;
                                                                <p className="text-black fs-14 mb-0">{design.user.first_name && design.user.first_name != "" ? design.user.first_name : "-"} {design.user.last_name && design.user.last_name != "" ? design.user.last_name : "-"}</p>
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

export default Fabrics;