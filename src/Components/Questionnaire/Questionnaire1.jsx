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
    referrer: '',
    referrer_details: '',
    lifestyle_details: '',
    target_date: '',
});

const initialClothingSizes = Object.freeze({
    top_size: '',
    top_size_standard: '',
    skirt_size: '',
    skirt_size_standard: '',
    pants_size: '',
    pants_size_standard: '',
    dress_size: '',
    dress_size_standard: '',
})

const Questionnaire1 = (props) => {
    const navigate = useNavigate();
    const currentStep = props.step;
    const currentUser = props.currentUser;
    const user = props.user;

    const [questionnaire1Data, setQuestionnaire1Data] = useState(initialQuestionnaire1Data);
    const [clothingSizes, setClothingSizes] = useState(initialClothingSizes);
    const [questionnaire1Loading, setQuestionnaire1Loading] = useState(false);
    const [scheduleShow, setScheduleShow] = useState(false);

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'token']);

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

    const handleDateChange = (e) => {
        setQuestionnaire1Data({
            ...questionnaire1Data,
            target_date: e,
        })
    };
    
    const handleChange = (e) => {
        setQuestionnaire1Data({
            ...questionnaire1Data,
            [e.target.name]: e.target.value,
        });
    };

    const handleChangeClothingSizes = (e) => {
        setClothingSizes({
            ...clothingSizes,
            [e.target.name]: e.target.value,
        })
    };

    async function questionnaire1Submit(e) {
        e.preventDefault();
        setQuestionnaire1Loading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'customer', { ...questionnaire1Data, clothing_sizes: clothingSizes, user_id: currentUser }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                reloadPage(true);
                hideAll(2);
            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
            setQuestionnaire1Loading(false);
        }).catch((error) => {
            setQuestionnaire1Loading(false);
            toast.error('Something went wrong, please contact the administrator!');
        });
    };

    useEffect(() => {
        // ComponentDidMount logic goes here
        // This will be executed after the component is mounted
        if (user) {
            if (user.customer) {
                setQuestionnaire1Data(user.customer);
                if (user.customer.clothing_sizes) {
                    const sizes = user.customer.clothing_sizes;
                    setClothingSizes(sizes);
                }
            }
        }
        
        return () => {
            // ComponentWillUnmount logic goes here (optional)
            // This will be executed before the component is unmounted
            //   console.log('Component is unmounted');
        };
    }, []);

    return (
        <>
            <Container className='q1 narrow-750 py-5 px-4 mt-5 text-dgray'>
                <Row>
                    <Col lg='12' className='text-center'>
                        <h2 className='form-title pb-2 mb-3'>Lorem ipsum dolor sit?</h2>
                    </Col>
                </Row>
                <Form onSubmit={questionnaire1Submit}>
                    <Row className="mb-3">
                        <Col lg="12">
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
                                                        <Form.Group as={Col} style={{ maxWidth: '60px' }}>
                                                            <Form.Label className="text-muted mb-0">Size: </Form.Label>
                                                        </Form.Group>
                                                        <Form.Group as={Col}>
                                                            <Form.Control as='select' name='top_size_standard' value={clothingSizes.top_size_standard} onChange={handleChangeClothingSizes}>
                                                                <option value=''>Select size standard</option>
                                                                <option value='option1'>Option 1</option>
                                                                <option value='option2'>Option 2</option>
                                                                <option value='option3'>Option 3</option>
                                                            </Form.Control>
                                                        </Form.Group>
                                                        <Form.Group as={Col}>
                                                            <Form.Control as='select' name='top_size' value={clothingSizes.top_size} onChange={handleChangeClothingSizes}>
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
                                                        <Form.Group as={Col} style={{ maxWidth: '60px' }}>
                                                            <Form.Label className="text-muted mb-0">Size: </Form.Label>
                                                        </Form.Group>
                                                        <Form.Group as={Col}>
                                                            <Form.Control as='select' name='skirt_size_standard' value={clothingSizes.skirt_size_standard} onChange={handleChangeClothingSizes}>
                                                                <option value=''>Select size standard</option>
                                                                <option value='option1'>Option 1</option>
                                                                <option value='option2'>Option 2</option>
                                                                <option value='option3'>Option 3</option>
                                                            </Form.Control>
                                                        </Form.Group>
                                                        <Form.Group as={Col}>
                                                            <Form.Control as='select' name='skirt_size' value={clothingSizes.skirt_size} onChange={handleChangeClothingSizes}>
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
                                                        <Form.Group as={Col} style={{ maxWidth: '60px' }}>
                                                            <Form.Label className="text-muted mb-0">Size: </Form.Label>
                                                        </Form.Group>
                                                        <Form.Group as={Col}>
                                                            <Form.Control as='select' name='pants_size_standard' value={clothingSizes.pants_size_standard} onChange={handleChangeClothingSizes}>
                                                                <option value=''>Select size standard</option>
                                                                <option value='option1'>Option 1</option>
                                                                <option value='option2'>Option 2</option>
                                                                <option value='option3'>Option 3</option>
                                                            </Form.Control>
                                                        </Form.Group>
                                                        <Form.Group as={Col}>
                                                            <Form.Control as='select' name='pants_size' value={clothingSizes.pants_size}  onChange={handleChangeClothingSizes}>
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
                                                        <Form.Group as={Col} style={{ maxWidth: '60px' }}>
                                                            <Form.Label className="text-muted mb-0">Size: </Form.Label>
                                                        </Form.Group>
                                                        <Form.Group as={Col}>
                                                            <Form.Control as='select' name='dress_size_standard' value={clothingSizes.dress_size_standard} onChange={handleChangeClothingSizes}>
                                                                <option value=''>Select size standard</option>
                                                                <option value='option1'>Option 1</option>
                                                                <option value='option2'>Option 2</option>
                                                                <option value='option3'>Option 3</option>
                                                            </Form.Control>
                                                        </Form.Group>
                                                        <Form.Group as={Col}>
                                                            <Form.Control as='select' name='dress_size' value={clothingSizes.dress_size} onChange={handleChangeClothingSizes}>
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
                                    <Row className='mt-2'>
                                        <Form.Group as={Col}>
                                            <Form.Check
                                                className="cursor-pointer"
                                                type="radio"
                                                label="Referral"
                                                name="referrer"
                                                value="Referral"
                                                checked={questionnaire1Data.referrer === 'Referral'}
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
                                                checked={questionnaire1Data.referrer === 'Social Media'}
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
                                                checked={questionnaire1Data.referrer === 'Ads'}
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
                                                checked={questionnaire1Data.referrer === 'Other'}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Row>
                                    {questionnaire1Data.referrer === 'Other' ?
                                        <Form.Group className="mt-3">
                                            <Form.Control
                                                as="textarea"
                                                name="referrer_details"
                                                rows={5} // You can adjust the number of rows as needed
                                                value={questionnaire1Data.referrer_details}
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
                                    <Form.Label className='mb-1 fs-18'>
                                        Lifestyle Details
                                    </Form.Label>
                                    <Form.Label className="mb-3 small mt-1">
                                        Understanding your daily activities, profession, and hobbies can help designers suggest versatile pieces that suit your lifestyle.
                                    </Form.Label>
                                    <Form.Group>
                                        <Form.Control
                                            as="textarea"
                                            name="lifestyle_details"
                                            rows={5} // You can adjust the number of rows as needed
                                            value={questionnaire1Data.lifestyle_details}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </CardBody>
                            </Card>
                            <Card className='mb-4 border-white'>
                                <CardBody>
                                    <Form.Label className='mb-2 fs-18'>
                                        When do you need the clothing?
                                    </Form.Label>
                                    <Form.Group className="d-flex column-gap-10">
                                        <Form.Control
                                            type="date"
                                            name="target_date"
                                            value={questionnaire1Data.target_date}
                                            onChange={handleChange}
                                            style={{maxWidth: '250px'}}
                                        />
                                        <Button className='btn-primary' onClick={toggleSchedule} type="button">Pick a Date</Button>
                                    </Form.Group>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12" className="text-right">
                            <Button className='btn-outline me-3' type="button" onClick={function () { hideAll(1); }}>Back</Button>
                            {questionnaire1Loading ?
                                <Button className='btn-primary me-3' type="button">Saving...</Button>
                                :
                                <Button className='btn-primary me-3' type="submit">Save</Button>
                            }
                            <span className="cursor-pointer text-black" onClick={function () { hideAll(2); }}>Skip <IoIosArrowRoundForward /></span>
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
                    <Card>
                        <CardBody className="text-center py-5">
                            <GoAlertFill size="60px" color="#000" className="mb-2" />
                            <p className="fs-20 text-black">Under Construction</p>
                            {/* <DatePicker onSelectedDate={handleDateChange} date={questionnaire1Data.target_date} /> */}
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    );
};

export default Questionnaire1;