import { useEffect, useState } from "react";
import { Row, Col, Button, Form, FormControl } from "react-bootstrap";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";
import PhoneInput from "react-phone-input-2";
import { useSelector } from "react-redux";
import { useUpdateUserMutation } from "store/api/mutations";

import "react-phone-input-2/lib/style.css";

const ContactStep = ({ reload }) => {
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const currentStoreUser = useSelector((state) => state.user.user);
  const user = currentStoreUser;
  const [cookie, setCookie] = useCookies([
    "currentUser",
    "aboutDone",
    "addressDone",
    "contactDone",
    "socialDone",
    "token",
  ]);
  const [profileFormData, setProfileFormData] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfileFormData({
      ...profileFormData,
      [name]: value,
    });
  };

  const handleChangePhone = (value, countryData) => {
    const countryCode = countryData.dialCode;
    const phoneNumber = value.slice(countryCode.length);
    const formattedNumber = phoneNumber.slice(0, 11);

    setProfileFormData({
      ...profileFormData,
      phone: {
        country_code: "+" + countryCode,
        number: formattedNumber,
      },
    });
  };

  const isValid = (value, type) => {
    if (value === "") {
      return true;
    }
    if (type === "url") {
      const valid =
        /^(https?:\/\/)?(ftp:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/i;
      return valid.test(value);
    } else if (type === "secondary_email") {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return valid.test(value);
    }
  };

  async function submitProfile(e) {
    if (
      !profileFormData.website ||
      (profileFormData.website && !isValid(profileFormData.website, "url"))
    ) {
      toast.error("Please enter a valid website link!");
      return;
    }

    if (
      profileFormData.secondary_email_address &&
      !isValid(profileFormData.secondary_email_address, "secondary_email")
    ) {
      toast.error("Please enter a valid secondary email address!");
      return;
    }

    if (
      profileFormData.phone.number === "" ||
      profileFormData.phone.number == null
    ) {
      toast("Phone Number is required!", {
        icon: "⚠️",
      });
    } else {
      e.preventDefault();

      const payload = {
        phone: profileFormData.phone,
        website: profileFormData.website,
        secondary_email: profileFormData.secondary_email_address,
      };
      const res = await updateUser({ type: "CONTACT", ...payload }).unwrap();
      if (res.success) {
        setCookie("contactDone", "Yes", { path: "/" });
        toast.success(res.message);
        reload();
      }
    }
  }

  async function submitBack(e) {
    e.preventDefault();
    reload();
    setCookie("addressDone", "No", { path: "/" });
    setCookie("contactDone", "No", { path: "/" });
  }

  useEffect(() => {
    if (user) {
      setProfileFormData({
        ...user.business_profile,
        secondary_email_address: user.business_profile.secondary_email,
        phone_number: user?.phone?.country_code + user?.phone.number,
        phone: {
          country_code: user?.phone?.country_code,
          number: user?.phone.number,
        },
      });
    }
  }, [user]);

  return (
    <>
      <div className="edit-contact mt-3">
        <Col lg="12">
          {currentStoreUser.type !== "customer" && (
            <Form.Group className="mb-4">
              <Form.Label>Website</Form.Label>
              <FormControl
                type="text"
                name="website"
                value={profileFormData.website}
                className="mr-sm-2"
                onChange={handleChange}
                placeholder=""
              />
              {profileFormData.website &&
                profileFormData.website != "" &&
                !isValid(profileFormData.website, "url") && (
                  <div className="text-danger mt-1 fs-12">
                    Please enter a valid website link.
                  </div>
                )}
            </Form.Group>
          )}
        </Col>
        <Row>
          <Col lg="6">
            <Form.Group className="mb-4">
              <Form.Label>
                Phone Number<span className="text-danger">*</span>
              </Form.Label>
              <PhoneInput
                enableSearch={true}
                country={"us"}
                value={profileFormData.phone_number || ""}
                onChange={(value, countryData) =>
                  handleChangePhone(value, countryData)
                }
                containerStyle={{
                  width: "100%",
                }}
                inputStyle={{
                  backgroundColor: "transparent",
                  width: "100%",
                  boxShadow: "none",
                  padding: "7px 15px",
                  paddingLeft: "50px",
                  fontSize: "14px",
                  fontFamily: "Poppins",
                  border: "1px solid #f3f3f3",
                  minHeight: "40px",
                }}
                buttonStyle={{
                  backgroundColor: "transparent",
                  borderRight: "none",
                  border: "1px solid #f3f3f3",
                }}
                searchStyle={{
                  width: "80%",
                }}
                countryListStyle={{
                  width: "225px",
                }}
              />
            </Form.Group>
          </Col>
          <Col lg="6">
            <Form.Group className="mb-4">
              <Form.Label>Secondary Email</Form.Label>
              <FormControl
                type="email"
                name="secondary_email_address"
                value={profileFormData.secondary_email_address}
                className="mr-sm-2"
                onChange={handleChange}
                placeholder=""
              />
              {profileFormData.secondary_email_address &&
                profileFormData.secondary_email_address !== "" &&
                !isValid(
                  profileFormData.secondary_email_address,
                  "secondary_email"
                ) && (
                  <div className="text-danger mt-1 fs-12">
                    Please enter a valid Email.
                  </div>
                )}
            </Form.Group>
          </Col>
        </Row>
        <div className="text-right mt-0 mb-2">
          <Button type="button" onClick={submitBack} className="btn-back mx-2">
            Back
          </Button>
          {isUpdating ? (
            <Button type="button" className="btn-save">
              Saving...
            </Button>
          ) : (
            <Button type="button" onClick={submitProfile} className="btn-save">
              Next
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ContactStep;
