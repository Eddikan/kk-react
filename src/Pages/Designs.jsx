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
        <Layout>
            {designsLoading ?
                <LoadingPage />
                :
                <>
                    <section className='py-5 px-2'>
                        <Container>
                            <Row className='mb-3'>
                                <Col lg="8" className='mb-3'>
                                    <h2 className='fs-30 mb-2'>Designs</h2>
                                </Col>
                                <Col lg="4" className='mb-3 text-right'>
                                    <GoBack fallBack="/" />
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
                                                                <Link to={`/design/${design.id}`}>
                                                                    <div className="designs-grid-div w-100" style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'portfolio/'+design.image_urls[0].image_url+")"}}>
                                                                        
                                                                    </div>
                                                                </Link>
                                                                <div className="design-details d-flex">
                                                                    {design.user.image ?
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