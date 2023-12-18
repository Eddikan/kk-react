import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, FormGroup, ModalFooter } from 'react-bootstrap';
import { IoIosArrowRoundForward } from "react-icons/io";
import Form from 'react-bootstrap/Form';
import { GoPlus, GoAlertFill } from 'react-icons/go';
import FormControl from 'react-bootstrap/FormControl';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import { TagsInput } from "react-tag-input-component";
import { Card, CardBody, CardFooter, ModalHeader, ModalBody, Modal } from 'reactstrap';
import NewProduct from 'Components/Forms/Product/NewProduct';
import GetUserProductData from 'Utils/GetProductsData';

const initialQuestionnaire3Data = Object.freeze({
    design_inspirations: '',
    pricing_structure: '',
    lead_time: '',
    areas_of_specialization : '',
    design_process: '',
    is_designer: 1,
});

const Questionnaire3 = (props) => {
    const navigate = useNavigate();
    const currentStep = props.step;
    const user = props.user;

    const [questionnaire3Data, setQuestionnaire3Data] = useState(initialQuestionnaire3Data);
    const [questionnaire3Loading, setQuestionnaire3Loading] = useState(false);
    const [userLoading, setUserLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);
    const [scheduleShow, setScheduleShow] = useState(false);
    const [uploadFileShow, setUploadFileShow] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageName, setImageName] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState([]);
    const [product, setProduct] = useState([]);
    const [productLoading, setProductLoading] = useState([]);
    const [productItems, setProductItems] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [currentAvailability, SetCurrentAvailability] = useState([]);
    const [postType, setPostType] = useState('post');
    const [designerId, setDesignerId] = useState('');

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'token']);

    const token = cookies.token;
    const currentUser = cookies.currentUser;

    const fetchData = async (e) => {
        try {
            const productData = await GetUserProductData(e);
            if (productData) {
                setProduct(productData);
                setProductLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
            }
            // Update state or perform other logic with userData
        } catch (error) {
            toast.error('An error occured. Please try again or contact the administrator.');
            // Handle the error, if needed
        }
    };

    const saveProductItems = (e) => {
        if (productItems && productItems.length > 0) {
            setProductItems([...productItems, e]);
        } else {
            setProductItems([e]);
        }
    }

    const toggleSchedule = (e) => {
        e.preventDefault();
        setScheduleShow(!scheduleShow);
    }

    const toggleuploadFile = (e) => {
        e.preventDefault();
        setUploadFileShow(!uploadFileShow);
    }

    const handleTimeChange = (e) => {
        setAvailability(e);
    }

    const hideUpload = (e) => {
        setUploadFileShow(false);
    }

    const hideAll = (e) => {
        props.onHideAll(e);
    };

    const handleChange = (e) => {
        setQuestionnaire3Data({
            ...questionnaire3Data,
            [e.target.name]: e.target.value,
        })
    }

    const refreshProduct = (e) => {
        if (e) {
            setReloadCount(reloadCount + 1);
        }
    }

    const handleDoneTimeChange = (e) => {
        setScheduleShow(false);
        SetCurrentAvailability(availability);
    
    }

    async function questionnaire3Submit(e) {
        e.preventDefault();
        setQuestionnaire3Loading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'designer?user_id=' + currentUser + '&token=' + token, {...questionnaire3Data, areas_of_specialization: selectedSpecialization, user_id: currentUser, product_items: productItems, availability: availability, post_type: postType  }).then((response) => {
            const success = response.data.status;
            if(success == 'Success') {
                hideAll(3);
                setQuestionnaire3Loading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setQuestionnaire3Loading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setQuestionnaire3Loading(false);
        });
    }

    useEffect(() => {
        fetchData(currentUser);
        if (user) {
            if (user.designer) {
                setQuestionnaire3Data(user.designer);
                const specialization = user.designer.areas_of_specialization;
                const current_availability = user.designer.current_availability;
                setSelectedSpecialization(specialization);
                SetCurrentAvailability(current_availability);
                setDesignerId(user.designer.id);
                setPostType('put');
            } else {
                setPostType('post');
            }
            setProductItems(user.portfolio_items);
        }

    }, [reloadCount]);

    return (
        <>
            <Container className='q1 narrow-750 py-5 px-4 mt-5 text-dgray'>
                <Row>
                    <Col lg='12' className='text-center'>
                        <h2 className='form-title pb-2 mb-3'>Showcase your talent</h2>
                    </Col>
                </Row>
                <Form onSubmit={questionnaire3Submit}>
                    <Row className="mb-3">
                        <Col lg="12">
                            <Card className='mb-4 border-white'>
                                <CardBody>
                                    <Form.Label className='mb-1 fs-18'>
                                        Areas of Specialization and Expertise
                                    </Form.Label>
                                    <Form.Label className="mb-3">
                                        Specify your areas of expertise (e.g., bridal wear, ready-to-wear women’s clothing, casual, haute couture, sustainable fashion)
                                    </Form.Label>
                                    <Form.Group>
                                        <TagsInput
                                            value={selectedSpecialization}
                                            onChange={setSelectedSpecialization}
                                            name="areas_of_specialization"
                                            className="form-control"
                                        // placeHolder="Fabric Type"
                                        />
                                    </Form.Group>
                                </CardBody>
                            </Card>
                            <Card className='mb-4 border-white'>
                                <CardBody>
                                    <Form.Label className='mb-3 fs-18'>
                                        Product Showcase
                                    </Form.Label>
                                    <Card className='background-dashed'>
                                        <CardBody>
                                            {productItems && productItems.length > 0 ?
                                                <>
                                                    <Row>
                                                        {productItems.map((productItem, index) => (
                                                            <>
                                                                {productItem.image_urls && productItem.image_urls.length > 0 ?
                                                                    <>
                                                                        {productItem.image_urls.map((image, imageIndex) => (
                                                                            <>
                                                                                {productItems.length > 3 && imageIndex > 2 ?
                                                                                    <Col lg={4} key={image.id} className="image-preview mt-3">
                                                                                        <div className="image-dnd" style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'product/'+image.image_url+")", minHeight: '190px'}}>
                                                                                            <div className="dnd-actions-overlay"></div>
                                                                                        </div>
                                                                                    </Col>
                                                                                    :
                                                                                    <Col lg={4} key={image.id} className="image-preview">
                                                                                        <div className="image-dnd" style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'product/'+image.image_url+")", minHeight: '190px'}}>
                                                                                            <div className="dnd-actions-overlay"></div>
                                                                                        </div>
                                                                                    </Col>
                                                                                }
                                                                            </>
                                                                        ))}
                                                                    </>
                                                                    :
                                                                    null
                                                                }
                                                            </>
                                                        ))}
                                                        {productItems.length > 3 ?
                                                            <Col className="mt-3" lg={4}>
                                                                <div onClick={toggleuploadFile} className="product-grid-div add-more-box w-100 text-center cursor-pointer background-dashed" style={{minHeight: '190px'}}>
                                                                    <GoPlus color="#a4a4a4" size="130px" className="mt-3" />
                                                                    <p className="text-dgray" style={{marginTop: '-15px'}}>Add More</p>
                                                                </div>
                                                            </Col>
                                                            :
                                                            <Col lg={4}>
                                                                <div onClick={toggleuploadFile} className="product-grid-div add-more-box w-100 text-center cursor-pointer background-dashed" style={{minHeight: '190px'}}>
                                                                    <GoPlus color="#a4a4a4" size="130px" className="mt-3" />
                                                                    <p className="text-dgray" style={{marginTop: '-15px'}}>Add More</p>
                                                                </div>
                                                            </Col>
                                                        }
                                                    </Row>
                                                </>
                                                :
                                                <Row className="align-items-center text-center my-5">
                                                    <Col>
                                                        <Form.Label className="mb-1 fs-20">
                                                            Upload your design
                                                        </Form.Label>
                                                        <Form.Label className="mb-4 fs-16">
                                                            Showcase your best work, get feedback, likes, and join a growing community.
                                                        </Form.Label>
                                                        <Button className='btn-primary'
                                                            onClick={toggleuploadFile}
                                                            type="button"
                                                        >
                                                            Upload Your First Shot
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            }
                                            
                                        </CardBody>
                                    </Card>
                                </CardBody>
                            </Card>
                            <Card className='mb-4 border-white'>
                                <CardBody>
                                    <Form.Label className='mb-1 fs-18 d-block'>
                                        Design Process Insights
                                    </Form.Label>
                                    <Form.Label className="mb-3">
                                        Provider information about your design process, from ideation to creation.
                                    </Form.Label>
                                    <Form.Group>
                                        <Form.Control
                                            as="textarea"
                                            name="design_process"
                                            rows={5} // You can adjust the number of rows as needed
                                            value={questionnaire3Data.design_process}
                                            placeholder=""
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </CardBody>
                            </Card>
                            <Card className='mb-4 border-white'>
                                <CardBody>
                                    <Form.Label className='mb-1 fs-18 d-block'>
                                        Lead Time and Pricing Structure
                                    </Form.Label>
                                    <Form.Label className="mb-3">
                                        Provide information about the typical lead time for designing,
                                        creatung, and delivering garments, along with transparent
                                        pricing structures, helps set expectations.
                                    </Form.Label>
                                    <Form.Label className="mb-3">
                                        Lead Time
                                    </Form.Label>
                                    <Form.Group className='mb-3'>
                                        <Form.Control
                                            type="text"
                                            name="lead_time"
                                            value={questionnaire3Data.lead_time}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Label className="mb-3">
                                        Pricing Structure
                                    </Form.Label>
                                    <Form.Group>
                                        <Form.Control
                                            as="textarea"
                                            name="pricing_structure"
                                            rows={5} // You can adjust the number of rows as needed
                                            value={questionnaire3Data.pricing_structure}
                                            placeholder=""
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </CardBody>
                            </Card>
                            <Card className='mb-4 border-white'>
                                <CardBody>
                                    <Form.Label className='mb-3 fs-18 d-block'>
                                        Design Inspirations and Influences
                                    </Form.Label>
                                    <Form.Group>
                                        <Form.Control
                                            as="textarea"
                                            name="design_inspirations"
                                            rows={5} // You can adjust the number of rows as needed
                                            value={questionnaire3Data.design_inspirations}
                                            placeholder=""
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12" className="text-right">
                            <Button className='btn-outline me-3' type="button" onClick={function () { hideAll(3); }}>Back</Button>
                            {questionnaire3Loading ?
                                <Button className='btn-primary me-3' type="button">Saving...</Button>
                                :
                                <Button className='btn-primary me-3' type="submit">Save</Button>
                            }
                            <span className="cursor-pointer text-black" onClick={function () { hideAll(4); }}>Skip <IoIosArrowRoundForward /></span>
                        </Col>
                    </Row>
                </Form>
            </Container>
            <Modal
                isOpen={uploadFileShow}
                className='modal-preview'
                fade={false}
                style={{ minWidth: '600px' }}
                centered
            >
                <ModalHeader className="pb-0">
                    <button type='button' className='close react-modal-close' onClick={toggleuploadFile} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </ModalHeader>
                <ModalBody>
                    <h2 className='modal-title fs-25 fw-600 text-center'>Upload your Design</h2>
                    <Card className="border-0">
                        <CardBody className="p-2">
                            <NewProduct size="small" withDraft={false} onSuccess={refreshProduct} onCancel={hideUpload} onSave={saveProductItems} />
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    );
};

export default Questionnaire3;