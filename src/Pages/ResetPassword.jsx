import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import FormControl from "react-bootstrap/FormControl";
import "../Assets/styles/SignUp/style.css";
import axios from "axios";
import LayoutNoFooter from "../Components/Layout/LayoutNoFooter";

import toast from "react-hot-toast";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetFormLoading, setResetFormLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const resetPasswordSubmit = async (e) => {
    e.preventDefault();
    setResetFormLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_REACT_APP_API_ENDPOINT +
          "auth/password/reset/verify",
        {
          code: token,
          password,
          password_confirmation: confirmPassword,
        }
      );
      const success = response.data.success;
      if (success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.log("error", error);
      const errors = error.response.data.errors;
      errors.forEach((message) => {
        toast.error(message);
      });
      setResetFormLoading(false);
    } finally {
      setResetFormLoading(false);
    }
  };

  return (
    <LayoutNoFooter>
      <section id="reset-password" className="d-flex align-items-center">
        <Container fluid>
          <Row style={{ minHeight: "100vh" }}>
            <Col
              lg="12"
              className="d-flex flex-column justify-content-center py-4 mt-5 mb-5"
            >
              <div className="tw-px-10 tw-w-full tw-mx-auto sm:tw-w-1/2">
                <p className="tw-text-2xl tw-font-bold">Reset Password</p>
                <Form
                  style={{ marginTop: "30px" }}
                  onSubmit={resetPasswordSubmit}
                >
                  <Form.Group className="my-3">
                    <Form.Label className="fs-15">New Password</Form.Label>
                    <div className="show-password">
                      <FormControl
                        type={showPassword ? "text" : "password"}
                        name="password"
                        onChange={handleChangePassword}
                        className="mr-sm-2 custom-form"
                        required
                      />
                      {showPassword ? (
                        <IoEyeOutline
                          className="form-input-icon cursor-pointer hi-eye off-eye"
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <IoEyeOffOutline
                          className="form-input-icon cursor-pointer hi-eye-off off-eye"
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Confirm New Password</Form.Label>
                    <div className="show-password">
                      <FormControl
                        type={showConfirmPassword ? "text" : "password"}
                        name="password_confirmation"
                        onChange={handleChangeConfirmPassword}
                        className="mr-sm-2 custom-form"
                        required
                      />
                      {showConfirmPassword ? (
                        <IoEyeOutline
                          className="form-input-icon cursor-pointer hi-eye off-eye"
                          onClick={() => setShowConfirmPassword(false)}
                        />
                      ) : (
                        <IoEyeOffOutline
                          className="form-input-icon cursor-pointer hi-eye-off off-eye"
                          onClick={() => setShowConfirmPassword(true)}
                        />
                      )}
                    </div>
                  </Form.Group>
                  {resetFormLoading ? (
                    <Button
                      className="w-100 mt-4"
                      variant="primary"
                      type="submit"
                    >
                      Resetting Password...
                    </Button>
                  ) : (
                    <Button
                      className="w-100 mt-4"
                      variant="primary"
                      type="submit"
                    >
                      Reset Password
                    </Button>
                  )}
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </LayoutNoFooter>
  );
};

export default ResetPassword;
