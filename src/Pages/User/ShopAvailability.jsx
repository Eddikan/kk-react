import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LayoutNoFooter from 'Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import 'Assets/styles/DesignerCalendar/style.css'
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
import { CiCreditCard2 } from "react-icons/ci";
import LoadingPage from 'Components/Shared/LoadingPage';
import Sidebar from 'Components/Shared/Sidebar';
import 'Assets/styles/Cart/style.css';
import { IoCloseOutline } from "react-icons/io5";
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import UserPlaceholder from 'Assets/images/user.png';
import { AiOutlineDelete } from "react-icons/ai";
import { useParams } from 'react-router-dom';
import LayoutSellerCenter from 'Components/Layout/LayoutSellerCenter';
import axios from "axios";
import toast from 'react-hot-toast';
import SetAvailability from 'Components/Completeness/ShopSteps/SetAvailability';
import UploadPortfolio from 'Components/Completeness/ShopSteps/UploadPortfolio';
import MeasurementGuide from 'Components/Completeness/ShopSteps/MeasurementGuide';




const ShopAvailability = (props) => {

    const [step, setStep] = useState(1);
   

    return (
        <LayoutSellerCenter>
            <section>
                <Container fluid>
                    <Row className='bg-color-page'>
                        {/* <Col lg={2} className='p-0'>
                            <Sidebar />
                        </Col> */}

                        <Col lg={12} className='mx-auto py-5 max-width-column'>
                            <div>
                                <Row>
                                    <Col lg={3}>
                                        <Card>
                                            <Card.Body>
                                                
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col lg={9}>
                                        <Card>
                                            <Card.Body>
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
                                                    />
                                                </>
                                            ) : null}
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