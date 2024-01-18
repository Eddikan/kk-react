import { Calendar, momentLocalizer, globalizeLocalizer, Views, DateLocalizer } from 'react-big-calendar';
import { Container, CardFooter, Input, Label, UncontrolledAccordion, AccordionItem, AccordionHeader, AccordionBody, CardBody, Button, ModalHeader, ModalBody, ModalFooter, Card, Col, Modal, Table, Row, Form, } from 'reactstrap';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import globalize from 'globalize';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CustomWeekView from './CustomCalendar';
import axios from 'axios';
import PropTypes from 'prop-types'


// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = momentLocalizer(moment) // or globalizeLocalizer
// const localizer = globalizeLocalizer(globalize)

const MyCalendar = ({ calendarEvent, toggleEvent }) => {
  const [calendarModal, setCalendarModal] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [error, setError] = useState();
  const [codeData, setCodeData] = useState();
  const [dateStartData, setDateStartData] = useState();
  const [dateEndData, setDateEndData] = useState();
  const [eventDescriptionData, setEventDescriptionData] = useState();
  const [eventUserData, setUserData] = useState([]);
  const [eventTitleData, setEventTitleData] = useState();
  const [timeStartData, setTimeStartData] = useState();
  const [timeEndData, setTimeEndData] = useState();

  const toggleCalendarEvent = (calendarEvent) => {
        let timeStart = new Date('1970-01-01T' + calendarEvent.time_start + 'Z').toLocaleTimeString('en-US',{ timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' });
        let timeend = new Date('1970-01-01T' + calendarEvent.time_end + 'Z').toLocaleTimeString('en-US',{ timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' });
        // console.log("Time convert",timeStart);

        console.log(calendarEvent.users)
        setCalendarModal(true);
        setCodeData(calendarEvent.code);
        setDateStartData(calendarEvent.date_start);
        setDateEndData(calendarEvent.date_end);
        setEventDescriptionData(calendarEvent.event_description);
        setEventTitleData(calendarEvent.event_title);
        // setUserData(calendarEvent.users);
        // setTimeStartData(timeStart);
        // setTimeEndData(timeStart);
    }

  const handleClose = () => {
    setCalendarModal(false);
  }

  return (
    <>
    <div className="myCustomHeight">
      <Calendar
        localizer={localizer}
        events={calendarEvent}
        step={30}
        titleAccessor="event_title"
        tooltipAccessor="event_title"
        startAccessor="date_start"
        endAccessor="date_end"
        resourceIdAccessor="id"
        resourceTitleAccessor="event_title"
        showMultiDayTimes
        onSelectSlot={toggleCalendarEvent}
        onSelectEvent={(calendarEvent) => {
          toggleCalendarEvent(calendarEvent);
        }}
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
        <button type="button" className="react-modal-close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
            <span aria-hidden="true">&times;</span>
        </button>
        <ModalHeader>
            <h3 className="modal-head-text">Event</h3>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col lg="12">
              <p><strong>Title: </strong>{eventTitleData}</p>
            </Col>
            <Col lg="6">
	              <p><strong>Date Start: </strong>{new Date(dateStartData).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour:'numeric', minute:'numeric' })}</p>
            </Col>
            <Col lg="6">
              <p><strong>Date End: </strong>{new Date(dateEndData).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour:'numeric', minute:'numeric'})}</p>
            </Col>
            <Col lg="12">
              <p><strong>Description: </strong>{eventDescriptionData}</p>
            </Col>
            <Col lg="12">
              <p>
                <strong>Assigned Users: </strong>
                {eventUserData ?
                <>
                    {eventUserData.map((user,index) => (
                      <>
                        {index === eventUserData.length - 1 ?
                          <>
                              {user.first_name + " " + user.last_name + '.'}
                          </>
                          :
                          <>
                            {index === eventUserData.length - 2 ?
                              <>
                                  {user.first_name + " " + user.last_name + ' and '}
                              </>
                              :
                              <>
                                  {user.first_name + " " + user.last_name + ", "}
                              </>
                            }
                          </>
                        }
                      </>
                    ))}
                  </>
                :
                <>
                  No Assigned Users
                </>

                }
              </p>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter className="text-right">
            <button type="button" className="btn btn-outline-warning me-2" onClick={handleClose}>CLOSE</button>
        </ModalFooter>
    </Modal>
    </>
  )
}
MyCalendar.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
}

export default MyCalendar;