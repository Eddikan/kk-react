import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import UserPlaceholder from 'Assets/images/placeholders/user.png';
import toast from 'react-hot-toast';
// import getDesignsData from 'Utils/GetDesignsData';
import GetDesignsData from 'Utils/GetDesignsData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";
import { IoEyeOutline, IoHeartOutline } from "react-icons/io5";

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
                <p className="fs-18 text-center text-dark mb-3"> Looking for a Designs? <span className="text-gold">Explore now </span></p >
                <h2 className="fs-40 text-center text-black mb-30">Discover Captivating Designs.</h2>
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
                                            {index < 8 ?
                                                <Col className="designs-grid mb-3" xs="4" md="3">
                                                    <Link to={`/portfolio/${design.id}`} className='portfolio-link'>
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
                                                                    <IoHeartOutline /> 1.1k
                                                                </span>
                                                                <span className='fs-14 text-no-wrap'>
                                                                    <IoEyeOutline /> 10.1k
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
                                                        {/* {design.user.image ?
                                                            <div className='designer-photo' style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'user/'+design.user.image+")"}} ></div>
                                                            :
                                                            <div className='designer-photo' style={{ backgroundImage: "url("+UserPlaceholder+")"}} ></div>
                                                        }
                                                        
                                                        <div className="designer-info">
                                                            <p className="text-black fs-18 fw-600 mb-0">{design.user.first_name && design.user.first_name != "" ? design.user.first_name : "-"} {design.user.last_name && design.user.last_name != "" ? design.user.last_name : "-"}</p>
                                                            <p className="text-black fs-14 mb-0">{design.user.occupation ?? "-"}</p>
                                                            {design.materials ?
                                                                <>
                                                                    {design.materials.length > 0 ?
                                                                        <>
                                                                            {design.materials.map((material, index) => (
                                                                                <span className="design-tag bg-light fs-12 text-center">
                                                                                    {material}
                                                                                </span>
                                                                            ))}
                                                                        </>
                                                                        :
                                                                        null
                                                                    }
                                                                </>
                                                                :
                                                                null
                                                            }
                                                        </div> */}
                                                    </div>
                                                </Col>
                                                :
                                                null
                                            }
                                        </>
                                    ))}
                                    <Col lg={12} className="text-center mt-4">
                                        <Link to="/designs">
                                            <Button className="btn-primary" variant="primary">View All</Button>
                                        </Link>
                                    </Col>
                                </Row>
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