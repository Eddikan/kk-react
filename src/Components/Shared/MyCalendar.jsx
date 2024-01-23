import { Calendar, momentLocalizer, Views, DateLocalizer } from 'react-big-calendar';
import { Container, CardFooter, Input, Label, UncontrolledAccordion, AccordionItem, AccordionHeader, AccordionBody, CardBody, Button, ModalHeader, ModalBody, ModalFooter, Card, Col, Modal, Table, Row, Form, } from 'reactstrap';
import React, { useEffect, useState } from 'react';
import { PiPencilThin, PiTrashThin } from "react-icons/pi";
import { AiOutlinePlus, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { MdOutlinePlace } from "react-icons/md";
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import PropTypes from 'prop-types'


const localizer = momentLocalizer(moment)

const MyCalendar = ({ calendarEvent, toggleEvent }) => {
    const [calendarModal, setCalendarModal] = useState(false);
    const [codeData, setCodeData] = useState();
    const [dateStartData, setDateStartData] = useState();
    const [dateEndData, setDateEndData] = useState();
    const [eventDescriptionData, setEventDescriptionData] = useState();
    const [eventUserData, setUserData] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [typeData, setTypeData] = useState([]);
    const [eventTitleData, setEventTitleData] = useState();
    const [eventModalShow, setEventModalShow] = useState(false);
    const [formStatus, setFormStatus] = useState('standby');



    const toggleCalendarEvent = (calendarEvent) => {
        let timeStart = new Date('1970-01-01T' + calendarEvent.time_start + 'Z').toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' });
        let timeend = new Date('1970-01-01T' + calendarEvent.time_end + 'Z').toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' });

        console.log('calendar', calendarEvent.user)
        setCalendarModal(true);
        setEventModalShow(true);
        setCodeData(calendarEvent.code);
        setDateStartData(calendarEvent.date_start);
        setDateEndData(calendarEvent.date_end);
        setEventDescriptionData(calendarEvent.description);
        setEventTitleData(calendarEvent.title);
        setUserData(calendarEvent.user);
        setLocationData(calendarEvent.location);
        setTypeData(calendarEvent.type);
    }

    const handleClose = () => {
        setCalendarModal(false);
    }

    const toggleEventModalShow = () => {
        setEventModalShow(true);
    }


    return (
        <>
            <div className="myCustomHeight">
                <Calendar
                    localizer={localizer}
                    events={calendarEvent}
                    step={30}
                    titleAccessor="title"
                    tooltipAccessor="title"
                    startAccessor="date_start"
                    endAccessor="date_end"
                    resourceIdAccessor="id"
                    resourceTitleAccessor="title"
                    showMultiDayTimes
                    onSelectSlot={toggleCalendarEvent}
                    onSelectEvent={toggleCalendarEvent}
                    defaultView={Views.MONTH}
                />
            </div>

            <Modal
                isOpen={calendarModal}
                centered
                fade={false}
                id="modal"
                className="view-modal"
                style={{ maxWidth: "600px" }}
            >

                <ModalHeader className='d-flex justify-content-end'>
                    <button
                        type="button"
                        className="react-modal-close"
                        style={{ border: "0", backgroundColor: "#fff" }}
                        onClick={toggleEventModalShow}
                    >
                        <span aria-hidden="true">
                            <PiPencilThin />
                        </span>
                    </button>
                    <button
                        type="button"
                        className="react-modal-close"
                        style={{ border: "0", backgroundColor: "#fff" }}
                        onClick={handleClose}
                    >
                        <span aria-hidden="true"><PiTrashThin /></span>
                    </button>
                    <button
                        type="button"
                        className="react-modal-close"
                        style={{ border: "0", backgroundColor: "#fff" }}
                        onClick={handleClose}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                    {/* </div>  */}
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col lg="12">
                            <div>
                                <span className='ms-4'>
                                    {typeData}
                                </span>
                            </div>
                        </Col>
                        <Col lg="12">
                            <div>
                                <span className='ms-4'>{new Date(dateStartData).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric'
                                })}

                                    &nbsp;
                                    -
                                    &nbsp;
                                    {new Date(dateEndData).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric'
                                    })}
                                </span>
                            </div>
                        </Col>
                        <Col lg="12">
                            <MdOutlinePlace />
                            <span className='ms-2'>{locationData}</span>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className="text-right">
                    {/* <button type="button" className="btn btn-outline-warning me-2" onClick={handleClose}>CLOSE</button> */}
                    <button
                        type="button"
                        className="btn btn-outline-primary me-2"
                        onClick={() => handleClose()}
                    >
                        <AiOutlineClose
                            className="cancel-button me-1"
                            size="20px"
                        />
                        Close
                    </button>
                </ModalFooter>
            </Modal>


        </>
    )
}
MyCalendar.propTypes = {
    localizer: PropTypes.instanceOf(DateLocalizer),
}

export default MyCalendar;
