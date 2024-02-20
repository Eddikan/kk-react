import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';
import Layout from 'Components/Layout/Layout';
import FormControl from 'react-bootstrap/FormControl';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import toast from 'react-hot-toast';
// import getDesignsData from 'Utils/GetDesignsData';
import GetDesignsData from 'Utils/GetDesignsData';
import { Form, ModalHeader, ModalFooter } from 'react-bootstrap';
import LoadingPage from 'Components/Shared/LoadingPage';
import GoBack from 'Components/Shared/GoBack';
import { Rating } from 'react-simple-star-rating';
import { PiNotepadFill } from "react-icons/pi";
import { GoHeart, GoAlertFill } from "react-icons/go";
import { IoEyeOutline, IoHeartOutline } from "react-icons/io5";
import UserPlaceholder from 'Assets/images/user.png';
import PinIcon from '../Assets/images/pin.png';
import { IoShareSocial, IoInformationOutline, IoVideocam } from "react-icons/io5";
import { useCookies } from 'react-cookie';
import Countries from 'Utils/Countries';
import { AiFillMessage } from "react-icons/ai";
import Loading from 'Components/Shared/Loading';
import '../Assets/styles/FabricsHomePage/style.css';
import MultiRangeSlider from 'Components/Forms/MultiRangeSlider';
import '../Assets/styles/Design/style.css';
import Carousel from 'react-multi-carousel';
import { debounce } from 'lodash';
import axios from 'axios';

const Designs = (props) => {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [designs, setDesigns] = useState([]);
    const [designsLoading, setDesignsLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);

    // Filter
    const [ecoFriendly, setEcoFriendly] = useState();
    const [selectedCompositions, setSelectedCompositions] = useState([]);
    const [selectedWeaves, setSelectedWeaves] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [country, setCountry] = useState('');
    const [priceRange, setPriceRange] = useState({ from: '', to: '' });
    const [search, setSearch] = useState('');
    const [searchValue, setSearchValue] = useState('');

    const [portfoliosImage, setPortfolioImage] = useState(false);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [singleDesign, setSingleDesign] = useState('');
    const [designImages, setDesignImages] = useState([]);
    const [activeImage, setActiveImage] = useState('');
    const [descriptionShow, setDescriptionShow] = useState(false);
    const [messageShow, setMessageShow] = useState(false);
    const [selectedSortField, setSelectedSortField] = useState(null);
    const [selectedSortOrder, setSelectedSortOrder] = useState(null);
    const [portfolioCategories, setPortfolioCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedAllCategories, setSelectedAllCategories] = useState(false);
    const [isDesignCurrentUser, setIsDesignCurrentUser] = useState(false);
    const [modalHeading, setModalHeading] = useState('');


    const compositions = ['Polyamide', 'Polyester', 'Polyurethane', 'Acrylic', 'Cashmere', 'Mental']; // Replace with your array of composition options
    const weaves = ['Plain', 'Twill', 'Satin', 'Basket', 'Herringbone', 'Jacquard', 'Dobby', 'Leno']; // Replace with your array of weave options

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const token = cookies.token;

    const [sortOptions] = useState([
        { value: 'created_at', label: 'All' },
        { value: 'views', label: 'Views' },
    ]);

    const getOrderOptions = () => {
        if (selectedSortField === 'price') {
            return [
                { value: 'desc', label: 'Highest to Lowest' },
                { value: 'asc', label: 'Lowest to Highest' },
            ];
        }
        if (selectedSortField === 'created_at') {
            return [
                { value: 'desc', label: 'Newest to Oldest' },
                { value: 'asc', label: 'Oldest to Newest' },
            ];
        }
        if (selectedSortField === 'views') {
            return [
                { value: 'desc', label: 'Highest to Lowest' },
                { value: 'asc', label: 'Lowest to Highest' },
            ];
        }
        return [];
    };

    function toggleMessage() {
        setMessageShow(true);
    }

    function toggleDescription() {
        setDescriptionShow(true);
    }

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    const handleSortFieldChange = (field) => {
        setSelectedSortField(field);
        setSelectedSortOrder(null); // Reset order when changing field

        // Call the API with the updated filter values and sorting parameters
        onFilterChange({
            sortField: field, // Only the field without order
            sortOrder: null, // Reset order when changing field
            search: searchValue,
            categories: selectedCategories,
        });
    };

    const handleSortOrderChange = (order) => {
        setSelectedSortOrder(order);

        // Call the API with the updated filter values and sorting parameters
        onFilterChange({
            sortField: selectedSortField,
            sortOrder: order,
            search: searchValue,
            categories: selectedCategories,
        });
    };

    async function onFilterChange(data) {
        setDesignsLoading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'portfolio/filter?user_id=' + currentUser + '&token=' + token, data).then((response) => {
            const selectedDesigns = response.data.data;
            if (selectedDesigns) {
                setDesigns(selectedDesigns);
                setDesignsLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setDesignsLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setDesignsLoading(false);
        });
    }

    async function onWishlistChange(data) {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'portfolio/filter?user_id=' + currentUser + '&token=' + token, data).then((response) => {
            const selectedDesigns = response.data.data;
            if (selectedDesigns) {
                setDesigns(selectedDesigns);
                setDesignsLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setDesignsLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setDesignsLoading(false);
        });
    }

    const handleCompositionChange = (composition) => {
        const updatedCompositions = [...selectedCompositions];

        if (updatedCompositions.includes(composition)) {
            updatedCompositions.splice(updatedCompositions.indexOf(composition), 1);
        } else {
            updatedCompositions.push(composition);
        }

        setSelectedCompositions(updatedCompositions);
    };

    const handleWeaveChange = (weave) => {
        const updatedWeaves = [...selectedWeaves];

        if (updatedWeaves.includes(weave)) {
            updatedWeaves.splice(updatedWeaves.indexOf(weave), 1);
        } else {
            updatedWeaves.push(weave);
        }

        setSelectedWeaves(updatedWeaves);
    };

    const handleColorChange = (color) => {
        const updatedColors = [...selectedColors];

        if (updatedColors.includes(color)) {
            updatedColors.splice(updatedColors.indexOf(color), 1);
        } else {
            updatedColors.push(color);
        }

        setSelectedColors(updatedColors);
    };

    // Debounce the handleChange function to fire only once after a certain delay
    const priceRangeChangeDebounce = debounce((data) => {
        setPriceRange({
            from: data.min,
            to: data.max
        });
    }, 1000); // 1000 milliseconds (2 seconds) delay

    const searchChangeDebounce = debounce((e) => {
        setSearchValue(e);
    }, 1000); // 1000 milliseconds (2 seconds) delay

    const handleChangeCheckbox = (isChecked) => {
        setEcoFriendly(isChecked ? 1 : 0);
    };

    const handleChangeAllCategories = (isChecked) => {
        setSelectedAllCategories(isChecked ? true : false);
        setSelectedCategories([]);
    };

    const handleChangeCountry = (e) => {
        setCountry(e.target.value);
    };

    async function wishlistUpdate(e) {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'wishlist/update', e).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                onWishlistChange({
                    eco_friendly: ecoFriendly ? 1 : null,
                    composition: selectedCompositions,
                    weave: selectedWeaves,
                    colors: selectedColors,
                    price_range: priceRange,
                    sortField: selectedSortField,
                    sortOrder: selectedSortOrder,
                    search: searchValue,
                });
            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
        }).catch((error) => {
            toast.error('Something went wrong, please contact the administrator!');
        });
    };

    const priceRangeChange = (e) => {
        // Clear the previous debounce timer
        priceRangeChangeDebounce.cancel();

        // Set a new debounce timer
        priceRangeChangeDebounce(e);
    };

    const handleChangeSearch = (e) => {
        const { name, value } = e.target;
        // Clear the previous debounce timer
        searchChangeDebounce.cancel();

        // Set a new debounce timer
        searchChangeDebounce(value);
        setSearch(value);
    };

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
            slidesToSlide: 1
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
            slidesToSlide: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1
        }
    };

    function togglePortfolioImage(id, first_name, last_name, image_urls, image, address_line_1, province, tags, description, userId) {
        setPortfolioImage(true);
        setSingleDesign({
            id: id ?? 0,
            userId: userId ?? 0,
            first_name: first_name ?? '-',
            last_name: last_name ?? '-',
            image: image ?? '-',
            address_line_1: address_line_1 ?? '-',
            province: province ?? '-',
            tags: tags ?? '-',
            description: description ?? '-'

        })
        setDesignImages(image_urls);
        if (image_urls?.[0]?.image_url) {
            setActiveImage(process.env.REACT_APP_STORAGE_URL + 'portfolio/' + image_urls[0].image_url);
        } else {
            setActiveImage(PlaceholderImage);
        }

        if (currentUser == userId) {
            setIsDesignCurrentUser(false);
        } else {
            setIsDesignCurrentUser(true);
        }
    }

    async function toggleSortDesigns(type, sort) {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'portfolio/design' + type + sort).then((response) => {
            const selectedDesigns = response.data.data;
            if (selectedDesigns) {
                setDesigns(selectedDesigns);
                setDesignsLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setDesignsLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setDesignsLoading(false);
        });
    }

    async function toggleAddViewCount(id) {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'portfolio/view/' + id).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                // toast.success('Design saved as draft successfully!');
                // setReloadCount((prevReloadCount) => prevReloadCount + 1);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
        });
    }

    async function getPortfolioCategories() {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'portfolio/categories').then((response) => {
            const data = response.data;
            if (data) {
                setPortfolioCategories(data);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
            }
        }).catch((e) => {
            toast.error('An error occured. Please try again or contact the administrator.');
        });
    }

    // Handle checkbox change event
    const handleCategoriesCheckboxChange = (event) => {
        const category = event.target.value;
        if (event.target.checked) {
            setSelectedCategories([...selectedCategories, category]);
            if (selectedAllCategories.length + 1 === portfolioCategories.length) {
                setSelectedAllCategories(true);
            } else {
                setSelectedAllCategories(false);
            }
        } else {
            setSelectedCategories(selectedCategories.filter(item => item !== category));
        }
    };

    useEffect(() => {
        // Only run the filter API call after the component has mounted
        if (mounted) {
            // Call the API with the updated filter values
            onFilterChange({
                sortField: selectedSortField,
                sortOrder: selectedSortOrder,
                search: searchValue,
                categories: selectedCategories,
            });
        } else {
            // Set the component as mounted
            setMounted(true);
        }
        getPortfolioCategories();
    }, [mounted, searchValue, selectedCategories]);


    const toggleGetUser = (e) => {
        window.location.href = "/designer-profile?user_id=" + e;
    }

    return (
        <Layout>
            <div className='py-5 px-2'>
                <section>
                    <Container>
                        <Row className='mb-3'>
                            <Col lg="12">
                                <div className="narrow-850 text-center">
                                    <h2 className='fs-40 text-center mb-3'>Discover Captivating Designs.</h2>
                                    <p className='fs-16 fw-400 text-black line-height-24'>In the realm of fabric design, the designer intricately weaves together artistic concepts, skillfully navigating through color harmonies and textural nuances to conceive patterns that not only adorn but tell compelling visual stories through the medium of textiles.</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                <section>
                    <Container>
                        <div className='d-flex justify-content-between'>
                            <div className='sample-categories'>
                                Categories
                            </div>

                            <div className='sort-by-border mb-2'>
                                <label htmlFor="dropdown" className='sample-categories'>Sort By: </label>
                                <select id="sort-by" className="form-control d-inline-block border-none cursor-pointer fs-20 p-0 px-2" style={{ width: '120px' }} onChange={(e) => handleSortFieldChange(e.target.value)}>
                                    {sortOptions.map(option => (
                                        <option key={option.value} className='fs-20' value={option.value} selected={option.value === selectedSortField}>{option.label}</option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </Container>
                </section>

                <hr className="border-black mt-2" />
                <section className="pt-3">
                    <Container>
                        <Row className="mt-2">
                            <Col lg="3">
                                <div className="filter-sidebar pe-4">
                                    <Form.Check
                                        type={`checkbox`}
                                        label={`All`}
                                        name={`day`}
                                        className={`mb-2`}
                                        onChange={(e) => handleChangeAllCategories(e.target.checked)}
                                        checked={portfolioCategories.length == selectedCategories.length || selectedAllCategories}
                                    />
                                    {portfolioCategories && portfolioCategories.length > 0 ?
                                        <>
                                            {portfolioCategories.map((category, index) => (
                                                <Form.Check
                                                    key={index}
                                                    type="checkbox"
                                                    label={category.label}
                                                    value={category.value}
                                                    checked={selectedCategories.includes(category.value)}
                                                    onChange={handleCategoriesCheckboxChange}
                                                    className="mb-2"
                                                />
                                            ))}
                                        </>
                                        :
                                        null
                                    }


                                    {/* <Form.Check
                                        type={`checkbox`}
                                        label={`All`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Trends`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Casual Wear`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Sports and Active Wear`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Formal Wear`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Outerwear`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Loungewear`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Work Wear`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Ethnic Wear`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Street Wear`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Vintage/Retro Clothing`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Loungewear`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Maternity Wear`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Swimwear`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Undergarments`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Accessories`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Uniforms`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Adaptive Clothing`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Wedding Attire`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Travel Wear`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Seasonal Clothing`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Cultural or Religious Clothing`}
                                        name={`day`}
                                        className={`mb-2`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Costumes`}
                                        name={`day`}
                                        className={`mb-2`}
                                    /> */}

                                    {/* <Form.Group className='mb-4'>
                                        <Form.Label className="fw-600">Search</Form.Label>
                                        <FormControl type='text' name='search' value={search} className='mr-sm-2' onChange={handleChangeSearch} placeholder='Enter your search term...' />
                                    </Form.Group>
                                    <hr className="border-black" /> */}

                                    {/* <div style={{ position: "relative" }} className="mb-4">
                                        <div>
                                            <Form.Label className="fw-600">Sort By: </Form.Label>
                                            <Form.Control as='select' onChange={(e) => handleSortFieldChange(e.target.value)}>
                                                <option value="" disabled selected>Select Type</option>
                                                {sortOptions.map(option => (
                                                    <option key={option.value} value={option.value} selected={option.value === selectedSortField}>{option.label}</option>
                                                ))}
                                            </Form.Control>

                                            {selectedSortField && (
                                                <div className="mt-3">
                                                    <Form.Label className="fw-600">Order: </Form.Label>
                                                    <Form.Control as='select' onChange={(e) => handleSortOrderChange(e.target.value)}>
                                                        {getOrderOptions().map(option => (
                                                            <option key={option.value} value={option.value} selected={option.value === selectedSortOrder}>{option.label}</option>
                                                        ))}
                                                    </Form.Control>
                                                </div>
                                            )}
                                        </div>
                                    </div> */}
                                    {/* <hr className="border-black" />
                                    <Form.Group className='mb-4'>
                                        <Form.Label className="fw-600">Environmentally Conscious</Form.Label>
                                        <Form.Group>
                                            <Form.Check
                                                className="cursor-pointer"
                                                type="checkbox"
                                                label="Eco-Friendly"
                                                name="eco_friendly"
                                                checked={ecoFriendly}
                                                onChange={(e) => handleChangeCheckbox(e.target.checked)}
                                            />
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group className='mb-4'>
                                        <Form.Label className="fw-600">Composition</Form.Label>
                                        {compositions.map((composition) => (
                                            <Form.Group key={composition}>
                                                <Form.Check
                                                    className="cursor-pointer"
                                                    type="checkbox"
                                                    label={composition}
                                                    name="composition"
                                                    checked={selectedCompositions.includes(composition)}
                                                    onChange={() => handleCompositionChange(composition)}
                                                />
                                            </Form.Group>
                                        ))}
                                    </Form.Group>
                                    <Form.Group className='mb-4'>
                                        <Form.Label className="fw-600">Weave</Form.Label>
                                        {weaves.map((weave) => (
                                            <Form.Group key={weave}>
                                                <Form.Check
                                                    className="cursor-pointer"
                                                    type="checkbox"
                                                    label={weave}
                                                    name="weave"
                                                    checked={selectedWeaves.includes(weave)}
                                                    onChange={() => handleWeaveChange(weave)}
                                                />
                                            </Form.Group>
                                        ))}
                                    </Form.Group>
                                    <Form.Group className='mb-4'>
                                        <Form.Label className="fw-600">Origin</Form.Label>
                                        <Form.Control as='select' name='country' value={country} className='mr-sm-2' onChange={handleChangeCountry}>
                                            <option value=''>Select Country</option>
                                            {Countries.map((country, index) => (
                                                <option key={country+"-"+index} value={country}>
                                                    {country}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <hr className="border-black" />
                                    <Form.Group className='mb-4'>
                                        <Form.Label className="fw-600">Price Range</Form.Label>
                                        <Form.Group as={Row} className="mt-3 position-relative">
                                            <MultiRangeSlider min={10} max={1000} onChange={priceRangeChange} />
                                        </Form.Group>
                                    </Form.Group> */}
                                </div>
                            </Col>
                            <Col lg="9">

                                <div id="profile-designs">
                                    {designsLoading ?
                                        <>
                                            <Loading className="bg-white" />
                                        </>
                                        :
                                        <>
                                            {designs && designs.length > 0 ?
                                                <>
                                                    <Row className="designs-row">
                                                        {designs.map((design, index) => {
                                                            if (design.image_urls?.[0]?.image_url) {
                                                                var designImage = process.env.REACT_APP_STORAGE_URL + 'portfolio/' + design.image_urls[0].image_url;
                                                            } else {
                                                                var designImage = PlaceholderImage;
                                                            }

                                                            return (
                                                                <>
                                                                    <Col className="designs-grid mb-4" xs="12" md="4">
                                                                        <div className="portfolio-link">
                                                                            <div className="designs-grid-div w-100 cursor-pointer" onClick={function () { togglePortfolioImage(design.designer.id, design.user.first_name, design.user.last_name, design.image_urls, design.user.image, design.user.address_line_1, design.user.province, design.tags, design.description, design.user.id); }} style={{ backgroundImage: "url(" + designImage + ")" }}>
                                                                            </div>

                                                                        </div>
                                                                        <div className="design-details">
                                                                            <div className='d-flex align-items-center justify-content-between'>
                                                                                <p className="text-black fs-18 fw-400 mb-0 text-ellipsis rufina-family">{design.name ?? '-'}</p>
                                                                                {/* <div className='d-flex align-items-center'>
                                                                                    <span className='fs-14 text-no-wrap mx-2'>
                                                                                        <IoHeartOutline /> 0
                                                                                    </span>
                                                                                    <span className='fs-14 text-no-wrap'>
                                                                                        <IoEyeOutline /> {design.views}
                                                                                    </span>
                                                                                </div> */}
                                                                            </div>
                                                                            {/* <div className="star-ratings mt-1">
                                                                                <Rating
                                                                                    initialValue={0}
                                                                                    readonly={true}
                                                                                    allowFraction={true}
                                                                                    size={20}
                                                                                    className="star-rating"
                                                                                    showTooltip={true}
                                                                                    emptyColor="#CEA835"
                                                                                    fillColor="#CEA835"
                                                                                    tooltipArray={[
                                                                                        0, 1, 2, 3, 4, 5
                                                                                    ]}
                                                                                    tooltipDefaultText="5.0"
                                                                                />
                                                                            </div> */}
                                                                            {/* <div className='d-flex align-items-center mt-1'>
                                                                                {design.user.image ?
                                                                                    <div className='designer-photo-small' style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'user/' + design.user.image + ")" }} ></div>
                                                                                    :
                                                                                    <div className='designer-photo-small' style={{ backgroundImage: "url(" + UserPlaceholder + ")" }} ></div>
                                                                                }
                                                                                &nbsp;&nbsp;
                                                                                <p className="text-black fs-14 mb-0">{design.user.first_name && design.user.first_name != "" ? design.user.first_name : "-"} {design.user.last_name && design.user.last_name != "" ? design.user.last_name : "-"}</p>
                                                                            </div> */}
                                                                        </div>
                                                                    </Col>
                                                                </>
                                                            )
                                                        })}
                                                    </Row>
                                                </>
                                                :
                                                <p className="text-center mb-3 mt-3">No records found.</p>
                                            }
                                        </>
                                    }
                                </div>
                            </Col>
                        </Row>

                    </Container>
                </section>
            </div>

            <Modal
                show={portfoliosImage}
                fade={false}
                className='modal-full-width'
                id="bg-transparent-card"
            >
                <ModalHeader className='pt-2 pb-3 bg-transparent-card d-flex align-items-start'>
                    <a href={`/designer-profile?user_id=${singleDesign.userId}`} className='text-decoration-none'>
                        <div className='d-flex user-image'>

                            {singleDesign.image !== '' && singleDesign.image !== '-' ? (
                                <div
                                    className='user-photo'
                                    style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                >
                                </div>
                            ) : (
                                <img src={UserPlaceholder} className='placeholder-img' alt="User Placeholder" />
                            )}

                            <div className='ms-3'>
                                <div className='modal-title text-left fs-20 fw-600 text-white'>{singleDesign.first_name} {singleDesign.last_name}</div>
                                <div className='fashion-designer fs-16'>Fashion Designer</div>
                            </div>
                        </div>
                    </a>
                    <button type='button' className='close modal-close close-button-image bg-black' aria-label='Close' onClick={() => setPortfolioImage(false)}>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                </ModalHeader>
                <Modal.Body className='p-0'>
                    <Row>
                        <Col lg={11} className='image-fabrics'>
                            <div>
                                {designImages && designImages.length > 0 ?
                                    <>
                                        <Carousel
                                            swipeable={false}
                                            draggable={false}
                                            responsive={responsive}
                                            ssr={true}
                                            autoPlaySpeed={1000}
                                        >
                                            {designImages.map((image, index) => {

                                                return (
                                                    <>
                                                        <div key={index} className="single-image-slider-fabrics"
                                                            style={{
                                                                backgroundImage:
                                                                    `url(${process.env.REACT_APP_STORAGE_URL}portfolio/${image.image_url})`
                                                            }}
                                                        >
                                                        </div>
                                                    </>
                                                )
                                            })}
                                        </Carousel>;
                                    </>
                                    :
                                    <>

                                    </>
                                }

                                <div>
                                    <div className='text-white book-consultation-bar w-100 d-flex justify-content-center'>
                                        <p className='request d-flex justify-content-between mb-5'>
                                            <a href={`/designer-profile?user_id=${singleDesign.userId}`} className='text-decoration-none'>
                                                <div className='d-flex justify-content-center align-items-center user-image'>

                                                    {singleDesign.image !== '' && singleDesign.image !== '-' ? (
                                                        <div
                                                            className='user-photo'
                                                            style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                                        >
                                                        </div>
                                                    ) : (
                                                        <img src={UserPlaceholder} className='placeholder-img' />
                                                    )}

                                                    <div className='ms-3'>
                                                        <div className='modal-title text-left fs-20 fw-600 text-white'>{singleDesign.first_name} {singleDesign.last_name}</div>
                                                        <div className='fashion-designer fs-16'>Fashion Designer</div>
                                                    </div>

                                                </div>
                                            </a>

                                            {isDesignCurrentUser ?
                                                <>
                                                    <div className='btn-book-bar'>
                                                        <a href={`/appointment/schedule/${singleDesign.id}`}>
                                                            <button className='btn btn-book-consultation'>Book a Consultation</button>
                                                        </a>
                                                    </div>
                                                </>
                                                :
                                                null
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={1}>
                            <div>
                                <div>
                                    <div className='user-image-side thumbnail-table text-center'>
                                        {singleDesign.image !== '' && singleDesign.image !== '-' ? (
                                            <div
                                                className='user-photo-side mb-4 '
                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                            >
                                            </div>
                                        ) : (
                                            <img src={UserPlaceholder} className='placeholder-img-side mb-4' />
                                        )}

                                        <Card className="table_content file-action mt-3 me-0">
                                            <Card.Body className="action_container font-weight">
                                                <Row>
                                                    <Col>
                                                        {singleDesign.image !== '' && singleDesign.image !== '-' ? (
                                                            <div
                                                                className='user-photo-card mb-2 '
                                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                                            >
                                                            </div>
                                                        ) : (
                                                            <img src={UserPlaceholder} className='placeholder-img-side mb-3' />
                                                        )}
                                                        <div className='modal-title text-center fs-20 fw-600 text-black'>{singleDesign.first_name} {singleDesign.last_name}</div>
                                                        <div className='fs-14 text-center mt-2'>
                                                            <img src={PinIcon} alt="location pin" className='me-2' />
                                                            {singleDesign.address_line_1}{singleDesign.province}</div>
                                                        <div className='fs-18 fw-600 text-center mt-3 mb-1 specialization'>Specialization and Expertise</div>
                                                        <div className="mb-2 text-center">
                                                            {singleDesign.tags ?
                                                                <>
                                                                    {singleDesign.tags.length > 0 ?
                                                                        <>
                                                                            {singleDesign.tags.map((tag, index) => (
                                                                                <span className="design-tags bg-light fs-14 categories-color">
                                                                                    {tag}
                                                                                </span>
                                                                            ))}
                                                                        </>
                                                                        :
                                                                        null
                                                                    }
                                                                </>
                                                                :
                                                                null
                                                            }
                                                        </div>

                                                        {isDesignCurrentUser ?
                                                            <>
                                                                <hr />
                                                                <div className='text-center'>
                                                                    <a className='book-consultation btn-book btn w-100'
                                                                        href={`/appointment/schedule/${singleDesign.id}`}
                                                                    >
                                                                        <IoVideocam className="me-2" color="#ffffff" />Book a Consultation</a>
                                                                </div>

                                                                <div className='text-center mt-2'
                                                                    onClick={() => toggleUnderConstruction("Message")}
                                                                >
                                                                    <a className='book-consultation btn-message-designer btn w-100'
                                                                    >
                                                                        <AiFillMessage className="me-2" />Send Message</a>
                                                                </div>
                                                            </>
                                                            :
                                                            null
                                                        }

                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </div>

                                {isDesignCurrentUser ?
                                    <>
                                        <div className='text-center mb-4' >
                                            <a href={`/appointment/schedule/${singleDesign.id}`}>
                                                <div className="action-button-designs bg-white">
                                                    <PiNotepadFill className="text-black mt-2" size={30} />
                                                </div>
                                            </a>
                                            <div className='icon-name-color fs-12 mt-2 fw-600'>Consultation</div>
                                        </div>

                                        <div className='text-center mb-4' onClick={() => toggleUnderConstruction("Message")}>
                                            <div className="action-button-designs bg-white">
                                                <AiFillMessage className="text-black mt-2" size={30} />
                                            </div>
                                            <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Message</div>
                                        </div>

                                        <div className='text-center mb-4' onClick={() => toggleUnderConstruction("Share")}>
                                            <div className="action-button-designs bg-white">
                                                <IoShareSocial className="text-black mt-2" size={30} />
                                            </div>
                                            <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Share</div>
                                        </div>

                                    </>
                                    :
                                    null
                                }
                                <div className='text-center mb-4' onClick={toggleDescription}>
                                    <div className="action-button-designs bg-white">
                                        <IoInformationOutline className="text-black mt-2" size={30} />
                                    </div>
                                    <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Description</div>
                                </div>

                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal >

            <Modal
                show={messageShow}
                className='modal-preview'
                fade={false}
                size="sm"
            >
                <Modal.Header className="py-0">
                    <button type='button' className='close react-modal-close' onClick={() => setMessageShow(false)} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <Card className='border-none'>
                        <Card.Body className="text-center px-0 pt-2 pb-2">
                            <div className='user-image-message thumbnail-table'>
                                {singleDesign.image && (
                                    <div
                                        className='user-photo-message mb-2 '
                                        style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                    >
                                    </div>
                                )}
                            </div>
                            <div className='modal-title text-center fs-20 fw-600 text-black mb-3'>{singleDesign.first_name} {singleDesign.last_name}</div>
                            <textarea className='form-control text-height' placeholder='Your message'></textarea>
                        </Card.Body>
                    </Card>
                </Modal.Body>

                <ModalFooter>
                    <div className='text-right'>
                        <Button className="btn-cancel-message btn me-2" onClick={() => { setMessageShow(false); }}>Cancel</Button>
                        <Button className="btn-primary btn" onClick={() => { toggleUnderConstruction(); setMessageShow(false); }}>Send Message</Button>
                    </div>
                </ModalFooter>
            </Modal>

            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-left fw-600 fs-25 mt-2'>{modalHeading}</h5>
                    <button type='button' className='close react-modal-close' onClick={() => setUnderConstructionShow(false)} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>

                <Modal.Body className='pt-2'>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>

            <Modal
                show={descriptionShow}
                fade={false}
                centered
                id="description-card"
            >
                <Modal.Header className="py-0">
                    <button type='button' className='close react-modal-close description-close' onClick={() => setDescriptionShow(false)} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>

                <Modal.Body className='card-description d-flex align-items-center'>
                    <p className='text-white fw-400 p-3 fs-14 mb-0'>{singleDesign.description}</p>
                </Modal.Body>
            </Modal>
        </Layout >
    );
};

export default Designs;