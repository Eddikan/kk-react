import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, FormGroup, ModalFooter }  from 'react-bootstrap';
import { IoIosArrowRoundForward } from "react-icons/io";
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Card, CardBody, CardFooter, ModalHeader, ModalBody, Modal } from 'reactstrap';

const initialQuestionnaire2Data = Object.freeze({
    top_size: '',
    top_size_standard: '',
    skirt_size: '',
    skirt_size_standard: '',
    pants_size: '',
    pants_size_standard: '',
    dress_size: '',
    dress_size_standard: '',
    referrer: '',
    referrer_details: '',
    lifestyle_details: '',
  });

const Questionnaire2 = (props) => {
  const navigate = useNavigate();
  const currentStep = props.step;
  const currentUser = props.currentUser;

  const [questionnaire2Data, setQuestionnaire2Data] = useState(initialQuestionnaire2Data);
  const [questionnaire2Loading, setQuestionnaire2Loading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [reloadCount, setReloadCount] = useState(0);
  const [scheduleShow, setScheduleShow] = useState(false);

  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn','userDetails','userRole', 'token']);

  const toggleSchedule = (e) => {
    e.preventDefault();
    setScheduleShow(!scheduleShow);
  }

  const back = (e) => {
    props.onHideQuestionnaire(e);
  };

  const skip = (e) => {
    props.onSkip(e);
  };

  const handleChange = (e) => {
    setQuestionnaire2Data({
      ...questionnaire2Data,
      [e.target.name]: e.target.value,
    })
  }

  async function questionnaire2Submit(e) {
    e.preventDefault();
    setQuestionnaire2Loading(true);
    setTimeout(function(){
        skip(currentStep + 1);
        setQuestionnaire2Loading(false);
    }, 1500)
    // axios.post(process.env.REACT_APP_API_ENDPOINT + 'user/'+currentUser, {clothing_sizes: questionnaire2Data, user_id: currentUser }).then((response) => {
    //   const success = response.data.status;
    //   if (success == 'Success') {
    //     const data = response.data.data;
    //     const user = data.user;
    //     toast.success('Successfully signed up!');
    //     setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
    //     setCookie('userRole', JSON.stringify(user.role), { path: '/' });
    //     setCookie('userDetails', JSON.stringify(user), { path: '/' });
    //     setCookie('isLoggedIn', true, { path: '/' });
    //     setTimeout(function(){
    //       navigate("/email-confirmation");
    //     }, 1500)
    //   } else {
    //     const errors = response.data.errors;
    //     if (errors.email) {
    //       toast.error(errors.email[0]);
    //     } if (errors.password) {
    //       toast.error(errors.password[0]);
    //     } else {
    //       errors.map((error, index) => {
    //         toast.error(error);
    //         return null; // React requires a return value, so we return null here
    //       });
    //     }
    //   }
    //   setQuestionnaire2Loading(false);
    // }).catch((error) => {
    //     setQuestionnaire2Loading(false);
    //   toast.error('Something went wrong, please contact the administrator!');
    // });  
  }

  return (
    <>
        <Container className='q1 narrow-750 py-5 px-4 mt-5 text-dgray'>
            <Row>
                <Col lg='12' className='text-center'>
                    <h2 className='form-title pb-2 mb-3'>Showcase your talent</h2>
                </Col>
            </Row>
            <Form onSubmit={questionnaire2Submit}>
                <Row className="mb-3">
                    <Col lg="12">
                        <Card className='mb-4 border-white'>
                            <CardBody>
                                <Form.Label className='mb-1 fs-18'>
                                    Areas of Specialization and Expertise
                                </Form.Label>
                                <Form.Label className="mb-3">
                                    Specify your areas of expertise (e.g., bridal wear, ready-to-wear women’s clothing, casual, haute couture, sustainable fashion)
                                </Form.Label>
                                <Form.Group>
                                    <Form.Control
                                        type="text"
                                        name="lifestyle_details"
                                        value={questionnaire2Data.lifestyle_details}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </CardBody>
                        </Card>
                        <Card className='mb-4 border-white'>
                            <CardBody>
                                <Form.Label className='mb-2 fs-18'>
                                    Clothing sizes for:
                                </Form.Label>
                                <Card>
                                    <CardBody>
                                        {/* Top */}
                                        <Row className="align-items-center mb-3">
                                            <Col md="2">
                                                <Form.Label className="mb-0">Top</Form.Label>
                                            </Col>
                                            <Col md="10">
                                                <Row className="align-items-center">
                                                    <Form.Group as={Col} style={{maxWidth: '60px'}}>
                                                        <Form.Label className="text-muted mb-0">Size: </Form.Label>
                                                    </Form.Group>
                                                    <Form.Group as={Col}>
                                                        <Form.Control as='select' name='top_size_standard' onChange={handleChange}>
                                                            <option value=''>Select size standard</option>
                                                            <option value='option1'>Option 1</option>
                                                            <option value='option2'>Option 2</option>
                                                            <option value='option3'>Option 3</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                    <Form.Group as={Col}>
                                                        <Form.Control as='select' name='top_size' onChange={handleChange}>
                                                            <option value=''></option>
                                                            <option value='option1'>Option 1</option>
                                                            <option value='option2'>Option 2</option>
                                                            <option value='option3'>Option 3</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Row>    
                                            </Col>
                                        </Row>
                                        {/* Skirt */}
                                        <Row className="align-items-center mb-3">
                                            <Col md="2">
                                                <Form.Label className="mb-0">Skirt</Form.Label>
                                            </Col>
                                            <Col md="10">
                                                <Row className="align-items-center">
                                                    <Form.Group as={Col} style={{maxWidth: '60px'}}>
                                                        <Form.Label className="text-muted mb-0">Size: </Form.Label>
                                                    </Form.Group>
                                                    <Form.Group as={Col}>
                                                        <Form.Control as='select' name='skirt_size_standard' onChange={handleChange}>
                                                            <option value=''>Select size standard</option>
                                                            <option value='option1'>Option 1</option>
                                                            <option value='option2'>Option 2</option>
                                                            <option value='option3'>Option 3</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                    <Form.Group as={Col}>
                                                        <Form.Control as='select' name='skirt_size' onChange={handleChange}>
                                                            <option value=''></option>
                                                            <option value='option1'>Option 1</option>
                                                            <option value='option2'>Option 2</option>
                                                            <option value='option3'>Option 3</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Row>    
                                            </Col>
                                        </Row>
                                        {/* Pants */}
                                        <Row className="align-items-center mb-3">
                                            <Col md="2">
                                                <Form.Label className="mb-0">Pants</Form.Label>
                                            </Col>
                                            <Col md="10">
                                                <Row className="align-items-center">
                                                    <Form.Group as={Col} style={{maxWidth: '60px'}}>
                                                        <Form.Label className="text-muted mb-0">Size: </Form.Label>
                                                    </Form.Group>
                                                    <Form.Group as={Col}>
                                                        <Form.Control as='select' name='pants_size_standard' onChange={handleChange}>
                                                            <option value=''>Select size standard</option>
                                                            <option value='option1'>Option 1</option>
                                                            <option value='option2'>Option 2</option>
                                                            <option value='option3'>Option 3</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                    <Form.Group as={Col}>
                                                        <Form.Control as='select' name='pants_size' onChange={handleChange}>
                                                            <option value=''></option>
                                                            <option value='option1'>Option 1</option>
                                                            <option value='option2'>Option 2</option>
                                                            <option value='option3'>Option 3</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Row>    
                                            </Col>
                                        </Row>
                                        {/* Dress */}
                                        <Row className="align-items-center">
                                            <Col md="2">
                                                <Form.Label className="mb-0">Dress</Form.Label>
                                            </Col>
                                            <Col md="10">
                                                <Row className="align-items-center">
                                                    <Form.Group as={Col} style={{maxWidth: '60px'}}>
                                                        <Form.Label className="text-muted mb-0">Size: </Form.Label>
                                                    </Form.Group>
                                                    <Form.Group as={Col}>
                                                        <Form.Control as='select' name='dress_size_standard' onChange={handleChange}>
                                                            <option value=''>Select size standard</option>
                                                            <option value='option1'>Option 1</option>
                                                            <option value='option2'>Option 2</option>
                                                            <option value='option3'>Option 3</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                    <Form.Group as={Col}>
                                                        <Form.Control as='select' name='dress_size' onChange={handleChange}>
                                                            <option value=''></option>
                                                            <option value='option1'>Option 1</option>
                                                            <option value='option2'>Option 2</option>
                                                            <option value='option3'>Option 3</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Row>    
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </CardBody>
                        </Card>
                        <Card className='mb-4 border-white'>
                            <CardBody>
                                <Form.Label className='mb-2 fs-18'>
                                    How did you find out about Kouture Konect?
                                </Form.Label>
                                <Row>
                                    <Form.Group as={Col}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="radio"
                                            label="Referral"
                                            name="referrer"
                                            value="Referral"
                                            checked={questionnaire2Data.referrer === 'Referral'}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="radio"
                                            label="Social Media"
                                            name="referrer"
                                            value="Social Media"
                                            checked={questionnaire2Data.referrer === 'Social Media'}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="radio"
                                            label="Ads"
                                            name="referrer"
                                            value="Ads"
                                            checked={questionnaire2Data.referrer === 'Ads'}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="radio"
                                            label="Other"
                                            name="referrer"
                                            value="Other"
                                            checked={questionnaire2Data.referrer === 'Other'}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Row>
                                {questionnaire2Data.referrer === 'Other' ?
                                    <Form.Group className="mt-3">
                                        <Form.Control
                                            as="textarea"
                                            name="referrer_details"
                                            rows={5} // You can adjust the number of rows as needed
                                            value={questionnaire2Data.referrer_details}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    :
                                    null
                                }
                            </CardBody>
                        </Card>
                        <Card className='mb-4 border-white'>
                            <CardBody>
                                <Form.Label className='mb-2 fs-18'>
                                    When do you need the clothing?
                                </Form.Label>
                                <Form.Group>
                                    <Button className='btn-primary' onClick={toggleSchedule} type="button">Pick a Date</Button>
                                </Form.Group>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col lg="12" className="text-right">
                        <Button className='btn-outline me-3' type="button" onClick={function() { back(1); }}>Back</Button>
                        {questionnaire2Loading ?
                            <Button className='btn-primary me-3' type="button">Saving...</Button>
                            :
                            <Button className='btn-primary me-3' type="submit">Save</Button>
                        }
                        <span className="cursor-pointer text-black" onClick={function() {back(1); skip(currentStep + 1);}}>Skip <IoIosArrowRoundForward /></span>
                    </Col>
                </Row>
            </Form>
        </Container>
        {/* Schedule */}
        <Modal
            isOpen={scheduleShow}
            className='modal-preview'
            fade={false}
            centered
        >
            <ModalHeader className="pb-0">
                <h5 className='modal-title text-uppercase text-left'></h5>
                <button type='button' className='close react-modal-close' onClick={toggleSchedule} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                </button>
            </ModalHeader>
            <ModalBody>
                <h4 className='text-center fs-25 fw-600'>Schedule</h4>
                <Card  className='border-white'>
                    <CardBody>

                    </CardBody>
                </Card>
            </ModalBody>
        </Modal>
    </>
  );
};

export default Questionnaire2;