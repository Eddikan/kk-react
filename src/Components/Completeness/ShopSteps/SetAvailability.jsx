import { useEffect, useState } from "react";
import FormControl from "react-bootstrap/FormControl";
import { Row, Col, Button, Form } from "react-bootstrap";
import { RxCross2 } from "react-icons/rx";
import { GoPlus } from "react-icons/go";
import toast from "react-hot-toast";
import HolidayBooking from "Components/Forms/HolidayBooking";
import TimezoneDropdown from "Components/Forms/TimezoneDropdown";
import { useUpdateUserAvailabilityMutation } from "store/api/mutations";
import { useGetProfileQuery, useGetMyCalenderQuery } from "store/api/queries";
import { useSelector } from "react-redux";
import useCalendar from "hooks/useCalendar";

const initialBusinessHours = {
  start: "",
  end: "",
};

const SetAvailability = ({ onStepPlusOne, edit, cancel }) => {
  const currenStoreUser = useSelector((state) => state.user.user);
  const { refetch: refetchUser } = useGetProfileQuery();
  const {
    month,
    year,
  } = useCalendar();
  const calenderQuery = useGetMyCalenderQuery({ year, month });
  const [updateUserAvailability, { isLoading: isAvailabilityUpdating }] =
    useUpdateUserAvailabilityMutation();
  const [state, setState] = useState({
    isSundayChecked: false,
    isMondayChecked: false,
    isTuesdayChecked: false,
    isWednesdayChecked: false,
    isThursdayChecked: false,
    isFridayChecked: false,
    isSaturdayChecked: false,
    sundayHoursFormData: [initialBusinessHours],
    mondayHoursFormData: [initialBusinessHours],
    tuesdayHoursFormData: [initialBusinessHours],
    wednesdayHoursFormData: [initialBusinessHours],
    thursdayHoursFormData: [initialBusinessHours],
    fridayHoursFormData: [initialBusinessHours],
    saturdayHoursFormData: [initialBusinessHours],
    sundayHoursCopyFormData: [],
    mondayHoursCopyFormData: [],
    tuesdayHoursCopyFormData: [],
    wednesdayHoursCopyFormData: [],
    thursdayHoursCopyFormData: [],
    fridayHoursCopyFormData: [],
    saturdayHoursCopyFormData: [],
  });

  const daysOfWeek = [
    {
      name: "Sunday",
      state: "isSundayChecked",
      formData: "sundayHoursFormData",
      copyFormData: "sundayHoursCopyFormData",
    },
    {
      name: "Monday",
      state: "isMondayChecked",
      formData: "mondayHoursFormData",
      copyFormData: "mondayHoursCopyFormData",
    },
    {
      name: "Tuesday",
      state: "isTuesdayChecked",
      formData: "tuesdayHoursFormData",
      copyFormData: "tuesdayHoursCopyFormData",
    },
    {
      name: "Wednesday",
      state: "isWednesdayChecked",
      formData: "wednesdayHoursFormData",
      copyFormData: "wednesdayHoursCopyFormData",
    },
    {
      name: "Thursday",
      state: "isThursdayChecked",
      formData: "thursdayHoursFormData",
      copyFormData: "thursdayHoursCopyFormData",
    },
    {
      name: "Friday",
      state: "isFridayChecked",
      formData: "fridayHoursFormData",
      copyFormData: "fridayHoursCopyFormData",
    },
    {
      name: "Saturday",
      state: "isSaturdayChecked",
      formData: "saturdayHoursFormData",
      copyFormData: "saturdayHoursCopyFormData",
    },
  ];

  const [reloadCount, setReloadCount] = useState(0);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    if (currenStoreUser.designer_data?.availability) {
      const { availability } = currenStoreUser.designer_data;
      setSelectedTimezone(availability.timezone);
      setHolidays(
        availability.holidays.map((holiday) => ({
          name: holiday.name,
          dates: [`${holiday.month}-${holiday.day}`],
        }))
      );

      const mappedBusinessHours = daysOfWeek.reduce((acc, day) => {
        const entry = availability.availabilities.find(
          (entry) => entry.day_of_week.toLowerCase() === day.name.toLowerCase()
        );
        const availabilities = entry?.time_slots || [];
        acc[day.formData] = availabilities.map((availability) => ({
          start: availability.start_time || "",
          end: availability.end_time || "",
        }));
        if (availabilities.length === 0) {
          acc[day.state] = true;
        }
        return acc;
      }, {});

      setState((prevState) => ({
        ...prevState,
        ...mappedBusinessHours,
      }));
    }
  }, [currenStoreUser]);

  const handleCheckboxChangeClose = (day) => {
    setState((prevState) => {
      const isChecked = !prevState[day.state];
      return {
        ...prevState,
        [day.state]: isChecked,
        [day.formData]: isChecked ? [] : [prevState[day.copyFormData]],
      };
    });
  };

  const handleRemoveHours = (day, index) => {
    setState((prevState) => {
      const updatedFormData = [...prevState[day.formData]];
      updatedFormData.splice(index, 1);
      return {
        ...prevState,
        [day.formData]: updatedFormData,
      };
    });
  };

  const handleChangeTime = (day, e, index) => {
    const { name, value } = e.target;
    setState((prevState) => {
      const updatedTimes = [...prevState[day.formData]];
      updatedTimes[index] = {
        ...updatedTimes[index],
        [name]: value,
      };
      return {
        ...prevState,
        [day.formData]: updatedTimes,
      };
    });
  };

  const handleAddHours = (day) => {
    setState((prevState) => ({
      ...prevState,
      [day.formData]: [...prevState[day.formData], initialBusinessHours],
    }));
  };

  const BusinessHoursSubmitPost = async () => {
    const content = daysOfWeek.map((day) => ({
      day: day.name.toLowerCase(),
      availabilities: state[day.formData],
    }));
  
    // Validation
    for (const entry of content) {
      for (const slot of entry.availabilities) {
        const startTime = slot.start.includes(":")
          ? slot.start.split(":").slice(0, 2).join(":")
          : slot.start;
        const endTime = slot.end.includes(":")
          ? slot.end.split(":").slice(0, 2).join(":")
          : slot.end;
  
        if (!startTime) {
          toast.error(`${entry.day.charAt(0).toUpperCase() + entry.day.slice(1)} has an empty start time`);
          return;
        }
  
        if (!endTime) {
          toast.error(`${entry.day.charAt(0).toUpperCase() + entry.day.slice(1)} has an empty end time`);
          return;
        }
  
        if (startTime >= endTime) {
          toast.error(`${entry.day.charAt(0).toUpperCase() + entry.day.slice(1)}'s start time should be less than the end time`);
          return;
        }
      }
    }
  
    const payload = {
      time_format: "24H",
      timezone: selectedTimezone,
      content: content.map((entry) => ({
        day_of_week: entry.day,
        time_slots: entry.availabilities.map((slot) => ({
          start_time: slot.start.includes(":")
            ? slot.start.split(":").slice(0, 2).join(":")
            : slot.start,
          end_time: slot.end.includes(":")
            ? slot.end.split(":").slice(0, 2).join(":")
            : slot.end,
        })),
      })),
      holidays: holidays.flatMap((holiday) =>
        holiday.dates.map((date) => {
          const parsedDate = new Date(date);
          return {
            name: holiday.name || "",
            month: parsedDate.getUTCMonth() + 1, // Months are 0-indexed
            day: parsedDate.getUTCDate() + 1,
          };
        })
      ),
    };
    console.log("BusinessHoursSubmitPost", payload);
  
    const res = await updateUserAvailability(payload).unwrap();
    if (res.success) {
      refetchUser();
      calenderQuery.refetch();
      toast.success(res.message);
      setReloadCount(reloadCount + 1);
      setState((prevState) => ({
        ...prevState,
        ...daysOfWeek.reduce((acc, day) => {
          acc[day.formData] = [initialBusinessHours];
          return acc;
        }, {}),
      }));
      cancel();
    }
  };
  return (
    <>
      <Row className="h-100">
        <p className="tw-text-xl tw-text-left">
          Select the days you want to be available for consultation. you can add
          holidays to indicate your days off
        </p>
        <Col lg="12">
          <div className="tw-flex tw-mb-5 tw-justify-start">
            <TimezoneDropdown
              selectedTimezone={selectedTimezone}
              setSelectedTimezone={setSelectedTimezone}
            />
          </div>
          {daysOfWeek.map((day) => (
            <div key={day.name}>
              <Row>
                <Col lg="3">
                  <h4 className="day-header">{day.name}</h4>
                  <Form.Check
                    type={`checkbox`}
                    id={`schedule-${day.name.toLowerCase()}`}
                    label={`Closed`}
                    name={`day`}
                    className="blackCheckBox"
                    checked={state[day.state]}
                    onChange={() => handleCheckboxChangeClose(day)}
                  />
                </Col>
                <Col lg="9" className="d-flex justify-content-end">
                  <Row className="align-items-center tw-w-full">
                    {state[day.formData].map((time, index) => (
                      <>
                        {state[day.formData].length > 0 && (
                          <>
                            <Col md="6" className="pe-0 position-relative">
                              <p className="hours-header">Available from</p>
                              <Form.Group className="mb-3">
                                <FormControl
                                  type="time"
                                  name="start"
                                  className="mr-sm-2 form-control-hours"
                                  value={time?.start}
                                  onChange={(e) =>
                                    handleChangeTime(day, e, index)
                                  }
                                />
                              </Form.Group>
                            </Col>
                            <Col md="5" className="pe-0 position-relative">
                              <p className="hours-header">Available to</p>
                              {index > 0 && (
                                <div className="close-container">
                                  <div
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleRemoveHours(day, index)
                                    }
                                  >
                                    <RxCross2 color="#000000" />
                                  </div>
                                </div>
                              )}
                              <Form.Group className="mb-3">
                                <FormControl
                                  type="time"
                                  name="end"
                                  className="mr-sm-2 form-control-hours"
                                  value={time?.end}
                                  onChange={(e) =>
                                    handleChangeTime(day, e, index)
                                  }
                                />
                              </Form.Group>
                            </Col>
                          </>
                        )}
                      </>
                    ))}
                    {!state[day.state] && (
                      <Col md="1" className="pl-0">
                        <GoPlus
                          size={25}
                          className="plus-btn mt-2"
                          onClick={() => handleAddHours(day)}
                        />
                      </Col>
                    )}
                  </Row>
                </Col>
              </Row>
              <hr className="mb-4 mt-2" />
            </div>
          ))}
          <div className="tw-flex tw-justify-start">
            <HolidayBooking holidays={holidays} setHolidays={setHolidays} />
          </div>
          <div className="text-right mt-3 mb-2">
            <Button
              type="button"
              onClick={() => {
                cancel();
              }}
              className="btn-profile tw-mr-2"
            >
              Cancel
            </Button>
            {isAvailabilityUpdating ? (
              <Button type="button" className="btn-save">
                Saving...
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  BusinessHoursSubmitPost();
                }}
                className="btn-save"
              >
                {edit ? "Update" : "Next"}
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default SetAvailability;
