import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  ModalFooter,
  Modal,
  Card,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";
import { IoCloseOutline } from "react-icons/io5";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { measurementGuideData, initialChecklistData } from "Utils/assets";
import { useSelector } from "react-redux";
import { useUpdateUserBodyMeasurementMutation } from "store/api/mutations";

const BodyMeasurementStep = ({ reload }) => {
  const [updateUserBodyMeasurement, { isLoading: isUpdating }] =
    useUpdateUserBodyMeasurementMutation();
  const currentStoreUser = useSelector((state) => state.user.user);
  const user = currentStoreUser;
  const [cookies, setCookie] = useCookies(["contactDone", "measurementDone"]);
  const [profileFormData, setProfileFormData] = useState("");
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
  const [checklistData, setChecklistData] = useState(initialChecklistData);

  useEffect(() => {
    if (user) {
      setProfileFormData(user);
    }
  }, [user]);

  async function submitBodyMeasurement(e) {
    e.preventDefault();
    const payload = {
      measurement: {
        ...checklistData,
      },
    };
    const res = await updateUserBodyMeasurement({ ...payload }).unwrap();
    if (res.success) {
      setCookie("measurementDone", "Yes", { path: "/" });
      toast.success(res.message);
      reload();
    }
  }

  const handleChangeBodyMeasurement = (e) => {
    setChecklistData({
      ...checklistData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleMeasurementGuideModal = (id) => {
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

  useEffect(() => {
    const lookup = measurementGuideData.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
    setMeasurementGuideDataLookup(lookup);
  }, []);

  const handleChangeGender = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setProfileFormData({
      ...profileFormData,
      gender: value,
    });
  };

  async function submitBack(e) {
    e.preventDefault();
    reload();
    setCookie("contactDone", "No", { path: "/" });
  }

  return (
    <>
      <div className="px-2 consulatation-top-bottom">
        <div className="mt-3">
          <Row>
            {profileFormData.gender === "Male" ? (
              <>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Upper Neck Circumference </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(47)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="upper_neck_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData?.upper_neck_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Lower Neck Circumference </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(48)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="lower_neck_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData?.lower_neck_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Chest Circumference </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(49)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="chest_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData?.chest_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Waist Circumference </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(50)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="waist_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData?.waist_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Mid Hip Circumference </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(51)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="mid_hip_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData?.mid_hip_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Hip Circumference </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(52)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="hip_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.hip_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Front Waist Length </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(53)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="front_waist_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.front_waist_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Back Waist Length </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(54)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="back_waist_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.back_waist_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Center Front Length </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(55)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="center_front_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.center_front_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Center Back Length </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(56)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="center_back_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.center_back_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Front Neck Depth </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(57)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="front_neck_depth"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.front_neck_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Back Neck Depth </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(58)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="back_neck_depth"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.back_neck_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Armhole Depth </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(59)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="armhole_depth"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.armhole_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Front Shoulder Width </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(60)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="front_shoulder_width"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.front_shoulder_width}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Back Shoulder Width </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(61)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="back_shoulder_width"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.back_shoulder_width}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Shoulder Depth </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(62)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="shoulder_depth"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.shoulder_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Elbow Circumference </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(63)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="elbow_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.elbow_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Underarm Length </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(64)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="underarm_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.underarm_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Side Seam </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(65)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="side_seam"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.side_seam}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Sleeve Length </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(66)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="sleeve_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.sleeve_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Arm Circumference </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(67)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="arm_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.arm_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Wrist Circumference </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(68)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="wrist_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.wrist_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Elbow Length </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(69)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="elbow_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.elbow_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Armhole Circumference </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(70)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="armhole_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.armhole_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Sleeve Cap Height </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(71)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="sleeve_cap_height"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.sleeve_cap_height}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Hip Depth </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(72)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="hip_depth"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.hip_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Crotch Depth </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(73)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="crotch_depth"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.crotch_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Pants/Trouser Length </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(74)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="pants_trouser_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.pants_trouser_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Knee Length </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(75)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="knee_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.knee_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>In Seam Length </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(76)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="in_seam_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.in_seam_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Thigh Circumference </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(77)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="thigh_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.thigh_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Mid-thigh Circumference </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(78)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="mid_thigh_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.mid_thigh_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Knee Circumference </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(79)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="knee_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.knee_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Calf Circumference </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(80)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="calf_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.calf_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Ankle Circumference </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(81)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="ankle_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.ankle_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Ankle-Heel Circumference </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(82)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="ankle_heel_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.ankle_heel_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Body Height </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(83)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="body_height"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.body_height}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Body Length </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(84)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="body_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.body_length}
                    />
                  </Form.Group>
                </Col>
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
                      onClick={submitBodyMeasurement}
                      className="btn-save"
                    >
                      Finish
                    </Button>
                  )}
                </div>
              </>
            ) : profileFormData.gender === "Female" ? (
              <>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Upper Neck Circumference </Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(1)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="upper_neck_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.upper_neck_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Lower Neck Circumference</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(2)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="lower_neck_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.lower_neck_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Chest Circumference</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(3)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="chest_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.chest_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Bust Circumference</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(4)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="bust_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.bust_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Under Bust Circumference</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(5)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="under_bust_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.under_bust_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Waist Circumference</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(6)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="waist_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.waist_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Mid Hip Circumference</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(7)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="mid_hip_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.mid_hip_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Hip Circumference</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(8)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="hip_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.hip_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Bust Distance</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(9)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="bust_distance"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.bust_distance}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Front Chest Width</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(10)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="front_chest_width"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.front_chest_width}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Back Chest Width</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(11)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="back_chest_width"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.back_chest_width}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Front Waist Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(12)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="front_waist_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.front_waist_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Back Waist Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(13)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="back_waist_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.back_waist_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Center Front Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(14)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="center_front_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.center_front_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Center Back Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(15)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="center_back_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.center_back_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Front Neck Depth</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(16)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="front_neck_depth"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.front_neck_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Back Neck Depth</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(17)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="back_neck_depth"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.back_neck_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Bust Depth</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(18)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="bust_depth"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.bust_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Armhole Depth</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(19)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="armhole_depth"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.armhole_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Bust Height</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(20)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="bust_height"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.bust_height}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Front Shoulder Width</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(21)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="front_shoulder_width"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.front_shoulder_width}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Back Shoulder Width</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(22)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="back_shoulder_width"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.back_shoulder_width}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Shoulder Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(23)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="shoulder_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.shoulder_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Shoulder Depth</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(24)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="shoulder_depth"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.shoulder_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Elbow Circumference</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(25)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="elbow_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.elbow_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Underarm Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(26)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="underarm_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.underarm_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Sleeve Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(27)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="sleeve_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.sleeve_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Arm Circumference</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(28)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="arm_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.arm_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Wrist Circumference</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(29)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="wrist_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.wrist_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Elbow Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(30)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="elbow_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.elbow_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Armhole Circumference</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(31)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="armhole_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.armhole_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Sleeve Cap Height</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(32)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="sleeve_cap_height"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.sleeve_cap_height}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Hip Depth</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(33)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="hip_depth"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.hip_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Crotch Depth</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(34)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="crotch_depth"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.crotch_depth}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Crotch Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(35)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="crotch_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.crotch_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Pants Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(36)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="pants_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.pants_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Knee Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(37)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="knee_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.knee_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>In seam Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(38)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="in_seam_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.in_seam_length}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Thigh Circumference</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(39)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="thigh_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.thigh_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Mid Thigh Circumference</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(40)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="mid_thigh_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.mid_thigh_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Knee Circumference</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(41)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="knee_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.knee_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Calf Circumference</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(42)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="calf_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.calf_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Ankle Circumference</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(43)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="ankle_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.ankle_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Ankle Heel Circumference</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(44)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="ankle_heel_circumference"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.ankle_heel_circumference}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Body Height</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(45)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="body_height"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.body_height}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="mb-3">
                    <Form.Group>
                      <Form.Label>Body Length</Form.Label>
                      <IoIosHelpCircleOutline
                        size={20}
                        className="question-btn"
                        onClick={() => toggleMeasurementGuideModal(46)}
                      />
                    </Form.Group>
                    <Form.Control
                      name="body_length"
                      onChange={handleChangeBodyMeasurement}
                      placeholder=""
                      type="number"
                      value={checklistData.body_length}
                    />
                  </Form.Group>
                </Col>
                <div className="text-right mt-4 mb-2">
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
                        onClick={submitBodyMeasurement}
                        className="btn-save"
                      >
                        Finish
                      </Button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Form.Group as={Col} lg={1} md={1} sm={1}>
                  <Form.Check
                    className="cursor-pointer"
                    type="radio"
                    label="Male"
                    name="gender"
                    value="Male"
                    checked={profileFormData.gender === "Male"}
                    onChange={handleChangeGender}
                  />
                </Form.Group>
                <Form.Group as={Col} lg={1} md={1} sm={1}>
                  <Form.Check
                    className="cursor-pointer"
                    type="radio"
                    label="Female"
                    name="gender"
                    value="Female"
                    checked={profileFormData.gender === "Female"}
                    onChange={handleChangeGender}
                  />
                </Form.Group>
              </>
            )}
          </Row>
        </div>
        <Modal
          show={measurementGuideModalShow}
          className="modal-preview measurement-guide-modal"
          fade={false}
          centered
          size="sm"
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
                    <div className=" tw-flex tw-flex-col tw-justify-center">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: measurementGuideDescription,
                        }}
                        className="fs-16 mb-2 text-black "
                      />
                      <img
                        src={measurementGuideImage}
                        className="measurement-image tw-mx-auto"
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
      </div>
    </>
  );
};

export default BodyMeasurementStep;
