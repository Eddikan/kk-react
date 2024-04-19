import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LayoutNoFooter from 'Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import 'Assets/styles/FormatMeasurementGuide/style.css';


const MeasurementGuideFormat = (props) => {
   

    return (
            <div>
                <Row>
                    <Col lg={12} className='mb-4'>
                        <div className='fs-30 fw-600 rufina-family text-black'>How to Measure Yourself Accurately for the Perfect Fit</div>
                    </Col>

                    <Col lg={12}>
                        <div className='how-to-measure'>
                        <p>1.<strong className='ms-2'>Assistance is Key</strong>: To ensure precision, enlist the help of a partner when taking your measurements. A second set of eyes minimizes errors.</p>
                        <p>2.<strong className='ms-2'>Opt for Fitted Attire</strong>: Wear form-fitting clothing like tank top and leggings, as loose garments can skew measurements. This ensures accuracy in recording body dimensions.</p>
                        <p>3.<strong className='ms-2'>Posture Matters</strong>: Maintain proper posture by standing erect with feet slightly apart and gaze directed forward. Correct posture guarantees consistent measurements.</p>
                        <p>4.<strong className='ms-2'>Establish a Reference Point</strong>: Secure a 1cm string or elastic around the narrowest part of your waist. This serves as a fixed reference for subsequent measurements.</p>
                        <p>5.<strong className='ms-2'>Quality Tools are Essential</strong>: Employ a reliable tape measure devoid of distortions for precise readings. A high-quality instrument is pivotal in achieving accurate results.</p>
                        <p>6.<strong className='ms-2'>Circumference Measurements Protocol</strong>: Start measuring from the metal tip, encircle the body, and return to the starting point without tugging the tape. This method ensures consistency in circumference measurements.</p>
                        <p>7.<strong className='ms-2'>Maintain Focus</strong>: Eliminate distractions by refraining from tilting your head or glancing sideways during measurements. This practice minimizes potential errors.</p>
                        <p>8.<strong className='ms-2'>Adopt Strategic Angles</strong>: For vertical measurements, your measuring partner should take the measurements from either your front or back view, while for horizontal measurements, have them take measurements from the side. This strategic approach aids in identifying any discrepancies in tape placement.</p>
                        <p>9.<strong className='ms-2'>Ensure Consistency</strong>: When measuring yourself, maintain a level tape position around your body, parallel to the floor for horizontal measurements. Aim for snugness without discomfort to achieve precision.</p>
                        <p>10.<strong className='ms-2'>Considerations for Non-Fitted Attire</strong>: When opting for non-fitted attire, allow for ease only after recording your accurate body measurements. Inform your designer that no additional ease has been added. Wearing ease is the necessary room in a garment for movement and comfort during various activities, including sitting.</p>

                        <p className='mb-0'>By adhering to these guidelines, you can execute precise body measurements with confidence and accuracy.</p>
                        </div>
                    </Col>
                </Row>
            </div>
    );
};

export default MeasurementGuideFormat;