import { Container, Card, Modal, Col, Row } from "react-bootstrap";
import DesignerModalIcon from "Assets/images/icons/designer-modal-icon-purple.png";
import FabricModalIcon from "Assets/images/icons/fabric-modal-icon-purple.png";
import DesignerVendorModalIcon from "Assets/images/icons/sewing-modal-icon-purple.png";
import "./SignupTypeModal.css"; // Import the CSS file

const SignupTypeModal = ({
  registerModalShow,
  setRegisterModalShow,
  setSignupType,
}) => {
  const handleCardClick = (type) => {
    setSignupType(type);
    setRegisterModalShow(false);
  };

  return (
    <Modal
      show={registerModalShow}
      centered
      size="xl"
      fullscreen={false}
      onHide={() => setRegisterModalShow(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className=" h-100">
          <Row className=" align-items-center h-100">
            <Col lg="12">
              {/* <h3 className="text-center fw-600 mb-5">I am looking for...</h3> */}
              <h3 className="shop-modal-intro text-center fw-bold mt-5 mb-2">
                why are you here?
              </h3>
              <p className="modal-subtitle text-center mb-50">
                To get started, please select one of the options:
              </p>
              <Row>
                <Col lg="3" className="mb-90">
                  <Card
                    onClick={() => handleCardClick("designer")}
                    className="shop-modal-card  cursor-pointer bg-white"
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
                <Col lg="3" className="mb-90">
                  <Card
                    onClick={() => handleCardClick("seller")}
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
                <Col lg="3" className="mb-90">
                  <Card
                    onClick={() => handleCardClick("designer_and_seller")}
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
                <Col lg="3" className="mb-90">
                  <Card
                    onClick={() => handleCardClick("customer")}
                    className="shop-modal-card cursor-pointer bg-white"
                  >
                    <Card.Body className="shop-modal-card-body">
                      <div className="user-box shop-modal-card-content text-center justify-content-center">
                        <div className="text-start w-100">
                          <p className="mb-0 fs-12">I am a</p>
                          <h3 className="shop-modal-title fs-30 fw-600 lh-35 mt-2">
                            customer
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
  );
};
export default SignupTypeModal;
