import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from 'Components/Shared/AdminSidebar';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import { TbMessageX } from "react-icons/tb";
import { IoCloseOutline } from "react-icons/io5";
import { useCookies } from 'react-cookie';
import { GoAlertFill } from "react-icons/go";
import GoBack from 'Components/Shared/GoBack';
import 'Assets/styles/Survey/style.css';
import toast from 'react-hot-toast';
import axios from "axios";
import GetUserPortfolioData from 'Utils/GetUserPortfolioData';
import GetFabricsData from 'Utils/GetFabricsData';
import AboutImage from 'Assets/images/about.png';
import PortfolioImage from 'Assets/images/porfolio-profile.png';
import FabricsImage from 'Assets/images/fabrics-profile.png';
import CalendarImage from 'Assets/images/profile-calendar.png';
import Loading from "Components/Shared/Loading";

const initialVendorSurvey = Object.freeze({
    most_like: '',
    least_like: '',
    reason: '',
    website_suitability_rate: '',
    ease_of_use: '',
    time_expectation: '',
    visual_appeal_rate: '',
    information_clarity_rate: '',
    information_trust_level: '',
    listed_ease: '',
    communication_ease: '',
    information_gathering_ease: '',

    recommendation_score: '',
    comment: '',

});

const profileImages =
    [
        { "id": 1, "name": "About", "image": AboutImage },
        { "id": 2, "name": "Portfolio", "image": PortfolioImage },
        { "id": 3, "name": "Fabrics", "image": FabricsImage },
        { "id": 4, "name": "Calendar", "image": CalendarImage }
    ]

const VendorFeedBackSurvey = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const userDetails = cookies.userDetails;
    const [clearFormModal, setClearFormModal] = useState(false);
    const [vendorFormData, setVendorFormData] = useState(initialVendorSurvey);
    const [reloadCount, setReloadCount] = useState(0);
    const [formStatus, setFormStatus] = useState('standby');
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');

    const postVendorSurvey = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'vendor-feedback-survey', data);
    };

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    const toggleEmptyField = () => {
        setVendorFormData(initialVendorSurvey);
    }

    const handleChangeVendor = (e) => {
        const { name, value } = e.target;
        setVendorFormData({
            ...vendorFormData,
            [name]: value,
        });
    };

    function toggleClearFormModal() {
        setClearFormModal(true);
    }

    const vendorSurveySubmit = (e) => {
        if (vendorFormData.most_like == '' ||
            vendorFormData.least_like == '' ||
            vendorFormData.reason == '' ||
            vendorFormData.website_suitability_rate == '' ||
            vendorFormData.ease_of_use == '' ||
            vendorFormData.time_expectation == '' ||
            vendorFormData.visual_appeal_rate == '' ||
            vendorFormData.information_clarity_rate == '' ||
            vendorFormData.information_trust_level == '' ||
            vendorFormData.listed_ease == '' ||
            vendorFormData.communication_ease == '' ||
            vendorFormData.information_gathering_ease == '' ||
            vendorFormData.recommendation_score == '' ||
            vendorFormData.comment == ''
        ) {
            toast.error('Please answer all the question!');
        } else {
            setFormStatus('loading');
            postVendorSurvey({ ...vendorFormData, user_id: currentUser }).then(response => {
                const status = response.data.status;
                if (status === "Success") {
                    setFormStatus('standby');
                    setReloadCount(reloadCount + 1);
                    setVendorFormData(initialVendorSurvey);
                    toast.success('Vendor Survey sent successfully!');
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
                                    <div className='fs-30 mb-4 rufina-family'>Website Feedback Survey (Vendor)</div>
                                    <div className='fs-15'>We would love to hear your thoughts or feedback on how we can improve your experience!</div>
                                </Card.Body>
                                <hr className='mb-0 mt-0' />

                                <Card.Body>
                                    <div className='indicate-question '>* Indicates required question</div>
                                </Card.Body>
                            </Card>


                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4 pb-0'>
                                    <div>Click on the image to indicate what section of  the page you like the most?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <Row className="designs-row mt-4">
                                        {profileImages.map((image, index) => {
                                            return (
                                                <>
                                                    <Col className="designs-grid text-center" lg={6}>
                                                        <label class="radio-img">
                                                            <input
                                                                type="radio"
                                                                name="most_like"
                                                                value={image.id}
                                                                onChange={handleChangeVendor}
                                                            />
                                                            <div className="portfolio-link image mb-5">
                                                                <div className="designs-grid-div-survey w-100 cursor-pointer">
                                                                    <img src={image.image} className='home-page-images' />
                                                                </div>
                                                                <div className='mt-2 fs-16 text-center w-100 cursor-pointer position-absolute'>{image.name}</div>
                                                            </div>
                                                        </label>
                                                    </Col >
                                                </>
                                            )
                                        })}
                                    </Row>
                                </Card.Body>
                            </Card>



                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4 pb-0'>
                                    <div>Click on the image to indicate what section of  the page you like the least?
                                        <span className='asteris ms-1'>*</span>
                                    </div>

                                    <Row className="designs-row mt-4">
                                        {profileImages.map((image, index) => {
                                            return (
                                                <>
                                                    <Col className="designs-grid text-center" lg={6}>
                                                        <label class="radio-img">
                                                            <input
                                                                type="radio"
                                                                name="least_like"
                                                                value={image.id}
                                                                onChange={handleChangeVendor}
                                                            />
                                                            <div className="portfolio-link image mb-5">
                                                                <div className="designs-grid-div-survey w-100 cursor-pointer">
                                                                    <img src={image.image} className='home-page-images' />
                                                                </div>
                                                                <div className='mt-2 fs-16 text-center w-100 cursor-pointer position-absolute'>{image.name}</div>
                                                            </div>
                                                        </label>
                                                    </Col >
                                                </>
                                            )
                                        })}
                                    </Row>
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
                                            name='reason'
                                            value={vendorFormData.reason}
                                            onChange={handleChangeVendor}
                                            placeholder='Your answer'
                                            required
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
                                            value="Extremely well"
                                            checked={vendorFormData.website_suitability_rate === "Extremely well"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Extremely well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="website_suitability_rate"
                                            value="Very well"
                                            checked={vendorFormData.website_suitability_rate === "Very well"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Very well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="website_suitability_rate"
                                            value="Somewhat well"
                                            checked={vendorFormData.website_suitability_rate === "Somewhat well"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Somewhat well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="website_suitability_rate"
                                            value="Not do well"
                                            checked={vendorFormData.website_suitability_rate === "Not do well"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Not do well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="website_suitability_rate"
                                            value="Not at all well"
                                            checked={vendorFormData.website_suitability_rate === "Not at all well"}
                                            onChange={handleChangeVendor}
                                            required
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
                                            name="ease_of_use"
                                            value="Extremely well"
                                            checked={vendorFormData.ease_of_use === "Extremely well"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Extremely well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="ease_of_use"
                                            value="Very well"
                                            checked={vendorFormData.ease_of_use === "Very well"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Very well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="ease_of_use"
                                            value="Somewhat well"
                                            checked={vendorFormData.ease_of_use === "Somewhat well"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Somewhat well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="ease_of_use"
                                            value="Not do well"
                                            checked={vendorFormData.ease_of_use === "Not do well"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Not do well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="ease_of_use"
                                            value="Not at all well"
                                            checked={vendorFormData.ease_of_use === "Not at all well"}
                                            onChange={handleChangeVendor}
                                            required
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
                                            checked={vendorFormData.time_expectation === "A lot less time"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>A lot less time</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="time_expectation"
                                            value="A little less time"
                                            checked={vendorFormData.time_expectation === "A little less time"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>A little less time</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="time_expectation"
                                            value="About what I expected"
                                            checked={vendorFormData.time_expectation === "About what I expected"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>About what I expected</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="time_expectation"
                                            value="A little more time"
                                            checked={vendorFormData.time_expectation === "A little more time"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>A little more time</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="time_expectation"
                                            value="A lot more time"
                                            checked={vendorFormData.time_expectation === "A lot more time"}
                                            onChange={handleChangeVendor}
                                            required
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
                                            checked={vendorFormData.visual_appeal_rate === "Extremely appealing"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Extremely appealing</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="visual_appeal_rate"
                                            value="Very appealing"
                                            checked={vendorFormData.visual_appeal_rate === "Very appealing"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Very appealing</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="visual_appeal_rate"
                                            value="Somewhat appealing"
                                            checked={vendorFormData.visual_appeal_rate === "Somewhat appealing"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Somewhat appealing</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="visual_appeal_rate"
                                            value="Not so appealing"
                                            checked={vendorFormData.visual_appeal_rate === "Not so appealing"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Not so appealing</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="visual_appeal_rate"
                                            value="Not at all appealing"
                                            checked={vendorFormData.visual_appeal_rate === "Not at all appealing"}
                                            onChange={handleChangeVendor}
                                            required
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
                                            checked={vendorFormData.information_clarity_rate === "Extremely easy"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Extremely easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_clarity_rate"
                                            value="Very easy"
                                            checked={vendorFormData.information_clarity_rate === "Very easy"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Very easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_clarity_rate"
                                            value="Somewhat easy"
                                            checked={vendorFormData.information_clarity_rate === "Somewhat easy"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Somewhat easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_clarity_rate"
                                            value="Not so easy"
                                            checked={vendorFormData.information_clarity_rate === "Not so easy"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Not so easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_clarity_rate"
                                            value="Not at all easy"
                                            checked={vendorFormData.information_clarity_rate === "Not at all easy"}
                                            onChange={handleChangeVendor}
                                            required
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
                                            value="A great deal"
                                            checked={vendorFormData.information_trust_level === "A great deal"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>A great deal</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_trust_level"
                                            value="A lot"
                                            checked={vendorFormData.information_trust_level === "A lot"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>A lot</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_trust_level"
                                            value="A moderate amount"
                                            checked={vendorFormData.information_trust_level === "A moderate amount"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>A moderate amount</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_trust_level"
                                            value="A little"
                                            checked={vendorFormData.information_trust_level === "A little"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>A little</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_trust_level"
                                            value="Not at all"
                                            checked={vendorFormData.information_trust_level === "Not at all"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Not at all</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How easy was it to enter list your product/service on our website/app?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="listed_ease"
                                            value="Extremely easy"
                                            checked={vendorFormData.listed_ease === "Extremely easy"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Extremely easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="listed_ease"
                                            value="Very easy"
                                            checked={vendorFormData.listed_ease === "Very easy"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Very easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="listed_ease"
                                            value="Somewhat easy"
                                            checked={vendorFormData.listed_ease === "Somewhat easy"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Somewhat easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="listed_ease"
                                            value="Not so easy"
                                            checked={vendorFormData.listed_ease === "Not so easy"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Not so easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="listed_ease"
                                            value="Not at all easy"
                                            checked={vendorFormData.listed_ease === "Not at all easy"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Not at all easy</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How easy was it to communicate with the customer?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="communication_ease"
                                            value="Extremely easy"
                                            checked={vendorFormData.communication_ease === "Extremely easy"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Extremely easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="communication_ease"
                                            value="Very easy"
                                            checked={vendorFormData.communication_ease === "Very easy"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Very easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="communication_ease"
                                            value="Somewhat easy"
                                            checked={vendorFormData.communication_ease === "Somewhat easy"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Somewhat easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="communication_ease"
                                            value="Not so easy"
                                            checked={vendorFormData.communication_ease === "Not so easy"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Not so easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="communication_ease"
                                            value="Not at all easy"
                                            checked={vendorFormData.communication_ease === "Not at all easy"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Not at all easy</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>How easy was it to get the information you needed from the customer?
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_gathering_ease"
                                            value="Extremely easy"
                                            checked={vendorFormData.information_gathering_ease === "Extremely easy"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Extremely easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_gathering_ease"
                                            value="Very easy"
                                            checked={vendorFormData.information_gathering_ease === "Very easy"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Very easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_gathering_ease"
                                            value="Somewhat easy"
                                            checked={vendorFormData.information_gathering_ease === "Somewhat easy"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Somewhat easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_gathering_ease"
                                            value="Not so easy"
                                            checked={vendorFormData.information_gathering_ease === "Not so easy"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Not so easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_gathering_ease"
                                            value="Not at all easy"
                                            checked={vendorFormData.information_gathering_ease === "Not at all easy"}
                                            onChange={handleChangeVendor}
                                            required
                                        />
                                        <label className='ms-1 fs-15'>Not at all easy</label>
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
                                                checked={vendorFormData.recommendation_score === "1"}
                                                onChange={handleChangeVendor}
                                                required
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
                                                checked={vendorFormData.recommendation_score === "2"}
                                                onChange={handleChangeVendor}
                                                required
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
                                                checked={vendorFormData.recommendation_score === "3"}
                                                onChange={handleChangeVendor}
                                                required
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
                                                checked={vendorFormData.recommendation_score === "4"}
                                                onChange={handleChangeVendor}
                                                required
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
                                                checked={vendorFormData.recommendation_score === "5"}
                                                onChange={handleChangeVendor}
                                                required
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
                                                checked={vendorFormData.recommendation_score === "6"}
                                                onChange={handleChangeVendor}
                                                required
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
                                                checked={vendorFormData.recommendation_score === "7"}
                                                onChange={handleChangeVendor}
                                                required
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
                                                checked={vendorFormData.recommendation_score === "8"}
                                                onChange={handleChangeVendor}
                                                required
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
                                                checked={vendorFormData.recommendation_score === "9"}
                                                onChange={handleChangeVendor}
                                                required
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
                                                checked={vendorFormData.recommendation_score === "10"}
                                                onChange={handleChangeVendor}
                                                required
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
                                            value={vendorFormData.comment}
                                            onChange={handleChangeVendor}
                                            placeholder='Your answer'
                                            required
                                        />
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
                                        type="submit"
                                        onClick={vendorSurveySubmit}
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

export default VendorFeedBackSurvey;