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
                        {designers && designers.length > 0 ?
                            <>
                                <Row className="designers-row">
                                    {/* <img src={object.url} className='designers-img'/> */}
                                    {designers.map((designer, index) => (
                                        <>
                                            {designer.user.first_name !== null && designer.user.first_name !== '' && designer.user.last_name !== null && designer.user.last_name !== '' && (
                                                <>
                                                    <Col className="designers-grid mb-3" xs="4" md="3">
                                                        {designer.user.image ?
                                                            <div className="designers-grid-div w-100" style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'user/'+designer.user.image+")"}}>
                                                                <div className='bg-black-faded'>
                                                                    <div className="designer-details">
                                                                        <h3 className="designer-name text-white fs-25 mb-1">{designer.user.first_name && designer.user.first_name != "" ? designer.user.first_name : "-"} {designer.user.last_name && designer.user.last_name != "" ? designer.user.last_name : "-"}</h3>
                                                                        <p className="text-white mb-0">{designer.user.occupation || "-"}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            :
                                                            <>
                                                                <div className="designers-grid-div w-100" style={{ backgroundImage: "url(" + (designer.user.gender === 'Female' ? FemalePlaceholder : designer.user.gender === 'Male' ? MalePlaceholder : UnknownPlaceholder) + ")" }}>
                                                                    <div className='bg-black-faded'>
                                                                        <div className="designer-details">
                                                                            <h3 className="designer-name text-white fs-25 mb-1">{designer.user.first_name && designer.user.first_name !== "" ? designer.user.first_name : "-" } {designer.user.last_name && designer.user.last_name !== "" ? designer.user.last_name : "-"}</h3>
                                                                            <p className="text-white mb-0">{designer.user.occupation || "-"}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                    </Col>
                                                </>
                                            )}
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

export default Designers;