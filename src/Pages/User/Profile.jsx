import Layout from "Components/Layout/Layout";
import {
  FormGroup,
  FormControl,
  Container,
  Row,
  Col,
  Button,
  Modal,
  Card,
  Form,
} from "react-bootstrap";
import "Assets/styles/User/Profile/style.css";
import UserPlaceholder from "Assets/images/user.png";
import Loading from "Assets/images/loading.gif";
import { FaLocationDot } from "react-icons/fa6";
import AdminPortfolio from "Components/Shared/Admin/AdminPortfolioGrid";
import AdminFabrics from "Components/Shared/Admin/AdminFabricsGrid";
import LoadingPage from "Components/Shared/LoadingPage";
import { GoPencil } from "react-icons/go";
import { IoStorefrontOutline, IoSaveOutline } from "react-icons/io5";
import MyCalendar from "Components/Shared/MyCalendar";
import BodyMeasurement from "Components/Shared/BodyMeasurement";
import ReactFlagsSelect from "react-flags-select";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa";
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
    userLoading,
    reloadCount,
    portfolioShow,
    fabricShow,
    processShow,
    limitedDesignShow,
    myCalendarShow,
    verificationShow,
    bodyMeasurementShow,
    formStatus,
    setupShopShow,
    activeTab,
    activeTabGroup,
    updatePasswordModalShow,
    updatePasswordFormData,
    selected,
    captureBothPhotoModalShow,
    viewFrontCapture,
    webcamLoaded,
    showCaptureFrontImage,
    verificationIDShow,
    verificationFormData,
    captureFrontPhotoModalShow,
    primaryFrontPhoto,
    primaryBackPhoto,
    firstSecondaryFrontPhoto,
    secondSecondaryFrontPhoto,
    captureBackPhotoModalShow,
    viewBackCapture,
    showCaptureBackImage,
    currentUser,
    secondaryIdOptions,
    webRef,
    isFirstSecondaryPhotoUploaded,
    isSecondSecondaryPhotoUploaded,
    userImage,
    uploadStatus,
    hiddenFileInputImg,
    navigate,
    handleWebcamLoad,
    showImage,
    toggleUpdatePasswordModal,
    toggleCaptureBothPhoto,
    toggleshowCaptureFrontImage,
    selectedCountry,
    captureBothSubmit,
    captureFrontSubmit,
    toggleverificationIDShow,
    setViewFrontCapture,
    toggleCloseverificationIDShow,
    verificationIDSubmit,
    handleChangeFrontID,
    toggleCapturePrimaryFrontPhoto,
    showBackImage,
    toggleCapturePrimaryBackPhoto,
    toggleShowCaptureBackImage,
    captureBackSubmit,
    handleChangeBackID,
    handleClickImg,
    handleChangeVerification,
    toggleSetupShopShow,
    handleChangeImg,
    handleChangePassword,
    updatePasswordSubmit,
    setActiveTabGroup,
    setActiveTab,
    setIDName,
    setViewBackCapture,
    setUpdatePasswordModalShow
    
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
                    {uploadStatus != "standby" ? (
                      <div
                        className="profile-image"
                        style={{
                          backgroundImage: "url(" + Loading + ")",
                          backgroundColor: "#f5f6f8",
                        }}
                      ></div>
                    ) : (
                      <>
                        {userImage ? (
                          <div
                            className="profile-image"
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
                          {user.first_name || user.last_name ? (
                            <span>
                              {user.first_name} {user.last_name}
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
                          {user.address.address_line_1 ||
                          user.address.address_line_2 ||
                          user.address.city_name ||
                          user.address.country ? (
                            <p className="fs-16 color-light-blue mb-2 lh-25">
                              {user.address.address_line_1
                                ? user.address.address_line_1 + ","
                                : user.address.city_name
                                ? user.address.city_name + ","
                                : ""}{" "}
                              {user.address.city_name
                                ? user.address.city_name + ", "
                                : ""}{" "}
                              {user.address.country_name
                                ? user.address.country_name
                                : ""}
                            </p>
                          ) : (
                            <p className="fs-16 color-light-blue mb-2">-</p>
                          )}
                        </div>
                      </Col>
                      <Col lg="3" className="text-right">
                        {user.type == "designer" ||
                        user.type == "seller" ||
                        user.type == "designer_and_seller" ? (
                          <Button
                            id="profile-setup-shop"
                            onClick={toggleSetupShopShow}
                            className="bg-white bg-white-hover text-black-hover border-gold-hover text-black"
                            type="button"
                          >
                            <IoStorefrontOutline size="20px" />
                            <span className="ms-1">Set Up Shop</span>
                          </Button>
                        ) : null}
                      </Col>
                    </Row>

                    {user.profile_completeness.score < 100 ? (
                      <div className="completion-profile-section">
                        <Row>
                          <Col lg="3">
                            <div>
                              <span className="fs-35 fw-500">
                                {user.profile_completeness.score}%
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
                                value={user.profile_completeness.score}
                                max="100"
                              ></progress>
                              {user.profile_completeness.score < 100 ? (
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
                        href="/user/profile/edit"
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

                  {(user.type == "designer" ||
                    user.type == "designer_and_seller") && (
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
                  {(user.type == "seller" ||
                    user.type == "designer_and_seller") && (
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
                  )}
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
                  <p
                    className={`profile-side-dropdown fw-600 fs-16 mb-12 ${
                      activeTab == "messages" ? "text-gold" : ""
                    } `}
                    onClick={function () {
                      setActiveTabGroup("messages");
                      setActiveTab("messages");
                    }}
                  >
                    My Messages
                  </p>
                </div>
              </Col>
              <Col lg="10" className="pt-4">
                <div className="ps-4">
                  {activeTab == "profile" ? <MyProfile user={user} /> : null}
                  {activeTab == "account" ? <MyAccount  /> : null}
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
            {user.is_designer == 1 && (
              <>
                {portfolioShow ? (
                  <AdminPortfolio
                    currentUser={currentUser}
                    reloadCount={reloadCount}
                  />
                ) : null}
              </>
            )}

            {user.is_seller == 1 && (
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
                    {user.primary_id_name && user.primary_id_front_img ? (
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
                              {user.primary_id_name}
                            </p>
                            <img
                              src={user.primary_id_front_img}
                              alt="Front ID"
                              style={{
                                width: "335px",
                                height: "251px",
                                cursor: "pointer",
                                paddingRight: "11px",
                              }}
                            />
                            {user.primary_id_back_img && (
                              <>
                                <img
                                  src={user.primary_id_back_img}
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
                    ) : user.first_secondary_id_name &&
                      user.second_secondary_id_name &&
                      user.first_secondary_id_front_img &&
                      user.second_secondary_id_front_img ? (
                      <>
                        <Card
                          className="bg-lgray mb-4"
                          style={{ width: "374px" }}
                        >
                          <Card.Body className="pt-3 px-4 pb-4">
                            <p className="title-designer mb-2">
                              {user.first_secondary_id_name}
                            </p>
                            <img
                              src={user.first_secondary_id_front_img}
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
                              {user.second_secondary_id_name}
                            </p>
                            <img
                              src={user.second_secondary_id_front_img}
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
                    {(user.primary_id_name && user.primary_id_front_img) ||
                    (user.first_secondary_id_name &&
                      user.second_secondary_id_name &&
                      user.first_secondary_id_front_img &&
                      user.second_secondary_id_front_img) ? (
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

      {/* Update Password */}
      <Modal show={updatePasswordModalShow} size="lg">
        <Modal.Header className="pb-0">
          <h4 className="text-left fs-25 fw-600 px-2">Update Password</h4>
          <button
            type="button"
            className="close react-modal-close"
            onClick={toggleUpdatePasswordModal}
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Form onSubmit={updatePasswordSubmit}>
          <Modal.Body>
            <Card className="border-0">
              <Card.Body>
                <FormGroup className="mb-3">
                  <Form.Label htmlFor="current_password" className="mb-2">
                    Current Pasword <span className="text-danger">*</span>
                  </Form.Label>
                  <FormControl
                    type="password"
                    name="current_password"
                    value={updatePasswordFormData.current_password}
                    onChange={handleChangePassword}
                    id="current_password"
                    required
                  />
                </FormGroup>
                <FormGroup className="mb-3">
                  <Form.Label htmlFor="new_password" className="mb-2">
                    New Password <span className="text-danger">*</span>
                  </Form.Label>
                  <FormControl
                    type="password"
                    name="new_password"
                    value={updatePasswordFormData.new_password}
                    onChange={handleChangePassword}
                    id="new_password"
                    required
                  />
                </FormGroup>
                <FormGroup className="mb-3">
                  <Form.Label htmlFor="new_password" className="mb-2">
                    Confirm New Password <span className="text-danger">*</span>
                  </Form.Label>
                  <FormControl
                    type="password"
                    name="confirm_password"
                    value={updatePasswordFormData.confirm_password}
                    onChange={handleChangePassword}
                    id="confirm_password"
                    required
                  />
                </FormGroup>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer className="border-none pt-0">
            <div className="text-right">
              <button
                className="btn btn-primary border-black bg-white text-black btn-style me-2"
                onClick={() => setUpdatePasswordModalShow(false)}
                type="button"
              >
                Close
              </button>
              {formStatus != "standby" ? (
                <button className="btn btn-primary btn-save" type="button">
                  Saving
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-save"
                  onClick={updatePasswordSubmit}
                  type="submit"
                >
                  Save
                </button>
              )}
            </div>
          </Modal.Footer>
        </Form>
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
      <Modal
        show={captureBothPhotoModalShow}
        size="lg"
        // onHide={toggleCaptureBothPhoto}
      >
        <Modal.Header className="pb-0">
          <button
            type="button"
            className="close react-modal-close"
            onClick={toggleCaptureBothPhoto}
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Card className="bg-lgray">
            <Card.Body className="p-3">
              <Row>
                {showCaptureFrontImage ? (
                  <Col lg="12">
                    <img
                      src={viewFrontCapture}
                      alt="profile"
                      style={{
                        width: "100%",
                        height: "auto",
                        border: "1px solid #ffffff",
                        position: "relative",
                      }}
                    />
                  </Col>
                ) : (
                  <>
                    <Col lg="12" className="webcam-container">
                      <h2 className="text-center fw-600">Front of the ID</h2>
                      <p className="text-center">
                        Ensuring the front side is fully visible
                      </p>
                      <Webcam
                        ref={webRef}
                        onUserMedia={() => handleWebcamLoad()}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <div className="overlay-box"></div>
                    </Col>
                    <Col lg="12">
                      <Row
                        style={{
                          position: "absolute",
                          bottom: "35px",
                          width: "100%",
                        }}
                      >
                        <div
                          className="d-flex justify-content-right align-items-end col-3"
                          style={{ position: "relative" }}
                        >
                          &nbsp;
                        </div>
                        {webcamLoaded && (
                          <div className="d-flex justify-content-center align-items-end col-6">
                            <button
                              className="camera-button"
                              type="button"
                              onClick={() => {
                                showImage();
                                toggleshowCaptureFrontImage();
                              }}
                              style={{ position: "relative", color: "#FFFFFF" }}
                            >
                              <FaCamera
                                size="30px"
                                className="cancel-button me-1 dot-icon"
                              />
                            </button>
                          </div>
                        )}
                        <div className="col-3">&nbsp;</div>
                      </Row>
                    </Col>
                  </>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        {showCaptureFrontImage && (
          <Modal.Footer className="text-right modal-footer-border">
            <Button
              type="button"
              className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
              onClick={() => {
                toggleshowCaptureFrontImage();
                setViewFrontCapture(null);
              }}
            >
              Take Another Photo
            </Button>

            {formStatus !== "standby" ? (
              <Button
                className='className="btn-save'
                type="button"
                style={{ cursor: "not-allowed" }}
              >
                Saving...
              </Button>
            ) : (
              <Button
                className='className="btn-save'
                type="submit"
                onClick={
                  verificationFormData?.primary_id_name !== "Passport" &&
                  verificationFormData?.primary_id_name !==
                    "SSS Unified Multi-Purpose ID (UMID)" &&
                  verificationFormData?.primary_id_name !== "PhilHealth ID" &&
                  verificationFormData?.primary_id_name !== "Postal ID" &&
                  verificationFormData?.primary_id_name !== "Voter's ID" &&
                  verificationFormData?.primary_id_name !==
                    "Professional Regulation (PRC) ID" &&
                  verificationFormData?.first_secondary_id_name !==
                    "Birth Certificate" &&
                  verificationFormData?.first_secondary_id_name !==
                    "Barangay Certificate" &&
                  verificationFormData?.first_secondary_id_name !==
                    "NBI Clearance" &&
                  verificationFormData?.first_secondary_id_name !== "TIN ID" &&
                  verificationFormData?.first_secondary_id_name !==
                    "Government Service Insurance System (GSIS) e-Card" &&
                  verificationFormData?.first_secondary_id_name !==
                    "Seaman's Book" &&
                  verificationFormData?.first_secondary_id_name !==
                    "Company ID" &&
                  verificationFormData?.first_secondary_id_name !==
                    "Cedula or Community Tax Certificate" &&
                  verificationFormData?.first_secondary_id_name !==
                    "Student ID" &&
                  verificationFormData?.first_secondary_id_name !==
                    "Police Clearance" &&
                  verificationFormData?.second_secondary_id_name !==
                    "Birth Certificate" &&
                  verificationFormData?.second_secondary_id_name !==
                    "Barangay Certificate" &&
                  verificationFormData?.second_secondary_id_name !==
                    "NBI Clearance" &&
                  verificationFormData?.second_secondary_id_name !== "TIN ID" &&
                  verificationFormData?.second_secondary_id_name !==
                    "Government Service Insurance System (GSIS) e-Card" &&
                  verificationFormData?.second_secondary_id_name !==
                    "Seaman's Book" &&
                  verificationFormData?.second_secondary_id_name !==
                    "Company ID" &&
                  verificationFormData?.second_secondary_id_name !==
                    "Cedula or Community Tax Certificate" &&
                  verificationFormData?.second_secondary_id_name !==
                    "Student ID" &&
                  verificationFormData?.second_secondary_id_name !==
                    "Police Clearance"
                    ? () => {
                        captureBothSubmit();
                        toggleCapturePrimaryBackPhoto();
                      }
                    : captureBothSubmit
                }
              >
                Save
              </Button>
            )}
          </Modal.Footer>
        )}
      </Modal>

      <Modal
        show={captureFrontPhotoModalShow}
        size="lg"
        // onHide={toggleCapturePrimaryFrontPhoto}
      >
        <Modal.Header className="pb-0">
          <button
            type="button"
            className="close react-modal-close"
            onClick={toggleCapturePrimaryFrontPhoto}
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Card className="bg-lgray">
            <Card.Body className="p-3">
              <Row>
                {showCaptureFrontImage ? (
                  <Col lg="12">
                    <img
                      src={viewFrontCapture}
                      alt="profile"
                      style={{
                        width: "100%",
                        height: "auto",
                        border: "1px solid #ffffff",
                        position: "relative",
                      }}
                    />
                  </Col>
                ) : (
                  <>
                    <Col lg="12" className="webcam-container">
                      <h2 className="text-center fw-600">Front of the ID</h2>
                      <p className="text-center">
                        Ensuring the front side is fully visible
                      </p>
                      <Webcam
                        ref={webRef}
                        onUserMedia={() => handleWebcamLoad()}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <div className="overlay-box"></div>
                    </Col>
                    <Col lg="12">
                      <Row
                        style={{
                          position: "absolute",
                          bottom: "35px",
                          width: "100%",
                        }}
                      >
                        <div
                          className="d-flex justify-content-right align-items-end col-3"
                          style={{ position: "relative" }}
                        >
                          &nbsp;
                        </div>
                        {webcamLoaded && (
                          <div className="d-flex justify-content-center align-items-end col-6">
                            <button
                              className="camera-button"
                              type="button"
                              onClick={() => {
                                showImage();
                                toggleshowCaptureFrontImage();
                              }}
                              style={{ position: "relative", color: "#FFFFFF" }}
                            >
                              <FaCamera
                                size="30px"
                                className="cancel-button me-1 dot-icon"
                              />
                            </button>
                          </div>
                        )}
                        <div className="col-3">&nbsp;</div>
                      </Row>
                    </Col>
                  </>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        {showCaptureFrontImage && (
          <Modal.Footer className="text-right modal-footer-border">
            <Button
              type="button"
              className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
              onClick={() => {
                toggleshowCaptureFrontImage();
                setViewFrontCapture(null);
              }}
            >
              Take Another Photo
            </Button>

            {formStatus !== "standby" ? (
              <Button
                className='className="btn-save'
                type="button"
                style={{ cursor: "not-allowed" }}
              >
                Saving...
              </Button>
            ) : (
              <Button
                className='className="btn-save'
                type="submit"
                onClick={() => {
                  captureFrontSubmit();
                }}
              >
                Save
              </Button>
            )}
          </Modal.Footer>
        )}
      </Modal>

      <Modal
        show={captureBackPhotoModalShow}
        size="lg"
        // onHide={toggleCapturePrimaryBackPhoto}
      >
        <Modal.Header className="pb-0">
          <button
            type="button"
            className="close react-modal-close"
            onClick={toggleCapturePrimaryBackPhoto}
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Card className="bg-lgray">
            <Card.Body className="p-3">
              <Row>
                {showCaptureBackImage ? (
                  <Col lg="12">
                    <img
                      src={viewBackCapture}
                      alt="profile"
                      style={{
                        width: "100%",
                        height: "auto",
                        border: "1px solid #ffffff",
                        position: "relative",
                      }}
                    />
                  </Col>
                ) : (
                  <>
                    <Col lg="12" className="webcam-container">
                      <h2 className="text-center fw-600">Back of the ID</h2>
                      <p className="text-center">
                        Ensuring the back side is fully visible
                      </p>
                      <Webcam
                        ref={webRef}
                        onUserMedia={() => handleWebcamLoad()}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <div className="overlay-box"></div>
                    </Col>
                    <Col lg="12">
                      <Row
                        style={{
                          position: "absolute",
                          bottom: "35px",
                          width: "100%",
                        }}
                      >
                        <div
                          className="d-flex justify-content-right align-items-end col-3"
                          style={{ position: "relative" }}
                        >
                          &nbsp;
                        </div>
                        {webcamLoaded && (
                          <div className="d-flex justify-content-center align-items-end col-6">
                            <button
                              className="camera-button"
                              type="button"
                              onClick={() => {
                                showBackImage();
                                toggleShowCaptureBackImage();
                              }}
                              style={{ position: "relative", color: "#FFFFFF" }}
                            >
                              <FaCamera
                                size="30px"
                                className="cancel-button me-1 dot-icon"
                              />
                            </button>
                          </div>
                        )}
                        <div className="col-3">&nbsp;</div>
                      </Row>
                    </Col>
                  </>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        {showCaptureBackImage && (
          <Modal.Footer className="text-right modal-footer-border">
            <Button
              type="button"
              className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
              onClick={() => {
                toggleShowCaptureBackImage();
                setViewBackCapture(null);
              }}
            >
              Take Another Photo
            </Button>

            {formStatus !== "standby" ? (
              <Button
                className='className="btn-save'
                type="button"
                style={{ cursor: "not-allowed" }}
              >
                Saving...
              </Button>
            ) : (
              <Button
                className='className="btn-save'
                type="submit"
                onClick={() => {
                  captureBackSubmit();
                }}
              >
                Save
              </Button>
            )}
          </Modal.Footer>
        )}
      </Modal>

      <Modal show={verificationIDShow} size="lg">
        <Modal.Header className="pb-0">
          <button
            type="button"
            className="close react-modal-close"
            onClick={toggleCloseverificationIDShow}
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Form onSubmit={verificationIDSubmit}>
          <Modal.Body>
            <h2 className="modal-title fs-25 fw-600 text-center mb-2">
              Identity Verification
            </h2>
            <Card className="bg-lgray">
              <Card.Body className="p-3">
                <Row className="mb-3">
                  <Col lg="12">
                    <Form.Label>Country</Form.Label>
                    <ReactFlagsSelect
                      selected={selected}
                      onSelect={(code) => selectedCountry(code)}
                      placeholder="Select Country"
                      searchable
                      searchPlaceholder="Search countries"
                      className="menu-flags bg-white"
                      required
                    />
                  </Col>
                </Row>
                {selected && (
                  <>
                    <Form.Group>
                      <Form.Label>List of Primary IDs</Form.Label>
                      <Row>
                        <Col>
                          <select
                            className="form-control mb-3 cursor-pointer"
                            name="primary_id_name"
                            defaultValue=""
                            onChange={handleChangeVerification}
                            value={verificationFormData.primary_id_name}
                            required
                          >
                            <option value="">Select Primary IDs</option>

                            <option value="Driver's License">
                              Driver&apos;s License
                            </option>
                            <option value="Passport">Passport</option>
                            {selected === "PH" && (
                              <>
                                <option value="SSS Unified Multi-Purpose ID (UMID)">
                                  SSS Unified Multi-Purpose ID (UMID)
                                </option>
                                <option value="Philippine Identification (PhilID / ePhilID)">
                                  Philippine Identification (PhilID / ePhilID)
                                </option>
                                <option value="PhilHealth ID">
                                  PhilHealth ID
                                </option>
                                <option value="Postal ID">Postal ID</option>
                                <option value="Voter's ID">Voter&lsquo;s ID</option>
                                <option value="Professional Regulation (PRC) ID">
                                  Professional Regulation (PRC) ID
                                </option>
                              </>
                            )}
                            <option value="Other IDs">Other IDs</option>
                          </select>
                        </Col>
                      </Row>
                    </Form.Group>
                  </>
                )}
                {verificationFormData?.primary_id_name && (
                  <>
                    {verificationFormData?.primary_id_name !== "Other IDs" ? (
                      <Form.Group>
                        <Row>
                          <Col lg="12">
                            {primaryFrontPhoto &&
                            !captureBothPhotoModalShow &&
                            !captureBackPhotoModalShow ? (
                              <Card>
                                <Card.Body className="d-flex">
                                  <Col
                                    lg={6}
                                    className="text-center"
                                    style={{ paddingRight: "9px" }}
                                  >
                                    {primaryFrontPhoto &&
                                    !captureBothPhotoModalShow &&
                                    !captureFrontPhotoModalShow &&
                                    !captureBackPhotoModalShow ? (
                                      <>
                                        <img
                                          src={primaryFrontPhoto}
                                          alt="profile"
                                          style={{
                                            width: "335px",
                                            height: "251px",
                                            border: "1px solid #ffffff",
                                            cursor: "pointer",
                                          }}
                                          className="mb-2"
                                        />
                                      </>
                                    ) : null}
                                    <span>Front ID</span>
                                    <br />
                                    <div className="d-flex justify-content-center mt-2">
                                      <Button
                                        className="btn-back me-3 btn btn-primary w-100"
                                        onClick={() => {
                                          toggleCapturePrimaryFrontPhoto();
                                          setIDName("primary");
                                        }}
                                      >
                                        <span>Capture Photo</span>
                                      </Button>
                                      <input
                                        type="file"
                                        onChange={handleChangeFrontID}
                                        style={{ display: "none" }}
                                        accept="image/*"
                                        id="fileFrontID"
                                      />
                                      <Button
                                        className="btn-save btn btn btn-primary w-100"
                                        onClick={() => {
                                          document
                                            .getElementById("fileFrontID")
                                            .click();
                                          setIDName("primary");
                                        }}
                                      >
                                        <span>Upload</span>
                                      </Button>
                                    </div>
                                  </Col>
                                  <Col
                                    lg={6}
                                    className="text-center"
                                    style={{ paddingLeft: "9px" }}
                                  >
                                    {verificationFormData?.primary_id_name !==
                                      "Passport" &&
                                    verificationFormData?.primary_id_name !==
                                      "SSS Unified Multi-Purpose ID (UMID)" &&
                                    verificationFormData?.primary_id_name !==
                                      "PhilHealth ID" &&
                                    verificationFormData?.primary_id_name !==
                                      "Postal ID" &&
                                    verificationFormData?.primary_id_name !==
                                      "Voter's ID" &&
                                    verificationFormData?.primary_id_name !==
                                      "Professional Regulation (PRC) ID" ? (
                                      <>
                                        {primaryBackPhoto &&
                                        !captureBothPhotoModalShow &&
                                        !captureFrontPhotoModalShow &&
                                        !captureBackPhotoModalShow ? (
                                          <>
                                            <img
                                              src={primaryBackPhoto}
                                              alt="profile"
                                              style={{
                                                width: "335px",
                                                height: "251px",
                                                border: "1px solid #ffffff",
                                                cursor: "pointer",
                                              }}
                                              className="mb-2"
                                            />
                                          </>
                                        ) : (
                                          <>
                                            {primaryFrontPhoto &&
                                            !captureBothPhotoModalShow &&
                                            !captureFrontPhotoModalShow &&
                                            !captureBackPhotoModalShow ? (
                                              <div
                                                style={{
                                                  width: "335px",
                                                  height: "251px",
                                                  border: "1px solid #ffffff",
                                                  cursor: "pointer",
                                                }}
                                                className="mb-2"
                                              ></div>
                                            ) : null}
                                          </>
                                        )}
                                        <span>Back ID</span>
                                        <br />
                                        <div className="d-flex justify-content-center mt-2">
                                          <Button
                                            className="btn-back me-3 btn btn-primary w-100"
                                            onClick={() => {
                                              toggleCapturePrimaryBackPhoto();
                                              setIDName("primary");
                                            }}
                                          >
                                            <span>Capture Photo</span>
                                          </Button>
                                          <input
                                            type="file"
                                            onChange={handleChangeBackID}
                                            style={{ display: "none" }}
                                            accept="image/*"
                                            id="fileBackID"
                                          />
                                          <Button
                                            className="btn-save btn btn btn-primary w-100"
                                            onClick={() => {
                                              document
                                                .getElementById("fileBackID")
                                                .click();
                                              setIDName("primary");
                                            }}
                                          >
                                            <span>Upload</span>
                                          </Button>
                                        </div>
                                      </>
                                    ) : null}
                                  </Col>
                                </Card.Body>
                              </Card>
                            ) : (
                              <>
                                <Button
                                  className="btn-back me-3 btn btn-primary"
                                  onClick={() => {
                                    toggleCaptureBothPhoto();
                                    setIDName("primary");
                                  }}
                                >
                                  <span>Capture Photo</span>
                                </Button>
                                <input
                                  type="file"
                                  onChange={handleChangeFrontID}
                                  style={{ display: "none" }}
                                  accept="image/*"
                                  id="fileFrontID"
                                />
                                <Button
                                  className="btn-save btn btn btn-primary"
                                  onClick={() => {
                                    document
                                      .getElementById("fileFrontID")
                                      .click();
                                    setIDName("primary");
                                  }}
                                >
                                  <span>Upload</span>
                                </Button>
                              </>
                            )}
                          </Col>
                        </Row>
                      </Form.Group>
                    ) : (
                      <>
                        <Row>
                          <Col>
                            <Form.Label>List of Secondary IDs</Form.Label>
                            <select
                              className="form-control mb-3 cursor-pointer"
                              waza
                              name="first_secondary_id_name"
                              defaultValue=""
                              onChange={handleChangeVerification}
                              value={
                                verificationFormData.first_secondary_id_name
                              }
                              required
                            >
                              <option value="">Select Secondary IDs</option>
                              {selected === "PH" && (
                                <>
                                  {secondaryIdOptions.map((id) => (
                                    <option
                                      key={id}
                                      value={id}
                                      disabled={
                                        verificationFormData.second_secondary_id_name ===
                                        id
                                      }
                                    >
                                      {id}
                                    </option>
                                  ))}
                                </>
                              )}
                            </select>
                          </Col>
                        </Row>
                        {verificationFormData.first_secondary_id_name && (
                          <>
                            <Form.Group>
                              <Row className="mb-3">
                                <Col lg="12">
                                  {firstSecondaryFrontPhoto &&
                                  !captureBothPhotoModalShow &&
                                  !captureFrontPhotoModalShow &&
                                  !captureBackPhotoModalShow ? (
                                    <Card>
                                      <Card.Body className="d-flex">
                                        <Col
                                          lg={6}
                                          className="text-center"
                                          style={{ paddingRight: "9px" }}
                                        >
                                          {firstSecondaryFrontPhoto ? (
                                            <>
                                              <img
                                                src={firstSecondaryFrontPhoto}
                                                alt="profile"
                                                style={{
                                                  width: "335px",
                                                  height: "251px",
                                                  border: "1px solid #ffffff",
                                                  cursor: "pointer",
                                                }}
                                                className="mb-2"
                                              />
                                            </>
                                          ) : null}
                                          <span>Front ID</span>
                                          <br />
                                          <div className="d-flex justify-content-center mt-2">
                                            <Button
                                              className="btn-back me-3 btn btn-primary w-100"
                                              onClick={() => {
                                                toggleCapturePrimaryFrontPhoto();
                                                setIDName("first_secondary");
                                              }}
                                            >
                                              <span>Capture Photo</span>
                                            </Button>
                                            <input
                                              type="file"
                                              onChange={handleChangeFrontID}
                                              style={{ display: "none" }}
                                              accept="image/*"
                                              id="secondaryFileFrontID"
                                            />
                                            <Button
                                              className="btn-save btn btn btn-primary w-100"
                                              onClick={() => {
                                                document
                                                  .getElementById(
                                                    "secondaryFileFrontID"
                                                  )
                                                  .click();
                                                setIDName("first_secondary");
                                              }}
                                            >
                                              <span>Upload</span>
                                            </Button>
                                          </div>
                                        </Col>
                                        <Col
                                          lg={6}
                                          className="text-center"
                                          style={{ paddingLeft: "9px" }}
                                        >
                                          {/* {firstSecondaryBackPhoto ?
                                                                                        <>
                                                                                            <img
                                                                                                src={firstSecondaryBackPhoto}
                                                                                                alt='profile'
                                                                                                style={{ width: "335px", height: "251px", border: '1px solid #ffffff', cursor: 'pointer' }}
                                                                                                className="mb-2"
                                                                                            />
                                                                                        </>
                                                                                        :
                                                                                        <div
                                                                                            style={{ width: "335px", height: "251px", border: '1px solid #ffffff', cursor: 'pointer' }}
                                                                                            className="mb-2">
                                                                                        </div>
                                                                                    }
                                                                                    <span>Back ID</span>
                                                                                    <br />
                                                                                    <div className="d-flex justify-content-center mt-2">
                                                                                        <Button className="btn-back me-3 btn btn-primary w-100" onClick={() => { toggleCapturePrimaryBackPhoto(); setIDName('first_secondary') }} >
                                                                                            <span>Capture Photo</span>
                                                                                        </Button>
                                                                                        <input
                                                                                            type="file"
                                                                                            onChange={handleChangeBackID}
                                                                                            style={{ display: 'none' }}
                                                                                            accept="image/*"
                                                                                            id="secondaryFileBackID"
                                                                                        />
                                                                                        <Button className='btn-save btn btn btn-primary w-100' onClick={() => { document.getElementById('secondaryFileBackID').click(); setIDName('first_secondary') }}
                                                                                        >
                                                                                            <span>Upload</span>
                                                                                        </Button>
                                                                                    </div> */}
                                        </Col>
                                      </Card.Body>
                                    </Card>
                                  ) : (
                                    <>
                                      <Button
                                        className="btn-back me-3 btn btn-primary"
                                        onClick={() => {
                                          toggleCaptureBothPhoto();
                                          setIDName("first_secondary");
                                        }}
                                      >
                                        <span>Capture Photo</span>
                                      </Button>
                                      <input
                                        type="file"
                                        onChange={handleChangeFrontID}
                                        style={{ display: "none" }}
                                        accept="image/*"
                                        id="secondaryFileFrontID"
                                      />
                                      <Button
                                        className="btn-save btn btn btn-primary"
                                        onClick={() => {
                                          document
                                            .getElementById(
                                              "secondaryFileFrontID"
                                            )
                                            .click();
                                          setIDName("first_secondary");
                                        }}
                                      >
                                        <span>Upload</span>
                                      </Button>
                                    </>
                                  )}
                                </Col>
                              </Row>
                            </Form.Group>
                          </>
                        )}
                        {isFirstSecondaryPhotoUploaded ||
                        isSecondSecondaryPhotoUploaded ? (
                          <>
                            <Row>
                              <Col>
                                {verificationFormData.first_secondary_id_name ||
                                verificationFormData.second_secondary_id_name ? (
                                  <>
                                    <select
                                      className="form-control mb-3 cursor-pointer"
                                      name="second_secondary_id_name"
                                      defaultValue=""
                                      onChange={handleChangeVerification}
                                      value={
                                        verificationFormData.second_secondary_id_name
                                      }
                                      required
                                    >
                                      <option value="">
                                        Select Secondary IDs
                                      </option>
                                      {selected === "PH" && (
                                        <>
                                          {secondaryIdOptions.map((id) => (
                                            <option
                                              key={id}
                                              value={id}
                                              disabled={
                                                verificationFormData.first_secondary_id_name ===
                                                id
                                              }
                                            >
                                              {id}
                                            </option>
                                          ))}
                                        </>
                                      )}
                                    </select>
                                  </>
                                ) : null}
                              </Col>
                            </Row>
                            {verificationFormData.second_secondary_id_name && (
                              <>
                                <Form.Group>
                                  <Row>
                                    <Col lg="12">
                                      {secondSecondaryFrontPhoto &&
                                      !captureBothPhotoModalShow &&
                                      !captureFrontPhotoModalShow &&
                                      !captureBackPhotoModalShow ? (
                                        <Card>
                                          <Card.Body className="d-flex">
                                            <Col
                                              lg={6}
                                              className="text-center"
                                              style={{ paddingRight: "9px" }}
                                            >
                                              {secondSecondaryFrontPhoto ? (
                                                <>
                                                  <img
                                                    src={
                                                      secondSecondaryFrontPhoto
                                                    }
                                                    alt="profile"
                                                    style={{
                                                      width: "335px",
                                                      height: "251px",
                                                      border:
                                                        "1px solid #ffffff",
                                                      cursor: "pointer",
                                                    }}
                                                    className="mb-2"
                                                  />
                                                </>
                                              ) : null}
                                              <span>Front ID</span>
                                              <br />
                                              <div className="d-flex justify-content-center mt-2">
                                                <Button
                                                  className="btn-back me-3 btn btn-primary w-100"
                                                  onClick={() => {
                                                    toggleCapturePrimaryFrontPhoto();
                                                    setIDName(
                                                      "second_secondary"
                                                    );
                                                  }}
                                                >
                                                  <span>Capture Photo</span>
                                                </Button>
                                                <input
                                                  type="file"
                                                  onChange={handleChangeFrontID}
                                                  style={{ display: "none" }}
                                                  accept="image/*"
                                                  id="secondSecondaryFileFrontID"
                                                />
                                                <Button
                                                  className="btn-save btn btn btn-primary w-100"
                                                  onClick={() => {
                                                    document
                                                      .getElementById(
                                                        "secondSecondaryFileFrontID"
                                                      )
                                                      .click();
                                                    setIDName(
                                                      "second_secondary"
                                                    );
                                                  }}
                                                >
                                                  <span>Upload</span>
                                                </Button>
                                              </div>
                                            </Col>
                                            <Col
                                              lg={6}
                                              className="text-center"
                                              style={{ paddingLeft: "9px" }}
                                            >
                                              {/* {secondSecondaryBackPhoto ?
                                                                                                <>
                                                                                                    <img
                                                                                                        src={secondSecondaryBackPhoto}
                                                                                                        alt='profile'
                                                                                                        style={{ width: "335px", height: "251px", border: '1px solid #ffffff', cursor: 'pointer' }}
                                                                                                        className="mb-2"
                                                                                                    />
                                                                                                </>
                                                                                                :
                                                                                                <div
                                                                                                    style={{ width: "335px", height: "251px", border: '1px solid #ffffff', cursor: 'pointer' }}
                                                                                                    className="mb-2">
                                                                                                </div>
                                                                                            }
                                                                                            <span>Back ID</span>
                                                                                            <br />
                                                                                            <div className="d-flex justify-content-center mt-2">
                                                                                                <Button className="btn-back me-3 btn btn-primary w-100" onClick={() => { toggleCapturePrimaryBackPhoto(); setIDName('second_secondary') }} >
                                                                                                    <span>Capture Photo</span>
                                                                                                </Button>
                                                                                                <input
                                                                                                    type="file"
                                                                                                    onChange={handleChangeBackID}
                                                                                                    style={{ display: 'none' }}
                                                                                                    accept="image/*"
                                                                                                    id="secondSecondaryFileBackID"
                                                                                                />
                                                                                                <Button className='btn-save btn btn btn-primary w-100' onClick={() => { document.getElementById('secondSecondaryFileBackID').click(); setIDName('second_secondary') }}
                                                                                                >
                                                                                                    <span>Upload</span>
                                                                                                </Button>
                                                                                            </div> */}
                                            </Col>
                                          </Card.Body>
                                        </Card>
                                      ) : (
                                        <>
                                          <Button
                                            className="btn-back me-3 btn btn-primary"
                                            onClick={() => {
                                              toggleCaptureBothPhoto();
                                              setIDName("second_secondary");
                                            }}
                                          >
                                            <span>Capture Photo</span>
                                          </Button>
                                          <input
                                            type="file"
                                            onChange={handleChangeFrontID}
                                            style={{ display: "none" }}
                                            accept="image/*"
                                            id="secondSecondaryFileFrontID"
                                          />
                                          <Button
                                            className="btn-save btn btn btn-primary"
                                            onClick={() => {
                                              document
                                                .getElementById(
                                                  "secondSecondaryFileFrontID"
                                                )
                                                .click();
                                              setIDName("second_secondary");
                                            }}
                                          >
                                            <span>Upload</span>
                                          </Button>
                                        </>
                                      )}
                                    </Col>
                                  </Row>
                                </Form.Group>
                              </>
                            )}
                          </>
                        ) : null}
                      </>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer className="text-right modal-footer-border">
            <Button
              type="button"
              className="btn-back me-3 btn btn-primary"
              onClick={() => {
                toggleCloseverificationIDShow();
              }}
            >
              Cancel
            </Button>

            {formStatus !== "standby" ? (
              <Button
                className="btn-save btn btn btn-primary"
                type="button"
                style={{ cursor: "not-allowed" }}
              >
                Saving...
              </Button>
            ) : (
              <Button className="btn-save btn btn btn-primary" type="submit">
                Save
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Profile;
