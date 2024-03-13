
import React, { useState, useRef, useEffect } from 'react';
import { AccordionItem, UncontrolledAccordion, AccordionBody, AccordionHeader } from 'reactstrap';
import { PiDressLight, PiPantsLight } from "react-icons/pi";
import { PiUsersLight } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import '../../Assets/styles/Sidebar/style.css';
import { useCookies } from 'react-cookie';

const Sidebar = ({ }) => {
    const navigate = useNavigate();

    return (
        <>
            <div id="sidebar">
                <UncontrolledAccordion>
                    <AccordionItem className='padding-sidebar pt-4'>
                        <p className="fs-20"><strong>Admin</strong></p>
                        {/* <div
                            className="hover-sidebar cursor-pointer yellow-hover mt-3"
                            onClick={() => navigate('/admin/users')}
                        >
                            <HiOutlineUsers size="20" className="me-2 mb-1" />Users
                        </div> */}

                        <AccordionHeader
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
                        </AccordionBody>

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