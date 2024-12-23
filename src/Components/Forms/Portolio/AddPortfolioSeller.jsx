import React, { useEffect, useState } from 'react';
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
import ResponsiveEmbedVideo from 'Components/Shared/ResponsiveEmbeddedVideo';
import ResponsiveVideo from 'Components/Shared/ResponsiveVideo';
import VideoDragAndDrop from 'Components/Shared/VideoDragAndDrop';
import DetailBuilder from 'Components/Shared/DetailBuilder';
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";

const initialPortfolioData = Object.freeze({
    image_urls: [],
    name: '',
    description: '',
    season: '',
    collection_type: 'Regular',
});

const NewPortfolio = (props) => {
    const size = props.size;
    const withDraft = props.withDraft;

    const [portfolioData, setPortfolioData] = useState(initialPortfolioData);
    const [portfolioLoading, setPortfolioLoading] = useState(false);
    const [portfolioDraftLoading, setPortfolioDraftLoading] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'token']);
    const [colors, setColors] = useState([]);
    const [tags, setTags] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [categories, setCategories] = useState([]);

    const [guideModalShow, setGuideModalShow] = useState(false);
    const [guidePreviewModalShow, setGuidePreviewModalShow] = useState(false);
    const [elements, setElements] = useState([]);
    const [actionType, setActionType] = useState('add');

    const currentUser = cookies.currentUser;
    const current_user_id = cookies.currentUser;
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

    // Measurement Guide
    const handleAddElement = (e) => {
        setElements(e);
    }

    const toggleGuideModal = (e) => {
        setGuideModalShow(!guideModalShow);
    }

    const toggleGuidePreviewModal = (e) => {
        setGuidePreviewModalShow(!guidePreviewModalShow);
    }

    const handleActionType = (e) => {
        setActionType(e);
    }

    useEffect(() => {
        setPortfolioData({
            ...portfolioData,
            user_id: currentUser,
        });
    }, [reloadCount]);


    async function PortfolioSubmit(e) {
        e.preventDefault();
        if (size == "small") {
            setPortfolioLoading(true);
            setTimeout(function () {
                setPortfolioLoading(false);
                savePortfolioItems({ ...portfolioData, colors: colors, tags: tags, materials: materials, status: 'Active' });
                handleCancel();
            }, 1000);
        } else {
            if (portfolioData.image_urls) {
                setPortfolioLoading(true);
                axios.post(process.env.REACT_APP_API_ENDPOINT + 'portfolio_item?current_user_id=' + current_user_id + '&token=' + token, { ...portfolioData, colors: colors, tags: tags, materials: materials, status: 'Active' }).then((response) => {
                    const success = response.data.status;
                    if (success == 'Success') {
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
                    formSuccess(false);
                });
            } else {
                toast.error('Please upload design images!');
            }
        }
    };

    async function PortfolioDraftSubmit(e) {
        e.preventDefault();
        setPortfolioDraftLoading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'portfolio_item?current_user_id=' + current_user_id + '&token=' + token, { ...portfolioData, colors: colors, tags: tags, materials: materials, measurement_guide: elements, status: 'Draft' }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                toast.success('Design saved as draft successfully!');
                setPortfolioDraftLoading(false);
                reloadPage(true);
                formSuccess(true);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setPortfolioDraftLoading(false);
                formSuccess(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setPortfolioDraftLoading(false);
            formSuccess(false);
        });
    };

    return (
        <>
            <Form onSubmit={PortfolioSubmit}>
                <Row>
                    <Col lg='12'>
                        <div>
                            <Card className='mb-3 border-none'>
                                <Card.Body className='bg-white'>
                                    <Form.Label className='fs-18 mb-4'>Upload Media</Form.Label>
                                    <ImageDragAndDrop type="portfolio" onImagesChange={handleImagesChange} size={size} />
                                </Card.Body>
                            </Card>
                            <Card className='border-none'>
                                <Card.Body className='bg-white'>
                                    <Form.Label className='fs-18'>Design Information</Form.Label>
                                    <Form.Group className='mb-3 mt-2'>
                                        <Form.Label>Name</Form.Label>
                                        <FormControl type='text' name='name' value={portfolioData.name} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                    </Form.Group>
                                    <Form.Group className='my-3'>
                                        <Form.Label>Description</Form.Label>
                                        <FormControl as="textarea"
                                            name="description"
                                            rows={3} // You can adjust the number of rows as needed
                                            value={portfolioData.description}
                                            placeholder=''
                                            onChange={handleChange} required />
                                    </Form.Group>

                                    <Form.Group className='mb-3 mt-2'>
                                        <Form.Label>Category</Form.Label>
                                        <FormControl type='text' name='category' value={portfolioData.name} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                    </Form.Group>

                                    <Form.Group className='mb-3 mt-2'>
                                        <Form.Label>Season</Form.Label>
                                        <FormControl type='text' name='season' value={portfolioData.name} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                    </Form.Group>

                                    <Form.Group className='mb-3 mt-2'>
                                        <Form.Label>Colors</Form.Label>
                                        <FormControl type='text' name='colors' value={portfolioData.name} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                    </Form.Group>

                                    <Form.Group className='mb-3 mt-2'>
                                        <Form.Label>Materials</Form.Label>
                                        <FormControl type='text' name='materials' value={portfolioData.name} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                    </Form.Group>

                                    <Form.Group className='mb-3 mt-2'>
                                        <Form.Label>Lead Time</Form.Label>
                                        <FormControl type='text' name='lead Time' value={portfolioData.name} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                    </Form.Group>

                                    <Form.Group className='mb-3 mt-2'>
                                        <Form.Label>Pricing Structure</Form.Label>
                                        <FormControl type='text' name='price' value={portfolioData.name} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                    </Form.Group>

                                    <Form.Group className='mb-3 mt-2'>
                                        <Form.Label>Tags</Form.Label>
                                        <FormControl type='text' name='tags' value={portfolioData.name} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                    </Form.Group>

                                    <Form.Group className='mb-3 mt-2'>
                                        <Form.Label>Collection</Form.Label>
                                        <div><input type='radio' name='name' className='mr-sm-2' required /></div>
                                    </Form.Group>

                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Form>
            <Modal
                show={guideModalShow}
                onHide={toggleGuideModal}
                className='modal-preview'
                fade={false}
                size="lg"
                id="measurement-guide"
            >
                <Modal.Header className="pb-0">
                    <h4 className='text-left fs-25 fw-600 px-2'>{actionType == "add" ? "Add Element" : "Edit Elements"}</h4>
                    <button type='button' className='close react-modal-close' onClick={toggleGuideModal} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <Card className='border-0'>
                        <Card.Body className='p-2'>
                            <DetailBuilder size="normal" addElement={handleAddElement} closeModal={toggleGuideModal} elements={elements} actionType={actionType} />
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
            <Modal
                show={guidePreviewModalShow}
                onHide={toggleGuidePreviewModal}
                className='modal-preview'
                fade={false}
                size="lg"
                id="measurement-guide"
            >
                <Modal.Header className="pb-0">
                    <h4 className='text-left fs-25 fw-600 px-2'>Preview</h4>
                    <button type='button' className='close react-modal-close' onClick={toggleGuidePreviewModal} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <Card className='border-0'>
                        <Card.Body className='p-2'>
                            <Card>
                                <Card.Body>
                                    <div>
                                        {elements && elements.length > 0 ?
                                            <>
                                                {/* Preview based on selected input type */}
                                                {elements.map((element, index) => (
                                                    <>
                                                        {element.type == "Heading" ?
                                                            <h3 className='fw-600 mb-4' key={index}>{element.value}</h3>
                                                            : element.type == "Paragraph" ?
                                                                <p key={index}>{element.value}</p>
                                                                : element.type == "Image" ?
                                                                    <>
                                                                        {element.value && element.value.length > 0 && element.value != "" ?
                                                                            <>
                                                                                {element.value.map((image, imageIndex) => (
                                                                                    <img key={imageIndex} src={process.env.REACT_APP_STORAGE_URL + 'product/' + image?.image_url} className="w-100 h-auto mb-3" alt="" />
                                                                                ))}
                                                                            </>
                                                                            :
                                                                            null
                                                                        }
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {(element.type == "YouTube Embed Link" || element.type == "Vimeo Embed Link") && element.value != "" ?
                                                                            <>
                                                                                <div className="mb-3">
                                                                                    <ResponsiveEmbedVideo src={element.value} title={element.type} />
                                                                                </div>
                                                                            </>
                                                                            : element.type == "Video" && element.value != "" ?
                                                                                <>
                                                                                    <div className="mb-3">
                                                                                        <ResponsiveVideo src={process.env.REACT_APP_STORAGE_URL + 'products/videos/' + element.value} />
                                                                                    </div>
                                                                                </>
                                                                                : element.type == "Line Break" ?
                                                                                    <p className="py-4 mb-0"></p>
                                                                                    :
                                                                                    null
                                                                        }
                                                                    </>
                                                        }

                                                    </>
                                                ))}
                                            </>
                                            :
                                            <Card className="mb-3 mt-3">
                                                <Card.Body className="bg-lgray">
                                                    <p className="text-center mb-0">No measurement guide added.</p>
                                                </Card.Body>
                                            </Card>

                                        }
                                    </div>
                                </Card.Body>
                            </Card>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default NewPortfolio;