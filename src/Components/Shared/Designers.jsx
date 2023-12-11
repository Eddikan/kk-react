import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import DesignerPlaceholder from 'Assets/images/designer-placeholder.jpg';
import toast from 'react-hot-toast';
import getDesignersData from 'Utils/GetDesignersData';
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
          const designersData = await getDesignersData(e);
          if (designersData) {
            setDesigners(designersData);
            setDesignersLoading(false);
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
        navigate('/designers/add')
    }

    useEffect(() => {
        fetchData(currentUser);
    }, [reloadCount]);

    return (
        <>
            <div id="profile-designers">
                <p className="fs-18 text-center text-dark mb-1"> Looking for Designers? <span className="text-purple">Meet them </span></p >
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
                                            {index < 4 ?
                                                <Col className="designers-grid mb-3" xs="4" md="3">
                                                    {designer.image ?
                                                        <div className="designers-grid-div w-100" style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'user/'+designer.image+")"}}>
                                                            <div className="designer-details">
                                                                <h3 className="designer-name text-white fs-25 mb-1">{designer.first_name ?? ""} {designer.last_name ?? ""}</h3>
                                                                <p className="text-white mb-0">{designer.occupation || "-"}</p>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className="designers-grid-div w-100" style={{ backgroundImage: "url(" + DesignerPlaceholder + ")" }}>
                                                            <div className="designer-details">
                                                                <h3 className="designer-name text-white fs-25 mb-1">{designer.first_name ?? ""} {designer.last_name ?? ""}</h3>
                                                                <p className="text-white mb-0">{designer.occupation || "-"}</p>
                                                            </div>
                                                        </div>
                                                    }
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

export default Designers;