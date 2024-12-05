import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Layout from 'Components/Layout/Layout';
import FormControl from 'react-bootstrap/FormControl';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import toast from 'react-hot-toast';
import GoBack from 'Components/Shared/GoBack';
import { Form, ModalHeader, ModalFooter } from 'react-bootstrap';
import { IoShirtSharp } from 'react-icons/io5';
import { Rating } from 'react-simple-star-rating';
import { PiNotepadFill } from "react-icons/pi";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { GoAlertFill, GoHeart, GoStar } from "react-icons/go";
import UserPlaceholder from 'Assets/images/user.png';
import PinIcon from '../Assets/images/pin.png';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { IoShareSocial, IoInformationOutline, IoVideocam, IoCloseOutline, IoHeartOutline, IoEyeOutline } from "react-icons/io5";
import { BsCartPlus } from "react-icons/bs";
import { useCookies } from 'react-cookie';
import { ImEmbed2 } from "react-icons/im";
import { LuLink } from "react-icons/lu";
import Countries from 'Utils/Countries';
import Signup from 'Components/Forms/User/Signup';
import CopyTo from 'Utils/CopyLink';
import DressPlaceholder from 'Assets/images/placeholder-dress.jpeg';
import { AiFillMessage } from "react-icons/ai";
import Loading from 'Components/Shared/Loading';
import 'Assets/styles/FabricsHomePage/style.css';
import MultiRangeSlider from 'Components/Forms/MultiRangeSlider';
import 'Assets/styles/Design/style.css';
import User from 'Assets/images/user.png';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { debounce } from 'lodash';
import Pagination from 'Components/Pagination/Pagination';
import axios from 'axios';
import DiamondIcon from 'Assets/images/icons/diamond.png';
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const Designs = (props) => {
    const navigate = useNavigate();
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery();
    const headerSearch = query.get('search');
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'tempFavorites', 'selectedCountry', 'favoriteItemCount']);
    const currentUser = cookies.currentUser;
    const token = cookies.token;
    const userRole = cookies.userRole;
    const user = cookies.userDetails;

    const [mounted, setMounted] = useState(false);
    const [designs, setDesigns] = useState([]);
    const [designsLoading, setDesignsLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);

    // Category Index
    const [currentCatIndex, setCurrentCatIndex] = useState(0);

    // Filter
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedGenders, setSelectedGenders] = useState([]);
    const [selectedSeasons, setSelectedSeasons] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
    const [country, setCountry] = useState('');
    const [priceRange, setPriceRange] = useState({ from: '', to: '' });
    const [search, setSearch] = useState('');
    const [searchValue, setSearchValue] = useState('');

    // Filter Arrays
    const [colors, setColors] = useState([]);
    const [genders, setGenders] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);

    const [portfoliosImage, setPortfolioImage] = useState(false);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [singleDesign, setSingleDesign] = useState('');
    const [designImages, setDesignImages] = useState([]);
    const [activeImage, setActiveImage] = useState('');
    const [descriptionShow, setDescriptionShow] = useState(false);
    const [shareShowModal, setShareShowModal] = useState(false);
    const [copyEmbedLink, setCopyEmbedLink] = useState(false);

    const [designerProfileShow, setDesignerProfileShow] = useState(false);
    const [messageShow, setMessageShow] = useState(false);
    const [selectedSortField, setSelectedSortField] = useState(null);
    const [selectedSortOrder, setSelectedSortOrder] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedAllCategories, setSelectedAllCategories] = useState(false);
    const [isDesignCurrentUser, setIsDesignCurrentUser] = useState(false);
    const [profileViewShow, setProfileViewShow] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(cookies.selectedCountry ?? '')
    const [activeTabGroup, setActiveTabGroup] = useState('');

    const [shareViewShow, setShareViewShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [copy, setCopy] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [inWishlist, setInWishlist] = useState(false);
    const [tempFavorites, setTempFavorites] = useState(cookies.tempFavorites ?? []);

    // Search
    const [seasonsSearch, setSeasonsSearch] = useState('');
    const [seasonsValue, setSeasonsValue] = useState('');
    const [colorsSearch, setColorsSearch] = useState('');
    const [colorsValue, setColorsValue] = useState('');
    const [materialsSearch, setMaterialsSearch] = useState('');
    const [materialsValue, setMaterialsValue] = useState('');

    let PageSize = 20;

    const [fabricsModalShow, setFabricsModalShow] = useState(false);
    const [designsModalShow, setDesignsModalShow] = useState(false);
  
    const [signupModalShow, setSignupModalShow] = useState(false);
    const [signupType, setSignupType] = useState('');

    const compositions = ['Polyamide', 'Polyester', 'Polyurethane', 'Acrylic', 'Cashmere', 'Mental']; // Replace with your array of composition options
    const weaves = ['Plain', 'Twill', 'Satin', 'Basket', 'Herringbone', 'Jacquard', 'Dobby', 'Leno']; // Replace with your array of weave options

    let iframeLink = `<iframe src="https://kouture-konect.web.app/view-design/${singleDesign.portfolioId}" height="316" width="404" allowfullscreen lazyload frameborder="0" allow="clipboard-write" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;

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

    const handleNextCat = () => {
        if (currentCatIndex < categories.length - 1) {
          setCurrentCatIndex(currentCatIndex + 1);
        }
    };
    
    const handlePrevCat = () => {
        if (currentCatIndex > 0) {
            setCurrentCatIndex(currentCatIndex - 1);
        }
    };

    const showSignupModal = (e) => {
        setSignupType(e);
        setSignupModalShow(true);
    }

    function toggleMessage() {
        setMessageShow(true);
    }

    function toggleDescription() {
        setDescriptionShow(true);
    }

    function toggleShareModal() {
        setShareShowModal(true);
    }

    function toggleCopyEmbedLinkModal() {
        setCopyEmbedLink(true);
        setShareShowModal(false);
    }

    function toggleProfileCardShow() {
        setDesignerProfileShow(true);
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
            portfolio_item_category_ids: selectedCategories,
            genders: selectedGenders,
            seasons: seasonsSearch,
            colors: colorsSearch,
            materials: materialsSearch
        });
    };

    const handleSortOrderChange = (order) => {
        setSelectedSortOrder(order);

        // Call the API with the updated filter values and sorting parameters
        onFilterChange({
            sortField: selectedSortField,
            sortOrder: order,
            search: searchValue,
            portfolio_item_category_ids: selectedCategories,
            genders: selectedGenders,
            seasons: seasonsSearch,
            colors: colorsSearch,
            materials: materialsSearch
        });
    };

    async function onFilterChange(data) {
        setDesignsLoading(true);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'portfolio/filter?search='+searchValue+'&country='+selectedCountry+'&user_id=' + currentUser + '&token=' + token, data).then((response) => {
            const selectedDesigns = response.data.data;
            if (selectedDesigns) {
                setDesigns(selectedDesigns);
                setDesignsLoading(false);
                setPageCount(() => response.data.meta.total);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setDesignsLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setDesignsLoading(false);
        });
    }

    const handleSelectAllCategories = (event) => {
        if (event.target.checked) {
            setSelectedCategories(categories.map(category => category.id));
        } else {
            setSelectedCategories([]);
        }
    };
    
    // Debounce the handleChange function to fire only once after a certain delay
    const priceRangeChangeDebounce = debounce((data) => {
        setPriceRange({
            from: data.min,
            to: data.max
        });
    }, 1000); // 1000 milliseconds (2 seconds) delay

    const searchChangeDebounce = debounce((e) => {
        setSearch(e);
    }, 1000); // 1000 milliseconds (2 seconds) delay

    const handleChangeAllCategories = (isChecked) => {
        setSelectedAllCategories(isChecked ? true : false);
        setSelectedCategories([]);
    };

    const handleChangeSearch = (e) => {
        const { name, value } = e.target;
        // Clear the previous debounce timer
        searchChangeDebounce.cancel();

        // Set a new debounce timer
        searchChangeDebounce(value);
        setSearchValue(value);
    };

    const seasonChangeDebounce = debounce((e) => {
        setSeasonsSearch(e);
    }, 1000); // 1000 milliseconds (2 seconds) delay

    const handleChangeSeason = (e) => {
        const { name, value } = e.target;
        // Clear the previous debounce timer
        seasonChangeDebounce.cancel();

        // Set a new debounce timer
        seasonChangeDebounce(value);
        setSeasonsValue(value);
    };

    const colorChangeDebounce = debounce((e) => {
        setColorsSearch(e);
    }, 1000); // 1000 milliseconds (2 seconds) delay

    const handleChangeColor = (e) => {
        const { name, value } = e.target;
        // Clear the previous debounce timer
        colorChangeDebounce.cancel();

        // Set a new debounce timer
        colorChangeDebounce(value);
        setColorsValue(value);
    };

    const materialChangeDebounce = debounce((e) => {
        setMaterialsSearch(e);
    }, 1000); // 1000 milliseconds (2 seconds) delay

    const handleChangeMaterial = (e) => {
        const { name, value } = e.target;
        // Clear the previous debounce timer
        materialChangeDebounce.cancel();

        // Set a new debounce timer
        materialChangeDebounce(value);
        setMaterialsValue(value);
    };

    async function favoriteDesignUpdate(e) {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'portfolio/item/wishlist/update', e).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                handleChangePage(currentPage);
                setInWishlist(!inWishlist);
                const currentFavoriteCount = cookies.favoriteItemCount ?? 0;
                const latestFavoriteItemCount = parseInt(currentFavoriteCount) +  1;
                setCookie('favoriteItemCount', latestFavoriteItemCount, { path: '/' });

            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
        }).catch((error) => {
            toast.error('Something went wrong, please contact the administrator!');
        });
    };

    const toggleTempFavorite = (item) => {
        // Check if the item ID already exists in the array
        const itemExists = tempFavorites.some(favItem => favItem.id === item.id);
    
        let updatedFavorites;
        if (itemExists) {
          // Remove the item from the array
          updatedFavorites = tempFavorites.filter(favItem => favItem.id !== item.id);
        } else {
          // Add the new item to the array
          updatedFavorites = [...tempFavorites, item];
        }
    
        // Set the updated favorites array in cookies
        setCookie('tempFavorites', JSON.stringify(updatedFavorites), { path: '/' });

        const currentFavoriteCount = cookies.favoriteItemCount ?? 0;
        const latestFavoriteItemCount = parseInt(currentFavoriteCount) +  1;
        setCookie('favoriteItemCount', latestFavoriteItemCount, { path: '/' });

        // Update the local state
        setTempFavorites(updatedFavorites);
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

    function togglePortfolioImage(portfolioId, id, first_name, last_name, image_urls, image, address_line_1, city, province, country, tags, description, userId, userWishlist) {
        setPortfolioImage(true);
        setInWishlist(userWishlist);
        setSingleDesign({
            id: id ?? 0,
            userId: userId ?? 0,
            portfolioId: portfolioId ?? 0,
            first_name: first_name ?? '-',
            last_name: last_name ?? '-',
            image: image ?? '-',
            address_line_1: address_line_1 ?? '-',
            city: city ?? '-',
            province: province ?? '-',
            country: country ?? '-',
            tags: tags ?? '-',
            description: description ?? '-'
        });

        setDesignImages(image_urls);
        if (image_urls?.[0]?.image_url) {
            setActiveImage(process.env.REACT_APP_STORAGE_URL + 'portfolio/' + image_urls[0].image_url);
        } else {
            setActiveImage(PlaceholderImage);
        }

        if (currentUser == userId) {
            setIsDesignCurrentUser(true);
        } else {
            setIsDesignCurrentUser(false);
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
        if (currentUser && currentUser != "") {
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
    };

    async function getPortfolioFilters() {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'design/filter/type').then((response) => {
            const data = response.data;
            if (data) {
                const filters = data.data;
                setColors(filters.colors?? []);
                setGenders(filters.genders ?? []);
                setSeasons(filters.seasons ?? []);
                setMaterials(filters.materials ?? []);
                setTags(filters.tags ?? []);
                setCategories(filters.categories ?? []);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
            }
        }).catch((e) => {
            toast.error('An error occured. Please try again or contact the administrator.');
        });
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

    // Handle checkbox change event
    const handleSelectCategoryChange = (event) => {
        const categoryId = parseInt(event.target.value, 10);
        if (event.target.checked) {
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

    const handleSelectGenderChange = (event) => {
        const gender = event.target.value;
        if (event.target.checked) {
            setSelectedGenders([...selectedGenders, gender]);
        } else {
            setSelectedGenders(selectedGenders.filter(g => g !== gender));
        }
    };

    const handleSelectSeasonChange = (event) => {
        const season = event.target.value;
        if (event.target.checked) {
            setSelectedSeasons([...selectedSeasons, season]);
        } else {
            setSelectedSeasons(selectedSeasons.filter(s => s !== season));
        }
    };

    const handleSelectColorChange = (event) => {
        const color = event.target.value;
        if (event.target.checked) {
            setSelectedColors([...selectedColors, color]);
        } else {
            setSelectedColors(selectedColors.filter(c => c !== color));
        }
    };

    const handleSelectMaterialChange = (event) => {
        const material = event.target.value;
        if (event.target.checked) {
            setSelectedMaterials([...selectedMaterials, material]);
        } else {
            setSelectedMaterials(selectedMaterials.filter(m => m !== material));
        }
    };

    const handleSelectTagChange = (event) => {
        const tag = event.target.value;
        if (event.target.checked) {
            setSelectedTags([...selectedTags, tag]);
        } else {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        }
    };

    // Pagination
    const handleChangePage = (pageNumber) => {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'portfolio/filter?search='+searchValue+'&country='+selectedCountry+'&page=' + pageNumber + '&user_id=' + currentUser)
            .then((response) => {
                const data = response.data;
                setCurrentPage(pageNumber);
                const selectedDesigns = response.data.data;
                if (selectedDesigns) {
                    setDesigns(selectedDesigns);
                    setDesignsLoading(false);
                    setCurrentPage(() => data.meta.current_page);
                    setPageCount(() => data.meta.total);
                    setPageSize(() => data.meta.per_page);
                } else {
                    setDesignsLoading(false);
                    toast.error('There has been an error getting the portfolio, please try again!');
                }
            }).catch(error => {
                setDesignsLoading(false);
                toast.error('There has been an error getting the portfolio, please try again!');
            });
    };

    const handleChangeCountry = (e) => {
        const {name, value} = e.target;
        setSelectedCountry(value ?? '');
    }

    useEffect(() => {
        // Only run the filter API call after the component has mounted
        if (mounted) {
            // Call the API with the updated filter values
            onFilterChange({
                sortField: selectedSortField,
                sortOrder: selectedSortOrder,
                search: searchValue || headerSearch || '',
                portfolio_item_category_ids: selectedCategories,
                genders: selectedGenders,
                seasons: seasonsSearch,
                colors: colorsSearch,
                materials: materialsSearch,
            });
        } else {
            // Set the component as mounted
            setMounted(true);
        }

    }, [mounted, searchValue, headerSearch, selectedCategories, selectedGenders, seasonsSearch, colorsSearch, materialsSearch, selectedCountry]);

    useEffect(() => {
        // Only run the filter API call after the component has mounted
        if (headerSearch) {
            setSearch(headerSearch);
            setSearchValue(headerSearch);
        } else {
            // Set the component as mounted
            setSearch('');
            setSearchValue('');
        }
    }, [headerSearch]);

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

    useEffect(() => {
        // Only run the filter API call after the component has mounted
        setSelectedCountry(cookies.selectedCountry ?? '');
    }, [cookies]);

    useEffect(() => {
        getPortfolioFilters();
    }, []);

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
                                                <p className="mb-0 fs-14 fw-500"><Link className="text-decoration-none text-muted" to="/">Home</Link> / Designs</p>
                                            </div>
                                        </Col>
                                        <Col lg="9" className="category-slider">
                                            <div  className="ps-4">
                                                <Row>
                                                    <Col lg="9">
                                                        <div className="category-pills">
                                                            {categories && categories.length > 0 ? (
                                                                <Slider {...settings}>
                                                                    {selectedAllCategories || selectedCategories.length < 1  ?
                                                                        <div className="mx-2 cursor-pointer">
                                                                            <span class="badge badge-dark bg-dark fs-12 fw-400 text-center">All</span>
                                                                        </div>
                                                                        :
                                                                        <div className="mx-2 cursor-pointer" onClick={function() { setSelectedAllCategories(true); setSelectedCategories([]) }}>
                                                                            <span class="badge badge-dark bg-white fs-12 text-dark fw-400 text-center">All</span>
                                                                        </div>
                                                                    }
                                                                    {categories.map((category, index) => (
                                                                        <>
                                                                            {selectedCategories.includes(category.id) ?
                                                                                <div className="mx-2 cursor-pointer" onClick={function() { handleChangeCategory(category.id); }}>
                                                                                    <span class="badge badge-dark bg-dark fs-12 fw-400 text-center">{category.name}</span>
                                                                                </div>
                                                                                :
                                                                                <div className="mx-2 cursor-pointer" onClick={function() { handleChangeCategory(category.id); }}>
                                                                                    <span class="badge badge-dark bg-white text-dark fs-12 fw-400 text-center">{category.name}</span>
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
                                                                {user.is_designer == 1 ?
                                                                    <Link to="/user/profile?tab=designs&tab_group=designs">
                                                                        <button className="ddf-button fs-12 btn bg-white border-black text-black bg-white-hover border-gold-hover text-black-hover">
                                                                            <img src={DiamondIcon} className="ddf-button-icon" alt="Designs" /> Display Your Creations
                                                                        </button>
                                                                    </Link>
                                                                    :
                                                                    <Link to="/user/designer-form">
                                                                        <button className="ddf-button fs-12 btn bg-white border-black text-black bg-white-hover border-gold-hover text-black-hover">
                                                                            <img src={DiamondIcon} className="ddf-button-icon" alt="Designs" /> Display Your Creations
                                                                        </button>
                                                                    </Link>
                                                                }
                                                                
                                                            </>
                                                            :
                                                            <Link to="/sign-up?type=designer">
                                                                <button className="ddf-button fs-12 btn bg-white border-black text-black bg-white-hover border-gold-hover text-black-hover">
                                                                    <img src={DiamondIcon} className="ddf-button-icon" alt="Designs" /> Display Your Creations
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
                                    <Form.Group className='mb-4'>
                                        <Form.Label className="fw-600 fs-14">Search</Form.Label>
                                        <Form.Control  placeholder="Enter your search term..." value={searchValue} type="text" onChange={(e) => handleChangeSearch(e)} />
                                    </Form.Group>
                                    {/* <Form.Group className='mb-4'>
                                        <Form.Label className="fw-600">Sort</Form.Label>
                                        <Form.Control as='select' onChange={(e) => handleSortFieldChange(e.target.value)}>
                                            <option value="" disabled selected  >Sort By:</option>
                                            {sortOptions.map(option => (
                                                <option key={option.value} value={option.value} selected={option.value === selectedSortField}>{option.label}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group> */}
                                    <Form.Group className='mb-4'>
                                        <Form.Label className="fw-600 fs-14">Country</Form.Label>
                                        <Form.Control
                                            as='select'
                                            name='country'
                                            value={selectedCountry}
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
                                    <Form.Group className='mb-3'>
                                        <Form.Label className="fw-600 fs-14">Gender</Form.Label>
                                        <Form.Check
                                            type="checkbox"
                                            label="Male"
                                            value="Male"
                                            checked={selectedGenders.includes("Male")}
                                            onChange={handleSelectGenderChange}
                                            className="mb-2 fs-12"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Female"
                                            value="Female"
                                            checked={selectedGenders.includes("Female")}
                                            onChange={handleSelectGenderChange}
                                            className="mb-2 fs-12"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Other"
                                            value="Other"
                                            checked={selectedGenders.includes("Other")}
                                            onChange={handleSelectGenderChange}
                                            className="mb-2 fs-12"
                                        />
                                    </Form.Group>
                                    <hr />
                                    <Form.Group className='mb-3'>
                                        <Form.Label className="fw-600 fs-14">Season</Form.Label>
                                        <Form.Control value={seasonsValue} onChange={(e) => handleChangeSeason(e)}></Form.Control>
                                    </Form.Group>
                                    <hr />
                                    <Form.Group className='mb-3'>
                                        <Form.Label className="fw-600 fs-14">Color</Form.Label>
                                        <Form.Control value={colorsValue} onChange={(e) => handleChangeColor(e)}></Form.Control>
                                    </Form.Group>
                                    <hr />
                                    <Form.Group className='mb-3'>
                                        <Form.Label className="fw-600 fs-14">Material</Form.Label>
                                        <Form.Control value={materialsValue} onChange={(e) => handleChangeMaterial(e)}></Form.Control>
                                    </Form.Group>
                                    <hr />
                                    <p className="design-side-dropdown fw-600 fs-14 mb-12 position-relative" onClick={function () { setActiveTabGroup((prevActiveGroup) => prevActiveGroup == "categories" ? "" : activeTabGroup != "categories" ? "categories" : ""); }}>
                                        Categories
                                        {activeTabGroup != "categories" ?
                                            <>
                                                <AiOutlinePlus size="10px" className="accordion-icon" />
                                            </>
                                            :
                                            <>
                                                <AiOutlineMinus size="10px" className="accordion-icon" />
                                            </>
                                        }
                                    </p>
                                    <div className={`ms-3 design-accordion-content ${activeTabGroup == "categories" ? 'open' : ''}`}>
                                            
                                            {categories && categories.length > 0 ?
                                                <>
                                                    <Form.Group className='mb-3'>
                                                        <Form.Group key="all">
                                                            <Form.Check
                                                                className="cursor-pointer fs-12"
                                                                type="checkbox"
                                                                label="All"
                                                                name="categories"
                                                                checked={selectedCategories.length === categories.length || selectedCategories.length === 0}
                                                                onChange={handleSelectAllCategories}
                                                            />
                                                        </Form.Group>
                                                        {categories && categories.length > 0 ?
                                                            <>
                                                                {categories.map((category, index) => (
                                                                    <Form.Check
                                                                        key={index}
                                                                        type="checkbox"
                                                                        label={category.name}
                                                                        value={category.id}
                                                                        checked={selectedCategories.includes(category.id)}
                                                                        onChange={handleSelectCategoryChange}
                                                                        className="mb-2 fs-12"
                                                                    />
                                                                ))}
                                                            </>
                                                            :
                                                            null
                                                        }
                                                    </Form.Group>
                                                </>
                                                :
                                                null
                                            }
                                        </div>
                                    {/* {seasons && seasons.length > 0 ?
                                        <>
                                            <Form.Group className='mb-4'>
                                                <Form.Label className="fw-600">Season</Form.Label>
                                                {seasons.map((season, index) => (
                                                    <>
                                                        {season != "" ?
                                                            <Form.Check
                                                                key={index}
                                                                type="checkbox"
                                                                label={season}
                                                                value={season}
                                                                checked={selectedSeasons.includes(season)}
                                                                onChange={handleSelectSeasonChange}
                                                                className="mb-2"
                                                            />
                                                            :
                                                            null
                                                        }
                                                    </>
                                                ))}
                                            </Form.Group>
                                        </>
                                        :
                                        null
                                    } */}
                                    {/* {colors && colors.length > 0 ?
                                        <>
                                            <Form.Group className='mb-4'>
                                                <Form.Label className="fw-600">Color</Form.Label>
                                                {colors.map((color, index) => (
                                                    <>
                                                        {color != "" ?
                                                            <Form.Check
                                                                key={index}
                                                                type="checkbox"
                                                                label={color}
                                                                value={color}
                                                                checked={selectedColors.includes(color)}
                                                                onChange={handleSelectColorChange}
                                                                className="mb-2"
                                                            />
                                                            :
                                                            null
                                                        }
                                                    </>
                                                ))}
                                            </Form.Group>
                                        </>
                                        :
                                        null
                                    }
                                    {materials && materials.length > 0 ?
                                        <>
                                            <Form.Group className='mb-4'>
                                                <Form.Label className="fw-600">Material</Form.Label>
                                                {materials.map((material, index) => (
                                                    <>
                                                        {material != "" ?
                                                            <Form.Check
                                                                key={index}
                                                                type="checkbox"
                                                                label={material}
                                                                value={material}
                                                                checked={selectedMaterials.includes(material)}
                                                                onChange={handleSelectMaterialChange}
                                                                className="mb-2"
                                                            />
                                                            :
                                                            null
                                                        }
                                                    </>
                                                ))}
                                            </Form.Group>
                                        </>
                                        :
                                        null
                                    } */}
                                    {/* {tags && tags.length > 0 ?
                                        <>
                                            <Form.Group className='mb-4'>
                                                <Form.Label className="fw-600">Tag</Form.Label>
                                                {tags.map((tag, index) => (
                                                    <>
                                                        {tag != "" ?
                                                            <Form.Check
                                                                key={index}
                                                                type="checkbox"
                                                                label={tag}
                                                                value={tag}
                                                                checked={selectedTags.includes(tag)}
                                                                onChange={handleSelectTagChange}
                                                                className="mb-2"
                                                            />
                                                            :
                                                            null
                                                        }
                                                    </>
                                                ))}
                                            </Form.Group>
                                        </>
                                        :
                                        null
                                    } */}
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
                            <Col lg="9" >
                                <div id="profile-designs" className="ps-2 pt-4">
                                    {designsLoading ?
                                        <>
                                            <Card className="text-center">
                                                <Card.Body>
                                                    <Loading className="bg-white py-0" />
                                                </Card.Body>
                                            </Card>
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
                                                                var designImage = DressPlaceholder;
                                                            }
                                                            var wishlist_user_ids = design.wishlist_user_ids ?? [];
                                                            const userWishlist = wishlist_user_ids.includes(currentUser);

                                                            return (
                                                                <>
                                                                    <Col className="designs-grid mb-4" xs="12" md="3">
                                                                        <div className="portfolio-link">
                                                                            {/* <div
                                                                                className="designs-grid-div w-100 cursor-pointer"
                                                                                onClick={function () { toggleAddViewCount(design.id); navigate('/portfolio/' + design.id); }}
                                                                                style={{ backgroundImage: "url(" + designImage + ")" }}>
                                                                            </div> */}

                                                                            {userRole !== 'Admin' ?
                                                                                <>
                                                                                    <div className="designs-grid-div w-100 cursor-pointer" style={{ backgroundImage: "url(" + designImage + ")" }}>
                                                                                        <div className="designs-grid-placeholder" onClick={function () {
                                                                                                togglePortfolioImage(
                                                                                                    design.id,
                                                                                                    design.designer.id,
                                                                                                    design.user.first_name,
                                                                                                    design.user.last_name,
                                                                                                    design.image_urls,
                                                                                                    design.user.image,
                                                                                                    design.user.address_line_1,
                                                                                                    design.user.city,
                                                                                                    design.user.province,
                                                                                                    design.user.country,
                                                                                                    design.tags,
                                                                                                    design.description,
                                                                                                    design.user.id,
                                                                                                    userWishlist
                                                                                                );
                                                                                                toggleAddViewCount(design.id);
                                                                                            }}
                                                                                        >
                                                                                        </div>
                                                                                        {userRole !== 'Admin' && design.user.id != currentUser ?
                                                                                            <>
                                                                                                {currentUser ?
                                                                                                    <>
                                                                                                        <div className='save-link portfolio-link'>
                                                                                                            {userWishlist ?
                                                                                                                <div className="kouture-tooltip">
                                                                                                                    <div className="action-button bg-gold"
                                                                                                                        onClick={function () { favoriteDesignUpdate({ user_id: currentUser, portfolio_item_id: design.id }); }}
                                                                                                                    >
                                                                                                                        <GoStar className="text-white" />
                                                                                                                    </div>
                                                                                                                    <div className="kouture-tooltiptext" style={{width: '200px', left: '-25px'}}>
                                                                                                                        Remove from Favorites
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                :
                                                                                                                <div className="kouture-tooltip">
                                                                                                                    <div className="action-button bg-white"
                                                                                                                        onClick={function () { favoriteDesignUpdate({ user_id: currentUser, portfolio_item_id: design.id }); }}
                                                                                                                    >
                                                                                                                        <GoStar className="text-black" />
                                                                                                                    </div>
                                                                                                                    <div className="kouture-tooltiptext" style={{width: '200px', left: '-25px'}}>
                                                                                                                        Add to Favorites
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            }
                                                                                                        </div>
                                                                                                    </>
                                                                                                    :
                                                                                                    <>
                                                                                                        <div className='save-link portfolio-link'>
                                                                                                            {tempFavorites.some(favItem => favItem.id === design.id) ?
                                                                                                                <div className="kouture-tooltip">
                                                                                                                    <div
                                                                                                                        className="action-button bg-gold"
                                                                                                                        onClick={function () { toggleTempFavorite({id: design.id, user_id: currentUser, name: design.name, description: design.description, image_urls: design.image_urls[0], designer_user_id: design.user.id}); }}
                                                                                                                    >
                                                                                                                        <GoStar className="text-white" />
                                                                                                                    </div>
                                                                                                                    <div className="kouture-tooltiptext" style={{width: '200px', left: '-25px'}}>
                                                                                                                        Remove from Favorites
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                :
                                                                                                                <div className="kouture-tooltip">
                                                                                                                    <div
                                                                                                                        className="action-button bg-white"
                                                                                                                        onClick={function () { toggleTempFavorite({id: design.id, user_id: currentUser, name: design.name, description: design.description, image_urls: design.image_urls[0], designer_user_id: design.user.id}); }}
                                                                                                                        >
                                                                                                                        <GoStar className="text-black" />
                                                                                                                    </div>
                                                                                                                    <div className="kouture-tooltiptext" style={{width: '200px', left: '-25px'}}>
                                                                                                                        Add to Favorites
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            }
                                                                                                        </div>
                                                                                                    </>
                                                                                                }
                                                                                                
                                                                                            </>
                                                                                            :
                                                                                            <>

                                                                                            </>
                                                                                        }
                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    <div className="designs-grid-div w-100 cursor-pointer" style={{ backgroundImage: "url(" + designImage + ")" }}>
                                                                                        <div className="designs-grid-placeholder"  onClick={function () { toggleAddViewCount(design.id); navigate('/admin/portfolio/' + design.id); }}>
                                                                                        </div>
                                                                                        {userRole !== 'Admin' && design.user.id != currentUser ?
                                                                                            <>
                                                                                                {currentUser ?
                                                                                                    <>
                                                                                                        <div className='save-link portfolio-link'>
                                                                                                            {userWishlist ?
                                                                                                                <div
                                                                                                                    className="action-button bg-gold"
                                                                                                                    onClick={function () { favoriteDesignUpdate({ user_id: currentUser, portfolio_item_id: design.id }); }}
                                                                                                                >
                                                                                                                    <GoStar className="text-white" />
                                                                                                                </div>
                                                                                                                :
                                                                                                                <div
                                                                                                                    className="action-button bg-white"
                                                                                                                    onClick={function () { favoriteDesignUpdate({ user_id: currentUser, portfolio_item_id: design.id }); }}
                                                                                                                >
                                                                                                                    <GoStar className="text-black" />
                                                                                                                </div>
                                                                                                            }
                                                                                                        </div>
                                                                                                    </>
                                                                                                    :
                                                                                                    <>
                                                                                                        <div className='save-link portfolio-link'>
                                                                                                            {tempFavorites.some(favItem => favItem.id === design.id) ?
                                                                                                                <div
                                                                                                                    className="action-button bg-gold"
                                                                                                                    onClick={function () { toggleTempFavorite({id: design.id, user_id: currentUser, name: design.name, description: design.description, image_urls: design.image_urls[0], designer_user_id: design.user.id}); }}
                                                                                                                >
                                                                                                                    <GoStar className="text-white" />
                                                                                                                </div>
                                                                                                                :
                                                                                                                <div
                                                                                                                    className="action-button bg-white"
                                                                                                                    onClick={function () { toggleTempFavorite({id: design.id, user_id: currentUser, name: design.name, description: design.description, image_urls: design.image_urls[0], designer_user_id: design.user.id}); }}
                                                                                                                >
                                                                                                                    <GoStar className="text-black" />
                                                                                                                </div>
                                                                                                            }
                                                                                                        </div>
                                                                                                    </>
                                                                                                }
                                                                                                
                                                                                            </>
                                                                                            :
                                                                                            <>

                                                                                            </>
                                                                                        }
                                                                                    </div>
                                                                                </>
                                                                            }

                                                                        </div>
                                                                        <div className="design-details">
                                                                            <div className='d-flex align-items-center justify-content-between'>
                                                                                <h4 className="text-black fs-18 fw-400 cursor-pointer mb-0 text-ellipsis design-name"
                                                                                onClick={function () {
                                                                                    togglePortfolioImage(
                                                                                        design.id,
                                                                                        design.designer.id,
                                                                                        design.user.first_name,
                                                                                        design.user.last_name,
                                                                                        design.image_urls,
                                                                                        design.user.image,
                                                                                        design.user.address_line_1,
                                                                                        design.user.city,
                                                                                        design.user.province,
                                                                                        design.user.country,
                                                                                        design.tags,
                                                                                        design.description,
                                                                                        design.user.id,
                                                                                        userWishlist
                                                                                    );
                                                                                    toggleAddViewCount(design.id);
                                                                                }}>{design.name ?? '-'}</h4>
                                                                                {/* {design.user.id != currentUser ?
                                                                                    <div className="design-atc-container">
                                                                                        <div className="design-atc cursor-pointer">
                                                                                            <div className="kouture-tooltip">
                                                                                                <div className="action-button bg-black">
                                                                                                    <BsCartPlus className="text-white atc-icon" />
                                                                                                </div>
                                                                                                <div className="kouture-tooltiptext">
                                                                                                    Add to Cart
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    :
                                                                                    null
                                                                                } */}
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
                                                            <Link to="/sign-up?type=customer&option=designs&redirect_to=/designs">
                                                                <Button type="button" className="btn-primary" variant="primary">View More</Button>
                                                            </Link>
                                                        </Col>
                                                    }
                                                </>
                                                :
                                                <>
                                                    {/* <Card>
                                                        <Card.Body className=" pt-5 pb-5">
                                                            <div className="text-center">
                                                                <GoAlertFill size="40px" className="mb-2 text-gold" />
                                                                <p className="text-center mb-3">There are currently no designs available for viewing.</p>
                                                            </div>
                                                        </Card.Body>
                                                    </Card> */}
                                                    <Card className="text-center">
                                                        <Card.Body>
                                                            <IoShirtSharp size="50px" className="mt-2" />
                                                            <p className="text-center fs-14 mb-2 mt-3">No records found.</p>
                                                        </Card.Body>
                                                    </Card>
                                                </>
                                                // <p className="text-center mb-3 mt-3">There are currently no portfolio available for viewing.</p>
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
                        <div className='d-flex justify-content-center align-items-center user-image'>

                            {singleDesign.image !== '' && singleDesign.image !== '-' ? (
                                <div
                                    className='user-photo'
                                    style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                >
                                </div>
                            ) : (
                                <img src={User} className='placeholder-img ' />
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
                                                        <div
                                                            key={index}
                                                            className="single-image-slider-fabrics"
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
                                        <img src={DressPlaceholder} className='w-100 img-placeholder-height' />
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
                                                        <img src={User} className='placeholder-img ' />
                                                    )}
                                                    <div className='ms-3'>
                                                        <div className='modal-title text-left fs-20 fw-600 text-white'>{singleDesign.first_name} {singleDesign.last_name}</div>
                                                        <div className='fashion-designer fs-16'>Fashion Designer</div>
                                                    </div>
                                                </div>
                                            </a>

                                            {isDesignCurrentUser || !currentUser ?
                                                null
                                                :
                                                <>
                                                    <div className='btn-book-bar'>
                                                        {/* <a href={`/appointment/schedule/${singleDesign.id}`}> */}
                                                        <a href={`/designer/${singleDesign.id}/appointment/schedule/0`}>
                                                            <button className='btn btn-book-consultation'>Book a Consultation</button>
                                                        </a>
                                                    </div>
                                                </>
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={1}>
                            {profileViewShow &&
                                <>
                                    <div>
                                        <Card className="table_content file-action mt-3 me-0 card-profile-designer">
                                            <Card.Header className='card-hr bg-white'>
                                                <button
                                                    type='button'
                                                    className='close react-modal-close'
                                                    onClick={() => setProfileViewShow(false)}
                                                >
                                                    <IoCloseOutline color="#7e7e7e" size={25} />
                                                </button>
                                            </Card.Header>
                                            <Card.Body className="action_container font-weight">
                                                <Row>
                                                    <Col>
                                                        <div className='user-image-modal text-center'>
                                                            {singleDesign.image !== '' && singleDesign.image !== '-' ? (
                                                                <div
                                                                    className='user-photo-modal mb-2 '
                                                                    style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                                                >
                                                                </div>
                                                            ) : (
                                                                <img src={User} className='placeholder-img-side mb-2' />
                                                            )}
                                                        </div>
                                                        <div className='modal-title text-center fs-18 fw-600 text-black'>{singleDesign.first_name} {singleDesign.last_name}</div>
                                                        <div className='fs-14 text-center mt-2'>
                                                            <img src={PinIcon} alt="location pin" className='me-2' />
                                                            {/* {singleDesign.address_line_1}{singleDesign.province}</div> */}
                                                            {singleDesign.province ? singleDesign.province + ',' : singleDesign.city ? singleDesign.city + ',' : ''} {singleDesign.country}</div>
                                                        <div className="mb-2 text-center">
                                                            {singleDesign.tags ?
                                                                <>
                                                                    {singleDesign.tags.length > 0 ?
                                                                        <>
                                                                            {singleDesign.tags.map((tag, index) => (
                                                                                <span className="design-tags bg-light fs-14 categories-color mt-2">
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

                                                        {isDesignCurrentUser || !currentUser?
                                                            null
                                                            :
                                                            <>
                                                                <hr />
                                                                <div className='text-center'>
                                                                    {/* <a className='book-consultation btn-book btn w-100'
                                                                        href={`/appointment/schedule/${singleDesign.id}`}
                                                                    > */}
                                                                    <a
                                                                        href={`/designer/${singleDesign.id}/appointment/schedule/0`}
                                                                        className='book-consultation btn-book btn w-100'>

                                                                        <IoVideocam className="me-2" color="#ffffff" />Book a Consultation</a>
                                                                </div>

                                                                {/* <div className='text-center mt-2'
                                                                    onClick={() => { toggleUnderConstruction("Message"); setProfileViewShow(false); }}
                                                                >
                                                                    <a className='book-consultation btn-message-designer btn w-100'
                                                                    >
                                                                        <AiFillMessage className="me-2" />Send Message</a>
                                                                </div> */}
                                                            </>
                                                        }
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </>
                            }

                            <div>
                                <div>
                                    <div className='user-image-side thumbnail-table text-center cursor-pointer' onClick={() => setProfileViewShow(true)}>
                                        {singleDesign.image !== '' && singleDesign.image !== '-' ? (
                                            <div
                                                className='user-photo-side mb-4 '
                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                            >
                                            </div>
                                        ) : (
                                            <img src={User} className='placeholder-img-side mb-4' />
                                        )}


                                    </div>
                                </div>

                                {isDesignCurrentUser || !currentUser?
                                    null
                                    :
                                    <>
                                        <div className='text-center mb-4' >
                                            {/* <a href={`/appointment/schedule/${singleDesign.id}`}> */}
                                            <a href={`/designer/${singleDesign.id}/appointment/schedule/0`}>
                                                <div className="action-button-designs bg-white">
                                                    <PiNotepadFill className="text-black mt-2" size={30} />
                                                </div>
                                            </a>
                                            <div className='icon-name-color fs-12 mt-2 fw-600'>Consultation</div>
                                        </div>

                                        {/* <div className='text-center mb-4' onClick={() => toggleUnderConstruction("Message")}>
                                            <div className="action-button-designs bg-white">
                                                <AiFillMessage className="text-black mt-2" size={30} />
                                            </div>
                                            <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Message</div>
                                        </div> */}
                                    </>
                                }

                                <div className='text-center mb-4'
                                    onClick={toggleShareModal}
                                >
                                    <div className="action-button-designs bg-white">
                                        <IoShareSocial className="text-black mt-2" size={30} />
                                    </div>
                                    <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Share</div>
                                </div>

                                <div className='text-center mb-4' onClick={toggleDescription}>
                                    <div className="action-button-designs bg-white">
                                        <IoInformationOutline className="text-black mt-2" size={30} />
                                    </div>
                                    <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Description</div>
                                </div>
                                {userRole !== 'Admin' && !isDesignCurrentUser ?
                                    <>
                                        {currentUser ?
                                            <>  
                                                {inWishlist ?
                                                    <div className='text-center mb-4' onClick={function () { favoriteDesignUpdate({ user_id: currentUser, portfolio_item_id: singleDesign.portfolioId }); }}>
                                                        <div className="action-button-designs bg-gold">
                                                            <GoStar className="text-white mt-2" size={30} />
                                                        </div>
                                                        <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Remove from Favorites</div>
                                                    </div>
                                                    :
                                                    <div className='text-center mb-4' onClick={function () { favoriteDesignUpdate({ user_id: currentUser, portfolio_item_id: singleDesign.portfolioId }); }}>
                                                        <div className="action-button-designs bg-white">
                                                            <GoStar className="text-black mt-2" size={30} />
                                                        </div>
                                                        <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Add to Favorites</div>
                                                    </div>
                                                }
                                            </>
                                            :
                                            <>
                                                {tempFavorites.some(favItem => favItem.id === singleDesign.portfolioId) ?
                                                    <div className='text-center mb-4' onClick={function () { toggleTempFavorite({id: singleDesign.portfolioId, user_id: currentUser, name: singleDesign.name, description: singleDesign.description, image_urls: singleDesign.image[0], designer_user_id: singleDesign.userId}); }}>
                                                        <div className="action-button-designs bg-gold">
                                                            <GoStar className="text-white mt-2" size={30} />
                                                        </div>
                                                        <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Remove from Favorites</div>
                                                    </div>
                                                    :
                                                    <div className='text-center mb-4' onClick={function () { toggleTempFavorite({id: singleDesign.portfolioId, user_id: currentUser, name: singleDesign.name,  description: singleDesign.description, image_urls: singleDesign.image[0], designer_user_id: singleDesign.userId}); }}>
                                                        <div className="action-button-designs bg-white">
                                                            <GoStar className="text-black mt-2" size={30} />
                                                        </div>
                                                        <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Add to Favorites</div>
                                                    </div>
                                                }
                                            </>
                                        }
                                        
                                    </>
                                    :
                                    <></>
                                }
                                {/* {!isDesignCurrentUser ?
                                    <div className='text-center mb-4'>
                                        <div className="action-button-designs bg-white">
                                            <BsCartPlus className="text-black mt-2" size={30} />
                                        </div>
                                        <div className='icon-name-color fs-12 mb-3 mt-2 fw-600'>Add to Cart</div>
                                    </div>
                                    :
                                    null
                                } */}
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
                id="under-construction"
            >
                <Modal.Header className="py-0">
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={() => setMessageShow(false)}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} />
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <Card className='border-none'>
                        <Card.Body className="text-center py-5 pt-2 pb-2">
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
                        {/* <Button className="btn-cancel-message btn me-2" onClick={() => { setMessageShow(false); }}>Cancel</Button>
                        <Button className="btn-primary btn" onClick={() => { toggleUnderConstruction(); setMessageShow(false); }}>Send Message</Button> */}

                        <button
                            className="btn btn-secondary border-black btn-style bg-white text-black me-3"
                            onClick={() => { setMessageShow(false); }}
                            type="button"
                        >
                            Cancel
                        </button>
                        {/* {portfolioSendLoading ?
                            <button className="btn btn-primary" type="button" style={{ minWidth: '100px', padding: '9px 20px' }}>Sending...</button>
                            : */}
                        <button
                            className="btn btn-primary btn-style"
                            type="button"
                            onClick={() => { toggleUnderConstruction(); setMessageShow(false); }}
                        >
                            Send Message
                        </button>
                        {/* } */}
                    </div>
                </ModalFooter>
            </Modal>

            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
                id="under-construction"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left fs-22 mt-2'>{modalHeading}</h5>
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={() => setUnderConstructionShow(false)}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} />
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
                    <button
                        type='button'
                        className='close react-modal-close description-close'
                        onClick={() => setDescriptionShow(false)}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} />
                    </button>
                </Modal.Header>

                <Modal.Body className='card-description d-flex align-items-center'>
                    <p className='text-white fw-400 p-3 fs-14 mb-0'>{singleDesign.description}</p>
                </Modal.Body>
            </Modal>

            <Modal
                show={copyEmbedLink}
                id='modal-preview-embed'
                fade={false}
                centered
                className='embed-modal-view'

            >
                <Modal.Header className="p-3 pb-0">
                    <h5 className='mb-0 rufina-family fs-22 text-black'>Embed Design</h5>
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={() => setCopyEmbedLink(false)}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} />
                    </button>
                </Modal.Header>
                <Modal.Body className='pb-0 pt-4'>
                    <Row>
                        <Col lg='12' className='px-3'>
                            <textarea className='text-area-embed'>
                                {iframeLink}

                            </textarea>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="text-right border-none">
                    <button
                        className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
                        onClick={() => setCopyEmbedLink(false)}
                        type="button" >
                        Cancel
                    </button>

                    <CopyTo
                        text={iframeLink}
                        classes="btn btn-primary btn-style"
                        standbyTitle="Copy"
                        icon={false}
                        onCopy={() => setCopy(true)}
                        loadingTitle="Embed Copied"
                        closeModal={() => setCopyEmbedLink(false)}
                    />
                </Modal.Footer>
            </Modal >

            <Modal
                show={shareShowModal}
                className='modal-preview-share'
                fade={false}
                centered
                id='share-modal'
            >
                <Modal.Header className="pb-0">
                    <Modal.Title className='rufina-family fs-22 text-black'>Share Design</Modal.Title>
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={function () { setShareShowModal(false); }}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body className='padding-share-card'>
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
                                                        <div key={index} className="single-image-slider-share mb-4"
                                                            style={{
                                                                backgroundImage:
                                                                    `url(${process.env.REACT_APP_STORAGE_URL}portfolio/${image.image_url})`
                                                            }}
                                                        >
                                                        </div>

                                                        <div className='d-flex user-image-share image-share-popup'>

                                                            {singleDesign.image !== '' && singleDesign.image !== '-' ? (
                                                                <div
                                                                    className='user-photo-share mt-1'
                                                                    style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${singleDesign.image})` }}
                                                                >
                                                                </div>
                                                            ) : (
                                                                <img src={UserPlaceholder} className='placeholder-img-share' alt="User Placeholder" />
                                                            )}

                                                            <div className='ms-2'>
                                                                <div className='modal-title text-left fs-16 fw-600 text-white'>{singleDesign.first_name} {singleDesign.last_name}</div>
                                                                <div>
                                                                    {singleDesign.tags ?
                                                                        <>
                                                                            {singleDesign.tags.length > 0 ?
                                                                                <>

                                                                                    {singleDesign.tags.slice(0, 3).map((tag, index) => (
                                                                                        <span key={index} className="design-tags-view-bar bg-light fs-12 categories-color text-black">
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
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            })}
                                        </Carousel>
                                    </>
                                    :
                                    <>
                                    </>
                                }

                                <div lg='12' className='text-center'>
                                    <CopyTo
                                        text={`https://kouture-konect.web.app/view-design/${singleDesign.portfolioId}`}
                                        classes="btn btn-copy-link border-black bg-white text-black mt-2 w-100"
                                        standbyTitle="Copy Link"
                                        icon={true}
                                        closeModal={() => setShareShowModal(false)}
                                    />

                                    <button
                                        className="btn btn-copy-link border-black bg-white text-black mt-2 w-100"
                                        type="button"
                                        onClick={() => {
                                            toggleCopyEmbedLinkModal();
                                            setShareShowModal(false);
                                        }}
                                    >
                                        <ImEmbed2 className='me-2' size={17} />
                                        Copy Embed Code
                                    </button>
                                </div >
                            </div >
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
            
            {/* Signup */}
            <Modal show={signupModalShow} fullscreen={false} onHide={() => setSignupModalShow(false)}>
                <Modal.Header closeButton>
                <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Container className="h-100">
                    <Row className="h-100">
                    <Col lg="12">
                        <Signup type={signupType} />
                    </Col>
                    </Row>
                </Container>
                </Modal.Body>
            </Modal>

        </Layout >
    );
};

export default Designs;