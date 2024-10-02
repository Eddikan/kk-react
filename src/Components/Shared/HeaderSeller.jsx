import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Row, Col, Button, Modal, Card } from 'react-bootstrap';
import Logo from 'Assets/images/kouture-konect-logo.png';
import { IoIosPower, IoIosImages, IoIosCog } from "react-icons/io";
import { GoBell, GoHeart } from "react-icons/go";
import { BsEnvelope, BsArrowLeft, BsCartCheck } from "react-icons/bs";
import { useCookies } from 'react-cookie';
import { IoCloseOutline, IoCalendarClearOutline } from "react-icons/io5";
import UserPlaceholder from 'Assets/images/user.png';
import NewAppointment from 'Assets/images/new-appointment-icon.png';
import { Link } from 'react-router-dom';
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { RxDashboard } from "react-icons/rx";
import toast from 'react-hot-toast';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { PiNotepadLight } from "react-icons/pi";
import User from 'Assets/images/user.png';
import { GoAlertFill } from 'react-icons/go';
import 'Assets/styles/HeaderSeller/style.css'
import axios from "axios";

const HeaderSeller = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentUrl = window.location.href;
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [userBellOpen, setUserBellOpen] = useState(false);
    const [userEnvelopOpen, setUserEnvelopOpen] = useState(false);
    const [userOrdersOpen, setUserOrdersOpen] = useState(false);
    const [userImage, setUserImage] = useState('');
    const [user, setUser] = useState('');
    const [reloadCount, setReloadCount] = useState(0);
    const [designerId, setDesignerId] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [notificationsLoading, setNotificationsLoading] = useState(true);

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'userDetails', 'userRole', 'isLoggedIn']);
    const isLoggedIn = cookies.isLoggedIn;
    const [userType, setUserType] = useState('user');

    const userRole = cookies.userRole;
    const userRef = useRef(null);
    const bellRef = useRef(null);
    const messageRef = useRef(null);
    const wishlistRef = useRef(null);
    const appointmentRef = useRef(null);
    const orderRef = useRef(null);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState();
    const currentUser = cookies.currentUser;
    const userDetails = cookies.userDetails;
    const signupType = cookies.signup_type;
    const completedQuestionnaire = cookies.completed_questionnaire;

    const getUser = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser);
    };

    const getNotifications = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'notification?user_id=' + currentUser);
    };

    // removeCookies
    const removeCookies = () => {
        removeCookie('token', { path: '/' });
        removeCookie('userDetails', { path: '/' });
        removeCookie('isWelcome', { path: '/' });
        removeCookie('currentUser', { path: '/' });
        removeCookie('currentUserDesigner', { path: '/' });
        removeCookie('currentUserSeller', { path: '/' });
        removeCookie('isLoggedIn', { path: '/' });
        removeCookie('userRole', { path: '/' });
        removeCookie('selectedCartItems', { path: '/' });
        removeCookie('tempCart', { path: '/' });
        removeCookie('tempFavorites', { path: '/' });
        removeCookie('selectedCountry', { path: '/' });
        removeCookie('selectedCountryCode', { path: '/' });
        removeCookie('selectedLanguage', { path: '/' });
        removeCookie('selectedCurrency', { path: '/' });
        removeCookie('selectedCurrencyCode', { path: '/' });
        removeCookie('cookieCheckoutDesigner', { path: '/' });
        removeCookie('signup_type', { path: '/' });
    };

    // Close the dropdown when clicking outside of it
    const handleClickOutside = (event) => {
        if (userRef.current && !userRef.current.contains(event.target)) {
            setUserMenuOpen(false);
        }
        if (bellRef.current && !bellRef.current.contains(event.target)) {
            setUserBellOpen(false);
        }
        if (messageRef.current && !messageRef.current.contains(event.target)) {
            setUserEnvelopOpen(false);
        }
        if (orderRef.current && !orderRef.current.contains(event.target)) {
            setUserOrdersOpen(false);
        }
    };

    const toggleUserMenu = () => {
        setUserMenuOpen(!userMenuOpen);
    };

    const toggleBellMenu = () => {
        setUserBellOpen(!userBellOpen);
    };

    const toggleEnvelopMenu = () => {
        setUserEnvelopOpen(!userEnvelopOpen);
    };

    const toggleOrdersMenu = () => {
        setUserOrdersOpen(!userOrdersOpen);
    };


    const logOut = () => {
        removeCookies();
        navigate('/login');
    }

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(!underConstructionShow);
        setModalHeading(message);
    }

    let reminded = 0;

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        if (userDetails) {
            if (userDetails.image != "") {
                setUserImage(userDetails.image);
            }
            // if (userDetails.email_verified_at == "" || userDetails.email_verified_at == null) {
            //     if (!currentUrl.includes('email-confirmation') && !currentUrl.includes('login') && !currentUrl.includes('sign-up') && !currentUrl.includes('email-confirmed') && location.pathname !== '/') {
            //         navigate("/email-confirmation");
            //     }
            // }

            if (reminded == 0) {
                if (currentUrl.includes('user')) {
                    if (!completedQuestionnaire) {
                        toast.error('Please complete the questionnaire before proceeding, thank you!');
                        setTimeout(function () {
                            navigate("/questionnaire");
                        }, 1000)
                        reminded = 1;
                    }
                }
            }

        } else {
            if (currentUrl.includes('user') || currentUrl.includes('designers') || currentUrl.includes('fabrics') || currentUrl.includes('designs')) {
                navigate("/login");
            }
        }

        // if (signupType == "user_designer" || signupType == "user_fabric" || signupType == "user_design") {
        //   setUserType('user');
        // } else {
        //   if (signupType == "designer") {
        //     setUserType('designer');
        //   } else if (signupType == "seller") {
        //     setUserType('vendor');
        //   }
        // }

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (currentUser) {
            getUser()
                .then((response) => {
                    const selectedUser = response.data.data;
                    if (selectedUser) {
                        setUser(selectedUser);
                        setDesignerId(selectedUser.designer.id);

                        if (selectedUser.shop_completed != 1) {
                            navigate('/user/shop/setup');
                            // toast.error('Please setup your shop!');
                        }
                    } else {
                        toast.error('There has been an error getting the date, please try again!');
                    }
                })
                .catch((error) => {
                    toast.error('There has been an error getting the date, please try again!');
                });

            getNotifications()
                .then((response) => {
                    const selectednotifications = response.data.data;
                    if (selectednotifications) {
                        setNotifications(selectednotifications);
                        setNotificationsLoading(false);
                    } else {
                        toast.error('There has been an error getting the notifications, please try again!');
                        setNotificationsLoading(false);
                    }
                })
                .catch((error) => {
                    toast.error('There has been an error getting the notifications, please try again!');
                    setNotificationsLoading(false);
                });
        }
    }, [reloadCount]);

    return (
        <>
            {isLoggedIn &&
                <>
                    {(user.profile_completeness >= 0 && user.profile_completeness < 100) &&
                        <>
                            <div className='banner-completion text-center'>

                                <span className='text-white'>Your profile completion is at {user.profile_completeness}%.
                                    <Link to="/user/complete-profile" className='text-decoration-none'>
                                        <span className='text-gold ms-1 cursor-pointer'>Click here to continue.</span>
                                    </Link>
                                </span>
                            </div>
                        </>
                    }

                    {/* {(user.shop_completed == 0 && (user.is_designer == 1 || user.is_seller == 1)) && 
            <>
              <div className='bg-dark py-2 text-center'>
                <span className='text-white cursor-pointer'>
                  <Link to="/user/shop/setup" className='text-decoration-none text-white'>
                  <HiOutlineBuildingStorefront size={20} className='me-2' color="#CEA835"/> 
                  Set up your shop 
                  </Link>
                </span>
            </div>
            </>
          } */}
                </>
            }
            <Navbar collapseOnSelect expand="lg" className="bg-body-primary">
                <Container fluid className='d-block'>
                    <Row>
                        <Col lg={6} className='col-left'>
                            <Navbar.Brand href="/"><img src={Logo} /></Navbar.Brand>
                        </Col>
                        <Col lg={6} className='text-right col-right'>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                            <Navbar.Collapse className="justify-content-end column-gap-10" id="responsive-navbar-nav">
                                <Nav className="align-items-center d-grid-mobile">
                                    <div className="d-flex column-gap-10 align-items-center">
                                        {currentUser && currentUser != "" ?
                                            <>

                                                <div className="user-dropdown nav-link position-relative d-block cursor-pointer" onClick={toggleBellMenu} ref={bellRef}>
                                                    <div className="nav-link header-tooltip" >
                                                        <span className="icon-tooltiptext fs-14">Notifications</span>
                                                        <GoBell size={25} />
                                                    </div>
                                                    {userBellOpen && (

                                                        <div className="action-box-bell scroll-bar user-menu-bell" id="style-2">
                                                            {notifications.length > 0 ?
                                                                <>
                                                                    {notifications.map((notification, index) => {
                                                                        const options = {
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric',
                                                                            hour: 'numeric',
                                                                            minute: 'numeric'
                                                                        };

                                                                        const today = (new Date(notification.created_at)).toLocaleDateString('en-ES', options);
                                                                        return (
                                                                            <>
                                                                                <Row className='mb-2'>
                                                                                    <Col lg={2}>
                                                                                        <img src={NewAppointment} className='new-appointment-image' alt='New Appointment' />
                                                                                    </Col>

                                                                                    <Col lg={10}>
                                                                                        <div className='body-text-bell'>
                                                                                            <div className="fs-16 fw-600 text-black">{notification.subject}</div>
                                                                                            <span className='fs-14 text-black'>{notification.message}</span>
                                                                                            <div className='hours-bell fs-14 mt-1'>{today}</div>
                                                                                        </div>
                                                                                    </Col>
                                                                                </Row>
                                                                                <hr className='mt-0 mb-3' />
                                                                            </>
                                                                        );
                                                                    })}
                                                                    {/* <div className='text-right text-gold fs-14 cursor-pointer' onClick={() => toggleUnderConstruction("Notifications")}>View All</div> */}
                                                                </>
                                                                :
                                                                <>
                                                                    <Card>
                                                                        <Card.Body className='text-center'>
                                                                            No notifications were found.
                                                                        </Card.Body>
                                                                    </Card>
                                                                </>
                                                            }

                                                        </div>
                                                    )}
                                                </div>

                                                <div className="user-dropdown nav-link position-relative d-block cursor-pointer" onClick={toggleEnvelopMenu} ref={messageRef}>
                                                    <div className="nav-link header-tooltip" >
                                                        <span className="icon-tooltiptext fs-14">Messages</span>
                                                        <BsEnvelope size={25} />
                                                    </div>
                                                    {userEnvelopOpen && (

                                                        <div className="action-box-envelop user-menu-envelop">
                                                            <div className='d-flex'>
                                                                <div style={{ maxWidth: 100 }}><img src={User} className='user-placeholder-header' /></div>
                                                                <div className='fs-14 body-text-bell'>Admin
                                                                    <div className='mt-1'>Thank you for signing up to Kouture Konect!</div>
                                                                    <div className='hours-bell mt-1'>3hrs ago - 3:25 PM</div>
                                                                </div>
                                                            </div>
                                                            <hr />
                                                            {/*
                                                            <div className='d-flex'>
                                                                <div><img src={User} className='user-placeholder-header' /></div>
                                                                <div className='ms-3 fs-14 body-text-bell'>Marie Salazar
                                                                    <div className='mt-1'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</div>
                                                                    <div className='hours-bell mt-1'>1 day ago - 3:25 PM</div>
                                                                </div>
                                                            </div>
                                                            <hr /> */}

                                                            <div className='text-right text-gold fs-14 cursor-pointer'
                                                                onClick={() => toggleUnderConstruction("Messages")}>View All
                                                            </div>
                                                        </div>

                                                    )}
                                                </div>

                                                <div className="user-dropdown nav-link" ref={userRef}>
                                                    {userImage ?
                                                        <div className="header-user-photo cursor-pointer" onClick={toggleUserMenu} style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'user/' + userImage + ")" }}></div>
                                                        :
                                                        <div className="header-user-photo cursor-pointer" onClick={toggleUserMenu} style={{ backgroundImage: "url(" + UserPlaceholder + ")" }}></div>
                                                    }
                                                    {userMenuOpen && (
                                                        <div className="action-box user-menu-seller-survey">
                                                            {/* {userRole !== 'Admin' &&
                                                                <Link to={`/${userType}/profile`} className="mb-3 text-decoration-none d-block"><IoIosCog className='me-2' color='#000000' />
                                                                    <span className='text-black'>Profile</span>
                                                                </Link>
                                                            } */}

                                                            {userRole !== 'Admin' &&
                                                                <Row className='mb-3'>
                                                                    <Col lg="3">
                                                                        <Link to={`/${userType}/profile`} className="mb-3 text-decoration-none">
                                                                            {userImage ?
                                                                                <div className="header-user-photo cursor-pointer" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'user/' + userImage + ")" }}></div>
                                                                                :
                                                                                <div className="header-user-photo cursor-pointer" style={{ backgroundImage: "url(" + UserPlaceholder + ")" }}></div>
                                                                            }
                                                                        </Link>
                                                                    </Col>

                                                                    <Col lg="9">
                                                                        <div className='fw-600'>Hi,&nbsp;{user.first_name}!</div>
                                                                        <Link to={`/${userType}/profile`} className="mb-3 text-decoration-none">
                                                                            <div><BsArrowLeft className="me-1" size={10} /><span className='fs-12'>See your profile</span></div>
                                                                        </Link>
                                                                    </Col>
                                                                </Row>
                                                            }

                                                            {userRole !== 'Admin' &&
                                                                <Link to={`/wishlist`} className="mb-3 text-decoration-none d-block"><GoHeart className='me-2' color='#000000' />
                                                                    <span className='text-black'>Wishlist</span>
                                                                </Link>
                                                            }

                                                            {/* {userRole !== 'Admin' &&
                                                                <Link to={`/admin/users`} className="mb-3 text-decoration-none d-block"><RxDashboard className='me-2 mb-1' color='#000000' />
                                                                    <span className='text-black'>Dashboard</span>
                                                                </Link>
                                                            } */}

                                                            {userRole !== 'Admin' &&
                                                                <Link to={`/orders`} className="mb-3 text-decoration-none d-block"><BsCartCheck className='me-2 mb-1' color='#000000' />
                                                                    <span className='text-black'>Orders</span>
                                                                </Link>
                                                            }

                                                            <Link to={`/appointments/${currentUser}`} className="mb-2 text-decoration-none d-block"><IoCalendarClearOutline className='me-2 mb-1' color='#000000' />
                                                                <span className='text-black'>Appointments</span>
                                                            </Link>


                                                            {/* {userRole !== 'Admin' &&
                                                                <div className='mb-2'>
                                                                    <DropdownButton id="dropdown-survey-button" className='dropdown-survey' title={<span><PiNotepadLight className='note-icon ' size={17} />Surveys</span>}>
                                                                        <Dropdown.Item href="/customer-satisfaction-survey" className='yellow-hover'>Customer Satisfaction</Dropdown.Item>
                                                                        <Dropdown.Item href="/general-feedback-survey" className='yellow-hover'>General Feedback</Dropdown.Item>

                                                                        {user.is_designer == 1 &&
                                                                            <>
                                                                                <Dropdown.Item href="/vendor-feedback-survey" className='yellow-hover'>Vendor Feedback</Dropdown.Item>
                                                                            </>
                                                                        }
                                                                    </DropdownButton>
                                                                </div>
                                                            } */}

                                                            <p className="mb-0 cursor-pointer" onClick={logOut}><IoIosPower className='me-2' color='#000000' />
                                                                <span className='text-black'>Logout</span>
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                            :
                                            <>
                                                <Nav.Link href="/login">Log in</Nav.Link>
                                                <Nav.Link href="/sign-up"><Button className="btn-primary" variant="primary">Sign Up</Button></Nav.Link>
                                            </>
                                        }
                                    </div>
                                </Nav>
                            </Navbar.Collapse>
                        </Col>
                    </Row>
                </Container>
            </Navbar >
            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button type='button' className='close react-modal-close' onClick={() => toggleUnderConstruction("")} data-dismiss='modal' aria-label='Close'>
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-1' />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='fs-22 mb-3'>{modalHeading}</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                            {/* <DateTimePicker onTimeChange={handleTimeChange} onDone={handleDoneTimeChange} availability={currentAvailability} /> */}
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>

        </>
    );
}

export default HeaderSeller;