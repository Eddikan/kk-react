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
import { ImLeaf } from 'react-icons/im';

import Loading from 'Components/Shared/Loading';
import PlaceholderImage from 'Assets/images/placeholders/image.png';

const initialQuestionnaire3Data = Object.freeze({
    types_of_fabric: '',
    fabric_process_insights: '',
    pricing_structure : '',
    is_seller: 1,
});

const UploadProduct = ({ onStepPlusTwo, onStepMinusTwo, user, singleStep }) => {
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
    const current_user_id = cookies.currentUser;
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

    const toggleNextTab = () => {
        onStepPlusTwo();
    }

    async function submitFinish(e) {
        setQuestionnaire3Loading(true);

        e.preventDefault();
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?current_user_id=' + current_user_id + '&token=' + token, { shop_completed: 1 }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                const user = response.data.data.user;
                const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer, shop_completed: user.shop_completed, profile_completeness: user.profile_completeness  }
                setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                onStepPlusTwo();
                setQuestionnaire3Loading(true);
            } else {
                const errors = response.data.errors;
                setQuestionnaire3Loading(true);
            }
        }).catch(() => {
            toast.error('Something went wrong, please contact the administrator!');
            setQuestionnaire3Loading(true);
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
                    <Row>
                        <Col lg="12">
                            <Card className='mb-4 border-white'>
                                <CardBody className='p-0 pt-3 pb-3'>
                                {productsLoading ?
                                    <>
                                        <p className='text-center mb-3 mt-3'>
                                            <Loading className="bg-white loading-height" />
                                        </p>
                                    </>
                                    :
                                    <>
                                        {products && products.length > 0 ?
                                            <>
                                                <Row className="portfolio-row">
                                                    {products.map((product, index) => {
                                                        if (product.image_urls?.[0]?.image_url) {
                                                            var productImage = process.env.REACT_APP_STORAGE_URL + 'product/' + product.image_urls[0].image_url;
                                                        } else {
                                                            var productImage = PlaceholderImage;
                                                        }
                                                        var wishlist_user_ids = product.wishlist_user_ids;
                                                        const userWishlist = wishlist_user_ids.includes(currentUser);
                                                        return (
                                                            <Col className={`portfolio-grid mb-3`} xs="4" md="2">
                                                                <div className={`portfolio-grid-div w-100 ${product.collection_type == "Limited" ? "limited" : " "} ${product.status == "Draft" ? "draft" : ""}`} style={{ backgroundImage: "url(" + productImage + ")" }}>
                                                                    <div className="portfolio-overlay">
                                                                        
                                                                    </div>
                                                                    <a className="text-decoration-none">
                                                                        <div className="portfolio-overlay" style={{ background: 'transparent', height: '85%', bottom: 0 }}></div>
                                                                    </a>
                                                                </div>

                                                                <div className='d-flex align-items-center'>
                                                                    <h2 className="text-black text-decoration-none rufina-family fs-18 mt-2 pb-3 ellipsis-products">{product.name ?? "-"}</h2>
                                                                    {product.eco_friendly != null && product.eco_friendly != '' && (
                                                                        <span className='fs-14 text-no-wrap mx-2 green-leaf-tooltip'>
                                                                            <div className='tooltip-content'>
                                                                                <span className="green-leaf-tooltiptext"></span>
                                                                            </div>
                                                                            <ImLeaf color="#55d140" className='mb-3' />
                                                                        </span>
                                                                    )}
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
                                                            <p className="text-center mb-3">The user doesn't have a fabric to showcase their work and experience.</p>
                                                        </div>
                                                    </Card.Body>
                                                </Card> */}

                                                <Row className="align-items-center text-center my-5">
                                                    <Col>
                                                        <Form.Label className="mb-1 fs-20">
                                                            Upload your products
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
                                                            Upload your fabrics
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
                            {singleStep ?
                                null
                                :
                                <Button className='btn-back me-3' type="button" onClick={() => onStepMinusTwo()} >Back</Button>
                            }
                            {questionnaire3Loading ?
                                <Button className='btn-save' type="button">Saving...</Button>
                                :
                                // <Button className='btn-save' type="button" onClick={toggleNextTab}>Next</Button>
                                    <Button className='btn-save' onClick={submitFinish} type="button">Next</Button>
                            }
                        </Col>
                    </Row>
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