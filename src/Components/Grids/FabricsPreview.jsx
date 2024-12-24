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
import { useCookies } from 'react-cookie';
import axios from 'axios';

const Fabrics = (props) => {
    const navigate = useNavigate();
    const reloadCount = props.reloadCount;
    const currentUser = props.currentUser;
    const limit = props.limit;
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'token']);
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [fabrics, setFabrics] = useState([]);
    const [fabricsLoading, setFabricsLoading] = useState(true);

    const current_user_id = cookies.currentUser;
    const token = cookies.token;

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

    const showSignupModal = (e) => {
        props.onSignup(e);
    }

    async function toggleSortFabrics(type, sort) {
        axios.get(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'portfolio/design' +type+sort + '?current_user_id=' + current_user_id + '&token=' + token).then((response) => {
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
        axios.get(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'product/view/'+id + '?current_user_id=' + current_user_id + '&token=' + token).then((response) => {
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
        navigate('/fabrics/add');
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
                                            {fabrics.map((fabric, index) => {
                                                if (fabric.image_urls?.[0]?.image_url) {
                                                    var fabricImage = import.meta.env.VITE_REACT_APP_STORAGE_URL+'product/'+fabric.image_urls[0].image_url;
                                                } else {
                                                    var fabricImage = PlaceholderImage;
                                                }
                                                return (
                                                    <>
                                                        {index < limit ?
                                                            <Col className="designs-grid mb-3 cursor-pointer" xs="4" md="3" onClick={() => showSignupModal('user_fabric')}>
                                                                <div className="designs-grid-div w-100" style={{ backgroundImage: "url("+fabricImage+")"}}>
                                                                    
                                                                </div>
                                                                <div className="design-details">
                                                                    <div className='d-flex align-items-center justify-content-between'>
                                                                        <p className="text-black fs-18 fw-600 mb-0 text-ellipsis">{fabric.name ?? '-'}</p>
                                                                        
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
                                        {fabrics.map((fabric, index) => {
                                            if (fabric.image_urls?.[0]?.image_url) {
                                                var fabricImage = import.meta.env.VITE_REACT_APP_STORAGE_URL+'portfolio/'+fabric.image_urls[0].image_url;
                                            } else {
                                                var fabricImage = PlaceholderImage;
                                            }
                                            return (
                                                <>
                                                    <Col className="designs-grid mb-3" xs="4" md="3">
                                                        <div className="designs-grid-div w-100 cursor-pointer" style={{ backgroundImage: "url("+fabricImage+")"}} onClick={() => showSignupModal('user_fabric')}>
                                                            
                                                        </div>
                                                        <div className="design-details">
                                                            <div className='d-flex align-items-center justify-content-between'>
                                                                <p className="text-black fs-18 fw-600 mb-0 text-ellipsis">{fabric.name ?? '-'}</p>
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