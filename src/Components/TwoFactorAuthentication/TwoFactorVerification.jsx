import { useEffect, useState } from "react";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { FaLock } from "react-icons/fa6";
import toast from "react-hot-toast";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSearchParams } from "react-router-dom";
import {
  useRegenerate2FAMutation,
  useTwoFALoginMutation,
} from "store/api/mutations";
import useAuth from "hooks/useAuth";

const initialFormDataLogin = Object.freeze({
  email: "",
});

const TwoFactorVerification = () => {
  const { loginLogic } = useAuth({ blockPage: true });

  const [regenerate2FA, { isLoading: isResending }] =
    useRegenerate2FAMutation();

  const [TwoFALogin, { isLoading: isLoggingIn }] = useTwoFALoginMutation();

  const [searchParams] = useSearchParams();
  const TwoFAOptions = searchParams.get("2FA");
  const email = searchParams.get("email");

  const [formDataLogin, setFormDataLogin] = useState(initialFormDataLogin);
  const [twoFactor, setTwoFactor] = useState("both");
  const [cloneTwoFactor, setCloneTwoFactor] = useState("both");

  useEffect(() => {
    const value = TwoFAOptions.includes("SMS") ? "both" : "email";
    setTwoFactor(value);
    setCloneTwoFactor(value);
  }, []);
  const location = useLocation();
  const searchParamss = new URLSearchParams(location.search);

  const redirect_to = searchParamss.get("redirect_to") || "";

  const handleChangeLogin = (e) => {
    setFormDataLogin({
      ...formDataLogin,
      [e.target.name]: e.target.value,
    });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();

    const { data } = await TwoFALogin({ code: formDataLogin.otp });
    if (data.success) {
      toast.success(data.message);
      loginLogic(data.data, redirect_to);
    }
  };

  const emailAuthenticationClick = async () => {
    setTwoFactor("email");
    const res = await regenerate2FA({ email, type: "EMAIL" });
    if (res.data.success) {
      toast.success(res.data.message);
    }
  };

  const smsAuthenticationClick = async () => {
    setTwoFactor("SMS");
    const res = await regenerate2FA({ email, type: "SMS" });
    if (res.data.success) {
      toast.success(res.data.message);
    }
  };

  return (
    <div>
      {twoFactor === "both" ? (
        <>
          <Row>
            <Col lg="12" className="text-center">
              <Form.Group className="mb-3 mt-4">
                <Card className="text-center">
                  <Card.Body>
                    <div className="py-3">
                      <Form.Label>Choose your 2FA method:</Form.Label>
                      <Row className="mt-3 justify-content-center">
                        <Form.Group as={Col} lg={3}>
                          <Button
                            style={{ minWidth: "auto" }}
                            onClick={() => emailAuthenticationClick()}
                            className="w-100 bg-gold tw-mb-5 lg:tw-mb-0 border-gold"
                            variant="secondary"
                            type="button"
                          >
                            Email
                          </Button>
                        </Form.Group>
                        <Form.Group as={Col} lg={3}>
                          <Button
                            style={{ minWidth: "auto" }}
                            onClick={() => smsAuthenticationClick()}
                            className="w-100 bg-black border-black"
                            variant="secondary"
                            type="button"
                          >
                            SMS
                          </Button>
                        </Form.Group>
                      </Row>
                    </div>
                  </Card.Body>
                </Card>
              </Form.Group>
            </Col>
          </Row>
        </>
      ) : twoFactor === "email" ? (
        <Form
          onSubmit={loginSubmit}
          style={{ marginTop: "30px" }}
          id="loginForm"
        >
          <Form.Group className="mb-3 mt-4">
            <Card>
              <Card.Body>
                <div className="py-3">
                  <Form.Label>
                    An email containing the OTP code has been sent to your
                    inbox. Please check your email for the code.
                  </Form.Label>
                  <Row className="mt-3 d-flex justify-content-center">
                    <div className="col-12">
                      <div
                        className="d-flex justify-content-between"
                        style={{ columnGap: "15px" }}
                      >
                        <div className="input-group border-light">
                          <span
                            className="input-group-text bg-light border-none"
                            id="basic-addon1"
                          >
                            <FaLock color="#A0A2A5" />
                          </span>
                          <input
                            type="text"
                            name="otp"
                            value={formDataLogin.otp}
                            className="form-control border-none bg-light ps-0"
                            style={{
                              marginRight: "1px",
                              borderTopRightRadius: "5px",
                              borderBottomRightRadius: "5px",
                            }}
                            onChange={handleChangeLogin}
                            placeholder="One Time Password"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            required
                          />
                        </div>
                        <div
                          className="d-flex justify-content-center"
                          style={{ columnGap: "8px" }}
                        >
                          {isResending ? (
                            // <div className="d-flex align-items-center" style={{ cursor: 'not-allowed', opacity: '0.5' }}>
                            //   <label className="mb-0 ms-1" style={{ cursor: 'not-allowed' }}>Resend&nbsp;</label>
                            // </div>
                            <Button
                              style={{
                                minWidth: "auto",
                                cursor: "not-allowed",
                                opacity: "0.5",
                              }}
                              assName="w-100 bg-gold border-gold"
                              variant="secondary"
                              type="button"
                            >
                              Resend
                            </Button>
                          ) : (
                            // <div className="d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={submitEmailCode}>
                            //   <label className="mb-0 ms-1" style={{ cursor: 'pointer' }}>Resend</label>
                            // </div>
                            <Button
                              style={{ minWidth: "auto" }}
                              onClick={() => emailAuthenticationClick()}
                              className="w-100 bg-gold border-gold"
                              variant="secondary"
                              type="button"
                            >
                              Resend
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Row>
                  <div className="mt-4 d-flex justify-content-center">
                    {isLoggingIn ? (
                      <Button
                        variant="primary"
                        className=""
                        type="button"
                        style={{ width: "-webkit-fill-available" }}
                      >
                        Signing in...
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        className=""
                        style={{ width: "-webkit-fill-available" }}
                        type="submit"
                      >
                        Sign in
                      </Button>
                    )}
                  </div>
                </div>
                {cloneTwoFactor === "both" && (
                  <p
                    className="mb-0 mt-3 text-center fs-14 text-dgray"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setTwoFactor("both");
                      setFormDataLogin(initialFormDataLogin);
                    }}
                  >
                    <IoIosArrowRoundBack /> Go back to 2FA method
                  </p>
                )}
              </Card.Body>
            </Card>
          </Form.Group>
        </Form>
      ) : (
        <Form
          onSubmit={loginSubmit}
          style={{ marginTop: "30px" }}
          id="loginForm"
        >
          <Form.Group className="mb-3 mt-4">
            <Card>
              <Card.Body>
                <div className="py-3">
                  <Form.Label>
                    A message containing the OTP code has been sent to your
                    phone. Please check your messages for the code.
                  </Form.Label>
                  <Row className="mt-3 d-flex justify-content-center">
                    <div className="col-12">
                      <div
                        className="d-flex justify-content-between"
                        style={{ columnGap: "15px" }}
                      >
                        <div className="input-group border-light">
                          <span
                            className="input-group-text bg-light border-none"
                            id="basic-addon1"
                          >
                            <FaLock color="#A0A2A5" />
                          </span>
                          <input
                            type="text"
                            name="otp"
                            value={formDataLogin.otp}
                            className="form-control border-none bg-light ps-0"
                            style={{
                              marginRight: "1px",
                              borderTopRightRadius: "5px",
                              borderBottomRightRadius: "5px",
                            }}
                            onChange={handleChangeLogin}
                            placeholder="One Time Password"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            required
                          />
                        </div>
                        <div
                          className="d-flex justify-content-center"
                          style={{ columnGap: "8px" }}
                        >
                          {isResending ? (
                            <Button
                              style={{
                                minWidth: "auto",
                                cursor: "not-allowed",
                                opacity: "0.5",
                              }}
                              className="w-100 bg-gold border-gold"
                              variant="secondary"
                              type="button"
                            >
                              Resend
                            </Button>
                          ) : (
                            <Button
                              style={{ minWidth: "auto" }}
                              onClick={() => smsAuthenticationClick()}
                              className="w-100 bg-gold border-gold"
                              variant="secondary"
                              type="button"
                            >
                              Resend
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Row>
                  <div className="mt-4 d-flex justify-content-center">
                    {isLoggingIn ? (
                      <Button
                        variant="primary"
                        className=""
                        type="button"
                        style={{ width: "-webkit-fill-available" }}
                      >
                        Signing in...
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        className=""
                        style={{ width: "-webkit-fill-available" }}
                        type="submit"
                      >
                        Sign in
                      </Button>
                    )}
                  </div>
                </div>
                {cloneTwoFactor === "both" && (
                  <p
                    className="mb-0 mt-3 text-center fs-14 text-dgray"
                    style={{ cursor: "pointer" }}
                    onClick={() => setTwoFactor("both")}
                  >
                    <IoIosArrowRoundBack /> Go back to 2FA method
                  </p>
                )}
              </Card.Body>
            </Card>
          </Form.Group>
        </Form>
      )}
    </div>
  );
};

export default TwoFactorVerification;
