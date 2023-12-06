import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'Assets/styles/User/Profile/style.css'
import PinIcon from 'Assets/images/pin.png';
import LinkIcon from 'Assets/images/link.png';
import TelephonIcon from 'Assets/images/telephone.png';
import BehanceIcon from 'Assets/images/behance.png';
import FacebookIcon from 'Assets/images/facebook.png';
import LinkedinIcon from 'Assets/images/linkedin.png';
import SocialmediaIcon from 'Assets/images/social-media.png';
import YoutubeIcon from 'Assets/images/youtube.png';
import UserPlaceholder from 'Assets/images/user.png';
import PortfolioWhiteDress from 'Assets/images/white-dress.png';
import PortfolioWeddingDress from 'Assets/images/wedding-dress.png';
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
});

const Profile = () => {
    const [user, setUser] = useState(initialUserData);
    const [reloadCount, setReloadCount] = useState(0);
    const [aboutShow, setAboutShow] = useState(true);
    const [portfolioShow, setPortfolioShow] = useState(false);
    const [fabricShow, setFabricShow] = useState(false);
    const [processShow, setProcessShow] = useState(false);
    const [limitedDesignShow, setLimitedDesignShow] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);

    const currentUser = cookies.currentUser;

    const showTab = (tab) => {
        if (tab == "about") {
            setAboutShow(true);
            setPortfolioShow(false);
            setFabricShow(false);
            setProcessShow(false);
            setLimitedDesignShow(false);
        } else if (tab === "portfolio") {
            setPortfolioShow(true);
            setAboutShow(false);
            setFabricShow(false);
            setProcessShow(false);
            setLimitedDesignShow(false);
        } else if (tab === "fabric") {
            setFabricShow(true);
            setPortfolioShow(false);
            setAboutShow(false);
            setProcessShow(false);
            setLimitedDesignShow(false);
        } else if (tab === "process") {
            setProcessShow(true);
            setPortfolioShow(false);
            setAboutShow(false);
            setFabricShow(false);
            setLimitedDesignShow(false);
        } else if (tab === "limited_design") {
            setLimitedDesignShow(true);
            setProcessShow(false);
            setPortfolioShow(false);
            setAboutShow(false);
            setFabricShow(false);
        }
    }

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
                        <Col lg="6" className='mb-5'>
                            <div className='d-flex column-gap-20'>
                                <div className='text-left'>
                                    <img src={UserPlaceholder} className='user-placeholder' />
                                </div>
                                <div>
                                    <h2 className='fs-30 mb-2'>Allen Bryle De Sagun</h2>
                                    <div className='icons-d-flex'>
                                        <img src={PinIcon} />
                                        <p className='fs-16 color-light-blue'>Subic, Agoncillo, Batangas</p>
                                    </div>
                                    <Button href="/user/profile/edit" type='button' id="btn-edit-profile">Edit Profile</Button>
                                </div>
                            </div>
                        </Col>
                        <Col lg="12" className='mt-4'>
                            <span className={`text-black cursor-pointer me-5 mb-3 fs-16 ${aboutShow ? 'fw-600' : ''}`} onClick={function () { showTab("about"); }}>About</span>
                            <span className={`text-black cursor-pointer me-5 mb-3 fs-16 ${portfolioShow ? 'fw-600' : ''}`} onClick={function () { showTab("portfolio"); }}>Portfolio</span>
                            <span className={`text-black cursor-pointer me-5 mb-3 fs-16 ${fabricShow ? 'fw-600' : ''}`} onClick={function () { showTab("fabric") }}>Fabrics</span>
                            <span className={`text-black cursor-pointer me-5 mb-3 fs-16 ${processShow ? 'fw-600' : ''}`} onClick={function () { showTab("process") }}>Process</span>
                            <span className={`text-black cursor-pointer me-5 mb-3 fs-16 ${limitedDesignShow ? 'fw-600' : ''}`} onClick={function () { showTab("limited_design"); }}>Limited Design</span>
                            <hr className='mt-2' />
                        </Col>
                    </Row>
                    {aboutShow ?
                        <div id="about-portfolio" className='mt-3'>
                            <Row>
                                <Col lg="6">
                                    <p className='fw-600 mb-2'>Title</p>
                                    <p className='mb-4'>
                                        Lorem ipsum Dolor sit amet
                                    </p>
                                    <p className='fw-600 mb-1'>Long Bio</p>
                                    <p className='mb-5'>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                    <p className='fw-600 mb-3'>Areas of Specialization and Expertise</p>
                                    <div className='mb-4'>
                                        <span className='text-gray fs-14 bg-gray'>Bridal Wear</span>
                                        <span className='text-gray fs-14 bg-gray'>Casual Wear</span>
                                    </div>
                                    <hr className='mt-2' />
                                    <div className='d-flex'>
                                        <p className='text-gray'>0 Followers</p>
                                        <p className='text-gray'>0 Following</p>
                                    </div>
                                </Col>
                                <Col lg="6">
                                    <div className='bg-lgray profile-details address mb-4'>
                                        <div className='icons-d-flex'>
                                            <img src={PinIcon} />
                                            <p>Subic, Agoncillo, Batangas</p>
                                        </div>

                                        <div className='icons-d-flex'>
                                            <img src={LinkIcon} />
                                            <p><a href="https://www.mydesign.com" target="_blank">https://www.mydesign.com</a></p>
                                        </div>
                                        <div className='icons-d-flex'>
                                            <img src={TelephonIcon} />
                                            <p className='mb-0'><a href="tel:+63999 999 1234">+63999 999 1234</a></p>
                                        </div>
                                    </div>
                                    <div className='bg-lgray profile-details social'>
                                        <p>Social</p>
                                        <div className='icons-d-flex'>
                                            <img src={BehanceIcon} />
                                            <p><a href="https://www.mybehance.com" target="_blank">https://www.mybehance.com</a></p>
                                        </div>
                                        <div className='icons-d-flex'>
                                            <img src={FacebookIcon} />
                                            <p><a href="https://www.myfacebook.com" target="_blank">https://www.myfacebook.com</a></p>
                                        </div>
                                        <div className='icons-d-flex'>
                                            <img src={LinkedinIcon} />
                                            <p><a href="https://www.mylinkedin.com" target="_blank">https://www.mylinkedin.com</a></p>
                                        </div>
                                        <div className='icons-d-flex'>
                                            <img src={SocialmediaIcon} />
                                            <p><a href="https://www.myinstagram.com" target="_blank">https://www.myinstagram.com</a></p>
                                        </div>
                                        <div className='icons-d-flex'>
                                            <img src={YoutubeIcon} />
                                            <p><a href="https://www.myyoutube.com" target="_blank">https://www.myyoutube.com</a></p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        :
                        null
                    }
                    {portfolioShow ?
                        <PortfolioGrid currentUser={currentUser} reloadCount={reloadCount} />
                        :
                        null
                    }
                    {fabricShow ?
                        <div id="profile-portfolio">
                           <img src={PortfolioFabric} className='portfolio-img'/>
                        </div>
                        :
                        null
                    }

                    {processShow ?
                        <div id="profile-portfolio">
                            This is Process
                        </div>
                        :
                        null
                    }
                    {limitedDesignShow ?
                        <div id="profile-portfolio">
                            This is Limited Design
                        </div>
                        :
                        null
                    }

                </Container>
            </section>

        </Layout>
    );
};

export default Profile;