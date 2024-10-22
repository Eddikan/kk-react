import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import 'Assets/styles/DesignerCalendar/style.css'
import { useCookies } from 'react-cookie';
import 'Assets/styles/Cart/style.css';
import LayoutSellerCenter from 'Components/Layout/LayoutSellerCenter';
import SetAvailability from 'Components/Completeness/ShopSteps/SetAvailability';
import UploadPortfolio from 'Components/Completeness/ShopSteps/UploadPortfolio';
import UploadProduct from 'Components/Completeness/ShopSteps/UploadProduct';

import MeasurementGuide from 'Components/Completeness/ShopSteps/MeasurementGuide';
import ShopManagerProgress from 'Components/Completeness/Wizards/ShopManagerProgress';
import ThankYouProgress from 'Components/Completeness/ShopSteps/Thankyou';
import SellerShopManager from 'Components/Completeness/Wizards/SellerShopManager';
import SellerDesignerShopManager from 'Components/Completeness/Wizards/SellerDesignerShopManager';


const ShopAvailability = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'userDetails']);
    const userDetails = cookies.userDetails;

    const [step, setStep] = useState(1);


    return (
        <LayoutSellerCenter>
            <section>
                <Container fluid>
                    <Row className='bg-color-page'>

                        <Col lg={12} className='mx-auto py-5 max-width-column'>
                            <div>
                                <Row>
                                    {/* <Col md={3} className={`flex-grow-1 flex-shrink-0 ${(userDetails.is_designer == 1 && userDetails.is_seller == 0 && step == 4 || userDetails.is_designer == 0 && userDetails.is_seller == 1 && step == 3 || userDetails.is_designer == 1 && userDetails.is_seller == 1 && step == 5 ) && 'd-none'}`}> */}
                                    <Col md={3} className={`flex-grow-1 flex-shrink-0`}>
                                        <Card className='h-100'>
                                            <Card.Body>
                                                {userDetails.is_designer == 1 && userDetails.is_seller == 0 &&
                                                    <>
                                                        <ShopManagerProgress progress={step} />
                                                    </>
                                                }

                                                {userDetails.is_seller == 1 && userDetails.is_designer == 0 &&
                                                    <>
                                                        <SellerShopManager progress={step} />
                                                    </>
                                                }

                                                {userDetails.is_seller == 1 && userDetails.is_designer == 1 &&
                                                    <>
                                                        <SellerDesignerShopManager progress={step} />
                                                    </>
                                                }

                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col md="9" className='flex-grow-1 flex-shrink-0'>
                                        <Card className='h-100'>
                                            <Card.Body className='pt-4'>

                                                {userDetails.is_seller == 1 && userDetails.is_designer == 0 &&
                                                    <>
                                                        {step === 1 ? (
                                                            <>
                                                                <UploadProduct
                                                                    onStepPlusTwo={() => setStep(step + 1)}
                                                                    onStepMinusTwo={() => setStep(step - 1)}
                                                                    singleStep={true}
                                                                />
                                                            </>
                                                            // ) : step === 2 ? (
                                                            //     <>

                                                            //         <MeasurementGuide 
                                                            //             onStepPlusThree={() => setStep(step + 1)}
                                                            //             onStepMinusThree={() => setStep(step - 1)}
                                                            //         />

                                                            //     </>

                                                        ) : (
                                                            <>
                                                                <ThankYouProgress user={userDetails} />
                                                            </>
                                                        )}
                                                    </>
                                                }

                                                {userDetails.is_designer == 1 && userDetails.is_seller == 0 &&
                                                    <>
                                                        {step === 1 ? (
                                                            <>
                                                                <SetAvailability
                                                                    onStepPlusOne={() => setStep(step + 1)}
                                                                />
                                                            </>
                                                        ) : step === 2 ? (
                                                            <>

                                                                <UploadPortfolio
                                                                    onStepPlusTwo={() => setStep(step + 1)}
                                                                    onStepMinusTwo={() => setStep(step - 1)}
                                                                />

                                                            </>

                                                        ) : step === 3 ? (
                                                            <>

                                                                <MeasurementGuide
                                                                    onStepPlusThree={() => setStep(step + 1)}
                                                                    onStepMinusThree={() => setStep(step - 1)}
                                                                />
                                                            </>

                                                        ) : (
                                                            <>
                                                                {/* <ThankYouProgress user={userDetails} /> */}
                                                                <ThankYouProgress user={userDetails} />
                                                            </>
                                                        )}
                                                    </>
                                                }


                                                {userDetails.is_designer == 1 && userDetails.is_seller == 1 &&
                                                    <>
                                                        {step === 1 ? (
                                                            <>
                                                                <SetAvailability
                                                                    onStepPlusOne={() => setStep(step + 1)}
                                                                />
                                                            </>
                                                        ) : step === 2 ? (
                                                            <>

                                                                <UploadPortfolio
                                                                    onStepPlusTwo={() => setStep(step + 1)}
                                                                    onStepMinusTwo={() => setStep(step - 1)}
                                                                />

                                                            </>

                                                        ) : step === 3 ? (
                                                            <>

                                                                <UploadProduct
                                                                    onStepPlusTwo={() => setStep(step + 1)}
                                                                    onStepMinusTwo={() => setStep(step - 1)}
                                                                    singleStep={false}
                                                                />
                                                            </>

                                                        ) : step === 4 ? (
                                                            <>

                                                                <MeasurementGuide
                                                                    onStepPlusThree={() => setStep(step + 1)}
                                                                    onStepMinusThree={() => setStep(step - 1)}
                                                                />
                                                            </>

                                                        ) : (
                                                            <>
                                                                <ThankYouProgress user={userDetails} />
                                                            </>
                                                        )}
                                                    </>
                                                }

                                            </Card.Body>
                                        </Card>

                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section >
        </LayoutSellerCenter >
    );
};

export default ShopAvailability;