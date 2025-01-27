import { useEffect } from "react";
import Layout from "Components/Layout/Layout";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MalePlaceholder from "Assets/images/placeholders/male-placeholder.jpg";
import FemalePlaceholder from "Assets/images/placeholders/female-placeholder.jpg";
import { IoShirtSharp } from "react-icons/io5";
import Pagination from "Components/Pagination/Pagination";
import { GoHeart } from "react-icons/go";
import Loading from "Components/Shared/Loading";
import "react-multi-carousel/lib/styles.css";
import "Assets/styles/Designers/style.css";
import ShopIcon from "Assets/images/icons/shop.png";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useGetDesignersQuery } from "store/api/queries";

import SearchInput from "Components/Search/SearchInput";
import useDesignersFilters from "hooks/useDesigner";
const Designers = () => {
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

  const {
    setSelectedCategories,
    countries,
    designFilters,
    currentUser,
    designers,
    currentPage,
    pageCount,
    pageSize,
    selectedCountry,
    specializationValue,
    setActiveTabGroup,
    selectedCategories,
    selectedAllCategories,
    categories,
    activeTabGroup,
    tempDesignerWishlist,
    isRefreshing,
    toggleGetUser,
    handleSearchChange,
    handleChangeSpecialization,
    handleChangePage,
    wishlistDesignerUpdate,
    toggleTempDesignerWishlist,
    handleChangeCategory,
    handleSelectCategoryChange,
    handleSelectAllCategories,
    clearFilters,
    handleChangeCountry,
    setSelectedAllCategories,
    setIsRefreshing,
    searchValue,
    selectedCountryIso3,
    specializationSearch,
  } = useDesignersFilters();

  const getDesignersQuery = useGetDesignersQuery({
    page: currentPage,
    per_page: pageSize,
    search: searchValue,
    country: selectedCountryIso3,
    areas_of_specialization: specializationSearch,
    categories: selectedCategories.join(","),
  });
  useEffect(() => {
    if (isRefreshing) {
      getDesignersQuery.refetch().finally(() => {
        setIsRefreshing(false);
      });
    }
  }, [isRefreshing]);

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
                        {countries.map((country) => (
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
                    {getDesignersQuery.isLoading || isRefreshing ? (
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
        {/* <Modal
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
        </Modal> */}
      </div>
    </Layout>
  );
};

export default Designers;
