import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Modal, Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';
import { IoShirtSharp } from 'react-icons/io5';
import toast from 'react-hot-toast';
import Pagination from 'Components/Pagination/Pagination';
import { BsBroadcast } from "react-icons/bs";
import GoBack from 'Components/Shared/GoBack';
import { GoHeart } from 'react-icons/go';
import Signup from 'Components/Forms/User/Signup'
import { useCookies } from 'react-cookie';
import Loading from 'Components/Shared/Loading';
import axios from 'axios';
import 'react-multi-carousel/lib/styles.css';

const Designers = (props) => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'tempDesignerWishlist', 'selectedCountry', 'selectedCountryCode']);
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [designers, setDesigners] = useState([]);
    const [designersLoading, setDesignersLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [selectedCountry, setSelectedCountry] = useState(cookies.selectedCountry ?? '');

    let PageSize = 12;

    const [signupModalShow, setSignupModalShow] = useState(false);
    const [signupType, setSignupType] = useState('');

    const [reloadCount, setReloadCount] = useState(0);
    const currentUser = cookies.currentUser;
    const userRole = cookies.userRole;

    const [tempDesignerWishlist, setTempDesignerWishlist] = useState(cookies.tempDesignerWishlist ?? []);

    const [sortOptions] = useState([
        { value: 'created_at', label: 'All' },
        { value: 'views', label: 'Views' },
    ]);

    const getDesigners = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designers?country='+selectedCountry+'&page=' + currentPage + '&user_id=' + currentUser);
    };

    const toggleGetUser = (e) => {
        // if (currentUser && currentUser != "") {
        //     window.location.href = "/designer-profile?user_id=" + e;
        // } else {
        //     showSignupModal('user_designer');
        // }
        window.location.href = "/designer-profile?user_id=" + e;

    }

    const showSignupModal = (e) => {
        setSignupType(e);
        setSignupModalShow(true);
    }

    const handleChangePage = (pageNumber) => {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'designers?country='+selectedCountry+'&page=' + pageNumber + '&user_id=' + currentUser)
            .then((response) => {
                const data = response.data;
                setCurrentPage(pageNumber);
                const selectedDesigners = response.data.data;
                if (selectedDesigners) {
                    setDesigners(selectedDesigners);
                    setCurrentPage(() => data.meta.current_page);
                    setPageCount(() => data.meta.total);
                    setPageSize(() => data.meta.per_page);
                    setDesignersLoading(false);
                } else {
                    setDesignersLoading(false);
                    toast.error('There has been an error getting the designers, please try again!');
                }
            }).catch(error => {
                setDesignersLoading(false);
                toast.error('There has been an error getting the designers, please try again!');
            });
    };
    
    async function wishlistDesignerUpdate(e) {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'designer/wishlist/update', e).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                setReloadCount(reloadCount + 1)
            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
        }).catch((error) => {
            toast.error('Something went wrong, please contact the administrator!');
        });
    };

    const toggleTempDesignerWishlist = (item) => {
        // Check if the item ID already exists in the array
        const itemExists = tempDesignerWishlist.some(wishlistItem => wishlistItem.id === item.id);
    
        let updatedDesignerWishlist;
        if (itemExists) {
          // Remove the item from the array
          updatedDesignerWishlist = tempDesignerWishlist.filter(wishlistItem => wishlistItem.id !== item.id);
        } else {
          // Add the new item to the array
          updatedDesignerWishlist = [...tempDesignerWishlist, item];
        }
    
        // Set the updated favorites array in cookies
        setCookie('tempDesignerWishlist', JSON.stringify(updatedDesignerWishlist), { path: '/' });
        // Update the local state
        setTempDesignerWishlist(updatedDesignerWishlist);
    };

    useEffect(() => {
        getDesigners()
            .then((response) => {
                setDesignersLoading(false);
                const selectedDesigners = response.data.data;
                if (selectedDesigners) {
                    setDesigners(selectedDesigners);
                    setPageCount(() => response.data.meta.total);
                } else {
                    toast.error('There has been an error getting the designers, please try again!');
                    setDesignersLoading(false);
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the designers, please try again!');
                setDesignersLoading(false);
            });
    }, [reloadCount, selectedCountry]);

    useEffect(() => {
        // Only run the filter API call after the component has mounted
        setSelectedCountry(cookies.selectedCountry ?? '');
    }, [cookies]);

    return (
        <>
            <Row className='mb-3'>
                <Col lg="8" className=''>
                    <h2 className='fs-40'>Designers</h2>
                </Col>
                <Col lg="4" className='text-right'>
                    <GoBack fallBack="/" />
                </Col>
            </Row>
            <div id="profile-designers">
                <Row>
                    <Col lg="3">
                        <div className="filter-sidebar pe-4">
                            <Form.Control className="mb-4" as='select'>
                                <option value="" disabled selected  >Sort By:</option>
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </Form.Control>
                            <Form.Label className="fw-600">Categories</Form.Label>
                            <Form.Check
                                type={`checkbox`}
                                label={`All`}
                                name={`day`}
                                className={`mb - 2`}
                            />
                        </div>
                    </Col>
                    <Col lg="9">
                        {designersLoading ?
                            <>
                                <Loading className="bg-white" />
                            </>
                            :
                            <>
                                {designers && designers.length > 0 ? (
                                    <>
                                        <Row>
                                            {designers.map((designer, index) => {
                                                var wishlist_user_ids = designer.wishlist_user_ids ?? [];
                                                const userWishlist = wishlist_user_ids.includes(currentUser);
                                                return (
                                                    <Col lg={3}>
                                                        <div key={index} className="mb-4 position-relative designer-box-details">
                                                            {designer.livestream && currentUser && currentUser != "" ?
                                                                <>
                                                                    <a href={`/designer/live/stream/${designer.livestream?.id}`} target="_blank">
                                                                        <button className="btn btn-danger designer-live fw-600"> <BsBroadcast size="22px" /> Live</button>
                                                                    </a>
                                                                </>
                                                                :
                                                                null
                                                            }
                                                            {designer.user.image ? (
                                                                <div onClick={() => toggleGetUser(designer.user.id)} className="designers-grid-div w-100" style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${designer.user.image})` }}>
                                                                    <div className='bg-black-faded cursor-pointer designer-overlay'>
                                                                        <div className="designer-details">
                                                                            <h3 className="designer-name text-white fs-25 mb-1 fw-600">{designer.user.first_name && designer.user.first_name !== "" ? designer.user.first_name : "-"} {designer.user.last_name && designer.user.last_name !== "" ? designer.user.last_name : "-"}</h3>
                                                                            <p className="text-white mb-0 bio-short-designer">{designer.user.short_bio || "-"}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div onClick={() => toggleGetUser(designer.user.id)} className="designers-grid-div w-100" style={{ backgroundImage: `url(${designer.user.gender === 'Female' ? FemalePlaceholder : MalePlaceholder})` }}>
                                                                        <div className='bg-black-faded cursor-pointer designer-overlay'>
                                                                            <div className="designer-details">
                                                                                <h3 className="designer-name text-white fs-25 mb-1 fw-600">{designer.user.first_name && designer.user.first_name !== "" ? designer.user.first_name : "-"} {designer.user.last_name && designer.user.last_name !== "" ? designer.user.last_name : "-"}</h3>
                                                                                <p className="text-white mb-0 bio-short-designer">{designer.user.short_bio || "-"}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                            {userRole !== 'Admin' && designer.user.id != currentUser ?
                                                                <>
                                                                    {currentUser ?
                                                                        <>
                                                                            <div className='save-link designer-link'>
                                                                                {userWishlist ?
                                                                                    <div className="kouture-tooltip">
                                                                                        <div className="action-button bg-gold"
                                                                                            onClick={function () { wishlistDesignerUpdate({ user_id: currentUser, designer_id: designer.id }); }}
                                                                                        >
                                                                                            <GoHeart className="text-white" />
                                                                                        </div>
                                                                                        <div className="kouture-tooltiptext" style={{width: '190px', left: '-22px'}}>
                                                                                            Remove from Wishlist
                                                                                        </div>
                                                                                    </div>
                                                                                    :
                                                                                    <div className="kouture-tooltip">
                                                                                        <div className="action-button bg-white"
                                                                                            onClick={function () { wishlistDesignerUpdate({ user_id: currentUser, designer_id: designer.id }); }}
                                                                                        >
                                                                                            <GoHeart className="text-black" />
                                                                                        </div>
                                                                                        <div className="kouture-tooltiptext" style={{width: '190px', left: '-22px'}}>
                                                                                            Add to Wishlist
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        // <>
                                                                        //     <div className='save-link designer-link'>
                                                                        //         {tempDesignerWishlist.some(wishlistItem => wishlistItem.id === designer.id) ?
                                                                        //             <div className="kouture-tooltip">
                                                                        //                 <div
                                                                        //                     className="action-button bg-gold"
                                                                        //                     onClick={function () { toggleTempDesignerWishlist({id: designer.id, user_id: currentUser, first_name: designer.user.name, last_name: designer.user.last_name, short_bio: designer.user.short_bio, image_url: designer.image, designer_user_id: designer.user.id}); }}
                                                                        //                 >
                                                                        //                     <GoHeart className="text-white" />
                                                                        //                 </div>
                                                                        //                 <div className="kouture-tooltiptext" style={{width: '190px', left: '-22px'}}>
                                                                        //                     Remove from Wishlist
                                                                        //                 </div>
                                                                        //             </div>
                                                                        //             :
                                                                        //             <div className="kouture-tooltip">
                                                                        //                 <div
                                                                        //                     className="action-button bg-white"
                                                                        //                     onClick={function () { toggleTempDesignerWishlist({id: designer.id, user_id: currentUser, first_name: designer.user.name, last_name: designer.user.last_name, short_bio: designer.user.short_bio, image_url: designer.image, designer_user_id: designer.user.id}); }}
                                                                        //                     >
                                                                        //                     <GoHeart className="text-black" />
                                                                        //                 </div>
                                                                        //                 <div className="kouture-tooltiptext" style={{width: '190px', left: '-22px'}}>
                                                                        //                     Add to Wishlist
                                                                        //                 </div>
                                                                        //             </div>
                                                                        //         }
                                                                        //     </div>
                                                                        // </>
                                                                        null
                                                                    }
                                                                    
                                                                </>
                                                                :
                                                                <>

                                                                </>
                                                            }
                                                        </div>
                                                    </Col>
                                                )
                                            })}
                                            {currentUser && currentUser != "" ?
                                                <Pagination
                                                    className="mt-4 mb-0"
                                                    currentPage={currentPage}
                                                    totalCount={pageCount}
                                                    pageSize={PageSize}
                                                    onPageChange={page => handleChangePage(page)}
                                                />
                                                :
                                                // <Col lg={12} className="text-center mt-4">
                                                //     <Button className="btn-primary" variant="primary" onClick={() => showSignupModal('user_designer')}>View More</Button>
                                                // </Col>
                                                null
                                            }
                                        </Row>
                                    </>
                                ) : (
                                    <Card className="text-center">
                                        <Card.Body>
                                            <IoShirtSharp size="60px" className="mt-2" />
                                            <p className="text-center fs-20 mb-2 mt-3">No records found.</p>
                                        </Card.Body>
                                    </Card>
                                )}
                            </>
                        }
                    </Col>
                </Row>


            </div>
        </>        
    );
};

export default Designers;