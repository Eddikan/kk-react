import {
  Row,
  Col,
  Button,
  FormGroup,
  FormControl,
  Modal,
  Card,
  Form,
} from "react-bootstrap";
import ReactFlagsSelect from "react-flags-select";
import useProfile from "hooks/useProfile";
import { IoSaveOutline } from "react-icons/io5";
import { GoPencil } from "react-icons/go";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa";
import Spinner from "Components/Shared/Spinner";
function MyAccount() {
  const {
    user,
    setIDName,
    formStatus,
    updatePasswordModalShow,
    updatePasswordFormData,
    isUpdatingPassword,
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
    handleTwoFAChange,
    selectedCountry,
    toggleCapturePrimaryFrontPhoto,
    handleChangeFrontID,
    toggleCapturePrimaryBackPhoto,
    handleChangeBackID,
    toggleCaptureBothPhoto,
    handleChangeVerification,
    toggleUpdatePasswordModal,
    setUpdatePasswordModalShow,
    handleChangePassword,
    updatePasswordSubmit,
    verificationIDSubmit,
    isUpdatingDelayed,
    viewFrontCapture,
    webcamLoaded,
    showCaptureFrontImage,
    verificationIDShow,
    showCaptureBackImage,
    webRef,
    handleWebcamLoad,
    showImage,

    toggleshowCaptureFrontImage,
    captureBothSubmit,
    captureFrontSubmit,
    viewBackCapture,
    setViewFrontCapture,
    toggleCloseverificationIDShow,
    showBackImage,
    toggleShowCaptureBackImage,
    captureBackSubmit,
    setViewBackCapture,
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
                  className={`me-3 tw-flex tw-gap-2 ${
                    user?.phone?.number && user?.phone?.number != "" ? "" : "mb-0"
                  }`}
                  style={{ minWidth: "90px" }}
                >
                  {isUpdatingDelayed ? (
                    <Spinner />
                  ) : (
                    <input
                      type="checkbox"
                      checked={user?.settings?.two_factor_enabled}
                      onChange={handleTwoFAChange}
                      className="d-inline-block vertical-align-middle me-1"
                    />
                  )}

                  <span className="fs-14">
                    Enable Two Factor Authentication
                  </span>
                </Form.Label>
              </div>
              <hr />
            </div>
          </div>
          {/* do not email  */}
          {/* <div className="manage-account-container">
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
                            value={verificationFormData.primary_id_name}
                            required
                          >
                            <option value="">Select Primary IDs</option>

                            <option value="Driver's License">
                              Driver&apos;s License
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
                                <option value="Voter's ID">
                                  Voter&apos;s ID
                                </option>
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
                                        verificationFormData.second_secondary_id_name ===
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
                        {verificationFormData.first_secondary_id_name && (
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
                                {verificationFormData.first_secondary_id_name ||
                                verificationFormData.second_secondary_id_name ? (
                                  <>
                                    <select
                                      className="form-control mb-3 cursor-pointer"
                                      name="second_secondary_id_name"
                                      defaultValue=""
                                      onChange={handleChangeVerification}
                                      value={
                                        verificationFormData.second_secondary_id_name
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
                                                verificationFormData.first_secondary_id_name ===
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
                            {verificationFormData.second_secondary_id_name && (
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
          </div> */}
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
      {/* Update Password */}
      <Modal show={updatePasswordModalShow} size="lg">
        <Modal.Header className="pb-0">
          <h4 className="text-left fs-25 fw-600 px-2">Update Password</h4>
          <button
            type="button"
            className="close react-modal-close"
            onClick={toggleUpdatePasswordModal}
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Form onSubmit={updatePasswordSubmit}>
          <Modal.Body>
            <Card className="border-0">
              <Card.Body>
                <FormGroup className="mb-3">
                  <Form.Label htmlFor="current_password" className="mb-2">
                    Current Pasword <span className="text-danger">*</span>
                  </Form.Label>
                  <FormControl
                    type="password"
                    name="current_password"
                    value={updatePasswordFormData.current_password}
                    onChange={handleChangePassword}
                    id="current_password"
                    required
                  />
                </FormGroup>
                <FormGroup className="mb-3">
                  <Form.Label htmlFor="new_password" className="mb-2">
                    New Password <span className="text-danger">*</span>
                  </Form.Label>
                  <FormControl
                    type="password"
                    name="new_password"
                    value={updatePasswordFormData.new_password}
                    onChange={handleChangePassword}
                    id="new_password"
                    required
                  />
                </FormGroup>
                <FormGroup className="mb-3">
                  <Form.Label htmlFor="new_password" className="mb-2">
                    Confirm New Password <span className="text-danger">*</span>
                  </Form.Label>
                  <FormControl
                    type="password"
                    name="confirm_password"
                    value={updatePasswordFormData.confirm_password}
                    onChange={handleChangePassword}
                    id="confirm_password"
                    required
                  />
                </FormGroup>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer className="border-none pt-0">
            <div className="text-right">
              <button
                className="btn btn-primary border-black bg-white text-black btn-style me-2"
                onClick={() => setUpdatePasswordModalShow(false)}
                type="button"
              >
                Close
              </button>
              {isUpdatingPassword ? (
                <button className="btn btn-primary btn-save" type="button">
                  Saving
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-save"
                  onClick={updatePasswordSubmit}
                  type="submit"
                >
                  Save
                </button>
              )}
            </div>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={captureBothPhotoModalShow}
        size="lg"
        // onHide={toggleCaptureBothPhoto}
      >
        <Modal.Header className="pb-0">
          <button
            type="button"
            className="close react-modal-close"
            onClick={toggleCaptureBothPhoto}
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Card className="bg-lgray">
            <Card.Body className="p-3">
              <Row>
                {showCaptureFrontImage ? (
                  <Col lg="12">
                    <img
                      src={viewFrontCapture}
                      alt="profile"
                      style={{
                        width: "100%",
                        height: "auto",
                        border: "1px solid #ffffff",
                        position: "relative",
                      }}
                    />
                  </Col>
                ) : (
                  <>
                    <Col lg="12" className="webcam-container">
                      <h2 className="text-center fw-600">Front of the ID</h2>
                      <p className="text-center">
                        Ensuring the front side is fully visible
                      </p>
                      <Webcam
                        ref={webRef}
                        onUserMedia={() => handleWebcamLoad()}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <div className="overlay-box"></div>
                    </Col>
                    <Col lg="12">
                      <Row
                        style={{
                          position: "absolute",
                          bottom: "35px",
                          width: "100%",
                        }}
                      >
                        <div
                          className="d-flex justify-content-right align-items-end col-3"
                          style={{ position: "relative" }}
                        >
                          &nbsp;
                        </div>
                        {webcamLoaded && (
                          <div className="d-flex justify-content-center align-items-end col-6">
                            <button
                              className="camera-button"
                              type="button"
                              onClick={() => {
                                showImage();
                                toggleshowCaptureFrontImage();
                              }}
                              style={{ position: "relative", color: "#FFFFFF" }}
                            >
                              <FaCamera
                                size="30px"
                                className="cancel-button me-1 dot-icon"
                              />
                            </button>
                          </div>
                        )}
                        <div className="col-3">&nbsp;</div>
                      </Row>
                    </Col>
                  </>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        {showCaptureFrontImage && (
          <Modal.Footer className="text-right modal-footer-border">
            <Button
              type="button"
              className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
              onClick={() => {
                toggleshowCaptureFrontImage();
                setViewFrontCapture(null);
              }}
            >
              Take Another Photo
            </Button>

            {formStatus !== "standby" ? (
              <Button
                className='className="btn-save'
                type="button"
                style={{ cursor: "not-allowed" }}
              >
                Saving...
              </Button>
            ) : (
              <Button
                className='className="btn-save'
                type="submit"
                onClick={
                  verificationFormData?.primary_id_name !== "Passport" &&
                  verificationFormData?.primary_id_name !==
                    "SSS Unified Multi-Purpose ID (UMID)" &&
                  verificationFormData?.primary_id_name !== "PhilHealth ID" &&
                  verificationFormData?.primary_id_name !== "Postal ID" &&
                  verificationFormData?.primary_id_name !== "Voter's ID" &&
                  verificationFormData?.primary_id_name !==
                    "Professional Regulation (PRC) ID" &&
                  verificationFormData?.first_secondary_id_name !==
                    "Birth Certificate" &&
                  verificationFormData?.first_secondary_id_name !==
                    "Barangay Certificate" &&
                  verificationFormData?.first_secondary_id_name !==
                    "NBI Clearance" &&
                  verificationFormData?.first_secondary_id_name !== "TIN ID" &&
                  verificationFormData?.first_secondary_id_name !==
                    "Government Service Insurance System (GSIS) e-Card" &&
                  verificationFormData?.first_secondary_id_name !==
                    "Seaman's Book" &&
                  verificationFormData?.first_secondary_id_name !==
                    "Company ID" &&
                  verificationFormData?.first_secondary_id_name !==
                    "Cedula or Community Tax Certificate" &&
                  verificationFormData?.first_secondary_id_name !==
                    "Student ID" &&
                  verificationFormData?.first_secondary_id_name !==
                    "Police Clearance" &&
                  verificationFormData?.second_secondary_id_name !==
                    "Birth Certificate" &&
                  verificationFormData?.second_secondary_id_name !==
                    "Barangay Certificate" &&
                  verificationFormData?.second_secondary_id_name !==
                    "NBI Clearance" &&
                  verificationFormData?.second_secondary_id_name !== "TIN ID" &&
                  verificationFormData?.second_secondary_id_name !==
                    "Government Service Insurance System (GSIS) e-Card" &&
                  verificationFormData?.second_secondary_id_name !==
                    "Seaman's Book" &&
                  verificationFormData?.second_secondary_id_name !==
                    "Company ID" &&
                  verificationFormData?.second_secondary_id_name !==
                    "Cedula or Community Tax Certificate" &&
                  verificationFormData?.second_secondary_id_name !==
                    "Student ID" &&
                  verificationFormData?.second_secondary_id_name !==
                    "Police Clearance"
                    ? () => {
                        captureBothSubmit();
                        toggleCapturePrimaryBackPhoto();
                      }
                    : captureBothSubmit
                }
              >
                Save
              </Button>
            )}
          </Modal.Footer>
        )}
      </Modal>

      <Modal
        show={captureFrontPhotoModalShow}
        size="lg"
        // onHide={toggleCapturePrimaryFrontPhoto}
      >
        <Modal.Header className="pb-0">
          <button
            type="button"
            className="close react-modal-close"
            onClick={toggleCapturePrimaryFrontPhoto}
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Card className="bg-lgray">
            <Card.Body className="p-3">
              <Row>
                {showCaptureFrontImage ? (
                  <Col lg="12">
                    <img
                      src={viewFrontCapture}
                      alt="profile"
                      style={{
                        width: "100%",
                        height: "auto",
                        border: "1px solid #ffffff",
                        position: "relative",
                      }}
                    />
                  </Col>
                ) : (
                  <>
                    <Col lg="12" className="webcam-container">
                      <h2 className="text-center fw-600">Front of the ID</h2>
                      <p className="text-center">
                        Ensuring the front side is fully visible
                      </p>
                      <Webcam
                        ref={webRef}
                        onUserMedia={() => handleWebcamLoad()}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <div className="overlay-box"></div>
                    </Col>
                    <Col lg="12">
                      <Row
                        style={{
                          position: "absolute",
                          bottom: "35px",
                          width: "100%",
                        }}
                      >
                        <div
                          className="d-flex justify-content-right align-items-end col-3"
                          style={{ position: "relative" }}
                        >
                          &nbsp;
                        </div>
                        {webcamLoaded && (
                          <div className="d-flex justify-content-center align-items-end col-6">
                            <button
                              className="camera-button"
                              type="button"
                              onClick={() => {
                                showImage();
                                toggleshowCaptureFrontImage();
                              }}
                              style={{ position: "relative", color: "#FFFFFF" }}
                            >
                              <FaCamera
                                size="30px"
                                className="cancel-button me-1 dot-icon"
                              />
                            </button>
                          </div>
                        )}
                        <div className="col-3">&nbsp;</div>
                      </Row>
                    </Col>
                  </>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        {showCaptureFrontImage && (
          <Modal.Footer className="text-right modal-footer-border">
            <Button
              type="button"
              className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
              onClick={() => {
                toggleshowCaptureFrontImage();
                setViewFrontCapture(null);
              }}
            >
              Take Another Photo
            </Button>

            {formStatus !== "standby" ? (
              <Button
                className='className="btn-save'
                type="button"
                style={{ cursor: "not-allowed" }}
              >
                Saving...
              </Button>
            ) : (
              <Button
                className='className="btn-save'
                type="submit"
                onClick={() => {
                  captureFrontSubmit();
                }}
              >
                Save
              </Button>
            )}
          </Modal.Footer>
        )}
      </Modal>

      <Modal
        show={captureBackPhotoModalShow}
        size="lg"
        // onHide={toggleCapturePrimaryBackPhoto}
      >
        <Modal.Header className="pb-0">
          <button
            type="button"
            className="close react-modal-close"
            onClick={toggleCapturePrimaryBackPhoto}
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Card className="bg-lgray">
            <Card.Body className="p-3">
              <Row>
                {showCaptureBackImage ? (
                  <Col lg="12">
                    <img
                      src={viewBackCapture}
                      alt="profile"
                      style={{
                        width: "100%",
                        height: "auto",
                        border: "1px solid #ffffff",
                        position: "relative",
                      }}
                    />
                  </Col>
                ) : (
                  <>
                    <Col lg="12" className="webcam-container">
                      <h2 className="text-center fw-600">Back of the ID</h2>
                      <p className="text-center">
                        Ensuring the back side is fully visible
                      </p>
                      <Webcam
                        ref={webRef}
                        onUserMedia={() => handleWebcamLoad()}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <div className="overlay-box"></div>
                    </Col>
                    <Col lg="12">
                      <Row
                        style={{
                          position: "absolute",
                          bottom: "35px",
                          width: "100%",
                        }}
                      >
                        <div
                          className="d-flex justify-content-right align-items-end col-3"
                          style={{ position: "relative" }}
                        >
                          &nbsp;
                        </div>
                        {webcamLoaded && (
                          <div className="d-flex justify-content-center align-items-end col-6">
                            <button
                              className="camera-button"
                              type="button"
                              onClick={() => {
                                showBackImage();
                                toggleShowCaptureBackImage();
                              }}
                              style={{ position: "relative", color: "#FFFFFF" }}
                            >
                              <FaCamera
                                size="30px"
                                className="cancel-button me-1 dot-icon"
                              />
                            </button>
                          </div>
                        )}
                        <div className="col-3">&nbsp;</div>
                      </Row>
                    </Col>
                  </>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        {showCaptureBackImage && (
          <Modal.Footer className="text-right modal-footer-border">
            <Button
              type="button"
              className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
              onClick={() => {
                toggleShowCaptureBackImage();
                setViewBackCapture(null);
              }}
            >
              Take Another Photo
            </Button>

            {formStatus !== "standby" ? (
              <Button
                className='className="btn-save'
                type="button"
                style={{ cursor: "not-allowed" }}
              >
                Saving...
              </Button>
            ) : (
              <Button
                className='className="btn-save'
                type="submit"
                onClick={() => {
                  captureBackSubmit();
                }}
              >
                Save
              </Button>
            )}
          </Modal.Footer>
        )}
      </Modal>

      <Modal show={verificationIDShow} size="lg">
        <Modal.Header className="pb-0">
          <button
            type="button"
            className="close react-modal-close"
            onClick={toggleCloseverificationIDShow}
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Form onSubmit={verificationIDSubmit}>
          <Modal.Body>
            <h2 className="modal-title fs-25 fw-600 text-center mb-2">
              Identity Verification
            </h2>
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
                            value={verificationFormData.primary_id_name}
                            required
                          >
                            <option value="">Select Primary IDs</option>

                            <option value="Driver's License">
                              Driver&apos;s License
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
                                <option value="Voter's ID">
                                  Voter&lsquo;s ID
                                </option>
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
                                <Card.Body className="d-flex">
                                  <Col
                                    lg={6}
                                    className="text-center"
                                    style={{ paddingRight: "9px" }}
                                  >
                                    {primaryFrontPhoto &&
                                    !captureBothPhotoModalShow &&
                                    !captureFrontPhotoModalShow &&
                                    !captureBackPhotoModalShow ? (
                                      <>
                                        <img
                                          src={primaryFrontPhoto}
                                          alt="profile"
                                          style={{
                                            width: "335px",
                                            height: "251px",
                                            border: "1px solid #ffffff",
                                            cursor: "pointer",
                                          }}
                                          className="mb-2"
                                        />
                                      </>
                                    ) : null}
                                    <span>Front ID</span>
                                    <br />
                                    <div className="d-flex justify-content-center mt-2">
                                      <Button
                                        className="btn-back me-3 btn btn-primary w-100"
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
                                        style={{ display: "none" }}
                                        accept="image/*"
                                        id="fileFrontID"
                                      />
                                      <Button
                                        className="btn-save btn btn btn-primary w-100"
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
                                  <Col
                                    lg={6}
                                    className="text-center"
                                    style={{ paddingLeft: "9px" }}
                                  >
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
                                                width: "335px",
                                                height: "251px",
                                                border: "1px solid #ffffff",
                                                cursor: "pointer",
                                              }}
                                              className="mb-2"
                                            />
                                          </>
                                        ) : (
                                          <>
                                            {primaryFrontPhoto &&
                                            !captureBothPhotoModalShow &&
                                            !captureFrontPhotoModalShow &&
                                            !captureBackPhotoModalShow ? (
                                              <div
                                                style={{
                                                  width: "335px",
                                                  height: "251px",
                                                  border: "1px solid #ffffff",
                                                  cursor: "pointer",
                                                }}
                                                className="mb-2"
                                              ></div>
                                            ) : null}
                                          </>
                                        )}
                                        <span>Back ID</span>
                                        <br />
                                        <div className="d-flex justify-content-center mt-2">
                                          <Button
                                            className="btn-back me-3 btn btn-primary w-100"
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
                                            style={{ display: "none" }}
                                            accept="image/*"
                                            id="fileBackID"
                                          />
                                          <Button
                                            className="btn-save btn btn btn-primary w-100"
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
                                </Card.Body>
                              </Card>
                            ) : (
                              <>
                                <Button
                                  className="btn-back me-3 btn btn-primary"
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
                                  className="btn-save btn btn btn-primary"
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
                              waza
                              name="first_secondary_id_name"
                              defaultValue=""
                              onChange={handleChangeVerification}
                              value={
                                verificationFormData.first_secondary_id_name
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
                                        verificationFormData.second_secondary_id_name ===
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
                        {verificationFormData.first_secondary_id_name && (
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
                                          style={{ paddingRight: "9px" }}
                                        >
                                          {firstSecondaryFrontPhoto ? (
                                            <>
                                              <img
                                                src={firstSecondaryFrontPhoto}
                                                alt="profile"
                                                style={{
                                                  width: "335px",
                                                  height: "251px",
                                                  border: "1px solid #ffffff",
                                                  cursor: "pointer",
                                                }}
                                                className="mb-2"
                                              />
                                            </>
                                          ) : null}
                                          <span>Front ID</span>
                                          <br />
                                          <div className="d-flex justify-content-center mt-2">
                                            <Button
                                              className="btn-back me-3 btn btn-primary w-100"
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
                                              style={{ display: "none" }}
                                              accept="image/*"
                                              id="secondaryFileFrontID"
                                            />
                                            <Button
                                              className="btn-save btn btn btn-primary w-100"
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
                                          style={{ paddingLeft: "9px" }}
                                        >
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
                                  ) : (
                                    <>
                                      <Button
                                        className="btn-back me-3 btn btn-primary"
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
                                        style={{ display: "none" }}
                                        accept="image/*"
                                        id="secondaryFileFrontID"
                                      />
                                      <Button
                                        className="btn-save btn btn btn-primary"
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
                                {verificationFormData.first_secondary_id_name ||
                                verificationFormData.second_secondary_id_name ? (
                                  <>
                                    <select
                                      className="form-control mb-3 cursor-pointer"
                                      name="second_secondary_id_name"
                                      defaultValue=""
                                      onChange={handleChangeVerification}
                                      value={
                                        verificationFormData.second_secondary_id_name
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
                                                verificationFormData.first_secondary_id_name ===
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
                            {verificationFormData.second_secondary_id_name && (
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
                                            <Col
                                              lg={6}
                                              className="text-center"
                                              style={{ paddingRight: "9px" }}
                                            >
                                              {secondSecondaryFrontPhoto ? (
                                                <>
                                                  <img
                                                    src={
                                                      secondSecondaryFrontPhoto
                                                    }
                                                    alt="profile"
                                                    style={{
                                                      width: "335px",
                                                      height: "251px",
                                                      border:
                                                        "1px solid #ffffff",
                                                      cursor: "pointer",
                                                    }}
                                                    className="mb-2"
                                                  />
                                                </>
                                              ) : null}
                                              <span>Front ID</span>
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
                                                  style={{ display: "none" }}
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
                                              style={{ paddingLeft: "9px" }}
                                            >
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
                                            style={{ display: "none" }}
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
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer className="text-right modal-footer-border">
            <Button
              type="button"
              className="btn-back me-3 btn btn-primary"
              onClick={() => {
                toggleCloseverificationIDShow();
              }}
            >
              Cancel
            </Button>

            {formStatus !== "standby" ? (
              <Button
                className="btn-save btn btn btn-primary"
                type="button"
                style={{ cursor: "not-allowed" }}
              >
                Saving...
              </Button>
            ) : (
              <Button className="btn-save btn btn btn-primary" type="submit">
                Save
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default MyAccount;
