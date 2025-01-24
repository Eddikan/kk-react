import { Calendar, momentLocalizer, DateLocalizer } from "react-big-calendar";
import { useEffect } from "react";
import { Modal, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { GiAlarmClock } from "react-icons/gi";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "Assets/styles/DesignerCalendar/style.css";
import useCalendar from "hooks/useCalendar";
import { useGetMyCalenderQuery } from "store/api/queries";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const {
    month,
    year,
    events,
    modalIsOpen,
    appointmentModalIsOpen,
    selectedEvent,
    handleNavigate,
    handleSelectEvent,
    views,
    closeAppointmentModal,
    handleDateClick,
    handleModalClose,
    addAppointmentSubmit,
    dayPropGetter,
  } = useCalendar();
  const calenderQuery = useGetMyCalenderQuery({ year, month });

  useEffect(() => {
    calenderQuery.refetch();
  }, [year, month]);
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
          onNavigate={handleNavigate}
          dayPropGetter={dayPropGetter}
          onSelectEvent={handleSelectEvent}
          views={views}
          eventPropGetter={(event) => {
            const className =
              event.status === "Cancelled" ? "event-cancelled" : "event-normal";
            return { className };
          }}
        />

        <Modal
          show={modalIsOpen}
          onHide={handleModalClose}
          contentLabel="Date Details"
          id={"set-self-appointment"}
          centered
        >
          <form onSubmit={addAppointmentSubmit}>
            <Modal.Header closeButton className="pb-0">
              <Modal.Title>
                <h5 className="modal-title text-left rufina-family fs-22">
                  View Appointments
                </h5>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="bottom-p">
              <div className="tw-flex tw-justify-center">
                No Appointments on this day
              </div>
               {/* {selectedDate && (
                <Card>
                  <Card.Body className="pt-1 pb-1">
                    <Row className="p-3">
                      <Col lg="12" className="mb-2 mt-0 text-left px-0">
                        <span className="title-appointment">Title</span>
                      </Col>

                      <Col lg="12" className="px-0">
                        <input
                          type="text"
                          name="title"
                          className="form-control"
                          value={consultationFormData.title}
                          onChange={handleChangeConsultation}
                          required
                        />
                      </Col>

                      <Col lg="12" className="px-0">
                        <Row
                          className={`align-items-center mt-3 ${
                            startTime != "" || endTime != "" ? "mb-3" : ""
                          }`}
                        >
                          {times.map((time, index) => {
                            return (
                              <>
                                {times.length > 0 && (
                                  <>
                                    <Col md="6" className="pe-0">
                                      <p className="hours-header mb-2 text-left">
                                        Starts at
                                      </p>
                                      <div className="mb-3">
                                        <input
                                          type="time"
                                          name="consultation_hour_start"
                                          className="mr-sm-2 form-control-hours w-100"
                                          value={
                                            consultationFormData?.consultation_hour_start
                                          }
                                          onChange={(e) =>
                                            handleChangeConsultation(e, index)
                                          }
                                          required
                                        />
                                      </div>
                                    </Col>

                                    <Col
                                      md="6"
                                      className="pe-0 position-relative"
                                    >
                                      <p className="hours-header mb-2 text-left">
                                        Ends at
                                      </p>

                                      <div className="mb-3">
                                        <input
                                          type="time"
                                          name="consultation_hour_end"
                                          className="mr-sm-2 form-control-hours w-100"
                                          value={
                                            consultationFormData?.consultation_hour_end
                                          }
                                          onChange={(e) =>
                                            handleChangeConsultation(e, index)
                                          }
                                          required
                                        />
                                      </div>
                                    </Col>
                                  </>
                                )}
                              </>
                            );
                          })}
                        </Row>
                      </Col>
                      {startTime != "" || endTime != "" ? (
                        <Col lg="12" className="mt-0 text-left px-0">
                          {startTime != "" || endTime != "" ? (
                            <>
                              <span className="title-appointment">
                                Availability
                              </span>
                              {startTime == "" ? (
                                <>
                                  <p className="mb-0">{endTime}</p>
                                </>
                              ) : endTime == "" ? (
                                <>
                                  <p className="mb-0">{startTime}</p>
                                </>
                              ) : (
                                <>
                                  <p className="mb-0">
                                    {startTime} - {endTime}
                                  </p>
                                </>
                              )}
                            </>
                          ) : null}
                        </Col>
                      ) : null}
                    </Row>
                  </Card.Body>
                </Card>
              )} */}
            </Modal.Body>
            <Modal.Footer className="border-none pt-0">
                {/* <div className="text-right">
                {(!startTime || !endTime) && (
                  <p className="text-danger text-right fs-12">
                    Store is not available on this date
                  </p>
                )}
                <button
                  className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
                  type="button"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
                {formStatus != "standby" ? (
                  <button className="btn btn-primary btn-style" type="button">
                    Saving...
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-style"
                    disabled={!startTime || !endTime}
                    type="submit"
                  >
                    Save
                  </button>
                )}
              </div> */}
            </Modal.Footer>
          </form>
        </Modal>

        <Modal
          show={appointmentModalIsOpen}
          onHide={closeAppointmentModal}
          centered
        >
          <Modal.Header closeButton className="pb-0">
            <Modal.Title>
              <h5 className="modal-title text-left rufina-family fs-22">
                Appointment Details
              </h5>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bottom-padding">
            <Card>
              <Card.Body>
                {selectedEvent && (
                  <div>
                    {selectedEvent.title != "" && (
                      <>
                        <div>
                          <h2 className="current-date fs-18 poppins-ft fw-600 mb-3">
                            {selectedEvent.title}
                          </h2>
                        </div>
                      </>
                    )}

                    {selectedEvent.date != "" && (
                      <>
                        <div className="d-flex">
                          <p className="fw-500 mb-2">
                            <MdOutlineCalendarMonth
                              size="20"
                              className="icon-color mb-1"
                            />
                          </p>
                          <p className="current-date ms-2 mb-0 text-black">
                            {selectedEvent.date}
                          </p>
                        </div>
                      </>
                    )}
                    {selectedEvent.end != "" || selectedEvent.start != "" ? (
                      <>
                        <div className="d-flex">
                          <p className="fw-500 mb-2">
                            <GiAlarmClock
                              size="20"
                              className="icon-color mb-1"
                            />
                          </p>
                          <p className="current-date ms-2 mb-0 text-black">
                            {selectedEvent.start}&nbsp;-&nbsp;
                            {selectedEvent.end}
                          </p>
                        </div>
                      </>
                    ) : null}
                    {selectedEvent.desc != "" && (
                      <>
                        <div>
                          <p className="current-date fs-16 poppins-ft mb-0 fw-400 text-black">
                            {selectedEvent.desc}
                          </p>
                        </div>
                      </>
                    )}
                    {selectedEvent.status != "" && (
                      <>
                        <div>
                          <p className="current-date fs-16 poppins-ft mb-0 fw-400 text-black">
                            Status: {selectedEvent.status}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer className="border-none">
            <div className="text-right">
              <button
                className="btn btn-secondary border-black bg-white text-black btn-style"
                type="button"
                onClick={closeAppointmentModal}
              >
                Close
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

MyCalendar.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
};

export default MyCalendar;
