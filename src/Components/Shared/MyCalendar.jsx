import { Calendar, momentLocalizer, Views, DateLocalizer } from 'react-big-calendar';
import { Container, CardFooter, Input, Label, UncontrolledAccordion, AccordionItem, AccordionHeader, AccordionBody, CardBody, Button, Card, Col, Modal, Table, Row, Form, } from 'reactstrap';
import React, { useEffect, useState, useCallback } from 'react';
import { ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { PiPencilThin, PiTrashThin } from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { MdOutlinePlace } from "react-icons/md";
import FormControl from 'react-bootstrap/FormControl';
import { RxCross2 } from "react-icons/rx";
import { GoPlus } from "react-icons/go";
import moment from 'moment';
import { IoMdClose } from "react-icons/io";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import PropTypes from 'prop-types'
import '../../Assets/styles/DesignerCalendar/style.css';
import axios from "axios";
import toast from 'react-hot-toast';
import { FiCalendar } from "react-icons/fi";
import { LuGlobe2 } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";


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
const initialBusinessHours = {
    opens_at: '',
    closes_at: '',
    date: ''
};

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

const localizer = momentLocalizer(moment)

const MyCalendar = ({ toggleEvent, calendarAppointment }) => {

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUserDetails = cookies.userDetails;
    const currentUser = cookies.currentUser;
    const userDetails = cookies.userDetails;
    const { designerId } = useParams();

    const [events, setEvents] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [appointmentModalIsOpen, setAppointmentModalIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [reloadCount, setReloadCount] = useState(0);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState();
    const [formStatus, setFormStatus] = useState('standby');
    const [appointmentFormData, setAppointmentFormData] = useState(initialAppointments);
    const [times, setTimes] = useState([initialAppointments]);
    const [consultationFormData, setConsultationFormData] = useState(intitialConsultationData);
    const [currentTimezone, setCurrentTimezone] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);


    const postSetAppointment = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designerId + '/set/appointment', data);
    };

    const getSetAppointment = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designerId + '/set/appointment');
    };

    const getDesignerAppointment = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designerId + '/appointment');
    };


    const convertHoursToDatetime = (time, selectedDate) => {
        const [hours, minutes, period] = time.split(/[: ]/);

        // Convert hours to 24-hour format
        const hours24 = period === 'PM' ? parseInt(hours, 10) + 12 : parseInt(hours, 10);

        const resultDatetime = new Date(selectedDate);
        resultDatetime.setHours(hours24);
        resultDatetime.setMinutes(parseInt(minutes, 10));

        return resultDatetime.toISOString();
    };

    const handleSelectEvent = useCallback((event) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const formattedDateStart = new Intl.DateTimeFormat('en-US', options).format(event.start);
        const formattedDateEnd = new Intl.DateTimeFormat('en-US', options).format(event.end);
        setSelectedEvent({
            ...selectedEvent,
            title: event.title,
            start: formattedDateStart,
            end: formattedDateEnd,
            desc: event.desc,

        });
        setAppointmentModalIsOpen(true);
        console.log("formattedDateStart", formattedDateStart);
        console.log("formattedDateEnd", formattedDateEnd);

    }, []);

    const closeAppointmentModal = () => {
        setAppointmentModalIsOpen(false);
        setSelectedEvent(null);
    }

    const handleChangeConsultation = (e) => {
        const { name, value } = e.target;
        setConsultationFormData({
            ...consultationFormData,
            [name]: value,

            email: currentUserDetails.email,
            first_name: currentUserDetails.first_name,
            last_name: currentUserDetails.last_name,
            timezone: currentTimezone,
            consultation_date_time: selectedDate,
            consultation_details: 'Self added Appointment',

        });
    }

    const handleDateClick = ({ start }) => {
        setSelectedDate(start);
        setModalIsOpen(true);
    };

    const handleModalClose = () => {
        setModalIsOpen(false);
        setSelectedDate(null);
    };

    const handleAppointments = () => {
        setTimes(prevtimes => [
            ...prevtimes,
            initialAppointments
        ]);
    }

    const handleRemoveAppointment = (index) => {
        setTimes((prevtimes) => {
            const updatedTimes = [...prevtimes];
            updatedTimes.splice(index, 1);

            return updatedTimes;
        });
    }

    const addAppointmentSubmit = (e) => {
        e.preventDefault();
        setFormStatus('loading');
        postSetAppointment({ ...consultationFormData })
            .then(response => {
                const status = response.data.status;
                if (status === "Success") {
                    setFormStatus('standby');
                    setReloadCount(reloadCount + 1);
                    setConsultationFormData(intitialConsultationData);
                    toast.success('Appointment added successfully!');
                } else {
                    if (status == "Fail") {
                        const errors = response.data.errors;
                        if (errors && errors.length > 0) {
                            errors.map((error, index) => {
                                toast.error(error);
                                return null; // React requires a return value, so we return null here
                            })
                        }
                        setFormStatus('standby');
                    }
                }
            }).catch(() => {
                toast.error('There has been an error adding the appointment, please try again!');
            });
    }

    useEffect(() => {
        const getTimezone = () => {
            const timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
            setCurrentTimezone(timezone);
        };

        getTimezone();
    }, []);
    useEffect(() => {
        getDesignerAppointment().then((response) => {
            const appointments = response.data?.data;
            const status = response.data.status;
            console.log("appointments", appointments);
            console.log("status", status);
            if (status == "Fail") {
                const errors = response.data.errors;
                if (errors && errors.length > 0) {
                    errors.map((error, index) => {
                        toast.error(error);
                        return null; // React requires a return value, so we return null here
                    })
                }
            } else {
                if (appointments) {
                    const apiEventDataArray = [];
                    for (let i = 0; i < appointments.length; i++) {
                        const appointment = appointments[i];
                        const appointmentDateTime = appointment.consultation_date_time;
                        const appointmentStartIso = convertHoursToDatetime(appointment.consultation_hour_start, appointmentDateTime);
                        const appointmentEndIso = convertHoursToDatetime(appointment.consultation_hour_end, appointmentDateTime);
                        const eventData = {
                            id: appointment.id,
                            title: 'Appointment with ' + appointment.first_name + ' ' + appointment.last_name,
                            start: new Date(appointmentStartIso),
                            end: new Date(appointmentEndIso),
                            desc: appointment.consultation_details,
                        };
                        apiEventDataArray.push(eventData);
                    }
                    setEvents(apiEventDataArray);
                    // console.log("apiEventDataArray", apiEventDataArray);
                } else {
                    const errors = response.data.errors;
                    if (errors && errors.length > 0) {
                        errors.forEach((error) => {
                            toast.error(error);
                        });
                    } else {
                        toast.error('There has been an error getting the appointments, please try again!');
                    }
                }
            }
        }).catch((error) => {
            console.log(error);
            toast.error('There has been an error getting the appointments, please try again!');
        });

    }, [reloadCount]);

    return (
        <>
            <div>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectSlot={handleDateClick}
                    selectable
                    onSelectEvent={handleSelectEvent}
                />

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={handleModalClose}
                    contentLabel="Date Details"

                >
                    <div>
                        <ModalHeader>
                            <h5 className='modal-title text-left set-appointment'>Set Appointment</h5>
                            <button type='button' className='close react-appointment-close' onClick={handleModalClose} data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </ModalHeader>
                        <hr className="mt-0 mb-2" />

                        {selectedDate && (
                            <div>
                                <Row className='padding-modal pt-3 pb-3'>
                                    <Col lg="12" className='mb-2 mt-0 text-left'>
                                        <span className='title-appointment'>Title</span>
                                    </Col>

                                    <Col lg="12">
                                        <input
                                            type="text"
                                            name="title"
                                            className='form-control'
                                            value={consultationFormData.title}
                                            onChange={handleChangeConsultation}
                                        />
                                    </Col>

                                    <Col lg="8">
                                        <Row className="align-items-center mt-4">
                                            {times.map((time, index) => {
                                                return (
                                                    <>
                                                        {times.length > 0 && (
                                                            <>
                                                                {index > 0 && (
                                                                    <div className='w-75 ms-4 d-flex justify-content-end mt-3'>
                                                                        <div className='cursor-pointer' onClick={() => handleRemoveAppointment(index)}>
                                                                            <RxCross2 color='#000000' />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <Col md="5" className="pe-0">
                                                                    <p className="hours-header mb-2 text-left">Opens at</p>
                                                                    <div className='mb-3'>
                                                                        <input
                                                                            type='time'
                                                                            name='consultation_hour_start'
                                                                            className='mr-sm-2 form-control-hours'
                                                                            value={consultationFormData?.consultation_hour_start}
                                                                            onChange={e => handleChangeConsultation(e, index)}
                                                                        />
                                                                    </div>
                                                                </Col>

                                                                <Col md="5" className="pe-0">
                                                                    <p className="hours-header mb-2 text-left">Closes at</p>
                                                                    <div className='mb-3'>
                                                                        <input
                                                                            type='time'
                                                                            name='consultation_hour_end'
                                                                            className='mr-sm-2 form-control-hours'
                                                                            value={consultationFormData?.consultation_hour_end}
                                                                            onChange={e => handleChangeConsultation(e, index)}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </>
                                                        )}
                                                    </>
                                                );
                                            })}
                                            <Col md="2" className="px-0">
                                                <GoPlus
                                                    size={25}
                                                    className="plus-btn mt-2"
                                                    onClick={handleAppointments}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                        )}
                        <ModalFooter>
                            <div className='text-right'>
                                <Button className="cancel-btn me-2" onClick={handleModalClose}>Cancel</Button>
                                <Button className="btn-save"
                                    onClick={addAppointmentSubmit}
                                >Save</Button>
                            </div>
                        </ModalFooter>
                    </div>
                </Modal>

                <Modal
                    isOpen={appointmentModalIsOpen}
                    onRequestClose={closeAppointmentModal}
                    contentLabel="Appointment Details"

                >
                    <div>
                        <ModalHeader>
                            <h5 className='modal-title text-left set-appointment'>Appointment Details</h5>
                            <button type='button' className='close react-appointment-close' onClick={closeAppointmentModal} data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </ModalHeader>
                        <hr className="mt-0 mb-2" />

                        {selectedEvent && (
                            <div className="px-3">

                                {selectedEvent.title != "" &&
                                    <>
                                        <p>Appointment Title: <span className="fw-500 current-date ms-2">{selectedEvent.title}</span></p>
                                    </>
                                }

                                {selectedEvent.start != "" &&
                                    <>
                                        <p>Appointment Start: <span className="fw-500 current-date ms-2">{selectedEvent.start}</span></p>
                                    </>
                                }
                                {selectedEvent.end != "" &&
                                    <>
                                        <p>Appointment End: <span className="fw-500 current-date ms-2">{selectedEvent.end}</span></p>
                                    </>
                                }
                                {selectedEvent.desc != "" || selectedEvent.desc != null &&
                                    <>
                                        <p>Appointment Description: <span className="fw-500 current-date ms-2">{selectedEvent.desc}</span></p>
                                    </>
                                }
                            </div>
                        )}
                        <ModalFooter>
                            <div className='text-right'>
                                <Button className="cancel-btn me-2" onClick={closeAppointmentModal}>Close</Button>
                            </div>
                        </ModalFooter>
                    </div>
                </Modal>
            </div>
        </>
    )
}
MyCalendar.propTypes = {
    localizer: PropTypes.instanceOf(DateLocalizer),
}

export default MyCalendar;
