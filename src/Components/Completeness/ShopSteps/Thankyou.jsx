import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";

const ThankYouProgress = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "currentUser",
    "userDetails",
  ]);
  const userDetails = useSelector((state) => state.user.user);
  const is_seller = userDetails.type == "seller" ? true : false;
  const is_designer = userDetails.type == "designer" ? true : false;
  return (
    <>
      <Row>
        <Col lg={12} className="text-center">
          <div className="text-gold mt-1">
            <IoIosCheckmarkCircle size={70} />
          </div>
        </Col>
        <Col lg={12} className="text-center mb-4">
          <div className="fs-30 rufina-family mt-3">
            Thank you for setting up your shop!
          </div>
        </Col>

        <Col lg={12} className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center">
            <a
              className="btn btn-primary"
              href={`${
                is_designer ? "/user/center/calendar" : "/user/center/products"
              }`}
            >
              View Shop
            </a>
            {/* <div>
                            <span><HiOutlineBuildingStorefront size={30} className='text-gold me-2'/> 
                                <span className='fw-500 cursor-pointer'>
                                Set up your shop<FaArrowRightLong className='ms-2'/></span>
                            </span>
                        </div> */}
            {userDetails?.profile_completeness?.score < 100 ? (
              <div>
                <Link
                  to="/user/complete-profile"
                  className="text-decoration-none"
                >
                  <span>
                    <FiUser size={25} className="text-gold me-2 ms-3" />
                    <span className="fw-500 cursor-pointer">
                      Complete Profile
                      <FaArrowRightLong className="ms-2" />
                    </span>
                  </span>
                </Link>
              </div>
            ) : null}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ThankYouProgress;
