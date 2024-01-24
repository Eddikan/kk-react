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
import Loading from 'Assets/images/loading.gif'
import GetUserData from 'Utils/GetUserData';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import PortfolioGrid from 'Components/Shared/PortfolioGrid';
import ProductGrid from 'Components/Shared/ProductGrid';
import LoadingPage from 'Components/Shared/LoadingPage';
import { GoPencil } from "react-icons/go";
import { GoAlertFill } from 'react-icons/go';
import axios from 'axios';
import MyCalendar from 'Components/Shared/MyCalendar';

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
    linkedin: '',
    pinterest: '',
    behance: '',
    youtube: '',
    instagram: '',
});

const initialDesignerData = Object.freeze({
    design_inspirations: '',
    design_process: '',
    areas_of_specialization: '',
    lead_time: '',
    pricing_structure: '',
});

const Profile = () => {
    const [user, setUser] = useState(initialUserData);
    const [designer, setDesigner] = useState(initialDesignerData);
    const [userLoading, setUserLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);
    const [aboutShow, setAboutShow] = useState(true);
    const [portfolioShow, setPortfolioShow] = useState(false);
    const [fabricShow, setFabricShow] = useState(false);
    const [processShow, setProcessShow] = useState(false);
    const [limitedDesignShow, setLimitedDesignShow] = useState(false);
    const [myCalendarShow, setMyCalendarShow] = useState(false);
    const [formStatus, setFormStatus] = useState('standby');
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);
    const [areasOfSpecialization, setAreaOfSpecialization] = useState([])

    const currentUser = cookies.currentUser;
    const token = cookies.token;

    // User Image
    const [userImage, setUserImage] = useState();
    const [uploadStatus, setUploadStatus] = useState("standby");
    const hiddenFileInputImg = React.useRef(null);

    const handleClickImg = event => {
        hiddenFileInputImg.current.click();
    };
    
    const handleChangeImg = ({ target }) => {
        if (target.files < 1 || !target.validity.valid) {
            return
        }
        if (target.files[0]) {
            submitDocument(target.files[0]);
        }
    }

    const submitDocument = (event) => {
        // event.preventDefault();
        setUploadStatus("loading");
        const dataArray = new FormData();
        dataArray.append("image", event);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'user/image?user_id='+currentUser+'&token=' + token, dataArray, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }).then((response) => {
          if (response.data.status == "Success") {
            var media_id = response.data.data.id;
            var profile_picture = response.data.data.image;
            setUserImage(profile_picture);
            updateProfilePicture(profile_picture);
    
            let reader = new FileReader();
            let file = event;
    
            reader.onloadend = () => {
              // setDocuments(documents => [...documents, { media_id: media_id, name: event.name, url: reader.result, type: event.type }]);
              // setUserImage(reader.result);
            }
            reader.readAsDataURL(file);
          }
        })
        .catch(() => {
            toast.error("An error occured. Please try again or contact the administrator.");
            setUploadStatus("standby");
        });
    };

    async function updateProfilePicture(e){
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser+'?user_id=' + currentUser + '&token=' + token, {
          image: e
        }).then((response) => {
          const success = response.data.status;
          if(success == 'Success') {
            toast.success('Profile picture updated successfully!');
            setFormStatus("standby");
            setUploadStatus("standby");
            const data = response.data.data;
            const user = data.user;
            const user_details = {currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at}
            setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
            setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
            setCookie('signup_type', user.signup_type, { path: '/' });
          } else {
            toast.error('An error occured. Please try again or contact the administrator.');
            setFormStatus("standby");
            setUploadStatus("standby");
          }
        }).catch(() => {
          toast.error('An error occured. Please try again or contact the administrator.');
          setFormStatus("standby");
          setUploadStatus("standby");
        });
    }

    const showTab = (tab) => {
        if (tab == "about") {
            setAboutShow(true);
            setPortfolioShow(false);
            setFabricShow(false);
            setProcessShow(false);
            setLimitedDesignShow(false);
            setMyCalendarShow(false);
        } else if (tab === "portfolio") {
            setPortfolioShow(true);
            setAboutShow(false);
            setFabricShow(false);
            setProcessShow(false);
            setLimitedDesignShow(false);
            setMyCalendarShow(false);
        } else if (tab === "fabric") {
            setFabricShow(true);
            setPortfolioShow(false);
            setAboutShow(false);
            setProcessShow(false);
            setLimitedDesignShow(false);
            setMyCalendarShow(false);
        } else if (tab === "process") {
            setProcessShow(true);
            setPortfolioShow(false);
            setAboutShow(false);
            setFabricShow(false);
            setLimitedDesignShow(false);
            setMyCalendarShow(false);
        } else if (tab === "calendar") {
            setLimitedDesignShow(true);
            setProcessShow(false);
            setPortfolioShow(false);
            setAboutShow(false);
            setFabricShow(false);
            setMyCalendarShow(false);
        } else if (tab == "my_calendar") {
            setLimitedDesignShow(false);
            setProcessShow(false);
            setPortfolioShow(false);
            setAboutShow(false);
            setFabricShow(false);
            setMyCalendarShow(true);
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
          // Update state or perform other logic with userData
        } catch (error) {
            setUserLoading(false);
            toast.error('An error occured. Please try again or contact the administrator.');
            console.log(error);
          // Handle the error, if needed
        }
    };

    useEffect(() => {
        fetchData({token: token, currentUser: currentUser});
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
                                            <div className="profile-image" style={{ backgroundImage: "url("+Loading+")", backgroundColor: '#f5f6f8'}}></div>
                                            :
                                            <>
                                                {userImage ?
                                                    <div className="profile-image" style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'user/'+userImage+")"}}></div>
                                                    :
                                                    <div className="profile-image" style={{ backgroundImage: "url("+UserPlaceholder+")"}}></div>
                                                }
                                            </>
                                        }
                                        <div className="user-image-edit" onClick={handleClickImg}>
                                            <GoPencil />
                                        </div>
                                        <input type="file"
                                            ref={hiddenFileInputImg}
                                            onChange={handleChangeImg}
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                            required
                                        />
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
                                                    {user.city ? user.city+',' : ""} {user.province ? user.province+"," : ""} {user.country ? user.country : ""}
                                                </p>
                                                :
                                                <p className='fs-16 color-light-blue'>-</p>
                                            }
                                        </div>
                                        
                                    </div>
                                </div>
                            </Col>
                            <Col lg="6" className='mb-5'>
                                <Row className="justify-content-end">
                                    <Col md="3" className="text-right pe-0">
                                        <Button href="/user/profile/edit" type='button' id="btn-edit-profile">Edit Profile</Button>
                                    </Col>
                                    {user.is_designer == 1 && (
                                        <Col md="3" className="text-left">
                                            <Button href="/seller-center" type='button' id="btn-edit-profile">Seller Center</Button>
                                        </Col>
                                    )}
                                </Row>
                            </Col>
                            <Col lg="12" className='mt-4'>
                                <span className={`cursor-pointer me-5 mb-3 fs-16 ${aboutShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("about"); }}>About</span>
                                {user.is_designer == 1 && (
                                    <span className={`cursor-pointer me-5 mb-3 fs-16 ${portfolioShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("portfolio"); }}>Portfolio</span>
                                )}
                                {user.is_seller == 1 && (
                                    <span className={`cursor-pointer me-5 mb-3 fs-16 ${fabricShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("fabric") }}>Fabrics</span>
                                )}
                                 {user.is_designer == 1 && (
                                    <span className={`cursor-pointer me-5 mb-3 fs-16 ${myCalendarShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("my_calendar") }}>My Calendar</span>
                                )}
                                {/* <span className={`text-black cursor-pointer me-5 mb-3 fs-16 ${processShow ? 'fw-600' : ''}`} onClick={function () { showTab("process") }}>Process</span>
                                <span className={`text-black cursor-pointer me-5 mb-3 fs-16 ${limitedDesignShow ? 'fw-600' : ''}`} onClick={function () { showTab("limited_design"); }}>Limited Design</span> */}
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
                                        {/* <div className='d-flex'>
                                            <p className='text-gray'>0 Followers</p>
                                            <p className='text-gray'>0 Following</p>
                                        </div> */}
                                    </Col>
                                    <Col lg="6">
                                        <div className='bg-lgray profile-details address mb-4'>
                                            <div className='icons-d-flex'>
                                                <img src={PinIcon} alt="location pin"/>
                                                {user.city || user.province || user.country ? 
                                                    <p>{user.city ? user.city+',' : ""} {user.province ? user.province+"," : ""} {user.country ? user.country+"," : ""}</p>
                                                    :
                                                    <p>-</p>
                                                }
                                            </div>
                                            {user.website ?
                                                <div className='icons-d-flex'>
                                                    <img src={LinkIcon} alt="website pin" />
                                                    <p><a href={user.website} target="_blank">{user.website}</a></p>
                                                </div>
                                                :
                                                <div className='icons-d-flex'>
                                                    <img src={LinkIcon}  alt="website pin" />
                                                    <p><a href="#">-</a></p>
                                                </div>
                                            }
                                            {user.phone_number ?
                                                <div className='icons-d-flex'>
                                                    <img src={TelephonIcon}  alt="telephone pin" />
                                                    <p className='mb-0'><a href={`tel:${user.phone_number}"`}>{user.phone_number}</a></p>
                                                </div>
                                                :
                                                <div className='icons-d-flex'>
                                                    <img src={TelephonIcon}  alt="telephone pin" />
                                                    <p className='mb-0'><a href="#">-</a></p>
                                                </div>
                                            }
                                        </div>
                                        <div className='bg-lgray profile-details social'>
                                            <p>Social</p>
                                            {user.behance ?
                                                <div className='icons-d-flex'>
                                                    <img src={BehanceIcon}  alt="behance pin" />
                                                    <p><a href={user.behance} target="_blank">{user.behance}</a></p>
                                                </div>
                                                :
                                                <div className='icons-d-flex'>
                                                    <img src={BehanceIcon}  alt="behance pin" />
                                                    <p><a href="#" target="_blank">-</a></p>
                                                </div>
                                            }
                                            {user.facebook ?
                                                <div className='icons-d-flex'>
                                                    <img src={FacebookIcon}  alt="facebook pin" />
                                                    <p><a href={user.facebook} target="_blank">{user.facebook}</a></p>
                                                </div>
                                                :
                                                <div className='icons-d-flex'>
                                                    <img src={FacebookIcon}  alt="facebook pin" />
                                                    <p><a href="#">-</a></p>
                                                </div>
                                            }
                                            {user.linkedin ?
                                                <div className='icons-d-flex'>
                                                    <img src={LinkedinIcon}  alt="linkedin pin" />
                                                    <p><a href={user.linkedin} target="_blank">{user.linkedin}</a></p>
                                                </div>
                                                :
                                                <div className='icons-d-flex'>
                                                    <img src={LinkedinIcon}  alt="linkedin pin" />
                                                    <p><a href="#">-</a></p>
                                                </div>
                                            }
                                            {user.instagram ?
                                                <div className='icons-d-flex'>
                                                    <img src={SocialmediaIcon}  alt="instagram pin" />
                                                    <p><a href={user.instagram} target="_blank">{user.instagram}</a></p>
                                                </div>
                                                :
                                                <div className='icons-d-flex'>
                                                    <img src={SocialmediaIcon}  alt="instagram pin" />
                                                    <p><a href="#">-</a></p>
                                                </div>
                                            }
                                            {user.youtube ?
                                                <div className='icons-d-flex'>
                                                    <img src={YoutubeIcon}  alt="youtube pin" />
                                                    <p><a href={user.youtube} target="_blank">{user.youtube}</a></p>
                                                </div>
                                                :
                                                <div className='icons-d-flex'>
                                                    <img src={YoutubeIcon}  alt="youtube pin" />
                                                    <p><a href="#">-</a></p>
                                                </div>
                                            }
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

                        {myCalendarShow ?
                            <div id="profile-portfolio">
                                <MyCalendar />
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

export default Profile;