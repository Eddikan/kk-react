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
import VideoDragAndDrop from 'Components/Shared/VideoDragAndDrop';
import ResponsiveEmbedVideo from 'Components/Shared/ResponsiveEmbeddedVideo';

const initialProductData = Object.freeze({
    image_urls: [],
    final_product_image_urls: [],
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
    const [otherComposition, setOtherComposition] = useState('');
    const [composition, setComposition] = useState('');
    const [weave, setWeave] = useState('');
    const [otherWeave, setOtherWeave] = useState('');
    const [unitMeasurement, setUnitMeasurement] = useState('meter');
    const [otherUnitMeasurement, setOtherUnitMeasurement] = useState('');
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
                saveProductItems({...productData, composition: otherComposition && otherComposition != "" ? otherComposition : composition, weave: otherWeave && otherWeave != "" ? otherWeave : weave, unit_measurement: otherUnitMeasurement && otherUnitMeasurement != "" ? otherUnitMeasurement : unitMeasurement, colors: colors, certifications: certifications, status: 'Active' });
                handleCancel();
            }, 1000);
        } else {
            if (productData.image_urls) {
                setProductLoading(true);
                // axios.post(process.env.REACT_APP_API_ENDPOINT + 'product?user_id=' + currentUser + '&token=' + token, {...productData, composition: otherComposition && otherComposition != "" ? otherComposition : composition, weave: otherWeave && otherWeave != "" ? otherWeave : weave, unit_measurement: otherUnitMeasurement && otherUnitMeasurement != "" ? otherUnitMeasurement : unitMeasurement, colors: colors, certifications: certifications, status: 'Active' }).then((response) => {
                //     const success = response.data.status;
                //     if(success == 'Success') {
                //         toast.success('Fabric added successfully!');
                //         setProductLoading(false);
                //         reloadPage(true);
                //         formSuccess(true);
                //     } else {
                //         toast.error('An error occured. Please try again or contact the administrator.');
                //         setProductLoading(false);
                //         formSuccess(false);
                //     }
                // }).catch(() => {
                //     toast.error('An error occured. Please try again or contact the administrator.');
                //     setProductLoading(false);
                //     formSuccess(false);
                // });
                
            } else {
                toast.error('Please upload design images!');
            }
        }
        console.log("Product Data", productData);
    };

    async function ProductDraftSubmit(e) {
        e.preventDefault();
        setProductDraftLoading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'product?user_id=' + currentUser + '&token=' + token, {...productData, composition: otherComposition && otherComposition != "" ? otherComposition : composition, weave: otherWeave && otherWeave != "" ? otherWeave : weave, unit_measurement: otherUnitMeasurement && otherUnitMeasurement != "" ? otherUnitMeasurement : unitMeasurement, colors: colors, certifications: certifications, status: 'Draft' }).then((response) => {
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
                                <Form.Label>Environmentally Conscious Options</Form.Label>
                                <Row className="mt-1">
                                    <Form.Group as={Col} lg={12}>
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
                                {(composition != "Polyamide" && composition != "Polyester" && composition != "Acrylic" && composition != "Polyurethane" && composition != "Cashmere" && composition != "Mental" || composition == "Other") && composition != ""  ?
                                    <FormControl type='text' name='composition' value={otherComposition} className='mr-sm-2' onChange={handleChangeOtherComposition} placeholder='' />
                                    :
                                    null
                                }
                            </Form.Group>
                            <Form.Group className='mb-4 mt-2'>
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
                                {(weave != "Plain" && weave != "Twill" && weave != "Satin" && weave != "Basket" && weave != "Herringbone" && weave != "Jacquard" && weave != "Dobby" && weave != "Leno" || weave == "Other") && weave != ""  ?
                                    <FormControl type='text' name='weave' value={otherWeave} className='mr-sm-2' onChange={handleChangeOtherWeave} placeholder='' />
                                    :
                                    null
                                }
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
                            <Form.Group className='my-4'>
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
                            <Form.Group className='my-4'>
                                <Form.Label>Care Instructions</Form.Label>
                                <FormControl as="textarea"
                                    name="care_instructions"
                                    rows={3} // You can adjust the number of rows as needed
                                    value={productData.care_instructions}
                                    placeholder=''
                                    onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className='mb-4 mt-2'>
                                <Form.Label>Unit of Measurement</Form.Label>
                                <Form.Control as='select' name='unit_measurement' value={unitMeasurement} className='mr-sm-2 mb-2' onChange={handleChangeUnitMeasurement} required>
                                    <option value=''>Select Unit of Measurement</option>
                                    <option value='centimeter'>Centimeter</option>
                                    <option value='meter'>Meter</option>
                                    <option value='inch'>Inch</option>
                                    <option value='feet'>Feet</option>
                                    <option value='yard'>Yard</option>
                                    <option value='Other'>Other</option>
                                </Form.Control>
                                {(unitMeasurement != "centimeter" && unitMeasurement != "meter" && unitMeasurement != "inch" && unitMeasurement != "feet" && unitMeasurement != "yard" || unitMeasurement == "Other") && unitMeasurement != ""  ?
                                    <FormControl type='text' name='unit_measurement' value={otherUnitMeasurement} className='mr-sm-2' onChange={handleChangeOtherUnitMeasurement} placeholder='' />
                                    :
                                    null
                                }
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Width ({otherUnitMeasurement && otherUnitMeasurement != "" ? otherUnitMeasurement : unitMeasurement})</Form.Label>
                                <FormControl type='number' name='width' value={productData.width} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Weight (KG per sq. {otherUnitMeasurement && otherUnitMeasurement != "" ? otherUnitMeasurement : unitMeasurement})</Form.Label>
                                <FormControl type='number' name='weight' value={productData.weight} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Price (per {otherUnitMeasurement && otherUnitMeasurement != "" ? otherUnitMeasurement : unitMeasurement})</Form.Label>
                                <FormControl type='number' name='price' value={productData.price} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-4'>
                                <Form.Label>Stock Quantity</Form.Label>
                                <FormControl type='number' name='quantity' value={productData.quantity} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-4'>
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
                            <Form.Group className='my-4'>
                                <Form.Label>Country of Origin</Form.Label>
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
                                <Form.Label>Video Demonstration</Form.Label>
                                <Form.Control as='select' name='video_demo_type' value={productData.video_demo_type} className='mr-sm-2' onChange={handleChange}>
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
                                        <VideoDragAndDrop type="product" onVideoChange={handleVideoChange} size={size} />
                                    </div>
                                    :
                                    null
                                }
                            </Form.Group>
                            <Form.Group className='my-4'>
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