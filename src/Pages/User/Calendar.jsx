import React, { useEffect, useState } from "react";
import { Row, Col, Button, Modal, Card } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import "Assets/styles/DesignerCalendar/style.css";
import { useCookies } from "react-cookie";
import { RxCross2 } from "react-icons/rx";
import Container from "react-bootstrap/Container";
import Sidebar from "Components/Shared/Sidebar";
import { GoPlus } from "react-icons/go";
import MyCalendar from "Components/Shared/MyCalendar";
import GoBack from "Components/Shared/GoBack";
import axios from "axios";
import toast from "react-hot-toast";
import LayoutSellerCenter from "Components/Layout/LayoutSellerCenter";
import { useGetMyCalenderQuery } from "store/api/queries";
import { useSelector } from "react-redux";
import SetAvailability from "Components/Completeness/ShopSteps/SetAvailability";

const initialBusinessHours = {
  start: "",
  end: "",
};

const Calendar = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "currentUser",
    "isLoggedIn",
    "userDetails",
    "userRole",
  ]);
  const currentUser = cookies.currentUser;
  const designerId = cookies.currentUserDesigner;
  const [designerBusinessHoursModalShow, setDesignerBusinessHoursModalShow] =
    useState(false);
  const [isSundayChecked, setIsSundayChecked] = useState(false);
  const [isMondayChecked, setIsMondayChecked] = useState(false);
  const [isTuesdayChecked, setIsTuesdayChecked] = useState(false);
  const [isWednesdayChecked, setIsWednesdayChecked] = useState(false);
  const [isThursdayChecked, setIsThursdayChecked] = useState(false);
  const [isFridayChecked, setIsFridayChecked] = useState(false);
  const [isSaturdayChecked, setIsSaturdayChecked] = useState(false);
  const [sundayHoursFormData, setSundayHoursFormData] = useState([
    initialBusinessHours,
  ]);
  const [mondayHoursFormData, setMondayHoursFormData] = useState([
    initialBusinessHours,
  ]);
  const [tuesdayHoursFormData, setTuesdayHoursFormData] = useState([
    initialBusinessHours,
  ]);
  const [wednesdayHoursFormData, setWednesdayHoursFormData] = useState([
    initialBusinessHours,
  ]);
  const [thursdayHoursFormData, setThursdayHoursFormData] = useState([
    initialBusinessHours,
  ]);
  const [fridayHoursFormData, setFridayHoursFormData] = useState([
    initialBusinessHours,
  ]);
  const [saturdayHoursFormData, setSaturdayHoursFormData] = useState([
    initialBusinessHours,
  ]);

  const [sundayHoursCopyFormData, setSundayHoursCopyFormData] = useState([]);
  const [mondayHoursCopyFormData, setMondayHoursCopyFormData] = useState([]);
  const [tuesdayHoursCopyFormData, setTuesdayHoursCopyFormData] = useState([]);
  const [wednesdayHoursCopyFormData, setWednesdayHoursCopyFormData] = useState(
    []
  );
  const [thursdayHoursCopyFormData, setThursdayHoursCopyFormData] = useState(
    []
  );
  const [fridayHoursCopyFormData, setFridayHoursCopyFormData] = useState([]);
  const [saturdayHoursCopyFormData, setSaturdayHoursCopyFormData] = useState(
    []
  );
  const [businessHoursFormData, setBusinessHoursFormData] = useState([
    initialBusinessHours,
  ]);
  const [calendarAppointment, setCalendarAppointment] = useState([]);
  const [times, setTimes] = useState([]);
  const [currentTimezone, setCurrentTimezone] = useState(null);
  const [noAvailableHours, setNoAvailableHors] = useState(false);

  const [reloadCount, setReloadCount] = useState(0);
  const [scheduleReloadCount, setScheduleReloadCount] = useState(0);
  const [formStatus, setFormStatus] = useState("standby");

  const myCalender = useSelector((state) => state.calendar.calendarData);
  console.log("my calender", myCalender);
  const calenderQuery = useGetMyCalenderQuery({ year: 2024, month: 1 });

  useEffect(() => {
    calenderQuery.refetch();
  }, []);

  // const postSetAppointment = async (data) => {
  //     return await axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + '/calendar/availability', data);
  // };

  const postBusinessHours = async (data) => {
    return await axios.post(
      import.meta.env.VITE_REACT_APP_API_ENDPOINT +
        "designer/availability?user_id=" +
        currentUser,
      data
    );
  };

  const putBusinessHourss = async (data) => {
    return await axios.put(
      import.meta.env.VITE_REACT_APP_API_ENDPOINT +
        "designer/availability/" +
        designerId,
      data
    );
  };

  const getBusinessHours = async () => {
    return await axios.get(
      import.meta.env.VITE_REACT_APP_API_ENDPOINT +
        "designer/availability/" +
        designerId
    );
  };

  const BusinessHoursSubmitPost = (e) => {
    setFormStatus("loading");
    const content = [
      {
        day: "sunday",
        availabilities: sundayHoursFormData,
      },
      {
        day: "monday",
        availabilities: mondayHoursFormData,
      },
      {
        day: "tuesday",
        availabilities: tuesdayHoursFormData,
      },
      {
        day: "wednesday",
        availabilities: wednesdayHoursFormData,
      },
      {
        day: "thursday",
        availabilities: thursdayHoursFormData,
      },
      {
        day: "friday",
        availabilities: fridayHoursFormData,
      },
      {
        day: "saturday",
        availabilities: saturdayHoursFormData,
      },
    ];
    postBusinessHours({
      content,
      designer_id: designerId,
      timezone: currentTimezone,
    })
      .then((response) => {
        const status = response.data.status;
        if (status === "Success") {
          setFormStatus("standby");
          setReloadCount(reloadCount + 1);
          setDesignerBusinessHoursModalShow(false);
          setBusinessHoursFormData(initialBusinessHours);
          toast.success("Availability added successfully!");
        } else {
          setFormStatus("standby");
          toast.error(
            "There has been an error saving the availability hours, please try again!"
          );
        }
      })
      .catch(() => {
        toast.error(
          "There has been an error saving the availability hours, please try again!"
        );
      });
  };

  const BusinessHoursSubmitPut = (e) => {
    setFormStatus("loading");
    const content = [
      {
        day: "sunday",
        availabilities: sundayHoursFormData,
      },
      {
        day: "monday",
        availabilities: mondayHoursFormData,
      },
      {
        day: "tuesday",
        availabilities: tuesdayHoursFormData,
      },
      {
        day: "wednesday",
        availabilities: wednesdayHoursFormData,
      },
      {
        day: "thursday",
        availabilities: thursdayHoursFormData,
      },
      {
        day: "friday",
        availabilities: fridayHoursFormData,
      },
      {
        day: "saturday",
        availabilities: saturdayHoursFormData,
      },
    ];
    putBusinessHourss({
      content,
      designer_id: designerId,
      timezone: currentTimezone,
    })
      .then((response) => {
        const status = response.data.status;
        if (status === "Success") {
          setFormStatus("standby");
          setReloadCount(reloadCount + 1);
          setDesignerBusinessHoursModalShow(false);
          setBusinessHoursFormData(initialBusinessHours);
          toast.success("Availability added successfully!");
        } else {
          setFormStatus("standby");
          toast.error(
            "There has been an error saving the availability hours, please try again!"
          );
        }
      })
      .catch(() => {
        toast.error(
          "There has been an error saving the availability hours, please try again!"
        );
      });
  };

  useEffect(() => {
    document.body.classList.add("designer-calendar-body");
    const getTimezone = () => {
      const timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
      setCurrentTimezone(timezone);
    };

    getTimezone();
  }, []);

  useEffect(() => {
    getBusinessHours()
      .then((response) => {
        const selectedTime = response.data.data;
        const status = response.data.status;
        if (status == "Fail") {
          // toast.error('There are no available hours found!');
          setNoAvailableHors(true);
        } else {
          if (selectedTime) {
            setTimes(selectedTime.content);
            if (
              selectedTime &&
              selectedTime.content &&
              selectedTime.content.length > 0
            ) {
              const sundayEntry = selectedTime.content.find(
                (entry) => entry.day.toLowerCase() === "sunday"
              );
              const mondayEntry = selectedTime.content.find(
                (entry) => entry.day.toLowerCase() === "monday"
              );
              const tuesdayEntry = selectedTime.content.find(
                (entry) => entry.day.toLowerCase() === "tuesday"
              );
              const wednesdayEntry = selectedTime.content.find(
                (entry) => entry.day.toLowerCase() === "wednesday"
              );
              const thursdayEntry = selectedTime.content.find(
                (entry) => entry.day.toLowerCase() === "thursday"
              );
              const fridayEntry = selectedTime.content.find(
                (entry) => entry.day.toLowerCase() === "friday"
              );
              const saturdayEntry = selectedTime.content.find(
                (entry) => entry.day.toLowerCase() === "saturday"
              );

              if (sundayEntry && mondayEntry && tuesdayEntry) {
                const sundayAvailabilities = sundayEntry.availabilities || [];

                const mappedSundayBusinessHours = sundayAvailabilities.map(
                  (availability) => ({
                    start: availability.start || "",
                    end: availability.end || "",
                  })
                );

                const mondayAvailabilities = mondayEntry.availabilities || [];

                const mappedMondayBusinessHours = mondayAvailabilities.map(
                  (availability) => ({
                    start: availability.start || "",
                    end: availability.end || "",
                  })
                );

                const tuesdayAvailabilities = tuesdayEntry.availabilities || [];

                const mappedTuesdayBusinessHours = tuesdayAvailabilities.map(
                  (availability) => ({
                    start: availability.start || "",
                    end: availability.end || "",
                  })
                );

                const wednesdayAvailabilities =
                  wednesdayEntry.availabilities || [];

                const mappedWednesdayBusinessHours =
                  wednesdayAvailabilities.map((availability) => ({
                    start: availability.start || "",
                    end: availability.end || "",
                  }));

                const thursdayAvailabilities =
                  thursdayEntry.availabilities || [];

                const mappedThursdayBusinessHours = thursdayAvailabilities.map(
                  (availability) => ({
                    start: availability.start || "",
                    end: availability.end || "",
                  })
                );

                const fridayAvailabilities = fridayEntry.availabilities || [];

                const mappedFridayBusinessHours = fridayAvailabilities.map(
                  (availability) => ({
                    start: availability.start || "",
                    end: availability.end || "",
                  })
                );

                const saturdayAvailabilities =
                  saturdayEntry.availabilities || [];

                const mappedSaturdayBusinessHours = saturdayAvailabilities.map(
                  (availability) => ({
                    start: availability.start || "",
                    end: availability.end || "",
                  })
                );

                if (mappedFridayBusinessHours.length <= 0) {
                  //means that the day is unavailable
                  setIsFridayChecked(true);
                } else if (mappedSundayBusinessHours.length <= 0) {
                  setIsSundayChecked(true);
                } else if (mappedMondayBusinessHours.length <= 0) {
                  setIsMondayChecked(true);
                } else if (mappedTuesdayBusinessHours.length <= 0) {
                  setIsTuesdayChecked(true);
                } else if (mappedWednesdayBusinessHours.length <= 0) {
                  setIsWednesdayChecked(true);
                } else if (mappedThursdayBusinessHours.length <= 0) {
                  setIsThursdayChecked(true);
                } else if (mappedSaturdayBusinessHours.length <= 0) {
                  setIsSaturdayChecked(true);
                }

                if (!isSundayChecked) {
                  setSundayHoursFormData(mappedSundayBusinessHours);
                  setSundayHoursCopyFormData(mappedSundayBusinessHours);
                }

                if (!isMondayChecked) {
                  setMondayHoursFormData(mappedMondayBusinessHours);
                  setMondayHoursCopyFormData(mappedMondayBusinessHours);
                }

                if (!isTuesdayChecked) {
                  setTuesdayHoursFormData(mappedTuesdayBusinessHours);
                  setTuesdayHoursCopyFormData(mappedTuesdayBusinessHours);
                }

                if (!isWednesdayChecked) {
                  setWednesdayHoursFormData(mappedWednesdayBusinessHours);
                  setWednesdayHoursCopyFormData(mappedWednesdayBusinessHours);
                }

                if (!isThursdayChecked) {
                  setThursdayHoursFormData(mappedThursdayBusinessHours);
                  setThursdayHoursCopyFormData(mappedThursdayBusinessHours);
                }

                if (!isFridayChecked) {
                  setFridayHoursFormData(mappedFridayBusinessHours);
                  setFridayHoursCopyFormData(mappedFridayBusinessHours);
                }

                if (!isSaturdayChecked) {
                  setSaturdayHoursFormData(mappedSaturdayBusinessHours);
                  setSaturdayHoursCopyFormData(mappedSaturdayBusinessHours);
                }
              } else {
                setSundayHoursFormData([initialBusinessHours]);
              }
            }
            setBusinessHoursFormData([initialBusinessHours]);
          } else {
            toast.error(
              "There has been an error getting the appointment, please try again!"
            );
          }
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "There has been an error getting the appointment, please try again!"
        );
      });
  }, [scheduleReloadCount]);

  return (
    <LayoutSellerCenter>
      <section>
        <Container fluid>
          <Row>
            <Col lg={2} className="p-0">
              <Sidebar />
            </Col>

            <Col
              lg={10}
              className="mx-auto py-5 padding-right-admin max-width-column"
            >
              <Row>
                <Col lg={12}>
                  <Row className="pb-4">
                    <Col lg={11}></Col>

                    <Col lg={1} className="text-right">
                      <GoBack fallBack="/" />
                    </Col>

                    <Col
                      md={6}
                      className="d-flex justify-content-left align-items-center"
                    >
                      <h3 className="fs-30 fw-600 text-black mb-0">Calendar</h3>
                    </Col>

                    <Col md={6} className="text-right">
                      <button
                        className="btn-primary btn"
                        onClick={() => {
                          setDesignerBusinessHoursModalShow(true);
                        }}
                      >
                        Availability
                      </button>
                    </Col>
                  </Row>
                  {noAvailableHours ? (
                    <Row>
                      <Col lg="12">
                        <div
                          role="alert"
                          className="fade alert alert-warning show"
                        >
                          You haven&lsquo;t set your schedule yet. To enable
                          appointments, please update your availability settings
                          now!
                        </div>
                      </Col>
                    </Row>
                  ) : null}
                  <div className="calendar-container">
                    <MyCalendar
                      calendarAppointment={calendarAppointment}
                      designerId={designerId}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      <Modal
        show={designerBusinessHoursModalShow}
        onHide={() => setDesignerBusinessHoursModalShow(false)}
        id="business-hours-modal"
      >
        <Modal.Header closeButton className="pb-0">
          <Modal.Title className="rufina-family fs-22">
            Business Hours
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <SetAvailability edit cancel={()=>{
                setDesignerBusinessHoursModalShow(false)
              }} />
            </Card.Body>
          </Card>
        </Modal.Body>
     
      </Modal>
    </LayoutSellerCenter>
  );
};

export default Calendar;
