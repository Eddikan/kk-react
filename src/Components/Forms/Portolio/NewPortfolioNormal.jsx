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
import { FaRegTimesCircle } from "react-icons/fa";

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

    // Category Search
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    const [categoryIds, setCategoryIds] = useState([]);
    const [reloadCategoryCount, setReloadCategoryCount] = useState(1);

    const [portfolioData, setPortfolioData] = useState(initialPortfolioData);
    const [portfolioLoading, setPortfolioLoading] = useState(false);
    const [portfolioDraftLoading, setPortfolioDraftLoading] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);
    const [colors, setColors] = useState([]);
    const [tags, setTags] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [genders, setGenders] = useState([]);
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

    async function getCategories(id) {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'design/filter/type?current_user_id=' + current_user_id + '&token=' + token).then((response) => {
            const data = response.data;
            if (data) {
                const filters = data.data;
                setCategories(filters.categories ?? []);
                if (id) {
                    setCategoryIds([...categoryIds, id]);
                }
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
            }
        }).catch((e) => {
            toast.error('An error occured. Please try again or contact the administrator.');
        });
    };

    async function addCategory(e) {
        e.preventDefault();
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'portfolio-item-categories?current_user_id=' + current_user_id + '&token=' + token, { name: categorySearchTerm, user_id: currentUser }).then((response) => {
            const success = response.data.status;
            if(success == 'Success') {
                const category = response.data.data;
                getCategories(category.id);
                setCategorySearchTerm('');
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

    async function PortfolioSubmit(e) {
        e.preventDefault();
        if (portfolioData.image_urls == ''
    ) {
        toast.error('Please upload atleast one photo!');
    } 
    else if (portfolioData.name == '' ||
            portfolioData.description == '') {
        toast.error('Kindly complete the fields marked as required!');
    } else {

        if (size == "small") {
            setPortfolioLoading(true);
            setTimeout(function(){
                setPortfolioLoading(false);
                savePortfolioItems({...portfolioData, portfolio_item_category_ids: categoryIds, seasons: seasons, colors: colors, tags: tags, materials: materials,  genders: genders, status: 'Active' });
                handleCancel();
            }, 1000);
        } else {
            if (portfolioData.image_urls) {
                setPortfolioLoading(true);
                axios.post(process.env.REACT_APP_API_ENDPOINT + 'portfolio_item?current_user_id=' + current_user_id + '&token=' + token, {...portfolioData, portfolio_item_category_ids: categoryIds, seasons: seasons, colors: colors, tags: tags, materials: materials, genders: genders, status: 'Active' }).then((response) => {
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
                    formSuccess(false);
                });
            } else {
                toast.error('Please upload design images!');
            }
        }
    }
    };

    async function PortfolioDraftSubmit(e) {
        e.preventDefault();
        setPortfolioDraftLoading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'portfolio_item?current_user_id=' + current_user_id + '&token=' + token, {...portfolioData, portfolio_item_category_ids: categoryIds, seasons: seasons, colors: colors, tags: tags, materials: materials, genders: genders, status: 'Draft' }).then((response) => {
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

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) &&
        !categoryIds.includes(category.id)
    );

    // const handleCategoryClick = (category) => {
    //     if (!categoryIds.includes(category.id)) {
    //       setCategoryIds([...categoryIds, category.id]);
    //     }
    //     setCategorySearchTerm('');
    // };

    const handleCategoryClick = (id) => {
        let data = categoryIds;
        if (categoryIds.includes(id)) {
            setCategoryIds(categoryIds.filter(categoryId => categoryId !== id));
        } else {
            setCategoryIds([...data, id]);
            data = [...data, id];
        }
    };

    const handleRemoveCategory = (categoryId) => {
        setCategoryIds(categoryIds.filter(id => id !== categoryId));
    };

    const handleGenderChange = (e) => {
        const value = e.target.value;
        setGenders(prevState =>
          prevState.includes(value)
            ? prevState.filter(g => g !== value)
            : [...prevState, value]
        );
    };

    useEffect(() => {
        getCategories();
    }, [reloadCategoryCount]);

    return (
        <>
        
        {/* <Form onSubmit={PortfolioSubmit}> */}
            <Row>
                <Col lg='8'>
                    <div>
                        <Card className='mb-3'>
                            <Card.Body className='bg-lgray'>
                                <ImageDragAndDrop type="portfolio" onImagesChange={handleImagesChange} size={size} />
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body className='bg-lgray'>
                                <Form.Group className='mb-3 mt-2'>
                                    <Form.Label>Name<span className='text-danger'>*</span></Form.Label>
                                    <FormControl type='text' name='name' value={portfolioData.name} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                </Form.Group>
                                <Form.Group className='my-3'>
                                    <Form.Label>Description<span className='text-danger'>*</span></Form.Label>
                                    <FormControl as="textarea"
                                        name="description"
                                        rows={3} // You can adjust the number of rows as needed
                                        value={portfolioData.description}
                                        placeholder=''
                                        onChange={handleChange} required />
                                </Form.Group>
                                {/* <Form.Group className='my-3'>
                                    <Form.Label>Measurement Guide</Form.Label>
                                    <div className='mt-2'>
                                        {elements && elements.length > 0 && (
                                            <Button className='btn-primary bg-transparent border-black text-black bg-black-hover border-black-hover text-white-hover me-3' type="button" onClick={() => { toggleGuideModal(); handleActionType("edit"); }}><GoPencil size="30px" className='me-2' /> Edit Elements</Button>
                                        )}
                                        <Button className='btn-primary bg-gold-hover border-gold-hover text-white-hover' type="button" onClick={() => { toggleGuideModal(); handleActionType("add"); }}><GoPlus size="30px" className='me-2' /> Add Element</Button>
                                        {elements && elements.length > 0 && (
                                            <span className="fw-600 cursor-pointer text-gold ms-3" onClick={toggleGuidePreviewModal}>Preview<HiOutlineArrowLongRight className="align-text-center"/></span>
                                        )}
                                    </div>
                                </Form.Group> */}
                            </Card.Body>
                        </Card>
                        <div lg="12" className="text-left mt-5">
                            <Button className='btn-outline me-3' type="button" onClick={handleCancel}>Cancel</Button>
                            {portfolioLoading ?
                                <Button className='btn-primary' type="button">{size == "small" ? "Uploading..." : "Saving..." }</Button>
                                :
                                <Button className='btn-primary' type="button" onClick={PortfolioSubmit}>{size == "small" ? "Upload" : "Save" }</Button>
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
                        </div>
                    </div>
                </Col>
                <Col lg='4'>
                    <Card>
                        <Card.Body className="bg-lgray">
                            <Form.Group className='mb-3'>
                                <Form.Label>Categories</Form.Label>
                                {/* <div className='position-relative'>
                                    <FormControl type='text' value={categorySearchTerm} className='mr-sm-2' onChange={(e) => setCategorySearchTerm(e.target.value)} placeholder="" />?
                                    {categorySearchTerm && (
                                        <div className="categories-box">
                                            {filteredCategories && filteredCategories.length > 0 ?
                                                <>
                                                    {filteredCategories.map(category => (
                                                        <div
                                                            key={category.id}
                                                            style={{ padding: '5px', cursor: 'pointer' }}
                                                            onClick={() => handleCategoryClick(category)}
                                                        >
                                                        {category.name}
                                                        </div>
                                                    ))}
                                                </>
                                                :
                                                // <div onClick={addCategory} style={{ padding: '5px', cursor: 'pointer' }}>
                                                //     {categorySearchTerm}
                                                // </div>
                                                null
                                            }
                                        </div>
                                    )}
                                    {categoryIds && categoryIds.length > 0 ?
                                        <div className="mb-2 mt-2">
                                            {categoryIds.map(categoryId => {
                                                const category = categories.find(cat => cat.id === categoryId);
                                                return (
                                                    <div className="category-pill bg-light" key={categoryId}>
                                                        {category?.name}
                                                        <span
                                                            className='category-remove'
                                                            onClick={() => handleRemoveCategory(categoryId)}
                                                        >
                                                            <FaRegTimesCircle className="text-danger" />
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        :
                                        null
                                    }
                                </div> */}
                                <Row className='position-relative'>
                                    {categories && categories.length > 0 ?
                                        <>          
                                            {categories.map(({ name, id }) => (
                                                <Form.Group as={Col} lg={6} className="d-flex mt-1">
                                                    <Form.Check
                                                        className="cursor-pointer me-2"
                                                        type="checkbox"
                                                        checked={categoryIds.includes(id)}
                                                        onChange={() => handleCategoryClick(id)}
                                                    />
                                                    <span>{name}</span>
                                                </Form.Group>
                                            ))}
                                        </>
                                        :
                                        null
                                    }
                                </Row>
                            </Form.Group>
                            <Form.Group className='my-3'>
                                <Form.Label>Season</Form.Label>
                                <TagsInput
                                    value={seasons}
                                    onChange={setSeasons}
                                    name="seasons"
                                    className="form-control"
                                    onBlur={(e) => {
                                        const value = e.target.value;
                                        if (!seasons.includes(value) && value !== "") {
                                            setSeasons([...seasons, value]);
                                            e.target.value = "";
                                        }
                                    }}
                                />
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
                            {/* <Form.Group className='my-3'>
                                <Form.Label>Lead Time (No. of days)</Form.Label>
                                <FormControl type='text' name='lead_time' required placeholder='' />
                            </Form.Group>
                            <Form.Group className='my-3'>
                                <Form.Label>Pricing Structure</Form.Label>
                                <FormControl as="textarea"
                                    name="description"
                                    rows={3}
                                    // value={portfolioData.description}
                                    placeholder=''
                                    // onChange={handleChange} 
                                    required />
                            </Form.Group> */}
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
                            <Form.Group className='my-3'>
                                <Form.Label>Gender</Form.Label>
                                <Row className="mt-1">
                                    <Form.Group as={Col} lg={4}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="checkbox"
                                            label="Male"
                                            name="genders"
                                            value="Male"
                                            checked={genders.includes('Male')}
                                            onChange={handleGenderChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="checkbox"
                                            label="Female"
                                            name="genders"
                                            value="Female"
                                            checked={genders.includes('Female')}
                                            onChange={handleGenderChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4}>
                                        <Form.Check
                                            className="cursor-pointer"
                                            type="checkbox"
                                            label="Other"
                                            name="genders"
                                            value="Other"
                                            checked={genders.includes('Other')}
                                            onChange={handleGenderChange}
                                        />
                                    </Form.Group>
                                </Row>
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
                                                                                <img key={imageIndex} src={process.env.REACT_APP_STORAGE_URL+'product/'+image?.image_url} className="w-100 h-auto mb-3" alt="" />
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
                                                                            <ResponsiveVideo src={process.env.REACT_APP_STORAGE_URL+'products/videos/'+element.value} />
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