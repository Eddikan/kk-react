import { Calendar, momentLocalizer, Views, DateLocalizer } from 'react-big-calendar';
import { Container, CardFooter, Input, Label, UncontrolledAccordion, AccordionItem, AccordionHeader, AccordionBody, CardBody, Button, Card, Col, Modal, Table, Row, Form, } from 'reactstrap';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { PiPencilThin, PiTrashThin } from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { MdOutlinePlace } from "react-icons/md";
import FormControl from 'react-bootstrap/FormControl';
import { MdOutlineCalendarMonth } from "react-icons/md";
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
import { GiAlarmClock } from "react-icons/gi";
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

const MyCalendar = ({ toggleEvent, calendarAppointment, designerId }) => {

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUserDetails = cookies.userDetails;
    const currentUser = cookies.currentUser;
    const userDetails = cookies.userDetails;
    const { designerIdParams } = useParams();

    const designer_id = designerId ?? designerIdParams;

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

    const [selectedHoursArray, setSelectedHoursArray] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');


    const postSetAppointment = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designer_id + '/set/appointment?user_id=' + currentUser, data);
    };

    const getAvailabilities = async (e) => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designer_id + '/availability?date=' + e);
    };

    const getDesignerAppointment = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designer_id + '/appointment');
    };

    function convertTo12HourFormat(time24) {
        const [hours, minutes] = time24.split(':');
        let hours12 = parseInt(hours, 10);
        const ampm = hours12 >= 12 ? 'PM' : 'AM';
        hours12 = hours12 % 12 || 12;
        return `${hours12}:${minutes} ${ampm}`;
    }

    function convert12to24(time12) {
        const [time, period] = time12.split(' ');

        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);

        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }

        // Format the result in 24-hour format
        const hours24 = hours.toString().padStart(2, '0');
        const minutes24 = minutes.padStart(2, '0');

        return `${hours24}:${minutes24}`;
    }

    function convertArrayTo12HourFormat(hoursArray) {
        return hoursArray.map(hour => convertTo12HourFormat(hour));
    }

    const convertHoursToDatetime = (time, selectedDate) => {
        const [hours, minutes, period] = time.split(/[: ]/);

        // Convert hours to 24-hour format
        const hours24 = period === 'PM' ? parseInt(hours, 10) + 12 : parseInt(hours, 10);

        const resultDatetime = new Date(selectedDate);
        resultDatetime.setHours(hours24);
        resultDatetime.setMinutes(parseInt(minutes, 10));

        return resultDatetime.toISOString();
    };

    const convertToIsoDatetime = (date) => {
        const resultDatetime = new Date(date);

        return resultDatetime.toISOString();
    };

    const handleSelectEvent = useCallback((event) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const optionsTimeEnd = { hour: 'numeric', minute: 'numeric' };
        const optionsTimeStart = { hour: 'numeric', minute: 'numeric' };
        // const formattedDateStart = new Intl.DateTimeFormat('en-US', options).format(event.start);
        const formattedDate = new Intl.DateTimeFormat('en-US', optionsDate).format(event.date);
        const formattedTimeEnd = new Intl.DateTimeFormat('en-US', optionsTimeEnd).format(event.end);
        const formattedTimeStart = new Intl.DateTimeFormat('en-US', optionsTimeStart).format(event.start);
        // const formattedDateEnd = new Intl.DateTimeFormat('en-US', options).format(event.end);
        setSelectedEvent({
            ...selectedEvent,
            title: event.title,
            start: formattedTimeStart,
            end: formattedTimeEnd,
            date: formattedDate,
            desc: event.desc,

        });
        setAppointmentModalIsOpen(true);


    }, []);

    const { defaultDate, views } = useMemo(
        () => ({
            defaultDate: new Date(1970, 1, 1),
            views: [Views.MONTH, Views.DAY, Views.WEEK],
        }),
        []
    )

    const closeAppointmentModal = () => {
        setAppointmentModalIsOpen(false);
        setSelectedEvent(null);
    }

    const handleChangeConsultation = (e) => {
        var { name, value } = e.target;
        setConsultationFormData({
            ...consultationFormData,

            email: currentUserDetails.email,
            first_name: currentUserDetails.first_name,
            last_name: currentUserDetails.last_name,
            timezone: currentTimezone,
            consultation_date_time: convertToIsoDatetime(selectedDate),
            consultation_details: 'Self added Appointment',
            [name]: value,

        });
    }

    const handleDateClick = ({ start }) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };

        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(start);

        getAvailabilities(formattedDate).then(response => {
            const selectedHours = response.data.data?.available_hours;
            const status = response.data.status;
            if (status == "Fail") {
                const errors = response.data.errors;
                if (errors && errors.length > 0) {
                    errors.map((error, index) => {
                        toast.error(error);
                        return null; // React requires a return value, so we return null here
                    })
                }
            } else {
                if (selectedHours) {
                    let hoursArray = convertArrayTo12HourFormat(selectedHours);
                    setSelectedHoursArray(hoursArray);
                    if (hoursArray.length > 0) {
                        if (hoursArray.length > 1) {
                            setStartTime(hoursArray[0]);
                            setEndTime(hoursArray[hoursArray.length - 1]);
                        } else {
                            setStartTime(hoursArray[0]);
                        }
                        setConsultationFormData({
                            ...consultationFormData,

                            email: currentUserDetails.email,
                            first_name: currentUserDetails.first_name,
                            last_name: currentUserDetails.last_name,
                            timezone: currentTimezone,
                            consultation_date_time: convertToIsoDatetime(selectedDate),
                            consultation_details: 'Self added Appointment',
                            consultation_hour_start: convert12to24(hoursArray[0]),
                        });

                    } else {
                        setConsultationFormData({
                            ...consultationFormData,

                            email: currentUserDetails.email,
                            first_name: currentUserDetails.first_name,
                            last_name: currentUserDetails.last_name,
                            timezone: currentTimezone,
                            consultation_date_time: convertToIsoDatetime(selectedDate),
                            consultation_details: 'Self added Appointment',
                            consultation_hour_start: '',
                        });
                        setStartTime('');
                        setEndTime('');
                    }

                } else {
                    const errors = response.data.errors;
                    if (errors && errors.length > 0) {
                        errors.map((error, index) => {
                            toast.error(error);
                            return null; // React requires a return value, so we return null here
                        });
                    } else {
                        toast.error('There has been an error getting the schedule, please try again!');
                    }
                }
            }
        }).catch(() => {
            toast.error('There has been an error adding the appointment, please try again!');
        });
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
                    handleModalClose();
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
                        if (appointment.consultation_hour_start && appointment.consultation_hour_end) {
                            const appointmentStartIso = convertHoursToDatetime(appointment.consultation_hour_start, appointmentDateTime);
                            const appointmentEndIso = convertHoursToDatetime(appointment.consultation_hour_end, appointmentDateTime);
                            const eventData = {
                                id: appointment.id,
                                title: appointment.title ? appointment.title : 'Appointment with ' + appointment.first_name + ' ' + appointment.last_name,
                                start: new Date(appointmentStartIso),
                                end: new Date(appointmentEndIso),
                                desc: appointment.consultation_details,
                            };
                            apiEventDataArray.push(eventData);
                        }
                    }
                    setEvents(apiEventDataArray);
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
                    views={views}
                />

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={handleModalClose}
                    contentLabel="Date Details"
                    id={'set-self-appointment'}

                >
                    <form onSubmit={addAppointmentSubmit}>
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
                                            required
                                        />
                                    </Col>

                                    <Col lg="8">
                                        <Row className={`align-items-center mt-3 ${startTime != "" || endTime != "" ? "mb-3" : ""}`}>
                                            {times.map((time, index) => {
                                                return (
                                                    <>
                                                        {times.length > 0 && (
                                                            <>


                                                                <Col md="5" className="pe-0">
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

                                                                <Col md="5" className="pe-0 position-relative">
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
                                                            </>
                                                        )}
                                                    </>
                                                );
                                            })}
                                            {/* <Col md="2" className="px-0">
                                                <GoPlus
                                                    size={25}
                                                    className="plus-btn mt-2"
                                                    onClick={handleAppointments}
                                                />
                                            </Col> */}
                                        </Row>
                                    </Col>
                                    {startTime != "" || endTime != "" ?
                                        <Col lg="12" className='mt-0 text-left'>
                                            {startTime != "" || endTime != "" ?
                                                <>
                                                    <span className='title-appointment'>Availability</span>
                                                    {startTime == "" ?
                                                        <>
                                                            <p className='mb-0'>{endTime}</p>
                                                        </>
                                                        : endTime == "" ?
                                                            <>
                                                                <p className='mb-0'>{startTime}</p>
                                                            </>
                                                            :
                                                            <>
                                                                <p className='mb-0'>{startTime} - {endTime}</p>
                                                            </>
                                                    }
                                                </>
                                                :
                                                null
                                            }
                                        </Col>
                                        :
                                        null
                                    }

                                </Row>
                            </div>
                        )}
                        <ModalFooter>
                            <div className='text-right'>
                                <Button className="cancel-btn me-2" type="button" onClick={handleModalClose}>Cancel</Button>
                                {formStatus != "standby" ?
                                    <Button className="btn-save" type="button">Saving...</Button>
                                    :
                                    <Button className="btn-save" type="submit">Save</Button>
                                }
                            </div>
                        </ModalFooter>
                    </form>
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
                                        <div>
                                            <h2 className="current-date fs-18 poppins-ft fw-600 mb-3 mt-3">{selectedEvent.title}</h2>
                                        </div>

                                    </>
                                }

                                {selectedEvent.date != "" &&
                                    <>
                                        <div className="d-flex">
                                            <p className="fw-500 mb-2"><MdOutlineCalendarMonth size="20" className='icon-color' /></p>
                                            <p className="current-date ms-2 mb-0 text-black">{selectedEvent.date}</p>
                                        </div>
                                    </>
                                }
                                {selectedEvent.end != "" || selectedEvent.start != "" ?
                                    <>
                                        <div className="d-flex">
                                            <p className="fw-500 mb-2"><GiAlarmClock size="20" className='icon-color' /></p>
                                            <p className="current-date ms-2 mb-0 text-black">{selectedEvent.start}&nbsp;-&nbsp;{selectedEvent.end}</p>
                                        </div>
                                    </>
                                    :
                                    null
                                }
                                {selectedEvent.desc != "" &&
                                    <>
                                        <div>
                                            <p className="current-date fs-16 poppins-ft fw-400 text-black mb-2">{selectedEvent.desc}</p>
                                        </div>
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
