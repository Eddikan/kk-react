import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import ImageDragAndDrop from 'Components/Shared/ImageDragAndDrop';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { TagsInput } from "react-tag-input-component";
import axios from 'axios';

const initialProductData = Object.freeze({
    image_urls: [],
    name: '',
    description: '',
    season: '',
    collection_type: 'Regular',
});

const NewProduct = (props) => {
    const size = props.size;
    const withDraft = props.withDraft;

    const [productData, setProductData] = useState(initialProductData);
    const [productLoading, setProductLoading] = useState(false);
    const [productDraftLoading, setProductDraftLoading] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);
    const [colors, setColors] = useState([]);
    const [tags, setTags] = useState([]);
    const [materials, setMaterials] = useState([]);
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


    async function ProductSubmit(e) {
        e.preventDefault();
        if (size == "small") {
            setProductLoading(true);
            setTimeout(function(){
                setProductLoading(false);
                saveProductItems({...productData, colors: colors, tags: tags, materials: materials, status: 'Active' });
                handleCancel();
            }, 1000);
        } else {
            if (productData.image_urls) {
                setProductLoading(true);
                axios.post(process.env.REACT_APP_API_ENDPOINT + 'product_item?user_id=' + currentUser + '&token=' + token, {...productData, colors: colors, tags: tags, materials: materials, status: 'Active' }).then((response) => {
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
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'product_item?user_id=' + currentUser + '&token=' + token, {...productData, colors: colors, tags: tags, materials: materials, status: 'Draft' }).then((response) => {
            const success = response.data.status;
            if(success == 'Success') {
                toast.success('Design saved as draft successfully!');
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
        <Form onSubmit={ProductSubmit}>
            <Row>
                <Col lg='12'>
                    <ImageDragAndDrop onImagesChange={handleImagesChange} size={size} />
                </Col>
                <Col lg='12'>
                    <Form.Group className='my-4'>
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
                        <Form.Label>Categories</Form.Label>
                        <TagsInput
                            value={categories}
                            onChange={setCategories}
                            name="categories"
                            className="form-control"
                        />
                    </Form.Group>
                    <Form.Group className='my-4'>
                        <Form.Label>Season</Form.Label>
                        <FormControl type='text' name='season' value={productData.season} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                    </Form.Group>
                    <Form.Group className='my-4'>
                        <Form.Label>Colors</Form.Label>
                        <TagsInput
                            value={colors}
                            onChange={setColors}
                            name="colors"
                            className="form-control"
                        />
                    </Form.Group>
                    <Form.Group className='my-4'>
                        <Form.Label>Materials</Form.Label>
                        <TagsInput
                            value={materials}
                            onChange={setMaterials}
                            name="materials"
                            className="form-control"
                        />
                    </Form.Group>
                    <Form.Group className='my-4'>
                        <Form.Label>Tags</Form.Label>
                        <TagsInput
                            value={tags}
                            onChange={setTags}
                            name="tags"
                            className="form-control"
                        />
                    </Form.Group>
                </Col>
                <Col lg="2">
                    <Form.Group>
                        <Form.Label>Collections</Form.Label>
                            <Row className="mt-2">
                                <Form.Group as={Col}>
                                    <Form.Check
                                        className="cursor-pointer"
                                        type="radio"
                                        label="Regular"
                                        name="collection_type"
                                        value="Regular"
                                        checked={productData.collection_type === 'Regular'}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Check
                                        className="cursor-pointer"
                                        type="radio"
                                        label="Limited"
                                        name="collection_type"
                                        value="Limited"
                                        checked={productData.collection_type === 'Limited'}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Row>
                    </Form.Group>
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