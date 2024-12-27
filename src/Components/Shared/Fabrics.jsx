import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Button, Card } from "react-bootstrap";
import toast from "react-hot-toast";
import { GoHeart, GoAlertFill } from "react-icons/go";
import PlaceholderImage from "Assets/images/placeholders/image.png";
import { useCookies } from "react-cookie";
import "Assets/styles/FabricsHomePage/style.css";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { Rating } from "react-simple-star-rating";
import { FaArrowRight } from "react-icons/fa6";
import CurrencyConverter from "Utils/CurrencyConverter";
import {
  useFetchFabricsQuery,
  useUpdateWishlistMutation,
} from "store/api/GetFabricsData";
const Fabrics = (props) => {
  const [cookies] = useCookies([
    "userCurrency",
    "userCurrencyCode",
    "currencyConversions",
    "selectedCurrency",
    "selectedCurrencyCode",
    "currentUser",
    "token",
    "isLoggedIn",
    "userDetails",
    "userRole",
    "selectedCountry",
    "tempCart",
    "cartItemCount",
  ]);
  const userRole = cookies.userRole;
  const navigate = useNavigate();
  const currentUser = props.currentUser;
  console.log("current uswe", currentUser);
  const [stateWishlist_user, setStateWishlist_user] = useState([]);
  const current_user_id = cookies.currentUser;
  const token = cookies.token;
  const limit = props.limit ?? 16;
  const [underConstructionShow, setUnderConstructionShow] = useState(false);
  const {
    data: fabrics,
    error,
    refetch: refetchFabrics,
    isLoading: fabricsLoading,
  } = useFetchFabricsQuery();

  const [updateWishlist] = useUpdateWishlistMutation();
  useEffect(() => {
    if (error) {
      console.error("Error fetching fabrics:", error);
      toast.error("Failed to load fabrics. Please try again later.");
    }
  }, [error]);

  async function toggleAddViewCount(id) {
    axios
      .get(
        import.meta.env.VITE_REACT_APP_API_ENDPOINT +
          "product/view/" +
          id +
          "?current_user_id=" +
          current_user_id +
          "&token=" +
          token
      )
      .then((response) => {
        const success = response.data.status;
        if (success == "Success") {
          console.log("success");
        } else {
          toast.error(
            "An error occured. Please try again or contact the administrator."
          );
        }
      })
      .catch(() => {
        toast.error(
          "An error occured. Please try again or contact the administrator."
        );
      });
  }

  async function wishlistUpdate(e) {
    try {
      await updateWishlist({
        current_user_id,
        token,
        payload: e, // Event data as the payload
      }).unwrap();
      refetchFabrics();
      setStateWishlist_user([]);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong, please contact the administrator!");
      toast.error("Error while updating wishlist:");
    }
  }

  return (
    <>
      <div id="profile-designs">
        <p className="fs-20 text-center text-dark mb-1" >
          {" "}
          Searching for Fabrics?
        </p>
        <h2 className="fs-40 fw-500 text-center text-black explore-premium-fabrics mb-30">
          Explore Premium Fabrics
        </h2>
        {fabricsLoading ? (
          <>
            <p className="text-center mb-3 mt-3">Loading...</p>
          </>
        ) : (
          <>
            {fabrics && fabrics.length > 0 ? (
              <>
                <Row className="designs-row">
                  {/* {currentUser ?
                                        <Col lg="12" className='d-flex justify-content-end mb-3'>
                                            <div style={{ position: "relative" }}>
                                                <select
                                                    className="form-control mb-3 me-2 sort-input"
                                                    onChange={(e) => {
                                                        const selectedOption = e.target.value;
                                                        if (selectedOption === "New") {
                                                            toggleSortFabrics("?date=", "desc"); 
                                                        } else if (selectedOption === "Price") {
                                                            toggleSortFabrics("?price=", "desc");
                                                        } else if (selectedOption === "Most Liked") {
                                                            toggleSortFabrics("?likes=", "desc");
                                                        } else {
                                                            toggleSortFabrics("", "");
                                                        }
                                                    }}
                                                >
                                                    <option value="">Sort By</option>
                                                    <option value="New">Date</option>
                                                    <option value="Price">Price</option>
                                                </select>
                                                <div style={{ position: "absolute", right: "20px", top: "10px", pointerEvents: "none" }} >
                                                    <IoIosArrowDown />
                                                </div>
                                            </div>
                                        </Col>
                                        :
                                        null
                                    } */}
                  {/* <img src={object.url} className='designs-img'/> */}
                  {fabrics.slice(0, 8).map((fabric, index) => {
                    let fabricImage;
                    if (fabric.image_urls?.[0]?.image_url) {
                      fabricImage =
                        import.meta.env.VITE_REACT_APP_STORAGE_URL +
                        "product/" +
                        fabric.image_urls[0].image_url;
                    } else {
                      fabricImage = PlaceholderImage;
                    }

                    const fabricPrice = fabric.price ?? "0";
                    const fabricCurrency = fabric.currency ?? "USD";

                    const convertedPrice = CurrencyConverter(
                      fabricPrice,
                      fabricCurrency,
                      cookies
                    );

                    var wishlist_user_ids = fabric.wishlist_user_ids;
                    const userWishlist =
                      wishlist_user_ids.includes(currentUser) ||
                      stateWishlist_user.includes(currentUser);

                    return (
                      <>
                        {index < limit ? (
                          <Col className="designs-grid mb-3" xs="12" md="3">
                            <div className="portfolio-link">
                              {userRole !== "Admin" ? (
                                <>
                                  <Link to={`/product/${fabric.id}`}>
                                    <div
                                      className="designs-grid-div w-100 cursor-pointer"
                                      onClick={function () {
                                        toggleAddViewCount(fabric.id);
                                      }}
                                      style={{
                                        backgroundImage:
                                          "url(" + fabricImage + ")",
                                      }}
                                    ></div>
                                  </Link>
                                </>
                              ) : (
                                <>
                                  <Link to={`/admin/fabric/${fabric.id}`}>
                                    <div
                                      className="designs-grid-div w-100 cursor-pointer"
                                      onClick={function () {
                                        toggleAddViewCount(fabric.id);
                                      }}
                                      style={{
                                        backgroundImage:
                                          "url(" + fabricImage + ")",
                                      }}
                                    ></div>
                                  </Link>
                                </>
                              )}

                              {userRole !== "Admin" && (
                                <>
                                  {currentUser ? (
                                    <div className="save-link">
                                      {/* <div className="action-button bg-white me-2">
                                                                                <GoBookmark className="text-black" />
                                                                            </div> */}
                                      {userWishlist ? (
                                        <div className="kouture-tooltip">
                                          <div
                                            className="action-button bg-gold"
                                            onClick={function () {
                                              wishlistUpdate({
                                                user_id: currentUser,
                                                product_id: fabric.id,
                                              });
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
                                              wishlistUpdate({
                                                user_id: currentUser,
                                                product_id: fabric.id,
                                              });
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
                                  ) : null}
                                </>
                              )}
                            </div>
                            <div className="design-details">
                              <div className="d-flex align-items-center justify-content-between">
                                <h4
                                  onClick={() =>
                                    navigate(`/product/${fabric.id}`)
                                  }
                                  className="text-black cursor-pointer fs-18 fw-600 mb-0 text-ellipsis mt-2 pb-1 fabric-name"
                                >
                                  {fabric.name ?? "-"}
                                </h4>
                                {/* {currentUser ?
                                                                    <div className='d-flex align-items-center'>
                                                                        <span className='fs-14 text-no-wrap mx-2'>
                                                                            <IoHeartOutline /> {fabric.wishlist_count}
                                                                        </span>
                                                                        <span className='fs-14 text-no-wrap'>
                                                                            <IoEyeOutline /> {fabric.views}
                                                                        </span>
                                                                    </div>
                                                                    :
                                                                    null
                                                                }    */}
                              </div>
                              <div className="star-ratings mt-1">
                                <Rating
                                  initialValue={0}
                                  readonly={true}
                                  allowFraction={true}
                                  size={20}
                                  className="star-rating"
                                  showTooltip={true}
                                  emptyColor="#dddddd"
                                  fillColor="#cea835"
                                  tooltipArray={[0, 1, 2, 3, 4, 5]}
                                  tooltipDefaultText="0.0"
                                  /* Available Props */
                                />
                              </div>
                              <h4 className="text-black fs-18 fw-600 mt-2 text-ellipsis poppins-ft">
                                {convertedPrice.currency_code}
                                {convertedPrice.price}
                                {/* ${fabric.price && fabric.price > 0 ? Number(fabric.price).toFixed(2) : '0.00'} */}
                              </h4>
                              {/* {currentUser ?
                                                                <div className='d-flex align-items-center mt-1'>
                                                                    {fabric.user.image ?
                                                                        <div className='designer-photo-small' style={{ backgroundImage: "url("+import.meta.env.VITE_REACT_APP_STORAGE_URL+'user/'+fabric.user.image+")"}} ></div>
                                                                        :
                                                                        <div className='designer-photo-small' style={{ backgroundImage: "url("+UserPlaceholder+")"}} ></div>
                                                                    }
                                                                    &nbsp;&nbsp;
                                                                    <p className="text-black fs-14 mb-0">{fabric.user.first_name && fabric.user.first_name != "" ? fabric.user.first_name : "-"} {fabric.user.last_name && fabric.user.last_name != "" ? fabric.user.last_name : "-"}</p>
                                                                </div>
                                                                :
                                                                null
                                                            } */}
                            </div>
                          </Col>
                        ) : null}
                      </>
                    );
                  })}
                  <Col lg={12} className="text-center mt-4">
                    <Link to="/fabrics">
                      <Button
                        className="btn-primary button-opacity-hover"
                        variant="primary"
                      >
                        View More Fabrics{" "}
                        <FaArrowRight style={{ color: "white" }} />
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </>
            ) : (
              <p className="text-center mb-3 mt-3">No records found.</p>
            )}
          </>
        )}
      </div>

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
            onClick={() => setUnderConstructionShow(false)}
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>

        <Modal.Body>
          <Card>
            <Card.Body className="text-center py-5">
              <GoAlertFill size="60px" className="mb-2 text-gold" />
              <p className="fs-20 text-black">Under Construction</p>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Fabrics;
