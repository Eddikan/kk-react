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
    final_product_image_urls: [],
    name: '',
    description: '',
    colors: [],
    primary_color: '',
    weave: '',
    weight: 0,
    width: 0,
    length: 0,
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
    video_demo_type: '',
    ideal_clothing_type: '',
    wrinkle_resistant: 0,
    cut_to_size: 0,
    color_fastness: '',
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

    const isValidUrl = (url, type) => {
        if (type === "Youtube"){
            const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
            return youtubeRegex.test(url)
        }else if(type === "Vimeo"){
            const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/;
            return vimeoRegex.test(url);
        } 
        return true;
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

    const handleFinalImagesChange = (images) => {
        // Use the images as needed in the parent component (e.g., for uploading)
        setProductData({
            ...productData,
            final_product_image_urls: images,
        });
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
        var eco_friendly = selectedSustainabilities.includes("Eco-friendly") ? 1 : 0;

        if (productData.image_urls == '') {
            toast.error('Please upload atleast one photo!');
        }
        else if (productData.name == '' ||
            productData.description == '' ||
            composition == "" ||
            weave == "" ||
            productData.texture == '' ||
            productData.pattern == '' ||
            productData.country == '' ||
            productData.price == ''
        ) {
            toast.error('Kindly complete the fields marked as required!');
        } else {

            if (size == "small") {
                setProductLoading(true);
                setTimeout(function () {
                    setProductLoading(false);
                    saveProductItems({ ...productData, eco_friendly: eco_friendly, composition: otherComposition && otherComposition != "" ? otherComposition : composition, weave: otherWeave && otherWeave != "" ? otherWeave : weave, unit_measurement: otherUnitMeasurement && otherUnitMeasurement != "" ? otherUnitMeasurement : unitMeasurement, colors: colors, sustainability: selectedSustainabilities, certifications: certifications, status: 'Active' });
                    handleCancel();
                }, 1000);
            } else {
                if (productData.image_urls) {
                    setProductLoading(true);
                    axios.post(process.env.REACT_APP_API_ENDPOINT + 'product?user_id=' + currentUser + '&token=' + token, { ...productData, composition: otherComposition && otherComposition != "" ? otherComposition : composition, weave: otherWeave && otherWeave != "" ? otherWeave : weave, unit_measurement: otherUnitMeasurement && otherUnitMeasurement != "" ? otherUnitMeasurement : unitMeasurement, colors: colors, sustainability: selectedSustainabilities, certifications: certifications, status: 'Active' }).then((response) => {
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
        }
    };

    async function ProductDraftSubmit(e) {
        var eco_friendly = selectedSustainabilities.includes("Eco-friendly") ? 1 : 0;
        
        e.preventDefault();
        setProductDraftLoading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'product?user_id=' + currentUser + '&token=' + token, { ...productData, eco_friendly: eco_friendly, sustainability: selectedSustainabilities, composition: otherComposition && otherComposition != "" ? otherComposition : composition, weave: otherWeave && otherWeave != "" ? otherWeave : weave, unit_measurement: otherUnitMeasurement && otherUnitMeasurement != "" ? otherUnitMeasurement : unitMeasurement, colors: colors, certifications: certifications, status: 'Draft' }).then((response) => {
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
            {/* <Form onSubmit={ProductSubmit} ref={formRef}> */}
            <Row>
                <Col lg='8'>
                    <div>
                        <Card className='mb-3'>
                            <Card.Body className='bg-lgray'>
                                <Form.Label>Fabric Photos</Form.Label>
                                <ImageDragAndDrop type="product" onImagesChange={handleImagesChange} size={size} />
                            </Card.Body>
                        </Card>
                        <Card className='mb-3'>
                            <Card.Body className='bg-lgray'>
                                <Form.Label>Photos of Final Products</Form.Label>
                                <ImageDragAndDrop type="product" onImagesChange={handleFinalImagesChange} size={size} />
                            </Card.Body>
                        </Card>
                        <Card className="mb-3">
                            <Card.Body className='bg-lgray'>
                                <Form.Group className='mb-3 mt-2'>
                                    <Form.Label>Name<span className='text-danger'>*</span></Form.Label>
                                    <FormControl type='text' name='name' value={productData.name} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                </Form.Group>
                                <Form.Group className='my-3'>
                                    <Form.Label>Description<span className='text-danger'>*</span></Form.Label>
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
                                        onChange={handleChange} />
                                </Form.Group>
                                <Form.Label>Measurements<span className='text-danger'>*</span></Form.Label>
                                <Card className="mb-3">
                                    <Card.Body className='bg-mdgray'>
                                        <Row>
                                            <Col lg="12" className="mb-2">
                                                <Form.Group className="my-1">
                                                    <Form.Label>Unit of Measurement</Form.Label>
                                                    <Form.Control as='select' name='unit_measurement' value={unitMeasurement} className='mr-sm-2 mb-2' onChange={handleChangeUnitMeasurement} required>
                                                        <option value=''>Select Unit of Measurement</option>
                                                        <option value='millimeter'>Millimeter</option>
                                                        <option value='centimeter'>Centimeter</option>
                                                        <option value='meter'>Meter</option>
                                                        <option value='inch'>Inch</option>
                                                        <option value='feet'>Feet</option>
                                                        <option value='yard'>Yard</option>
                                                        <option value='other'>Other</option>
                                                    </Form.Control>
                                                    {(unitMeasurement != "millimeter" && unitMeasurement != "centimeter" && unitMeasurement != "meter" && unitMeasurement != "inch" && unitMeasurement != "feet" && unitMeasurement != "yard" || unitMeasurement == "other") && unitMeasurement != "" ?
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
                                <Form.Label>Pricing<span className='text-danger'>*</span></Form.Label>
                                <Card>
                                    <Card.Body className='bg-mdgray'>
                                        <Row>
                                            <Col lg="6">
                                                <Form.Group className='my-1'>
                                                    <Form.Label>Price (per {otherUnitMeasurement && otherUnitMeasurement != "" ? otherUnitMeasurement : unitMeasurement})</Form.Label>
                                                    <FormControl type='number' name='price' value={productData.price} className='mr-sm-2' onChange={handleChange} placeholder='' required />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group className='my-1'>
                                                    <Form.Label>Stock Quantity</Form.Label>
                                                    <FormControl type='number' name='quantity' value={productData.quantity} className='mr-sm-2' onChange={handleChange} placeholder='' required />
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
                    </div>
                    <div className="text-left mt-5">
                        <Button className='btn-outline me-3' type="button" onClick={handleCancel}>Cancel</Button>
                        {productLoading ?
                            <Button className='btn-primary' type="button">{size == "small" ? "Uploading..." : "Saving..." }</Button>
                            :
                            <>
                                {productData.video_demo_type === "Youtube" || productData.video_demo_type === "Vimeo" ?
                                    <Button className='btn-primary' disabled = {!isValidUrl(productData.video_demo_url, productData.video_demo_type)} type="button" onClick={ProductSubmit}>{size == "small" ? "Upload" : "Save" }</Button>
                                    :
                                    <Button className='btn-primary' type="button" onClick={ProductSubmit} >{size == "small" ? "Upload" : "Save" }</Button>
                                }
                            </>
                        }
                        {withDraft ?
                            <>
                                {productDraftLoading ?
                                    <span className="cursor-pointer text-black ms-3">Saving as Draft...</span>
                                    :
                                    <span className="cursor-pointer text-black ms-3" onClick={ProductDraftSubmit}>Save as Draft <HiOutlineArrowLongRight className="align-text-center" /></span>
                                }
                            </>
                            :
                            null
                        }
                    </div>
                </Col>
                <Col lg='4'>
                    <Card className='mb-3 h-100'>
                        <Card.Body className='bg-lgray'>
                            <Form.Group className='my-2'>
                                <Form.Label>Country of Origin<span className='text-danger'>*</span></Form.Label>
                                <Form.Control as='select' name='country' value={productData.country} className='mr-sm-2' onChange={handleChange} required>
                                    <option value=''>Select Country</option>
                                    {Countries.map((country, index) => (
                                        <option key={country + "-" + index} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
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
                                <Form.Label>Composition<span className='text-danger'>*</span></Form.Label>
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
                                <Form.Label>Weave<span className='text-danger'>*</span></Form.Label>
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
                                <Form.Label>Pattern<span className='text-danger'>*</span></Form.Label>
                                <FormControl type='text' name='pattern' value={productData.pattern} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-3'>
                                <Form.Label>Texture<span className='text-danger'>*</span></Form.Label>
                                <FormControl type='text' name='texture' value={productData.texture} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-3'>
                                <Form.Label>Opacity<span className='text-danger'>*</span></Form.Label>
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
                                            label="Fluid"
                                            name="drape"
                                            value="Fluid"
                                            checked={productData.drape === 'Fluid'}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={2}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="radio"
                                            label="Structured"
                                            name="drape"
                                            value="Structured"
                                            checked={productData.drape === 'Structured'}
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
                                                {productData.video_demo_type === "Youtube" || productData.video_demo_type === "Vimeo" ?
                                                    <>
                                                        <FormControl  type='text mt-2 fs-12' name='video_demo_url'  value={productData.video_demo_url}  className='mr-sm-2 mt-3' onChange={handleChange} placeholder={`Insert ${productData.video_demo_type} embed link`} />
                                                        {productData.video_demo_url === "" && (
                                                            <div className="text-danger mt-1 fs-12">
                                                                Please enter a {productData.video_demo_type} link.
                                                            </div>
                                                        )}
                                                        {productData.video_demo_url && productData.video_demo_url !== "" && !isValidUrl(productData.video_demo_url, productData.video_demo_type) && (
                                                            <div className="text-danger mt-1 fs-12">
                                                                Please enter a valid {productData.video_demo_type} link.
                                                            </div>
                                                        )}
                                                        {productData.video_demo_url && productData.video_demo_url !== "" && isValidUrl(productData.video_demo_url, productData.video_demo_type) && (
                                                            <div className="mt-3">
                                                                <ResponsiveEmbedVideo src={productData.video_demo_url} title={productData.name} />
                                                            </div>
                                                        )}
                                                    </>
                                                    : productData.video_demo_type == "Upload" ?
                                                        <div className="mt-3">
                                                            <VideoDragAndDrop type="product" onVideoChange={handleVideoChange} size={size} />
                                                        </div>
                                                        :
                                                        null
                                                }
                                                {/* {productData.video_demo_type == "Youtube" || productData.video_demo_type == "Vimeo" ?
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
                                                            <VideoDragAndDrop type="product" onVideoChange={handleVideoChange} size={size} />
                                                        </div>
                                                        :
                                                        null
                                                } */}
                                            </Form.Group>
                                        </Col>

                                    </Row>
                                </Card.Body>
                            </Card>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* </Form> */}
        </>
    );
};

export default NewProductNormal;