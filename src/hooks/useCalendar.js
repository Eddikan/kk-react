import { useState, useEffect, useCallback, useMemo } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Views } from "react-big-calendar";
const intitialConsultationData = {
  consultation_date_time: "",
  consultation_hour_start: "",
  consultation_hour_end: "",
  consultation_date: "",
  email: "",
  first_name: "",
  last_name: "",
  timezone: "",
  consultation_details: "",
};

const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const handleNavigate = (date) => {
    setCurrentDate(date);
  };
  const colors = {
    holidayColor: '#FFDAB3',
    availableColor: '#E1EACD',
  }
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [appointmentModalIsOpen, setAppointmentModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reloadCount, setReloadCount] = useState(0);
  const [formStatus, setFormStatus] = useState("standby");

  const [consultationFormData, setConsultationFormData] = useState(
    intitialConsultationData
  );
  const [currentTimezone, setCurrentTimezone] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [scheduledAppointments, setScheduledAppointments] = useState([]);

  const convertHoursToDatetime = (time, selectedDate) => {
    const [hours, minutes, period] = time.split(/[: ]/);

    // Convert hours to 24-hour format
    const hours24 =
      period === "PM" ? parseInt(hours, 10) + 12 : parseInt(hours, 10);

    const resultDatetime = new Date(selectedDate);
    resultDatetime.setHours(hours24);
    resultDatetime.setMinutes(parseInt(minutes, 10));

    return resultDatetime.toISOString();
  };

  const handleSelectEvent = useCallback((event) => {
    const optionsDate = { year: "numeric", month: "long", day: "numeric" };
    const optionsTimeEnd = { hour: "numeric", minute: "numeric" };
    const optionsTimeStart = { hour: "numeric", minute: "numeric" };
    const formattedDate = new Intl.DateTimeFormat("en-US", optionsDate).format(
      event.start
    );
    const formattedTimeEnd = new Intl.DateTimeFormat(
      "en-US",
      optionsTimeEnd
    ).format(event.end);
    const formattedTimeStart = new Intl.DateTimeFormat(
      "en-US",
      optionsTimeStart
    ).format(event.start);

    setSelectedEvent({
      ...selectedEvent,
      title: event.title,
      start: formattedTimeStart,
      end: formattedTimeEnd,
      date: formattedDate,
      desc: event.desc,
      status: event.status,
    });
    setAppointmentModalIsOpen(true);
  }, []);

  const { defaultDate, views } = useMemo(
    () => ({
      defaultDate: new Date(1970, 1, 1),
      views: [Views.MONTH],
    }),
    []
  );

  const closeAppointmentModal = () => {
    setAppointmentModalIsOpen(false);
    setSelectedEvent(null);
  };

  const handleDateClick = () => {
    setModalIsOpen(true);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
    setSelectedDate(null);
  };

  const isOverlapping = (start1, end1, start2, end2) => {
    return start1 < end2 && end1 > start2;
  };

  const addAppointmentSubmit = (e) => {
    e.preventDefault();

    const newStart = new Date(
      convertHoursToDatetime(
        consultationFormData.consultation_hour_start,
        consultationFormData.consultation_date
      )
    );
    const newEnd = new Date(
      convertHoursToDatetime(
        consultationFormData.consultation_hour_end,
        consultationFormData.consultation_date
      )
    );

    // Validation for start time and end time
    if (newStart >= newEnd) {
      toast.error("Start time must be before the end time.");
      return;
    }

    // Get the current time for comparison
    const currentTime = new Date();

    // Check if the selected start time is in the past
    if (newStart < currentTime) {
      toast.error("You can't schedule an appointment in the past!");
      return;
    }

    // Check if the selected end time is in the past
    if (newEnd < currentTime) {
      toast.error("You can't schedule an appointment that ends in the past!");
      return;
    }

    // Convert available startTime and endTime to comparable Date objects
    const availableStart = new Date(
      convertHoursToDatetime(startTime, consultationFormData.consultation_date)
    );
    const availableEnd = new Date(
      convertHoursToDatetime(endTime, consultationFormData.consultation_date)
    );

    // Check if the new appointment falls within the available time range
    if (newStart < availableStart || newEnd > availableEnd) {
      toast.error(
        "Appointment time is outside of available hours. Please choose a valid time."
      );
      return;
    }
    // Check for overlap with existing appointments
    const hasOverlap = scheduledAppointments.some((appointment) => {
      const existingStart = new Date(appointment.start);
      const existingEnd = new Date(appointment.end);
      return isOverlapping(newStart, newEnd, existingStart, existingEnd);
    });

    if (hasOverlap) {
      toast.error("Time slot unavailable. Please choose another time.");
      return;
    }
  };

  useEffect(() => {
    const getTimezone = () => {
      const timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
      setCurrentTimezone(timezone);
    };

    getTimezone();
  }, []);

  const myCalender = useSelector((state) => state.calendar.calendarData);
  const dayPropGetter = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const dayData = myCalender.calender?.find(
      (day) => day.date === formattedDate
    );

    if (dayData?.is_holiday) {
      return {
        style: {
          backgroundColor: "#FFDAB3",
          color: "white",
        },
      };
    }

    if (dayData?.is_available) {
      return {
        style: {
          backgroundColor: "#E1EACD",
          color: "white",
        },
      };
    }

    return {};
  };

  return {
    currentDate,
    events,
    modalIsOpen,
    appointmentModalIsOpen,
    selectedDate,
    reloadCount,
    formStatus,
    consultationFormData,
    currentTimezone,
    selectedEvent,
    startTime,
    endTime,
    scheduledAppointments,
    handleNavigate,
    handleSelectEvent,
    defaultDate,
    views,
    closeAppointmentModal,
    handleDateClick,
    handleModalClose,
    addAppointmentSubmit,
    dayPropGetter,
    month,
    year,
    colors,
  };
};

export default useCalendar;
