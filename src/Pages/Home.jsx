import { useState } from "react";
import Layout from "../Components/Layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Modal, Card } from "react-bootstrap";
import "../Assets/styles/Home/style.css";
import Designs from "Components/Shared/Designs";
import Fabrics from "Components/Shared/Fabrics";
import EcoFriendly from "Components/Shared/EcoFriendly";
import CustomerSatisfactionCta from "Components/Shared/Home/CustomerSatisfactionCta";
import { useCookies } from "react-cookie";
import DesignIcon from "Assets/images/user-box/dress.png";
import FabricIcon from "Assets/images/user-box/fabric.png";
import DesignerIcon from "Assets/images/user-box/edit-tools.png";
import FabricsPreview from "Components/Grids/FabricsPreview";
import Signup from "Components/Forms/User/Signup";
import HeroLoggedIn from "Components/Pages/Home/HeroLoggedIn";
import HeroImg from "Assets/images/hero-img.png";
import ShopIcon from "Assets/images/icons/shop.png";
import { IoIosSearch } from "react-icons/io";
import BrowseDesigners from "Assets/images/home-modal/browse-designers.png";
import ShopFabrics from "Assets/images/home-modal/shop-fabrics.png";
import ExploreDesigns from "Assets/images/home-modal/explore-designs.png";
import JoinKoutureBG from "Assets/images/join-kouture.png";
import DesignersMarquee from "Components/Grids/DesignersMarquee";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { useSelector } from "react-redux";

const Home = () => {
  const navigate = useNavigate();
  const [userModalShow, setUserModalShow] = useState(false);

  const [fabricsModalShow, setFabricsModalShow] = useState(false);
  const [signupModalShow, setSignupModalShow] = useState(false);
  const [signupType, setSignupType] = useState("");
  const currenStoreUser = useSelector((state) => state.user.user);
  const currentUser = useSelector((state) => state.user?.user?.email);
 
  const handleShowUser = () => {
    setUserModalShow(true);
  };
  const handleShowFabrics = () => {
    setFabricsModalShow(true);
  };

  const showSignupModal = (e) => {
    setSignupType(e);
    setSignupModalShow(true);
  };

  return (
    <Layout>
      {/* <HeroSection /> */}
      {currentUser ? (
        <HeroLoggedIn />
      ) : (
        <section id="home" className="py-2 px-5 mt-4 d-flex align-items-center">
          <Container>
            <Row>
              <Col lg="6" className="my-auto">
                <div className="mt-5 align-text-center">
                  <h1 className="mb-0 fw-bold">Fashion Redefined</h1>
                  <h2 className="fw-bold">Your Unique Look Starts Here</h2>
                  <p className="mx-0 mt-40 pb-5 text-justify subtitle">
                    Discover premium fabrics, connect with top fashion
                    designers, and get personalized style consultations all in
                    one place.
                  </p>
                </div>
                <div className="my-5">
                  {currentUser ? null : (
                    <>
                      <Button
                        className="explore-button btn me-3 text-white bg-black bg-gray-hover px-3"
                        style={{ width: "250px", height: "50px" }}
                        variant="secondary"
                        onClick={() => handleShowUser()}
                      >
                        <IoIosSearch size={25} /> Explore Marketplace
                      </Button>
                      {/* {
                        !currenStoreUser?.shop?.is_complete &&(
                          <Button
                          className="custom-hover-btn me-3 px-3"
                          style={{ width: "250px" }}
                          onClick={() => navigate("/user/shop/setup")}
                        >
                          {" "}
                          <img
                            src={ShopIcon}
                            className="mx-1"
                            height="29px"
                            alt="shop-icon"
                          ></img>{" "}
                          Create Shop{" "}
                        </Button>
                        )
                      } */}
                    
                    </>
                  )}
                </div>
              </Col>
              <Col lg="6" className="text-end">
                <img
                  className="hero-img img-fluid"
                  src={HeroImg}
                  alt="hero-img"
                />
              </Col>
            </Row>
          </Container>
        </section>
      )}

      <section id="toprateddesigners" className="mb-5 mt-xl-4 px-5">
        <Container>
          <Row>
            <Col className="text-center">
              <h2 className="fw-bold fs-35 lh-45 mb-30">
                Our Top Rated Designers
              </h2>
              <DesignersMarquee onSignup={showSignupModal} />
              {currentUser ? (
                <Col lg={12} className="text-center mt-50">
                  <Link to="/designers">
                    <Button className="btn-primary" variant="primary">
                      View All Designers{" "}
                      <FaArrowRight style={{ color: "white" }} />
                    </Button>
                  </Link>
                </Col>
              ) : null}
            </Col>
          </Row>
        </Container>
      </section>
      <section id="fabrics" className="mb-5 mt-xl-2 px-5">
        <Container>
          <Row>
            <Col>
              <Fabrics currentUser={currentUser} onSignup={showSignupModal} />
            </Col>
          </Row>
        </Container>
      </section>
      <section id="eco" className="mb-0">
        <EcoFriendly currentUser={currentUser} onSignup={showSignupModal} />
      </section>
      <section id="designs" className="py-5 px-5">
        <Container>
          <Row>
            <Col lg="12">
              <Designs  onSignup={showSignupModal} />
            </Col>
          </Row>
        </Container>
      </section>

      <section
        id="join-kouture-section"
        className="mt-xl-2 mb-4 p-5"
        style={{
          backgroundImage: `url(${JoinKoutureBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container className="py-3">
          <Row>
            <Col lg="6">
              <div className="join-kouture-content text-left mb-40">
                <h3 className="text-gold the-seasons fs-35 mb-2">
                  Join the Kouture Konect Community
                </h3>
                <h5 className="text-white the-seasons fs-25 ">
                  Showcase Your Designs and Sell Fabrics
                </h5>
              </div>
              <div>
                <p className="join-section-p text-white fs-20 fw-400 mb-0">
                  Showcase your unique creations and connect with fashion
                </p>
                <p className="join-section-p text-white fs-20 fw-400 mb-40">
                  enthusiasts eager to discover fresh talent
                </p>
                <p
                  className="join-section-get-started-btn cursor-pointer fs-20"
                  onClick={() => handleShowUser()}
                >
                  Get Started Now{" "}
                  <FaArrowRightLong className="get-started-icon ms-2" />
                </p>
              </div>
            </Col>
            <Col lg="6"></Col>
          </Row>
        </Container>
      </section>

      <section id="customer-satisfaction-cta" className="py-5 mb-0">
        <CustomerSatisfactionCta />
      </section>
      {/* <section id="recent-designs" className="py-5 mb-5 px-2">
        <Container>
          <Row>
            <Col lg="12">
              <div>
                <p className="fs-20 text-center text-dark mb-2 proximanova-family"> Want to see the latest live streams of your favorite designers?</p >
                <h2 className="fs-35 fw-500 text-center text-black discover-design">Recent Live Streams</h2>
              </div>
            </Col>
          </Row>
        </Container>
      </section> */}
      <Modal
        show={userModalShow}
        backdrop="static"
        centered
        size="lg"
        fullscreen={false}
        onHide={() => setUserModalShow(false)}
      >
        <Modal.Body className="py-5">
          <button
            type="button"
            className="btn-close no-header-close"
            onClick={() => setUserModalShow(false)}
            aria-label="Close"
          ></button>
          <Container className="narrow-850 h-100">
            <Row className=" align-items-center h-100">
              <Col lg="12">
                {/* <h3 className="text-center fw-600 mb-5">I am looking for...</h3> */}
                <h3 className="explore-modal-title text-center fw-bold mb-3">
                  Select an option to get started
                </h3>
                <p className="modal-subtitle text-center mb-5">
                  Welcome to our fashion marketplace! Please select one of the
                  options below to explore our offerings. Whether you&apos;re
                  looking for talented designers, unique patterns, or quality
                  fabrics, you&apos;re in the right place
                </p>
                <Row>
                  <Col lg="4">
                    <Link
                      to="/designers"
                      onClick={() => setUserModalShow(false)}
                      className="text-decoration-none"
                    >
                      {/* onClick={() => showSignupModal('user_designer')} */}
                      <Card className="modal-card cursor-pointer bg-white border-solid-2">
                        <Card.Body
                          className="rounded d-flex align-items-center justify-content-center fashion-card"
                          style={{
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${BrowseDesigners})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          <div className="modal-box text-center align-items-center">
                            <h3 className="text-white">Browse Designers</h3>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                  <Col lg="4">
                    <Link
                      to="/fabrics"
                      onClick={() => setUserModalShow(false)}
                      className="text-decoration-none"
                    >
                      {/* onClick={() => handleShowFabrics()} */}
                      <Card className="modal-card cursor-pointer bg-white border-solid-2">
                        <Card.Body
                          className="rounded d-flex align-items-center justify-content-center fashion-card"
                          style={{
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${ShopFabrics})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          <div className="modal-box">
                            <h3 className="text-white">Shop Fabrics</h3>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                  <Col lg="4">
                    <Link
                      to="/designs"
                      onClick={() => setUserModalShow(false)}
                      className="text-decoration-none"
                    >
                      {/* onClick={() => handleShowDesigns()} */}
                      <Card className="modal-card cursor-pointer bg-white bg-black-hover border-solid-2">
                        <Card.Body
                          className="rounded d-flex align-items-center justify-content-center fashion-card"
                          style={{
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${ExploreDesigns})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          <div className="modal-box">
                            <h3 className="text-white">Explore Designs</h3>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>

      {/* User Box */}
      {/* copy this  */}
      <Modal
        show={false}
        backdrop="static"
        centered
        size="lg"
        fullscreen={false}
        onHide={() => setUserModalShow(false)}
      >
        <Modal.Body className="py-5">
          <button
            type="button"
            className="btn-close no-header-close"
            onClick={() => setUserModalShow(false)}
            aria-label="Close"
          ></button>
          <Container className="narrow-850 h-100">
            <Row className=" align-items-center h-100">
              <Col lg="12">
                {/* <h3 className="text-center fw-600 mb-5">I am looking for...</h3> */}
                <h3 className="text-center fw-600 mb-5">
                  I am interested in...
                </h3>
                <Row>
                  <Col lg="4">
                    <Link
                      to="/designers"
                      onClick={() => setUserModalShow(false)}
                      className="text-decoration-none"
                    >
                      {/* onClick={() => showSignupModal('user_designer')} */}
                      <Card className="cursor-pointer bg-white border-gold-hover border-solid-2">
                        <Card.Body>
                          <div className="user-box">
                            <div>
                              <img src={DesignerIcon} alt="Designers" />
                              <h3 className="fw-600">Designers</h3>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                  <Col lg="4">
                    <Link
                      to="/fabrics"
                      onClick={() => setUserModalShow(false)}
                      className="text-decoration-none"
                    >
                      {/* onClick={() => handleShowFabrics()} */}
                      <Card className="cursor-pointer bg-white border-gold-hover border-solid-2">
                        <Card.Body>
                          <div className="user-box">
                            <div>
                              <img src={FabricIcon} alt="Fabrics" />
                              <h3 className="fw-600">Fabrics</h3>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                  <Col lg="4">
                    <Link
                      to="/designs"
                      onClick={() => setUserModalShow(false)}
                      className="text-decoration-none"
                    >
                      {/* onClick={() => handleShowDesigns()} */}
                      <Card className="cursor-pointer bg-white border-gold-hover border-solid-2">
                        <Card.Body>
                          <div className="user-box">
                            <div>
                              <img src={DesignIcon} alt="Designs" />
                              <h3 className="fw-600">Designs</h3>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>

      {/* Fabrics */}
      <Modal
        show={fabricsModalShow}
        fullscreen={false}
        onHide={() => setFabricsModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="h-100">
            <Row className="h-100">
              <Col lg="12" className="pb-100">
                <h2 className="mb-4 fw-600">Featured Fabrics</h2>
                <FabricsPreview limit="20" onSignup={showSignupModal} />
                <Col lg={12} className="text-right mt-4 mb-4">
                  <div className="preview-button fixed">
                    <div className="container">
                      <Button
                        className="btn-primary"
                        variant="primary"
                        onClick={() => showSignupModal("user_fabric")}
                      >
                        View More
                      </Button>
                    </div>
                  </div>
                </Col>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>

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
    </Layout>
  );
};

export default Home;
