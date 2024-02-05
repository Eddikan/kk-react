import { Calendar, momentLocalizer, Views, DateLocalizer } from 'react-big-calendar';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import React, { useEffect, useState } from 'react';
import { FiCalendar } from "react-icons/fi";
import { LuGlobe2 } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import PropTypes from 'prop-types'
import '../../Assets/styles/DesignerCalendar/style.css';
import { useCookies } from 'react-cookie';
import { Modal } from 'react-bootstrap';
import { GoAlertFill } from 'react-icons/go';
import { useNavigate, useParams, Link } from 'react-router-dom';

import axios from "axios";
import toast from 'react-hot-toast';

const initialBusinessHours = {
    opens_at: '',
    closes_at: '',
    date: ''
};

const initialAppointments = {
    title: '',
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

const localizer = momentLocalizer(moment)

const ConsultationCalendar = ({ toggleEvent }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const currentUserDetails = cookies.userDetails;
    const userDetails = cookies.userDetails;
    const { designerId } = useParams();


    const [events, setEvents] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedDate12, setSelectedDate12] = useState("");
    const [selectedHoursArray, setSelectedHoursArray] = useState([])
    const [reloadCount, setReloadCount] = useState(0);
    const [formStatus, setFormStatus] = useState('standby');
    const [appointmentFormData, setAppointmentFormData] = useState(initialAppointments);
    const [times, setTimes] = useState([initialBusinessHours]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState();
    const [clickedTimeslotButton, setClickedTimeslotButton] = useState();
    const [consultationFormData, setConsultationFormData] = useState(intitialConsultationData);
    const [currentTimezone, setCurrentTimezone] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [youAreScheduleShow, setYouAreScheduleShow] = useState(false);
    const [modalHeading, setModalHeading] = useState();

    const postSetAppointment = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designerId + '/set/appointment', data);
    };

    const getSetAppointment = async (e) => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designerId + '/availability?date=' + e);
    };


    const convertHoursToDatetime = (time) => {
        const [hours, minutes, period] = time.split(/[: ]/);

        // Convert hours to 24-hour format
        const hours24 = period === 'PM' ? parseInt(hours, 10) + 12 : parseInt(hours, 10);

        const resultDatetime = new Date(selectedDate);
        resultDatetime.setHours(hours24);
        resultDatetime.setMinutes(parseInt(minutes, 10));

        return resultDatetime.toISOString();
    };

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

    function convertTo12HourFormat(time24) {
        const [hours, minutes] = time24.split(':');
        let hours12 = parseInt(hours, 10);
        const ampm = hours12 >= 12 ? 'PM' : 'AM';
        hours12 = hours12 % 12 || 12;
        return `${hours12}:${minutes} ${ampm}`;
    }


    function addOneHour(time24) {
        let [hours, minutes] = time24.split(':');
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);

        const dateObject = new Date();
        dateObject.setHours(hours + 1);
        dateObject.setMinutes(minutes);

        const result = `${dateObject.getHours().toString().padStart(2, '0')}:${dateObject.getMinutes().toString().padStart(2, '0')}`;
        return result;
    }

    function convertArrayTo12HourFormat(hoursArray) {
        return hoursArray.map(hour => convertTo12HourFormat(hour));
    }

    const handleCalendarTimeslotClick = ({ start, end }) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };

        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(start);
        setSelectedDate(formattedDate);
        const timeDifference = end - start;

        // Convert milliseconds to hours
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        getSetAppointment(formattedDate).then((response) => {
            const selectedHours = response.data.data.available_hours;
            const status = response.data.status;
            if (status == "Fail") {
                toast.error('This designer have not yet set their available hours');
            } else {
                if (selectedHours) {
                    let hoursArray = convertArrayTo12HourFormat(selectedHours);
                    setSelectedHoursArray(hoursArray);
                } else {
                    toast.error('There has been an error getting the schedule, please try again!');
                }
            }
        }).catch((error) => {
            toast.error('There has been an error getting the schedule, please try again!');
        });
    };

    const handleTimeslotClick = (data) => {
        setSelectedTimeSlot(convert12to24(data.time));
        setClickedTimeslotButton(data.index);
        console.log("data.time", convert12to24(data.time));
    }

    const handleTimeslotNextClick = () => {
        setConsultationFormData({
            ...consultationFormData,
            email: currentUserDetails.email,
            first_name: currentUserDetails.first_name,
            last_name: currentUserDetails.last_name,
            consultation_date_time: convertHoursToDatetime(selectedTimeSlot),
            consultation_hour_end: addOneHour(selectedTimeSlot),
            consultation_hour_start: selectedTimeSlot,
            timezone: currentTimezone,
        });
        setCurrentStep(2);
    }

    const handleChangeConsultation = (e) => {
        const { name, value } = e.target;
        setConsultationFormData({
            ...consultationFormData,
            [name]: value,
        });
    }

    const handleDefault = (e) => {
        e.preventDefault();
    }

    const addAppointmentSubmit = (e) => {
        setFormStatus('loading');
        postSetAppointment({ ...consultationFormData })
            .then(response => {
                const status = response.data.status;
                if (status === "Success") {
                    setFormStatus('standby');
                    setReloadCount(reloadCount + 1);
                    setYouAreScheduleShow(!youAreScheduleShow);
                    setAppointmentFormData(initialAppointments);
                    toast.success('Consultation added successfully!');
                } else {
                    setFormStatus('standby');
                    toast.error('Designer is not available at this time');
                }
            }).catch(() => {
                toast.error('Designer is not available at this time');
            });
    }

    useEffect(() => {
        const getTimezone = () => {
            const timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
            setCurrentTimezone(timezone);
        };

        getTimezone();
    }, []);

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(!underConstructionShow);
        setModalHeading(message);
        console.log("Message", message);
    }

    function toggleSchedule(message) {
        setYouAreScheduleShow(!youAreScheduleShow);
        setModalHeading(message);
        console.log("Message", message);
    }


    return (
        <>
            <Col lg="3">
                <div className="appointment-preview-container">
                    <h3>Appointment Preview</h3>
                    <div>

                        {selectedDate != "" &&
                            <>
                                <p><FiCalendar size={20} color={'#CEA835'} /><span className="fw-500 current-date">{selectedDate}</span></p>
                            </>
                        }
                        {/* {formattedSelectedDate != "" &&
                         <>
                            <p><FiCalendar size={20} color={'#CEA835'}/><span className="fw-500 current-date">{formattedSelectedDate}</span></p>
                        </> 
                        } */}
                        {consultationFormData.timezone != "" &&
                            <>
                                <p><LuGlobe2 size={20} color={'#CEA835'} /><span className="fw-500 current-date">{consultationFormData.timezone}</span></p>
                            </>
                        }
                        {consultationFormData.first_name != "" &&
                            <>
                                <p><FaRegUser size={20} color={'#CEA835'} /><span className="fw-500 current-date">{consultationFormData.first_name} {consultationFormData.last_name}</span></p>
                            </>
                        }
                        {consultationFormData.email != "" &&
                            <>
                                <p><MdOutlineEmail size={20} color={'#CEA835'} /><span className="fw-500 current-date">{consultationFormData.email}</span></p>
                            </>
                        }

                    </div>
                </div>
            </Col>
            <Col lg="9">
                {currentStep == 1 ?
                    <div className="appointment-calendar-container">
                        <h3>Select a Date and Time</h3>
                        <Row>
                            <Col lg="8">
                                <div className="schedule-calendar-container">
                                    <Calendar
                                        localizer={localizer}
                                        events={events}
                                        startAccessor="start"
                                        endAccessor="end"
                                        onSelectSlot={handleCalendarTimeslotClick}
                                        selectable
                                    />
                                </div>
                            </Col>
                            <Col lg="4">
                                <div className="time-container">
                                    <h4>Time</h4>
                                    <div className="timeslots-container">
                                        {selectedHoursArray.map((time, index) => (
                                            <div className="timeslots-column" key={index}>
                                                <div>
                                                    <button key={index} className={clickedTimeslotButton == index ? "btn btn-primary timeslot-btn" : "btn btn-primary"} onClick={() => handleTimeslotClick({ time, index })}>{time}</button>
                                                </div>
                                                <div>
                                                    {clickedTimeslotButton == index && (
                                                        <button key={index} className="btn btn-primary timeslot-btn" onClick={() => handleTimeslotNextClick()}>Next</button>
                                                    )}
                                                </div>
                                            </div>

                                        ))}
                                    </div>
                                </div>

                            </Col>
                        </Row>

                    </div>
                    :
                    <div className="appointment-calendar-container">
                        <h3>Enter Details</h3>
                        <Form>
                            <Form.Group className='my-4'>
                                <Form.Label>Provide any information regarding the details of the meeting.</Form.Label>
                                <FormControl as="textarea"
                                    name="consultation_details"
                                    rows={5} // You can adjust the number of rows as needed
                                    value={consultationFormData.consultation_details}
                                    placeholder='I would like to discuss the design specifications, required materials, and other related details.'
                                    onChange={handleChangeConsultation} />
                            </Form.Group>

                        </Form>
                        {/* temporary, should be inside the form */}
                        <div className="send-btn-container">
                            <button className="btn btn-primary bg-transparent text-black" onClick={() => { setCurrentStep(1); setConsultationFormData(intitialConsultationData); setSelectedDate('') }}>Cancel</button>
                            {formStatus != "loading" ?
                                // <button className="btn btn-primary" onClick={addAppointmentSubmit}>Schedule Now</button>
                                <button className="btn btn-primary" onClick={() => addAppointmentSubmit("You are Scheduled!")}>Schedule Now</button>

                                :
                                <button className="btn btn-primary" onClick={handleDefault}>Loading...</button>
                            }
                        </div>
                    </div>
                }

            </Col>
            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button type='button' className='close react-modal-close' onClick={() => toggleUnderConstruction("")} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='fs-25 fw-600 mb-3'>{modalHeading}</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                            {/* <DateTimePicker onTimeChange={handleTimeChange} onDone={handleDoneTimeChange} availability={currentAvailability} /> */}
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>

            <Modal
                show={youAreScheduleShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button type='button' className='close react-modal-close' onClick={() => toggleSchedule("")} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body className='pt-4'>
                    <h4 className='fs-25 fw-600 mb-3 text-center'>{modalHeading}</h4>
                    <div className='sent-email text-center text-black mb-3'>An invite has been sent to your email. See you then!</div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <Card className='w-75'>
                            <Card.Body className='pb-0'>
                                <div>

                                    {selectedDate != "" &&
                                        <>
                                            <p><FiCalendar size={20} color={'#CEA835'} /><span className="fw-500 current-date ms-2">{selectedDate}</span></p>
                                        </>
                                    }

                                    {consultationFormData.timezone != "" &&
                                        <>
                                            <p><LuGlobe2 size={20} color={'#CEA835'} /><span className="fw-500 current-date ms-2">{consultationFormData.timezone}</span></p>
                                        </>
                                    }
                                    {consultationFormData.first_name != "" &&
                                        <>
                                            <p><FaRegUser size={20} color={'#CEA835'} /><span className="fw-500 current-date ms-2">{consultationFormData.first_name} {consultationFormData.last_name}</span></p>
                                        </>
                                    }
                                    {consultationFormData.email != "" &&
                                        <>
                                            <p><MdOutlineEmail size={20} color={'#CEA835'} /><span className="fw-500 current-date ms-2">{consultationFormData.email}</span></p>
                                        </>
                                    }
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className='text-center mt-2'>
                        <button className='btn btn-primary mt-3' onClick={() => toggleSchedule("")}>Ok</button>
                    </div>
                </Modal.Body>
            </Modal>


        </>
    )
}
ConsultationCalendar.propTypes = {
    localizer: PropTypes.instanceOf(DateLocalizer),
}

export default ConsultationCalendar;
