
import React, { useState, useRef, useEffect } from 'react';
import { AccordionItem, UncontrolledAccordion, AccordionBody, AccordionHeader } from 'reactstrap';
import { PiDressLight, PiPantsLight } from "react-icons/pi";
import { PiUsersLight } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";
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
                                className='cursor-pointer users-title yellow-hover'
                                onClick={() => navigate('/admin/users')}
                            >
                                <PiUsersLight size="22" className="me-2 mb-1" color='#000000' />
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

                        {/* <AccordionHeader
                            targetId="2"
                            className='mt-2 hover-sidebar'
                            onClick={() => navigate('/admin/users')}
                        >
                            <span><PiUsersLight size="22" className="me-2 mb-1" color='#000000' /></span>
                            <span className="cursor-pointer order-font yellow-hover">
                                Users
                                <IoIosArrowDown className='ms-5' color='#000000' /></span>
                        </AccordionHeader>

                        <AccordionBody accordionId="2">
                            <div
                                className="hover-sidebar cursor-pointer ms-3 yellow-hover"
                                onClick={() => navigate('/admin/designers')}>
                                Designers
                            </div>

                            <div
                                className="hover-sidebar cursor-pointer ms-3 yellow-hover mt-3"
                                onClick={() => navigate('/admin/sellers')}>
                                Sellers
                            </div>
                        </AccordionBody> */}

                        <div
                            className="hover-sidebar cursor-pointer yellow-hover mt-3"
                            onClick={() => navigate('/admin/fabrics')}
                        >
                            <PiDressLight size="22" className="me-2 mb-1" color='#000000' />Fabrics
                        </div>

                        <div
                            className="hover-sidebar cursor-pointer yellow-hover mt-3"
                            onClick={() => navigate('/admin/designs')}>
                            <PiPantsLight size="22" className="me-2 mb-1" color='#000000' />Portfolio
                        </div>
                    </AccordionItem>
                </UncontrolledAccordion>
            </div >
        </>
    )
}

export default Sidebar;