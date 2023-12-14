import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Form } from 'reactstrap';
import './style.css'; // You can style this file for aesthetics

const DateTimePicker = (props) => {
  const current_availability = props.availability;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTimePopup, setShowTimePopup] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [availability, setAvailability] = useState([]);

  const handleDateClick = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day

    // Check if the clicked date is in the past
    if (date.getTime() < today.getTime()) {
      // If it's in the past, reset the time and hide the form
      setStartTime('');
      setEndTime('');
      setShowTimePopup(false);
    } else {
      setSelectedDate(date);

      // Check if there's an appointment for the selected date
      const existingAppointment = getAppointmentForDate(date);

      if (existingAppointment) {
        // If an appointment exists, set the start and end times
        setStartTime(existingAppointment.start_time);
        setEndTime(existingAppointment.end_time);
      } else {
        // If no appointment exists, reset the start and end times
        setStartTime('');
        setEndTime('');
      }

      setShowTimePopup(true);
    }
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleSaveAppointment = () => {
    if (startTime && endTime) {
      const newAppointment = {
        date: selectedDate,
        start_time: startTime,
        end_time: endTime,
      };

      // Check if the date already has an appointment
      const existingAppointmentIndex = availability.findIndex(
        (app) => app.date.toDateString() === selectedDate.toDateString()
      );

      if (existingAppointmentIndex !== -1) {
        // If an appointment exists, update it
        const updatedAppointments = [...availability];
        updatedAppointments[existingAppointmentIndex] = newAppointment;
        setAvailability(updatedAppointments);
        props.onTimeChange(updatedAppointments);
      } else {
        // If no appointment exists for the date, add a new one
        setAvailability([...availability, newAppointment]);
        props.onTimeChange([...availability, newAppointment]);
      }

      // Clear the input fields
      setShowTimePopup(false);
      setStartTime('');
      setEndTime('');
    }
  };

  const tileContent = ({ date, view }) => {
    const hasAppointment = availability.some(
      (app) => app.date.toDateString() === date.toDateString()
    );

    const isPastDate = view === 'month' && date < new Date() && date.toDateString() !== new Date().toDateString();

    const classNames = `calendar-date ${hasAppointment ? 'available' : ''} ${isPastDate ? 'past-date' : ''}`;

    return (
      <div
        className={classNames}
        onClick={() => handleDateClick(date)}
      >
        {date.getDate()}
      </div>
    );
  };

  const getAppointmentForDate = (date) => {
    const formattedDate = date.toDateString(); // Format the date to string
    return availability.find((app) => app.date.toDateString() === formattedDate);
  };

  const handleDoneTimeChange = (e) => {
    props.onDone(e);
  }

  useEffect(() => {
    if (current_availability) {
      setAvailability(current_availability);
    }
  }, [current_availability]);

  return (
    <div className="datetime-picker-container">
      <Calendar
        value={selectedDate}
        onClickDay={handleDateClick}
        tileContent={tileContent}
        calendarType="US"
      />

      {showTimePopup ? (
        <>
          <Form onSubmit={handleSaveAppointment} className="mt-3">
            <div className="time-popup d-flex align-items-center column-gap-10">
              <input
                type="time"
                value={startTime}
                onChange={handleStartTimeChange}
                className="form-control"
                required
              />
              <span>to</span>
              <input 
                type="time" 
                value={endTime} 
                onChange={handleEndTimeChange}
                className="form-control"
                required
              />
              <button className="btn btn-primary" type="submit" style={{minWidth: '100px', padding: '9px 20px'}}>Save</button>
            </div>
          </Form>
        </>
      ) : 
        <div className="text-right mt-3">
            <button className="btn btn-primary" type="button" onClick={handleDoneTimeChange} style={{minWidth: '100px', padding: '9px 20px'}}>Done</button>
        </div>
      }
    </div>
  );
};

export default DateTimePicker;