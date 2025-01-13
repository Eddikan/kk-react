// Layout
import LayoutNoFooter from "../Components/Layout/LayoutNoFooter";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import TwoFactorVerification from "../Components/TwoFactorAuthentication/TwoFactorVerification";
import KoutureLogo from "Assets/images/kouture-konect-icon.png";
import "react-toastify/dist/ReactToastify.css";
import "../Assets/styles/LogIn/style.css";

const TwoFactorAuthentication = () => {
  return (
    <>
      <LayoutNoFooter>
        <section id="login" className="d-flex align-items-center">
          <Container fluid>
            <Row style={{ minHeight: "100vh" }}>
              <Col
                id="login-column"
                lg="8"
                className="d-flex flex-column justify-content-center"
              >
                <div className="login-container">
                  <Link to="/">
                    <img
                      src={KoutureLogo}
                      className="kouture-icon"
                      alt="Kouture Konect"
                    />
                  </Link>
                  <h1 className="text-center">Two Factor Authentication</h1>
                  <div className="divider-small mb-3 mt-4"></div>
                  <TwoFactorVerification />
                </div>
              </Col>
              <Col lg="4" className="with-bg"></Col>
            </Row>
          </Container>
        </section>
      </LayoutNoFooter>
    </>
  );
};

export default TwoFactorAuthentication;
