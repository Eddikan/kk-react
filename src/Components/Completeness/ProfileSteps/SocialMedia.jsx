import { useEffect, useState } from "react";
import { Col, Button, Form, FormControl } from "react-bootstrap";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { useUpdateUserMutation } from "store/api/mutations";

const SocialMediaStep = ({ reload }) => {
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const currentStoreUser = useSelector((state) => state.user.user);
  const user = currentStoreUser;
  const [cookie,setCookie] = useCookies([
    "currentUser",
    "aboutDone",
    "addressDone",
    "contactDone",
    "socialDone",
  ]);

  const [profileFormData, setProfileFormData] = useState("");
  const [formStatus, setFormStatus] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfileFormData({
      ...profileFormData,
      [name]: value,
    });
  };

  const SocialLinkpatterns = {
    facebook: /^(https?:\/\/)?(www\.)?facebook\.com\/[A-Za-z0-9._-]+\/?$/,
    twitter: /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/,
    instagram: /^(https?:\/\/)?(www\.)?(instagram\.com)\/([a-zA-Z0-9_.]+)\/?$/,
    linkedin:
      /^(https?:\/\/)?(www\.)?(linkedin\.com)\/in\/([a-zA-Z0-9_-]+)\/?$/,
    pinterest: /^(https?:\/\/)?(www\.)?(pinterest\.com)\/([a-zA-Z0-9_-]+)\/?$/,
    behance: /^(https?:\/\/)?(www\.)?(behance\.net)\/([a-zA-Z0-9_-]+)\/?$/,
  };

  // Check if all Social Link is Valid
  const isValidSocialLink = (value, type) => {
    if (value === "") {
      return true;
    }
    return SocialLinkpatterns[type]?.test(value);
  };

  const AllValidSocialLink = () => {
    return Object.keys(SocialLinkpatterns).every((type) =>
      isValidSocialLink(profileFormData[type], type)
    );
  };

  async function submitProfile(e) {
    e.preventDefault();
    if (!AllValidSocialLink()) {
      toast.error(
        "Please ensure all social media links are valid URLs or leave them blank."
      );
      return;
    }
    setFormStatus(true);
    const res = await updateUser({
      type: "SOCIAL_MEDIA",
      ...profileFormData,
    }).unwrap();

    if (res.success) {
      setCookie("socialDone", "Yes", { path: "/" });
      toast.success(res.message);
      reload();
    }
  }

  async function submitBack(e) {
    e.preventDefault();
    reload();
    setCookie("contactDone", "No", { path: "/" });
    setCookie("socialDone", "No", { path: "/" });
  }

  useEffect(() => {
    if (user) {
      setProfileFormData(user.socials);
    }
  }, [user]);

  return (
    <>
      <div className="edit-social-media mt-3">
        <Col lg="12">
          <Form.Group className="mb-4">
            <Form.Label>Facebook</Form.Label>
            <FormControl
              type="text"
              name="facebook"
              value={profileFormData?.facebook}
              className="mr-sm-2"
              onChange={handleChange}
              placeholder=""
            />
            {profileFormData?.facebook &&
              profileFormData?.facebook !== "" &&
              !isValidSocialLink(profileFormData?.facebook, "facebook") && (
                <div className="text-danger mt-1 fs-12">
                  Please enter a valid link.
                </div>
              )}
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Twitter</Form.Label>
            <FormControl
              type="text"
              name="twitter"
              value={profileFormData?.twitter}
              className="mr-sm-2"
              onChange={handleChange}
              placeholder=""
            />
            {profileFormData?.twitter &&
              profileFormData?.twitter !== "" &&
              !isValidSocialLink(profileFormData?.twitter, "twitter") && (
                <div className="text-danger mt-1 fs-12">
                  Please enter a valid link.
                </div>
              )}
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Instagram</Form.Label>
            <FormControl
              type="text"
              name="instagram"
              value={profileFormData?.instagram}
              className="mr-sm-2"
              onChange={handleChange}
              placeholder=""
            />
            {profileFormData?.instagram &&
              profileFormData?.instagram !== "" &&
              !isValidSocialLink(profileFormData?.instagram, "instagram") && (
                <div className="text-danger mt-1 fs-12">
                  Please enter a valid link.
                </div>
              )}
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>LinkedIn</Form.Label>
            <FormControl
              type="text"
              name="linkedin"
              value={profileFormData?.linkedin}
              className="mr-sm-2"
              onChange={handleChange}
              placeholder=""
            />
            {profileFormData?.linkedin &&
              profileFormData?.linkedin !== "" &&
              !isValidSocialLink(profileFormData?.linkedin, "linkedin") && (
                <div className="text-danger mt-1 fs-12">
                  Please enter a valid link.
                </div>
              )}
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Pinterest</Form.Label>
            <FormControl
              type="text"
              name="pinterest"
              value={profileFormData?.pinterest}
              className="mr-sm-2"
              onChange={handleChange}
              placeholder=""
            />
            {profileFormData?.pinterest &&
              profileFormData?.pinterest !== "" &&
              !isValidSocialLink(profileFormData?.pinterest, "pinterest") && (
                <div className="text-danger mt-1 fs-12">
                  Please enter a valid link.
                </div>
              )}
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Behance</Form.Label>
            <FormControl
              type="text"
              name="behance"
              value={profileFormData?.behance}
              className="mr-sm-2"
              onChange={handleChange}
              placeholder=""
            />
            {profileFormData?.behance &&
              profileFormData?.behance !== "" &&
              !isValidSocialLink(profileFormData?.behance, "behance") && (
                <div className="text-danger mt-1 fs-12">
                  Please enter a valid link.
                </div>
              )}
          </Form.Group>
          <div className="text-right mt-4 mb-2">
            <Button
              type="button"
              onClick={submitBack}
              className="btn-back mx-2"
            >
              Back
            </Button>
            {isUpdating ? (
              <Button type="button" className="btn-save">
                Saving...
              </Button>
            ) : (
              <Button
                type="button"
                onClick={submitProfile}
                className="btn-save"
              >
                Next
              </Button>
            )}
          </div>
        </Col>
      </div>
    </>
  );
};

export default SocialMediaStep;
