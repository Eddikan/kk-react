import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LayoutSellerCenter from 'Components/Layout/LayoutSellerCenter';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import SidebarMeasurementGuide from 'Components/FormatMeasurementGuide/SideBarMeasurementGuide';
import HowToMeasureYourSelf from 'Components/FormatMeasurementGuide/HowToMeasureYourSelf';
import FemaleBodyTypes from 'Components/FormatMeasurementGuide/FemaleBodyTypes';
import BodyMeasurementTable from 'Components/FormatMeasurementGuide/BodyMeasurementTable';
import BodyMeasurementDescriptions from 'Components/FormatMeasurementGuide/BodyMeasurementDescriptions';
import ComprehensiveGuide from 'Components/FormatMeasurementGuide/ComprehensiveGuide';
import 'Assets/styles/FormatMeasurementGuide/style.css';


const MeasurementGuideFormat = (props) => {
    const [currentTab, setCurrentTab] = useState('All');

    return (
        <>
        <LayoutSellerCenter>
                <Row className='bg-measurement-guide'>
                  <Col lg={2}>
                    <SidebarMeasurementGuide currentTab={currentTab} onChangeTab={(e) => setCurrentTab(e)}/>
                  </Col>

                  {currentTab == 1 && (
                    <Col lg={10} className='py-5 mx-auto padding-right-admin max-width-column'>
                        <HowToMeasureYourSelf/>
                    </Col>
                  )}

                  {currentTab == 2 &&
                    <Col lg={10} className='py-5 mx-auto padding-right-admin max-width-column'>
                        <FemaleBodyTypes/>
                    </Col>
                  }

                  {currentTab == 3 &&
                  <Col lg={10} className='py-5 mx-auto padding-right-admin max-width-column'>
                    <BodyMeasurementTable/>
                  </Col>
                  }

                 {currentTab == 4 &&
                  <Col lg={10} className='py-5 mx-auto padding-right-admin max-width-column'>
                    <ComprehensiveGuide/>
                  </Col>
                  } 

                  
                 {currentTab == 5 &&
                  <Col lg={10} className='py-5 mx-auto padding-right-admin max-width-column'>
                    <BodyMeasurementDescriptions/>
                  </Col>
                  } 



                </Row>
        </LayoutSellerCenter>
        </>
    );
};

export default MeasurementGuideFormat;