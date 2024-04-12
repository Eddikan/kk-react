import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FormControl from 'react-bootstrap/FormControl';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import { RxCross2 } from "react-icons/rx";
import { useCookies } from 'react-cookie';
import { GoPlus } from "react-icons/go";
import axios from "axios";
import toast from 'react-hot-toast';

const initialBusinessHours = {
    start: '',
    end: ''
};

const SetAvailability = ({ user, reload, token, onStepPlusOne }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const designerId = cookies.currentUserDesigner;
    const [isSundayChecked, setIsSundayChecked] = useState(false);
    const [isMondayChecked, setIsMondayChecked] = useState(false);
    const [isTuesdayChecked, setIsTuesdayChecked] = useState(false);
    const [isWednesdayChecked, setIsWednesdayChecked] = useState(false);
    const [isThursdayChecked, setIsThursdayChecked] = useState(false);
    const [isFridayChecked, setIsFridayChecked] = useState(false);
    const [isSaturdayChecked, setIsSaturdayChecked] = useState(false);
    const [sundayHoursFormData, setSundayHoursFormData] = useState([initialBusinessHours]);
    const [mondayHoursFormData, setMondayHoursFormData] = useState([initialBusinessHours]);
    const [tuesdayHoursFormData, setTuesdayHoursFormData] = useState([initialBusinessHours]);
    const [wednesdayHoursFormData, setWednesdayHoursFormData] = useState([initialBusinessHours]);
    const [thursdayHoursFormData, setThursdayHoursFormData] = useState([initialBusinessHours]);
    const [fridayHoursFormData, setFridayHoursFormData] = useState([initialBusinessHours]);
    const [saturdayHoursFormData, setSaturdayHoursFormData] = useState([initialBusinessHours]);

    const [sundayHoursCopyFormData, setSundayHoursCopyFormData] = useState([]);
    const [mondayHoursCopyFormData, setMondayHoursCopyFormData] = useState([]);
    const [tuesdayHoursCopyFormData, setTuesdayHoursCopyFormData] = useState([]);
    const [wednesdayHoursCopyFormData, setWednesdayHoursCopyFormData] = useState([]);
    const [thursdayHoursCopyFormData, setThursdayHoursCopyFormData] = useState([]);
    const [fridayHoursCopyFormData, setFridayHoursCopyFormData] = useState([]);
    const [saturdayHoursCopyFormData, setSaturdayHoursCopyFormData] = useState([]);

    const [businessHoursFormData, setBusinessHoursFormData] = useState([initialBusinessHours]);

    const [formStatus, setFormStatus] = useState(false);
    const [currentTimezone, setCurrentTimezone] = useState(null);
    const [reloadCount, setReloadCount] = useState(0);
    const [noAvailableHours, setNoAvailableHors] = useState(false);
    const [scheduleReloadCount, setScheduleReloadCount] = useState(0);
    const [times, setTimes] = useState([]);

   

    const postBusinessHours = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'designer/availability?user_id=' + currentUser, data);
    };

    const getBusinessHours = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer/availability/' + designerId);
    };

    const putBusinessHourss = async (data) => {
        return await axios.put(process.env.REACT_APP_API_ENDPOINT + 'designer/availability/' + designerId, data);
    };


  //* This will close the fields when you click the checkbox *//
  const handleSundayCheckboxChangeClose = () => {
    setIsSundayChecked(!isSundayChecked);
    if (!isSundayChecked) {
        setSundayHoursFormData([]);
    } else {
        // setScheduleReloadCount(scheduleReloadCount + 1);
        setSundayHoursFormData([sundayHoursCopyFormData]);
    }
};

const handleMondayCheckboxChangeClose = () => {
    setIsMondayChecked(!isMondayChecked);

    if (!isMondayChecked) {
        setMondayHoursFormData([]);
    } else {
        // setScheduleReloadCount(scheduleReloadCount + 1);
        setMondayHoursFormData([mondayHoursCopyFormData]);
    }
};

const handleTuesdayCheckboxChangeClose = () => {
    setIsTuesdayChecked(!isTuesdayChecked);

    if (!isTuesdayChecked) {
        setTuesdayHoursFormData([]);
    } else {
        // setScheduleReloadCount(scheduleReloadCount + 1);
        setTuesdayHoursFormData([tuesdayHoursCopyFormData]);
    }
};

const handleWednesdayCheckboxChangeClose = () => {
    setIsWednesdayChecked(!isWednesdayChecked);

    if (!isWednesdayChecked) {
        setWednesdayHoursFormData([]);
    } else {
        // setScheduleReloadCount(scheduleReloadCount + 1);
        setWednesdayHoursFormData([wednesdayHoursCopyFormData]);
    }
};

const handleThursdayCheckboxChangeClose = () => {
    setIsThursdayChecked(!isThursdayChecked);

    if (!isThursdayChecked) {
        setThursdayHoursFormData([]);
    } else {
        // setScheduleReloadCount(scheduleReloadCount + 1);
        setThursdayHoursFormData([thursdayHoursCopyFormData]);
    }
};

const handleFridayCheckboxChangeClose = () => {
    setIsFridayChecked(!isFridayChecked);

    if (!isFridayChecked) {
        setFridayHoursFormData([]);
    } else {
        // setScheduleReloadCount(scheduleReloadCount + 1);
        setFridayHoursFormData([fridayHoursCopyFormData]);
    }
};

const handleSaturdayCheckboxChangeClose = () => {
    setIsSaturdayChecked(!isSaturdayChecked);

    if (!isSaturdayChecked) {
        setSaturdayHoursFormData([]);
    } else {
        // setScheduleReloadCount(scheduleReloadCount + 1);
        setSaturdayHoursFormData([saturdayHoursCopyFormData]);
    }
};


//*This will remove the fields added*//
const handleRemoveSundayHours = (index) => {
    setSundayHoursFormData((prevSundayHoursFormData) => {
        const updatedSundayHoursFormData = [...prevSundayHoursFormData];
        updatedSundayHoursFormData.splice(index, 1);

        return updatedSundayHoursFormData;
    });
}

const handleRemoveMondayHours = (index) => {
    setMondayHoursFormData((prevMondayHoursFormData) => {
        const updatedMondayHoursFormData = [...prevMondayHoursFormData];
        updatedMondayHoursFormData.splice(index, 1);

        return updatedMondayHoursFormData;
    });
}

const handleRemoveTuesdayHours = (index) => {
    setTuesdayHoursFormData((prevTuesdayHoursFormData) => {
        const updatedTuesdayHoursFormData = [...prevTuesdayHoursFormData];
        updatedTuesdayHoursFormData.splice(index, 1);

        return updatedTuesdayHoursFormData;
    });
}

const handleRemoveWednesdayHours = (index) => {
    setWednesdayHoursFormData((prevWednesdaydayHoursFormData) => {
        const updatedWednesdayHoursFormData = [...prevWednesdaydayHoursFormData];
        updatedWednesdayHoursFormData.splice(index, 1);

        return updatedWednesdayHoursFormData;
    });
}

const handleRemoveThursdayHours = (index) => {
    setThursdayHoursFormData((prevThursdayHoursFormData) => {
        const updatedThursdayHoursFormData = [...prevThursdayHoursFormData];
        updatedThursdayHoursFormData.splice(index, 1);

        return updatedThursdayHoursFormData;
    });
}

const handleRemoveFridayHours = (index) => {
    setFridayHoursFormData((prevFridayHoursFormData) => {
        const updatedFridayHoursFormData = [...prevFridayHoursFormData];
        updatedFridayHoursFormData.splice(index, 1);

        return updatedFridayHoursFormData;
    });
}

const handleRemoveSaturdayHours = (index) => {
    setSaturdayHoursFormData((prevSaturdayHoursFormData) => {
        const updatedSaturdayHoursFormData = [...prevSaturdayHoursFormData];
        updatedSaturdayHoursFormData.splice(index, 1);

        return updatedSaturdayHoursFormData;
    });
}


    const handleChangeTimeSunday = (e, index) => {
        const { name, value } = e.target;
        setSundayHoursFormData(prevtimes => {
            const updatedTimes = [...prevtimes];
            updatedTimes[index] = {
                ...updatedTimes[index],
                [name]: value,
            };

            return updatedTimes;
        });
    };


    const handleChangeTimeMonday = (e, index) => {
        const { name, value } = e.target;
        setMondayHoursFormData(prevtimes => {
            const updatedTimes = [...prevtimes];
            updatedTimes[index] = {
                ...updatedTimes[index],
                [name]: value,
            };

            return updatedTimes;
        });
    };

    const handleChangeTimeTuesday = (e, index) => {
        const { name, value } = e.target;
        setTuesdayHoursFormData(prevtimes => {
            const updatedTimes = [...prevtimes];
            updatedTimes[index] = {
                ...updatedTimes[index],
                [name]: value,
            };

            return updatedTimes;
        });
    };

    const handleChangeTimeWednesday = (e, index) => {
        const { name, value } = e.target;
        setWednesdayHoursFormData(prevtimes => {
            const updatedTimes = [...prevtimes];
            updatedTimes[index] = {
                ...updatedTimes[index],
                [name]: value,
            };

            return updatedTimes;
        });
    };

    const handleChangeTimeThursday = (e, index) => {
        const { name, value } = e.target;
        setThursdayHoursFormData(prevtimes => {
            const updatedTimes = [...prevtimes];
            updatedTimes[index] = {
                ...updatedTimes[index],
                [name]: value,
            };

            return updatedTimes;
        });
    };

    const handleChangeTimeFriday = (e, index) => {
        const { name, value } = e.target;
        setFridayHoursFormData(prevtimes => {
            const updatedTimes = [...prevtimes];
            updatedTimes[index] = {
                ...updatedTimes[index],
                [name]: value,
            };

            return updatedTimes;
        });
    };

    const handleChangeTimeSaturday = (e, index) => {
        const { name, value } = e.target;
        setSaturdayHoursFormData(prevtimes => {
            const updatedTimes = [...prevtimes];
            updatedTimes[index] = {
                ...updatedTimes[index],
                [name]: value,
            };

            return updatedTimes;
        });
    };


    //* This will add the fields opens at and closes at *//
    const handleAddSundayHours = () => {
        setSundayHoursFormData(prevSundayHoursFormData => [
            ...prevSundayHoursFormData,
            initialBusinessHours
        ]);
    }

    const handleAddMondayHours = () => {
        setMondayHoursFormData(prevMondayHoursFormData => [
            ...prevMondayHoursFormData,
            initialBusinessHours
        ]);
    }

    const handleAddTuesdayHours = () => {
        setTuesdayHoursFormData(prevTuesdayHoursFormData => [
            ...prevTuesdayHoursFormData,
            initialBusinessHours
        ]);
    }

    const handleAddWednesdayHours = () => {
        setWednesdayHoursFormData(prevWednesdayHoursFormData => [
            ...prevWednesdayHoursFormData,
            initialBusinessHours
        ]);
    }

    const handleAddThursdayHours = () => {
        setThursdayHoursFormData(prevThursdayHoursFormData => [
            ...prevThursdayHoursFormData,
            initialBusinessHours
        ]);
    }

    const handleAddFridayHours = () => {
        setFridayHoursFormData(prevFridayHoursFormData => [
            ...prevFridayHoursFormData,
            initialBusinessHours
        ]);
    }

    const handleAddSaturdayHours = () => {
        setSaturdayHoursFormData(prevSaturdayHoursFormData => [
            ...prevSaturdayHoursFormData,
            initialBusinessHours
        ]);
    }


    const BusinessHoursSubmitPost = (e) => {
        setFormStatus(true);
        const content = [
            {
                day: 'sunday',
                availabilities: sundayHoursFormData
            },
            {
                day: 'monday',
                availabilities: mondayHoursFormData
            },
            {
                day: 'tuesday',
                availabilities: tuesdayHoursFormData
            },
            {
                day: 'wednesday',
                availabilities: wednesdayHoursFormData
            },
            {
                day: 'thursday',
                availabilities: thursdayHoursFormData
            },
            {
                day: 'friday',
                availabilities: fridayHoursFormData
            },
            {
                day: 'saturday',
                availabilities: saturdayHoursFormData
            },
        ];
        postBusinessHours({ content, designer_id: designerId, timezone: currentTimezone }).then(response => {
            const status = response.data.status;
            if (status === "Success") {
                setFormStatus(false);
                setReloadCount(reloadCount + 1);
                setBusinessHoursFormData(initialBusinessHours);
                toast.success('Availability added successfully!');
                onStepPlusOne();
            } else {
                setFormStatus(false);
                toast.error('There has been an error saving the availability hours, please try again!');
            }
        }).catch(() => {
            toast.error('There has been an error saving the availability hours, please try again!');
        });
    }



    const BusinessHoursSubmitPut = (e) => {
        setFormStatus('loading');
        const content = [ 
            {
                day: 'sunday',
                availabilities: sundayHoursFormData
            },
            {
                day: 'monday',
                availabilities: mondayHoursFormData
            },
            {
                day: 'tuesday',
                availabilities: tuesdayHoursFormData
            },
            {
                day: 'wednesday',
                availabilities: wednesdayHoursFormData
            },
            {
                day: 'thursday',
                availabilities: thursdayHoursFormData
            },
            {
                day: 'friday',
                availabilities: fridayHoursFormData
            },
            {
                day: 'saturday',
                availabilities: saturdayHoursFormData
            },
        ];
        putBusinessHourss({ content, designer_id: designerId, timezone: currentTimezone }).then(response => {
            const status = response.data.status;
            if (status === "Success") {
                setFormStatus('standby');
                setReloadCount(reloadCount + 1);
                onStepPlusOne();
                setBusinessHoursFormData(initialBusinessHours);
                toast.success('Availability added successfully!');
            } else {
                setFormStatus('standby');
                toast.error('There has been an error saving the availability hours, please try again!');
            }
        }).catch(() => {
            toast.error('There has been an error saving the availability hours, please try again!');
        });
    }






    useEffect(() => {
        getBusinessHours()
            .then((response) => {
                const selectedTime = response.data.data;
                const status = response.data.status;
                if (status == "Fail") {
                    // toast.error('There are no available hours found!');
                    setNoAvailableHors(true);
                }
                else {
                    if (selectedTime) {
                        setTimes(selectedTime.content);
                        if (selectedTime && selectedTime.content && selectedTime.content.length > 0) {

                            const sundayEntry = selectedTime.content.find(entry => entry.day.toLowerCase() === 'sunday');
                            const mondayEntry = selectedTime.content.find(entry => entry.day.toLowerCase() === 'monday');
                            const tuesdayEntry = selectedTime.content.find(entry => entry.day.toLowerCase() === 'tuesday');
                            const wednesdayEntry = selectedTime.content.find(entry => entry.day.toLowerCase() === 'wednesday');
                            const thursdayEntry = selectedTime.content.find(entry => entry.day.toLowerCase() === 'thursday');
                            const fridayEntry = selectedTime.content.find(entry => entry.day.toLowerCase() === 'friday');
                            const saturdayEntry = selectedTime.content.find(entry => entry.day.toLowerCase() === 'saturday');

                            if (sundayEntry && mondayEntry && tuesdayEntry) {
                                const sundayAvailabilities = sundayEntry.availabilities || [];

                                const mappedSundayBusinessHours = sundayAvailabilities.map(availability => ({
                                    start: availability.start || '',
                                    end: availability.end || '',

                                }));

                                const mondayAvailabilities = mondayEntry.availabilities || [];

                                const mappedMondayBusinessHours = mondayAvailabilities.map(availability => ({
                                    start: availability.start || '',
                                    end: availability.end || '',

                                }));

                                const tuesdayAvailabilities = tuesdayEntry.availabilities || [];

                                const mappedTuesdayBusinessHours = tuesdayAvailabilities.map(availability => ({
                                    start: availability.start || '',
                                    end: availability.end || '',

                                }));

                                const wednesdayAvailabilities = wednesdayEntry.availabilities || [];

                                const mappedWednesdayBusinessHours = wednesdayAvailabilities.map(availability => ({
                                    start: availability.start || '',
                                    end: availability.end || '',

                                }));

                                const thursdayAvailabilities = thursdayEntry.availabilities || [];

                                const mappedThursdayBusinessHours = thursdayAvailabilities.map(availability => ({
                                    start: availability.start || '',
                                    end: availability.end || '',

                                }));

                                const fridayAvailabilities = fridayEntry.availabilities || [];

                                const mappedFridayBusinessHours = fridayAvailabilities.map(availability => ({
                                    start: availability.start || '',
                                    end: availability.end || '',

                                }));

                                const saturdayAvailabilities = saturdayEntry.availabilities || [];

                                const mappedSaturdayBusinessHours = saturdayAvailabilities.map(availability => ({
                                    start: availability.start || '',
                                    end: availability.end || '',

                                }));

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
                        toast.error('There has been an error getting the appointment, please try again!');
                    }
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the appointment, please try again!');
            });

    }, [scheduleReloadCount]);


    return (
        <>
            <Row className="h-100">
                                <Col lg="12">
                                    <Row>
                                        <Col lg="2">
                                            <h4 className="day-header">Sunday</h4>
                                            <Form.Check
                                                type={`checkbox`}
                                                id={`schedule-sunday`}
                                                label={`Closed`}
                                                name={`day`}
                                                className
                                                checked={isSundayChecked}
                                                onChange={handleSundayCheckboxChangeClose}
                                            />
                                        </Col>
                                        <Col lg="5" className='d-flex justify-content-end'>
                                            <Row className="align-items-center">
                                                {sundayHoursFormData.map((sunday, index) => {
                                                    return (
                                                        <>
                                                            {sundayHoursFormData.length > 0 && (
                                                                <>

                                                                    <Col md="5" className="pe-0 position-relative">
                                                                        <p className="hours-header">Opens at</p>
                                                                        <Form.Group className='mb-3'>
                                                                            <FormControl
                                                                                type='time'
                                                                                name='start'
                                                                                className='mr-sm-2 form-control-hours'
                                                                                value={sunday?.start}
                                                                                onChange={e => handleChangeTimeSunday(e, index)}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>

                                                                    <Col md="5" className="pe-0 position-relative">
                                                                        <p className="hours-header">Closes at</p>
                                                                        {index > 0 && (
                                                                            <div className='close-container'>
                                                                                <div className='cursor-pointer' onClick={() => handleRemoveSundayHours(index)}>
                                                                                    <RxCross2 color='#000000' />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <Form.Group className='mb-3'>
                                                                            <FormControl
                                                                                type='time'
                                                                                name='end'
                                                                                className='mr-sm-2 form-control-hours'
                                                                                value={sunday?.end}
                                                                                onChange={e => handleChangeTimeSunday(e, index)}
                                                                            />
                                                                        </Form.Group>

                                                                    </Col>
                                                                </>
                                                            )}
                                                        </>
                                                    );
                                                })}

                                                {!isSundayChecked &&
                                                    <Col md="2" className="pl-0" >
                                                        <GoPlus
                                                            size={25}
                                                            className="plus-btn mt-2"
                                                            onClick={handleAddSundayHours}
                                                        />
                                                    </Col>
                                                }

                                            </Row>
                                        </Col >
                                    </Row>
                                    <hr className="mb-4 mt-2" />

                                    <Row>
                                        <Col lg="2">
                                            <h4 className="day-header">Monday</h4>
                                            <Form.Check
                                                type={`checkbox`}
                                                id={`schedule-monday`}
                                                label={`Closed`}
                                                name={`day`}
                                                checked={isMondayChecked}
                                                onChange={handleMondayCheckboxChangeClose}
                                            />
                                        </Col>
                                        <Col lg="5" className='d-flex justify-content-end'>
                                            <Row className="align-items-center">
                                                {mondayHoursFormData.map((monday, index) => {
                                                    return (
                                                        <>
                                                            {mondayHoursFormData.length > 0 && (
                                                                <>

                                                                    <Col md="5" className="pe-0 position-relative">
                                                                        <p className="hours-header">Opens at</p>
                                                                        <Form.Group className='mb-3'>
                                                                            <FormControl
                                                                                type='time'
                                                                                name='start'
                                                                                className='mr-sm-2 form-control-hours'
                                                                                value={monday?.start}
                                                                                onChange={e => handleChangeTimeMonday(e, index)}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>

                                                                    <Col md="5" className="pe-0 position-relative">
                                                                        <p className="hours-header">Closes at</p>
                                                                        {index > 0 && (
                                                                            <div className='close-container'>
                                                                                <div className='cursor-pointer' onClick={() => handleRemoveMondayHours(index)}>
                                                                                    <RxCross2 color='#000000' />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <Form.Group className='mb-3'>
                                                                            <FormControl
                                                                                type='time'
                                                                                name='end'
                                                                                className='mr-sm-2 form-control-hours'
                                                                                value={monday?.end}
                                                                                onChange={e => handleChangeTimeMonday(e, index)}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                </>
                                                            )}
                                                        </>
                                                    );
                                                })}

                                                {!isMondayChecked &&
                                                    <Col md="2" className="pl-0" >
                                                        <GoPlus
                                                            size={25}
                                                            className="plus-btn mt-2"
                                                            onClick={handleAddMondayHours}
                                                        />
                                                    </Col>
                                                }

                                            </Row>
                                        </Col>
                                    </Row>
                                    <hr className="mb-4 mt-2" />

                                    <Row>
                                        <Col lg="2">
                                            <h4 className="day-header">Tuesday</h4>
                                            <Form.Check
                                                type={`checkbox`}
                                                id={`schedule-tuesday`}
                                                label={`Closed`}
                                                name={`day`}
                                                checked={isTuesdayChecked}
                                                onChange={handleTuesdayCheckboxChangeClose}
                                            />
                                        </Col>

                                        <Col lg="5" className='d-flex justify-content-end'>
                                            <Row className="align-items-center">
                                                {tuesdayHoursFormData.map((tuesday, index) => {
                                                    return (
                                                        <>
                                                            {tuesdayHoursFormData.length > 0 && (
                                                                <>

                                                                    <Col md="5" className="pe-0 position-relative">
                                                                        <p className="hours-header">Opens at</p>
                                                                        <Form.Group className='mb-3'>
                                                                            <FormControl
                                                                                type='time'
                                                                                name='start'
                                                                                className='mr-sm-2 form-control-hours'
                                                                                value={tuesday?.start}
                                                                                onChange={e => handleChangeTimeTuesday(e, index)}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>

                                                                    <Col md="5" className="pe-0 position-relative">
                                                                        <p className="hours-header">Closes at</p>
                                                                        {index > 0 && (
                                                                            <div className='close-container'>
                                                                                <div className='cursor-pointer' onClick={() => handleRemoveTuesdayHours(index)}>
                                                                                    <RxCross2 color='#000000' />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <Form.Group className='mb-3'>
                                                                            <FormControl
                                                                                type='time'
                                                                                name='end'
                                                                                className='mr-sm-2 form-control-hours'
                                                                                value={tuesday?.end}
                                                                                onChange={e => handleChangeTimeTuesday(e, index)}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                </>
                                                            )}
                                                        </>
                                                    );
                                                })}

                                                {!isTuesdayChecked &&
                                                    <Col md="2" className="pl-0" >
                                                        <GoPlus
                                                            size={25}
                                                            className="plus-btn mt-2"
                                                            onClick={handleAddTuesdayHours}
                                                        />
                                                    </Col>
                                                }
                                            </Row>
                                        </Col>
                                    </Row>
                                    <hr className="mb-4 mt-2" />

                                    <Row>
                                        <Col lg="2">
                                            <h4 className="day-header">Wednesday</h4>
                                            <Form.Check
                                                type={`checkbox`}
                                                id={`schedule-wednesday`}
                                                label={`Closed`}
                                                name={`day`}
                                                checked={isWednesdayChecked}
                                                onChange={handleWednesdayCheckboxChangeClose}
                                            />
                                        </Col>
                                        <Col lg="5" className='d-flex justify-content-end'>
                                            <Row className="align-items-center">
                                                {wednesdayHoursFormData.map((wednesday, index) => {
                                                    return (
                                                        <>
                                                            {wednesdayHoursFormData.length > 0 && (
                                                                <>

                                                                    <Col md="5" className="pe-0 position-relative">
                                                                        <p className="hours-header">Opens at</p>
                                                                        <Form.Group className='mb-3'>
                                                                            <FormControl
                                                                                type='time'
                                                                                name='start'
                                                                                className='mr-sm-2 form-control-hours'
                                                                                value={wednesday?.start}
                                                                                onChange={e => handleChangeTimeWednesday(e, index)}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col md="5" className="pe-0 position-relative">
                                                                        <p className="hours-header">Closes at</p>
                                                                        {index > 0 && (
                                                                            <div className='close-container'>
                                                                                <div className='cursor-pointer' onClick={() => handleRemoveWednesdayHours(index)}>
                                                                                    <RxCross2 color='#000000' />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <Form.Group className='mb-3'>
                                                                            <FormControl
                                                                                type='time'
                                                                                name='end'
                                                                                className='mr-sm-2 form-control-hours'
                                                                                value={wednesday?.end}
                                                                                onChange={e => handleChangeTimeWednesday(e, index)}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>

                                                                </>
                                                            )}
                                                        </>
                                                    );
                                                })}

                                                {!isWednesdayChecked &&
                                                    <Col md="2" className="pl-0" >
                                                        <GoPlus
                                                            size={25}
                                                            className="plus-btn mt-2"
                                                            onClick={handleAddWednesdayHours}
                                                        />
                                                    </Col>
                                                }

                                            </Row >
                                        </Col>
                                    </Row>
                                    <hr className="mb-4 mt-2" />

                                    <Row>
                                        <Col lg="2">
                                            <h4 className="day-header">Thursday</h4>
                                            <Form.Check
                                                type={`checkbox`}
                                                id={`schedule-thursday`}
                                                label={`Closed`}
                                                name={`day`}
                                                checked={isThursdayChecked}
                                                onChange={handleThursdayCheckboxChangeClose}
                                            />
                                        </Col>
                                        <Col lg="5" className='d-flex justify-content-end'>
                                            <Row className="align-items-center">
                                                {thursdayHoursFormData.map((thursday, index) => {
                                                    return (
                                                        <>
                                                            {thursdayHoursFormData.length > 0 && (
                                                                <>

                                                                    <Col md="5" className="pe-0 position-relative">
                                                                        <p className="hours-header">Opens at</p>
                                                                        <Form.Group className='mb-3'>
                                                                            <FormControl
                                                                                type='time'
                                                                                name='start'
                                                                                className='mr-sm-2 form-control-hours'
                                                                                value={thursday?.start}
                                                                                onChange={e => handleChangeTimeThursday(e, index)}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col md="5" className="pe-0 position-relative">
                                                                        <p className="hours-header">Closes at</p>
                                                                        {index > 0 && (
                                                                            <div className='close-container'>
                                                                                <div className='cursor-pointer' onClick={() => handleRemoveThursdayHours(index)}>
                                                                                    <RxCross2 color='#000000' />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <Form.Group className='mb-3'>
                                                                            <FormControl
                                                                                type='time'
                                                                                name='end'
                                                                                className='mr-sm-2 form-control-hours'
                                                                                value={thursday?.end}
                                                                                onChange={e => handleChangeTimeThursday(e, index)}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>

                                                                </>
                                                            )}
                                                        </>
                                                    );
                                                })}

                                                {!isThursdayChecked &&
                                                    <Col md="2" className="pl-0" >
                                                        <GoPlus
                                                            size={25}
                                                            className="plus-btn mt-2"
                                                            onClick={handleAddThursdayHours}
                                                        />
                                                    </Col>
                                                }

                                            </Row>
                                        </Col>
                                    </Row>
                                    <hr className="mb-4 mt-2" />

                                    <Row>
                                        <Col lg="2">
                                            <h4 className="day-header">Friday</h4>
                                            <Form.Check
                                                type={`checkbox`}
                                                id={`schedule-friday`}
                                                label={`Closed`}
                                                name={`day`}
                                                checked={isFridayChecked}
                                                onChange={handleFridayCheckboxChangeClose}
                                            />
                                        </Col>
                                        <Col lg="5" className='d-flex justify-content-end'>
                                            <Row className="align-items-center">
                                                {fridayHoursFormData.map((friday, index) => {
                                                    return (
                                                        <>
                                                            {fridayHoursFormData.length > 0 && (
                                                                <>

                                                                    <Col md="5" className="pe-0 position-relative">
                                                                        <p className="hours-header">Opens at</p>
                                                                        <Form.Group className='mb-3'>
                                                                            <FormControl
                                                                                type='time'
                                                                                name='start'
                                                                                className='mr-sm-2 form-control-hours'
                                                                                value={friday?.start}
                                                                                onChange={e => handleChangeTimeFriday(e, index)}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col md="5" className="pe-0 position-relative">
                                                                        <p className="hours-header">Closes at</p>
                                                                        {index > 0 && (
                                                                            <div className='close-container'>
                                                                                <div className='cursor-pointer' onClick={() => handleRemoveFridayHours(index)}>
                                                                                    <RxCross2 color='#000000' />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <Form.Group className='mb-3'>
                                                                            <FormControl
                                                                                type='time'
                                                                                name='end'
                                                                                className='mr-sm-2 form-control-hours'
                                                                                value={friday?.end}
                                                                                onChange={e => handleChangeTimeFriday(e, index)}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>

                                                                </>
                                                            )}
                                                        </>
                                                    );
                                                })}

                                                {!isFridayChecked &&
                                                    <Col md="2" className="pl-0" >
                                                        <GoPlus
                                                            size={25}
                                                            className="plus-btn mt-2"
                                                            onClick={handleAddFridayHours}
                                                        />
                                                    </Col>
                                                }

                                            </Row >
                                        </Col>
                                    </Row>
                                    <hr className="mb-4 mt-2" />

                                    <Row>
                                        <Col lg="2">
                                            <h4 className="day-header">Saturday</h4>
                                            <Form.Check
                                                type={`checkbox`}
                                                id={`schedule-saturday`}
                                                label={`Closed`}
                                                name={`day`}
                                                checked={isSaturdayChecked}
                                                onChange={handleSaturdayCheckboxChangeClose}
                                            />
                                        </Col>
                                        <Col lg="5" className='d-flex justify-content-end'>

                                            <Row className="align-items-center">
                                                {saturdayHoursFormData.map((saturday, index) => {
                                                    return (
                                                        <>
                                                            {saturdayHoursFormData.length > 0 && (
                                                                <>
                                                                    {index > 0 && (
                                                                        <div className='w-100 d-flex justify-content-end mt-3'>
                                                                            <div className='cursor-pointer' onClick={() => handleRemoveSaturdayHours(index)}>
                                                                                <RxCross2 color='#000000' />
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    <Col md="5" className="pe-0 position-relative">
                                                                        <p className="hours-header">Opens at</p>
                                                                        <Form.Group className='mb-3'>
                                                                            <FormControl
                                                                                type='time'
                                                                                name='start'
                                                                                className='mr-sm-2 form-control-hours'
                                                                                value={saturday?.start}
                                                                                onChange={e => handleChangeTimeSaturday(e, index)}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col md="5" className="pe-0 position-relative">
                                                                        <p className="hours-header">Closes at</p>
                                                                        <Form.Group className='mb-3'>
                                                                            <FormControl
                                                                                type='time'
                                                                                name='end'
                                                                                className='mr-sm-2 form-control-hours'
                                                                                value={saturday?.end}
                                                                                onChange={e => handleChangeTimeSaturday(e, index)}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                </>
                                                            )}
                                                        </>
                                                    );
                                                })}

                                                {!isSaturdayChecked &&
                                                    <Col md="2" className="pl-0">
                                                        <GoPlus
                                                            size={25}
                                                            className="plus-btn mt-2"
                                                            onClick={handleAddSaturdayHours}
                                                        />
                                                    </Col>
                                                }
                                            </Row>
                                        </Col>
                                    </Row>

                                    <div className="text-right mt-3 mb-2">
                                        {formStatus ?
                                            <Button type='button' className="btn-save">Saving...</Button>
                                        :
                                            <Button 
                                            type='button' 
                                            // onClick={BusinessHoursSubmitPost}
                                            onClick={() => {
                                                if (!times.length) {
                                                    BusinessHoursSubmitPost()
                                                } else {
                                                    BusinessHoursSubmitPut()
                                                }
                    
                                            }}  
                                            className="btn-save"
                                            >
                                                Next
                                                </Button>
                                        }
                                    </div>
                                </Col>
                            </Row>
        </>
    )
}

export default SetAvailability;
