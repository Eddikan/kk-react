/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Modal } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import CountryCurrencyLanguageSelector from "./CountryCurrencyLanguageSelector";
import { BsArrowLeft } from "react-icons/bs";
import { AiOutlineAntDesign } from "react-icons/ai";
import { Container, Button, Col, Row } from "react-bootstrap";
import { FaChevronDown } from "react-icons/fa6";
import { IoIosPower } from "react-icons/io";
import { BsCartCheck, BsShopWindow } from "react-icons/bs";
import { useSelector } from "react-redux";
import {
  IoCalendarClearOutline,
  IoCartOutline,
  IoCloseOutline,
  IoShirtOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { GoHeart, GoAlertFill, GoGlobe } from "react-icons/go";
import { useCookies } from "react-cookie";
import { LiaUserTieSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { IoBookmarkOutline } from "react-icons/io5";
import NewAppointment from "Assets/images/new-appointment-icon.png";
import UserPlaceholder from "Assets/images/user.png";
import TextLogo from "Assets/images/logos/kouture-text-logo.png";
import "Assets/styles/Headers/style.css";
import toast from "react-hot-toast";
import useAuth from "hooks/useAuth";
import GetUserWishlistsData from "Utils/GetUserWishlistsData";
import DesignIcon from "Assets/images/user-box/dress.png";
import FabricIcon from "Assets/images/user-box/fabric.png";
import DesignerIcon from "Assets/images/user-box/edit-tools.png";
import UserIcon from "Assets/images/icons/profile.png";
import FavoritesIcon from "Assets/images/icons/bookmark.png";
import CartIcon from "Assets/images/icons/cart.png";
import BellIcon from "Assets/images/icons/bell.png";
import DesignerModalIcon from "Assets/images/icons/designer-modal-icon-purple.png";
import FabricModalIcon from "Assets/images/icons/fabric-modal-icon-purple.png";
import DesignerVendorModalIcon from "Assets/images/icons/sewing-modal-icon-purple.png";
import {
  useGetDesignFiltersQuery,
  useGetDesignersFiltersQuery,
  useGetMyNotificationsQuery,
  useGetProfileQuery,
  useGetCartItemsQuery,
  useGetWishlistItemsQuery,
} from "store/api/queries";
const Header = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  let query = useQuery();
  const currenStoreUser = useSelector((state) => state.user.user);
  const currentUser = useSelector((state) => state.user?.user?.email);
  const isLoggedIn = currentUser;

  const is_seller = currenStoreUser?.type == "seller" ? true : false;
  const is_designer = currenStoreUser?.type == "designer" ? true : false;
  const headerSearch = query.get("search");
  const headerType = query.get("type");

  const { refetch: refetchDesignFilters } = useGetDesignFiltersQuery();
  const { refetch: refetchDesignersFilters } = useGetDesignersFiltersQuery();
  const myNotificationsQuery = isLoggedIn
    ? useGetMyNotificationsQuery({
        enabled: false,
      })
    : null;

  const myProfile = isLoggedIn
    ? useGetProfileQuery({
        enabled: false,
      })
    : null;
  const myCartQuery = isLoggedIn ? useGetCartItemsQuery() : null;
  const myWishList = isLoggedIn ? useGetWishlistItemsQuery() : null;

  useEffect(() => {
    refetchDesignFilters();
    refetchDesignersFilters();
    if (isLoggedIn) {
      myProfile.refetch();
      myNotificationsQuery.refetch();
      myCartQuery.refetch();
      myWishList.refetch();
    }
  }, []);

  const [cookies] = useCookies([
    "currentUser",
    "userDetails",
    "userRole",
    "isLoggedIn",
    "selectedCartItems",
    "tempCart",
    "tempFavorites",
    "selectedCountry",
    "selectedCountryCode",
    "selectedLanguage",
    "selectedCurrency",
    "selectedCurrencyCode",
    "cartItemCount",
    "favoriteItemCount",
  ]);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userBellOpen, setUserBellOpen] = useState(false);
  const [userCountryOpen, setUserCountryOpen] = useState(false);
  const [userWishlistOpen, setUserWishlistOpen] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [user, setUser] = useState(currenStoreUser);
  const [notifications, setNotifications] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(
    cookies.cartItemCount ?? 0
  );
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const userRef = useRef(null);
  const bellRef = useRef(null);
  const wishlistRef = useRef(null);
  const countryRef = useRef(null);
  const searchRef = useRef(null);
  const [underConstructionShow, setUnderConstructionShow] = useState(false);
  const [setupShopShow, setSetupShopShow] = useState(false);
  const [modalHeading, setModalHeading] = useState();
  const [search, setSearch] = useState(headerSearch ?? "");
  const [activeTab, setActiveTab] = useState(headerType ?? "Designers");

  //   const currentUser =  {
  //     "first_name": "",
  //     "last_name": "",
  //     "email": "alsyrob@hieuclone.com",
  //     "avatar": null,
  //     "status": "Default",
  //     "type": "customer"
  // }

  const userDetails = cookies.userDetails;
  const userRole = cookies.userRole;
  const tempCart = cookies.tempCart;
  const tempFavorites = cookies.tempFavorites;

  useEffect(() => {
    if (
      activeTab !== "Designers" &&
      activeTab !== "Fabrics" &&
      activeTab !== "Designs"
    ) {
      setActiveTab("Designers");
    }
  }, [activeTab]);

  // removeCookies

  // Close the dropdown when clicking outside of it
  const handleClickOutside = (event) => {
    if (userRef.current && !userRef.current.contains(event.target)) {
      setUserMenuOpen(false);
    }
    if (bellRef.current && !bellRef.current.contains(event.target)) {
      setUserBellOpen(false);
    }

    if (countryRef.current && !countryRef.current.contains(event.target)) {
      setUserCountryOpen(false);
    }
    if (wishlistRef.current && !wishlistRef.current.contains(event.target)) {
      setUserWishlistOpen(false);
    }
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setUserDropdownOpen(false);
    }
  };

  const toggleDropdownShow = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleCountryMenu = () => {
    setUserCountryOpen(!userCountryOpen);
  };

  const toggleBellMenu = () => {
    setUserBellOpen(!userBellOpen);
  };

  const toggleWishlistMenu = () => {
    setUserWishlistOpen(!userWishlistOpen);
  };

  function toggleUnderConstruction(message) {
    setUnderConstructionShow(!underConstructionShow);
    setModalHeading(message);
  }

  const handleChangeSearch = (e) => {
    setSearch(() => e.target.value);
  };

  const searchSubmitIcon = () => {
    if (search != "") {
      if (activeTab == "Designers") {
        navigate("/designers?search=" + search + "&type=Designers");
      } else if (activeTab == "Fabrics") {
        navigate("/fabrics?search=" + search + "&type=Fabrics");
      } else if (activeTab == "Designs") {
        navigate("/designs?search=" + search + "&type=Designs");
      }
    }
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    if (activeTab == "Designers") {
      navigate("/designers?search=" + search + "&type=Designers");
    } else if (activeTab == "Fabrics") {
      navigate("/fabrics?search=" + search + "&type=Fabrics");
    } else if (activeTab == "Designs") {
      navigate("/designs?search=" + search + "&type=Designs");
    }
  };

  const searchSubmitDropdown = (e) => {
    if (e == "Designers") {
      navigate("/designers?search=" + search + "&type=Designers");
    } else if (e == "Fabrics") {
      navigate("/fabrics?search=" + search + "&type=Fabrics");
    } else if (e == "Designs") {
      navigate("/designs?search=" + search + "&type=Designs");
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    if (userDetails) {
      if (userDetails.image != "") {
        setUserImage(userDetails.image);
      }
    }

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [cookies]);

  const currentPath = location.pathname + location.search;
  // console.log('currentPath', currentPath);

  // const fullUrl = `${window.location.protocol}//${window.location.host}${location.pathname}${location.search}` || false;

  const ddfPaths = ["/designers", "/designs", "/fabrics"];
  const hrefLogin = ddfPaths.includes(currentPath)
    ? `/login?redirect_to=${encodeURIComponent(currentPath)}`
    : "/login";

  return (
    <>
      <div className="banner-home w-100 p-2 px-5">
        <Container>
          <Row>
            <Col lg="6">
              <div className="banner-menu d-flex justify-content-start">
                <Link
                  className="banner-item px-3"
                  to="/user/shop/setup"
                  // onClick={() => setSetupShopShow(!setupShopShow)}
                >
                  Set Up Shop
                </Link>
                <p className="mb-0 text-white">|</p>
                <a
                  className="banner-item px-3"
                  href="https://kouture-konect.jenocabrera.tech/apk/kouture-konect.apk"
                >
                  Download the App
                </a>
              </div>
            </Col>
            <Col lg="6">
              <div className="banner-menu d-flex justify-content-end">
                <a className="banner-item px-3" href="/about-kouture-konect">
                  About Us
                </a>
                <a
                  className="banner-item px-3"
                  href="/customer-satisfaction-survey"
                >
                  Feedback
                </a>
                <a className="banner-item px-3" href="/">
                  Contact Us
                </a>
                <p className="mb-0 text-white">|</p>
                <div className="ps-4 pe-2 mt-auto mb-auto">
                  <div
                    className="country-dropdown nav-link position-relative"
                    ref={countryRef}
                  >
                    <div
                      className="nav-link cursor-pointer"
                      onClick={toggleCountryMenu}
                    >
                      <GoGlobe className="text-white" size={20} />
                    </div>
                    {userCountryOpen && (
                      <div className="action-box user-menu country-box">
                        <CountryCurrencyLanguageSelector />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Navbar collapseOnSelect expand="lg" className="bg-body-primary px-5">
        <Container className="position-relative">
          {/* <Navbar.Brand href="/"><img src={Logo} /></Navbar.Brand> */}
          <Navbar.Brand href="/">
            <img src={TextLogo} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            className="justify-content-between column-gap-70"
            id="responsive-navbar-nav"
          >
            <Nav className="align-items-center w-100">
              {/* <Nav.Link href="/find-designs">Find Designs</Nav.Link>
              <Nav.Link href="/inspirations">Inspirations</Nav.Link> */}
              <Form
                onSubmit={searchSubmit}
                inline
                className="search-header w-100 d-flex align-items-center"
              >
                <HiMiniMagnifyingGlass onClick={searchSubmitIcon} size="20px" />
                <FormControl
                  type="text"
                  placeholder="Search"
                  name="search"
                  onChange={handleChangeSearch}
                  value={search}
                  className="fs-12 search-bar-header ms-2 my-0"
                />
                <div
                  className="nav-link-dropdown bg-white border border-1 border-black border-gold-hover px-3 search-dropdown-btn cursor-pointer"
                  onClick={toggleDropdownShow}
                  ref={searchRef}
                >
                  <p className="nav-link p-0 text-center fs-13 fw-500">
                    {activeTab}{" "}
                    <FaChevronDown
                      size="13px"
                      className="ms-2"
                      style={{
                        display: "inline-block",
                        verticalAlign: "middle",
                        marginTop: "-2px",
                      }}
                    />
                  </p>
                  {userDropdownOpen && (
                    <div className="search-dropdown-menu search-dropdown">
                      <a
                        className="nav-link ps-0 pe-0"
                        href="javascript:void(0)"
                        onClick={function () {
                          searchSubmitDropdown("Designers");
                          setActiveTab("Designers");
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <img
                            className="mx-2"
                            src={DesignerIcon}
                            width="22px"
                          />
                          <div>
                            <p className="search-dropdown-title mb-0">
                              Designers
                            </p>
                            <span className="subtitle fs-10">
                              Find top fashion designers
                            </span>
                          </div>
                        </div>
                      </a>
                      <a
                        className="nav-link ps-0 pe-0"
                        href="javascript:void(0)"
                        onClick={function () {
                          searchSubmitDropdown("Fabrics");
                          setActiveTab("Fabrics");
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <img className="mx-2" src={FabricIcon} width="23px" />
                          <div>
                            <p className="search-dropdown-title mb-0">
                              Fabrics
                            </p>
                            <span className="subtitle fs-10">
                              Find top fashion designers
                            </span>
                          </div>
                        </div>
                      </a>
                      <a
                        className="nav-link ps-0 pe-0"
                        href="javascript:void(0)"
                        onClick={function () {
                          searchSubmitDropdown("Designs");
                          setActiveTab("Designs");
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <img className="mx-2" src={DesignIcon} width="22px" />
                          <div>
                            <p className="search-dropdown-title mb-0">
                              Designs
                            </p>
                            <span className="subtitle fs-10">
                              Find top fashion designers
                            </span>
                          </div>
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              </Form>

              {/* <Nav.Link href="/blog">Blog</Nav.Link> */}
            </Nav>
            <Nav className="align-items-center d-grid-mobile">
              <div className="d-flex column-gap-10 align-items-center">
                {/* <div className="nav-link-dropdown">
                  <a className="nav-link" href="/about-kouture-konect">
                    About Us <FaCaretDown style={{ marginLeft: '30px', marginTop: '-5px' }} />
                  </a>
                  <div className="nav-link-menu">
                    <a className="nav-link" href="/how-it-works">
                      How It Works
                    </a>
                  </div>
                </div> */}

                {currentUser && currentUser != "" ? (
                  <>
                    <div className="nav-link-dropdown border-left-rounded border-black ms-2">
                      <div className="nav-link d-flex cursor-pointer">
                        {/* <IoPersonOutline size={26} /> */}
                        <img
                          src={UserIcon}
                          className="navigation-icon"
                          alt="Profile"
                        />
                        {/* {userImage ?
                          <div className="header-user-photo cursor-pointer" style={{ backgroundImage: "url(" + import.meta.env.VITE_REACT_APP_STORAGE_URL + 'user/' + userImage + ")" }}>

                          </div>
                          :
                          <div className="header-user-photo cursor-pointer" style={{ backgroundImage: "url(" + UserPlaceholder + ")" }}>

                          </div>
                        } */}
                      </div>
                      <div className="nav-link-menu">
                        <a
                          className="nav-link cursor-pointer text-decoration-none border-bottom pb-3 mb-2"
                          style={{ pointerEvents: "none" }}
                        >
                          {user.first_name ? ` Hi, ${user.first_name} !` : "Hi"}
                        </a>
                        <a
                          className="nav-link cursor-pointer text-decoration-none pb-0"
                          href={`/user/profile`}
                        >
                          My Profile
                        </a>
                        <a
                          className="nav-link cursor-pointer text-decoration-none pb-0"
                          href={`/user/profile?tab=all&tab_group=orders`}
                        >
                          My Orders
                        </a>
                        <a
                          className="nav-link cursor-pointer text-decoration-none pb-0"
                          href={`/user/profile?tab=fabrics_wishlist&tab_group=wishlist`}
                        >
                          My Wishlist
                        </a>
                        {userDetails?.is_designer == 1 ? (
                          <a
                            className="nav-link cursor-pointer text-decoration-none pb-0"
                            href={`/user/profile?tab=designs&tab_group=designs`}
                          >
                            My Designs
                          </a>
                        ) : null}
                        {is_seller ? (
                          <a
                            className="nav-link cursor-pointer text-decoration-none pb-0"
                            href={`/user/profile?tab=fabrics&tab_group=fabrics`}
                          >
                            My Fabrics
                          </a>
                        ) : null}
                        <a
                          className="nav-link cursor-pointer text-decoration-none pb-0"
                          href={`/user/profile?tab=upcoming&tab_group=appointments`}
                        >
                          My Appointments
                        </a>
                        <a
                          className="nav-link cursor-pointer text-decoration-none border-bottom pb-3 mb-2"
                          href={`/user/profile?tab=messages&tab_group=messages`}
                        >
                          My Messages
                        </a>
                        <a
                          className="nav-link cursor-pointer text-decoration-none"
                          onClick={logOut}
                        >
                          Sign Out
                        </a>
                      </div>
                    </div>

                    {userRole == "Admin" && (
                      <a href={`/admin/users`}>
                        <div className="nav-link header-tooltip cursor-pointer">
                          <span className="icon-tooltiptext fs-14">
                            Administration
                          </span>
                          <LiaUserTieSolid size={28} />
                        </div>
                      </a>
                    )}

                    {userRole !== "Admin" && (
                      <a href={`/favorites`}>
                        <div className="nav-link header-tooltip">
                          <span
                            className="icon-tooltiptext fs-14"
                            style={{ width: "135px", left: "28%" }}
                          >
                            Favorite Designs
                          </span>
                          {/* <IoBookmarkOutline size={26} /> */}
                          <img
                            src={FavoritesIcon}
                            className="navigation-icon"
                            alt="Favorites"
                          />
                          <div>
                            <div className="cart-added position-absolute badge-purple text-white">
                              <span className="cart-count">
                                {favoritesCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    )}

                    {userRole !== "Admin" && (
                      <a href={`/cart/`}>
                        <div className="nav-link header-tooltip">
                          <span className="icon-tooltiptext fs-14">Cart</span>
                          {/* <IoCartOutline size={26} /> */}
                          <img
                            src={CartIcon}
                            className="navigation-icon"
                            alt="Cart"
                          />
                          <div>
                            <div className="cart-added position-absolute badge-purple text-white">
                              <span className="cart-count">
                                {cartItemCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    )}

                    <div
                      className="user-dropdown nav-link cursor-pointer d-block position-relative"
                      ref={bellRef}
                      onClick={toggleBellMenu}
                    >
                      <div className="nav-link header-tooltip">
                        <span className="icon-tooltiptext fs-14">
                          Notifications
                        </span>
                        {/* <VscBell size={25} /> */}
                        <img
                          src={BellIcon}
                          className="navigation-icon"
                          alt="Notifications"
                        />
                      </div>
                      {userBellOpen && (
                        <div
                          className="action-box-bell scroll-bar user-menu-bell"
                          id="style-2"
                        >
                          {notifications?.length > 0 ? (
                            <>
                              {notifications.map((notification, index) => {
                                const options = {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "numeric",
                                };

                                const today = new Date(
                                  notification.created_at
                                ).toLocaleDateString("en-ES", options);
                                return (
                                  <>
                                    <Row key={index} className="mb-2">
                                      <Col lg={2}>
                                        <img
                                          src={NewAppointment}
                                          className="new-appointment-image"
                                          alt="New Appointment"
                                        />
                                      </Col>

                                      <Col lg={10} className="pb-2">
                                        <div className="body-text-bell">
                                          <div className="fs-16 fw-600 text-black">
                                            {notification.subject}
                                          </div>
                                          <span className="fs-14 text-black">
                                            {notification.message}
                                          </span>
                                          <div className="hours-bell fs-14 mt-1">
                                            {today}
                                          </div>
                                        </div>
                                      </Col>
                                    </Row>
                                    <hr className="mt-0 mb-3" />
                                  </>
                                );
                              })}
                            </>
                          ) : (
                            <>
                              <Card>
                                <Card.Body className="text-center">
                                  No notifications were found.
                                </Card.Body>
                              </Card>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    {user?.shop?.is_complete ? (
                      <>
                        {(is_seller || is_designer) && (
                          <>
                            <a
                              href={`${
                                is_designer == 1
                                  ? "/user/center/calendar"
                                  : "/user/center/products"
                              }`}
                            >
                              <button type="button" className="btn-shop btn">
                                <BsShopWindow size={23} />{" "}
                                <span className="ms-2">Shop Manager</span>
                              </button>
                            </a>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {(is_seller || is_designer) && (
                          <>
                            <Link to={`/user/shop/setup`}>
                              <button type="button" className="btn-shop btn">
                                <BsShopWindow size={23} />{" "}
                                <span className="ms-2">Set up Shop</span>
                              </button>
                            </Link>
                          </>
                        )}
                      </>
                    )}
                    <div
                      className="user-dropdown nav-link position-relative d-none"
                      ref={userRef}
                    >
                      {userImage ? (
                        <div
                          className="header-user-photo cursor-pointer"
                          onClick={toggleUserMenu}
                          style={{
                            backgroundImage:
                              "url(" +
                              import.meta.env.VITE_REACT_APP_STORAGE_URL +
                              "user/" +
                              userImage +
                              ")",
                          }}
                        ></div>
                      ) : (
                        <div
                          className="header-user-photo cursor-pointer"
                          onClick={toggleUserMenu}
                          style={{
                            backgroundImage: "url(" + UserPlaceholder + ")",
                          }}
                        ></div>
                      )}
                      {userMenuOpen && (
                        <div
                          className={
                            user.profile_completeness >= 0 &&
                            user.profile_completeness < 100
                              ? "action-box-incomplete-profile user-menu"
                              : "action-box user-menu"
                          }
                        >
                          {/* {userRole !== 'Admin' &&
                            <Link to={`/${userType}/profile`} className="mb-3 text-decoration-none d-block"><IoIosCog className='me-2' color='#000000' />
                              <span className='text-black'>Profile</span>
                            </Link>
                          } */}

                          {userRole !== "Admin" && (
                            <>
                              <Row className="mb-3">
                                <Col lg="3">
                                  <Link
                                    to={`/user/profile`}
                                    className="mb-3 text-decoration-none"
                                  >
                                    {userImage ? (
                                      <div
                                        className="header-user-photo cursor-pointer"
                                        style={{
                                          backgroundImage:
                                            "url(" +
                                            import.meta.env
                                              .VITE_REACT_APP_STORAGE_URL +
                                            "user/" +
                                            userImage +
                                            ")",
                                        }}
                                      ></div>
                                    ) : (
                                      <div
                                        className="header-user-photo cursor-pointer"
                                        style={{
                                          backgroundImage:
                                            "url(" + UserPlaceholder + ")",
                                        }}
                                      ></div>
                                    )}
                                  </Link>
                                </Col>

                                <Col lg="9">
                                  <div className="fw-600">
                                    Hi,&nbsp;{user.first_name}!
                                  </div>
                                  <Link
                                    to={`/user/profile`}
                                    className="mb-3 text-decoration-none"
                                  >
                                    <div>
                                      <BsArrowLeft className="me-1" size={10} />
                                      <span className="fs-12">
                                        See your profile
                                      </span>
                                    </div>
                                  </Link>
                                </Col>
                                <Col lg="12" className="text-center">
                                  {user.profile_completeness >= 0 &&
                                    user.profile_completeness < 100 && (
                                      <Link
                                        to={`/user/complete-profile`}
                                        className="mt-2 text-decoration-none d-block d-contents d-flex"
                                      >
                                        <Button className="">
                                          Complete Your Profile
                                        </Button>
                                      </Link>
                                    )}
                                </Col>
                              </Row>
                            </>
                          )}

                          {userRole !== "Admin" && (
                            <>
                              {userWishlistOpen ? (
                                <Link
                                  to={`#`}
                                  onClick={toggleWishlistMenu}
                                  className="mb-2 text-decoration-none d-block position-relative"
                                >
                                  <GoHeart className="me-2" color="#000000" />
                                  <span className="text-black">Wishlist</span>
                                  <FaCaretUp
                                    style={{
                                      position: "absolute",
                                      right: "0px",
                                      top: "3px",
                                    }}
                                  />
                                </Link>
                              ) : (
                                <Link
                                  to={`#`}
                                  onClick={toggleWishlistMenu}
                                  className="mb-3 text-decoration-none d-block position-relative"
                                >
                                  <GoHeart className="me-2" color="#000000" />
                                  <span className="text-black">Wishlist</span>
                                  <FaCaretDown
                                    style={{
                                      position: "absolute",
                                      right: "0px",
                                      top: "3px",
                                    }}
                                  />
                                </Link>
                              )}

                              {userWishlistOpen && (
                                <div className="user-wishlist-menu mb-2 ms-3">
                                  <Link
                                    to={`/wishlist`}
                                    className="mb-2 text-decoration-none d-block"
                                  >
                                    <IoShirtOutline
                                      className="me-2"
                                      color="#000000"
                                    />
                                    <span className="text-black">Fabrics</span>
                                  </Link>
                                  <Link
                                    to={`/designer/wishlist`}
                                    className="text-decoration-none d-block"
                                  >
                                    <AiOutlineAntDesign
                                      className="me-2"
                                      color="#000000"
                                    />
                                    <span className="text-black">
                                      Designers
                                    </span>
                                  </Link>
                                </div>
                              )}
                            </>
                          )}

                          {userRole !== "Admin" && (
                            <Link
                              to={`/orders`}
                              className="mb-3 text-decoration-none d-block"
                            >
                              <BsCartCheck
                                className="me-2 mb-1"
                                color="#000000"
                              />
                              <span className="text-black">Orders</span>
                            </Link>
                          )}

                          {userRole !== "Admin" && (
                            <Link
                              to={`/appointments/${currentUser}`}
                              className="mb-2 text-decoration-none d-block"
                            >
                              <IoCalendarClearOutline
                                className="me-2 mb-1"
                                color="#000000"
                              />
                              <span className="text-black">Appointments</span>
                            </Link>
                          )}

                          {/* {userRole !== 'Admin' &&
                            <div className='mb-2'>
                              <DropdownButton id="dropdown-survey-button" title={<span><PiNotepadLight className='note-icon ' size={17} />Surveys</span>}>
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

                          <div>
                            <p className="mb-0 cursor-pointer" onClick={logOut}>
                              <IoIosPower className="me-2" color="#000000" />
                              <span className="text-black">Logout</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="nav-link-dropdown border-left-rounded border-red ms-2">
                      <div className="nav-link d-flex cursor-pointer">
                        <IoPersonOutline size={26} />
                      </div>
                      <div className="nav-link-menu">
                        <a className="nav-link pb-0" href={hrefLogin}>
                          Sign In
                        </a>
                        <Link
                          to={`/sign-up`}
                          className={`nav-link cursor-pointer  text-decoration-none
                          ${isLoggedIn ? " border-bottom pb-3 mb-2 " : ""}
                          `}
                        >
                          Register
                        </Link>
                        {isLoggedIn && (
                          <>
                            <a
                              className="nav-link cursor-pointer text-decoration-none pb-0"
                              href="/login"
                            >
                              My Profile
                            </a>
                            <a
                              className="nav-link cursor-pointer text-decoration-none pb-0"
                              href="/login"
                            >
                              My Orders
                            </a>
                            <a
                              className="nav-link cursor-pointer text-decoration-none pb-0"
                              href="/login"
                            >
                              My Wishlist
                            </a>
                            <a
                              className="nav-link cursor-pointer text-decoration-none pb-0"
                              href="/login"
                            >
                              My Designs
                            </a>
                            <a
                              className="nav-link cursor-pointer text-decoration-none pb-0"
                              href="/login"
                            >
                              My Fabrics
                            </a>
                            <a
                              className="nav-link cursor-pointer text-decoration-none pb-0"
                              href="/login"
                            >
                              My Appointments
                            </a>
                            <a
                              className="nav-link cursor-pointer text-decoration-none"
                              href="/login"
                            >
                              My Messages
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                    <a href={`/favorites`}>
                      <div className="nav-link header-tooltip">
                        <span className="icon-tooltiptext fs-14">
                          Favorites
                        </span>
                        <IoBookmarkOutline size={26} />
                        <div>
                          <div className="cart-added position-absolute badge-purple text-white">
                            <span className="cart-count">{favoritesCount}</span>
                          </div>
                        </div>
                      </div>
                    </a>

                    <a href={`/cart`}>
                      <div className="nav-link header-tooltip">
                        <span className="icon-tooltiptext fs-14">Cart</span>
                        <IoCartOutline size={26} />
                        <div>
                          <div className="cart-added position-absolute badge-purple text-white">
                            <span className="cart-count">{cartItemCount}</span>
                          </div>
                        </div>

                        {cartItemCount === 0 && (
                          <div className="cart-dropdown text-center">
                            <IoCartOutline
                              className="my-2"
                              size={54}
                              style={{ opacity: 0.2 }}
                            />
                            <p className="fs-14 mb-3 fw-bolder">
                              Your Cart is Empty, Shop Now!
                            </p>
                            <p className="fs-13">
                              Good to have you back! The items in your cart are
                              saved. Sign in when you&apos;re ready to review or
                              purchase them.
                            </p>
                            <Button
                              href="/login"
                              className="cart-dropdown-btn btn"
                            >
                              Sign In
                            </Button>
                          </div>
                        )}
                      </div>
                    </a>
                    {/* <div className="country-dropdown nav-link position-relative" ref={countryRef}>
                      <div className="nav-link header-tooltip cursor-pointer" onClick={toggleCountryMenu}>
                        <span className="icon-tooltiptext fs-14">Country</span>
                        <GoGlobe size={26} />
                      </div>
                      {userCountryOpen && (
                        <div className="action-box user-menu country-box">
                          <CountryCurrencyLanguageSelector />
                        </div>
                      )}
                    </div> */}
                    {/* <Nav.Link href="/login">Log in</Nav.Link> */}
                    {/* <Nav.Link href={hrefLogin}>Log in</Nav.Link> */}
                    {/* <Nav.Link href="/sign-up"><Button className="btn-primary" variant="primary">Sign Up</Button></Nav.Link> */}
                    {/* <Nav.Link href={href}><Button className="btn-primary" variant="primary">Sign Up</Button></Nav.Link> */}
                  </>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal
        show={underConstructionShow}
        className="modal-preview"
        fade={false}
        centered
        size="sm"
      >
        <Modal.Header className="py-0">
          <h5 className="modal-title text-uppercase text-left"></h5>
          <button
            type="button"
            className="close react-modal-close"
            onClick={() => toggleUnderConstruction("")}
            data-dismiss="modal"
            aria-label="Close"
          >
            <IoCloseOutline color="#7e7e7e" size={25} className="mt-1" />
          </button>
        </Modal.Header>
        <Modal.Body>
          <h4 className="fs-22 rufina-family mb-3">{modalHeading}</h4>
          <Card>
            <Card.Body className="text-center py-5">
              <GoAlertFill size="60px" className="mb-2 text-gold" />
              <p className="fs-20 text-black">Under Construction</p>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>

      {/* Setup Shop  */}
      <Modal
        show={setupShopShow}
        backdrop="static"
        centered
        size="lg"
        fullscreen={false}
        onHide={() => setSetupShopShow(false)}
      >
        {currentUser ? (
          <Modal.Body className="pt-5 pb-4">
            <button
              type="button"
              className="btn-close no-header-close"
              onClick={() => setSetupShopShow(false)}
              aria-label="Close"
            ></button>
            <Container className="narrow-850 h-100">
              <Row className=" align-items-center h-100">
                <Col lg="12">
                  {/* <h3 className="text-center fw-600 mb-5">I am looking for...</h3> */}
                  <h3 className="shop-modal-intro text-center fw-bold mt-5 mb-2">
                    Join as a Designer, Fabric Vendor or both
                  </h3>
                  <p className="modal-subtitle text-center mb-50">
                    To get started, please select one of the options:
                  </p>
                  <Row>
                    <Col lg="4" className="mb-90">
                      {/* onClick={() => showSignupModal('user_designer')} */}
                      <Card
                        onClick={() => navigate("/user/designer-form")}
                        className="shop-modal-card cursor-pointer bg-white"
                      >
                        <Card.Body className="shop-modal-card-body">
                          <img
                            src={DesignerModalIcon}
                            alt="Designers"
                            className="shop-card-icon"
                          />
                          <div className="user-box shop-modal-card-content text-center justify-content-center">
                            <div className="text-start w-100">
                              <p className="mb-0 fs-12">I am a</p>
                              <h3 className="shop-modal-title fs-30 fw-600 lh-35 mt-2">
                                Designer
                              </h3>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg="4" className="mb-90">
                      {/* onClick={() => handleShowFabrics()} */}
                      <Card
                        onClick={() => navigate("/user/seller-form")}
                        className="shop-modal-card cursor-pointer bg-white"
                      >
                        <Card.Body className="shop-modal-card-body">
                          <img
                            src={FabricModalIcon}
                            alt="Fabrics"
                            className="shop-card-icon"
                          />
                          <div className="user-box shop-modal-card-content text-center justify-content-center">
                            <div className="text-start w-100">
                              <p className="mb-0 fs-12">I am a</p>
                              <h3 className="shop-modal-title fs-30 fw-600 lh-35 mt-2">
                                Fabric Vendor
                              </h3>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg="4" className="mb-90">
                      {/* onClick={() => handleShowDesigns()} */}
                      <Card
                        onClick={() =>
                          navigate("/user/designer-form?type=designer_seller")
                        }
                        className="shop-modal-card cursor-pointer bg-white"
                      >
                        <Card.Body className="shop-modal-card-body">
                          <img
                            src={DesignerVendorModalIcon}
                            alt="Designs"
                            className="shop-card-icon"
                          />
                          <div className="user-box shop-modal-card-content text-center justify-content-center">
                            <div className="text-start w-100">
                              <p className="mb-0 fs-12">I am both a</p>
                              <h3 className="shop-modal-title fs-30 fw-600 lh-35 mt-2">
                                Designer & <br /> Fabric Vendor
                              </h3>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        ) : (
          <Modal.Body className="pt-5 pb-4">
            <button
              type="button"
              className="btn-close no-header-close"
              onClick={() => setSetupShopShow(false)}
              aria-label="Close"
            ></button>
            <Container className="narrow-850 h-100">
              <Row className=" align-items-center h-100">
                <Col lg="12">
                  {/* <h3 className="text-center fw-600 mb-5">I am looking for...</h3> */}
                  <h3 className="shop-modal-intro text-center fw-bold mt-5 mb-2">
                    Join as a Designer, Fabric Vendor or both
                  </h3>
                  <p className="modal-subtitle text-center mb-50">
                    To get started, please select one of the options:
                  </p>
                  <Row>
                    <Col lg="4" className="mb-90">
                      {/* onClick={() => showSignupModal('user_designer')} */}
                      <Card
                        onClick={() => {
                          window.location.href = "/sign-up?type=designer";
                        }}
                        className="shop-modal-card cursor-pointer bg-white"
                      >
                        <Card.Body className="shop-modal-card-body">
                          <img
                            src={DesignerModalIcon}
                            alt="Designers"
                            className="shop-card-icon"
                          />
                          <div className="user-box shop-modal-card-content text-center justify-content-center">
                            <div className="text-start w-100">
                              <p className="mb-0 fs-12">I am a</p>
                              <h3 className="shop-modal-title fs-30 fw-600 lh-35 mt-2">
                                Designer
                              </h3>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg="4" className="mb-90">
                      {/* onClick={() => handleShowFabrics()} */}
                      <Card
                        onClick={() => {
                          window.location.href = "/sign-up?type=seller";
                        }}
                        className="shop-modal-card cursor-pointer bg-white"
                      >
                        <Card.Body className="shop-modal-card-body">
                          <img
                            src={FabricModalIcon}
                            alt="Fabrics"
                            className="shop-card-icon"
                          />
                          <div className="user-box shop-modal-card-content text-center justify-content-center">
                            <div className="text-start w-100">
                              <p className="mb-0 fs-12">I am a</p>
                              <h3 className="shop-modal-title fs-30 fw-600 lh-35 mt-2">
                                Fabric Vendor
                              </h3>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg="4" className="mb-90">
                      {/* onClick={() => handleShowDesigns()} */}
                      <Card
                        onClick={() => {
                          window.location.href =
                            "/sign-up?type=designer_seller";
                        }}
                        className="shop-modal-card cursor-pointer bg-white"
                      >
                        <Card.Body className="shop-modal-card-body">
                          <img
                            src={DesignerVendorModalIcon}
                            alt="Designs"
                            className="shop-card-icon"
                          />
                          <div className="user-box shop-modal-card-content text-center justify-content-center">
                            <div className="text-start w-100">
                              <p className="mb-0 fs-12">I am both a</p>
                              <h3 className="shop-modal-title fs-30 fw-600 lh-35 mt-2">
                                Designer & <br /> Fabric Vendor
                              </h3>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        )}
      </Modal>
    </>
  );
};

export default Header;
