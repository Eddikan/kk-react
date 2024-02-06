
import React, { useState, useRef, useEffect } from 'react';
import {
    Container, CardFooter, Input, CardBody, Label, ModalHeader, ModalBody, ModalFooter, Card, Col, Modal, Table, Row, Accordion,
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
import toast from 'react-hot-toast';


const Sidebar = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const [user, setUser] = useState('');
    const reloadCount = props.reloadCount;
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
                    toast.error('There has been an error getting the date, please try again!');
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the date, please try again!');
            });
    }, [reloadCount]);

    return (
        <>
            <div id="sidebar">

                <div className="sidebar-menu">
                    <UncontrolledAccordion>
                        <AccordionItem>
                            <AccordionHeader targetId="1">
                                <PiSuitcaseSimple size="22" className="me-3" />
                                <span className="appointments cursor-pointer yellow-hover fs-18">Appointments</span>
                            </AccordionHeader>

                            <AccordionBody accordionId="1">
                                <a className="yellow-hover cursor-pointer fs-18"
                                    // onClick={() => navigate('/appointment-list')}
                                    href={`/appointment-list/${designerId}`}
                                >
                                    Appointment Lists
                                </a>
                                <p className="yellow-hover cursor-pointer fs-18" onClick={() => navigate('#')}>Calendar</p>
                            </AccordionBody>

                            <AccordionHeader targetId="2"><PiShoppingCartSimple size="22" className="me-3" />
                                <span className="orders cursor-pointer fs-18">Orders</span>
                            </AccordionHeader>

                            <AccordionBody accordionId="2">
                                <p className="yellow-hover cursor-pointer fs-18" onClick={() => navigate('/orders-seller')}>All</p>
                                <p className="yellow-hover cursor-pointer fs-18" onClick={() => navigate('#')}>Active</p>
                                <p className="yellow-hover cursor-pointer fs-18" onClick={() => navigate('#')}>Processing</p>
                                <p className="yellow-hover cursor-pointer fs-18" onClick={() => navigate('#')}>Shipped</p>
                                <p className="yellow-hover cursor-pointer fs-18" onClick={() => navigate('#')}>Delivered</p>
                                <p className="yellow-hover cursor-pointer fs-18" onClick={() => navigate('#')}>Review and Feedback</p>
                            </AccordionBody>

                            <div className="portfolio cursor-pointer yellow-hover fs-18" onClick={() => navigate('/user/portfolio')}><PiBriefcase size="22" className="me-3" />Portfolio</div>
                            <div className="fabrics cursor-pointer yellow-hover fs-18" onClick={() => navigate('/user/products')}><HiOutlineScissors size="22" className="me-3" />Fabrics</div>

                        </AccordionItem>
                    </UncontrolledAccordion>
                </div>

            </div>
        </>
    )
}

export default Sidebar;