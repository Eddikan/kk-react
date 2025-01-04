import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../Components/Layout/Layout";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../Assets/styles/EmailConfirmation/style.css";
import axios from "axios";
import toast from "react-hot-toast";
import MailIcon from "../Assets/images/icons/email.png";
import { useSelector } from "react-redux";

const EmailConfirmation = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const expiresIn = searchParams.get("expires_in");
  const userEmail = useSelector((state) => state.user.email);

  const [formStatus, setFormStatus] = useState("standby");
  const navigate = useNavigate();

  async function resendVerificationEmail() {
    setFormStatus("loading");
    axios
      .post(
        import.meta.env.VITE_REACT_APP_API_ENDPOINT +
          "auth/email/verify/resend",
        {
          email: userEmail,
        }
      )
      .then((response) => {
        console.log("res is", response);
        const success = response.data.success;
        if (success) {
          toast.success(response.data.message);
          setFormStatus("standby");
        } else {
          toast.error(
            "An error occured. Please try again or contact the administrator."
          );
          setFormStatus("standby");
        }
      })
      .catch((error) => {
        const errors = error.response.data.errors;
        // eslint-disable-next-line no-unused-vars
        Object.entries(errors).forEach(([_, messages]) => {
          messages.forEach((message) => {
            toast.error(message); // Use your preferred toast type (e.g., success, warning, error)
          });
        });
        setFormStatus("standby");
      });
  }

  async function VerifyEmail() {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_API_ENDPOINT +
          `auth/email/verify?token=${token}`
      );
      axios.header = "Accept: application/json";
      console.log("respons eis", response);
      const success = response.data.success;
      if (success) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log("errror", error);
      const errors = error.response.data.errors;
      // eslint-disable-next-line no-unused-vars
      Object.entries(errors).forEach(([_, messages]) => {
        messages.forEach((message) => {
          toast.error(message); // Use your preferred toast type (e.g., success, warning, error)
        });
      });
    }
  }
  useEffect(() => {
    VerifyEmail();
  }, [token]);
  return (
    <Layout>
      <section
        id="email-confirmation"
        className="d-flex justify-content-center flex-column py-5 px-2 vh-100"
      >
        <Container className="text-center">
          <Row>
            <Col lg="12">
              <img src={MailIcon} className="mail-icon" />
            </Col>
          </Row>
          <Row className="narrow-750 p-5  pt-4 mt-2 text-dgray">
            <Col lg="12">
              <h1 className="pb-2">Email Confirmation</h1>
              <p className="subtitle mb-0">
                Thank you for signing up for Kouture Konect.
              </p>
              <p className="fs-16">
                Your email is being verified, if this page doesn&apos;t redirect
                to login, please resend the verification link
              </p>
              {/* <p className='login-with-email'>or</p> */}
              {formStatus != "standby" ? (
                <Button className="btn-primary mt-4" variant="primary">
                  Sending...
                </Button>
              ) : (
                <Button
                  onClick={resendVerificationEmail}
                  className="btn-primary fs-16 mt-4"
                  variant="primary"
                >
                  Resend Verification link
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
};

export default EmailConfirmation;
