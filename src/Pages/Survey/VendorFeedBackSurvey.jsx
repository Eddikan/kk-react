import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import { TbMessageX } from "react-icons/tb";
import { IoCloseOutline } from "react-icons/io5";
import 'Assets/styles/Survey/style.css';
import toast from 'react-hot-toast';
import axios from "axios";

const initialVendorSurvey = Object.freeze({
    most_like: '',
    most_least: '',
    reason: '',
    overall_satisfaction: '',
    ease_of_finding: '',
    time_to_find: '',
    visual_appeal: '',
    information_understanding: '',
    information_trust: '',
    listing_ease: '',
    communication_ease: '',
    information_gathering_ease: '',
    likelihood_of_recommendation: '',
    comments: '',

});

const VendorFeedBackSurvey = (props) => {
    const [clearFormModal, setClearFormModal] = useState(false);
    const [vendorFormData, setVendorFormData] = useState(initialVendorSurvey);
    const [reloadCount, setReloadCount] = useState(0);
    const [formStatus, setFormStatus] = useState('standby');

    const postVendorSurvey = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + '/#', data);
    };

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
        setFormStatus('loading');
        postVendorSurvey({ ...vendorFormData }).then(response => {
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
    return (
        <Layout>
            <section className='bg-light'>
                <Container className='py-5'>
                    <Row>
                        <Col>
                            <Card className='mt-3 mb-3 bordered-top-primary-survey'>
                                <Card.Body>
                                    <div className='fs-30 mb-4'>Website Feedback Survey (Vendor)</div>
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
                                    <div className='fs-15 indicate-question '>* Indicates required question</div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-3 card-border-color'>
                                <Card.Body className='p-4'>
                                    <div>Click on the image to indicate what section of  the page you like the most? (Feature picture of KK vendor profile with clickable image/text)
                                        <span className='asteris ms-1'>*</span>
                                    </div>
                                    <div className='mb-3 mt-4 d-flex'>
                                        <input
                                            type="text"
                                            className='me-2 question-concerns form-control'
                                            name='most_like'
                                            value={vendorFormData.most_like}
                                            onChange={handleChangeVendor}
                                            placeholder='Your answer'
                                            required
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
                                            name='most_least'
                                            value={vendorFormData.most_least}
                                            onChange={handleChangeVendor}
                                            placeholder='Your answer'
                                            required
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
                                            name="overall_satisfaction"
                                            value="Extremely well"
                                            checked={vendorFormData.overall_satisfaction === "Extremely well"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Extremely well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="overall_satisfaction"
                                            value="Very well"
                                            checked={vendorFormData.overall_satisfaction === "Very well"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Very well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="overall_satisfaction"
                                            value="Somewhat well"
                                            checked={vendorFormData.overall_satisfaction === "Somewhat well"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Somewhat well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="overall_satisfaction"
                                            value="Not do well"
                                            checked={vendorFormData.overall_satisfaction === "Not do well"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Not do well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="overall_satisfaction"
                                            value="Not at all well"
                                            checked={vendorFormData.overall_satisfaction === "Not at all well"}
                                            onChange={handleChangeVendor}
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
                                            name="ease_of_finding"
                                            value="Extremely well"
                                            checked={vendorFormData.ease_of_finding === "Extremely well"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Extremely well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="ease_of_finding"
                                            value="Very well"
                                            checked={vendorFormData.ease_of_finding === "Very well"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Very well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="ease_of_finding"
                                            value="Somewhat well"
                                            checked={vendorFormData.ease_of_finding === "Somewhat well"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Somewhat well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="ease_of_finding"
                                            value="Not do well"
                                            checked={vendorFormData.ease_of_finding === "Not do well"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Not do well</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="ease_of_finding"
                                            value="Not at all well"
                                            checked={vendorFormData.ease_of_finding === "Not at all well"}
                                            onChange={handleChangeVendor}
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
                                            name="time_to_find"
                                            value="A lot less time"
                                            checked={vendorFormData.time_to_find === "A lot less time"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>A lot less time</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="time_to_find"
                                            value="A little less time"
                                            checked={vendorFormData.time_to_find === "A little less time"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>A little less time</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="time_to_find"
                                            value="About what I expected"
                                            checked={vendorFormData.time_to_find === "About what I expected"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>About what I expected</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="time_to_find"
                                            value="A little more time"
                                            checked={vendorFormData.time_to_find === "A little more time"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>A little more time</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="time_to_find"
                                            value="A lot more time"
                                            checked={vendorFormData.time_to_find === "A lot more time"}
                                            onChange={handleChangeVendor}
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
                                            name="visual_appeal"
                                            value="Extremely appealing"
                                            checked={vendorFormData.visual_appeal === "Extremely appealing"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Extremely appealing</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="visual_appeal"
                                            value="Very appealing"
                                            checked={vendorFormData.visual_appeal === "Very appealing"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Very appealing</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="visual_appeal"
                                            value="Somewhat appealing"
                                            checked={vendorFormData.visual_appeal === "Somewhat appealing"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Somewhat appealing</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="visual_appeal"
                                            value="Not so appealing"
                                            checked={vendorFormData.visual_appeal === "Not so appealing"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Not so appealing</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="visual_appeal"
                                            value="Not at all appealing"
                                            checked={vendorFormData.visual_appeal === "Not at all appealing"}
                                            onChange={handleChangeVendor}
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
                                            name="information_understanding"
                                            value="Extremely easy"
                                            checked={vendorFormData.information_understanding === "Extremely easy"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Extremely easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_understanding"
                                            value="Very easy"
                                            checked={vendorFormData.information_understanding === "Very easy"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Very easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_understanding"
                                            value="Somewhat easy"
                                            checked={vendorFormData.information_understanding === "Somewhat easy"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Somewhat easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_understanding"
                                            value="Not so easy"
                                            checked={vendorFormData.information_understanding === "Not so easy"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Not so easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_understanding"
                                            value="Not at all easy"
                                            checked={vendorFormData.information_understanding === "Not at all easy"}
                                            onChange={handleChangeVendor}
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
                                            name="information_trust"
                                            value="A great deal"
                                            checked={vendorFormData.information_trust === "A great deal"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>A great deal</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_trust"
                                            value="A lot"
                                            checked={vendorFormData.information_trust === "A lot"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>A lot</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_trust"
                                            value="A moderate amount"
                                            checked={vendorFormData.information_trust === "A moderate amount"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>A moderate amount</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_trust"
                                            value="A little"
                                            checked={vendorFormData.information_trust === "A little"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>A little</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="information_trust"
                                            value="Not at all"
                                            checked={vendorFormData.information_trust === "Not at all"}
                                            onChange={handleChangeVendor}
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
                                            name="listing_ease"
                                            value="Extremely easy"
                                            checked={vendorFormData.listing_ease === "Extremely easy"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Extremely easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="listing_ease"
                                            value="Very easy"
                                            checked={vendorFormData.listing_ease === "Very easy"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Very easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="listing_ease"
                                            value="Somewhat easy"
                                            checked={vendorFormData.listing_ease === "Somewhat easy"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Somewhat easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="listing_ease"
                                            value="Not so easy"
                                            checked={vendorFormData.listing_ease === "Not so easy"}
                                            onChange={handleChangeVendor}
                                        />
                                        <label className='ms-1 fs-15'>Not so easy</label>
                                    </div>

                                    <div className='mb-3 d-flex'>
                                        <input
                                            type="radio"
                                            className='me-2 radio-size'
                                            name="listing_ease"
                                            value="Not at all easy"
                                            checked={vendorFormData.listing_ease === "Not at all easy"}
                                            onChange={handleChangeVendor}
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
                                                name="likelihood_of_recommendation"
                                                value="1"
                                                checked={vendorFormData.likelihood_of_recommendation === "1"}
                                                onChange={handleChangeVendor}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>2</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="likelihood_of_recommendation"
                                                value="2"
                                                checked={vendorFormData.likelihood_of_recommendation === "2"}
                                                onChange={handleChangeVendor}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>3</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="likelihood_of_recommendation"
                                                value="3"
                                                checked={vendorFormData.likelihood_of_recommendation === "3"}
                                                onChange={handleChangeVendor}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>4</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="likelihood_of_recommendation"
                                                value="4"
                                                checked={vendorFormData.likelihood_of_recommendation === "4"}
                                                onChange={handleChangeVendor}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>5</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="likelihood_of_recommendation"
                                                value="5"
                                                checked={vendorFormData.likelihood_of_recommendation === "5"}
                                                onChange={handleChangeVendor}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>6</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="likelihood_of_recommendation"
                                                value="6"
                                                checked={vendorFormData.likelihood_of_recommendation === "6"}
                                                onChange={handleChangeVendor}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>7</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="likelihood_of_recommendation"
                                                value="7"
                                                checked={vendorFormData.likelihood_of_recommendation === "7"}
                                                onChange={handleChangeVendor}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>8</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="likelihood_of_recommendation"
                                                value="8"
                                                checked={vendorFormData.likelihood_of_recommendation === "8"}
                                                onChange={handleChangeVendor}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>9</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="likelihood_of_recommendation"
                                                value="9"
                                                checked={vendorFormData.likelihood_of_recommendation === "9"}
                                                onChange={handleChangeVendor}
                                            />
                                        </div>

                                        <div>
                                            <span className='ms-1'>10</span>
                                            <br />
                                            <input
                                                type="radio"
                                                className='me-2 mt-3 radio-size'
                                                name="likelihood_of_recommendation"
                                                value="10"
                                                checked={vendorFormData.likelihood_of_recommendation === "10"}
                                                onChange={handleChangeVendor}
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
                                            name="comments"
                                            value={vendorFormData.comments}
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
                                    // onClick={vendorSurveySubmit}
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
            </section>
        </Layout>
    );
};

export default VendorFeedBackSurvey;