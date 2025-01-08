import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "store/slices/userSlice";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetProfileQuery } from "store/api/queries";

const useAuth = () => {
  const [isLoggedIn, setisLoggedIn] = useState(false); // Example: check if user is logged in

  useGetProfileQuery(undefined, {
    skip: !isLoggedIn, // Skip the query if not logged in
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirect_to = searchParams.get("redirect_to") || "";

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [loginFormLoading, setLoginFormLoading] = useState(false);
  const [cookies, setCookie] = useCookies([
    "isLoggedIn",
    "userDetails",
    "userRole",
    "tempFavorites",
    "tempCart",
  ]);
  const [googleUser, setGoogleUser] = useState(null);
  const [googleProfile, setGoogleProfile] = useState(null);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleSignupProfile, setGoogleSignupProfile] = useState(null);
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const currentUser = useSelector((state) => state.user.user);

  const deviceId = cookies.device_id;

  const postEmailCode = async (data) => {
    return await axios.post(
      import.meta.env.VITE_REACT_APP_API_ENDPOINT + "email-2fa",
      data
    );
  };

  const postSMSCode = async (data) => {
    return await axios.post(
      import.meta.env.VITE_REACT_APP_API_ENDPOINT + "sms-2fa",
      data
    );
  };

  const handleChange = (e) => {
    setLoginFormData({
      ...loginFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeEmail = (e) => {
    setLoginFormData({
      ...loginFormData,
      email: e,
    });
  };

  const generateUniqueId = () => {
    const hexValues = "0123456789abcdef";
    let uuid = "";

    for (let i = 0; i < 36; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        uuid += "-";
      } else if (i === 14) {
        uuid += "4";
      } else if (i === 19) {
        uuid += hexValues[Math.floor(Math.random() * 4) + 8];
      } else {
        uuid += hexValues[Math.floor(Math.random() * 16)];
      }
    }

    const currentTime = Date.now().toString(16);
    uuid += `-${currentTime}`;

    return uuid.toUpperCase();
  };

  const submitEmailCode = async (email) => {
    let uniqueId = deviceId;

    if (deviceId === undefined) {
      uniqueId = await generateUniqueId();
      setCookie("device_id", uniqueId, { path: "/" });
    }

    postEmailCode({ email: email, device_id: uniqueId })
      .then((response) => {
        const success = response.data.status;
        if (success == "Success") {
          window.location.href =
            "/two-factor-authentication?redirect_to=" + redirect_to;
          setLoginFormLoading(false);
        } else {
          window.location.href =
            "/two-factor-authentication?redirect_to=" + redirect_to;
          setLoginFormLoading(false);
        }
      })
      .catch((error) => {
        alert(error);
        window.location.href =
          "/two-factor-authentication?redirect_to=" + redirect_to;
        setLoginFormLoading(false);
      });
  };

  const submitSMSCode = async (email) => {
    let uniqueId = deviceId;

    if (deviceId === undefined) {
      uniqueId = await generateUniqueId();
      setCookie("device_id", uniqueId, { path: "/" });
    }

    postSMSCode({ email: email, device_id: uniqueId })
      .then((response) => {
        const success = response.data.status;
        if (success == "Success") {
          window.location.href =
            "/two-factor-authentication?redirect_to=" + redirect_to;
          setLoginFormLoading(false);
        } else {
          window.location.href =
            "/two-factor-authentication?redirect_to=" + redirect_to;
          setLoginFormLoading(false);
        }
      })
      .catch((error) => {
        alert(error);
        window.location.href =
          "/two-factor-authentication?redirect_to=" + redirect_to;
        setLoginFormLoading(false);
      });
  };

  const submitTwoFactor = async (email) => {
    let uniqueId = deviceId;

    if (deviceId === undefined) {
      uniqueId = await generateUniqueId();
      setCookie("device_id", uniqueId, { path: "/" });
    }

    window.location.href =
      "/two-factor-authentication?redirect_to=" + redirect_to;
    setLoginFormLoading(false);
  };

  async function loginSubmit(e) {
    try {
      e.preventDefault();
      setLoginFormLoading(true);
      const { data } = await axios.post(
        import.meta.env.VITE_REACT_APP_API_ENDPOINT + "auth/login",
        loginFormData
      );
      if (data.success) {
        toast.success(data.message);
        const user = data.data.data;
        localStorage.setItem("kk-token", user.token);
        setCookie("email", data.email, { path: "/" });
        setCookie("userDetails", JSON.stringify(user), { path: "/" });

        delete user.token;
        dispatch(setUser(user));
        setisLoggedIn(true);
        if (data.data.proceed_to_login) {
          // toast.success("Please Update your profile");
        // give enough time for  rtk query

          setTimeout(() => {
            navigate("/user/profile");
          }, 2000);
        } else {
          toast.error("Two FA required");
        }
      }
    } catch (error) {
      console.log("error", error);
      const errors = error.response.data.errors;
      errors.forEach((message) => {
        toast.error(message);
      });
    } finally {
      setLoginFormLoading(false);
    }
  }

  async function createGoogleUser(e) {
    axios
      .post(
        import.meta.env.VITE_REACT_APP_API_ENDPOINT + "user/google/register",
        e
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
            setCookie("signup_type", user.signup_type, { path: "/" });
            setCookie("completed_questionnaire", user.completed_questionnaire, {
              path: "/",
            });
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
              navigate("/");
              setGoogleLoginLoading(false);
            }, 1000);
          }
        } else {
          const errors = response.data.errors;
          if (errors.email) {
            toast.error(errors.email[0]);
          }
          if (errors.password) {
            toast.error(errors.password[0]);
          } else {
            errors.map((error, index) => {
              toast.error(error);
              return null;
            });
          }
        }
        setLoginFormLoading(false);
      })
      .catch((error) => {
        setLoginFormLoading(false);
        toast.error("Something went wrong, please contact the administrator!");
      });
  }

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setGoogleUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (currentUser.email) {
      toast.error("You are already logged in!");
      if (currentUser.first_name != "") {
        navigate("/user/profile");
      }
      navigate("/");
    }
  }, []);

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
        .post(
          import.meta.env.VITE_REACT_APP_API_ENDPOINT +
            "user/email?device_id=" +
            deviceId,
          data
        )
        .then((response) => {
          const success = response.data.status;
          if (success == "Success") {
            const data = response.data.data;
            if (data) {
              const user = data.user;
              if (data?.two_factor_authentication == "Both") {
                setCookie("email", data.user.email, { path: "/" });
                setCookie("two_factor", "both", { path: "/" });
                submitTwoFactor(data.user.email);
              } else if (data?.two_factor_authentication == "Email") {
                setCookie("email", data.user.email, { path: "/" });
                setCookie("two_factor", "email", { path: "/" });
                submitEmailCode(data.user.email);
              } else if (data?.two_factor_authentication == "SMS") {
                setCookie("email", data.user.email, { path: "/" });
                setCookie("two_factor", "sms", { path: "/" });
                submitSMSCode(data.user.email);
              } else {
                if (user.designer) {
                  setCookie(
                    "currentUserDesigner",
                    JSON.stringify(user.designer.id),
                    { path: "/" }
                  );
                }
                if (user.seller) {
                  setCookie(
                    "currentUserSeller",
                    JSON.stringify(user.seller.id),
                    { path: "/" }
                  );
                }
                if (user.role == "Admin") {
                  toast.success("Successfully signed in!");
                  setCookie("currentUser", JSON.stringify(user.id), {
                    path: "/",
                  });
                  setCookie("userRole", JSON.stringify(user.role), {
                    path: "/",
                  });
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
                  setCookie("userRole", JSON.stringify(user.role), {
                    path: "/",
                  });
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
                    navigate("/");
                    setGoogleLoginLoading(false);
                  }, 1000);
                }
              }
            }
          } else {
            setGoogleSignupProfile(googleProfile);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [googleEmail]);

  return {
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
    isLoggedIn,
  };
};

export default useAuth;
