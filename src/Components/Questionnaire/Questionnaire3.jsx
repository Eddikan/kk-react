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
import { FaTimes } from 'react-icons/fa';
import { Card, CardBody, CardFooter, ModalHeader, ModalBody, Modal } from 'reactstrap';
import NewProduct from 'Components/Forms/Product/NewProduct';
import GetUserProductsData from 'Utils/GetUserProductsData';
import DateTimePicker from 'Components/Shared/DateTimePicker';

const initialQuestionnaire3Data = Object.freeze({
    types_of_fabric: '',
    fabric_process_insights: '',
    pricing_structure : '',
    is_seller: 1,
});

const Questionnaire3 = (props) => {
    const navigate = useNavigate();
    const currentStep = props.step;
    const user = props.user;
    const signupType = props.signupType;

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
    const [pricingStructure, setPricingStructure] = useState([{name: '', price: ''}]);

    const tagsInputRef = useRef(null);

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'token']);

    const token = cookies.token;
    const currentUser = cookies.currentUser;
    const selectedSignupType = cookies.signup_type;

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

    const hideAll = (e) => {
        props.onHideAll(e);
    };

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
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'seller?user_id=' + currentUser + '&token=' + token, {...questionnaire3Data, types_of_fabric: typesOfFabric, user_id: currentUser, products: productItems, availability: availability, post_type: postType, pricing_structure: pricingStructure  }).then((response) => {
            const success = response.data.status;
            if(success == 'Success') {
                const data = response.data.data;
                setCookie('currentUserSeller', JSON.stringify(data.id), { path: '/' });
                hideAll(4);
                setQuestionnaire3Loading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setQuestionnaire3Loading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setQuestionnaire3Loading(false);
        });
    };

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
                const pricing_structure = user.seller.pricing_structure;    
                if (pricing_structure) {
                    if (Array.isArray(pricing_structure)) {
                        setPricingStructure(pricing_structure);
                    }
                }
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
            <Container className='q1 narrow-750 py-5 px-4 mt-5 text-dgray'>
                <Row>
                    <Col lg='12' className='text-center'>
                        {/* <h2 className='form-title pb-2 mb-3'>Showcase the rich textures, and pattern of your fabrics</h2> */
                        <h2 className='form-title pb-2 mb-3'>Showcase your fabrics</h2>}
                    </Col>
                </Row>
                <Form onSubmit={questionnaire3Submit}>
                    <Row className="mb-3">
                        <Col lg="12">
                            <Card className='mb-4 border-white'>
                                <CardBody>
                                    <Form.Label className='mb-1 fs-18'>
                                        Type of Fabrics
                                    </Form.Label>
                                    <br />
                                    <Form.Label className="mb-3 small mt-1">
                                        Specify type of fabrics (e.g., linen, cotton, silk)
                                    </Form.Label>
                                    <Form.Group>
                                        <TagsInput
                                            value={typesOfFabric}
                                            onChange={setTypesOfFabric}
                                            name="types_of_fabrics"
                                            className="form-control"
                                            ref={tagsInputRef}
                                            isEditOnRemove={true}
                                            onBlur={(e) => {
                                                const value = e.target.value;
                                                if (!typesOfFabric.includes(value) && value !== "") {
                                                    setTypesOfFabric([...typesOfFabric, value]);
                                                    e.target.value = "";
                                                }
                                            }}
                                            required
                                            // placeholder="Fabric Type" // uncomment if needed
                                        />
                                    </Form.Group>
                                </CardBody>
                            </Card>
                            <Card className='mb-4 border-white'>
                                <CardBody>
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
                                                                    {productItem.final_product_image_urls && productItem.final_product_image_urls.length > 0 ?
                                                                        <>
                                                                            {productItem.final_product_image_urls.map((image, imageIndex) => (
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
                                                            <Form.Label className="mb-1 fs-20">
                                                                Upload your products 
                                                            </Form.Label>
                                                            <Form.Label className="mb-4 fs-16 mt-1 small">
                                                                Share your fabric snapshot to uncover a realm of creative possibilities.
                                                            </Form.Label>
                                                            <Button className='btn-primary'
                                                                onClick={toggleuploadFile}
                                                                type="button"
                                                            >
                                                                Upload your fabrics
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
                                                            Upload your products 
                                                        </Form.Label>
                                                        <Form.Label className="mb-4 fs-16 mt-1 small">
                                                            Share your fabric snapshot to uncover a realm of creative possibilities.
                                                        </Form.Label>
                                                        <Button className='btn-primary'
                                                            onClick={toggleuploadFile}
                                                            type="button"
                                                        >
                                                            Upload your fabrics
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        }
                                    </Card>
                                </CardBody>
                            </Card>
                            <Card className='mb-4 border-white'>
                                <CardBody>
                                    <Form.Label className='mb-1 fs-18 d-block'>
                                        Fabric Process Insights
                                    </Form.Label>
                                    <Form.Label className="mb-3 mt-1 small">
                                        Provide information about fabric.
                                    </Form.Label>
                                    <Form.Group>
                                        <Form.Control
                                            as="textarea"
                                            name="fabric_process_insights"
                                            rows={5} // You can adjust the number of rows as needed
                                            value={questionnaire3Data.fabric_process_insights}
                                            placeholder=""
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </CardBody>
                            </Card>
                            <Card className='mb-4 border-white'>
                                <CardBody>
                                    <Form.Label className='mb-1 fs-18 d-block'>
                                        Pricing Structure
                                    </Form.Label>
                                    <Form.Label className="mb-3 mt-1 small">
                                        Provide information about the typical pricing structures, helps set expectations.
                                    </Form.Label>
                                    <Form.Group>
                                        {/* <Form.Control
                                            as="textarea"
                                            name="pricing_structure"
                                            rows={5} // You can adjust the number of rows as needed
                                            value={questionnaire3Data.pricing_structure}
                                            placeholder=""
                                            onChange={handleChange}
                                        /> */}
                                        {pricingStructure.map((item, index) => (
                                            <>
                                                {pricingStructure.length > 1 ?
                                                    <div className="position-relative pe-5">
                                                        <Row className='mb-3' key={index}>
                                                            <Col lg="6">
                                                                <Form.Control
                                                                    type="text"
                                                                    value={item.name}
                                                                    onChange={(e) => editPricingStructure(index, { ...item, name: e.target.value })}
                                                                    placeholder="Name"
                                                                />
                                                            </Col>
                                                            <Col lg="6">
                                                                <Form.Control
                                                                    type="text"
                                                                    value={item.price}
                                                                    onChange={(e) => editPricingStructure(index, { ...item, price: e.target.value })}
                                                                    placeholder="Price"
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
                                                            <Col lg="6">
                                                                <Form.Control
                                                                    type="text"
                                                                    value={item.name}
                                                                    onChange={(e) => editPricingStructure(index, { ...item, name: e.target.value })}
                                                                    placeholder="Name"
                                                                />
                                                            </Col>
                                                            <Col lg="6">
                                                                <Form.Control
                                                                    type="text"
                                                                    value={item.price}
                                                                    onChange={(e) => editPricingStructure(index, { ...item, price: e.target.value })}
                                                                    placeholder="Price"
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
                                    </Form.Group>
                                </CardBody>
                            </Card>
{/*                             
                            <Card className='mb-4 border-white'>
                                <CardBody>
                                    <Form.Label className='mb-2 fs-18'>
                                        Calendar Availability
                                    </Form.Label>
                                    <Form.Group className="d-flex column-gap-10">
                                        <Form.Control
                                            type="date"
                                            name="target_date"
                                            value={questionnaire3Data.target_date}
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
                            {signupType == "seller" ||  signupType == "designer_seller" ?
                                <> 
                                    {signupType == "designer_seller" && selectedSignupType == "designer_seller"?
                                        <>
                                            <Button className='btn-outline me-3' type="button" onClick={function () { hideAll(2); }}>Back</Button>
                                        </>
                                        :
                                        <Button className='btn-outline me-3' type="button" onClick={function () { hideAll(0); }}>Back</Button>
                                    }
                                </>
                                :
                                <Button className='btn-outline me-3' type="button" onClick={function () { hideAll(0); }}>Back</Button>
                            }
                            {questionnaire3Loading ?
                                <Button className='btn-primary me-3' type="button">Saving...</Button>
                                :
                                <Button className='btn-primary me-3' type="submit">Save</Button>
                            }
                            {/* <span className="cursor-pointer text-black" onClick={function () { hideAll(3); }}>Skip <IoIosArrowRoundForward /></span> */}
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
                    <h2 className='modal-title fs-25 fw-600 text-center'>Upload your Fabrics</h2>
                    <Card className="border-0">
                        <CardBody className="p-2">
                            <NewProduct size="small" withDraft={false} onSuccess={refreshProducts} onCancel={hideUpload} onSave={saveProductItems} />
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

export default Questionnaire3;