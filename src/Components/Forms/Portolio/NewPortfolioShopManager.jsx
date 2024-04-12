import React, { useEffect, useState } from 'react';
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

const initialPortfolioData = Object.freeze({
    image_urls: [],
    name: '',
    description: '',
    season: '',
    collection_type: 'Regular',
});

const NewPortfolioShopManager = (props) => {
    const size = props.size;
    const withDraft = props.withDraft;

    const [portfolioData, setPortfolioData] = useState(initialPortfolioData);
    const [portfolioLoading, setPortfolioLoading] = useState(false);
    const [portfolioDraftLoading, setPortfolioDraftLoading] = useState(false);
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

    const savePortfolioItems = (e) => {
        props.onSave(e);
    }

    const handleChange = (e) => {
        setPortfolioData({
            ...portfolioData,
            [e.target.name]: e.target.value,
        })
    };

    const handleImagesChange = (images) => {
        // Use the images as needed in the parent component (e.g., for uploading)
        setPortfolioData({
            ...portfolioData,
            image_urls: images,
        });
    };

    useEffect(() => {
        setPortfolioData({
            ...portfolioData,
            user_id: currentUser,
        });
    }, [reloadCount]);


    async function PortfolioSubmit(e) {
        e.preventDefault();
        if (portfolioData.image_urls) {
            setPortfolioLoading(true);
            axios.post(process.env.REACT_APP_API_ENDPOINT + 'portfolio_item?user_id=' + currentUser + '&token=' + token, {...portfolioData, colors: colors, tags: tags, materials: materials, status: 'Active' }).then((response) => {
                const success = response.data.status;
                if(success == 'Success') {
                    toast.success('Design added successfully!');
                    setPortfolioLoading(false);
                    props.onCancel(true);
                    props.onSuccess(true)
                } else {
                    toast.error('An error occured. Please try again or contact the administrator.');
                    setPortfolioLoading(false);
                }
            }).catch(() => {
                toast.error('An error occured. Please try again or contact the administrator.');
                setPortfolioLoading(false);
            });
        } else {
            toast.error('Please upload design images!');
        }
    };

    return (
        // <Form>
            <Row>
                <Col lg='12'>
                    <Card className='mb-3'>
                        <Card.Body className='bg-lgray'>
                            <ImageDragAndDrop type="portfolio" onImagesChange={handleImagesChange} size={size} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg='12'>
                    <Card>
                        <Card.Body className='bg-lgray'>
                            <Form.Group className='mb-4 mt-2'>
                                <Form.Label>Name</Form.Label>
                                <FormControl type='text' name='name' value={portfolioData.name} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Description</Form.Label>
                                <FormControl as="textarea"
                                    name="description"
                                    rows={3} // You can adjust the number of rows as needed
                                    value={portfolioData.description}
                                    placeholder=''
                                    onChange={handleChange} required />
                            </Form.Group>

                            <Row>
                                <Col lg="6">
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
                                </Col>

                                <Col lg="6">

                                <Form.Group className='my-4'>
                                <Form.Label>Season</Form.Label>
                                <FormControl type='text' name='season' value={portfolioData.season} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                                </Col>

                                <Col lg="6">
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
                                </Col>

                                <Col lg="6">
                                <Form.Group className='my-4'>
                                <Form.Label>Materials</Form.Label>
                                <TagsInput
                                    value={materials}
                                    onChange={setMaterials}
                                    name="materials"
                                    className="form-control"
                                    onBlur={(e) => {
                                        const value = e.target.value;
                                        if (!materials.includes(value) && value !== "") {
                                            setMaterials([...materials, value]);
                                            e.target.value = "";
                                        }
                                    }}
                                />
                            </Form.Group>
                                </Col>
                            </Row>
                            
                            <Form.Group className='my-4'>
                                <Form.Label>Tags</Form.Label>
                                <TagsInput
                                    value={tags}
                                    onChange={setTags}
                                    name="tags"
                                    className="form-control"
                                    onBlur={(e) => {
                                        const value = e.target.value;
                                        if (!tags.includes(value) && value !== "") {
                                            setTags([...tags, value]);
                                            e.target.value = "";
                                        }
                                    }}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Collections</Form.Label>
                                <Row className="mt-1">
                                    <Form.Group as={Col} lg={3}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="radio"
                                            label="Regular"
                                            name="collection_type"
                                            value="Regular"
                                            checked={portfolioData.collection_type === 'Regular'}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={2}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="radio"
                                            label="Limited"
                                            name="collection_type"
                                            value="Limited"
                                            checked={portfolioData.collection_type === 'Limited'}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Row>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg="12" className="text-right mt-4">
                    <Button className='btn-outline me-3' type="button" onClick={handleCancel}>Cancel</Button>
                    {portfolioLoading ?
                        <Button className='btn-primary' type="button">{size == "small" ? "Uploading..." : "Saving..." }</Button>
                        :
                        <Button className='btn-primary' type="button" onClick={PortfolioSubmit}>{size == "small" ? "Upload" : "Save" }</Button>
                    }
                </Col>
            </Row>
        // </Form>
    );
};

export default NewPortfolioShopManager;