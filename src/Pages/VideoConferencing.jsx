import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Modal, ModalFooter } from 'react-bootstrap';
import Layout from 'Components/Layout/Layout';
import '../Assets/styles/EcoFriendly/style.css';
import '../Assets/styles/ConsultationMeeting/style.css';
import { useCookies } from 'react-cookie';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { HiMiniUsers } from "react-icons/hi2";
import GoBack from 'Components/Shared/GoBack';
import { FiUser, FiMonitor } from "react-icons/fi";
import { GoAlertFill } from 'react-icons/go';
import { IoCloseOutline } from "react-icons/io5";
import { ImPhoneHangUp } from "react-icons/im";
import { MdOutlineVideocam, MdOutlineVideocamOff, MdOutlineCalendarMonth } from 'react-icons/md';
import { BiDetail, BiSolidMessageDetail, BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import { VscSend } from "react-icons/vsc";
import { LuAlarmClock } from "react-icons/lu";
import { Helmet } from "react-helmet";
import toast from 'react-hot-toast';
import axios from 'axios';

import { BsPeopleFill, BsFillChatLeftTextFill } from 'react-icons/bs';
import { RiInformationLine } from 'react-icons/ri';

import { FaCrown } from 'react-icons/fa';
import MeetingChat from '../Components/Chat/MeetingChat';
import UserPlaceholder from 'Components/Elements/UserPlaceholder';
// import UserImage from 'components/Image/UserImage';


const ToastCss = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

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

const VideoConferencing = (props) => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const userDetails = cookies.userDetails;
    const { appointmentId } = useParams();
    const [appointment, setAppointment] = useState([]);
    const [appointmentLoading, setAppointmentLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);
    const [consultationFormData, setConsultationFormData] = useState(intitialConsultationData);
    const [chatShow, setChatShow] = useState(true);
    const [participantsShow, setParticipantsShow] = useState(false);
    const [agendaShow, setAgendaShow] = useState(false);
    const [isMicVisible, setMicVisible] = useState(false);
    const [isCameraVisible, setIsCameraVisible] = useState(false);
    const [isShareScreenVisible, setShareScreenVisible] = useState(false);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [endMeetingModal, setEndMeetingModal] = useState(false);
    const [endMeetingLoading, setEndMeetingLoading] = useState(false);
    const [modalHeading, setModalHeading] = useState('');

    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };
    let query = useQuery();
    const meeting_id = query.get("meeting_id");
    const video_call = query.get("video_call");

    let room = document.querySelector("whereby-embed");

    const getAppointment = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer/appointment/' + appointmentId);
    };

    const putSchedule = async (data) => {
        return await axios.put(process.env.REACT_APP_API_ENDPOINT + 'designer/appointment/' + appointmentId, data);
    };

    const toggleSaveAppointmentModal = () => {
        setEndMeetingModal(!endMeetingModal);
    }

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
    }

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    const shareScreen = () => {
        if (!isShareScreenVisible) {
            room.toggleScreenshare(true);
            setShareScreenVisible(true);
        } else {
            room.toggleScreenshare(false);
            setShareScreenVisible(false);
        }
    };

    const showTab = (tab) => {
        if (tab == "chat") {
            setChatShow(true);
            setParticipantsShow(false);
            setAgendaShow(false);

        } else if (tab === "participants") {
            setChatShow(false);
            setParticipantsShow(true);
            setAgendaShow(false);

        } else if (tab === "agenda") {
            setChatShow(false);
            setParticipantsShow(false);
            setAgendaShow(true);
        }
    };

    function returnFormattedDate(date) {
        const targetDate = new Date(date);
        const month = targetDate.toLocaleString('en-US', { month: 'long' });
        const day = targetDate.getDate();
        const year = targetDate.getFullYear();
        const formattedDate = `${month} ${day}, ${year}`;
        return formattedDate;
    }

    function returnFormattedTime(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const ampm = hours >= 12 ? ' PM' : ' AM';

        let formattedHours = hours % 12;
        formattedHours = formattedHours === 0 ? 12 : formattedHours;

        const formattedTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes}${ampm}`;
        return formattedTime;
    }

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

    useEffect(() => {
        if (currentUser) {
            getAppointment()
                .then((response) => {
                    setAppointmentLoading(false);
                    const selectedAppointment = response.data.data;
                    if (selectedAppointment) {
                        setAppointment(selectedAppointment);
                        setConsultationFormData(selectedAppointment);
                    } else {
                        toast.error('There has been an error getting the appointment, please try again!');
                        setAppointmentLoading(false);
                    }
                })
                .catch((error) => {
                    toast.error('There has been an error getting the appointment, please try again!');
                    setAppointmentLoading(false);
                });
        }
    },
        [reloadCount]);

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
                            <Row>
                                <Col md={12} className="text-right">
                                    <GoBack fallBack="/#" />
                                </Col>
                            </Row>
                            <Col lg="8">
                                <Card className="bordered-top-primary">
                                    <Card.Body>
                                        <Row>
                                            <Col lg="12">
                                                <div className='fw-600 fs-18'>Consultation Details</div>
                                                <hr />
                                            </Col>

                                            <Col lg="6">
                                                <div className='mt-1 mb-2'><MdOutlineCalendarMonth size="20" className='text-gold me-2 mb-1' />
                                                    <span className='fw-600 me-2'>Date:</span>
                                                    <span className='mt-1'>{returnFormattedDate(appointment?.consultation_date ?? '-')}</span>
                                                </div>
                                            </Col>

                                            <Col lg="6">
                                                <div className='mt-1 mb-2'><LuAlarmClock size="20" className='text-gold me-2 mb-1' />
                                                    <span className='fw-600 me-2'>Time:</span>
                                                    <span className='mt-1'>
                                                        {returnFormattedTime(appointment?.consultation_hour_start ?? '-') + ' - ' + returnFormattedTime(appointment?.consultation_hour_end ?? '-')}
                                                    </span>
                                                </div>
                                            </Col>

                                            <Col lg="12">
                                                <div className='mt-1'><FiUser size="20" className='text-gold me-2 mb-1' />
                                                    <span className='fw-600 me-2'>Customer:</span>
                                                    <span className='mt-1'>{appointment?.designer?.first_name}&nbsp;{appointment?.designer?.last_name}</span>
                                                </div>
                                            </Col>

                                            <Col lg="12">
                                                <Card className='mt-3'>
                                                    <Card.Body>
                                                        <div className='mt-1'><BiDetail size="20" className='text-gold me-2 mb-1' />
                                                            <span className='fw-600 me-2'>Details</span>
                                                            <div className='mt-3'>{appointment?.consultation_details}</div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            {/* <Col lg="12">
                                                <div className='mt-1'><BiDetail size="20" className='text-gold me-2 mb-1' />
                                                    <span className='fw-600 me-2'>Details:</span>
                                                    <span className='mt-1'>{appointment?.consultation_details}</span>
                                                </div>
                                            </Col> */}
                                        </Row>
                                    </Card.Body>
                                </Card>

                                <Card className='mt-3'>
                                    <Card.Body className='card-video'>
                                        <Row>
                                            <Col lg="12">
                                                {consultationFormData.role === "" ?
                                                    <>
                                                        <whereby-embed
                                                            minimal
                                                            room={
                                                                consultationFormData.host_url +
                                                                `& background=off & audio=off & topToolbar=off & video=on & bottomToolbar=off & skipMediaPermissionPrompt=off & precallReview=off & displayName=` + userDetails?.first_name + " " + userDetails?.last_name
                                                            }
                                                            style={{ height: '500px' }}
                                                        />
                                                    </>
                                                    :
                                                    <>
                                                        <whereby-embed
                                                            minimal
                                                            room={consultationFormData.participant_url +
                                                                "?background=off&audio=off&settingsButton=off&moreButton=off&topToolbar=off&video=on&bottomToolbar=off&skipMediaPermissionPrompt=off&precallReview=off&displayName=" + userDetails?.first_name + " " + userDetails?.last_name
                                                            }
                                                            style={{ height: '500px' }}
                                                        />
                                                    </>
                                                }
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                <Col lg="12" className='d-flex justify-content-center align-items-center mt-3'>
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
                                <Card>
                                    <Card.Body>
                                        {chatShow ?
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
                                            :
                                            null
                                        }


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
                                        {/* <div
                                            className={`cursor - pointer video - button meeting - tooltip tab - family mb - 3 fs - 16 ${agendaShow ? 'bg-gold-icon text-gold' : 'bg-gray-icon text-black'}`}
                                            onClick={function () { showTab("agenda"); }}
                                        >
                                            <span className="icon-tooltiptext fs-14">Agenda</span>
                                            <IoIosInformationCircleOutline className="text-white off-cam-icon" size={20} />
                                        </div>

                                        <div
                                            className={`cursor - pointer video - button meeting - tooltip tab - family mx - 3 mb - 3 fs - 16 ${participantsShow ? 'bg-gold-icon text-gold' : 'bg-gray-icon text-black'}`}
                                            onClick={function () { showTab("participants"); }}
                                        >
                                            <span className="icon-tooltiptext fs-14">Participants</span>
                                            <HiMiniUsers className="text-white off-cam-icon" size={20} />
                                        </div> */}

                                        {/* <div
                                            className={`cursor-pointer video-button meeting-tooltip ${chatShow ? 'bg-gold-icon text-gold' : 'bg-gray-icon text-black'}`}
                                            onClick={function () { showTab("chat"); }}
                                        >
                                            <span className="icon-tooltiptext fs-14">Message</span>
                                            <BiSolidMessageDetail className="text-white off-cam-icon" size={20} />
                                        </div> */}
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
                    <h4 className='fs-22 rufina-family mb-3'>{modalHeading}</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>
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
                            <button className="btn btn-primary btn-style ms-3" type="button">End Meeting...</button>
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