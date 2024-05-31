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

const DesignersConnect = (props) => {
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

    const handleSelectDesigner = (e) => {
        props.onSelectDesigner(e);
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
            <div id="designers">
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
                                                return (
                                                    <Col lg={4}>
                                                        <div key={index} className="mb-4 position-relative designer-box-details">
                                                            {designer.user.image ? (
                                                                <div className="designers-grid-div w-100" style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${designer.user.image})`, minHeight: '300px' }}>
                                                                    <div className='bg-black-faded cursor-pointer designer-overlay'>
                                                                        <div className="designer-details">
                                                                            <h3 className="designer-name text-white fs-25 mb-2 fw-600">{designer.user.first_name && designer.user.first_name !== "" ? designer.user.first_name : "-"} {designer.user.last_name && designer.user.last_name !== "" ? designer.user.last_name : "-"}</h3>
                                                                            {/* <p className="text-white mb-0 bio-short-designer">{designer.user.short_bio || "-"}</p> */}
                                                                            <button onClick={() => { handleSelectDesigner(designer); }} className="btn bg-gold-hover text-white-hover btn bg-black text-white">Connect with Designer</button>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div className="connect-designer-container">
                                                                        <button onClick={() => { handleSelectDesigner(designer); }} className="btn bg-gold-hover text-white-hover btn bg-black text-white">Connect with Designer</button>
                                                                    </div> */}
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className="designers-grid-div w-100" style={{ backgroundImage: `url(${designer.user.gender === 'Female' ? FemalePlaceholder : MalePlaceholder})`, minHeight: '300px' }}>
                                                                        <div className='bg-black-faded cursor-pointer designer-overlay'>
                                                                            <div className="designer-details">
                                                                                <h3 className="designer-name text-white fs-25 mb-2 fw-600">{designer.user.first_name && designer.user.first_name !== "" ? designer.user.first_name : "-"} {designer.user.last_name && designer.user.last_name !== "" ? designer.user.last_name : "-"}</h3>
                                                                                <button onClick={() => { handleSelectDesigner(designer); }} className="btn bg-gold-hover text-white-hover btn bg-black text-white">Connect with Designer</button>
                                                                                {/* <p className="text-white mb-0 bio-short-designer">{designer.user.short_bio || "-"}</p> */}
                                                                            </div>
                                                                        </div>
                                                                        {/* <div className="connect-designer-container">
                                                                            <button onClick={() => { handleSelectDesigner(designer); }} className="btn bg-gold-hover text-white-hover btn bg-black text-white ">Connect with Designer</button>
                                                                        </div> */}
                                                                    </div>
                                                                </>
                                                            )}
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

export default DesignersConnect;