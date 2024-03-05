import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Layout from 'Components/Layout/Layout';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { ImLeaf } from "react-icons/im";
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import toast from 'react-hot-toast';
import { GoHeart } from "react-icons/go";
import GoBack from '../Components/Shared/GoBack';
import { useCookies } from 'react-cookie';
import Countries from 'Utils/Countries';
import Loading from 'Components/Shared/Loading';
import { BiSolidMessageDetail } from "react-icons/bi";
import { BiVideo } from "react-icons/bi";
import { IoIosInformationCircleOutline } from "react-icons/io";
import MultiRangeSlider from 'Components/Forms/MultiRangeSlider';
import { HiMiniUsers } from "react-icons/hi2";
import { debounce } from 'lodash';
import { Rating } from 'react-simple-star-rating';
import { FiUser } from "react-icons/fi";
import { MdCallEnd } from "react-icons/md";
import { IoMicOffOutline } from "react-icons/io5";
import { IoSendOutline } from "react-icons/io5";
import { MdMonitor } from "react-icons/md";
import { GiAlarmClock } from "react-icons/gi";
import { MdOutlineCalendarMonth } from "react-icons/md";
import '../Assets/styles/EcoFriendly/style.css';
import '../Assets/styles/ConsultationMeeting/style.css';
import { Helmet } from "react-helmet";
import axios from 'axios';

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

const VideoConferencing = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const userDetails = cookies.userDetails;
    const { appointmentId } = useParams();
    const [customer, setCustomers] = useState([]);
    const [customerLoading, setCustomerLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);
    const [consultationFormData, setConsultationFormData] = useState(intitialConsultationData);
    const [chatShow, setChatShow] = useState(true);
    const [participantsShow, setParticipantsShow] = useState(false);
    const [agendaShow, setAgendaShow] = useState(false);


    const getCustomer = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer/appointment/' + appointmentId);
    };

    const showTab = (tab) => {
        if (tab == "chat") {
            setChatShow(true);
            setParticipantsShow(false);
            setAgendaShow(false);

        } else if (tab === "participants") {
            setChatShow(false);
            setParticipantsShow(true);
            setAgendaShow(false);

        } else if (tab === "agenda") {
            setChatShow(false);
            setParticipantsShow(false);
            setAgendaShow(true);
        }
    };

    useEffect(() => {
        if (currentUser) {
            getCustomer()
                .then((response) => {
                    setCustomerLoading(false);
                    const selectedCustomer = response.data.data;
                    if (selectedCustomer) {
                        setCustomers(selectedCustomer);
                        setConsultationFormData(selectedCustomer);
                    } else {
                        toast.error('There has been an error getting the customer, please try again!');
                    }
                })
                .catch((error) => {
                    toast.error('There has been an error getting the customer, please try again!');
                });
        }
    },
        [reloadCount]);


    return (
        <Layout>
            <Helmet>
                <script
                    type="module"
                    src="https://cdn.srv.whereby.com/embed/v1.js"
                    async="true"
                >
                </script>
            </Helmet>
            <div className='py-5 px-2 top-bottom-embrace'>
                <section>
                    <Container>
                        <Row>
                            <Col lg="8">
                                <Card>
                                    <Card.Body>
                                        <Row>
                                            <Col lg="12">
                                                <div className='fw-600 fs-18'>Consultation Details</div>
                                                <hr />
                                            </Col>

                                            <Col lg="12">
                                                <div className='mt-1'><MdOutlineCalendarMonth size="20" className='text-gold me-2 mb-1' /><span className='fw-600 me-1'>Date:</span> 3 May,2024</div>
                                                <div className='mt-1'><GiAlarmClock size="20" className='text-gold me-2 mb-1' /><span className='fw-600 me-1'>Time:</span>12:15 AM to 1:45 AM</div>
                                                <div className='mt-1'><FiUser size="20" className='text-gold me-2 mb-1' /><span className='fw-600 me-1'>Customer:</span>Juriel Comia</div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                <Card className='mt-3'>
                                    <Card.Body >
                                        <Row>
                                            <Col lg="12">


                                                {consultationFormData.role === "" ?
                                                    <>
                                                        <whereby-embed
                                                            minimal
                                                            room={
                                                                consultationFormData.host_url +
                                                                `&background=off&audio=off&topToolbar=off&video=on&bottomToolbar=off&skipMediaPermissionPrompt=off&precallReview=off&displayName=` + customer?.user?.first_name + " " + customer?.user?.last_name
                                                            }
                                                            style={{ height: '500px' }}
                                                        />
                                                    </>
                                                    :
                                                    <>
                                                        <whereby-embed
                                                            minimal
                                                            room={consultationFormData.participant_url +
                                                                "?background=off&audio=off&settingsButton=off&moreButton=off&topToolbar=off&video=on&bottomToolbar=off&skipMediaPermissionPrompt=off&precallReview=off&displayName=" + customer?.user?.first_name + " " + customer?.user?.last_name
                                                            }
                                                            style={{ height: '500px' }}
                                                        />
                                                    </>
                                                }

                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                <Col lg="12" className='d-flex justify-content-center align-items-center mt-3'>
                                    <div className='d-flex'>
                                        <div className='mb-4'>
                                            <div className="action-button-meeting bg-red-icon">
                                                <IoMicOffOutline className="text-white off-cam-icon" size={20} />
                                            </div>
                                        </div>
                                        <div className='mb-4 ms-3 me-3'>
                                            <div className="action-button-meeting video-turn-off-button">
                                                <BiVideo className="text-white off-cam-icon" size={20} />
                                            </div>
                                        </div>
                                        <div className='mb-4 me-3'>
                                            <div className="action-button-meeting video-turn-off-button">
                                                <MdMonitor className="text-white off-cam-icon" size={20} />
                                            </div>
                                        </div>
                                        <div className='mb-4'>
                                            <div className="action-button-meeting bg-red-icon">
                                                <MdCallEnd className="text-white off-cam-icon" size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Col>

                            <Col lg="4">
                                <Card>
                                    <Card.Body className='chat-height'>
                                        {chatShow ?
                                            <>
                                                <Row>
                                                    <Col lg="12">
                                                        <div className='fw-600 fs-18 text-gold'>Chat</div>
                                                        <hr />
                                                    </Col>

                                                    <Col lg="12">
                                                        <Card className='border-none'>
                                                            <Card.Body className='chat-height-card'>

                                                            </Card.Body>
                                                        </Card>
                                                    </Col>

                                                    <Col lg="12">
                                                        <input type='text' className='form-control bg-light position-relative' placeholder='Type your message...' />
                                                        <IoSendOutline className="send-icon" size={25} />
                                                    </Col>
                                                </Row>
                                            </>
                                            :
                                            null
                                        }

                                        {participantsShow ?
                                            <>
                                                <Row>
                                                    <Col lg="12">
                                                        <div className='fw-600 fs-18 text-gold'>Participants</div>
                                                        <hr />
                                                    </Col>

                                                    <Col lg="12">
                                                        <Card className='border-none'>
                                                            <Card.Body className='chat-height-card'>

                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </>
                                            :
                                            null
                                        }

                                        {agendaShow ?
                                            <>
                                                <Row>
                                                    <Col lg="12">
                                                        <div className='fw-600 fs-18 text-gold'>Agenda</div>
                                                        <hr />
                                                    </Col>

                                                    <Col lg="12">
                                                        <Card className='border-none'>
                                                            <Card.Body className='chat-height-card'>

                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </>
                                            :
                                            null
                                        }

                                    </Card.Body>
                                </Card>

                                <Row>
                                    <Col className='d-flex justify-content-end mt-3'>
                                        <div
                                            className={`cursor-pointer action-button-meeting  meeting-tooltip tab-family mb-3 fs-16 ${agendaShow ? 'bg-gold-icon text-gold' : 'bg-gray-icon text-black'}`}
                                            onClick={function () { showTab("agenda"); }}
                                        >
                                            <span className="icon-tooltiptext fs-14">Agenda</span>
                                            <IoIosInformationCircleOutline className="text-white off-cam-icon" size={20} />
                                        </div>

                                        <div className={`cursor-pointer action-button-meeting  meeting-tooltip tab-family mx-3 mb-3 fs-16 ${participantsShow ? 'bg-gold-icon text-gold' : 'bg-gray-icon text-black'}`}
                                            onClick={function () { showTab("participants"); }}
                                        >
                                            <span className="icon-tooltiptext fs-14">Participants</span>
                                            <HiMiniUsers className="text-white off-cam-icon" size={20} />
                                        </div>

                                        <div className={`cursor-pointer action-button-meeting  meeting-tooltip  ${chatShow ? 'bg-gold-icon text-gold' : 'bg-gray-icon text-black'}`}
                                            onClick={function () { showTab("chat"); }}
                                        >
                                            <span className="icon-tooltiptext fs-14">Message</span>
                                            <BiSolidMessageDetail className="text-white off-cam-icon" size={20} />
                                        </div>
                                    </Col>
                                </Row>

                            </Col>
                        </Row>


                    </Container>
                </section>
            </div >
        </Layout >
    );
};

export default VideoConferencing;