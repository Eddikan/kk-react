import  { useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import { Form, Container, Row, Col, Button, Card, Modal, ModalFooter, Alert } from 'react-bootstrap';
import Layout from 'Components/Layout/Layout';
import '../Assets/styles/EcoFriendly/style.css';
import '../Assets/styles/ConsultationMeeting/style.css';
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
import { FaVideo } from "react-icons/fa";
import {  FiMonitor } from "react-icons/fi";
import { GoAlertFill } from 'react-icons/go';
import { IoCloseOutline } from "react-icons/io5";
import { ImPhoneHangUp } from "react-icons/im";
import { MdOutlineVideocam, MdOutlineVideocamOff } from 'react-icons/md';
import {  BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import { Helmet } from "react-helmet";
import toast from 'react-hot-toast';
import axios from 'axios';
import getUserData from 'Utils/GetUserData';

import MeetingChat from '../Components/Chat/MeetingChat';
import { IoIosHelpCircleOutline } from "react-icons/io";

import { measurementGuideData, initialChecklistData } from "Utils/assets";


const intitialConsultationData = {
    consultation_date_time: '',
    consultation_hour_start: '',
    consultation_hour_end: '',
    consultation_date: '',
    email: '',
    first_name: '',
    last_name: '',
    timezone: '',
    consultation_details: '',
}




const VideoConferencing = () => {
    const navigate = useNavigate();
    const [cookies] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'currentUserSeller', 'currentUserDesigner']);
    const currentUser = cookies.currentUser;
    const current_user_id = cookies.currentUser;
    const userDetails = cookies.userDetails;
    const currentUserDesigner = cookies.currentUserDesigner;
    const currentUserSeller = cookies.currentUserSeller;
    const token = cookies.token;

    const { appointmentId } = useParams();
    const [appointment, setAppointment] = useState([]);
    const [reloadCount, setReloadCount] = useState(0);
    const [reloadCountUser, setReloadCountUser] = useState(1);
    const [user, setUser] = useState([]);
    const [bodyMeasurement, setBodyMeasurement] = useState([]);
    const [consultationFormData, setConsultationFormData] = useState(intitialConsultationData);
    const [checklistData, setChecklistData] = useState(initialChecklistData);
    const [updateChecklistLoading, setUpdateChecklistLoading] = useState(false);
    const [measurementModalShow, setMeasurementModalShow] = useState(false);
    const [uploadMeasurementModalShow, setUploadMeasurementModalShow] = useState(false);
    const [isMicVisible, setMicVisible] = useState(false);
    const [isCameraVisible, setIsCameraVisible] = useState(false);
    const [isShareScreenVisible, setShareScreenVisible] = useState(false);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [endMeetingModal, setEndMeetingModal] = useState(false);
    const [endMeetingLoading, setEndMeetingLoading] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [modalHeadingMeasurementGuide, setModalHeadingMeasurementGuide] = useState('');
    const [measurementGuideDescription, setModalMeasurementGuideDescription] = useState('');
    const [measurementGuideImage, setModalMeasurementGuideImage] = useState('');
    const [measurementGuideModalShow, setMeasurementGuideModalShow] = useState(false);
    const [measurementGuidedataLookup, setMeasurementGuideDataLookup] = useState({});
    const [isUserAppointment, setIsUserAppointment] = useState(false);
    let room = document.querySelector("whereby-embed");

    const getAppointment = async () => {
        return await axios.get(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'designer/appointment/' + appointmentId + '?current_user_id=' + current_user_id + '&token=' + token);
    };

    const putSchedule = async (data) => {
        return await axios.put(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'designer/appointment/' + appointmentId + '?current_user_id=' + current_user_id  + '&token=' + token, data);
    };

    const putUser = async (data) => {
        return await axios.put(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?current_user_id=' + current_user_id + '&token=' + token, data);
    };

    const toggleSaveAppointmentModal = () => {
        setEndMeetingModal(!endMeetingModal);
    };

    const toggleMeasurementModal = () => {
        setMeasurementModalShow(!measurementModalShow);
    };

    const toggleUploadMeasurementModal = () => {
        setUploadMeasurementModalShow(!uploadMeasurementModalShow);
    };

    const toggleMeasurementGuideModal = (id) => {
        // setModalHeadingMeasurementGuide(heading);
        const data = measurementGuidedataLookup[id];
        if (data) {
            setModalHeadingMeasurementGuide(data.title);
            setModalMeasurementGuideDescription(data.description);
            setModalMeasurementGuideImage(data.image);
        } else {
            setModalHeadingMeasurementGuide('-');
            setModalMeasurementGuideDescription('-');
            setModalMeasurementGuideImage('-');
        }
        setMeasurementGuideModalShow(!measurementGuideModalShow);
    };

    const goBack = () => {
        window.history.back();
    };

    const toggleMic = () => {
        room.toggleMicrophone();
        setMicVisible(!isMicVisible);
    };

    const toggleCam = () => {
        room.toggleCamera();
        setIsCameraVisible(!isCameraVisible);
    };


    const shareScreen = () => {
        if (!isShareScreenVisible) {
            room.toggleScreenshare(true);
            setShareScreenVisible(true);
        } else {
            room.toggleScreenshare(false);
            setShareScreenVisible(false);
        }
    };

 

    const handleChange = (e) => {
        setChecklistData({
            ...checklistData,
            [e.target.name]: e.target.value,
        })
    };

    const handleChangeGender = (e) => {
        const { value } = e.target;
        setUser({
            ...user,
            gender: value
        });

        e.preventDefault();
        axios.put(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?current_user_id=' + current_user_id + '&token=' + token + '&gender=' + value).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                // toast.success('Profile updated successfully!');
            } else {
                const errors = response.data.errors;
                console.log("errors", errors);
            }
        }).catch((error) => {
            console.log("error", error);
            toast.error('Something went wrong, please contact the administrator!');
        });
    };

  

    const endMeetingSubmit = (e) => {
        setEndMeetingLoading(true);
        e.preventDefault();
        putSchedule({ status: 'Finished' }).then(response => {
            const success = response.data.status;
            if (success == success) {
                setConsultationFormData(consultationFormData);
                setReloadCount(reloadCount + 1);
                navigate('/user/center/appointments');
                setEndMeetingLoading(false);
            } else {
                toast.error('There has been an error ending the meeting, please try again!');
                setEndMeetingLoading(false);
            }
        }).catch(() => {
            toast.error('There has been an error ending the meeting, please try again!');
            setEndMeetingLoading(false);
        });
    }

    const updateChecklist = (e) => {
        setUpdateChecklistLoading(true);
        e.preventDefault();
        console.log("checklistData", checklistData);
        putUser({ body_measurement: JSON.stringify(checklistData) }).then(response => {
            const success = response.data.status;
            if (success == success) {
                toast.success('Measurement uploaded successfully!');
                setUpdateChecklistLoading(false);
                setReloadCountUser(reloadCountUser + 1);
                toggleUploadMeasurementModal();
                // navigate('/user/center/appointments');
            } else {
                toast.error('There has been an error uploading the measurement, please try again!');
                setUpdateChecklistLoading(false);
            }
        }).catch(() => {
            toast.error('There has been an error uploading the measurement, please try again!');
            setUpdateChecklistLoading(false);
        });
    }

    useEffect(() => {
        if (currentUser) {
            console.log("userDetails", userDetails);
            getAppointment()
                .then((response) => {
                    const selectedAppointment = response.data.data;
                    if (selectedAppointment) {
                        setAppointment(selectedAppointment);
                        setConsultationFormData(selectedAppointment);
                        // setChecklistData(selectedAppointment.measurement_data);
                        console.log("currentUser", currentUser);
                        console.log("selectedAppointment.designer.id", selectedAppointment.designer.id);
                        if (currentUser == selectedAppointment.designer.id || currentUserDesigner == selectedAppointment.designer.id || currentUserSeller == selectedAppointment.designer.id) {
                            setIsUserAppointment(true);
                        } else {
                            setIsUserAppointment(false);
                        }
                    } else {
                        toast.error('There has been an error getting the appointment, please try again!');
                    }
                })
                .catch((error) => {
                    console.log("error", error);
                    toast.error('There has been an error getting the appointment, please try again!');
                });
        }
    },
        [reloadCount]);

    const fetchData = async (e) => {
        try {
            const userData = await getUserData(e);
            if (userData.id) {
                setUser(userData);
                setBodyMeasurement(userData.body_measurement);
                setChecklistData(userData.body_measurement);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
            }
        } catch (error) {
            console.log("error", error);
            toast.error('An error occured. Please try again or contact the administrator.');
        }
    };

    useEffect(() => {
        fetchData({ currentUser: currentUser, token: token });
    }, [reloadCountUser]);

    useEffect(() => {
        // Create lookup object
        const lookup = measurementGuideData.reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
        }, {});
        setMeasurementGuideDataLookup(lookup);
    }, []);

    return (
        <Layout>
            <Helmet>
                <script
                    type="module"
                    src="https://cdn.srv.whereby.com/embed/v1.js"
                    async="true"
                >
                </script>
            </Helmet>
            <div className='px-2 consulatation-top-bottom'>
                <section>
                    <Container>
                        <Row>
                            <Row className='px-0'>
                                <Col md={12} className="text-right px-0">
                                    <GoBack fallBack="/#" />
                                </Col>
                            </Row>
                            <Col lg="8">
                               

                                <Card>
                                    <Card.Body className='card-video'>
                                        <Row>
                                            <Col lg="12" className="text-center">
                                                <FaVideo className="my-5" size="350px" />
                                                {/* {consultationFormData.role === "" ?
                                                    <>
                                                        <whereby-embed
                                                            minimal
                                                            room={
                                                                consultationFormData.host_url +
                                                                `& background=off & audio=off & topToolbar=off & video=on & bottomToolbar=off & skipMediaPermissionPrompt=off & precallReview=off & displayName=` + userDetails?.first_name + " " + userDetails?.last_name
                                                            }
                                                            style={{ height: '620px' }}
                                                        />
                                                    </>
                                                    :
                                                    <>
                                                        <whereby-embed
                                                            minimal
                                                            room={consultationFormData.participant_url +
                                                                "?background=off&audio=off&settingsButton=off&moreButton=off&topToolbar=off&video=on&bottomToolbar=off&skipMediaPermissionPrompt=off&precallReview=off&displayName=" + userDetails?.first_name + " " + userDetails?.last_name
                                                            }
                                                            style={{ height: '620px' }}
                                                        />
                                                    </>
                                                } */}
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                <Col lg="12" className='d-flex justify-content-center align-items-center mt-3 d-none'>
                                    <div className='d-flex'>
                                        <div className="meeting-tooltip">
                                            <button
                                                onClick={toggleMic}
                                                className={isMicVisible ? "video-button-off video-button" : "video-button-on video-button"}
                                            >
                                                {isMicVisible ? <BiMicrophone size="20px" color="#FFFFFF" /> : <BiMicrophoneOff size="20px" color="#FFFFFF" />}
                                                <span className="icon-tooltiptext call-icons">
                                                    Microphone
                                                </span>
                                            </button>
                                        </div>

                                        <div className="meeting-tooltip">
                                            <button
                                                onClick={toggleCam}
                                                className={isCameraVisible ? "video-button-off video-button" : "video-button-on video-button"}
                                            >
                                                {isCameraVisible ? <MdOutlineVideocam size="23px" color="#FFFFFF" /> : <MdOutlineVideocamOff size="23px" color="#FFFFFF" />}
                                                <span className="icon-tooltiptext call-icons">
                                                    Camera
                                                </span>
                                            </button>
                                        </div>

                                        <div className="meeting-tooltip">
                                            <button
                                                onClick={shareScreen}
                                                className={!isShareScreenVisible ? "video-button-off video-button" : "video-button-share-on video-button"}
                                            >
                                                <FiMonitor size="20px" color="#FFFFFF" />
                                                <span className="icon-tooltiptext call-icons">
                                                    Present Now
                                                </span>
                                            </button>
                                        </div>

                                        <div className="meeting-tooltip">
                                            {currentUser == appointment?.user?.id ?
                                                <>
                                                    <button
                                                        onClick={goBack}
                                                        className="video-button-on video-button"
                                                    >
                                                        <ImPhoneHangUp size="20px" className='mb-1' color="#FFFFFF" />
                                                        <span className="icon-tooltiptext call-icons">
                                                            Leave Call
                                                        </span>
                                                    </button>
                                                </>
                                                :
                                                <>
                                                    <button
                                                        onClick={toggleSaveAppointmentModal}
                                                        className="video-button-on video-button"
                                                    >
                                                        <ImPhoneHangUp size="20px" className='mb-1' color="#FFFFFF" />
                                                        <span className="icon-tooltiptext call-icons">
                                                            Leave Call
                                                        </span>
                                                    </button>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </Col>
                            </Col>

                            <Col lg="4">
                                {appointment.measurement_checklist == 0 ?
                                    <>
                                        {isUserAppointment == false ?
                                            <Alert variant="warning" className="d-flex justify-content-between align-items-center">
                                                <span>Please upload your measurements.</span> {` `}
                                                <Button className="px-4 minw-auto" type="button" onClick={toggleUploadMeasurementModal}>Proceed</Button>
                                            </Alert>
                                            :
                                            <Alert variant="warning" className="d-flex justify-content-between align-items-center">
                                                <span>The customer has not uploaded his/her measurements.</span> {` `}
                                            </Alert>
                                        }
                                    </>
                                    : appointment.measurement_checklist == 1 ?
                                        <>
                                            {isUserAppointment == false ?
                                                <Alert variant="success" className="d-flex justify-content-between align-items-center">
                                                    <span>You have uploaded your measurements.</span> {` `}
                                                    <Button className="px-4 minw-auto" type="button" onClick={toggleMeasurementModal}>View</Button>
                                                </Alert>
                                                :
                                                <Alert variant="success" className="d-flex justify-content-between align-items-center">
                                                    <span>The customer has uploaded his/her measurements.</span> {` `}
                                                    <Button className="px-4 minw-auto" type="button" onClick={toggleMeasurementModal}>View</Button>
                                                </Alert>
                                            }
                                        </>
                                        :
                                        null
                                }
                                <Card>
                                    <Card.Body>
                                            <>
                                                <Row>
                                                    <Col lg="12">
                                                        <div className='fw-600 fs-18 text-gold'>Chat</div>
                                                        <hr />
                                                    </Col>

                                                    <Col lg="12">
                                                        <MeetingChat
                                                            currentUser={currentUser}
                                                            appointmentId={appointmentId}
                                                            user={userDetails}
                                                        />
                                                    </Col>
                                                </Row>
                                            </>
                                       


                                        {/* {participantsShow ?
                                            <>
                                                <Row>
                                                    <Col lg="12">
                                                        <div className='fw-600 fs-18 text-gold'>Participants</div>
                                                        <hr />
                                                    </Col>

                                                    <Col lg="12">
                                                        <Card className='border-none'>
                                                            <Card.Body className='chat-height-card'>

                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </>
                                            :
                                            null
                                        }

                                        {agendaShow ?
                                            <>
                                                <Row>
                                                    <Col lg="12">
                                                        <div className='fw-600 fs-18 text-gold'>Agenda</div>
                                                        <hr />
                                                    </Col>

                                                    <Col lg="12">
                                                        <Card className='border-none'>
                                                            <Card.Body className='chat-height-card'>

                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </>
                                            :
                                            null
                                        } */}

                                    </Card.Body>
                                </Card>

                                <Row>
                                    <Col className='d-flex justify-content-end mt-3'>
                                       
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </div >

            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={() => setUnderConstructionShow(false)}
                        data-dismiss='modal'
                        aria-label='Close'
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-1' />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='fs-22 rufina-family mb-3'>Under Construction</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>

            <Modal
                show={uploadMeasurementModalShow}
                className='modal-preview ps-0'
                fade={false}
                centered
                size="lg"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-left rufina-family fs-22 mt-3'>Body Measurement</h5>
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={() => { setUploadMeasurementModalShow(false); setChecklistData(bodyMeasurement); }}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body className="text-left">
                            <Row>
                                {user.gender == "Male" ?
                                    <>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Upper Neck Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(47)} />
                                                </Form.Group>
                                                <Form.Control name="upper_neck_circumference" onChange={handleChange} placeholder="" value={checklistData.upper_neck_circumference} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Lower Neck Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(48)} />
                                                </Form.Group>
                                                <Form.Control name="lower_neck_circumference" onChange={handleChange} placeholder="" value={checklistData.lower_neck_circumference} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Chest Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(49)} />
                                                </Form.Group>
                                                <Form.Control name="chest_circumference" onChange={handleChange} placeholder="" value={checklistData.chest_circumference} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Waist Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(50)} />
                                                </Form.Group>
                                                <Form.Control name="waist_circumference" onChange={handleChange} placeholder="" value={checklistData.waist_circumference} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Mid Hip Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(51)} />
                                                </Form.Group>
                                                <Form.Control name="mid_hip_circumference" onChange={handleChange} placeholder="" value={checklistData.mid_hip_circumference} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Hip Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(52)} />
                                                </Form.Group>
                                                <Form.Control name="hip_circumference" onChange={handleChange} placeholder="" value={checklistData.hip_circumference} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Front Waist Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(53)} />
                                                </Form.Group>
                                                <Form.Control name="front_waist_length" onChange={handleChange} placeholder="" value={checklistData.front_waist_length} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Back Waist Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(54)} />
                                                </Form.Group>
                                                <Form.Control name="back_waist_length" onChange={handleChange} placeholder="" value={checklistData.back_waist_length} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Center Front Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(55)} />
                                                </Form.Group>
                                                <Form.Control name="center_front_length" onChange={handleChange} placeholder="" value={checklistData.center_front_length} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Center Back Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(56)} />
                                                </Form.Group>
                                                <Form.Control name="center_back_length" onChange={handleChange} placeholder="" value={checklistData.center_back_length} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Front Neck Depth </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(57)} />
                                                </Form.Group>
                                                <Form.Control name="front_neck_depth" onChange={handleChange} placeholder="" value={checklistData.front_neck_depth} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Back Neck Depth </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(58)} />
                                                </Form.Group>
                                                <Form.Control name="back_neck_depth" onChange={handleChange} placeholder="" value={checklistData.back_neck_depth} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Armhole Depth </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(59)} />
                                                </Form.Group>
                                                <Form.Control name="armhole_depth" onChange={handleChange} placeholder="" value={checklistData.armhole_depth} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Front Shoulder Width </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(60)} />
                                                </Form.Group>
                                                <Form.Control name="front_shoulder_width" onChange={handleChange} placeholder="" value={checklistData.front_shoulder_width} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Back Shoulder Width </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(61)} />
                                                </Form.Group>
                                                <Form.Control name="back_shoulder_width" onChange={handleChange} placeholder="" value={checklistData.back_shoulder_width} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Shoulder Depth </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(62)} />
                                                </Form.Group>
                                                <Form.Control name="shoulder_depth" onChange={handleChange} placeholder="" value={checklistData.shoulder_depth} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Elbow Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(63)} />
                                                </Form.Group>
                                                <Form.Control name="elbow_circumference" onChange={handleChange} placeholder="" value={checklistData.elbow_circumference} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Underarm Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(64)} />
                                                </Form.Group>
                                                <Form.Control name="underarm_length" onChange={handleChange} placeholder="" value={checklistData.underarm_length} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Side Seam </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(65)} />
                                                </Form.Group>
                                                <Form.Control name="side_seam" onChange={handleChange} placeholder="" value={checklistData.side_seam} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Sleeve Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(66)} />
                                                </Form.Group>
                                                <Form.Control name="sleeve_length" onChange={handleChange} placeholder="" value={checklistData.sleeve_length} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Arm Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(67)} />
                                                </Form.Group>
                                                <Form.Control name="arm_circumference" onChange={handleChange} placeholder="" value={checklistData.arm_circumference} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Wrist Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(68)} />
                                                </Form.Group>
                                                <Form.Control name="wrist_circumference" onChange={handleChange} placeholder="" value={checklistData.wrist_circumference} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Elbow Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(69)} />
                                                </Form.Group>
                                                <Form.Control name="elbow_length" onChange={handleChange} placeholder="" value={checklistData.elbow_length} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Armhole Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(70)} />
                                                </Form.Group>
                                                <Form.Control name="armhole_circumference" onChange={handleChange} placeholder="" value={checklistData.armhole_circumference} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Sleeve Cap Height </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(71)} />
                                                </Form.Group>
                                                <Form.Control name="sleeve_cap_height" onChange={handleChange} placeholder="" value={checklistData.sleeve_cap_height} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Hip Depth </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(72)} />
                                                </Form.Group>
                                                <Form.Control name="hip_depth" onChange={handleChange} placeholder="" value={checklistData.hip_depth} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Crotch Depth </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(73)} />
                                                </Form.Group>
                                                <Form.Control name="crotch_depth" onChange={handleChange} placeholder="" value={checklistData.crotch_depth} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Pants/Trouser Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(74)} />
                                                </Form.Group>
                                                <Form.Control name="pants_trouser_length" onChange={handleChange} placeholder="" value={checklistData.pants_trouser_length} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Knee Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(75)} />
                                                </Form.Group>
                                                <Form.Control name="knee_length" onChange={handleChange} placeholder="" value={checklistData.knee_length} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>In Seam Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(76)} />
                                                </Form.Group>
                                                <Form.Control name="in_seam_length" onChange={handleChange} placeholder="" value={checklistData.in_seam_length} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Thigh Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(77)} />
                                                </Form.Group>
                                                <Form.Control name="thigh_circumference" onChange={handleChange} placeholder="" value={checklistData.thigh_circumference} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Mid-thigh Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(78)} />
                                                </Form.Group>
                                                <Form.Control name="mid_thigh_circumference" onChange={handleChange} placeholder="" value={checklistData.mid_thigh_circumference} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Knee Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(79)} />
                                                </Form.Group>
                                                <Form.Control name="knee_circumference" onChange={handleChange} placeholder="" value={checklistData.knee_circumference} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Calf Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(80)} />
                                                </Form.Group>
                                                <Form.Control name="calf_circumference" onChange={handleChange} placeholder="" value={checklistData.calf_circumference} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Ankle Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(81)} />
                                                </Form.Group>
                                                <Form.Control name="ankle_circumference" onChange={handleChange} placeholder="" value={checklistData.ankle_circumference} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Ankle-Heel Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(82)} />
                                                </Form.Group>
                                                <Form.Control name="ankle_heel_circumference" onChange={handleChange} placeholder="" value={checklistData.ankle_heel_circumference} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Body Height </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(83)} />
                                                </Form.Group>
                                                <Form.Control name="body_height" onChange={handleChange} placeholder="" value={checklistData.body_height} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Body Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(84)} />
                                                </Form.Group>
                                                <Form.Control name="body_length" onChange={handleChange} placeholder="" value={checklistData.body_length} />
                                            </Form.Group>
                                        </Col>
                                    </>
                                    : user.gender == "Female" ?
                                        <>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Upper Neck Circumference </Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(1)} />
                                                    </Form.Group>
                                                    <Form.Control name="upper_neck_circumference" onChange={handleChange} placeholder="" value={checklistData.upper_neck_circumference} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Lower Neck Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(2)} />
                                                    </Form.Group>
                                                    <Form.Control name="lower_neck_circumference" onChange={handleChange} placeholder="" value={checklistData.lower_neck_circumference} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Chest Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(3)} />
                                                    </Form.Group>
                                                    <Form.Control name="chest_circumference" onChange={handleChange} placeholder="" value={checklistData.chest_circumference} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Bust Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(4)} />
                                                    </Form.Group>
                                                    <Form.Control name="bust_circumference" onChange={handleChange} placeholder="" value={checklistData.bust_circumference} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Under Bust Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(5)} />
                                                    </Form.Group>
                                                    <Form.Control name="under_bust_circumference" onChange={handleChange} placeholder="" value={checklistData.under_bust_circumference} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Waist Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(6)} />
                                                    </Form.Group>
                                                    <Form.Control name="waist_circumference" onChange={handleChange} placeholder="" value={checklistData.waist_circumference} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Mid Hip Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(7)} />
                                                    </Form.Group>
                                                    <Form.Control name="mid_hip_circumference" onChange={handleChange} placeholder="" value={checklistData.mid_hip_circumference} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Hip Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(8)} />
                                                    </Form.Group>
                                                    <Form.Control name="hip_circumference" onChange={handleChange} placeholder="" value={checklistData.hip_circumference} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Bust Distance</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(9)} />
                                                    </Form.Group>
                                                    <Form.Control name="bust_distance" onChange={handleChange} placeholder="" value={checklistData.bust_distance} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Front Chest Width</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(10)} />
                                                    </Form.Group>
                                                    <Form.Control name="front_chest_width" onChange={handleChange} placeholder="" value={checklistData.front_chest_width} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Back Chest Width</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(11)} />
                                                    </Form.Group>
                                                    <Form.Control name="back_chest_width" onChange={handleChange} placeholder="" value={checklistData.back_chest_width} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Front Waist Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(12)} />
                                                    </Form.Group>
                                                    <Form.Control name="front_waist_length" onChange={handleChange} placeholder="" value={checklistData.front_waist_length} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Back Waist Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(13)} />
                                                    </Form.Group>
                                                    <Form.Control name="back_waist_length" onChange={handleChange} placeholder="" value={checklistData.back_waist_length} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Center Front Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(14)} />
                                                    </Form.Group>
                                                    <Form.Control name="center_front_length" onChange={handleChange} placeholder="" value={checklistData.center_front_length} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Center Back Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(15)} />
                                                    </Form.Group>
                                                    <Form.Control name="center_back_length" onChange={handleChange} placeholder="" value={checklistData.center_back_length} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Front Neck Depth</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(16)} />
                                                    </Form.Group>
                                                    <Form.Control name="front_neck_depth" onChange={handleChange} placeholder="" value={checklistData.front_neck_depth} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Back Neck Depth</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(17)} />
                                                    </Form.Group>
                                                    <Form.Control name="back_neck_depth" onChange={handleChange} placeholder="" value={checklistData.back_neck_depth} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Bust Depth</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(18)} />
                                                    </Form.Group>
                                                    <Form.Control name="bust_depth" onChange={handleChange} placeholder="" value={checklistData.bust_depth} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Armhole Depth</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(19)} />
                                                    </Form.Group>
                                                    <Form.Control name="armhole_depth" onChange={handleChange} placeholder="" value={checklistData.armhole_depth} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Bust Height</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(20)} />
                                                    </Form.Group>
                                                    <Form.Control name="bust_height" onChange={handleChange} placeholder="" value={checklistData.bust_height} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Front Shoulder Width</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(21)} />
                                                    </Form.Group>
                                                    <Form.Control name="front_shoulder_width" onChange={handleChange} placeholder="" value={checklistData.front_shoulder_width} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Back Shoulder Width</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(22)} />
                                                    </Form.Group>
                                                    <Form.Control name="back_shoulder_width" onChange={handleChange} placeholder="" value={checklistData.back_shoulder_width} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Shoulder Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(23)} />
                                                    </Form.Group>
                                                    <Form.Control name="shoulder_length" onChange={handleChange} placeholder="" value={checklistData.shoulder_length} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Shoulder Depth</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(24)} />
                                                    </Form.Group>
                                                    <Form.Control name="shoulder_depth" onChange={handleChange} placeholder="" value={checklistData.shoulder_depth} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Elbow Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(25)} />
                                                    </Form.Group>
                                                    <Form.Control name="elbow_circumference" onChange={handleChange} placeholder="" value={checklistData.elbow_circumference} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Underarm Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(26)} />
                                                    </Form.Group>
                                                    <Form.Control name="underarm_length" onChange={handleChange} placeholder="" value={checklistData.underarm_length} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Sleeve Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(27)} />
                                                    </Form.Group>
                                                    <Form.Control name="sleeve_length" onChange={handleChange} placeholder="" value={checklistData.sleeve_length} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Arm Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(28)} />
                                                    </Form.Group>
                                                    <Form.Control name="arm_circumference" onChange={handleChange} placeholder="" value={checklistData.arm_circumference} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Wrist Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(29)} />
                                                    </Form.Group>
                                                    <Form.Control name="wrist_circumference" onChange={handleChange} placeholder="" value={checklistData.wrist_circumference} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Elbow Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(30)} />
                                                    </Form.Group>
                                                    <Form.Control name="elbow_length" onChange={handleChange} placeholder="" value={checklistData.elbow_length} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Armhole Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(31)} />
                                                    </Form.Group>
                                                    <Form.Control name="armhole_circumference" onChange={handleChange} placeholder="" value={checklistData.armhole_circumference} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Sleeve Cap Height</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(32)} />
                                                    </Form.Group>
                                                    <Form.Control name="sleeve_cap_height" onChange={handleChange} placeholder="" value={checklistData.sleeve_cap_height} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Hip Depth</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(33)} />
                                                    </Form.Group>
                                                    <Form.Control name="hip_depth" onChange={handleChange} placeholder="" value={checklistData.hip_depth} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Crotch Depth</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(34)} />
                                                    </Form.Group>
                                                    <Form.Control name="crotch_depth" onChange={handleChange} placeholder="" value={checklistData.crotch_depth} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Crotch Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(35)} />
                                                    </Form.Group>
                                                    <Form.Control name="crotch_length" onChange={handleChange} placeholder="" value={checklistData.crotch_length} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Pants Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(36)} />
                                                    </Form.Group>
                                                    <Form.Control name="pants_length" onChange={handleChange} placeholder="" value={checklistData.pants_length} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Knee Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(37)} />
                                                    </Form.Group>
                                                    <Form.Control name="knee_length" onChange={handleChange} placeholder="" value={checklistData.knee_length} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>In seam Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(38)} />
                                                    </Form.Group>
                                                    <Form.Control name="in_seam_length" onChange={handleChange} placeholder="" value={checklistData.in_seam_length} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Thigh Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(39)} />
                                                    </Form.Group>
                                                    <Form.Control name="thigh_circumference" onChange={handleChange} placeholder="" value={checklistData.thigh_circumference} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Mid Thigh Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(40)} />
                                                    </Form.Group>
                                                    <Form.Control name="mid_thigh_circumference" onChange={handleChange} placeholder="" value={checklistData.mid_thigh_circumference} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Knee Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(41)} />
                                                    </Form.Group>
                                                    <Form.Control name="knee_circumference" onChange={handleChange} placeholder="" value={checklistData.knee_circumference} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Calf Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(42)} />
                                                    </Form.Group>
                                                    <Form.Control name="calf_circumference" onChange={handleChange} placeholder="" value={checklistData.calf_circumference} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Ankle Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(43)} />
                                                    </Form.Group>
                                                    <Form.Control name="ankle_circumference" onChange={handleChange} placeholder="" value={checklistData.ankle_circumference} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Ankle Heel Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(44)} />
                                                    </Form.Group>
                                                    <Form.Control name="ankle_heel_circumference" onChange={handleChange} placeholder="" value={checklistData.ankle_heel_circumference} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Body Height</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(45)} />
                                                    </Form.Group>
                                                    <Form.Control name="body_height" onChange={handleChange} placeholder="" value={checklistData.body_height} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Body Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(46)} />
                                                    </Form.Group>
                                                    <Form.Control name="body_length" onChange={handleChange} placeholder="" value={checklistData.body_length} />
                                                </Form.Group>
                                            </Col>
                                        </>
                                        :
                                        <>
                                            <Form.Group as={Col} lg={2} md={2} sm={2}>
                                                <Form.Check
                                                    className="cursor-pointer"
                                                    type="radio"
                                                    label="Male"
                                                    name="gender"
                                                    value="Male"
                                                    checked={user.gender === 'Male'}
                                                    onChange={handleChangeGender}
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={2} md={2} sm={2}>
                                                <Form.Check
                                                    className="cursor-pointer"
                                                    type="radio"
                                                    label="Female"
                                                    name="gender"
                                                    value="Female"
                                                    checked={user.gender === 'Female'}
                                                    onChange={handleChangeGender}
                                                />
                                            </Form.Group>
                                        </>
                                }
                            </Row>
                        </Card.Body>
                    </Card>
                </Modal.Body>

                <ModalFooter className='border-none pt-0'>
                    <div className='text-right'>
                        <button
                            className="btn btn-secondary border-black bg-white text-black btn-style"
                            onClick={() => { setUploadMeasurementModalShow(false); setChecklistData(bodyMeasurement); }}
                            type="button">
                            Close
                        </button>
                        {updateChecklistLoading ?
                            <button className="btn btn-primary btn-style ms-3" type="button">Saving...</button>
                            :
                            <button className="btn btn-primary ms-3 btn-style" type="button" onClick={updateChecklist}>Save</button>
                        }
                    </div>
                </ModalFooter>
            </Modal>

            <Modal
                show={measurementModalShow}
                className='modal-preview'
                fade={false}
                centered
                size="lg"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-left rufina-family fs-22 mt-3'>Body Measurement</h5>
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={() => setMeasurementModalShow(false)}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>
                </Modal.Header>
                {/* <Modal.Body>
                    <Card>
                        <Card.Body className="text-left">
                            <p className="fs-16 mb-0 text-black">{appointment.measurement_description}</p>
                        </Card.Body>
                    </Card>
                </Modal.Body> */}

                <Modal.Body>
                    <Card>
                        <Card.Body className="text-left">
                            <Row>
                                {user.gender == "Male" ?
                                    <>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Upper Neck Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(47)} />
                                                </Form.Group>
                                                <Form.Control name="upper_neck_circumference" onChange={handleChange} placeholder="" value={checklistData.upper_neck_circumference} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Lower Neck Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(48)} />
                                                </Form.Group>
                                                <Form.Control name="lower_neck_circumference" onChange={handleChange} placeholder="" value={checklistData.lower_neck_circumference} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Chest Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(49)} />
                                                </Form.Group>
                                                <Form.Control name="chest_circumference" onChange={handleChange} placeholder="" value={checklistData.chest_circumference} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Waist Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(50)} />
                                                </Form.Group>
                                                <Form.Control name="waist_circumference" onChange={handleChange} placeholder="" value={checklistData.waist_circumference} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Mid Hip Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(51)} />
                                                </Form.Group>
                                                <Form.Control name="mid_hip_circumference" onChange={handleChange} placeholder="" value={checklistData.mid_hip_circumference} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Hip Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(52)} />
                                                </Form.Group>
                                                <Form.Control name="hip_circumference" onChange={handleChange} placeholder="" value={checklistData.hip_circumference} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Front Waist Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(53)} />
                                                </Form.Group>
                                                <Form.Control name="front_waist_length" onChange={handleChange} placeholder="" value={checklistData.front_waist_length} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Back Waist Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(54)} />
                                                </Form.Group>
                                                <Form.Control name="back_waist_length" onChange={handleChange} placeholder="" value={checklistData.back_waist_length} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Center Front Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(55)} />
                                                </Form.Group>
                                                <Form.Control name="center_front_length" onChange={handleChange} placeholder="" value={checklistData.center_front_length} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Center Back Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(56)} />
                                                </Form.Group>
                                                <Form.Control name="center_back_length" onChange={handleChange} placeholder="" value={checklistData.center_back_length} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Front Neck Depth </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(57)} />
                                                </Form.Group>
                                                <Form.Control name="front_neck_depth" onChange={handleChange} placeholder="" value={checklistData.front_neck_depth} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Back Neck Depth </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(58)} />
                                                </Form.Group>
                                                <Form.Control name="back_neck_depth" onChange={handleChange} placeholder="" value={checklistData.back_neck_depth} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Armhole Depth </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(59)} />
                                                </Form.Group>
                                                <Form.Control name="armhole_depth" onChange={handleChange} placeholder="" value={checklistData.armhole_depth} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Front Shoulder Width </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(60)} />
                                                </Form.Group>
                                                <Form.Control name="front_shoulder_width" onChange={handleChange} placeholder="" value={checklistData.front_shoulder_width} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Back Shoulder Width </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(61)} />
                                                </Form.Group>
                                                <Form.Control name="back_shoulder_width" onChange={handleChange} placeholder="" value={checklistData.back_shoulder_width} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Shoulder Depth </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(62)} />
                                                </Form.Group>
                                                <Form.Control name="shoulder_depth" onChange={handleChange} placeholder="" value={checklistData.shoulder_depth} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Elbow Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(63)} />
                                                </Form.Group>
                                                <Form.Control name="elbow_circumference" onChange={handleChange} placeholder="" value={checklistData.elbow_circumference} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Underarm Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(64)} />
                                                </Form.Group>
                                                <Form.Control name="underarm_length" onChange={handleChange} placeholder="" value={checklistData.underarm_length} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Side Seam </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(65)} />
                                                </Form.Group>
                                                <Form.Control name="side_seam" onChange={handleChange} placeholder="" value={checklistData.side_seam} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Sleeve Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(66)} />
                                                </Form.Group>
                                                <Form.Control name="sleeve_length" onChange={handleChange} placeholder="" value={checklistData.sleeve_length} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Arm Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(67)} />
                                                </Form.Group>
                                                <Form.Control name="arm_circumference" onChange={handleChange} placeholder="" value={checklistData.arm_circumference} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Wrist Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(68)} />
                                                </Form.Group>
                                                <Form.Control name="wrist_circumference" onChange={handleChange} placeholder="" value={checklistData.wrist_circumference} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Elbow Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(69)} />
                                                </Form.Group>
                                                <Form.Control name="elbow_length" onChange={handleChange} placeholder="" value={checklistData.elbow_length} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Armhole Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(70)} />
                                                </Form.Group>
                                                <Form.Control name="armhole_circumference" onChange={handleChange} placeholder="" value={checklistData.armhole_circumference} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Sleeve Cap Height </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(71)} />
                                                </Form.Group>
                                                <Form.Control name="sleeve_cap_height" onChange={handleChange} placeholder="" value={checklistData.sleeve_cap_height} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Hip Depth </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(72)} />
                                                </Form.Group>
                                                <Form.Control name="hip_depth" onChange={handleChange} placeholder="" value={checklistData.hip_depth} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Crotch Depth </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(73)} />
                                                </Form.Group>
                                                <Form.Control name="crotch_depth" onChange={handleChange} placeholder="" value={checklistData.crotch_depth} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Pants/Trouser Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(74)} />
                                                </Form.Group>
                                                <Form.Control name="pants_trouser_length" onChange={handleChange} placeholder="" value={checklistData.pants_trouser_length} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Knee Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(75)} />
                                                </Form.Group>
                                                <Form.Control name="knee_length" onChange={handleChange} placeholder="" value={checklistData.knee_length} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>In Seam Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(76)} />
                                                </Form.Group>
                                                <Form.Control name="in_seam_length" onChange={handleChange} placeholder="" value={checklistData.in_seam_length} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Thigh Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(77)} />
                                                </Form.Group>
                                                <Form.Control name="thigh_circumference" onChange={handleChange} placeholder="" value={checklistData.thigh_circumference} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Mid-thigh Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(78)} />
                                                </Form.Group>
                                                <Form.Control name="mid_thigh_circumference" onChange={handleChange} placeholder="" value={checklistData.mid_thigh_circumference} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Knee Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(79)} />
                                                </Form.Group>
                                                <Form.Control name="knee_circumference" onChange={handleChange} placeholder="" value={checklistData.knee_circumference} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Calf Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(80)} />
                                                </Form.Group>
                                                <Form.Control name="calf_circumference" onChange={handleChange} placeholder="" value={checklistData.calf_circumference} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Ankle Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(81)} />
                                                </Form.Group>
                                                <Form.Control name="ankle_circumference" onChange={handleChange} placeholder="" value={checklistData.ankle_circumference} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Ankle-Heel Circumference </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(82)} />
                                                </Form.Group>
                                                <Form.Control name="ankle_heel_circumference" onChange={handleChange} placeholder="" value={checklistData.ankle_heel_circumference} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Body Height </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(83)} />
                                                </Form.Group>
                                                <Form.Control name="body_height" onChange={handleChange} placeholder="" value={checklistData.body_height} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Body Length </Form.Label>
                                                    <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(84)} />
                                                </Form.Group>
                                                <Form.Control name="body_length" onChange={handleChange} placeholder="" value={checklistData.body_length} disabled />
                                            </Form.Group>
                                        </Col>
                                    </>
                                    : user.gender == "Female" ?
                                        <>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Upper Neck Circumference </Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(1)} />
                                                    </Form.Group>
                                                    <Form.Control name="upper_neck_circumference" onChange={handleChange} placeholder="" value={checklistData.upper_neck_circumference} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Lower Neck Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(2)} />
                                                    </Form.Group>
                                                    <Form.Control name="lower_neck_circumference" onChange={handleChange} placeholder="" value={checklistData.lower_neck_circumference} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Chest Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(3)} />
                                                    </Form.Group>
                                                    <Form.Control name="chest_circumference" onChange={handleChange} placeholder="" value={checklistData.chest_circumference} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Bust Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(4)} />
                                                    </Form.Group>
                                                    <Form.Control name="bust_circumference" onChange={handleChange} placeholder="" value={checklistData.bust_circumference} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Under Bust Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(5)} />
                                                    </Form.Group>
                                                    <Form.Control name="under_bust_circumference" onChange={handleChange} placeholder="" value={checklistData.under_bust_circumference} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Waist Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(6)} />
                                                    </Form.Group>
                                                    <Form.Control name="waist_circumference" onChange={handleChange} placeholder="" value={checklistData.waist_circumference} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Mid Hip Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(7)} />
                                                    </Form.Group>
                                                    <Form.Control name="mid_hip_circumference" onChange={handleChange} placeholder="" value={checklistData.mid_hip_circumference} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Hip Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(8)} />
                                                    </Form.Group>
                                                    <Form.Control name="hip_circumference" onChange={handleChange} placeholder="" value={checklistData.hip_circumference} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Bust Distance</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(9)} />
                                                    </Form.Group>
                                                    <Form.Control name="bust_distance" onChange={handleChange} placeholder="" value={checklistData.bust_distance} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Front Chest Width</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(10)} />
                                                    </Form.Group>
                                                    <Form.Control name="front_chest_width" onChange={handleChange} placeholder="" value={checklistData.front_chest_width} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Back Chest Width</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(11)} />
                                                    </Form.Group>
                                                    <Form.Control name="back_chest_width" onChange={handleChange} placeholder="" value={checklistData.back_chest_width} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Front Waist Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(12)} />
                                                    </Form.Group>
                                                    <Form.Control name="front_waist_length" onChange={handleChange} placeholder="" value={checklistData.front_waist_length} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Back Waist Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(13)} />
                                                    </Form.Group>
                                                    <Form.Control name="back_waist_length" onChange={handleChange} placeholder="" value={checklistData.back_waist_length} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Center Front Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(14)} />
                                                    </Form.Group>
                                                    <Form.Control name="center_front_length" onChange={handleChange} placeholder="" value={checklistData.center_front_length} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Center Back Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(15)} />
                                                    </Form.Group>
                                                    <Form.Control name="center_back_length" onChange={handleChange} placeholder="" value={checklistData.center_back_length} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Front Neck Depth</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(16)} />
                                                    </Form.Group>
                                                    <Form.Control name="front_neck_depth" onChange={handleChange} placeholder="" value={checklistData.front_neck_depth} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Back Neck Depth</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(17)} />
                                                    </Form.Group>
                                                    <Form.Control name="back_neck_depth" onChange={handleChange} placeholder="" value={checklistData.back_neck_depth} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Bust Depth</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(18)} />
                                                    </Form.Group>
                                                    <Form.Control name="bust_depth" onChange={handleChange} placeholder="" value={checklistData.bust_depth} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Armhole Depth</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(19)} />
                                                    </Form.Group>
                                                    <Form.Control name="armhole_depth" onChange={handleChange} placeholder="" value={checklistData.armhole_depth} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Bust Height</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(20)} />
                                                    </Form.Group>
                                                    <Form.Control name="bust_height" onChange={handleChange} placeholder="" value={checklistData.bust_height} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Front Shoulder Width</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(21)} />
                                                    </Form.Group>
                                                    <Form.Control name="front_shoulder_width" onChange={handleChange} placeholder="" value={checklistData.front_shoulder_width} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Back Shoulder Width</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(22)} />
                                                    </Form.Group>
                                                    <Form.Control name="back_shoulder_width" onChange={handleChange} placeholder="" value={checklistData.back_shoulder_width} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Shoulder Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(23)} />
                                                    </Form.Group>
                                                    <Form.Control name="shoulder_length" onChange={handleChange} placeholder="" value={checklistData.shoulder_length} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Shoulder Depth</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(24)} />
                                                    </Form.Group>
                                                    <Form.Control name="shoulder_depth" onChange={handleChange} placeholder="" value={checklistData.shoulder_depth} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Elbow Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(25)} />
                                                    </Form.Group>
                                                    <Form.Control name="elbow_circumference" onChange={handleChange} placeholder="" value={checklistData.elbow_circumference} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Underarm Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(26)} />
                                                    </Form.Group>
                                                    <Form.Control name="underarm_length" onChange={handleChange} placeholder="" value={checklistData.underarm_length} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Sleeve Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(27)} />
                                                    </Form.Group>
                                                    <Form.Control name="sleeve_length" onChange={handleChange} placeholder="" value={checklistData.sleeve_length} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Arm Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(28)} />
                                                    </Form.Group>
                                                    <Form.Control name="arm_circumference" onChange={handleChange} placeholder="" value={checklistData.arm_circumference} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Wrist Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(29)} />
                                                    </Form.Group>
                                                    <Form.Control name="wrist_circumference" onChange={handleChange} placeholder="" value={checklistData.wrist_circumference} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Elbow Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(30)} />
                                                    </Form.Group>
                                                    <Form.Control name="elbow_length" onChange={handleChange} placeholder="" value={checklistData.elbow_length} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Armhole Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(31)} />
                                                    </Form.Group>
                                                    <Form.Control name="armhole_circumference" onChange={handleChange} placeholder="" value={checklistData.armhole_circumference} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Sleeve Cap Height</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(32)} />
                                                    </Form.Group>
                                                    <Form.Control name="sleeve_cap_height" onChange={handleChange} placeholder="" value={checklistData.sleeve_cap_height} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Hip Depth</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(33)} />
                                                    </Form.Group>
                                                    <Form.Control name="hip_depth" onChange={handleChange} placeholder="" value={checklistData.hip_depth} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Crotch Depth</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(34)} />
                                                    </Form.Group>
                                                    <Form.Control name="crotch_depth" onChange={handleChange} placeholder="" value={checklistData.crotch_depth} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Crotch Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(35)} />
                                                    </Form.Group>
                                                    <Form.Control name="crotch_length" onChange={handleChange} placeholder="" value={checklistData.crotch_length} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Pants Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(36)} />
                                                    </Form.Group>
                                                    <Form.Control name="pants_length" onChange={handleChange} placeholder="" value={checklistData.pants_length} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Knee Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(37)} />
                                                    </Form.Group>
                                                    <Form.Control name="knee_length" onChange={handleChange} placeholder="" value={checklistData.knee_length} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>In seam Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(38)} />
                                                    </Form.Group>
                                                    <Form.Control name="in_seam_length" onChange={handleChange} placeholder="" value={checklistData.in_seam_length} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Thigh Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(39)} />
                                                    </Form.Group>
                                                    <Form.Control name="thigh_circumference" onChange={handleChange} placeholder="" value={checklistData.thigh_circumference} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Mid Thigh Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(40)} />
                                                    </Form.Group>
                                                    <Form.Control name="mid_thigh_circumference" onChange={handleChange} placeholder="" value={checklistData.mid_thigh_circumference} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Knee Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(41)} />
                                                    </Form.Group>
                                                    <Form.Control name="knee_circumference" onChange={handleChange} placeholder="" value={checklistData.knee_circumference} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Calf Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(42)} />
                                                    </Form.Group>
                                                    <Form.Control name="calf_circumference" onChange={handleChange} placeholder="" value={checklistData.calf_circumference} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Ankle Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(43)} disabled />
                                                    </Form.Group>
                                                    <Form.Control name="ankle_circumference" onChange={handleChange} placeholder="" value={checklistData.ankle_circumference} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Ankle Heel Circumference</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(44)} />
                                                    </Form.Group>
                                                    <Form.Control name="ankle_heel_circumference" onChange={handleChange} placeholder="" value={checklistData.ankle_heel_circumference} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Body Height</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(45)} />
                                                    </Form.Group>
                                                    <Form.Control name="body_height" onChange={handleChange} placeholder="" value={checklistData.body_height} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Body Length</Form.Label>
                                                        <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(46)} />
                                                    </Form.Group>
                                                    <Form.Control name="body_length" onChange={handleChange} placeholder="" value={checklistData.body_length} disabled />
                                                </Form.Group>
                                            </Col>
                                        </>
                                        : <span>No records found.</span>}
                            </Row>
                        </Card.Body>
                    </Card>
                </Modal.Body>

                <ModalFooter className='border-none pt-0'>
                    <div className='text-right'>
                        <button
                            className="btn btn-secondary border-black bg-white text-black btn-style"
                            onClick={() => setMeasurementModalShow(false)}
                            type="button">
                            Close
                        </button>
                    </div>
                </ModalFooter>
            </Modal>

            <Modal
                show={measurementGuideModalShow}
                className='modal-preview measurement-guide-modal'
                fade={false}
                centered
                size="lg"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-left rufina-family fs-22 mt-3'>Measurement Description</h5>
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={() => setMeasurementGuideModalShow(false)}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body className="text-left">
                            <Row>
                                <Col lg={12}>
                                    <div>
                                        <p dangerouslySetInnerHTML={{ __html: measurementGuideDescription }} className="fs-16 mb-2 text-black" />
                                        <img src={measurementGuideImage} className="measurement-image" />
                                    </div>
                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>
                </Modal.Body>

                <ModalFooter className='border-none pt-0'>
                    <div className='text-right'>
                        <button
                            className="btn btn-secondary border-black bg-white text-black btn-style"
                            onClick={() => setMeasurementGuideModalShow(false)}
                            type="button">
                            Close
                        </button>
                    </div>
                </ModalFooter>
            </Modal>

            <Modal
                show={endMeetingModal}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-left rufina-family fs-22 mt-3'>End Meeting</h5>
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={() => setEndMeetingModal(false)}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body className="text-left">
                            <p className="fs-16 mb-0 text-black">Are you sure you want to end this meeting?</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>

                <ModalFooter className='border-none pt-0'>
                    <div className='text-right'>
                        <button
                            className="btn btn-secondary border-black bg-white text-black btn-style"
                            onClick={() => setEndMeetingModal(false)}
                            type="button">
                            Cancel
                        </button>

                        {endMeetingLoading ?
                            <button className="btn btn-primary btn-style ms-3" type="button">Ending Meeting...</button>
                            :
                            <button className="btn btn-primary ms-3 btn-style" type="button" onClick={endMeetingSubmit}>End Meeting</button>
                        }
                    </div>
                </ModalFooter>
            </Modal>
        </Layout >
    );
};

export default VideoConferencing;