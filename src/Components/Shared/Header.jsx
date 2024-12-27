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
import { persistor } from 'store';  // 
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
import axios from "axios";
import GetUserWishlistsData from "Utils/GetUserWishlistsData";
import KoutureIcon from "Assets/images/kouture-konect-icon.png";
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

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  let query = useQuery();
  const headerSearch = query.get("search");
  const headerType = query.get("type");

  const [cookies, setCookie, removeCookie] = useCookies([
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
    "over_18",
  ]);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userBellOpen, setUserBellOpen] = useState(false);
  const [userCountryOpen, setUserCountryOpen] = useState(false);
  const [userWishlistOpen, setUserWishlistOpen] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [user, setUser] = useState("");
  const [reloadCount, setReloadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(
    cookies.cartItemCount ?? 0
  );
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [registerModalShow, setRegisterModalShow] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const [userType, setUserType] = useState("user");
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
  const currentUser = cookies.currentUser;
  const current_user_id = cookies.currentUser;
  const token = cookies.token;
  const userDetails = cookies.userDetails;
  const userRole = cookies.userRole;
  const isLoggedIn = cookies.isLoggedIn;
  const tempCart = cookies.tempCart;
  const tempFavorites = cookies.tempFavorites;
  const currencyConversions = cookies.currencyConversions ?? "";
  const selectedCurrency = cookies.selectedCurrency ?? "";

  const getUser = async () => {
    return await axios.get(
      import.meta.env.VITE_REACT_APP_API_ENDPOINT +
        "user/" +
        currentUser +
        "?current_user_id=" +
        current_user_id +
        "&token=" +
        token
    );
  };

 

  const getNotifications = async () => {
    return await axios.get(
      import.meta.env.VITE_REACT_APP_API_ENDPOINT +
        "notification?user_id=" +
        currentUser +
        "?current_user_id=" +
        current_user_id +
        "&token=" +
        token
    );
  };

  const getUserCartItems = async () => {
    return await axios.get(
      import.meta.env.VITE_REACT_APP_API_ENDPOINT +
        "user/" +
        currentUser +
        "/cart?current_user_id=" +
        current_user_id +
        "&token=" +
        token
    );
  };

  const getCurrencyConversions = async (e) => {
    return await axios.get(
      "https://api.fastforex.io/fetch-multi?from=USD&to=AFN,ALL,DZD,USD,EUR,AOA,XCD,ARS,AMD,AWG,AUD,EUR,AZN,BSD,BHD,BDT,BBD,EUR,BZD,XOF,BMD,BTN,BOB,BAM,BWP,BRL,BND,BGN,XOF,BIF,KHR,XAF,CAD,CVE,KYD,XAF,XAF,CLP,CNY,COP,KMF,XAF,HRK,CUP,EUR,CZK,DKK,DJF,XCD,DOP,USD,EGP,USD,XAF,ERN,EUR,SZL,ETB,FJD,EUR,EUR,XAF,GMD,GEL,EUR,GHS,EUR,XCD,GTQ,GNF,XOF,GYD,HTG,HNL,HUF,ISK,INR,IDR,IRR,IQD,EUR,ILS,EUR,XOF,JMD,JPY,JOD,KZT,KES,AUD,KPW,KRW,KWD,KGS,LAK,EUR,LBP,LSL,LRD,LYD,MOP,MGA,MWK,MYR,MVR,MRU,MUR,MXN,MDL,MNT,MAD,MZN,MMK,NAD,AUD,NPR,EUR,XPF,NZD,XOF,NGN,KPW,NOK,OMR,PKR,PAB,PGK,PYG,PEN,PHP,PLN,EUR,QAR,RON,RUB,RWF,XCD,WST,SAR,XOF,RSD,SCR,SLL,SGD,SOS,ZAR,KRW,EUR,LKR,SDG,SRD,SZL,SEK,CHF,SYP,TWD,TJS,TZS,THB,XOF,TOP,TTD,TND,TRY,TMT,UGX,UAH,AED,GBP,USD,UYU,UZS,VUV,VND,YER,ZMW&api_key=9920f5c7b2-af7c7a72bd-slk430"
    );
  };

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
  const removeCookies = () => {
    removeCookie("token", { path: "/" });
    removeCookie("userDetails", { path: "/" });
    removeCookie("currencyConversions", { path: "/" });
    removeCookie("userCurrency", { path: "/" });
    removeCookie("userCurrencyCode", { path: "/" });

    removeCookie("isWelcome", { path: "/" });
    removeCookie("currentUser", { path: "/" });
    removeCookie("currentUserDesigner", { path: "/" });
    removeCookie("currentUserSeller", { path: "/" });
    removeCookie("isLoggedIn", { path: "/" });
    removeCookie("userRole", { path: "/" });
    removeCookie("selectedCartItems", { path: "/" });
    removeCookie("tempCart", { path: "/" });
    removeCookie("tempFavorites", { path: "/" });
    removeCookie("cartItemCount", { path: "/" });
    removeCookie("selectedCountry", { path: "/" });
    removeCookie("selectedCountryCode", { path: "/" });
    removeCookie("selectedLanguage", { path: "/" });
    removeCookie("selectedCurrency", { path: "/" });
    removeCookie("selectedCurrencyCode", { path: "/" });
    removeCookie("cookieCheckoutDesigner", { path: "/" });
    removeCookie("over_18", { path: "/" });
  };

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

  const viewRegisterModal = () => {
    setRegisterModalShow(!registerModalShow);
  };

  const logOut = () => {
    removeCookies();
    localStorage.clear()
    persistor.purge();
    navigate("/login");
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

  const fetchData = async (e) => {
    try {
      const favoritesData = await GetUserWishlistsData(e);
      if (favoritesData) {
        const filteredFavorites = favoritesData.portfolio_item_wishlists.filter(
          (item) => item.portfolio_item.user_id !== currentUser
        );

        setFavorites(filteredFavorites);
        setFavoritesCount(filteredFavorites.length);
      } else {
        toast.error(
          "An error occured. Please try again or contact the administrator."
        );
        setFavoritesCount(0);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error(
        "An error occured. Please try again or contact the administrator."
      );
      setFavoritesCount(0);
    }
  };

  useEffect(() => {
    if (currencyConversions && currencyConversions != "") {
      console.log("something");
    } else {
      getCurrencyConversions()
        .then((response) => {
          const status = response.status;
          if (status == 200) {
            const currencyData = response.data;
            const currencyConversionsData = currencyData.results;
            setCookie(
              "currencyConversions",
              JSON.stringify(currencyConversionsData),
              { maxAge: 3600, path: "/" }
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching currency conversions:", error);
        });
    }
  }, [selectedCurrency, currencyConversions]);

  useEffect(() => {
    if (currentUser) {
      fetchData({ currentUser: currentUser, token: token });

      getUser()
        .then((response) => {
          const selectedUser = response.data.data;
          if (selectedUser) {
            setUser(selectedUser);
          } else {
            toast.error(
              "There has been an error getting the date, please try again!"
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          toast.error(
            "There has been an error getting the date, please try again!"
          );
        });

      getNotifications()
        .then((response) => {
          const selectednotifications = response.data.data;
          if (selectednotifications) {
            setNotifications(selectednotifications);
            setNotificationsLoading(false);
          } else {
            toast.error(
              "There has been an error getting the notifications, please try again!"
            );
            setNotificationsLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
          toast.error(
            "There has been an error getting the notifications, please try again!"
          );
          setNotificationsLoading(false);
        });

      getUserCartItems()
        .then((response) => {
          const selectedCartItems = response.data.data;
          if (selectedCartItems) {
            // const totalQuantity = getTotalQuantity(selectedCartItem);
            const totalQuantity = selectedCartItems.length ?? 0;
            setCartItemCount(totalQuantity);
          } else {
            toast.error(
              "There has been an error getting the notifications, please try again!"
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching cart items:", error);
          toast.error(
            "There has been an error getting the notifications, please try again!"
          );
        });
    } else {
      if (tempCart) {
        // const totalQuantity = getTotalQuantity(tempCart);
        const totalQuantity = tempCart.length ?? 0;
        setCartItemCount(totalQuantity);
      }
      if (tempFavorites) {
        const totalFavoritesCount = tempFavorites.length;
        setFavoritesCount(totalFavoritesCount);
      }
    }
  }, [reloadCount]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentUser) {
        getNotifications()
          .then((response) => {
            const selectednotifications = response.data.data;
            if (selectednotifications) {
              setNotifications(selectednotifications);
              setNotificationsLoading(false);
            } else {
              toast.error(
                "There has been an error getting the notifications, please try again!"
              );
              setNotificationsLoading(false);
            }
          })
          .catch((error) => {
            console.error("Error fetching notifications:", error);
            toast.error(
              "There has been an error getting the notifications, please try again!"
            );
            setNotificationsLoading(false);
          });
      } else {
        if (tempCart) {
          // const totalQuantity = getTotalQuantity(tempCart);
          const totalQuantity = tempCart.length ?? 0;
          setCartItemCount(totalQuantity);
        }
        if (tempFavorites) {
          const totalFavoritesCount = tempFavorites.length;
          setFavoritesCount(totalFavoritesCount);
        }
      }
    }, 60000);

    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (currentUser) {
      getUserCartItems()
        .then((response) => {
          const selectedCartItems = response.data.data;
          if (selectedCartItems) {
            // const totalQuantity = getTotalQuantity(selectedCartItem);
            const totalQuantity = selectedCartItems.length ?? 0;
            setCartItemCount(totalQuantity);
          } else {
            toast.error(
              "There has been an error getting the notifications, please try again!"
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching cart items:", error);
          toast.error(
            "There has been an error getting the notifications, please try again!"
          );
        });

      fetchData({ currentUser: currentUser, token: token });
    } else {
      if (tempCart) {
        // const totalQuantity = getTotalQuantity(tempCart);
        const totalQuantity = tempCart.length ?? 0;
        setCartItemCount(totalQuantity);
      }
      if (tempFavorites) {
        const totalFavoritesCount = tempFavorites.length;
        setFavoritesCount(totalFavoritesCount);
      }
    }
  }, [cookies.cartItemCount, cookies.favoriteItemCount]);

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
                <a
                  className="banner-item px-3"
                  href="javascript:void(0)"
                  onClick={() => setSetupShopShow(!setupShopShow)}
                >
                  Set Up Shop
                </a>
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
                          Hi,&nbsp;{user.first_name}!
                        </a>
                        <a
                          className="nav-link cursor-pointer text-decoration-none pb-0"
                          href={`/${userType}/profile`}
                        >
                          My Profile
                        </a>
                        <a
                          className="nav-link cursor-pointer text-decoration-none pb-0"
                          href={`/${userType}/profile?tab=all&tab_group=orders`}
                        >
                          My Orders
                        </a>
                        <a
                          className="nav-link cursor-pointer text-decoration-none pb-0"
                          href={`/${userType}/profile?tab=fabrics_wishlist&tab_group=wishlist`}
                        >
                          My Wishlist
                        </a>
                        {userDetails?.is_designer == 1 ? (
                          <a
                            className="nav-link cursor-pointer text-decoration-none pb-0"
                            href={`/${userType}/profile?tab=designs&tab_group=designs`}
                          >
                            My Designs
                          </a>
                        ) : null}
                        {userDetails?.is_seller == 1 ? (
                          <a
                            className="nav-link cursor-pointer text-decoration-none pb-0"
                            href={`/${userType}/profile?tab=fabrics&tab_group=fabrics`}
                          >
                            My Fabrics
                          </a>
                        ) : null}
                        <a
                          className="nav-link cursor-pointer text-decoration-none pb-0"
                          href={`/${userType}/profile?tab=upcoming&tab_group=appointments`}
                        >
                          My Appointments
                        </a>
                        <a
                          className="nav-link cursor-pointer text-decoration-none border-bottom pb-3 mb-2"
                          href={`/${userType}/profile?tab=messages&tab_group=messages`}
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
                          {notifications.length > 0 ? (
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
                    {userRole !== "Admin" && (
                      <>
                        {user.shop_completed != 1 ? (
                          <>
                            {(userDetails.is_seller == 1 ||
                              userDetails.is_designer == 1) && (
                              <>
                                <a href={`/user/shop/setup`}>
                                  <button
                                    type="button"
                                    className="btn-shop btn"
                                  >
                                    <BsShopWindow size={23} />{" "}
                                    <span className="ms-2">Shop Manager</span>
                                  </button>
                                  {/* <div className="nav-link header-tooltip cursor-pointer">
                                    <span className="icon-tooltiptext fs-14">Shop Manager</span>
                                    <BsShopWindow size={23} />
                                  </div> */}
                                </a>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {(userDetails.is_seller == 1 ||
                              userDetails.is_designer == 1) && (
                              <>
                                <a
                                  href={`${
                                    userDetails.is_designer == 1
                                      ? "/user/center/calendar"
                                      : "/user/center/products"
                                  }`}
                                >
                                  <button
                                    type="button"
                                    className="btn-shop btn"
                                  >
                                    <BsShopWindow size={23} />{" "}
                                    <span className="ms-2">Shop Manager</span>
                                  </button>
                                  {/* <div className="nav-link header-tooltip cursor-pointer">
                                    <span className="icon-tooltiptext fs-14">Shop Manager</span>
                                    <BsShopWindow size={23} />
                                  </div> */}
                                </a>
                              </>
                            )}
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
                                    to={`/${userType}/profile`}
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
                                    to={`/${userType}/profile`}
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
                        <a
                          className="nav-link cursor-pointer border-bottom pb-3 mb-2 text-decoration-none"
                          onClick={viewRegisterModal}
                        >
                          Register
                        </a>
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
      {currentUser &&
      (!userDetails.email_verified_at ||
        userDetails.email_verified_at == "" ||
        userDetails.email_verified_at == null) ? (
        <div className="verify-email-notification">
          <p className="text-center fw-600 fs-14 mb-0">
            Verify your email to get the most out of Kouture Konect. Didn’t
            receive an email?{" "}
            <a
              href="/email-confirmation"
              className="fw-400 text-decoration-none"
            >
              Resend confirmation
            </a>
          </p>
        </div>
      ) : null}
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

      <Modal
        show={registerModalShow}
        centered
        fullscreen={false}
        onHide={() => setRegisterModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="h-100">
            <Row className="h-100">
              <Col lg="12" className="text-center header-register-modal">
                <img src={KoutureIcon} alt="kouture-icon" width="38px" />
                <h2 className="my-4">Are you over 18 years old?</h2>
                <p className="fs-14">
                  Welcome to Kouture Konect! If you’re under 18, please have a
                  parent or guardian ready to supervise your account as you
                  continue.
                </p>
                <Col lg={12} className="text-center my-4">
                  <a href="/sign-up">
                    <button
                      className="mx-5 px-4 py-2 rounded bg-white border border-secondary border-gold-hover"
                      onClick={() => setCookie("over_18", "No", { path: "/" })}
                    >
                      <strong>No</strong> <br />I am under 18
                    </button>
                  </a>
                  <a href="/sign-up">
                    <button
                      className="mx-5 px-4 py-2 rounded bg-white border border-secondary border-gold-hover"
                      onClick={() => setCookie("over_18", "Yes", { path: "/" })}
                    >
                      <strong>Yes</strong> <br />I am over 18
                    </button>
                  </a>
                  <p className="my-4">
                    Already have an account?{" "}
                    <a href="/login" className="modal-login-btn text-gold ">
                      Login
                    </a>{" "}
                  </p>
                </Col>
              </Col>
            </Row>
          </Container>
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
