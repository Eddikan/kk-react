import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { IoIosCheckmarkCircle } from "react-icons/io";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoHomeOutline } from "react-icons/io5";

const ThankyouStep = ({ user, currentUser, reload, token }) => {

    return (
        <>
            <Row>
                <Col lg={12} className='text-center'>
                    <div className='text-gold mt-1'>
                        <IoIosCheckmarkCircle size={70} />
                    </div>
                </Col>
                <Col lg={12} className='text-center mb-4'>
                    <div className='fs-30 rufina-family mt-3'>
                        Thank you for completing your profile!
                    </div>
                </Col>

                <Col lg={12} className='text-center mb-4'>
                    <div className='d-flex align-items-center justify-content-center'>
                        <a className={`btn btn-primary ${(user.is_designer == 1 || user.is_seller == 1) && 'me-3'}`} href="/user/profile">View Profile</a>
                        {(user.is_designer == 1 || user.is_seller == 1) ?
                            <>
                                {user.shop_completed == 1 ?
                                    <>
                                        <div>
                                            <Link to="/user/center/calendar" className='text-decoration-none'>
                                                <span><HiOutlineBuildingStorefront size={30} className='text-gold me-2'/> 
                                                    <span className='fw-500 cursor-pointer'>
                                                    Set up your shop<FaArrowRightLong className='ms-2'/></span>
                                                </span>
                                            </Link>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div>
                                            <Link to="/user/shop/setup" className='text-decoration-none'>
                                                <span><HiOutlineBuildingStorefront size={30} className='text-gold me-2'/> 
                                                    <span className='fw-500 cursor-pointer'>
                                                    Set up your shop<FaArrowRightLong className='ms-2'/></span>
                                                </span>
                                            </Link>
                                        </div>
                                    </>
                                }
                            </>
                            :
                            <>
                                <div>
                                    <Link to="/" className='text-decoration-none'>
                                        <span><IoHomeOutline size={30} className='text-gold me-2 ms-3'/> 
                                            <span className='fw-500 cursor-pointer'>
                                            Continue Browsing<FaArrowRightLong className='ms-2'/></span>
                                        </span>
                                    </Link>
                                </div>
                            </>
                        }
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default ThankyouStep;
