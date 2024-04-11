import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { IoIosCheckmarkCircle } from "react-icons/io";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { FaArrowRightLong } from "react-icons/fa6";

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
                        <a className='btn btn-primary me-3 btn-complete-profile' href="/user/profile">View Profile</a>
                        <div>
                            <span><HiOutlineBuildingStorefront size={30} className='text-gold me-2'/> 
                                <span className='fw-500 cursor-pointer'>
                                Set up your shop<FaArrowRightLong className='ms-2'/></span>
                            </span>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default ThankyouStep;
