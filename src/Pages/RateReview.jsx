import React, { useEffect, useState } from 'react';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
import { useParams } from 'react-router-dom';
import { AiFillMessage } from "react-icons/ai";
import User from '../Assets/images/user.png';
import '../Assets/styles/RateReview/style.css';
import { Rating } from 'react-simple-star-rating';
import InputEmoji from 'react-input-emoji';
import { VscSend } from "react-icons/vsc";
import { IoIosAttach } from "react-icons/io";
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import { IoCloseOutline } from "react-icons/io5";
import { GoAlertFill } from 'react-icons/go';
import axios from "axios";
import toast from 'react-hot-toast';


const RateReview = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'token']);
    const { productId } = useParams();
    const [reloadCount, setReloadCount] = useState(0);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [chatBox, setChatBox] = useState(false);
    const [product, setProduct] = useState([]);
    const [images, setImages] = useState([]);
    const [productUser, setProductUser] = useState('');
    const [text, setText] = useState('')
    const [activeImage, setActiveImage] = useState('');

    const current_user_id = cookies.currentUser;
    const token = cookies.token;

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const today = (new Date(product.created_at)).toLocaleDateString('en-ES', options);

    const getProduct = async () => {
        return await axios.get(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'product/' + productId + '?current_user_id=' + current_user_id + '&token=' + token);
    };

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    function handleOnEnter(text) {
        console.log('enter', text)
    }

    useEffect(() => {
        document.body.classList.add('designer-calendar-body');
    }, []);

    useEffect(() => {
        getProduct()
            .then((response) => {
                const productData = response.data.data;
                if (productData) {
                    setProduct(productData);
                    setProductUser(productData.user)
                    setImages(productData.image_urls);

                    if (productData.image_urls?.[0]?.image_url) {
                        setActiveImage(import.meta.env.VITE_REACT_APP_STORAGE_URL + 'product/' + productData.image_urls[0].image_url);
                    } else {
                        setActiveImage(PlaceholderImage);
                    }
                } else {
                    toast.error('There has been an error getting the product, please try again!');
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the product, please try again!');
            });
    }, [reloadCount]);

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
                                                    <span className='d-flex align-items-center user-image-rate'>
                                                        {productUser.image && (
                                                            <div
                                                                className='user-photo-rate me-2'
                                                                style={{ backgroundImage: `url(${import.meta.env.VITE_REACT_APP_STORAGE_URL}user/${productUser.image})` }}
                                                            >
                                                            </div>
                                                        )}
                                                        {productUser.first_name}&nbsp;{productUser.last_name}
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
                                                        <span className='delivered-date fs-14'>
                                                            Delivered on
                                                            <span className='ms-1'>{today}</span>
                                                        </span>
                                                    </Col>

                                                    <Col lg={12}>
                                                        <a href={`/product/${product.id}`} className='text-none-decoration'>
                                                            <span className='d-flex'>

                                                                {images && images.length > 0 ?
                                                                    <>
                                                                        <div className="single-image-review-item" style={{ backgroundImage: "url(" + activeImage + ")" }}>
                                                                        </div>
                                                                        <span className='fs-16 text-black ms-3 d-flex justify-content-center align-items-center '>{product.name ?? "-"}</span>
                                                                    </>
                                                                    :
                                                                    null
                                                                }
                                                            </span>
                                                        </a>

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
                                                                rows={5}
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


                        {chatBox ?
                            <>
                                <Card className='width-chat-card px-0'>
                                    <Card.Header className='order-chat bg-white pt-3 pb-3'>
                                        <div className='d-flex justify-content-between'>
                                            <div>
                                                <span className="fs-14 fw-500 mb-0 name-of-user-chat">
                                                    <span className='fw-500'>{productUser.first_name} {productUser.last_name}</span>
                                                </span>
                                                {/* <span className='ms-3 active-now fs-14 fw-400'>Active Now</span> */}
                                            </div>
                                            <div className="cursor-pointer" onClick={() => setChatBox(false)}>
                                                <IoCloseOutline color="#39393A" />
                                            </div>
                                        </div>
                                    </Card.Header>

                                    <Card.Body >
                                        <p>No messages.</p>

                                        <div>
                                            <InputEmoji
                                                value={text}
                                                onChange={setText}
                                                cleanOnEnter
                                                onEnter={handleOnEnter}
                                                placeholder="Type a message"
                                                className="emoji-picker"
                                            />
                                            <div className='cursor-pointer position-absolute attach-icon' onClick={() => toggleUnderConstruction("")}><IoIosAttach size={20} /></div>
                                            <div>
                                                <div
                                                    className="cursor-pointer fw-500 position-absolute send-button"
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
                        }
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