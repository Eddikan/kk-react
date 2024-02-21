import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import { Row, Col, Button, Modal, Card } from 'react-bootstrap';
import { FaMagnifyingGlass } from "react-icons/fa6";
import Logo from 'Assets/images/kouture-konect-logo.png';
import { IoIosHeartEmpty, IoIosPower, IoIosImages, IoIosCog } from "react-icons/io";
import { IoCalendarClearOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import { BsEnvelope } from "react-icons/bs";
import { useCookies } from 'react-cookie';
import UserPlaceholder from 'Assets/images/user.png';
import NewOrder from '../../Assets/images/new-order-icon.png';
import NewAppointment from '../../Assets/images/new-appointment-icon.png';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import User from '../../Assets/images/user.png';
import PlaceholderSquare from '../../Assets/images/square-placeholder.jpg';
import { GoAlertFill } from 'react-icons/go';
import '../../Assets/styles/HeaderSeller/style.css'
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

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'userDetails']);
    const [userType, setUserType] = useState('user');
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

    // removeCookies
    const removeCookies = () => {
        removeCookie('token', { path: '/' });
        removeCookie('userDetails', { path: '/' });
        removeCookie('isWelcome', { path: '/' });
        removeCookie('currentUser', { path: '/' });
        removeCookie('isLoggedIn', { path: '/' });
        removeCookie('userRole', { path: '/' });
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
            if (userDetails.email_verified_at == "" || userDetails.email_verified_at == null) {
                if (!currentUrl.includes('email-confirmation') && !currentUrl.includes('login') && !currentUrl.includes('sign-up') && !currentUrl.includes('email-confirmed') && location.pathname !== '/') {
                    navigate("/email-confirmation");
                }
            }

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
                    } else {
                        toast.error('There has been an error getting the date, please try again!');
                    }
                })
                .catch((error) => {
                    toast.error('There has been an error getting the date, please try again!');
                });
        }


    }, [reloadCount]);

    return (
        <>
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

                                                <div className="user-dropdown nav-link" ref={bellRef}>
                                                    {userImage ?
                                                        <div className="cursor-pointer nav-link"><GoBell size={25} onClick={toggleBellMenu} /></div>
                                                        :
                                                        <div className="cursor-pointer nav-link"><GoBell size={25} onClick={toggleBellMenu} /></div>
                                                    }
                                                    {userBellOpen && (

                                                        <div className="action-box-bell user-menu-bell">
                                                            {/* <div className='d-flex'>
                                                                <img src={NewOrder} className='new-order-image' />
                                                                <div className='ms-3 fs-14 body-text-bell'>You have a new order and instructions from Mike. Get Started
                                                                    sed diam nonumy eirmod tempor invidunt ut labore et dolore
                                                                    magna.
                                                                    <div className='hours-bell mt-1'>1hr ago - 9:00 AM</div>
                                                                </div>
                                                            </div>
                                                            <hr /> */}

                                                            <div className='d-flex'>
                                                                <img src={NewAppointment} className='new-appointment-image' />
                                                                <div className='ms-3 fs-14 body-text-bell'>Congratulations! You can now start using Kouture Konect
                                                                    <div className='hours-bell mt-1'>3hrs ago - 3:25 PM</div>
                                                                </div>
                                                            </div>
                                                            <hr />
                                                            <div className='text-right text-gold fs-14 cursor-pointer'
                                                                onClick={() => toggleUnderConstruction("Notifcations")}>View All
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="user-dropdown nav-link" ref={messageRef}>
                                                    {userImage ?
                                                        <div className="cursor-pointer nav-link"><BsEnvelope size={25} onClick={toggleEnvelopMenu} /></div>
                                                        :
                                                        <div className="cursor-pointer nav-link"><BsEnvelope size={25} onClick={toggleEnvelopMenu} /></div>
                                                    }
                                                    {userEnvelopOpen && (

                                                        <div className="action-box-envelop user-menu-envelop">
                                                            <div className='d-flex'>
                                                                <div style={{maxWidth: 100}}><img src={User} className='user-placeholder-header' /></div>
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
                                                        <div className="action-box user-menu-seller">
                                                            <Link to={`/${userType}/profile`} className="mb-3 text-decoration-none d-block"><IoIosCog /> Profile</Link>
                                                            {/* <Link to="/user/center/portfolio" className="mb-3 text-decoration-none d-block"><IoIosImages /> Portfolio</Link> */}
                                                            <p className="mb-0 cursor-pointer" onClick={logOut}><IoIosPower /> Logout</p>
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
                    <button type='button' className='close react-modal-close' onClick={() => toggleUnderConstruction("")} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='fs-25 fw-600 mb-3'>{modalHeading}</h4>
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