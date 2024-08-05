import React, { useEffect, useState, useRef } from 'react';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import 'Assets/styles/User/Profile/style.css'
import UserPlaceholder from 'Assets/images/user.png';
import Loading from 'Assets/images/loading.gif'
import GetUserData from 'Utils/GetUserData';
import { FaArrowRightLong } from "react-icons/fa6";
import { CiShop } from "react-icons/ci";
import { FaLocationDot, FaPhone, FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import { PiTrashThin } from "react-icons/pi";
import { AiOutlineClose } from 'react-icons/ai';
import { FaLink, FaBehance } from "react-icons/fa";
import GoBack from 'Components/Shared/GoBack';
import DesignIcon from 'Assets/images/user-box/dress.png';
import FabricIcon from 'Assets/images/user-box/fabric.png';
import DesignerIcon from 'Assets/images/user-box/edit-tools.png';
import { useCookies } from 'react-cookie';
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import toast from 'react-hot-toast';
import { GoArrowUpRight } from "react-icons/go";
import AdminPortfolio from 'Components/Shared/Admin/AdminPortfolioGrid';
import AdminFabrics from 'Components/Shared/Admin/AdminFabricsGrid';
import LoadingPage from 'Components/Shared/LoadingPage';
import { GoPencil } from "react-icons/go";
import axios from 'axios';
import MyCalendar from 'Components/Shared/MyCalendar';
import { useNavigate, useParams, Link } from 'react-router-dom';
import BecomeSeller from 'Components/CallToActions/Seller';
import BecomeDesigner from 'Components/CallToActions/Designer';
import ReactFlagsSelect from "react-flags-select";
import Webcam from "react-webcam";
import { GoDotFill } from "react-icons/go";
import { FaCamera } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const initialUserData = Object.freeze({
    is_designer: 0,
    is_tailor: 0,
    is_seller: 0,
    email: '',
    short_bio: '',
    long_bio: '',
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    province: '',
    postal_code: '',
    country: '',
    website: '',
    phone_number: '',
    secondary_email_address: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    pinterest: '',
    behance: '',
    youtube: '',
    instagram: '',
});

const initialDesignerData = Object.freeze({
    design_inspirations: '',
    design_process: '',
    areas_of_specialization: '',
    lead_time: '',
    pricing_structure: '',
});

const Profile = () => {
    const [user, setUser] = useState(initialUserData);
    const [designer, setDesigner] = useState(initialDesignerData);
    const [userLoading, setUserLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);
    const [aboutShow, setAboutShow] = useState(true);
    const [portfolioShow, setPortfolioShow] = useState(false);
    const [fabricShow, setFabricShow] = useState(false);
    const [processShow, setProcessShow] = useState(false);
    const [limitedDesignShow, setLimitedDesignShow] = useState(false);
    const [myCalendarShow, setMyCalendarShow] = useState(false);
    const [securityShow, setSecurityShow] = useState(false);
    const [verificationShow, setVerificationShow] = useState(false);
    const [formStatus, setFormStatus] = useState('standby');
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'activeProfileTab', 'userDetails']);
    const [areasOfSpecialization, setAreaOfSpecialization] = useState([]);
    const [setupShopShow, setSetupShopShow] = useState(false);

    const [selected, setSelected] = useState("");

    const [captureBothPhotoModalShow, setCaptureBothPhotoModalShow] = useState(false);
    const [viewFrontCapture, setViewFrontCapture] = useState(null);
    const [webcamLoaded, setWebcamLoaded] = useState(false);
    const [showCaptureFrontImage, setShowCaptureFrontImage] = useState(false);

    const [verificationIDShow, setVerificationIDShow] = useState(false);
    const [verificationFormData, setVerificationFormData] = useState([]);

    const [captureFrontPhotoModalShow, setCaptureFrontPhotoModalShow] = useState(false);
    const [primaryFrontPhoto, setPrimaryFrontPhoto] = useState(null);
    const [primaryBackPhoto, setPrimaryBackPhoto] = useState(null);

    const [firstSecondaryFrontPhoto, setFirstSecondaryFrontPhoto] = useState(null);
    const [secondSecondaryFrontPhoto, setSecondSecondaryFrontPhoto] = useState(null);

    const [firstSecondaryBackPhoto, setFirstSecondaryBackPhoto] = useState(null);
    const [secondSecondaryBackPhoto, setSecondSecondaryBackPhoto] = useState(null);

    const [captureBackPhotoModalShow, setCaptureBackPhotoModalShow] = useState(false);
    const [viewBackCapture, setViewBackCapture] = useState(null);
    const [showCaptureBackImage, setShowCaptureBackImage] = useState(false);

    const [iDName, setIDName] = useState('');

    const currentUser = cookies.currentUser;
    const token = cookies.token;
    const activeProfileTab = cookies.activeProfileTab;
    const userDetails = cookies.userDetails;

    const secondaryIdOptions = [
        'Birth Certificate',
        'Barangay Certificate',
        'NBI Clearance',
        'TIN ID',
        'Government Service Insurance System (GSIS) e-Card',
        'Seaman\'s Book',
        'Company ID',
        'Cedula or Community Tax Certificate',
        'Student ID',
        'Police Clearance',
    ];

    // Capture using camera
    const handleWebcamLoad = () => {
        setWebcamLoaded(true);
    };

    const webRef = useRef(null);
    const showImage = async () => {
        console.log(webRef.current.getScreenshot());
        const screenshot = webRef.current.getScreenshot();
        if (screenshot) {
            setViewFrontCapture(screenshot);
        }
    }

    // const showImage = async () => {
    //     const screenshot = webRef.current.getScreenshot();
    //     if (screenshot) {
    //         // Create an image element
    //         const img = new Image();
    //         img.src = screenshot;
    //         img.onload = () => {
    //             // Create canvas and context
    //             const canvas = document.createElement('canvas');
    //             const ctx = canvas.getContext('2d');

    //             // Set the canvas dimensions to match the cropping box dimensions
    //             const overlayBoxWidth = 600;  // Replace with actual width
    //             const overlayBoxHeight = 350; // Replace with actual height

    //             canvas.width = overlayBoxWidth;
    //             canvas.height = overlayBoxHeight;

    //             // Draw the image on the canvas
    //             ctx.drawImage(
    //                 img,
    //                 80, // Source X
    //                 90, // Source Y
    //                 overlayBoxWidth, // Source Width
    //                 overlayBoxHeight, // Source Height
    //                 0, // Destination X
    //                 0, // Destination Y
    //                 overlayBoxWidth, // Destination Width
    //                 overlayBoxHeight // Destination Height
    //             );

    //             // Get the cropped image data
    //             const croppedImage = canvas.toDataURL();
    //             setViewFrontCapture(croppedImage);
    //         };
    //     }
    // };

    const toggleCaptureBothPhoto = () => {
        setCaptureBothPhotoModalShow(!captureBothPhotoModalShow);
        setViewFrontCapture(null);
        setShowCaptureFrontImage(false);
    }

    const toggleshowCaptureFrontImage = () => {
        setShowCaptureFrontImage(!showCaptureFrontImage);
    }

    const selectedCountry = (code) => {
        setSelected(code);

        if (selected !== code) {
            setVerificationFormData([]);
            setViewFrontCapture(null);
            setViewBackCapture(null);

            setPrimaryFrontPhoto(null);
            setPrimaryBackPhoto(null);

            setFirstSecondaryFrontPhoto(null);
            setFirstSecondaryBackPhoto(null);

            setSecondSecondaryFrontPhoto(null);
            setSecondSecondaryBackPhoto(null);
        }
    }

    const captureBothSubmit = (e) => {
        setCaptureBothPhotoModalShow(false);
        setWebcamLoaded(false);

        if (iDName === "primary") {
            setPrimaryFrontPhoto(viewFrontCapture);
        } else if (iDName === "first_secondary") {
            setFirstSecondaryFrontPhoto(viewFrontCapture);
        } else if (iDName === "second_secondary") {
            setSecondSecondaryFrontPhoto(viewFrontCapture);
        }
    }

    const captureFrontSubmit = (e) => {
        setCaptureFrontPhotoModalShow(false);
        setWebcamLoaded(false);

        if (iDName === "primary") {
            setPrimaryFrontPhoto(viewFrontCapture);
        } else if (iDName === "first_secondary") {
            setFirstSecondaryFrontPhoto(viewFrontCapture);
        } else if (iDName === "second_secondary") {
            setSecondSecondaryFrontPhoto(viewFrontCapture);
        }
    }

    const toggleverificationIDShow = () => {
        setReloadCount(count => reloadCount + 1);
        setVerificationIDShow(!verificationIDShow);
        setWebcamLoaded(false);
    }


    const toggleCloseverificationIDShow = () => {
        setVerificationIDShow(false);
        setWebcamLoaded(false);
        setViewFrontCapture(null);
        setViewBackCapture(null);
        setPrimaryFrontPhoto(null);
        setPrimaryBackPhoto(null);
    }

    const verificationIDSubmit = (e) => {
        setFormStatus('loading');
        e.preventDefault();

        axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?user_id=' + currentUser + '&token=' + token, { ...verificationFormData, id_country: selected, primary_id_front_img: primaryFrontPhoto, primary_id_back_img: primaryBackPhoto, first_secondary_id_front_img: firstSecondaryFrontPhoto, first_secondary_id_back_img: firstSecondaryBackPhoto, second_secondary_id_front_img: secondSecondaryFrontPhoto, second_secondary_id_back_img: secondSecondaryBackPhoto }).then((response) => {
            const success = response.data.status;
            if (success === 'Success') {
                setVerificationIDShow(false);
                toast.success('Government ID updated successfully!');
                setFormStatus('standby');
                setVerificationFormData([]);
                setViewFrontCapture(null);
                setViewBackCapture(null);
                setPrimaryFrontPhoto(null);
                setPrimaryBackPhoto(null);
                setWebcamLoaded(false);
                setReloadCount(count => reloadCount + 1);
            } else {
                setFormStatus('standby');
                toast.error('There has been an error saving the government ID, please try again!');
            }
        }).catch((error) => {
            setFormStatus('standby');
            toast.error('There has been an error saving the government ID, please try again!');
        });
    }

    const handleChangeFrontID = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {

                if (iDName === "primary") {
                    setPrimaryFrontPhoto(reader.result);
                } else if (iDName === "first_secondary") {
                    setFirstSecondaryFrontPhoto(reader.result);
                } else if (iDName === "second_secondary") {
                    setSecondSecondaryFrontPhoto(reader.result);
                }

            };
            reader.readAsDataURL(file);
        }
    };

    // Front
    const toggleCapturePrimaryFrontPhoto = () => {
        setCaptureFrontPhotoModalShow(!captureFrontPhotoModalShow);
        setWebcamLoaded(false);
        setShowCaptureFrontImage(false);
    }

    // Back
    const showBackImage = async () => {
        console.log(webRef.current.getScreenshot());
        const screenshot = webRef.current.getScreenshot();
        if (screenshot) {
            setViewBackCapture(screenshot);
        }
    }

    // const showBackImage = async () => {
    //     const screenshot = webRef.current.getScreenshot();
    //     if (screenshot) {
    //         // Create an image element
    //         const img = new Image();
    //         img.src = screenshot;
    //         img.onload = () => {
    //             // Create canvas and context
    //             const canvas = document.createElement('canvas');
    //             const ctx = canvas.getContext('2d');

    //             // Set the canvas dimensions to match the cropping box dimensions
    //             const overlayBoxWidth = 600;  // Replace with actual width
    //             const overlayBoxHeight = 350; // Replace with actual height

    //             canvas.width = overlayBoxWidth;
    //             canvas.height = overlayBoxHeight;

    //             // Draw the image on the canvas
    //             ctx.drawImage(
    //                 img,
    //                 80, // Source X
    //                 90, // Source Y
    //                 overlayBoxWidth, // Source Width
    //                 overlayBoxHeight, // Source Height
    //                 0, // Destination X
    //                 0, // Destination Y
    //                 overlayBoxWidth, // Destination Width
    //                 overlayBoxHeight // Destination Height
    //             );

    //             // Get the cropped image data
    //             const croppedImage = canvas.toDataURL();
    //             setViewBackCapture(croppedImage);
    //         };
    //     }
    // };

    const toggleCapturePrimaryBackPhoto = () => {
        setCaptureBackPhotoModalShow(!captureBackPhotoModalShow);
        setShowCaptureBackImage(false);
        setWebcamLoaded(false);
    }

    const toggleShowCaptureBackImage = () => {
        setShowCaptureBackImage(!showCaptureBackImage);
    }

    const captureBackSubmit = (e) => {
        setCaptureBackPhotoModalShow(false);
        setWebcamLoaded(false);

        if (iDName === "primary") {
            setPrimaryBackPhoto(viewBackCapture);
        } else if (iDName === "first_secondary") {
            setFirstSecondaryBackPhoto(viewBackCapture);
        } else if (iDName === "second_secondary") {
            setSecondSecondaryBackPhoto(viewBackCapture);
        }
    }

    const handleChangeBackID = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {

                if (iDName === "primary") {
                    setPrimaryBackPhoto(reader.result);
                } else if (iDName === "first_secondary") {
                    setFirstSecondaryBackPhoto(reader.result);
                } else if (iDName === "second_secondary") {
                    setSecondSecondaryBackPhoto(reader.result);
                }

            };
            reader.readAsDataURL(file);
        }
    };

    const isFirstSecondaryPhotoUploaded = firstSecondaryFrontPhoto && !captureBothPhotoModalShow && !captureFrontPhotoModalShow && !captureBackPhotoModalShow && verificationFormData.first_secondary_id_name;
    const isSecondSecondaryPhotoUploaded = verificationFormData.second_secondary_id_name && secondSecondaryFrontPhoto;

    // User Image
    const [userImage, setUserImage] = useState();
    const [uploadStatus, setUploadStatus] = useState("standby");
    const hiddenFileInputImg = React.useRef(null);

    const handleClickImg = event => {
        hiddenFileInputImg.current.click();
    };

    const handleChangeVerification = (e) => {
        const { name, value } = e.target;

        setVerificationFormData({
            ...verificationFormData
            , [name]: value
        });

        if (name === "primary_id_name") {
            if (verificationFormData?.primary_id_name !== value) {
                setWebcamLoaded(false);
                setShowCaptureFrontImage(false);

                setPrimaryFrontPhoto(null);
                setPrimaryBackPhoto(null);

                setFirstSecondaryFrontPhoto(null);
                setFirstSecondaryBackPhoto(null);

                setSecondSecondaryFrontPhoto(null);
                setSecondSecondaryBackPhoto(null);

                setViewFrontCapture(null);
                setViewBackCapture(null);

                setVerificationFormData(prevState => ({
                    ...prevState,
                    primary_id_front_img: "",
                    primary_id_back_img: "",

                    first_secondary_id_front_img: "",
                    first_secondary_id_back_img: "",

                    second_secondary_id_front_img: "",
                    second_secondary_id_back_img: "",

                    first_secondary_id_name: "",
                    second_secondary_id_name: "",
                }));
            }
        }

        if (name === "first_secondary_id_name") {
            if (verificationFormData?.primary_id_name !== value) {
                setWebcamLoaded(false);
                setShowCaptureFrontImage(false);

                setPrimaryFrontPhoto(null);
                setPrimaryBackPhoto(null);

                setFirstSecondaryFrontPhoto(null);
                setFirstSecondaryBackPhoto(null);

                setViewFrontCapture(null);
                setViewBackCapture(null);

                setVerificationFormData(prevState => ({
                    ...prevState,
                    primary_id_front_img: "",
                    primary_id_back_img: "",

                    first_secondary_id_front_img: "",
                    first_secondary_id_back_img: "",
                }));
            }
        }

        if (name === "second_secondary_id_name") {
            if (verificationFormData?.primary_id_name !== value) {
                setWebcamLoaded(false);
                setShowCaptureFrontImage(false);

                setPrimaryFrontPhoto(null);
                setPrimaryBackPhoto(null);

                setSecondSecondaryFrontPhoto(null);
                setSecondSecondaryBackPhoto(null);

                setViewFrontCapture(null);
                setViewBackCapture(null);

                setVerificationFormData(prevState => ({
                    ...prevState,
                    primary_id_front_img: "",
                    primary_id_back_img: "",

                    second_secondary_id_front_img: "",
                    second_secondary_id_back_img: "",
                }));
            }
        }
    }


    const navigate = useNavigate();

    const toggleSetupShopShow = () => {
        setSetupShopShow(!setupShopShow);
    }

    const handleChangeImg = ({ target }) => {
        if (target.files < 1 || !target.validity.valid) {
            return
        }
        if (target.files[0]) {
            submitDocument(target.files[0]);
        }
    }

    const submitDocument = (event) => {
        // event.preventDefault();
        setUploadStatus("loading");
        const dataArray = new FormData();
        dataArray.append("image", event);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'user/image?user_id=' + currentUser + '&token=' + token, dataArray, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((response) => {
            if (response.data.status == "Success") {
                var media_id = response.data.data.id;
                var profile_picture = response.data.data.image;
                setUserImage(profile_picture);
                updateProfilePicture(profile_picture);

                let reader = new FileReader();
                let file = event;

                reader.onloadend = () => {
                    // setDocuments(documents => [...documents, { media_id: media_id, name: event.name, url: reader.result, type: event.type }]);
                    // setUserImage(reader.result);
                }
                reader.readAsDataURL(file);
            }
        })
            .catch(() => {
                toast.error("An error occured. Please try again or contact the administrator.");
                setUploadStatus("standby");
            });
    };

    async function updateProfilePicture(e) {
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?user_id=' + currentUser + '&token=' + token, {
            image: e
        }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                toast.success('Profile picture updated successfully!');
                setFormStatus("standby");
                setUploadStatus("standby");
                const data = response.data.data;
                const user = data.user;
                if (user.designer) {
                    setCookie('currentUserDesigner', JSON.stringify(user.designer.id), { path: '/' });
                }
                if (user.seller) {
                    setCookie('currentUserSeller', JSON.stringify(user.seller.id), { path: '/' });
                }

                const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at }
                setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                setCookie('completed_questionnaire', user.completed_questionnaire, { path: '/' });
                setCookie('signup_type', user.signup_type, { path: '/' });
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setFormStatus("standby");
                setUploadStatus("standby");
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setFormStatus("standby");
            setUploadStatus("standby");
        });
    }

    async function handleEmailAuthChange(event) {
        const newValue = event.target.checked ? 1 : 0;
        updateSecurity('email_two_factor_authentication', newValue);
    }

    async function handleSMSAuthChange(event) {
        const newValue = event.target.checked ? 1 : 0;
        updateSecurity('sms_two_factor_authentication', newValue);
    }

    async function updateSecurity(fieldName, value) {
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?user_id=' + currentUser + '&token=' + token, {
            [fieldName]: value
        }).then((response) => {
            const success = response.data.status;
            const data = response.data.data;
            if (success === 'Success') {
                setUser((prevUser) => ({
                    ...prevUser,
                    [fieldName]: value,
                }));
                toast.success('Updated successfully!');
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
        });
    }

    const showTab = (tab) => {
        if (tab === "about") {
            setAboutShow(true);
            setPortfolioShow(false);
            setFabricShow(false);
            setProcessShow(false);
            setLimitedDesignShow(false);
            setMyCalendarShow(false);
            setSecurityShow(false);
            setVerificationShow(false);

        } else if (tab == "portfolio") {
            setPortfolioShow(true);
            setAboutShow(false);
            setFabricShow(false);
            setProcessShow(false);
            setLimitedDesignShow(false);
            setMyCalendarShow(false);
            setSecurityShow(false);
            setVerificationShow(false);

        } else if (tab == "fabric") {
            setFabricShow(true);
            setPortfolioShow(false);
            setAboutShow(false);
            setProcessShow(false);
            setLimitedDesignShow(false);
            setMyCalendarShow(false);
            setSecurityShow(false);
            setVerificationShow(false);

        } else if (tab == "process") {
            setProcessShow(true);
            setPortfolioShow(false);
            setAboutShow(false);
            setFabricShow(false);
            setLimitedDesignShow(false);
            setMyCalendarShow(false);
            setSecurityShow(false);
            setVerificationShow(false);

        } else if (tab == "calendar") {
            setLimitedDesignShow(true);
            setProcessShow(false);
            setPortfolioShow(false);
            setAboutShow(false);
            setFabricShow(false);
            setMyCalendarShow(false);
            setSecurityShow(false);
            setVerificationShow(false);

        } else if (tab == "my_calendar") {
            setLimitedDesignShow(false);
            setProcessShow(false);
            setPortfolioShow(false);
            setAboutShow(false);
            setFabricShow(false);
            setMyCalendarShow(true);
            setSecurityShow(false);
            setVerificationShow(false);

        } else if (tab == "security") {
            setLimitedDesignShow(false);
            setProcessShow(false);
            setPortfolioShow(false);
            setAboutShow(false);
            setFabricShow(false);
            setMyCalendarShow(false);
            setSecurityShow(true);
            setVerificationShow(false);

        } else if (tab == "verification") {
            setLimitedDesignShow(false);
            setProcessShow(false);
            setPortfolioShow(false);
            setAboutShow(false);
            setFabricShow(false);
            setMyCalendarShow(false);
            setSecurityShow(false);
            setVerificationShow(true);
        }
    }

    const fetchData = async (e) => {
        try {
            const userData = await GetUserData(e);
            if (userData.id) {
                setUser(userData);
                setVerificationFormData(userData);
                setSelected(userData.id_country);

                setPrimaryFrontPhoto(userData.primary_id_front_img);
                setPrimaryBackPhoto(userData.primary_id_back_img);

                setFirstSecondaryFrontPhoto(userData.first_secondary_id_front_img);
                setFirstSecondaryBackPhoto(userData.first_secondary_id_back_img);

                setSecondSecondaryFrontPhoto(userData.second_secondary_id_front_img);
                setSecondSecondaryBackPhoto(userData.second_secondary_id_back_img);

                setUserImage(userData.image);
                setCookie('userDetails', JSON.stringify(userData), { path: '/' });
                if (userData.designer) {
                    setDesigner(userData.designer);
                    setAreaOfSpecialization(userData.designer.areas_of_specialization);
                }
                setUserLoading(false);
            } else {
                setUserLoading(false);
                toast.error('An error occured. Please try again or contact the administrator.');
            }

        } catch (error) {
            setUserLoading(false);
            toast.error('An error occured. Please try again or contact the administrator.');
        }
    };

    useEffect(() => {
        fetchData({ token: token, currentUser: currentUser });

        if (activeProfileTab && activeProfileTab != '') {
            if (activeProfileTab === "about") {
                setAboutShow(true);
                setPortfolioShow(false);
                setFabricShow(false);
                setProcessShow(false);
                setLimitedDesignShow(false);
                setMyCalendarShow(false);

            } else if (activeProfileTab == "portfolio") {
                setPortfolioShow(true);
                setAboutShow(false);
                setFabricShow(false);
                setProcessShow(false);
                setLimitedDesignShow(false);
                setMyCalendarShow(false);

            } else if (activeProfileTab == "fabric") {
                setFabricShow(true);
                setPortfolioShow(false);
                setAboutShow(false);
                setProcessShow(false);
                setLimitedDesignShow(false);
                setMyCalendarShow(false);

            } else if (activeProfileTab == "process") {
                setProcessShow(true);
                setPortfolioShow(false);
                setAboutShow(false);
                setFabricShow(false);
                setLimitedDesignShow(false);
                setMyCalendarShow(false);

            } else if (activeProfileTab == "calendar") {
                setLimitedDesignShow(true);
                setProcessShow(false);
                setPortfolioShow(false);
                setAboutShow(false);
                setFabricShow(false);
                setMyCalendarShow(false);

            } else if (activeProfileTab == "my_calendar") {
                setLimitedDesignShow(false);
                setProcessShow(false);
                setPortfolioShow(false);
                setAboutShow(false);
                setFabricShow(false);
                setMyCalendarShow(true);
            }
        }
    }, [reloadCount]);

    return (
        <Layout>
            {userLoading ?
                <LoadingPage />
                :
                <section id='profile' className='py-5 px-2'>
                    <Container>
                        <Row>

                            <Col lg="6" className='mb-5'>
                                <div className='d-flex column-gap-20'>
                                    <div className='text-left position-relative user-profile-picture'>
                                        {uploadStatus != "standby" ?
                                            <div className="profile-image" style={{ backgroundImage: "url(" + Loading + ")", backgroundColor: '#f5f6f8' }}></div>
                                            :
                                            <>
                                                {userImage ?
                                                    <div className="profile-image" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'user/' + userImage + ")" }}></div>
                                                    :
                                                    <div className="profile-image" style={{ backgroundImage: "url(" + UserPlaceholder + ")" }}></div>
                                                }
                                            </>
                                        }
                                        <div className="user-image-edit" onClick={handleClickImg}>
                                            <GoPencil />
                                        </div>
                                        <input type="file"
                                            ref={hiddenFileInputImg}
                                            onChange={handleChangeImg}
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <h2 className='fs-30 mb-2'>
                                            {user.first_name || user.last_name ?
                                                <span>{user.first_name} {user.last_name}</span>
                                                :
                                                <span>-</span>
                                            }
                                            {(user.id_country && user.primary_id_name && user.primary_id_front_img) || (user.id_country && user.first_secondary_id_name && user.second_secondary_id_name && user.first_secondary_id_front_img && user.second_secondary_id_front_img) ? 
                                                <MdVerified color="16f11e" className="ms-2" />
                                                : null}
                                        </h2>
                                        <div className='icons-d-flex'>
                                            <FaLocationDot size="20px" color="#cea835" className='profile-icon' />
                                            {user.city || user.province || user.country ?
                                                <p className='fs-16 color-light-blue mb-2'>
                                                    {user.province ? user.province + ',' : user.city ? user.city + ',' : ""} {user.country ? user.country : ""}
                                                    {/* {user.city ? user.city + ',' : ""} {user.province ? user.province + "," : ""} {user.country ? user.country : ""} */}
                                                </p>
                                                :
                                                <p className='fs-16 color-light-blue mb-2'>-</p>
                                            }
                                        </div>

                                        <div className='mb-2 d-flex align-items-center'>
                                            {(user.profile_completeness > 0 && user.profile_completeness < 100) &&
                                                <>
                                                    <div>
                                                        <Button href="/user/complete-profile" type='button' className='btn btn-primary'>
                                                            <span>Complete your profile</span>
                                                        </Button>
                                                    </div>
                                                </>
                                            }

                                            {(user.shop_completed == 0 && (user.is_designer == 1 || user.is_seller == 1)) &&
                                                <>
                                                    <a href='/user/shop/setup' className='text-decoration-none'>
                                                        <span><HiOutlineBuildingStorefront size={30} className={`text-gold me-2 ${user.profile_completeness != 100 && 'ms-4'}`} />
                                                            <span className='fw-500 cursor-pointer'>
                                                                Update your shop<FaArrowRightLong className='ms-2' /></span>
                                                        </span>
                                                    </a>
                                                </>
                                            }

                                        </div>

                                        <div>
                                            <div className="position-relative">
                                                <label className="progress-bar-value" htmlFor="progress-bar"></label>
                                                <progress id="progress-bar" value={user.profile_completeness} max="100"></progress>
                                                <div className='fs-12'>Your profile completion is at {user.profile_completeness}%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            <Col lg="6" className='mb-5'>
                                <Row className="justify-content-end">
                                    <Col lg="12" className="text-right">
                                        {user.is_designer == 0 && user.is_seller == 0 ?
                                            <Button onClick={toggleSetupShopShow} className="bg-white-hover text-black-hover me-3" type='button'>
                                                <CiShop />
                                                <span className='ms-1'>Set Up Shop</span>
                                            </Button>
                                            :
                                            null
                                        }

                                        <Button href="/user/profile/edit" type='button' id="btn-edit-profile" className=''>
                                            <GoPencil />
                                            <span className='ms-1'>Edit Profile</span>
                                        </Button>

                                    </Col>

                                    {/* {user.is_designer == 1 && (
                                        <Col md="2" className="text-left me-4">
                                            <Button href={`/user/center/calendar`} type='button' id="btn-seller-profile" className='w-100 ms-2'>
                                                <GoArrowUpRight />
                                                <span className='ms-1'>Seller Center</span>
                                            </Button>
                                        </Col>
                                    )} */}

                                    {/* <Col lg="2" className="text-right">
                                        <GoBack fallBack="/" />
                                    </Col> */}
                                </Row>
                            </Col>

                            {/* {user.is_seller == 0 && (
                                <Col lg="12" className='mb-2'>
                                    <BecomeSeller />
                                </Col>
                            )}
                            {user.is_designer == 0 && (
                                <Col lg="12">
                                    <BecomeDesigner />
                                </Col>
                            )} */}


                            <Col lg="12" className='mt-4'>
                                <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${aboutShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("about"); }}>About</span>

                                {user.is_designer == 1 && (
                                    <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${portfolioShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("portfolio"); }}>Portfolio</span>
                                )}
                                {user.is_seller == 1 && (
                                    <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${fabricShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("fabric") }}>Fabrics</span>
                                )}
                                {user.is_designer == 1 && (
                                    <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${myCalendarShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("my_calendar") }}>Calendar</span>
                                )}
                                <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${securityShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("security"); }}>Security</span>
                                <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${verificationShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("verification"); }}>Verification</span>
                                {/* <span className={`text-black cursor-pointer me-5 mb-3 fs-16 ${processShow ? 'fw-600' : ''}`} onClick={function () { showTab("process") }}>Process</span>
                                <span className={`text-black cursor-pointer me-5 mb-3 fs-16 ${limitedDesignShow ? 'fw-600' : ''}`} onClick={function () { showTab("limited_design"); }}>Limited Design</span> */}
                                <hr className='mt-2' />
                            </Col>
                        </Row>

                        {aboutShow ?
                            <div id="about-portfolio">
                                <Row>
                                    <Col lg="6">
                                        <p className='title-designer mb-2'>Title</p>
                                        <p className='short-bio-designer mb-4'>
                                            {user.short_bio && user.short_bio != "" ? user.short_bio : "-"}
                                        </p>
                                        {user.is_designer && user.is_seller ?
                                            <>
                                                <p className='long-bio-title mb-1'>Long Bio</p>
                                                <p className='long-bio-designer mb-0 scroll-body'>
                                                    {user.long_bio && user.long_bio != "" ? user.long_bio : "-"}
                                                </p>
                                            </>
                                            :
                                            null
                                        }
                                        {user.is_designer ?
                                            <>
                                                <p className='areas-specialization mt-3 mb-3'>Areas of Specialization and Expertise</p>
                                                <div className='mb-4'>
                                                    {areasOfSpecialization && areasOfSpecialization.length > 0 ?
                                                        <>
                                                            {areasOfSpecialization.map((item, index) => (
                                                                <span className='text-gray600 fs-14 pill-span bg-light item-designer'>{item}</span>
                                                            ))}
                                                        </>
                                                        :
                                                        null

                                                    }
                                                </div>
                                            </>
                                            :
                                            null
                                        }
                                        <hr className='mt-2' />
                                        {/* <div className='d-flex'>
                                            <p className='text-gray'>0 Followers</p>
                                            <p className='text-gray'>0 Following</p>
                                        </div> */}
                                    </Col>
                                    <Col lg="6">
                                        <div className='bg-lgray profile-details address mb-4'>
                                            <div className='icons-d-flex'>
                                                <FaLocationDot size="20px" color="#cea835" className='profile-icon' />
                                                {user.city || user.province || user.country ?
                                                    <p className='information-font'>{user.city ? user.city + ',' : "-"} {user.province ? user.province + "," : "-"} {user.country ? user.country + "," : "-"}</p>
                                                    :
                                                    <p>-</p>
                                                }
                                            </div>
                                            {user.website ?
                                                <div className='icons-d-flex'>
                                                    <FaLink size="20px" color="#cea835" className='profile-icon' />
                                                    <p className='information-font'><a href={user.website} target="_blank">{user.website}</a></p>
                                                </div>
                                                :
                                                <div className='icons-d-flex'>
                                                    <FaLink size="20px" color="#cea835" className='profile-icon' />
                                                    <p className='information-font'><a href="#">-</a></p>
                                                </div>
                                            }
                                            {user.phone_number ?
                                                <div className='icons-d-flex'>
                                                    <FaPhone size="20px" color="#cea835" className='profile-icon' />
                                                    <p className='information-font mb-0'><a href={`tel:${user.phone_number}"`}>{user.phone_number}</a></p>
                                                </div>
                                                :
                                                <div className='icons-d-flex'>
                                                    <FaPhone size="20px" color="#cea835" className='profile-icon' />
                                                    <p className='information-font mb-0'><a href="#">-</a></p>
                                                </div>
                                            }
                                        </div>
                                        {user.is_designer || user.is_seller ?
                                            <div className='bg-lgray profile-details social'>
                                                <p className='social-profile'>Social</p>
                                                {user.behance ?
                                                    <div className='icons-d-flex'>
                                                        <FaBehance size="20px" color="#1769ff" className='profile-icon' />
                                                        <p className='information-font ellipsis-profile'><a href={user.behance} target="_blank">{user.behance}</a></p>
                                                    </div>
                                                    :
                                                    <div className='icons-d-flex'>
                                                        <FaBehance size="20px" color="#1769ff" className='profile-icon' />
                                                        <p><a href="#" target="_blank">-</a></p>
                                                    </div>
                                                }
                                                {user.facebook ?
                                                    <div className='icons-d-flex'>
                                                        <FaFacebookF size="20px" color="#3b5998" className='profile-icon' />
                                                        <p className='information-font ellipsis-profile'><a href={user.facebook} target="_blank">{user.facebook}</a></p>
                                                    </div>
                                                    :
                                                    <div className='icons-d-flex'>
                                                        <FaFacebookF size="20px" color="#3b5998" className='profile-icon' />
                                                        <p><a href="#">-</a></p>
                                                    </div>
                                                }
                                                {user.linkedin ?
                                                    <div className='icons-d-flex'>
                                                        <FaLinkedinIn size="20px" color="#0a66c2" className='profile-icon' />
                                                        <p className='information-font ellipsis-profile'><a href={user.linkedin} target="_blank">{user.linkedin}</a></p>
                                                    </div>
                                                    :
                                                    <div className='icons-d-flex'>
                                                        <FaLinkedinIn size="20px" color="#0a66c2" className='profile-icon' />
                                                        <p><a href="#">-</a></p>
                                                    </div>
                                                }
                                                {user.instagram ?
                                                    <div className='icons-d-flex'>
                                                        <FaInstagram size="20px" color="#E1306C" className='profile-icon' />
                                                        <p className='information-font ellipsis-profile'><a href={user.instagram} target="_blank">{user.instagram}</a></p>
                                                    </div>
                                                    :
                                                    <div className='icons-d-flex'>
                                                        <FaInstagram size="20px" color="#E1306C" className='profile-icon' />
                                                        <p><a href="#">-</a></p>
                                                    </div>
                                                }
                                                {/* {user.youtube ?
                                                    <div className='icons-d-flex'>
                                                        <img src={YoutubeIcon} alt="youtube pin" className='profile-icon' />
                                                        <p className='information-font ellipsis-profile'><a href={user.youtube} target="_blank">{user.youtube}</a></p>
                                                    </div>
                                                    :
                                                    <div className='icons-d-flex'>
                                                        <img src={YoutubeIcon} alt="youtube pin" className='profile-icon' />
                                                        <p><a href="#">-</a></p>
                                                    </div>
                                                } */}
                                            </div>
                                            :
                                            null
                                        }
                                    </Col>
                                </Row>
                            </div>
                            :
                            null
                        }

                        {user.is_designer == 1 &&
                            <>
                                {portfolioShow ?
                                    <AdminPortfolio currentUser={currentUser} reloadCount={reloadCount} />
                                    :
                                    null
                                }
                            </>
                        }

                        {user.is_seller == 1 &&
                            <>
                                {fabricShow ?
                                    <AdminFabrics currentUser={currentUser} reloadCount={reloadCount} />
                                    :
                                    null
                                }
                            </>
                        }

                        {processShow ?
                            <div id="profile-portfolio">
                                <p>Under Construction</p>
                            </div>
                            :
                            null
                        }
                        {limitedDesignShow ?
                            <div id="profile-portfolio">
                                <p>Under Construction</p>
                            </div>
                            :
                            null
                        }

                        {myCalendarShow ?
                            <div id="profile-portfolio">
                                <MyCalendar designerId={designer?.id} />
                            </div>
                            :
                            null
                        }

                        {securityShow ?
                            <div id="about-portfolio">
                                <Row>
                                    <Col lg="6">
                                        <p className='title-designer mb-2'>Two Factor Authentication</p>
                                        <p className='short-bio-designer mb-4'>
                                            <Form.Label className="me-3" style={{ minWidth: '90px' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={user.email_two_factor_authentication}
                                                    onChange={handleEmailAuthChange}
                                                    className="d-inline-block vertical-align-middle me-1"
                                                />
                                                <span>Enable Email Authentication</span>
                                            </Form.Label>
                                            <br />
                                            {user.phone_number && user.phone_number != "" ?
                                                <Form.Label className="me-3" style={{ minWidth: '90px' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={user.sms_two_factor_authentication}
                                                        onChange={handleSMSAuthChange}
                                                        className="d-inline-block vertical-align-middle me-1"
                                                    />
                                                    <span>Enable SMS Authentication</span>
                                                </Form.Label>
                                                :
                                                <>
                                                    <Form.Label className="me-3 text-muted mb-0" style={{ minWidth: '90px', cursor: 'not-allowed', pointerEvents: 'none' }} >
                                                        <input
                                                            type="checkbox"
                                                            className="d-inline-block vertical-align-middle me-1"
                                                        />
                                                        <span>Enable SMS Authentication</span>
                                                    </Form.Label>
                                                    <p className="small text-danger mb-0" style={{ fontSize: '10px' }}>Please add your phone number to enabel SMS authentication</p>
                                                </>
                                            }

                                        </p>
                                    </Col>
                                </Row>
                            </div>
                            :
                            null
                        }

                        {verificationShow ?
                            <div id="profile-portfolio">
                                <Row>
                                    <Col lg="6">
                                        <p>Upload a government-issued ID to verify your identity.</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="6">
                                        {user.primary_id_name && user.primary_id_front_img ?
                                            <>
                                                <Card className="bg-lgray mb-4" style={{ width: '721px' }}>
                                                    <Card.Body className="pt-3 px-4 pb-4">
                                                        <p className='title-designer mb-2'>{user.primary_id_name}</p>
                                                        <img
                                                            src={user.primary_id_front_img}
                                                            alt='Front ID'
                                                            style={{ width: "335px", height: "251px", cursor: 'pointer', paddingRight: '11px' }}
                                                        />
                                                        {user.primary_id_back_img &&
                                                            <>
                                                                <img
                                                                    src={user.primary_id_back_img}
                                                                    alt='Back ID'
                                                                    style={{ width: "335px", height: "251px", cursor: 'pointer', paddingLeft: '11px' }}
                                                                />
                                                            </>
                                                        }
                                                    </Card.Body>
                                                </Card>
                                            </>
                                        : user.first_secondary_id_name && user.second_secondary_id_name && user.first_secondary_id_front_img && user.second_secondary_id_front_img ?
                                            <>
                                                <Card className="bg-lgray mb-4" style={{ width: '374px' }}>
                                                    <Card.Body className="pt-3 px-4 pb-4">
                                                        <p className='title-designer mb-2'>{user.first_secondary_id_name}</p>
                                                        <img
                                                            src={user.first_secondary_id_front_img}
                                                            alt='Front ID'
                                                            style={{ width: "335px", height: "251px", cursor: 'pointer', paddingRight: '11px' }}
                                                        />
                                                        <br />
                                                        <p className='title-designer mb-2 mt-3'>{user.second_secondary_id_name}</p>
                                                        <img
                                                            src={user.second_secondary_id_front_img}
                                                            alt='Front ID'
                                                            style={{ width: "335px", height: "251px", cursor: 'pointer', paddingRight: '11px' }}
                                                        />
                                                    </Card.Body>
                                                </Card>
                                            </>
                                        : null}
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col lg="6">
                                        {(user.primary_id_name && user.primary_id_front_img) || (user.first_secondary_id_name && user.second_secondary_id_name && user.first_secondary_id_front_img && user.second_secondary_id_front_img) ?
                                            <Button onClick={toggleverificationIDShow}>
                                                <span>Replace Document</span>
                                            </Button>
                                            :
                                            <Button onClick={toggleverificationIDShow}>
                                                <span>Upload Document</span>
                                            </Button>
                                        }
                                    </Col>
                                </Row>
                            </div>
                            : null}
                    </Container>
                </section >
            }

            {/* Setup Shop  */}
            <Modal show={setupShopShow} backdrop="static" centered size="lg" fullscreen={false} onHide={() => setSetupShopShow(false)}>
                <Modal.Body className="py-5">
                    <button type="button" className="btn-close no-header-close" onClick={() => setSetupShopShow(false)} aria-label="Close"></button>
                    <Container className="narrow-850 h-100">
                        <Row className=" align-items-center h-100">
                            <Col lg="12">
                                {/* <h3 className="text-center fw-600 mb-5">I am looking for...</h3> */}
                                <h3 className="text-left fw-600 mb-5">Set Up Shop</h3>
                                <Row>
                                    <Col lg="12" className="mb-3">
                                        {/* onClick={() => showSignupModal('user_designer')} */}
                                        <Card onClick={() => navigate('/user/designer-form')} className="cursor-pointer bg-white border-gold-hover border-solid-2">
                                            <Card.Body>
                                                <div className="user-box">
                                                    <div>
                                                        <img src={DesignerIcon} alt="Designers" />
                                                        <h3 className="fw-600">I am a designer</h3>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col lg="12" className="mb-3">
                                        {/* onClick={() => handleShowFabrics()} */}
                                        <Card onClick={() => navigate('/user/seller-form')} className="cursor-pointer bg-white border-gold-hover border-solid-2">
                                            <Card.Body>
                                                <div className="user-box">
                                                    <div>
                                                        <img src={FabricIcon} alt="Fabrics" />
                                                        <h3 className="fw-600">I am a fabric vendor</h3>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col lg="12">
                                        {/* onClick={() => handleShowDesigns()} */}
                                        <Card onClick={() => navigate('/user/designer-form?type=designer_seller')} className="cursor-pointer bg-white border-gold-hover border-solid-2">
                                            <Card.Body>
                                                <div className="user-box">
                                                    <div>
                                                        <img src={DesignIcon} alt="Designs" />
                                                        <h3 className="fw-600">I am both a designer and a fabric vendor</h3>
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

            <Modal
                show={captureBothPhotoModalShow}
                size='lg'
            // onHide={toggleCaptureBothPhoto}
            >
                <Modal.Header className="pb-0">
                    <button type='button' className='close react-modal-close' onClick={toggleCaptureBothPhoto} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <Card className="bg-lgray">
                        <Card.Body className="p-3">
                            <Row>
                                {showCaptureFrontImage ?
                                    <Col lg="12" >
                                        <img
                                            src={viewFrontCapture}
                                            alt='profile'
                                            style={{ width: "100%", height: "auto", border: '1px solid #ffffff', position: 'relative' }}
                                        />
                                    </Col>
                                    :
                                    <>
                                        <Col lg="12" className="webcam-container">
                                            <h2 className="text-center fw-600">Front of the ID</h2>
                                            <p className="text-center">Ensuring the front side is fully visible</p>
                                            <Webcam ref={webRef} onUserMedia={() => handleWebcamLoad()} style={{ width: "100%", height: "auto" }} />
                                            <div className="overlay-box"></div>
                                        </Col>
                                        <Col lg="12" >
                                            <Row style={{ position: 'absolute', bottom: '35px', width: '100%' }}>
                                                <div className="d-flex justify-content-right align-items-end col-3" style={{ position: 'relative' }}>
                                                    &nbsp;
                                                </div>
                                                {webcamLoaded && (
                                                    <div className="d-flex justify-content-center align-items-end col-6">
                                                        <button
                                                            className='camera-button'
                                                            type='button'
                                                            onClick={() => { showImage(); toggleshowCaptureFrontImage(); }}
                                                            style={{ position: 'relative', color: '#FFFFFF' }}
                                                        >
                                                            <FaCamera
                                                                size="30px"
                                                                className="cancel-button me-1 dot-icon"
                                                            />
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="col-3">
                                                    &nbsp;
                                                </div>
                                            </Row>
                                        </Col>
                                    </>
                                }
                            </Row>
                        </Card.Body>
                    </Card>
                </Modal.Body>
                {showCaptureFrontImage &&
                    <Modal.Footer className='text-right modal-footer-border'>

                        <Button
                            type="button"
                            className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
                            onClick={() => { toggleshowCaptureFrontImage(); setViewFrontCapture(null); }}>
                            Take Another Photo
                        </Button>

                        {formStatus !== "standby" ?
                            <Button
                                className='className="btn-save'
                                type='button'
                                style={{ cursor: 'not-allowed' }}
                            >
                                Saving...
                            </Button>
                            :
                            <Button
                                className='className="btn-save'
                                type='submit'
                                onClick={verificationFormData?.primary_id_name !== "Passport" && verificationFormData?.primary_id_name !== "SSS Unified Multi-Purpose ID (UMID)" && verificationFormData?.primary_id_name !== "PhilHealth ID" && verificationFormData?.primary_id_name !== "Postal ID" && verificationFormData?.primary_id_name !== "Voter's ID" && verificationFormData?.primary_id_name !== "Professional Regulation (PRC) ID"
                                    && verificationFormData?.first_secondary_id_name !== "Birth Certificate" && verificationFormData?.first_secondary_id_name !== "Barangay Certificate" && verificationFormData?.first_secondary_id_name !== "NBI Clearance" && verificationFormData?.first_secondary_id_name !== "TIN ID" && verificationFormData?.first_secondary_id_name !== "Government Service Insurance System (GSIS) e-Card" && verificationFormData?.first_secondary_id_name !== "Seaman's Book" && verificationFormData?.first_secondary_id_name !== "Company ID" && verificationFormData?.first_secondary_id_name !== "Cedula or Community Tax Certificate" && verificationFormData?.first_secondary_id_name !== "Student ID" && verificationFormData?.first_secondary_id_name !== "Police Clearance"
                                    && verificationFormData?.second_secondary_id_name !== "Birth Certificate" && verificationFormData?.second_secondary_id_name !== "Barangay Certificate" && verificationFormData?.second_secondary_id_name !== "NBI Clearance" && verificationFormData?.second_secondary_id_name !== "TIN ID" && verificationFormData?.second_secondary_id_name !== "Government Service Insurance System (GSIS) e-Card" && verificationFormData?.second_secondary_id_name !== "Seaman's Book" && verificationFormData?.second_secondary_id_name !== "Company ID" && verificationFormData?.second_secondary_id_name !== "Cedula or Community Tax Certificate" && verificationFormData?.second_secondary_id_name !== "Student ID" && verificationFormData?.second_secondary_id_name !== "Police Clearance" ?
                                    () => { captureBothSubmit(); toggleCapturePrimaryBackPhoto(); } :
                                    captureBothSubmit
                                }
                            >
                                SAVE
                            </Button>
                        }
                    </Modal.Footer>
                }
            </Modal>

            <Modal
                show={captureFrontPhotoModalShow}
                size='lg'
            // onHide={toggleCapturePrimaryFrontPhoto}
            >
                <Modal.Header className="pb-0">
                    <button type='button' className='close react-modal-close' onClick={toggleCapturePrimaryFrontPhoto} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <Card className="bg-lgray">
                        <Card.Body className="p-3">
                            <Row>
                                {showCaptureFrontImage ?
                                    <Col lg="12" >
                                        <img
                                            src={viewFrontCapture}
                                            alt='profile'
                                            style={{ width: "100%", height: "auto", border: '1px solid #ffffff', position: 'relative' }}
                                        />
                                    </Col>
                                    : <>
                                        <Col lg="12" className="webcam-container">
                                            <h2 className="text-center fw-600">Front of the ID</h2>
                                            <p className="text-center">Ensuring the front side is fully visible</p>
                                            <Webcam ref={webRef} onUserMedia={() => handleWebcamLoad()} style={{ width: "100%", height: "auto" }} />
                                            <div className="overlay-box"></div>
                                        </Col>
                                        <Col lg="12">
                                            <Row style={{ position: 'absolute', bottom: '35px', width: '100%' }}>
                                                <div className="d-flex justify-content-right align-items-end col-3" style={{ position: 'relative' }}>
                                                    &nbsp;
                                                </div>
                                                {webcamLoaded && (
                                                    <div className="d-flex justify-content-center align-items-end col-6">
                                                        <button
                                                            className='camera-button'
                                                            type='button'
                                                            onClick={() => { showImage(); toggleshowCaptureFrontImage(); }}
                                                            style={{ position: 'relative', color: '#FFFFFF' }}
                                                        >
                                                            <FaCamera
                                                                size="30px"
                                                                className="cancel-button me-1 dot-icon"
                                                            />
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="col-3">
                                                    &nbsp;
                                                </div>
                                            </Row>
                                        </Col>
                                    </>
                                }
                            </Row>
                        </Card.Body>
                    </Card>
                </Modal.Body>
                {showCaptureFrontImage &&
                    <Modal.Footer className='text-right modal-footer-border'>

                        <Button
                            type="button"
                            className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
                            onClick={() => { toggleshowCaptureFrontImage(); setViewFrontCapture(null); }}>
                            Take Another Photo
                        </Button>

                        {formStatus !== "standby" ?
                            <Button
                                className='className="btn-save'
                                type='button'
                                style={{ cursor: 'not-allowed' }}
                            >
                                Saving...
                            </Button>
                            :
                            <Button
                                className='className="btn-save'
                                type='submit'
                                onClick={() => { captureFrontSubmit(); }}
                            >
                                SAVE
                            </Button>
                        }
                    </Modal.Footer>
                }
            </Modal>

            <Modal
                show={captureBackPhotoModalShow}
                size='lg'
            // onHide={toggleCapturePrimaryBackPhoto}
            >
                <Modal.Header className="pb-0">
                    <button type='button' className='close react-modal-close' onClick={toggleCapturePrimaryBackPhoto} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <Card className="bg-lgray">
                        <Card.Body className="p-3">
                            <Row>
                                {showCaptureBackImage ?
                                    <Col lg="12" >
                                        <img
                                            src={viewBackCapture}
                                            alt='profile'
                                            style={{ width: "100%", height: "auto", border: '1px solid #ffffff', position: 'relative' }}
                                        />
                                    </Col>
                                    : <>
                                        <Col lg="12" className="webcam-container">
                                            <h2 className="text-center fw-600">Back of the ID</h2>
                                            <p className="text-center">Ensuring the back side is fully visible</p>
                                            <Webcam ref={webRef} onUserMedia={() => handleWebcamLoad()} style={{ width: "100%", height: "auto" }} />
                                            <div className="overlay-box"></div>
                                        </Col>
                                        <Col lg="12">
                                            <Row style={{ position: 'absolute', bottom: '35px', width: '100%' }}>
                                                <div className="d-flex justify-content-right align-items-end col-3" style={{ position: 'relative' }}>
                                                    &nbsp;
                                                </div>
                                                {webcamLoaded && (
                                                    <div className="d-flex justify-content-center align-items-end col-6">
                                                        <button
                                                            className='camera-button'
                                                            type='button'
                                                            onClick={() => { showBackImage(); toggleShowCaptureBackImage(); }}
                                                            style={{ position: 'relative', color: '#FFFFFF' }}
                                                        >
                                                            <FaCamera
                                                                size="30px"
                                                                className="cancel-button me-1 dot-icon"
                                                            />
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="col-3">
                                                    &nbsp;
                                                </div>
                                            </Row>
                                        </Col>
                                    </>
                                }
                            </Row>
                        </Card.Body>
                    </Card>
                </Modal.Body>
                {showCaptureBackImage &&
                    <Modal.Footer className='text-right modal-footer-border'>

                        <Button
                            type="button"
                            className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
                            onClick={() => { toggleShowCaptureBackImage(); setViewBackCapture(null); }}>
                            Take Another Photo
                        </Button>

                        {formStatus !== "standby" ?
                            <Button
                                className='className="btn-save'
                                type='button'
                                style={{ cursor: 'not-allowed' }}
                            >
                                Saving...
                            </Button>
                            :
                            <Button
                                className='className="btn-save'
                                type='submit'
                                onClick={() => { captureBackSubmit(); }}
                            >
                                SAVE
                            </Button>
                        }
                    </Modal.Footer>
                }
            </Modal>

            <Modal
                show={verificationIDShow}
                size='lg'
            >
                <Modal.Header className="pb-0">
                    <button type='button' className='close react-modal-close' onClick={toggleCloseverificationIDShow} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>
                <Form onSubmit={verificationIDSubmit}>
                    <Modal.Body>
                        <h2 className='modal-title fs-25 fw-600 text-center mb-2'>Identity Verification</h2>
                        <Card className="bg-lgray">
                            <Card.Body className="p-3">
                                <Row className="mb-3">
                                    <Col lg="12">
                                        <Form.Label>Country</Form.Label>
                                        <ReactFlagsSelect
                                            selected={selected}
                                            onSelect={(code) => selectedCountry(code)}
                                            placeholder="Select Country"
                                            searchable
                                            searchPlaceholder="Search countries"
                                            className="menu-flags bg-white"
                                            required
                                        />
                                    </Col>
                                </Row>
                                {selected &&
                                    <>
                                        <Form.Group>
                                            <Form.Label>List of Primary IDs</Form.Label>
                                            <Row>
                                                <Col>
                                                    <select
                                                        className="form-control mb-3 cursor-pointer"
                                                        name="primary_id_name"
                                                        defaultValue=""
                                                        onChange={handleChangeVerification}
                                                        value={verificationFormData.primary_id_name}
                                                        required
                                                    >
                                                        <option value="">Select Primary IDs</option>

                                                        <option value="Driver's License">Driver's License</option>
                                                        <option value="Passport">Passport</option>
                                                        {selected === "PH" &&
                                                            <>
                                                                <option value="SSS Unified Multi-Purpose ID (UMID)">SSS Unified Multi-Purpose ID (UMID)</option>
                                                                <option value="Philippine Identification (PhilID / ePhilID)">Philippine Identification (PhilID / ePhilID)</option>
                                                                <option value="PhilHealth ID">PhilHealth ID</option>
                                                                <option value="Postal ID">Postal ID</option>
                                                                <option value="Voter's ID">Voter's ID</option>
                                                                <option value="Professional Regulation (PRC) ID">Professional Regulation (PRC) ID</option>
                                                            </>
                                                        }
                                                        <option value="Other IDs">Other IDs</option>
                                                    </select>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </>
                                }
                                {verificationFormData?.primary_id_name &&
                                    <>
                                        {verificationFormData?.primary_id_name !== "Other IDs" ?
                                            <Form.Group>
                                                <Row>
                                                    <Col lg="12">
                                                        {primaryFrontPhoto && !captureBothPhotoModalShow && !captureBackPhotoModalShow ?
                                                            <Card>
                                                                <Card.Body className="d-flex">
                                                                    <Col lg={6} className="text-center" style={{ paddingRight: '9px' }}>
                                                                        {primaryFrontPhoto && !captureBothPhotoModalShow && !captureFrontPhotoModalShow && !captureBackPhotoModalShow ?
                                                                            <>
                                                                                <img
                                                                                    src={primaryFrontPhoto}
                                                                                    alt='profile'
                                                                                    style={{ width: "335px", height: "251px", border: '1px solid #ffffff', cursor: 'pointer' }}
                                                                                    className="mb-2"
                                                                                />
                                                                            </>
                                                                            : null}
                                                                        <span>Front ID</span>
                                                                        <br />
                                                                        <div className="d-flex justify-content-center mt-2">
                                                                            <Button className="btn-back me-3 btn btn-primary w-100" onClick={() => { toggleCapturePrimaryFrontPhoto(); setIDName('primary'); }} >
                                                                                <span>Capture Photo</span>
                                                                            </Button>
                                                                            <input
                                                                                type="file"
                                                                                onChange={handleChangeFrontID}
                                                                                style={{ display: 'none' }}
                                                                                accept="image/*"
                                                                                id="fileFrontID"
                                                                            />
                                                                            <Button className='btn-save btn btn btn-primary w-100' onClick={() => { document.getElementById('fileFrontID').click(); setIDName('primary') }}
                                                                            >
                                                                                <span>Upload</span>
                                                                            </Button>
                                                                        </div>
                                                                    </Col>
                                                                    <Col lg={6} className="text-center" style={{ paddingLeft: '9px' }}>
                                                                        {verificationFormData?.primary_id_name !== "Passport" && verificationFormData?.primary_id_name !== "SSS Unified Multi-Purpose ID (UMID)" && verificationFormData?.primary_id_name !== "PhilHealth ID" && verificationFormData?.primary_id_name !== "Postal ID" && verificationFormData?.primary_id_name !== "Voter's ID" && verificationFormData?.primary_id_name !== "Professional Regulation (PRC) ID" ?
                                                                            <>
                                                                                {primaryBackPhoto && !captureBothPhotoModalShow && !captureFrontPhotoModalShow && !captureBackPhotoModalShow ?
                                                                                    <>
                                                                                        <img
                                                                                            src={primaryBackPhoto}
                                                                                            alt='profile'
                                                                                            style={{ width: "335px", height: "251px", border: '1px solid #ffffff', cursor: 'pointer' }}
                                                                                            className="mb-2"
                                                                                        />
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                        {primaryFrontPhoto && !captureBothPhotoModalShow && !captureFrontPhotoModalShow && !captureBackPhotoModalShow ?
                                                                                            <div
                                                                                                style={{ width: "335px", height: "251px", border: '1px solid #ffffff', cursor: 'pointer' }}
                                                                                                className="mb-2">
                                                                                            </div>
                                                                                            : null}
                                                                                    </>
                                                                                }
                                                                                <span>Back ID</span>
                                                                                <br />
                                                                                <div className="d-flex justify-content-center mt-2">
                                                                                    <Button className="btn-back me-3 btn btn-primary w-100" onClick={() => { toggleCapturePrimaryBackPhoto(); setIDName('primary') }} >
                                                                                        <span>Capture Photo</span>
                                                                                    </Button>
                                                                                    <input
                                                                                        type="file"
                                                                                        onChange={handleChangeBackID}
                                                                                        style={{ display: 'none' }}
                                                                                        accept="image/*"
                                                                                        id="fileBackID"
                                                                                    />
                                                                                    <Button className='btn-save btn btn btn-primary w-100' onClick={() => { document.getElementById('fileBackID').click(); setIDName('primary') }}
                                                                                    >
                                                                                        <span>Upload</span>
                                                                                    </Button>
                                                                                </div>
                                                                            </>
                                                                            : null}
                                                                    </Col>
                                                                </Card.Body>
                                                            </Card>
                                                            :
                                                            <>
                                                                <Button className="btn-back me-3 btn btn-primary" onClick={() => { toggleCaptureBothPhoto(); setIDName('primary') }} >
                                                                    <span>Capture Photo</span>
                                                                </Button>
                                                                <input
                                                                    type="file"
                                                                    onChange={handleChangeFrontID}
                                                                    style={{ display: 'none' }}
                                                                    accept="image/*"
                                                                    id="fileFrontID"
                                                                />
                                                                <Button className='btn-save btn btn btn-primary' onClick={() => { document.getElementById('fileFrontID').click(); setIDName('primary') }}
                                                                >
                                                                    <span>Upload</span>
                                                                </Button>
                                                            </>
                                                        }
                                                    </Col>
                                                </Row>
                                            </Form.Group>
                                            :
                                            <>
                                                <Row>
                                                    <Col>
                                                        <Form.Label>List of Secondary IDs</Form.Label>
                                                        <select
                                                            className="form-control mb-3 cursor-pointer" waza
                                                            name="first_secondary_id_name"
                                                            defaultValue=""
                                                            onChange={handleChangeVerification}
                                                            value={verificationFormData.first_secondary_id_name}
                                                            required
                                                        >
                                                            <option value="">Select Secondary IDs</option>
                                                            {selected === "PH" &&
                                                                <>
                                                                    {secondaryIdOptions.map((id) => (
                                                                        <option
                                                                            key={id}
                                                                            value={id}
                                                                            disabled={verificationFormData.second_secondary_id_name === id}
                                                                        >
                                                                            {id}
                                                                        </option>
                                                                    ))}
                                                                </>
                                                            }
                                                        </select>
                                                    </Col>
                                                </Row>
                                                {verificationFormData.first_secondary_id_name && 
                                                    <>
                                                        <Form.Group>
                                                            <Row className="mb-3">
                                                                <Col lg="12">
                                                                    {firstSecondaryFrontPhoto && !captureBothPhotoModalShow && !captureFrontPhotoModalShow && !captureBackPhotoModalShow ?
                                                                        <Card>
                                                                            <Card.Body className="d-flex">
                                                                                <Col lg={6} className="text-center" style={{ paddingRight: '9px' }}>
                                                                                    {firstSecondaryFrontPhoto ?
                                                                                        <>
                                                                                            <img
                                                                                                src={firstSecondaryFrontPhoto}
                                                                                                alt='profile'
                                                                                                style={{ width: "335px", height: "251px", border: '1px solid #ffffff', cursor: 'pointer' }}
                                                                                                className="mb-2"
                                                                                            />
                                                                                        </>
                                                                                    : null}
                                                                                    <span>Front ID</span>
                                                                                    <br />
                                                                                    <div className="d-flex justify-content-center mt-2">
                                                                                        <Button className="btn-back me-3 btn btn-primary w-100" onClick={() => { toggleCapturePrimaryFrontPhoto(); setIDName('first_secondary') }} >
                                                                                            <span>Capture Photo</span>
                                                                                        </Button>
                                                                                        <input
                                                                                            type="file"
                                                                                            onChange={handleChangeFrontID}
                                                                                            style={{ display: 'none' }}
                                                                                            accept="image/*"
                                                                                            id="secondaryFileFrontID"
                                                                                        />
                                                                                        <Button className='btn-save btn btn btn-primary w-100' onClick={() => { document.getElementById('secondaryFileFrontID').click(); setIDName('first_secondary') }}
                                                                                        >
                                                                                            <span>Upload</span>
                                                                                        </Button>
                                                                                    </div>
                                                                                </Col>
                                                                                <Col lg={6} className="text-center" style={{ paddingLeft: '9px' }}>
                                                                                    {/* {firstSecondaryBackPhoto ?
                                                                                        <>
                                                                                            <img
                                                                                                src={firstSecondaryBackPhoto}
                                                                                                alt='profile'
                                                                                                style={{ width: "335px", height: "251px", border: '1px solid #ffffff', cursor: 'pointer' }}
                                                                                                className="mb-2"
                                                                                            />
                                                                                        </>
                                                                                        :
                                                                                        <div
                                                                                            style={{ width: "335px", height: "251px", border: '1px solid #ffffff', cursor: 'pointer' }}
                                                                                            className="mb-2">
                                                                                        </div>
                                                                                    }
                                                                                    <span>Back ID</span>
                                                                                    <br />
                                                                                    <div className="d-flex justify-content-center mt-2">
                                                                                        <Button className="btn-back me-3 btn btn-primary w-100" onClick={() => { toggleCapturePrimaryBackPhoto(); setIDName('first_secondary') }} >
                                                                                            <span>Capture Photo</span>
                                                                                        </Button>
                                                                                        <input
                                                                                            type="file"
                                                                                            onChange={handleChangeBackID}
                                                                                            style={{ display: 'none' }}
                                                                                            accept="image/*"
                                                                                            id="secondaryFileBackID"
                                                                                        />
                                                                                        <Button className='btn-save btn btn btn-primary w-100' onClick={() => { document.getElementById('secondaryFileBackID').click(); setIDName('first_secondary') }}
                                                                                        >
                                                                                            <span>Upload</span>
                                                                                        </Button>
                                                                                    </div> */}
                                                                                </Col>
                                                                            </Card.Body>
                                                                        </Card>
                                                                        :
                                                                        <>
                                                                            <Button className="btn-back me-3 btn btn-primary" onClick={() => { toggleCaptureBothPhoto(); setIDName('first_secondary') }} >
                                                                                <span>Capture Photo</span>
                                                                            </Button>
                                                                            <input
                                                                                type="file"
                                                                                onChange={handleChangeFrontID}
                                                                                style={{ display: 'none' }}
                                                                                accept="image/*"
                                                                                id="secondaryFileFrontID"
                                                                            />
                                                                            <Button className='btn-save btn btn btn-primary' onClick={() => { document.getElementById('secondaryFileFrontID').click(); setIDName('first_secondary') }}
                                                                            >
                                                                                <span>Upload</span>
                                                                            </Button>
                                                                        </>
                                                                    }
                                                                </Col>
                                                            </Row>
                                                        </Form.Group>
                                                    </>
                                                }
                                                {(isFirstSecondaryPhotoUploaded || isSecondSecondaryPhotoUploaded) ?
                                                    <>
                                                        <Row>
                                                            <Col>
                                                                {verificationFormData.first_secondary_id_name || verificationFormData.second_secondary_id_name ?
                                                                    <>
                                                                        <select
                                                                            className="form-control mb-3 cursor-pointer"
                                                                            name="second_secondary_id_name"
                                                                            defaultValue=""
                                                                            onChange={handleChangeVerification}
                                                                            value={verificationFormData.second_secondary_id_name}
                                                                            required
                                                                        >

                                                                            <option value="">Select Secondary IDs</option>
                                                                            {selected === "PH" &&
                                                                                <>
                                                                                    {secondaryIdOptions.map((id) => (
                                                                                        <option
                                                                                            key={id}
                                                                                            value={id}
                                                                                            disabled={verificationFormData.first_secondary_id_name === id}
                                                                                        >
                                                                                            {id}
                                                                                        </option>
                                                                                    ))}
                                                                                </>
                                                                            }
                                                                        </select>
                                                                    </>
                                                                    : null}
                                                            </Col>
                                                        </Row>
                                                        {verificationFormData.second_secondary_id_name &&
                                                            <>
                                                                <Form.Group>
                                                                    <Row>
                                                                        <Col lg="12">
                                                                            {secondSecondaryFrontPhoto && !captureBothPhotoModalShow && !captureFrontPhotoModalShow && !captureBackPhotoModalShow ?
                                                                                <Card>
                                                                                    <Card.Body className="d-flex">
                                                                                        <Col lg={6} className="text-center" style={{ paddingRight: '9px' }}>
                                                                                            {secondSecondaryFrontPhoto ?
                                                                                                <>
                                                                                                    <img
                                                                                                        src={secondSecondaryFrontPhoto}
                                                                                                        alt='profile'
                                                                                                        style={{ width: "335px", height: "251px", border: '1px solid #ffffff', cursor: 'pointer' }}
                                                                                                        className="mb-2"
                                                                                                    />
                                                                                                </>
                                                                                                : null}
                                                                                            <span>Front ID</span>
                                                                                            <br />
                                                                                            <div className="d-flex justify-content-center mt-2">
                                                                                                <Button className="btn-back me-3 btn btn-primary w-100" onClick={() => { toggleCapturePrimaryFrontPhoto(); setIDName('second_secondary') }} >
                                                                                                    <span>Capture Photo</span>
                                                                                                </Button>
                                                                                                <input
                                                                                                    type="file"
                                                                                                    onChange={handleChangeFrontID}
                                                                                                    style={{ display: 'none' }}
                                                                                                    accept="image/*"
                                                                                                    id="secondSecondaryFileFrontID"
                                                                                                />
                                                                                                <Button className='btn-save btn btn btn-primary w-100' onClick={() => { document.getElementById('secondSecondaryFileFrontID').click(); setIDName('second_secondary') }}
                                                                                                >
                                                                                                    <span>Upload</span>
                                                                                                </Button>
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col lg={6} className="text-center" style={{ paddingLeft: '9px' }}>
                                                                                            {/* {secondSecondaryBackPhoto ?
                                                                                                <>
                                                                                                    <img
                                                                                                        src={secondSecondaryBackPhoto}
                                                                                                        alt='profile'
                                                                                                        style={{ width: "335px", height: "251px", border: '1px solid #ffffff', cursor: 'pointer' }}
                                                                                                        className="mb-2"
                                                                                                    />
                                                                                                </>
                                                                                                :
                                                                                                <div
                                                                                                    style={{ width: "335px", height: "251px", border: '1px solid #ffffff', cursor: 'pointer' }}
                                                                                                    className="mb-2">
                                                                                                </div>
                                                                                            }
                                                                                            <span>Back ID</span>
                                                                                            <br />
                                                                                            <div className="d-flex justify-content-center mt-2">
                                                                                                <Button className="btn-back me-3 btn btn-primary w-100" onClick={() => { toggleCapturePrimaryBackPhoto(); setIDName('second_secondary') }} >
                                                                                                    <span>Capture Photo</span>
                                                                                                </Button>
                                                                                                <input
                                                                                                    type="file"
                                                                                                    onChange={handleChangeBackID}
                                                                                                    style={{ display: 'none' }}
                                                                                                    accept="image/*"
                                                                                                    id="secondSecondaryFileBackID"
                                                                                                />
                                                                                                <Button className='btn-save btn btn btn-primary w-100' onClick={() => { document.getElementById('secondSecondaryFileBackID').click(); setIDName('second_secondary') }}
                                                                                                >
                                                                                                    <span>Upload</span>
                                                                                                </Button>
                                                                                            </div> */}
                                                                                        </Col>
                                                                                    </Card.Body>
                                                                                </Card>
                                                                                :
                                                                                <>
                                                                                    <Button className="btn-back me-3 btn btn-primary" onClick={() => { toggleCaptureBothPhoto(); setIDName('second_secondary') }} >
                                                                                        <span>Capture Photo</span>
                                                                                    </Button>
                                                                                    <input
                                                                                        type="file"
                                                                                        onChange={handleChangeFrontID}
                                                                                        style={{ display: 'none' }}
                                                                                        accept="image/*"
                                                                                        id="secondSecondaryFileFrontID"
                                                                                    />
                                                                                    <Button className='btn-save btn btn btn-primary' onClick={() => { document.getElementById('secondSecondaryFileFrontID').click(); setIDName('second_secondary') }}
                                                                                    >
                                                                                        <span>Upload</span>
                                                                                    </Button>
                                                                                </>
                                                                            }
                                                                        </Col>
                                                                    </Row>
                                                                </Form.Group>
                                                            </>
                                                        }
                                                    </>

                                                    : null}
                                            </>
                                        }
                                    </>
                                }
                            </Card.Body>
                        </Card>
                    </Modal.Body>
                    <Modal.Footer className='text-right modal-footer-border'>

                        <Button
                            type="button"
                            className="btn-back me-3 btn btn-primary"
                            onClick={() => { toggleCloseverificationIDShow(); }}
                        >
                            Cancel
                        </Button>

                        {formStatus !== "standby" ?
                            <Button
                                className='btn-save btn btn btn-primary'
                                type='button'
                                style={{ cursor: 'not-allowed' }}
                            >
                                Saving...
                            </Button>
                            :
                            <Button
                                className='btn-save btn btn btn-primary'
                                type='submit'
                            >
                                SAVE
                            </Button>
                        }
                    </Modal.Footer>
                </Form>
            </Modal>
        </Layout >
    );
};

export default Profile;