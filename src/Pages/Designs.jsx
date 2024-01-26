import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Layout from 'Components/Layout/Layout';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import toast from 'react-hot-toast';
// import getDesignsData from 'Utils/GetDesignsData';
import GetDesignsData from 'Utils/GetDesignsData';
import LoadingPage from 'Components/Shared/LoadingPage';
import GoBack from 'Components/Shared/GoBack';
import { GoHeart, GoBookmark } from "react-icons/go";
import { IoEyeOutline, IoHeartOutline } from "react-icons/io5";
import UserPlaceholder from 'Assets/images/placeholders/user.png';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Countries from 'Utils/Countries';
import Loading from 'Components/Shared/Loading';
import MultiRangeSlider from 'Components/Forms/MultiRangeSlider';
import Desingns from '../Assets/styles/Designs/style.css'
import { IoStar } from "react-icons/io5";
import { debounce } from 'lodash';

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

    const compositions = ['Polyamide', 'Polyester', 'Polyurethane', 'Acrylic', 'Cashmere', 'Mental']; // Replace with your array of composition options
    const weaves = ['Plain', 'Twill', 'Satin', 'Basket', 'Herringbone', 'Jacquard', 'Dobby', 'Leno']; // Replace with your array of weave options

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const token = cookies.token;

    const [sortOptions] = useState([
        { value: 'created_at', label: 'Date' },
        { value: 'views', label: 'Views' },
    ]);

    const [selectedSortField, setSelectedSortField] = useState(null);
    const [selectedSortOrder, setSelectedSortOrder] = useState(null);

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

    const handleSortFieldChange = (field) => {
        setSelectedSortField(field);
        setSelectedSortOrder(null); // Reset order when changing field

        // Call the API with the updated filter values and sorting parameters
        onFilterChange({
            eco_friendly: ecoFriendly ? 1 : null,
            composition: selectedCompositions,
            weave: selectedWeaves,
            colors: selectedColors,
            price_range: priceRange,
            sortField: field, // Only the field without order
            sortOrder: null, // Reset order when changing field
            search: searchValue,
        });
    };

    const handleSortOrderChange = (order) => {
        setSelectedSortOrder(order);

        // Call the API with the updated filter values and sorting parameters
        onFilterChange({
            eco_friendly: ecoFriendly ? 1 : null,
            composition: selectedCompositions,
            weave: selectedWeaves,
            colors: selectedColors,
            price_range: priceRange,
            sortField: selectedSortField,
            sortOrder: order,
            search: searchValue,
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

    useEffect(() => {
        // Only run the filter API call after the component has mounted
        if (mounted) {
            // Call the API with the updated filter values
            onFilterChange({
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
            // Set the component as mounted
            setMounted(true);
        }
    }, [mounted, ecoFriendly, selectedCompositions, selectedWeaves, selectedColors, priceRange, reloadCount, searchValue]);

    return (
        <Layout>
            <div className='py-5 px-2'>
                <section>
                    <Container>
                        <Row className='mb-3'>
                            <Col lg="12">
                                <div className="narrow-850 text-center">
                                    <h2 className='fs-40 text-center mb-3'>Explore Captivating Designs</h2>
                                    <p className='proximanova-family fs-16 fw-400 text-black'>In the realm of fabric design, the designer intricately weaves together artistic concepts, skillfully navigating through color harmonies and textural nuances to conceive patterns that not only adorn but tell compelling visual stories through the medium of textiles.</p>
                                </div>
                            </Col>
                            {/* <Col lg="4" className='text-right'>
                                <GoBack fallBack="/" />
                            </Col> */}
                        </Row>
                    </Container>
                </section>

                <section>
                    <Container>
                        <div className='d-flex justify-content-between'>
                            <div className='sample-categories'>
                                Sample Categories
                            </div>

                            <div>
                                <span className='sample-categories'>Sort By:</span>
                                <span className='all-sort'>All</span>
                            </div>

                        </div>
                    </Container>
                </section>


                <hr className="border-black mb" />
                <section className="pt-3">
                    <Container>
                        <Row className="mt-2">
                            <Col lg="3">
                                <div className="filter-sidebar pe-4">

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`All`}
                                        name={`day`}
                                        className={`categories`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Trends`}
                                        name={`day`}
                                        className={`categories`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        label={`Casual Wear`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Sports and Active Wear`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Formal Wear`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Outerwear`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Loungewear`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Work Wear`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Ethnic Wear`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Street Wear`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Vintage/Retro Clothing`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Loungewear`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Maternity Wear`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Swimwear`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Undergarments`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Accessories`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Uniforms`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Adaptive Clothing`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Wedding Attire`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Travel Wear`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Seasonal Clothing`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Cultural or Religious Clothing`}
                                        name={`day`}
                                    />

                                    <Form.Check
                                        type={`checkbox`}
                                        id={`schedule-sunday`}
                                        label={`Costumes`}
                                        name={`day`}
                                    />







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
                                                        {/* <img src={object.url} className='designs-img'/> */}
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
                                                                            <div className="designs-grid-div w-100 cursor-pointer" onClick={function () { toggleAddViewCount(design.id); navigate('/portfolio/' + design.id); }} style={{ backgroundImage: "url(" + designImage + ")" }}>

                                                                            </div>
                                                                            <div className='save-link'>
                                                                                {/* <div className="action-button bg-white me-2">
                                                                                    <GoBookmark className="text-black" />
                                                                                </div> */}
                                                                                <div className="action-button bg-white">
                                                                                    <GoHeart className="text-black" />
                                                                                </div>
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
                                                                            <div>
                                                                                <span className='fs-14 text-no-wrap'>
                                                                                    <IoStar size="17" color="#CEA835" className='me-1' />
                                                                                    <IoStar size="17" color="#CEA835" className='me-1' />
                                                                                    <IoStar size="17" color="#CEA835" className='me-1' />
                                                                                    <IoStar size="17" color="#CEA835" className='me-1' />
                                                                                    <IoStar size="17" color="#CEA835" className='me-2' />
                                                                                    <span className='fs-14 rating-color proximanova-family'>5.0</span>
                                                                                </span>
                                                                            </div>
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
        </Layout >
    );
};

export default Designs;