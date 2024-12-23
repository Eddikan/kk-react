import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, FormGroup, ModalFooter } from 'react-bootstrap';
import { FaTimes } from "react-icons/fa";
import Form from 'react-bootstrap/Form';
import { GoPlus, GoAlertFill } from 'react-icons/go';
import FormControl from 'react-bootstrap/FormControl';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import { TagsInput } from "react-tag-input-component";
import ImageDragAndDrop from 'Components/Shared/ImageDragAndDrop';
import { Card, CardBody, CardFooter, ModalHeader, ModalBody, Modal } from 'reactstrap';
import NewPortfolio from 'Components/Forms/Portolio/NewPortfolio';
import GetUserPortfolioData from 'Utils/GetPortfolioData';
import DateTimePicker from 'Components/Shared/DateTimePicker';

const initialQuestionnaire2Data = Object.freeze({
    design_inspirations: '',
    lead_time: '',
    areas_of_specialization: '',
    design_process: '',
    is_designer: 1,
});

const BecomeDesignerForm = (props) => {
    const navigate = useNavigate();
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery();
    const type = query.get('type');
    const currentStep = props.step;
    const user = props.user;

    const [questionnaire2Data, setQuestionnaire2Data] = useState(initialQuestionnaire2Data);
    const [questionnaire2Loading, setQuestionnaire2Loading] = useState(false);
    const [userLoading, setUserLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);
    const [scheduleShow, setScheduleShow] = useState(false);
    const [uploadFileShow, setUploadFileShow] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageName, setImageName] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState([]);
    const [portfolio, setPortfolio] = useState([]);
    const [portfolioLoading, setPortfolioLoading] = useState([]);
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [currentAvailability, setCurrentAvailability] = useState([]);
    const [postType, setPostType] = useState('post');
    const [designerId, setDesignerId] = useState('');
    const [pricingStructure, setPricingStructure] = useState([{name: '', price: ''}]);
    const tagsInputRef = useRef(null);

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'token']);

    const token = cookies.token;
    const currentUser = cookies.currentUser;
    const current_user_id = cookies.currentUser;
    const signupType = cookies.signup_type;

    const addPricingStructure = () => {
        setPricingStructure([...pricingStructure, { name: '', price: '' }]);
    };

    const editPricingStructure = (index, updatedItem) => {
        const updatedPricingStructure = pricingStructure.map((item, idx) =>
            idx === index ? updatedItem : item
        );
        setPricingStructure(updatedPricingStructure);
    };

    const deletePricingStructure = (index) => {
        const updatedPricingStructure = pricingStructure.filter((_, idx) => idx !== index);
        setPricingStructure(updatedPricingStructure);
    };

    const fetchData = async (e) => {
        try {
            const portfolioData = await GetUserPortfolioData(e);
            if (portfolioData) {
                setPortfolio(portfolioData);
                setPortfolioLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
            }
            // Update state or perform other logic with userData
        } catch (error) {
            toast.error('An error occured. Please try again or contact the administrator.');
            // Handle the error, if needed
        }
    };

    const savePortfolioItems = (e) => {
        if (portfolioItems && portfolioItems.length > 0) {
            setPortfolioItems([...portfolioItems, e]);
        } else {
            setPortfolioItems([e]);
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

    const hideUpload = (e) => {
        setUploadFileShow(false);
    }

    const hideAll = (e) => {
        props.onHideAll(e);
    };

    const handleChange = (e) => {
        setQuestionnaire2Data({
            ...questionnaire2Data,
            [e.target.name]: e.target.value,
        })
    }

    const refreshPortfolio = (e) => {
        if (e) {
            setReloadCount(reloadCount + 1);
        }
    }

    async function questionnaire2Submit(e) {
        e.preventDefault();
        setQuestionnaire2Loading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'designer?current_user_id=' + current_user_id + '&token=' + token, { ...questionnaire2Data, areas_of_specialization: selectedSpecialization, user_id: currentUser, portfolio_items: portfolioItems, availability: availability, pricing_structure: pricingStructure, post_type: postType }).then((response) => {
            const status = response.data.status;
            if (status == 'Success') {
                const data = response.data.data;
                setCookie('currentUserDesigner', JSON.stringify(data.id), { path: '/' });
                setQuestionnaire2Loading(false);
                if (type && type == "designer_seller") {
                    navigate("/user/seller-form");
                } else {
                    navigate("/user/profile");
                }
                toast.success('Designer form submitted successfully!');
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setQuestionnaire2Loading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setQuestionnaire2Loading(false);
        });
    }

    useEffect(() => {
        fetchData(currentUser);
        if (user) {
            if (user.designer) {
                setQuestionnaire2Data(user.designer);
                const specialization = user.designer.areas_of_specialization;
                const current_availability = user.designer.availability.date_time;
                const pricing_structure = user.designer.pricing_structure;
                setSelectedSpecialization(specialization);
                setCurrentAvailability(current_availability);
                setAvailability(current_availability);
                setDesignerId(user.designer.id);
                if (pricing_structure) {
                    if (Array.isArray(pricing_structure)) {
                        setPricingStructure(pricing_structure);
                    }
                }
                setPostType('put');
            } else {
                setPostType('post');
            }
            setPortfolioItems(user.portfolio_items);
        }

        const handleDocumentClick = (event) => {
            // Check if the click is outside the TagsInput component
            if (tagsInputRef.current && !tagsInputRef.current.contains(event.target)) {
                // Simulate an "Enter" key press
                if (event.key === 'Enter') {
                    tagsInputRef.current.handleKeyDown({ key: 'Enter' });
                }
            }
        };

        // Attach the event listener when the component mounts
        document.addEventListener('click', handleDocumentClick);

        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [reloadCount, user]);

    return (
        <>
            <Container className='q1 narrow-750 my-4 text-dgray'>
                <Card className='bg-gray'>
                    <CardBody>
                        <Row>
                            <Col lg='12' className='text-center'>
                                <h2 className='form-title fs-24 py-3 pb-2 mb-3'><strong>Showcase your designs</strong></h2>
                            </Col>
                        </Row>
                        <Form onSubmit={questionnaire2Submit}>
                            <Row className="mb-3">
                                <Col lg="12">
                                    <Card className='mb-3 border-white'>
                                        <CardBody>
                                            <Form.Label className='mb-1 fs-18'>
                                                Areas of Specialization and Expertise
                                            </Form.Label>
                                            <Form.Label className="mb-3 small mt-1">
                                                Specify your areas of expertise (e.g., bridal wear, ready-to-wear women’s clothing, casual, haute couture, sustainable fashion)
                                            </Form.Label>
                                            <Form.Group>
                                                <TagsInput
                                                    value={selectedSpecialization}
                                                    onChange={setSelectedSpecialization}
                                                    name="areas_of_specialization"
                                                    className="form-control"
                                                    ref={tagsInputRef}
                                                    isEditOnRemove={true}
                                                    onBlur={(e) => {
                                                        const value = e.target.value;
                                                        if (!selectedSpecialization.includes(value) && value !== "") {
                                                            setSelectedSpecialization([...selectedSpecialization, value]);
                                                            e.target.value = "";
                                                        }
                                                    }}
                                                // placeholder="Fabric Type" // uncomment if needed
                                                />
                                            </Form.Group>
                                        </CardBody>
                                    </Card>
                                    <Card className='mb-3 border-white'>
                                        <CardBody>
                                            <Form.Label className='mb-3 fs-18'>
                                                Portfolio Showcase
                                            </Form.Label>
                                            <Card className='background-dashed'>
                                                {portfolioItems ?
                                                    <CardBody className={`${portfolioItems.length > 0 ? "pt-0" : ""}`}>
                                                        {portfolioItems.length > 0 ?
                                                            <>
                                                                <Row>
                                                                    {portfolioItems.map((portfolioItem, index) => (
                                                                        <>
                                                                            {portfolioItem.image_urls && portfolioItem.image_urls.length > 0 ?
                                                                                <>
                                                                                    {portfolioItem.image_urls.map((image, imageIndex) => (
                                                                                        <Col lg={4} key={image.id} className="image-preview mt-3">
                                                                                            <div className="image-dnd" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'portfolio/' + image.image_url + ")", minHeight: '190px' }}>
                                                                                                <div className="dnd-actions-overlay"></div>
                                                                                            </div>
                                                                                        </Col>
                                                                                    ))}
                                                                                </>
                                                                                :
                                                                                null
                                                                            }
                                                                        </>
                                                                    ))}
                                                                    <Col className="mt-3" lg={4}>
                                                                        <div onClick={toggleuploadFile} className="portfolio-grid-div add-more-box w-100 text-center cursor-pointer background-dashed" style={{ minHeight: '190px' }}>
                                                                            <GoPlus color="#a4a4a4" size="130px" className="mt-3" />
                                                                            <p className="text-dgray" style={{ marginTop: '-15px' }}>Add More</p>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </>
                                                            :
                                                            <Row className="align-items-center text-center my-5">
                                                                <Col>
                                                                    <Form.Label className="mb-1 fs-20">
                                                                        Upload your design
                                                                    </Form.Label>
                                                                    <Form.Label className="mb-4 fs-16 mt-1 small">
                                                                        Showcase your best work, get feedback, likes, and join a growing community.
                                                                    </Form.Label>
                                                                    <Button className='btn-primary'
                                                                        onClick={toggleuploadFile}
                                                                        type="button"
                                                                    >
                                                                        Upload your designs
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                        }

                                                    </CardBody>
                                                    :
                                                    <CardBody>
                                                        <Row className="align-items-center text-center my-5">
                                                            <Col>
                                                                <Form.Label className="mb-1 fs-20">
                                                                    Upload your design
                                                                </Form.Label>
                                                                <Form.Label className="mb-4 fs-16 mt-1 small">
                                                                    Showcase your best work, get feedback, likes, and join a growing community.
                                                                </Form.Label>
                                                                <Button className='btn-primary'
                                                                    onClick={toggleuploadFile}
                                                                    type="button"
                                                                >
                                                                    Upload your designs
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                }
                                            </Card>
                                        </CardBody>
                                    </Card>
                                    {/* <Card className='mb-3 border-white'>
                                        <CardBody>
                                            <Form.Label className='mb-1 fs-18 d-block'>
                                                Design Process Insights
                                            </Form.Label>
                                            <Form.Label className="mb-3 mt-1 small">
                                                Provide information about your design process, from ideation to creation.
                                            </Form.Label>
                                            <Form.Group>
                                                <Form.Control
                                                    as="textarea"
                                                    name="design_process"
                                                    rows={5} // You can adjust the number of rows as needed
                                                    value={questionnaire2Data.design_process}
                                                    placeholder=""
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </CardBody>
                                    </Card> */}
                                    <Card className='mb-3 border-white'>
                                        <CardBody>
                                            {/* <Form.Label className='mb-1 fs-18 d-block'>
                                                Lead Time and Pricing Structure
                                            </Form.Label>
                                            <Form.Label className="mb-3 mt-1 small">
                                                Provide information about the typical lead time for designing,
                                                creating, and delivering garments, along with transparent
                                                pricing structures, helps set expectations.
                                            </Form.Label>
                                            <Form.Label className="mb-3">
                                                Lead Time (No. of days)
                                            </Form.Label>
                                            <Form.Group className='mb-3'>
                                                <Form.Control
                                                    type="text"
                                                    name="lead_time"
                                                    value={questionnaire2Data.lead_time}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group> */}
                                            <Form.Label className="mb-1">
                                                Pricing Structure
                                            </Form.Label>
                                            <Form.Label className="mb-3 mt-1 small">
                                                Provide information about the typical lead time for designing,
                                                creating, and delivering garments, along with transparent
                                                pricing structures, helps set expectations.
                                            </Form.Label>
                                            <Form.Group>
                                                {pricingStructure.map((item, index) => (
                                                    <>
                                                        {pricingStructure.length > 1 ?
                                                            <div className="position-relative pe-5">
                                                                <Row className='mb-3' key={index}>
                                                                    <Col lg="4">
                                                                        <Form.Control
                                                                            type="text"
                                                                            value={item.name}
                                                                            onChange={(e) => editPricingStructure(index, { ...item, name: e.target.value })}
                                                                            placeholder="Name"
                                                                        />
                                                                    </Col>
                                                                    <Col lg="4">
                                                                        <Form.Control
                                                                            type="number"
                                                                            min="1"
                                                                            value={item.price}
                                                                            onChange={(e) => editPricingStructure(index, { ...item, price: parseFloat(e.target.value) })}
                                                                            placeholder="Price"
                                                                        />
                                                                    </Col>
                                                                    <Col lg="4">
                                                                        <Form.Control
                                                                            type="text"
                                                                            value={item.lead_time}
                                                                            onChange={(e) => editPricingStructure(index, { ...item, lead_time: e.target.value })}
                                                                            placeholder="Lead Time"
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                                <div className="remove-pricing-structure remove-btn cursor-pointer" onClick={() => deletePricingStructure(index)} >
                                                                    <FaTimes  size="20px" color="#ffffff" />
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className="position-relative">
                                                                <Row className='mb-3' key={index}>
                                                                    <Col lg="4">
                                                                        <Form.Control
                                                                            type="text"
                                                                            value={item.name}
                                                                            onChange={(e) => editPricingStructure(index, { ...item, name: e.target.value })}
                                                                            placeholder="Name"
                                                                        />
                                                                    </Col>
                                                                    <Col lg="4">
                                                                        <Form.Control
                                                                            type="number"
                                                                            min="1"
                                                                            value={item.price}
                                                                            onChange={(e) => editPricingStructure(index, { ...item, price: parseFloat(e.target.value) })}
                                                                            placeholder="Price"
                                                                        />
                                                                    </Col>
                                                                    <Col lg="4">
                                                                        <Form.Control
                                                                            type="text"
                                                                            value={item.lead_time}
                                                                            onChange={(e) => editPricingStructure(index, { ...item, lead_time: e.target.value })}
                                                                            placeholder="Lead Time"
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        }
                                                    </>
                                                ))}
                                                <Row>
                                                    <Col lg="12" className="text-right">
                                                        <Button onClick={addPricingStructure} className='btn-primary mt-3' type="button">Add More</Button>
                                                    </Col>
                                                </Row>
                                                {/* <Form.Control
                                                    as="textarea"
                                                    name="pricing_structure"
                                                    rows={5} // You can adjust the number of rows as needed
                                                    value={questionnaire2Data.pricing_structure}
                                                    placeholder=""
                                                    onChange={handleChange}
                                                /> */}
                                            </Form.Group>
                                        </CardBody>
                                    </Card>
                                    <Card className='border-white'>
                                        <CardBody>
                                        <Form.Label className='mb-1 fs-18 d-block'>
                                            Design Inspirations and Influences
                                        </Form.Label>
                                        <Form.Label className="mb-3 mt-1 small">
                                            Briefly describe the inspirations and influences that shape your design work.
                                        </Form.Label>
                                            <Form.Group>
                                                <Form.Control
                                                    as="textarea"
                                                    name="design_inspirations"
                                                    rows={5} // You can adjust the number of rows as needed
                                                    value={questionnaire2Data.design_inspirations}
                                                    placeholder=""
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </CardBody>
                                    </Card>
                                    {/* <Card className='mb-4 border-white'>
                                        <CardBody>
                                            <Form.Label className='mb-2 fs-18'>
                                                Calendar Availability
                                            </Form.Label>
                                            <Form.Group className="d-flex column-gap-10">
                                                <Form.Control
                                                    type="date"
                                                    name="target_date"
                                                    value={questionnaire2Data.target_date}
                                                    onChange={handleChange}
                                                    style={{maxWidth: '250px'}}
                                                />
                                                <Button className='btn-primary' onClick={toggleSchedule} type="button">Schedule</Button>
                                            </Form.Group>
                                        </CardBody>
                                    </Card> */}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="12" className="text-right">
                                    {questionnaire2Loading ?
                                        <Button className='btn-primary' type="button">Saving...</Button>
                                        :
                                        <Button className='btn-primary' type="submit">Save</Button>
                                    }
                                    {/* <span className="cursor-pointer text-black" onClick={function () { hideAll(3); }}>Skip <IoIosArrowRoundForward /></span> */}
                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
                </Card>
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
                            <NewPortfolio size="small" withDraft={false} onSuccess={refreshPortfolio} onCancel={hideUpload} onSave={savePortfolioItems} />
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
            {/* Schedule */}
            <Modal
                isOpen={scheduleShow}
                className='modal-preview'
                fade={false}
                centered
            >
                <ModalHeader className="pb-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button type='button' className='close react-modal-close' onClick={toggleSchedule} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </ModalHeader>
                <ModalBody>
                    <h4 className='text-center fs-25 fw-600'>Schedule</h4>
                    <Card>
                        <CardBody className="text-center py-5">
                            <GoAlertFill size="60px" color="#000" className="mb-2" />
                            <p className="fs-20 text-black">Under Construction</p>
                            {/* <DateTimePicker onTimeChange={handleTimeChange} onDone={handleDoneTimeChange} availability={currentAvailability} /> */}
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    );
};

export default BecomeDesignerForm;