import React from 'react';
import 'Assets/styles/Completeness/progress.css';
import { FaCheck } from "react-icons/fa";

const ProfileProgress = ({ completeness }) => {

    // const step1 = [0];
    // const step2 = [0, 25];
    // const step3 = [0, 25, 50];
    // const step4 = [0, 25, 50, 75];

    return (
        <>
            <div className='wizard-cont'>
                <div className='w-100 step-container'>
                    {completeness == 0 ?
                        <>
                            <div className='d-flex align-items-center active'>
                                <div className='progress-circle progress-circle-active'>
                                    <div className='full-active-circle'></div>
                                </div>
                                <span className='ms-2 text-gold fw-700'>Personal Information</span>
                            </div>
                        </>
                    :completeness == 25 || completeness == 50 || completeness == 75 || completeness == 100 ?
                        <>
                            <div className='d-flex align-items-center check'>
                                <div className='progress-circle progress-circle-check'>
                                    <FaCheck color='#ffffff' />
                                </div>
                                <span className='ms-2 text-gold fw-700'>Personal Information</span>
                            </div>
                        </>
                    :
                        <>
                            <div className='d-flex align-items-center inactive'>
                                <div className='progress-circle progress-circle-inactive'>
                                    <span className='fs-12 fw-700'>1</span>
                                </div>
                                <span className='ms-2'>Personal Information</span>
                            </div>
                        </>
                    }
                </div>
                <div className='w-100 step-container'>
                    {completeness == 25 ?
                        <>
                            <div className='d-flex align-items-center active'>
                                <div className='progress-circle progress-circle-active'>
                                    <div className='full-active-circle'></div>
                                </div>
                                <span className='ms-2 text-gold fw-700'>Address Details</span>
                            </div>
                        </>
                    :completeness == 50 || completeness == 75 || completeness == 100 ?
                        <>
                            <div className='d-flex align-items-center check'>
                                <div className='progress-circle progress-circle-check'>
                                    <FaCheck color='#ffffff' />
                                </div>
                                <span className='ms-2 text-gold fw-700'>Address Details</span>
                            </div>
                        </>
                    :
                        <>
                            <div className='d-flex align-items-center inactive'>
                                <div className='progress-circle progress-circle-inactive'>
                                    <span className='fs-12 fw-700'>2</span>
                                </div>
                                <span className='ms-2'>Address Details</span>
                            </div>
                        </>
                    }
                </div>
                <div className='w-100 step-container'>
                    {completeness == 50 ?
                        <>
                            <div className='d-flex align-items-center active'>
                                <div className='progress-circle progress-circle-active'>
                                    <div className='full-active-circle'></div>
                                </div>
                                <span className='ms-2 text-gold fw-700'>Contact Information</span>
                            </div>
                        </>
                    :completeness == 75 || completeness == 100 ?
                        <>
                            <div className='d-flex align-items-center check'>
                                <div className='progress-circle progress-circle-check'>
                                    <FaCheck color='#ffffff' />
                                </div>
                                <span className='ms-2 text-gold fw-700'>Contact Information</span>
                            </div>
                        </>
                    :
                        <>
                            <div className='d-flex align-items-center inactive'>
                                <div className='progress-circle progress-circle-inactive'>
                                    <span className='fs-12 fw-700'>3</span>
                                </div>
                                <span className='ms-2'>Contact Information</span>
                            </div>
                        </>
                    }
                </div>
                <div className='w-100 step-container'>
                    {completeness == 75 ?
                        <>
                            <div className='d-flex align-items-center active'>
                                <div className='progress-circle progress-circle-active'>
                                    <div className='full-active-circle'></div>
                                </div>
                                <span className='ms-2 text-gold fw-700'>Social Media</span>
                            </div>
                        </>
                    :completeness == 100 ?
                        <>
                            <div className='d-flex align-items-center check'>
                                <div className='progress-circle progress-circle-check'>
                                    <FaCheck color='#ffffff' />
                                </div>
                                <span className='ms-2 text-gold fw-700'>Social Media</span>
                            </div>
                        </>
                    :
                        <>
                            <div className='d-flex align-items-center inactive'>
                                <div className='progress-circle progress-circle-inactive'>
                                    <span className='fs-12 fw-700'>4</span>
                                </div>
                                <span className='ms-2'>Social Media</span>
                            </div>
                        </>
                    }
                </div>
                <div className='progress-lines'>
                    {completeness == 25 || completeness == 50 || completeness == 75 ?
                        <>
                            <div className='progress-line line-active'></div>
                        </>
                    :
                        <>
                            <div className='progress-line'></div>
                        </>
                    }
                    {completeness == 50 || completeness == 75 ?
                        <>
                            <div className='progress-line line-active'></div>
                        </>
                    :
                        <>
                            <div className='progress-line'></div>
                        </>
                    }
                    {completeness == 75 ?
                        <>
                            <div className='progress-line line-active'></div>
                        </>
                    :
                        <>
                            <div className='progress-line'></div>
                        </>
                    }
                </div>
            </div>
        </>
    )
}

export default ProfileProgress;
