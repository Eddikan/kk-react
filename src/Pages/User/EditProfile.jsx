import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import 'Assets/styles/User/EditProfile/style.css'
import PinIcon from 'Assets/images/pin.png';
import LinkIcon from 'Assets/images/link.png';
import TelephonIcon from 'Assets/images/telephone.png';
import BehanceIcon from 'Assets/images/behance.png';
import FacebookIcon from 'Assets/images/facebook.png';
import LinkedinIcon from 'Assets/images/linkedin.png';
import SocialmediaIcon from 'Assets/images/social-media.png';
import YoutubeIcon from 'Assets/images/youtube.png';
import UserPlaceholder from 'Assets/images/user.png';
import PortfolioFabric from 'Assets/images/fabric.png';
import getUserData from 'Utils/GetUserData';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import PortfolioGrid from 'Components/Shared/PortfolioGrid';

const initialUserData = Object.freeze({
    is_designer: 0,
    is_tailor: 0,
    is_seller: 0,
    email: '',
    short_bio: '',
    long_bio: '',
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    province: '',
    postal_code: '',
    country: '',
    website: '',
    phone_number: '',
    secondary_email_address: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedIn: '',
    pinterest: '',
});

const EditProfile = () => {
    const [user, setUser] = useState(initialUserData);
    const [profileFormData, setProfileFormData] = useState(initialUserData);
    const [reloadCount, setReloadCount] = useState(0);
    const [profileShow, setProfileShow] = useState(true);
    const [addressShow, setAddressShow] = useState(false);
    const [contactShow, setContactShow] = useState(false);
    const [socialMediaShow, setSocialMediaShow] = useState(false);
    const [skillShow, setSkillShow] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);

    const currentUser = cookies.currentUser;

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 2025 - 1900 }, (_, i) => 1900 + i);  

    const showTab = (tab) => {
        if (tab == "profile") {
            setProfileShow(true);
            setAddressShow(false);
            setContactShow(false);
            setSocialMediaShow(false);
            setSkillShow(false);
        } else if (tab === "address") {
            setAddressShow(true);
            setProfileShow(false);
            setContactShow(false);
            setSocialMediaShow(false);
            setSkillShow(false);
        } else if (tab === "contact") {
            setContactShow(true);
            setAddressShow(false);
            setProfileShow(false);
            setSocialMediaShow(false);
            setSkillShow(false);
        } else if (tab === "social_media") {
            setSocialMediaShow(true);
            setAddressShow(false);
            setProfileShow(false);
            setContactShow(false);
            setSkillShow(false);
        } else if (tab === "skill") {
            setSkillShow(true);
            setSocialMediaShow(false);
            setAddressShow(false);
            setProfileShow(false);
            setContactShow(false);
        }
    }

    const handleChange = (e) => {
        setProfileFormData({
          ...profileFormData,
          [e.target.name]: e.target.value,
        })
    }

    const handleChangeDob = (e) => {
        setProfileFormData({
          ...profileFormData,
          date_of_birth: {
            ...profileFormData.date_of_birth,
            [e.target.name]: e.target.value,
          },
        });
    };
    

    const fetchData = async (e) => {
        try {
          const userData = await getUserData(e);
          if (userData.id) {
            setUser(userData);
          } else {
            toast.error('User does not exist!');
          }
          // Update state or perform other logic with userData
        } catch (error) {
            toast.error('User does not exist!');
          // Handle the error, if needed
        }
    };

    useEffect(() => {
        fetchData(currentUser);
    }, [reloadCount]);

    return (
        <Layout>
            <section id='profile' className='py-5 px-2'>
                <Container>
                    <Row>
                        <Col lg="12" className='mb-3'>
                            <div className='d-flex column-gap-20'>
                                <div className="d-flex column-gap-20">
                                    <div>
                                        <img src={UserPlaceholder} className='user-placeholder' />
                                    </div>
                                    <div>
                                        <h2 className='fs-20 mb-2'>Allen Bryle De Sagun</h2>
                                        <div className='icons-d-flex'>
                                            <img src={PinIcon} />
                                            <p className='fs-16 color-light-blue'>Subic, Agoncillo, Batangas</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Form>
                        <Row className='d-flex'>
                            <Col md="3" className='flex-grow-1 flex-shrink-0'>
                                <Card className='h-100'>
                                    <Card.Body>
                                        <p className={`text-black cursor-pointer me-5 mb-3 fs-16 ${profileShow ? 'fw-600' : ''}`} onClick={function () { showTab("profile"); }}>About</p>
                                        <p className={`text-black cursor-pointer me-5 mb-3 fs-16 ${addressShow ? 'fw-600' : ''}`} onClick={function () { showTab("address"); }}>Address</p>
                                        <p className={`text-black cursor-pointer me-5 mb-3 fs-16 ${contactShow ? 'fw-600' : ''}`} onClick={function () { showTab("contact") }}>Contact</p>
                                        <p className={`text-black cursor-pointer me-5 mb-3 fs-16 ${socialMediaShow ? 'fw-600' : ''}`} onClick={function () { showTab("social_media") }}>Social Media</p>
                                        <p className={`text-black cursor-pointer me-5 mb-0 fs-16 ${skillShow ? 'fw-600' : ''}`} onClick={function () { showTab("skill"); }}>Skills</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md="9" className='flex-grow-1 flex-shrink-0'>
                                <Card className='h-100'>
                                    <Card.Body>
                                        {profileShow ?
                                            <div class="edit-profile">
                                                <Row>
                                                    <Col lg="6">
                                                        <Form.Group className='mb-3'>
                                                            <Form.Label>First Name</Form.Label>
                                                            <FormControl type='text' name='first_name' value={profileFormData.first_name} className='mr-sm-2' onChange={handleChange} required />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col lg="6">
                                                        <Form.Group className='mb-3'>
                                                            <Form.Label>Last Name</Form.Label>
                                                            <FormControl type='text' name='last_name' value={profileFormData.last_name} className='mr-sm-2' onChange={handleChange} required />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg="6">
                                                        <Form.Group className='mb-3'>
                                                            <Form.Label>Date of Birth</Form.Label>
                                                            <FormControl type='date' name='date_of_birth' value={profileFormData.date_of_birth} className='mr-sm-2' onChange={handleChange} required />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col lg="3">
                                                        <Form.Label>Gender</Form.Label>
                                                        <Row>
                                                            <Form.Group as={Col}>
                                                                <Form.Check
                                                                    className="cursor-pointer"
                                                                    type="radio"
                                                                    label="Male"
                                                                    name="gender"
                                                                    value="Male"
                                                                    checked={profileFormData.gender === 'Male'}
                                                                    onChange={handleChange}
                                                                />
                                                            </Form.Group>
                                                            <Form.Group as={Col}>
                                                                <Form.Check
                                                                    className="cursor-pointer"
                                                                    type="radio"
                                                                    label="Female"
                                                                    name="gender"
                                                                    value="Female"
                                                                    checked={profileFormData.gender === 'Female'}
                                                                    onChange={handleChange}
                                                                />
                                                            </Form.Group>
                                                        </Row>
                                                    </Col>
                                                    
                                                </Row>
                                                <Row>
                                                    <Col lg="12">
                                                        
                                                    </Col>
                                                </Row>
                                            </div>
                                            :
                                            null
                                        }
                                        {addressShow ?
                                            <PortfolioGrid currentUser={currentUser} reloadCount={reloadCount} />
                                            :
                                            null
                                        }
                                        {contactShow ?
                                            <div id="profile-portfolio">
                                            <img src={PortfolioFabric} className='portfolio-img'/>
                                            </div>
                                            :
                                            null
                                        }

                                        {socialMediaShow ?
                                            <div id="profile-portfolio">
                                                This is Process
                                            </div>
                                            :
                                            null
                                        }
                                        {skillShow ?
                                            <div id="profile-portfolio">
                                                This is Limited Design
                                            </div>
                                            :
                                            null
                                        }
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </section>
        </Layout>
    );
};

export default EditProfile;