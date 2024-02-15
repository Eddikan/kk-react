import React, { useEffect, useState } from 'react';
import LayoutSellerCenter from '../Components/Layout/LayoutSellerCenter';
import { Row, Col, Button, Modal, Card } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import Container from 'react-bootstrap/Container';
import InputEmoji from 'react-input-emoji';
import { GoAlertFill } from 'react-icons/go';
import { VscSend } from "react-icons/vsc";
import { IoIosAttach } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { AiOutlineMessage } from "react-icons/ai";
import { CiSearch } from 'react-icons/ci';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../Assets/styles/AppointmentList/style.css';
import { IoEyeOutline } from "react-icons/io5";
import UserPlaceholder from 'Assets/images/user.png';
import Sidebar from 'Components/Shared/Sidebar';
import toast from 'react-hot-toast';
import axios from "axios";

const AppointmentList = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const [reloadCount, setReloadCount] = useState(0);
    const currentUser = cookies.currentUser;
    const { designerId } = useParams();
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

    const getAppointments = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designerId + '/appointment');
    };

    const getDate = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + '/#');
    };

    const chatBoxModal = (first_name, last_name, image) => {
        setChatBox(true);
        setDesignerData({
            first_name: first_name || '-',
            last_name: last_name || '-',
            image: image || '-'
        })
    };

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
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
        <LayoutSellerCenter>
            <section>
                <Container fluid>
                    <Row className='bg-color-page'>
                        <Col lg={2} className='p-0'>
                            <Sidebar />
                        </Col>

                        <Col lg={10} className='col-right mx-auto top-bottom'>
                            <div className='ms-5'>
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

                                                                                <Col lg={3} className='d-flex'>

                                                                                    {appointment.image !== null && appointment.image !== '' ? (
                                                                                        <div
                                                                                            className='user-photo'
                                                                                            style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${appointment.image})` }}
                                                                                        >
                                                                                        </div>
                                                                                    ) : (
                                                                                        <img src={UserPlaceholder} className='placeholder-img me-2' />
                                                                                    )}

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
                                                                                        onClick={() => chatBoxModal(appointment.first_name, appointment.last_name, appointment.image)}
                                                                                    >
                                                                                        <AiOutlineMessage className='me-2' size={20} />
                                                                                    </div>

                                                                                    <div
                                                                                        className="cursor-pointer icon-tooltiptext d-flex justify-content-center align-items-center"
                                                                                        onClick={() => toggleUnderConstruction("")}
                                                                                    >
                                                                                        <span>
                                                                                            <IoEyeOutline size={20} />
                                                                                        </span>
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
                                                <span className='ms-3 active-now fs-14 fw-400 text-gold'>Active Now</span>
                                            </div>
                                            <div className="cursor-pointer" onClick={() => setChatBox(false)}>
                                                <IoCloseOutline color="#39393A" />
                                            </div>
                                        </div>
                                    </Card.Header>

                                    <Card.Body >
                                        <div>
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
                                                {/* {designerData.image && (
                                                    <div
                                                        className='user-photo-designer'
                                                        style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${designerData.image})` }}
                                                    >
                                                    </div>
                                                )} */}

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
                                        </div>

                                        <div>
                                            <InputEmoji
                                                value={text}
                                                onChange={setText}
                                                cleanOnEnter
                                                onEnter={handleOnEnter}
                                                placeholder="Type a message"
                                                className="emoji-picker"
                                            />
                                            <div className='cursor-pointer position-absolute attach-icon' onClick={() => toggleUnderConstruction("")}><IoIosAttach size={20} /></div>
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


        </LayoutSellerCenter >
    );
};

export default AppointmentList;