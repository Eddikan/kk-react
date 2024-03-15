import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import 'Assets/styles/Components/ImageDragAndDrop/style.css'
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { TagsInput } from "react-tag-input-component";
import Loading from 'Components/Shared/Loading';
import { FaTimesCircle } from 'react-icons/fa';
import { GoPlus } from 'react-icons/go';
import axios from 'axios';

const initialPortfolioData = Object.freeze({
    image_urls: [],
    name: '',
    description: '',
    season: '',
    collection_type: 'Regular',
});

const EditPortfolio = (props) => {
    const size = props.size;
    const withDraft = props.withDraft;
    const portfolio = props.portfolio;
    const image_urls = props.images;
    const portfolioId = props.portfolioId;

    const fileInputRef = useRef(null);

    const [portfolioData, setPortfolioData] = useState(initialPortfolioData);
    const [images, setImages] = useState([]);
    const [portfolioLoading, setPortfolioLoading] = useState(false);
    const [portfolioDraftLoading, setPortfolioDraftLoading] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('standby');
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'token']);
    const [colors, setColors] = useState([]);
    const [tags, setTags] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [fileInputKey, setFileInputKey] = useState(Date.now());

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

    const handleAddMore = () => {
        fileInputRef.current.click();
    };

    const handleFileInput = (e) => {
        const selectedFiles = e.target.files;
        handleFiles(selectedFiles);
    };

    const handleFiles = (fileList) => {
        const newImages = Array.from(fileList).map((file) => ({
            id: Date.now(),
            file,
            url: URL.createObjectURL(file),
        }));

        submitDocumentsSequentially(newImages);
    };

    const submitDocumentsSequentially = async (images) => {
        setUploadStatus("loading");
        const updatedImageUrls = [...images];

        for (const imageInfo of images) {
            const dataArray = new FormData();
            dataArray.append("image_url", imageInfo.file);

            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_ENDPOINT}portfolio/image?user_id=${currentUser}&token=${token}`,
                    dataArray,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );

                if (response.data.status === "Success") {
                    const image = response.data.data.image_url;
                    const imageUrlObject = { id: imageInfo.id, image_url: image };

                    updatedImageUrls.push(imageUrlObject);

                    // Image have been uploaded
                    const uploadedFiles = [...updatedImageUrls];
                    setImages((prevImageUrls) => [...prevImageUrls, imageUrlObject]);

                    let reader = new FileReader();

                    reader.onloadend = () => {
                    };

                    reader.readAsDataURL(imageInfo.file);
                } else {
                    const errors = response.data.errors;
                    if (errors.image_url) {
                        toast.error(errors.image_url[0]);
                    } else {
                        errors.map((error, index) => {
                            toast.error(error);
                            return null; // React requires a return value, so we return null here
                        });
                    }
                }
            } catch (error) {
                toast.error("An error occurred. Please try again or contact the administrator.");
                setUploadStatus("standby");
            }
        }
        setUploadStatus("standby");
    };

    const handleRemove = (e) => {
        setImages((prevImages) => prevImages.filter((img, index) => index !== e));
    };

    async function PortfolioSubmit(e) {
        e.preventDefault();
        if (images) {
            setPortfolioLoading(true);
            axios.put(process.env.REACT_APP_API_ENDPOINT + 'portfolio_item/' + portfolioId + '?user_id=' + currentUser + '&token=' + token, { ...portfolioData, image_urls: images, colors: colors, tags: tags, materials: materials, categories: categories, status: 'Active' }).then((response) => {
                const success = response.data.status;
                if (success == 'Success') {
                    toast.success('Design updated successfully!');
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

    };

    async function PortfolioDraftSubmit(e) {
        e.preventDefault();
        setPortfolioDraftLoading(true);
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'portfolio_item/' + portfolioId + '?user_id=' + currentUser + '&token=' + token, { ...portfolioData, image_urls: images, colors: colors, tags: tags, materials: materials, categories: categories, status: 'Draft' }).then((response) => {
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

    useEffect(() => {
        if (portfolio) {
            setPortfolioData({ ...portfolio, user_id: currentUser });
            if (portfolio.colors) {
                setColors(portfolio.colors);
            }
            if (portfolio.materials) {
                setMaterials(portfolio.materials);
            }
            if (portfolio.tags) {
                setTags(portfolio.tags);
            }
            if (portfolio.categories) {
                setCategories(portfolio.categories);
            }
            if (image_urls) {
                setImages(image_urls);
            }
        } else {
            toast.error('Design does not exist!');
            setTimeout(function () {
                handleCancel();
            }, 1500);
        }
    }, [reloadCount]);

    return (
        <Form onSubmit={PortfolioSubmit}>
            <Row>
                <Col lg='8'>
                    <Card className="mb-3">
                        <Card.Body className="bg-lgray">
                            <Form.Group className='mb-3'>
                                <Form.Label>Photos</Form.Label>
                                <Card>
                                    <Card.Body>
                                        <Row>
                                            {images ?
                                                <>
                                                    {images.map((image, index) => (
                                                        <>
                                                            {size == "small" ?
                                                                <>
                                                                    {images.length > 6 && index + 1 > 6 ?
                                                                        <Col lg={2} key={image.id} className="image-preview mt-3">
                                                                            <div className="image-dnd" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'portfolio/' + image.image_url + ")", minHeight: '170px' }}>
                                                                                <div className="dnd-actions-overlay">
                                                                                    <FaTimesCircle size="25px" onClick={() => handleRemove(index)} className="remove-icon cursor-pointer text-danger" />
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                        :
                                                                        <Col lg={2} key={image.id} className="image-preview">
                                                                            <div className="image-dnd" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'portfolio/' + image.image_url + ")", minHeight: '170px' }}>
                                                                                <div className="dnd-actions-overlay">
                                                                                    <FaTimesCircle size="25px" onClick={() => handleRemove(index)} className="remove-icon cursor-pointer text-danger" />
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                    }
                                                                </>
                                                                : size == "normal" ?
                                                                    <>
                                                                        {images.length > 4 && index + 1 > 4 ?
                                                                            <Col lg={3} key={image.id} className="image-preview mt-3">
                                                                                <div className="image-dnd" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'portfolio/' + image.image_url + ")", minHeight: '175px' }}>
                                                                                    <div className="dnd-actions-overlay">
                                                                                        <FaTimesCircle size="25px" onClick={() => handleRemove(index)} className="remove-icon cursor-pointer text-danger" />
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                            :
                                                                            <Col lg={3} key={image.id} className="image-preview">
                                                                                <div className="image-dnd" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'portfolio/' + image.image_url + ")", minHeight: '175px' }}>
                                                                                    <div className="dnd-actions-overlay">
                                                                                        <FaTimesCircle size="25px" onClick={() => handleRemove(index)} className="remove-icon cursor-pointer text-danger" />
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                        }
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {images.length > 6 && index + 1 > 6 ?
                                                                            <Col lg={2} key={image.id} className="image-preview mt-3">
                                                                                <div className="image-dnd" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'portfolio/' + image.image_url + ")", minHeight: '170px' }}>
                                                                                    <div className="dnd-actions-overlay">
                                                                                        <FaTimesCircle size="25px" onClick={() => handleRemove(index)} className="remove-icon cursor-pointer text-danger" />
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                            :
                                                                            <Col lg={2} key={image.id} className="image-preview">
                                                                                <div className="image-dnd" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'portfolio/' + image.image_url + ")", minHeight: '170px' }}>
                                                                                    <div className="dnd-actions-overlay">
                                                                                        <FaTimesCircle size="25px" onClick={() => handleRemove(index)} className="remove-icon cursor-pointer text-danger" />
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                        }
                                                                    </>
                                                            }
                                                        </>
                                                    ))}
                                                </>
                                                :
                                                null
                                            }

                                            {uploadStatus != "standby" ?
                                                <>
                                                    {size == "small" ?
                                                        <>
                                                            {images.length >= 6 ?
                                                                <Col lg={2} className="image-preview mt-3" style={{ minHeight: '170px' }}>
                                                                    <Loading />
                                                                </Col>
                                                                :
                                                                <Col lg={2} className="image-preview" style={{ minHeight: '170px' }}>
                                                                    <Loading />
                                                                </Col>
                                                            }
                                                        </>
                                                        : size == "normal" ?
                                                            <>
                                                                {images.length >= 4 ?
                                                                    <Col lg={3} className="image-preview mt-3" style={{ minHeight: '175px' }}>
                                                                        <Loading />
                                                                    </Col>
                                                                    :
                                                                    <Col lg={3} className="image-preview" style={{ minHeight: '175px' }}>
                                                                        <Loading />
                                                                    </Col>
                                                                }
                                                            </>
                                                            :
                                                            <>
                                                                {images.length >= 6 ?
                                                                    <Col lg={2} className="image-preview mt-3" style={{ minHeight: '170px' }}>
                                                                        <Loading />
                                                                    </Col>
                                                                    :
                                                                    <Col lg={2} className="image-preview" style={{ minHeight: '170px' }}>
                                                                        <Loading />
                                                                    </Col>
                                                                }
                                                            </>
                                                    }
                                                </>
                                                :
                                                <>
                                                    {size == "small" ?
                                                        <>
                                                            <Col lg={2} className={`image-preview ${images && images.length >= 6 ? "mt-3" : ""}`}>
                                                                <div onClick={handleAddMore} className="product-grid-div add-more-box w-100 text-center cursor-pointer background-dashed bg-lgray" style={{ minHeight: '170px' }}>
                                                                    <GoPlus color="#a4a4a4" size="130px" className="mt-2" />
                                                                    <p className="text-dgray" style={{ marginTop: '-15px' }}>Add More</p>
                                                                </div>
                                                            </Col>
                                                        </>
                                                        : size == "normal" ?
                                                            <Col lg={3} className={`image-preview ${images && images.length >= 4 ? "mt-3" : ""}`}>
                                                                <div onClick={handleAddMore} className="product-grid-div add-more-box w-100 text-center cursor-pointer background-dashed bg-lgray" style={{ minHeight: '175px' }}>
                                                                    <GoPlus color="#a4a4a4" size="130px" className="mt-2" />
                                                                    <p className="text-dgray" style={{ marginTop: '-15px' }}>Add More</p>
                                                                </div>
                                                            </Col>
                                                            :
                                                            <Col lg={2} className={`image-preview ${images && images.length >= 6 ? "mt-3" : ""}`}>
                                                                <div onClick={handleAddMore} className="product-grid-div add-more-box w-100 text-center cursor-pointer background-dashed bg-lgray" style={{ minHeight: '170px' }}>
                                                                    <GoPlus color="#a4a4a4" size="130px" className="mt-2" />
                                                                    <p className="text-dgray" style={{ marginTop: '-15px' }}>Add More</p>
                                                                </div>
                                                            </Col>
                                                    }
                                                </>

                                            }
                                        </Row>
                                        <input
                                            type="file"
                                            key={fileInputKey}
                                            id="fileInput"
                                            onChange={handleFileInput}
                                            className="file-input d-block opacity-0 d-none"
                                            ref={fileInputRef}
                                            accept="image/*"
                                            multiple
                                        />
                                    </Card.Body>
                                </Card>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                    <Card className='mb-3'>
                        <Card.Body className='bg-lgray'>
                            <Form.Group className='mb-3 mt-2'>
                                <Form.Label>Name</Form.Label>
                                <FormControl type='text' name='name' value={portfolioData.name} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-3'>
                                <Form.Label>Description</Form.Label>
                                <FormControl as="textarea"
                                    name="description"
                                    rows={3}
                                    value={portfolioData.description}
                                    placeholder=''
                                    onChange={handleChange} required />
                            </Form.Group>
                        </Card.Body>
                    </Card>
                    <div className="text-left mt-5">
                        <Button className='btn-outline me-3' type="button" onClick={handleCancel}>Cancel</Button>
                        {portfolioLoading ?
                            <Button className='btn-primary' type="button">{size == "small" ? "Uploading..." : "Saving..."}</Button>
                            :
                            <Button className='btn-primary' type="submit">{size == "small" ? "Upload" : "Save"}</Button>
                        }
                        {withDraft ?
                            <>
                                {portfolioDraftLoading ?
                                    <span className="cursor-pointer text-black ms-3">Saving as Draft...</span>
                                    :
                                    <span className="cursor-pointer text-black ms-3" onClick={PortfolioDraftSubmit}>Save as Draft <HiOutlineArrowLongRight /></span>
                                }
                            </>
                            :
                            null
                        }
                    </div>
                </Col>
                <Col lg='4'>
                    <Card className="mb-3">
                        <Card.Body className="bg-lgray">
                            <Form.Group className='mb-3 mt-2'>
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
                            <Form.Group className='my-3'>
                                <Form.Label>Season</Form.Label>
                                <FormControl type='text' name='season' value={portfolioData.season} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-3'>
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
                            <Form.Group className='my-3'>
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
                            <Form.Group className='my-3'>
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
                            <Form.Group className="my-3">
                                <Form.Label>Collections</Form.Label>
                                <Row className="mt-2">
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
                                    <Form.Group as={Col} lg={3}>
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
            </Row>
        </Form>
    );
};

export default EditPortfolio;