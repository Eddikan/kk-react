
import React, { useState, useRef, useEffect } from 'react';
import { AccordionItem, UncontrolledAccordion, AccordionBody, AccordionHeader } from 'reactstrap';
import { PiDressLight, PiPantsLight, PiCalendarThin } from "react-icons/pi";
import { PiUsersLight } from "react-icons/pi";
import { HiOutlineScissors } from "react-icons/hi2";
import { IoIosArrowDown } from "react-icons/io";
import { PiNotepadLight, PiScissorsLight, PiShoppingCartSimple } from "react-icons/pi";
import { Row, Col, Button, ModalHeader, Card, ModalFooter } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'Assets/styles/Sidebar/style.css';

const Sidebar = ({ }) => {
    const navigate = useNavigate();

    return (
        <>
            <div id="sidebar">
                <UncontrolledAccordion>
                    <AccordionItem className='padding-sidebar pt-4'>
                        <p className="fs-20 text-black"><strong>Admin</strong></p>

                        <div className='d-flex justify-content-between'>
                            <span
                                className='cursor-pointer users-title fs-14 yellow-hover'
                                onClick={() => navigate('/admin/users')}
                            >
                                <PiUsersLight size="22" className="me-2 mb-1" />
                                Users
                            </span>

                            <span className="users-table">
                                <span><IoIosArrowDown className='me-4' color='#000000' /></span>

                                <Card className="table_content file-action">
                                    <Card.Body className="action_container font-weight">
                                        <div
                                            className="users_container cursor-pointer p-2"
                                            onClick={() => navigate('/admin/designers')}
                                        >
                                            <span className='yellow-hover'>Designers</span>
                                        </div>

                                        <div
                                            className="users_container cursor-pointer p-2"
                                            onClick={() => navigate('/admin/sellers')}
                                        >
                                            <span className='yellow-hover'>Sellers</span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </span>
                        </div>

                        <div
                            className="hover-sidebar cursor-pointer yellow-hover fs-14 mt-3"
                            onClick={() => navigate('/admin/orders')}
                        >
                            <PiShoppingCartSimple size="22" className="me-2 mb-1" />Orders
                        </div>

                        <div
                            className="hover-sidebar cursor-pointer yellow-hover fs-14 mt-3"
                            onClick={() => navigate('/admin/fabrics')}
                        >
                            <PiScissorsLight size="22" className="me-2 mb-1" />Fabrics
                        </div>

                        <div
                            className="hover-sidebar cursor-pointer yellow-hover fs-14 mt-3"
                            onClick={() => navigate('/admin/designs')}>
                            <PiPantsLight size="22" className="me-2 mb-1" />Portfolio
                        </div>

                        <div
                            className="hover-sidebar cursor-pointer yellow-hover fs-14 mt-3"
                            onClick={() => navigate('/admin/appointments')}
                        >
                            <PiCalendarThin size="22" className="me-2 mb-1" />Appointments
                        </div>

                        <div className='d-flex justify-content-between mt-3 survey-table'>
                            <span
                                className='cursor-pointer users-title fs-14 yellow-hover'
                                onClick={() => navigate('/admin/customer-satisfaction-survey')}
                            >
                                <PiNotepadLight size="22" className="me-2 mb-1" />
                                Surveys
                            </span>

                            <span>
                                <div>
                                    <IoIosArrowDown className='me-4 mt-1' />
                                </div>

                                <Card className="table_content file-action">
                                    <Card.Body className="action_container font-weight">
                                        <div
                                            className="users_container cursor-pointer p-2"
                                            onClick={() => navigate('/admin/customer-satisfaction-survey')}
                                        >
                                            <span className='yellow-hover'>Customer Satisfaction</span>
                                        </div>

                                        <div
                                            className="users_container cursor-pointer p-2"
                                            onClick={() => navigate('/admin/post-purchase-survey')}
                                        >
                                            <span className='yellow-hover'>Post Purchase</span>
                                        </div>

                                        <div
                                            className="users_container cursor-pointer p-2"
                                            onClick={() => navigate('/admin/general-feedback-survey')}
                                        >
                                            <span className='yellow-hover'>General Feedback</span>
                                        </div>

                                        <div
                                            className="users_container cursor-pointer p-2"
                                            onClick={() => navigate('/admin/vendor-feedback-survey')}
                                        >
                                            <span className='yellow-hover'>Vendor Feedback</span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </span>
                        </div>
                    </AccordionItem>
                </UncontrolledAccordion>
            </div >
        </>
    )
}

export default Sidebar;