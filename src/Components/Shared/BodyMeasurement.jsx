import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Modal,
  ModalFooter,
  Form,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import { IoIosHelpCircleOutline } from "react-icons/io";
import axios from "axios";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";
import { IoSaveOutline } from "react-icons/io5";
import { measurementGuideData, initialBodyMeasurementData } from "Utils/assets";
import { useUpdateUserBodyMeasurementMutation } from "store/api/mutations";
import { useGetProfileQuery } from "store/api/queries";

const BodyMeasurement = ({ userData }) => {
  const [updateUserBodyMeasurement, { isLoading: isUpdating }] =
    useUpdateUserBodyMeasurementMutation();
  const { refetch: refetchUser } = useGetProfileQuery();

  const [modalHeadingMeasurementGuide, setModalHeadingMeasurementGuide] =
    useState("");
  const [measurementGuideDescription, setModalMeasurementGuideDescription] =
    useState("");
  const [measurementGuideImage, setModalMeasurementGuideImage] = useState("");
  const [measurementGuideModalShow, setMeasurementGuideModalShow] =
    useState(false);
  const [measurementGuidedataLookup, setMeasurementGuideDataLookup] = useState(
    {}
  );
  const [bodyMeasurementFormData, setBodyMeasurementFormData] = useState(
    initialBodyMeasurementData
  );
  const [formLoading, setFormLoading] = useState(false);
  const [user] = useState(userData);
  const [cookies] = useCookies(["currentUser", "token"]);

  const toggleMeasurementGuideModal = (id) => {
    // setModalHeadingMeasurementGuide(heading);
    const data = measurementGuidedataLookup[id];
    if (data) {
      setModalHeadingMeasurementGuide(data.title);
      setModalMeasurementGuideDescription(data.description);
      setModalMeasurementGuideImage(data.image);
    } else {
      setModalHeadingMeasurementGuide("-");
      setModalMeasurementGuideDescription("-");
      setModalMeasurementGuideImage("-");
    }
    setMeasurementGuideModalShow(!measurementGuideModalShow);
  };

  const handleChangeBodyMeasurement = (e) => {
    setBodyMeasurementFormData({
      ...bodyMeasurementFormData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    // Create lookup object
    const lookup = measurementGuideData.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
    setMeasurementGuideDataLookup(lookup);
    if (user.body_measurement) {
      setBodyMeasurementFormData(user.body_measurement);
    }
  }, []);

  async function submitBodyMeasurements(e) {
    e.preventDefault();
    setFormLoading(true);

    const payload = {
      measurement: {
        ...bodyMeasurementFormData,
      },
    };

    console.log("payload", bodyMeasurementFormData);
    const res = await updateUserBodyMeasurement({ ...payload }).unwrap();
    if (res.success) {
      toast.success(res.message);
      refetchUser();
    }
  }

  return (
    <>
      {user.gender === "Male" ? (
        <>
          <div className="neck-container">
            <p className="title-designer mb-1 lh-25">Neck </p>
            <div className="ms-60">
              <Row className="mb-4">
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Upper Neck Circumference{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(47)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="upper_neck_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.upper_neck_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Lower Neck Circumference{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(48)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="lower_neck_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.lower_neck_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Front Neck Depth{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(57)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="front_neck_depth"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.front_neck_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Back Neck Depth{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(58)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="back_neck_depth"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.back_neck_depth}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <hr />
            </div>
          </div>
          <div className="chest-container">
            <p className="title-designer mb-1 lh-25 mt-4">Chest </p>
            <div className="ms-60">
              <Row className="mb-4">
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Chest Circumference{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(49)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="chest_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.chest_circumference}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <hr />
            </div>
          </div>
          <div className="waist-container">
            <p className="title-designer mb-1 lh-25 mt-4">Waist </p>
            <div className="ms-60">
              <Row className="mb-4">
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Waist Circumference{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(50)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="waist_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.waist_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Mid Hip Circumference{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(51)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="mid_hip_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.mid_hip_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Hip Circumference{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(52)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="hip_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.hip_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Back Waist Length{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(54)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="back_waist_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.back_waist_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Front Waist Length{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(53)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="front_waist_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.front_waist_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Center Front Length{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(55)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="center_front_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.center_front_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Center Back Length{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(56)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="center_back_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.center_back_length}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <hr />
            </div>
          </div>
          <div className="arm-container">
            <p className="title-designer mb-1 lh-25 mt-4">Arm </p>
            <div className="ms-60">
              <Row className="mb-4">
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Armhole Depth </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(59)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="armhole_depth"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.armhole_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Front Shoulder Width{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(60)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="front_shoulder_width"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.front_shoulder_width}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Back Shoulder Width{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(61)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="back_shoulder_width"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.back_shoulder_width}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Shoulder Depth </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(62)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="shoulder_depth"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.shoulder_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Elbow Circumference{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(63)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="elbow_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.elbow_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Underarm Length{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(64)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="underarm_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.underarm_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Sleeve Length </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(66)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="sleeve_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.sleeve_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Arm Circumference{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(67)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="arm_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.arm_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Armhole Circumference{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(70)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="armhole_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.armhole_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Sleeve Cap Height{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(71)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="sleeve_cap_height"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.sleeve_cap_height}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Wrist Circumference{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(68)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="wrist_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.wrist_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Elbow Length </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(69)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="elbow_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.elbow_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Side Seam </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(65)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="side_seam"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.side_seam}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <hr />
            </div>
          </div>
          <div className="lower-body-container">
            <p className="title-designer mb-1 lh-25 mt-4">Lower Body </p>
            <div className="ms-60">
              <Row className="mb-4">
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Hip Depth </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(72)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="hip_depth"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.hip_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Crotch Depth </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(73)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="crotch_depth"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.crotch_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Pants/Trouser Length{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(74)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="pants_trouser_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.pants_trouser_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Knee Length </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(75)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="knee_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.knee_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">In Seam Length </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(76)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="in_seam_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.in_seam_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Thigh Circumference{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(77)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="thigh_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.thigh_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Mid-thigh Circumference{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(78)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="mid_thigh_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.mid_thigh_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Knee Circumference{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(79)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="knee_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.knee_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Calf Circumference{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(80)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="calf_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.calf_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Ankle Circumference{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(81)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="ankle_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.ankle_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Ankle-Heel Circumference{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(82)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="ankle_heel_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.ankle_heel_circumference}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <hr />
            </div>
          </div>
          <div className="body-height-length-container">
            <p className="title-designer mb-1 lh-25 mt-4">
              Body Height & Length{" "}
            </p>
            <div className="ms-60">
              <Row className="mb-4">
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Body Height </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(83)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="body_height"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.body_height}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Body Length </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(84)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="body_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.body_length}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <hr />
            </div>
          </div>
          <hr />
          <div className="text-right mt-30">
            {isUpdating ? (
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
                onClick={submitBodyMeasurements}
              >
                <IoSaveOutline size="20px" /> Save
              </Button>
            )}
          </div>
        </>
      ) : user.gender === "Female" ? (
        <>
          <div className="neck-container">
            <p className="title-designer mb-1 lh-25">Neck </p>
            <div className="ms-60">
              <Row className="mb-4">
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Upper Neck Circumference{" "}
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(1)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="upper_neck_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.upper_neck_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Lower Neck Circumference
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(2)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="lower_neck_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.lower_neck_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Front Neck Depth
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(16)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="front_neck_depth"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.front_neck_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Back Neck Depth</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(17)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="back_neck_depth"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.back_neck_depth}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <hr />
            </div>
          </div>

          <div className="chest-container">
            <p className="title-designer mb-1 lh-25 mt-4">Chest </p>
            <div className="ms-60">
              <Row className="mb-4">
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Chest Circumference
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(3)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="chest_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.chest_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Back Chest Width
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(11)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="back_chest_width"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.back_chest_width}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Front Chest Width
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(10)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="front_chest_width"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.front_chest_width}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Bust Distance</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(9)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="bust_distance"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.bust_distance}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Bust Circumference
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(4)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="bust_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.bust_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Under Bust Circumference
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(5)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="under_bust_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.under_bust_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Bust Depth</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(18)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="bust_depth"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.bust_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Bust Height</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(20)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="bust_height"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.bust_height}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <hr />
            </div>
          </div>

          <div className="waist-container">
            <p className="title-designer mb-1 lh-25 mt-4">Waist </p>
            <div className="ms-60">
              <Row className="mb-4">
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Waist Circumference
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(6)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="waist_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.waist_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Mid Hip Circumference
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(7)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="mid_hip_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.mid_hip_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Hip Circumference
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(8)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="hip_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.hip_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Back Waist Length
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(13)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="back_waist_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.back_waist_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Front Waist Length
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(12)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="front_waist_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.front_waist_length}
                    />
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Center Front Length
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(14)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="center_front_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.center_front_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Center Back Length
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(15)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="center_back_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.center_back_length}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <hr />
            </div>
          </div>

          <div className="arm-container">
            <p className="title-designer mb-1 lh-25 mt-4">Arm </p>
            <div className="ms-60">
              <Row className="mb-4">
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Armhole Depth</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(19)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="armhole_depth"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.armhole_depth}
                    />
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Front Shoulder Width
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(21)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="front_shoulder_width"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.front_shoulder_width}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Back Shoulder Width
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(22)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="back_shoulder_width"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.back_shoulder_width}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Shoulder Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(23)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="shoulder_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.shoulder_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Shoulder Depth</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(24)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="shoulder_depth"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.shoulder_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Elbow Circumference
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(25)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="elbow_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.elbow_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Underarm Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(26)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="underarm_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.underarm_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Sleeve Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(27)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="sleeve_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.sleeve_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Arm Circumference
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(28)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="arm_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.arm_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Armhole Circumference
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(31)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="armhole_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.armhole_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Sleeve Cap Height
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(32)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="sleeve_cap_height"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.sleeve_cap_height}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Wrist Circumference
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(29)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="wrist_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.wrist_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Elbow Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(30)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="elbow_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.elbow_length}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <hr />
            </div>
          </div>

          <div className="lower-body-container">
            <p className="title-designer mb-1 lh-25 mt-4">Lower Body </p>
            <div className="ms-60">
              <Row className="mb-4">
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Hip Depth</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(33)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="hip_depth"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.hip_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Crotch Depth</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(34)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="crotch_depth"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.crotch_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Crotch Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(35)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="crotch_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.crotch_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Pants Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(36)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="pants_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.pants_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Knee Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(37)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="knee_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.knee_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">In seam Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(38)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="in_seam_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.in_seam_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Thigh Circumference
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(39)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="thigh_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.thigh_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Mid Thigh Circumference
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(40)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="mid_thigh_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.mid_thigh_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Knee Circumference
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(41)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="knee_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.knee_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Calf Circumference
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(42)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="calf_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.calf_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Ankle Circumference
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(43)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="ankle_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.ankle_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">
                        Ankle Heel Circumference
                      </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(44)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="ankle_heel_circumference"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.ankle_heel_circumference}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <hr />
            </div>
          </div>

          <div className="body-height-length-container">
            <p className="title-designer mb-1 lh-25 mt-4">
              Body Height & Length{" "}
            </p>
            <div className="ms-60">
              <Row className="mb-4">
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Body Height</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(45)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="body_height"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.body_height}
                    />
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label className="lh-25">Body Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(46)}
                      />
                    </Form.Group>
                    <Form.Control
                      type="number"
                      name="body_length"
                      placeholder=""
                      onChange={handleChangeBodyMeasurement}
                      value={bodyMeasurementFormData.body_length}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <hr />
            </div>
          </div>
          <hr />
          <div className="text-right mt-30">
            {formLoading ? (
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
                onClick={submitBodyMeasurements}
              >
                <IoSaveOutline size="20px" /> Save
              </Button>
            )}
          </div>
        </>
      ) : (
        <p className="text-center mb-3 mt-3">
          Please update your gender <Link to="/user/complete-profile">here</Link>{" "}
          before filling up your measurements
        </p>
      )}

      <Modal
        show={measurementGuideModalShow}
        className="modal-preview measurement-guide-modal"
        fade={false}
        centered
        size="lg"
      >
        <Modal.Header className="py-0">
          <h5 className="modal-title text-left rufina-family fs-22 mt-3">
            {modalHeadingMeasurementGuide}
          </h5>
          <button
            type="button"
            className="close react-modal-close"
            onClick={() => setMeasurementGuideModalShow(false)}
          >
            <IoCloseOutline color="#7e7e7e" size={25} className="mt-2" />
          </button>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body className="text-left">
              <Row>
                <Col lg={12}>
                  <div>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: measurementGuideDescription,
                      }}
                      className="fs-16 mb-2 text-black"
                    />
                    <img
                      src={measurementGuideImage}
                      className="measurement-image"
                    />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>

        <ModalFooter className="border-none pt-0">
          <div className="text-right">
            <button
              className="btn btn-secondary border-black bg-white text-black btn-style"
              onClick={() => setMeasurementGuideModalShow(false)}
              type="button"
            >
              Close
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default BodyMeasurement;
