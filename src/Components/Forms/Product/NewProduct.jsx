import React, { useEffect, useState, useRef } from 'react';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import ImageDragAndDrop from 'Components/Shared/ImageDragAndDrop';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { TagsInput } from "react-tag-input-component";
import axios from 'axios';
import Countries from 'Utils/Countries';

const initialProductData = Object.freeze({
    image_urls: [],
    name: '',
    description: '',
    colors: [],
    composition: '',
    categories: [],
    weave: '',
    weight: 0,
    width: 0,
    pattern: '',
    texture: '',
    opacity: '',
    stretch: '',
    drape: '',
    care_instructions: '',
    price: 0,
    quantity: 0,
    certifications: [],
    country: '',
    notes: '',
});

const NewProduct = (props) => {
    const size = props.size;
    const withDraft = props.withDraft;
    const formRef = useRef(null);

    const [productData, setProductData] = useState(initialProductData);
    const [productLoading, setProductLoading] = useState(false);
    const [productDraftLoading, setProductDraftLoading] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);
    const [colors, setColors] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [categories, setCategories] = useState([])

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
    }

    const handleChange = (e) => {
        setProductData({
            ...productData,
            [e.target.name]: e.target.value,
        })
    };

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
            setTimeout(function(){
                setProductLoading(false);
                saveProductItems({...productData, colors: colors, categories: categories, certifications: certifications, status: 'Active' });
                handleCancel();
            }, 1000);
        } else {
            if (productData.image_urls) {
                setProductLoading(true);
                axios.post(process.env.REACT_APP_API_ENDPOINT + 'product?user_id=' + currentUser + '&token=' + token, {...productData, colors: colors, categories: categories, certifications: certifications, status: 'Active' }).then((response) => {
                    const success = response.data.status;
                    if(success == 'Success') {
                        toast.success('Design added successfully!');
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
                    formSuccess(true);
                });
            } else {
                toast.error('Please upload design images!');
            }
        }
    };

    async function ProductDraftSubmit(e) {
        e.preventDefault();
        setProductDraftLoading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'product?user_id=' + currentUser + '&token=' + token, {...productData, colors: colors, certifications: certifications, status: 'Draft' }).then((response) => {
            const success = response.data.status;
            if(success == 'Success') {
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
        <Form onSubmit={ProductSubmit} ref={formRef}>
            <Row>
                <Col lg='12'>
                    <Card className='mb-3'>
                        <Card.Body className='bg-lgray'>
                            <ImageDragAndDrop type="product" onImagesChange={handleImagesChange} size={size} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg='12'>
                    <Card>
                        <Card.Body className='bg-lgray'>
                            <Form.Group className='mb-4 mt-2'>
                                <Form.Label>Name</Form.Label>
                                <FormControl type='text' name='name' value={productData.name} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Description</Form.Label>
                                <FormControl as="textarea"
                                    name="description"
                                    rows={3} // You can adjust the number of rows as needed
                                    value={productData.description}
                                    placeholder=''
                                    onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Colors</Form.Label>
                                <TagsInput
                                    value={colors}
                                    onChange={setColors}
                                    name="colors"
                                    className="form-control"
                                    onBlur={(e) => {
                                        const value = e.target.value;
                                        if (!colors.includes(value) && value !== "") {
                                            setColors([...colors, value]);
                                            e.target.value = "";
                                        }
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className='mb-4 mt-2'>
                                <Form.Label>Composition</Form.Label>
                                <FormControl type='text' name='composition' value={productData.composition} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Categories</Form.Label>
                                <TagsInput
                                    value={categories}
                                    onChange={setCategories}
                                    name="categories"
                                    className="form-control"
                                    onBlur={(e) => {
                                        const value = e.target.value;
                                        if (!categories.includes(value) && value !== "") {
                                            setCategories([...categories, value]);
                                            e.target.value = "";
                                        }
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Weave</Form.Label>
                                <FormControl type='text' name='weave' value={productData.weave} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Weight (Per sq. meter)</Form.Label>
                                <FormControl type='number' name='weight' value={productData.weight} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Width (meter)</Form.Label>
                                <FormControl type='number' name='width' value={productData.width} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Pattern</Form.Label>
                                <FormControl type='text' name='pattern' value={productData.pattern} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Texture</Form.Label>
                                <FormControl type='text' name='texture' value={productData.texture} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Opacity</Form.Label>
                                <FormControl type='text' name='opacity' value={productData.opacity} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Stretch</Form.Label>
                                <FormControl type='text' name='stretch' value={productData.stretch} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Drape</Form.Label>
                                <FormControl type='text' name='drape' value={productData.drape} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group> 
                            <Form.Group className='my-4'>
                                <Form.Label>Care Instructions</Form.Label>
                                <FormControl as="textarea"
                                    name="care_instructions"
                                    rows={3} // You can adjust the number of rows as needed
                                    value={productData.care_instructions}
                                    placeholder=''
                                    onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Price</Form.Label>
                                <FormControl type='number' name='price' value={productData.price} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Quantity</Form.Label>
                                <FormControl type='number' name='quantity' value={productData.quantity} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Certifications</Form.Label>
                                <TagsInput
                                    value={certifications}
                                    onChange={setCertifications}
                                    name="certifications"
                                    className="form-control"
                                    onBlur={(e) => {
                                        const value = e.target.value;
                                        if (!certifications.includes(value) && value !== "") {
                                            setCertifications([...certifications, value]);
                                            e.target.value = "";
                                        }
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Country</Form.Label>
                                <Form.Control as='select' name='country' value={productData.country} className='mr-sm-2' onChange={handleChange} required>
                                    <option value=''>Select Country</option>
                                    {Countries.map((country, index) => (
                                        <option key={country+"-"+index} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Notes</Form.Label>
                                <FormControl as="textarea"
                                    name="notes"
                                    rows={3} // You can adjust the number of rows as needed
                                    value={productData.notes}
                                    placeholder=''
                                    onChange={handleChange} required />
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg="12" className="text-right mt-4">
                    <Button className='btn-outline me-3' type="button" onClick={handleCancel}>Cancel</Button>
                    {productLoading ?
                        <Button className='btn-primary' type="button">{size == "small" ? "Uploading..." : "Saving..." }</Button>
                        :
                        <Button className='btn-primary' type="submit">{size == "small" ? "Upload" : "Save" }</Button>
                    }
                    {withDraft ?
                        <>
                            {productDraftLoading ?
                                <span className="cursor-pointer text-black ms-3">Saving as Draft...</span>
                                :
                                <span className="cursor-pointer text-black ms-3" onClick={ProductDraftSubmit}>Save as Draft <HiOutlineArrowLongRight className="align-text-bottom"/></span>
                            }
                        </>
                        :
                        null
                    }
                </Col>
            </Row>
        </Form>
    );
};

export default NewProduct;