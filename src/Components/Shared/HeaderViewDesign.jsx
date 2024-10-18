import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { Container, Button, Dropdown, Col, Row } from 'react-bootstrap';
import { FaMagnifyingGlass } from "react-icons/fa6";
import Logo from 'Assets/images/kouture-konect-logo.png';
import { IoIosPower, IoIosImages, IoIosCog } from "react-icons/io";
import { IoCalendarClearOutline, IoCartOutline, IoCloseOutline } from "react-icons/io5";
import { GoBell, GoHeart } from "react-icons/go";
import { BsEnvelope, BsShopWindow } from "react-icons/bs";
import { useCookies } from 'react-cookie';
import UserPlaceholder from 'Assets/images/user.png';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import NewOrder from 'Assets/images/new-order-icon.png';
import NewAppointment from 'Assets/images/new-appointment-icon.png';
import { Card, Modal } from 'react-bootstrap';
import User from 'Assets/images/user.png';
import PlaceholderSquare from 'Assets/images/square-placeholder.jpg';
import { GoAlertFill } from 'react-icons/go';
import 'Assets/styles/Headers/style.css';
import axios from "axios";

const HeaderViewDesign = () => {
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
    const [userOrders, setUserOrders] = useState([]);
    const [userOrdersLoading, setUserOrdersLoading] = useState(true);

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

    const getFabrics = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + '/product/fabric' + currentUser);
    };
    const getUserOrders = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '/order');
    }

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

    function truncateDescription(description, wordLimit) {
        const words = description.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return description;
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

            // if (reminded == 0) {
            //     if (currentUrl.includes('user')) {
            //         if (!completedQuestionnaire) {
            //             toast.error('Please complete the questionnaire before proceeding, thank you!');
            //             setTimeout(function () {
            //                 navigate("/questionnaire");
            //             }, 1000)
            //             reminded = 1;
            //         }
            //     }
            // }

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

            getUserOrders()
                .then((response) => {
                    const userOrder = response.data.data;
                    if (userOrder) {
                        setUserOrders(userOrder);
                        setUserOrdersLoading(false);
                    } else {
                        toast.error('There has been an error getting the orders, please try again!');
                        setUserOrdersLoading(false);
                    }
                })
                .catch((error) => {
                    toast.error('There has been an error getting the orders, please try again!');
                    setUserOrdersLoading(false);
                });
        }


    }, [reloadCount]);

    return (
        <>
            <Navbar collapseOnSelect expand="lg" className="bg-body-primary">
                <Container className="position-relative">
                    <Navbar.Brand href="/"><img src={Logo} /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse className="justify-content-between column-gap-10" id="responsive-navbar-nav">
                        <Nav className="align-items-center column-gap-30">
                            {/* <Nav.Link href="/find-designs">Find Designs</Nav.Link>
            <Nav.Link href="/inspirations">Inspirations</Nav.Link> */}
                            <Nav.Link href="/about-kouture-konect">About KK</Nav.Link>
                            <Nav.Link href="/how-it-works" >How It Works</Nav.Link>
                            {/* <Nav.Link href="/blog">Blog</Nav.Link> */}
                        </Nav>
                        <Nav className="align-items-center d-grid-mobile">
                            <Form inline className='search d-flex column-gap-70 align-items-center'>
                                <FormControl type='text' placeholder='Search' className='mr-sm-2' />
                                <FaMagnifyingGlass />
                            </Form>
                            <Nav.Link href="/login">Log in</Nav.Link>
                            <Nav.Link href="/sign-up"><Button className="btn-primary" variant="primary">Sign Up</Button></Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
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
                    <h4 className='fs-22 rufina-family mb-3'>{modalHeading}</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default HeaderViewDesign;