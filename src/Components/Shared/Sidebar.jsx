
import React, { useState, useRef, useEffect } from 'react';
import {
    CardFooter, Input, CardBody, Label, ModalHeader, ModalBody, ModalFooter, Card, Col, Modal, Table, Row, Accordion,
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
import { IoIosArrowDown } from "react-icons/io";


const Sidebar = ({ currentTab, onChangeTab }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const [user, setUser] = useState('');
    const [designerId, setDesignerId] = useState('');
    const [allShow, setAllShow] = useState(true);
    const [show, setShow] = useState(false);

    const [onCurrentTab, setOnCurrentTab] = useState('');

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
                    toast.error('There has been an error getting the date, please try again!');
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the date, please try again!');
            });
    }, []);



    return (
        <>

            <div id="sidebar">
                <UncontrolledAccordion>
                    <AccordionItem className='padding-sidebar'>
                        <AccordionHeader targetId="1">
                            <span><PiSuitcaseSimple size="22" className="me-2 text-black" /></span>
                            <span className="appointments cursor-pointer fs-18 text-black">Appointments<IoIosArrowDown className='ms-3 text-black' /></span>
                        </AccordionHeader>

                        <AccordionBody accordionId="1">
                            <a className="yellow-hover cursor-pointer fs-18 text-decoration "
                                href={`/appointment-list/${designerId}`}
                            >
                                Appointment Lists
                            </a>
                            <p className="yellow-hover cursor-pointer mt-3 fs-18" onClick={() => navigate('/seller-center/' + designerId)}>Calendar</p>
                        </AccordionBody>

                        <AccordionHeader targetId="2" className='mt-2 text-black' onClick={() => navigate('/orders-seller')}>
                            <span><PiShoppingCartSimple size="22" className="me-2" /></span>
                            <span className="orders cursor-pointer fs-18 mt-3 text-black" >Orders <IoIosArrowDown className='ms-3' /></span>
                        </AccordionHeader>

                        <AccordionBody accordionId="2">
                            <p className={currentTab == 'all' ? 'active-class cursor-pointer fs-18 fw-600 text-gold' : 'cursor-pointer '} onClick={() => onChangeTab('all')}>All</p>
                            <p className={currentTab == 'active' ? 'active-class cursor-pointer fs-18 fw-600 text-gold' : 'cursor-pointer '} onClick={() => onChangeTab('active')}>Active</p>
                            <p className={currentTab == 'processing' ? 'active-class cursor-pointer fs-18 fw-600 text-gold' : 'cursor-pointer '} onClick={() => onChangeTab('processing')}>Processing</p>
                            <p className={currentTab == 'shipped' ? 'active-class cursor-pointer fs-18 fw-600 text-gold' : 'cursor-pointer '} onClick={() => onChangeTab('shipped')}>Shipped</p>
                            <p className={currentTab == 'delivered' ? 'active-class cursor-pointer fs-18 fw-600 text-gold' : 'cursor-pointer'} onClick={() => onChangeTab('delivered')}>Delivered</p>
                            <p className={currentTab == 'review' ? 'active-class cursor-pointer fs-18 fw-600 text-gold' : 'cursor-pointer '} onClick={() => onChangeTab('review')}>Review and Feedback</p>

                        </AccordionBody>

                        <div className="portfolio cursor-pointer yellow-hover mt-3 fs-18 " onClick={() => navigate('/user/portfolio')}><PiBriefcase size="22" className="me-2" />Portfolio</div>
                        <div className="fabrics cursor-pointer yellow-hover mt-3 fs-18 " onClick={() => navigate('/user/products')}><HiOutlineScissors size="22" className="me-2" />Fabrics</div>
                        <div className="fabrics cursor-pointer yellow-hover mt-3 fs-18 " onClick={() => navigate('/user/measurement-guide')}><RxRulerHorizontal size="22" className="me-2" />Measurement Guide</div>
                    </AccordionItem>
                </UncontrolledAccordion>
            </div>
        </>
    )
}

export default Sidebar;