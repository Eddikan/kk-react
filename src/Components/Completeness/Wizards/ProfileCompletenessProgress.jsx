import React, { useEffect, useState } from 'react';
import 'Assets/styles/Completeness/progress.css';
import { FaCheck } from "react-icons/fa";
import { useCookies } from 'react-cookie';

const ProfileProgress = ({ completeness, reloadCount }) => {
    const [cookies, setCookie] = useCookies(['currentUser', 'aboutDone', 'addressDone', 'contactDone', 'socialDone']);

    const [aboutDone, setAboutDone] = useState(cookies.aboutDone ?? 'No');
    const [addressDone, setAddressDone] = useState(cookies.addressDone ?? 'No');
    const [contactDone, setContactDone] = useState(cookies.contactDone ?? 'No');
    const [socialDone, setSocialDone] = useState(cookies.socialDone ?? 'No');

    // const step1 = [0];
    // const step2 = [0, 25];
    // const step3 = [0, 25, 50];
    // const step4 = [0, 25, 50, 75];

    useEffect(() => {
        setAboutDone(cookies.aboutDone ?? 'No');
        setAddressDone(cookies.addressDone ?? 'No');
        setContactDone(cookies.contactDone ?? 'No');
        setSocialDone(cookies.socialDone ?? 'No');

    }, [reloadCount]);

    return (
        <>
            <div className='wizard-cont'>
                <div className='w-100 step-container'>
                    { aboutDone != "Yes" ?
                        <>
                            <div className='d-flex align-items-center active'>
                                <div className='progress-circle progress-circle-active'>
                                    <div className='full-active-circle'></div>
                                </div>
                                <span className='ms-2 fw-500'>Personal Information</span>
                            </div>
                        </>
                    : aboutDone == "Yes" ?
                        <>
                            <div className='d-flex align-items-center check'>
                                <div className='progress-circle progress-circle-check'>
                                    <FaCheck color='#ffffff' />
                                </div>
                                <span className='ms-2 fw-500'>Personal Information</span>
                            </div>
                        </>
                    :
                        <>
                            <div className='d-flex align-items-center inactive'>
                                <div className='progress-circle progress-circle-inactive'>
                                    <span className='fs-12 fw-500'>1</span>
                                </div>
                                <span className='ms-2'>Personal Information</span>
                            </div>
                        </>
                    }
                </div>
                <div className='w-100 step-container'>
                    {aboutDone == "Yes" && addressDone != "Yes" ?
                        <>
                            <div className='d-flex align-items-center active'>
                                <div className='progress-circle progress-circle-active'>
                                    <div className='full-active-circle'></div>
                                </div>
                                <span className='ms-2 fw-500'>Address Details</span>
                            </div>
                        </>
                    : aboutDone == "Yes" && addressDone == "Yes" ?
                        <>
                            <div className='d-flex align-items-center check'>
                                <div className='progress-circle progress-circle-check'>
                                    <FaCheck color='#ffffff' />
                                </div>
                                <span className='ms-2 fw-500'>Address Details</span>
                            </div>
                        </>
                    :
                        <>
                            <div className='d-flex align-items-center inactive'>
                                <div className='progress-circle progress-circle-inactive'>
                                    <span className='fs-12 fw-500'>2</span>
                                </div>
                                <span className='ms-2'>Address Details</span>
                            </div>
                        </>
                    }
                </div>
                <div className='w-100 step-container'>
                    {aboutDone == "Yes" && addressDone == "Yes" && contactDone != "Yes" ?
                        <>
                            <div className='d-flex align-items-center active'>
                                <div className='progress-circle progress-circle-active'>
                                    <div className='full-active-circle'></div>
                                </div>
                                <span className='ms-2 fw-500'>Contact Information</span>
                            </div>
                        </>
                    : aboutDone == "Yes" && addressDone == "Yes" && contactDone == "Yes" ?
                        <>
                            <div className='d-flex align-items-center check'>
                                <div className='progress-circle progress-circle-check'>
                                    <FaCheck color='#ffffff' />
                                </div>
                                <span className='ms-2 fw-500'>Contact Information</span>
                            </div>
                        </>
                    :
                        <>
                            <div className='d-flex align-items-center inactive'>
                                <div className='progress-circle progress-circle-inactive'>
                                    <span className='fs-12 fw-500'>3</span>
                                </div>
                                <span className='ms-2'>Contact Information</span>
                            </div>
                        </>
                    }
                </div>
                <div className='w-100 step-container'>
                    {aboutDone == "Yes" && addressDone == "Yes" && contactDone == "Yes" && socialDone != "Yes" && completeness < 100 ?
                        <>
                            <div className='d-flex align-items-center active'>
                                <div className='progress-circle progress-circle-active'>
                                    <div className='full-active-circle'></div>
                                </div>
                                <span className='ms-2 fw-500'>Social Media</span>
                            </div>
                        </>
                    :completeness >= 100 ?
                        <>
                            <div className='d-flex align-items-center check'>
                                <div className='progress-circle progress-circle-check'>
                                    <FaCheck color='#ffffff' />
                                </div>
                                <span className='ms-2 fw-500'>Social Media</span>
                            </div>
                        </>
                    :
                        <>
                            <div className='d-flex align-items-center inactive'>
                                <div className='progress-circle progress-circle-inactive'>
                                    <span className='fs-12 fw-500'>4</span>
                                </div>
                                <span className='ms-2'>Social Media</span>
                            </div>
                        </>
                    }
                </div>
                <div className='progress-lines'>
                    {aboutDone == "Yes" ?
                        <>
                            <div className='progress-line line-active'></div>
                        </>
                    :
                        <>
                            <div className='progress-line'></div>
                        </>
                    }
                    {addressDone == "Yes" ?
                        <>
                            <div className='progress-line line-active'></div>
                        </>
                    :
                        <>
                            <div className='progress-line'></div>
                        </>
                    }
                    {contactDone == "Yes" ?
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
