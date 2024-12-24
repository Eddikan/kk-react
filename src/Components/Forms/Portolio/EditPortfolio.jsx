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
              `${import.meta.env.VITE_REACT_APP_API_ENDPOINT}portfolio/image?current_user_id=${current_user_id}&token=${token}`,
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
        if (portfolio) {
            setPortfolioData({...portfolio, user_id: currentUser});
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

    async function PortfolioSubmit(e) {
        e.preventDefault();
        if (images) {
            setPortfolioLoading(true);
            axios.put(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'portfolio_item/'+portfolioId+'?current_user_id=' + current_user_id + '&token=' + token, {...portfolioData, image_urls: images, colors: colors, tags: tags, materials: materials, categories: categories, status: 'Active' }).then((response) => {
                const success = response.data.status;
                if(success == 'Success') {
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
        axios.put(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'portfolio_item/'+portfolioId+'?current_user_id=' + current_user_id + '&token=' + token, {...portfolioData, image_urls: images, colors: colors, tags: tags, materials: materials, categories: categories, status: 'Draft' }).then((response) => {
            const success = response.data.status;
            if(success == 'Success') {
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
        <Form onSubmit={PortfolioSubmit}>
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
                                                <div className="image-dnd" style={{ backgroundImage: "url("+import.meta.env.VITE_REACT_APP_STORAGE_URL+'portfolio/'+image.image_url+")", minHeight: '170px'}}>
                                                <div className="dnd-actions-overlay">
                                                    <FaTimesCircle size="25px" onClick={() => handleRemove(index)} className="remove-icon cursor-pointer text-danger" />
                                                </div>
                                                </div>
                                            </Col>
                                            :
                                            <Col lg={2} key={image.id} className="image-preview">
                                                <div className="image-dnd" style={{ backgroundImage: "url("+import.meta.env.VITE_REACT_APP_STORAGE_URL+'portfolio/'+image.image_url+")", minHeight: '170px'}}>
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
                                        <div onClick={handleAddMore} className="portfolio-grid-div add-more-box w-100 text-center cursor-pointer background-dashed bg-lgray" style={{minHeight: '170px'}}>
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
                        <Form.Label>Season</Form.Label>
                        <FormControl type='text' name='season' value={portfolioData.season} className='mr-sm-2' onChange={handleChange} required placeholder='' />
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
                                <span className="cursor-pointer text-black ms-3" onClick={PortfolioDraftSubmit}>Save as Draft <HiOutlineArrowLongRight /></span>
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

export default EditPortfolio;