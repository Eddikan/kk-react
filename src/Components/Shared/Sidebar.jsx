
import React, { useState, useRef, useEffect } from 'react';
import {
    CardFooter,
    Input,
    CardBody,
    Label,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Card,
    Col,
    Modal,
    Table,
    Row,
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
    UncontrolledAccordion
} from 'reactstrap';
import { useCookies } from 'react-cookie';
import '../../Assets/styles/Sidebar/style.css'
import { HiOutlineScissors } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';
import { PiShoppingCartSimple, PiSuitcaseSimple, PiBriefcase } from "react-icons/pi";
import axios from "axios";
import Container from 'react-bootstrap/Container';
import toast from 'react-hot-toast';
import { RxRulerHorizontal } from "react-icons/rx";
import { IoCalendarClearOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";


const Sidebar = ({ currentTab, onChangeTab }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const [user, setUser] = useState('');
    const [designerId, setDesignerId] = useState('');
    const navigate = useNavigate();

    const getUser = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser);
    };

    useEffect(() => {
        getUser()
            .then((response) => {
                const selectedUser = response.data.data;
                if (selectedUser) {
                    setUser(selectedUser);
                    setDesignerId(selectedUser.designer.id);
                } else {
                    toast.error('There has been an error getting the user, please try again!');
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the user, please try again!');
            });
    }, []);

    return (
        <>

            <div id="sidebar">
                <UncontrolledAccordion>
                    <AccordionItem className='padding-sidebar pt-4'>
                        <p className="fs-20"><strong>Seller Center</strong></p>
                        <div className="hover-sidebar cursor-pointer yellow-hover mt-3" onClick={() => navigate('/user/center/calendar')}><IoCalendarClearOutline size="20" className="me-2" />Calendar</div>

                        <a className="yellow-hover cursor-pointer text-decoration "
                            href={`/user/center/appointments`}
                        >
                            <div className="hover-sidebar cursor-pointer yellow-hover mt-3" onClick={() => navigate('/user/center/portfolio')}><PiBriefcase size="22" className="me-2" />Appointments</div>
                        </a>

                        {/* <AccordionHeader targetId="1">
                            <span><PiSuitcaseSimple size="22" className="me-2 text-black" /></span>
                            <span className="appointments cursor-pointer text-black">Appointments<IoIosArrowDown className='ms-3 text-black' /></span>
                        </AccordionHeader> */}

                        {/* <AccordionBody accordionId="1">
                            <a className="yellow-hover cursor-pointer text-decoration "
                                href={`/user/center/appointments`}
                            >
                                List
                            </a>
                            <p className="yellow-hover cursor-pointer mt-3" onClick={() => navigate('/user/center/calendar)}>Calendar</p>
                        </AccordionBody> */}

                        <AccordionHeader targetId="2" className='mt-2 hover-sidebar' onClick={() => navigate('/user/center/orders')}>
                            <span><PiShoppingCartSimple size="22" className="me-2" /></span>
                            <span className=" orders cursor-pointer mt-3 order-font" >Orders <IoIosArrowDown className='ms-3' /></span>
                        </AccordionHeader>

                        <AccordionBody accordionId="2">
                            <p className={currentTab == 'All' ? 'active-class cursor-pointer fw-600 text-gold' : 'cursor-pointer '} onClick={() => onChangeTab('All')}>All</p>
                            <p className={currentTab == 'Pending' ? 'active-class cursor-pointer fw-600 text-gold' : 'cursor-pointer '} onClick={() => onChangeTab('Pending')}>Pending</p>
                            <p className={currentTab == 'Processing' ? 'active-class cursor-pointer fw-600 text-gold' : 'cursor-pointer '} onClick={() => onChangeTab('Processing')}>Processing</p>
                            <p className={currentTab == 'Shipped' ? 'active-class cursor-pointer fw-600 text-gold' : 'cursor-pointer '} onClick={() => onChangeTab('Shipped')}>Shipped</p>
                            <p className={currentTab == 'Delivered' ? 'active-class cursor-pointer fw-600 text-gold' : 'cursor-pointer'} onClick={() => onChangeTab('Delivered')}>Delivered</p>
                            <p className={currentTab == 'Review' ? 'active-class cursor-pointer fw-600 text-gold' : 'cursor-pointer '} onClick={() => onChangeTab('Review')}>Review and Feedback</p>
                        </AccordionBody>

                        <div className="hover-sidebar cursor-pointer yellow-hover mt-3" onClick={() => navigate('/user/center/portfolio')}><PiBriefcase size="22" className="me-2" />Portfolio</div>
                        <div className="hover-sidebar cursor-pointer yellow-hover mt-3" onClick={() => navigate('/user/center/products')}><HiOutlineScissors size="22" className="me-2" />Fabrics</div>
                        <div className="hover-sidebar cursor-pointer yellow-hover mt-3" onClick={() => navigate('/user/center/guide')}><RxRulerHorizontal size="22" className="me-2" />Measurement Guide</div>
                    </AccordionItem>
                </UncontrolledAccordion>
            </div >
        </>
    )
}

export default Sidebar;