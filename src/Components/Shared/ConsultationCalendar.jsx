import { Calendar, momentLocalizer, Views, DateLocalizer } from 'react-big-calendar';
import { Container, CardFooter, Input, Label, UncontrolledAccordion, AccordionItem, AccordionHeader, AccordionBody, CardBody, Button, ModalHeader, ModalBody, ModalFooter, Card, Col, Modal, Table, Row, Form, } from 'reactstrap';
import React, { useEffect, useState } from 'react';
import { FiCalendar } from "react-icons/fi";
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import PropTypes from 'prop-types'
import '../../Assets/styles/DesignerCalendar/style.css';

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

const localizer = momentLocalizer(moment)

const ConsultationCalendar = ({ toggleEvent }) => {

    const [events, setEvents] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedHoursArray, setSelectedHoursArray] = useState([])
    const [reloadCount, setReloadCount] = useState(0);
    const [formStatus, setFormStatus] = useState('standby');
    const [appointmentFormData, setAppointmentFormData] = useState(initialAppointments);
    const [times, setTimes] = useState([initialBusinessHours]);

    const postSetAppointment = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + '/#', data);
    };


    const handleTimeslotClick = ({ start, end }) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(start);
        setSelectedDate(formattedDate);
        console.log("End", end);
        console.log("start", start);
        const timeDifference = end - start;

        // Convert milliseconds to hours
        const hoursDifference = timeDifference / (1000 * 60 * 60);
        let hoursArray = [];
        // List all hours between the two dates
        for (let i = 0; i <= hoursDifference; i++) {
        const currentHour = new Date(start.getTime() + i * 60 * 60 * 1000);
        hoursArray.push(currentHour.toLocaleString('en-US', { hour: 'numeric',minute: '2-digit', hour12: true }));
        
        }
        setSelectedHoursArray(hoursArray);
        // console.log("hoursArray", hoursArray);
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

    const handleChangeAppointment = (e) => {
        const { name, value } = e.target;
        setAppointmentFormData({
            ...appointmentFormData,
            [name]: value,
        });
    }

    const handleChangeTime = (e, index) => {
        const { name, value } = e.target;
        setTimes(prevtimes => {
            const updatedTimes = [...prevtimes];
            updatedTimes[index] = {
                ...updatedTimes[index],
                [name]: value,
                date: selectedDate,
            };

            return updatedTimes;
        });
    };

    const addAppointmentSubmit = (e) => {
        e.preventDefault();
        setFormStatus('loading');
        postSetAppointment({ ...appointmentFormData, times: times })
            .then(response => {
                const status = response.data.status;
                if (status === "Success") {
                    setFormStatus('standby');
                    setReloadCount(reloadCount + 1);
                    setAppointmentFormData(initialAppointments);
                    toast.success('Appointment added successfully!');
                } else {
                    setFormStatus('standby');
                    toast.error('There has been an error saving the appointment, please try again!');
                }
            }).catch(() => {
                toast.error('There has been an error saving the appointment, please try again!');
            });
    }

    console.log("selectedHoursArray", selectedHoursArray);

    return (
        <>
            <Col lg="3">
                <div className="appointment-preview-container">
                    <h3>Appointment Preview</h3>
                    <div>
                        {selectedDate != "" &&
                            <>
                                <FiCalendar size={20} color={'#CEA835'}/><span className="fw-500 current-date">{selectedDate}</span>
                            </> 
                        }
                    </div>
                </div>
            </Col>
            <Col lg="9">
                <div className="appointment-calendar-container">
                    <h3>Select a Date and Time</h3>
                    <Row>
                        <Col lg="9">
                            <div className="schedule-calendar-container">
                                <Calendar
                                    localizer={localizer}
                                    events={events}
                                    startAccessor="start"
                                    endAccessor="end"
                                    onSelectSlot={handleTimeslotClick}
                                    selectable
                                />
                            </div>
                        </Col>
                        <Col lg="3">
                            <div className="time-container">
                                <h4>Time</h4>
                                <div className="timeslots-container">
                                    {selectedHoursArray.map((time, index) => (
                                        <button key={index} className="btn btn-primary">{time}</button>
                                    ))}
                                </div>
                            </div>
                            
                        </Col>
                    </Row>
                    
                </div>
            </Col>
        </>
    )
}
ConsultationCalendar.propTypes = {
    localizer: PropTypes.instanceOf(DateLocalizer),
}

export default ConsultationCalendar;
