import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'Assets/styles/User/Profile/style.css';
import getUserData from 'Utils/GetUserData';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import ImageDragAndDrop from 'Components/Shared/ImageDragAndDrop';
import GoBack from 'Components/Shared/GoBack';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { HiOutlineArrowLongRight } from "react-icons/hi2";


const initialUserData = Object.freeze({
    portfolio_name: '',
    portfolio_category: '',
    portfolio_description: '',
    portfolio_season: '',
    portfolio_colors: '',
    portfolio_materials: '',
    portfolio_tags: '',
    portfolio_collection_type: '',
});

const AddPortfolio = () => {
    const [user, setUser] = useState(initialUserData);
    const [portfolioData, setPortfolioData] = useState(initialUserData);
    const [portfolioLoading, setPortfolioLoading] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);

    const currentUser = cookies.currentUser;

    const handleChange = (e) => {
        setPortfolioData({
            ...portfolioData,
            [e.target.name]: e.target.value,
        })
    };

    const handleImagesChange = (images) => {
        // Use the images as needed in the parent component (e.g., for uploading)
        console.log('Images in parent:', images);
    };

    const fetchData = async (e) => {
        try {
          const userData = await getUserData(e);
          if (userData.id) {
            setUser(userData);
          } else {
            toast.error('User does not exist!');
          }
          // Update state or perform other logic with userData
        } catch (error) {
            toast.error('User does not exist!');
          // Handle the error, if needed
        }
    };

    useEffect(() => {
        fetchData(currentUser);
    }, [reloadCount]);


    async function PortfolioSubmit(e) {
        e.preventDefault();
        setPortfolioLoading(true);
        setTimeout(function(){
            setPortfolioLoading(false);
        }, 1500)
    }

    return (
        <Layout>
            <section id='profile' className='py-5 px-2'>
                <Container>
                    <Form onSubmit={PortfolioSubmit}>
                        <Row>
                            <Col lg="8" className='mb-3'>
                                <h2 className='fs-30 mb-2'>Add Design</h2>
                            </Col>
                            <Col lg="4" className='mb-3 text-right'>
                                <GoBack fallBack="/user/profile" />
                            </Col>
                            <Col lg='12'>
                                <ImageDragAndDrop onImagesChange={handleImagesChange} />
                            </Col>
                            <Col lg='12'>
                                <Form.Group className='my-4'>
                                    <Form.Label>Name</Form.Label>
                                    <FormControl type='text' name='portfolio_name' value={portfolioData.portfolio_name} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                </Form.Group>
                                <Form.Group className='my-4'>
                                    <Form.Label>Description</Form.Label>
                                    <FormControl as="textarea"
                                        name="portfolio_description"
                                        rows={3} // You can adjust the number of rows as needed
                                        value={portfolioData.portfolio_description}
                                        placeholder=''
                                        onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group className='my-4'>
                                    <Form.Label>Category</Form.Label>
                                    <FormControl type='text' name='portfolio_category' value={portfolioData.portfolio_category} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                </Form.Group>
                                <Form.Group className='my-4'>
                                    <Form.Label>Season</Form.Label>
                                    <FormControl type='text' name='portfolio_season' value={portfolioData.portfolio_season} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                </Form.Group>
                                <Form.Group className='my-4'>
                                    <Form.Label>Colors</Form.Label>
                                    <FormControl type='text' name='portfolio_colors' value={portfolioData.portfolio_colors} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                </Form.Group>
                                <Form.Group className='my-4'>
                                    <Form.Label>Materials</Form.Label>
                                    <FormControl type='text' name='portfolio_materials' value={portfolioData.portfolio_materials} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                </Form.Group>
                                <Form.Group className='my-4'>
                                    <Form.Label>Tags</Form.Label>
                                    <FormControl type='text' name='portfolio_tags' value={portfolioData.portfolio_tags} className='mr-sm-2' onChange={handleChange} required placeholder='' />
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
                                                    name="portfolio_collection_type"
                                                    value="Regular"
                                                    checked={portfolioData.portfolio_collection_type === 'Regular'}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col}>
                                                <Form.Check
                                                    className="cursor-pointer"
                                                    type="radio"
                                                    label="Limited"
                                                    name="portfolio_collection_type"
                                                    value="Limited"
                                                    checked={portfolioData.portfolio_collection_type === 'Limited'}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Row>
                                </Form.Group>
                            </Col>
                            <Col lg="12" className="text-right">
                                <Button className='btn-outline me-3' type="button">Cancel</Button>
                                {portfolioLoading ?
                                    <Button className='btn-primary me-3' type="button">Saving...</Button>
                                    :
                                    <Button className='btn-primary me-3' type="submit">Save</Button>
                                }
                                <span className="cursor-pointer text-black">Save as Draft <HiOutlineArrowLongRight className="align-text-bottom"/></span>
                            </Col>
                        </Row>
                    </Form>
                </Container> 
            </section>

        </Layout>
    );
};

export default AddPortfolio;