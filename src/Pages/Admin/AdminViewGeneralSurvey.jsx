import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import LayoutAdmin from 'Components/Layout/LayoutAdmin';
import GoBack from 'Components/Shared/GoBack';
import 'Assets/styles/Survey/style.css';
import toast from 'react-hot-toast';
import axios from "axios";
import Section1 from 'Assets/images/image-section-1.png';
import Section2 from 'Assets/images/image-section-2.png';
import Section3 from 'Assets/images/image-section-3.png';
import Section4 from 'Assets/images/image-section-4.png';

const initialGeneralSurvey = Object.freeze({
    most_like: '',
    least_like: '',
    reason: '',
    website_suitability_rate: '',
    ease_of_use: '',
    time_expectation: '',
    visual_appeal_rate: '',
    information_clarity_rate: '',
    information_trust_level: '',
    recommendation_score: '',
    comment: '',
});

const homePageImages =
    [
        { "id": 1, "name": "Categories", "image": Section1 },
        { "id": 2, "name": "Fabrics", "image": Section2 },
        { "id": 3, "name": "Eco-friendly", "image": Section3 },
        { "id": 4, "name": "Designs", "image": Section4 }
    ]

const AdminViewGeneralSurvey = (props) => {
    const { surveyId } = useParams();
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const userRole = cookies.userRole;
    const currentUser = cookies.currentUser;
    const [generalFeedBackFormData, setGeneralFeedBackFormData] = useState(initialGeneralSurvey);
    const [reloadCount, setReloadCount] = useState(0);

    const [generalFeedback, setGeneralFeedback] = useState([]);
    const [generalFeedbackLoading, setGeneralFeedbackLoading] = useState(true);
    const [surveyUser, setSurveyUser] = useState('');
    const navigate = useNavigate();

    const getGeneralFeedBack = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'general-feedback-survey/' + surveyId);
    };

    const handleChangeGeneralFeeback = (e) => {
        const { name, value } = e.target;
        setGeneralFeedBackFormData({
            ...generalFeedBackFormData,
            [name]: value,
        });
    };

    useEffect(() => {
        if (userRole !== 'Admin') {
            navigate('/')
        }
        if (currentUser) {
            getGeneralFeedBack()
                .then((response) => {
                    setGeneralFeedbackLoading(false);
                    const selectedGeneralSurvey = response.data.data;
                    if (selectedGeneralSurvey) {
                        setGeneralFeedback(selectedGeneralSurvey);
                        setGeneralFeedBackFormData(selectedGeneralSurvey);
                        if (selectedGeneralSurvey.user) {
                            setSurveyUser(selectedGeneralSurvey.user);
                        }
                    } else {
                        toast.error('There has been an error getting the surveys, please try again!');
                        setGeneralFeedbackLoading(false);
                    }
                })
                .catch((error) => {
                    toast.error('There has been an error getting the surveys, please try again!');
                    setGeneralFeedbackLoading(false);
                });
        }
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
                            <Card className='mt-3 mb-3 bordered-top-primary-survey'>
                                <Card.Body>
                                    <div className='fs-30 mb-4 rufina-family'>Website Feedback Survey</div>
                                    <div className='fs-15'>We would love to hear your thoughts or feedback on how we can improve your experience!</div>
                                </Card.Body>
                                <hr className='mb-0 mt-0' />

                                <Card.Body>
                                    <div className='fs-14 indicate-question '>* Indicates required question</div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>
                                        Click on the image to indicate what section of  the page you like the most?
                                        <span className='asteris ms-1'>*</span>
                                    </div>

                                    <Row className="designs-row mt-3">
                                        {homePageImages.map((image, index) => {
                                            return (
                                                <>
                                                    {image.id == generalFeedBackFormData.most_like &&
                                                        <>
                                                            <Col className="designs-grid" lg={6}>
                                                                <label className="radio-img">
                                                                    <input
                                                                        type="radio"
                                                                        name="most_like"
                                                                    />
                                                                    <div className="portfolio-link border-survey">
                                                                        <div className="designs-grid-div-survey w-100">
                                                                            <img src={image.image} className='home-page-images' />
                                                                        </div>
                                                                    </div>
                                                                    <div className='mt-2 fs-18 text-center'>{image.name}</div>
                                                                </label>
                                                            </Col >
                                                        </>
                                                    }
                                                </>
                                            )
                                        })}
                                    </Row>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>
                                        Click on the image to indicate what section of  the page you like the least?
                                        <span className='asteris ms-1'>*</span>
                                    </div>

                                    <Row className="designs-row mt-3">
                                        {homePageImages.map((image, index) => {
                                            return (
                                                <>
                                                    {image.id == generalFeedBackFormData.least_like &&
                                                        <>
                                                            <Col className="designs-grid" lg={6}>
                                                                <label className="radio-img">
                                                                    <input
                                                                        type="radio"
                                                                        name="least_like"
                                                                    />
                                                                    <div className="portfolio-link border-survey">
                                                                        <div className="designs-grid-div-survey w-100">
                                                                            <img src={image.image} className='home-page-images' />
                                                                        </div>
                                                                    </div>
                                                                    <div className='mt-2 fs-18 text-center'>{image.name}</div>
                                                                </label>
                                                            </Col >
                                                        </>
                                                    }
                                                </>
                                            )
                                        })}
                                    </Row>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>
                                        Please state your reason for the selection above
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mt-4 d-flex'>
                                        <input
                                            type="text"
                                            className='me-2 question-concerns form-control'
                                            name="reason"
                                            value={generalFeedBackFormData.reason}
                                            onChange={handleChangeGeneralFeeback}
                                            placeholder='Your answer'
                                            disabled
                                        />
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>
                                        Overall, how well does our website/app meet your needs?
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
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Extremely well</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="website_suitability_rate"
                                            value="Very well"
                                            checked={generalFeedBackFormData.website_suitability_rate === "Very well"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Very well</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="website_suitability_rate"
                                            value="Somewhat well"
                                            checked={generalFeedBackFormData.website_suitability_rate === "Somewhat well"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Somewhat well</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="website_suitability_rate"
                                            value="Not do well"
                                            checked={generalFeedBackFormData.website_suitability_rate === "Not do well"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Not do well</label>
                                    </div>

                                    <div className='mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="website_suitability_rate"
                                            value="Not at all well"
                                            checked={generalFeedBackFormData.website_suitability_rate === "Not at all well"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Not at all well</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>
                                        How easy was it to find what you were looking for on our website/app?
                                        <span className='asteris ms-1'>*</span>
                                    </div>

                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="ease_of_use"
                                            value="Extremely well"
                                            checked={generalFeedBackFormData.ease_of_use === "Extremely well"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Extremely well</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="ease_of_use"
                                            value="Very well"
                                            checked={generalFeedBackFormData.ease_of_use === "Very well"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Very well</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="ease_of_use"
                                            value="Somewhat well"
                                            checked={generalFeedBackFormData.ease_of_use === "Somewhat well"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Somewhat well</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="ease_of_use"
                                            value="Not do well"
                                            checked={generalFeedBackFormData.ease_of_use === "Not do well"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Not do well</label>
                                    </div>

                                    <div className='mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="ease_of_use"
                                            value="Not at all well"
                                            checked={generalFeedBackFormData.ease_of_use === "Not at all well"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Not at all well</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>
                                        Did it take you more or less time than you expected to find what you were looking for on our website.
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
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>A lot less time</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="time_expectation"
                                            value="A little less time"
                                            checked={generalFeedBackFormData.time_expectation === "A little less time"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>A little less time</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="time_expectation"
                                            value="About what I expected"
                                            checked={generalFeedBackFormData.time_expectation === "About what I expected"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>About what I expected</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="time_expectation"
                                            value="A little more time"
                                            checked={generalFeedBackFormData.time_expectation === "A little more time"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>A little more time</label>
                                    </div>

                                    <div className='mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="time_expectation"
                                            value="A lot more time"
                                            checked={generalFeedBackFormData.time_expectation === "A lot more time"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>A lot more time</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>
                                        How visually appealing is our website/app?
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
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Extremely appealing</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="visual_appeal_rate"
                                            value="Very appealing"
                                            checked={generalFeedBackFormData.visual_appeal_rate === "Very appealing"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Very appealing</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="visual_appeal_rate"
                                            value="Somewhat appealing"
                                            checked={generalFeedBackFormData.visual_appeal_rate === "Somewhat appealing"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Somewhat appealing</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="visual_appeal_rate"
                                            value="Not so appealing"
                                            checked={generalFeedBackFormData.visual_appeal_rate === "Not so appealing"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Not so appealing</label>
                                    </div>

                                    <div className='mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="visual_appeal_rate"
                                            value="Not at all appealing"
                                            checked={generalFeedBackFormData.visual_appeal_rate === "Not at all appealing"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Not at all appealing</label>
                                    </div>

                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>
                                        How easy is it to understand the information on our website/app?
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
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Extremely easy</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_clarity_rate"
                                            value="Very easy"
                                            checked={generalFeedBackFormData.information_clarity_rate === "Very easy"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Very easy</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_clarity_rate"
                                            value="Somewhat easy"
                                            checked={generalFeedBackFormData.information_clarity_rate === "Somewhat easy"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Somewhat easy</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_clarity_rate"
                                            value="Not so easy"
                                            checked={generalFeedBackFormData.information_clarity_rate === "Not so easy"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Not so easy</label>
                                    </div>

                                    <div className='mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_clarity_rate"
                                            value="Not at all easy"
                                            checked={generalFeedBackFormData.information_clarity_rate === "Not at all easy"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Not at all easy</label>
                                    </div>

                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>
                                        How much do you trust the information on our website/app?
                                        <span className='asteris ms-1'>*</span>
                                    </div>

                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_trust_level"
                                            value="A great deal"
                                            checked={generalFeedBackFormData.information_trust_level === "A great deal"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>A great deal</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_trust_level"
                                            value="A lot"
                                            checked={generalFeedBackFormData.information_trust_level === "A lot"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>A lot</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_trust_level"
                                            value="A moderate amount"
                                            checked={generalFeedBackFormData.information_trust_level === "A moderate amount"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>A moderate amount</label>
                                    </div>

                                    <div className='mb-3 mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_trust_level"
                                            value="A little"
                                            checked={generalFeedBackFormData.information_trust_level === "A little"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>A little</label>
                                    </div>

                                    <div className='mt-2 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_trust_level"
                                            value="Not at all"
                                            checked={generalFeedBackFormData.information_trust_level === "Not at all"}
                                            onChange={handleChangeGeneralFeeback}
                                            disabled
                                        />
                                        <label className='ms-1 fs-15'>Not at all</label>
                                    </div>

                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>
                                        How likely is it that  you would recommend our website to a friend, family or colleague?
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
                                                disabled
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
                                                disabled
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
                                                disabled
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
                                                disabled
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
                                                disabled
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
                                                disabled
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
                                                disabled
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
                                                disabled
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
                                                disabled
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
                                                disabled
                                            />
                                        </div>
                                        <div className='d-flex justify-content-center align-items-end ms-2'>
                                            Extremely Likely
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>
                                        Do you have any other comments about how we can improve our website/app to improve your experience?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mt-4 d-flex'>
                                        <input
                                            type="text"
                                            className='me-2 question-concerns form-control'
                                            name="comment"
                                            value={generalFeedBackFormData.comment}
                                            onChange={handleChangeGeneralFeeback}
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

export default AdminViewGeneralSurvey;