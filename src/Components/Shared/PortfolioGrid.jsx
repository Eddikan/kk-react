import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  ModalHeader,
  Modal,
  Card,
  ModalFooter,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "Assets/styles/Portfolio/ViewPortFolio/style.css";
import CopyTo from "Utils/CopyLink";
import PlaceholderImage from "Assets/images/placeholders/image.png";
import { GoStar, GoAlertFill } from "react-icons/go";
import {
  IoShareSocial,
  IoInformationOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { ImEmbed2 } from "react-icons/im";
import Loading from "./Loading";
import { useCookies } from "react-cookie";
import "Assets/styles/Design/style.css";
import Carousel from "react-multi-carousel";
import { useSelector } from "react-redux";

const PortfolioGrid = ({ portfolioLoading, designsProp }) => {

  const [cookies, setCookie, removeCookie] = useCookies([
    "currentUser",
    "token",
    "isLoggedIn",
    "userDetails",
    "userRole",
    "tempFavorites",
    "favoriteItemCount",
  ]);
  const currentUser = useSelector((state) => state.user?.user?.id);

  const [singleDesign, setSingleDesign] = useState("");
  const [portfoliosImage, setPortfolioImage] = useState(false);
  const [designImages, setDesignImages] = useState([]);
  const [underConstructionShow, setUnderConstructionShow] = useState(false);
  const [descriptionShow, setDescriptionShow] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [isDesignCurrentUser, setIsDesignCurrentUser] = useState(false);
  const [messageShow, setMessageShow] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [tempFavorites, setTempFavorites] = useState(
    cookies.tempFavorites ?? []
  );

  const [shareShowModal, setShareShowModal] = useState(false);
  const [copyEmbedLink, setCopyEmbedLink] = useState(false);
  const [copy, setCopy] = useState(false);

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  let query = useQuery();
  let iframeLink = `<iframe src="${window.location.origin}/view-design/${singleDesign.portfolioId}" height="316" width="404" allowfullscreen lazyload frameborder="0" allow="clipboard-write" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  const user_id = query.get("user_id");

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

  function toggleCopyEmbedLinkModal() {
    setCopyEmbedLink(true);
  }

  function toggleDescription() {
    setDescriptionShow(true);
  }

  function toggleShareModal() {
    setShareShowModal(true);
  }

  function toggleUnderConstruction(message) {
    setUnderConstructionShow(true);
    setModalHeading(message);
  }

  function togglePortfolioImage(
    portfolioId,
    image_urls,
    description,
    userId,
    userWishlist
  ) {
    setPortfolioImage(true);
    setInWishlist(userWishlist);
    setSingleDesign({
      id: currentUser,
      portfolioId: portfolioId ?? 0,
      userId: userId ?? 0,
      description: description ?? "-",
    });
    setDesignImages(image_urls);

    if (currentUser == userId) {
      setIsDesignCurrentUser(true);
    } else {
      setIsDesignCurrentUser(false);
    }
  }

  async function favoriteDesignUpdate() {
    if (true) {
      const currentFavoriteCount = cookies.favoriteItemCount ?? 0;
      const latestFavoriteItemCount = parseInt(currentFavoriteCount) + 1;
      setCookie("favoriteItemCount", latestFavoriteItemCount, {
        path: "/",
      });
    }
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

  return (
    <>
      <div id="profile-portfolio">
        {portfolioLoading ? (
          <>
            <p className="text-center mb-3 mt-3">
              <Loading className="bg-white loading-height" />
            </p>
          </>
        ) : (
          <>
            {designsProp && designsProp.length > 0 ? (
              <>
                <Row className="portfolio-row">
                  {designsProp.map((design, index) => {
                    let portfolioImage;
                    if (design.media?.[0]?.url) {
                      portfolioImage = design.media[0].url;
                    } else {
                      portfolioImage = PlaceholderImage;
                    }

                    const userWishlist = true;

                    return (
                      <Col
                        key={index}
                        className={`portfolio-grid mb-3`}
                        xs="4"
                        md="2"
                        onClick={function () {
                          togglePortfolioImage(
                            design.id,
                            design.media,
                            design.description,
                            design.user_id,
                            userWishlist
                          );
                        }}
                      >
                        <div className="portfolio-link cursor-pointer">
                          <div
                            className="designs-grid-div w-100"
                            style={{
                              backgroundImage: "url(" + portfolioImage + ")",
                              minHeight: "200px",
                            }}
                          ></div>
                          <div className="portfolio-overlay">
                            <div className="portfolio-details">
                              {design.status == "Draft" ? (
                                <span className="text-warning small fw-600">
                                  Draft
                                </span>
                              ) : null}
                            </div>
                          </div>
                          {design.user_id != currentUser ? (
                            <>
                              {currentUser ? (
                                <>
                                  <div className="save-link">
                                    {userWishlist ? (
                                      <div className="kouture-tooltip">
                                        <div
                                          className="action-button bg-gold"
                                          onClick={function () {
                                            favoriteDesignUpdate({
                                              user_id: currentUser,
                                              portfolio_item_id: design.id,
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
                                          onClick={function () {
                                            favoriteDesignUpdate({
                                              user_id: currentUser,
                                              portfolio_item_id: design.id,
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
                                </>
                              ) : (
                                <>
                                  <div className="save-link">
                                    {true ? (
                                      <div className="kouture-tooltip">
                                        <div
                                          className="action-button bg-gold"
                                          onClick={function () {
                                            toggleTempFavorite({
                                              id: design.id,
                                              user_id: currentUser,
                                              name: design.name,
                                              description: design.description,
                                              image_urls: design.image_urls[0],
                                              designer_user_id: design.user.id,
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
                                          onClick={function () {
                                            toggleTempFavorite({
                                              id: design.id,
                                              user_id: currentUser,
                                              name: design.name,
                                              description: design.description,
                                              image_urls: design.image_urls[0],
                                              designer_user_id: design.user.id,
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
                                </>
                              )}
                            </>
                          ) : (
                            <></>
                          )}
                        </div>

                        <div className="margin-img ellipsis-portfolio">
                          <span className="text-black text-decoration-none portfolio-name-img">
                            {design.name ?? "-"}
                          </span>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </>
            ) : (
              <>
                <Card className="border-none">
                  <Card.Body className="image-drop-container pt-5 pb-5">
                    <div className="text-center">
                      <p className="text-center mb-2 fs-20">
                        No portfolio found.
                      </p>

                      {currentUser == user_id && (
                        <>
                          <p className="text-center mb-3">
                            Showcase your best works, enrich your portfolio, and
                            join a flourishing community.
                          </p>
                          <Link to="/user/center/design/add">
                            <Button className="btn btn-primary">
                              Upload Portfolio
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </>
            )}
          </>
        )}
      </div>

      <Modal
        show={portfoliosImage}
        fade={false}
        className="modal-full-width"
        id="bg-transparent-card"
      >
        <ModalHeader className="pt-2 pb-3 tw-mb-10 bg-transparent-card d-flex align-items-start">
          <button
            type="button"
            className="close  modal-close close-button-image bg-black"
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
                  <>
                    <Carousel
                      swipeable={false}
                      draggable={false}
                      responsive={responsive}
                      ssr={true}
                      autoPlaySpeed={1000}
                    >
                      {designImages.map((image, index) => {
                        return (
                          <>
                            <div
                              key={index}
                              className="single-image-slider-fabrics"
                              style={{
                                backgroundImage: `url(${image.url})`,
                              }}
                            ></div>
                          </>
                        );
                      })}
                    </Carousel>
                    ;
                  </>
                ) : (
                  <>No Image </>
                )}
              </div>
            </Col>

            <Col lg={1}>
              <div>
                {/* 
                {isDesignCurrentUser || !currentUser ? null : (
                  <>

                    <div
                      className="text-center mb-4"
                      // onClick={toggleMessage}
                      onClick={() => toggleUnderConstruction("Message")}
                    >
                      <div className="action-button-designs bg-white">
                        <AiFillMessage className="text-black mt-2" size={30} />
                      </div>
                      <div className="icon-name-color fs-12 mb-3 mt-2 fw-600">
                        Message
                      </div>
                    </div>
                  </>
                )} */}
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
                    <IoInformationOutline
                      className="text-black mt-2"
                      size={30}
                    />
                  </div>
                  <div className="icon-name-color fs-12 mb-3 mt-2 fw-600">
                    Description
                  </div>
                </div>
                {!isDesignCurrentUser ? (
                  <>
                    {currentUser ? (
                      <>
                        {inWishlist ? (
                          <div
                            className="text-center mb-4"
                            onClick={function () {
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
                            onClick={function () {
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
                        )}
                      </>
                    ) : (
                      <>
                        {true ? (
                          <div
                            className="text-center mb-4"
                            onClick={function () {
                              toggleTempFavorite({});
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
                            onClick={function () {
                              toggleTempFavorite({});
                            }}
                          >
                            <div className="action-button-designs bg-white">
                              <GoStar className="text-black mt-2" size={30} />
                            </div>
                            <div className="icon-name-color fs-12 mb-3 mt-2 fw-600">
                              Add to Favorites
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </Col>
          </Row>
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
                    className="user-photo-message mb-2 "
                    style={{
                      backgroundImage: `url(${
                        import.meta.env.VITE_REACT_APP_STORAGE_URL
                      }user/${singleDesign.image})`,
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

        <ModalFooter>
          <div className="text-right">
            {/* <button className="btn-cancel-message btn me-2" onClick={() => { setMessageShow(false); }}>Cancel</button>
                        <button className="btn-primary btn" onClick={() => { toggleUnderConstruction(); setMessageShow(false); }}>Send Message</button> */}

            <button
              className="btn btn-secondary border-black bg-white text-black me-3"
              onClick={() => {
                setMessageShow(false);
              }}
              type="button"
              style={{ minWidth: "100px", padding: "9px 20px" }}
            >
              Cancel
            </button>
            {/* {portfolioSendLoading ?
                            <button className="btn btn-primary" type="button" style={{ minWidth: '100px', padding: '9px 20px' }}>Sending...</button>
                            : */}
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                toggleUnderConstruction();
                setMessageShow(false);
              }}
              style={{ minWidth: "100px", padding: "9px 20px" }}
            >
              Send Message
            </button>
            {/* } */}
          </div>
        </ModalFooter>
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
            onClick={function () {
              setShareShowModal(false);
            }}
          >
            <IoCloseOutline color="#7e7e7e" size={25} className="mt-2" />
          </button>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body className="padding-share-card">
              <div>
                {designImages && designImages.length > 0 ? (
                  <>
                    <Carousel
                      swipeable={false}
                      draggable={false}
                      responsive={responsive}
                      ssr={true}
                      autoPlaySpeed={1000}
                    >
                      {designImages.map((image, index) => {
                        return (
                          <div
                            key={index}
                            className="single-image-slider-share mb-4"
                            style={{
                              backgroundImage: `url(${image.url})`,
                            }}
                          ></div>
                        );
                      })}
                    </Carousel>
                  </>
                ) : (
                  <></>
                )}

                <div lg="12" className="text-center">
                  <CopyTo
                    text={`${window.location.origin}/view-design/${singleDesign.portfolioId}`}
                    classes="btn btn-copy-link border-black bg-white text-black mt-2 w-100"
                    standbyTitle="Copy Link"
                    icon={true}
                  />

                  <button
                    className="btn btn-copy-link border-black bg-white text-black mt-2 w-100"
                    type="button"
                    onClick={toggleCopyEmbedLinkModal}
                  >
                    <ImEmbed2 className="me-2" size={17} />
                    Copy Embed Code
                  </button>
                </div>
              </div>
            </Card.Body>
          </Card>
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
              <textarea className="text-area-embed">{iframeLink}</textarea>
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
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PortfolioGrid;
