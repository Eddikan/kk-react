
import React, { useState, useRef, useEffect } from 'react';
import {
    AccordionBody,
    AccordionHeader,
    AccordionItem,
    UncontrolledAccordion
} from 'reactstrap';
import { useCookies } from 'react-cookie';
import 'Assets/styles/Sidebar/style.css'
import { HiOutlineScissors } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, ModalHeader, Card, ModalFooter } from 'react-bootstrap';
import { PiShoppingCartSimple, PiSuitcaseSimple, PiBriefcase } from "react-icons/pi";
import { RxRulerHorizontal } from "react-icons/rx";
import { IoCalendarClearOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";


const Sidebar = ({ currentTab, onChangeTab }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const navigate = useNavigate();

    useEffect(() => {

    }, []);

    return (
        <>
            <div id="sidebar">
                <UncontrolledAccordion>
                    <AccordionItem className='padding-sidebar pt-4'>
                        <p className="fs-20 text-black"><strong>Shop Manager</strong></p>
                        <div className="hover-sidebar cursor-pointer yellow-hover mt-3" onClick={() => navigate('/user/center/calendar')}>
                            <IoCalendarClearOutline size="20" className="me-2 mb-1" />Calendar</div>

                        <a className="yellow-hover cursor-pointer text-decoration "
                            href={`/user/center/appointments`}
                        >
                            <div className="hover-sidebar cursor-pointer yellow-hover mt-3" onClick={() => navigate('/user/center/portfolio')}>
                                <PiBriefcase size="22" className="me-2 mb-1" />
                                Appointments
                            </div>
                        </a>

                        <div className='mt-3 d-flex justify-content-between'>
                            {/* <span><PiShoppingCartSimple size="22" className="me-2 mb-1" color='#000000' /></span> */}
                            <div className='yellow-hover'>
                                <span
                                    className='cursor-pointer users-title '
                                    onClick={() => navigate('/user/center/orders')}
                                >
                                    <PiShoppingCartSimple size="22" className="me-2 mb-1" />
                                    Orders
                                </span>
                            </div>

                            <span className="shop-manager-table">
                                <span><IoIosArrowDown className='me-4' color='#000000' /></span>

                                <Card className="table_content file-action">
                                    <Card.Body className="action_container font-weight">
                                        <div className="shop_container cursor-pointer p-1 px-3">
                                            <p className={currentTab == 'All' ? 'active-class cursor-pointer mb-0 fw-600 text-gold' : 'cursor-pointer mb-0'} onClick={() => onChangeTab('All')}>All</p>
                                        </div>

                                        <div className="shop_container cursor-pointer p-1 px-3">
                                            <p className={currentTab == 'Pending' ? 'active-class cursor-pointer mb-0 fw-600 text-gold' : 'cursor-pointer mb-0'} onClick={() => onChangeTab('Pending')}>Pending</p>
                                        </div>

                                        <div className="shop_container cursor-pointer p-1 px-3">
                                            <p className={currentTab == 'Processing' ? 'active-class cursor-pointer mb-0 fw-600 text-gold' : 'cursor-pointer mb-0'} onClick={() => onChangeTab('Processing')}>Processing</p>
                                        </div>

                                        <div className="shop_container cursor-pointer p-1 px-3">
                                            <p className={currentTab == 'Shipped' ? 'active-class cursor-pointer mb-0 fw-600 text-gold' : 'cursor-pointer mb-0'} onClick={() => onChangeTab('Shipped')}>Shipped</p>
                                        </div>

                                        <div className="shop_container cursor-pointer p-1 px-3">
                                            <p className={currentTab == 'Delivered' ? 'active-class cursor-pointer mb-0 fw-600 text-gold' : 'cursor-pointer mb-0'} onClick={() => onChangeTab('Delivered')}>Delivered</p>
                                        </div>

                                        <div className="shop_container cursor-pointer p-1 px-3">
                                            <p className={currentTab == 'Review' ? 'active-class cursor-pointer fw-600 mb-0 text-gold' : 'cursor-pointer mb-0'} onClick={() => onChangeTab('Review')}>Review and Feedback</p>
                                        </div>

                                    </Card.Body>
                                </Card>
                            </span>
                        </div>

                        {/* 
                        <AccordionHeader targetId="2" className='mt-2 hover-sidebar' onClick={() => navigate('/user/center/orders')}>
                            <span><PiShoppingCartSimple size="22" className="me-2 mb-1" /></span>
                            <span className=" orders cursor-pointer mt-3 order-font" >Orders <IoIosArrowDown className='ms-5' /></span>
                        </AccordionHeader>

                        <AccordionBody accordionId="2">
                            <p className={currentTab == 'All' ? 'active-class cursor-pointer fw-600 text-gold' : 'cursor-pointer '} onClick={() => onChangeTab('All')}>All</p>
                            <p className={currentTab == 'Pending' ? 'active-class cursor-pointer fw-600 text-gold' : 'cursor-pointer '} onClick={() => onChangeTab('Pending')}>Pending</p>
                            <p className={currentTab == 'Processing' ? 'active-class cursor-pointer fw-600 text-gold' : 'cursor-pointer '} onClick={() => onChangeTab('Processing')}>Processing</p>
                            <p className={currentTab == 'Shipped' ? 'active-class cursor-pointer fw-600 text-gold' : 'cursor-pointer '} onClick={() => onChangeTab('Shipped')}>Shipped</p>
                            <p className={currentTab == 'Delivered' ? 'active-class cursor-pointer fw-600 text-gold' : 'cursor-pointer'} onClick={() => onChangeTab('Delivered')}>Delivered</p>
                            <p className={currentTab == 'Review' ? 'active-class cursor-pointer fw-600 text-gold' : 'cursor-pointer '} onClick={() => onChangeTab('Review')}>Review and Feedback</p>
                        </AccordionBody> */}

                        <div className="hover-sidebar cursor-pointer yellow-hover mt-3" onClick={() => navigate('/user/center/portfolio')}><PiBriefcase size="22" className="me-2 mb-1" />Portfolio</div>
                        <div className="hover-sidebar cursor-pointer yellow-hover mt-3" onClick={() => navigate('/user/center/products')}><HiOutlineScissors size="22" className="me-2 mb-1" />Fabrics</div>
                        <div className="hover-sidebar cursor-pointer yellow-hover mt-3" onClick={() => navigate('/user/center/guide')}><RxRulerHorizontal size="22" className="me-2 mb-1" />Measurement Guide</div>
                    </AccordionItem>
                </UncontrolledAccordion>
            </div >
        </>
    )
}

export default Sidebar;