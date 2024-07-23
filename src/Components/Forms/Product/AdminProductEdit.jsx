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
import Countries from 'Utils/Countries';
import VideoDragAndDrop from 'Components/Shared/VideoDragAndDrop';
import Sidebar from 'Components/Shared/Sidebar';
import ResponsiveEmbedVideo from 'Components/Shared/ResponsiveEmbeddedVideo';

const initialProductData = Object.freeze({
    image_urls: [],
    name: '',
    description: '',
    season: '',
    collection_type: 'Regular',
});

const AdminProductEdit = (props) => {
    const size = props.size;
    const withDraft = props.withDraft;
    const product = props.product;
    const image_urls = props.images;
    const final_image_urls = props.finalProductImages;
    const productId = props.productId;

    const fileInputRef = useRef(null);
    const finalFileInputRef = useRef(null);
    const formRef = useRef(null);

    const [productData, setProductData] = useState(initialProductData);
    const [images, setImages] = useState([]);
    const [finalProductImages, setFinalProductImages] = useState([]);
    const [productLoading, setProductLoading] = useState(false);
    const [productDraftLoading, setProductDraftLoading] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('standby');
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'token']);
    const [colors, setColors] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [categories, setCategories] = useState([]);
    const [fileInputKey, setFileInputKey] = useState(Date.now());

    const [otherComposition, setOtherComposition] = useState('');
    const [composition, setComposition] = useState('');
    const [weave, setWeave] = useState('');
    const [otherWeave, setOtherWeave] = useState('');
    const [unitMeasurement, setUnitMeasurement] = useState('meter');
    const [otherUnitMeasurement, setOtherUnitMeasurement] = useState('');
    const [selectedSustainabilities, setSelectedSustainabilities] = useState([]);

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

    const handleAddMore = () => {
        // Trigger the file input when the "Add More" button is clicked
        fileInputRef.current.click();
    };

    const handleFinalAddMore = () => {
        // Trigger the file input when the "Add More" button is clicked
        finalFileInputRef.current.click();
    };

    const handleFileInput = (e) => {
        const selectedFiles = e.target.files;
        handleFiles(selectedFiles);
    };

    const handleFinalFileInput = (e) => {
        const selectedFiles = e.target.files;
        handleFinalFiles(selectedFiles);
    };

    const handleFiles = (fileList) => {
        const newImages = Array.from(fileList).map((file) => ({
            id: Date.now(),
            file,
            url: URL.createObjectURL(file),
        }));

        submitDocumentsSequentially(newImages);
    };

    const handleFinalFiles = (fileList) => {
        const newImages = Array.from(fileList).map((file) => ({
            id: Date.now(),
            file,
            url: URL.createObjectURL(file),
        }));

        submitFinalDocumentsSequentially(newImages);
    };

    const handleVideoChange = (url) => {
        setProductData({
            ...productData,
            video_demo_url: url,
        });
    }

    const submitDocumentsSequentially = async (images) => {
        setUploadStatus("loading");
        const updatedImageUrls = [...images];

        for (const imageInfo of images) {
            const dataArray = new FormData();
            dataArray.append("image_url", imageInfo.file);

            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_ENDPOINT}product/image?user_id=${currentUser}&token=${token}`,
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
                        // Do something with the uploaded image, if needed
                        // For example, update state or perform additional actions
                        // setDocuments((prevDocuments) => [
                        //   ...prevDocuments,
                        //   { media_id: mediaId, name: imageInfo.file.name, url: reader.result, type: imageInfo.file.type }
                        // ]);
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
                // Handle error if needed
            }
        }

        // All images have been uploaded
        setUploadStatus("standby");
    };

    const submitFinalDocumentsSequentially = async (images) => {
        setUploadStatus("loading");
        const updatedImageUrls = [...images];

        for (const imageInfo of images) {
            const dataArray = new FormData();
            dataArray.append("image_url", imageInfo.file);

            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_ENDPOINT}product/image?user_id=${currentUser}&token=${token}`,
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
                    setFinalProductImages((prevImageUrls) => [...prevImageUrls, imageUrlObject]);

                    let reader = new FileReader();

                    reader.onloadend = () => {
                        // Do something with the uploaded image, if needed
                        // For example, update state or perform additional actions
                        // setDocuments((prevDocuments) => [
                        //   ...prevDocuments,
                        //   { media_id: mediaId, name: imageInfo.file.name, url: reader.result, type: imageInfo.file.type }
                        // ]);
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
                // Handle error if needed
            }
        }

        // All images have been uploaded
        setUploadStatus("standby");
    };

    const handleRemove = (e) => {
        setImages((prevImages) => prevImages.filter((img, index) => index !== e));
    };

    const handleRemoveFinal = (e) => {
        setFinalProductImages((prevImages) => prevImages.filter((img, index) => index !== e));
    };

    const handleSelectSustainability = (event) => {
        const sustainability = event.target.value;
        if (event.target.checked) {
            setSelectedSustainabilities([...selectedSustainabilities, sustainability]);
        } else {
            setSelectedSustainabilities(selectedSustainabilities.filter(s => s !== sustainability));
        }
    };

    useEffect(() => {
        if (product) {
            setProductData({ ...product, user_id: currentUser });
            if (product.composition) {
                if ((product.composition != "Cotton" && 
                    product.composition != "Linen" && 
                    product.composition != "Hemp" && 
                    product.composition != "Jute" && 
                    product.composition != "Bamboo" && 
                    product.composition != "Wool" && 
                    product.composition != "Silk" && 
                    product.composition != "Cashmere" && 
                    product.composition != "Angora" && 
                    product.composition != "Polyester" && 
                    product.composition != "Nylon" && 
                    product.composition != "Acrylic" && 
                    product.composition != "Spandex (Lycra)" && 
                    product.composition != "Polypropylene" && 
                    product.composition != "Rayon (Viscose)" && 
                    product.composition != "Lyocell (Tencel)" && 
                    product.composition != "Modal" && 
                    product.composition != "Acetate") || product.composition == "Other") {
                    setComposition('Other');
                    setOtherComposition(product.composition);
                } else {
                    setComposition(product.composition);
                    setOtherComposition('');
                }
            }
            if (product.weave) {
                if ((product.weave != "Plain" && product.weave != "Twill" && product.weave != "Satin" && product.weave != "Basket" && product.weave != "Herringbone" && product.weave != "Jacquard" && product.weave != "Dobby" && product.weave != "Leno" && product.weave != "") || product.weave == "Other") {
                    setWeave('Other');
                    setOtherWeave(product.weave);
                } else {
                    setWeave(product.weave);
                    setOtherWeave('');
                }
            }
            if (product.unit_measurement) {
                if ((product.unit_measurement != "millimeter" && product.unit_measurement != "centimeter" && product.unit_measurement != "meter" && product.unit_measurement != "inch" && product.unit_measurement != "feet" && product.weave != "yard" && product.unit_measurement != "") || product.unit_measurement == "Other") {
                    setUnitMeasurement('Other');
                    setOtherUnitMeasurement(product.unit_measurement);
                } else {
                    setUnitMeasurement(product.unit_measurement);
                    setOtherUnitMeasurement('');
                }
            }
            if (product.colors) {
                setColors(product.colors);
            }
            if (product.certifications) {
                setCertifications(product.certifications);
            }
            if (product.categories) {
                setCategories(product.categories);
            }
            if (product.sustainability) {
                setSelectedSustainabilities(product.sustainability);
            }
            if (image_urls) {
                setImages(image_urls);
            }
            if (final_image_urls) {
                setFinalProductImages(final_image_urls);
            }
        } else {
            toast.error('Design does not exist!');
            setTimeout(function () {
                handleCancel();
            }, 1500);
        }
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
        var eco_friendly = selectedSustainabilities.includes("Eco-friendly") ? 1 : 0;
        e.preventDefault();
        if (images) {
            setProductLoading(true);
            axios.put(process.env.REACT_APP_API_ENDPOINT + 'product/' + productId + '?user_id=' + currentUser + '&token=' + token, { ...productData, eco_friendly: eco_friendly, sustainability: selectedSustainabilities, composition: otherComposition && otherComposition != "" ? otherComposition : composition, weave: otherWeave && otherComposition != "" ? otherWeave : weave, unit_measurement: otherUnitMeasurement && otherUnitMeasurement != "" ? otherUnitMeasurement : unitMeasurement, image_urls: images, final_product_image_urls: finalProductImages, colors: colors, certifications: certifications, status: 'Active' }).then((response) => {
                const success = response.data.status;
                if (success == 'Success') {
                    toast.success('Fabric updated successfully!');
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

    };

    async function ProductDraftSubmit(e) {
        var eco_friendly = selectedSustainabilities.includes("Eco-friendly") ? 1 : 0;
        e.preventDefault();
        setProductDraftLoading(true);
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'product/' + productId + '?user_id=' + currentUser + '&token=' + token, { ...productData, eco_friendly: eco_friendly, sustainability: selectedSustainabilities, composition: otherComposition && otherComposition != "" ? otherComposition : composition, weave: otherWeave && otherComposition != "" ? otherWeave : weave, unit_measurement: otherUnitMeasurement && otherUnitMeasurement != "" ? otherUnitMeasurement : unitMeasurement, image_urls: images, final_product_image_urls: finalProductImages, colors: colors, certifications: certifications, status: 'Draft' }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                toast.success('Fabric saved as draft successfully!');
                setProductDraftLoading(false);
                reloadPage(true);
                formSuccess(true);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setProductDraftLoading(false);
                formSuccess(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setProductDraftLoading(false);
            formSuccess(false);
        });
    };

    return (
        <Form onSubmit={ProductSubmit} ref={formRef}>
            <Row>
                <Col lg='8'>
                    <Card className="mb-3">
                        <Card.Body className='bg-lgray'>
                            <Form.Group className='mb-3'>
                                <Form.Label>Fabric Photos</Form.Label>
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
                                                                            <div className="image-dnd" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url + ")", minHeight: '170px' }}>
                                                                                <div className="dnd-actions-overlay">
                                                                                    <FaTimesCircle size="25px" onClick={() => handleRemove(index)} className="remove-icon cursor-pointer text-danger" />
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                        :
                                                                        <Col lg={2} key={image.id} className="image-preview">
                                                                            <div className="image-dnd" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url + ")", minHeight: '170px' }}>
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
                                                                                <div className="image-dnd" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url + ")", minHeight: '175px' }}>
                                                                                    <div className="dnd-actions-overlay">
                                                                                        <FaTimesCircle size="25px" onClick={() => handleRemove(index)} className="remove-icon cursor-pointer text-danger" />
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                            :
                                                                            <Col lg={3} key={image.id} className="image-preview">
                                                                                <div className="image-dnd" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url + ")", minHeight: '175px' }}>
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
                                                                                <div className="image-dnd" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url + ")", minHeight: '170px' }}>
                                                                                    <div className="dnd-actions-overlay">
                                                                                        <FaTimesCircle size="25px" onClick={() => handleRemove(index)} className="remove-icon cursor-pointer text-danger" />
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                            :
                                                                            <Col lg={2} key={image.id} className="image-preview">
                                                                                <div className="image-dnd" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url + ")", minHeight: '170px' }}>
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
                                            key={fileInputKey} // Add a key to the file input
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
                    <Card className="mb-3">
                        <Card.Body className='bg-lgray'>
                            <Form.Group className='mb-3'>
                                <Form.Label>Photos of Final Products</Form.Label>
                                <Card>
                                    <Card.Body>
                                        <Row>
                                            {finalProductImages ?
                                                <>
                                                    {finalProductImages.map((image, index) => (
                                                        <>
                                                            {size == "small" ?
                                                                <>
                                                                    {finalProductImages.length > 6 && index + 1 > 6 ?
                                                                        <Col lg={2} key={image.id} className="image-preview mt-3">
                                                                            <div className="image-dnd" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url + ")", minHeight: '170px' }}>
                                                                                <div className="dnd-actions-overlay">
                                                                                    <FaTimesCircle size="25px" onClick={() => handleRemoveFinal(index)} className="remove-icon cursor-pointer text-danger" />
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                        :
                                                                        <Col lg={2} key={image.id} className="image-preview">
                                                                            <div className="image-dnd" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url + ")", minHeight: '170px' }}>
                                                                                <div className="dnd-actions-overlay">
                                                                                    <FaTimesCircle size="25px" onClick={() => handleRemoveFinal(index)} className="remove-icon cursor-pointer text-danger" />
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                    }
                                                                </>
                                                                : size == "normal" ?
                                                                    <>
                                                                        {finalProductImages.length > 4 && index + 1 > 4 ?
                                                                            <Col lg={3} key={image.id} className="image-preview mt-3">
                                                                                <div className="image-dnd" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url + ")", minHeight: '175px' }}>
                                                                                    <div className="dnd-actions-overlay">
                                                                                        <FaTimesCircle size="25px" onClick={() => handleRemoveFinal(index)} className="remove-icon cursor-pointer text-danger" />
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                            :
                                                                            <Col lg={3} key={image.id} className="image-preview">
                                                                                <div className="image-dnd" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url + ")", minHeight: '175px' }}>
                                                                                    <div className="dnd-actions-overlay">
                                                                                        <FaTimesCircle size="25px" onClick={() => handleRemoveFinal(index)} className="remove-icon cursor-pointer text-danger" />
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                        }
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {finalProductImages.length > 6 && index + 1 > 6 ?
                                                                            <Col lg={2} key={image.id} className="image-preview mt-3">
                                                                                <div className="image-dnd" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url + ")", minHeight: '170px' }}>
                                                                                    <div className="dnd-actions-overlay">
                                                                                        <FaTimesCircle size="25px" onClick={() => handleRemoveFinal(index)} className="remove-icon cursor-pointer text-danger" />
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                            :
                                                                            <Col lg={2} key={image.id} className="image-preview">
                                                                                <div className="image-dnd" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url + ")", minHeight: '170px' }}>
                                                                                    <div className="dnd-actions-overlay">
                                                                                        <FaTimesCircle size="25px" onClick={() => handleRemoveFinal(index)} className="remove-icon cursor-pointer text-danger" />
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
                                                            {finalProductImages.length >= 6 ?
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
                                                                {finalProductImages.length >= 4 ?
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
                                                                {finalProductImages.length >= 6 ?
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
                                                            <Col lg={2} className={`image-preview ${finalProductImages && finalProductImages.length >= 6 ? "mt-3" : ""}`}>
                                                                <div onClick={handleFinalAddMore} className="product-grid-div add-more-box w-100 text-center cursor-pointer background-dashed bg-lgray" style={{ minHeight: '170px' }}>
                                                                    <GoPlus color="#a4a4a4" size="130px" className="mt-2" />
                                                                    <p className="text-dgray" style={{ marginTop: '-15px' }}>Add More</p>
                                                                </div>
                                                            </Col>
                                                        </>
                                                        : size == "normal" ?
                                                            <Col lg={3} className={`image-preview ${finalProductImages && finalProductImages.length >= 4 ? "mt-3" : ""}`}>
                                                                <div onClick={handleFinalAddMore} className="product-grid-div add-more-box w-100 text-center cursor-pointer background-dashed bg-lgray" style={{ minHeight: '175px' }}>
                                                                    <GoPlus color="#a4a4a4" size="130px" className="mt-2" />
                                                                    <p className="text-dgray" style={{ marginTop: '-15px' }}>Add More</p>
                                                                </div>
                                                            </Col>
                                                            :
                                                            <Col lg={2} className={`image-preview ${finalProductImages && finalProductImages.length >= 6 ? "mt-3" : ""}`}>
                                                                <div onClick={handleFinalAddMore} className="product-grid-div add-more-box w-100 text-center cursor-pointer background-dashed bg-lgray" style={{ minHeight: '170px' }}>
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
                                            key={fileInputKey} // Add a key to the file input
                                            id="fileInput"
                                            onChange={handleFinalFileInput}
                                            className="file-input d-block opacity-0 d-none"
                                            ref={finalFileInputRef}
                                            accept="image/*"
                                            multiple
                                        />
                                    </Card.Body>
                                </Card>
                            </Form.Group>
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
                                <Form.Label>Care Instructions</Form.Label>
                                <FormControl as="textarea"
                                    name="care_instructions"
                                    rows={3} // You can adjust the number of rows as needed
                                    value={productData.care_instructions}
                                    placeholder=''
                                    onChange={handleChange} required />
                            </Form.Group>
                            <Form.Label>Measurements</Form.Label>
                            <Card className="mb-3">
                                <Card.Body className='bg-mdgray'>
                                    <Row>
                                        <Col lg="12" className="mb-2">
                                            <Form.Group className="my-1">
                                                <Form.Label>Unit of Measurement</Form.Label>
                                                <Form.Control as='select' name='unit_measurement' value={unitMeasurement} className='mr-sm-2 mb-2' onChange={handleChangeUnitMeasurement} required>
                                                    <option value=''>Select Unit of Measurement</option>
                                                    <option value='millimeter'>Centimeter</option>
                                                    <option value='centimeter'>Centimeter</option>
                                                    <option value='meter'>Meter</option>
                                                    <option value='inch'>Inch</option>
                                                    <option value='feet'>Feet</option>
                                                    <option value='yard'>Yard</option>
                                                    <option value='Other'>Other</option>
                                                </Form.Control>
                                                {(unitMeasurement != "millimeter" && unitMeasurement != "centimeter" && unitMeasurement != "meter" && unitMeasurement != "inch" && unitMeasurement != "feet" && unitMeasurement != "yard" || unitMeasurement == "Other") && unitMeasurement != "" ?
                                                    <FormControl type='text' name='unit_measurement' value={otherUnitMeasurement} className='mr-sm-2' onChange={handleChangeOtherUnitMeasurement} placeholder='' />
                                                    :
                                                    null
                                                }
                                            </Form.Group>
                                        </Col>
                                        <Col lg="4">
                                            <Form.Group className="my-1">
                                                <Form.Label>Length ({otherUnitMeasurement && otherUnitMeasurement != "" ? otherUnitMeasurement : unitMeasurement})</Form.Label>
                                                <FormControl type='number' name='length' value={productData.length} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="4">
                                            <Form.Group className="my-1">
                                                <Form.Label>Width ({otherUnitMeasurement && otherUnitMeasurement != "" ? otherUnitMeasurement : unitMeasurement})</Form.Label>
                                                <FormControl type='number' name='width' value={productData.width} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="4">
                                            <Form.Group className="my-1">
                                                <Form.Label>Weight (KG per sq. {otherUnitMeasurement && otherUnitMeasurement != "" ? otherUnitMeasurement : unitMeasurement})</Form.Label>
                                                <FormControl type='number' name='weight' value={productData.weight} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                            <Form.Label>Pricing</Form.Label>
                            <Card>
                                <Card.Body className='bg-mdgray'>
                                    <Row>
                                        <Col lg="6">
                                            <Form.Group className='my-1'>
                                                <Form.Label>Price (per {otherUnitMeasurement && otherUnitMeasurement != "" ? otherUnitMeasurement : unitMeasurement})</Form.Label>
                                                <FormControl type='number' name='price' value={productData.price} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className='my-1'>
                                                <Form.Label>Stock Quantity</Form.Label>
                                                <FormControl type='number' name='quantity' value={productData.quantity} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                            <Form.Group className='my-3'>
                                <Form.Label>Certifications (Organic, sustainable, etc)</Form.Label>
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
                            <Form.Group className='my-3'>
                                <Form.Label>Notes (Additional notes/remarks)</Form.Label>
                                <FormControl as="textarea"
                                    name="notes"
                                    rows={5} // You can adjust the number of rows as needed
                                    value={productData.notes}
                                    placeholder=''
                                    onChange={handleChange} />
                            </Form.Group>
                        </Card.Body>
                    </Card>
                    <Col lg="12" className="text-left mt-4">
                        <Button className='btn-outline me-3' type="button" onClick={handleCancel}>Cancel</Button>
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
                                    <span className="cursor-pointer text-black ms-3" onClick={ProductDraftSubmit}>Save as Draft <HiOutlineArrowLongRight /></span>
                                }
                            </>
                            :
                            null
                        }
                    </Col>
                </Col>
                <Col lg='4'>
                    <Card className="mb-3 h-100">
                        <Card.Body className='bg-lgray'>
                            <Form.Group className='mb-3'>
                                <Form.Label>Country of Origin</Form.Label>
                                <Form.Control as='select' name='country' value={productData.country} className='mr-sm-2' onChange={handleChange} required>
                                    <option value=''>Select Country</option>
                                    {Countries.map((country, index) => (
                                        <option key={country + "-" + index} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            {/* <Form.Group className='my-3'>
                                <Form.Label>Environmentally Conscious Options</Form.Label>
                                <Row className="mt-1">
                                    <Form.Group>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="checkbox"
                                            label="Eco-Friendly"
                                            name="eco_friendly"
                                            checked={productData.eco_friendly === 1}
                                            onChange={(e) => handleChangeCheckbox(e.target.checked)}
                                        />
                                    </Form.Group>
                                </Row>
                            </Form.Group> */}
                            <Form.Group className='my-3'>
                                <Form.Label>Sustainability</Form.Label>
                                <Row className="mt-1">
                                    <Form.Group as={Col} lg={12}>
                                        <Form.Check
                                            type="checkbox"
                                            label="Eco-friendly"
                                            value="Eco-friendly"
                                            checked={selectedSustainabilities.includes("Eco-friendly")}
                                            onChange={handleSelectSustainability}
                                            className="cursor-pointer  mb-2"
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={12}>
                                        <Form.Check
                                            type="checkbox"
                                            label="Recycled fibers"
                                            value="Recycled fibers"
                                            checked={selectedSustainabilities.includes("Recycled fibers")}
                                            onChange={handleSelectSustainability}
                                            className="cursor-pointer mb-2"
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={12}>
                                        <Form.Check
                                            type="checkbox"
                                            label="Biodegradable fibers"
                                            value="Biodegradable fibers"
                                            checked={selectedSustainabilities.includes("Biodegradable fibers")}
                                            onChange={handleSelectSustainability}
                                            className="cursor-pointer"
                                        />
                                    </Form.Group>
                                </Row>
                            </Form.Group>
                            <Form.Group className='my-3'>
                                <Form.Label>Primary Color<span className='text-danger'>*</span></Form.Label>
                                <FormControl type='text' name='primary_color' value={productData.primary_color} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            {/* <Form.Group className='mt-2 mb-3'>
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
                            </Form.Group> */}
                            <Form.Group className='mb-3 mt-2'>
                                <Form.Label>Primary Fiber<span className='text-danger'>*</span></Form.Label>
                                <Form.Control as='select' name='composition' value={composition} className='mr-sm-2 mb-2' onChange={handleChangeComposition} required>
                                    <option value=''>Select Primary Fiber</option>
                                    <option value='Cotton'>Cotton</option>
                                    <option value='Linen'>Linen</option>
                                    <option value='Hemp'>Hemp</option>
                                    <option value='Jute'>Jute</option>
                                    <option value='Bamboo'>Bamboo</option>
                                    <option value='Wool'>Wool</option>
                                    <option value='Silk'>Silk</option>
                                    <option value='Cashmere'>Cashmere</option>
                                    <option value='Mohair'>Mohair</option>
                                    <option value='Angora'>Angora</option>
                                    <option value='Polyester'>Polyester</option>
                                    <option value='Nylon'>Nylon</option>
                                    <option value='Acrylic'>Acrylic</option>
                                    <option value='Spandex (Lycra)'>Spandex (Lycra)</option>
                                    <option value='Polypropylene'>Polypropylene</option>
                                    <option value='Rayon (Viscose)'>Rayon (Viscose)</option>
                                    <option value='Lyocell (Tencel)'>Lyocell (Tencel)</option>
                                    <option value='Modal'>Modal</option>
                                    <option value='Acetate'>Acetate</option>
                                    <option value='Other'>Other</option>
                                </Form.Control>
                                {(composition != "Cotton" && 
                                    composition != "Linen" && 
                                    composition != "Hemp" && 
                                    composition != "Jute" && 
                                    composition != "Bamboo" && 
                                    composition != "Wool" && 
                                    composition != "Silk" && 
                                    composition != "Cashmere" && 
                                    composition != "Angora" && 
                                    composition != "Polyester" && 
                                    composition != "Nylon" && 
                                    composition != "Acrylic" && 
                                    composition != "Spandex (Lycra)" && 
                                    composition != "Polypropylene" && 
                                    composition != "Rayon (Viscose)" && 
                                    composition != "Lyocell (Tencel)" && 
                                    composition != "Modal" && 
                                    composition != "Acetate" || composition == "Other") && composition != "" ?
                                    <FormControl type='text' name='composition' value={otherComposition} className='mr-sm-2' onChange={handleChangeOtherComposition} placeholder='' />
                                    :
                                    null
                                }
                            </Form.Group>
                            {/* <Form.Group className='mb-3 mt-2'>
                                <Form.Label>Composition</Form.Label>
                                <Form.Control as='select' name='composition' value={composition} className='mr-sm-2 mb-2' onChange={handleChangeComposition} required>
                                    <option value=''>Select Composition</option>
                                    <option value='Polyamide'>Polyamide</option>
                                    <option value='Polyester'>Polyester</option>
                                    <option value='Polyurethane'>Polyurethane</option>
                                    <option value='Acrylic'>Acrylic</option>
                                    <option value='Cashmere'>Cashmere</option>
                                    <option value='Mental'>Mental</option>
                                    <option value='Other'>Other</option>
                                </Form.Control>
                                {(composition != "Polyamide" && composition != "Polyester" && composition != "Acrylic" && composition != "Polyurethane" && composition != "Cashmere" && composition != "Mental" || composition == "Other") && composition != "" ?
                                    <FormControl type='text' name='composition' value={otherComposition} className='mr-sm-2' onChange={handleChangeOtherComposition} placeholder='' />
                                    :
                                    null
                                }
                            </Form.Group> */}
                            <Form.Group className='mb-3 mt-2'>
                                <Form.Label>Weave</Form.Label>
                                <Form.Control as='select' name='weave' value={weave} className='mr-sm-2 mb-2' onChange={handleChangeWeave} required>
                                    <option value=''>Select Weave</option>
                                    <option value='Plain'>Plain</option>
                                    <option value='Twill'>Twill</option>
                                    <option value='Satin'>Satin</option>
                                    <option value='Basket'>Basket</option>
                                    <option value='Herringbone'>Herringbone</option>
                                    <option value='Jacquard'>Jacquard</option>
                                    <option value='Dobby'>Dobby</option>
                                    <option value='Leno'>Leno</option>
                                    <option value='Other'>Other</option>
                                </Form.Control>
                                {(weave != "Plain" && weave != "Twill" && weave != "Satin" && weave != "Basket" && weave != "Herringbone" && weave != "Jacquard" && weave != "Dobby" && weave != "Leno" || weave == "Other") && weave != "" ?
                                    <FormControl type='text' name='weave' value={otherWeave} className='mr-sm-2' onChange={handleChangeOtherWeave} placeholder='' />
                                    :
                                    null
                                }
                            </Form.Group>
                            <Form.Group className='my-3'>
                                <Form.Label>Pattern</Form.Label>
                                <FormControl type='text' name='pattern' value={productData.pattern} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-3'>
                                <Form.Label>Texture</Form.Label>
                                <FormControl type='text' name='texture' value={productData.texture} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-3'>
                                <Form.Label>Opacity</Form.Label>
                                <FormControl type='text' name='opacity' value={productData.opacity} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-3'>
                                <Form.Label>Ideal for what type of clothing?</Form.Label>
                                <FormControl type='text' name='ideal_clothing_type' value={productData.ideal_clothing_type} className='mr-sm-2' onChange={handleChange} placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-3'>
                                <Form.Label>Cut to size</Form.Label>
                                <Row className="mt-1">
                                    <Form.Group as={Col} lg={3}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="radio"
                                            label="Yes"
                                            name="cut_to_size"
                                            value="1"
                                            checked={productData.cut_to_size == 1 && productData.cut_to_size != ""}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={2}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="radio"
                                            label="No"
                                            name="cut_to_size"
                                            value="0"
                                            checked={productData.cut_to_size == 0 && productData.cut_to_size != ""}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Row>
                            </Form.Group>
                            <Form.Group className='my-3'>
                                <Form.Label>Stretch</Form.Label>
                                <Row className="mt-1">
                                    <Form.Group as={Col} lg={3}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="radio"
                                            label="Stretch"
                                            name="stretch"
                                            value="Stretch"
                                            checked={productData.stretch === 'Stretch'}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={2}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="radio"
                                            label="Rigid"
                                            name="stretch"
                                            value="Rigid"
                                            checked={productData.stretch === 'Rigid'}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Row>
                            </Form.Group>
                            <Form.Group className='my-3'>
                                <Form.Label>Drape</Form.Label>
                                <Row className="mt-1">
                                    <Form.Group as={Col} lg={3}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="radio"
                                            label="Hang"
                                            name="drape"
                                            value="Hang"
                                            checked={productData.drape === 'Hang'}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={2}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="radio"
                                            label="Drapes"
                                            name="drape"
                                            value="Drapes"
                                            checked={productData.drape === 'Drapes'}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Row>
                            </Form.Group>
                            <Form.Group className='my-3'>
                                <Form.Label>Wrinkle resistant</Form.Label>
                                <Row className="mt-1">
                                    <Form.Group as={Col} lg={3}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="radio"
                                            label="Yes"
                                            name="wrinkle_resistant"
                                            value="1"
                                            checked={productData.wrinkle_resistant == 1 && productData.wrinkle_resistant != ""}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={2}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="radio"
                                            label="No"
                                            name="wrinkle_resistant"
                                            value="0"
                                            checked={productData.wrinkle_resistant == 0 && productData.wrinkle_resistant != ""}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Row>
                            </Form.Group>
                            <Form.Group className='my-3'>
                                <Form.Label>Color fastness</Form.Label>
                                <Row className="mt-1">
                                    <Form.Group as={Col} lg={3}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="radio"
                                            label="High"
                                            name="color_fastness"
                                            value="High"
                                            checked={productData.color_fastness === "High"}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={3}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="radio"
                                            label="Moderate"
                                            name="color_fastness"
                                            value="Moderate"
                                            checked={productData.color_fastness === "Moderate"}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={3}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="radio"
                                            label="Low"
                                            name="color_fastness"
                                            value="Low"
                                            checked={productData.color_fastness === "Low"}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Row>
                            </Form.Group>
                            <Card className='mb-3'>
                                <Card.Body className='bg-mdgray'>
                                    <Row>
                                        <Col lg="12">
                                            <Form.Group className='my-1'>
                                                <Form.Label>Video Demonstration</Form.Label>
                                                <Form.Control as='select' name='video_demo_type' value={productData.video_demo_type} className='mr-sm-2' onChange={handleChangeVideoType}>
                                                    <option value=''>Select Type</option>
                                                    <option value='Youtube'>Youtube</option>
                                                    <option value='Vimeo'>Vimeo</option>
                                                    <option value='Upload'>Upload Video</option>
                                                </Form.Control>
                                                {productData.video_demo_type == "Youtube" || productData.video_demo_type == "Vimeo" ?
                                                    <>
                                                        <FormControl type='text' name='video_demo_url' value={productData.video_demo_url} className='mr-sm-2 mt-3' onChange={handleChange} placeholder={`Insert ${productData.video_demo_type} embed link`} />
                                                        {productData.video_demo_url && productData.video_demo_url != "" ?
                                                            <div className="mt-3">
                                                                <ResponsiveEmbedVideo src={productData.video_demo_url} title={productData.name} />
                                                            </div>
                                                            :
                                                            null
                                                        }
                                                    </>
                                                    : productData.video_demo_type == "Upload" ?
                                                        <div className="mt-3">
                                                            <VideoDragAndDrop type="product" onVideoChange={handleVideoChange} size={size} videoLink={productData.video_demo_url && productData.video_demo_url != "" ? productData.video_demo_url : ""} />
                                                        </div>
                                                        :
                                                        null
                                                }
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Form>
    );
};

export default AdminProductEdit;