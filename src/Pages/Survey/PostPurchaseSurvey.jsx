import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LayoutNoFooter from 'Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import UserContent from 'Assets/images/usercontent.jpg';
import { IoCloseOutline } from "react-icons/io5";
import 'Assets/styles/CustomerSurvey/style.css';

const PostPurchaseSurvey = (props) => {
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
                        <div className='fs-30 mb-4'>Post Purchase/Delivery Survey</div>
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
                        <div>Overall, how would you rate your purchase experience?</div>
                        <div className='mb-3 mt-4 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Excellent</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Great</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Good</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Fair</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Poor</label>
                        </div>
                    </Card.Body>
                </Card>

                <Card className='mb-2'>
                    <Card.Body className='p-4'>
                        <div>How much do you agree or disagree with this statement: the price was fair.</div>
                        <div className='mb-3 mt-4 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Strongly disagree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Disagree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Neither agree nor disagree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Agree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Strongly agree</label>
                        </div>
                    </Card.Body>
                </Card>

                <Card className='mb-2'>
                    <Card.Body className='p-4'>
                        <div>How much do you agree or disagree with this statement: the information provided helped me make an informed decision.</div>
                        <div className='mb-3 mt-4 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Strongly disagree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Disagree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Neither agree nor disagree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Agree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Strongly agree</label>
                        </div>
                    </Card.Body>
                </Card>

                <Card className='mb-2'>
                    <Card.Body className='p-4'>
                        <div>How much do you agree or disagree with this statement: I was able to use my preferred payment method.</div>
                        <div className='mb-3 mt-4 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Strongly disagree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Disagree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Neither agree nor disagree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Agree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Strongly agree</label>
                        </div>
                    </Card.Body>
                </Card>

                <Card className='mb-2'>
                    <Card.Body className='p-4'>
                        <div>How much do you agree or disagree with this statement: It was easy to understand the total cost.</div>
                        <div className='mb-3 mt-4 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Strongly disagree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Disagree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Neither agree nor disagree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Agree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Strongly agree</label>
                        </div>
                    </Card.Body>
                </Card>

                <Card className='mb-2'>
                    <Card.Body className='p-4'>
                        <div>How much do you agree or disagree with this statement: the terms of my purchase were clear.</div>
                        <div className='mb-3 mt-4 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Strongly disagree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Disagree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Neither agree nor disagree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Agree</label>
                        </div>

                        <div className='mb-3 d-flex'>
                            <input type="radio" className='me-2 radio-size' />
                            <label className='ms-1 fs-14'>Strongly agree</label>
                        </div>
                    </Card.Body>
                </Card>

                <Card className='mb-2'>
                    <Card.Body className='p-4'>
                        <div>What could we do to make the purchase process better for you?*</div>
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

export default PostPurchaseSurvey;