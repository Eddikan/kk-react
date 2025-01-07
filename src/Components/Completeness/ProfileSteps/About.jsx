import { useState } from "react";
import { Row, Col, Button, Form, FormControl } from "react-bootstrap";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";
import { useUpdateUserMutation } from "store/api/mutations";
import { useSelector } from "react-redux";

const AboutStep = ({ reload }) => {
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [cookies, setCookie] = useCookies(["aboutDone"]);
  const currentStoreUser = useSelector((state) => state.user.user);
  const [profileFormData, setProfileFormData] = useState(currentStoreUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "short_bio" || name === "long_bio") {
      setProfileFormData({
        ...profileFormData,
        business_profile: {
          ...profileFormData.business_profile,
          [name]: value,
        },
      });
    } else {
      setProfileFormData({
        ...profileFormData,
        [name]: value,
      });
    }
  };

  async function submitProfile(e) {
    if (
      profileFormData.first_name === "" ||
      profileFormData.first_name == null
    ) {
      toast("First Name is required!", {
        icon: "⚠️",
      });
    } else if (
      profileFormData.last_name === "" ||
      profileFormData.first_name == null
    ) {
      toast("Last Name is required!", {
        icon: "⚠️",
      });
    } else if (
      profileFormData.gender === "" ||
      profileFormData.gender == null
    ) {
      toast("Gender is required!", {
        icon: "⚠️",
      });
    } else {
      e.preventDefault();
      const { first_name, last_name, gender, date_of_birth } = profileFormData;
      const { short_bio, long_bio } = profileFormData.business_profile;
      const payload = {
        first_name,
        last_name,
        gender,
        short_bio,
        long_bio,
        date_of_birth,
      };

      if (currentStoreUser.type === "customer") {
        delete payload.short_bio;
        delete payload.long_bio;
        delete payload.date_of_birth;
      }

      await updateUser({ type: "About", ...payload }).unwrap();
      setCookie("aboutDone", "Yes", { path: "/" });
      reload();
    }
  }

  return (
    <>
      <div className="edit-profile mt-3">
        <Row>
          <Col lg="6">
            <Form.Group className="mb-3">
              <Form.Label>
                First Name<span className="text-danger">*</span>
              </Form.Label>
              <FormControl
                type="text"
                name="first_name"
                value={profileFormData.first_name}
                className="mr-sm-2"
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col lg="6">
            <Form.Group className="mb-3">
              <Form.Label>
                Last Name<span className="text-danger">*</span>
              </Form.Label>
              <FormControl
                type="text"
                name="last_name"
                value={profileFormData.last_name}
                className="mr-sm-2"
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {currentStoreUser.type !== "customer" && (
            <>
              <Col lg="6">
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <FormControl
                    type="date"
                    name="date_of_birth"
                    value={profileFormData.date_of_birth}
                    className="mr-sm-2"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </>
          )}
          <Col lg="3">
            <Form.Label>
              Gender<span className="text-danger">*</span>
            </Form.Label>
            <Row>
              <Form.Group as={Col}>
                <Form.Check
                  className="cursor-pointer"
                  type="radio"
                  label="Male"
                  name="gender"
                  value="Male"
                  checked={profileFormData.gender === "Male"}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Check
                  className="cursor-pointer"
                  type="radio"
                  label="Female"
                  name="gender"
                  value="Female"
                  checked={profileFormData.gender === "Female"}
                  onChange={handleChange}
                />
              </Form.Group>
            </Row>
          </Col>
        </Row>
        {currentStoreUser.type !== "customer" && (
          <>
            <Row>
              <Col lg="12">
                <Form.Group className="mb-4">
                  <Form.Label>
                    Short Bio <span className="text-gray">(title)</span>
                  </Form.Label>
                  <FormControl
                    type="text"
                    maxLength="250"
                    name="short_bio"
                    value={profileFormData.business_profile.short_bio}
                    className="mr-sm-2"
                    onChange={handleChange}
                    placeholder=""
                  />
                </Form.Group>
                <p className="text-muted ms-1 fs-12 mb-4">
                  Your short bio is limited to 250 characters. (
                  {250 - profileFormData.business_profile.short_bio?.length}{" "}
                  characters left)
                </p>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Long Bio{" "}
                    <span className="text-gray">(profile overview)</span>
                  </Form.Label>
                  <FormControl
                    as="textarea"
                    name="long_bio"
                    rows={5}
                    value={profileFormData.business_profile.long_bio}
                    placeholder=""
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}

        <div className="text-right mt-4 mb-2">
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

export default AboutStep;
