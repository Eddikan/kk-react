import React, { useEffect, useState } from 'react';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import '../Assets/styles/DesignerCalendar/style.css'
import { useCookies } from 'react-cookie';
import { RxCross2 } from "react-icons/rx";
import Sidebar from 'Components/Shared/Sidebar';
import { GoPlus } from "react-icons/go";
import { PiTrashThin } from "react-icons/pi";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";
import MyCalendar from 'Components/Shared/MyCalendar';
import axios from "axios";
import toast from 'react-hot-toast';


const initialBusinessHours = {
    opens_at: '',
    closes_at: ''
};

const initialAppointments = {
    title: '',
};

const ToastCss = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

const SellerCenter = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const [designerBusinessHoursModalShow, setDesignerBusinessHoursModalShow] = useState(false);
    const [appointmentModalShow, setAppointmentModalShow] = useState(false);

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
    const [appointmentFormData, setAppointmentFormData] = useState(initialAppointments);

    const [times, setTimes] = useState([initialBusinessHours]);


    const [reloadCount, setReloadCount] = useState(0);
    const [formStatus, setFormStatus] = useState('standby');

    const postSetAppointment = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + '/#', data);
    };

    const handleShowDesignerBusinessHoursModal = () => {
        setDesignerBusinessHoursModalShow(true);
    }

    const handleShowAppointmentModal = () => {
        setAppointmentModalShow(true);
    }

    const handleAppointments = () => {
        setTimes(prevtimes => [
            ...prevtimes,
            initialAppointments
        ]);
    }

    const handleRemoveAppointment = (index) => {
        setTimes((prevtimes) => {
            const updatedTimes = [...prevtimes];
            updatedTimes.splice(index, 1);

            return updatedTimes;
        });
    }

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

    //* This will close the fields when you click the checkbox *//
    const handleSundayCheckboxChangeClose = () => {
        setIsSundayChecked(!isSundayChecked);

        if (!isSundayChecked) {
            setSundayHoursFormData([]);
        } else {
            setSundayHoursFormData([sundayHoursFormData]);
        }
    };

    const handleMondayCheckboxChangeClose = () => {
        setIsMondayChecked(!isMondayChecked);

        if (!isMondayChecked) {
            setMondayHoursFormData([]);
        } else {
            setMondayHoursFormData([mondayHoursFormData]);
        }
    };

    const handleTuesdayCheckboxChangeClose = () => {
        setIsTuesdayChecked(!isTuesdayChecked);

        if (!isTuesdayChecked) {
            setTuesdayHoursFormData([]);
        } else {
            setTuesdayHoursFormData([tuesdayHoursFormData]);
        }
    };

    const handleWednesdayCheckboxChangeClose = () => {
        setIsWednesdayChecked(!isWednesdayChecked);

        if (!isWednesdayChecked) {
            setWednesdayHoursFormData([]);
        } else {
            setWednesdayHoursFormData([wednesdayHoursFormData]);
        }
    };

    const handleThursdayCheckboxChangeClose = () => {
        setIsThursdayChecked(!isThursdayChecked);

        if (!isThursdayChecked) {
            setThursdayHoursFormData([]);
        } else {
            setThursdayHoursFormData([thursdayHoursFormData]);
        }
    };

    const handleFridayCheckboxChangeClose = () => {
        setIsFridayChecked(!isFridayChecked);

        if (!isFridayChecked) {
            setFridayHoursFormData([]);
        } else {
            setFridayHoursFormData([fridayHoursFormData]);
        }
    };

    const handleSaturdayCheckboxChangeClose = () => {
        setIsSaturdayChecked(!isSaturdayChecked);

        if (!isSaturdayChecked) {
            setSaturdayHoursFormData([]);
        } else {
            setSaturdayHoursFormData([saturdayHoursFormData]);
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

    const addAppointmentSubmit = (e) => {
        e.preventDefault();
        setFormStatus('loading');
        postSetAppointment({ ...appointmentFormData, times: times }).then(response => {
            const status = response.data.status;
            if (status === "Success") {
                setFormStatus('standby');
                setReloadCount(reloadCount + 1);
                setAppointmentModalShow(false);
                setAppointmentFormData(initialAppointments);
                toast.success('Appointment added successfully!');
            } else {
                setFormStatus('standby');
                toast.error('There has been an error saving the appointment, please try again!');
            }
        }).catch(() => {
            toast.error('There has been an error saving the appointment, please try again!');
        });
    }

    useEffect(() => {
        document.body.classList.add('designer-calendar-body');
    }, []);

    const handleChangeAppointment = (e) => {
        const { name, value } = e.target;
        setAppointmentFormData({
            ...appointmentFormData,
            [name]: value,
        });
    }

    const handleChangeTime = (e, index) => {
        const { name, value } = e.target;
        setTimes(prevtimes => {
            const updatedTimes = [...prevtimes];
            updatedTimes[index] = {
                ...updatedTimes[index],
                [name]: value,
            };

            return updatedTimes;
        });
    };


    return (
        <LayoutNoFooter>
            <Sidebar />
            <section>
                <Container>
                    <Row>
                        <Col lg={2}></Col>
                        <Col lg={10} className="designer-calendar-container">
                            <Row className="pb-4">
                                <Col md={6} className='d-flex justify-content-left align-items-center'>
                                    <h3 className="fs-30 fw-600 text-black mb-0">My Calendar</h3>
                                </Col>
                                <Col md={6} className="text-right">
                                    <button className="btn-primary btn me-2" onClick={handleShowAppointmentModal}>Appointment</button>
                                    <button className="btn-primary btn" onClick={handleShowDesignerBusinessHoursModal}>Settings</button>
                                </Col>
                            </Row>
                            <div className="calendar-container">
                                <MyCalendar
                                // calendarAppointment={calendarAppointment}
                                />
                            </div>

                        </Col>
                    </Row>
                </Container>
            </section>

            <Modal show={designerBusinessHoursModalShow} onHide={() => setDesignerBusinessHoursModalShow(false)} id="business-hours-modal">
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className="h-100">
                        <Row className="h-100">
                            <Col lg="12">
                                <h3 className="text-center header mb-5">Business Hours</h3>
                            </Col>
                            <Col lg="12" className="">

                                <Row>
                                    <Col lg="2">
                                        <h4 className="day-header">Sunday</h4>
                                        <Form.Check // prettier-ignore
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
                                                                {index > 0 && (
                                                                    <div className='w-100 d-flex justify-content-end mt-3'>
                                                                        <div className='cursor-pointer' onClick={() => handleRemoveSundayHours(index)}>
                                                                            <RxCross2 color='#000000' />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <Col md="5" className="pe-0">
                                                                    <p className="hours-header">Opens at</p>
                                                                    <Form.Group className='mb-3'>
                                                                        <FormControl type='time' name='opens_at' className='mr-sm-2 form-control-hours' />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col md="5" className="pe-0">
                                                                    <p className="hours-header">Closes at</p>
                                                                    <Form.Group className='mb-3'>
                                                                        <FormControl type='time' name='closes_at' className='mr-sm-2 form-control-hours' />
                                                                    </Form.Group>
                                                                </Col>

                                                            </>
                                                        )}
                                                    </>
                                                );
                                            })}
                                            <Col md="2" className="pl-0" >
                                                <GoPlus
                                                    size={25}
                                                    className="plus-btn mt-2"
                                                    onClick={handleAddSundayHours}
                                                />
                                            </Col>
                                        </Row>
                                    </Col >
                                </Row>
                                <hr class="mb-4 mt-2" />

                                <Row>
                                    <Col lg="2">
                                        <h4 className="day-header">Monday</h4>
                                        <Form.Check
                                            type={`checkbox`}
                                            id={`schedule-sunday`}
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
                                                                {index > 0 && (
                                                                    <div className='w-100 d-flex justify-content-end mt-3'>
                                                                        <div className='cursor-pointer' onClick={() => handleRemoveMondayHours(index)}>
                                                                            <RxCross2 color='#000000' />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <Col md="5" className="pe-0">
                                                                    <p className="hours-header">Opens at</p>
                                                                    <Form.Group className='mb-3'>
                                                                        <FormControl type='time' name='opens_at' className='mr-sm-2 form-control-hours' />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col md="5" className="pe-0">
                                                                    <p className="hours-header">Closes at</p>
                                                                    <Form.Group className='mb-3'>
                                                                        <FormControl type='time' name='closes_at' className='mr-sm-2 form-control-hours' />
                                                                    </Form.Group>
                                                                </Col>
                                                            </>
                                                        )}
                                                    </>
                                                );
                                            })}
                                            <Col md="2" className="pl-0" >
                                                <GoPlus
                                                    size={25}
                                                    className="plus-btn mt-2"
                                                    onClick={handleAddMondayHours}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <hr class="mb-4 mt-2" />

                                <Row>
                                    <Col lg="2">
                                        <h4 className="day-header">Tuesday</h4>
                                        <Form.Check
                                            type={`checkbox`}
                                            id={`schedule-sunday`}
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

                                                                {index > 0 && (
                                                                    <div className='w-100 d-flex justify-content-end mt-3'>
                                                                        <div className='cursor-pointer' onClick={() => handleRemoveTuesdayHours(index)}>
                                                                            <RxCross2 color='#000000' />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <Col md="5" className="pe-0">
                                                                    <p className="hours-header">Opens at</p>
                                                                    <Form.Group className='mb-3'>
                                                                        <FormControl type='time' name='opens_at' className='mr-sm-2 form-control-hours' />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col md="5" className="pe-0">
                                                                    <p className="hours-header">Closes at</p>
                                                                    <Form.Group className='mb-3'>
                                                                        <FormControl type='time' name='closes_at' className='mr-sm-2 form-control-hours' />
                                                                    </Form.Group>
                                                                </Col>

                                                            </>
                                                        )}
                                                    </>
                                                );
                                            })}
                                            <Col md="2" className="pl-0" >
                                                <GoPlus
                                                    size={25}
                                                    className="plus-btn mt-2"
                                                    onClick={handleAddTuesdayHours}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <hr class="mb-4 mt-2" />

                                <Row>
                                    <Col lg="2">
                                        <h4 className="day-header">Wednesday</h4>
                                        <Form.Check
                                            type={`checkbox`}
                                            id={`schedule-sunday`}
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

                                                                {index > 0 && (
                                                                    <div className='w-100 d-flex justify-content-end mt-3'>
                                                                        <div className='cursor-pointer' onClick={() => handleRemoveWednesdayHours(index)}>
                                                                            <RxCross2 color='#000000' />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <Col md="5" className="pe-0">
                                                                    <p className="hours-header">Opens at</p>
                                                                    <Form.Group className='mb-3'>
                                                                        <FormControl type='time' name='opens_at' className='mr-sm-2 form-control-hours' />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col md="5" className="pe-0">
                                                                    <p className="hours-header">Closes at</p>
                                                                    <Form.Group className='mb-3'>
                                                                        <FormControl type='time' name='closes_at' className='mr-sm-2 form-control-hours' />
                                                                    </Form.Group>
                                                                </Col>

                                                            </>
                                                        )}
                                                    </>
                                                );
                                            })}
                                            <Col md="2" className="pl-0" >
                                                <GoPlus
                                                    size={25}
                                                    className="plus-btn mt-2"
                                                    onClick={handleAddWednesdayHours}
                                                />
                                            </Col>
                                        </Row >
                                    </Col>
                                </Row>
                                <hr class="mb-4 mt-2" />

                                <Row>
                                    <Col lg="2">
                                        <h4 className="day-header">Thursday</h4>
                                        <Form.Check
                                            type={`checkbox`}
                                            id={`schedule-sunday`}
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

                                                                {index > 0 && (
                                                                    <div className='w-100 d-flex justify-content-end mt-3'>
                                                                        <div className='cursor-pointer' onClick={() => handleRemoveThursdayHours(index)}>
                                                                            <RxCross2 color='#000000' />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <Col md="5" className="pe-0">
                                                                    <p className="hours-header">Opens at</p>
                                                                    <Form.Group className='mb-3'>
                                                                        <FormControl type='time' name='opens_at' className='mr-sm-2 form-control-hours' />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col md="5" className="pe-0">
                                                                    <p className="hours-header">Closes at</p>
                                                                    <Form.Group className='mb-3'>
                                                                        <FormControl type='time' name='closes_at' className='mr-sm-2 form-control-hours' />
                                                                    </Form.Group>
                                                                </Col>

                                                            </>
                                                        )}
                                                    </>
                                                );
                                            })}
                                            <Col md="2" className="pl-0" >
                                                <GoPlus
                                                    size={25}
                                                    className="plus-btn mt-2"
                                                    onClick={handleAddThursdayHours}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <hr class="mb-4 mt-2" />

                                <Row>
                                    <Col lg="2">
                                        <h4 className="day-header">Friday</h4>
                                        <Form.Check
                                            type={`checkbox`}
                                            id={`schedule-sunday`}
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

                                                                {index > 0 && (
                                                                    <div className='w-100 d-flex justify-content-end mt-3'>
                                                                        <div className='cursor-pointer' onClick={() => handleRemoveFridayHours(index)}>
                                                                            <RxCross2 color='#000000' />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <Col md="5" className="pe-0">
                                                                    <p className="hours-header">Opens at</p>
                                                                    <Form.Group className='mb-3'>
                                                                        <FormControl type='time' name='opens_at' className='mr-sm-2 form-control-hours' />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col md="5" className="pe-0">
                                                                    <p className="hours-header">Closes at</p>
                                                                    <Form.Group className='mb-3'>
                                                                        <FormControl type='time' name='closes_at' className='mr-sm-2 form-control-hours' />
                                                                    </Form.Group>
                                                                </Col>

                                                            </>
                                                        )}
                                                    </>
                                                );
                                            })}
                                            <Col md="2" className="pl-0" >
                                                <GoPlus
                                                    size={25}
                                                    className="plus-btn mt-2"
                                                    onClick={handleAddFridayHours}
                                                />
                                            </Col>
                                        </Row >
                                    </Col>
                                </Row>
                                <hr class="mb-4 mt-2" />

                                <Row>
                                    <Col lg="2">
                                        <h4 className="day-header">Saturday</h4>
                                        <Form.Check
                                            type={`checkbox`}
                                            id={`schedule-sunday`}
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

                                                                <Col md="5" className="pe-0">
                                                                    <p className="hours-header">Opens at</p>
                                                                    <Form.Group className='mb-3'>
                                                                        <FormControl type='time' name='opens_at' className='mr-sm-2 form-control-hours' />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col md="5" className="pe-0">
                                                                    <p className="hours-header">Closes at</p>
                                                                    <Form.Group className='mb-3'>
                                                                        <FormControl type='time' name='closes_at' className='mr-sm-2 form-control-hours' />
                                                                    </Form.Group>
                                                                </Col>
                                                            </>
                                                        )}
                                                    </>
                                                );
                                            })}
                                            <Col md="2" className="pl-0">
                                                <GoPlus
                                                    size={25}
                                                    className="plus-btn mt-2"
                                                    onClick={handleAddSaturdayHours}
                                                />
                                            </Col>
                                        </Row>

                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn-cancel" variant="primary" onClick={() => setDesignerBusinessHoursModalShow(false)}>Cancel</Button>
                    <Button className="btn-primary" variant="primary">Save</Button>
                </Modal.Footer>
            </Modal >

            <Modal show={appointmentModalShow}>
                <Modal.Header>
                    <Modal.Title className='set-appointment'>Set Appointment</Modal.Title>
                    <AiOutlineClose role='button' onClick={() => setAppointmentModalShow(false)} />
                </Modal.Header>
                <Form onSubmit={addAppointmentSubmit}>
                    <Modal.Body className="pb-0 pt-2">
                        <Row>
                            <Col lg="12" className='mb-2'>
                                <span className='title-appointment'>Title</span>
                            </Col>

                            <Col lg="12">
                                <input
                                    type="text"
                                    name="title"
                                    className='form-control'
                                    value={appointmentFormData?.title}
                                    onChange={handleChangeAppointment}
                                />
                            </Col>

                            <Col lg="8">
                                <Row className="align-items-center mt-4 mb-3">
                                    {times.map((time, index) => {
                                        return (
                                            <>
                                                {times.length > 0 && (
                                                    <>
                                                        {index > 0 && (
                                                            <div className='w-100 d-flex justify-content-end mt-3'>
                                                                <div className='cursor-pointer' onClick={() => handleRemoveAppointment(index)}>
                                                                    <RxCross2 color='#000000' />
                                                                </div>
                                                            </div>
                                                        )}

                                                        <Col md="5" className="pe-0">
                                                            <p className="hours-header mb-2">Opens at</p>
                                                            <Form.Group className='mb-3'>
                                                                <FormControl
                                                                    type='time'
                                                                    name='opens_at'
                                                                    className='mr-sm-2 form-control-hours'
                                                                    value={time?.opens_at}
                                                                    onChange={e => handleChangeTime(e, index)}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md="5" className="pe-0">
                                                            <p className="hours-header mb-2">Closes at</p>
                                                            <Form.Group className='mb-3'>
                                                                <FormControl
                                                                    type='time'
                                                                    name='closes_at'
                                                                    className='mr-sm-2 form-control-hours'
                                                                    value={time?.closes_at}
                                                                    onChange={e => handleChangeTime(e, index)}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                    </>
                                                )}
                                            </>
                                        );
                                    })}
                                    <Col md="2" className="pl-0">
                                        <GoPlus
                                            size={25}
                                            className="plus-btn mt-2"
                                            onClick={handleAppointments}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className='text-right modal-footer-border'>

                        <button
                            type="button"
                            className="cancel-btn btn"
                            onClick={() => setAppointmentModalShow(false)}>

                            Cancel
                        </button>

                        {formStatus !== "standby" ?
                            <button
                                className='btn btn-save'
                                type='button'
                            >
                                Saving...
                            </button>
                            :
                            <button
                                className='btn btn-save'
                                type='submit'
                            >
                                Save
                            </button>
                        }
                    </Modal.Footer>
                </Form>
            </Modal>

        </LayoutNoFooter >
    );
};

export default SellerCenter;