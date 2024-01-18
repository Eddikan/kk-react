import React, { useEffect, useState } from 'react';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Card} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import '../Assets/styles/DesignerCalendar/style.css'
import ShopByCategory from 'Components/Shared/ShopByCategory';
import { useCookies } from 'react-cookie';
import Sidebar from 'Components/Shared/Sidebar';
import DesignerCalendar from 'Components/Shared/DesignerCalendar';
import { GoPlus } from "react-icons/go";

const DesignersCalendar = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const [designerBusinessHoursModalShow, setDesignerBusinessHoursModalShow] = useState(false);

    useEffect(() => {
        document.body.classList.add('designer-calendar-body');
    }, []);
    const handleShowDesignerBusinessHoursModal = () => {
        setDesignerBusinessHoursModalShow(true);
    }

  return (
    <LayoutNoFooter>
        <Sidebar />
        <section>
            <Container>
                <Row>
                    <Col lg={3}>
                    </Col>
                    <Col lg={9} className="designer-calendar-container">
                        <Row className="pb-4">
                            <Col md={6}>
                                <h3 className="fs-30 fw-500 text-black">My Calendar</h3>
                            </Col>
                            <Col md={6} className="text-right">
                                <button className="btn-primary btn" onClick={handleShowDesignerBusinessHoursModal}>Settings</button>
                            </Col>
                        </Row>
                        <div className="calendar-container">
                            <DesignerCalendar />
                        </div>
                        
                    </Col>
                </Row>
            </Container>
        </section>

        <Modal show={designerBusinessHoursModalShow}  onHide={() => setDesignerBusinessHoursModalShow(false)} id="business-hours-modal">
            <Modal.Header closeButton>
                <Modal.Title></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className="h-100">
                    <Row className="h-100">
                        <Col lg="12">
                            <h3 className="text-center header">Business Hours</h3>
                        </Col>
                        <Col lg="12" className="pb-100">

                           <Row>
                                <Col lg="2">
                                    <h4 className="day-header">Sunday</h4>
                                    <Form.Check // prettier-ignore
                                        type={`checkbox`}
                                        id={`schedule-sunday`}  
                                        label={`Closed`}
                                        name={`day`}
                                    />
                                </Col>
                                <Col lg="5">
                                    <Row className="align-items-center">
                                        <Col md="5" className="pe-0">
                                            <p className="hours-header">Opens at</p>
                                            <Form.Group className='mb-3'>
                                                <FormControl type='time' name='opens_at' className='mr-sm-2' />
                                            </Form.Group>
                                        </Col>
                                        <Col md="5" className="pe-0">
                                            <p className="hours-header">Closes at</p>
                                            <Form.Group className='mb-3'>
                                                <FormControl type='time' name='closes_at' className='mr-sm-2' />
                                            </Form.Group>
                                        </Col>
                                        <Col md="2" className="pl-0">
                                            <GoPlus size={25} className="plus-btn"/>
                                        </Col>
                                    </Row>
                                    
                                </Col>
                                <Col lg="5">
                                    
                                </Col>
                           </Row>
                           <hr/>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn-primary" variant="primary" onClick={() => setDesignerBusinessHoursModalShow(false)}>Cancel</Button>
                <Button className="btn-primary" variant="primary">Save</Button>
            </Modal.Footer>
        </Modal>
      
    </LayoutNoFooter>
  );
};

export default DesignersCalendar;