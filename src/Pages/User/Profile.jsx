import Layout from "Components/Layout/Layout";
import { Container, Row, Col, Button, Modal, Card } from "react-bootstrap";
import "Assets/styles/User/Profile/style.css";
import UserPlaceholder from "Assets/images/user.png";
import Loading from "Assets/images/loading.gif";
import { FaLocationDot } from "react-icons/fa6";
import AdminPortfolio from "Components/Shared/Admin/AdminPortfolioGrid";
import AdminFabrics from "Components/Shared/Admin/AdminFabricsGrid";
import LoadingPage from "Components/Shared/LoadingPage";
import { GoPencil } from "react-icons/go";
import { IoStorefrontOutline } from "react-icons/io5";
import MyCalendar from "Components/Shared/MyCalendar";
import BodyMeasurement from "Components/Shared/BodyMeasurement";
import { MdVerified } from "react-icons/md";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import Orders from "Components/Shared/User/Orders";
import FabricsWishlist from "Components/Shared/User/FabricsWishlist";
import DesignersWishlist from "Components/Shared/User/DesignersWishlist";
import UserAppointments from "Components/Shared/User/Appointments";
import DesignerModalIcon from "Assets/images/icons/designer-modal-icon-purple.png";
import FabricModalIcon from "Assets/images/icons/fabric-modal-icon-purple.png";
import DesignerVendorModalIcon from "Assets/images/icons/sewing-modal-icon-purple.png";
import MyProfile from "Components/Profile/MyProfile";
import MyAccount from "Components/Profile/MyAccount";
import useProfile from "hooks/useProfile";

const Profile = () => {
  const {
    user,
    setSetupShopShow,
    designer,
    isImageUpdating,
    userLoading,
    reloadCount,
    portfolioShow,
    fabricShow,
    processShow,
    limitedDesignShow,
    myCalendarShow,
    verificationShow,
    bodyMeasurementShow,
    setupShopShow,
    activeTab,
    activeTabGroup,
    currentUser,
    hiddenFileInputImg,
    navigate,
    toggleverificationIDShow,
    handleClickImg,
    handleChangeImg,
    setActiveTabGroup,
    setActiveTab,
  } = useProfile();
  return (
    <Layout>
      {userLoading ? (
        <LoadingPage />
      ) : (
        <section id="profile" className="py-5 px-5">
          <Container>
            <Row>
              <Col lg="12" className="mb-5">
                <div className="d-flex column-gap-20">
                  <div className="text-left position-relative user-profile-picture">
                    {isImageUpdating ? (
                      <div
                        className="profile-image"
                        style={{
                          backgroundImage: "url(" + Loading + ")",
                          backgroundColor: "#f5f6f8",
                        }}
                      ></div>
                    ) : (
                      <>
                        {user?.avatar ? (
                          <div
                            className="profile-image"
                            style={{
                              backgroundImage:
                                "url(" +
                                import.meta.env.VITE_REACT_APP_STORAGE_URL +
                                "user/" +
                                user?.avatar +
                                ")",
                            }}
                          ></div>
                        ) : (
                          <div
                            className="profile-image"
                            style={{
                              backgroundImage: "url(" + UserPlaceholder + ")",
                            }}
                          ></div>
                        )}
                      </>
                    )}
                    <div className="user-image-edit" onClick={handleClickImg}>
                      <GoPencil />
                    </div>
                    <input
                      type="file"
                      ref={hiddenFileInputImg}
                      onChange={handleChangeImg}
                      style={{ display: "none" }}
                      accept="image/*"
                      required
                    />
                  </div>
                  <div className="w-100">
                    <Row>
                      <Col lg="9">
                        <h2 className="fs-30 mb-1 tw-capitalize">
                          {user?.first_name || user?.last_name ? (
                            <span>
                              {user?.first_name} {user?.last_name}
                            </span>
                          ) : (
                            <span>-</span>
                          )}
                          {user?.email_verified_at ? (
                            <MdVerified color="16f11e" className="ms-2" />
                          ) : null}
                        </h2>
                        <div className="icons-d-flex">
                          <FaLocationDot
                            size="18px"
                            color="#cea835"
                            className="profile-icon"
                          />
                          {user?.address?.address_line_1 ||
                          user?.address?.address_line_2 ||
                          user?.address?.city_name ||
                          user?.address?.country ? (
                            <p className="fs-16 color-light-blue mb-2 lh-25">
                              {user?.address?.address_line_1
                                ? user?.address?.address_line_1 + ","
                                : user?.address?.city_name
                                ? user?.address?.city_name + ","
                                : ""}{" "}
                              {user?.address?.city_name
                                ? user?.address?.city_name + ", "
                                : ""}{" "}
                              {user?.address?.country_name
                                ? user?.address?.country_name
                                : ""}
                            </p>
                          ) : (
                            <p className="fs-16 color-light-blue mb-2">-</p>
                          )}
                        </div>
                      </Col>
                      {!user?.shop?.is_complete && (
                        <Col lg="3" className="text-right">
                          {user?.type == "designer" ||
                          user?.type == "seller" ||
                          user?.type == "designer_and_seller" ? (
                            <Button
                              id="profile-setup-shop"
                              onClick={() => {
                                navigate("/user/shop/setup");
                              }}
                              className="bg-white bg-white-hover text-black-hover border-gold-hover text-black"
                              type="button"
                            >
                              <IoStorefrontOutline size="20px" />
                              <span className="ms-1">Set Up Shop</span>
                            </Button>
                          ) : null}
                        </Col>
                      )}
                    </Row>

                    {user?.profile_completeness?.score < 100 ? (
                      <div className="completion-profile-section">
                        <Row>
                          <Col lg="3">
                            <div>
                              <span className="fs-35 fw-500">
                                {user?.profile_completeness?.score}%
                              </span>
                              <p className="fs-16 lh-22 fw-500 mb-0 profile-completed-p">
                                of your profile is complete
                              </p>
                            </div>
                          </Col>
                          <Col lg="9">
                            <div className="mt-11 mb-11">
                              <label
                                className="progress-bar-value"
                                htmlFor="progress-bar"
                              ></label>
                              <progress
                                id="progress-bar"
                                className="w-50"
                                value={user?.profile_completeness?.score}
                                max="100"
                              ></progress>
                              {user?.profile_completeness?.score < 100 ? (
                                // <p className='fs-16 lh-22 fw-500 mb-0 profile-completed-p'>Your profile completion is at {user.profile_completeness}%</p>
                                <p className="fs-16 lh-22 fw-500 mb-0 profile-completed-p">
                                  To enhance your shopping experience, please
                                  complete your profile.
                                </p>
                              ) : null}
                              <Button
                                href="/user/complete-profile"
                                type="button"
                                className="mt-2"
                              >
                                Complete Profile
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    ) : (
                      <Button
                        href="/user/complete-profile?page=profilePage"
                        type="button"
                        id="profile-edit-profile"
                        className="bg-white bg-white-hover text-black-hover border-gold-hover text-black"
                      >
                        <GoPencil size="20px" />
                        <span className="ms-1">Edit Profile</span>
                      </Button>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <hr />
              <Col lg="2">
                <div>
                  <p
                    className="profile-side-dropdown fw-600 fs-16 mb-12 position-relative"
                    onClick={function () {
                      setActiveTabGroup((prevActiveGroup) =>
                        prevActiveGroup == "account"
                          ? ""
                          : activeTabGroup != "account"
                          ? "account"
                          : ""
                      );
                      setActiveTab("profile");
                    }}
                  >
                    My Account
                    {activeTabGroup != "account" ? (
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
                    className={`ms-3 profile-accordion-content ${
                      activeTabGroup == "account" ? "open" : ""
                    }`}
                  >
                    <p
                      className={`profile-side-dropdown fs-16 mb-12 ${
                        activeTab == "profile" ? "text-gold" : ""
                      } `}
                      onClick={function () {
                        setActiveTab("profile");
                      }}
                    >
                      My Profile
                    </p>
                    <p
                      className={`profile-side-dropdown fs-16 mb-12 ${
                        activeTab == "measurement" ? "text-gold" : ""
                      } `}
                      onClick={function () {
                        setActiveTab("measurement");
                      }}
                    >
                      My Measurements
                    </p>
                    <p
                      className={`profile-side-dropdown fs-16 mb-12 ${
                        activeTab == "account" ? "text-gold" : ""
                      } `}
                      onClick={function () {
                        setActiveTab("account");
                      }}
                    >
                      Manage my Account
                    </p>
                  </div>
                  <p
                    className="profile-side-dropdown fw-600 fs-16 mb-12 position-relative"
                    onClick={function () {
                      setActiveTabGroup((prevActiveGroup) =>
                        prevActiveGroup == "orders"
                          ? ""
                          : activeTabGroup != "orders"
                          ? "orders"
                          : ""
                      );
                      setActiveTab("all");
                    }}
                  >
                    My Orders
                    {activeTabGroup != "orders" ? (
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
                    className={`ms-3 profile-accordion-content ${
                      activeTabGroup == "orders" ? "open" : ""
                    }`}
                  >
                    <p
                      className={`profile-side-dropdown fs-16 mb-12 ${
                        activeTab == "all" ? "text-gold" : ""
                      } `}
                      onClick={function () {
                        setActiveTab("all");
                      }}
                    >
                      All
                    </p>
                    <p
                      className={`profile-side-dropdown fs-16 mb-12 ${
                        activeTab == "pending" ? "text-gold" : ""
                      } `}
                      onClick={function () {
                        setActiveTab("pending");
                      }}
                    >
                      Pending
                    </p>
                    <p
                      className={`profile-side-dropdown fs-16 mb-12 ${
                        activeTab == "processing" ? "text-gold" : ""
                      } `}
                      onClick={function () {
                        setActiveTab("processing");
                      }}
                    >
                      Processing
                    </p>
                    <p
                      className={`profile-side-dropdown fs-16 mb-12 ${
                        activeTab == "shipped" ? "text-gold" : ""
                      } `}
                      onClick={function () {
                        setActiveTab("shipped");
                      }}
                    >
                      Shipped
                    </p>
                    <p
                      className={`profile-side-dropdown fs-16 mb-12 ${
                        activeTab == "delivered" ? "text-gold" : ""
                      } `}
                      onClick={function () {
                        setActiveTab("delivered");
                      }}
                    >
                      Delivered
                    </p>
                    <p
                      className={`profile-side-dropdown fs-16 mb-12 ${
                        activeTab == "completed" ? "text-gold" : ""
                      } `}
                      onClick={function () {
                        setActiveTab("completed");
                      }}
                    >
                      Completed
                    </p>
                  </div>
                  <p
                    className="profile-side-dropdown fw-600 fs-16 mb-12 position-relative"
                    onClick={function () {
                      setActiveTabGroup((prevActiveGroup) =>
                        prevActiveGroup == "wishlist"
                          ? ""
                          : activeTabGroup != "wishlist"
                          ? "wishlist"
                          : ""
                      );
                      setActiveTab("fabrics_wishlist");
                    }}
                  >
                    My Wishlist
                    {activeTabGroup != "wishlist" ? (
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
                    className={`ms-3 profile-accordion-content ${
                      activeTabGroup == "wishlist" ? "open" : ""
                    }`}
                  >
                    <p
                      className={`profile-side-dropdown fs-16 mb-12 ${
                        activeTab == "fabrics_wishlist" ? "text-gold" : ""
                      } `}
                      onClick={function () {
                        setActiveTabGroup("wishlist");
                        setActiveTab("fabrics_wishlist");
                      }}
                    >
                      Fabrics
                    </p>
                    <p
                      className={`profile-side-dropdown fs-16 mb-12 ${
                        activeTab == "designers_wishlist" ? "text-gold" : ""
                      } `}
                      onClick={function () {
                        setActiveTabGroup("wishlist");
                        setActiveTab("designers_wishlist");
                      }}
                    >
                      Designers
                    </p>
                  </div>

                  {/* {(user?.type == "designer" ||
                    user?.type == "designer_and_seller") && (
                    <p
                      className={`profile-side-dropdown fw-600 mb-12 fs-16 ${
                        activeTab == "designs" ? "text-gold" : ""
                      } `}
                      onClick={function () {
                        setActiveTabGroup("designs");
                        setActiveTab("designs");
                      }}
                    >
                      My Designs
                    </p>
                  )}
                  {(user?.type == "seller" ||
                    user?.type == "designer_and_seller") && (
                    <p
                      className={`profile-side-dropdown fw-600 mb-12 fs-16 ${
                        activeTab == "fabrics" ? "text-gold" : ""
                      } `}
                      onClick={function () {
                        setActiveTabGroup("fabrics");
                        setActiveTab("fabrics");
                      }}
                    >
                      My Fabrics
                    </p>
                  )} */}
                  <p
                    className="profile-side-dropdown fw-600 fs-16 mb-12 position-relative"
                    onClick={function () {
                      setActiveTabGroup((prevActiveGroup) =>
                        prevActiveGroup == "appointments"
                          ? ""
                          : activeTabGroup != "appointments"
                          ? "appointments"
                          : ""
                      );
                      setActiveTab("upcoming");
                    }}
                  >
                    My Appointments
                    {activeTabGroup != "appointments" ? (
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
                    className={`ms-3 profile-accordion-content ${
                      activeTabGroup == "appointments" ? "open" : ""
                    }`}
                  >
                    <p
                      className={`profile-side-dropdown fs-16 mb-12 ${
                        activeTab == "upcoming" ? "text-gold" : ""
                      } `}
                      onClick={function () {
                        setActiveTab("upcoming");
                      }}
                    >
                      Upcoming
                    </p>
                    <p
                      className={`profile-side-dropdown fs-16 mb-12 ${
                        activeTab == "in progress" ? "text-gold" : ""
                      } `}
                      onClick={function () {
                        setActiveTab("in progress");
                      }}
                    >
                      In Progress
                    </p>
                    <p
                      className={`profile-side-dropdown fs-16 mb-12 ${
                        activeTab == "cancelled" ? "text-gold" : ""
                      } `}
                      onClick={function () {
                        setActiveTab("cancelled");
                      }}
                    >
                      Cancelled
                    </p>
                    <p
                      className={`profile-side-dropdown fs-16 mb-12 ${
                        activeTab == "completed" ? "text-gold" : ""
                      } `}
                      onClick={function () {
                        setActiveTab("completed");
                      }}
                    >
                      Completed
                    </p>
                  </div>
                  {/* <p
                    className={`profile-side-dropdown fw-600 fs-16 mb-12 ${
                      activeTab == "messages" ? "text-gold" : ""
                    } `}
                    onClick={function () {
                      setActiveTabGroup("messages");
                      setActiveTab("messages");
                    }}
                  >
                    My Messages
                  </p> */}
                </div>
              </Col>
              <Col lg="10" className="pt-4">
                <div className="ps-4">
                  {activeTab == "profile" ? <MyProfile user={user} /> : null}
                  {activeTab == "account" ? <MyAccount /> : null}
                  {activeTab == "measurement" ? (
                    <Row>
                      <Col lg="12">
                        <div className="measurement-container">
                          <BodyMeasurement userData={user} />
                        </div>
                      </Col>
                    </Row>
                  ) : null}
                  {activeTabGroup == "orders" || activeTab == "all" ? (
                    <Row>
                      <Col lg="12">
                        <div className="measurement-container">
                          <Orders
                            orderStatus={activeTab}
                            activeTabGroup={activeTabGroup}
                          />
                        </div>
                      </Col>
                    </Row>
                  ) : null}

                  {activeTabGroup == "wishlist" &&
                  activeTab == "fabrics_wishlist" ? (
                    <Row>
                      <Col lg="12">
                        <div className="fabrics-wishlist-container">
                          <FabricsWishlist />
                        </div>
                      </Col>
                    </Row>
                  ) : null}

                  {activeTabGroup == "wishlist" &&
                  activeTab == "designers_wishlist" ? (
                    <Row>
                      <Col lg="12">
                        <div className="designers-wishlist-container">
                          <DesignersWishlist />
                        </div>
                      </Col>
                    </Row>
                  ) : null}

                  {activeTabGroup == "appointments" ||
                  activeTab == "upcoming" ? (
                    <Row>
                      <Col lg="12">
                        <div className="appointments-container">
                          <UserAppointments status={activeTab} />
                        </div>
                      </Col>
                    </Row>
                  ) : null}

                  {activeTabGroup == "messages" ? (
                    <Row>
                      <Col lg="12">
                        <div className="wishlist-container">
                          <p className="title-designer mb-1 lh-25">Messages </p>
                          <div className="mt-15">
                            <div className="mb-4">
                              <Card className="mt-3 mb-3">
                                <Card.Body>
                                  <p className="mb-0 text-center">
                                    Under Construction
                                  </p>
                                </Card.Body>
                              </Card>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  ) : null}

                  {activeTabGroup == "designs" ? (
                    <Row>
                      <Col lg="12">
                        <div className="designs-container">
                          <p className="title-designer mb-1 lh-25">Designs </p>
                          <div className="mt-15">
                            <AdminPortfolio
                              currentUser={currentUser}
                              reloadCount={reloadCount}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  ) : null}

                  {activeTabGroup == "fabrics" ? (
                    <Row>
                      <Col lg="12">
                        <div className="fabrics-container">
                          <p className="title-designer mb-1 lh-25">Fabrics </p>
                          <div className="mt-15">
                            <AdminFabrics
                              currentUser={currentUser}
                              reloadCount={reloadCount}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  ) : null}
                </div>
              </Col>
            </Row>
            {user?.is_designer == 1 && (
              <>
                {portfolioShow ? (
                  <AdminPortfolio
                    currentUser={currentUser}
                    reloadCount={reloadCount}
                  />
                ) : null}
              </>
            )}

            {user?.is_seller == 1 && (
              <>
                {fabricShow ? (
                  <AdminFabrics
                    currentUser={currentUser}
                    reloadCount={reloadCount}
                  />
                ) : null}
              </>
            )}

            {processShow ? (
              <div id="profile-portfolio">
                <p>Under Construction</p>
              </div>
            ) : null}
            {limitedDesignShow ? (
              <div id="profile-portfolio">
                <p>Under Construction</p>
              </div>
            ) : null}

            {myCalendarShow ? (
              <div id="profile-portfolio">
                <MyCalendar designerId={designer?.id} />
              </div>
            ) : null}

            {verificationShow ? (
              <div id="profile-portfolio">
                <Row>
                  <Col lg="6">
                    <p>
                      Upload a government-issued ID to verify your identity.
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col lg="6">
                    {user?.primary_id_name && user?.primary_id_front_img ? (
                      <>
                        <Card
                          className="bg-lgray mb-4"
                          style={{
                            width:
                              user?.primary_id_name !== "Passport" &&
                              user?.primary_id_name !==
                                "SSS Unified Multi-Purpose ID (UMID)" &&
                              user?.primary_id_name !== "PhilHealth ID" &&
                              user?.primary_id_name !== "Postal ID" &&
                              user?.primary_id_name !== "Voter's ID" &&
                              user?.primary_id_name !==
                                "Professional Regulation (PRC) ID"
                                ? "721px"
                                : "374px",
                          }}
                        >
                          <Card.Body className="pt-3 px-4 pb-4">
                            <p className="title-designer mb-2">
                              {user?.primary_id_name}
                            </p>
                            <img
                              src={user?.primary_id_front_img}
                              alt="Front ID"
                              style={{
                                width: "335px",
                                height: "251px",
                                cursor: "pointer",
                                paddingRight: "11px",
                              }}
                            />
                            {user?.primary_id_back_img && (
                              <>
                                <img
                                  src={user?.primary_id_back_img}
                                  alt="Back ID"
                                  style={{
                                    width: "335px",
                                    height: "251px",
                                    cursor: "pointer",
                                    paddingLeft: "11px",
                                  }}
                                />
                              </>
                            )}
                          </Card.Body>
                        </Card>
                      </>
                    ) : user?.first_secondary_id_name &&
                      user?.second_secondary_id_name &&
                      user?.first_secondary_id_front_img &&
                      user?.second_secondary_id_front_img ? (
                      <>
                        <Card
                          className="bg-lgray mb-4"
                          style={{ width: "374px" }}
                        >
                          <Card.Body className="pt-3 px-4 pb-4">
                            <p className="title-designer mb-2">
                              {user?.first_secondary_id_name}
                            </p>
                            <img
                              src={user?.first_secondary_id_front_img}
                              alt="Front ID"
                              style={{
                                width: "335px",
                                height: "251px",
                                cursor: "pointer",
                                paddingRight: "11px",
                              }}
                            />
                            <br />
                            <p className="title-designer mb-2 mt-3">
                              {user?.second_secondary_id_name}
                            </p>
                            <img
                              src={user?.second_secondary_id_front_img}
                              alt="Front ID"
                              style={{
                                width: "335px",
                                height: "251px",
                                cursor: "pointer",
                                paddingRight: "11px",
                              }}
                            />
                          </Card.Body>
                        </Card>
                      </>
                    ) : null}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col lg="6">
                    {(user?.primary_id_name && user?.primary_id_front_img) ||
                    (user?.first_secondary_id_name &&
                      user?.second_secondary_id_name &&
                      user?.first_secondary_id_front_img &&
                      user?.second_secondary_id_front_img) ? (
                      <Button onClick={toggleverificationIDShow}>
                        <span>Replace Document</span>
                      </Button>
                    ) : (
                      <Button onClick={toggleverificationIDShow}>
                        <span>Upload Document</span>
                      </Button>
                    )}
                  </Col>
                </Row>
              </div>
            ) : null}
            {bodyMeasurementShow ? (
              <div>
                <BodyMeasurement userData={user} />
              </div>
            ) : null}
          </Container>
        </section>
      )}

      {/* Setup Shop  */}
      <Modal
        show={setupShopShow}
        backdrop="static"
        centered
        size="lg"
        fullscreen={false}
        onHide={() => setSetupShopShow(false)}
      >
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
      </Modal>
    </Layout>
  );
};

export default Profile;
