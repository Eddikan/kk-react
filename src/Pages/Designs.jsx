import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Layout from 'Components/Layout/Layout';
import UserPlaceholder from 'Assets/images/placeholders/user.png';
import toast from 'react-hot-toast';
// import getDesignsData from 'Utils/GetDesignsData';
import GetDesignsData from 'Utils/GetDesignsData';
import LoadingPage from 'Components/Shared/LoadingPage';
import GoBack from 'Components/Shared/GoBack';
import { GoHeart, GoBookmark } from "react-icons/go";
import { IoEyeOutline, IoHeartOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';
import axios from 'axios';

const Designs = (props) => {
    const navigate = useNavigate();
    const reloadCount = props.reloadCount;
    const currentUser = props.currentUser;
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
                // setReloadCount((prevReloadCount) => prevReloadCount + 1);
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
        <Layout>
            {designsLoading ?
                <LoadingPage />
                :
                <>
                    <section className='py-5 px-2'>
                        <Container>
                            <Row className='mb-3'>
                                <Col lg="8" className=''>
                                    <h2 className='fs-30'>Designs</h2>
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
                            </Row>
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
                                                <Row className="designs-row">
                                                    {/* <img src={object.url} className='designs-img'/> */}
                                                    {designs.map((design, index) => (
                                                        <>
                                                            <Col className="designs-grid mb-3" xs="4" md="3">
                                                                <Link to={`/design/${design.id}`} className='portfolio-link' onClick={function() {toggleAddViewCount(design.id);}}>
                                                                    <div className="designs-grid-div w-100" style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'portfolio/'+design.image_urls[0].image_url+")"}}>
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
                                                                            <div className='designer-photo-small' style={{ backgroundImage: `url(${design.user.gender === 'Female' ? FemalePlaceholder : MalePlaceholder })`}} ></div>
                                                                        }
                                                                        &nbsp;&nbsp;
                                                                        <p className="text-black fs-14 mb-0">{design.user.first_name && design.user.first_name != "" ? design.user.first_name : "-"} {design.user.last_name && design.user.last_name != "" ? design.user.last_name : "-"}</p>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </>
                                                    ))}
                                                </Row>
                                            </>
                                            :
                                            <p className="text-center mb-3 mt-3">No records found.</p>
                                        }
                                    </>
                                }
                            </div>
                        </Container>
                    </section>
                </>
            }
        </Layout>
    );
};

export default Designs;