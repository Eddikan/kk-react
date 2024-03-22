import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import { IoCloseOutline } from "react-icons/io5";
import { TbMessageX } from "react-icons/tb";
import { GoAlertFill } from "react-icons/go";
import GoBack from 'Components/Shared/GoBack';
import 'Assets/styles/Survey/style.css';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import axios from "axios";

const initialCustomerSurvey = Object.freeze({
    likelihood_to_recommend: '',
    satisfaction: '',
    product_fit_for_needs: '',
    product_quality_rating: '',
    value_for_money_rating: '',
    responsiveness_rating: '',
    customer_tenure: '',
    likelihood_to_reuse: '',
    concern: '',
    qualities: [],
});

const initialDescribeServiceSurvey = Object.freeze({
    reliable: '',
    high_quality: '',
    useful: '',
    unique: '',
    good_value_for_money: '',
    impractical: '',
    ineffective: '',
    poor_quality: '',
    unreliable: '',
});


const CustomerSatisfaction = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const userDetails = cookies.userDetails;
    const [clearFormModal, setClearFormModal] = useState(false);
    const [customerFormData, setCustomerForData] = useState(initialCustomerSurvey);
    const [describeServiceFormData, setDescribeServiceFormData] = useState(initialDescribeServiceSurvey);
    const [reloadCount, setReloadCount] = useState(0);
    const [formStatus, setFormStatus] = useState('standby');
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');


    const postCustomerSurvey = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + '/#', data);
    };

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    const toggleEmptyField = () => {
        setCustomerForData(initialCustomerSurvey);
        setDescribeServiceFormData(initialDescribeServiceSurvey);
    }

    const handleChangeCustomer = (e) => {
        const { name, value } = e.target;
        setCustomerForData({
            ...customerFormData,
            [name]: value,
        });
    };

    // const handleChangeDescribeService = (e) => {
    //     const { name, value } = e.target;
    //     setDescribeServiceFormData({
    //         ...describeServiceFormData,
    //         [name]: value,
    //     });
    // };

    const handleChangeDescribeService = (e) => {
        const { name, checked } = e.target;
        setDescribeServiceFormData(prevState => ({
            ...prevState,
            [name]: checked,
        }));
    };


    function toggleClearFormModal() {
        setClearFormModal(true);
    }

    const customerSurveySubmit = (e) => {
        setFormStatus('loading');
        postCustomerSurvey({ ...customerFormData, qualities: describeServiceFormData }).then(response => {
            const status = response.data.status;
            if (status === "Success") {
                setFormStatus('standby');
                setReloadCount(reloadCount + 1);
                setCustomerForData(initialCustomerSurvey);
                toast.success('Customer Survey sent successfully!');
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
                        <Col lg={11}>
                        </Col>

                        <Col md={1} className="text-right">
                            <GoBack fallBack="/#" />
                        </Col>

                        <Col>
                            <Card className='mt-3 mb-3 bordered-top-primary-survey'>
                                <Card.Body>
                                    <div className='fs-30 mb-4 rufina-family'>Customer Satisfaction Feedback</div>
                                    <div className='fs-15'>We would love to hear your thoughts or feedback on how we can improve your experience!</div>
                                </Card.Body>
                                <hr className='mb-0 mt-0' />
                                <Card.Body>
                                    <div className='d-flex'>
                                        <div className='fs-15 fw-600 me-2 email-survey'>{userDetails.email}</div>
                                    </div>
                                    <div className='mt-2'><TbMessageX className='me-2' size={20} color='#5f6368' />
                                        <span className='not-shared fs-14'>Not shared</span>
                                    </div>
                                </Card.Body>
                                <hr className='mb-0 mt-0' />
                                <Card.Body>
                                    <div className='indicate-question '>* Indicates required question</div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How likely is it that you would recommend Kouture Konect to a friend, family or colleague?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='d-flex mt-4'>
                                        <div className='d-flex justify-content-center align-items-end me-3'>
                                            Not at all Likely
                                        </div>
                                        <div>
                                            <span className='ms-1'>1</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="likelihood_to_recommend"
                                                value="1"
                                                checked={customerFormData.likelihood_to_recommend === "1"}
                                                onChange={handleChangeCustomer}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>2</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="likelihood_to_recommend"
                                                value="2"
                                                checked={customerFormData.likelihood_to_recommend === "2"}
                                                onChange={handleChangeCustomer}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>3</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="likelihood_to_recommend"
                                                value="3"
                                                checked={customerFormData.likelihood_to_recommend === "3"}
                                                onChange={handleChangeCustomer}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>4</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="likelihood_to_recommend"
                                                value="4"
                                                checked={customerFormData.likelihood_to_recommend === "4"}
                                                onChange={handleChangeCustomer}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>5</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="likelihood_to_recommend"
                                                value="5"
                                                checked={customerFormData.likelihood_to_recommend === "5"}
                                                onChange={handleChangeCustomer}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>6</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="likelihood_to_recommend"
                                                value="6"
                                                checked={customerFormData.likelihood_to_recommend === "6"}
                                                onChange={handleChangeCustomer}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>7</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="likelihood_to_recommend"
                                                value="7"
                                                checked={customerFormData.likelihood_to_recommend === "7"}
                                                onChange={handleChangeCustomer}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>8</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="likelihood_to_recommend"
                                                value="8"
                                                checked={customerFormData.likelihood_to_recommend === "8"}
                                                onChange={handleChangeCustomer}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>9</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="likelihood_to_recommend"
                                                value="9"
                                                checked={customerFormData.likelihood_to_recommend === "9"}
                                                onChange={handleChangeCustomer}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>10</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="likelihood_to_recommend"
                                                value="10"
                                                checked={customerFormData.likelihood_to_recommend === "10"}
                                                onChange={handleChangeCustomer}
                                            />
                                        </div>

                                        <div className='d-flex justify-content-center align-items-end ms-2'>
                                            Extremely Likely
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>Overall, how satisfied or dissatisfied are you with our company?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="satisfaction"
                                            value="Very satisfied"
                                            checked={customerFormData.satisfaction === "Very satisfied"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15' htmlFor="Very satisfied">Very satisfied</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="satisfaction"
                                            value="Somewhat satisfied"
                                            checked={customerFormData.satisfaction === "Somewhat satisfied"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15' for="Somewhat satisfied"> Somewhat satisfied</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="satisfaction"
                                            value="Neither satisfied nor dissatisfied"
                                            checked={customerFormData.satisfaction === "Neither satisfied nor dissatisfied"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Neither satisfied nor dissatisfied</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="satisfaction"
                                            value="Somewhat dissatisfied"
                                            checked={customerFormData.satisfaction === "Somewhat dissatisfied"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Somewhat dissatisfied</label>
                                    </div>

                                    <div className='d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="satisfaction"
                                            value="Very dissatisfied"
                                            checked={customerFormData.satisfaction === "Very dissatisfied"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Very dissatisfied</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>Which of the following words would you use to describe our service? Select all that apply?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="checkbox"
                                            className='me-2 checkbox-size'
                                            name="reliable"
                                            value="Reliable"
                                            checked={describeServiceFormData.reliable}
                                            onChange={handleChangeDescribeService}
                                        />
                                        <label className='ms-1 fs-15'>Reliable</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="checkbox"
                                            className='me-2 checkbox-size'
                                            name="high_quality"
                                            value="High quality"
                                            checked={describeServiceFormData.high_quality}
                                            onChange={handleChangeDescribeService}
                                        />
                                        <label className='ms-1 fs-15'>High quality</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="checkbox"
                                            className='me-2 checkbox-size'
                                            name="useful"
                                            value="Useful"
                                            checked={describeServiceFormData.useful}
                                            onChange={handleChangeDescribeService}
                                        />
                                        <label className='ms-1 fs-15'>Useful</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="checkbox"
                                            className='me-2 checkbox-size'
                                            name="unique"
                                            value="Unique"
                                            checked={describeServiceFormData.unique}
                                            onChange={handleChangeDescribeService}
                                        />
                                        <label className='ms-1 fs-15'>Unique</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="checkbox"
                                            className='me-2 checkbox-size'
                                            name="good_value_for_money"
                                            value="Good value for money"
                                            checked={describeServiceFormData.good_value_for_money}
                                            onChange={handleChangeDescribeService}
                                        />
                                        <label className='ms-1 fs-15'>Good value for money</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="checkbox"
                                            className='me-2 checkbox-size'
                                            name="impractical"
                                            value="Impractical"
                                            checked={describeServiceFormData.impractical}
                                            onChange={handleChangeDescribeService}
                                        />
                                        <label className='ms-1 fs-15'>Impractical</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="checkbox"
                                            className='me-2 checkbox-size'
                                            name="ineffective"
                                            value="Ineffective"
                                            checked={describeServiceFormData.ineffective}
                                            onChange={handleChangeDescribeService}
                                        />
                                        <label className='ms-1 fs-15'>Ineffective</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="checkbox"
                                            className='me-2 checkbox-size'
                                            name="poor_quality"
                                            value="Poor quality"
                                            checked={describeServiceFormData.poor_quality}
                                            onChange={handleChangeDescribeService}
                                        />
                                        <label className='ms-1 fs-15'>Poor quality</label>
                                    </div>

                                    <div className='d-flex'>
                                        <input
                                            type="checkbox"
                                            className='me-2 checkbox-size'
                                            name="unreliable"
                                            value="Unreliable"
                                            checked={describeServiceFormData.unreliable}
                                            onChange={handleChangeDescribeService}
                                        />
                                        <label className='ms-1 fs-15'>Unreliable</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How well did your product meet your needs?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="product_fit_for_needs"
                                            value="Extremely well"
                                            checked={customerFormData.product_fit_for_needs === "Extremely well"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Extremely well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="product_fit_for_needs"
                                            value="Very well"
                                            checked={customerFormData.product_fit_for_needs === "Very well"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Very well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="product_fit_for_needs"
                                            value="Somewhat well"
                                            checked={customerFormData.product_fit_for_needs === "Somewhat well"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Somewhat well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="product_fit_for_needs"
                                            value="Not so well"
                                            checked={customerFormData.product_fit_for_needs === "Not so well"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Not so well</label>
                                    </div>

                                    <div className='d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="product_fit_for_needs"
                                            value="Not at all well"
                                            checked={customerFormData.product_fit_for_needs === "Not at all well"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Not at all well</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How would you rate the quality of the product?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="product_quality_rating"
                                            value="Very high quality"
                                            checked={customerFormData.product_quality_rating === "Very high quality"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Very high quality</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="product_quality_rating"
                                            value="High quality"
                                            checked={customerFormData.product_quality_rating === "High quality"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>High quality</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="product_quality_rating"
                                            value="Neither high nor low quality"
                                            checked={customerFormData.product_quality_rating === "Neither high nor low quality"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Neither high nor low quality</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="product_quality_rating"
                                            value="Low quality"
                                            checked={customerFormData.product_quality_rating === "Low quality"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Low quality</label>
                                    </div>
                                    <div className='d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="product_quality_rating"
                                            value="Very low quality"
                                            checked={customerFormData.product_quality_rating === "Very low quality"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Very low quality</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How would you rate the value for money of the product?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="value_for_money_rating"
                                            value="Excellent"
                                            checked={customerFormData.value_for_money_rating === "Excellent"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Excellent</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="value_for_money_rating"
                                            value="Above average"
                                            checked={customerFormData.value_for_money_rating === "Above average"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Above average</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="value_for_money_rating"
                                            value="Average"
                                            checked={customerFormData.value_for_money_rating === "Average"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Average</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="value_for_money_rating"
                                            value="Below average"
                                            checked={customerFormData.value_for_money_rating === "Below average"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Below average</label>
                                    </div>

                                    <div className='d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="value_for_money_rating"
                                            value="Poor"
                                            checked={customerFormData.value_for_money_rating === "Poor"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Poor</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How would you rate our responsiveness to your questions/concerns?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="responsiveness_rating"
                                            value="Extremely responsive"
                                            checked={customerFormData.responsiveness_rating === "Extremely responsive"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Extremely responsive</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="responsiveness_rating"
                                            value="Very responsive"
                                            checked={customerFormData.responsiveness_rating === "Very responsive"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Very responsive</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="responsiveness_rating"
                                            value="Somewhat responsive"
                                            checked={customerFormData.responsiveness_rating === "Somewhat responsive"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Somewhat responsive</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="responsiveness_rating"
                                            value="Not so responsive"
                                            checked={customerFormData.responsiveness_rating === "Not so responsive"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Not so responsive</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="responsiveness_rating"
                                            value="Not at all responsive"
                                            checked={customerFormData.responsiveness_rating === "Not at all responsive"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Not at all responsive</label>
                                    </div>

                                    <div className='d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="responsiveness_rating"
                                            value="Not applicable"
                                            checked={customerFormData.responsiveness_rating === "Not applicable"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Not applicable</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How long have you been a Kouture Konect customer?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="customer_tenure"
                                            value="This is my first purchase"
                                            checked={customerFormData.customer_tenure === "This is my first purchase"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>This is my first purchase</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="customer_tenure"
                                            value="Less than six months"
                                            checked={customerFormData.customer_tenure === "Less than six months"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Less than six months</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="customer_tenure"
                                            value="Six months to a year"
                                            checked={customerFormData.customer_tenure === "Six months to a year"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Six months to a year</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="customer_tenure"
                                            value="1-2 years"
                                            checked={customerFormData.customer_tenure === "1-2 years"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>1-2 years</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="customer_tenure"
                                            value="3 or more years"
                                            checked={customerFormData.customer_tenure === "3 or more years"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>3 or more years</label>
                                    </div>

                                    <div className='d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="customer_tenure"
                                            value="I haven't made a purchase yet"
                                            checked={customerFormData.customer_tenure === "I haven't made a purchase yet"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>I haven't made a purchase yet</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How likely are you to use our service again?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="likelihood_to_reuse"
                                            value="Extremely likely"
                                            checked={customerFormData.likelihood_to_reuse === "Extremely likely"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Extremely likely</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="likelihood_to_reuse"
                                            value="Very likely"
                                            checked={customerFormData.likelihood_to_reuse === "Very likely"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Very likely</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="likelihood_to_reuse"
                                            value="Somewhat likely"
                                            checked={customerFormData.likelihood_to_reuse === "Somewhat likely"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Somewhat likely</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="likelihood_to_reuse"
                                            value="Not so likely"
                                            checked={customerFormData.likelihood_to_reuse === "Not so likely"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Not so likely</label>
                                    </div>

                                    <div className='d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="likelihood_to_reuse"
                                            value="Not at all likely"
                                            checked={customerFormData.likelihood_to_reuse === "Not at all likely"}
                                            onChange={handleChangeCustomer}
                                        />
                                        <label className='ms-1 fs-15'>Not at all likely</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>Do you have any other comments,  questions, or concerns?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="text"
                                            className='me-2 question-concerns form-control'
                                            name="concern"
                                            value={customerFormData.concern}
                                            onChange={handleChangeCustomer}
                                            placeholder='Your answer'
                                            required />
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
                                        onClick={() => toggleUnderConstruction('Submit')}
                                    // onClick={customerSurveySubmit}
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

                <Modal
                    show={underConstructionShow}
                    className='modal-preview'
                    fade={false}
                    centered
                    size="sm"
                    id="under-construction"
                >
                    <Modal.Header className="py-0">
                        <h5 className='modal-title text-uppercase text-left fs-22 mt-2'>{modalHeading}</h5>
                        <button
                            type='button'
                            className='close react-modal-close'
                            onClick={() => setUnderConstructionShow(false)}
                        >
                            <IoCloseOutline color="#7e7e7e" size={25} />
                        </button>
                    </Modal.Header>

                    <Modal.Body className='pt-2'>
                        <Card>
                            <Card.Body className="text-center py-5">
                                <GoAlertFill size="60px" className="mb-2 text-gold" />
                                <p className="fs-20 text-black">Under Construction</p>
                            </Card.Body>
                        </Card>
                    </Modal.Body>
                </Modal>
            </section >
        </Layout >

    );
};

export default CustomerSatisfaction;