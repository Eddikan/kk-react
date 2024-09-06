import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import SidebarMeasurementGuide from 'Components/FormatMeasurementGuide/SideBarMeasurementGuide';
import HowToMeasureYourSelf from 'Components/FormatMeasurementGuide/HowToMeasureYourSelf';
import FemaleBodyTypes from 'Components/FormatMeasurementGuide/FemaleBodyTypes';
import BodyMeasurementTableMen from 'Components/FormatMeasurementGuide/BodyMeasurementTable/BodyMeasurementTableMen';
import BodyMeasurementTableWomen from 'Components/FormatMeasurementGuide/BodyMeasurementTable/BodyMeasurementTableWomen';
import BodyMeasurementTableMaleChild from 'Components/FormatMeasurementGuide/BodyMeasurementTable/BodyMeasurementTableMaleChild';
import BodyMeasurementTableFemaleChild from 'Components/FormatMeasurementGuide/BodyMeasurementTable/BodyMeasurementTableFemaleChild';
import BodyMeasurementDescriptionMen from 'Components/FormatMeasurementGuide/BodyMeasurementDescription/BodyMeasurementDescriptionMen';
import BodyMeasurementDescriptionWomen from 'Components/FormatMeasurementGuide/BodyMeasurementDescription/BodyMeasurementDescriptionWomen';
import ComprehensiveGuideMale from 'Components/FormatMeasurementGuide/ComprehensiveGuide/ComprehensiveGuideMale';
import ComprehensiveGuideFemale from 'Components/FormatMeasurementGuide/ComprehensiveGuide/ComprehensiveGuideFemale';
import 'Assets/styles/FormatMeasurementGuide/style.css';


const MeasurementGuideFormat = (props) => {
  const [currentTab, setCurrentTab] = useState('All');
  
  return (
    <>
      <Layout>
        <Row className='bg-measurement-guide'>
          <Col lg={3}>
            <SidebarMeasurementGuide currentTab={currentTab} onChangeTab={(e) => setCurrentTab(e)} />
          </Col>

          {currentTab == 1 && (
            <Col lg={9} className='py-5 mx-auto padding-right-measurement max-width-column'>
              <HowToMeasureYourSelf />
            </Col>
          )}

          {currentTab == 2 &&
            <Col lg={9} className='py-5 mx-auto padding-right-measurement max-width-column'>
              <FemaleBodyTypes />
            </Col>
          }

          {currentTab == 3 &&
            <Col lg={9} className='py-5 mx-auto padding-right-measurement max-width-column'>
              <BodyMeasurementTableMen />
            </Col>
          }

          {currentTab == 4 &&
            <Col lg={9} className='py-5 mx-auto padding-right-measurement max-width-column'>
              <BodyMeasurementTableWomen />
            </Col>
          }

          {currentTab == 5 &&
            <Col lg={9} className='py-5 mx-auto padding-right-measurement max-width-column'>
              <BodyMeasurementTableMaleChild />
            </Col>
          }

          {currentTab == 6 &&
            <Col lg={9} className='py-5 mx-auto padding-right-measurement max-width-column'>
              <BodyMeasurementTableFemaleChild />
            </Col>
          }

          {currentTab == 7 &&
            <Col lg={9} className='py-5 mx-auto padding-right-measurement max-width-column'>
              <ComprehensiveGuideMale />
            </Col>
          }

          {currentTab == 8 &&
            <Col lg={9} className='py-5 mx-auto padding-right-measurement max-width-column'>
              <ComprehensiveGuideFemale />
            </Col>
          }

          {currentTab == 9 &&
            <Col lg={9} className='py-5 mx-auto padding-right-measurement max-width-column'>
              <BodyMeasurementDescriptionMen />
            </Col>
          }

          {currentTab == 10 &&
            <Col lg={9} className='py-5 mx-auto padding-right-measurement max-width-column'>
              <BodyMeasurementDescriptionWomen />
            </Col>
          }
        </Row>
      </Layout>
    </>
  );
};

export default MeasurementGuideFormat;