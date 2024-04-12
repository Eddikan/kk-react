import React, { useEffect, useState, useRef } from 'react';
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
import ImageDragAndDrop from 'Components/Shared/ImageDragAndDrop';
import { Card, CardBody, CardFooter, ModalHeader, ModalBody, Modal } from 'reactstrap';
import NewProductShopManager from 'Components/Forms/Product/NewProductShopManager';
import GetUserProductsData from 'Utils/GetUserProductsData';
import DateTimePicker from 'Components/Shared/DateTimePicker';

const initialQuestionnaire3Data = Object.freeze({
    types_of_fabric: '',
    fabric_process_insights: '',
    pricing_structure : '',
    is_seller: 1,
});

const UploadProduct = ({ onStepPlusTwo, onStepMinusTwo, user }) => {
    const navigate = useNavigate();

    const [questionnaire3Data, setQuestionnaire3Data] = useState(initialQuestionnaire3Data);
    const [questionnaire3Loading, setQuestionnaire3Loading] = useState(false);
    const [userLoading, setUserLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);
    const [scheduleShow, setScheduleShow] = useState(false);
    const [uploadFileShow, setUploadFileShow] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageName, setImageName] = useState('');
    const [typesOfFabric, setTypesOfFabric] = useState([]);
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState([]);
    const [productItems, setProductItems] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [currentAvailability, setCurrentAvailability] = useState([]);
    const [postType, setPostType] = useState('post');
    const [sellerId, setSellerId] = useState('');
    const tagsInputRef = useRef(null);

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'token']);

    const token = cookies.token;
    const currentUser = cookies.currentUser;
    const signupType = cookies.signup_type;

    const fetchData = async (e) => {
        try {
            const productsData = await GetUserProductsData(e);
            if (productsData) {
                setProducts(productsData);
                setProductsLoading(false);
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

    const handleChange = (e) => {
        setQuestionnaire3Data({
            ...questionnaire3Data,
            [e.target.name]: e.target.value,
        })
    }

    const refreshProducts = (e) => {
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

    async function questionnaire3Submit(e) {
        e.preventDefault();
        setQuestionnaire3Loading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'seller?user_id=' + currentUser + '&token=' + token, {...questionnaire3Data, types_of_fabric: typesOfFabric, user_id: currentUser, products: productItems, availability: availability, post_type: postType  }).then((response) => {
            const success = response.data.status;
            if(success == 'Success') {
                onStepPlusTwo();
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
            if (user.seller) {
                setQuestionnaire3Data(user.seller);
                const types_of_fabric = user.seller.types_of_fabric;
                // const current_availability = user.seller.availability.date_time;
                setTypesOfFabric(types_of_fabric);
                // setCurrentAvailability(current_availability);
                // setAvailability(current_availability);
                setSellerId(user.seller.id);
                setPostType('put');
            } else {
                setPostType('post');
            }
            setProductItems(user.products);
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
                <Form onSubmit={questionnaire3Submit}>
                    <Row>
                        <Col lg="12">
                            <Card className='mb-4 border-white'>
                            <CardBody className='p-0 pt-3 pb-3'>
                                    <Card className='background-dashed'>
                                        {productItems ?
                                            <CardBody className={`${productItems.length > 0 ? "pt-0" : ""}`}>
                                                {productItems.length > 0 ?
                                                    <>
                                                        <Row>
                                                            {productItems.map((productItem, index) => (
                                                                <>
                                                                    {productItem.image_urls && productItem.image_urls.length > 0 ?
                                                                        <>
                                                                            {productItem.image_urls.map((image, imageIndex) => (
                                                                                <Col lg={4} key={image.id} className="image-preview mt-3">
                                                                                    <div className="image-dnd" style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'product/'+image.image_url+")", minHeight: '190px'}}>
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
                                                                <div onClick={toggleuploadFile} className="portfolio-grid-div add-more-box w-100 text-center cursor-pointer background-dashed" style={{minHeight: '190px'}}>
                                                                    <GoPlus color="#a4a4a4" size="130px" className="mt-3" />
                                                                    <p className="text-dgray" style={{marginTop: '-15px'}}>Add More</p>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                    :
                                                    <Row className="align-items-center text-center my-5">
                                                        <Col>
                                                            <div className="mb-3 fs-20">
                                                                Upload your products 
                                                            </div>
                                                            <div className="mb-4 fs-16 mt-1 small">
                                                                Share your fabric snapshot to uncover a realm of creative possibilities.
                                                            </div>
                                                            <Button className='btn-primary'
                                                                onClick={toggleuploadFile}
                                                                type="button"
                                                            >
                                                               Upload Your First Fabric
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
                                        }
                                    </Card>
                                </CardBody>
                            </Card>
                            

                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12" className="text-right">
                            <Button className='btn-back me-3' type="button" onClick={() => onStepMinusTwo()} >Back</Button>

                            {questionnaire3Loading ?
                                <Button className='btn-save' type="button">Saving...</Button>
                                :
                                <Button className='btn-save' type="submit">Next</Button>
                            }
                        </Col>
                    </Row>
                </Form>
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
                    <h2 className='modal-title fs-25 fw-600 text-center'>Upload your Fabrics</h2>
                    <Card className="border-0">
                        <CardBody className="p-2">
                            <NewProductShopManager size="small" withDraft={false} onSuccess={refreshProducts} onCancel={hideUpload} onSave={saveProductItems} />
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
           
        </>
    );
};

export default UploadProduct;