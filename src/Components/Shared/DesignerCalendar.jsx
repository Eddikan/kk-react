import { Calendar, momentLocalizer, Views, DateLocalizer } from 'react-big-calendar';
import { Container, CardFooter, Input, Label, UncontrolledAccordion, AccordionItem, AccordionHeader, AccordionBody, CardBody, Button, ModalHeader, ModalBody, ModalFooter, Card, Col, Modal, Table, Row, Form, } from 'reactstrap';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import PropTypes from 'prop-types'
import '../../Assets/styles/DesignerCalendar/style.css';

const localizer = momentLocalizer(moment)

const DesignerCalendar = ({ toggleEvent }) => {

    const [events, setEvents] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateClick = ({ start }) => {
        setSelectedDate(start);
        setModalIsOpen(true);
    };

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
            </div>
        </>
    )
}
DesignerCalendar.propTypes = {
    localizer: PropTypes.instanceOf(DateLocalizer),
}

export default DesignerCalendar;
