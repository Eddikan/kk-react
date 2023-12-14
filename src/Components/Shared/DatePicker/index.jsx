import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Form } from 'reactstrap';
import './style.css'; // You can style this file for aesthetics

const DatePicker = (props) => {
  const date = props.date;
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateClick = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day

    // Check if the clicked date is in the past
    if (date.getTime() < today.getTime()) {
      // If it's in the past, reset the time and hide the form
    } else {
      setSelectedDate(date);
      props.onSelectedDate(date);
    }
  };

  const tileContent = ({ date, view }) => {
    const isPastDate = view === 'month' && date < new Date() && date.toDateString() !== new Date().toDateString();
    const classNames = `calendar-date ${isPastDate ? 'past-date' : ''}`;

    return (
      <div
        className={classNames}
        onClick={() => handleDateClick(date)}
      >
        {date.getDate()}
      </div>
    );
  };

  useEffect(() => {
    if (date && date != "") {
      setSelectedDate(date);
    }
  }, [date]);

  return (
    <div className="datetime-picker-container">
      <Calendar
        value={selectedDate}
        onClickDay={handleDateClick}
        tileContent={tileContent}
        calendarType="US"
      />
    </div>
  );
};

export default DatePicker;