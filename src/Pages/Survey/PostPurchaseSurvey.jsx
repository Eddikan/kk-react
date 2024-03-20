import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import UserContent from 'Assets/images/usercontent.jpg';
import { TbMessageX } from "react-icons/tb";
import { IoCloseOutline } from "react-icons/io5";
import 'Assets/styles/Survey/style.css';
import toast from 'react-hot-toast';
import axios from "axios";

const initialPurchaseSurvey = Object.freeze({
    purchase_experience_rating: '',
    price_fairness_agreement: '',
    informed_decision_agreement: '',
    payment_method_agreement: '',
    total_cost_agreement: '',
    purchase_agreement: '',
    purchase_process: ''
});

const PostPurchaseSurvey = (props) => {
    const [clearFormModal, setClearFormModal] = useState(false);
    const [postPurchaseFormData, setPostPurchaseFormData] = useState(initialPurchaseSurvey);
    const [reloadCount, setReloadCount] = useState(0);
    const [formStatus, setFormStatus] = useState('standby');


    const postPurchaseSurvey = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + '/#', data);
    };

    const toggleEmptyField = () => {
        setPostPurchaseFormData(initialPurchaseSurvey);
    }

    const handleChangePostPurchase = (e) => {
        const { name, value } = e.target;
        setPostPurchaseFormData({
            ...postPurchaseFormData,
            [name]: value,
        });
    };

    function toggleClearFormModal() {
        setClearFormModal(true);
    }

    const purchaseSurveySubmit = (e) => {
        setFormStatus('loading');
        postPurchaseSurvey({ ...postPurchaseFormData }).then(response => {
            const status = response.data.status;
            if (status === "Success") {
                setFormStatus('standby');
                setReloadCount(reloadCount + 1);
                setPostPurchaseFormData(initialPurchaseSurvey);
                toast.success('Purchase Survey sent successfully!');
            } else {
                setFormStatus('standby');
                toast.error('There has been an error saving the survey, please try again!');
            }
        }).catch(() => {
            toast.error('There has been an error saving the survey, please try again!');
        });
    }

    return (
        <Layout>
            <section className='bg-light'>
                <Container className='py-5'>
                    <Row>
                        <Col>
                            <Card className='mt-3 mb-3 bordered-top-primary-survey'>
                                <Card.Body>
                                    <div className='fs-30 mb-4'>Post Purchase/Delivery Survey</div>
                                    <div className='fs-15'>We would love to hear your thoughts or feedback on how we can improve your experience!</div>
                                </Card.Body>
                                <hr className='mb-0 mt-0' />
                                <Card.Body>
                                    <div className='d-flex'>
                                        <div className='fs-15 fw-600 me-2 email-survey'>vb.jmagnaye@gmail.com</div>
                                        <div className='fs-15 switch-account'>Switch account</div>
                                    </div>
                                    <div className='mt-2'><TbMessageX className='me-2' size={20} color='#5f6368' />
                                        <span className='not-shared fs-14'>Not shared</span>
                                    </div>
                                </Card.Body>
                                <hr className='mb-0 mt-0' />
                                <Card.Body>
                                    <div className='fs-14 indicate-question '>* Indicates required question</div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>Overall, how would you rate your purchase experience?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="purchase_experience_rating"
                                            value="Excellent"
                                            checked={postPurchaseFormData.purchase_experience_rating === "Excellent"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Excellent</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="purchase_experience_rating"
                                            value="Great"
                                            checked={postPurchaseFormData.purchase_experience_rating === "Great"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Great</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="purchase_experience_rating"
                                            value="Good"
                                            checked={postPurchaseFormData.purchase_experience_rating === "Good"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Good</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="purchase_experience_rating"
                                            value="Fair"
                                            checked={postPurchaseFormData.purchase_experience_rating === "Fair"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Fair</label>
                                    </div>

                                    <div className='d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="purchase_experience_rating"
                                            value="Poor"
                                            checked={postPurchaseFormData.purchase_experience_rating === "Poor"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Poor</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How much do you agree or disagree with this statement: the price was fair.
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="price_fairness_agreement"
                                            value="Strongly disagree"
                                            checked={postPurchaseFormData.price_fairness_agreement === "Strongly disagree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Strongly disagree</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="price_fairness_agreement"
                                            value="Disagree"
                                            checked={postPurchaseFormData.price_fairness_agreement === "Disagree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Disagree</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="price_fairness_agreement"
                                            value="Neither agree nor disagree"
                                            checked={postPurchaseFormData.price_fairness_agreement === "Neither agree nor disagree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Neither agree nor disagree</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="price_fairness_agreement"
                                            value="Agree"
                                            checked={postPurchaseFormData.price_fairness_agreement === "Agree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Agree</label>
                                    </div>

                                    <div className='d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="price_fairness_agreement"
                                            value="Strongly agree"
                                            checked={postPurchaseFormData.price_fairness_agreement === "Strongly agree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Strongly agree</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How much do you agree or disagree with this statement: the information provided helped me make an informed decision.
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="informed_decision_agreement"
                                            value="Strongly disagree"
                                            checked={postPurchaseFormData.informed_decision_agreement === "Strongly disagree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Strongly disagree</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="informed_decision_agreement"
                                            value="Disagree"
                                            checked={postPurchaseFormData.informed_decision_agreement === "Disagree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Disagree</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="informed_decision_agreement"
                                            value="Neither agree nor disagree"
                                            checked={postPurchaseFormData.informed_decision_agreement === "Neither agree nor disagree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Neither agree nor disagree</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="informed_decision_agreement"
                                            value="Agree"
                                            checked={postPurchaseFormData.informed_decision_agreement === "Agree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Agree</label>
                                    </div>

                                    <div className='d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="informed_decision_agreement"
                                            value="Strongly agree"
                                            checked={postPurchaseFormData.informed_decision_agreement === "Strongly agree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Strongly agree</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How much do you agree or disagree with this statement: I was able to use my preferred payment method.
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="payment_method_agreement"
                                            value="Strongly disagree"
                                            checked={postPurchaseFormData.payment_method_agreement === "Strongly disagree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Strongly disagree</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="payment_method_agreement"
                                            value="Disagree"
                                            checked={postPurchaseFormData.payment_method_agreement === "Disagree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Disagree</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="payment_method_agreement"
                                            value="Neither agree nor disagree"
                                            checked={postPurchaseFormData.payment_method_agreement === "Neither agree nor disagree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Neither agree nor disagree</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="payment_method_agreement"
                                            value="Agree"
                                            checked={postPurchaseFormData.payment_method_agreement === "Agree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Agree</label>
                                    </div>

                                    <div className='d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="payment_method_agreement"
                                            value="Strongly agree"
                                            checked={postPurchaseFormData.payment_method_agreement === "Strongly agree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Strongly agree</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How much do you agree or disagree with this statement: It was easy to understand the total cost.
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="total_cost_agreement"
                                            value="Strongly disagree"
                                            checked={postPurchaseFormData.total_cost_agreement === "Strongly disagree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Strongly disagree</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="total_cost_agreement"
                                            value="Disagree"
                                            checked={postPurchaseFormData.total_cost_agreement === "Disagree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Disagree</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="total_cost_agreement"
                                            value="Neither agree nor disagree"
                                            checked={postPurchaseFormData.total_cost_agreement === "Neither agree nor disagree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Neither agree nor disagree</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="total_cost_agreement"
                                            value="Agree"
                                            checked={postPurchaseFormData.total_cost_agreement === "Agree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Agree</label>
                                    </div>

                                    <div className='d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="total_cost_agreement"
                                            value="Strongly agree"
                                            checked={postPurchaseFormData.total_cost_agreement === "Strongly agree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Strongly agree</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How much do you agree or disagree with this statement: the terms of my purchase were clear.
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="purchase_agreement"
                                            value="Strongly disagree"
                                            checked={postPurchaseFormData.purchase_agreement === "Strongly disagree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Strongly disagree</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="purchase_agreement"
                                            value="Disagree"
                                            checked={postPurchaseFormData.purchase_agreement === "Disagree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Disagree</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="purchase_agreement"
                                            value="Neither agree nor disagree"
                                            checked={postPurchaseFormData.purchase_agreement === "Neither agree nor disagree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Neither agree nor disagree</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="purchase_agreement"
                                            value="Agree"
                                            checked={postPurchaseFormData.purchase_agreement === "Agree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Agree</label>
                                    </div>

                                    <div className='d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="purchase_agreement"
                                            value="Strongly agree"
                                            checked={postPurchaseFormData.purchase_agreement === "Strongly agree"}
                                            onChange={handleChangePostPurchase}
                                        />
                                        <label className='ms-1 fs-15'>Strongly agree</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>What could we do to make the purchase process better for you?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="text"
                                            className='me-2 question-concerns form-control'
                                            name="purchase_process"
                                            value={postPurchaseFormData.purchase_process}
                                            onChange={handleChangePostPurchase}
                                            placeholder='Your answer' />
                                    </div>
                                </Card.Body>
                            </Card>

                            <Row>
                                <Col lg="12" className='text-right mt-3'>
                                    <button
                                        className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
                                        onClick={toggleClearFormModal}
                                        type="button"
                                    >
                                        Clear form
                                    </button>

                                    <button
                                        className='btn btn-primary btn-style'
                                        // onClick={purchaseSurveySubmit}
                                    >
                                        Submit
                                    </button>
                                </Col>
                            </Row>
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
                        <button
                            type='button'
                            className='close react-modal-close'
                            onClick={function () { setClearFormModal(false); }}
                        >
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
                            <button
                                className="btn border-black bg-white text-black me-3 btn-style"
                                onClick={() => setClearFormModal(false)}
                                type="button"
                            >
                                Cancel
                            </button>

                            <button
                                className="btn btn-primary btn-style"
                                type="button"
                                onClick={() => {
                                    toggleEmptyField();
                                    setClearFormModal(false);
                                }}
                            >
                                Clear form
                            </button>
                        </Card.Footer>
                    </Modal.Body>
                </Modal>

            </section >
        </Layout>
    );
};

export default PostPurchaseSurvey;