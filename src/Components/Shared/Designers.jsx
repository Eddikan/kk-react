import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import DesignerPlaceholder from 'Assets/images/designer-placeholder.jpg';
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';
import UnknownPlaceholder from 'Assets/images/placeholders/unknown-placeholder-1.png';
import toast from 'react-hot-toast';
import GetDesignersData from 'Utils/GetDesignersData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";
import { IoDocumentOutline } from "react-icons/io5";

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const Designers = (props) => {
    const navigate = useNavigate();
    const reloadCount = props.reloadCount;
    const currentUser = props.currentUser;
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [designers, setDesigners] = useState([]);
    const [designersLoading, setDesignersLoading] = useState(true);

    const fetchData = async (e) => {
        try {
          const designersData = await GetDesignersData(e);
          if (designersData) {
            setDesigners(designersData);
            setDesignersLoading(false);
          } else {
            toast.error('An error occured. Please try again or contact the administrator.');
            setDesignersLoading(false);
          }
          // Update state or perform other logic with userData
        } catch (error) {
            toast.error('An error occured. Please try again or contact the administrator.');
            setDesignersLoading(false);
          // Handle the error, if needed
        }
    };

    const handleActionClick = (index) => {
        // Toggle the selected item index
        setSelectedItemIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const addDesigner = () => {
        navigate('/designers/add')
    }

    useEffect(() => {
        fetchData(currentUser);
    }, [reloadCount]);

    return (
        <>
            <div id="profile-designers">
                <p className="fs-18 text-center text-dark mb-3"> Looking for Designers? <span className="text-gold">Meet them </span></p >
                <h2 className="fs-40 text-center text-black mb-30">Today's Trendsetting Fashion Designers</h2>
                {designersLoading ?
                    <>
                        <p className='text-center mb-3 mt-3'>
                            Loading...
                        </p>
                    </>
                    :
                    <>
                        {designers && designers.length > 0 ? (
                            <Carousel
                                responsive={{
                                    superLargeDesktop: {
                                        breakpoint: { max: 4000, min: 3000 },
                                        items: 5,
                                    },
                                    desktop: {
                                        breakpoint: { max: 3000, min: 1024 },
                                        items: 4,
                                    },
                                    tablet: {
                                        breakpoint: { max: 1024, min: 464 },
                                        items: 2,
                                    },
                                    mobile: {
                                        breakpoint: { max: 464, min: 0 },
                                        items: 1,
                                    },
                                }}
                                slidesToSlide={1}
                                infinite={true}
                                autoPlay={true}
                                autoPlaySpeed={5000}
                            >
                                {designers.map((designer, index) => (
                                    <div key={index} className="designers-grid mb-3">
                                        {designer.user.image ? (
                                            <div className="designers-grid-div w-100" style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${designer.user.image})` }}>
                                                <div className='bg-black-faded'>
                                                    <div className="designer-details">
                                                        <h3 className="designer-name text-white fs-25 mb-1">{designer.user.first_name && designer.user.first_name !== "" ? designer.user.first_name : "-"} {designer.user.last_name && designer.user.last_name !== "" ? designer.user.last_name : "-"}</h3>
                                                        <p className="text-white mb-0">{designer.user.occupation || "-"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                            <div className="designers-grid-div w-100" style={{ backgroundImage: `url(${designer.user.gender === 'Female' ? FemalePlaceholder : MalePlaceholder })` }}>
                                                <div className='bg-black-faded'>
                                                    <div className="designer-details">
                                                        <h3 className="designer-name text-white fs-25 mb-1">{designer.user.first_name && designer.user.first_name !== "" ? designer.user.first_name : "-"} {designer.user.last_name && designer.user.last_name !== "" ? designer.user.last_name : "-"}</h3>
                                                        <p className="text-white mb-0">{designer.user.occupation || "-"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </Carousel>
                        ) : (
                            <p className="text-center mb-3 mt-3">No records found.</p>
                        )}
                        </>
                }
            </div>
        </>
    );
};

export default Designers;