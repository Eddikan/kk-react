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

const initialUserData = Object.freeze({
    image_urls: [],
    name: '',
    description: '',
    category: '',
    season: '',
    collection_type: 'Regular',
});

const AddPortfolio = (props) => {
    const size = props.size;
    const withDraft = props.withDraft;

    const [portfolioData, setPortfolioData] = useState(initialUserData);
    const [portfolioLoading, setPortfolioLoading] = useState(false);
    const [portfolioDraftLoading, setPortfolioDraftLoading] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);
    const [colors, setColors] = useState([]);
    const [tags, setTags] = useState([]);
    const [materials, setMaterials] = useState([]);

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
                    reloadPage(true);
                    formSuccess(true);
                } else {
                    toast.error('An error occured. Please try again or contact the administrator.');
                    setPortfolioLoading(false);
                    formSuccess(false);
                }
            }).catch(() => {
                toast.error('An error occured. Please try again or contact the administrator.');
                setPortfolioLoading(false);
                formSuccess(true);
            });
        } else {
            toast.error('Please upload design images!');
        }
        
    };

    async function PortfolioDraftSubmit(e) {
        e.preventDefault();
        setPortfolioDraftLoading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'portfolio_item?user_id=' + currentUser + '&token=' + token, {...portfolioData, colors: colors, tags: tags, materials: materials, status: 'Draft' }).then((response) => {
            const success = response.data.status;
            if(success == 'Success') {
                toast.success('Portfolio saved as draft successfully!');
                setPortfolioDraftLoading(false);
                reloadPage(true);
                formSuccess(true);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setPortfolioDraftLoading(false);
                formSuccess(true);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setPortfolioDraftLoading(false);
            formSuccess(true);
        });
    };

    return (
        <Form onSubmit={PortfolioSubmit}>
            <Row>
                <Col lg='12'>
                    <ImageDragAndDrop onImagesChange={handleImagesChange} size={size} />
                </Col>
                <Col lg='12'>
                    <Form.Group className='my-4'>
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
                    <Form.Group className='my-4'>
                        <Form.Label>Category</Form.Label>
                        <Form.Control as='select' name='category' value={portfolioData.category} onChange={handleChange} className='mr-sm-2' required>
                            <option value=''>Select category</option>
                            <option value='option1'>Option 1</option>
                            <option value='option2'>Option 2</option>
                            <option value='option3'>Option 3</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='my-4'>
                        <Form.Label>Season</Form.Label>
                        <FormControl type='text' name='season' value={portfolioData.season} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                    </Form.Group>
                    <Form.Group className='my-4'>
                        <Form.Label>Colors</Form.Label>
                        <TagsInput
                            value={colors}
                            onChange={setColors}
                            name="colors"
                        />
                    </Form.Group>
                    <Form.Group className='my-4'>
                        <Form.Label>Materials</Form.Label>
                        <TagsInput
                            value={materials}
                            onChange={setMaterials}
                            name="materials"
                        />
                    </Form.Group>
                    <Form.Group className='my-4'>
                        <Form.Label>Tags</Form.Label>
                        <TagsInput
                            value={tags}
                            onChange={setTags}
                            name="tags"
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
                                        checked={portfolioData.collection_type === 'Regular'}
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
                                        checked={portfolioData.collection_type === 'Limited'}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Row>
                    </Form.Group>
                </Col>
                <Col lg="12" className="text-right mt-4">
                    <Button className='btn-outline me-3' type="button" onClick={handleCancel}>Cancel</Button>
                    {portfolioLoading ?
                        <Button className='btn-primary' type="button">{size == "small" ? "Uploading..." : "Saving..." }</Button>
                        :
                        <Button className='btn-primary' type="submit">{size == "small" ? "Upload" : "Save" }</Button>
                    }
                    {withDraft ?
                        <>
                            {portfolioDraftLoading ?
                                <span className="cursor-pointer text-black ms-3">Saving as Draft...</span>
                                :
                                <span className="cursor-pointer text-black ms-3" onClick={PortfolioDraftSubmit}>Save as Draft <HiOutlineArrowLongRight className="align-text-bottom"/></span>
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

export default AddPortfolio;