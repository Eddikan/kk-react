import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, FormGroup, ModalFooter } from 'react-bootstrap';
import { Card, CardBody, CardFooter, ModalHeader, ModalBody, Modal } from 'reactstrap';
import { IoIosArrowRoundForward } from "react-icons/io";
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { GoAlertFill } from "react-icons/go";
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatePicker from 'Components/Shared/DatePicker';

const initialQuestionnaire1Data = Object.freeze({
    event_date: '',
    is_designer: 0, 
    is_seller: 0
});


const Questionnaire1 = (props) => {
    const navigate = useNavigate();
    const currentStep = props.step;
    const currentUser = props.currentUser;
    const user = props.user;
    const signupType = props.signupType;

    const [questionnaire1Data, setQuestionnaire1Data] = useState(initialQuestionnaire1Data);
    const [questionnaire1Loading, setQuestionnaire1Loading] = useState(false);
    const [interestedIn, setInterestedIn] = useState([]);
    const [scheduleShow, setScheduleShow] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'token']);
    const selectedSignupType = cookies.signup_type;

    const current_user_id = cookies.currentUser;
    const token = cookies.token;

    const toggleSchedule = (e) => {
        e.preventDefault();
        setScheduleShow(!scheduleShow);
    }

    const hideAll = (e) => {
        props.onHideAll(e);
    };

    const reloadPage = (e) => {
        props.onReloadPage(e);
    };

    const handleInterestChange = (value) => {
        if (interestedIn.includes(value)) {
          // Remove the value if it's already checked
          setInterestedIn(interestedIn.filter(item => item !== value));
        } else {
          // Add the value if it's not checked
          setInterestedIn([...interestedIn, value]);
        }
    };

    const handleChange = (e) => {
        setQuestionnaire1Data({
            ...questionnaire1Data,
            [e.target.name]: e.target.value,
        });
    };

    async function questionnaire1Submit(e) {
        e.preventDefault();
        setQuestionnaire1Loading(true);
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/'+currentUser + '?current_user_id=' + current_user_id + '&token=' + token, { ...questionnaire1Data, interested_in: interestedIn } ).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                // reloadPage(true);
                hideAll(4);
                // setReloadCount(reloadCount + 1);
            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
            setQuestionnaire1Loading(false);
        }).catch((error) => {
            setQuestionnaire1Loading(false);
            toast.error('Something went wrong, please contact the administrator!');
        });
    };

    return (
        <>
            <Container className='q1 narrow-750 py-5 px-4 mt-5 text-dgray'>
                <Row>
                    <Col lg='12' className='text-center'>
                        <h2 className='form-title pb-2 mb-3'>Customer Details</h2>
                    </Col>
                </Row>
                <Form onSubmit={questionnaire1Submit}>
                    <Row className="mb-3">
                        <Col lg="12">
                            <Card className='mb-4 border-white'>
                                <CardBody>
                                    <Form.Label className='mb-2 fs-18'>
                                        Clothing Preferences
                                    </Form.Label>
                                    <Row className="align-items-center mt-1">
                                        <Col md="6">
                                            <Form.Label className="me-3" style={{minWidth: '90px'}}>
                                                <input
                                                type="checkbox"
                                                checked={interestedIn.includes('Men')}
                                                onChange={() => handleInterestChange('Men')}
                                                className="d-inline-block vertical-align-middle me-1"
                                                />
                                                <span>Men's Clothing</span>
                                            </Form.Label>
                                        </Col>
                                        <Col md="6">
                                            <Form.Label style={{minWidth: '90px'}}>
                                                <input
                                                type="checkbox"
                                                checked={interestedIn.includes('Baby/Toddlers')}
                                                onChange={() => handleInterestChange('Baby/Toddlers')}
                                                className="d-inline-block vertical-align-middle me-1"
                                                />
                                                <span>Baby/Toddler Clothing</span>
                                            </Form.Label>
                                        </Col>
                                    </Row>
                                    <Row className="align-items-center">
                                        <Col md="6">
                                            <Form.Label className="me-3" style={{minWidth: '90px'}}>
                                                <input
                                                type="checkbox"
                                                checked={interestedIn.includes('Women')}
                                                onChange={() => handleInterestChange('Women')}
                                                className="d-inline-block vertical-align-middle me-1"
                                                />
                                                <span>Women's Clothing</span>
                                            </Form.Label>
                                        </Col>
                                        <Col md="6">
                                            <Form.Label style={{minWidth: '90px'}}>
                                                <input
                                                type="checkbox"
                                                checked={interestedIn.includes('Others')}
                                                onChange={() => handleInterestChange('Others')}
                                                className="d-inline-block vertical-align-middle me-1"
                                                />
                                                <span>Others</span>
                                            </Form.Label>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card className='mb-4 border-white'>
                                <CardBody>
                                    <Form.Label className='mb-2 fs-18'>
                                        Event Date
                                    </Form.Label>
                                    <Row className="align-items-center mb-3">
                                        <Col md="12">
                                            <FormControl type='date' name='event_date' onChange={handleChange} className='mr-sm-2' />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12" className="text-right">
                            {signupType != "customer" && selectedSignupType != "customer" ?
                                <Button className='btn-outline me-3' type="button" onClick={function () { hideAll(0); }}>Back</Button>
                                :
                                null
                            }
                            {questionnaire1Loading ?
                                <Button className='btn-primary me-3' type="button">Saving...</Button>
                                :
                                <Button className='btn-primary me-3' type="submit">Save</Button>
                            }
                            {/* <span className="cursor-pointer text-black" onClick={function () { hideAll(2); }}>Skip <IoIosArrowRoundForward /></span> */}
                        </Col>
                    </Row>
                </Form>
            </Container>
        </>
    );
};

export default Questionnaire1;