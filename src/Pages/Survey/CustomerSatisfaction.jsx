import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LayoutNoFooter from 'Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import { IoCloseOutline } from "react-icons/io5";
import UserContent from 'Assets/images/usercontent.jpg';
import 'Assets/styles/CustomerSurvey/style.css';

const CustomerSatisfaction = (props) => {
    const [clearFormModal, setClearFormModal] = useState(false);

    function toggleClearFormModal() {
        setClearFormModal(true);
    }

    return (
        <section>
            <Container fluid className='customer-survey'>
                <img src={UserContent} className='user-content-photo' />

                <Card className='mt-3 mb-2'>
                    <Card.Body>
                        <div className='fs-30 mb-4'>Customer Satisfaction Feedback</div>
                        <div className='fs-14'>We would love to hear your thoughts or feedback on how we can improve your experience!</div>
                    </Card.Body>
                    <hr className='mb-0 mt-0' />
                    <Card.Body>
                        <div className='d-flex'>
                            <div className='fs-14 fw-600 me-2'>vb.jmagnaye@gmail.com</div>
                            <div className='fs-14'>Switch account</div>
                        </div>
                    </Card.Body>
                    <hr className='mb-0 mt-0' />
                    <Card.Body>
                        <div className='fs-14 indicate-question '>* Indicates required question</div>
                    </Card.Body>
                </Card>

                <Card className='mb-2'>
                    <Card.Body className='p-4'>
                        <div>How likely is it that you would recommend Kouture Konect to a friend, family or colleague?</div>
                        <div className='d-flex mt-4'>
                            <div className='d-flex justify-content-center align-items-end me-3'>
                                Not at all Likely
                            </div>
                            <div>
                                <span className='ms-1'>1</span>
                                <br />
                                <input type="radio" className='me-2 mt-3 radio-size' />
                            </div>

                            <div>
                                <span className='ms-1'>2</span>
                                <br />
                                <input type="radio" className='me-2 mt-3 radio-size' />
                            </div>

                            <div>
                                <span className='ms-1'>3</span>
                                <br />
                                <input type="radio" className='me-2 mt-3 radio-size' />
                            </div>

                            <div>
                                <span className='ms-1'>4</span>
                                <br />
                                <input type="radio" className='me-2  mt-3 radio-size' />
                            </div>

                            <div>
                                <span className='ms-1'>5</span>
                                <br />
                                <input type="radio" className='me-2 mt-3 radio-size' />
                            </div>

                            <div>
                                <span className='ms-1'>6</span>
                                <br />
                                <input type="radio" className='me-2 mt-3 radio-size' />
                            </div>

                            <div>
                                <span className='ms-1'>7</span>
                                <br />
                                <input type="radio" className='me-2  mt-3 radio-size' />
                            </div>

                            <div>
                                <span className='ms-1'>8</span>
                                <br />
                                <input type="radio" className='me-2 mt-3 radio-size' />
                            </div>

                            <div>
                                <span className='ms-1'>9</span>
                                <br />
                                <input type="radio" className='me-2 mt-3 radio-size' />
                            </div>

                            <div>
                                <span className='ms-1'>10</span>
                                <br />
                                <input type="radio" className='me-2 mt-3 radio-size' />
                            </div>

                            <div className='d-flex justify-content-center align-items-end me-3'>
                                Extremely Likely
                            </div>
                        </div>


                    </Card.Body>
                </Card>

                <Card className='mb-2'>
                    <Card.Body className='p-4'>
                        <div>Overall, how satisfied or dissatisfied are you with our company?</div>
                        <div className='mb-3 mt-4 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Very satisfied</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'> Somewhat satisfied</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Neither satisfied nor dissatisfied</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Somewhat dissatisfied</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Very dissatisfied</label>
                        </div>
                    </Card.Body>
                </Card>

                <Card className='mb-2'>
                    <Card.Body className='p-4'>
                        <div>Which of the following words would you use to describe our service? Select all that apply?</div>
                        <div className='mb-3 mt-4 d-flex'>
                            <input type="checkbox" className='me-2 checkbox-size' />
                            <label className='ms-1 fs-14'>Reliable</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="checkbox" className='me-2 checkbox-size' />
                            <label className='ms-1 fs-14'>High quality</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="checkbox" className='me-2 checkbox-size' />
                            <label className='ms-1 fs-14'>Useful</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="checkbox" className='me-2 checkbox-size' />
                            <label className='ms-1 fs-14'>Unique</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="checkbox" className='me-2 checkbox-size' />
                            <label className='ms-1 fs-14'>Good value for money</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="checkbox" className='me-2 checkbox-size' />
                            <label className='ms-1 fs-14'>Impractical</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="checkbox" className='me-2 checkbox-size' />
                            <label className='ms-1 fs-14'>Ineffective</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="checkbox" className='me-2 checkbox-size' />
                            <label className='ms-1 fs-14'>Poor quality</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="checkbox" className='me-2 checkbox-size' />
                            <label className='ms-1 fs-14'>Unreliable</label>
                        </div>
                    </Card.Body>
                </Card>

                <Card className='mb-2'>
                    <Card.Body className='p-4'>
                        <div>How well did your product meet your needs?*</div>
                        <div className='mb-3 mt-4 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Extremely well</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Very well</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Somewhat well</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Not so well</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Not at all well</label>
                        </div>
                    </Card.Body>
                </Card>

                <Card className='mb-2'>
                    <Card.Body className='p-4'>
                        <div>How would you rate the quality of the product?*</div>
                        <div className='mb-3 mt-4 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Very high quality</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>High quality</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Neither high nor low quality</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Low quality</label>
                        </div>
                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Very low quality</label>
                        </div>
                    </Card.Body>
                </Card>

                <Card className='mb-2'>
                    <Card.Body className='p-4'>
                        <div>How would you rate the value for money of the product?*</div>
                        <div className='mb-3 mt-4 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Excellent</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Above average</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Average</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Below average</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Poor</label>
                        </div>
                    </Card.Body>
                </Card>

                <Card className='mb-2'>
                    <Card.Body className='p-4'>
                        <div>How would you rate our responsiveness to your questions/concerns?*</div>
                        <div className='mb-3 mt-4 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Extremely responsive</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Very responsive</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Somewhat responsive</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Not so responsive</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Not at all responsive</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Not applicable</label>
                        </div>
                    </Card.Body>
                </Card>

                <Card className='mb-2'>
                    <Card.Body className='p-4'>
                        <div>How long have you been a Kouture Konect customer?*</div>
                        <div className='mb-3 mt-4 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>This is my first purchase</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Less than six months</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Six months to a year</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Six months to a year</label>

                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>3 or more years</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>I haven't made a purchase yet</label>
                        </div>
                    </Card.Body>
                </Card>

                <Card className='mb-2'>
                    <Card.Body className='p-4'>
                        <div>How likely are you to use our service again?*</div>
                        <div className='mb-3 mt-4 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Extremely likely</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Very likely</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Somewhat likely</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Not so likely</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Not at all likely</label>
                        </div>
                    </Card.Body>
                </Card>

                <Card className='mb-2'>
                    <Card.Body className='p-4'>
                        <div>Do you have any other comments,  questions, or concerns?*</div>
                        <div className='mb-3 mt-4 d-flex'>
                            <input type="text" className='me-2 question-concerns' placeholder='Your answer' />
                        </div>
                        <hr className='mt-0 mb-0' />
                    </Card.Body>
                </Card>

                <Row>
                    <Col lg="6">
                        <button className='btn-submit'>Submit</button>
                    </Col>

                    <Col lg="6" className='text-right mt-2' onClick={toggleClearFormModal}>
                        <button className='clear-form'>Clear form</button>
                    </Col>
                </Row>
            </Container>

            <Modal
                show={clearFormModal}
                className='modal-preview'
                fade={false}
                centered
            >
                <Modal.Header className="pb-0">
                    <Modal.Title className='rufina-family fs-22 text-black'>Clear form?</Modal.Title>
                    <button type='button' className='close react-modal-close' onClick={function () { setClearFormModal(false); }} >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <p className="mb-0">This will remove your answers from all questions, and cannot be undone.</p>
                        </Card.Body>
                    </Card>
                    <Card.Footer className="text-right mt-3">
                        <button className="btn btn-secondary border-black bg-white text-black me-3 btn-style" onClick={() => setClearFormModal(false)} type="button">Cancel</button>
                        {/* {portfolioDeleteLoading ?
                            <button className="btn btn-primary btn-style" type="button" >Clearing...</button>
                            : */}
                        <button className="btn btn-primary btn-style" type="button" >Clear form</button>
                        {/* } */}
                    </Card.Footer>
                </Modal.Body>
            </Modal>
        </section>

    );
};

export default CustomerSatisfaction;