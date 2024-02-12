import { Calendar, momentLocalizer, Views, DateLocalizer } from 'react-big-calendar';
import { Container, CardFooter, Input, Label, UncontrolledAccordion, AccordionItem, AccordionHeader, AccordionBody, CardBody, Button, Card, Col, Modal, Table, Row, Form, } from 'reactstrap';
import React, { useEffect, useState } from 'react';
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
    const [selectedDate, setSelectedDate] = useState(null);
    const [reloadCount, setReloadCount] = useState(0);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState();
    const [formStatus, setFormStatus] = useState('standby');
    const [appointmentFormData, setAppointmentFormData] = useState(initialAppointments);
    const [times, setTimes] = useState([initialAppointments]);
    const [consultationFormData, setConsultationFormData] = useState(intitialConsultationData);
    const [currentTimezone, setCurrentTimezone] = useState(null);


    const postSetAppointment = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designerId + '/set/appointment', data);
    };

    const getSetAppointment = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designerId + '/set/appointment');
    };

    // const getAppointment = async () => {
    //     return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designerId + '/appointment');
    // };

    const toggleCalendar = (calendarAppointment) => {


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
            consultation_details: currentUserDetails.consultation_details,

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
                    setFormStatus('standby');
                    toast.error('There has been an error adding the appointment, please try again!');
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

    const [appointments, setAppointments] = useState([]);
    useEffect(() => {
        // getSetAppointment()
        //     .then((response) => {
        //         const selectedDate = response.data.data.data;
        //         const status = response.data.status;
        //         if (status == "Fail") {
        //             toast.error('This designer have not yet set their available hours');
        //         }
        //         else {
        //             if (selectedDate) {
        //                 setSelectedDate(selectedDate);
        //                 setAppointments(selectedDate.designer_appointments);

        //                 console.log("selectedDate.designer_appointments", selectedDate.designer_appointments);
        //             } else {
        //                 toast.error('There has been an error getting the schedule, please try again!');
        //             }
        //         }
        //     })
        //     .catch((error) => {
        //         toast.error('There has been an error getting the schedule, please try again!');
        //     });

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
            </div>
        </>
    )
}
MyCalendar.propTypes = {
    localizer: PropTypes.instanceOf(DateLocalizer),
}

export default MyCalendar;
