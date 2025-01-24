import {
  Calendar,
  momentLocalizer,
  Views,
  DateLocalizer,
} from "react-big-calendar";
import { Row, Col, Card, Form, FormControl, Modal } from "react-bootstrap";
import { useEffect, useState, useMemo, useRef } from "react";
import { FiCalendar } from "react-icons/fi";
import { LuGlobe2 } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import PropTypes from "prop-types";
import "Assets/styles/DesignerCalendar/style.css";
import UserPlaceholder from "Assets/images/user.png";
import { useCookies } from "react-cookie";
import { TfiAlarmClock } from "react-icons/tfi";
import { GoAlertFill } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useGetADesignersCalenderQuery } from "store/api/queries";
import useCalendar from "hooks/useCalendar";

const initialAppointments = {
  title: "",
};

const intitialConsultationData = {
  consultation_hour_start: "",
  consultation_hour_end: "",
  email: "",
  first_name: "",
  last_name: "",
  timezone: "",
  consultation_details: "",
};

const localizer = momentLocalizer(moment);

const ConsultationCalendar = () => {
  const { colors, handleNavigate, year, month } = useCalendar();
  const { designerId, appointmentscheduleId } = useParams();
  const dayPropGetter = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const dayData = data.calender?.find((day) => day.date === formattedDate);
    const isPastDate = (dateString) => {
      return moment(dateString).isBefore(moment(), "day");
    };
    if (isPastDate(dayData?.date)) {
      return {
        style: {
          backgroundColor: "#E6E6E6",
          color: "white",
        },
      };
    }
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

  const calenderQuery = useGetADesignersCalenderQuery({
    designer_id: designerId,
    year,
    month,
  });

  const data = useMemo(() => {
    return calenderQuery?.data?.data ? calenderQuery?.data?.data : {};
  }, [calenderQuery]);
  useEffect(() => {
    calenderQuery.refetch();
  }, [year, month]);


  const calendarRef = useRef(null);
  const navigate = useNavigate();

  const applyPastDateClass = () => {
    const isPast = (date) => moment(date, "DD").isBefore(moment(), "day");

    const dayCells = document.querySelectorAll(".rbc-date-cell"); // Select all day cell elements

    dayCells.forEach((cell) => {
      const button = cell.querySelector("button"); // Select the button element inside the day cell
      const dateText = button.textContent.trim(); // Get the text content of the button
      const date = moment(dateText, "DD"); // Parse the date text using moment
      if (isPast(date)) {
        cell.classList.add("past-date"); // Add the class to the parent day cell
        button.disabled = true;
      } else {
        cell.classList.remove("past-date"); // Remove the class from the parent day cell
        button.disabled = false;
      }
    });
  };

  const [cookies] = useCookies([
    "currentUser",
    "isLoggedIn",
    "userDetails",
    "userRole",
    "token",
  ]);
  const currentUser = cookies.currentUser;
  const current_user_id = cookies.currentUser;
  const token = cookies.token;
  const userRole = cookies.userRole;

  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHoursArray, setSelectedHoursArray] = useState([]);
  const [reloadCount, setReloadCount] = useState(0);
  const [formStatus, setFormStatus] = useState("standby");
  const [appointmentFormData, setAppointmentFormData] =
    useState(initialAppointments);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState();
  const [clickedTimeslotButton, setClickedTimeslotButton] = useState();
  const [consultationFormData, setConsultationFormData] = useState(
    intitialConsultationData
  );
  const [currentTimezone, setCurrentTimezone] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [underConstructionShow, setUnderConstructionShow] = useState(false);
  const [youAreScheduleShow, setYouAreScheduleShow] = useState(false);
  const [modalHeading, setModalHeading] = useState();

  const postSetAppointment = async (data) => {
    return await axios.post(
      import.meta.env.VITE_REACT_APP_API_ENDPOINT +
        "designer/" +
        designerId +
        "/set/appointment?current_user_id=" +
        current_user_id +
        "&token=" +
        token,
      data
    );
  };

  const putSetAppointment = async (data) => {
    return await axios.put(
      import.meta.env.VITE_REACT_APP_API_ENDPOINT +
        "designer/appointment/" +
        appointmentscheduleId +
        "?current_user_id=" +
        current_user_id +
        "&token=" +
        token,
      data
    );
  };

  




  const convert24hrTo12hr = (time24hr) => {
    const [hours, minutes] = time24hr.split(":");
    const date = new Date(2000, 0, 1, hours, minutes);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };





  function convert12to24(time12) {
    const [time, period] = time12.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
    const hours24 = hours.toString().padStart(2, "0");
    const minutes24 = minutes.padStart(2, "0");
    return `${hours24}:${minutes24}`;
  }


  const { defaultDate, views } = useMemo(
    () => ({
      defaultDate: new Date(1970, 1, 1),
      views: [Views.MONTH],
    }),
    []
  );

  function toggleUnderConstruction(message) {
    setUnderConstructionShow(!underConstructionShow);
    setModalHeading(message);
  }

  function toggleSchedule(message) {
    setYouAreScheduleShow(!youAreScheduleShow);
    setModalHeading(message);
  }
  const findDayByDate = (dateString) => {
    const formattedDate = moment(dateString).format("YYYY-MM-DD");
    return data?.calender?.find((day) => day.date === formattedDate);
  };
  const handleCalendarTimeslotClick = ({ start }) => {
    const designersDay = findDayByDate(start);
    if (designersDay?.is_holiday) {
      toast.error("Designer is on holiday");
      return;
    } else if (!designersDay?.is_available) {
      toast.error("Designer isn't available");
    } else {
      const isPast = moment(start).isBefore(moment(), "day");
      if (isPast) {
        toast.error("You can't book in the past");

        setSelectedDate("");
        setSelectedHoursArray([]);
        return;
      }
      setSelectedHoursArray(designersDay.available_time_slots);
      // set available dates
    }

    setClickedTimeslotButton(null);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      start
    );
    setSelectedDate(formattedDate);
  };

  const [selectedTime, setSelectedTime] = useState("");

  const handleTimeslotClick = (data) => {
    setSelectedTimeSlot(convert12to24(data.time));
    setClickedTimeslotButton(data.index);
  };

  const handleTimeslotNextClick = (time) => {
    setConsultationFormData({
      ...consultationFormData,
      email: data?.designer?.email,
      first_name: data?.designer?.first_name,
      last_name: data?.designer?.last_name,
      consultation_hour_end: time.end_time,
      consultation_hour_start: selectedTimeSlot,
      timezone: currentTimezone,
    });
    setCurrentStep(2);
  };

  const handleChangeConsultation = (e) => {
    const { name, value } = e.target;
    setConsultationFormData({
      ...consultationFormData,
      [name]: value,
    });
  };

  const addAppointmentSubmit = (e) => {
    setFormStatus("loading");
    postSetAppointment({ ...consultationFormData })
      .then((response) => {
        const status = response.data.status;
        if (status === "Success") {
          setFormStatus("standby");
          setReloadCount(reloadCount + 1);
          setAppointmentFormData(initialAppointments);
          toast.success("Consultation added successfully!");
          {
            userRole !== "Admin"
              ? setTimeout(() => {
                  setReloadCount((prevReloadCount) => prevReloadCount + 1);
                  navigate("/appointments/" + currentUser);
                }, 1000)
              : setTimeout(() => {
                  setReloadCount(prevReloadCount + 1);
                  navigate("/admin/appointments");
                }, 1000);
          }
        } else {
          setFormStatus("standby");
          toast.error("Designer is not available at this time");
        }
      })
      .catch(() => {
        toast.error("Designer is not available at this time");
      });
  };

  const putAppointmentSubmit = (e) => {
    setFormStatus("loading");
    putSetAppointment({ ...consultationFormData })
      .then((response) => {
        const status = response.data.status;
        if (status === "Success") {
          setFormStatus("standby");
          setReloadCount(reloadCount + 1);
          setAppointmentFormData(initialAppointments);
          toast.success("Consultation updated successfully!");
          {
            userRole !== "Admin"
              ? setTimeout(() => {
                  setReloadCount(prevReloadCount + 1);
                  navigate("/appointments/" + currentUser);
                }, 1000)
              : setTimeout(() => {
                  setReloadCount(prevReloadCount + 1);
                  navigate("/admin/appointments");
                }, 1000);
          }
        } else {
          setFormStatus("standby");
          toast.error("Designer is not available at this time");
        }
      })
      .catch(() => {
        toast.error("Designer is not available at this time");
      });
  };

  useEffect(() => {
    const getTimezone = () => {
      const timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
      setCurrentTimezone(timezone);
    };

    const currentDate = new Date();
    const nextDate = new Date();
    nextDate.setDate(currentDate.getDate() + 1);
    handleCalendarTimeslotClick({ start: currentDate, end: nextDate });
    getTimezone();
  }, []);

  useEffect(() => {
    if (calendarRef.current) {
      applyPastDateClass();
    }
  }, [calendarRef.current]);

  return (
    <>
      <Col lg="3">
        <div className="appointment-preview-container">
          <h3 className="mb-3 user-image-calendar">Designer</h3>
          <div className="fw-500 mb-4 user-image-calendar d-flex">
            {data?.designer?.avatar ? (
              <div
                className="user-photo-calendar me-2"
                style={{
                  backgroundImage: `url(${data?.designer?.avatar})`,
                }}
              ></div>
            ) : (
              <div
                className="user-photo-calendar me-2"
                style={{ backgroundImage: `url(${UserPlaceholder})` }}
              ></div>
            )}
            <span className="d-flex align-items-center">
              {data?.designer?.first_name} {data?.designer?.last_name}
            </span>
          </div>
          <h3>Appointment Preview</h3>
          <div>
            {selectedDate != "" && (
              <>
                <p>
                  <FiCalendar size={20} color={"#CEA835"} className="mb-1" />
                  <span className="fw-500 current-date">{selectedDate}</span>
                </p>
              </>
            )}
            {consultationFormData.consultation_hour_start != "" &&
              consultationFormData.consultation_hour_end != "" && (
                <>
                  <p>
                    <TfiAlarmClock
                      size={20}
                      color={"#CEA835"}
                      className="mb-1"
                    />
                    <span className="fw-500 current-date">
                      {convert24hrTo12hr(
                        consultationFormData.consultation_hour_start
                      )}
                      &nbsp;-&nbsp;
                      {convert24hrTo12hr(
                        consultationFormData.consultation_hour_end
                      )}
                    </span>
                  </p>
                </>
              )}
            {consultationFormData.timezone != "" && (
              <>
                <p>
                  <LuGlobe2 size={20} color={"#CEA835"} className="mb-1" />
                  <span className="fw-500 current-date">
                    {consultationFormData.timezone}
                  </span>
                </p>
              </>
            )}
            {consultationFormData.email != "" && (
              <>
                <p>
                  <MdOutlineEmail
                    size={20}
                    color={"#CEA835"}
                    className="mb-1"
                  />
                  <span className="fw-500 current-date">
                    {consultationFormData.email}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </Col>
      <Col lg="9">
        {currentStep == 1 ? (
          <div className="appointment-calendar-container ">
            <div className="tw-flex tw-mb-2 tw-gap-2 tw-items-center">
              <span className="tw-font-semibold">Select a Date and Time</span>
              <div className="tw-flex ">
                <div
                  className="tw-w-4 tw-h-4  tw-mr-2"
                  style={{ backgroundColor: colors.holidayColor }}
                ></div>
                <span>Holidays</span>
              </div>
              <div className="tw-flex tw-items-center">
                <div
                  className="tw-w-4 tw-h-4  tw-mr-2"
                  style={{ backgroundColor: colors.availableColor }}
                ></div>
                <span>Available</span>
              </div>{" "}
            </div>

            <Row>
              <Col lg="8">
                <div className="schedule-calendar-container">
                  <Calendar
                    ref={calendarRef}
                    localizer={localizer}
                    events={events}
                    defaultView={Views.MONTH}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectSlot={handleCalendarTimeslotClick}
                    dayPropGetter={dayPropGetter}
                    selectable
                    onNavigate={handleNavigate}
                    views={views}
                  />
                </div>
              </Col>

              <Col lg="4">
                <div className="time-container">
                  <h4>Available time slots</h4>
                  <div className="timeslots-container">
                    <>
                      {selectedHoursArray.length > 0 ? (
                        <>
                          {selectedHoursArray.map((time, index) => (
                            <div className="timeslots-column" key={index}>
                              <div>
                                <button
                                  key={index}
                                  className={
                                    clickedTimeslotButton == index ||
                                    selectedTime === time.start_time
                                      ? "btn btn-primary timeslot-btn"
                                      : "btn btn-primary"
                                  }
                                  onClick={() =>
                                    handleTimeslotClick({
                                      time: time.start_time,
                                      index,
                                    })
                                  }
                                >
                                  {time?.start_time} - {time?.end_time}
                                </button>
                              </div>

                              <div>
                                {(clickedTimeslotButton == index ||
                                  selectedTime === time) && (
                                  <button
                                    key={index}
                                    className="btn btn-primary timeslot-btn"
                                    onClick={() =>
                                      handleTimeslotNextClick(time)
                                    }
                                  >
                                    Next
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          <div>
                            <p>No available hours.</p>
                          </div>
                        </>
                      )}
                    </>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        ) : (
          <div className="appointment-calendar-container">
            <h3>Enter Details</h3>
            <Form>
              <Form.Group className="my-4">
                <Form.Label>
                  Provide any information regarding the details of the meeting.
                </Form.Label>
                <FormControl
                  as="textarea"
                  name="consultation_details"
                  rows={5}
                  value={consultationFormData.consultation_details}
                  placeholder="I would like to discuss the design specifications, required materials, and other related details."
                  onChange={handleChangeConsultation}
                />
              </Form.Group>
            </Form>

            <div className="send-btn-container">
              <button
                className="btn btn-primary bg-transparent text-black"
                onClick={() => {
                  setCurrentStep(1);
                  setConsultationFormData(intitialConsultationData);
                  setClickedTimeslotButton("");
                }}
              >
                Cancel
              </button>

              {appointmentscheduleId == 0 || appointmentscheduleId == "0" ? (
                <>
                  {formStatus == "loading" ? (
                    <>
                      <button className="btn btn-primary" disabled>
                        Submitting
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => addAppointmentSubmit("You are Scheduled!")}
                    >
                      Schedule Now
                    </button>
                  )}
                </>
              ) : (
                <>
                  {formStatus == "loading" ? (
                    <>
                      <button className="btn btn-primary" disabled>
                        Updating Now
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-primary"
                        onClick={() => putAppointmentSubmit("You are Updated!")}
                      >
                        Update Now
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </Col>
      <Modal
        show={underConstructionShow}
        className="modal-preview"
        fade={false}
        centered
        size="sm"
      >
        <Modal.Header className="py-0">
          <h5 className="modal-title text-uppercase text-left"></h5>
          <button
            type="button"
            className="close react-modal-close"
            onClick={() => toggleUnderConstruction("")}
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <h4 className="fs-25 fw-600 mb-3">{modalHeading}</h4>
          <Card>
            <Card.Body className="text-center py-5">
              <GoAlertFill size="60px" className="mb-2 text-gold" />
              <p className="fs-20 text-black">Under Construction</p>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>

      <Modal
        show={youAreScheduleShow}
        className="modal-preview"
        fade={false}
        centered
        size="sm"
      >
        <Modal.Header className="py-0">
          <h5 className="modal-title text-uppercase text-left"></h5>
          <button
            type="button"
            className="close react-modal-close"
            onClick={() => toggleSchedule("")}
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body className="pt-4">
          <h4 className="fs-25 fw-600 mb-3 text-center">{modalHeading}</h4>
          <div className="sent-email text-center text-black mb-3">
            An invite has been sent to your email. See you then!
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <Card className="w-75">
              <Card.Body className="pb-0">
                <div>
                  {selectedDate != "" && (
                    <>
                      <p>
                        <FiCalendar size={20} color={"#CEA835"} />
                        <span className="fw-500 current-date ms-2">
                          {selectedDate}
                        </span>
                      </p>
                    </>
                  )}

                  {consultationFormData.timezone != "" && (
                    <>
                      <p>
                        <LuGlobe2 size={20} color={"#CEA835"} />
                        <span className="fw-500 current-date ms-2">
                          {consultationFormData.timezone}
                        </span>
                      </p>
                    </>
                  )}
                  {consultationFormData.first_name != "" && (
                    <>
                      <p>
                        <FaRegUser size={20} color={"#CEA835"} />
                        <span className="fw-500 current-date ms-2">
                          {consultationFormData.first_name}{" "}
                          {consultationFormData.last_name}
                        </span>
                      </p>
                    </>
                  )}
                  {consultationFormData.email != "" && (
                    <>
                      <p>
                        <MdOutlineEmail size={20} color={"#CEA835"} />
                        <span className="fw-500 current-date ms-2">
                          {consultationFormData.email}
                        </span>
                      </p>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="text-center mt-2">
            <button
              className="btn btn-primary mt-3"
              onClick={() => toggleSchedule("")}
            >
              Ok
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
ConsultationCalendar.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
};

export default ConsultationCalendar;
