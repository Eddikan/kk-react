/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "hooks/useAuth";
import {
  useUpdateUserAvatarMutation,
  useUpdateUserSettingsMutation,
  useUpdatePasswordMutation,
} from "store/api/mutations";
import { useGetProfileQuery } from "store/api/queries";

const initialDesignerData = Object.freeze({
  design_inspirations: "",
  design_process: "",
  areas_of_specialization: "",
  lead_time: "",
  pricing_structure: "",
});

const initialUpdatePasswordData = Object.freeze({
  new_password: "",
  current_password: "",
  confirm_password: "",
});

const useProfile = () => {
  const { logOut } = useAuth();

  const useQuery = () => new URLSearchParams(useLocation().search);
  let query = useQuery();
  const tab = query.get("tab");
  const tab_group = query.get("tab_group");
  const currentStoreUser = useSelector((state) => state.user.user);

  const [user, setUser] = useState(currentStoreUser);

  const [designer, setDesigner] = useState(initialDesignerData);
  const [userLoading, setUserLoading] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);
  const [aboutShow, setAboutShow] = useState(true);
  const [portfolioShow, setPortfolioShow] = useState(false);
  const [fabricShow, setFabricShow] = useState(false);
  const [processShow, setProcessShow] = useState(false);
  const [limitedDesignShow, setLimitedDesignShow] = useState(false);
  const [myCalendarShow, setMyCalendarShow] = useState(false);
  const [securityShow, setSecurityShow] = useState(false);
  const [verificationShow, setVerificationShow] = useState(false);
  const [bodyMeasurementShow, setBodyMeasurementShow] = useState(false);
  const [formStatus, setFormStatus] = useState("standby");
  const [cookies, setCookie, removeCookie] = useCookies([
    "currentUser",
    "activeProfileTab",
    "userDetails",
  ]);
  const [setupShopShow, setSetupShopShow] = useState(false);
  const [activeTab, setActiveTab] = useState(tab ? tab : "profile");
  const [activeTabGroup, setActiveTabGroup] = useState(
    tab_group ? tab_group : "account"
  );
  const [updatePasswordModalShow, setUpdatePasswordModalShow] = useState(false);
  const [updatePasswordFormData, setUpdatePasswordFormData] = useState(
    initialUpdatePasswordData
  );

  const [selected, setSelected] = useState("");

  const [captureBothPhotoModalShow, setCaptureBothPhotoModalShow] =
    useState(false);
  const [viewFrontCapture, setViewFrontCapture] = useState(null);
  const [webcamLoaded, setWebcamLoaded] = useState(false);
  const [showCaptureFrontImage, setShowCaptureFrontImage] = useState(false);

  const [verificationIDShow, setVerificationIDShow] = useState(false);
  const [verificationFormData, setVerificationFormData] = useState([]);

  const [captureFrontPhotoModalShow, setCaptureFrontPhotoModalShow] =
    useState(false);
  const [primaryFrontPhoto, setPrimaryFrontPhoto] = useState(null);
  const [primaryBackPhoto, setPrimaryBackPhoto] = useState(null);

  const [firstSecondaryFrontPhoto, setFirstSecondaryFrontPhoto] =
    useState(null);
  const [secondSecondaryFrontPhoto, setSecondSecondaryFrontPhoto] =
    useState(null);

  const [firstSecondaryBackPhoto, setFirstSecondaryBackPhoto] = useState(null);
  const [secondSecondaryBackPhoto, setSecondSecondaryBackPhoto] =
    useState(null);

  const [captureBackPhotoModalShow, setCaptureBackPhotoModalShow] =
    useState(false);
  const [viewBackCapture, setViewBackCapture] = useState(null);
  const [showCaptureBackImage, setShowCaptureBackImage] = useState(false);

  const [iDName, setIDName] = useState("");
  const [updateUserAvatar, { isLoading: isImageUpdating }] =
    useUpdateUserAvatarMutation();
  const [updateUserSettings, { isLoading: isSettingsUpdating }] =
    useUpdateUserSettingsMutation();
  const [isUpdatingDelayed, setIsUpdatingDelayed] = useState(false);
  useEffect(() => {
    if (isSettingsUpdating) {
      // Update immediately when true
      setIsUpdatingDelayed(true);
    } else {
      // Delay update when false
      const timer = setTimeout(() => {
        setIsUpdatingDelayed(false);
      }, 500);

      return () => clearTimeout(timer); // Cleanup timer if `isSettingsUpdating` changes before 0.5 seconds
    }
  }, [isSettingsUpdating]);


  const [updatePassword, { isLoading: isUpdatingPassword }] =
    useUpdatePasswordMutation();

  const { refetch: refetchUser } = useGetProfileQuery();

  const currentUser = cookies.currentUser;
  const token = cookies.token;
  const activeProfileTab = cookies.activeProfileTab;
  const userDetails = cookies.userDetails;

  const secondaryIdOptions = [
    "Birth Certificate",
    "Barangay Certificate",
    "NBI Clearance",
    "TIN ID",
    "Government Service Insurance System (GSIS) e-Card",
    "Seaman's Book",
    "Company ID",
    "Cedula or Community Tax Certificate",
    "Student ID",
    "Police Clearance",
  ];

  const webRef = useRef(null);

  const isFirstSecondaryPhotoUploaded =
    firstSecondaryFrontPhoto &&
    !captureBothPhotoModalShow &&
    !captureFrontPhotoModalShow &&
    !captureBackPhotoModalShow &&
    verificationFormData.first_secondary_id_name;
  const isSecondSecondaryPhotoUploaded =
    verificationFormData.second_secondary_id_name && secondSecondaryFrontPhoto;

  const [uploadStatus, setUploadStatus] = useState("standby");
  const hiddenFileInputImg = useRef(null);

  const navigate = useNavigate();

  const handleWebcamLoad = () => {
    setWebcamLoaded(true);
  };

  const showImage = async () => {
    const screenshot = webRef.current.getScreenshot();
    if (screenshot) {
      setViewFrontCapture(screenshot);
    }
  };

  const toggleUpdatePasswordModal = (e) => {
    setUpdatePasswordModalShow(!updatePasswordModalShow);
  };

  const toggleCaptureBothPhoto = () => {
    setCaptureBothPhotoModalShow(!captureBothPhotoModalShow);
    setViewFrontCapture(null);
    setShowCaptureFrontImage(false);
  };

  const toggleshowCaptureFrontImage = () => {
    setShowCaptureFrontImage(!showCaptureFrontImage);
  };

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
  };

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
  };

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
  };

  const toggleverificationIDShow = () => {
    setReloadCount((count) => reloadCount + 1);
    setVerificationIDShow(!verificationIDShow);
    setWebcamLoaded(false);
  };

  const toggleCloseverificationIDShow = () => {
    setVerificationIDShow(false);
    setWebcamLoaded(false);
    setViewFrontCapture(null);
    setViewBackCapture(null);
    setPrimaryFrontPhoto(null);
    setPrimaryBackPhoto(null);
  };

  const verificationIDSubmit = (e) => {
    setFormStatus("loading");
    e.preventDefault();

    if (verificationFormData?.primary_id_name !== "Other IDs") {
      if (primaryFrontPhoto === null || primaryFrontPhoto === "") {
        toast.error(
          "Please upload the front image of your ID for verification!"
        );
        setFormStatus("standby");
        return;
      } else if (
        verificationFormData?.primary_id_name !== "Passport" &&
        verificationFormData?.primary_id_name !==
          "SSS Unified Multi-Purpose ID (UMID)" &&
        verificationFormData?.primary_id_name !== "PhilHealth ID" &&
        verificationFormData?.primary_id_name !== "Postal ID" &&
        verificationFormData?.primary_id_name !== "Voter's ID" &&
        verificationFormData?.primary_id_name !==
          "Professional Regulation (PRC) ID"
      ) {
        if (primaryBackPhoto === null || primaryBackPhoto === "") {
          toast.error(
            "Please upload the back image of your ID for verification!"
          );
          setFormStatus("standby");
          return;
        }
      }
    }

    if (verificationFormData?.first_secondary_id_name) {
      if (
        firstSecondaryFrontPhoto === null ||
        firstSecondaryFrontPhoto === ""
      ) {
        toast.error(
          "Please upload an image of your first secondary ID for verification!"
        );
        setFormStatus("standby");
        return;
      }
      if (verificationFormData?.second_secondary_id_name) {
        if (
          secondSecondaryFrontPhoto === null ||
          secondSecondaryFrontPhoto === ""
        ) {
          toast.error(
            "Please upload an image of your second secondary ID for verification!"
          );
          setFormStatus("standby");
          return;
        }
      }
    }

    axios
      .put(
        import.meta.env.VITE_REACT_APP_API_ENDPOINT +
          "user/" +
          currentUser +
          "?user_id=" +
          currentUser +
          "&token=" +
          token,
        {
          ...verificationFormData,
          id_country: selected,
          primary_id_front_img: primaryFrontPhoto,
          primary_id_back_img: primaryBackPhoto,
          first_secondary_id_front_img: firstSecondaryFrontPhoto,
          first_secondary_id_back_img: firstSecondaryBackPhoto,
          second_secondary_id_front_img: secondSecondaryFrontPhoto,
          second_secondary_id_back_img: secondSecondaryBackPhoto,
        }
      )
      .then((response) => {
        const success = response.data.status;
        if (success === "Success") {
          setVerificationIDShow(false);
          toast.success("Government ID updated successfully!");
          setFormStatus("standby");
          setVerificationFormData([]);
          setViewFrontCapture(null);
          setViewBackCapture(null);
          setPrimaryFrontPhoto(null);
          setPrimaryBackPhoto(null);
          setWebcamLoaded(false);
          setReloadCount((count) => reloadCount + 1);
        } else {
          setFormStatus("standby");
          toast.error(
            "There has been an error saving the government ID, please try again!"
          );
        }
      })
      .catch((error) => {
        setFormStatus("standby");
        toast.error(
          "There has been an error saving the government ID, please try again!"
        );
      });
  };

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

  const toggleCapturePrimaryFrontPhoto = () => {
    setCaptureFrontPhotoModalShow(!captureFrontPhotoModalShow);
    setWebcamLoaded(false);
    setShowCaptureFrontImage(false);
  };

  const showBackImage = async () => {
    const screenshot = webRef.current.getScreenshot();
    if (screenshot) {
      setViewBackCapture(screenshot);
    }
  };

  const toggleCapturePrimaryBackPhoto = () => {
    setCaptureBackPhotoModalShow(!captureBackPhotoModalShow);
    setShowCaptureBackImage(false);
    setWebcamLoaded(false);
  };

  const toggleShowCaptureBackImage = () => {
    setShowCaptureBackImage(!showCaptureBackImage);
  };

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
  };

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

  const handleClickImg = (event) => {
    hiddenFileInputImg.current.click();
  };

  const handleChangeVerification = (e) => {
    const { name, value } = e.target;

    setVerificationFormData({
      ...verificationFormData,
      [name]: value,
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

        setVerificationFormData((prevState) => ({
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

        setVerificationFormData((prevState) => ({
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

        setVerificationFormData((prevState) => ({
          ...prevState,
          primary_id_front_img: "",
          primary_id_back_img: "",

          second_secondary_id_front_img: "",
          second_secondary_id_back_img: "",
        }));
      }
    }
  };

  const toggleSetupShopShow = () => {
    setSetupShopShow(!setupShopShow);
  };

  const handleChangeImg = ({ target }) => {
    if (target.files < 1 || !target.validity.valid) {
      return;
    }
    if (target.files[0]) {
      submitDocument(target.files[0]);
    }
  };

  const submitDocument = async (event) => {
    const dataArray = new FormData();
    dataArray.append("image", event);
    const res = await updateUserAvatar(dataArray).unwrap();
    if (res.success) {
      refetchUser();
    }
  };

  const handleChangePassword = (e) => {
    const { name, value } = e.target;

    setUpdatePasswordFormData({
      ...updatePasswordFormData,
      [name]: value,
    });
  };

  async function handleTwoFAChange(event) {
    const newValue = event.target.checked ? true : false;
    const currentSettings = currentStoreUser.settings;
    const payload = {
      ...currentSettings,
      two_factor_enabled: newValue,
    };
    const res = await updateUserSettings(payload).unwrap();
    if (res.success) {
      toast.success(res.message);
      refetchUser();
    }
  }

  async function updatePasswordSubmit(e) {
    e.preventDefault();
    if (
      updatePasswordFormData.new_password !=
      updatePasswordFormData.confirm_password
    ) {
      toast.error("New Password and Confirm New Password does not match");
    } else {
      const payload = {
        password: updatePasswordFormData.new_password,
        password_confirmation: updatePasswordFormData.confirm_password,
        current_password: updatePasswordFormData.current_password,
      };
      const res = await updatePassword(payload).unwrap();
      if (res.success) {
        toast.success(res.message);
        toast.success("Please Login with your new password");
        setUpdatePasswordModalShow(false);
        logOut();
        // clear form inputs
        // logout
        // refetchUser();
      }
    }
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
      setBodyMeasurementShow(false);
    } else if (tab == "portfolio") {
      setPortfolioShow(true);
      setAboutShow(false);
      setFabricShow(false);
      setProcessShow(false);
      setLimitedDesignShow(false);
      setMyCalendarShow(false);
      setSecurityShow(false);
      setVerificationShow(false);
      setBodyMeasurementShow(false);
    } else if (tab == "fabric") {
      setFabricShow(true);
      setPortfolioShow(false);
      setAboutShow(false);
      setProcessShow(false);
      setLimitedDesignShow(false);
      setMyCalendarShow(false);
      setSecurityShow(false);
      setVerificationShow(false);
      setBodyMeasurementShow(false);
    } else if (tab == "process") {
      setProcessShow(true);
      setPortfolioShow(false);
      setAboutShow(false);
      setFabricShow(false);
      setLimitedDesignShow(false);
      setMyCalendarShow(false);
      setSecurityShow(false);
      setVerificationShow(false);
      setBodyMeasurementShow(false);
    } else if (tab == "calendar") {
      setLimitedDesignShow(true);
      setProcessShow(false);
      setPortfolioShow(false);
      setAboutShow(false);
      setFabricShow(false);
      setMyCalendarShow(false);
      setSecurityShow(false);
      setVerificationShow(false);
      setBodyMeasurementShow(false);
    } else if (tab == "my_calendar") {
      setLimitedDesignShow(false);
      setProcessShow(false);
      setPortfolioShow(false);
      setAboutShow(false);
      setFabricShow(false);
      setMyCalendarShow(true);
      setSecurityShow(false);
      setVerificationShow(false);
      setBodyMeasurementShow(false);
    } else if (tab == "security") {
      setLimitedDesignShow(false);
      setProcessShow(false);
      setPortfolioShow(false);
      setAboutShow(false);
      setFabricShow(false);
      setMyCalendarShow(false);
      setSecurityShow(true);
      setVerificationShow(false);
      setBodyMeasurementShow(false);
    } else if (tab == "verification") {
      setLimitedDesignShow(false);
      setProcessShow(false);
      setPortfolioShow(false);
      setAboutShow(false);
      setFabricShow(false);
      setMyCalendarShow(false);
      setSecurityShow(false);
      setVerificationShow(true);
      setBodyMeasurementShow(false);
    } else if (tab == "body_measurement") {
      setLimitedDesignShow(false);
      setProcessShow(false);
      setPortfolioShow(false);
      setAboutShow(false);
      setFabricShow(false);
      setMyCalendarShow(false);
      setSecurityShow(false);
      setVerificationShow(false);
      setBodyMeasurementShow(true);
    }
  };

 

  useEffect(() => {

    if (activeProfileTab && activeProfileTab != "") {
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
  useEffect(() => {
    setUser(currentStoreUser);
  }, [currentStoreUser]);
  return {
    user,
    setActiveTabGroup,
    setActiveTab,
    designer,
    userLoading,
    removeCookie,
    reloadCount,
    aboutShow,
    portfolioShow,
    fabricShow,
    processShow,
    limitedDesignShow,
    myCalendarShow,
    securityShow,
    verificationShow,
    bodyMeasurementShow,
    formStatus,
    cookies,
    setupShopShow,
    activeTab,
    activeTabGroup,
    updatePasswordModalShow,
    updatePasswordFormData,
    selected,
    captureBothPhotoModalShow,
    viewFrontCapture,
    webcamLoaded,
    showCaptureFrontImage,
    verificationIDShow,
    verificationFormData,
    captureFrontPhotoModalShow,
    primaryFrontPhoto,
    primaryBackPhoto,
    firstSecondaryFrontPhoto,
    secondSecondaryFrontPhoto,
    firstSecondaryBackPhoto,
    secondSecondaryBackPhoto,
    captureBackPhotoModalShow,
    viewBackCapture,
    showCaptureBackImage,
    iDName,
    setIDName,
    currentUser,
    token,
    activeProfileTab,
    userDetails,
    secondaryIdOptions,
    webRef,
    isFirstSecondaryPhotoUploaded,
    isSecondSecondaryPhotoUploaded,
    isUpdatingPassword,
    uploadStatus,
    hiddenFileInputImg,
    navigate,
    handleWebcamLoad,
    showImage,
    toggleUpdatePasswordModal,
    toggleCaptureBothPhoto,
    toggleshowCaptureFrontImage,
    selectedCountry,
    captureBothSubmit,
    captureFrontSubmit,
    toggleverificationIDShow,
    toggleCloseverificationIDShow,
    verificationIDSubmit,
    handleChangeFrontID,
    toggleCapturePrimaryFrontPhoto,
    showBackImage,
    toggleCapturePrimaryBackPhoto,
    toggleShowCaptureBackImage,
    captureBackSubmit,
    handleChangeBackID,
    handleClickImg,
    handleChangeVerification,
    toggleSetupShopShow,
    handleChangeImg,
    submitDocument,
    handleChangePassword,
    handleTwoFAChange,
    updatePasswordSubmit,
    showTab,
    setSetupShopShow,
    setViewBackCapture,
    setUpdatePasswordModalShow,
    setViewFrontCapture,
    isImageUpdating,
    isUpdatingDelayed,
  };
};

export default useProfile;
