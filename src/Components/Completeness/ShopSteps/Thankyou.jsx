import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { IoIosCheckmarkCircle } from "react-icons/io";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { FaArrowRightLong } from "react-icons/fa6";
import { useCookies } from 'react-cookie';

const ThankYouProgress = ({ user, currentUser, reload, token, onStepPlusFour }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser','userDetails']);
    const userDetails = cookies.userDetails;

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
                    Thank you for setting up your shop!
                    </div>
                </Col>

                <Col lg={12} className='text-center mb-4'>
                    <div className='d-flex align-items-center justify-content-center'>
                        <a className='btn btn-primary' href={`${userDetails.is_designer == 1 ? '/user/center/calendar' : '/user/center/products'}`}>View Shop</a>
                        {/* <div>
                            <span><HiOutlineBuildingStorefront size={30} className='text-gold me-2'/> 
                                <span className='fw-500 cursor-pointer'>
                                Set up your shop<FaArrowRightLong className='ms-2'/></span>
                            </span>
                        </div> */}
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default ThankYouProgress;
