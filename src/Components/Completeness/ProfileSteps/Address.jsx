import { useEffect, useState } from "react";
import { Row, Col, Button, Form, FormControl } from "react-bootstrap";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import useCountry from "hooks/useCountry";
import { useUpdateUserMutation } from "store/api/mutations";

const AddressStep = ({ reload }) => {
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const currentStoreUser = useSelector((state) => state.user.user);
  const user = currentStoreUser;
  const {
    countries,
    states,
    cities,
    loadingStates,
    loadingCities,
    fetchStates,
    fetchCities,
  } = useCountry();

  const [cookie,setCookie] = useCookies([
    "currentUser",
    "aboutDone",
    "addressDone",
    "contactDone",
    "socialDone",
  ]);
  const [profileFormData, setProfileFormData] = useState(
    currentStoreUser.address
  );
  const [profileFormLoading, setProfileFormLoading] = useState(false);
  const [emptyCities, setEmptyCities] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      setProfileFormData({
        ...profileFormData,
        country: value,
        province: "",
        city: "",
      });
      fetchStates(value);
    } else if (name === "province") {
      setProfileFormData({
        ...profileFormData,
        province: value,
        city: "",
      });
      fetchCities(profileFormData.country, value);
    } else {
      setProfileFormData({
        ...profileFormData,
        [name]: value,
      });
    }
  };

  async function submitProfile(e) {
    if (
      profileFormData.address_line_1 === "" ||
      profileFormData.address_line_1 == null
    ) {
      toast("Address Line 1 is required!", {
        icon: "⚠️",
      });
    } else if (
      profileFormData.country === "" ||
      profileFormData.country == null
    ) {
      toast("Country is required!", {
        icon: "⚠️",
      });
    } else if (
      profileFormData.province === "" ||
      profileFormData.province == null
    ) {
      toast("State/Province is required!", {
        icon: "⚠️",
      });
    } else if (profileFormData.city === "" || profileFormData.city == null) {
      toast("City is required!", {
        icon: "⚠️",
      });
    } else if (
      profileFormData.postal_code === "" ||
      profileFormData.postal_code == null
    ) {
      toast("Postal Code is required!", {
        icon: "⚠️",
      });
    } else {
      e.preventDefault();
      setProfileFormLoading(true);
      const payload = {
        address_line_1: profileFormData.address_line_1,
        address_line_2: profileFormData.address_line_2,
        country_name: profileFormData.country,
        country_code: states?.iso3,
        state_name: profileFormData.province,
        city_name: profileFormData.city,
        postal_code: profileFormData.postal_code,
      };

      const res = await updateUser({ type: "ADDRESS", ...payload }).unwrap();
      console.log("res", res);

      if (res.success) {
        setCookie("addressDone", "Yes", { path: "/" });
        toast.success(res.message);

        reload();
      }
    }
  }

  async function submitBack(e) {
    e.preventDefault();
    reload();
    setCookie("addressDone", "No", { path: "/" });
    setCookie("aboutDone", "No", { path: "/" });
  }

  useEffect(() => {
    if (user) {
      setProfileFormData(user.address);
    }
  }, [user]);

  //   useEffect(() => {
  //     if (profileFormData.city) {
  //       getCoordinates(profileFormData.city);
  //     }
  //   }, [profileFormData.city]);

  return (
    <>
      <div className="edit-address mt-3">
        <Col lg="12">
          <Form.Group className="mb-4">
            <Form.Label>
              Address Line 1<span className="text-danger">*</span>
            </Form.Label>
            {profileFormData.address_line_1}
            <FormControl
              type="text"
              name="address_line_1"
              value={profileFormData.address_line_1}
              className="mr-sm-2"
              onChange={handleChange}
              required
              placeholder=""
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Address Line 2</Form.Label>
            <FormControl
              type="text"
              name="address_line_2"
              value={profileFormData.address_line_2}
              className="mr-sm-2"
              onChange={handleChange}
              placeholder=""
            />
          </Form.Group>
        </Col>
        <Row>
          <Col lg="6">
            <Form.Group className="mb-4">
              <Form.Label>
                Country<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="select"
                name="country"
                value={profileFormData.country}
                className="mr-sm-2"
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Country
                </option>
                {countries.map((country) => (
                  <option key={country.iso3} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col lg="6">
            <Form.Group className="mb-4">
              <Form.Label>
                State/Province<span className="text-danger">*</span>
              </Form.Label>
              {loadingStates ? (
                <Form.Control
                  as="select"
                  name="province"
                  value=""
                  className="mr-sm-2"
                  disabled
                  required
                >
                  <option value="" selected>
                    Loading...
                  </option>
                </Form.Control>
              ) : (
                <>
                  {profileFormData.country &&
                  states &&
                  states?.states?.length > 0 ? (
                    <Form.Control
                      as="select"
                      name="province"
                      value={profileFormData.province}
                      className="mr-sm-2"
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select Province
                      </option>
                      {states?.states?.map((state, index) => (
                        <option key={state + "-" + index} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </Form.Control>
                  ) : (
                    <Form.Control
                      as="select"
                      name="province"
                      value=""
                      className="mr-sm-2"
                      disabled
                      required
                    >
                      <option value="" selected>
                        Please select country first
                      </option>
                    </Form.Control>
                  )}
                </>
              )}
            </Form.Group>
          </Col>
          <Col lg="6">
            <Form.Group className="mb-4">
              <Form.Label>
                City<span className="text-danger">*</span>
              </Form.Label>
              {loadingCities ? (
                <Form.Control
                  as="select"
                  name="city"
                  value=""
                  className="mr-sm-2"
                  disabled
                  required
                >
                  <option value="" selected>
                    Loading...
                  </option>
                </Form.Control>
              ) : (
                <>
                  {emptyCities ? (
                    <FormControl
                      type="text"
                      name="city"
                      className="mr-sm-2"
                      value={profileFormData.city}
                      onChange={handleChange}
                      required
                    />
                  ) : (
                    <>
                      {profileFormData.province &&
                      cities &&
                      cities?.length > 0 ? (
                        <Form.Control
                          as="select"
                          name="city"
                          value={profileFormData.city}
                          className="mr-sm-2"
                          onChange={handleChange}
                          required
                        >
                          <option value="" disabled>
                            Select City
                          </option>
                          {cities?.map((city, index) => (
                            <option key={city + "-" + index} value={city}>
                              {city}
                            </option>
                          ))}
                        </Form.Control>
                      ) : (
                        <Form.Control
                          as="select"
                          name="city"
                          value=""
                          className="mr-sm-2"
                          disabled
                          required
                        >
                          <option value="" selected>
                            Please select a province first
                          </option>
                        </Form.Control>
                      )}
                    </>
                  )}
                </>
              )}
            </Form.Group>
          </Col>
          <Col lg="6">
            <Form.Group className="mb-4">
              <Form.Label>
                Postal Code<span className="text-danger">*</span>
              </Form.Label>
              <FormControl
                type="number"
                name="postal_code"
                value={profileFormData.postal_code}
                className="mr-sm-2"
                onChange={handleChange}
                required
                placeholder=""
              />
            </Form.Group>
          </Col>
          <div className="text-right mt-0 mb-2">
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
        </Row>
      </div>
    </>
  );
};

export default AddressStep;
