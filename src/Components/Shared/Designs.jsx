import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import DesignPlaceholder from 'Assets/images/placeholders/design.png';
import UserPlaceholder from 'Assets/images/placeholders/user.png';
import toast from 'react-hot-toast';
// import getDesignsData from 'Utils/GetDesignsData';
import getPortfolioData from 'Utils/GetPortfolioData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";
import { IoDocumentOutline } from "react-icons/io5";

const Designs = (props) => {
    const navigate = useNavigate();
    const reloadCount = props.reloadCount;
    const currentUser = props.currentUser;
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [designs, setDesigns] = useState([]);
    const [designsLoading, setDesignsLoading] = useState(true);

    const fetchData = async (e) => {
        try {
          const designsData = await getPortfolioData(e);
          if (designsData) {
            setDesigns(designsData);
            setDesignsLoading(false);
          } else {
            toast.error('Fail!');
          }
          // Update state or perform other logic with userData
        } catch (error) {
            toast.error('Fail!');
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
                <p className="fs-18 text-center text-dark mb-1"> Looking for a Designs? <span className="text-purple">Explore now </span></p >
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
                                                    <div className="designs-grid-div w-100" style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'portfolio/'+design.image_urls[0].image_url+")"}}>
                                                        
                                                    </div>
                                                    <div className="design-details d-flex">
                                                        {design.user.image ?
                                                            <div className='designer-photo' style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'user/'+design.user.image+")"}} ></div>
                                                            :
                                                            <div className='designer-photo' style={{ backgroundImage: "url("+UserPlaceholder+")"}} ></div>
                                                        }
                                                        
                                                        <div className="designer-info">
                                                            <p className="text-black fs-18 fw-600 mb-0">{design.user.first_name ?? "-"} {design.user.last_name ?? "-"}</p>
                                                            <p className="text-black fs-14 mb-0">{design.user.occupation ?? "-"}</p>
                                                            {design.materials ?
                                                                <>
                                                                    {design.materials.length > 0 ?
                                                                        <>
                                                                            {design.materials.map((material, index) => (
                                                                                <span className="design-tag bg-light fs-12">
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
                                                        </div>
                                                    </div>
                                                </Col>
                                                :
                                                null
                                            }
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
        </>
    );
};

export default Designs;