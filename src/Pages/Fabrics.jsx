import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Layout from 'Components/Layout/Layout';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import toast from 'react-hot-toast';
import { ImLeaf } from "react-icons/im";
import GoBack from 'Components/Shared/GoBack';
import { GoHeart } from "react-icons/go";
import UserPlaceholder from 'Assets/images/placeholders/user.png';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Countries from 'Utils/Countries';
import Loading from 'Components/Shared/Loading';
import MultiRangeSlider from 'Components/Forms/MultiRangeSlider';
import { debounce } from 'lodash';
import 'Assets/styles/FabricsListView/style.css'
import { Rating } from 'react-simple-star-rating';
import Pagination from 'Components/Pagination/Pagination';

const Fabrics = (props) => {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);
    const [fabrics, setFabrics] = useState([]);
    const [fabricsLoading, setFabricsLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);

    // Filter
    const [ecoFriendly, setEcoFriendly] = useState(0);
    const [selectedCompositions, setSelectedCompositions] = useState([]);
    const [selectedWeaves, setSelectedWeaves] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [country, setCountry] = useState('');
    const [priceRange, setPriceRange] = useState({ from: '', to: '' });
    const [search, setSearch] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(1);

    const colors = ['Red', 'Blue', 'Green', 'Yellow']; // Replace with your array of colors
    const compositions = ['Polyamide', 'Polyester', 'Polyurethane', 'Acrylic', 'Cashmere', 'Mental']; // Replace with your array of composition options
    const weaves = ['Plain', 'Twill', 'Satin', 'Basket', 'Herringbone', 'Jacquard', 'Dobby', 'Leno']; // Replace with your array of weave options

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const userRole = cookies.userRole;
    const token = cookies.token;
    let PageSize = 10;

    const [sortOptions] = useState([
        { value: 'created_at', label: 'Date' },
        { value: 'price', label: 'Price' },
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
            country: country,
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
            country: country,
        });
    };

    async function onFilterChange(data) {
        setFabricsLoading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'product/filter?user_id=' + currentUser + '&token=' + token, data).then((response) => {
            const selectedDesigns = response.data.data;
            if (selectedDesigns) {
                setFabrics(selectedDesigns);
                setFabricsLoading(false);
                setPageCount(() => response.data.meta.total);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setFabricsLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setFabricsLoading(false);
        });
    }

    async function onWishlistChange(data) {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'product/filter?user_id=' + currentUser + '&token=' + token, data).then((response) => {
            const selectedDesigns = response.data.data;
            if (selectedDesigns) {
                setFabrics(selectedDesigns);
                setFabricsLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setFabricsLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setFabricsLoading(false);
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

    const handleChangeCheckboxNonEco = (isChecked) => {
        setEcoFriendly(isChecked ? 0 : 1);
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
                    country: country,
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

    async function toggleSortFabrics(type, sort) {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'product/fabric' + type + sort).then((response) => {
            const selectedDesigns = response.data.data;
            if (selectedDesigns) {
                setFabrics(selectedDesigns);
                setFabricsLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setFabricsLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setFabricsLoading(false);
        });
    }

    async function toggleAddViewCount(id) {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'product/view/' + id).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                // toast.success('Fabric saved as draft successfully!');
                // setReloadCount((prevReloadCount) => prevReloadCount + 1);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
        });
    }

    // Pagination
    const handleChangePage = (pageNumber) => {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'product/filter?page=' + pageNumber + '&user_id=' + currentUser)
            .then((response) => {
                const data = response.data;
                setCurrentPage(pageNumber);
                const selectedDesigns = response.data.data;
                if (selectedDesigns) {
                    setFabrics(selectedDesigns);
                    setFabricsLoading(false);
                    setCurrentPage(() => data.meta.current_page);
                    setPageCount(() => data.meta.total);
                    setPageSize(() => data.meta.per_page);
                } else {
                    setFabricsLoading(false);
                    toast.error('There has been an error getting the products, please try again!');
                }
            }).catch(error => {
                setFabricsLoading(false);
                toast.error('There has been an error getting the products, please try again!');
            });
    };

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
                country: country,
            });
        } else {
            // Set the component as mounted
            setMounted(true);
        }
    }, [ecoFriendly, selectedCompositions, selectedWeaves, selectedColors, priceRange, reloadCount, searchValue, country]);


    return (
        <Layout>
            <div className='py-5 px-2'>
                <section>
                    <Container>
                        <Row>
                            <Col lg="11">
                                <h2 className='fs-40 text-left mb-3'>Explore Premium Fabrics</h2>
                            </Col>

                            <Col lg="1" className='text-right'>
                                <GoBack fallBack="/" />
                            </Col>

                            <Col lg="12">
                                <p className='fs-16 fw-400 mb-3 text-black line-height-24'>Fabrics are versatile materials composed of fibers, either natural or synthetic, that are woven, knitted, or bonded together to form a flexible and pliable structure. </p>
                            </Col>
                        </Row>
                    </Container>
                </section>

                <section className="pt-3">
                    <Container>
                        <Row className="mt-2">
                            <Col lg="3">
                                <div className="filter-sidebar pe-4">
                                    {/* <Form.Group className='mb-4'>
                                        <Form.Label className="fw-600">Search</Form.Label>
                                        <FormControl
                                            type='text'
                                            name='search'
                                            value={search}
                                            className='mr-sm-2'
                                            onChange={handleChangeSearch}
                                            placeholder='Enter your search term...'
                                        />
                                    </Form.Group> */}

                                    <div style={{ position: "relative" }} className="mb-4">
                                        <div>
                                            {/* <Form.Label className="fw-600">Sort By: </Form.Label> */}
                                            <Form.Control as='select' onChange={(e) => handleSortFieldChange(e.target.value)}>
                                                <option value="" disabled selected  >Sort By:</option>
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
                                    </div>

                                    <Form.Group className='mb-4'>
                                        <Form.Label className="fw-600">Eco-Friendly</Form.Label>
                                        <div className='d-flex'>
                                            <div>
                                                <Form.Check
                                                    className="cursor-pointer"
                                                    type="checkbox"
                                                    label="Yes"
                                                    name="eco_friendly"
                                                    checked={ecoFriendly}
                                                    onChange={(e) => handleChangeCheckbox(e.target.checked)}
                                                />
                                            </div>

                                            {/* <div>
                                                <Form.Check
                                                    className="cursor-pointer ms-5"
                                                    type="checkbox"
                                                    label="No"
                                                    name="eco_friendly"
                                                    checked={ecoFriendly}
                                                    onChange={(e) => handleChangeCheckboxNonEco(e.target.checked)}
                                                />
                                            </div> */}
                                        </div>
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

                                    {/* <Form.Group className='mb-4'>
                                        <Form.Label className="fw-600">Colors</Form.Label>
                                        {colors.map((color) => (
                                            <Form.Group key={color}>
                                                <Form.Check
                                                    className="cursor-pointer"
                                                    type="checkbox"
                                                    label={color}
                                                    name="color"
                                                    checked={selectedColors.includes(color)}
                                                    onChange={() => handleColorChange(color)}
                                                />
                                            </Form.Group>
                                        ))}
                                    </Form.Group> */}

                                    <Form.Group className='mb-4'>
                                        <Form.Label className="fw-600">Country</Form.Label>
                                        <Form.Control
                                            as='select'
                                            name='country'
                                            value={country}
                                            className='mr-sm-2'
                                            onChange={handleChangeCountry}
                                        >
                                            <option value=''>Select Country</option>
                                            {Countries.map((country, index) => (
                                                <option key={country + "-" + index} value={country}>
                                                    {country}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group className='mb-4'>
                                        <Form.Label className="fw-600">Price Range</Form.Label>
                                        <Form.Group as={Row} className="mt-3 position-relative">
                                            <MultiRangeSlider min={10} max={1000} onChange={priceRangeChange} />
                                        </Form.Group>
                                    </Form.Group>


                                    {/* <h2>Price Range</h2>
                                    <div>
                                        <label htmlFor="from">From:</label>
                                        <input
                                            type="text"
                                            id="from"
                                            value={priceRange.from}
                                            onChange={(e) => setPriceRange({ ...priceRange, from: e.target.value })}
                                        />

                                        <label htmlFor="to">To:</label>
                                        <input
                                            type="text"
                                            id="to"
                                            value={priceRange.to}
                                            onChange={(e) => setPriceRange({ ...priceRange, to: e.target.value })}
                                        />
                                    </div> */}
                                </div>
                            </Col>
                            <Col lg="9">
                                <div id="profile-designs">
                                    {fabricsLoading ?
                                        <>
                                            <Loading className="bg-white" />
                                        </>
                                        :
                                        <>
                                            {fabrics && fabrics.length > 0 ?
                                                <>
                                                    <Row className="designs-row">
                                                        {fabrics.map((fabric, index) => {
                                                            if (fabric.image_urls?.[0]?.image_url) {
                                                                var fabricImage = process.env.REACT_APP_STORAGE_URL + 'product/' + fabric.image_urls[0].image_url;
                                                            } else {
                                                                var fabricImage = PlaceholderImage;
                                                            }

                                                            var wishlist_user_ids = fabric.wishlist_user_ids;
                                                            const userWishlist = wishlist_user_ids.includes(currentUser);

                                                            return (
                                                                <>
                                                                    {ecoFriendly == 1 && fabric.eco_friendly == 1 && (
                                                                        <>
                                                                            <Col className="designs-grid mb-3" xs="12" md="3">
                                                                                <div className="portfolio-link">
                                                                                {userRole !== 'Admin' ?
                                                                                        <>
                                                                                    <div
                                                                                        className="designs-grid-div w-100 cursor-pointer"
                                                                                        onClick={function () { toggleAddViewCount(fabric.id); navigate('/product/' + fabric.id); }}
                                                                                        style={{ backgroundImage: "url(" + fabricImage + ")", minHeight: '200px' }}
                                                                                    >
                                                                                    </div>
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                    <div
                                                                                        className="designs-grid-div w-100 cursor-pointer"
                                                                                        onClick={function () { toggleAddViewCount(fabric.id); navigate('/admin/fabric/' + fabric.id); }}
                                                                                        style={{ backgroundImage: "url(" + fabricImage + ")", minHeight: '200px' , minWidth: '250px'}}
                                                                                    >
                                                                                    </div>
                                                                                    </>
                                                                                }

                                                                                    {userRole !== 'Admin' ?
                                                                                        <>
                                                                                            <div className='save-link'>
                                                                                                {userWishlist ?
                                                                                                    <div
                                                                                                        className="action-button bg-gold"
                                                                                                        onClick={function () { wishlistUpdate({ user_id: currentUser, product_id: fabric.id }); }}
                                                                                                    >
                                                                                                        <GoHeart className="text-white" />
                                                                                                    </div>
                                                                                                    :
                                                                                                    <div
                                                                                                        className="action-button bg-white"
                                                                                                        onClick={function () { wishlistUpdate({ user_id: currentUser, product_id: fabric.id }); }}
                                                                                                    >
                                                                                                        <GoHeart className="text-black" />
                                                                                                    </div>
                                                                                                }
                                                                                            </div>
                                                                                        </>
                                                                                        :
                                                                                        <>

                                                                                        </>
                                                                                    }
                                                                                </div>
                                                                                <div className="design-details">
                                                                                    <div className='d-flex'>
                                                                                        <h4 className="text-black fs-18 fw-600 mb-0 text-ellipsis pb-1">{fabric.name ?? '-'}</h4>

                                                                                        {currentUser ?
                                                                                            <div className='d-flex align-items-center'>
                                                                                                {fabric.eco_friendly != null && fabric.eco_friendly != '' && (
                                                                                                    <span className='fs-14 text-no-wrap mx-2 green-leaf-tooltip'>
                                                                                                        <div className='tooltip-content'>
                                                                                                            <span className="green-leaf-tooltiptext">Eco-friendly fabric</span>
                                                                                                        </div>
                                                                                                        <ImLeaf color="#55d140" className='mb-1' />
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                            :
                                                                                            null
                                                                                        }
                                                                                    </div>

                                                                                    <div className="star-ratings mt-1">
                                                                                        <Rating
                                                                                            initialValue={0}
                                                                                            readonly={true}
                                                                                            allowFraction={true}
                                                                                            size={20}
                                                                                            className="star-rating"
                                                                                            showTooltip={true}
                                                                                            emptyColor="#dddddd"
                                                                                            fillColor="#cea835"
                                                                                            tooltipArray={[
                                                                                                0, 1, 2, 3, 4, 5
                                                                                            ]}
                                                                                            tooltipDefaultText="0.0"
                                                                                        /* Available Props */
                                                                                        />
                                                                                    </div>
                                                                                    <h4 className="text-black fs-18 fw-600 mt-2 text-ellipsis">${fabric.price && fabric.price > 0 ? Number(fabric.price).toFixed(2) : '0.00'}</h4>
                                                                                    {/* {currentUser ?
                                                                                <div className='d-flex align-items-center mt-1'>
                                                                                    {fabric.user.image ?
                                                                                        <div className='designer-photo-small' style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'user/'+fabric.user.image+")"}} ></div>
                                                                                        :
                                                                                        <div className='designer-photo-small' style={{ backgroundImage: "url("+UserPlaceholder+")"}} ></div>
                                                                                    }
                                                                                    &nbsp;&nbsp;
                                                                                    <p className="text-black fs-14 mb-0">{fabric.user.first_name && fabric.user.first_name != "" ? fabric.user.first_name : "-"} {fabric.user.last_name && fabric.user.last_name != "" ? fabric.user.last_name : "-"}</p>
                                                                                </div>
                                                                                :
                                                                                null
                                                                            } */}
                                                                                </div>
                                                                            </Col>
                                                                        </>
                                                                    )}

                                                                    {ecoFriendly == 0 && (
                                                                        <>
                                                                            <Col className="designs-grid mb-3" xs="12" md="3">
                                                                                <div className="portfolio-link">
                                                                                {userRole !== 'Admin' ?
                                                                                        <>
                                                                                    <div
                                                                                        className="designs-grid-div w-100 cursor-pointer"
                                                                                        onClick={function () { toggleAddViewCount(fabric.id); navigate('/product/' + fabric.id); }}
                                                                                        style={{ backgroundImage: "url(" + fabricImage + ")", minHeight: '200px'}}
                                                                                    >
                                                                                    </div>
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                    <div
                                                                                        className="designs-grid-div w-100 cursor-pointer"
                                                                                        onClick={function () { toggleAddViewCount(fabric.id); navigate('/admin/fabric/' + fabric.id); }}
                                                                                        style={{ backgroundImage: "url(" + fabricImage + ")", minHeight: '200px'}}
                                                                                    >
                                                                                    </div>
                                                                                    </>
                                                                                }   

                                                                                    {userRole !== 'Admin' ?
                                                                                        <>
                                                                                            <div className='save-link'>

                                                                                                {userWishlist ?
                                                                                                    <div
                                                                                                        className="action-button bg-gold"
                                                                                                        onClick={function () { wishlistUpdate({ user_id: currentUser, product_id: fabric.id }); }}
                                                                                                    >
                                                                                                        <GoHeart className="text-white" />
                                                                                                    </div>
                                                                                                    :
                                                                                                    <div
                                                                                                        className="action-button bg-white"
                                                                                                        onClick={function () { wishlistUpdate({ user_id: currentUser, product_id: fabric.id }); }}
                                                                                                    >
                                                                                                        <GoHeart className="text-black" />
                                                                                                    </div>
                                                                                                }
                                                                                            </div>
                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                        </>
                                                                                    }
                                                                                </div>
                                                                                <div className="design-details">
                                                                                    <div className='d-flex'>
                                                                                        <h4 className="text-black fs-18 fw-600 mb-0 fabric-ellipsis pb-1">{fabric.name ?? '-'}</h4>

                                                                                        {currentUser ?
                                                                                            <div className='d-flex align-items-center'>
                                                                                                {fabric.eco_friendly != null && fabric.eco_friendly != '' && (
                                                                                                    <span className='fs-14 text-no-wrap mx-2 green-leaf-tooltip'>
                                                                                                        <div className='tooltip-content'>
                                                                                                            <span className="green-leaf-tooltiptext">Eco-friendly fabric</span>
                                                                                                        </div>
                                                                                                        <ImLeaf color="#55d140" className='mb-1' />
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                            :
                                                                                            null
                                                                                        }
                                                                                    </div>

                                                                                    <div className="star-ratings mt-1">
                                                                                        <Rating
                                                                                            initialValue={0}
                                                                                            readonly={true}
                                                                                            allowFraction={true}
                                                                                            size={20}
                                                                                            className="star-rating"
                                                                                            showTooltip={true}
                                                                                            emptyColor="#dddddd"
                                                                                            fillColor="#cea835"
                                                                                            tooltipArray={[
                                                                                                0, 1, 2, 3, 4, 5
                                                                                            ]}
                                                                                            tooltipDefaultText="0.0"
                                                                                        /* Available Props */
                                                                                        />
                                                                                    </div>
                                                                                    <h4 className="text-black fs-18 fw-600 mt-2 text-ellipsis">${fabric.price && fabric.price > 0 ? Number(fabric.price).toFixed(2) : '0.00'}</h4>
                                                                                    {/* {currentUser ?
                                                                                <div className='d-flex align-items-center mt-1'>
                                                                                    {fabric.user.image ?
                                                                                        <div className='designer-photo-small' style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'user/'+fabric.user.image+")"}} ></div>
                                                                                        :
                                                                                        <div className='designer-photo-small' style={{ backgroundImage: "url("+UserPlaceholder+")"}} ></div>
                                                                                    }
                                                                                    &nbsp;&nbsp;
                                                                                    <p className="text-black fs-14 mb-0">{fabric.user.first_name && fabric.user.first_name != "" ? fabric.user.first_name : "-"} {fabric.user.last_name && fabric.user.last_name != "" ? fabric.user.last_name : "-"}</p>
                                                                                </div>
                                                                                :
                                                                                null
                                                                            } */}
                                                                                </div>
                                                                            </Col>
                                                                        </>
                                                                    )}
                                                                </>
                                                            )
                                                        })}
                                                    </Row>
                                                </>
                                                :
                                                <p className="text-center fs-20 mb-3 mt-3">No records found.</p>
                                            }
                                        </>
                                    }
                                </div>
                            </Col>

                            <Pagination
                                className="mt-4 mb-0"
                                currentPage={currentPage}
                                totalCount={pageCount}
                                pageSize={PageSize}
                                onPageChange={page => handleChangePage(page)}
                            />

                        </Row>
                    </Container>
                </section>
            </div >
        </Layout >
    );
};

export default Fabrics;