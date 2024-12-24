import React, { useEffect, useState } from 'react';
import { Email, domains } from '@smastrom/react-email-autocomplete';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import { FaLock } from "react-icons/fa6";
import { IoIosArrowRoundBack } from "react-icons/io";
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import 'Assets/styles/LogIn/style.css';
import GoogleIcon from 'Assets/images/google-icon.png';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import KoutureLogo from 'Assets/images/kouture-konect-icon.png';

const initialLoginData = Object.freeze({
    email: '',
    password: ''
});

const LogIn = ({ props, showSignup, onCloseModal }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Parse search string to get query parameters
    const searchParams = new URLSearchParams(location.search);

    // Access individual query parameters using get method
    const redirect_to = searchParams.get('redirect_to');

    const [loginFormData, setLoginFormData] = useState(initialLoginData);
    const [loginFormLoading, setLoginFormLoading] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'tempFavorites', 'tempCart']);
    const [googleUser, setGoogleUser] = useState(null);
    const [googleProfile, setGoogleProfile] = useState(null);
    const [googleEmail, setGoogleEmail] = useState('');
    const [googleSignupProfile, setGoogleSignupProfile] = useState(null);
    const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
    const [tempCart, setTempCart] = useState(cookies.tempCart ?? []);
    const [tempFavorites, setTempFavorites] = useState(cookies.tempFavorites ?? []);
    const [twoFactor, setTwoFactor] = useState('');
    const [cloneTwoFactor, setCloneTwoFactor] = useState('');
    const [email, setEmail] = useState('');

    const [formDataLogin, setFormDataLogin] = useState(initialLoginData);
    const [formStatus, setFormStatus] = useState('standby');
    const [reloadCount, setReloadCount] = useState(1);

    const [timer, setTimer] = useState(0);
    const [showTimer, setShowTimer] = useState(false);
    const [showSendCode, setShowSendCode] = useState(false);

    const currentUser = cookies.currentUser;
    const isLoggedIn = cookies.isLoggedIn;
    const userDetails = cookies.userDetails;
    const userRole = cookies.userRole;
    const token = cookies.token;
    const deviceId = cookies.device_id;

    const postEmailCode = async (data) => {
        return await axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'email-2fa', data);
    };

    const postSMSCode = async (data) => {
        return await axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'sms-2fa', data);
    };

    const postLogin = async (data) => {
        return await axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'login-2fa?device_id=' + deviceId, data);
    };

    const postSMSLogin = async (data) => {
        return await axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'login-sms-2fa?device_id=' + deviceId, data);
    };

    const handleChange = (e) => {
        setLoginFormData({
            ...loginFormData,
            [e.target.name]: e.target.value,
        })
    }

    const handleChangeEmail = (e) => {
        setLoginFormData({
            ...loginFormData,
            email: e,
        })
    };

    const handleChangeLogin = (e) => {
        setFormDataLogin({
            ...formDataLogin, [e.target.name]: e.target.value,
        });
    }

    const getUserCartItems = async (e) => {
        return await axios.get(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'user/' + e + '/cart');
    };

    async function addTempCartToCart(data) {
        // setReorderLoading(true);
        axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'cart/bulk', { order_items: data.order_items, user_id: data.user_id }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                getUserCartItems(data.user_id).then((response) => {
                    const cartItemsData = response.data.data;
                    if (cartItemsData) {
                        setTimeout(function(){
                            props.onLogin({user_id: data.user_id, cart_items: cartItemsData});
                        }, 1000)
                    } else {
                        toast.error('There has been an error getting the cart items, please try again!');
                    }
                })
                .catch((error) => {
                    toast.error('There has been an error getting the cart items, please try again!');
                });

            } else {
                const errors = response.data.errors;
                errors.map((error, index) => {
                    toast.error(error);
                    return null; // React requires a return value, so we return null here
                });
            }
            // setReorderLoading(false);
        }).catch((error) => {
            // setReorderLoading(false);
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    async function addTempFavoritesToFavorites(data) {
        // setReorderLoading(true);
        axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'portfolio/item/wishlist/bulk', { favorites: data.favorites, user_id: data.user_id }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                const data = response.data.data;
            } else {
                const errors = response.data.errors;
                errors.map((error, index) => {
                    toast.error(error);
                    return null; // React requires a return value, so we return null here
                });
            }
            // setReorderLoading(false);
        }).catch((error) => {
            // setReorderLoading(false);
            toast.error('Something went wrong, please contact the administrator!');
        });
    }


    const resendEmailCode = () => {
        setShowSendCode(true);

        let uniqueId = deviceId;

        if (deviceId === undefined) {
            uniqueId = generateUniqueId();
            setCookie('device_id', uniqueId, { path: '/' });
        }

        postEmailCode({ email: email, device_id: uniqueId }).then(response => {
            const success = response.data.status;
            if (success === "Success") {
                toast.success('Send Code Successfully!');
                startTimer();
            } else {
                setShowSendCode(false);
                toast.error('Something went wrong, please contact the administrator!');
            }
        }).catch((error) => {
            alert(error);
            setShowSendCode(false);
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    const resendPhoneCode = async () => {
        setShowSendCode(true);

        let uniqueId = deviceId;

        if (deviceId === undefined) {
            uniqueId = await generateUniqueId();
            setCookie('device_id', uniqueId, { path: '/' });
        }

        postSMSCode({ email: email, device_id: uniqueId }).then(response => {
            const success = response.data.status;
            const errors = response.data.errors;
            if (success === "Success") {
                toast.success('Send Code Successfully!');
                startTimer();
            } else if (errors === "Phone number does not exist") {
                setShowSendCode(false);
                toast.error('Phone number does not exist!');
            } else if (errors === "Failed to send SMS") {
                setShowSendCode(false);
                toast.error('Failed to send SMS!');
            } else {
                setShowSendCode(false);
                toast.error('Something went wrong, please contact the administrator!');
            }
        }).catch((error) => {
            alert(error);
            setShowSendCode(false);
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    useEffect(() => {
        let interval;
        if (showTimer) {
            interval = setInterval(() => {
                setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [showTimer]);

    const startTimer = () => {
        setTimer(60);
        setShowTimer(true);
        setTimeout(() => setShowTimer(false), 60000);
        setShowSendCode(false);
    };

    const generateUniqueId = () => {
        const hexValues = '0123456789abcdef';
        let uuid = '';

        for (let i = 0; i < 36; i++) {
            if (i === 8 || i === 13 || i === 18 || i === 23) {
                uuid += '-';
            } else if (i === 14) {
                uuid += '4';
            } else if (i === 19) {
                uuid += hexValues[(Math.floor(Math.random() * 4) + 8)];
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
            setCookie('device_id', uniqueId, { path: '/' });
        }

        postEmailCode({ email: email, device_id: uniqueId }).then(response => {
            const success = response.data.status;
            if (success == "Success") {
                setLoginFormLoading(false);
            } else {
                setLoginFormLoading(false);
            }
        }).catch((error) => {
            alert(error);
            setLoginFormLoading(false);
        });
    }

    const submitSMSCode = async (email) => {

        let uniqueId = deviceId;

        if (deviceId === undefined) {
            uniqueId = await generateUniqueId();
            setCookie('device_id', uniqueId, { path: '/' });
        }

        postSMSCode({ email: email, device_id: uniqueId }).then(response => {
            const success = response.data.status;
            if (success == "Success") {
                setLoginFormLoading(false);
            } else {
                setLoginFormLoading(false);
            }
        }).catch((error) => {
            alert(error);
            setLoginFormLoading(false);
        });
    }

    const submitTwoFactor = async (email) => {

        let uniqueId = deviceId;

        if (deviceId === undefined) {
            uniqueId = await generateUniqueId();
            setCookie('device_id', uniqueId, { path: '/' });
        }

        setLoginFormLoading(false);
    }

    const loginEmailSubmit = (e) => {
        e.preventDefault();
        setFormStatus('loading');
        postLogin({ ...formDataLogin, email: email }).then(response => {
            const success = response.data.status;
            const errors = response.data.errors;
            setFormStatus('standby');
            setReloadCount(reloadCount + 1);
            setFormDataLogin(initialLoginData);
            if (success == "Success") {
                const result = response.data.data;
                const data = response.data.data;
                const user = result.user;

                if (tempCart && tempCart.length > 0) {
                    addTempCartToCart({ order_items: tempCart, user_id: user.id });
                    removeCookie('tempCart', { path: '/' });
                }

                if (tempFavorites && tempFavorites.length > 0) {
                    addTempFavoritesToFavorites({ favorites: tempFavorites, user_id: user.id });
                    removeCookie('tempFavorites', { path: '/' });
                }

                onCloseModal(false);

                if (user.designer) {
                    setCookie('currentUserDesigner', JSON.stringify(user.designer.id), { path: '/' });
                }
                if (user.seller) {
                    setCookie('currentUserSeller', JSON.stringify(user.seller.id), { path: '/' });
                }
                if (user.role == 'Admin') {
                    toast.success('Successfully signed in!');
                    setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
                    setCookie('userRole', JSON.stringify(user.role), { path: '/' });
                    const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer }
                    setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                    setCookie('isLoggedIn', true, { path: '/' });
                    setCookie('token', data.token, { path: '/' });
                    setCookie('signup_type', user.signup_type, { path: '/' });
                    setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
                    setCookie('token', data.token, { path: '/' });
                } else {
                    toast.success('Successfully signed in!');
                    setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
                    setCookie('userRole', JSON.stringify(user.role), { path: '/' });
                    const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer, shop_completed: user.shop_completed, profile_completeness: user.profile_completeness }
                    setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                    setCookie('isLoggedIn', true, { path: '/' });
                    setCookie('token', data.token, { path: '/' });
                    setCookie('signup_type', user.signup_type, { path: '/' });
                    setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
                    setCookie('token', data.token, { path: '/' });
                }
            } else if (errors == 'OTP expired') {
                toast.error('OTP expired!');
            } else if (errors == 'OTP does not exist') {
                toast.error('OTP authentication failed!');
            } else {
                setFormStatus('standby');
                toast.error('OTP does not exist!');
            }
        }).catch((error) => {
            alert(error);
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    const loginSMSSubmit = (e) => {
        e.preventDefault();
        setFormStatus('loading');
        postSMSLogin({ otp: formDataLogin.otp, email: email }).then(response => {
            const success = response.data.status;
            const errors = response.data.errors;
            setFormStatus('standby');
            setReloadCount(reloadCount + 1);
            if (success == "Success") {
                setFormDataLogin(initialLoginData);
                const result = response.data.data;
                const data = response.data.data;
                const user = result.user;

                if (tempCart && tempCart.length > 0) {
                    addTempCartToCart({ order_items: tempCart, user_id: user.id });
                    removeCookie('tempCart', { path: '/' });
                }

                if (tempFavorites && tempFavorites.length > 0) {
                    addTempFavoritesToFavorites({ favorites: tempFavorites, user_id: user.id });
                    removeCookie('tempFavorites', { path: '/' });
                }

                onCloseModal(false);

                if (user.designer) {
                    setCookie('currentUserDesigner', JSON.stringify(user.designer.id), { path: '/' });
                }
                if (user.seller) {
                    setCookie('currentUserSeller', JSON.stringify(user.seller.id), { path: '/' });
                }
                if (user.role == 'Admin') {
                    toast.success('Successfully signed in!');
                    setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
                    setCookie('userRole', JSON.stringify(user.role), { path: '/' });
                    const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer }
                    setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                    setCookie('isLoggedIn', true, { path: '/' });
                    setCookie('token', data.token, { path: '/' });
                    setCookie('signup_type', user.signup_type, { path: '/' });
                    setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
                    setCookie('token', data.token, { path: '/' });
                } else {
                    toast.success('Successfully signed in!');
                    setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
                    setCookie('userRole', JSON.stringify(user.role), { path: '/' });
                    const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer, shop_completed: user.shop_completed, profile_completeness: user.profile_completeness }
                    setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                    setCookie('isLoggedIn', true, { path: '/' });
                    setCookie('token', data.token, { path: '/' });
                    setCookie('signup_type', user.signup_type, { path: '/' });
                    setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
                    setCookie('token', data.token, { path: '/' });
                }

            } else if (errors == "OTP authentication failed") {
                toast.error('OTP authentication failed!');
            } else {
                setFormStatus('standby');
                toast.error('OTP does not exist!')
            }
        }).catch((error) => {
            alert(error);
            setFormStatus('standby');
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    async function loginSubmit(e) {
        e.preventDefault();
        setLoginFormLoading(true);
        axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'login?device_id=' + deviceId, loginFormData).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                const data = response.data.data;
                const user = data.user;

                if (data?.two_factor_authentication == 'Both') {
                    setTwoFactor('both');
                    setCloneTwoFactor('both');
                    setEmail(data.user.email);
                    submitTwoFactor(data.user.email);

                } else if (data?.two_factor_authentication == 'Email') {
                    setTwoFactor('email');
                    setCloneTwoFactor('email');
                    setEmail(data.user.email);
                    submitEmailCode(data.user.email);

                } else if (data?.two_factor_authentication == 'SMS') {
                    setTwoFactor('sms');
                    setCloneTwoFactor('sms');
                    setEmail(data.user.email);
                    submitSMSCode(data.user.email);

                } else {
                    if (tempCart && tempCart.length > 0) {
                        addTempCartToCart({ order_items: tempCart, user_id: user.id });
                        removeCookie('tempCart', { path: '/' });
                    }

                    if (tempFavorites && tempFavorites.length > 0) {
                        addTempFavoritesToFavorites({ favorites: tempFavorites, user_id: user.id });
                        removeCookie('tempFavorites', { path: '/' });
                    }

                    onCloseModal(false);

                    if (user.designer) {
                        setCookie('currentUserDesigner', JSON.stringify(user.designer.id), { path: '/' });
                    }
                    if (user.seller) {
                        setCookie('currentUserSeller', JSON.stringify(user.seller.id), { path: '/' });
                    }
                    if (user.role == 'Admin') {
                        toast.success('Successfully signed in!');
                        setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
                        setCookie('userRole', JSON.stringify(user.role), { path: '/' });
                        const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer }
                        setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                        setCookie('isLoggedIn', true, { path: '/' });
                        setCookie('token', data.token, { path: '/' });
                        setCookie('signup_type', user.signup_type, { path: '/' });
                        setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
                        setCookie('token', data.token, { path: '/' });
                    } else {
                        toast.success('Successfully signed in!');
                        setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
                        setCookie('userRole', JSON.stringify(user.role), { path: '/' });
                        const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer, shop_completed: user.shop_completed, profile_completeness: user.profile_completeness }
                        setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                        setCookie('isLoggedIn', true, { path: '/' });
                        setCookie('token', data.token, { path: '/' });
                        setCookie('signup_type', user.signup_type, { path: '/' });
                        setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
                        setCookie('token', data.token, { path: '/' });
                    }
                }
            } else {
                const errors = response.data.errors;
                if (errors.email) {
                    toast.error(errors.email[0]);
                } if (errors.password) {
                    toast.error(errors.password[0]);
                } else {
                    errors.map((error, index) => {
                        toast.error(error);
                        return null; // React requires a return value, so we return null here
                    });
                }
            }
            setLoginFormLoading(false);
        }).catch((error) => {
            setLoginFormLoading(false);
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    async function createGoogleUser(e) {
        axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'user/google/register', e).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                const data = response.data.data;
                const user = data.user;
                if (user.designer) {
                    setCookie('currentUserDesigner', JSON.stringify(user.designer.id), { path: '/' });
                }
                if (user.seller) {
                    setCookie('currentUserSeller', JSON.stringify(user.seller.id), { path: '/' });
                }

                if (tempCart && tempCart.length > 0) {
                    addTempCartToCart({ order_items: tempCart, user_id: user.id });
                    removeCookie('tempCart', { path: '/' });
                }

                if (tempFavorites && tempFavorites.length > 0) {
                    addTempFavoritesToFavorites({ favorites: tempFavorites, user_id: user.id });
                    removeCookie('tempFavorites', { path: '/' });
                }

                if (user.role == 'Admin') {
                    toast.success('Successfully signed in!');
                    setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
                    setCookie('userRole', JSON.stringify(user.role), { path: '/' });
                    const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer }
                    setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                    setCookie('isLoggedIn', true, { path: '/' });
                    setCookie('token', data.token, { path: '/' });
                    setCookie('signup_type', user.signup_type, { path: '/' });
                    setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
                    setCookie('token', data.token, { path: '/' });
                    setTimeout(function () {
                        navigate("/admin/users");
                        setGoogleLoginLoading(false);
                    }, 1000);
                } else {
                    toast.success('Successfully signed in!');
                    setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
                    setCookie('userRole', JSON.stringify(user.role), { path: '/' });
                    const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer, shop_completed: user.shop_completed, profile_completeness: user.profile_completeness }
                    setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                    setCookie('isLoggedIn', true, { path: '/' });
                    setCookie('token', data.token, { path: '/' });
                    setCookie('signup_type', user.signup_type, { path: '/' });
                    setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
                    setCookie('token', data.token, { path: '/' });
                    setTimeout(function () {
                        navigate("/");
                        setGoogleLoginLoading(false);
                    }, 1000);
                }

            } else {
                const errors = response.data.errors;
                if (errors.email) {
                    toast.error(errors.email[0]);
                } if (errors.password) {
                    toast.error(errors.password[0]);
                } else {
                    errors.map((error, index) => {
                        toast.error(error);
                        return null; // React requires a return value, so we return null here
                    });
                }
            }
            setLoginFormLoading(false);
        }).catch((error) => {
            setLoginFormLoading(false);
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setGoogleUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(() => {
        if (currentUser && currentUser != "") {
            // toast.error("You are already logged in!");
            navigate("/user/profile");
        }
    }, []);

    useEffect(() => {
        if (googleUser) {
            setGoogleLoginLoading(true);
            axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleUser.access_token}`, {
                headers: {
                    Authorization: `Bearer ${googleUser.access_token}`,
                    Accept: 'application/json'
                }
            })
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
                email: googleEmail
            };
            axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'user/email?device_id=' + deviceId, data).then((response) => {
                const success = response.data.status;
                if (success == 'Success') {
                    const data = response.data.data;
                    if (data) {
                        const user = data.user;
                        if (data?.two_factor_authentication == 'Both') {
                            setTwoFactor('both');
                            setCloneTwoFactor('both');
                            setEmail(data.user.email);
                            submitTwoFactor(data.user.email);

                        } else if (data?.two_factor_authentication == 'Email') {
                            setTwoFactor('email');
                            setCloneTwoFactor('email');
                            setEmail(data.user.email);
                            submitEmailCode(data.user.email);

                        } else if (data?.two_factor_authentication == 'SMS') {
                            setTwoFactor('sms');
                            setCloneTwoFactor('sms');
                            setEmail(data.user.email);
                            submitSMSCode(data.user.email);

                        } else {
                            if (user.designer) {
                                setCookie('currentUserDesigner', JSON.stringify(user.designer.id), { path: '/' });
                            }
                            if (user.seller) {
                                setCookie('currentUserSeller', JSON.stringify(user.seller.id), { path: '/' });
                            }
                            if (user.role == 'Admin') {
                                toast.success('Successfully signed in!');
                                setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
                                setCookie('userRole', JSON.stringify(user.role), { path: '/' });
                                const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer }
                                setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                                setCookie('isLoggedIn', true, { path: '/' });
                                setCookie('token', data.token, { path: '/' });
                                setCookie('signup_type', user.signup_type, { path: '/' });
                                setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
                                setCookie('token', data.token, { path: '/' });
                            } else {
                                toast.success('Successfully signed in!');
                                setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
                                setCookie('userRole', JSON.stringify(user.role), { path: '/' });
                                const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer, shop_completed: user.shop_completed, profile_completeness: user.profile_completeness }
                                setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                                setCookie('isLoggedIn', true, { path: '/' });
                                setCookie('token', data.token, { path: '/' });
                                setCookie('signup_type', user.signup_type, { path: '/' });
                                setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
                                setCookie('token', data.token, { path: '/' });
                            }

                        setTimeout(function(){
                            props.onLogin(user.id);
                        }, 1000)
                        }
                    }
                } else {
                    setGoogleSignupProfile(googleProfile);
                }
            }).catch((err) => console.log(err));
        }
    }, [googleEmail]);

    const baseList = [
        'gmail.com',
        'yahoo.com',
        'hotmail.com',
        'aol.com',
        'msn.com',
        'proton.me',
    ];

    const emailAuthenticationClick = () => {
        setTwoFactor('email');

        let uniqueId = deviceId;

        if (deviceId === undefined) {
            uniqueId = generateUniqueId();
            setCookie('device_id', uniqueId, { path: '/' });
        }

        postEmailCode({ email: email, device_id: uniqueId }).then(response => {
            const success = response.data.status;
            if (success === "Success") {
            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
        }).catch((error) => {
            alert(error);
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    const smsAuthenticationClick = () => {
        setTwoFactor('sms');
        let uniqueId = deviceId;

        if (deviceId === undefined) {
            uniqueId = generateUniqueId();
            setCookie('device_id', uniqueId, { path: '/' });
        }

        postSMSCode({ email: email, device_id: uniqueId }).then(response => {
            const success = response.data.status;
            const errors = response.data.errors;
            if (success === "Success") {
            } else if (errors === "Phone number does not exist") {
                toast.error('Phone number does not exist!');
            } else if (errors === "Failed to send SMS") {
                toast.error('Failed to send SMS!');
            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
        }).catch((error) => {
            alert(error);
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    return (
        <div id="login-column" className='d-flex flex-column justify-content-center'>
            <div className='login-container'>
                <Link to="/">
                    <img src={KoutureLogo} className="kouture-icon" alt="Kouture Konect" />
                </Link>
                {twoFactor === 'both' || twoFactor === 'email' || twoFactor === 'sms' ?
                    <h1 className='text-center'>Two Factor Authentication</h1>
                :
                    <h1 className='text-center'>Sign in to Kouture Konect</h1>
                }
                <div className="divider-small mb-3 mt-4"></div>
                {/* <button className='login-google mt-3'>
                <img src={GoogleIcon} />
                <span className='subtitle'>Sign in with Google</span>
                </button>
                <hr className='mb-0 mt-5' />
                <p className='login-with-email'>or sign in with email</p> */}
                {twoFactor === 'both' ?
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
                                                        <Button style={{ minWidth: 'auto' }} onClick={() => emailAuthenticationClick()} className='w-100 bg-gold border-gold' variant='secondary' type='button'>Email</Button>
                                                    </Form.Group>
                                                    <Form.Group as={Col} lg={3}>
                                                        <Button style={{ minWidth: 'auto' }} onClick={() => smsAuthenticationClick()} className='w-100 bg-black border-black' variant='secondary' type='button'>SMS</Button>
                                                    </Form.Group>
                                                </Row>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                    : twoFactor === 'email' ?
                        <Form onSubmit={loginEmailSubmit} style={{ marginTop: '30px' }} id="loginForm">
                            <Form.Group className="mb-3 mt-4">
                                <Card>
                                    <Card.Body>
                                        <div className="py-3">
                                            <Form.Label>An email containing the OTP code has been sent to your inbox. Please check your email for the code.</Form.Label>
                                            <Row className="mt-3 d-flex justify-content-center">
                                                <div className="col-12">
                                                    <div className="d-flex justify-content-between" style={{ columnGap: '15px' }}>
                                                        <div className="input-group border-light">
                                                            <span className="input-group-text bg-light border-none" id="basic-addon1"><FaLock color="#A0A2A5" /></span>
                                                            <input
                                                                type="text"
                                                                name='otp'
                                                                value={formDataLogin.otp}
                                                                className="form-control border-none bg-light ps-0"
                                                                style={{ marginRight: '1px', borderTopRightRadius: '5px', borderBottomRightRadius: '5px' }}
                                                                onChange={handleChangeLogin}
                                                                placeholder="One Time Password"
                                                                aria-label="Username"
                                                                aria-describedby="basic-addon1"
                                                                required />
                                                        </div>
                                                        <div className="d-flex justify-content-center" style={{ columnGap: '8px' }}>
                                                            {showTimer || showSendCode ? (
                                                                // <div className="d-flex align-items-center" style={{ cursor: 'not-allowed', opacity: '0.5' }}>
                                                                //   <label className="mb-0 ms-1" style={{ cursor: 'not-allowed' }}>Resend&nbsp;</label>
                                                                // </div>
                                                                <Button style={{ minWidth: 'auto', cursor: 'not-allowed', opacity: '0.5' }} className='w-100 bg-gold border-gold' variant='secondary' type='button'>Resend</Button>
                                                            ) : (
                                                                // <div className="d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={submitEmailCode}>
                                                                //   <label className="mb-0 ms-1" style={{ cursor: 'pointer' }}>Resend</label>
                                                                // </div>
                                                                <Button style={{ minWidth: 'auto' }} onClick={() => resendEmailCode()} className='w-100 bg-gold border-gold' variant='secondary' type='button'>Resend</Button>
                                                            )}
                                                            {showTimer && (
                                                                <div className="d-flex align-items-center" style={{ opacity: '0.5' }}>
                                                                    <span>{timer}s</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Row>
                                            <div className="mt-4 d-flex justify-content-center">
                                                {formStatus !== "standby" ?
                                                    <Button variant="primary" className='' type="button"
                                                        style={{ width: '-webkit-fill-available' }}
                                                    >Signing in...</Button> :
                                                    <Button variant="primary" className='' style={{ width: '-webkit-fill-available' }} type="submit">Sign in</Button>
                                                }
                                            </div>
                                        </div>
                                        {cloneTwoFactor === 'both' &&
                                            <p className='mb-0 mt-3 text-center fs-14 text-dgray' style={{ cursor: 'pointer' }} onClick={() => setTwoFactor('both')}><IoIosArrowRoundBack /> Go back to 2FA method</p>
                                        }
                                    </Card.Body>
                                </Card>
                            </Form.Group>
                        </Form>
                        : twoFactor === 'sms' ?
                            <Form onSubmit={loginSMSSubmit} style={{ marginTop: '30px' }} id="loginForm">
                                <Form.Group className="mb-3 mt-4">
                                    <Card>
                                        <Card.Body>
                                            <div className="py-3">
                                                <Form.Label>A message containing the OTP code has been sent to your phone. Please check your messages for the code.</Form.Label>
                                                <Row className="mt-3 d-flex justify-content-center">
                                                    <div className="col-12">
                                                        <div className="d-flex justify-content-between" style={{ columnGap: '15px' }}>
                                                            <div className="input-group border-light">
                                                                <span className="input-group-text bg-light border-none" id="basic-addon1"><FaLock color="#A0A2A5" /></span>
                                                                <input
                                                                    type="text"
                                                                    name='otp'
                                                                    value={formDataLogin.otp}
                                                                    className="form-control border-none bg-light ps-0"
                                                                    style={{ marginRight: '1px', borderTopRightRadius: '5px', borderBottomRightRadius: '5px' }}
                                                                    onChange={handleChangeLogin}
                                                                    placeholder="One Time Password"
                                                                    aria-label="Username"
                                                                    aria-describedby="basic-addon1"
                                                                    required />
                                                            </div>
                                                            <div className="d-flex justify-content-center" style={{ columnGap: '8px' }}>
                                                                {showTimer || showSendCode ? (
                                                                    <Button style={{ minWidth: 'auto', cursor: 'not-allowed', opacity: '0.5' }} className='w-100 bg-gold border-gold' variant='secondary' type='button'>Resend</Button>
                                                                ) : (
                                                                    <Button style={{ minWidth: 'auto' }} onClick={() => resendPhoneCode()} className='w-100 bg-gold border-gold' variant='secondary' type='button'>Resend</Button>
                                                                )}
                                                                {showTimer && (
                                                                    <div className="d-flex align-items-center" style={{ opacity: '0.5' }}>
                                                                        <span>{timer}s</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Row>
                                                <div className="mt-4 d-flex justify-content-center">
                                                    {formStatus !== "standby" ?
                                                        <Button variant="primary" className='' type="button"
                                                            style={{ width: '-webkit-fill-available' }}
                                                        >Signing in...</Button> :
                                                        <Button variant="primary" className='' style={{ width: '-webkit-fill-available' }} type="submit">Sign in</Button>
                                                    }
                                                </div>
                                            </div>
                                            {cloneTwoFactor === 'both' &&
                                                <p className='mb-0 mt-3 text-center fs-14 text-dgray' style={{ cursor: 'pointer' }} onClick={() => setTwoFactor('both')}><IoIosArrowRoundBack /> Go back to 2FA method</p>
                                            }
                                        </Card.Body>
                                    </Card>
                                </Form.Group>
                            </Form>
                            :
                            <Form onSubmit={loginSubmit}>
                                <Form.Group className='mb-3' controlId='formBasicEmail'>
                                    <Form.Label>Email Address</Form.Label>
                                    <Email
                                        baseList={baseList}
                                        refineList={domains}
                                        onChange={(e) => handleChangeEmail(e)} // or (newValue) => customSetter(newValue)
                                        value={loginFormData.email}
                                        className="form-control mr-sm-2 email-suggestion"
                                        required
                                    />
                                    {/* <FormControl type='email' name='email' value={loginFormData.email} className='mr-sm-2' onChange={handleChange} required /> */}
                                </Form.Group>
                                <Form.Group className='mb-3' controlId='formBasicPassword'>
                                    <Form.Label>Password</Form.Label>
                                    <FormControl type='password' name='password' value={loginFormData.password} className='mr-sm-2' onChange={handleChange} required />
                                </Form.Group>
                                <a href="/forgot-password" className='forgot-password text-dgray fs-16'>Forgot Password</a>
                                {loginFormLoading ?
                                    <Button className='w-100 mt-4' variant='primary' type='button'>Signing in...</Button>
                                    :
                                    <Button className='w-100 mt-4' variant='primary' type='submit'>Sign in</Button>
                                }
                                {/* {googleLoginLoading ?
                                    <Button className='w-100 mt-3' variant='secondary' type='button'>Logging in with Google...</Button>
                                    :
                                    <Button className='w-100 mt-3' variant='secondary' type='button' onClick={login}>Login with Google</Button>
                                } */}

                                {/* <p className='mb-0 mt-4 text-center fs-14 text-dgray'>Don't have an account? <Link className='sign-up' to='/sign-up'>Sign Up</Link></p> */}
                                <p className='mb-0 mt-4 text-center fs-14 text-dgray'>Don't have an account? <span className='sign-up' style={{ cursor: 'pointer' }} onClick={() => showSignup(1)}>Sign Up</span></p>
                            </Form>
                }
            </div>
        </div>
    );
};

export default LogIn;