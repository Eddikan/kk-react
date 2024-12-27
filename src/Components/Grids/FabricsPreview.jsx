import { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import toast from "react-hot-toast";
import { useFetchFabricsQuery } from "store/api/GetFabricsData";
import PlaceholderImage from "Assets/images/placeholders/image.png";

const Fabrics = (props) => {
  const limit = props.limit;
  const {
    data: fabrics,
    error,
    isLoading: fabricsLoading,
    refetch: refetchFabrics,
  } = useFetchFabricsQuery();
  useEffect(() => {
    if (error) {
      console.error("Error fetching fabrics:", error);
      toast.error("Failed to load fabrics. Please try again later.");
    }
  }, [error]);
  const showSignupModal = (e) => {
    props.onSignup(e);
  };
  return (
    <>
      <div id="profile-fabrics">
        {fabricsLoading ? (
          <>
            <p className="text-center mb-3 mt-3">Loading...</p>
          </>
        ) : (
          <>
            {fabrics && fabrics.length > 0 ? (
              <>
                {limit ? (
                  <>
                    <Row className="designs-row">
                      {fabrics.map((fabric, index) => {
                        let fabricImage;
                        if (fabric.image_urls?.[0]?.image_url) {
                          fabricImage =
                            import.meta.env.VITE_REACT_APP_STORAGE_URL +
                            "product/" +
                            fabric.image_urls[0].image_url;
                        } else {
                          fabricImage = PlaceholderImage;
                        }
                        return (
                          <>
                            {index < limit ? (
                              <Col
                                className="designs-grid mb-3 cursor-pointer"
                                xs="4"
                                md="3"
                                onClick={() => showSignupModal("user_fabric")}
                              >
                                <div
                                  className="designs-grid-div w-100"
                                  style={{
                                    backgroundImage: "url(" + fabricImage + ")",
                                  }}
                                ></div>
                                <div className="design-details">
                                  <div className="d-flex align-items-center justify-content-between">
                                    <p className="text-black fs-18 fw-600 mb-0 text-ellipsis">
                                      {fabric.name ?? "-"}
                                    </p>
                                  </div>
                                </div>
                              </Col>
                            ) : null}
                          </>
                        );
                      })}
                    </Row>
                  </>
                ) : (
                  <Row className="designs-row">
                    {fabrics.map((fabric, index) => {
                      let fabricImage;

                      if (fabric.image_urls?.[0]?.image_url) {
                        fabricImage =
                          import.meta.env.VITE_REACT_APP_STORAGE_URL +
                          "portfolio/" +
                          fabric.image_urls[0].image_url;
                      } else {
                        fabricImage = PlaceholderImage;
                      }
                      return (
                        <>
                          <Col
                            key={index}
                            className="designs-grid mb-3"
                            xs="4"
                            md="3"
                          >
                            <div
                              className="designs-grid-div w-100 cursor-pointer"
                              style={{
                                backgroundImage: "url(" + fabricImage + ")",
                              }}
                              onClick={() => showSignupModal("user_fabric")}
                            ></div>
                            <div className="design-details">
                              <div className="d-flex align-items-center justify-content-between">
                                <p className="text-black fs-18 fw-600 mb-0 text-ellipsis">
                                  {fabric.name ?? "-"}
                                </p>
                              </div>
                            </div>
                          </Col>
                        </>
                      );
                    })}
                  </Row>
                )}
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

export default Fabrics;
