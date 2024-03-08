
import React, { useState, useRef, useEffect } from 'react';
import { AccordionItem, UncontrolledAccordion } from 'reactstrap';
import { PiDressLight, PiPantsLight } from "react-icons/pi";
import { HiOutlineUsers } from "react-icons/hi2";
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
                        <div
                            className="hover-sidebar cursor-pointer yellow-hover mt-3"
                            onClick={() => navigate('/admin/users')}
                        >
                            <HiOutlineUsers size="20" className="me-2 mb-1" />Users
                        </div>

                        <div
                            className="hover-sidebar cursor-pointer yellow-hover mt-3"
                            onClick={() => navigate('/admin/fabrics')}
                        >
                            <PiDressLight size="22" className="me-2 mb-1" />Fabrics
                        </div>

                        <div
                            className="hover-sidebar cursor-pointer yellow-hover mt-3"
                            onClick={() => navigate('/admin/designs')}>
                            <PiPantsLight size="22" className="me-2 mb-1" />Portfolio
                        </div>
                    </AccordionItem>
                </UncontrolledAccordion>
            </div >
        </>
    )
}

export default Sidebar;