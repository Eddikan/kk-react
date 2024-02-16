import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer, Views, DateLocalizer } from 'react-big-calendar';
import { Container, CardFooter, Input, Label, UncontrolledAccordion, AccordionItem, AccordionHeader, AccordionBody, CardBody, Button, ModalHeader, ModalBody, ModalFooter, Card, Col, Modal, Table, Row, Form, } from 'reactstrap';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import PropTypes from 'prop-types'
import '../../Assets/styles/DesignerCalendar/style.css';

const localizer = momentLocalizer(moment)

const DesignerCalendar = ({ toggleEvent, events, designerId }) => {
    const navigate = useNavigate();
    const [calendarReady, setCalendarReady] = useState(false);
    const calendarRef = useRef(null);

    const applyPastDateClass = () => {
        const isPast = (date) => moment(date, 'DD').isBefore(moment(), 'day');
    
        const dayCells = document.querySelectorAll('.rbc-date-cell'); // Select all day cell elements
        dayCells.forEach(cell => {
          const button = cell.querySelector('button'); // Select the button element inside the day cell
          const dateText = button.textContent.trim(); // Get the text content of the button
          const date = moment(dateText, 'DD'); // Parse the date text using moment
          if (isPast(date)) {
            cell.classList.add('past-date'); // Add the class to the parent day cell
            button.disabled = true;
          } else {
            cell.classList.remove('past-date'); // Remove the class from the parent day cell
            button.disabled = false;
          }
        });
    };

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateClick = ({ start }) => {
        setSelectedDate(start);
        setModalIsOpen(true);
    };

    // Function to handle event selection
    const handleSelectEvent = (event, e) => {
        // Extract the date from the selected event
        const selectedDate = moment(event.start).format('MMMM D, YYYY');
        // Do something with the selected date
        navigate("/appointment/schedule/"+designerId);
    };

    useEffect(() => {
        setTimeout(function(){
            setCalendarReady(true);
        }, 500)
    }, []);

    useEffect(() => {
        if (calendarRef.current) {
          applyPastDateClass(); // Apply the past date class when the component mounts or updates
        }
    }, [calendarRef.current, calendarReady]);

    return (
        <>
            <div>
                <Calendar
                    ref={calendarRef}
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectSlot={handleSelectEvent}
                    selectable
                    onView={applyPastDateClass}
                    onSelectEvent={handleSelectEvent}
                />
            </div>
        </>
    )
}
DesignerCalendar.propTypes = {
    localizer: PropTypes.instanceOf(DateLocalizer),
}

export default DesignerCalendar;
