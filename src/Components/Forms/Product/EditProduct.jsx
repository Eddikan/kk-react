import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'Assets/styles/Components/ImageDragAndDrop/style.css'
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { Card, CardBody } from 'reactstrap';
import { TagsInput } from "react-tag-input-component";
import Loading from 'Components/Shared/Loading';
import { FaTimesCircle } from 'react-icons/fa';
import { GoPlus } from 'react-icons/go';
import axios from 'axios';
import Countries from 'Utils/Countries';

const initialProductData = Object.freeze({
    image_urls: [],
    name: '',
    description: '',
    season: '',
    collection_type: 'Regular',
});

const EditProduct = (props) => {
    const size = props.size;
    const withDraft = props.withDraft;
    const product = props.product;
    const image_urls = props.images;
    const productId = props.productId;

    const fileInputRef = useRef(null);
    
    const [productData, setProductData] = useState(initialProductData);
    const [images, setImages] = useState([]);
    const [productLoading, setProductLoading] = useState(false);
    const [productDraftLoading, setProductDraftLoading] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('standby');
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'token']);
    const [colors, setColors] = useState([]);
    const [certifications, setCertifications] = useState([]);
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

    const saveProductItems = (e) => {
        props.onSave(e);
    }

    const handleChange = (e) => {
        setProductData({
            ...productData,
            [e.target.name]: e.target.value,
        })
    };

    const handleAddMore = () => {
        // Trigger the file input when the "Add More" button is clicked
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

    const handleRemove = (e) => {
        setImages((prevImages) => prevImages.filter((img, index) => index !== e));
    };

    useEffect(() => {
        if (product) {
            setProductData({...product, user_id: currentUser});
            if (product.colors) {
                setColors(product.colors);
            }
            if (product.certifications) {
                setCertifications(product.certifications);
            }
            if (product.categories) {
                setCategories(product.categories);
            }
            if(image_urls) {
                setImages(image_urls);
            }
        } else {
            toast.error('Design does not exist!');
            setTimeout(function(){
                handleCancel();
            }, 1500);
        }
    }, [reloadCount]);


    async function ProductSubmit(e) {
        e.preventDefault();
        if (images) {
            setProductLoading(true);
            axios.put(process.env.REACT_APP_API_ENDPOINT + 'product/'+productId+'?user_id=' + currentUser + '&token=' + token, {...productData, image_urls: images, colors: colors, certifications: certifications, status: 'Active' }).then((response) => {
                const success = response.data.status;
                if(success == 'Success') {
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
        e.preventDefault();
        setProductDraftLoading(true);
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'product/'+productId+'?user_id=' + currentUser + '&token=' + token, {...productData, image_urls: images, colors: colors, certifications: certifications, status: 'Draft' }).then((response) => {
            const success = response.data.status;
            if(success == 'Success') {
                toast.success('Design saved as draft successfully!');
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
        <Form onSubmit={ProductSubmit}>
            <Row>
                <Col lg='12'>
                    <Form.Group className='my-4'>
                        <Form.Label>Uploaded Files</Form.Label>
                        <Card>
                            <CardBody>
                            <Row>
                                {images.map((image, index) => (
                                    <>
                                        
                                        {images.length > 3 && index > 3 ?
                                            <Col lg={2} key={image.id} className="image-preview mt-3">
                                                <div className="image-dnd" style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'product/'+image.image_url+")", minHeight: '170px'}}>
                                                <div className="dnd-actions-overlay">
                                                    <FaTimesCircle size="25px" onClick={() => handleRemove(index)} className="remove-icon cursor-pointer text-danger" />
                                                </div>
                                                </div>
                                            </Col>
                                            :
                                            <Col lg={2} key={image.id} className="image-preview">
                                                <div className="image-dnd" style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'product/'+image.image_url+")", minHeight: '170px'}}>
                                                <div className="dnd-actions-overlay">
                                                    <FaTimesCircle size="25px" onClick={() => handleRemove(index)} className="remove-icon cursor-pointer text-danger" />
                                                </div>
                                                </div>
                                            </Col>
                                        }
                                    </>
                                ))}
                                {uploadStatus != "standby" ?
                                    <>
                                        {images.length > 4?
                                            <Col lg={2} className="image-preview mt-3" style={{minHeight: '170px'}}>
                                                <Loading />
                                            </Col>
                                            :
                                            <Col lg={2} className="image-preview" style={{minHeight: '170px'}}>
                                                <Loading />
                                            </Col>
                                        }
                                    </>
                                    :
                                    <Col lg={2} className="image-preview">
                                        <div onClick={handleAddMore} className="product-grid-div add-more-box w-100 text-center cursor-pointer background-dashed bg-lgray" style={{minHeight: '170px'}}>
                                            <GoPlus color="#a4a4a4" size="130px" className="mt-2" />
                                            <p className="text-dgray" style={{marginTop: '-15px'}}>Add More</p>
                                        </div>
                                    </Col>
                                }
                            </Row>
                            <input
                                type="file"
                                key={fileInputKey} // Add a key to the file input
                                id="fileInput"
                                onChange={handleFileInput}
                                className="file-input d-block opacity-0"
                                ref={fileInputRef}
                                accept="image/*"
                                multiple
                            />
                            </CardBody>
                        </Card>
                    </Form.Group>
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
                    <Form.Group className='my-4'>
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
                        <Form.Label>Weight</Form.Label>
                        <FormControl type='number' name='weight' value={productData.weight} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                    </Form.Group>
                    <Form.Group className='my-4'>
                        <Form.Label>Width</Form.Label>
                        <FormControl type='number' name='width' value={productData.weight} className='mr-sm-2' onChange={handleChange} required placeholder='' />
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
                                <span className="cursor-pointer text-black ms-3" onClick={ProductDraftSubmit}>Save as Draft <HiOutlineArrowLongRight /></span>
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

export default EditProduct;