import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { Container, Button } from 'react-bootstrap';
import { FaMagnifyingGlass } from "react-icons/fa6";
import Logo from 'Assets/images/kouture-konect-logo.png';
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoIosHeartEmpty, IoIosPower, IoIosImages, IoIosCog } from "react-icons/io";
import { GoBell } from "react-icons/go";
import { BsEnvelope } from "react-icons/bs";
import { useCookies } from 'react-cookie';
import UserPlaceholder from 'Assets/images/user.png';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUrl = window.location.href;
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userImage, setUserImage] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'userDetails']);
  const [userType, setUserType] = useState('user');
  const userRef = useRef(null);

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

  const logOut = () => {
    removeCookies();
    navigate('/login');
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
    <Navbar collapseOnSelect expand="lg" className="bg-body-primary">
      <Container className="position-relative">
        <Navbar.Brand href="/"><img src={Logo} /></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse className="justify-content-between column-gap-10" id="responsive-navbar-nav">
          <Nav className="align-items-center column-gap-30">
            {/* <Nav.Link href="/find-designs">Find Designs</Nav.Link>
            <Nav.Link href="/inspirations">Inspirations</Nav.Link> */}
            <Nav.Link href="/about-kouture-konect" className='proximanova-family'>About KK</Nav.Link>
            <Nav.Link href="/how-it-works" className='proximanova-family'>How It Works</Nav.Link>
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
                  <div className="cursor-pointer nav-link"><GoBell size={25} /></div>
                  <div className="cursor-pointer nav-link"><BsEnvelope size={25} /></div>
                  <Nav.Link href="/wishlist"><IoIosHeartEmpty size={25} /></Nav.Link>
                  <Nav.Link href="/orders" className='proximanova-family fs-16'>Orders</Nav.Link>
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
  );
}

export default Header;