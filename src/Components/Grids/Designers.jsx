import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';
import toast from 'react-hot-toast';
import GetDesignersData from 'Utils/GetDesignersData';
import 'react-multi-carousel/lib/styles.css';

const Designers = (props) => {
    const navigate = useNavigate();
    const reloadCount = props.reloadCount;
    const currentUser = props.currentUser;
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [designers, setDesigners] = useState([]);
    const [designersLoading, setDesignersLoading] = useState(true);

    const toggleGetUser = (e) => {
        window.location.href = "/designer-profile?user_id=" + e;
    }

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
        } catch (error) {
            toast.error('An error occured. Please try again or contact the administrator.');
            setDesignersLoading(false);
        }
    };



    useEffect(() => {
        fetchData(currentUser);
    }, [reloadCount]);

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
            </div>
        </>
    );
};

export default Designers;