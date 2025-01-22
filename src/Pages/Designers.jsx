import React, { useEffect, useState } from "react";
import Layout from "Components/Layout/Layout";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Modal,
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
} from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MalePlaceholder from "Assets/images/placeholders/male-placeholder.jpg";
import FemalePlaceholder from "Assets/images/placeholders/female-placeholder.jpg";
import Countries from "Utils/Countries";
import { IoShirtSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import Pagination from "Components/Pagination/Pagination";
import { GoHeart } from "react-icons/go";
import Signup from "Components/Forms/User/Signup";
import { useCookies } from "react-cookie";
import Loading from "Components/Shared/Loading";
import axios from "axios";
import "react-multi-carousel/lib/styles.css";
import "Assets/styles/Designers/style.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import ShopIcon from "Assets/images/icons/shop.png";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { selectDesignersFilters } from "store/slices/designersSlice";
import { selectDesigners } from "store/slices/designersSlice";
import { useSelector } from "react-redux";
import { useGetDesignersQuery } from "store/api/queries";
import useCountry from "hooks/useCountry";
import SearchInput from "Components/Search/SearchInput";

const Designers = () => {
  const { countries } = useCountry();
  const designFilters = useSelector(selectDesignersFilters);
  const currenStoreUser = useSelector((state) => state.user.user);
  const currentUser = currenStoreUser?.email;
  const designerQueryResult = useSelector(selectDesigners);
  const designers = designerQueryResult.data;
  const navigate = useNavigate();
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  let query = useQuery();
  const headerSearch = query.get("search");

  const [cookies, setCookie, removeCookie] = useCookies([
    "currentUser",
    "token",
    "isLoggedIn",
    "userDetails",
    "userRole",
    "tempDesignerWishlist",
    "selectedCountry",
    "selectedCountryCode",
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [selectedCountry, setSelectedCountry] = useState(
    cookies.selectedCountry ?? ""
  );

  // Search
  const [specializationSearch, setSpecializationSearch] = useState("");
  const [specializationValue, setSpecializationValue] = useState("");

  // Filter Arrays
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAllCategories, setSelectedAllCategories] = useState(false);
  const [colors, setColors] = useState([]);
  const [genders, setGenders] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);

  const [signupModalShow, setSignupModalShow] = useState(false);
  const [activeTabGroup, setActiveTabGroup] = useState("");
  const [signupType, setSignupType] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [reloadCount, setReloadCount] = useState(0);
  const current_user_id = cookies.currentUser;
  const token = cookies.token;
  const [tempDesignerWishlist, setTempDesignerWishlist] = useState([]);

  const selectedCountryIso3 = countries.find(
    (country) => country.name === selectedCountry
  )?.iso3;

  const getDesignersQuery = useGetDesignersQuery({
    page: currentPage,
    per_page: pageSize,
    search: searchValue,
    country: selectedCountryIso3,
    areas_of_specialization: specializationSearch,
    categories: selectedCategories.join(","),
  });
  useEffect(() => {
    console.log("getDesignersQuery", getDesignersQuery);
  }, [getDesignersQuery]);

  useEffect(() => {
    getDesignersQuery.refetch();
  }, [
    currentPage,
    searchValue,
    selectedCountryIso3,
    specializationSearch,
    selectedCategories,
  ]);

  const toggleGetUser = (e) => {
    navigate("/designer-profile?user_id=" + e);
  };

  const handleSearchChange = (value) => {
    console.log("value", value);
    setSearchValue(value);
  };

  const handleChangeSpecialization = (e) => {
    const { value } = e.target;
    setSpecializationValue(value);
    setSpecializationSearch(value);
  };

  const handleChangePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  async function wishlistDesignerUpdate() {
    // Implement wishlist update logic
  }

  const toggleTempDesignerWishlist = (item) => {
    const itemExists = tempDesignerWishlist.some(
      (wishlistItem) => wishlistItem.id === item.id
    );

    let updatedDesignerWishlist;
    if (itemExists) {
      updatedDesignerWishlist = tempDesignerWishlist.filter(
        (wishlistItem) => wishlistItem.id !== item.id
      );
    } else {
      updatedDesignerWishlist = [...tempDesignerWishlist, item];
    }

    setCookie("tempDesignerWishlist", JSON.stringify(updatedDesignerWishlist), {
      path: "/",
    });
    setTempDesignerWishlist(updatedDesignerWishlist);
  };

  async function getPortfolioFilters() {
    axios
      .get(
        import.meta.env.VITE_REACT_APP_API_ENDPOINT +
          "design/filter/type?current_user_id=" +
          current_user_id +
          "&token=" +
          token
      )
      .then((response) => {
        const data = response.data;
        if (data) {
          const filters = data.data;
          setColors(filters.colors ?? []);
          setGenders(filters.genders ?? []);
          setSeasons(filters.seasons ?? []);
          setMaterials(filters.materials ?? []);
          setTags(filters.tags ?? []);
          setCategories(filters.categories ?? []);
        } else {
          toast.error(
            "An error occured. Please try again or contact the administrator."
          );
        }
      })
      .catch((e) => {
        toast.error(
          "An error occured. Please try again or contact the administrator."
        );
      });
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

  const handleSelectCategoryChange = (event) => {
    const categoryId = parseInt(event.target.value, 10);
    if (event.target.checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    }
  };

  const handleSelectAllCategories = (event) => {
    if (event.target.checked) {
      setSelectedCategories(categories.map((category) => category.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const clearFilters = () => {
    setSelectedCountry("");
    setSpecializationSearch("");
    setSpecializationValue("");
    setSelectedCategories([]);
    setSelectedAllCategories(false);
    setSearchValue("");
  };

  useEffect(() => {
    setSelectedCountry(cookies.selectedCountry ?? "");
  }, [cookies]);

  useEffect(() => {
    getPortfolioFilters();
  }, []);

  const handleChangeCountry = (e) => {
    const { value } = e.target;
    setSelectedCountry(value ?? "");
  };

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
                          / Designers
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
                                      <div key={index}>
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
                                      </div>
                                    )
                                  )}
                                </Slider>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg="3" className="text-right">
                            {currentUser ? (
                              <>
                                <Link to="/user/center/portfolio">
                                  <button className="ddf-button fs-12 btn bg-white border-black text-black bg-white-hover border-gold-hover text-black-hover">
                                    <img
                                      src={ShopIcon}
                                      className="ddf-button-icon"
                                      alt="Designers"
                                    />{" "}
                                    Visit Your Shop
                                  </button>
                                </Link>
                              </>
                            ) : (
                              <Link to="/sign-up">
                                <button className="ddf-button fs-12 btn bg-white border-black text-black bg-white-hover border-gold-hover text-black-hover">
                                  <img
                                    src={ShopIcon}
                                    className="ddf-button-icon"
                                    alt="Designers"
                                  />{" "}
                                  Create Your Shop
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
            </Row>
            <div id="profile-designers">
              <Row>
                <Col lg="3" className="filter-sidebar">
                  <div className="pe-4 pt-3">
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-600 fs-14">Search</Form.Label>
                      <SearchInput onSearchChange={handleSearchChange} />
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
                          <option key={country.iso3} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <hr />
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-600 fs-14">
                        Areas of Specialization and Expertise
                      </Form.Label>
                      <Form.Control
                        value={specializationValue}
                        onChange={(e) => handleChangeSpecialization(e)}
                      ></Form.Control>
                    </Form.Group>
                    <hr />
                    <p
                      className="designer-side-dropdown fw-600 fs-14 mb-12 position-relative"
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
                          <AiOutlinePlus
                            size="10px"
                            className="accordion-icon"
                          />
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
                      className={`ms-3 designer-accordion-content ${
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
                    <Button
                      variant="secondary"
                      className="mt-3"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </Col>
                <Col lg="9">
                  <div id="profile-designs" className="ps-2 pt-4">
                    {getDesignersQuery.isFetching ? (
                      <>
                        <Card className="text-center">
                          <Card.Body>
                            <Loading className="bg-white py-0" />
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      <>
                        {designers && designers.length > 0 ? (
                          <>
                            <Row>
                              {designers.map((designer, index) => {
                                const userWishlist = true;
                                return (
                                  <Col key={index} lg={3}>
                                    <div
                                      key={index}
                                      className="mb-4 position-relative designer-box-details"
                                    >
                                      {designer?.avatar_secure_url ? (
                                        <div className="designer-container">
                                          <div
                                            onClick={() =>
                                              toggleGetUser(designer.id)
                                            }
                                            className="designers-grid-div w-100"
                                            style={{
                                              backgroundImage: `url(${designer?.avatar_secure_url})`,
                                            }}
                                          >
                                            <div className="bg-black-faded cursor-pointer designer-overlay"></div>
                                          </div>
                                          <div
                                            className="designer-details-bottom"
                                            onClick={() =>
                                              toggleGetUser(designer.id)
                                            }
                                          >
                                            <h3 className="designer-name cursor-pointer fs-18 mt-13 mb-0 fw-600">
                                              {designer.first_name &&
                                              designer.first_name !== ""
                                                ? designer.first_name
                                                : ""}{" "}
                                              {designer.last_name &&
                                              designer.last_name !== ""
                                                ? designer.last_name
                                                : ""}
                                            </h3>
                                            <p className="mb-0 fs-12 mt-1 cursor-pointer bio-short-designer">
                                              {designer.short_bio
                                                ? designer.short_bio
                                                : ""}
                                            </p>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          <div className="designer-container">
                                            <div
                                              onClick={() =>
                                                toggleGetUser(designer.id)
                                              }
                                              className="designers-grid-div w-100"
                                              style={{
                                                backgroundImage: `url(${
                                                  designer?.gender === "Female"
                                                    ? FemalePlaceholder
                                                    : MalePlaceholder
                                                })`,
                                              }}
                                            >
                                              <div className="bg-black-faded cursor-pointer designer-overlay"></div>
                                            </div>
                                            <div
                                              className="designer-details-bottom"
                                              onClick={() =>
                                                toggleGetUser(designer.id)
                                              }
                                            >
                                              <h3 className="designer-name cursor-pointer fs-18 mt-13 mb-0 fw-600">
                                                {designer.first_name &&
                                                designer.first_name !== ""
                                                  ? designer.first_name
                                                  : "-"}{" "}
                                                {designer.last_name &&
                                                designer.last_name !== ""
                                                  ? designer.last_name
                                                  : "-"}
                                              </h3>
                                              <p className="mb-0 fs-12 mt-1 cursor-pointer bio-short-designer">
                                                {designer.short_bio
                                                  ? designer.short_bio
                                                  : ""}
                                              </p>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                      {designer.email != currentUser ? (
                                        <>
                                          {currentUser ? (
                                            <>
                                              <div className="save-link designer-link">
                                                {userWishlist ? (
                                                  <div className="kouture-tooltip">
                                                    <div
                                                      className="action-button bg-gold"
                                                      onClick={function () {
                                                        wishlistDesignerUpdate();
                                                      }}
                                                    >
                                                      <GoHeart className="text-white" />
                                                    </div>
                                                    <div
                                                      className="kouture-tooltiptext"
                                                      style={{
                                                        width: "190px",
                                                        left: "-22px",
                                                      }}
                                                    >
                                                      Remove from Wishlist
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div className="kouture-tooltip">
                                                    <div
                                                      className="action-button bg-white"
                                                      onClick={function () {
                                                        wishlistDesignerUpdate();
                                                      }}
                                                    >
                                                      <GoHeart className="text-black" />
                                                    </div>
                                                    <div
                                                      className="kouture-tooltiptext"
                                                      style={{
                                                        width: "190px",
                                                        left: "-22px",
                                                      }}
                                                    >
                                                      Add to Wishlist
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </>
                                          ) : (
                                            <div className="save-link designer-link">
                                              {tempDesignerWishlist.some(
                                                (wishlistItem) =>
                                                  wishlistItem.id ===
                                                  designer.id
                                              ) ? (
                                                <div className="kouture-tooltip">
                                                  <div
                                                    className="action-button bg-gold"
                                                    onClick={function () {
                                                      toggleTempDesignerWishlist(
                                                        {
                                                          id: designer.id,
                                                          user_id: currentUser,
                                                          first_name:
                                                            designer.first_name,
                                                          last_name:
                                                            designer.last_name,
                                                          short_bio:
                                                            designer.short_bio,
                                                          image_url:
                                                            designer.avatar_secure_url,
                                                          designer_user_id:
                                                            designer.id,
                                                        }
                                                      );
                                                    }}
                                                  >
                                                    <GoHeart className="text-white" />
                                                  </div>
                                                  <div
                                                    className="kouture-tooltiptext"
                                                    style={{
                                                      width: "190px",
                                                      left: "-22px",
                                                    }}
                                                  >
                                                    Remove from Wishlist
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className="kouture-tooltip">
                                                  <div
                                                    className="action-button bg-white"
                                                    onClick={function () {
                                                      toggleTempDesignerWishlist(
                                                        {
                                                          id: designer.id,
                                                          user_id: currentUser,
                                                          first_name:
                                                            designer.first_name,
                                                          last_name:
                                                            designer.last_name,
                                                          short_bio:
                                                            designer.short_bio,
                                                          image_url:
                                                            designer.avatar_secure_url,
                                                          designer_user_id:
                                                            designer.id,
                                                        }
                                                      );
                                                    }}
                                                  >
                                                    <GoHeart className="text-black" />
                                                  </div>
                                                  <div
                                                    className="kouture-tooltiptext"
                                                    style={{
                                                      width: "190px",
                                                      left: "-22px",
                                                    }}
                                                  >
                                                    Add to Wishlist
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  </Col>
                                );
                              })}
                              {currentUser && currentUser !== "" ? (
                                <Pagination
                                  className="mt-4 mb-0"
                                  currentPage={currentPage}
                                  totalCount={pageCount}
                                  pageSize={pageSize}
                                  onPageChange={(page) =>
                                    handleChangePage(page)
                                  }
                                />
                              ) : (
                                <Col lg={12} className="text-center mt-4">
                                  <Link to="/sign-up?type=customer&option=designers&redirect_to=/designers">
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
                            </Row>
                          </>
                        ) : (
                          <Card className="text-center">
                            <Card.Body>
                              <IoShirtSharp size="50px" className="mt-2" />
                              <p className="text-center fs-14 mb-2 mt-3">
                                No records found.
                              </p>
                            </Card.Body>
                          </Card>
                        )}
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </Container>
        </section>
        {/* Signup */}
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
      </div>
    </Layout>
  );
};

export default Designers;
