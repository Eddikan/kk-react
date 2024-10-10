
import React, { useState, useRef, useEffect } from 'react';
import {
    AccordionBody,
    AccordionHeader,
    AccordionItem,
    UncontrolledAccordion
} from 'reactstrap';
import { useCookies } from 'react-cookie';
import 'Assets/styles/Sidebar/style.css'
import 'Assets/styles/FormatMeasurementGuide/style.css';
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
    const [showBodyMeasurementSubMenu, setShowBodyMeasurementSubMenu] = useState(false);
    const [showComprehensiveGuideSubMenu, setShowComprehensiveGuideSubMenu] = useState(false);
    const [showBodyMeasurementDescriptionSubMenu, setShowBodyMeasurementDescriptionSubMenu] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const userDetails = cookies.userDetails;

    const module = window.location.pathname.split('/').pop();
    const navigate = useNavigate();

    useEffect(() => {
        onChangeTab(1);
    }, []);

    const toggleBodyMeasurementSubMenu = () => {
        setShowBodyMeasurementSubMenu(!showBodyMeasurementSubMenu);
        setShowComprehensiveGuideSubMenu(false);
        setShowBodyMeasurementDescriptionSubMenu(false);
    };

    const toggleComprehensiveGuideSubMenu = () => {
        setShowComprehensiveGuideSubMenu(!showComprehensiveGuideSubMenu);
        setShowBodyMeasurementSubMenu(false);
        setShowBodyMeasurementDescriptionSubMenu(false);
    };

    const toggleBodyMeasurementDescriptionSubMenu = () => {
        setShowBodyMeasurementDescriptionSubMenu(!showBodyMeasurementDescriptionSubMenu);
        setShowBodyMeasurementSubMenu(false);
        setShowComprehensiveGuideSubMenu(false);
    };

    return (
        <>
            <div id="sidebar-measurement-guide" className="pe-3">
                <UncontrolledAccordion>
                    <AccordionItem className='padding-sidebar pt-4'>
                        <p className="fs-20 text-black"><strong>Measurement Guide</strong></p>

                        <div className="hover-sidebar cursor-pointer yellow-hover fs-14 mt-3" onClick={() => onChangeTab(1)}>
                            <TfiRulerAlt size="22" className="me-2 mb-1" />How to Measure Yourself</div>

                        <div className="hover-sidebar cursor-pointer yellow-hover fs-14 mt-3" onClick={() => onChangeTab(2)}>
                            <LiaFemaleSolid size="22" className="me-2 mb-1" />
                            Female Body Types
                        </div>

                        <div className="hover-sidebar cursor-pointer yellow-hover fs-14 mt-3 d-flex justify-content-between" onClick={toggleBodyMeasurementSubMenu} >
                            <div>
                                <LiaRulerVerticalSolid size="22" className="me-2 mb-1" />
                                Body Measurement Table
                            </div>
                            <IoIosArrowDown size="20px" className={`ms-2 ${showBodyMeasurementSubMenu ? 'rotate-icon' : ''}`} />
                        </div>
                        {showBodyMeasurementSubMenu && (
                            <div className="submenu" style={{ marginLeft: '28px' }}>
                                <div className="p-1 px-3">
                                    <p className='cursor-pointer mb-0 yellow-hover' onClick={() => onChangeTab(3)}>Men</p>
                                </div>

                                <div className="p-1 px-3">
                                    <p className='cursor-pointer mb-0 yellow-hover' onClick={() => onChangeTab(4)}>Women</p>
                                </div>

                                <div className="p-1 px-3">
                                    <p className='cursor-pointer mb-0 yellow-hover' onClick={() => onChangeTab(5)}>Male Child</p>
                                </div>

                                <div className="p-1 px-3">
                                    <p className='cursor-pointer mb-0 yellow-hover' onClick={() => onChangeTab(6)}>Female Child</p>
                                </div>
                            </div>
                        )}

                        <div className="hover-sidebar cursor-pointer yellow-hover fs-14 mt-3 d-flex justify-content-between" onClick={toggleComprehensiveGuideSubMenu}>
                            <div>
                                <RiGuideLine size="22" className="me-2 mb-1" />
                                Comprehensive Guide
                            </div>
                            <IoIosArrowDown size="20px" className={`ms-2 ${showComprehensiveGuideSubMenu ? 'rotate-icon' : ''}`} />
                        </div>
                        {showComprehensiveGuideSubMenu && (
                            <div className="submenu" style={{ marginLeft: '28px' }}>
                                <div className="p-1 px-3">
                                    <p className='cursor-pointer mb-0 yellow-hover' onClick={() => onChangeTab(7)}>Men</p>
                                </div>

                                <div className="p-1 px-3">
                                    <p className='cursor-pointer mb-0 yellow-hover' onClick={() => onChangeTab(8)}>Women</p>
                                </div>
                            </div>
                        )}

                        <div className="hover-sidebar cursor-pointer yellow-hover fs-14 mt-3 d-flex justify-content-between" onClick={toggleBodyMeasurementDescriptionSubMenu}>
                            <div>
                                <MdOutlineDescription size="22" className="me-2 mb-1" />
                                Body Measurement Descriptions
                            </div>
                            <IoIosArrowDown size="20px" className={`ms-2 ${showBodyMeasurementDescriptionSubMenu ? 'rotate-icon' : ''}`} />
                        </div>
                        {showBodyMeasurementDescriptionSubMenu && (
                            <div className="submenu" style={{ marginLeft: '28px' }}>
                                <div className="p-1 px-3">
                                    <p className='cursor-pointer mb-0 yellow-hover' onClick={() => onChangeTab(9)}>Men</p>
                                </div>

                                <div className="p-1 px-3">
                                    <p className='cursor-pointer mb-0 yellow-hover' onClick={() => onChangeTab(10)}>Women</p>
                                </div>
                            </div>
                        )}

                    </AccordionItem>

                </UncontrolledAccordion>
            </div >
        </>
    )
}

export default SidebarMeasurementGuide;