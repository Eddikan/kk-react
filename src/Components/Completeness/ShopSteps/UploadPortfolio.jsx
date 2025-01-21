import { useEffect, useState, useRef } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { GoPlus } from "react-icons/go";
import { Card, CardBody, ModalHeader, ModalBody, Modal } from "reactstrap";
import NewPortfolioShopManager from "Components/Forms/Portolio/NewPortfolioShopManager";
import Loading from "Components/Shared/Loading";
import PlaceholderImage from "Assets/images/placeholders/image.png";
import { useSelector } from "react-redux";
import { selectMyDesigners } from "store/slices/designersSlice";
const UploadPortfolio = ({
  onStepPlusTwo,
  onStepMinusTwo,
  user,
  shopManagerPage,
}) => {
  const navigate = useNavigate();

  const [reloadCount, setReloadCount] = useState(0);
  const [uploadFileShow, setUploadFileShow] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const tagsInputRef = useRef(null);

  const myDesigns = useSelector(selectMyDesigners);

  const savePortfolioItems = (e) => {
    if (portfolioItems && portfolioItems.length > 0) {
      setPortfolioItems([...portfolioItems, e]);
    } else {
      setPortfolioItems([e]);
    }
  };

  const toggleuploadFile = (e) => {
    e.preventDefault();
    setUploadFileShow(!uploadFileShow);
  };

  const hideUpload = (e) => {
    setUploadFileShow(false);
  };

  const refreshPortfolio = (e) => {
    if (e) {
      setReloadCount(reloadCount + 1);
    }
  };

  const toggleNextTab = () => {
    onStepPlusTwo();
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      // Check if the click is outside the TagsInput component
      if (
        tagsInputRef.current &&
        !tagsInputRef.current.contains(event.target)
      ) {
        // Simulate an "Enter" key press
        if (event.key === "Enter") {
          tagsInputRef.current.handleKeyDown({ key: "Enter" });
        }
      }
    };

    // Attach the event listener when the component mounts
    document.addEventListener("click", handleDocumentClick);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [reloadCount, user]);

  return (
    <>
      {/* <Form onSubmit={questionnaire2Submit}> */}
      <Row>
        <Col lg="12">
          <Card className="mb-4 border-white">
            <CardBody className="p-0 pt-3 pb-3">
              {false ? (
                <>
                  <p className="text-center mb-3 mt-3">
                    <Loading className="bg-white loading-height" />
                  </p>
                </>
              ) : (
                <>
                  {myDesigns && myDesigns.length > 0 ? (
                    <>
                      <Row className="portfolio-row">
                        {myDesigns.map((object, index) => {
                          let portfolioImage = PlaceholderImage;
                          if (object.media?.[0]?.url) {
                            portfolioImage = object.media?.[0]?.url;
                          }
                          return (
                            <Col
                              key={index}
                              className={`portfolio-grid mb-3`}
                              xs="4"
                              md="2"
                              onClick={() => {
                                if (shopManagerPage) {
                                  console.log("here", shopManagerPage);
                                  navigate(
                                    `/user/center/design/${object.id}/edit`
                                  );
                                }
                              }}
                            >
                              <div
                                className={`portfolio-grid-div cursor-pointer w-100 ${
                                  object.collection_type == "Limited"
                                    ? "limited"
                                    : " "
                                } ${object.status == "Draft" ? "draft" : ""}`}
                                style={{
                                  backgroundImage:
                                    "url(" + portfolioImage + ")",
                                }}
                              >
                                <div>
                                  <a>
                                    <div className="portfolio-overlay portfolio-toggle">
                                      <div className="portfolio-details">
                                        {object.status == "Draft" ? (
                                          <span className="text-warning small fw-600">
                                            Draft
                                          </span>
                                        ) : null}
                                      </div>
                                    </div>
                                  </a>
                                </div>
                              </div>

                              <div className="margin-img ellipsis-portfolio">
                                <span className="text-black text-decoration-none portfolio-name-img">
                                  {object.name ?? "-"}
                                </span>
                              </div>
                            </Col>
                          );
                        })}
                        <Col className="portfolio-grid mb-3" xs="4" md="2">
                          <div
                            onClick={toggleuploadFile}
                            className="portfolio-grid-div add-more-box w-100 text-center cursor-pointer background-dashed"
                          >
                            <GoPlus
                              color="#a4a4a4"
                              size="150px"
                              className="mt-3"
                            />
                            <p
                              className="text-dgray"
                              style={{ marginTop: "-15px" }}
                            >
                              Add More
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <>
                      <Row className="align-items-center text-center my-5">
                        <Col>
                          <Form.Label className="mb-1 fs-20">
                            Upload your designs
                          </Form.Label>
                          <br />
                          <Form.Label className="mb-4 fs-16 mt-1 small">
                            Showcase your best work, get feedback, likes, and
                            join a growing community.
                          </Form.Label>
                          <br />
                          <Button
                            className="btn-primary"
                            onClick={toggleuploadFile}
                            type="button"
                          >
                            Upload
                          </Button>
                        </Col>
                      </Row>
                    </>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      {!shopManagerPage && (
        <Row>
          <Col lg="12" className="text-right">
            <Button
              className="btn-back me-3"
              type="button"
              onClick={() => onStepMinusTwo()}
            >
              Back
            </Button>
            {!!myDesigns.length && (
              <Button
                className="btn-save"
                type="button"
                onClick={toggleNextTab}
              >
                Next
              </Button>
            )}
          </Col>
        </Row>
      )}

      {/* </Form> */}

      <Modal
        isOpen={uploadFileShow}
        className="modal-preview"
        fade={false}
        centered
        size="xl"
      >
        <ModalHeader className="pb-0">
          <button
            type="button"
            className="close react-modal-close"
            onClick={toggleuploadFile}
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </ModalHeader>
        <ModalBody>
          <h2 className="modal-title fs-25 fw-600 text-center">
            Upload your Designs
          </h2>
          <Card className="border-0">
            <CardBody className="p-2">
              <NewPortfolioShopManager
                size="small"
                withDraft={false}
                onSuccess={refreshPortfolio}
                onCancel={hideUpload}
                onSave={savePortfolioItems}
              />
            </CardBody>
          </Card>
        </ModalBody>
      </Modal>
    </>
  );
};

export default UploadPortfolio;
