import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';
import toast from 'react-hot-toast';
import Pagination from 'Components/Pagination/Pagination';
import { BsBroadcast } from "react-icons/bs";
import 'react-multi-carousel/lib/styles.css';
import { GoHeart } from 'react-icons/go';
import { useCookies } from 'react-cookie';
import axios from "axios";

const Designers = (props) => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'token']);
    const reloadCount = props.reloadCount;
    const currentUser = props.currentUser;
    const userRole = props.userRole;
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [designers, setDesigners] = useState([]);
    const [designersLoading, setDesignersLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    let PageSize = 10;

    const current_user_id = cookies.currentUser;
    const token = cookies.token;
    
    const getDesigners = async () => {
        return await axios.get(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'designer?current_user_id=' + current_user_id + '&token=' + token);
    };

    const toggleGetUser = (e) => {
        window.location.href = "/designer-profile?user_id=" + e;
    }

    const handleChangePage = (pageNumber) => {
        axios.get(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'designer?page=' + pageNumber + '&current_user_id=' + current_user_id + '&token=' + token)
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
        axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'designer/wishlist/update?current_user_id=' + current_user_id + '&token=' + token, e).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
        }).catch((error) => {
            toast.error('Something went wrong, please contact the administrator!');
        });
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
    },[reloadCount]);

    return (
        <>
            <div id="profile-designers">
                {designersLoading ?
                    <>
                        <p className='text-center mb-3 mt-3'>
                            Loading...
                        </p>
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
                                            <Col lg={3} key={index}>
                                                <div key={index} className="mb-4 position-relative designer-box-details">
                                                    {designer.livestream ?
                                                        <>
                                                            <a href={`/designer/live/stream/${designer.livestream?.id}`} target="_blank">
                                                                <button className="btn btn-danger designer-live fw-600"> <BsBroadcast size="22px" /> Live</button>
                                                            </a>
                                                        </>
                                                        :
                                                        null
                                                    }
                                                    {designer.user.image ? (
                                                        <div onClick={() => toggleGetUser(designer.user.id)} className="designers-grid-div w-100" style={{ backgroundImage: `url(${import.meta.env.VITE_REACT_APP_STORAGE_URL}user/${designer.user.image})` }}>
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
                                                    {userRole !== 'Admin' ?
                                                        <>
                                                            <div className='designer-links'>
                                                                {userWishlist ?
                                                                    <div
                                                                        className="action-button bg-gold"
                                                                        onClick={function () { wishlistDesignerUpdate({ user_id: currentUser, designer_id: designer.id }); }}
                                                                    >
                                                                        <GoHeart size="30px" className="text-white" />
                                                                    </div>
                                                                    :
                                                                    <div
                                                                        className="action-button bg-white"
                                                                        onClick={function () { wishlistDesignerUpdate({ user_id: currentUser, designer_id: designer.id }); }}
                                                                    >
                                                                        <GoHeart size="30px" className="text-black" />
                                                                    </div>
                                                                }
                                                            </div>
                                                        </>
                                                        :
                                                        <>

                                                        </>
                                                    }
                                                </div>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </>
                        ) : (
                            <p className="text-center mb-3 mt-3">No records found.</p>
                        )}
                    </>
                }

                <Pagination
                    className="mt-4 mb-0"
                    currentPage={currentPage}
                    totalCount={pageCount}
                    pageSize={PageSize}
                    onPageChange={page => handleChangePage(page)}
                />
            </div>
        </>
    );
};

export default Designers;