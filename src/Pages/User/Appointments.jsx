import React, { useEffect, useState } from 'react';
import LayoutSellerCenter from 'Components/Layout/LayoutSellerCenter';
import { Row, Col, Button, Modal, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { GoAlertFill } from 'react-icons/go';
import { ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { VscSend } from "react-icons/vsc";
import { IoIosAttach } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { AiOutlineMessage } from "react-icons/ai";
import { CiSearch } from 'react-icons/ci';
import { useParams } from 'react-router-dom';
import { GiAlarmClock } from "react-icons/gi";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import 'Assets/styles/AppointmentList/style.css';
import UserPlaceholder from 'Assets/images/user.png';
import Container from 'react-bootstrap/Container';
import Sidebar from 'Components/Shared/Sidebar';
import InputEmoji from 'react-input-emoji';
import toast from 'react-hot-toast';
import axios from "axios";

const Appointments = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const { designerIdParams } = useParams();
    const [reloadCount, setReloadCount] = useState(0);
    // const designer_id = designerId ?? designerIdParams;
    const currentUser = cookies.currentUser;
    const designerId = cookies.currentUserDesigner;
    const [events, setEvents] = useState([]);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [inputClicked, setInputClicked] = useState(false);
    const [dateTo, setDateTo] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [appointments, setAppointments] = useState('');
    const [date, setDate] = useState('');
    const [chatBox, setChatBox] = useState(false);
    const [query, setQuery] = useState('');
    const [text, setText] = useState('')
    const [designerData, setDesignerData] = useState('');

    const [singleAppointment, setSingleAppointment] = useState('');


    const [appointmentModalIsOpen, setAppointmentModalIsOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const getAppointments = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designerId + '/appointment');
    };

    const getDate = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + '/#');
    };

    const getDesignerAppointment = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designerId + '/appointment');
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

    function toggleShowAppointment(first_name, last_name, title, created_at, consultation_hour_start, consultation_hour_end, consultation_details) {
        setAppointmentModalIsOpen(true);

        setSingleAppointment({
            first_name: first_name || '-',
            last_name: last_name || '-',
            title: title || '-',
            created_at: created_at || '-',
            consultation_hour_start: consultation_hour_start || '-',
            consultation_hour_end: consultation_hour_end || '-',
            consultation_details: consultation_details || '-',
        })
    }

    function handleOnEnter(text) {
        console.log('enter', text)
    }

    useEffect(() => {
        if (inputClicked) {
            fetchAppointmentList();
        }
    }, [query, inputClicked]);

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
                } else {
                    toast.error('There has been an error getting the appointment, please try again!');
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the appointment, please try again!');
            });

    }, [reloadCount]);

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

        // Convert hours to 12-hour format
        let formattedHours = hours % 12;
        formattedHours = formattedHours === 0 ? 12 : formattedHours;

        // Format hours and minutes to include leading zeros if needed
        const formattedTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes}${ampm}`;
        return formattedTime;
    }



    return (
        <LayoutSellerCenter>
            <section>
                <Container fluid>
                    <Row className='bg-color-page'>
                        <Col lg={2} className='p-0'>
                            <Sidebar />
                        </Col>

                        <Col lg={10} className='mx-auto top-bottom col-right' style={{ maxWidth: '1440px' }}>
                            <div className='ms-4'>
                                <Row>
                                    <Col lg={12}>
                                        <Row className="pb-4">
                                            <Col md={12} className='d-flex justify-content-left align-items-center'>
                                                <h3 className="fs-30 fw-600 text-black mb-0">Appointments</h3>
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
                                                            onChange={(e) => { setDateTo(e.target.value); console.log('To value ', e.target.value) }}
                                                        />
                                                        &nbsp;
                                                        <div className='d-flex justify-content-center align-items-center'>-</div>
                                                        &nbsp;
                                                        <input
                                                            type="date"
                                                            className='form-control w-25 color-date cursor-pointer'
                                                            value={dateFrom}
                                                            onChange={(e) => { setDateFrom(e.target.value); console.log('To value ', e.target.value) }}
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
                                        <Card className='border-appointment-list'>
                                            <Card.Body className='bg-white'>
                                                <Row>
                                                    <Col lg={3}>
                                                        <div className='fw-500'>Date Created</div>
                                                    </Col>

                                                    <Col lg={3}>
                                                        <div className='fw-500'>Name</div>
                                                    </Col>

                                                    <Col lg={3}>
                                                        <div className='fw-500'>Appointment Date & Time</div>
                                                    </Col>

                                                    <Col lg={2}>
                                                        <div className='fw-500'>Status</div>
                                                    </Col>

                                                    <Col lg={1} className='text-end fw-500'>
                                                        <div>Action</div>
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
                                                            const formattedDate = (new Date(appointment.consultation_date_time)).toLocaleString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                timeZone: 'UTC',

                                                            });
                                                            return (

                                                                <Col lg={12}>
                                                                    <Card className='mt-2 border-appointment-list'>
                                                                        <Card.Body className='bg-white'>
                                                                            <Row>
                                                                                <Col lg={3} className='center-name'>
                                                                                    <span>{today}</span>
                                                                                </Col>

                                                                                <Col lg={3} className='d-flex user-image' >

                                                                                    {appointment.image !== null && appointment.image !== '' ? (
                                                                                        <div
                                                                                            className='user-photo'
                                                                                            style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${appointment.image})` }}
                                                                                        >
                                                                                        </div>
                                                                                    ) : (
                                                                                        <img src={UserPlaceholder} className='placeholder-img me-2' />
                                                                                    )}
                                                                                    {/* <img src={UserPlaceholder} className='placeholder-img me-2' /> */}

                                                                                    <span className='d-flex justify-content-center align-items-center ms-2 mt-1'>
                                                                                        {appointment.first_name}
                                                                                        &nbsp;
                                                                                        {appointment.last_name}
                                                                                    </span>
                                                                                </Col>

                                                                                <Col lg={3} className='center-name'>
                                                                                    <span>{formattedDate}</span>
                                                                                </Col>

                                                                                <Col lg={2} className='center-name'>
                                                                                    <span>{appointment.status}</span>
                                                                                </Col>

                                                                                <Col lg={1} className='d-flex justify-content-end'>
                                                                                    <div
                                                                                        className="cursor-pointer d-flex justify-content-center align-items-center"
                                                                                        onClick={() => chatBoxModal(appointment.first_name, appointment.last_name, appointment.image, appointment.status)}
                                                                                    >
                                                                                        <AiOutlineMessage className='me-2' size={20} />
                                                                                    </div>

                                                                                    {/* <Link className="text-decoration-none" to={`/portfolio/${appointment.id}/edit`}> */}
                                                                                    <div
                                                                                        onClick={() => toggleShowAppointment(appointment.first_name, appointment.last_name, appointment.title, appointment.created_at, appointment.consultation_hour_start, appointment.consultation_hour_end, appointment.consultation_details)}
                                                                                        // onclick={() => toggleUnderConstruction}
                                                                                        className="cursor-pointer icon-tooltiptext d-flex justify-content-center align-items-center"
                                                                                    >
                                                                                        <span>
                                                                                            <IoEyeOutline size={20} />
                                                                                        </span>
                                                                                    </div>
                                                                                    {/* </Link> */}
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
                                                        <div className='text-center fs-18 mt-5'>
                                                            No records found.
                                                        </div>
                                                    </>
                                                }
                                            </>
                                            :
                                            <>

                                            </>
                                        }
                                    </>
                                </Row>
                            </div>
                        </Col>

                        {chatBox ?
                            <>
                                <Card className='width-chat-card px-0'>
                                    <Card.Header className='order-chat bg-white pt-3 pb-3'>
                                        <div className='d-flex justify-content-between'>
                                            <div>
                                                <span className="fs-14 fw-500 mb-0 name-of-user-chat">
                                                    <span className='fw-500'>{designerData.first_name} {designerData.last_name}</span>
                                                </span>
                                                {/* <span className='ms-3 active-now fs-14 fw-400 text-gold'>{designerData.status}</span> */}
                                            </div>
                                            <div className="cursor-pointer" onClick={() => setChatBox(false)}>
                                                <IoCloseOutline color="#39393A" />
                                            </div>
                                        </div>
                                    </Card.Header>

                                    <Card.Body>
                                        <p>No messages found.</p>
                                        {/* <div>
                                            <span className='d-flex'>

                                                {designerData.image !== null && designerData.image !== '' ? (
                                                    <div
                                                        className='user-photo-designer'
                                                        style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${designerData.image})` }}
                                                    >
                                                    </div>
                                                ) : (
                                                    <img src={UserPlaceholder} className='placeholder-img me-2' />
                                                )}

                                                <div className="designer-info mx-2">
                                                    <div>
                                                        <p className="fs-14 fw-600 mb-0 name-of-user-chat ms-2">
                                                            <span className=''>{designerData.first_name}{designerData.last_name}</span>
                                                            <span className='ms-3 fs-14 time-chat fw-400'>2:23 PM</span>
                                                        </p>
                                                    </div>

                                                    <div className='fs-14 ms-2 mt-2 name-of-user-chat'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam.</div>
                                                </div>
                                            </span>
                                        </div>

                                        <div className='mt-5 mb-4 text-right d-flex'>
                                            <div>
                                                <div className='time-chat-box fs-14 fw-400'>3:30 PM
                                                    <span className='ms-2 you-chat-box fw-600 fs-14'>You</span></div>
                                                <div className='mt-2 welcome-chat'>
                                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                                                </div>
                                            </div>
                                            <img src={UserPlaceholder} className='placeholder-img-chat ms-3' />
                                        </div> */}

                                        <div>
                                            <InputEmoji
                                                value={text}
                                                onChange={setText}
                                                cleanOnEnter
                                                onEnter={handleOnEnter}
                                                placeholder="Type a message"
                                                className="emoji-picker"
                                            />
                                            {/* <div className='cursor-pointer position-absolute attach-icon' onClick={() => toggleUnderConstruction("")}><IoIosAttach size={20} /></div> */}
                                            <div>
                                                <div
                                                    className="cursor-pointer fw-500 position-absolute send-button"
                                                    onClick={() => toggleUnderConstruction("Send Message")}
                                                >
                                                    Send
                                                    <VscSend className='ms-1' />
                                                </div>
                                            </div>
                                        </div>
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
                    <button type='button' className='close react-modal-close' onClick={() => setUnderConstructionShow(false)} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
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
                    <ModalHeader>
                        <h5 className='modal-title text-left set-appointment'>Appointment Details</h5>
                        <button type='button' className='close react-appointment-close' data-dismiss='modal' aria-label='Close'>
                            <span aria-hidden='true'>&times;</span>
                        </button>
                    </ModalHeader>
                    <hr className="mt-0 mb-2" />

                    <div>
                        <div>
                            <h2 className="current-date fs-18 poppins-ft fw-600 px-3 mb-3 mt-3">Appointment with&nbsp;{singleAppointment.first_name} {singleAppointment.last_name}</h2>
                        </div>

                        <div className="d-flex">
                            <p className="fw-500 mb-2 ps-3"><MdOutlineCalendarMonth size="20" className='icon-color' /></p>
                            <p className="current-date ms-2 mb-0 text-black">
                                {returnFormattedDate(singleAppointment.created_at ?? '-')}
                            </p>
                        </div>

                        <div className="d-flex">
                            <p className="fw-500 mb-2 ps-3"><GiAlarmClock size="20" className='icon-color' /></p>
                            <p className="current-date ms-2 mb-0 text-black ">
                                {
                                    returnFormattedTime(singleAppointment.consultation_hour_start ?? '-') + ' - ' + returnFormattedTime(singleAppointment.consultation_hour_end ?? '-')
                                }

                                {/* {returnFormattedTime(singleAppointment.consultation_hour_start ?? '-')} */}
                                {/* {singleAppointment.consultation_hour_start}&nbsp;-&nbsp;{singleAppointment.consultation_hour_end} */}
                            </p>
                        </div>

                        <div>
                            <p className="current-date fs-16 poppins-ft fw-400 text-black mb-2 px-3">{singleAppointment.consultation_details}</p>
                        </div>
                    </div>
                    <ModalFooter>
                        <div className='text-right'>
                            <Button className="cancel-btn me-2" onClick={closeAppointmentModal}>Close</Button>
                        </div>
                    </ModalFooter>
                </div>
            </Modal>


        </LayoutSellerCenter >
    );
};

export default Appointments;