import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
import { CiCreditCard2 } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AiFillMessage } from "react-icons/ai";
import User from 'Assets/images/user.png';
import 'Assets/styles/RateReview/style.css';
import { LiaSmileBeam } from "react-icons/lia";
import { VscSend } from "react-icons/vsc";
import { IoIosAttach } from "react-icons/io";
import { IoCloseOutline, IoVideocam } from "react-icons/io5";
import { GoHeart, GoAlertFill, GoShareAndroid } from 'react-icons/go';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import PlaceholderSquare from 'Assets/images/square-placeholder.jpg';
import axios from "axios";
import toast from 'react-hot-toast';

const initialCheckOut = {
    card_name: '',
    card_number: '',
    date: ''
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

const ChatBox = ({ chatBox, onCloseChat }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const [checkOutFormData, setCheckOutFormData] = useState(initialCheckOut);
    // const [chatBox, setChatBox] = useState(false);


    useEffect(() => {
        document.body.classList.add('designer-calendar-body');
    }, []);

    return (
        <>
            {
                chatBox ?
                    <>
                        < Card className='width-chat-card px-0' >
                            <Card.Header className='header-chat bg-white'>
                                <div className='d-flex justify-content-between'>
                                    <div>
                                        <span className="fs-14 fw-500 mb-0 name-of-user-chat">
                                            {/* {portfolio.user.first_name && portfolio.user.first_name != "" ? portfolio.user.first_name : "-"} &nbsp;
                                                    {portfolio.user.last_name && portfolio.user.last_name != "" ? portfolio.user.last_name : "-"} */}
                                        </span>
                                        <span className='ms-3 active-now fs-14 fw-400'>Active Now</span>
                                    </div>
                                    <div className="cursor-pointer" onClick={onCloseChat()}>
                                        <IoCloseOutline color="#39393A" />
                                    </div>
                                </div>
                            </Card.Header>

                            <Card.Body >

                                <div>
                                    <div className='mt-4 d-flex portfolio-designer-chat'>
                                        {/* {portfolio.user.image && (
                                                    <div
                                                        className='designer-photo'
                                                        style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${portfolio.user.image})` }}
                                                    >
                                                    </div>
                                                )} */}
                                        <div className="designer-info mx-2">
                                            <div>
                                                <p className="fs-14 fw-600 mb-0 name-of-user-chat ms-2">
                                                    {/* {portfolio.user.first_name && portfolio.user.first_name != "" ? portfolio.user.first_name : "-"} {portfolio.user.last_name && portfolio.user.last_name != "" ? portfolio.user.last_name : "-"} */}
                                                    <span className='ms-3 fs-14 time-chat fw-400'>2:23 PM</span>
                                                </p>
                                            </div>

                                            <div className='fs-14 ms-2 mt-2 name-of-user-chat'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam.</div>
                                        </div>

                                    </div>
                                </div>

                                <div className='mt-5 mb-4 text-right d-flex'>
                                    <div>
                                        <div className='time-chat-box fs-14 fw-400'>3:30 PM
                                            <span className='ms-2 you-chat-box fw-600 fs-14'>You</span></div>
                                        <div className='mt-2 welcome-chat'>
                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                                        </div>
                                    </div>

                                    <img src={User} className='placeholder-chat ms-3' />
                                </div>

                                <div className='mt-3'>
                                    <input type="text" className='form-control' />
                                </div>

                                <div className='mt-3 d-flex justify-content-between'>
                                    <div className='d-flex'>
                                        <div className='cursor-pointer'
                                        // onClick={() => toggleUnderConstruction("")}
                                        >
                                            <LiaSmileBeam className='me-2' size={20} /></div>
                                        <div className='cursor-pointer'
                                        // onClick={() => toggleUnderConstruction("")}
                                        >
                                            <IoIosAttach size={20} /></div>
                                    </div>
                                    <div>
                                        <div
                                            className="cursor-pointer fw-500"
                                        // onClick={() => toggleUnderConstruction("Send Message")}
                                        >
                                            Send
                                            <VscSend className='ms-1' />
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card >
                    </>
                    :
                    null
            }
        </>
    );
};

export default ChatBox;