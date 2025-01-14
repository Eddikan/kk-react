import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LayoutNoFooter from "Components/Layout/LayoutNoFooter";
import { Container, Row, Col, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import "Assets/styles/LogIn/style.css";
import { useCookies } from "react-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import KoutureLogo from "Assets/images/kouture-konect-icon.png";
import { useSelector } from "react-redux";

const initialForgotPassword = Object.freeze({
  email: "",
});

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [forgotPasswordFormData, setForgotPasswordFormData] = useState(
    initialForgotPassword
  );
  const [submitLoading, setSubmitLoading] = useState(false);

  const currentUser = useSelector((state) => state.user?.user?.email);

  const postForgotPassword = async (data) => {
    return await axios.post(
      import.meta.env.VITE_REACT_APP_API_ENDPOINT + "auth/password/reset",
      data
    );
  };

  const handleChangePassword = (e) => {
    setForgotPasswordFormData({
      ...forgotPasswordFormData,
      [e.target.name]: e.target.value,
    });
  };

  const forgotPasswordSubmit = async (e) => {
    try {
      e.preventDefault();
      setSubmitLoading(true);
      const response = await postForgotPassword({ ...forgotPasswordFormData });
      console.log("res ", response);
      const success = response.data.success;

      if (success) {
        setForgotPasswordFormData(initialForgotPassword);
        toast.success(response.data.message);
        setTimeout(function () {
          navigate("/reset-password");
        }, 2000);
      }
    } catch (error) {
      const errors = error.response.data.errors;
      // eslint-disable-next-line no-unused-vars
      errors.forEach((message) => {
        toast.error(message); // Use your preferred toast type (e.g., success, warning, error)
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser != "") {
      navigate("/user/profile");
    }
  }, []);

  return (
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
                <a href="/">
                  <img
                    src={KoutureLogo}
                    className="kouture-icon"
                    alt="Kouture Konect"
                  />
                </a>

                <h1 className="text-center">Forgot Password</h1>
                <div className="divider-small mb-3 mt-4"></div>

                <Form onSubmit={forgotPasswordSubmit}>
                  <Form.Group className="mb-0 mt-0" controlId="formBasicEmail">
                    <Form.Label>Email Address</Form.Label>
                    <FormControl
                      type="email"
                      name="email"
                      value={forgotPasswordFormData.email}
                      className="mr-sm-2"
                      onChange={handleChangePassword}
                      required
                    />
                  </Form.Group>

                  {submitLoading ? (
                    <Button
                      className="w-100 mt-4"
                      variant="primary"
                      type="button"
                    >
                      Submitting...
                    </Button>
                  ) : (
                    <Button
                      className="w-100 mt-4"
                      variant="primary"
                      type="submit"
                    >
                      Submit
                    </Button>
                  )}
                  <p className="mb-0 mt-4 text-center fs-14 text-dgray">
                    Already have an account?{" "}
                    <Link className="login" to="/login">
                      Sign in
                    </Link>
                  </p>
                </Form>
              </div>
            </Col>

            <Col lg="4" className="with-bg"></Col>
          </Row>
        </Container>
      </section>
    </LayoutNoFooter>
  );
};

export default ForgotPassword;
