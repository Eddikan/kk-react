import React from 'react';
import 'Assets/styles/Completeness/progress.css'

const ProfileProgress = ({ completeness }) => {

    return (
        <>
            <div className='w-100 mb-3'>
                <div className='d-flex align-items-center inactive'>
                    <div className='progress-circle-inactive'>
                        1
                    </div>
                    <span className='ms-2'>Personal Information</span>
                </div>
            </div>
            <div className='w-100 mb-3'>
                <div className='d-flex align-items-center inactive'>
                    <div className='progress-circle-inactive'>
                        2
                    </div>
                    <span className='ms-2'>Address Details</span>
                </div>
            </div>
        </>
    )
}

export default ProfileProgress;
