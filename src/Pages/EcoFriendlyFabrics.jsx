import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { IoShirtSharp } from "react-icons/io5";
import Layout from 'Components/Layout/Layout';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import toast from 'react-hot-toast';
import { ImLeaf } from "react-icons/im";
import GoBack from 'Components/Shared/GoBack';
import { GoHeart } from "react-icons/go";
import { AiOutlineShoppingCart } from "react-icons/ai";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
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
import DressIcon from 'Assets/images/icons/dress.png';
import CurrencyConverter from 'Components/Shared/CurrencyConverter';
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const Fabrics = (props) => {
    const navigate = useNavigate();
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery();
    const headerSearch = query.get('search');
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'selectedCountry', 'tempCart', 'cartItemCount']);
    const [mounted, setMounted] = useState(false);
    const [fabrics, setFabrics] = useState([]);
    const [fabricsLoading, setFabricsLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);

    // Filter
    const [ecoFriendly, setEcoFriendly] = useState(0);
    const [selectedCompositions, setSelectedCompositions] = useState([]);
    const [selectedAllCompositions, setSelectedAllCompositions] = useState([]);
    const [selectedWeaves, setSelectedWeaves] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [country, setCountry] = useState('');
    const [priceRange, setPriceRange] = useState({ from: '', to: '' });
    const [search, setSearch] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [selectedCountry, setSelectedCountry] = useState(cookies.selectedCountry ?? '');
    const [tempCart, setTempCart] = useState(cookies.tempCart ?? []);
    const [addToCartLoading, setAddToCartLoading] = useState(false);
    const [fabricsFilter, setFabricsFilter] = useState({});
    const [unitMeasurement, setUnitMeasurement] = useState('');
    const [width, setWidth] = useState('');
    const [length, setLength] = useState('');
    const [activeTabGroup, setActiveTabGroup] = useState('');
    
    const colors = ['Red', 'Blue', 'Green', 'Yellow']; // Replace with your array of colors
    const compositions = [
        'Cotton',
        'Linen',
        'Hemp',
        'Jute',
        'Bamboo',
        'Wool',
        'Silk',
        'Cashmere',
        'Mohair',
        'Angora',
        'Polyester',
        'Nylon',
        'Acrylic',
        'Spandex (Lycra)',
        'Polypropylene',
        'Rayon (Viscose)',
        'Lyocell (Tencel)',
        'Modal',
        'Acetate',
    ]; // Replace with your array of composition options
    const weaves = ['Plain', 'Twill', 'Satin', 'Basket', 'Herringbone', 'Jacquard', 'Dobby', 'Leno']; // Replace with your array of weave options

    const currentUser = cookies.currentUser;
    const userRole = cookies.userRole;
    const token = cookies.token;
    const user = cookies.userDetails;

    let PageSize = 32;

    const [sortOptions] = useState([
        { value: 'created_at', label: 'Date' },
        { value: 'price', label: 'Price' },
        { value: 'views', label: 'Views' },
    ]);

    const settings = {
        className: "slider variable-width",
        dots: false,
        infinite: false,
        centerMode: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        variableWidth: true,
        nextArrow: <FaChevronRight className="category-slider-nav" size="6px" color="#000000" />,
        prevArrow: <FaChevronLeft className="category-slider-nav" size="6px" color="#000000" />,
    };

    const [selectedSortField, setSelectedSortField] = useState(null);
    const [selectedSortOrder, setSelectedSortOrder] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedAllCategories, setSelectedAllCategories] = useState(false);
    const [selectedSustainabilities, setSelectedSustainabilities] = useState([]);
    const [selectedColorFastness, setSelectedColorFastness] = useState([]);
    const [wrinkleResistant, setWrinkleResistant] = useState('');
    const [cutToSize, setCutToSize] = useState('');
    
    // Search 
    const [primaryColorSearch, setPrimaryColorSearch] = useState('');
    const [primaryColorValue, setPrimaryColorValue] = useState('');

    const [patternSearch, setPatternSearch] = useState('');
    const [patternValue, setPatternValue] = useState('');

    const [textureSearch, setTextureSearch] = useState('');
    const [textureValue, setTextureValue] = useState('');

    const [opacitySearch, setOpacitySearch] = useState('');
    const [opacityValue, setOpacityValue] = useState('');
    

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
            // eco_friendly: selectedSustainabilities.includes('Eco-friendly') ? 1 : null,
            composition: selectedCompositions,
            weave: selectedWeaves,
            primary_color: primaryColorSearch,
            price_range: priceRange,
            sortField: field, // Only the field without order
            sortOrder: null, // Reset order when changing field
            search: searchValue,
            country: country,
            sustainability: selectedSustainabilities,
            unit_measurement: unitMeasurement,
            width: width,
            length: length,
            cut_to_size: cutToSize,
            wrinkle_resistant: wrinkleResistant,
            color_fastness: selectedColorFastness,
            pattern: patternSearch,
            texture: textureSearch,
            opacity: opacitySearch,
            
        });
    };

    const handleSortOrderChange = (order) => {
        setSelectedSortOrder(order);

        // Call the API with the updated filter values and sorting parameters
        onFilterChange({
            // eco_friendly: selectedSustainabilities.includes('Eco-friendly') ? 1 : null,
            composition: selectedCompositions,
            weave: selectedWeaves,
            primary_color: primaryColorSearch,
            price_range: priceRange,
            sortField: selectedSortField,
            sortOrder: order,
            search: searchValue,
            country: country,
            sustainability: selectedSustainabilities,
            unit_measurement: unitMeasurement,
            width: width,
            length: length,
            cut_to_size: cutToSize,
            wrinkle_resistant: wrinkleResistant,
            color_fastness: selectedColorFastness,
            pattern: patternSearch,
            texture: textureSearch,
            opacity: opacitySearch,
        });
    };
    
    async function onFilterChange(data) {
        setFabricsLoading(true);
        setFabricsFilter(data);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'product/filter?page=' + currentPage + '&user_id=' + currentUser + '&token=' + token, data).then((response) => {
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
    
        if (updatedCompositions.length === compositions.length) {
            setSelectedAllCompositions(true); 
        } else {
            setSelectedAllCompositions(false);  
        }
            setSelectedCompositions(updatedCompositions);
    };
    const handleAllCompositionSelect = () => {
        if (selectedCompositions.length === compositions.length) {
            setSelectedCompositions([]); 
        } else {
            setSelectedCompositions(compositions); 
        }
    };

    const handleAllWeaveSelect = () => {
        if (selectedWeaves.length === weaves.length) {
            setSelectedWeaves([]); 
        } else {
            setSelectedWeaves(weaves); 
        }
    };

    const handleChangeCategory = (event) => {
        const categoryId = parseInt(event, 10);
        if (!selectedCategories.includes(categoryId)) {
            setSelectedCategories([...selectedCategories, categoryId]);
            if (selectedAllCategories.length + 1 === categories.length) {
                setSelectedAllCategories(true);
            } else {
                setSelectedAllCategories(false);
            }
        } else {
            setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
        }
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

    const handleChangeUnitMeasurement = (e) => {
        var { name, value } = e.target;
        setUnitMeasurement(value);
    };

    const handleChangeWidth = (e) => {
        var { name, value } = e.target;
        setWidth(value);
    };

    const handleChangeLength = (e) => {
        var { name, value } = e.target;
        setLength(value);
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

    const handleChangeCountry = (e) => {
        setCountry(e.target.value);
    };

    const colorChangeDebounce = debounce((e) => {
        setPrimaryColorSearch(e);
    }, 1000); // 1000 milliseconds (2 seconds) delay

    const handleChangeColor = (e) => {
        const { name, value } = e.target;
        // Clear the previous debounce timer
        colorChangeDebounce.cancel();

        // Set a new debounce timer
        colorChangeDebounce(value);
        setPrimaryColorValue(value);
    };

    const textureChangeDebounce = debounce((e) => {
        setTextureSearch(e);
    }, 1000); // 1000 milliseconds (2 seconds) delay

    const handleChangeTexture = (e) => {
        const { name, value } = e.target;
        // Clear the previous debounce timer
        textureChangeDebounce.cancel();

        // Set a new debounce timer
        textureChangeDebounce(value);
        setTextureValue(value);
    };

    const patternChangeDebounce = debounce((e) => {
        setPatternSearch(e);
    }, 1000); // 1000 milliseconds (2 seconds) delay

    const handleChangePattern = (e) => {
        const { name, value } = e.target;
        // Clear the previous debounce timer
        patternChangeDebounce.cancel();

        // Set a new debounce timer
        patternChangeDebounce(value);
        setPatternValue(value);
    };

    const opacityChangeDebounce = debounce((e) => {
        setOpacitySearch(e);
    }, 1000); // 1000 milliseconds (2 seconds) delay

    const handleChangeOpacity = (e) => {
        const { name, value } = e.target;
        // Clear the previous debounce timer
        opacityChangeDebounce.cancel();

        // Set a new debounce timer
        opacityChangeDebounce(value);
        setOpacityValue(value);
    };

    async function wishlistUpdate(e) {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'wishlist/update', e).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                onWishlistChange({
                    // eco_friendly: selectedSustainabilities.includes('Eco-friendly') ? 1 : null,
                    composition: selectedCompositions,
                    weave: selectedWeaves,
                    primary_color: primaryColorSearch,
                    price_range: priceRange,
                    sortField: selectedSortField,
                    sortOrder: selectedSortOrder,
                    search: searchValue,
                    country: country,
                    sustainability: selectedSustainabilities,
                    unit_measurement: unitMeasurement,
                    width: width,
                    length: length,
                    cut_to_size: cutToSize,
                    wrinkle_resistant: wrinkleResistant,
                    pattern: patternSearch,
                    texture: textureSearch,
                    opacity: opacitySearch,
                    color_fastness: selectedColorFastness,
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
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'product/filter?page=' + pageNumber + '&user_id=' + currentUser, fabricsFilter)
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

    async function addToCart(e) {
        setAddToCartLoading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'cart', e).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                toast.success("Fabric added to cart successfully!");
                const currentCartCount = cookies.cartItemCount ?? 0;
                const latestCartItemCount = parseInt(currentCartCount) +  parseInt(e.quantity);
                setCookie('cartItemCount', latestCartItemCount, { path: '/' });
                // setTimeout(() => {
                //     window.location.reload(); 
                // }, 500);
            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
            setAddToCartLoading(false);
        }).catch((error) => {
            setAddToCartLoading(false);
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    const addToTempCart = (e) => {
        setAddToCartLoading(true);
        const itemIndex = tempCart.findIndex(item => item.id === e.id); // Assuming each item has a unique 'id'

        let updatedCart;

        if (itemIndex !== -1) {
            // Item exists, update the quantity
            updatedCart = tempCart.map((item, index) => {
                if (index === itemIndex) {
                    return {
                        ...item,
                        quantity: parseInt(item.quantity) + parseInt(e.quantity) // Update the quantity
                    };
                }
                return item;
            });
        } else {
            // Item does not exist, add it to the cart
            updatedCart = [...tempCart, e];
        }

        setTempCart(updatedCart);
        setCookie('tempCart', JSON.stringify(updatedCart), { path: '/' });

        const currentCartCount = cookies.cartItemCount ?? 0;
        const latestCartItemCount = parseInt(currentCartCount) +  parseInt(e.quantity);
        setCookie('cartItemCount', latestCartItemCount, { path: '/' });

        setTimeout(function () {
            toast.success("Fabric added to cart successfully!");
            setAddToCartLoading(false);
        }, 500);
    }

    const handleSelectSustainability = (event) => {
        const sustainability = event.target.value;
        if (event.target.checked) {
            setSelectedSustainabilities([...selectedSustainabilities, sustainability]);
        } else {
            setSelectedSustainabilities(selectedSustainabilities.filter(s => s !== sustainability));
        }
    };

    const handleSelectColorFastness = (event) => {
        const colorFastness = event.target.value;
        if (event.target.checked) {
            setSelectedColorFastness([...selectedColorFastness, colorFastness]);
        } else {
            setSelectedColorFastness(selectedColorFastness.filter(s => s !== colorFastness));
        }
    };

    useEffect(() => {
        // Only run the filter API call after the component has mounted
        if (mounted) {
            // Call the API with the updated filter values
            onFilterChange({
                // eco_friendly: selectedSustainabilities.includes('Eco-friendly') ? 1 : null,
                composition: selectedCompositions,
                weave: selectedWeaves,
                primary_color: primaryColorSearch,
                price_range: priceRange,
                sortField: selectedSortField,
                sortOrder: selectedSortOrder,
                search: searchValue || headerSearch || '',
                country: country,
                sustainability: selectedSustainabilities,
                unit_measurement: unitMeasurement,
                width: width,
                length: length,
                cut_to_size: cutToSize,
                wrinkle_resistant: wrinkleResistant,
                pattern: patternSearch,
                texture: textureSearch,
                color_fastness: selectedColorFastness,
                opacity: opacitySearch,
            });
        } else {
            // Set the component as mounted
            setMounted(true);
        }
    }, [unitMeasurement, opacitySearch, patternSearch, textureSearch, selectedColorFastness, cutToSize, wrinkleResistant, ecoFriendly, selectedCompositions, selectedWeaves, selectedColors, width, length, selectedSustainabilities, priceRange, reloadCount, searchValue, country, headerSearch]);

    useEffect(() => {
        setSelectedCountry(cookies.selectedCountry ?? '');
        setCountry(cookies.selectedCountry ?? '');
    }, [cookies]);

    return (
        <Layout>
            <div className='pb-5 pt-10 px-5'>
                <section>
                    <Container>
                        <Row className="mt-2">
                            <Col lg="12">
                                <div className="ddf-header">
                                    <Row>
                                        <Col lg="3" className="filter-sidebar">
                                            <div className="pe-4">
                                                <p className="mb-0 fs-14 fw-500"><Link className="text-decoration-none text-muted" to="/">Home</Link> / Eco-Friendly Fabrics</p>
                                            </div>
                                        </Col>
                                        <Col lg="9" className="category-slider">
                                            <div  className="ps-4">
                                                <Row>
                                                <Col lg="9">
                                                        <div className="category-pills">
                                                            {compositions && compositions.length > 0 ? (
                                                                <Slider {...settings}>
                                                                    {selectedAllCompositions || selectedCompositions.length < 1  ?
                                                                        <div className="mx-2 cursor-pointer">
                                                                            <span class="badge badge-dark bg-dark fs-12 fw-400 text-center">All</span>
                                                                        </div>
                                                                        :
                                                                        <div className="mx-2 cursor-pointer" onClick={function() { setSelectedAllCompositions(true); setSelectedCompositions([]) }}>
                                                                            <span class="badge badge-dark bg-white fs-12 text-dark fw-400 text-center">All</span>
                                                                        </div>
                                                                    }
                                                                    {compositions.map((composition, index) => (
                                                                        <>
                                                                            {selectedCompositions.includes(composition) ?
                                                                                <div className="mx-2 cursor-pointer" onClick={function() { handleCompositionChange(composition); }}>
                                                                                    <span className="badge badge-dark bg-dark fs-12 fw-400 text-center">{composition}</span>
                                                                                </div>
                                                                                :
                                                                                <div className="mx-2 cursor-pointer" onClick={function() { handleCompositionChange(composition); }}>
                                                                                    <span className="badge badge-dark bg-white text-dark fs-12 fw-400 text-center">{composition}</span>
                                                                                </div>
                                                                            }
                                                                        </>
                                                                    ))}
                                                                </Slider>
                                                            ) 
                                                            :
                                                                null
                                                            }
                                                            
                                                        </div>
                                                    </Col>
                                                    <Col lg="3" className="text-right">
                                                        {currentUser ?
                                                            <>
                                                                {user.is_seller == 1 ?
                                                                    <Link to="/user/profile?tab=fabrics&tab_group=fabrics">
                                                                        <button className="ddf-button fs-12 btn bg-white border-black text-black bg-white-hover border-gold-hover text-black-hover">
                                                                            <img src={DressIcon} className="ddf-button-icon" alt="Designs" /> Display Your Creations
                                                                        </button>
                                                                    </Link>
                                                                    :
                                                                    <Link to="/user/seller-form">
                                                                        <button className="ddf-button fs-12 btn bg-white border-black text-black bg-white-hover border-gold-hover text-black-hover">
                                                                            <img src={DressIcon} className="ddf-button-icon" alt="Designs" /> Display Your Creations
                                                                        </button>
                                                                    </Link>
                                                                }
                                                                
                                                            </>
                                                            :
                                                            <Link to="/sign-up?type=seller">
                                                                <button className="ddf-button fs-12 btn bg-white border-black text-black bg-white-hover border-gold-hover text-black-hover">
                                                                    <img src={DressIcon} className="ddf-button-icon" alt="Designs" /> Display Your Creations
                                                                </button>
                                                            </Link>
                                                        }
                                                        
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col lg="3" className="filter-sidebar">
                                <div className="pe-4 pt-3">
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
                                    <Form.Group className='mb-4'>
                                        <Form.Label className="fw-600 fs-14">Search</Form.Label>
                                        <Form.Control placeholder="Enter your search term..." type="text" onChange={(e) => handleChangeSearch(e)} />
                                    </Form.Group>
                                    <div style={{ position: "relative" }} className="mb-4">
                                        <div>
                                            <Form.Label className="fw-600 fs-14">Sort</Form.Label>
                                            <Form.Control as='select' onChange={(e) => handleSortFieldChange(e.target.value)}>
                                                <option value="" disabled selected  >Sort By:</option>
                                                {sortOptions.map(option => (
                                                    <option key={option.value} value={option.value} selected={option.value === selectedSortField}>{option.label}</option>
                                                ))}
                                            </Form.Control>
                                            {selectedSortField && (
                                                <div className="mt-3">
                                                    <Form.Label className="fw-600 fs-14">Order: </Form.Label>
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
                                        <Form.Label className="fw-600 fs-14">Country</Form.Label>
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
                                    <hr />
                                    <Form.Group className='mb-5'>
                                        <Form.Label className="fw-600 fs-14">Price Range</Form.Label>
                                        <Form.Group as={Row} className="mt-3 position-relative">
                                            <MultiRangeSlider min={1} max={100000} onChange={priceRangeChange} />
                                        </Form.Group>
                                    </Form.Group>
                                    <hr />
                                    <Form.Group className='mb-3'>
                                        <Form.Label className="fw-600 fs-14">Measurement</Form.Label>
                                        <Row>
                                            <Form.Group as={Col} lg={12} className="mb-3">
                                                <Form.Control as='select' name='unit_measurement' value={unitMeasurement} className='mr-sm-2' onChange={handleChangeUnitMeasurement}>
                                                    <option value='' disabled selected> Select Unit of Measurement</option>
                                                    <option value='millimeter' className="fs-12">Millimeter</option>
                                                    <option value='centimeter' className="fs-12">Centimeter</option>
                                                    <option value='meter' className="fs-12">Meter</option>
                                                    <option value='inch' className="fs-12">Inch</option>
                                                    <option value='feet' className="fs-12">Feet</option>
                                                    <option value='yard' className="fs-12">Yard</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group as={Col} lg={6}>
                                                <Form.Label className="fs-12">Length {unitMeasurement ? `(${unitMeasurement})` : null}
                                                </Form.Label>
                                                <FormControl type='number' name='length' value={length} className='mr-sm-2' onChange={handleChangeLength} placeholder='' />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={6}>
                                                <Form.Label className="fs-12">Width {unitMeasurement ? `(${unitMeasurement})` : null}</Form.Label>
                                                <FormControl type='number' name='width' value={width} className='mr-sm-2' onChange={handleChangeWidth} placeholder='' />
                                            </Form.Group>
                                        </Row>
                                    </Form.Group>
                                    <hr />
                                    <Form.Group className='mb-3'>
                                        <Form.Label className="fw-600 fs-14">Color Fastness</Form.Label>
                                        <Row>
                                            <Form.Group as={Col} lg={12}>
                                                <Form.Check
                                                    type="checkbox"
                                                    label="High"
                                                    value="High"
                                                    checked={selectedColorFastness.includes("High")}
                                                    onChange={handleSelectColorFastness}
                                                    className="cursor-pointer fs-12"
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12}>
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Moderate"
                                                    value="Moderate"
                                                    checked={selectedColorFastness.includes("Moderate")}
                                                    onChange={handleSelectColorFastness}
                                                    className="cursor-pointer fs-12"
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12}>
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Low"
                                                    value="Low"
                                                    checked={selectedColorFastness.includes("Low")}
                                                    onChange={handleSelectColorFastness}
                                                    className="cursor-pointer fs-12"
                                                />
                                            </Form.Group>
                                        </Row>
                                    </Form.Group>
                                    <hr />
                                    <Form.Group className='mb-3'>
                                        <Form.Label className="fw-600 fs-14">Sustainability</Form.Label>
                                        <Row>
                                            <Form.Group as={Col} lg={12}>
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Eco-friendly"
                                                    value="Eco-friendly"
                                                    checked={selectedSustainabilities.includes("Eco-friendly")}
                                                    onChange={handleSelectSustainability}
                                                    className="cursor-pointer fs-12"
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12}>
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Recycled fibers"
                                                    value="Recycled fibers"
                                                    checked={selectedSustainabilities.includes("Recycled fibers")}
                                                    onChange={handleSelectSustainability}
                                                    className="cursor-pointer fs-12"
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12}>
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Biodegradable fibers"
                                                    value="Biodegradable fibers"
                                                    checked={selectedSustainabilities.includes("Biodegradable fibers")}
                                                    onChange={handleSelectSustainability}
                                                    className="cursor-pointer fs-12"
                                                />
                                            </Form.Group>
                                        </Row>
                                    </Form.Group>
                                    <hr />
                                    <Form.Group className='mb-3'>
                                        <Form.Label className="fw-600 fs-14">Primary Color</Form.Label>
                                        <Form.Control value={primaryColorValue} onChange={(e) => handleChangeColor(e)}></Form.Control>
                                    </Form.Group>
                                    <hr />
                                    <p className="fabric-side-dropdown fw-600 fs-14 mb-12 position-relative" onClick={function () { setActiveTabGroup((prevActiveGroup) => prevActiveGroup == "primary-fiber" ? "" : activeTabGroup != "primary-fiber" ? "primary-fiber" : ""); }}>
                                        Primary Fiber
                                        {activeTabGroup != "primary-fiber" ?
                                            <>
                                                <AiOutlinePlus size="10px" className="accordion-icon" />
                                            </>
                                            :
                                            <>
                                                <AiOutlineMinus size="10px" className="accordion-icon" />
                                            </>
                                        }
                                    </p>

                                    <div className={`ms-3 fabric-accordion-content ${activeTabGroup == "primary-fiber" ? 'open' : ''}`}>
                                        <Form.Group className='mb-3'>
                                            <Form.Group key="all">
                                                <Form.Check
                                                    className="cursor-pointer fs-12"
                                                    type="checkbox"
                                                    label="All"
                                                    name="composition"
                                                    checked={selectedCompositions.length === compositions.length || selectedCompositions.length === 0}
                                                    onChange={handleAllCompositionSelect}
                                                />
                                            </Form.Group>
                                            {compositions.map((composition) => (
                                                <Form.Group key={composition}>
                                                    <Form.Check
                                                        className="cursor-pointer fs-12"
                                                        type="checkbox"
                                                        label={composition}
                                                        name="composition"
                                                        checked={selectedCompositions.includes(composition)}
                                                        onChange={() => handleCompositionChange(composition)}
                                                    />
                                                </Form.Group>
                                            ))}
                                        </Form.Group>
                                    </div>
                                    <hr />
                                    <p className="fabric-side-dropdown fw-600 fs-14 mb-12 position-relative" onClick={function () { setActiveTabGroup((prevActiveGroup) => prevActiveGroup == "weave" ? "" : activeTabGroup != "weave" ? "weave" : ""); }}>
                                        Weave
                                        {activeTabGroup != "weave" ?
                                            <>
                                                <AiOutlinePlus size="10px" className="accordion-icon" />
                                            </>
                                            :
                                            <>
                                                <AiOutlineMinus size="10px" className="accordion-icon" />
                                            </>
                                        }
                                    </p>

                                    <div className={`ms-3 fabric-accordion-content ${activeTabGroup == "weave" ? 'open' : ''}`}>
                                        <Form.Group className='mb-3'>
                                            <Form.Group key="all">
                                                <Form.Check
                                                    className="cursor-pointer fs-12"
                                                    type="checkbox"
                                                    label="All"
                                                    name="weave"
                                                    checked={selectedWeaves.length === weaves.length || selectedWeaves.length === 0}
                                                    onChange={handleAllWeaveSelect}
                                                />
                                            </Form.Group>
                                            {weaves.map((weave) => (
                                                <Form.Group key={weave}>
                                                    <Form.Check
                                                        className="cursor-pointer fs-12"
                                                        type="checkbox"
                                                        label={weave}
                                                        name="weave"
                                                        checked={selectedWeaves.includes(weave)}
                                                        onChange={() => handleWeaveChange(weave)}
                                                    />
                                                </Form.Group>
                                            ))}
                                        </Form.Group>   
                                    </div>
                                    <hr />
                                    <Form.Group className='mb-3'>
                                        <Form.Label className="fw-600 fs-14">Pattern</Form.Label>
                                        <Form.Control value={patternValue} onChange={(e) => handleChangePattern(e)}></Form.Control>
                                    </Form.Group>
                                    <hr />
                                    <Form.Group className='mb-3'>
                                        <Form.Label className="fw-600 fs-14">Texture</Form.Label>
                                        <Form.Control value={textureValue} onChange={(e) => handleChangeTexture(e)}></Form.Control>
                                    </Form.Group>
                                    <hr />
                                    <Form.Group className='mb-3'>
                                        <Form.Label className="fw-600 fs-14">Opacity</Form.Label>
                                        <Form.Control value={opacityValue} onChange={(e) => handleChangeOpacity(e)}></Form.Control>
                                    </Form.Group>
                                    <hr />
                                    <Form.Group className='mb-3'>
                                        <Form.Label className="fw-600 fs-14">Cut to size</Form.Label>
                                        <Row>
                                            <Form.Group as={Col} lg={3}>
                                                <Form.Check
                                                    className="cursor-pointer fs-12"
                                                    type="radio"
                                                    label="Yes"
                                                    value="1"
                                                    checked={cutToSize == 1 && cutToSize != ""}
                                                    onChange={() => setCutToSize(() => "1")}
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={2}>
                                                <Form.Check
                                                    className="cursor-pointer fs-12"
                                                    type="radio"
                                                    label="No"
                                                    value="0"
                                                    checked={cutToSize == 0 && cutToSize != ""}
                                                    onChange={() => setCutToSize(() => "0")}
                                                />
                                            </Form.Group>
                                        </Row>
                                    </Form.Group>
                                    <hr />
                                    <Form.Group className='mb-3'>
                                        <Form.Label className="fw-600 fs-14">Wrinkle-Resistant</Form.Label>
                                        <Row>
                                            <Form.Group as={Col} lg={3}>
                                                <Form.Check
                                                    className="cursor-pointer fs-12"
                                                    type="radio"
                                                    label="Yes"
                                                    value="1"
                                                    checked={wrinkleResistant == 1 && wrinkleResistant != ""}
                                                    onChange={() => setWrinkleResistant((e) => "1")}
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={2}>
                                                <Form.Check
                                                    className="cursor-pointer fs-12"
                                                    type="radio"
                                                    label="No"
                                                    value="0"
                                                    checked={wrinkleResistant == 0 && wrinkleResistant != ""}
                                                    onChange={() => setWrinkleResistant((e) => "0")}
                                                />
                                            </Form.Group>
                                        </Row>
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
                                <div id="profile-designs" className="ps-2 pt-4">
                                    {fabricsLoading ?
                                        <>
                                            <Card className="text-center">
                                                <Card.Body>
                                                    <Loading className="bg-white py-0" />
                                                </Card.Body>
                                            </Card>
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
                                                                    {fabric.eco_friendly == 1 ?
                                                                    <Col className="designs-grid mb-3" xs="12" md="3">
                                                                        <div className="portfolio-link">
                                                                            {userRole !== 'Admin' ?
                                                                                <>
                                                                                    <div
                                                                                        className="designs-grid-div w-100 cursor-pointer"
                                                                                        onClick={function () { toggleAddViewCount(fabric.id); navigate('/product/' + fabric.id); }}
                                                                                        style={{ backgroundImage: "url(" + fabricImage + ")", minHeight: '229px' }}
                                                                                    >
                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    <div
                                                                                        className="designs-grid-div w-100 cursor-pointer"
                                                                                        onClick={function () { toggleAddViewCount(fabric.id); navigate('/admin/fabric/' + fabric.id); }}
                                                                                        style={{ backgroundImage: "url(" + fabricImage + ")", minHeight: '229px' }}
                                                                                    >
                                                                                    </div>
                                                                                </>
                                                                            }
                                                                            {userRole !== 'Admin' && fabric.user.id != currentUser && currentUser ?
                                                                                <>
                                                                                    <div className='save-link'>
                                                                                        {userWishlist ?
                                                                                            <div className="kouture-tooltip">
                                                                                                <div className="action-button bg-gold"
                                                                                                    onClick={function () { wishlistUpdate({ user_id: currentUser, product_id: fabric.id }); }}
                                                                                                >
                                                                                                    <GoHeart className="text-white" />
                                                                                                </div>
                                                                                                <div className="kouture-tooltiptext" style={{width: '190px', left: '-22px'}}>
                                                                                                    Remove from Wishlist
                                                                                                </div>
                                                                                            </div>
                                                                                            :
                                                                                            <div className="kouture-tooltip">
                                                                                                <div className="action-button bg-white"
                                                                                                    onClick={function () { wishlistUpdate({ user_id: currentUser, product_id: fabric.id }); }}
                                                                                                >
                                                                                                    <GoHeart className="text-black" />
                                                                                                </div>
                                                                                                <div className="kouture-tooltiptext" style={{width: '190px', left: '-22px'}}>
                                                                                                    Add to Wishlist
                                                                                                </div>
                                                                                            </div>
                                                                                        }
                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    {/* <div className='save-link'>
                                                                                        {userWishlist ?
                                                                                            <div className="kouture-tooltip">
                                                                                                <div className="action-button bg-gold">
                                                                                                    <GoHeart className="text-white" />
                                                                                                </div>
                                                                                                <div className="kouture-tooltiptext" style={{width: '190px', left: '-22px'}}>
                                                                                                    Remove from Wishlist
                                                                                                </div>
                                                                                            </div>
                                                                                            :
                                                                                            <div className="kouture-tooltip">
                                                                                                <div className="action-button bg-white">
                                                                                                    <GoHeart className="text-black" />
                                                                                                </div>
                                                                                                <div className="kouture-tooltiptext" style={{width: '190px', left: '-22px'}}>
                                                                                                    Add to Wishlist
                                                                                                </div>
                                                                                            </div>
                                                                                        }
                                                                                    </div> */}
                                                                                </>
                                                                            }
                                                                        </div>
                                                                        <div className="design-details">
                                                                            <div className='d-flex justify-content-between align-items-center'>
                                                                                <div className="d-flex">
                                                                                {userRole !== 'Admin' ?
                                                                                <>
                                                                                    <h4 className="text-black fs-18 fw-600 mb-0 max-150 text-ellipsis cursor-pointer fabric-name" 
                                                                                    onClick={function () { toggleAddViewCount(fabric.id); navigate('/product/' + fabric.id); }}
                                                                                    >{fabric.name ?? '-'}</h4>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    <h4 className="text-black fs-18 fw-600 mb-0 max-150 text-ellipsis cursor-pointer fabric-name"
                                                                                    onClick={function () { toggleAddViewCount(fabric.id); navigate('/admin/fabric/' + fabric.id); }}>
                                                                                    {fabric.name ?? '-'}</h4>
                                                                                </>
                                                                                }
                                                                                    
                                                                                    {fabric.eco_friendly == 1 ?
                                                                                        <div className='d-flex align-items-center'>
                                                                                            <span className='fs-14 text-no-wrap mx-2 green-leaf-tooltip'>
                                                                                                <div className='tooltip-content'>
                                                                                                    <span className="green-leaf-tooltiptext">Eco-friendly fabric</span>
                                                                                                </div>
                                                                                                <ImLeaf color="#55d140" className='mb-1' />
                                                                                            </span>
                                                                                        </div>
                                                                                        :
                                                                                        null
                                                                                    }
                                                                                </div>
                                                                                {currentUser ?
                                                                                    <>
                                                                                        <div>
                                                                                            <div className="kouture-tooltip">
                                                                                                <div className="action-button bg-black"
                                                                                                    onClick={() => addToCart({ user_id: currentUser, product_id: fabric.id, quantity: 1 })}
                                                                                                >
                                                                                                    <AiOutlineShoppingCart className="text-white" />
                                                                                                </div>
                                                                                                <div className="kouture-tooltiptext" style={{width: '190px', left: '-22px'}}>
                                                                                                    Add to Cart
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                        <div>
                                                                                            <div className="kouture-tooltip">
                                                                                                <div className="action-button bg-black"
                                                                                                    onClick={() => addToTempCart({ id: fabric.id, product_id: fabric.id, price: fabric.price, name: fabric.name, description: fabric.description, quantity: 1, user_first_name: fabric.user.first_name, user_last_name: fabric.user.last_name, user_image: fabric.user.image, total: 1 * fabric.price, unit_measurement: fabric.unit_measurement, images: fabric.image_urls[0], user_phone_number: fabric.user.phone_number, user_country: fabric.user.country, user_country_code: fabric.user.country_code, user_province: fabric.user.province, user_province_code: fabric.user.province, user_city: fabric.user.city, user_postal_code: fabric.user.postal_code, user_address_line_1: fabric.user.address_line_1, user_lat: fabric.user.latitude, user_lon: fabric.user.longitude, user_id: fabric.user.id, images: fabric.image_urls[0], colors: fabric.colors  })}
                                                                                                >
                                                                                                    <AiOutlineShoppingCart className="text-white" />
                                                                                                </div>
                                                                                                <div className="kouture-tooltiptext" style={{width: '190px', left: '-22px'}}>
                                                                                                    Add to Cart
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </>
                                                                                }
                                                                                
                                                                            </div>

                                                                            <div className="star-ratings">
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
                                                                            <h4 className="text-black fs-18 fw-600 mt-2 text-ellipsis poppins-ft">
                                                                                <CurrencyConverter price={fabric.price} currency={fabric.currency ?? 'USD'} />
                                                                                {/* ${fabric.price && fabric.price > 0 ? Number(fabric.price).toFixed(2) : '0.00'} */}
                                                                            </h4>
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
                                                                    :
                                                                    <>
                                                                    </>
                                                                }
                                                                </>
                                                            )
                                                        })}
                                                        {currentUser && currentUser != "" ?
                                                            <Pagination
                                                                className="mt-4 mb-0"
                                                                currentPage={currentPage}
                                                                totalCount={pageCount}
                                                                pageSize={PageSize}
                                                                onPageChange={page => handleChangePage(page)}
                                                            />
                                                            :
                                                            <Col lg={12} className="text-center mt-4">
                                                                <Link to="/sign-up?type=customer&option=fabrics&redirect_to=/fabrics">
                                                                    <Button type="button" className="btn-primary" variant="primary">View More</Button>
                                                                </Link>
                                                            </Col>
                                                        }
                                                    </Row>
                                                </>
                                                :
                                                <Card className="text-center">
                                                    <Card.Body>
                                                        <IoShirtSharp size="50px" className="mt-2" />
                                                        <p className="text-center fs-14 mb-2 mt-3">No records found.</p>
                                                    </Card.Body>
                                                </Card>
                                            }
                                        </>
                                    }
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </div >
        </Layout >
    );
};

export default Fabrics;