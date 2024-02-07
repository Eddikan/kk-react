import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Form, Modal} from 'react-bootstrap';
import toast from 'react-hot-toast';
import GetUserData from 'Utils/GetUserData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";
import { IoDocumentOutline, IoEyeOutline } from "react-icons/io5";
import { BsCart2 } from "react-icons/bs";
import Loading from 'Components/Shared/Loading';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import LoadingPage from 'Components/Shared/LoadingPage';
import '../../Assets/styles/Product/ViewProduct/style.css';
import Sidebar from 'Components/Shared/Sidebar';
import LayoutSellerCenter from 'Components/Layout/LayoutSellerCenter';
import DetailBuilder from 'Components/Shared/DetailBuilder';

const initialUserData = Object.freeze({
    is_designer: 0,
    is_tailor: 0,
    is_seller: 0,
    email: '',
    short_bio: '',
    long_bio: '',
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    province: '',
    postal_code: '',
    country: '',
    website: '',
    phone_number: '',
    secondary_email_address: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    pinterest: '',
    behance: '',
    youtube: '',
    instagram: '',
});

const MeasurementGuide = (props) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(initialUserData);
    const [userLoading, setUserLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'token']);
    const [elements, setElements] = useState([]);
    const [guideModalShow, setGuideModalShow] = useState(false);

    const [count, setCount] = useState(0);

    const token = cookies.token;
    const currentUser = cookies.currentUser;

    const handleAddElement = (e) => {
        setElements(e);
    }

    const toggleGuideModal = (e) => {
        setGuideModalShow(!guideModalShow);
    }

    const fetchData = async (e) => {
        try {
            const userData = await GetUserData(e);
            if (userData.id) {
                setUser(userData);
                setCookie('userDetails', JSON.stringify(userData), { path: '/' });
                setUserLoading(false);
            } else {
                setUserLoading(false);
                toast.error('An error occured. Please try again or contact the administrator.');
                console.log(userData);
            }
            // Update state or perform other logic with userData
        } catch (error) {
            setUserLoading(false);
            toast.error('An error occured. Please try again or contact the administrator.');
            console.log(error);
            // Handle the error, if needed
        }
    };

    useEffect(() => {
        fetchData({ token: token, currentUser: currentUser });
    }, [reloadCount]);

    return (
        <LayoutSellerCenter>
            {userLoading ?
                <LoadingPage />
                :
                <>
                    <section>
                        <Container fluid className='p-0'>
                            <Row className="portfolio-row bg-product">
                                <Col lg={2}>
                                    <Sidebar />
                                </Col>

                                <Col lg={10} className='mt-5 col-right mx-auto' style={{maxWidth: '1440px'}}>
                                    <div className='ms-4'>
                                        <Row className="mb-3">
                                            <Col lg={9}>
                                                <h2 className='fs-30 mb-4'>Measurement Guide</h2>
                                            </Col>
                                            <Col lg={3} className="text-right">
                                                <Button className='btn-primary' type="button" onClick={toggleGuideModal}>Add Element</Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg={12}>
                                                <Card>
                                                    <Card.Body className="bg-white">
                                                        <Row>

                                                        </Row>
                                                        <div>
                                                            {elements && elements.length > 0 ?
                                                                <>
                                                                    {/* Preview based on selected input type */}
                                                                    {elements.map((element, index) => (
                                                                        <>
                                                                            <p>{element.type}</p>
                                                                        </>
                                                                    ))}
                                                                </>
                                                                :
                                                                <p className="my-5 text-center">No measurement guide added.</p>
                                                            }
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </section>
                    <Modal
                        show={guideModalShow} 
                        onHide={toggleGuideModal}
                        className='modal-preview'
                        fade={false}
                        size="lg"
                        centered
                        id="measurement-guide"
                    >
                        <Modal.Header className="pb-0">
                            <h4 className='text-left fs-25 fw-600'>Add Element</h4>
                            <button type='button' className='close react-modal-close' onClick={toggleGuideModal} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                            </button>
                        </Modal.Header>
                        <Modal.Body>
                            <Card>
                                <Card.Body>
                                    <DetailBuilder size="normal" addElement={handleAddElement} closeModal={toggleGuideModal} elements={elements} />
                                </Card.Body>
                            </Card>
                        </Modal.Body>
                    </Modal>
                </>
            }
        </LayoutSellerCenter >
    );
};

export default MeasurementGuide;