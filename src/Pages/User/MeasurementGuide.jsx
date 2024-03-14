import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Form, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import GetUserData from 'Utils/GetUserData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";
import { IoDocumentOutline, IoEyeOutline } from "react-icons/io5";
import { BsCart2 } from "react-icons/bs";
import Loading from 'Components/Shared/Loading';
import GoBack from 'Components/Shared/GoBack';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import LoadingPage from 'Components/Shared/LoadingPage';
import 'Assets/styles/Product/ViewProduct/style.css';
import Sidebar from 'Components/Shared/Sidebar';
import { IoCloseOutline } from "react-icons/io5";
import LayoutSellerCenter from 'Components/Layout/LayoutSellerCenter';
import DetailBuilder from 'Components/Shared/DetailBuilder';
import ResponsiveEmbedVideo from 'Components/Shared/ResponsiveEmbeddedVideo';
import ResponsiveVideo from 'Components/Shared/ResponsiveVideo';
import 'Assets/styles/Measurement/style.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
    const [actionType, setActionType] = useState('add');

    const [count, setCount] = useState(0);

    const token = cookies.token;
    const currentUser = cookies.currentUser;

    const handleAddElement = (e) => {
        setElements(e);
        submitMeasurementGuide(e);
    }

    const toggleGuideModal = (e) => {
        setGuideModalShow(!guideModalShow);
    }

    const handleActionType = (e) => {
        setActionType(e);
    }

    const fetchData = async (e) => {
        try {
            const userData = await GetUserData(e);
            if (userData.id) {
                setUser(userData);
                setCookie('userDetails', JSON.stringify(userData), { path: '/' });
                setUserLoading(false);
                if (userData.measurement_guide) {
                    var measurementGuide = JSON.parse(userData.measurement_guide);
                    // console.log(measurementGuide);
                    setElements(measurementGuide);
                }
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

    async function submitMeasurementGuide(e) {
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?user_id=' + currentUser + '&token=' + token, { measurement_guide: e }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                const data = response.data.data;
                // toast.success('Measurement guide updated successfully!');
                setReloadCount((prevReloadCount) => prevReloadCount + 1);
            } else {
                const errors = response.data.errors;
                if (errors && errors.length > 0) {
                    errors.map((error, index) => {
                        toast.error(error);
                        return null; // React requires a return value, so we return null here
                    });
                } else {
                    toast.error('There has been an error saving the measurement guide, please try again!');
                }
            }
        }).catch((error) => {
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    const onDragEnd = result => {
        if (!result.destination) return;

        const newElements = Array.from(elements);
        const [reorderedElement] = newElements.splice(result.source.index, 1);
        newElements.splice(result.destination.index, 0, reorderedElement);

        setElements(newElements);
        submitMeasurementGuide(newElements);
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


                                <Col lg={10} className='my-5 mx-auto max-width-column'>
                                    <div>
                                        <Row className="mb-3">
                                            <Col lg={12} className='text-right mb-2'>
                                                <GoBack fallBack="/" />
                                            </Col>
                                            <Col lg={8}>
                                                <h2 className='fs-30 fw-600 mb-4'>Measurement Guide</h2>
                                            </Col>
                                            <Col lg={4} className="text-right">
                                                {elements && elements.length > 0 && (
                                                    <Button className='btn-primary bg-transparent border-black text-black bg-black-hover border-black-hover text-white-hover me-3' type="button" onClick={() => { toggleGuideModal(); handleActionType("edit"); }}><GoPencil size="20px" className='me-2' /> Edit</Button>
                                                )}
                                                <Button className='btn-primary bg-gold-hover border-gold-hover text-white-hover' type="button" onClick={() => { toggleGuideModal(); handleActionType("add"); }}><GoPlus size="20px" className='me-2' /> New Element</Button>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg={8}>
                                                <Card>
                                                    <Card.Body>
                                                        <h4 className="fw-600 mb-3">Preview</h4>
                                                        <div>
                                                            {elements && elements.length > 0 ?
                                                                <>
                                                                    <hr />
                                                                    {/* Preview based on selected input type */}
                                                                    {elements.map((element, index) => (
                                                                        <>
                                                                            {element.type == "Heading" ?
                                                                                <h3 className='fw-600 my-4' key={index}>{element.value}</h3>
                                                                                : element.type == "Paragraph" ?
                                                                                    <p key={index}>{element.value}</p>
                                                                                    : element.type == "Image" ?
                                                                                        <>
                                                                                            {element.value && element.value.length > 0 && element.value != "" ?
                                                                                                <>
                                                                                                    {element.value.map((image, imageIndex) => (
                                                                                                        <img key={imageIndex} src={process.env.REACT_APP_STORAGE_URL + 'product/' + image?.image_url} className="w-100 mb-3 image-height-preview" alt="" />
                                                                                                    ))}
                                                                                                </>
                                                                                                :
                                                                                                null
                                                                                            }
                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                            {(element.type == "YouTube Embed Link" || element.type == "Vimeo Embed Link") && element.value != "" ?
                                                                                                <>
                                                                                                    <div className="mb-3">
                                                                                                        <ResponsiveEmbedVideo src={element.value} title={element.type} />
                                                                                                    </div>
                                                                                                </>
                                                                                                : element.type == "Video" && element.value != "" ?
                                                                                                    <>
                                                                                                        <div className="mb-3">
                                                                                                            <ResponsiveVideo src={process.env.REACT_APP_STORAGE_URL + 'products/videos/' + element.value} />
                                                                                                        </div>
                                                                                                    </>
                                                                                                    : element.type == "Line Break" ?
                                                                                                        <p className="py-4 mb-0"></p>
                                                                                                        :
                                                                                                        null
                                                                                            }
                                                                                        </>
                                                                            }

                                                                        </>
                                                                    ))}
                                                                </>
                                                                :
                                                                <Card className="mb-3 mt-3">
                                                                    <Card.Body className="bg-lgray">
                                                                        <p className="text-center mb-0">No measurement guide added.</p>
                                                                    </Card.Body>
                                                                </Card>

                                                            }
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col lg="4">
                                                <Card>
                                                    <Card.Body className="bg-white">
                                                        <h4 className="fw-600 mb-3">Elements</h4>
                                                        <DragDropContext onDragEnd={onDragEnd}>
                                                            <Droppable droppableId="elements">
                                                                {provided => (
                                                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                                                        {elements.map((element, index) => (
                                                                            <Draggable key={index} draggableId={index.toString()} index={index}>
                                                                                {provided => (
                                                                                    <Card
                                                                                        className="mb-3"
                                                                                        ref={provided.innerRef}
                                                                                        {...provided.draggableProps}
                                                                                        {...provided.dragHandleProps}
                                                                                    >
                                                                                        <Card.Body className="bg-lgray">
                                                                                            <h3 className="fw-600 fs-18">{element.type}</h3>
                                                                                        </Card.Body>
                                                                                    </Card>
                                                                                )}
                                                                            </Draggable>
                                                                        ))}
                                                                        {provided.placeholder}
                                                                    </div>
                                                                )}
                                                            </Droppable>
                                                        </DragDropContext>
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
                        id="measurement-guide"
                    >
                        <Modal.Header className='pb-0'>
                            <Modal.Title className='rufina-family fs-22 text-black'>{actionType == "add" ? "New Element" : "Edit Elements"}</Modal.Title>
                            <button type='button' className='close react-modal-close' onClick={toggleGuideModal} data-dismiss='modal' aria-label='Close'>
                                <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                            </button>
                        </Modal.Header>

                        <Modal.Body>
                            <Card className='border-0'>
                                <Card.Body className='p-0'>
                                    <DetailBuilder size="normal" addElement={handleAddElement} closeModal={toggleGuideModal} elements={elements} actionType={actionType} />
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