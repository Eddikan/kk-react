import React, { useEffect, useState } from 'react';
import LayoutAdmin from 'Components/Layout/LayoutAdmin';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useLocation, Link,useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
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

const AdminViewSurvey = (props) => {
    const { surveyId } = useParams();
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const [postPurchaseFormData, setPostPurchaseFormData] = useState(initialPurchaseSurvey);
    const [reloadCount, setReloadCount] = useState(0);
    const [postPurchase, setPostPurchase] = useState([]);
    const [postPurchasesLoading, setPostPurchasesLoading] = useState(true);
    const navigate = useNavigate();

    const getPostPurchase = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'post-purchase-survey/' + surveyId);
    };

    const handleChangePostPurchase = (e) => {
        const { name, value } = e.target;
        setPostPurchaseFormData({
            ...postPurchaseFormData,
            [name]: value,
        });
    };

    useEffect(() => {
            getPostPurchase()
                .then((response) => {
                    setPostPurchasesLoading(false);
                    const selectedPostPurchase = response.data.data;
                    if (selectedPostPurchase) {
                        setPostPurchase(selectedPostPurchase);
                        setPostPurchaseFormData(selectedPostPurchase);
                    } else {
                        toast.error('There has been an error getting the surveys, please try again!');
                        setPostPurchasesLoading(false);
                    }
                })
                .catch((error) => {
                    toast.error('There has been an error getting the surveys, please try again!');
                    setPostPurchasesLoading(false);
                });
            },
        [reloadCount]);

    return (
        <LayoutAdmin>
            <section className='bg-light'>
                <Container className='py-5'>
                    <Row>
                        <Col lg={11}>
                        </Col>

                        <Col md={1} className="text-right">
                            <GoBack fallBack="/#" />
                        </Col>

                        <Col>
                            <Card className='mt-3 mb-3 mt-3 bordered-top-primary-survey'>
                                <Card.Body>
                                    <div className='fs-30 mb-4 rufina-family'>
                                        Post Purchase/Delivery Survey
                                    </div>

                                    <div className='fs-15'>
                                        We would love to hear your thoughts or feedback on how we can improve your experience!
                                    </div>
                                </Card.Body>
                                <hr className='mb-0 mt-0' />

                                <Card.Body>
                                    <div className='fs-14 indicate-question '>
                                        * Indicates required question
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 mt-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>
                                        Overall, how would you rate your purchase experience?
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
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Excellent</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="purchase_experience_rating"
                                            value="Great"
                                            checked={postPurchaseFormData.purchase_experience_rating === "Great"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Great</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="purchase_experience_rating"
                                            value="Good"
                                            checked={postPurchaseFormData.purchase_experience_rating === "Good"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Good</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="purchase_experience_rating"
                                            value="Fair"
                                            checked={postPurchaseFormData.purchase_experience_rating === "Fair"}
                                            onChange={handleChangePostPurchase}
                                            disabled
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
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Poor</label>
                                    </div>

                                </Card.Body>
                            </Card>

                            <Card className='mb-3 mt-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>
                                        How much do you agree or disagree with this statement: the price was fair.
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
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Strongly disagree</label>
                                    </div>

                                    <div className='mb-3 mt-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="price_fairness_agreement"
                                            value="Disagree"
                                            checked={postPurchaseFormData.price_fairness_agreement === "Disagree"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Disagree</label>
                                    </div>

                                    <div className='mb-3 mt-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="price_fairness_agreement"
                                            value="Neither agree nor disagree"
                                            checked={postPurchaseFormData.price_fairness_agreement === "Neither agree nor disagree"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Neither agree nor disagree</label>
                                    </div>

                                    <div className='mb-3 mt-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="price_fairness_agreement"
                                            value="Agree"
                                            checked={postPurchaseFormData.price_fairness_agreement === "Agree"}
                                            onChange={handleChangePostPurchase}
                                            disabled
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
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Strongly agree</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 mt-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>
                                        How much do you agree or disagree with this statement: the information provided helped me make an informed decision.
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
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Strongly disagree</label>
                                    </div>

                                    <div className='mb-3 mt-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="informed_decision_agreement"
                                            value="Disagree"
                                            checked={postPurchaseFormData.informed_decision_agreement === "Disagree"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Disagree</label>
                                    </div>

                                    <div className='mb-3 mt-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="informed_decision_agreement"
                                            value="Neither agree nor disagree"
                                            checked={postPurchaseFormData.informed_decision_agreement === "Neither agree nor disagree"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Neither agree nor disagree</label>
                                    </div>

                                    <div className='mb-3 mt-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="informed_decision_agreement"
                                            value="Agree"
                                            checked={postPurchaseFormData.informed_decision_agreement === "Agree"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Agree</label>
                                    </div>

                                    <div className=' d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="informed_decision_agreement"
                                            value="Strongly agree"
                                            checked={postPurchaseFormData.informed_decision_agreement === "Strongly agree"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Strongly agree</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 mt-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>
                                        How much do you agree or disagree with this statement: I was able to use my preferred payment method.
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
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Strongly disagree</label>
                                    </div>

                                    <div className='mb-3 mt-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="payment_method_agreement"
                                            value="Disagree"
                                            checked={postPurchaseFormData.payment_method_agreement === "Disagree"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Disagree</label>
                                    </div>

                                    <div className='mb-3 mt-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="payment_method_agreement"
                                            value="Neither agree nor disagree"
                                            checked={postPurchaseFormData.payment_method_agreement === "Neither agree nor disagree"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Neither agree nor disagree</label>
                                    </div>

                                    <div className='mb-3 mt-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="payment_method_agreement"
                                            value="Agree"
                                            checked={postPurchaseFormData.payment_method_agreement === "Agree"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Agree</label>
                                    </div>

                                    <div className=' d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="payment_method_agreement"
                                            value="Strongly agree"
                                            checked={postPurchaseFormData.payment_method_agreement === "Strongly agree"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Strongly agree</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 mt-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>
                                        How much do you agree or disagree with this statement: It was easy to understand the total cost.
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
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Strongly disagree</label>
                                    </div>

                                    <div className='mb-3 mt-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="total_cost_agreement"
                                            value="Disagree"
                                            checked={postPurchaseFormData.total_cost_agreement === "Disagree"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Disagree</label>
                                    </div>

                                    <div className='mb-3 mt-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="total_cost_agreement"
                                            value="Neither agree nor disagree"
                                            checked={postPurchaseFormData.total_cost_agreement === "Neither agree nor disagree"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Neither agree nor disagree</label>
                                    </div>

                                    <div className='mb-3 mt-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="total_cost_agreement"
                                            value="Agree"
                                            checked={postPurchaseFormData.total_cost_agreement === "Agree"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Agree</label>
                                    </div>

                                    <div className=' d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="total_cost_agreement"
                                            value="Strongly agree"
                                            checked={postPurchaseFormData.total_cost_agreement === "Strongly agree"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Strongly agree</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 mt-2 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>
                                        How much do you agree or disagree with this statement: the terms of my purchase were clear.
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
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Strongly disagree</label>
                                    </div>

                                    <div className='mb-3  d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="purchase_agreement"
                                            value="Disagree"
                                            checked={postPurchaseFormData.purchase_agreement === "Disagree"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Disagree</label>
                                    </div>

                                    <div className='mb-3  d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="purchase_agreement"
                                            value="Neither agree nor disagree"
                                            checked={postPurchaseFormData.purchase_agreement === "Neither agree nor disagree"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Neither agree nor disagree</label>
                                    </div>

                                    <div className='mb-3  d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="purchase_agreement"
                                            value="Agree"
                                            checked={postPurchaseFormData.purchase_agreement === "Agree"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Agree</label>
                                    </div>

                                    <div className=' d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="purchase_agreement"
                                            value="Strongly agree"
                                            checked={postPurchaseFormData.purchase_agreement === "Strongly agree"}
                                            onChange={handleChangePostPurchase}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Strongly agree</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mt-2 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>
                                        What could we do to make the purchase process better for you?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mt-4 d-flex'>
                                        <input
                                            type="text"
                                            className='me-2 question-concerns form-control'
                                            name="purchase_process"
                                            value={postPurchaseFormData.purchase_process}
                                            onChange={handleChangePostPurchase}
                                            placeholder='Your answer'
                                            disabled
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
        </LayoutAdmin>
    );
};

export default AdminViewSurvey;