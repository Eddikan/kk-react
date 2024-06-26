import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { FaTimes } from 'react-icons/fa';
import { GoPlus, GoAlertFill } from 'react-icons/go';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import { TagsInput } from "react-tag-input-component";
import { Card, CardBody, ModalHeader, ModalBody, Modal } from 'reactstrap';
import NewProduct from 'Components/Forms/Product/NewProduct';
import GetUserProductsData from 'Utils/GetUserProductsData';

const becomeSellerData = Object.freeze({
    types_of_fabric: '',
    fabric_process_insights: '',
    pricing_structure : '',
    is_seller: 1,
});

const BecomeSellerForm = (props) => {
    const navigate = useNavigate(); 
    const user = props.user;
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery();
    const type = query.get('type');

    const [questionnaire3Data, setQuestionnaire3Data] = useState(becomeSellerData);
    const [questionnaire3Loading, setQuestionnaire3Loading] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [scheduleShow, setScheduleShow] = useState(false);
    const [uploadFileShow, setUploadFileShow] = useState(false);
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

    async function questionnaire3Submit(e) {
        e.preventDefault();
        setQuestionnaire3Loading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'seller?user_id=' + currentUser + '&token=' + token, {...questionnaire3Data, types_of_fabric: typesOfFabric, user_id: currentUser, products: productItems, availability: availability, pricing_structure: pricingStructure, post_type: postType  }).then((response) => {
            const status = response.data.status;
            if(status == 'Success') {
                const data = response.data.data;
                setCookie('currentUserSeller', JSON.stringify(data.id), { path: '/' });
                setQuestionnaire3Loading(false);
                navigate("/user/profile");
                toast.success('Designer form submitted successfully!');
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
                const pricing_structure = user.seller.pricing_structure;
                // const current_availability = user.seller.availability.date_time;
                setTypesOfFabric(types_of_fabric);
                // setCurrentAvailability(current_availability);
                // setAvailability(current_availability);
                setSellerId(user.seller.id);
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
            <Container className='q1 narrow-750 my-4 text-dgray'>
                <Card className='bg-gray'>
                    <CardBody>
                        <Row>
                            <Col lg='12' className='text-center'>
                                <h2 className='form-title fs-24 py-3 pb-2 mb-3'><strong>Showcase your fabrics</strong></h2>
                            </Col>
                        </Row>
                        <Form onSubmit={questionnaire3Submit}>
                            <Row className="mb-3">
                                <Col lg="12">
                                    <Card className='mb-3 border-white'>
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
                                    <Card className='mb-3 border-white'>
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
                                    </Card> */}
                                    {/* <Card className='border-white'>
                                        <CardBody>
                                            <Form.Label className='mb-1 fs-18 d-block'>
                                                Pricing Structure
                                            </Form.Label>
                                            <Form.Label className="mb-3 mt-1 small">
                                                Provide information about the typical pricing structures, helps set expectations.
                                            </Form.Label>
                                            <Form.Group>
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
                                                </Row> */}
                                                 {/* <Form.Control
                                                    as="textarea"
                                                    name="pricing_structure"
                                                    rows={5} // You can adjust the number of rows as needed
                                                    value={questionnaire3Data.pricing_structure}
                                                    placeholder=""
                                                    onChange={handleChange}
                                                /> */}
                                            {/* </Form.Group>
                                        </CardBody>
                                    </Card> */}
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
                                    {type && type == "designer_seller" ?
                                        <Button href="/user/designer-form?type=designer_seller" className="btn-outline me-3">Back</Button>
                                        :
                                        null
                                    }
                                    {questionnaire3Loading ?
                                        <Button className='btn-primary' type="button">Saving...</Button>
                                        :
                                        <Button className='btn-primary ' type="submit">Save</Button>
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

export default BecomeSellerForm;