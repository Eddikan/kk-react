import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import { TbMessageX } from "react-icons/tb";
import { IoCloseOutline } from "react-icons/io5";
import { useCookies } from 'react-cookie';
import { GoAlertFill } from "react-icons/go";
import GoBack from 'Components/Shared/GoBack';
import Layout from 'Components/Layout/Layout';
import 'Assets/styles/Survey/style.css';
import toast from 'react-hot-toast';
import axios from "axios";

const initialGeneralSurvey = Object.freeze({
    most_like: '',
    least_like: '',
    reason: '',
    website_suitability_rate: '',
    easy_of_use: '',
    time_expectation: '',
    visual_appeal_rate: '',
    information_clarity_rate: '',
    information_trust_level: '',
    recommendation_score: '',
    comment: '',
});

const WebsiteFeedBackSurvey = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const userDetails = cookies.userDetails;
    const [clearFormModal, setClearFormModal] = useState(false);
    const [generalFeedBackFormData, setGeneralFeedBackFormData] = useState(initialGeneralSurvey);
    const [reloadCount, setReloadCount] = useState(0);
    const [formStatus, setFormStatus] = useState('standby');
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState(false);


    const postWebsiteSurvey = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'general-feedback-survey', data);
    };

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    const toggleEmptyField = () => {
        setGeneralFeedBackFormData(initialGeneralSurvey);
    }

    const handleChangeGeneralFeeback = (e) => {
        const { name, value } = e.target;
        setGeneralFeedBackFormData({
            ...generalFeedBackFormData,
            [name]: value,
        });
    };

    function toggleClearFormModal() {
        setClearFormModal(true);
    }

    const websiteSurveySubmit = (e) => {
        if (generalFeedBackFormData.most_like == '' ||
            generalFeedBackFormData.least_like == '' ||
            generalFeedBackFormData.reason == '' ||
            generalFeedBackFormData.website_suitability_rate == '' ||
            generalFeedBackFormData.easy_of_use == '' ||
            generalFeedBackFormData.time_expectation == '' ||
            generalFeedBackFormData.visual_appeal_rate == '' ||
            generalFeedBackFormData.information_clarity_rate == '' ||
            generalFeedBackFormData.information_trust_level == '' ||
            generalFeedBackFormData.recommendation_score == '' ||
            generalFeedBackFormData.comment == ''
        ) {
            toast.error('Please answer all the question!');
        } else {
            setFormStatus('loading');
            postWebsiteSurvey({ ...generalFeedBackFormData, user_id: currentUser }).then(response => {
                const status = response.data.status;
                if (status === "Success") {
                    setFormStatus('standby');
                    setGeneralFeedBackFormData(initialGeneralSurvey);
                    toast.success('General Survey sent successfully!');
                } else {
                    setFormStatus('standby');
                    toast.error('There has been an error saving the survey, please try again!');
                }
            }).catch(() => {
                toast.error('There has been an error saving the survey, please try again!');
            });
        }
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
                                    <div className='fs-30 mb-4 rufina-family'>Website Feedback Survey (General)</div>
                                    <div className='fs-15'>We would love to hear your thoughts or feedback on how we can improve your experience!</div>
                                </Card.Body>
                                <hr className='mb-0 mt-0' />
                                <Card.Body>
                                    <div className='d-flex'>
                                        <div className='fs-15 fw-600 me-2 email-survey'>{userDetails.email}</div>
                                        {/* <div className='fs-15 switch-account'>Switch account</div> */}
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
                                    <div>Click on the image to indicate what section of  the page you like the most? (Feature picture of KK homepage with clickable image/text)
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="text"
                                            className='me-2 question-concerns form-control'
                                            name="most_like"
                                            value={generalFeedBackFormData.most_like}
                                            onChange={handleChangeGeneralFeeback}
                                            placeholder='Your answer'
                                        />
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>Click on the image to indicate what section of  the page you like the least? (Feature picture of KK homepage with clickable image/text)
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="text"
                                            className='me-2 question-concerns form-control'
                                            name="least_like"
                                            value={generalFeedBackFormData.least_like}
                                            onChange={handleChangeGeneralFeeback}
                                            placeholder='Your answer'
                                        />
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>Please state your reason for the selection above
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="text"
                                            className='me-2 question-concerns form-control'
                                            name="reason"
                                            value={generalFeedBackFormData.reason}
                                            onChange={handleChangeGeneralFeeback}
                                            placeholder='Your answer'
                                        />
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>Overall, how well does our website/app meet your needs?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="website_suitability_rate"
                                            value="Excellent well"
                                            checked={generalFeedBackFormData.website_suitability_rate === "Excellent well"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Extremely well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="website_suitability_rate"
                                            value="Very well"
                                            checked={generalFeedBackFormData.website_suitability_rate === "Very well"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Very well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="website_suitability_rate"
                                            value="Somewhat well"
                                            checked={generalFeedBackFormData.website_suitability_rate === "Somewhat well"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Somewhat well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="website_suitability_rate"
                                            value="Not do well"
                                            checked={generalFeedBackFormData.website_suitability_rate === "Not do well"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Not do well</label>
                                    </div>

                                    <div className='d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="website_suitability_rate"
                                            value="Not at all well"
                                            checked={generalFeedBackFormData.website_suitability_rate === "Not at all well"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Not at all well</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How easy was it to find what you were looking for on our website/app?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="easy_of_use"
                                            value="Extremely well"
                                            checked={generalFeedBackFormData.easy_of_use === "Extremely well"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Extremely well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="easy_of_use"
                                            value="Very well"
                                            checked={generalFeedBackFormData.easy_of_use === "Very well"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Very well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="easy_of_use"
                                            value="Somewhat well"
                                            checked={generalFeedBackFormData.easy_of_use === "Somewhat well"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Somewhat well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="easy_of_use"
                                            value="Not do well"
                                            checked={generalFeedBackFormData.easy_of_use === "Not do well"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Not do well</label>
                                    </div>

                                    <div className='d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="easy_of_use"
                                            value="Not at all well"
                                            checked={generalFeedBackFormData.easy_of_use === "Not at all well"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Not at all well</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>Did it take you more or less time than you expected to find what you were looking for on our website.
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="time_expectation"
                                            value="A lot less time"
                                            checked={generalFeedBackFormData.time_expectation === "A lot less time"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>A lot less time</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="time_expectation"
                                            value="A little less time"
                                            checked={generalFeedBackFormData.time_expectation === "A little less time"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>A little less time</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="time_expectation"
                                            value="About what I expected"
                                            checked={generalFeedBackFormData.time_expectation === "About what I expected"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>About what I expected</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="time_expectation"
                                            value="A little more time"
                                            checked={generalFeedBackFormData.time_expectation === "A little more time"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>A little more time</label>
                                    </div>

                                    <div className='d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="time_expectation"
                                            value="A lot more time"
                                            checked={generalFeedBackFormData.time_expectation === "A lot more time"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>A lot more time</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How visually appealing is our website/app?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="visual_appeal_rate"
                                            value="Extremely appealing"
                                            checked={generalFeedBackFormData.visual_appeal_rate === "Extremely appealing"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Extremely appealing</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="visual_appeal_rate"
                                            value="Very appealing"
                                            checked={generalFeedBackFormData.visual_appeal_rate === "Very appealing"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Very appealing</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="visual_appeal_rate"
                                            value="Somewhat appealing"
                                            checked={generalFeedBackFormData.visual_appeal_rate === "Somewhat appealing"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Somewhat appealing</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="visual_appeal_rate"
                                            value="Not so appealing"
                                            checked={generalFeedBackFormData.visual_appeal_rate === "Not so appealing"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Not so appealing</label>
                                    </div>

                                    <div className='d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="visual_appeal_rate"
                                            value="Not at all appealing"
                                            checked={generalFeedBackFormData.visual_appeal_rate === "Not at all appealing"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Not at all appealing</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How easy is it to understand the information on our website/app?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_clarity_rate"
                                            value="Extremely easy"
                                            checked={generalFeedBackFormData.information_clarity_rate === "Extremely easy"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Extremely easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_clarity_rate"
                                            value="Very easy"
                                            checked={generalFeedBackFormData.information_clarity_rate === "Very easy"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Very easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_clarity_rate"
                                            value="Somewhat easy"
                                            checked={generalFeedBackFormData.information_clarity_rate === "Somewhat easy"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Somewhat easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_clarity_rate"
                                            value="Not so easy"
                                            checked={generalFeedBackFormData.information_clarity_rate === "Not so easy"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Not so easy</label>
                                    </div>

                                    <div className='d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_clarity_rate"
                                            value="Not at all easy"
                                            checked={generalFeedBackFormData.information_clarity_rate === "Not at all easy"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Not at all easy</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How much do you trust the information on our website/app?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_trust_level"
                                            value="Extremely easy"
                                            checked={generalFeedBackFormData.information_trust_level === "Extremely easy"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>A great deal</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_trust_level"
                                            value="A lot"
                                            checked={generalFeedBackFormData.information_trust_level === "A lot"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>A lot</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_trust_level"
                                            value="A moderate amount"
                                            checked={generalFeedBackFormData.information_trust_level === "A moderate amount"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>A moderate amount</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_trust_level"
                                            value="A little"
                                            checked={generalFeedBackFormData.information_trust_level === "A little"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>A little</label>
                                    </div>

                                    <div className='d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_trust_level"
                                            value="Not at all"
                                            checked={generalFeedBackFormData.information_trust_level === "Not at all"}
                                            onChange={handleChangeGeneralFeeback}
                                        />
                                        <label className='ms-1 fs-15'>Not at all</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How likely is it that  you would recommend our website to a friend, family or colleague?
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
                                                name="recommendation_score"
                                                value="1"
                                                checked={generalFeedBackFormData.recommendation_score === "1"}
                                                onChange={handleChangeGeneralFeeback}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>2</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="recommendation_score"
                                                value="2"
                                                checked={generalFeedBackFormData.recommendation_score === "2"}
                                                onChange={handleChangeGeneralFeeback}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>3</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="recommendation_score"
                                                value="3"
                                                checked={generalFeedBackFormData.recommendation_score === "3"}
                                                onChange={handleChangeGeneralFeeback}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>4</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="recommendation_score"
                                                value="4"
                                                checked={generalFeedBackFormData.recommendation_score === "4"}
                                                onChange={handleChangeGeneralFeeback}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>5</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="recommendation_score"
                                                value="5"
                                                checked={generalFeedBackFormData.recommendation_score === "5"}
                                                onChange={handleChangeGeneralFeeback}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>6</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="recommendation_score"
                                                value="6"
                                                checked={generalFeedBackFormData.recommendation_score === "6"}
                                                onChange={handleChangeGeneralFeeback}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>7</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="recommendation_score"
                                                value="7"
                                                checked={generalFeedBackFormData.recommendation_score === "7"}
                                                onChange={handleChangeGeneralFeeback}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>8</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="recommendation_score"
                                                value="8"
                                                checked={generalFeedBackFormData.recommendation_score === "8"}
                                                onChange={handleChangeGeneralFeeback}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>9</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="recommendation_score"
                                                value="9"
                                                checked={generalFeedBackFormData.recommendation_score === "9"}
                                                onChange={handleChangeGeneralFeeback}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>10</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="recommendation_score"
                                                value="10"
                                                checked={generalFeedBackFormData.recommendation_score === "10"}
                                                onChange={handleChangeGeneralFeeback}
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
                                    <div>Do you have any other comments about how we can improve our website/app to improve your experience?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="text"
                                            className='me-2 question-concerns form-control'
                                            name="comment"
                                            value={generalFeedBackFormData.comment}
                                            onChange={handleChangeGeneralFeeback}
                                            placeholder='Your answer' />
                                    </div>
                                </Card.Body>
                            </Card>

                            <Row>
                                <Col lg="12" className='text-right mt-3'>
                                    <button
                                        className="btn border-black bg-white text-black me-3 btn-style"
                                        onClick={toggleClearFormModal}
                                        type="button"
                                    >
                                        Clear form
                                    </button>

                                    <button
                                        className='btn btn-primary btn-style'
                                        type="submit"
                                        onClick={websiteSurveySubmit}
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
            </section>
        </Layout>
    );
};

export default WebsiteFeedBackSurvey;