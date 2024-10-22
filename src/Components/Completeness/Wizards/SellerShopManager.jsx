import React from 'react';
import 'Assets/styles/Completeness/progress.css';
import { FaCheck } from "react-icons/fa";

const SellerShopManager = ({ progress }) => {

    return (
        <>
            <div className='wizard-cont'>
                <div className='w-100 step-container'>
                    {progress == 1 ?
                        <>
                            <div className='d-flex align-items-center active'>
                                <div className='progress-circle progress-circle-active'>
                                    <div className='full-active-circle'></div>
                                </div>
                                <span className='ms-2 fw-500'>Upload your products</span>
                            </div>
                        </>
                    :progress == 1 || progress == 2 || progress == 3 ?
                        <>
                            <div className='d-flex align-items-center check'>
                                <div className='progress-circle progress-circle-check'>
                                    <FaCheck color='#ffffff' />
                                </div>
                                <span className='ms-2 fw-500'>Upload your products</span>
                            </div>
                        </>
                    :
                        <>
                            <div className='d-flex align-items-center inactive'>
                                <div className='progress-circle progress-circle-inactive'>
                                    <span className='fs-12 fw-500'>1</span>
                                </div>
                                <span className='ms-2'>Upload your products</span>
                            </div>
                        </>
                    }
                </div>

                {/* <div className='w-100 step-container'>
                    {progress == 2 ?
                        <>
                            <div className='d-flex align-items-center active'>
                                <div className='progress-circle progress-circle-active'>
                                    <div className='full-active-circle'></div>
                                </div>
                                <span className='ms-2 fw-500'>Build your measurement guide</span>
                            </div>
                        </>
                    :progress == 2 || progress == 2 || progress == 3?
                        <>
                            <div className='d-flex align-items-center check'>
                                <div className='progress-circle progress-circle-check'>
                                    <FaCheck color='#ffffff' />
                                </div>
                                <span className='ms-2 fw-500'>Build your measurement guide</span>
                            </div>
                        </>
                    :
                        <>
                            <div className='d-flex align-items-center inactive'>
                                <div className='progress-circle progress-circle-inactive'>
                                    <span className='fs-12 fw-500'>2</span>
                                </div>
                                <span className='ms-2'>Build your measurement guide</span>
                            </div>
                        </>
                    }
                </div> */}
                
                {/* <div className='progress-lines'>
                    {progress == 2 || progress == 3 ?
                        <>
                            <div className='progress-line line-active'></div>
                        </>
                    :
                        <>
                            <div className='progress-line '></div>
                        </>
                    }
                    {progress == 3 ?
                        <>
                           
                        </>
                    :
                        <>
                            
                        </>
                    }
                    
                </div> */}
            </div>
        </>
    )
}

export default SellerShopManager;
