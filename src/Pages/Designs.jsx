import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Button, Card, Modal } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Layout from "Components/Layout/Layout";
import PlaceholderImage from "Assets/images/placeholders/image.png";
import { Form, ModalHeader, ModalFooter } from "react-bootstrap";
import { IoShirtSharp } from "react-icons/io5";
import { PiNotepadFill } from "react-icons/pi";
import { GoAlertFill, GoHeart, GoStar } from "react-icons/go";
import UserPlaceholder from "Assets/images/user.png";
import PinIcon from "../Assets/images/pin.png";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import DiamondIcon from "Assets/images/icons/diamond.png";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import useCountry from "hooks/useCountry";

import {
  IoShareSocial,
  IoInformationOutline,
  IoVideocam,
  IoCloseOutline,
} from "react-icons/io5";
import { useCookies } from "react-cookie";
import { ImEmbed2 } from "react-icons/im";
import Signup from "Components/Forms/User/Signup";
import CopyTo from "Utils/CopyLink";
import DressPlaceholder from "Assets/images/placeholder-dress.jpeg";
import Loading from "Components/Shared/Loading";
import "Assets/styles/FabricsHomePage/style.css";
import "Assets/styles/Design/style.css";
import User from "Assets/images/user.png";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { debounce } from "lodash";
import Pagination from "Components/Pagination/Pagination";
import { useGetDesignsQuery } from "store/api/queries";
import { useSelector } from "react-redux";
import { selectDesignFilters } from "store/slices/designersSlice";

const Designs = () => {
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  let query = useQuery();

  // Search
  const [seasonsSearch, setSeasonsSearch] = useState("");
  const [seasonsValue, setSeasonsValue] = useState("");
  const [colorsSearch, setColorsSearch] = useState("");
  const [colorsValue, setColorsValue] = useState("");
  const [materialsSearch, setMaterialsSearch] = useState("");
  const [materialsValue, setMaterialsValue] = useState("");

  let PageSize = 20;

  const [signupModalShow, setSignupModalShow] = useState(false);
  const [signupType, setSignupType] = useState("");


  const designsQuery = useGetDesignsQuery({
    search: "",
    page: 1,
    per_page: 50,
    colors: colorsSearch,
    genders: "",
    materials: "",
    categories: "",
    seasons: seasonsSearch,
    sort_by: "created_at",
    sort_order: "asc",
    country: "",
  });
  const designFilters = useSelector(selectDesignFilters);

  const designs = useSelector((state) => state.designs.designs.data);

  useEffect(() => {
    designsQuery.refetch();
    console.log("here", designs);
  }, []);

  const headerSearch = query.get("search");
  const [cookies, setCookie, removeCookie] = useCookies([
    "currentUser",
    "isLoggedIn",
    "userDetails",
    "userRole",
    "tempFavorites",
    "selectedCountry",
    "favoriteItemCount",
  ]);
  const currentUser = cookies.currentUser;
  const userRole = cookies.userRole;
  const user = cookies.userDetails;

  const [mounted, setMounted] = useState(false);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");

  // Filter Arrays
  const [categories, setCategories] = useState([]);

  const [portfoliosImage, setPortfolioImage] = useState(false);
  const [underConstructionShow, setUnderConstructionShow] = useState(false);
  const [singleDesign, setSingleDesign] = useState("");
  const [designImages, setDesignImages] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [descriptionShow, setDescriptionShow] = useState(false);
  const [shareShowModal, setShareShowModal] = useState(false);
  const [copyEmbedLink, setCopyEmbedLink] = useState(false);

  const [messageShow, setMessageShow] = useState(false);
  const [selectedSortField, setSelectedSortField] = useState(null);
  const [selectedSortOrder, setSelectedSortOrder] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAllCategories, setSelectedAllCategories] = useState(false);
  const [isDesignCurrentUser, setIsDesignCurrentUser] = useState(false);
  const [profileViewShow, setProfileViewShow] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    cookies.selectedCountry ?? ""
  );
  const [activeTabGroup, setActiveTabGroup] = useState("");

  const [modalHeading, setModalHeading] = useState("");
  const [copy, setCopy] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [tempFavorites, setTempFavorites] = useState(
    cookies.tempFavorites ?? []
  );

  let iframeLink = `<iframe src="https://kouture-konect.web.app/view-design/${singleDesign.portfolioId}" height="316" width="404" allowfullscreen lazyload frameborder="0" allow="clipboard-write" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;

  function toggleDescription() {
    setDescriptionShow(true);
  }

  function toggleShareModal() {
    setShareShowModal(true);
  }

  function toggleCopyEmbedLinkModal() {
    setCopyEmbedLink(true);
    setShareShowModal(false);
  }

  function toggleUnderConstruction(message) {
    setUnderConstructionShow(true);
    setModalHeading(message);
  }

  async function onFilterChange(data) {
    return;
  }

  const handleSelectAllCategories = (event) => {
    if (event.target.checked) {
      setSelectedCategories(categories.map((category) => category.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const searchChangeDebounce = debounce((e) => {
    setSearch(e);
  }, 1000); // 1000 milliseconds (2 seconds) delay

  const handleChangeSearch = (e) => {
    const { name, value } = e.target;
    // Clear the previous debounce timer
    searchChangeDebounce.cancel();

    // Set a new debounce timer
    searchChangeDebounce(value);
    setSearchValue(value);
  };

  const seasonChangeDebounce = debounce((e) => {
    setSeasonsSearch(e);
  }, 1000); // 1000 milliseconds (2 seconds) delay

  const handleChangeSeason = (e) => {
    const { name, value } = e.target;
    // Clear the previous debounce timer
    seasonChangeDebounce.cancel();

    // Set a new debounce timer
    seasonChangeDebounce(value);
    setSeasonsValue(value);
  };

  const colorChangeDebounce = debounce((e) => {
    setColorsSearch(e);
  }, 1000); // 1000 milliseconds (2 seconds) delay

  const handleChangeColor = (e) => {
    const { name, value } = e.target;
    // Clear the previous debounce timer
    colorChangeDebounce.cancel();

    // Set a new debounce timer
    colorChangeDebounce(value);
    setColorsValue(value);
  };

  const materialChangeDebounce = debounce((e) => {
    setMaterialsSearch(e);
  }, 1000); // 1000 milliseconds (2 seconds) delay

  const handleChangeMaterial = (e) => {
    const { name, value } = e.target;
    // Clear the previous debounce timer
    materialChangeDebounce.cancel();

    // Set a new debounce timer
    materialChangeDebounce(value);
    setMaterialsValue(value);
  };

  async function favoriteDesignUpdate(e) {
    return;
  }

  const toggleTempFavorite = (item) => {
    // Check if the item ID already exists in the array
    const itemExists = tempFavorites.some((favItem) => favItem.id === item.id);

    let updatedFavorites;
    if (itemExists) {
      // Remove the item from the array
      updatedFavorites = tempFavorites.filter(
        (favItem) => favItem.id !== item.id
      );
    } else {
      // Add the new item to the array
      updatedFavorites = [...tempFavorites, item];
    }

    // Set the updated favorites array in cookies
    setCookie("tempFavorites", JSON.stringify(updatedFavorites), { path: "/" });

    const currentFavoriteCount = cookies.favoriteItemCount ?? 0;
    const latestFavoriteItemCount = parseInt(currentFavoriteCount) + 1;
    setCookie("favoriteItemCount", latestFavoriteItemCount, { path: "/" });

    // Update the local state
    setTempFavorites(updatedFavorites);
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  function togglePortfolioImage(
    portfolioId,
    id,
    first_name,
    last_name,
    media,
    avatar,
    address_line_1,
    city_name,
    state_name,
    country_name,
    tags,
    description,
    userId,
    userWishlist
  ) {
    setPortfolioImage(true);
    setInWishlist(userWishlist);
    setSingleDesign({
      id: id ?? 0,
      userId: userId ?? 0,
      portfolioId: portfolioId ?? 0,
      first_name: first_name ?? "-",
      last_name: last_name ?? "-",
      image: avatar ?? "-",
      address_line_1: address_line_1 ?? "-",
      city: city_name ?? "-",
      province: state_name ?? "-",
      country: country_name ?? "-",
      tags: tags ?? "-",
      description: description ?? "-",
    });

    setDesignImages(media);
    if (media?.[0]?.url) {
      setActiveImage(media[0].url);
    } else {
      setActiveImage(PlaceholderImage);
    }

    if (currentUser === userId) {
      setIsDesignCurrentUser(true);
    } else {
      setIsDesignCurrentUser(false);
    }
  }

  async function toggleAddViewCount(id) {
    return;
  }

  async function getPortfolioFilters() {
    return;
  }

  const handleChangeCategory = (event) => {
    const categoryId = parseInt(event, 10);
    if (!selectedCategories.includes(categoryId)) {
      setSelectedCategories([...selectedCategories, categoryId]);
      if (selectedAllCategories.length + 1 === categories.length) {
        setSelectedAllCategories(true);
      } else {
        setSelectedAllCategories(false);
      }
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    }
  };
  // Handle checkbox change event
  const handleSelectCategoryChange = (event) => {
    const categoryId = parseInt(event.target.value, 10);
    if (event.target.checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
      if (selectedAllCategories.length + 1 === categories.length) {
        setSelectedAllCategories(true);
      } else {
        setSelectedAllCategories(false);
      }
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    }
  };

  const handleSelectGenderChange = (event) => {
    const gender = event.target.value;
    if (event.target.checked) {
      setSelectedGenders([...selectedGenders, gender]);
    } else {
      setSelectedGenders(selectedGenders.filter((g) => g !== gender));
    }
  };

  // Pagination
  const handleChangePage = (pageNumber) => {
    return;
  };
  const { countries } = useCountry();

  const handleChangeCountry = (e) => {
    const { value } = e.target;
    setSelectedCountry(value ?? "");
  };

  useEffect(() => {
    // Only run the filter API call after the component has mounted
    if (mounted) {
      // Call the API with the updated filter values
      onFilterChange({
        sortField: selectedSortField,
        sortOrder: selectedSortOrder,
        search: searchValue || headerSearch || "",
        portfolio_item_category_ids: selectedCategories,
        genders: selectedGenders,
        seasons: seasonsSearch,
        colors: colorsSearch,
        materials: materialsSearch,
      });
    } else {
      // Set the component as mounted
      setMounted(true);
    }
  }, [
    mounted,
    searchValue,
    headerSearch,
    selectedCategories,
    selectedGenders,
    seasonsSearch,
    colorsSearch,
    materialsSearch,
    selectedCountry,
  ]);

  useEffect(() => {
    // Only run the filter API call after the component has mounted
    if (headerSearch) {
      setSearch(headerSearch);
      setSearchValue(headerSearch);
    } else {
      // Set the component as mounted
      setSearch("");
      setSearchValue("");
    }
  }, [headerSearch]);

  const settings = {
    className: "slider variable-width",
    dots: false,
    infinite: false,
    centerMode: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    variableWidth: true,
    nextArrow: (
      <FaChevronRight
        className="category-slider-nav"
        size="6px"
        color="#000000"
      />
    ),
    prevArrow: (
      <FaChevronLeft
        className="category-slider-nav"
        size="6px"
        color="#000000"
      />
    ),
  };

  useEffect(() => {
    // Only run the filter API call after the component has mounted
    setSelectedCountry(cookies.selectedCountry ?? "");
  }, [cookies]);

  useEffect(() => {
    getPortfolioFilters();
  }, []);

  return (
    <Layout>
      <div className="pb-5 pt-10 px-5">
        <section>
          <Container>
            <Row className="mt-2">
              <Col lg="12">
                <div className="ddf-header">
                  <Row>
                    <Col lg="3" className="filter-sidebar">
                      <div className="pe-4">
                        <p className="mb-0 fs-14 fw-500">
                          <Link
                            className="text-decoration-none text-muted"
                            to="/"
                          >
                            Home
                          </Link>{" "}
                          / Designs
                        </p>
                      </div>
                    </Col>
                    <Col lg="9" className="category-slider">
                      <div className="ps-4">
                        <Row>
                          <Col lg="9">
                            <div className="category-pills">
                              {designFilters?.categories &&
                              designFilters?.categories.length > 0 ? (
                                <Slider {...settings}>
                                  {selectedAllCategories ||
                                  selectedCategories.length < 1 ? (
                                    <div className="mx-2 cursor-pointer">
                                      <span className="badge badge-dark bg-dark fs-12 fw-400 text-center">
                                        All
                                      </span>
                                    </div>
                                  ) : (
                                    <div
                                      className="mx-2 cursor-pointer"
                                      onClick={function () {
                                        setSelectedAllCategories(true);
                                        setSelectedCategories([]);
                                      }}
                                    >
                                      <span className="badge badge-dark bg-white fs-12 text-dark fw-400 text-center">
                                        All
                                      </span>
                                    </div>
                                  )}
                                  {designFilters?.categories.map(
                                    (category, index) => (
                                      <>
                                        {selectedCategories.includes(
                                          category.id
                                        ) ? (
                                          <div
                                            className="mx-2 cursor-pointer"
                                            onClick={function () {
                                              handleChangeCategory(category.id);
                                            }}
                                          >
                                            <span className="badge badge-dark bg-dark fs-12 fw-400 text-center">
                                              {category.name}
                                            </span>
                                          </div>
                                        ) : (
                                          <div
                                            className="mx-2 cursor-pointer"
                                            onClick={function () {
                                              handleChangeCategory(category.id);
                                            }}
                                          >
                                            <span className="badge badge-dark bg-white text-dark fs-12 fw-400 text-center">
                                              {category.name}
                                            </span>
                                          </div>
                                        )}
                                      </>
                                    )
                                  )}
                                </Slider>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg="3" className="text-right">
                            {currentUser ? (
                              <>
                                {user.is_designer == 1 ? (
                                  <Link to="/user/profile?tab=designs&tab_group=designs">
                                    <button className="ddf-button fs-12 btn bg-white border-black text-black bg-white-hover border-gold-hover text-black-hover">
                                      <img
                                        src={DiamondIcon}
                                        className="ddf-button-icon"
                                        alt="Designs"
                                      />{" "}
                                      Display Your Creations
                                    </button>
                                  </Link>
                                ) : (
                                  <Link to="/user/designer-form">
                                    <button className="ddf-button fs-12 btn bg-white border-black text-black bg-white-hover border-gold-hover text-black-hover">
                                      <img
                                        src={DiamondIcon}
                                        className="ddf-button-icon"
                                        alt="Designs"
                                      />{" "}
                                      Display Your Creations
                                    </button>
                                  </Link>
                                )}
                              </>
                            ) : (
                              <Link to="/sign-up?type=designer">
                                <button className="ddf-button fs-12 btn bg-white border-black text-black bg-white-hover border-gold-hover text-black-hover">
                                  <img
                                    src={DiamondIcon}
                                    className="ddf-button-icon"
                                    alt="Designs"
                                  />{" "}
                                  Display Your Creations
                                </button>
                              </Link>
                            )}
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col lg="3" className="filter-sidebar">
                <div className="pe-4 pt-3">
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-600 fs-14">Search</Form.Label>
                    <Form.Control
                      placeholder="Enter your search term..."
                      value={searchValue}
                      type="text"
                      onChange={(e) => handleChangeSearch(e)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-600 fs-14">Country</Form.Label>
                    <Form.Control
                      as="select"
                      name="country"
                      value={selectedCountry}
                      className="mr-sm-2"
                      onChange={handleChangeCountry}
                    >
                      <option value="">Select Country</option>
                      {countries.map((country, index) => (
                        <option
                          key={country + "-" + index}
                          value={country.name}
                        >
                          {country.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <hr />
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-600 fs-14">Gender</Form.Label>
                    <Form.Check
                      type="checkbox"
                      label="Male"
                      value="Male"
                      checked={selectedGenders.includes("Male")}
                      onChange={handleSelectGenderChange}
                      className="mb-2 fs-12"
                    />
                    <Form.Check
                      type="checkbox"
                      label="Female"
                      value="Female"
                      checked={selectedGenders.includes("Female")}
                      onChange={handleSelectGenderChange}
                      className="mb-2 fs-12"
                    />
                    <Form.Check
                      type="checkbox"
                      label="Other"
                      value="Other"
                      checked={selectedGenders.includes("Other")}
                      onChange={handleSelectGenderChange}
                      className="mb-2 fs-12"
                    />
                  </Form.Group>
                  <hr />
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-600 fs-14">Season</Form.Label>
                    <Form.Control
                      value={seasonsValue}
                      onChange={(e) => handleChangeSeason(e)}
                    ></Form.Control>
                  </Form.Group>
                  <hr />
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-600 fs-14">Color</Form.Label>
                    <Form.Control
                      value={colorsValue}
                      onChange={(e) => handleChangeColor(e)}
                    ></Form.Control>
                  </Form.Group>
                  <hr />
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-600 fs-14">Material</Form.Label>
                    <Form.Control
                      value={materialsValue}
                      onChange={(e) => handleChangeMaterial(e)}
                    ></Form.Control>
                  </Form.Group>
                  <hr />
                  <p
                    className="design-side-dropdown fw-600 fs-14 mb-12 position-relative"
                    onClick={function () {
                      setActiveTabGroup((prevActiveGroup) =>
                        prevActiveGroup == "categories"
                          ? ""
                          : activeTabGroup != "categories"
                          ? "categories"
                          : ""
                      );
                    }}
                  >
                    Categories
                    {activeTabGroup != "categories" ? (
                      <>
                        <AiOutlinePlus size="10px" className="accordion-icon" />
                      </>
                    ) : (
                      <>
                        <AiOutlineMinus
                          size="10px"
                          className="accordion-icon"
                        />
                      </>
                    )}
                  </p>
                  <div
                    className={`ms-3 design-accordion-content ${
                      activeTabGroup == "categories" ? "open" : ""
                    }`}
                  >
                    {designFilters?.categories &&
                    designFilters?.categories.length > 0 ? (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Group key="all">
                            <Form.Check
                              className="cursor-pointer fs-12"
                              type="checkbox"
                              label="All"
                              name="categories"
                              checked={
                                selectedCategories.length ===
                                  categories.length ||
                                selectedCategories.length === 0
                              }
                              onChange={handleSelectAllCategories}
                            />
                          </Form.Group>
                          {designFilters?.categories &&
                          designFilters?.categories.length > 0 ? (
                            <>
                              {designFilters?.categories.map(
                                (category, index) => (
                                  <Form.Check
                                    key={index}
                                    type="checkbox"
                                    label={category.name}
                                    value={category.id}
                                    checked={selectedCategories.includes(
                                      category.id
                                    )}
                                    onChange={handleSelectCategoryChange}
                                    className="mb-2 fs-12"
                                  />
                                )
                              )}
                            </>
                          ) : null}
                        </Form.Group>
                      </>
                    ) : null}
                  </div>
                </div>
              </Col>
              <Col lg="9">
                <div id="profile-designs" className="ps-2 pt-4">
                  {designsQuery.isLoading ? (
                    <>
                      <Card className="text-center">
                        <Card.Body>
                          <Loading className="bg-white py-0" />
                        </Card.Body>
                      </Card>
                    </>
                  ) : (
                    <>
                      {designs && designs.length > 0 ? (
                        <>
                          <Row className="designs-row">
                            {designs.map((design, index) => {
                              const designImage =
                                design.media?.[0]?.url || DressPlaceholder;
                              const wishlist_user_ids =
                                design.wishlist_user_ids ?? [];
                              const userWishlist =
                                wishlist_user_ids.includes(currentUser);

                              return (
                                <Col
                                  className="designs-grid mb-4"
                                  xs="12"
                                  md="3"
                                  key={design.id}
                                >
                                  <div className="portfolio-link">
                                    <div
                                      className="designs-grid-div w-100 cursor-pointer"
                                      style={{
                                        backgroundImage: `url(${designImage})`,
                                      }}
                                    >
                                      <div
                                        className="designs-grid-placeholder"
                                        onClick={() => {
                                          togglePortfolioImage(
                                            design.id,
                                            design.user.id,
                                            design.user.first_name,
                                            design.user.last_name,
                                            design.media,
                                            design.user.avatar,
                                            design.user.address.address_line_1,
                                            design.user.address.city_name,
                                            design.user.address.state_name,
                                            design.user.address.country_name,
                                            design.tags,
                                            design.description,
                                            design.user.id,
                                            userWishlist
                                          );
                                          toggleAddViewCount(design.id);
                                        }}
                                      ></div>
                                      {userRole !== "Admin" &&
                                        design.user.id !== currentUser && (
                                          <>
                                            {currentUser ? (
                                              <div className="save-link portfolio-link">
                                                {userWishlist ? (
                                                  <div className="kouture-tooltip">
                                                    <div
                                                      className="action-button bg-gold"
                                                      onClick={() => {
                                                        favoriteDesignUpdate({
                                                          user_id: currentUser,
                                                          portfolio_item_id:
                                                            design.id,
                                                        });
                                                      }}
                                                    >
                                                      <GoStar className="text-white" />
                                                    </div>
                                                    <div
                                                      className="kouture-tooltiptext"
                                                      style={{
                                                        width: "200px",
                                                        left: "-25px",
                                                      }}
                                                    >
                                                      Remove from Favorites
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div className="kouture-tooltip">
                                                    <div
                                                      className="action-button bg-white"
                                                      onClick={() => {
                                                        favoriteDesignUpdate({
                                                          user_id: currentUser,
                                                          portfolio_item_id:
                                                            design.id,
                                                        });
                                                      }}
                                                    >
                                                      <GoStar className="text-black" />
                                                    </div>
                                                    <div
                                                      className="kouture-tooltiptext"
                                                      style={{
                                                        width: "200px",
                                                        left: "-25px",
                                                      }}
                                                    >
                                                      Add to Favorites
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            ) : (
                                              <div className="save-link portfolio-link">
                                                {tempFavorites.some(
                                                  (favItem) =>
                                                    favItem.id === design.id
                                                ) ? (
                                                  <div className="kouture-tooltip">
                                                    <div
                                                      className="action-button bg-gold"
                                                      onClick={() => {
                                                        toggleTempFavorite({
                                                          id: design.id,
                                                          user_id: currentUser,
                                                          name: design.name,
                                                          description:
                                                            design.description,
                                                          image_urls:
                                                            design.media[0],
                                                          designer_user_id:
                                                            design.user.id,
                                                        });
                                                      }}
                                                    >
                                                      <GoStar className="text-white" />
                                                    </div>
                                                    <div
                                                      className="kouture-tooltiptext"
                                                      style={{
                                                        width: "200px",
                                                        left: "-25px",
                                                      }}
                                                    >
                                                      Remove from Favorites
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div className="kouture-tooltip">
                                                    <div
                                                      className="action-button bg-white"
                                                      onClick={() => {
                                                        toggleTempFavorite({
                                                          id: design.id,
                                                          user_id: currentUser,
                                                          name: design.name,
                                                          description:
                                                            design.description,
                                                          image_urls:
                                                            design.media[0],
                                                          designer_user_id:
                                                            design.user.id,
                                                        });
                                                      }}
                                                    >
                                                      <GoStar className="text-black" />
                                                    </div>
                                                    <div
                                                      className="kouture-tooltiptext"
                                                      style={{
                                                        width: "200px",
                                                        left: "-25px",
                                                      }}
                                                    >
                                                      Add to Favorites
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </>
                                        )}
                                    </div>
                                  </div>
                                  <div className="design-details">
                                    <div className="d-flex align-items-center justify-content-between">
                                      <h4
                                        className="text-black fs-18 fw-400 cursor-pointer mb-0 text-ellipsis design-name"
                                        onClick={() => {}}
                                      >
                                        {design.name ?? "-"}
                                      </h4>
                                    </div>
                                  </div>
                                </Col>
                              );
                            })}
                          </Row>
                          {currentUser && currentUser != "" ? (
                            <Pagination
                              className="mt-4 mb-0"
                              currentPage={currentPage}
                              totalCount={pageCount}
                              pageSize={PageSize}
                              onPageChange={(page) => handleChangePage(page)}
                            />
                          ) : (
                            <Col lg={12} className="text-center mt-4">
                              <Link to="/sign-up?type=customer&option=designs&redirect_to=/designs">
                                <Button
                                  type="button"
                                  className="btn-primary"
                                  variant="primary"
                                >
                                  View More
                                </Button>
                              </Link>
                            </Col>
                          )}
                        </>
                      ) : (
                        <>
                          <Card className="text-center">
                            <Card.Body>
                              <IoShirtSharp size="50px" className="mt-2" />
                              <p className="text-center fs-14 mb-2 mt-3">
                                No records found.
                              </p>
                            </Card.Body>
                          </Card>
                        </>
                      )}
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>

      <Modal
        show={portfoliosImage}
        fade={false}
        className="modal-full-width"
        id="bg-transparent-card"
      >
        <ModalHeader className="pt-2 pb-3 bg-transparent-card d-flex align-items-start">
          <a
            href={`/designer-profile?user_id=${singleDesign.userId}`}
            className="text-decoration-none"
          >
            <div className="d-flex justify-content-center align-items-center user-image">
              {singleDesign.image !== "" && singleDesign.image !== "-" ? (
                <div
                  className="user-photo"
                  style={{
                    backgroundImage: `url(${singleDesign.image})`,
                  }}
                ></div>
              ) : (
                <img src={User} className="placeholder-img " />
              )}

              <div className="ms-3">
                <div className="modal-title text-left fs-20 fw-600 text-white">
                  {singleDesign.first_name} {singleDesign.last_name}
                </div>
                <div className="fashion-designer fs-16">Fashion Designer</div>
              </div>
            </div>
          </a>

          <button
            type="button"
            className="close modal-close close-button-image bg-black"
            aria-label="Close"
            onClick={() => setPortfolioImage(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </ModalHeader>

        <Modal.Body className="p-0">
          <Row>
            <Col lg={11} className="image-fabrics">
              <div>
                {designImages && designImages.length > 0 ? (
                  <Carousel
                    swipeable={false}
                    draggable={false}
                    responsive={responsive}
                    ssr={true}
                    autoPlaySpeed={1000}
                  >
                    {designImages.map((image, index) => (
                      <div
                        key={index}
                        className="single-image-slider-fabrics"
                        style={{
                          backgroundImage: `url(${image.url})`,
                        }}
                      ></div>
                    ))}
                  </Carousel>
                ) : (
                  <img
                    src={DressPlaceholder}
                    className="w-100 img-placeholder-height"
                  />
                )}

                <div>
                  <div className="text-white book-consultation-bar w-100 d-flex justify-content-center">
                    <p className="request d-flex justify-content-between mb-5">
                      <a
                        href={`/designer-profile?user_id=${singleDesign.userId}`}
                        className="text-decoration-none"
                      >
                        <div className="d-flex justify-content-center align-items-center user-image">
                          {singleDesign.image !== "" &&
                          singleDesign.image !== "-" ? (
                            <div
                              className="user-photo"
                              style={{
                                backgroundImage: `url(${singleDesign.image})`,
                              }}
                            ></div>
                          ) : (
                            <img src={User} className="placeholder-img " />
                          )}
                          <div className="ms-3">
                            <div className="modal-title text-left fs-20 fw-600 text-white">
                              {singleDesign.first_name} {singleDesign.last_name}
                            </div>
                            <div className="fashion-designer fs-16">
                              Fashion Designer
                            </div>
                          </div>
                        </div>
                      </a>

                      {isDesignCurrentUser || !currentUser ? null : (
                        <div className="btn-book-bar">
                          <a
                            href={`/designer/${singleDesign.id}/appointment/schedule/0`}
                          >
                            <button className="btn btn-book-consultation">
                              Book a Consultation
                            </button>
                          </a>
                        </div>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={1}>
              {profileViewShow && (
                <Card className="table_content file-action mt-3 me-0 card-profile-designer">
                  <Card.Header className="card-hr bg-white">
                    <button
                      type="button"
                      className="close react-modal-close"
                      onClick={() => setProfileViewShow(false)}
                    >
                      <IoCloseOutline color="#7e7e7e" size={25} />
                    </button>
                  </Card.Header>
                  <Card.Body className="action_container font-weight">
                    <Row>
                      <Col>
                        <div className="user-image-modal text-center">
                          {singleDesign.image !== "" &&
                          singleDesign.image !== "-" ? (
                            <div
                              className="user-photo-modal mb-2 "
                              style={{
                                backgroundImage: `url(${singleDesign.image})`,
                              }}
                            ></div>
                          ) : (
                            <img
                              src={User}
                              className="placeholder-img-side mb-2"
                            />
                          )}
                        </div>
                        <div className="modal-title text-center fs-18 fw-600 text-black">
                          {singleDesign.first_name} {singleDesign.last_name}
                        </div>
                        <div className="fs-14 text-center mt-2">
                          <img
                            src={PinIcon}
                            alt="location pin"
                            className="me-2"
                          />
                          {singleDesign.province
                            ? singleDesign.province + ","
                            : singleDesign.city
                            ? singleDesign.city + ","
                            : ""}{" "}
                          {singleDesign.country}
                        </div>

                        {isDesignCurrentUser || !currentUser ? null : (
                          <>
                            <hr />
                            <div className="text-center">
                              <a
                                href={`/designer/${singleDesign.id}/appointment/schedule/0`}
                                className="book-consultation btn-book btn w-100"
                              >
                                <IoVideocam className="me-2" color="#ffffff" />
                                Book a Consultation
                              </a>
                            </div>
                          </>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}

              <div>
                <div
                  className="user-image-side thumbnail-table text-center cursor-pointer"
                  onClick={() => setProfileViewShow(true)}
                >
                  {singleDesign.image !== "" && singleDesign.image !== "-" ? (
                    <div
                      className="user-photo-side mb-4 "
                      style={{
                        backgroundImage: `url(${singleDesign.image})`,
                      }}
                    ></div>
                  ) : (
                    <img src={User} className="placeholder-img-side mb-4" />
                  )}
                </div>
              </div>

              {isDesignCurrentUser || !currentUser ? null : (
                <div className="text-center mb-4">
                  <a
                    href={`/designer/${singleDesign.id}/appointment/schedule/0`}
                  >
                    <div className="action-button-designs bg-white">
                      <PiNotepadFill className="text-black mt-2" size={30} />
                    </div>
                  </a>
                  <div className="icon-name-color fs-12 mt-2 fw-600">
                    Consultation
                  </div>
                </div>
              )}

              <div className="text-center mb-4" onClick={toggleShareModal}>
                <div className="action-button-designs bg-white">
                  <IoShareSocial className="text-black mt-2" size={30} />
                </div>
                <div className="icon-name-color fs-12 mb-3 mt-2 fw-600">
                  Share
                </div>
              </div>

              <div className="text-center mb-4" onClick={toggleDescription}>
                <div className="action-button-designs bg-white">
                  <IoInformationOutline className="text-black mt-2" size={30} />
                </div>
                <div className="icon-name-color fs-12 mb-3 mt-2 fw-600">
                  Description
                </div>
              </div>
              {userRole !== "Admin" && !isDesignCurrentUser ? (
                currentUser ? (
                  inWishlist ? (
                    <div
                      className="text-center mb-4"
                      onClick={() => {
                        favoriteDesignUpdate({
                          user_id: currentUser,
                          portfolio_item_id: singleDesign.portfolioId,
                        });
                      }}
                    >
                      <div className="action-button-designs bg-gold">
                        <GoStar className="text-white mt-2" size={30} />
                      </div>
                      <div className="icon-name-color fs-12 mb-3 mt-2 fw-600">
                        Remove from Favorites
                      </div>
                    </div>
                  ) : (
                    <div
                      className="text-center mb-4"
                      onClick={() => {
                        favoriteDesignUpdate({
                          user_id: currentUser,
                          portfolio_item_id: singleDesign.portfolioId,
                        });
                      }}
                    >
                      <div className="action-button-designs bg-white">
                        <GoStar className="text-black mt-2" size={30} />
                      </div>
                      <div className="icon-name-color fs-12 mb-3 mt-2 fw-600">
                        Add to Favorites
                      </div>
                    </div>
                  )
                ) : tempFavorites.some(
                    (favItem) => favItem.id === singleDesign.portfolioId
                  ) ? (
                  <div
                    className="text-center mb-4"
                    onClick={() => {
                      toggleTempFavorite({
                        id: singleDesign.portfolioId,
                        user_id: currentUser,
                        name: singleDesign.name,
                        description: singleDesign.description,
                        image_urls: singleDesign.image[0],
                        designer_user_id: singleDesign.userId,
                      });
                    }}
                  >
                    <div className="action-button-designs bg-gold">
                      <GoStar className="text-white mt-2" size={30} />
                    </div>
                    <div className="icon-name-color fs-12 mb-3 mt-2 fw-600">
                      Remove from Favorites
                    </div>
                  </div>
                ) : (
                  <div
                    className="text-center mb-4"
                    onClick={() => {
                      toggleTempFavorite({
                        id: singleDesign.portfolioId,
                        user_id: currentUser,
                        name: singleDesign.name,
                        description: singleDesign.description,
                        image_urls: singleDesign.image[0],
                        designer_user_id: singleDesign.userId,
                      });
                    }}
                  >
                    <div className="action-button-designs bg-white">
                      <GoStar className="text-black mt-2" size={30} />
                    </div>
                    <div className="icon-name-color fs-12 mb-3 mt-2 fw-600">
                      Add to Favorites
                    </div>
                  </div>
                )
              ) : null}
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      <Modal
        show={messageShow}
        className="modal-preview"
        fade={false}
        size="sm"
        id="under-construction"
      >
        <Modal.Header className="py-0">
          <button
            type="button"
            className="close react-modal-close"
            onClick={() => setMessageShow(false)}
          >
            <IoCloseOutline color="#7e7e7e" size={25} />
          </button>
        </Modal.Header>

        <Modal.Body>
          <Card className="border-none">
            <Card.Body className="text-center py-5 pt-2 pb-2">
              <div className="user-image-message thumbnail-table">
                {singleDesign.image && (
                  <div
                    className="user-photo-message mb-2"
                    style={{
                      backgroundImage: `url(${singleDesign.image})`,
                    }}
                  ></div>
                )}
              </div>
              <div className="modal-title text-center fs-20 fw-600 text-black mb-3">
                {singleDesign.first_name} {singleDesign.last_name}
              </div>
              <textarea
                className="form-control text-height"
                placeholder="Your message"
              ></textarea>
            </Card.Body>
          </Card>
        </Modal.Body>

        <Modal.Footer className="text-right">
          <Button
            className="btn btn-secondary border-black btn-style bg-white text-black me-3"
            onClick={() => setMessageShow(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button
            className="btn btn-primary btn-style"
            type="button"
            onClick={() => {
              toggleUnderConstruction();
              setMessageShow(false);
            }}
          >
            Send Message
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={underConstructionShow}
        className="modal-preview"
        fade={false}
        centered
        size="sm"
        id="under-construction"
      >
        <Modal.Header className="py-0">
          <h5 className="modal-title text-uppercase text-left fs-22 mt-2">
            {modalHeading}
          </h5>
          <button
            type="button"
            className="close react-modal-close"
            onClick={() => setUnderConstructionShow(false)}
          >
            <IoCloseOutline color="#7e7e7e" size={25} />
          </button>
        </Modal.Header>

        <Modal.Body className="pt-2">
          <Card>
            <Card.Body className="text-center py-5">
              <GoAlertFill size="60px" className="mb-2 text-gold" />
              <p className="fs-20 text-black">Under Construction</p>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>

      <Modal show={descriptionShow} fade={false} centered id="description-card">
        <Modal.Header className="py-0">
          <button
            type="button"
            className="close react-modal-close description-close"
            onClick={() => setDescriptionShow(false)}
          >
            <IoCloseOutline color="#7e7e7e" size={25} />
          </button>
        </Modal.Header>

        <Modal.Body className="card-description d-flex align-items-center">
          <p className="text-white fw-400 p-3 fs-14 mb-0">
            {singleDesign.description}
          </p>
        </Modal.Body>
      </Modal>

      <Modal
        show={copyEmbedLink}
        id="modal-preview-embed"
        fade={false}
        centered
        className="embed-modal-view"
      >
        <Modal.Header className="p-3 pb-0">
          <h5 className="mb-0 rufina-family fs-22 text-black">Embed Design</h5>
          <button
            type="button"
            className="close react-modal-close"
            onClick={() => setCopyEmbedLink(false)}
          >
            <IoCloseOutline color="#7e7e7e" size={25} />
          </button>
        </Modal.Header>
        <Modal.Body className="pb-0 pt-4">
          <Row>
            <Col lg="12" className="px-3">
              <textarea className="text-area-embed" readOnly>
                {iframeLink}
              </textarea>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="text-right border-none">
          <button
            className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
            onClick={() => setCopyEmbedLink(false)}
            type="button"
          >
            Cancel
          </button>

          <CopyTo
            text={iframeLink}
            classes="btn btn-primary btn-style"
            standbyTitle="Copy"
            icon={false}
            onCopy={() => setCopy(true)}
            loadingTitle="Embed Copied"
            closeModal={() => setCopyEmbedLink(false)}
          />
        </Modal.Footer>
      </Modal>

      <Modal
        show={shareShowModal}
        className="modal-preview-share"
        fade={false}
        centered
        id="share-modal"
      >
        <Modal.Header className="pb-0">
          <Modal.Title className="rufina-family fs-22 text-black">
            Share Design
          </Modal.Title>
          <button
            type="button"
            className="close react-modal-close"
            onClick={() => setShareShowModal(false)}
          >
            <IoCloseOutline color="#7e7e7e" size={25} className="mt-2" />
          </button>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body className="padding-share-card">
              <div>
                {designImages && designImages.length > 0 ? (
                  <Carousel
                    swipeable={false}
                    draggable={false}
                    responsive={responsive}
                    ssr={true}
                    autoPlaySpeed={1000}
                  >
                    {designImages.map((image, index) => (
                      <div
                        key={index}
                        className="single-image-slider-share mb-4"
                        style={{
                          backgroundImage: `url(${image.url})`,
                        }}
                      ></div>
                    ))}
                  </Carousel>
                ) : null}
                <div>
                  {singleDesign.tags && singleDesign.tags.length > 0
                    ? singleDesign.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="design-tags-view-bar bg-light fs-12 categories-color text-black"
                        >
                          {tag}
                        </span>
                      ))
                    : null}
                </div>
                <div className="d-flex user-image-share image-share-popup">
                  {singleDesign.image !== "" && singleDesign.image !== "-" ? (
                    <div
                      className="user-photo-share mt-1"
                      style={{
                        backgroundImage: `url(${singleDesign.image})`,
                      }}
                    ></div>
                  ) : (
                    <img
                      src={UserPlaceholder}
                      className="placeholder-img-share"
                      alt="User Placeholder"
                    />
                  )}

                  <div className="ms-2">
                    <div className="modal-title text-left fs-16 fw-600 text-white">
                      {singleDesign.first_name} {singleDesign.last_name}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <CopyTo
                  text={`https://kouture-konect.web.app/view-design/${singleDesign.portfolioId}`}
                  classes="btn btn-copy-link border-black bg-white text-black mt-2 w-100"
                  standbyTitle="Copy Link"
                  icon={true}
                  closeModal={() => setShareShowModal(false)}
                />

                <button
                  className="btn btn-copy-link border-black bg-white text-black mt-2 w-100"
                  type="button"
                  onClick={() => {
                    toggleCopyEmbedLinkModal();
                    setShareShowModal(false);
                  }}
                >
                  <ImEmbed2 className="me-2" size={17} />
                  Copy Embed Code
                </button>
              </div>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
      <Modal
        show={signupModalShow}
        fullscreen={false}
        onHide={() => setSignupModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="h-100">
            <Row className="h-100">
              <Col lg="12">
                <Signup type={signupType} />
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default Designs;
