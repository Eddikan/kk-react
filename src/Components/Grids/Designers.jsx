import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';
import toast from 'react-hot-toast';
import Pagination from 'Components/Pagination/Pagination';
import 'react-multi-carousel/lib/styles.css';
import axios from "axios";

const Designers = (props) => {
    const navigate = useNavigate();
    const reloadCount = props.reloadCount;
    const currentUser = props.currentUser;
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [designers, setDesigners] = useState([]);
    const [designersLoading, setDesignersLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    let PageSize = 10;

    const getDesigners = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer');
    };

    const toggleGetUser = (e) => {
        window.location.href = "/designer-profile?user_id=" + e;
    }

    const handleChangePage = (pageNumber) => {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer?page=' + pageNumber + '&user_id=' + currentUser)
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
    },
        [reloadCount]);

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
                                    {designers.map((designer, index) => (
                                        <Col
                                            lg={3}
                                            onClick={() => toggleGetUser(designer.user.id)}
                                        >
                                            <div key={index} className="mb-4">
                                                {designer.user.image ? (
                                                    <div className="designers-grid-div w-100" style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${designer.user.image})` }}>
                                                        <div className='bg-black-faded cursor-pointer'>
                                                            <div className="designer-details">
                                                                <h3 className="designer-name text-white fs-25 mb-1 fw-600">{designer.user.first_name && designer.user.first_name !== "" ? designer.user.first_name : "-"} {designer.user.last_name && designer.user.last_name !== "" ? designer.user.last_name : "-"}</h3>
                                                                <p className="text-white mb-0 bio-short-designer">{designer.user.short_bio || "-"}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="designers-grid-div w-100" style={{ backgroundImage: `url(${designer.user.gender === 'Female' ? FemalePlaceholder : MalePlaceholder})` }}>
                                                            <div className='bg-black-faded cursor-pointer'>
                                                                <div className="designer-details">
                                                                    <h3 className="designer-name text-white fs-25 mb-1 fw-600">{designer.user.first_name && designer.user.first_name !== "" ? designer.user.first_name : "-"} {designer.user.last_name && designer.user.last_name !== "" ? designer.user.last_name : "-"}</h3>
                                                                    <p className="text-white mb-0 bio-short-designer">{designer.user.short_bio || "-"}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </Col>
                                    ))}
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