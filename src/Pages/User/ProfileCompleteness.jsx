import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import 'Assets/styles/User/EditProfile/style.css'
import PinIcon from 'Assets/images/pin.png';
import UserPlaceholder from 'Assets/images/user.png';
import getUserData from 'Utils/GetUserData';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import GoBack from 'Components/Shared/GoBack';
import LoadingPage from 'Components/Shared/LoadingPage';
import { TagsInput } from "react-tag-input-component";
import axios from 'axios';
import Countries from 'Utils/Countries';
import AboutStep from 'Components/Completeness/ProfileSteps/About';
import AddressStep from 'Components/Completeness/ProfileSteps/Address';
import ContactStep from 'Components/Completeness/ProfileSteps/Contact';
import SocialMediaStep from 'Components/Completeness/ProfileSteps/SocialMedia';
import ThankyouStep from 'Components/Completeness/ProfileSteps/Thankyou';
import ProfileProgress from 'Components/Completeness/Wizards/ProfileCompletenessProgress';

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
    occupation: '',
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
    linkedin: '',
    pinterest: '',
    behance: '',
});

const initialDesignerData = Object.freeze({
    areas_of_specialization: [""],
});

const ProfileCompleteness = () => {
    const [user, setUser] = useState(initialUserData);
    const [designer, setDesigner] = useState()
    const [userLoading, setUserLoading] = useState(true);
    const [profileFormData, setProfileFormData] = useState(initialUserData);
    const [profileFormLoading, setProfileFormLoading] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [profileShow, setProfileShow] = useState(true);
    const [addressShow, setAddressShow] = useState(false);
    const [contactShow, setContactShow] = useState(false);
    const [socialMediaShow, setSocialMediaShow] = useState(false);
    const [skillShow, setSkillShow] = useState(false);
    const [userImage, setUserImage] = useState('');
    const [cookies, setCookie] = useCookies(['currentUser', 'aboutDone', 'addressDone', 'contactDone', 'socialDone']);
    
    const [areasOfSpecializationData, setAreaOfSpecializationData] = useState(initialDesignerData.areas_of_specialization);

    const [areasOfSpecialization, setAreaOfSpecialization] = useState(initialDesignerData.areas_of_specialization);

    // const [aboutDone, setAboutDone] = useState(cookies.aboutDone ?? 'No');
    // const [addressDone, setAddressDone] = useState(cookies.addressDone ?? 'No');
    // const [contactDone, setContactDone] = useState(cookies.contactDone ?? 'No');
    // const [socialDone, setSocialDone] = useState(cookies.socialDone ?? 'No');

    const [aboutDone, setAboutDone] = useState('No');
    const [addressDone, setAddressDone] = useState('No');
    const [contactDone, setContactDone] = useState('No');
    const [socialDone, setSocialDone] = useState('No');

    const currentUser = cookies.currentUser;
    const token = cookies.token;

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
    };
    
    const [completeness, setCompleteness] = useState(0);

    const fetchData = async (e) => {
        try {
            const userData = await getUserData(e);
            if (userData.id) {
                setUser(userData);
                setProfileFormData(userData);
                setCompleteness(userData.profile_completeness);
                setUserImage(userData.image);
                setCookie('userDetails', JSON.stringify(userData), { path: '/' });
                setUserLoading(false);
                if (userData.designer) {
                    setDesigner(userData.designer);
                    setAreaOfSpecialization(userData.designer.areas_of_specialization);
                    setAreaOfSpecializationData(userData.designer.areas_of_specialization);
                }
            } else {
                setUserLoading(false);
                toast.error('An error occured. Please try again or contact the administrator.');
            }
            // Update state or perform other logic with userData
        } catch (error) {
            setUserLoading(false);
            toast.error('An error occured. Please try again or contact the administrator.');
            // Handle the error, if needed
        }
    };

    useEffect(() => {
        fetchData({ currentUser: currentUser, token: token });
        setAboutDone(cookies.aboutDone ?? 'No');
        // setAddressDone(cookies.addressDone ?? 'No');
        // setContactDone(cookies.contactDone ?? 'No');
        // setSocialDone(cookies.socialDone ?? 'No');

    }, [reloadCount]);

    return (
        <Layout>
            {userLoading ?
                <LoadingPage />
                :
                <section id='profile' className='py-5 px-2'>
                    <Container>
                        {/* <Row>
                            <Col lg="12" className='mb-3'>
                                <div className='d-flex column-gap-20 justify-content-between'>
                                    <div className="d-flex column-gap-20">
                                        <div>
                                            {userImage ?
                                                <div className="profile-image" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'user/' + userImage + ")" }}></div>
                                                :
                                                <div className="profile-image" style={{ backgroundImage: "url(" + UserPlaceholder + ")" }}></div>
                                            }
                                        </div>
                                        <div>
                                            <h2 className='fs-20 mb-2'>
                                                {user.first_name || user.last_name ?
                                                    <span>{user.first_name} {user.last_name}</span>
                                                    :
                                                    <span>-</span>
                                                }
                                            </h2>
                                            <div className='icons-d-flex'>
                                                <img src={PinIcon} className='mt-1' />
                                                {user.city || user.province || user.country ?
                                                    <p className='fs-16 color-light-blue'>
                                                        {user.city ? user.city + ',' : ""} {user.province ? user.province + "," : ""} {user.country ? user.country : ""}
                                                    </p>
                                                    :
                                                    <p className='fs-16 color-light-blue'>-</p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <GoBack fallBack="/user/profile" />
                                    </div>
                                </div>
                            </Col>
                        </Row> */}
                        <Row className='d-flex'>
                            <Col md="3" className={`flex-grow-1 flex-shrink-0 ${completeness == 100 && 'd-none'}`}>
                                <Card className='h-100'>
                                    <Card.Body>
                                        <ProfileProgress 
                                            completeness={completeness} reloadCount={reloadCount}
                                        />
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={`${completeness != 100 ? '9' : '12'}`} className='flex-grow-1 flex-shrink-0'>
                                <Card className='h-100'>
                                    <Card.Body>
                                        {completeness < 30 ?
                                            <>
                                                <AboutStep
                                                    currentUser={currentUser}
                                                    token={token}
                                                    user={profileFormData}
                                                    reload={() => setReloadCount(reloadCount + 1)}
                                                />
                                            </>
                                        : completeness >= 30 && completeness < 55 ?
                                            <>
                                                <AddressStep
                                                    currentUser={currentUser}
                                                    token={token}
                                                    user={profileFormData}
                                                    reload={() => setReloadCount(reloadCount + 1)}
                                                />
                                            </>
                                        : completeness >= 55 && completeness < 70 ?
                                            <>
                                                <ContactStep
                                                    currentUser={currentUser}
                                                    token={token}
                                                    user={profileFormData}
                                                    reload={() => setReloadCount(reloadCount + 1)}
                                                />
                                            </>
                                        : completeness >= 70 && completeness < 100 ?
                                            <>
                                                <SocialMediaStep
                                                    currentUser={currentUser}
                                                    token={token}
                                                    user={profileFormData}
                                                    reload={() => setReloadCount(reloadCount + 1)}
                                                />
                                            </>
                                        : completeness >= 100 ?
                                            <>
                                                <ThankyouStep
                                                    currentUser={currentUser}
                                                    token={token}
                                                    user={profileFormData}
                                                    reload={() => setReloadCount(reloadCount + 1)}
                                                />
                                            </>
                                        :
                                        null
                                        }
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </section>
            }

        </Layout>
    );
};

export default ProfileCompleteness;