
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
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Button, ModalHeader, Card, ModalFooter } from 'react-bootstrap';
import { PiShoppingCartSimple, PiScissorsLight, PiPantsLight, PiBriefcase } from "react-icons/pi";
import { RxRulerHorizontal } from "react-icons/rx";
import { IoCalendarClearOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { TfiRulerAlt } from "react-icons/tfi";
import { LiaFemaleSolid } from "react-icons/lia";
import { IoBodyOutline } from "react-icons/io5";
import { RxRulerSquare } from "react-icons/rx";
import { RiGuideLine } from "react-icons/ri";
import { LiaRulerVerticalSolid } from "react-icons/lia";
import { RiLiveLine } from "react-icons/ri";
import { MdOutlineDescription } from "react-icons/md";


const SidebarMeasurementGuide = ({ onChangeTab }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const userDetails = cookies.userDetails;

    const module = window.location.pathname.split('/').pop();
    const navigate = useNavigate();

    useEffect(() => {
        onChangeTab(1);
    }, []);

    return (
        <>
            <div id="sidebar" className="pe-3">
                <UncontrolledAccordion>
                    <AccordionItem className='padding-sidebar pt-4'>
                        <p className="fs-20 text-black"><strong>Measurement Guide</strong></p>

                        <div className="hover-sidebar cursor-pointer yellow-hover mt-3" onClick={() => onChangeTab(1)}>
                            <TfiRulerAlt  size="22" className="me-2 mb-1" />How to Measure Yourself</div>
                  
                            <div className="hover-sidebar cursor-pointer yellow-hover mt-3" onClick={() => onChangeTab(2)}>
                                <LiaFemaleSolid size="22" className="me-2 mb-1" />
                                Female Body Types
                            </div>

                            <div className="hover-sidebar cursor-pointer yellow-hover mt-3" onClick={() => onChangeTab(3)} >
                                <LiaRulerVerticalSolid size="22" className="me-2 mb-1" />
                                Body Measurement Table
                            </div>

                            <div className="hover-sidebar cursor-pointer yellow-hover mt-3" onClick={() => onChangeTab(4)} >
                                <RiGuideLine size="22" className="me-2 mb-1" />
                                Comprehensive Guide
                            </div>

                            <div className="hover-sidebar cursor-pointer yellow-hover mt-3" onClick={() => onChangeTab(5)} >
                                <MdOutlineDescription size="22" className="me-2 mb-1" />
                                Body Measurement Descriptions
                            </div>

                    
                                
                        
                    </AccordionItem>
                
                </UncontrolledAccordion>
            </div >
        </>
    )
}

export default SidebarMeasurementGuide;