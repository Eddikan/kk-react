import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { Container, Button, Dropdown } from 'react-bootstrap';
import { FaMagnifyingGlass } from "react-icons/fa6";
import Logo from 'Assets/images/kouture-konect-logo.png';
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoIosHeartEmpty, IoIosPower, IoIosImages, IoIosCog } from "react-icons/io";
import { IoCalendarClearOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import { BsEnvelope } from "react-icons/bs";
import { useCookies } from 'react-cookie';
import UserPlaceholder from 'Assets/images/user.png';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Card, Modal } from 'react-bootstrap';
import User from '../../Assets/images/user.png';
import { GoAlertFill } from 'react-icons/go';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUrl = window.location.href;
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userBellOpen, setUserBellOpen] = useState(false);
  const [userEnvelopOpen, setUserEnvelopOpen] = useState(false);
  const [userImage, setUserImage] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'userDetails']);
  const [userType, setUserType] = useState('user');
  const userRef = useRef(null);
  const [underConstructionShow, setUnderConstructionShow] = useState(false);
  const [modalHeading, setModalHeading] = useState();
  const currentUser = cookies.currentUser;
  const userDetails = cookies.userDetails;
  const signupType = cookies.signup_type;
  const completedQuestionnaire = cookies.completed_questionnaire;

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
              <div className="d-flex column-gap-10 align-items-center">
                {currentUser && currentUser != "" ?
                  <>

                    <div className="user-dropdown nav-link" ref={userRef}>
                      {userImage ?
                        <div className="cursor-pointer nav-link"><GoBell size={25} onClick={toggleBellMenu} /></div>
                        :
                        <div className="cursor-pointer nav-link"><GoBell size={25} onClick={toggleBellMenu} /></div>
                      }
                      {userBellOpen && (

                        <div className="action-box-bell user-menu-bell">
                          <div className='d-flex'>
                            <div>Icon</div>
                            <div className='ms-3 fs-14 body-text-bell'>You have a new order and instructions from Mike. Get Started
                              sed diam nonumy eirmod tempor invidunt ut labore et dolore
                              magna.
                              <div className='hours-bell mt-1'>1hr ago - 9:00 AM</div>
                            </div>
                          </div>
                          <hr />

                          <div className='d-flex'>
                            <div>Icon</div>
                            <div className='ms-3 fs-14 body-text-bell'>"New buyer set an appointment. Go check it out"
                              <div className='hours-bell mt-1'>3hrs ago - 3:25 PM</div>
                            </div>
                          </div>
                          <hr />
                        </div>
                      )}
                    </div>

                    <div className="user-dropdown nav-link" ref={userRef}>
                      {userImage ?
                        <div className="cursor-pointer nav-link"><BsEnvelope size={25} onClick={toggleEnvelopMenu} /></div>
                        :
                        <div className="cursor-pointer nav-link"><BsEnvelope size={25} onClick={toggleEnvelopMenu} /></div>
                      }
                      {userEnvelopOpen && (

                        <div className="action-box-envelop user-menu-envelop">
                          <div className='d-flex'>
                            <div><img src={User} className='user-placeholder-header' /></div>
                            <div className='fs-14 body-text-bell'>Jeans Lorem Pants
                              <div className='mt-1'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et...</div>
                              <div className='hours-bell mt-1'>3hrs ago - 3:25 PM</div>
                            </div>
                          </div>
                          <hr />

                          <div className='d-flex'>
                            <div><img src={User} className='user-placeholder-header' /></div>
                            <div className='ms-3 fs-14 body-text-bell'>Marie Salazar
                              <div className='mt-1'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</div>
                              <div className='hours-bell mt-1'>1 day ago - 3:25 PM</div>
                            </div>
                          </div>
                          <hr />

                          <div className='text-right text-gold fs-14 cursor-pointer'
                            onClick={() => toggleUnderConstruction("View All Message")}>View All Message</div>
                        </div>

                      )}
                    </div>
                    <Nav.Link href="/wishlist"><IoIosHeartEmpty size={25} /></Nav.Link>
                    <Nav.Link href="/appointments"><IoCalendarClearOutline size={25} /></Nav.Link>

                    <Nav.Link href="/orders" className='fs-16'>Orders</Nav.Link>

                    <div className="user-dropdown nav-link" ref={userRef}>
                      {userImage ?
                        <div className="header-user-photo cursor-pointer" onClick={toggleUserMenu} style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'user/' + userImage + ")" }}></div>
                        :
                        <div className="header-user-photo cursor-pointer" onClick={toggleUserMenu} style={{ backgroundImage: "url(" + UserPlaceholder + ")" }}></div>
                      }
                      {userMenuOpen && (
                        <div className="action-box user-menu">
                          <Link to={`/${userType}/profile`} className="mb-3 text-decoration-none d-block"><IoIosCog /> Profile</Link>
                          {/* <Link to="/user/portfolio" className="mb-3 text-decoration-none d-block"><IoIosImages /> Portfolio</Link> */}
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
        </Container>
      </Navbar>
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

export default Header;