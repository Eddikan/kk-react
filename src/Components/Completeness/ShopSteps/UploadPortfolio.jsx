import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { BsThreeDots } from "react-icons/bs";
import Form from 'react-bootstrap/Form';
import { GoPlus, GoAlertFill } from 'react-icons/go';
import FormControl from 'react-bootstrap/FormControl';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import { TagsInput } from "react-tag-input-component";
import ImageDragAndDrop from 'Components/Shared/ImageDragAndDrop';
import { Card, CardBody, CardFooter, ModalHeader, ModalBody, Modal } from 'reactstrap';
import NewPortfolioShopManager from 'Components/Forms/Portolio/NewPortfolioShopManager';
import GetUserPortfolioData from 'Utils/GetUserPortfolioData';
import DateTimePicker from 'Components/Shared/DateTimePicker';
import Loading from 'Components/Shared/Loading';
import PlaceholderImage from 'Assets/images/placeholders/image.png';

const initialQuestionnaire2Data = Object.freeze({
    design_inspirations: '',
    pricing_structure: '',
    lead_time: '',
    areas_of_specialization: '',
    design_process: '',
    is_designer: 1,
});

const UploadPortfolio = ({ onStepPlusTwo, onStepMinusTwo, user }) => {
    const navigate = useNavigate();

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
    const [portfolioDesigner, setPortfolioDesigner] = useState([]);
    const tagsInputRef = useRef(null);

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'token']);

    const token = cookies.token;
    const currentUser = cookies.currentUser;
    const signupType = cookies.signup_type;

    const fetchData = async (e) => {
        try {
            const portfolioData = await GetUserPortfolioData(e);
            if (portfolioData) {
                setPortfolio(portfolioData);
                setPortfolioDesigner(portfolioData.user)
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

    const handleTimeChange = (e) => {
        setAvailability(e);
    }

    const hideUpload = (e) => {
        setUploadFileShow(false);
    }

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

    const handleDoneTimeChange = (e) => {
        setScheduleShow(false);
        setCurrentAvailability(availability);
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

    const toggleNextTab = () => {
        onStepPlusTwo();
    }

    useEffect(() => {
        fetchData(currentUser);

        // if (user){
        //     setPortfolioItems(user.portfolio_items);
        // }

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
                {/* <Form onSubmit={questionnaire2Submit}> */}
                    <Row>
                        <Col lg="12">
                            <Card className='mb-4 border-white'>
                                <CardBody className='p-0 pt-3 pb-3'>

                                        {/* {portfolioItems ?
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
                                                            <div className="mb-3 fs-20">
                                                                Upload your design
                                                            </div>
                                                            <div className="mb-4 fs-16 mt-1 small">
                                                                Showcase your best work, get feedback, likes, and join a growing community.
                                                            </div>
                                                            <Button className='btn-primary'
                                                                onClick={toggleuploadFile}
                                                                type="button"
                                                            >
                                                                Upload Your First Design
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
                                                            Upload Your First Shot
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        } */}
                                        {portfolioLoading ?
                                            <>
                                                <p className='text-center mb-3 mt-3'>
                                                    <Loading className="bg-white loading-height" />
                                                </p>
                                            </>
                                            :
                                            <>
                                                {portfolio && portfolio.length > 0 ?
                                                    <>
                                                        <Row className="portfolio-row">
                                                            {portfolio.map((object, index) => {
                                                                if (object.image_urls?.[0]?.image_url) {
                                                                    var portfolioImage = process.env.REACT_APP_STORAGE_URL + 'portfolio/' + object.image_urls[0].image_url;
                                                                } else {
                                                                    var portfolioImage = PlaceholderImage;
                                                                }
                                                                return (
                                                                    <Col className={`portfolio-grid mb-3`} xs="4" md="2">
                                                                        <div
                                                                            className={`portfolio-grid-div cursor-pointer w-100 ${object.collection_type == "Limited" ? "limited" : " "} ${object.status == "Draft" ? "draft" : ""}`}
                                                                            style={{ backgroundImage: "url(" + portfolioImage + ")" }}
                                                                        >
                                                                            <div>
                                                                                <a>
                                                                                    <div className="portfolio-overlay portfolio-toggle">
                                                                                        <div className="portfolio-details">
                                                                                            {object.status == "Draft" ?
                                                                                                <span className="text-warning small fw-600">Draft</span>
                                                                                                :
                                                                                                null
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </a>
                                                                            </div>
                                                                        </div>

                                                                        <div className='margin-img ellipsis-portfolio'>
                                                                            <span className="text-black text-decoration-none portfolio-name-img">{object.name ?? "-"}</span>
                                                                        </div>
                                                                    </Col>
                                                                )
                                                            })}
                                                            <Col className="portfolio-grid mb-3" xs="4" md="2">
                                                                <div onClick={toggleuploadFile} className="portfolio-grid-div add-more-box w-100 text-center cursor-pointer background-dashed">
                                                                    <GoPlus color="#a4a4a4" size="150px" className="mt-3" />
                                                                    <p className="text-dgray" style={{ marginTop: '-15px' }}>Add More</p>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                    :
                                                    <>

                                                        {/* <Card className='border-none'>
                                                            <Card.Body className="image-drop-container pt-5 pb-5">
                                                                <div className="text-center">
                                                                    <p className="text-center mb-3">The user doesn't have a portfolio to showcase their work and experience.</p>
                                                                </div>
                                                            </Card.Body>
                                                        </Card> */}

                                              
                                                            <Row className="align-items-center text-center my-5">
                                                                <Col>
                                                                    <Form.Label className="mb-1 fs-20">
                                                                        Upload your designs
                                                                    </Form.Label>
                                                                    <br />
                                                                    <Form.Label className="mb-4 fs-16 mt-1 small">
                                                                        Showcase your best work, get feedback, likes, and join a growing community.
                                                                    </Form.Label>
                                                                    <br />
                                                                    <Button className='btn-primary'
                                                                        onClick={toggleuploadFile}
                                                                        type="button"
                                                                    >
                                                                        Upload
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                    
                                                    </>
                                                }
                                            </>
                                        }
                                
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12" className="text-right">
                            <Button className='btn-back me-3' type="button" onClick={() => onStepMinusTwo()} >Back</Button>
                            
                            {questionnaire2Loading ?
                                <Button className='btn-save' type="button">Saving...</Button>
                                :
                                <Button className='btn-save' type="button" onClick={toggleNextTab}>Next</Button>
                            }
                            
                        </Col>
                    </Row>
                {/* </Form> */}

            <Modal
                isOpen={uploadFileShow}
                className='modal-preview'
                fade={false}
                style={{ minWidth: '1000px' }}
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
                            <NewPortfolioShopManager size="small" withDraft={false} onSuccess={refreshPortfolio} onCancel={hideUpload} onSave={savePortfolioItems} />
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
           
        </>
    );
};

export default UploadPortfolio;