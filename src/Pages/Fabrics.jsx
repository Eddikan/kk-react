import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Layout from 'Components/Layout/Layout';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import toast from 'react-hot-toast';
// import getDesignsData from 'Utils/GetFabricsData';
import GetFabricsData from 'Utils/GetFabricsData';
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

const Fabrics = (props) => {
    const navigate = useNavigate();
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [fabrics, setFabrics] = useState([]);
    const [fabricsLoading, setFabricsLoading] = useState(true);

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;

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

    async function toggleSortFabrics(type, sort) {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'product/fabric' +type+sort).then((response) => {
            const selectedDesigns = response.data.data;
            if(selectedDesigns) {
                setFabrics(selectedDesigns);
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

    useEffect(() => {
        fetchData(currentUser);
    }, []);

    return (
        <Layout>
            {fabricsLoading ?
                <LoadingPage />
                :
                <>
                    <section className='py-5 px-2'>
                        <Container>
                            <Row className='mb-3'>
                                <Col lg="8" className=''>
                                    <h2 className='fs-30'>Fabrics</h2>
                                </Col>
                                <Col lg="4" className='text-right'>
                                    <GoBack fallBack="/" />
                                </Col>
                                <Col lg="12" className='d-flex justify-content-end'>
                                    <div style={{ position: "relative" }}>
                                        <select
                                            className="form-control sort-input"
                                            onChange={(e) => {
                                                const selectedOption = e.target.value;
                                                if (selectedOption === "New") {
                                                    toggleSortFabrics("?date=", "desc");
                                                } else if (selectedOption === "Most Viewed") {
                                                    toggleSortFabrics("?views=", "desc");
                                                } else if (selectedOption === "Eco-Friendly") {
                                                    toggleSortFabrics("?eco_friendly=", "desc");
                                                } else {
                                                    toggleSortFabrics("", "");
                                                }
                                            }}
                                        >
                                            <option value="">All</option>
                                            <option value="New">Recent Fabric</option>
                                        </select>
                                        <div style={{ position: "absolute", right: "20px", top: "10px", pointerEvents: "none" }} >
                                            <IoIosArrowDown />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                <Col lg="12">
                                    <div id="profile-designs">
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
                                                            {/* <img src={object.url} className='designs-img'/> */}
                                                            {fabrics.map((fabric, index) => {
                                                                if (fabric.image_urls?.[0]?.image_url) {
                                                                    var fabricImage = process.env.REACT_APP_STORAGE_URL+'product/'+fabric.image_urls[0].image_url;
                                                                } else {
                                                                    var fabricImage = PlaceholderImage;
                                                                }
                                                                var wishlist_user_ids = fabric.wishlist_user_ids;
                                                                const userWishlist = wishlist_user_ids.includes(currentUser);

                                                                return (
                                                                    <>
                                                                        <Col className="designs-grid mb-3" xs="12" md="3">
                                                                            <div className="portfolio-link">
                                                                                <div className="designs-grid-div w-100 cursor-pointer" onClick={function() {toggleAddViewCount(fabric.id); navigate('/product/'+fabric.id); }} style={{ backgroundImage: "url("+fabricImage+")"}}>
                                                                                    
                                                                                </div>
                                                                                <div className='save-link'>
                                                                                    {/* <div className="action-button bg-white me-2">
                                                                                        <GoBookmark className="text-black" />
                                                                                    </div> */}
                                                                                    {userWishlist ?
                                                                                        <div className="action-button bg-gold" onClick={function() { wishlistUpdate({user_id: currentUser, product_id: fabric.id}); }}>
                                                                                            <GoHeart className="text-white" />
                                                                                        </div>
                                                                                        :
                                                                                        <div className="action-button bg-white" onClick={function() { wishlistUpdate({user_id: currentUser, product_id: fabric.id}); }}>
                                                                                            <GoHeart className="text-black" />
                                                                                        </div>
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                            <div className="design-details">
                                                                                <div className='d-flex align-items-center justify-content-between'>
                                                                                    <p className="text-black fs-18 fw-600 mb-0 text-ellipsis">{fabric.name ?? '-'}</p>
                                                                                    <div className='d-flex align-items-center'>
                                                                                        <span className='fs-14 text-no-wrap mx-2'>
                                                                                            <IoHeartOutline /> {fabric.wishlist_count}
                                                                                        </span>
                                                                                        <span className='fs-14 text-no-wrap'>
                                                                                            <IoEyeOutline /> {fabric.views}
                                                                                        </span>
                                                                                    </div>
                                                                                    
                                                                                </div>
                                                                                <div className='d-flex align-items-center mt-1'>
                                                                                    {fabric.user.image ?
                                                                                        <div className='designer-photo-small' style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'user/'+fabric.user.image+")"}} ></div>
                                                                                        :
                                                                                        <div className='designer-photo-small' style={{ backgroundImage: "url("+UserPlaceholder+")"}} ></div>
                                                                                    }
                                                                                    &nbsp;&nbsp;
                                                                                    <p className="text-black fs-14 mb-0">{fabric.user.first_name && fabric.user.first_name != "" ? fabric.user.first_name : "-"} {fabric.user.last_name && fabric.user.last_name != "" ? fabric.user.last_name : "-"}</p>
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
                                </Col>
                            </Row>
                            
                        </Container>
                    </section>
                </>
            }
        </Layout>
    );
};

export default Fabrics;