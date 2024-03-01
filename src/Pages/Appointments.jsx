import React, { useEffect, useState } from 'react';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card, ModalFooter, ModalHeader } from 'react-bootstrap';
import '../Assets/styles/DesignerCalendar/style.css'
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
import { GoAlertFill } from 'react-icons/go';
import '../Assets/styles/Appointments/style.css';
import { useParams } from 'react-router-dom';
import { VscSend } from "react-icons/vsc";
import LoadingPage from 'Components/Shared/LoadingPage';
import { IoMdVideocam, IoIosAttach } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { BiSolidPencil } from "react-icons/bi";
import UserPlaceholder from '../Assets/images/user.png';
import InputEmoji from 'react-input-emoji';
import { AiFillMessage } from "react-icons/ai";
import axios from "axios";
import toast from 'react-hot-toast';

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
    email: '',
    first_name: '',
    last_name: '',
    timezone: '',
    consultation_details: '',
}

const initialAppointments = {
    consultation_date_time: '',
    consultation_hour_start: '',
    consultation_hour_end: '',
    email: '',
    first_name: '',
    last_name: '',
    timezone: '',
    consultation_details: '',
};

const Appointments = (props) => {
    const { designerId } = useParams();
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUserDetails = cookies.userDetails;
    const currentUser = cookies.currentUser;
    const [reloadCount, setReloadCount] = useState(0);
    const [chatBox, setChatBox] = useState(false);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [nameDesigner, setNameDesigner] = useState('');
    const [text, setText] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [appointmentEditModal, setAppointmentEditModal] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    const [appointmentLoading, setAppointmentLoading] = useState(true);

    const [appointmentId, setAppointmentId] = useState('');
    const [times, setTimes] = useState([initialAppointments]);
    const [currentTimezone, setCurrentTimezone] = useState(null);

    const [consultationFormData, setConsultationFormData] = useState(intitialConsultationData);

    const getAppointments = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '/appointment');
    };

    const putReschedule = async (data) => {
        return await axios.put(process.env.REACT_APP_API_ENDPOINT + 'designer/appointment/' + appointmentId, data);
    };

    // const handleChangeConsultation = (e) => {
    //     const { name, value } = e.target;
    //     setConsultationFormData({
    //         ...consultationFormData,
    //         [name]: value,
    //     });
    // }

    const handleChangeConsultation = (e) => {
        const { name, value } = e.target;

        // Set the form data for fields other than date and time
        if (name !== 'consultation_date_time' && name !== 'consultation_hour_start') {
            setConsultationFormData({
                ...consultationFormData,
                [name]: value,
            });
            return; // Exit the function for non-date and non-time fields
        }

        // If the changed field is consultation_date_time or consultation_hour_start, convert them to ISO
        const date = name === 'consultation_date_time' ? value : consultationFormData.consultation_date_time;
        const time = name === 'consultation_hour_start' ? value : consultationFormData.consultation_hour_start;

        // Combine date and time and create a new Date object
        const combinedDateTimeString = `${date}T${time}:00`;
        const isoDateTime = new Date(combinedDateTimeString).toISOString();

        // Update the consultation_date_time field directly with the ISO formatted datetime
        setConsultationFormData(prevState => ({
            ...prevState,
            consultation_date_time: isoDateTime
        }));

        console.log("consultationFormData", consultationFormData);
    }


    const editAppointmentModal = (id) => {
        setAppointmentId(id)
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'appointment/' + id).then(response => {
            const result = response.data.data;
            setConsultationFormData(result);
        })
        setAppointmentEditModal(true);
    }

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    function handleOnEnter(text) {
        console.log('enter', text)
    }

    function toggleChatbox(first_name, last_name, image, message) {
        setChatBox(true);
        setNameDesigner({
            first_name: first_name ?? '-',
            last_name: last_name ?? '-',
            image: image ?? '-'
        });
        setModalHeading(message);
    }

    const editScheduleSubmit = (e) => {
        setSaveLoading(true);
        e.preventDefault();
        setAppointmentId();
        putReschedule({ ...consultationFormData }).then(response => {
            const success = response.data.status;
            if (success == success) {
                setConsultationFormData(consultationFormData);
                setAppointmentEditModal(false);
                setReloadCount(reloadCount + 1);
                toast.success('Schedule updated successfully!');
                setSaveLoading(false);
            } else {
                toast.error('There has been an error editing the schedule, please try again!');
                setSaveLoading(false);
            }
        }).catch(() => {
            toast.error('There has been an error editing the schedule, please try again!');
            setSaveLoading(false);
        });
    }

    const convertDate = (inputDate) => {
        const date = new Date(inputDate);
        const year = date.getUTCFullYear();
        const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
        const day = ('0' + date.getUTCDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };
    useEffect(() => {
        document.body.classList.add('designer-calendar-body');
    }, []);



    useEffect(() => {
        if (currentUser) {
            getAppointments()
                .then((response) => {
                    setAppointmentLoading(false);
                    const selectedAppointments = response.data.data;
                    if (selectedAppointments) {
                        setAppointments(selectedAppointments);
                    } else {
                        toast.error('There has been an error getting the user, please try again!');
                    }
                })
                .catch((error) => {
                    toast.error('There has been an error getting the user, please try again!');
                });
        }
    },
        [reloadCount]);

    useEffect(() => {
        const getTimezone = () => {
            const timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
            setCurrentTimezone(timezone);
        };
        getTimezone();
    }, []);
    const consultationDateTimeString = "2024-02-22T16:11:00.000Z";
    const consultationDateTime = new Date(consultationDateTimeString);

    const formattedDate = consultationDateTime.toLocaleDateString(); // Formats date as per user's locale
    const formattedTime = consultationDateTime.toLocaleTimeString();

    console.log("Convert Date", convertDate(consultationDateTimeString));

    return (
        <LayoutNoFooter>
            {appointmentLoading ?
                <LoadingPage />
                :
                <>
                    <section>
                        <Container className='top-bottom'>
                            <Row>
                                <Col lg={12}>
                                    <Row className="pb-4">
                                        <Col md={6} className='d-flex justify-content-left align-items-center'>
                                            <h3 className="fs-30 fw-600 text-black mb-0">Appointments</h3>
                                        </Col>
                                        <Col md={6} className="text-right">
                                            <GoBack fallBack="/#" />
                                        </Col>
                                    </Row>
                                </Col>

                                <Col lg={12}>
                                    <Card>
                                        <Card.Body className='bg-light'>
                                            <Row>
                                                <Col lg={4}>
                                                    <span className='fw-500'>Fashion Designer</span>
                                                </Col>

                                                <Col lg={4}>
                                                    <span className='fw-500'>Appointment Date & Time</span>
                                                </Col>

                                                <Col lg={2}>
                                                    <span className='fw-500'>Status</span>
                                                </Col>

                                                <Col lg={2}>

                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <>
                                    {appointments ?
                                        <>
                                            {appointments.length > 0 ?
                                                <>
                                                    {appointments.map((appointment) => {

                                                        const options = {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        };
                                                        const today = (new Date(appointment.created_at)).toLocaleDateString('en-ES', options);
                                                        const formattedDate = (new Date(appointment.consultation_date_time)).toLocaleString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: 'numeric',
                                                            minute: 'numeric',
                                                            timeZone: 'UTC',
                                                        });

                                                        return (
                                                            <Col lg={12}>
                                                                <Card className='mt-3'>
                                                                    <Card.Body >
                                                                        <Row className="align-items-center">
                                                                            <Col lg={4}>
                                                                                <div className='d-flex appointment-user-image'>
                                                                                    {appointment.designer?.image != '' && appointment.designer?.image != null ? (
                                                                                        <div
                                                                                            className='user-photo-appointment'
                                                                                            style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${appointment.designer?.image})` }}
                                                                                        >
                                                                                        </div>
                                                                                    ) : (
                                                                                        <img src={UserPlaceholder} className='placeholder-img' alt="User Placeholder" />
                                                                                    )}

                                                                                    <div>
                                                                                        <span className='d-flex ms-3 mt-0 mb-1 fs-18 text-black'>
                                                                                            {appointment.designer?.first_name}
                                                                                            &nbsp;
                                                                                            {appointment.designer?.last_name}
                                                                                        </span>
                                                                                        <div className='ms-3 fs-16 text-black'>
                                                                                            <span className='fw-600 me-1'>Created:</span>&nbsp;{today}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>

                                                                            <Col lg={4}>
                                                                                <span className='text-black'>{formattedDate}</span>
                                                                            </Col>

                                                                            <Col lg={2}>
                                                                                <span className='text-black'>{appointment.status}</span>
                                                                            </Col>

                                                                            <Col lg={2} className='d-flex justify-content-end'>

                                                                                <div className="cursor-pointer appointments-tooltip"
                                                                                    onClick={function () { editAppointmentModal(appointment.id) }}
                                                                                >
                                                                                    <span className="icon-tooltiptext fs-14">Edit</span>
                                                                                    <BiSolidPencil className='video-cam me-3' size={20} />
                                                                                </div>

                                                                                <div className="cursor-pointer appointments-tooltip" onClick={() => toggleUnderConstruction("Video call")}>
                                                                                    <span className="icon-tooltiptext fs-14">Video call</span>
                                                                                    <IoMdVideocam className='video-cam me-3' size={20} />
                                                                                </div>

                                                                                <div className="cursor-pointer appointments-tooltip"
                                                                                    onClick={function () { toggleChatbox(appointment.designer?.first_name, appointment.designer?.last_name, appointment.designer?.image, "Under Construction"); }}
                                                                                >
                                                                                    <span className="icon-tooltiptext fs-14">Message Designer</span>
                                                                                    <span><AiFillMessage className='video-cam' size={20} /></span>
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        );
                                                    })}

                                                </>
                                                :
                                                <>
                                                    <Col lg={12}>
                                                        <Card className='mt-3'>
                                                            <Card.Body>
                                                                <p className="text-center mb-0">No records found.</p>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                </>
                                            }
                                        </>
                                        :
                                        <>
                                            <Col lg={12}>
                                                <Card className='mt-3'>
                                                    <Card.Body>
                                                        <p className="text-center mb-0">No records found.</p>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </>
                                    }
                                </>
                            </Row>

                            {chatBox ?
                                <>
                                    <Card className='width-chat-card px-0'>
                                        <Card.Header className='header-chat bg-white'>
                                            <div className='d-flex justify-content-between'>
                                                <div className='d-flex align-items-center'>
                                                    <span className='fw-500'>{nameDesigner.first_name} {nameDesigner.last_name}</span>
                                                    {/* <span className='ms-2 active-now fs-14 fw-400'>Active Now</span> */}
                                                </div>
                                                <div className="cursor-pointer" onClick={() => setChatBox(false)}>
                                                    <IoCloseOutline color="#7e7e7e" size={25} />
                                                </div>
                                            </div>
                                        </Card.Header>
                                        <Card.Body >

                                            <p>No messages found.</p>

                                            <div>
                                                <InputEmoji
                                                    value={text}
                                                    onChange={setText}
                                                    cleanOnEnter
                                                    onEnter={handleOnEnter}
                                                    className="emoji-picker"
                                                />
                                                {/* <div className='cursor-pointer position-absolute attach-icon' onClick={() => toggleUnderConstruction("")}><IoIosAttach size={20} /></div> */}
                                                <div>
                                                    <div
                                                        className="cursor-pointer fw-500 position-absolute send-button"
                                                        onClick={() => { toggleUnderConstruction("Send Message"); setChatBox(false); }}
                                                    >
                                                        Send
                                                        <VscSend className='ms-1' />
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </>
                                :
                                null
                            }
                        </Container>
                    </section>
                </>
            }

            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button type='button' className='close react-modal-close' onClick={() => setUnderConstructionShow(false)} data-dismiss='modal' aria-label='Close'>
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
                show={appointmentEditModal}
                className='modal-preview'
                fade={false}
                centered
            >
                <div>
                    <ModalHeader className='pb-0'>
                        <button
                            type='button'
                            className='close react-modal-close'
                            onClick={() => setAppointmentEditModal(false)}
                            data-dismiss='modal' aria-label='Close'
                        >
                            <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                        </button>
                        <h5 className='modal-title text-left rufina-family fs-22' >Edit Schedule</h5>
                    </ModalHeader>

                    <Modal.Body className='bottom-padding'>
                        <Card>
                            <Card.Body className='pt-1 pb-1'>
                                <Row className='p-3'>
                                    <Col lg="12" className='mb-2 mt-0 text-left px-0'>
                                        <span className='title-appointment'>Details</span>
                                    </Col>

                                    <Col lg="12" className='px-0'>
                                        <input
                                            type="text"
                                            name="consultation_details"
                                            className='form-control'
                                            value={consultationFormData.consultation_details}
                                            onChange={handleChangeConsultation}
                                            required
                                        />
                                    </Col>

                                    <Col lg="8" className='px-0'>
                                        <Row>
                                            {times.map((time, index) => {
                                                // const formattedDate = (new Date(time.consultation_date_time)).toLocaleString('en-US', {
                                                //     year: 'numeric',
                                                //     month: 'long',
                                                //     day: 'numeric',
                                                //     hour: 'numeric',
                                                //     minute: 'numeric',
                                                //     timeZone: 'UTC',
                                                // });
                                                return (
                                                    <>
                                                        {times.length > 0 && (
                                                            <>
                                                                <Col md="5" className="pe-0 mt-3">
                                                                    <p className="hours-header mb-2 text-left">Starts at</p>
                                                                    <div className='mb-3'>
                                                                        <input
                                                                            type='time'
                                                                            name='consultation_hour_start'
                                                                            className='mr-sm-2 form-control-hours'
                                                                            value={consultationFormData?.consultation_hour_start}
                                                                            onChange={e => handleChangeConsultation(e, index)}
                                                                            required
                                                                        />
                                                                    </div>
                                                                </Col>

                                                                <Col md="5" className="pe-0 position-relative mt-3">
                                                                    <p className="hours-header mb-2 text-left">Ends at</p>

                                                                    <div className='mb-3'>
                                                                        <input
                                                                            type='time'
                                                                            name='consultation_hour_end'
                                                                            className='mr-sm-2 form-control-hours'
                                                                            value={consultationFormData?.consultation_hour_end}
                                                                            onChange={e => handleChangeConsultation(e, index)}
                                                                            required
                                                                        />
                                                                    </div>
                                                                </Col>

                                                                <Col lg="12" className="pe-0 position-relative">
                                                                    <p className="hours-header mb-2 text-left">Date and Time</p>
                                                                    <div className='mb-3'>
                                                                        <input
                                                                            type='date'
                                                                            name='consultation_date_time'
                                                                            className='form-control'
                                                                            value={convertDate(consultationFormData?.consultation_date_time)}
                                                                            // value={formattedDate + ', ' + formattedTime}
                                                                            onChange={e => handleChangeConsultation(e, index)}
                                                                            required
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </>
                                                        )}
                                                    </>
                                                );
                                            })}
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Modal.Body>

                    <ModalFooter className='border-none'>
                        <div className='text-right'>
                            <button
                                className="btn btn-secondary border-black bg-white text-black btn-style"
                                onClick={() => setAppointmentEditModal(false)}
                                type="button">
                                Cancel
                            </button>

                            {saveLoading ?
                                <button className="btn btn-primary btn-style ms-3" type="button" >Saving...</button>
                                :
                                <button className="btn btn-primary ms-3 btn-style" type="button" onClick={editScheduleSubmit}>Save</button>
                            }
                        </div>
                    </ModalFooter>
                </div>
            </Modal>
        </LayoutNoFooter >
    );
};

export default Appointments;