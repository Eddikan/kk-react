import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import DesignCard from "Components/Shared/DesignCard";
import { useSelector } from "react-redux";

import "Assets/styles/Design/style.css";

import { FaArrowRight } from "react-icons/fa6";
import { useGetDesignsQuery } from "store/api/queries";

const Designs = () => {
  const storeDesigns = useSelector((state) => state?.designs?.designs);

  const currentUser = useSelector((state) => state?.user?.user?.id);
  const designQuery = useGetDesignsQuery({
    page: "1",
    per_page: "100",
  });
  // show log here
  useEffect(() => {
    designQuery.refetch();
  }, []);
  console.log("here", storeDesigns.data);

  if (designQuery.error)
    return (
      <p className="tw-text-center">
        There has been an error getting the designs.
      </p>
    );

  return (
    <>
      <div id="profile-designs">
        <p className="fs-20 text-center text-dark mb-2 proximanova-family">
          {" "}
          Looking for Designs?
        </p>
        <h2 className="fs-40 fw-500 text-center text-black discover-design">
          Discover Captivating Designs
        </h2>
        {designQuery.loading && !storeDesigns.data ? (
          <>
            <p className="text-center mb-3 mt-3">Loading...</p>
          </>
        ) : (
          <>
            {storeDesigns.data && storeDesigns.data.length > 0 ? (
              <>
                <Row className="designs-row">
                  {/* <img src={object.url} className='designs-img'/> */}
                  {storeDesigns.data.slice(0,8).map((design, index) => {
                    return (
                      <DesignCard
                        currentUser={currentUser}
                        design={design}
                        key={index}
                      />
                    );
                  })}
                  <Col lg={12} className="text-center mt-4">
                    {currentUser ? (
                      <Link to="/designs">
                        <Button
                          className="btn-primary button-opacity-hover"
                          variant="primary"
                        >
                          View More Designs{" "}
                          <FaArrowRight style={{ color: "white" }} />
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/sign-up?type=customer&option=designs&redirect_to=/designs">
                        <Button
                          className="btn-primary button-opacity-hover"
                          variant="primary"
                        >
                          View More Designs{" "}
                          <FaArrowRight style={{ color: "white" }} />
                        </Button>
                      </Link>
                    )}
                  </Col>
                </Row>
              </>
            ) : (
              <p className="text-center mb-3 mt-3">No records found.</p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Designs;
