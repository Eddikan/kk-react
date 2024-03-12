import React, { useEffect, useState } from 'react';
import { Row, Col, Modal, Card } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { GoAlertFill } from 'react-icons/go';
import { ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { VscSend } from "react-icons/vsc";
import { IoMdVideocam, IoIosAttach } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { AiFillMessage } from "react-icons/ai";
import { CiSearch } from 'react-icons/ci';
import { useParams } from 'react-router-dom';
import { GiAlarmClock } from "react-icons/gi";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import 'Assets/styles/AppointmentList/style.css';
import 'Assets/styles/Appointments/style.css';
import LayoutSellerCenter from 'Components/Layout/LayoutSellerCenter';
import UserPlaceholder from '../../Assets/images/user.png';
import GoBack from '../../Components/Shared/GoBack';
import Pagination from 'Components/Pagination/Pagination';
import Container from 'react-bootstrap/Container';
import Sidebar from 'Components/Shared/Sidebar';
import MeetingChat from 'Components/Chat/MeetingChat';
import InputEmoji from 'react-input-emoji';
import toast from 'react-hot-toast';
import axios from "axios";

const Appointments = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const [reloadCount, setReloadCount] = useState(0);
    const { appointmentId } = useParams();
    const currentUser = cookies.currentUser;
    const userDetails = cookies.userDetails;
    const designerId = cookies.currentUserDesigner;
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [inputClicked, setInputClicked] = useState(false);
    const [dateTo, setDateTo] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [appointments, setAppointments] = useState('');
    const [appointmentsLoading, setAppointmentsLoading] = useState(true);
    const [date, setDate] = useState('');
    const [chatBox, setChatBox] = useState(false);
    const [query, setQuery] = useState('');
    const [text, setText] = useState('');
    const [designerData, setDesignerData] = useState('');
    const [singleAppointment, setSingleAppointment] = useState('');
    const [appointmentModalIsOpen, setAppointmentModalIsOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const currentDate = new Date().toISOString().split('T')[0];

    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(1);

    let PageSize = 10;

    const getAppointments = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designerId + '/appointment');
    };

    const getDate = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + '/#');
    };

    const closeAppointmentModal = () => {
        setAppointmentModalIsOpen(false);
        setSelectedEvent(null);
    }

    const chatBoxModal = (first_name, last_name, image, status) => {
        setChatBox(true);
        setDesignerData({
            first_name: first_name || '-',
            last_name: last_name || '-',
            image: image || '-',
            status: status || '-'
        })
    };

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    function toggleShowAppointment(first_name, last_name, title, consultation_date, consultation_hour_start, consultation_hour_end, consultation_details) {
        setAppointmentModalIsOpen(true);

        setSingleAppointment({
            first_name: first_name || '-',
            last_name: last_name || '-',
            title: title || '-',
            consultation_date: consultation_date || '-',
            consultation_hour_start: consultation_hour_start || '-',
            consultation_hour_end: consultation_hour_end || '-',
            consultation_details: consultation_details || '-',
        })
    }

    function handleOnEnter(text) {
        console.log('enter', text)
    }

    const convert24hrTo12hr = (time24hr) => {
        const [hours, minutes] = time24hr.split(':');
        const date = new Date(2000, 0, 1, hours, minutes);
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    function returnFormattedDate(date) {
        const targetDate = new Date(date);
        const month = targetDate.toLocaleString('en-US', { month: 'long' });
        const day = targetDate.getDate();
        const year = targetDate.getFullYear();
        const formattedDate = `${month} ${day}, ${year}`;
        return formattedDate;
    }

    function returnFormattedTime(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const ampm = hours >= 12 ? ' PM' : ' AM';

        let formattedHours = hours % 12;
        formattedHours = formattedHours === 0 ? 12 : formattedHours;

        const formattedTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes}${ampm}`;
        return formattedTime;
    }

    const fetchAppointmentList = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designerId + '/appointment?user_id=' + currentUser, {
                params: {
                    query: query
                }
            });

            setAppointments(response.data.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    useEffect(() => {
        document.body.classList.add('designer-calendar-body');
    }, []);

    useEffect(() => {
        getAppointments()
            .then((response) => {
                const selectedAppointments = response.data.data;
                if (selectedAppointments) {
                    setAppointments(selectedAppointments);
                    setPageCount(() => response.data.meta.total);
                } else {
                    toast.error('There has been an error getting the appointment, please try again!');
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the appointment, please try again!');
            });

    }, [reloadCount]);

    useEffect(() => {
        if (inputClicked) {
            fetchAppointmentList();
        }
    }, [query, inputClicked]);


    const handleChangePage = (pageNumber) => {
        setAppointmentsLoading(true);
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designerId + '/appointment?page=' + pageNumber + '&user_id=' + currentUser)
            .then((response) => {
                const data = response.data;
                const result = data.data;
                setCurrentPage(pageNumber);
                const selectedAppointments = response.data.data;
                if (selectedAppointments) {
                    setAppointments(selectedAppointments);
                    setCurrentPage(() => data.meta.current_page);
                    setPageCount(() => data.meta.total);
                    setPageSize(() => data.meta.per_page);
                } else {
                    setAppointmentsLoading(false);
                    toast.error('There has been an error getting the appointment, please try again!');
                }
            }).catch(error => {
                setAppointmentsLoading(false);
                toast.error('There has been an error getting the appointment, please try again!');
            });
    };

    console.log("currentUser", currentUser);
    console.log("appointmentId", appointmentId);
    console.log("userDetails", userDetails);

    return (
        <LayoutSellerCenter>
            <section>
                <Container fluid>
                    <Row className='bg-color-page'>
                        <Col lg={2} className='p-0'>
                            <Sidebar />
                        </Col>

                        <Col lg={10} className='mx-auto top-bottom' style={{ maxWidth: '1440px' }}>
                            <div>
                                <Row>
                                    <Col lg={12}>
                                        <Row className="pb-4">
                                            <Col lg={10} className='d-flex justify-content-left align-items-center'>
                                                <h3 className="fs-30 fw-600 text-black mb-0">Appointments</h3>
                                            </Col>

                                            <Col lg={2} className='text-right'>
                                                <GoBack fallBack="/" />
                                            </Col>
                                        </Row>

                                        <Row className="mb-4">
                                            <Col lg='8'>
                                                <div className='w-100 d-flex'>
                                                    <div className='text-nowrap me-3 d-flex justify-content-center align-items-center'>
                                                        <div className='appointment-date fs-16'>Appointment Date</div>
                                                    </div>

                                                    <div className='w-100 d-flex'>
                                                        <input
                                                            type="date"
                                                            className='form-control w-25 color-date cursor-pointer'
                                                            value={dateTo}
                                                            onChange={(e) => { setDateTo(e.target.value); }}
                                                        />
                                                        &nbsp;
                                                        <div className='d-flex justify-content-center align-items-center'>-</div>
                                                        &nbsp;
                                                        <input
                                                            type="date"
                                                            className='form-control w-25 color-date cursor-pointer'
                                                            value={dateFrom}
                                                            onChange={(e) => { setDateFrom(e.target.value); }}
                                                        />
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col lg='4'>
                                                <div className='d-flex align-items-end w-100 justify-content-end position-relative'>
                                                    <input
                                                        className='search-bar'
                                                        type="text"
                                                        placeholder="Search"
                                                        value={query}
                                                        onChange={(e) => { setQuery(e.target.value); setInputClicked(true); }}
                                                    />
                                                    <CiSearch size="20px" className='search-style' />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col lg={12}>
                                        <Card>
                                            <Card.Body className='bg-light'>
                                                <Row>
                                                    <Col lg={4}>
                                                        <span className='fw-500'>Customer</span>
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
                                                                        <Card.Body>
                                                                            <Row className="align-items-center">
                                                                                <Col lg={4}>
                                                                                    <div className='d-flex appointment-user-image'>
                                                                                        {appointment.customer?.image != '' && appointment.customer?.image != null ? (
                                                                                            <div
                                                                                                className='user-photo-appointment'
                                                                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${appointment.customer?.image})` }}
                                                                                            >
                                                                                            </div>
                                                                                        ) : (
                                                                                            <img src={UserPlaceholder} className='placeholder-img' alt="User Placeholder" />
                                                                                        )}
                                                                                        <div>
                                                                                            <span className='d-flex ms-3 mt-0 mb-1 fs-18 text-black'>
                                                                                                {appointment.customer?.first_name}
                                                                                                &nbsp;
                                                                                                {appointment.customer?.last_name}
                                                                                            </span>
                                                                                            <div className='ms-3 fs-16 text-black'>
                                                                                                <span className='fw-600 me-1'>Created:</span>&nbsp;{today}
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
                                                                                    <div
                                                                                        className="cursor-pointer appointments-tooltip"
                                                                                        onClick={() => toggleShowAppointment(
                                                                                            appointment.customer?.first_name,
                                                                                            appointment.customer?.last_name,
                                                                                            appointment.title,
                                                                                            appointment.consultation_date,
                                                                                            appointment.consultation_hour_start,
                                                                                            appointment.consultation_hour_end,
                                                                                            appointment.consultation_details
                                                                                        )}
                                                                                    >
                                                                                        <span className="icon-tooltiptext fs-14">View Details</span>
                                                                                        <IoEye className='video-cam me-3' size={20} color="#000000" />
                                                                                    </div>

                                                                                    {/* {currentDate === appointment.consultation_date ? ( */}
                                                                                    <a href={`/consultation-meeting/${appointment.id}`}>
                                                                                        <div className="cursor-pointer appointments-tooltip">
                                                                                            <span className="icon-tooltiptext fs-14">
                                                                                                Video call
                                                                                            </span>
                                                                                            <IoMdVideocam className='video-cam me-3' size={20} color="#000000" />
                                                                                        </div>
                                                                                    </a>
                                                                                    {/* ) : (
                                                                                        currentDate < appointment.consultation_date ? (
                                                                                            <div className="cursor-pointer appointments-tooltip">
                                                                                                <span className="icon-tooltiptext fs-14">
                                                                                                    Not time for video conferencing
                                                                                                </span>
                                                                                                <IoMdVideocam className='video-cam me-3' color='#0000005c' size={20} />
                                                                                            </div>
                                                                                        ) : (
                                                                                            <div className="cursor-pointer appointments-tooltip">
                                                                                                <span className="icon-tooltiptext fs-14">
                                                                                                    This video conferencing is finished
                                                                                                </span>
                                                                                                <IoMdVideocam className='video-cam me-3' color='#0000005c' size={20} />
                                                                                            </div>
                                                                                        )
                                                                                    )} */}

                                                                                    <div
                                                                                        className="cursor-pointer appointments-tooltip"
                                                                                        onClick={() => chatBoxModal(
                                                                                            appointment.customer?.first_name,
                                                                                            appointment.customer?.last_name,
                                                                                            appointment.customer?.image,
                                                                                            appointment.status
                                                                                        )}
                                                                                    >
                                                                                        <span className="icon-tooltiptext fs-14">Message Customer</span>
                                                                                        <span><AiFillMessage className='video-cam' size={19} color="#000000" /></span>
                                                                                    </div>
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
                                </Row>
                            </div>

                            <Pagination
                                className="pagination-bar mt-4 mb-0"
                                currentPage={currentPage}
                                totalCount={pageCount}
                                pageSize={PageSize}
                                onPageChange={page => handleChangePage(page)}
                            />
                        </Col>

                        {chatBox ?
                            <>
                                <Card className='width-chat-card px-0'>
                                    <Card.Header className='order-chat bg-white pt-3 pb-3'>
                                        <div className='d-flex justify-content-between'>
                                            <div className='d-flex align-items-center'>
                                                <span className="fs-14 fw-500 mb-0 name-of-user-chat">
                                                    <span className='fw-500'>{designerData.first_name} {designerData.last_name}</span>
                                                </span>
                                                {/* <span className='ms-3 active-now fs-14 fw-400 text-gold'>{designerData.status}</span> */}
                                            </div>
                                            <div className="cursor-pointer" onClick={() => setChatBox(false)}>
                                                <IoCloseOutline color="#7e7e7e" size={25} />
                                            </div>
                                        </div>
                                    </Card.Header>

                                    <Card.Body>
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
                    </Row>
                </Container>
            </section >

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
                    <h4 className='fs-25 fw-600 mb-3'>{modalHeading}</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>

            <Modal
                show={appointmentModalIsOpen}
                className='modal-preview'
                fade={false}
                centered
            >
                <div>
                    <ModalHeader className='pb-0'>
                        <button
                            type='button'
                            className='close react-modal-close'
                            onClick={() => setAppointmentModalIsOpen(false)}
                        >
                            <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                        </button>
                        <h5 className='modal-title text-left rufina-family fs-22' >Appointment Details</h5>
                    </ModalHeader>
                    <Modal.Body className='bottom-padding'>
                        <Card>
                            <Card.Body>
                                <div>
                                    <h2 className="current-date fs-18 poppins-ft fw-600 mb-3">Appointment with&nbsp;{singleAppointment.first_name} {singleAppointment.last_name}</h2>
                                </div>

                                <div className="d-flex">
                                    <p className="fw-500 mb-2">
                                        <MdOutlineCalendarMonth size="20" className='icon-color mb-1' />
                                    </p>
                                    <p className="current-date ms-2 mb-0 text-black">
                                        {returnFormattedDate(singleAppointment.consultation_date ?? '-')}
                                    </p>
                                </div>

                                <div className="d-flex">
                                    <p className="fw-500 mb-2"><GiAlarmClock size="20" className='icon-color mb-1' /></p>
                                    <p className="current-date ms-2 mb-0 text-black ">
                                        {returnFormattedTime(singleAppointment.consultation_hour_start ?? '-') + ' - ' + returnFormattedTime(singleAppointment.consultation_hour_end ?? '-')}
                                    </p>
                                </div>

                                <div>
                                    <p className="current-date fs-16 poppins-ft fw-400 text-black mb-0">{singleAppointment.consultation_details}</p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Modal.Body>
                    <ModalFooter className='border-none'>
                        <div className='text-right'>
                            <button
                                className="btn btn-secondary border-black bg-white text-black btn-style"
                                type="button"
                                onClick={closeAppointmentModal}
                            >
                                Close
                            </button>
                        </div>
                    </ModalFooter>
                </div>
            </Modal>
        </LayoutSellerCenter >
    );
};

export default Appointments;