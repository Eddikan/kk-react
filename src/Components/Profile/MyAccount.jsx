import {
  Row,
  Col,
  Button,
  Card,
  Form,
} from "react-bootstrap";
import ReactFlagsSelect from "react-flags-select";
import useProfile from "hooks/useProfile";
import { IoSaveOutline } from "react-icons/io5";
import { GoPencil } from "react-icons/go";

function MyAccount() {
  const {
    user,
    setIDName,
    formStatus,
    selected,
    primaryFrontPhoto,
    primaryBackPhoto,
    firstSecondaryFrontPhoto,
    secondSecondaryFrontPhoto,
    captureBothPhotoModalShow,
    captureFrontPhotoModalShow,
    captureBackPhotoModalShow,
    verificationFormData,
    isFirstSecondaryPhotoUploaded,
    isSecondSecondaryPhotoUploaded,
    secondaryIdOptions,
    handleEmailAuthChange,
    handleSMSAuthChange,
    selectedCountry,
    toggleCapturePrimaryFrontPhoto,
    handleChangeFrontID,
    toggleCapturePrimaryBackPhoto,
    handleChangeBackID,
    toggleCaptureBothPhoto,
    handleChangeVerification,
    toggleUpdatePasswordModal,
    verificationIDSubmit,
  } = useProfile();

  return (
    <div id="manage-account">
      <Row>
        <Col lg="12">
          <div className="manage-account-container">
            <p className="title-designer mb-1 lh-25">Security</p>
            <div className="ms-60">
              <p className="title-designer mb-1 fs-14">
                Two Factor Authentication
              </p>
              <div className="short-bio-designer mb-4">
                <Form.Label
                  className={`me-3 ${
                    user?.phone_number && user?.phone_number != "" ? "" : "mb-0"
                  }`}
                  style={{ minWidth: "90px" }}
                >
                  <input
                    type="checkbox"
                    checked={user?.email_two_factor_authentication}
                    onChange={handleEmailAuthChange}
                    className="d-inline-block vertical-align-middle me-1"
                  />
                  <span className="fs-14">Enable Email Authentication</span>
                </Form.Label>
                <br />
                {user?.phone_number && user?.phone_number != "" ? (
                  <Form.Label
                    className="me-3 mb-0"
                    style={{ minWidth: "90px" }}
                  >
                    <input
                      type="checkbox"
                      checked={user?.sms_two_factor_authentication}
                      onChange={handleSMSAuthChange}
                      className="d-inline-block vertical-align-middle me-1"
                    />
                    <span className="fs-14">Enable SMS Authentication</span>
                  </Form.Label>
                ) : (
                  <>
                    <Form.Label
                      className="me-3 text-muted mb-0"
                      style={{
                        minWidth: "90px",
                        cursor: "not-allowed",
                        pointerEvents: "none",
                      }}
                    >
                      <input
                        type="checkbox"
                        className="d-inline-block vertical-align-middle me-1"
                      />
                      <span className="fs-14">Enable SMS Authentication</span>
                    </Form.Label>
                    <p
                      className="small text-danger mb-0"
                      style={{ fontSize: "10px" }}
                    >
                      Please add your phone number to enable SMS authentication
                    </p>
                  </>
                )}
              </div>
              <hr />
            </div>
          </div>
          <div className="manage-account-container">
            <p className="title-designer mb-1 lh-25">Verification</p>
            <div className="ms-60">
              <div className="mb-35">
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
                {selected && (
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
                            value={verificationFormData?.primary_id_name}
                            required
                          >
                            <option value="">Select Primary IDs</option>

                            <option value="Driver's License">
                              Driver's License
                            </option>
                            <option value="Passport">Passport</option>
                            {selected === "PH" && (
                              <>
                                <option value="SSS Unified Multi-Purpose ID (UMID)">
                                  SSS Unified Multi-Purpose ID (UMID)
                                </option>
                                <option value="Philippine Identification (PhilID / ePhilID)">
                                  Philippine Identification (PhilID / ePhilID)
                                </option>
                                <option value="PhilHealth ID">
                                  PhilHealth ID
                                </option>
                                <option value="Postal ID">Postal ID</option>
                                <option value="Voter's ID">Voter's ID</option>
                                <option value="Professional Regulation (PRC) ID">
                                  Professional Regulation (PRC) ID
                                </option>
                              </>
                            )}
                            <option value="Other IDs">Other IDs</option>
                          </select>
                        </Col>
                      </Row>
                    </Form.Group>
                  </>
                )}
                {verificationFormData?.primary_id_name && (
                  <>
                    {verificationFormData?.primary_id_name !== "Other IDs" ? (
                      <Form.Group>
                        <Row>
                          <Col lg="12">
                            {primaryFrontPhoto &&
                            !captureBothPhotoModalShow &&
                            !captureBackPhotoModalShow ? (
                              <Card>
                                <Card.Body>
                                  <Row>
                                    <Col lg={6} className="text-center">
                                      {primaryFrontPhoto &&
                                      !captureBothPhotoModalShow &&
                                      !captureFrontPhotoModalShow &&
                                      !captureBackPhotoModalShow ? (
                                        <>
                                          <img
                                            src={primaryFrontPhoto}
                                            alt="profile"
                                            style={{
                                              border: "1px solid #ffffff",
                                              cursor: "pointer",
                                            }}
                                            className="mb-2 w-100 verification-photo"
                                          />
                                        </>
                                      ) : null}
                                      <p className="mb-0">Front ID</p>
                                      <br />
                                      <div className="d-flex justify-content-center mt-2">
                                        <Button
                                          className="btn-back me-3 btn btn-primary w-100 fs-14"
                                          onClick={() => {
                                            toggleCapturePrimaryFrontPhoto();
                                            setIDName("primary");
                                          }}
                                        >
                                          <span>Capture Photo</span>
                                        </Button>
                                        <input
                                          type="file"
                                          onChange={handleChangeFrontID}
                                          style={{
                                            display: "none",
                                          }}
                                          accept="image/*"
                                          id="fileFrontID"
                                        />
                                        <Button
                                          className="btn-save btn btn btn-primary w-100 fs-14"
                                          onClick={() => {
                                            document
                                              .getElementById("fileFrontID")
                                              .click();
                                            setIDName("primary");
                                          }}
                                        >
                                          <span>Upload</span>
                                        </Button>
                                      </div>
                                    </Col>
                                    <Col lg={6} className="text-center">
                                      {verificationFormData?.primary_id_name !==
                                        "Passport" &&
                                      verificationFormData?.primary_id_name !==
                                        "SSS Unified Multi-Purpose ID (UMID)" &&
                                      verificationFormData?.primary_id_name !==
                                        "PhilHealth ID" &&
                                      verificationFormData?.primary_id_name !==
                                        "Postal ID" &&
                                      verificationFormData?.primary_id_name !==
                                        "Voter's ID" &&
                                      verificationFormData?.primary_id_name !==
                                        "Professional Regulation (PRC) ID" ? (
                                        <>
                                          {primaryBackPhoto &&
                                          !captureBothPhotoModalShow &&
                                          !captureFrontPhotoModalShow &&
                                          !captureBackPhotoModalShow ? (
                                            <>
                                              <img
                                                src={primaryBackPhoto}
                                                alt="profile"
                                                style={{
                                                  border: "1px solid #ffffff",
                                                  cursor: "pointer",
                                                }}
                                                className="mb-2 w-100 verification-photo"
                                              />
                                            </>
                                          ) : null}
                                          <p className="mb-0">Back ID</p>
                                          <br />
                                          <div className="d-flex justify-content-center mt-2">
                                            <Button
                                              className="btn-back me-3 btn btn-primary w-100 fs-14"
                                              onClick={() => {
                                                toggleCapturePrimaryBackPhoto();
                                                setIDName("primary");
                                              }}
                                            >
                                              <span>Capture Photo</span>
                                            </Button>
                                            <input
                                              type="file"
                                              onChange={handleChangeBackID}
                                              style={{
                                                display: "none",
                                              }}
                                              accept="image/*"
                                              id="fileBackID"
                                            />
                                            <Button
                                              className="btn-save btn btn btn-primary w-100 fs-14"
                                              onClick={() => {
                                                document
                                                  .getElementById("fileBackID")
                                                  .click();
                                                setIDName("primary");
                                              }}
                                            >
                                              <span>Upload</span>
                                            </Button>
                                          </div>
                                        </>
                                      ) : null}
                                    </Col>
                                  </Row>
                                </Card.Body>
                              </Card>
                            ) : (
                              <>
                                <Button
                                  className="btn-back me-3 btn btn-primary fs-14"
                                  onClick={() => {
                                    toggleCaptureBothPhoto();
                                    setIDName("primary");
                                  }}
                                >
                                  <span>Capture Photo</span>
                                </Button>
                                <input
                                  type="file"
                                  onChange={handleChangeFrontID}
                                  style={{ display: "none" }}
                                  accept="image/*"
                                  id="fileFrontID"
                                />
                                <Button
                                  className="btn-save btn btn btn-primary fs-14"
                                  onClick={() => {
                                    document
                                      .getElementById("fileFrontID")
                                      .click();
                                    setIDName("primary");
                                  }}
                                >
                                  <span>Upload</span>
                                </Button>
                              </>
                            )}
                          </Col>
                        </Row>
                      </Form.Group>
                    ) : (
                      <>
                        <Row>
                          <Col>
                            <Form.Label>List of Secondary IDs</Form.Label>
                            <select
                              className="form-control mb-3 cursor-pointer"
                              name="first_secondary_id_name"
                              defaultValue=""
                              onChange={handleChangeVerification}
                              value={
                                verificationFormData?.first_secondary_id_name
                              }
                              required
                            >
                              <option value="">Select Secondary IDs</option>
                              {selected === "PH" && (
                                <>
                                  {secondaryIdOptions.map((id) => (
                                    <option
                                      key={id}
                                      value={id}
                                      disabled={
                                        verificationFormData?.second_secondary_id_name ===
                                        id
                                      }
                                    >
                                      {id}
                                    </option>
                                  ))}
                                </>
                              )}
                            </select>
                          </Col>
                        </Row>
                        {verificationFormData?.first_secondary_id_name && (
                          <>
                            <Form.Group>
                              <Row className="mb-3">
                                <Col lg="12">
                                  {firstSecondaryFrontPhoto &&
                                  !captureBothPhotoModalShow &&
                                  !captureFrontPhotoModalShow &&
                                  !captureBackPhotoModalShow ? (
                                    <Card>
                                      <Card.Body className="d-flex">
                                        <Col
                                          lg={6}
                                          className="text-center"
                                          style={{
                                            paddingRight: "9px",
                                          }}
                                        >
                                          {firstSecondaryFrontPhoto ? (
                                            <>
                                              <img
                                                src={firstSecondaryFrontPhoto}
                                                alt="profile"
                                                style={{
                                                  border: "1px solid #ffffff",
                                                  cursor: "pointer",
                                                }}
                                                className="w-100 mb-2 verification-photo"
                                              />
                                            </>
                                          ) : null}
                                          <p className="mb-0">Front ID</p>
                                          <br />
                                          <div className="d-flex justify-content-center mt-2">
                                            <Button
                                              className="btn-back me-3 btn btn-primary w-100 fs-14"
                                              onClick={() => {
                                                toggleCapturePrimaryFrontPhoto();
                                                setIDName("first_secondary");
                                              }}
                                            >
                                              <span>Capture Photo</span>
                                            </Button>
                                            <input
                                              type="file"
                                              onChange={handleChangeFrontID}
                                              style={{
                                                display: "none",
                                              }}
                                              accept="image/*"
                                              id="secondaryFileFrontID"
                                            />
                                            <Button
                                              className="btn-save btn btn btn-primary w-100 fs-14"
                                              onClick={() => {
                                                document
                                                  .getElementById(
                                                    "secondaryFileFrontID"
                                                  )
                                                  .click();
                                                setIDName("first_secondary");
                                              }}
                                            >
                                              <span>Upload</span>
                                            </Button>
                                          </div>
                                        </Col>
                                        <Col
                                          lg={6}
                                          className="text-center"
                                          style={{
                                            paddingLeft: "9px",
                                          }}
                                        ></Col>
                                      </Card.Body>
                                    </Card>
                                  ) : (
                                    <>
                                      <Button
                                        className="btn-back me-3 btn btn-primary fs-14"
                                        onClick={() => {
                                          toggleCaptureBothPhoto();
                                          setIDName("first_secondary");
                                        }}
                                      >
                                        <span>Capture Photo</span>
                                      </Button>
                                      <input
                                        type="file"
                                        onChange={handleChangeFrontID}
                                        style={{
                                          display: "none",
                                        }}
                                        accept="image/*"
                                        id="secondaryFileFrontID"
                                      />
                                      <Button
                                        className="btn-save btn btn btn-primary fs-14"
                                        onClick={() => {
                                          document
                                            .getElementById(
                                              "secondaryFileFrontID"
                                            )
                                            .click();
                                          setIDName("first_secondary");
                                        }}
                                      >
                                        <span>Upload</span>
                                      </Button>
                                    </>
                                  )}
                                </Col>
                              </Row>
                            </Form.Group>
                          </>
                        )}
                        {isFirstSecondaryPhotoUploaded ||
                        isSecondSecondaryPhotoUploaded ? (
                          <>
                            <Row>
                              <Col>
                                {verificationFormData?.first_secondary_id_name ||
                                verificationFormData?.second_secondary_id_name ? (
                                  <>
                                    <select
                                      className="form-control mb-3 cursor-pointer"
                                      name="second_secondary_id_name"
                                      defaultValue=""
                                      onChange={handleChangeVerification}
                                      value={
                                        verificationFormData?.second_secondary_id_name
                                      }
                                      required
                                    >
                                      <option value="">
                                        Select Secondary IDs
                                      </option>
                                      {selected === "PH" && (
                                        <>
                                          {secondaryIdOptions.map((id) => (
                                            <option
                                              key={id}
                                              value={id}
                                              disabled={
                                                verificationFormData?.first_secondary_id_name ===
                                                id
                                              }
                                            >
                                              {id}
                                            </option>
                                          ))}
                                        </>
                                      )}
                                    </select>
                                  </>
                                ) : null}
                              </Col>
                            </Row>
                            {verificationFormData?.second_secondary_id_name && (
                              <>
                                <Form.Group>
                                  <Row>
                                    <Col lg="12">
                                      {secondSecondaryFrontPhoto &&
                                      !captureBothPhotoModalShow &&
                                      !captureFrontPhotoModalShow &&
                                      !captureBackPhotoModalShow ? (
                                        <Card>
                                          <Card.Body className="d-flex">
                                            <Col lg={6} className="text-center">
                                              {secondSecondaryFrontPhoto ? (
                                                <>
                                                  <img
                                                    src={
                                                      secondSecondaryFrontPhoto
                                                    }
                                                    alt="profile"
                                                    style={{
                                                      border:
                                                        "1px solid #ffffff",
                                                      cursor: "pointer",
                                                    }}
                                                    className="mb-2 w-100 verification-photo"
                                                  />
                                                </>
                                              ) : null}
                                              <p className="mb-0">Front ID</p>
                                              <br />
                                              <div className="d-flex justify-content-center mt-2">
                                                <Button
                                                  className="btn-back me-3 btn btn-primary w-100"
                                                  onClick={() => {
                                                    toggleCapturePrimaryFrontPhoto();
                                                    setIDName(
                                                      "second_secondary"
                                                    );
                                                  }}
                                                >
                                                  <span>Capture Photo</span>
                                                </Button>
                                                <input
                                                  type="file"
                                                  onChange={handleChangeFrontID}
                                                  style={{
                                                    display: "none",
                                                  }}
                                                  accept="image/*"
                                                  id="secondSecondaryFileFrontID"
                                                />
                                                <Button
                                                  className="btn-save btn btn btn-primary w-100"
                                                  onClick={() => {
                                                    document
                                                      .getElementById(
                                                        "secondSecondaryFileFrontID"
                                                      )
                                                      .click();
                                                    setIDName(
                                                      "second_secondary"
                                                    );
                                                  }}
                                                >
                                                  <span>Upload</span>
                                                </Button>
                                              </div>
                                            </Col>
                                            <Col
                                              lg={6}
                                              className="text-center"
                                            ></Col>
                                          </Card.Body>
                                        </Card>
                                      ) : (
                                        <>
                                          <Button
                                            className="btn-back me-3 btn btn-primary"
                                            onClick={() => {
                                              toggleCaptureBothPhoto();
                                              setIDName("second_secondary");
                                            }}
                                          >
                                            <span>Capture Photo</span>
                                          </Button>
                                          <input
                                            type="file"
                                            onChange={handleChangeFrontID}
                                            style={{
                                              display: "none",
                                            }}
                                            accept="image/*"
                                            id="secondSecondaryFileFrontID"
                                          />
                                          <Button
                                            className="btn-save btn btn btn-primary"
                                            onClick={() => {
                                              document
                                                .getElementById(
                                                  "secondSecondaryFileFrontID"
                                                )
                                                .click();
                                              setIDName("second_secondary");
                                            }}
                                          >
                                            <span>Upload</span>
                                          </Button>
                                        </>
                                      )}
                                    </Col>
                                  </Row>
                                </Form.Group>
                              </>
                            )}
                          </>
                        ) : null}
                      </>
                    )}
                  </>
                )}
              </div>
              <hr />
            </div>
          </div>
          <div className="manage-account-container">
            <p className="title-designer mb-1 lh-25">Change Password</p>
            <div className="ms-60">
              <p className="mb-3">********</p>
              <Button
                className="btn-save btn btn btn-primary bg-white text-black border-black bg-white-hover text-black-hover fs-14"
                type="button"
                onClick={toggleUpdatePasswordModal}
              >
                <GoPencil size="20px" /> Change
              </Button>
            </div>
          </div>
          <hr />
          <div className="text-right mt-30">
            {formStatus !== "standby" ? (
              <Button
                className="btn-save btn btn btn-primary fs-14"
                type="button"
                style={{ cursor: "not-allowed" }}
              >
                <IoSaveOutline size="20px" /> Saving...
              </Button>
            ) : (
              <Button
                className="btn-save btn btn btn-primary fs-14"
                type="button"
                onClick={verificationIDSubmit}
              >
                <IoSaveOutline size="20px" /> Save
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default MyAccount;
