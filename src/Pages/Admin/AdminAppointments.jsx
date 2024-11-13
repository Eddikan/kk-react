import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Modal, Card, ModalFooter, ModalHeader } from 'react-bootstrap';
import 'Assets/styles/DesignerCalendar/style.css';
import 'Assets/styles/Appointments/style.css';
import { useCookies } from 'react-cookie';
import { GoAlertFill } from 'react-icons/go';
import { BiSolidPencil } from "react-icons/bi";
import { AiFillDelete, AiFillMessage } from "react-icons/ai";
import { IoCloseOutline, IoEye } from 'react-icons/io5';
import { IoMdVideocam } from 'react-icons/io';
import Pagination from 'Components/Pagination/Pagination';
import AdminSidebar from 'Components/Shared/AdminSidebar';
import LayoutAdmin from 'Components/Layout/LayoutAdmin';
import LoadingPage from 'Components/Shared/LoadingPage';
import UserPlaceholder from 'Assets/images/user.png';
import GoBack from 'Components/Shared/GoBack';
import 'Assets/styles/AdminAppointments/style.css';
import MeetingChat from 'Components/Chat/MeetingChat';
import toast from 'react-hot-toast';
import axios from "axios";

const intitialConsultationData = {
    consultation_date_time: '',
    consultation_hour_start: '',
    consultation_hour_end: '',
    consultation_date: '',
    email: '',
    first_name: '',
    last_name: '',
    timezone: '',
    consultation_details: '',
}

const initialAppointments = {
    consultation_date_time: '',
    consultation_hour_start: '',
    consultation_hour_end: '',
    consultation_date: '',
    email: '',
    first_name: '',
    last_name: '',
    timezone: '',
    consultation_details: '',
};

const AdminAppointments = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const userDetails = cookies.userDetails;
    const [appointmentId, setAppointmentId] = useState('');
    const [reloadCount, setReloadCount] = useState(0);
    const [chatBox, setChatBox] = useState(false);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [customer, setCustomer] = useState('');
    const [saveLoading, setSaveLoading] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [appointmentEditModal, setAppointmentEditModal] = useState(false);
    const [appointmentCancelModal, setAppointmentCancelModal] = useState(false);
    const [appointmentLoading, setAppointmentLoading] = useState(true);
    const [appointmentEditId, setAppointmentEditId] = useState('');
    const [times, setTimes] = useState([initialAppointments]);
    const [currentTimezone, setCurrentTimezone] = useState(null);
    const [consultationFormData, setConsultationFormData] = useState(intitialConsultationData);
    const [cancellationReason, setCancellationReason] = useState('');

    const consultationDateTimeString = "2024-02-22T16:11:00.000Z";
    const consultationDateTime = new Date(consultationDateTimeString);
    const currentDate = new Date().toISOString().split('T')[0];
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(1);

    let PageSize = 10;

    const getAppointments = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'appointment');
    };

    const putReschedule = async (data) => {
        return await axios.put(process.env.REACT_APP_API_ENDPOINT + 'designer/appointment/' + appointmentEditId, data);
    };

    const toggleEditAppointmentModal = (id) => {
        setAppointmentEditId(id);
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'appointment/' + id).then(response => {
            const result = response.data.data;
            setConsultationFormData(result);
        })
        setAppointmentEditModal(true);
    };

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    };

    function toggleChatbox(id, first_name, last_name, image, message) {
        setChatBox(true);
        setAppointmentId(id.toString());
        setCustomer({
            id: id ?? 0,
            first_name: first_name ?? '-',
            last_name: last_name ?? '-',
            image: image ?? '-'
        });
        setModalHeading(message);
    }

    function handleOnEnter(text) {
        console.log('enter', text)
    }

    const handleChangeConsultation = (e) => {
        const { name, value } = e.target;
        setConsultationFormData({
            ...consultationFormData,
            [name]: value,
        });
    }

    const toggleCancelAppointmentModal = (id) => {
        setAppointmentCancelModal(true);
        setAppointmentEditId(id)
    }

    const handleChangeCancellation = (e) => {
        const { name, value } = e.target;
        setCancellationReason(value);
    }

    const convert24hrTo12hr = (time24hr) => {
        const [hours, minutes] = time24hr.split(':');
        const date = new Date(2000, 0, 1, hours, minutes);
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    const saveReScheduleSubmit = (e) => {
        setSaveLoading(true);
        e.preventDefault();
        setAppointmentEditId();
        putReschedule({ ...consultationFormData }).then(response => {
            const success = response.data.status;
            if (success == success) {
                setConsultationFormData(consultationFormData);
                setAppointmentEditModal(false);
                setReloadCount(reloadCount + 1);
                toast.success('Schedule updated successfully!');
                setSaveLoading(false);
            } else {
                toast.error('There has been an error editing the schedule, please try again!');
                setSaveLoading(false);
            }
        }).catch(() => {
            toast.error('There has been an error editing the schedule, please try again!');
            setSaveLoading(false);
        });
    }

    const saveCancellation = (e) => {
        if (cancellationReason != "") {
            setSaveLoading(true);
            e.preventDefault();
            setAppointmentEditId();
            putReschedule({ cancellation_reason: cancellationReason, status: 'Cancelled' }).then(response => {
                const success = response.data.status;
                if (success == success) {
                    setAppointmentCancelModal(false);
                    setReloadCount(reloadCount + 1);
                    toast.success('Schedule cancelled successfully!');
                    setSaveLoading(false);
                    setCancellationReason('');
                } else {
                    toast.error('There has been an error editing the schedule, please try again!');
                    setSaveLoading(false);
                }
            }).catch(() => {
                toast.error('There has been an error editing the schedule, please try again!');
                setSaveLoading(false);
            });
        } else {
            toast.error('Please fill up cancellation reason!');
        }
    }

    const handleChangePage = (pageNumber) => {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'appointment?page=' + pageNumber + '&user_id=' + currentUser)
            .then((response) => {
                const data = response.data;
                const result = data.data;
                setCurrentPage(pageNumber);
                const selectedAppointments = response.data.data.data;
                if (selectedAppointments) {
                    setAppointments(selectedAppointments);
                    setCurrentPage(() => data.meta.current_page);
                    setPageCount(() => data.meta.total);
                    setPageSize(() => data.meta.per_page);
                    setAppointmentLoading(false);
                } else {
                    setAppointmentLoading(false);
                    toast.error('There has been an error getting the appointments, please try again!');
                }
            }).catch(error => {
                setAppointmentLoading(false);
                toast.error('There has been an error getting the appointments, please try again!');
            });
    };

    useEffect(() => {
        if (currentUser) {
            getAppointments()
                .then((response) => {
                    setAppointmentLoading(false);
                    const selectedAppointments = response.data.data.data;
                    if (selectedAppointments) {
                        setAppointments(selectedAppointments);
                        setPageCount(() => response.data.meta.total);
                    } else {
                        toast.error('There has been an error getting the appointments, please try again!');
                        setAppointmentLoading(false);
                    }
                })
                .catch((error) => {
                    toast.error('There has been an error getting the appointments, please try again!');
                    setAppointmentLoading(false);
                });
        }
    },[reloadCount]);

    useEffect(() => {
        const getTimezone = () => {
            const timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
            setCurrentTimezone(timezone);
        };
        getTimezone();
    }, []);

    useEffect(() => {
        document.body.classList.add('designer-calendar-body');
    }, []);

    return (
        <LayoutAdmin>
            {appointmentLoading ?
                <LoadingPage />
                :
                <>
                    <section className='bg-sellers'>
                        <Container fluid>
                            <Row>
                                <Col lg={2} className='p-0'>
                                    <AdminSidebar />
                                </Col>

                                <Col lg={10} className='py-5 mx-auto max-width-column padding-right-admin'>
                                    <Row>
                                        <Col lg={12}>
                                            <Row className="pb-4">
                                                <Col md={6} className='d-flex justify-content-left align-items-center'>
                                                    <h3 className="fs-30 fw-600 text-black mb-0">Appointments</h3>
                                                </Col>
                                                <Col md={6} className="text-right">
                                                    <GoBack fallBack="/#" />
                                                </Col>
                                            </Row>
                                        </Col>

                                        <Col lg={12}>
                                            <Card>
                                                <Card.Body className='bg-light'>
                                                    <Row>
                                                        <Col lg={4}>
                                                            <span className='fw-500'>Fashion Designer</span>
                                                        </Col>

                                                        <Col lg={4}>
                                                            <span className='fw-500'>Appointment Date & Time</span>
                                                        </Col>

                                                        <Col lg={2}>
                                                            <span className='fw-500'>Status</span>
                                                        </Col>

                                                        <Col lg={2}>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <>
                                            {appointments ?
                                                <>
                                                    {appointments.length > 0 ?
                                                        <>
                                                            {appointments.map((appointment) => {

                                                                const options = {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                };
                                                                const today = (new Date(appointment.created_at)).toLocaleDateString('en-ES', options);
                                                                const formattedDate = (new Date(appointment.consultation_date)).toLocaleString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    timeZone: 'UTC',
                                                                });

                                                                return (
                                                                    <Col lg={12}>
                                                                        <Card className='mt-3'>
                                                                            <Card.Body >
                                                                                <Row className="align-items-center">
                                                                                    <Col lg={4}>
                                                                                        <div className='d-flex appointment-user-image'>
                                                                                            {appointment.designer?.image != '' && appointment.designer?.image != null ? (
                                                                                                <div
                                                                                                    className='user-photo-appointment'
                                                                                                    style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${appointment.designer?.image})` }}
                                                                                                >
                                                                                                </div>
                                                                                            ) : (
                                                                                                <img src={UserPlaceholder} className='placeholder-img' alt="User Placeholder" />
                                                                                            )}

                                                                                            <div>
                                                                                                <span className='d-flex ms-3 mt-0 mb-1 fs-18 text-black fw-500'>
                                                                                                    {appointment.designer?.first_name}
                                                                                                    &nbsp;
                                                                                                    {appointment.designer?.last_name}
                                                                                                </span>
                                                                                                <div className='ms-3 fs-16 text-black'>
                                                                                                    <span className='me-1'>Created:</span>&nbsp;{today}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </Col>

                                                                                    <Col lg={4}>
                                                                                        <span className='text-black'>{formattedDate} at {convert24hrTo12hr(appointment.consultation_hour_start)}</span>
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>{appointment.status}</span>
                                                                                    </Col>

                                                                                    <Col lg={2} className='d-flex justify-content-end'>
                                                                                        {appointment.status != "Cancelled" ?
                                                                                            <>
                                                                                                {currentDate !== appointment.consultation_date ? (
                                                                                                    <>
                                                                                                        {appointment.consultation_date < currentDate ? (
                                                                                                            <div className=" appointments-tooltip">
                                                                                                                {/* <span className="icon-tooltiptext fs-14">Unavailable to Edit</span> */}
                                                                                                                <BiSolidPencil className='video-cam me-3' color='#0000005c' size={20} />
                                                                                                            </div>
                                                                                                        ) : (
                                                                                                            <Link to={`/designer/${appointment.designer.designer_id}/appointment/schedule/${appointment.id}`}>
                                                                                                            <div
                                                                                                                className="cursor-pointer appointments-tooltip"
                                                                                                                // onClick={() => toggleEditAppointmentModal(appointment.id)}
                                                                                                            >
                                                                                                                <span className="icon-tooltiptext fs-14">Reschedule</span>
                                                                                                                <BiSolidPencil className='video-cam me-3' size={20} color='#000000' />
                                                                                                            </div>
                                                                                                            </Link>
                                                                                                        )}
                                                                                                    </>
                                                                                                ) :
                                                                                                    <>
                                                                                                        <div className=" appointments-tooltip" disabled>
                                                                                                            {/* <span className="icon-tooltiptext fs-14">Unavailable to Edit</span> */}
                                                                                                            <BiSolidPencil className='video-cam me-3' color='#0000005c' size={20} />
                                                                                                        </div>
                                                                                                    </>
                                                                                                }

                                                                                                {/* {currentDate === appointment.consultation_date ? ( */}
                                                                                                <a href={`/consultation-meeting/${appointment.id}`}>
                                                                                                    <div className="cursor-pointer appointments-tooltip">
                                                                                                        <span className="icon-tooltiptext fs-14">Video call</span>
                                                                                                        <IoMdVideocam className='video-cam me-3' size={20} color='#000000' />
                                                                                                    </div>
                                                                                                </a>


                                                                                                {/* // ) : (
                                                                                        //     currentDate < appointment.consultation_date ? (
                                                                                        //         <div className="cursor-pointer appointments-tooltip">
                                                                                        //             <span className="icon-tooltiptext fs-14">Not time for video conferencing</span>
                                                                                        //             <IoMdVideocam className='video-cam me-3' color='#0000005c' size={20} />
                                                                                        //         </div>
                                                                                        //     ) : (
                                                                                        //         <div className="cursor-pointer appointments-tooltip">
                                                                                        //             <span className="icon-tooltiptext fs-14">This video conferencing is finished</span>
                                                                                        //             <IoMdVideocam className='video-cam me-3' color='#0000005c' size={20} />
                                                                                        //         </div>
                                                                                        //     )
                                                                                        // )} */}

                                                                                                <div className="cursor-pointer appointments-tooltip me-3"
                                                                                                    onClick={function () {
                                                                                                        toggleChatbox(
                                                                                                            appointment.id,
                                                                                                            appointment.designer?.first_name,
                                                                                                            appointment.designer?.last_name,
                                                                                                            appointment.designer?.image,
                                                                                                            "Under Construction");
                                                                                                    }}
                                                                                                >
                                                                                                    <span className="icon-tooltiptext fs-14">Message Designer</span>
                                                                                                    <span><AiFillMessage className='video-cam' size={20} color='#000000' /></span>
                                                                                                </div>

                                                                                                <div
                                                                                                    className="cursor-pointer appointments-tooltip"
                                                                                                    onClick={() => toggleCancelAppointmentModal(appointment.id)}
                                                                                                >
                                                                                                    <span className="icon-tooltiptext fs-14">Cancel</span>
                                                                                                    <AiFillDelete className='video-cam' size={20} color='#000000' />
                                                                                                </div>
                                                                                            </>
                                                                                            :
                                                                                            <>
                                                                                                <div className="appointments-tooltip me-3" disabled>
                                                                                                    <BiSolidPencil className='video-cam' color='#0000005c' size={20} />
                                                                                                </div>
                                                                                                <div className="appointments-tooltip me-3" disabled>
                                                                                                    <IoMdVideocam className='video-cam' color='#0000005c' size={20} />
                                                                                                </div>
                                                                                                <div className="appointments-tooltip me-3" disabled>
                                                                                                    <AiFillMessage className='video-cam' color='#0000005c' size={20} />
                                                                                                </div>
                                                                                                <div className="appointments-tooltip" disabled>
                                                                                                    <AiFillDelete className='video-cam' color='#0000005c' size={20} />
                                                                                                </div>
                                                                                            </>
                                                                                        }

                                                                                    </Col>
                                                                                </Row>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    </Col>
                                                                );
                                                            })}
                                                        </>
                                                        :
                                                        <>
                                                            <Col lg={12}>
                                                                <Card className='mt-3'>
                                                                    <Card.Body>
                                                                        <p className="text-center mb-0">No records found.</p>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        </>
                                                    }
                                                </>
                                                :
                                                <>
                                                    <Col lg={12}>
                                                        <Card className='mt-3'>
                                                            <Card.Body>
                                                                <p className="text-center mb-0">No records found.</p>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                </>
                                            }
                                        </>

                                        <Pagination
                                            className="pagination-bar mt-4 mb-0"
                                            currentPage={currentPage}
                                            totalCount={pageCount}
                                            pageSize={PageSize}
                                            onPageChange={page => handleChangePage(page)}
                                        />
                                    </Row>

                                </Col>
                            </Row>

                            {chatBox ?
                                <>
                                    <Card className='width-chat-card px-0'>
                                        <Card.Header className='header-chat bg-white'>
                                            <div className='d-flex justify-content-between'>
                                                <div className='d-flex align-items-center'>
                                                    <span className='fw-500'>{customer.first_name} {customer.last_name}</span>
                                                    {/* <span className='ms-2 active-now fs-14 fw-400'>Active Now</span> */}
                                                </div>
                                                <div className="cursor-pointer" onClick={() => setChatBox(false)}>
                                                    <IoCloseOutline color="#7e7e7e" size={25} />
                                                </div>
                                            </div>
                                        </Card.Header>
                                        <Card.Body >
                                            <MeetingChat
                                                currentUser={currentUser}
                                                appointmentId={appointmentId}
                                                user={userDetails}
                                            />
                                        </Card.Body>
                                    </Card>
                                </>
                                :
                                null
                            }
                        </Container>
                    </section>
                </>
            }

            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={() => setUnderConstructionShow(false)}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-1' />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='fs-22 rufina-family mb-3'>{modalHeading}</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>

            <Modal
                show={appointmentEditModal}
                className='modal-preview'
                fade={false}
                centered
            >
                <div>
                    <ModalHeader className='pb-0'>
                        <button
                            type='button'
                            className='close react-modal-close'
                            onClick={() => setAppointmentEditModal(false)}
                        >
                            <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                        </button>
                        <h5 className='modal-title text-left rufina-family fs-22' >Reschedule Appointment</h5>
                    </ModalHeader>

                    <Modal.Body className='bottom-padding'>
                        <Card>
                            <Card.Body className='pt-1 pb-1'>
                                <Row className='p-3'>
                                    <Col lg="12" className='mb-2 mt-0 text-left px-0'>
                                        <span className='title-appointment'>Details</span>
                                    </Col>

                                    <Col lg="12" className='px-0'>
                                        <input
                                            type="text"
                                            name="consultation_details"
                                            className='form-control'
                                            value={consultationFormData.consultation_details}
                                            onChange={handleChangeConsultation}
                                            required
                                        />
                                    </Col>

                                    <Col lg="12" className='px-0'>
                                        <Row>
                                            {times.map((time, index) => {
                                                return (
                                                    <>
                                                        {times.length > 0 && (
                                                            <>
                                                                <Col md="6" className="pe-0 mt-3">
                                                                    <p className="hours-header mb-2 text-left">Starts at</p>
                                                                    <div className='mb-3'>
                                                                        <input
                                                                            type='time'
                                                                            name='consultation_hour_start'
                                                                            className='mr-sm-2 form-control-hours w-100'
                                                                            value={consultationFormData?.consultation_hour_start}
                                                                            onChange={e => handleChangeConsultation(e, index)}
                                                                            required
                                                                        />
                                                                    </div>
                                                                </Col>

                                                                <Col md="6" className="pe-0 position-relative mt-3">
                                                                    <p className="hours-header mb-2 text-left">Ends at</p>

                                                                    <div className='mb-3'>
                                                                        <input
                                                                            type='time'
                                                                            name='consultation_hour_end'
                                                                            className='mr-sm-2 form-control-hours w-100'
                                                                            value={consultationFormData?.consultation_hour_end}
                                                                            onChange={e => handleChangeConsultation(e, index)}
                                                                            required
                                                                        />
                                                                    </div>
                                                                </Col>

                                                                <Col lg="12" className="pe-0 position-relative">
                                                                    <p className="hours-header mb-2 text-left">Date</p>
                                                                    <div className='mb-3'>
                                                                        <input
                                                                            type='date'
                                                                            name='consultation_date'
                                                                            className='form-control  w-100'
                                                                            value={consultationFormData?.consultation_date}
                                                                            onChange={e => handleChangeConsultation(e, index)}
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
                                </Row>
                            </Card.Body>
                        </Card>
                    </Modal.Body>

                    <ModalFooter className='border-none'>
                        <div className='text-right'>
                            <button
                                className="btn btn-secondary border-black bg-white text-black btn-style"
                                onClick={() => setAppointmentEditModal(false)}
                                type="button">
                                Cancel
                            </button>

                            {saveLoading ?
                                <button className="btn btn-primary btn-style ms-3" type="button" >Saving...</button>
                                :
                                <button className="btn btn-primary ms-3 btn-style" type="button" onClick={saveReScheduleSubmit}>Save</button>
                            }
                        </div>
                    </ModalFooter>
                </div>
            </Modal>

            <Modal
                show={appointmentCancelModal}
                className='modal-preview'
                fade={false}
                centered
            >
                <div>
                    <ModalHeader className='pb-0'>
                        <button
                            type='button'
                            className='close react-modal-close'
                            onClick={() => setAppointmentCancelModal(false)}
                        >
                            <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                        </button>
                        <h5 className='modal-title text-left rufina-family fs-22' >Cancel Appointment</h5>
                    </ModalHeader>

                    <Modal.Body className='bottom-padding'>
                        <Card>
                            <Card.Body className='pt-1 pb-1'>
                                <Row className='p-3'>
                                    <Col lg="12" className='mb-2 mt-0 text-left px-0'>
                                        <span className='title-appointment'>Reason</span>
                                    </Col>

                                    <Col lg="12" className='px-0'>
                                        <textarea
                                            type="text"
                                            name="consultation_details"
                                            className='form-control'
                                            value={cancellationReason}
                                            onChange={handleChangeCancellation}
                                            required
                                        />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Modal.Body>

                    <ModalFooter className='border-none'>
                        <div className='text-right'>
                            <button
                                className="btn btn-secondary border-black bg-white text-black btn-style"
                                onClick={() => setAppointmentCancelModal(false)}
                                type="button">
                                Cancel
                            </button>

                            {saveLoading ?
                                <button className="btn btn-primary btn-style ms-3" type="button" >Saving...</button>
                                :
                                <button className="btn btn-primary ms-3 btn-style" type="button" onClick={saveCancellation}>Save</button>
                            }
                        </div>
                    </ModalFooter>
                </div>
            </Modal>
        </LayoutAdmin >
    );
};

export default AdminAppointments;