import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { Container, Button }  from 'react-bootstrap';
import { FaMagnifyingGlass } from "react-icons/fa6";
import Logo from 'Assets/images/kouture-konect-logo.png';
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoIosHeartEmpty, IoIosPower, IoIosImages, IoIosCog } from "react-icons/io";
import { useCookies } from 'react-cookie';
import UserPlaceholder from 'Assets/images/user.png';
import { Link } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userImage, setUserImage] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);
  const userRef = useRef(null);

  const currentUser = cookies.currentUser;
  const userDetails = cookies.userDetails;

  // removeCookies
  const removeCookies = () => {
    removeCookie('token', { path: '/' });
    removeCookie('userDetails', { path: '/' });
    removeCookie('isWelcome', { path: '/' });
    removeCookie('currentUser', { path: '/' });
    removeCookie('isLoggedIn', { path: '/' });
    removeCookie('userRole', { path: '/' });
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

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    if (userDetails && userDetails.image != "") {
      setUserImage(userDetails.image);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-primary">
      <Container>
        <Navbar.Brand href="/"><img src={Logo}/></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse className="justify-content-between" id="responsive-navbar-nav">
          <Nav className="align-items-center">
            <Nav.Link href="/find-designs">Find Designs</Nav.Link>
            <Nav.Link href="/inspirations">Inspirations</Nav.Link>
            <Nav.Link href="/inspirations">Blog</Nav.Link>
          </Nav>
          <Nav className="align-items-center d-grid-mobile">
            <Form inline className='search d-flex column-gap-70 align-items-center'>
              <FormControl type='text' placeholder='Search' className='mr-sm-2' />
              <FaMagnifyingGlass />
            </Form>
            <div className="d-flex">
              {currentUser && currentUser != "" ?
                <>
                  <Nav.Link href="/"><HiOutlineShoppingBag size={30}/></Nav.Link>
                  <Nav.Link href="/"><IoIosHeartEmpty size={30}/></Nav.Link>
                  <div className="user-dropdown" ref={userRef}>
                    {userImage ?
                      <div className="header-user-photo cursor-pointer" onClick={toggleUserMenu} style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'user/'+userImage+")"}}></div>
                      :
                      <div className="header-user-photo cursor-pointer" onClick={toggleUserMenu} style={{ backgroundImage: "url("+UserPlaceholder+")"}}></div>
                    }
                    {userMenuOpen && (
                      <div className="action-box user-menu">
                        <Link to="/user/profile" className="mb-3 text-decoration-none d-block"><IoIosCog /> Profile</Link>
                        <Link to="/" className="mb-3 text-decoration-none d-block"><IoIosImages /> Portfolio</Link>
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