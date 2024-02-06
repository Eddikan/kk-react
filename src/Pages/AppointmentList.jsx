import React, { useEffect, useState } from 'react';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import '../Assets/styles/DesignerCalendar/style.css'
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
import { GoAlertFill } from 'react-icons/go';
// import '../Assets/styles/Appointments/style.css';
import { FaUserCircle } from "react-icons/fa";
import User from '../Assets/images/user.png';
import { LiaSmileBeam } from "react-icons/lia";
import { VscSend } from "react-icons/vsc";
import { IoIosAttach } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import Sidebar from 'Components/Shared/Sidebar';
import { AiOutlineMessage } from "react-icons/ai";
import { CiSearch } from 'react-icons/ci';
import '../Assets/styles/AppointmentList/style.css';
import { IoEyeOutline } from "react-icons/io5";
import toast from 'react-hot-toast';
import axios from "axios";
import { useNavigate, useParams, Link } from 'react-router-dom';


const AppointmentList = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const [reloadCount, setReloadCount] = useState(0);
    const currentUser = cookies.currentUser;
    const { designerId } = useParams();
    const [askAQuestion, setAskAQuestion] = useState(false);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [appointmentList, setAppointmentList] = useState('');
    const [inputClicked, setInputClicked] = useState(false);

    const [user, setUser] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [appointments, setAppointments] = useState('');

    const [date, setDate] = useState('');
    const [chatBox, setChatBox] = useState(false);
    const [query, setQuery] = useState('');
    const [chatName, setChatName] = useState('');

    const siteCookies = cookies[0];
    // const currentUser = siteCookies.currentUser;


    const getAppointments = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designerId + '/appointment');
    };


    const getDate = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + '/#');
    };

    const chatBoxModal = (first_name, last_name) => {
        setChatBox(true);
        setChatName(first_name + ' ' + last_name);
    };

    const askQuestionModal = (e) => {
        setAskAQuestion(true);
    };

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);

    }

    useEffect(() => {
        if (inputClicked) {
            fetchAppointmentList();
        }
    }, [query, inputClicked]);

    const fetchAppointmentList = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_ENDPOINT + '/#' + currentUser, {
                params: {
                    query: query
                }
            });

            setAppointments(response.data.data);
        } catch (error) {
            console.error('Error fetching appointment:', error);
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
                    toast.error('There has been an error getting the date, please try again!');
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the date, please try again!');
            });

        // getDate()
        //     .then((response) => {
        //         const selectedDate = response.data.data;
        //         if (selectedDate) {
        //             setDate(selectedDate);
        //         } else {
        //             toast.error('There has been an error getting the date, please try again!');
        //         }
        //     })
        //     .catch((error) => {
        //         toast.error('There has been an error getting the date, please try again!');
        //     });


    }, [reloadCount]);



    return (
        <LayoutNoFooter>
            <Sidebar />
            <section>
                <Container>
                    <Row className='ms-4'>
                        <Col lg={12} className="designer-calendar-container">
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
                                    <div
                                        className='d-flex align-items-end w-100 justify-content-end'
                                        style={{ position: 'relative' }}
                                    >

                                        <input
                                            className='search-bar'
                                            type="text"
                                            placeholder="Search"
                                            value={query}
                                            onChange={(e) => { setQuery(e.target.value); setInputClicked(true); }}
                                        />

                                        <CiSearch size="20px"
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '92%',
                                                transform: 'translateY(-50%)',
                                            }}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Col>

                        <Col lg={12}>
                            <Card className='border-appointment-list'>
                                <Card.Body className='bg-white'>
                                    <Row>
                                        <Col lg={3}>
                                            <span className='fw-500'>Date Created</span>
                                        </Col>

                                        <Col lg={3}>
                                            <span className='fw-500'>Name</span>
                                        </Col>

                                        <Col lg={3}>
                                            <span className='fw-500'>Appointment Date & Time</span>
                                        </Col>

                                        <Col lg={2}>
                                            <span className='fw-500'>Status</span>
                                        </Col>

                                        <Col lg={1} className='text-end fw-500'>
                                            <span>Action</span>
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
                                                    timeZone: 'UTC', // Optional, adjust based on your needs
                                                });
                                                return (

                                                    <Col lg={12}>
                                                        <Card className='mt-2 border-appointment-list'>
                                                            <Card.Body className='bg-white'>
                                                                <Row>
                                                                    <Col lg={3}>
                                                                        <span>{today}</span>
                                                                    </Col>

                                                                    <Col lg={3} className='d-flex'>
                                                                        <img src={User} className='user-placeholder' />
                                                                        <span className='d-flex justify-content-center align-items-center ms-2 mt-1'>
                                                                            {appointment.first_name}
                                                                            &nbsp;
                                                                            {appointment.last_name}
                                                                        </span>
                                                                    </Col>

                                                                    <Col lg={3}>
                                                                        <span>{formattedDate}</span>
                                                                    </Col>

                                                                    <Col lg={2}>
                                                                        <span>Appointed</span>
                                                                    </Col>

                                                                    <Col lg={1} className='d-flex justify-content-end'>
                                                                        <div className="cursor-pointer" onClick={() => chatBoxModal(appointment.first_name, appointment.last_name)}>
                                                                            <AiOutlineMessage className='me-2' size={20} />
                                                                        </div>

                                                                        <div className="cursor-pointer icon-tooltiptext" onClick={() => toggleUnderConstruction("")}>
                                                                            <span><IoEyeOutline size={20} /></span>
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

                                        </>
                                    }
                                </>
                                :
                                <>

                                </>
                            }
                        </>


                    </Row>

                    {chatBox ?
                        <>
                            <Card className='width-chat-card px-0'>
                                <Card.Header className='header-chat bg-white'>
                                    <div className='d-flex justify-content-between'>
                                        <div>
                                            <span className="fs-14 fw-500 mb-0 name-of-user-chat">
                                                {chatName}
                                            </span>
                                            <span className='ms-3 active-now fs-14 fw-400 text-gold'>Active Now</span>
                                        </div>
                                        <div className="cursor-pointer" onClick={() => setChatBox(false)}>
                                            <IoCloseOutline color="#39393A" />
                                        </div>
                                    </div>
                                </Card.Header>

                                <Card.Body >
                                    <div className='height-cb'>
                                    </div>

                                    <div>
                                        <input type="text" className='form-control' placeholder='Type Message...' />
                                        <div className='mt-3  d-flex justify-content-between'>
                                            <div className='d-flex'>
                                                <div className='cursor-pointer' onClick={() => toggleUnderConstruction("")}><LiaSmileBeam className='me-2' size={20} /></div>
                                                <div className='cursor-pointer' onClick={() => toggleUnderConstruction("")}><IoIosAttach size={20} /></div>
                                            </div>
                                            <div>
                                                <div
                                                    className="cursor-pointer fw-500"
                                                    onClick={() => toggleUnderConstruction("Send Message")}
                                                >
                                                    Send
                                                    <VscSend className='ms-1' />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </>
                        :
                        null
                    }

                    {askAQuestion ?
                        <>

                            <Card className='width-chat-card px-0'>
                                <Card.Header className='header-chat bg-white'>
                                    <div className='d-flex justify-content-between'>
                                        <div>
                                            <span className='fw-500'>Dave Napoles</span>
                                            <span className='ms-2 active-now fs-14 fw-400'>Active Now</span>
                                        </div>
                                        <div className="cursor-pointer" onClick={() => setAskAQuestion(false)}>
                                            <IoCloseOutline color="#39393A" />
                                        </div>
                                    </div>
                                </Card.Header>
                                <Card.Body >
                                    <div className='product-portfolio-image'>
                                        <span className='d-flex'>
                                            {/* {images && images.length > 0 ?
                                                <>
                                                    <div className="single-image-chat" style={{ backgroundImage: "url(" + activeImage + ")" }}>
                                                    </div>
                                                    <span className='name-of-portfolio ms-3 d-flex justify-content-center align-items-center'>{portfolio.name ?? "-"}</span>
                                                </>
                                                :
                                                null
                                            } */}
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

                                        <div className=' d-flex align-items-center portfolio-designer ms-3'>
                                            {/* {portfolio.user.image && (
                                                <div
                                                    className='designer-photo'
                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${portfolio.user.image})` }}
                                                >
                                                </div>
                                            )} */}
                                        </div>
                                    </div>

                                    <div>
                                        <span>
                                            <FaUserCircle />
                                            <span className='name-chat'>Dave Napoles</span>
                                            <span className='ms-2 time-chat fw-400 fs-14'>4:00 PM</span>
                                        </span>
                                    </div>

                                    <div className='mt-3'>
                                        <input type="text" className='form-control' />
                                    </div>

                                    <div className='mt-3 d-flex justify-content-between'>

                                        <div className='d-flex'>
                                            <div className='cursor-pointer' onClick={() => toggleUnderConstruction("")}><LiaSmileBeam className='me-2' /></div>
                                            <div className='cursor-pointer' onClick={() => toggleUnderConstruction("")}><IoIosAttach /></div>
                                        </div>
                                        <div>
                                            <div
                                                className="cursor-pointer fw-500"
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


        </LayoutNoFooter >
    );
};

export default AppointmentList;