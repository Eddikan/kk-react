import React, { useEffect, useState, useRef } from 'react';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import ImageDragAndDrop from 'Components/Shared/ImageDragAndDrop';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { TagsInput } from "react-tag-input-component";
import axios from 'axios';
import Countries from 'Utils/Countries';
import ResponsiveEmbedVideo from 'Components/Shared/ResponsiveEmbeddedVideo';
import ResponsiveVideo from 'Components/Shared/ResponsiveVideo';
import VideoDragAndDrop from 'Components/Shared/VideoDragAndDrop';
import DetailBuilder from 'Components/Shared/DetailBuilder';


const initialProductData = Object.freeze({
    image_urls: [],
    name: '',
    description: '',
    colors: [],
    weave: '',
    weight: 0,
    width: 0,
    pattern: '',
    texture: '',
    opacity: '',
    stretch: '',
    drape: '',
    care_instructions: '',
    unit_measurement: '',
    price: 0,
    quantity: 0,
    certifications: [],
    country: '',
    notes: '',
    video_demo_url: '',
    video_demo_type: ''

});

const NewProductNormal = (props) => {
    const size = props.size;
    const withDraft = props.withDraft;
    const formRef = useRef(null);

    const [measurementGuide, setMeasurementGuide] = useState([]);
    const [productData, setProductData] = useState(initialProductData);
    const [productLoading, setProductLoading] = useState(false);
    const [productDraftLoading, setProductDraftLoading] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);
    const [colors, setColors] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [otherComposition, setOtherComposition] = useState('');
    const [composition, setComposition] = useState('');
    const [weave, setWeave] = useState('');
    const [otherWeave, setOtherWeave] = useState('');
    const [unitMeasurement, setUnitMeasurement] = useState('meter');
    const [otherUnitMeasurement, setOtherUnitMeasurement] = useState('');
    const [categories, setCategories] = useState([]);

    const currentUser = cookies.currentUser;
    const token = cookies.token;

    const reloadPage = (e) => {
        props.onReloadPage(e);
    };

    const formSuccess = (e) => {
        props.onSuccess(e);
    }

    const handleCancel = () => {
        props.onCancel(true);
    }

    const saveProductItems = (e) => {
        props.onSave(e);
    };

    const measurementGuideSave = (e) => {
        setMeasurementGuide(e);
        console.log(e);
    }

    const handleChange = (e) => {
        var { name, value } = e.target;
        if (name == "composition" && value != "Other") {
            setOtherComposition("");
            setComposition("");
        }
        setProductData({
            ...productData,
            [name]: value,
        })
    };

    const handleChangeVideoType = (e) => {
        var { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value,
            video_demo_url: ''
        })
    };

    const handleChangeComposition = (e) => {
        var { name, value } = e.target;
        setOtherComposition("");
        setComposition(value);

    };

    const handleChangeOtherComposition = (e) => {
        var { name, value } = e.target;
        setOtherComposition(value);
    };

    const handleChangeWeave = (e) => {
        var { name, value } = e.target;
        setOtherWeave("");
        setWeave(value);
    };

    const handleChangeOtherWeave = (e) => {
        var { name, value } = e.target;
        setOtherWeave(value);
    };

    const handleChangeUnitMeasurement = (e) => {
        var { name, value } = e.target;
        setOtherUnitMeasurement("");
        setUnitMeasurement(value);

    };

    const handleChangeOtherUnitMeasurement = (e) => {
        var { name, value } = e.target;
        setOtherUnitMeasurement(value);
    };

    const handleChangeCheckbox = (isChecked) => {
        setProductData({
            ...productData,
            eco_friendly: isChecked ? 1 : 0,
        });
    };

    const handleVideoChange = (url) => {
        setProductData({
            ...productData,
            video_demo_url: url,
        });
    }

    const handleImagesChange = (images) => {
        // Use the images as needed in the parent component (e.g., for uploading)
        setProductData({
            ...productData,
            image_urls: images,
        });
    };

    useEffect(() => {
        setProductData({
            ...productData,
            user_id: currentUser,
        });
    }, [reloadCount]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            // Your resize logic here
        });

        if (formRef.current) {
            resizeObserver.observe(formRef.current);
        }

        return () => {
            if (formRef.current) {
                resizeObserver.unobserve(formRef.current);
            }
        };
    }, []);


    async function ProductSubmit(e) {
        e.preventDefault();
        if (size == "small") {
            setProductLoading(true);
            setTimeout(function () {
                setProductLoading(false);
                saveProductItems({ ...productData, composition: otherComposition && otherComposition != "" ? otherComposition : composition, weave: otherWeave && otherWeave != "" ? otherWeave : weave, unit_measurement: otherUnitMeasurement && otherUnitMeasurement != "" ? otherUnitMeasurement : unitMeasurement, colors: colors, certifications: certifications, status: 'Active' });
                handleCancel();
            }, 1000);
        } else {
            if (productData.image_urls) {
                setProductLoading(true);
                axios.post(process.env.REACT_APP_API_ENDPOINT + 'product?user_id=' + currentUser + '&token=' + token, { ...productData, composition: otherComposition && otherComposition != "" ? otherComposition : composition, weave: otherWeave && otherWeave != "" ? otherWeave : weave, unit_measurement: otherUnitMeasurement && otherUnitMeasurement != "" ? otherUnitMeasurement : unitMeasurement, colors: colors, certifications: certifications, status: 'Active' }).then((response) => {
                    const success = response.data.status;
                    if (success == 'Success') {
                        toast.success('Fabric added successfully!');
                        setProductLoading(false);
                        reloadPage(true);
                        formSuccess(true);
                    } else {
                        toast.error('An error occured. Please try again or contact the administrator.');
                        setProductLoading(false);
                        formSuccess(false);
                    }
                }).catch(() => {
                    toast.error('An error occured. Please try again or contact the administrator.');
                    setProductLoading(false);
                    formSuccess(false);
                });

            } else {
                toast.error('Please upload design images!');
            }
        }
    };

    async function ProductDraftSubmit(e) {
        e.preventDefault();
        setProductDraftLoading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'product?user_id=' + currentUser + '&token=' + token, { ...productData, composition: otherComposition && otherComposition != "" ? otherComposition : composition, weave: otherWeave && otherWeave != "" ? otherWeave : weave, unit_measurement: otherUnitMeasurement && otherUnitMeasurement != "" ? otherUnitMeasurement : unitMeasurement, colors: colors, certifications: certifications, status: 'Draft' }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                toast.success('Fabric saved as draft successfully!');
                setProductDraftLoading(false);
                reloadPage(true);
                formSuccess(true);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setProductDraftLoading(false);
                formSuccess(true);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setProductDraftLoading(false);
            formSuccess(true);
        });
    };

    return (
        <>
            <Form onSubmit={ProductSubmit} ref={formRef}>
                <Row>
                    <Col lg='12'>
                        <div>
                            <Card className='mb-3'>
                                <Card.Body className='bg-lgray'>
                                    <ImageDragAndDrop type="product" onImagesChange={handleImagesChange} size={size} />
                                </Card.Body>
                            </Card>
                            <Card className="mb-3">
                                <Card.Body className='bg-lgray'>
                                    <Form.Group className='mb-3 mt-2'>
                                        <Form.Label>Name</Form.Label>
                                        <FormControl type='text' name='name' value={productData.name} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                    </Form.Group>
                                    <Form.Group className='my-3'>
                                        <Form.Label>Description</Form.Label>
                                        <FormControl as="textarea"
                                            name="description"
                                            rows={3} // You can adjust the number of rows as needed
                                            value={productData.description}
                                            placeholder=''
                                            onChange={handleChange} required />
                                    </Form.Group>

                                    <Form.Group className='my-3'>
                                        <Form.Label>Category</Form.Label>
                                        <FormControl
                                            type='text'
                                            name='name'
                                            // value={productData.name} 
                                            className='mr-sm-2'
                                            //  onChange={handleChange} 
                                            required placeholder='' />
                                    </Form.Group>

                                    <Form.Group className='my-3'>
                                        <Form.Label>Season</Form.Label>
                                        <FormControl
                                            type='text'
                                            name='name'
                                            // value={productData.name} 
                                            className='mr-sm-2'
                                            //  onChange={handleChange} 
                                            required placeholder='' />
                                    </Form.Group>

                                    <Form.Group className='my-3'>
                                        <Form.Label>Color</Form.Label>
                                        <FormControl
                                            type='text'
                                            name='name'
                                            // value={productData.name} 
                                            className='mr-sm-2'
                                            //  onChange={handleChange} 
                                            required placeholder='' />
                                    </Form.Group>

                                    <Form.Group className='my-3'>
                                        <Form.Label>Materials</Form.Label>
                                        <FormControl
                                            type='text'
                                            name='name'
                                            // value={productData.name} 
                                            className='mr-sm-2'
                                            //  onChange={handleChange} 
                                            required placeholder='' />
                                    </Form.Group>

                                    <Form.Group className='my-3'>
                                        <Form.Label>Lead Time</Form.Label>
                                        <FormControl
                                            type='text'
                                            name='name'
                                            // value={productData.name} 
                                            className='mr-sm-2'
                                            //  onChange={handleChange} 
                                            required placeholder='' />
                                    </Form.Group>

                                    <Form.Group className='my-3'>
                                        <Form.Label>Pricing Structure</Form.Label>
                                        <FormControl
                                            type='text'
                                            name='name'
                                            // value={productData.name} 
                                            className='mr-sm-2'
                                            //  onChange={handleChange} 
                                            required placeholder='' />
                                    </Form.Group>

                                    <Form.Group className='my-3'>
                                        <Form.Label>Tags</Form.Label>
                                        <FormControl
                                            type='text'
                                            name='name'
                                            // value={productData.name} 
                                            className='mr-sm-2'
                                            //  onChange={handleChange} 
                                            required placeholder='' />
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                    <Col lg="12" className="text-right mt-4">
                        <Button className='btn-outline me-3' type="button"
                        // onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        {productLoading ?
                            <Button className='btn-primary' type="button">{size == "small" ? "Uploading..." : "Saving..."}</Button>
                            :
                            <Button className='btn-primary' type="submit">{size == "small" ? "Upload" : "Save"}</Button>
                        }
                        {withDraft ?
                            <>
                                {productDraftLoading ?
                                    <span className="cursor-pointer text-black ms-3">Saving as Draft...</span>
                                    :
                                    <span className="cursor-pointer text-black ms-3"
                                    // onClick={ProductDraftSubmit}
                                    >Save as Draft <HiOutlineArrowLongRight /></span>
                                }
                            </>
                            :
                            null
                        }
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default NewProductNormal;