import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'Assets/styles/User/Profile/style.css'
import PinIcon from 'Assets/images/pin.png';
import UserPlaceholder from 'Assets/images/user.png';
import Loading from 'Assets/images/loading.gif'
import GetUserData from 'Utils/GetUserData';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import PortfolioGrid from 'Components/Shared/PortfolioGrid';
import ProductGrid from 'Components/Shared/ProductGrid';
import LoadingPage from 'Components/Shared/LoadingPage';
import { useLocation } from 'react-router-dom';

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

});

const initialDesignerData = Object.freeze({
    design_inspirations: '',
    design_process: '',
    areas_of_specialization: '',
    lead_time: '',
    pricing_structure: '',
});

const DesignerProfile = () => {
    const [user, setUser] = useState(initialUserData);
    const [designer, setDesigner] = useState(initialDesignerData);
    const [userLoading, setUserLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);
    const [aboutShow, setAboutShow] = useState(true);
    const [portfolioShow, setPortfolioShow] = useState(false);
    const [fabricShow, setFabricShow] = useState(false);
    const [processShow, setProcessShow] = useState(false);
    const [limitedDesignShow, setLimitedDesignShow] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);
    const [areasOfSpecialization, setAreaOfSpecialization] = useState([])

    const currentUser = cookies.currentUser;
    const token = cookies.token;

    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }

    let query = useQuery();
    const user_id = query.get('user_id');

    // User Image
    const [userImage, setUserImage] = useState();
    const [uploadStatus, setUploadStatus] = useState("standby");

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
            const userData = await GetUserData(e);
            if (userData.id) {
                setUser(userData);
                setUserImage(userData.image);
                setCookie('userDetails', JSON.stringify(userData), { path: '/' });
                if (userData.designer) {
                    setDesigner(userData.designer);
                    setAreaOfSpecialization(userData.designer.areas_of_specialization);
                }
                setUserLoading(false);
            } else {
                setUserLoading(false);
                toast.error('An error occured. Please try again or contact the administrator.');
                console.log(userData);
            }
        } catch (error) {
            setUserLoading(false);
            toast.error('An error occured. Please try again or contact the administrator.');
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData({ token: token, currentUser: user_id });
    }, [reloadCount]);

    return (
        <Layout>
            {userLoading ?
                <LoadingPage />
                :
                <section id='profile' className='py-5 px-2'>
                    <Container>
                        <Row>
                            <Col lg="6" className='mb-5'>
                                <div className='d-flex column-gap-20'>
                                    <div className='text-left position-relative'>
                                        {uploadStatus != "standby" ?
                                            <div className="profile-image" style={{ backgroundImage: "url(" + Loading + ")", backgroundColor: '#f5f6f8' }}></div>
                                            :
                                            <>
                                                {userImage ?
                                                    <div className="profile-image" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'user/' + userImage + ")" }}></div>
                                                    :
                                                    <div className="profile-image" style={{ backgroundImage: "url(" + UserPlaceholder + ")" }}></div>
                                                }
                                            </>
                                        }
                                    </div>
                                    <div>
                                        <h2 className='fs-30 mb-2'>
                                            {user.first_name || user.last_name ?
                                                <span>{user.first_name} {user.last_name}</span>
                                                :
                                                <span>-</span>
                                            }
                                        </h2>
                                        <div className='icons-d-flex'>
                                            <img src={PinIcon} alt="location pin" />
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
                            </Col>
                            <Col lg="12" className='mt-4'>
                                <span className={`cursor-pointer me-5 mb-3 fs-16 ${aboutShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("about"); }}>About</span>
                                {user.is_designer == 1 && (
                                    <span className={`cursor-pointer me-5 mb-3 fs-16 ${portfolioShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("portfolio"); }}>Portfolio</span>
                                )}
                                {user.is_seller == 1 && (
                                    <span className={`cursor-pointer me-5 mb-3 fs-16 ${fabricShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("fabric") }}>Fabrics</span>
                                )}

                                <hr className='mt-2' />
                            </Col>
                        </Row>
                        {aboutShow ?
                            <div id="about-portfolio" className='mt-3'>
                                <Row>
                                    <Col lg="6">
                                        <p className='fw-600 mb-2'>Title</p>
                                        <p className='mb-4'>
                                            {user.short_bio && user.short_bio != "" ? user.short_bio : "-"}
                                        </p>
                                        <p className='fw-600 mb-1'>Long Bio</p>
                                        <p className='mb-5'>
                                            {user.long_bio && user.long_bio != "" ? user.long_bio : "-"}
                                        </p>
                                        {user.is_designer ?
                                            <>
                                                <p className='fw-600 mb-3'>Areas of Specialization and Expertise</p>
                                                <div className='mb-4'>
                                                    {areasOfSpecialization && areasOfSpecialization.length > 0 ?
                                                        <>
                                                            {areasOfSpecialization.map((item, index) => (
                                                                <span className='text-gray600 fs-14 bg-gray'>{item}</span>
                                                            ))}
                                                        </>
                                                        :
                                                        null

                                                    }
                                                </div>
                                            </>
                                            :
                                            null
                                        }
                                        <hr className='mt-2' />
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
                            <ProductGrid currentUser={currentUser} reloadCount={reloadCount} />
                            :
                            null
                        }

                        {processShow ?
                            <div id="profile-portfolio">
                                <p>Under Construction</p>
                            </div>
                            :
                            null
                        }
                        {limitedDesignShow ?
                            <div id="profile-portfolio">
                                <p>Under Construction</p>
                            </div>
                            :
                            null
                        }

                    </Container>
                </section>
            }


        </Layout>
    );
};

export default DesignerProfile;