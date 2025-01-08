import { Email, domains } from "@smastrom/react-email-autocomplete";
import { Link } from "react-router-dom";
import LayoutNoFooter from "../Components/Layout/LayoutNoFooter";
import { Container, Row, Col, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import "../Assets/styles/LogIn/style.css";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import useAuth from "hooks/useAuth";

const baseList = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "aol.com",
  "msn.com",
  "proton.me",
];

const LogIn = () => {

  const {
    loginFormData,
    loginFormLoading,
    googleLoginLoading,
    showPassword,
    handleChange,
    handleChangeEmail,
    loginSubmit,
    login,
    setShowPassword,
    redirect_to,
    isLoggedIn
  } = useAuth();

  return (
    <LayoutNoFooter>
      <section id="login" className="d-flex align-items-center">
        <Container fluid>
          <Row style={{ minHeight: "100vh" }}>
            <Col
              id="login-column"
              lg="12"
              className="d-flex flex-column justify-content-center"
            >
              <div className="login-container">
                <h1 className="text-center">Sign in to Kouture Konect</h1>
                <p className="text-center small fs-15 mb-0">
                  Join Kouture Konect to view more Designers, Designs and
                  Fabrics!
                </p>
                {googleLoginLoading ? (
                  <Button
                    className="custom-hover-btn-google w-100 mt-4 mb-1"
                    variant="secondary"
                    type="button"
                  >
                    Logging in with Google...
                  </Button>
                ) : (
                  <Button
                    className="custom-hover-btn-google w-100 mt-4 mb-1"
                    variant="secondary"
                    type="button"
                    onClick={login}
                  >
                    <FcGoogle size={30} className="mx-2" />
                    Continue with Google
                  </Button>
                )}
                <div className="custom-divider">or</div>
                <Form onSubmit={loginSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Email
                      baseList={baseList}
                      refineList={domains}
                      onChange={(e) => handleChangeEmail(e)} // or (newValue) => customSetter(newValue)
                      value={loginFormData.email}
                      className="form-control mr-sm-2 email-suggestion custom-form"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <div className="show-password">
                      <FormControl
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={loginFormData.password}
                        className="mr-sm-2 custom-form"
                        onChange={handleChange}
                        required
                      />
                      {showPassword ? (
                        <IoEyeOutline
                          className="form-input-icon cursor-pointer hi-eye off-eye"
                          onClick={function () {
                            setShowPassword(false);
                          }}
                        />
                      ) : (
                        <IoEyeOffOutline
                          className="form-input-icon cursor-pointer hi-eye-off off-eye"
                          onClick={function () {
                            setShowPassword(true);
                          }}
                        />
                      )}
                    </div>
                  </Form.Group>
                  <a href="/forgot-password" className="forgot-password fs-16">
                    Forgot your password?
                  </a>
                  {loginFormLoading ? (
                    <Button
                      className="w-100 mt-4"
                      variant="primary"
                      type="button"
                    >
                      Signing in...
                    </Button>
                  ) : (
                    <Button
                      className="w-100 mt-4"
                      variant="primary"
                      type="submit"
                    >
                      Sign in
                    </Button>
                  )}
                  <p className="mb-0 mt-4 text-center fs-14">
                    Don&apos;t have an account?{" "}
                    <Link
                      className="sign-up"
                      to={`/sign-up?redirect_to=${encodeURIComponent(
                        redirect_to
                      )}`}
                    >
                      Sign Up
                      {isLoggedIn ?'true':'false'}
                    </Link>
                  </p>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </LayoutNoFooter>
  );
};

export default LogIn;
