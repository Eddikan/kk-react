import { useEffect, useState } from "react";
import { Email, domains } from "@smastrom/react-email-autocomplete";
import { useGoogleLogin } from "@react-oauth/google";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LayoutNoFooter from "../Components/Layout/LayoutNoFooter";
import { Container, Row, Col, Button, Card, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import "../Assets/styles/SignUp/style.css";
import { useCookies } from "react-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import SignupTypeModal from "Components/Modals/SignupTypeModal";
import { setEmail } from "store/slices/userSlice"; // Adjust the path as necessary
import { useDispatch } from "react-redux";

const initialRegisterData = Object.freeze({
  email: "",
  password: "",
  password_confirmation: "",
  event_date: "",
  date_of_birth: "", // Add date of birth to initial state
});


const SignUp = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  let query = useQuery();
  const redirectTo = query.get("redirect_to") || "";

  const [cookies, setCookie] = useCookies([
    "currentUser",
    "isLoggedIn",
    "userDetails",
    "userRole",
    "tempFavorites",
    "tempCart",
    "tempFavorites",
  ]);

  const [signupType, setSignupType] = useState("customer");
  const [signupOption, setSignupOption] = useState(query.get("option"));
  const [registerFormData, setRegisterFormData] = useState(initialRegisterData);
  const [googleRegisterFormData, setGoogleRegisterFormData] = useState(null);
  const [registerFormLoading, setRegisterFormLoading] = useState(false);
  // Signup with Google
  const [loginFormLoading, setLoginFormLoading] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [googleProfile, setGoogleProfile] = useState(null);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleSignupProfile, setGoogleSignupProfile] = useState(null);
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [infoModalShow, setInfoModalShow] = useState(false);

  const currentUser = cookies.currentUser;
 
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (e) => {
    setRegisterFormData({
      ...registerFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeEmail = (e) => {
    setRegisterFormData({
      ...registerFormData,
      email: e,
    });
  };

  const getUser = async (e) => {
    return await axios.get(
      import.meta.env.VITE_REACT_APP_API_ENDPOINT + "user/" + e
    );
  };

  const getUserDetails = (e) => {
    getUser(e)
      .then((response) => {
        const selectedUser = response.data.data;
        if (selectedUser) {
          const user_details = {
            currentUser: selectedUser.id,
            id: selectedUser.id,
            first_name: selectedUser.first_name,
            last_name: selectedUser.last_name,
            image: selectedUser.image,
            email_verified_at: selectedUser.email_verified_at,
          };
          setCookie("userDetails", JSON.stringify(user_details), { path: "/" });
          setCookie("signup_type", selectedUser.signup_type, { path: "/" });

          if (selectedOption === "Yes") {
            if (signupType === "designer") {
              navigate("/user/designer-form");
            } else if (signupType === "seller") {
              navigate("/user/seller-form");
            } else if (signupType === "designer_seller") {
              navigate("/user/designer-form?type=designer_seller");
            } else if (signupType === "customer") {
              // handle custome for now
              navigate("/user/preferences");
            } else {
              navigate("/sign-up/preferences");
            }
          } else {
            if (redirectTo && (redirectTo != "") & (redirectTo != null)) {
              if (signupOption && signupOption != "") {
                navigate("/" + signupOption);
              } else {
                navigate(redirectTo);
              }
            } else {
              if (signupOption && signupOption != "") {
                navigate("/" + signupOption);
              } else {
                navigate("/sign-up/preferences");
              }
            }
          }
        } else {
          const message =
            "There has been an error getting the user, please try again!";
          toast.error(message);
        }
      })
      .catch((error) => {
        console.log(error);
        const message =
          "There has been an error getting the user, please try again!";
        toast.error(message);
      });
  };

  async function addTempCartToCart(data) {
    // setReorderLoading(true);
    axios
      .post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + "cart/bulk", {
        order_items: data.order_items,
        user_id: data.user_id,
      })
      .then((response) => {
        const success = response.data.status;
        if (success == "Success") {
          const data = response.data.data;
          console.log(data);
        } else {
          const errors = response.data.errors;
          errors.map((error) => {
            toast.error(error);
            return null; // React requires a return value, so we return null here
          });
        }
        // setReorderLoading(false);
      })
      .catch((error) => {
        console.log(error);
        // setReorderLoading(false);
        toast.error("Something went wrong, please contact the administrator!");
      });
  }

  async function addTempFavoritesToFavorites(data) {
    // setReorderLoading(true);
    axios
      .post(
        import.meta.env.VITE_REACT_APP_API_ENDPOINT +
          "portfolio/item/wishlist/bulk",
        { favorites: data.favorites, user_id: data.user_id }
      )
      .then((response) => {
        const success = response.data.status;
        if (success == "Success") {
          const data = response.data.data;
          console.log("data", data);
        } else {
          const errors = response.data.errors;
          errors.map((error) => {
            toast.error(error);
            return null; // React requires a return value, so we return null here
          });
        }
        // setReorderLoading(false);
      })
      .catch((error) => {
        console.log(error);
        // setReorderLoading(false);
        toast.error("Something went wrong, please contact the administrator!");
      });
  }

  async function registerSubmit(e) {
    e.preventDefault();
    setRegisterFormLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_REACT_APP_API_ENDPOINT + "auth/register",

        {
          type: signupType, // Accepts types: seller, designer, customer, designer_and_seller
          email: registerFormData.email,
          password: registerFormData.password,
          password_confirmation: registerFormData.password_confirmation,
          date_of_birth: registerFormData.date_of_birth,
        }
      );
      console.log("respons eis", response);
      const success = response.data.success;
      if (success) {
        // dispatch email here

        dispatch(setEmail(response.data.data.email));
        toast.success(response.data.message);
      }
    } catch (error) {
      const errors = error.response.data.errors;
      // eslint-disable-next-line no-unused-vars
      Object.entries(errors).forEach(([_, messages]) => {
        messages.forEach((message) => {
          toast.error(message); // Use your preferred toast type (e.g., success, warning, error)
        });
      });
      setRegisterFormLoading(false);
    } finally {
      setRegisterFormLoading(false);
    }
  }

  const isValidEmail = (email) => {
    const emailregex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    return emailregex.test(email);
  };

  useEffect(() => {
    if (currentUser && currentUser !== "") {
      // toast.error("You are already logged in!");
      if (signupType == "customer") {
        navigate("/");
      } else if (signupType == "designer") {
        navigate("/user/center/calendar");
      } else if (signupType == "seller") {
        navigate("/user/center/calendar");
      } else if (signupType == "designer_seller") {
        navigate("/user/center/calendar");
      } else {
        navigate("/user/center/calendar");
      }
    }

    let signupTypeOption = "";
    if (signupType == "designer") {
      signupTypeOption = "designer";
    } else if (signupType == "seller") {
      signupTypeOption = "seller";
    } else if (signupType == "designer_seller") {
      signupTypeOption = "designer_seller";
    } else {
      signupTypeOption = signupType;
    }

    setRegisterFormData({
      ...registerFormData,
      signup_type: signupTypeOption,
      is_designer:
        signupType == "designer" || signupType == "designer_seller" ? 1 : 0,
      is_seller:
        signupType == "seller" || signupType == "designer_seller" ? 1 : 0,
    });

    setGoogleRegisterFormData({
      ...googleRegisterFormData,
      signup_type: signupTypeOption,
      is_designer:
        signupType == "designer" || signupType == "designer_seller" ? 1 : 0,
      is_seller:
        signupType == "seller" || signupType == "designer_seller" ? 1 : 0,
    });
  }, []);

  const baseList = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "aol.com",
    "msn.com",
    "proton.me",
  ];

  async function createGoogleUser(e) {
    axios
      .post(
        import.meta.env.VITE_REACT_APP_API_ENDPOINT + "user/google/register",
        { ...e, ...googleRegisterFormData }
      )
      .then((response) => {
        const success = response.data.status;
        if (success == "Success") {
          const data = response.data.data;
          const user = data.user;
          if (user.designer) {
            setCookie("currentUserDesigner", JSON.stringify(user.designer.id), {
              path: "/",
            });
          }
          if (user.seller) {
            setCookie("currentUserSeller", JSON.stringify(user.seller.id), {
              path: "/",
            });
          }
          if (user.role == "Admin") {
            toast.success("Successfully signed in!");
            setCookie("currentUser", JSON.stringify(user.id), { path: "/" });
            setCookie("userRole", JSON.stringify(user.role), { path: "/" });
            const user_details = {
              currentUser: user.id,
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              image: user.image,
              email_verified_at: user.email_verified_at,
              signup_type: user.signup_type,
              email: user.email,
              is_seller: user.is_seller,
              is_designer: user.is_designer,
            };
            setCookie("userDetails", JSON.stringify(user_details), {
              path: "/",
            });
            setCookie("isLoggedIn", true, { path: "/" });
            setCookie("token", data.token, { path: "/" });
            setTimeout(function () {
              navigate("/admin/users");
              setGoogleLoginLoading(false);
            }, 1000);
          } else {
            toast.success("Successfully signed in!");
            setCookie("currentUser", JSON.stringify(user.id), { path: "/" });
            setCookie("userRole", JSON.stringify(user.role), { path: "/" });
            const user_details = {
              currentUser: user.id,
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              image: user.image,
              email_verified_at: user.email_verified_at,
              signup_type: user.signup_type,
              email: user.email,
              is_seller: user.is_seller,
              is_designer: user.is_designer,
              shop_completed: user.shop_completed,
              profile_completeness: user.profile_completeness,
            };
            setCookie("userDetails", JSON.stringify(user_details), {
              path: "/",
            });
            setCookie("isLoggedIn", true, { path: "/" });
            setCookie("token", data.token, { path: "/" });
            setCookie("signup_type", user.signup_type, { path: "/" });
            setCookie("completed_questionnaire", user.completed_questionnaire, {
              path: "/",
            });
            setCookie("token", data.token, { path: "/" });
            setTimeout(function () {
              getUserDetails(user.id);
              setGoogleLoginLoading(false);
            }, 500);
          }
        } else {
          const errors = response.data.errors;
          if (errors.email) {
            toast.error(errors.email[0]);
          }
          if (errors.password) {
            toast.error(errors.password[0]);
          } else {
            errors.map((error) => {
              toast.error(error);
              return null; // React requires a return value, so we return null here
            });
          }
        }
        setLoginFormLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoginFormLoading(false);
        toast.error("Something went wrong, please contact the administrator!");
      });
  }

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setGoogleUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (googleUser) {
      setGoogleLoginLoading(true);
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleUser.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${googleUser.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setGoogleProfile(res.data);
          setGoogleEmail(res.data.email);
        })
        .catch((err) => console.log(err));
    }
  }, [googleUser]);

  useEffect(() => {
    if (googleSignupProfile) {
      createGoogleUser(googleSignupProfile);
    }
  }, [googleSignupProfile]);

  useEffect(() => {
    if (googleEmail) {
      const data = {
        email: googleEmail,
      };
      axios
        .post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + "user/email", data)
        .then((response) => {
          const success = response.data.status;
          if (success == "Success") {
            const data = response.data.data;
            if (data) {
              const user = data.user;
              if (user.designer) {
                setCookie(
                  "currentUserDesigner",
                  JSON.stringify(user.designer.id),
                  { path: "/" }
                );
              }
              if (user.seller) {
                setCookie("currentUserSeller", JSON.stringify(user.seller.id), {
                  path: "/",
                });
              }
              if (user.role == "Admin") {
                toast.success("Successfully signed in!");
                setCookie("currentUser", JSON.stringify(user.id), {
                  path: "/",
                });
                setCookie("userRole", JSON.stringify(user.role), { path: "/" });
                const user_details = {
                  currentUser: user.id,
                  id: user.id,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  image: user.image,
                  email_verified_at: user.email_verified_at,
                  signup_type: user.signup_type,
                  email: user.email,
                  is_seller: user.is_seller,
                  is_designer: user.is_designer,
                };
                setCookie("userDetails", JSON.stringify(user_details), {
                  path: "/",
                });

                setCookie(
                  "userCurrency",
                  JSON.stringify(user.currency ?? "USD"),
                  { path: "/" }
                );
                setCookie(
                  "userCurrencyCode",
                  JSON.stringify(user.currency_code ?? "$"),
                  { path: "/" }
                );

                setCookie("isLoggedIn", true, { path: "/" });
                setCookie("token", data.token, { path: "/" });
                setCookie("signup_type", user.signup_type, { path: "/" });
                setCookie(
                  "completed_questionnaire",
                  user.completed_questionnaire,
                  { path: "/" }
                );
                setCookie("token", data.token, { path: "/" });
                setTimeout(function () {
                  navigate("/admin/users");
                  setGoogleLoginLoading(false);
                }, 1000);
              } else {
                toast.success("Successfully signed in!");
                setCookie("currentUser", JSON.stringify(user.id), {
                  path: "/",
                });
                setCookie("userRole", JSON.stringify(user.role), { path: "/" });
                const user_details = {
                  currentUser: user.id,
                  id: user.id,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  image: user.image,
                  email_verified_at: user.email_verified_at,
                  signup_type: user.signup_type,
                  email: user.email,
                  is_seller: user.is_seller,
                  is_designer: user.is_designer,
                  shop_completed: user.shop_completed,
                  profile_completeness: user.profile_completeness,
                };
                setCookie("userDetails", JSON.stringify(user_details), {
                  path: "/",
                });

                setCookie(
                  "userCurrency",
                  JSON.stringify(user.currency ?? "USD"),
                  { path: "/" }
                );
                setCookie(
                  "userCurrencyCode",
                  JSON.stringify(user.currency_code ?? "$"),
                  { path: "/" }
                );

                setCookie("isLoggedIn", true, { path: "/" });
                setCookie("token", data.token, { path: "/" });
                setCookie("signup_type", user.signup_type, { path: "/" });
                setCookie(
                  "completed_questionnaire",
                  user.completed_questionnaire,
                  { path: "/" }
                );
                setCookie("token", data.token, { path: "/" });
                setTimeout(function () {
                  getUserDetails(user.id);
                  setGoogleLoginLoading(false);
                }, 500);
              }
            }
          } else {
            setGoogleSignupProfile(googleProfile);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [googleEmail]);

  useEffect(() => {
    if (
      signupType == "seller" ||
      signupType == "designer" ||
      signupType == "designer_seller"
    ) {
      setSelectedOption("Yes");
    } else if (signupType == "customer") {
      setSelectedOption("No");
    }
  }, [signupType]);
  const [registerModalShow, setRegisterModalShow] = useState(true);

  return (
    <LayoutNoFooter>
      <section id="signup" className="d-flex align-items-center">
        <Container fluid>
          <Row style={{ minHeight: "100vh" }}>
            <Col
              lg="12"
              className="d-flex flex-column justify-content-center py-4 mt-5 mb-5"
            >
              <div className="sign-up-container">
                {/* <Link to="/">
                  <img src={KoutureLogo} className="kouture-icon" alt="Kouture Konect" />
                </Link> */}
                <>
                  <h1 className="text-center">Sign up to Kouture Konect</h1>
                  <p className="text-center small fs-15 mb-0">
                    Join Kouture Konect to view more Designers, Designs and
                    Fabrics!
                  </p>
                  {googleLoginLoading ? (
                    <Button
                      className="custom-hover-btn-google w-100 mt-5"
                      variant="secondary"
                      type="button"
                    >
                      Signing up using Google...
                    </Button>
                  ) : (
                    <Button
                      className="custom-hover-btn-google w-100 mt-5 px-5 "
                      type="button"
                      onClick={login}
                    >
                      <FcGoogle size={30} className="mx-2" />
                      Continue with Google
                    </Button>
                  )}
                  <p
                    className="text-muted fs-12 mt-2"
                    style={{ lineHeight: 1.2, fontFamily: "ProximaNova" }}
                  >
                    By clicking Continue with Google, you agree to Kouture
                    Konect’s Terms of Use and Privacy Policy.
                  </p>
                  {/* <div className="divider-small mb-4 mt-3"></div> */}
                  <div className="custom-divider">or</div>
                </>
                <Form style={{ marginTop: "30px" }} onSubmit={registerSubmit}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label className="fs-15">Email Address</Form.Label>
                    <Email
                      baseList={baseList}
                      refineList={domains}
                      onChange={(e) => handleChangeEmail(e)} // or (newValue) => customSetter(newValue)
                      value={registerFormData.email}
                      className="form-control mr-sm-2 email-suggestion custom-form"
                      required
                    />
                    {/* <FormControl type='email' name='email' onChange={handleChange} className='mr-sm-2' required /> */}
                  </Form.Group>
                  {registerFormData.email &&
                    registerFormData.email != "" &&
                    !isValidEmail(registerFormData.email) && (
                      <div className="text-danger mt-0 fs-12">
                        Please enter a valid Email Address.
                      </div>
                    )}
                  <Form.Group className="my-3">
                    <Form.Label className="fs-15">Password</Form.Label>
                    <div className="show-password">
                      <FormControl
                        type={showPassword ? "text" : "password"}
                        name="password"
                        onChange={handleChange}
                        className="mr-sm-2 custom-form"
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
                  <Form.Group className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <div className="show-password">
                      <FormControl
                        type={showConfirmPassword ? "text" : "password"}
                        name="password_confirmation"
                        onChange={handleChange}
                        className="mr-sm-2 custom-form"
                        required
                      />
                      {showConfirmPassword ? (
                        <IoEyeOutline
                          className="form-input-icon cursor-pointer hi-eye off-eye"
                          onClick={function () {
                            setShowConfirmPassword(false);
                          }}
                        />
                      ) : (
                        <IoEyeOffOutline
                          className="form-input-icon cursor-pointer hi-eye-off off-eye"
                          onClick={function () {
                            setShowConfirmPassword(true);
                          }}
                        />
                      )}
                    </div>
                  </Form.Group>
                  {signupType !== "customer" && (
                    <Form.Group className="mb-4">
                      <Form.Label>Date of Birth</Form.Label>
                      <FormControl
                        type="date"
                        name="date_of_birth"
                        onChange={handleChange}
                        className="mr-sm-2 custom-form"
                        required={signupType !== "customer"}
                      />
                    </Form.Group>
                  )}

                  <div
                    className="alert alert-primary bg-white text-black mb-0 small lh-1-7 fs-12"
                    style={{ lineHeight: 1.3 }}
                    role="alert"
                  >
                    As part of our ongoing commitment to security and user
                    safety, we are requiring users to provide a valid
                    identification document for access to certain enhanced
                    features on our platform.
                  </div>
                  {registerFormLoading ? (
                    <Button
                      className="w-100 mt-4"
                      variant="primary"
                      type="submit"
                    >
                      Signing up...
                    </Button>
                  ) : (
                    <Button
                      className="w-100 mt-4"
                      variant="primary"
                      type="submit"
                      disabled={!isValidEmail(registerFormData.email)}
                    >
                      Sign up
                    </Button>
                  )}

                  <p className="mb-0 mt-4 text-center fs-14 text-black">
                    Already have an account?{" "}
                    <Link
                      className="login"
                      to={`/login?redirect_to=${encodeURIComponent(
                        redirectTo
                      )}`}
                    >
                      Log In
                    </Link>
                  </p>
                </Form>
              </div>
            </Col>
            {/* <Col lg="4" className='with-bg'>
            </Col> */}
          </Row>
        </Container>
      </section>
      <SignupTypeModal
        registerModalShow={registerModalShow}
        setRegisterModalShow={setRegisterModalShow}
        setSignupType={setSignupType}
      />
      <Modal
        show={infoModalShow}
        fullscreen={false}
        onHide={() => setInfoModalShow(false)}
      >
        <Modal.Header closeButton className="pb-0">
          &nbsp;
          {/* <Modal.Title><h5 className='modal-title text-left rufina-family fs-22'>Can Minors Sell on Kouture Konect?</h5></Modal.Title> */}
        </Modal.Header>
        <Modal.Body className="pt-0">
          <h2 className="modal-title fs-25 fw-600 pb-2 text-center">
            Can Minors Sell on Kouture Konect?
          </h2>
          <Card>
            <Card.Body className="bg-lgray">
              <Row className="h-100">
                <Col lg="12">
                  <p>
                    Kouture Konect welcomes minors between the ages of 13 and 17
                    to buy and sell on Kouture Konect as long as you have the
                    permission and direct supervision of your parent or legal
                    guardian.{" "}
                  </p>
                  <p>
                    Your parent or legal guardian must register for the account
                    with their information, and they&apos;re responsible for any
                    and all of your activity on the account. All Kouture Konect
                    account owners must be at least 18 years of age, as stated
                    in Kouture kopeck&apos;s{" "}
                    <a href="/about-kouture-konect">Terms of Use</a>.{" "}
                  </p>
                  <p>The account you use must meet the following criteria:</p>
                  <ul className="mb-0">
                    <li className="mb-2">
                      All financial information on the account must be under the
                      parent or legal guardian&apos;s name.
                    </li>
                    <li className="mb-2">
                      The preferred name on the account must be the parent or
                      legal guardian&apos;s name.
                    </li>
                    <li className="mb-2">
                      All shop members must be listed in the shop&apos;s{" "}
                      <a href="/about-kouture-konect">About section</a>, and
                      your parent or legal guardian must be the shop owner.
                    </li>
                    <li className="mb-1">
                      The email address on the account must belong to the parent
                      or legal guardian.
                    </li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    </LayoutNoFooter>
  );
};

export default SignUp;
