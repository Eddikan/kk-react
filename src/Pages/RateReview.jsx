import React, { useEffect, useState } from 'react';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
import { CiCreditCard2 } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AiFillMessage } from "react-icons/ai";
import User from '../Assets/images/user.png';
import '../Assets/styles/RateReview/style.css';
import GetSinglePortfolioData from 'Utils/GetSinglePortfolioData';
import { Rating } from 'react-simple-star-rating';
import { LiaSmileBeam } from "react-icons/lia";
import { VscSend } from "react-icons/vsc";
import { IoIosAttach } from "react-icons/io";
import { IoCloseOutline, IoVideocam } from "react-icons/io5";
import { GoHeart, GoAlertFill, GoShareAndroid } from 'react-icons/go';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import PlaceholderSquare from 'Assets/images/square-placeholder.jpg';
import axios from "axios";
import toast from 'react-hot-toast';
import ChatBox from '../Components/Shared/ChatBox';

const initialCheckOut = {
    card_name: '',
    card_number: '',
    date: ''
};

const ToastCss = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

const RateReview = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const { portfolioId } = useParams();
    const userDetails = cookies.userDetails;
    const { designerId } = useParams();
    const [reloadCount, setReloadCount] = useState(0);
    const [formStatus, setFormStatus] = useState('standby');
    const [radioButtonValue, setRadioButtonValue] = useState(0);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [images, setImages] = useState([]);
    const [activeImage, setActiveImage] = useState('');
    const [checkOutFormData, setCheckOutFormData] = useState(initialCheckOut);
    const [portfolio, setPortfolio] = useState('');
    const [chatBox, setChatBox] = useState(false);
    const [portfolioLoading, setPortfolioLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState(false);


    const navigate = useNavigate();

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    const getAddCarts = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + '/#');
    };

    const postCheckOut = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + '/#', data);
    };

    const handleChangePaymentInfo = (e) => {
        const { name, value } = e.target;
        setCheckOutFormData({
            ...checkOutFormData,
            [name]: value,
        });
    }

    // const fetchData = async (e) => {
    //     try {
    //         const portfolioData = await GetSinglePortfolioData(e);
    //         if (portfolioData.id) {
    //             setPortfolio(portfolioData);
    //             setPortfolioLoading(false);
    //             setImages(portfolioData.image_urls);
    //             if (portfolioData.image_urls?.[0]?.image_url) {
    //                 setActiveImage(process.env.REACT_APP_STORAGE_URL + 'portfolio/' + portfolioData.image_urls[0].image_url);
    //             } else {
    //                 setActiveImage(PlaceholderImage);
    //             }

    //         } else {
    //             setPortfolioLoading(false);
    //             toast.error('Portfolio item does not exist!');
    //             navigate('/user/profile');
    //         }
    //     } catch (error) {
    //         toast.error('Portfolio item does not exist!');
    //         navigate('/user/profile');
    //     }
    // };

    useEffect(() => {
        document.body.classList.add('designer-calendar-body');
    }, []);

    const addBusinessHoursSubmitPost = (e) => {
        // e.preventDefault();
        setFormStatus('loading');
        postCheckOut(checkOutFormData).then(response => {
            const status = response.data.status;
            if (status === "Success") {
                setFormStatus('standby');
                setReloadCount(reloadCount + 1);
                setCheckOutFormData(initialCheckOut);
                toast.success('Availability added successfully!');
            } else {
                setFormStatus('standby');
                toast.error('There has been an error saving the appointment, please try again!');
            }
        }).catch(() => {
            toast.error('There has been an error saving the appointment, please try again!');
        });
    }


    // useEffect(() => {
    //     fetchData(portfolioId);
    // }, [reloadCount]);

    return (
        <LayoutNoFooter>
            <section id="rate-review">
                <Container>
                    <Row>
                        <Col lg={12} className="designer-calendar-container">
                            <Row className="pb-0">
                                <Col md={6} className='d-flex justify-content-left align-items-center'>
                                    <h3 className="fs-30 fw-600 text-black mb-0">Rate and Review</h3>
                                </Col>
                                <Col md={6} className="text-right">
                                    <GoBack fallBack="/#" />
                                </Col>
                            </Row>
                        </Col>

                        <Row className='p-right'>
                            <Col>
                                <Row>
                                    <Col lg={12} className='p-right'>
                                        <Card className='mt-2 rate-review-card'>
                                            <Card.Header className='header-chat bg-light d-flex justify-content-between border-bottom'>
                                                <span>
                                                    <span>
                                                        <img src={User} className='user-placeholder-order me-2 order-user' />Dave Napoles
                                                        <AiFillMessage className='ms-2 text-gold cursor-pointer' onClick={() => setChatBox(true)} />
                                                    </span>
                                                </span>

                                                <div className='all-order-id'>
                                                    Order ID: 11002345CT
                                                </div>
                                            </Card.Header>
                                            <Card.Body className='bg-white'>
                                                <Row>
                                                    <Col lg={12} className='mb-3'>
                                                        <span className='delivered-date fs-14'>Delivered on December 13, 2023</span>
                                                    </Col>

                                                    <Col lg={12}>

                                                        <img src={PlaceholderSquare} className='square-placeholder me-3 ' />
                                                        <span>Crystal Cascade SleeveGuard</span>
                                                        {/* <div className='product-portfolio-image mb-4'>
                                                            <span className='d-flex'>
                                                                {images && images.length > 0 ?
                                                                    <>
                                                                        <div className="single-image-chat" style={{ backgroundImage: "url(" + activeImage + ")" }}>
                                                                        </div>
                                                                        <span className='name-of-portfolio ms-3 d-flex justify-content-center align-items-center'>{portfolio.name ?? "-"}</span>
                                                                    </>
                                                                    :
                                                                    null
                                                                }
                                                            </span>
                                                        </div> */}

                                                        <div className="text-left mt-3">
                                                            <span className="fs-16 me-3">Product Quality:</span> <Rating
                                                                // initialValue={reviewFormData.rating}
                                                                allowFraction={true}
                                                                size={25}
                                                                className="star-rating fs-16"
                                                                showTooltip={true}
                                                                emptyColor="#dddddd"
                                                                fillColor="#cea835"
                                                                // onClick={handlePointerMove}
                                                                tooltipArray={[
                                                                    'Terrible',
                                                                    'Terrible',
                                                                    'Bad',
                                                                    'Bad',
                                                                    'Average',
                                                                    'Average',
                                                                    'Great',
                                                                    'Great',
                                                                    'Excellent',
                                                                    'Excellent'
                                                                ]}
                                                            // tooltipDefaultText={reviewText}
                                                            /* Available Props */
                                                            />
                                                            <Form.Control
                                                                as="textarea"
                                                                name="content"
                                                                rows={5} // You can adjust the number of rows as needed
                                                                // value={reviewFormData.content}
                                                                placeholder="Leave a comment about the product..."
                                                                // onChange={handleChangeReview}
                                                                className="mt-3"
                                                            />
                                                        </div>

                                                        <div className='mb-3 mt-3' onClick={() => toggleUnderConstruction("Upload File")}>
                                                            <button className="btn btn-primary">Upload File</button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Card.Body>

                                            <Card.Footer className='top-border-color bg-white p-3'>
                                                <div className='text-right'>
                                                    <button className="btn rate-review-btn me-4">Cancel</button>
                                                    <button className="btn btn-primary" onClick={() => toggleUnderConstruction("Submit")}>Submit</button>
                                                </div>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        {/* {chatBox ?
                            <>
                                <Card className='width-chat-card px-0'>
                                    <Card.Header className='header-chat bg-white'>
                                        <div className='d-flex justify-content-between'>
                                            <div>
                                                <span className="fs-14 fw-500 mb-0 name-of-user-chat">
                                                    {portfolio.user.first_name && portfolio.user.first_name != "" ? portfolio.user.first_name : "-"} &nbsp;
                                                    {portfolio.user.last_name && portfolio.user.last_name != "" ? portfolio.user.last_name : "-"}
                                                </span>
                                                <span className='ms-3 active-now fs-14 fw-400'>Active Now</span>
                                            </div>
                                            <div className="cursor-pointer" onClick={() => setChatBox(false)}>
                                                <IoCloseOutline color="#39393A" />
                                            </div>
                                        </div>
                                    </Card.Header>

                                    <Card.Body >

                                        <div>
                                            <div className='mt-4 d-flex portfolio-designer-chat'>
                                                {portfolio.user.image && (
                                                    <div
                                                        className='designer-photo'
                                                        style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${portfolio.user.image})` }}
                                                    >
                                                    </div>
                                                )}
                                                <div className="designer-info mx-2">
                                                    <div>
                                                        <p className="fs-14 fw-600 mb-0 name-of-user-chat ms-2">
                                                            {portfolio.user.first_name && portfolio.user.first_name != "" ? portfolio.user.first_name : "-"} {portfolio.user.last_name && portfolio.user.last_name != "" ? portfolio.user.last_name : "-"}
                                                            <span className='ms-3 fs-14 time-chat fw-400'>2:23 PM</span>
                                                        </p>
                                                    </div>

                                                    <div className='fs-14 ms-2 mt-2 name-of-user-chat'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam.</div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className='mt-5 mb-4 text-right d-flex'>
                                            <div>
                                                <div className='time-chat-box fs-14 fw-400'>3:30 PM
                                                    <span className='ms-2 you-chat-box fw-600 fs-14'>You</span></div>
                                                <div className='mt-2 welcome-chat'>
                                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                                                </div>
                                            </div>

                                            <img src={User} className='placeholder-chat ms-3' />
                                        </div>

                                        <div className='mt-3'>
                                            <input type="text" className='form-control' />
                                        </div>

                                        <div className='mt-3 d-flex justify-content-between'>
                                            <div className='d-flex'>
                                                <div className='cursor-pointer' onClick={() => toggleUnderConstruction("")}><LiaSmileBeam className='me-2' size={20} /></div>
                                                <div className='cursor-pointer' onClick={() => toggleUnderConstruction("")}><IoIosAttach size={20} /></div>
                                            </div>
                                            <div>
                                                <div
                                                    className="cursor-pointer fw-500"
                                                    onClick={() => toggleUnderConstruction("Send Message")}
                                                >
                                                    Send
                                                    <VscSend className='ms-1' />
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </>
                            :
                            null
                        } */}

                        <ChatBox chatBox={chatBox} onCloseChat={() => setCurrentTab(false)} />
                    </Row>
                </Container>
            </section>

            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button type='button' className='close react-modal-close' onClick={() => setUnderConstructionShow(false)} data-dismiss='modal' aria-label='Close'>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <h4 className='fs-25 fw-600 mb-3'>{modalHeading}</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>

        </LayoutNoFooter >
    );
};

export default RateReview;