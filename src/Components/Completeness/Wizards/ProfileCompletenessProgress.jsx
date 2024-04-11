import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { Card, CardHeader, CardBody, CardFooter, Row, Col } from 'reactstrap';
import { FaCheck } from 'react-icons/fa';

const ProfileCompletenessProgress = ({ percentage }) => {

    return (
        <>
            <Card>      
                <CardBody>
                    <div className='wizard-cont'>
                        <div className='project-progress-contents'>
                        <div className='project-progress-container'>
                                <div className='d-flex align-items-center'>
                                    <div className={`project-progress-circle 
                                        ${
                                            projectStatus == 'Request Sent' ? 
                                            'project-progress-active'
                                        : 
                                            projectStatus === 'Request Accepted' ||
                                            projectStatus === 'Price Quote Sent' ||
                                            projectStatus === 'Price Quote Approved' ||
                                            projectStatus === 'Mock Up Uploaded' ||
                                            projectStatus === 'Mock Up Approved' ||
                                            projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            'project-progress-check'
                                        : 
                                            'project-progress-inactive'
                                        }
                                    `}>
                                        {
                                            projectStatus === 'Request Sent' ?
                                            <>
                                                <div className='project-progress-solid'></div>
                                                
                                            </>
                                        : 
                                            projectStatus === 'Request Accepted' ||
                                            projectStatus === 'Price Quote Sent' ||
                                            projectStatus === 'Price Quote Approved' ||
                                            projectStatus === 'Mock Up Uploaded' ||
                                            projectStatus === 'Mock Up Approved' ||
                                            projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            <>
                                                <FaCheck size="12px" className='text-white' />
                                            </>
                                        :
                                            <>
                                                <span className='project-progress-number'>0</span>
                                            </>
                                        }
                                    </div>
                                    <span className={`
                                        mx-2 text-nowrap
                                        ${
                                            projectStatus === 'Request Sent' ? 
                                            'project-status-active' 
                                        : 
                                            projectStatus === 'Request Accepted' ||
                                            projectStatus === 'Price Quote Sent' ||
                                            projectStatus === 'Price Quote Approved' ||
                                            projectStatus === 'Mock Up Uploaded' ||
                                            projectStatus === 'Mock Up Approved' ||
                                            projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            'project-status-check'
                                        :
                                            'project-status-inactive'}
                                    `}>
                                        Request Sent
                                    </span>
                                </div>
                            </div>
                            <div className='project-progress-container'>
                                <div className='d-flex align-items-center'>
                                    <div className={`project-progress-circle 
                                        ${
                                            projectStatus == 'Request Accepted' ? 
                                            'project-progress-active'
                                        : 
                                            // projectStatus === 'Request Accepted' ||
                                            projectStatus === 'Price Quote Sent' ||
                                            projectStatus === 'Price Quote Approved' ||
                                            projectStatus === 'Mock Up Uploaded' ||
                                            projectStatus === 'Mock Up Approved' ||
                                            projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            'project-progress-check'
                                        : 
                                            'project-progress-inactive'
                                        }
                                    `}>
                                        {
                                            projectStatus === 'Request Accepted' ?
                                            <>
                                                <div className='project-progress-solid'></div>
                                                
                                            </>
                                        : 
                                            // projectStatus === 'Request Accepted' ||
                                            projectStatus === 'Price Quote Sent' ||
                                            projectStatus === 'Price Quote Approved' ||
                                            projectStatus === 'Mock Up Uploaded' ||
                                            projectStatus === 'Mock Up Approved' ||
                                            projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            <>
                                                <FaCheck size="12px" className='text-white' />
                                            </>
                                        :
                                            <>
                                                <span className='project-progress-number'>1</span>
                                            </>
                                        }
                                    </div>
                                    <span className={`
                                        mx-2 text-nowrap
                                        ${
                                            projectStatus === 'Request Accepted' ? 
                                            'project-status-active' 
                                        : 
                                            // projectStatus === 'Request Accepted' ||
                                            projectStatus === 'Price Quote Sent' ||
                                            projectStatus === 'Price Quote Approved' ||
                                            projectStatus === 'Mock Up Uploaded' ||
                                            projectStatus === 'Mock Up Approved' ||
                                            projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            'project-status-check'
                                        :
                                            'project-status-inactive'}
                                    `}>
                                        Request Accepted
                                    </span>
                                </div>
                            </div>
                            <div className='project-progress-container'>
                                <div className='d-flex align-items-center'>
                                    <div className={`project-progress-circle 
                                        ${
                                            projectStatus == 'Price Quote Sent' ? 
                                            'project-progress-active'
                                        : 
                                            // projectStatus === 'Price Quote Sent' ||
                                            projectStatus === 'Price Quote Approved' ||
                                            projectStatus === 'Mock Up Uploaded' ||
                                            projectStatus === 'Mock Up Approved' ||
                                            projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            'project-progress-check'
                                        : 
                                            'project-progress-inactive'
                                        }
                                    `}>
                                        {
                                            projectStatus === 'Price Quote Sent' ?
                                            <>
                                                <div className='project-progress-solid'></div>
                                                
                                            </>
                                        : 
                                            // projectStatus === 'Price Quote Sent' ||
                                            projectStatus === 'Price Quote Approved' ||
                                            projectStatus === 'Mock Up Uploaded' ||
                                            projectStatus === 'Mock Up Approved' ||
                                            projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            <>
                                                <FaCheck size="12px" className='text-white' />
                                            </>
                                        :
                                            <>
                                                <span className='project-progress-number'>2</span>
                                            </>
                                        }
                                    </div>
                                    <span className={`
                                        mx-2 text-nowrap
                                        ${
                                            projectStatus === 'Price Quote Sent' ? 
                                            'project-status-active' 
                                        : 
                                            // projectStatus === 'Price Quote Sent' ||
                                            projectStatus === 'Price Quote Approved' ||
                                            projectStatus === 'Mock Up Uploaded' ||
                                            projectStatus === 'Mock Up Approved' ||
                                            projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            'project-status-check'
                                        :
                                            'project-status-inactive'}
                                    `}>
                                        Price Quote Sent
                                    </span>
                                </div>
                            </div>
                            <div className='project-progress-container'>
                                <div className='d-flex align-items-center'>
                                    <div className={`project-progress-circle 
                                        ${
                                            projectStatus == 'Price Quote Approved' ? 
                                            'project-progress-active'
                                        : 
                                            // projectStatus === 'Price Quote Approved' ||
                                            projectStatus === 'Mock Up Uploaded' ||
                                            projectStatus === 'Mock Up Approved' ||
                                            projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            'project-progress-check'
                                        : 
                                            'project-progress-inactive'
                                        }
                                    `}>
                                        {
                                            projectStatus === 'Price Quote Approved' ?
                                            <>
                                                <div className='project-progress-solid'></div>
                                                
                                            </>
                                        : 
                                            // projectStatus === 'Price Quote Approved' ||
                                            projectStatus === 'Mock Up Uploaded' ||
                                            projectStatus === 'Mock Up Approved' ||
                                            projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            <>
                                                <FaCheck size="12px" className='text-white' />
                                            </>
                                        :
                                            <>
                                                <span className='project-progress-number'>3</span>
                                            </>
                                        }
                                    </div>
                                    <span className={`
                                        mx-2 text-nowrap
                                        ${
                                            projectStatus === 'Price Quote Approved' ? 
                                            'project-status-active' 
                                        : 
                                            // projectStatus === 'Price Quote Approved' ||
                                            projectStatus === 'Mock Up Uploaded' ||
                                            projectStatus === 'Mock Up Approved' ||
                                            projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            'project-status-check'
                                        :
                                            'project-status-inactive'}
                                    `}>
                                        Price Quote Approved
                                    </span>
                                </div>
                            </div>
                            <div className='project-progress-container'>
                                <div className='d-flex align-items-center'>
                                    <div className={`project-progress-circle 
                                        ${
                                            projectStatus == 'Mock Up Uploaded' ? 
                                            'project-progress-active'
                                        : 
                                            // projectStatus === 'Mock Up Uploaded' ||
                                            projectStatus === 'Mock Up Approved' ||
                                            projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            'project-progress-check'
                                        : 
                                            'project-progress-inactive'
                                        }
                                    `}>
                                        {
                                            projectStatus === 'Mock Up Uploaded' ?
                                            <>
                                                <div className='project-progress-solid'></div>
                                                
                                            </>
                                        : 
                                            // projectStatus === 'Mock Up Uploaded' ||
                                            projectStatus === 'Mock Up Approved' ||
                                            projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            <>
                                                <FaCheck size="12px" className='text-white' />
                                            </>
                                        :
                                            <>
                                                <span className='project-progress-number'>4</span>
                                            </>
                                        }
                                    </div>
                                    <span className={`
                                        mx-2 text-nowrap
                                        ${
                                            projectStatus === 'Mock Up Uploaded' ? 
                                            'project-status-active' 
                                        : 
                                            // projectStatus === 'Mock Up Uploaded' ||
                                            projectStatus === 'Mock Up Approved' ||
                                            projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            'project-status-check'
                                        :
                                            'project-status-inactive'}
                                    `}>
                                        Mock Up Uploaded
                                    </span>
                                </div>
                            </div>
                            <div className='project-progress-container'>
                                <div className='d-flex align-items-center'>
                                    <div className={`project-progress-circle 
                                        ${
                                            projectStatus == 'Mock Up Approved' ? 
                                            'project-progress-active'
                                        : 
                                            // projectStatus === 'Mock Up Approved' ||
                                            projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            'project-progress-check'
                                        : 
                                            'project-progress-inactive'
                                        }
                                    `}>
                                        {
                                            projectStatus === 'Mock Up Approved' ?
                                            <>
                                                <div className='project-progress-solid'></div>
                                                
                                            </>
                                        : 
                                            // projectStatus === 'Mock Up Approved' ||
                                            projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            <>
                                                <FaCheck size="12px" className='text-white' />
                                            </>
                                        :
                                            <>
                                                <span className='project-progress-number'>5</span>
                                            </>
                                        }
                                    </div>
                                    <span className={`
                                        mx-2 text-nowrap
                                        ${
                                            projectStatus === 'Mock Up Approved' ? 
                                            'project-status-active' 
                                        : 
                                            // projectStatus === 'Mock Up Approved' ||
                                            projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            'project-status-check'
                                        :
                                            'project-status-inactive'}
                                    `}>
                                        Mock Up Approved
                                    </span>
                                </div>
                            </div>
                            <div className='project-progress-container'>
                                <div className='d-flex align-items-center'>
                                    <div className={`project-progress-circle 
                                        ${
                                            projectStatus == 'In Progress' ? 
                                            'project-progress-active'
                                        : 
                                            // projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            'project-progress-check'
                                        : 
                                            'project-progress-inactive'
                                        }
                                    `}>
                                        {
                                            projectStatus === 'In Progress' ?
                                            <>
                                                <div className='project-progress-solid'></div>
                                                
                                            </>
                                        : 
                                            // projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            <>
                                                <FaCheck size="12px" className='text-white' />
                                            </>
                                        :
                                            <>
                                                <span className='project-progress-number'>6</span>
                                            </>
                                        }
                                    </div>
                                    <span className={`
                                        mx-2 text-nowrap
                                        ${
                                            projectStatus === 'In Progress' ? 
                                            'project-status-active' 
                                        : 
                                            // projectStatus === 'In Progress' ||
                                            projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            'project-status-check'
                                        :
                                            'project-status-inactive'}
                                    `}>
                                        In Progress
                                    </span>
                                </div>
                            </div>
                            <div className='project-progress-container'>
                                <div className='d-flex align-items-center'>
                                    <div className={`project-progress-circle 
                                        ${
                                            projectStatus == 'Signed Off' ? 
                                            'project-progress-active'
                                        : 
                                            // projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            'project-progress-check'
                                        : 
                                            'project-progress-inactive'
                                        }
                                    `}>
                                        {
                                            projectStatus === 'Signed Off' ?
                                            <>
                                                <div className='project-progress-solid'></div>
                                                
                                            </>
                                        : 
                                            // projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            <>
                                                <FaCheck size="12px" className='text-white' />
                                            </>
                                        :
                                            <>
                                                <span className='project-progress-number'>7</span>
                                            </>
                                        }
                                    </div>
                                    <span className={`
                                        mx-2 text-nowrap
                                        ${
                                            projectStatus === 'Signed Off' ? 
                                            'project-status-active' 
                                        : 
                                            // projectStatus === 'Signed Off' ||
                                            projectStatus === 'Invoice Request' ||
                                            projectStatus === 'Payment Date' ||
                                            projectStatus === 'Completed' ||
                                            projectStatus === 'Invoice Approved' ?
                                            'project-status-check'
                                        :
                                            'project-status-inactive'}
                                    `}>
                                        Signed Off
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='progress-vertical-lines'>
                            <div className={`progress-vertical-line 
                                ${
                                // projectStatus === 'Request Sent' || 
                                projectStatus === 'Request Accepted' ||
                                projectStatus === 'Price Quote Sent' ||
                                projectStatus === 'Price Quote Approved' ||
                                projectStatus === 'Mock Up Uploaded' ||
                                projectStatus === 'Mock Up Approved' ||
                                projectStatus === 'In Progress' ||
                                projectStatus === 'Signed Off' ? 
                                'progress-line-active' : ''
                            }`}></div>
                            <div className={`progress-vertical-line 
                                ${
                                // projectStatus === 'Request Accepted' ||
                                projectStatus === 'Price Quote Sent' ||
                                projectStatus === 'Price Quote Approved' ||
                                projectStatus === 'Mock Up Uploaded' ||
                                projectStatus === 'Mock Up Approved' ||
                                projectStatus === 'In Progress' ||
                                projectStatus === 'Signed Off' ? 
                                'progress-line-active' : ''
                            }`}></div>
                            <div className={`progress-vertical-line 
                                ${
                                // projectStatus === 'Price Quote Sent' ||
                                projectStatus === 'Price Quote Approved' ||
                                projectStatus === 'Mock Up Uploaded' ||
                                projectStatus === 'Mock Up Approved' ||
                                projectStatus === 'In Progress' ||
                                projectStatus === 'Signed Off' ? 
                                'progress-line-active' : ''
                            }`}></div>
                            <div className={`progress-vertical-line 
                                ${
                                // projectStatus === 'Price Quote Approved' ||
                                projectStatus === 'Mock Up Uploaded' ||
                                projectStatus === 'Mock Up Approved' ||
                                projectStatus === 'In Progress' ||
                                projectStatus === 'Signed Off' ? 
                                'progress-line-active' : ''
                            }`}></div>
                            <div className={`progress-vertical-line 
                                ${
                                // projectStatus === 'Mock Up Uploaded' ||
                                projectStatus === 'Mock Up Approved' ||
                                projectStatus === 'In Progress' ||
                                projectStatus === 'Signed Off' ? 
                                'progress-line-active' : ''
                            }`}></div>
                            <div className={`progress-vertical-line 
                                ${
                                // projectStatus === 'Mock Up Approved' ||
                                projectStatus === 'In Progress' ||
                                projectStatus === 'Signed Off' ? 
                                'progress-line-active' : ''
                            }`}></div>
                            <div className={`progress-vertical-line 
                                ${
                                // projectStatus === 'In Progress' ||
                                projectStatus === 'Signed Off'  ? 
                                'progress-line-active' : ''
                            }`}></div>
                            {/* <div className={`progress-vertical-line 
                                ${
                                // projectStatus === 'Signed Off' ||
                                projectStatus === 'Invoice Request' ||
                                projectStatus === 'Payment Date' ||
                                projectStatus === 'Completed' ||
                                projectStatus === 'Invoice Approved' ? 
                                'progress-line-active' : ''
                            }`}></div>
                            <div className={`progress-vertical-line 
                                ${
                                // projectStatus === 'Invoice Request' ||
                                projectStatus === 'Invoice Approved' ||
                                projectStatus === 'Payment Date' ||
                                projectStatus === 'Completed' ? 
                                'progress-line-active' : ''
                            }`}></div>
                            <div className={`progress-vertical-line 
                                ${
                                // projectStatus === 'Invoice Approved' ||
                                projectStatus === 'Payment Date' ||
                                projectStatus === 'Completed' ? 
                                'progress-line-active' : ''
                            }`}></div>
                            <div className={`progress-vertical-line 
                                ${
                                // projectStatus === 'Payment Date' ||
                                projectStatus === 'Completed' ? 
                                'progress-line-active' : ''
                            }`}></div> */}
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    )
}

export default ProfileCompletenessProgress;
