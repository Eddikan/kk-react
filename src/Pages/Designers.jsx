import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate, Link } from 'react-router-dom';
import { Modal, Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';
import Countries from 'Utils/Countries';
import { IoShirtSharp } from 'react-icons/io5';
import toast from 'react-hot-toast';
import Pagination from 'Components/Pagination/Pagination';
import { BsBroadcast } from "react-icons/bs";
import GoBack from 'Components/Shared/GoBack';
import { GoHeart } from 'react-icons/go';
import Signup from 'Components/Forms/User/Signup'
import { useCookies } from 'react-cookie';
import Loading from 'Components/Shared/Loading';
import axios from 'axios';
import { debounce } from 'lodash';
import 'react-multi-carousel/lib/styles.css';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import ShopIcon from 'Assets/images/icons/shop.png';
import Carousel from '@christian-martins/react-grid-carousel'
import 'Assets/styles/Designers/style.css';

const Designers = (props) => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'tempDesignerWishlist', 'selectedCountry', 'selectedCountryCode']);
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [designers, setDesigners] = useState([]);
    const [designersLoading, setDesignersLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [selectedCountry, setSelectedCountry] = useState(cookies.selectedCountry ?? '');

    let PageSize = 12;

    // Search
    const [specializationSearch, setSpecializationSearch] = useState('');
    const [specializationValue, setSpecializationValue] = useState('');

    // Filter Arrays
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [genders, setGenders] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);

    const [signupModalShow, setSignupModalShow] = useState(false);
    const [signupType, setSignupType] = useState('');
    const [search, setSearch] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [reloadCount, setReloadCount] = useState(0);
    const currentUser = cookies.currentUser;
    const userRole = cookies.userRole;

    const [tempDesignerWishlist, setTempDesignerWishlist] = useState(cookies.tempDesignerWishlist ?? []);

    const [sortOptions] = useState([
        { value: 'created_at', label: 'All' },
        { value: 'views', label: 'Views' },
    ]);

    const getDesigners = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designers?areas_of_specialization='+specializationSearch+'&search='+searchValue+'&country='+selectedCountry+'&categories='+selectedCategories+'&page=' + currentPage + '&user_id=' + currentUser);
    };

    const toggleGetUser = (e) => {
        // if (currentUser && currentUser != "") {
        //     window.location.href = "/designer-profile?user_id=" + e;
        // } else {
        //     showSignupModal('user_designer');
        // }
        window.location.href = "/designer-profile?user_id=" + e;
    };

    const searchChangeDebounce = debounce((e) => {
        setSearchValue(e);
    }, 1000); // 1000 milliseconds (2 seconds) delay

    const showSignupModal = (e) => {
        setSignupType(e);
        setSignupModalShow(true);
    };

    const handleChangeSearch = (e) => {
        const { name, value } = e.target;
        // Clear the previous debounce timer
        searchChangeDebounce.cancel();

        // Set a new debounce timer
        searchChangeDebounce(value);
        setSearch(value);
    };

    const specializationChangeDebounce = debounce((e) => {
        setSpecializationSearch(e);
    }, 1000); // 1000 milliseconds (2 seconds) delay

    const handleChangeSpecialization = (e) => {
        const { name, value } = e.target;
        // Clear the previous debounce timer
        specializationChangeDebounce.cancel();

        // Set a new debounce timer
        specializationChangeDebounce(value);
        setSpecializationValue(value);
    };

    const handleChangePage = (pageNumber) => {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'designers?search='+searchValue+'&country='+selectedCountry+'&page=' + pageNumber + '&user_id=' + currentUser)
            .then((response) => {
                const data = response.data;
                setCurrentPage(pageNumber);
                const selectedDesigners = response.data.data;
                if (selectedDesigners) {
                    setDesigners(selectedDesigners);
                    setCurrentPage(() => data.meta.current_page);
                    setPageCount(() => data.meta.total);
                    setPageSize(() => data.meta.per_page);
                    setDesignersLoading(false);
                } else {
                    setDesignersLoading(false);
                    toast.error('There has been an error getting the designers, please try again!');
                }
            }).catch(error => {
                setDesignersLoading(false);
                toast.error('There has been an error getting the designers, please try again!');
            });
    };
    
    async function wishlistDesignerUpdate(e) {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'designer/wishlist/update', e).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                setReloadCount(reloadCount + 1)
            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
        }).catch((error) => {
            toast.error('Something went wrong, please contact the administrator!');
        });
    };

    const toggleTempDesignerWishlist = (item) => {
        // Check if the item ID already exists in the array
        const itemExists = tempDesignerWishlist.some(wishlistItem => wishlistItem.id === item.id);
    
        let updatedDesignerWishlist;
        if (itemExists) {
          // Remove the item from the array
          updatedDesignerWishlist = tempDesignerWishlist.filter(wishlistItem => wishlistItem.id !== item.id);
        } else {
          // Add the new item to the array
          updatedDesignerWishlist = [...tempDesignerWishlist, item];
        }
    
        // Set the updated favorites array in cookies
        setCookie('tempDesignerWishlist', JSON.stringify(updatedDesignerWishlist), { path: '/' });
        // Update the local state
        setTempDesignerWishlist(updatedDesignerWishlist);
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

    // Handle checkbox change event
    const handleSelectCategoryChange = (event) => {
        const categoryId = parseInt(event.target.value, 10);
        if (event.target.checked) {
            setSelectedCategories([...selectedCategories, categoryId]);
        } else {
            setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
        }
    };

    useEffect(() => {
        setDesignersLoading(true);
        getDesigners()
            .then((response) => {
                const selectedDesigners = response.data.data;
                if (selectedDesigners) {
                    setDesigners(selectedDesigners);
                    setPageCount(() => response.data.meta.total);
                    setDesignersLoading(false);
                } else {
                    toast.error('There has been an error getting the designers, please try again!');
                    setDesignersLoading(false);
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the designers, please try again!');
                setDesignersLoading(false);
            });
    }, [reloadCount, selectedCountry, selectedCategories, specializationSearch, searchValue]);

    const handleChangeCountry = (e) => {
        const {name, value} = e.target;
        setSelectedCountry(value ?? '');
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
            <section className='py-5 px-5'>
                <Container>
                    <Row className='mb-3'>
                        <Col lg="3" className=''>
                            <h2 className='fs-40'>Designers</h2>
                        </Col>
                        <Col lg="9" className='text-right'>
                            <Row>
                                <Col lg="9">
                                    <div className="d-flex my-2">
                                        <div className="category-container">
                                            {categories && categories.length > 0 ? (
                                                <Carousel 
                                                    cols={6} 
                                                    rows={1} 
                                                    arrowLeft={FaAngleLeft}
                                                    arrowRight={FaAngleRight}
                                                    gap={2}
                                                >
                                                    {categories.map((category, index) => (
                                                        <Carousel.Item>
                                                        <p key={index} className="category-item my-auto text-center fs-12">
                                                            {category.name}
                                                        </p>
                                                        </Carousel.Item>
                                                    ))}
                                                </Carousel>
                                            ) : null}
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="3">
                                    <Button className="custom-hover-btn py-2 fs-12"> <img src={ShopIcon} height="19px" className="mx-1" alt="shop-icon"/>Create your Shop</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <div id="profile-designers">
                        <Row>
                            <Col lg="3">
                                <div className="filter-sidebar pe-4">
                                    <Form.Group className='mb-4'>
                                        <Form.Label className="fw-600 fs-15">Search</Form.Label>
                                        <Form.Control  placeholder="Enter your search term..." type="text" onChange={(e) => handleChangeSearch(e)} />
                                    </Form.Group>
                                    {/* <Form.Group className='mb-4'>
                                        <Form.Label className="fw-600">Sort</Form.Label>
                                        <Form.Control as='select'>
                                            <option value="" disabled selected  >Sort By:</option>
                                            {sortOptions.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group> */}
                                    <Form.Group className='mb-4'>
                                        <Form.Label className="fw-600 fs-15">Country</Form.Label>
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
                                    <Form.Group className='mb-4'>
                                        <Form.Label className="fw-600 fs-15">Areas of Specialization and Expertise</Form.Label>
                                        <Form.Control value={specializationValue} onChange={(e) => handleChangeSpecialization(e)}></Form.Control>
                                    </Form.Group>
                                    <hr />
                                    {categories && categories.length > 0 ?
                                        <>
                                            <Form.Group className='mb-3'>
                                                <Form.Label className="fw-600 fs-15">Categories</Form.Label>
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
                                                                className="mb-2 fs-14"
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
                            </Col>
                            <Col lg="9">
                                {designersLoading ?
                                    <>
                                        {/* <p className='text-center mb-3 mt-3'>
                                            Loading...
                                        </p> */}
                                        <Card className="text-center">
                                            <Card.Body>
                                                <Loading className="bg-white py-0" />
                                            </Card.Body>
                                        </Card>
                                    </>
                                    :
                                    <>
                                        {designers && designers.length > 0 ? (
                                            <>
                                                <Row>
                                                    {designers.map((designer, index) => {
                                                        var wishlist_user_ids = designer.wishlist_user_ids ?? [];
                                                        const userWishlist = wishlist_user_ids.includes(currentUser);
                                                        return (
                                                            <Col lg={3}>
                                                                <div key={index} className="mb-4 position-relative designer-box-details">
                                                                    {designer.livestream && currentUser && currentUser != "" ?
                                                                        <>
                                                                            <a href={`/designer/live/stream/${designer.livestream?.id}`} target="_blank">
                                                                                <button className="btn btn-danger designer-live fw-600"> <BsBroadcast size="22px" /> Live</button>
                                                                            </a>
                                                                        </>
                                                                        :
                                                                        null
                                                                    }
                                                                    {designer.user.image ? (
                                                                        // <div onClick={() => toggleGetUser(designer.user.id)} className="designers-grid-div w-100" style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${designer.user.image})` }}>
                                                                        //     <div className='bg-black-faded cursor-pointer designer-overlay'>
                                                                        //         <div className="designer-details">
                                                                        //             <h3 className="designer-name text-white fs-25 mb-1 fw-600">{designer.user.first_name && designer.user.first_name !== "" ? designer.user.first_name : "-"} {designer.user.last_name && designer.user.last_name !== "" ? designer.user.last_name : "-"}</h3>
                                                                        //             <p className="text-white mb-0 bio-short-designer">{designer.user.short_bio || "-"}</p>
                                                                        //         </div>
                                                                        //     </div>
                                                                        // </div>
                                                                        <div className="designer-container">
                                                                            <div onClick={() => toggleGetUser(designer.user.id)} className="designers-grid-div w-100" style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${designer.user.image})` }}>
                                                                                <div className='bg-black-faded cursor-pointer designer-overlay'>
                                                                                    {/* <div className="designer-details">
                                                                                        <h3 className="designer-name text-white fs-25 mb-1 fw-600">{designer.user.first_name && designer.user.first_name !== "" ? designer.user.first_name : "-"} {designer.user.last_name && designer.user.last_name !== "" ? designer.user.last_name : "-"}</h3>
                                                                                        <p className="text-white mb-0 bio-short-designer">{designer.user.short_bio || "-"}</p>
                                                                                    </div> */}
                                                                                </div>
                                                                            </div>
                                                                            <div className="designer-details-bottom">
                                                                                <h3 className="designer-name fs-18 mt-13 mb-0 fw-600">{designer.user.first_name && designer.user.first_name !== "" ? designer.user.first_name : "-"} {designer.user.last_name && designer.user.last_name !== "" ? designer.user.last_name : "-"}</h3>
                                                                                <p className="mb-0 fs-12 mt-1 bio-short-designer">{designer.user.short_bio || "-"}</p>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                        <div className="designer-container">
                                                                            <div onClick={() => toggleGetUser(designer.user.id)} className="designers-grid-div w-100" style={{ backgroundImage: `url(${designer.user.gender === 'Female' ? FemalePlaceholder : MalePlaceholder})` }}>
                                                                                <div className='bg-black-faded cursor-pointer designer-overlay'>
                                                                                    {/* <div className="designer-details">
                                                                                        <h3 className="designer-name text-white fs-25 mb-1 fw-600">{designer.user.first_name && designer.user.first_name !== "" ? designer.user.first_name : "-"} {designer.user.last_name && designer.user.last_name !== "" ? designer.user.last_name : "-"}</h3>
                                                                                        <p className="text-white mb-0 bio-short-designer">{designer.user.short_bio || "-"}</p>
                                                                                    </div> */}
                                                                                </div>
                                                                            </div>  
                                                                            <div className="designer-details-bottom">
                                                                                <h3 className="designer-name fs-18 mt-13 mb-0 fw-600">{designer.user.first_name && designer.user.first_name !== "" ? designer.user.first_name : "-"} {designer.user.last_name && designer.user.last_name !== "" ? designer.user.last_name : "-"}</h3>
                                                                                <p className="mb-0 fs-12 mt-1 bio-short-designer">{designer.user.short_bio || "-"}</p>
                                                                            </div>                                                             
                                                                        </div>
                                                                        </>
                                                                    )}
                                                                    {userRole !== 'Admin' && designer.user.id != currentUser ?
                                                                        <>
                                                                            {currentUser ?
                                                                                <>
                                                                                    <div className='save-link designer-link'>
                                                                                        {userWishlist ?
                                                                                            <div className="kouture-tooltip">
                                                                                                <div className="action-button bg-gold"
                                                                                                    onClick={function () { wishlistDesignerUpdate({ user_id: currentUser, designer_id: designer.id }); }}
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
                                                                                                    onClick={function () { wishlistDesignerUpdate({ user_id: currentUser, designer_id: designer.id }); }}
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
                                                                                <div className='save-link designer-link'>
                                                                                        {tempDesignerWishlist.some(wishlistItem => wishlistItem.id === designer.id) ?
                                                                                            <div className="kouture-tooltip">
                                                                                                <div className="action-button bg-gold"
                                                                                                    onClick={function () { toggleTempDesignerWishlist({id: designer.id, user_id: currentUser, first_name: designer.user.name, last_name: designer.user.last_name, short_bio: designer.user.short_bio, image_url: designer.image, designer_user_id: designer.user.id}); }}>
                                                                                                    <GoHeart className="text-white" />
                                                                                                </div>
                                                                                                <div className="kouture-tooltiptext" style={{width: '190px', left: '-22px'}}>
                                                                                                    Remove from Wishlist
                                                                                                </div>
                                                                                            </div>
                                                                                            :
                                                                                            <div className="kouture-tooltip">
                                                                                                <div className="action-button bg-white"
                                                                                                    onClick={function () { toggleTempDesignerWishlist({id: designer.id, user_id: currentUser, first_name: designer.user.name, last_name: designer.user.last_name, short_bio: designer.user.short_bio, image_url: designer.image, designer_user_id: designer.user.id}); }}>
                                                                                                    <GoHeart className="text-black" />
                                                                                                </div>
                                                                                                <div className="kouture-tooltiptext" style={{width: '190px', left: '-22px'}}>
                                                                                                    Add to Wishlist
                                                                                                </div>
                                                                                            </div>
                                                                                        }
                                                                                    </div>
                                                                                // <>
                                                                                //     <div className='save-link designer-link'>
                                                                                //         {tempDesignerWishlist.some(wishlistItem => wishlistItem.id === designer.id) ?
                                                                                //             <div className="kouture-tooltip">
                                                                                //                 <div
                                                                                //                     className="action-button bg-gold"
                                                                                //                     onClick={function () { toggleTempDesignerWishlist({id: designer.id, user_id: currentUser, first_name: designer.user.name, last_name: designer.user.last_name, short_bio: designer.user.short_bio, image_url: designer.image, designer_user_id: designer.user.id}); }}
                                                                                //                 >
                                                                                //                     <GoHeart className="text-white" />
                                                                                //                 </div>
                                                                                //                 <div className="kouture-tooltiptext" style={{width: '190px', left: '-22px'}}>
                                                                                //                     Remove from Wishlist
                                                                                //                 </div>
                                                                                //             </div>
                                                                                //             :
                                                                                //             <div className="kouture-tooltip">
                                                                                //                 <div
                                                                                //                     className="action-button bg-white"
                                                                                //                     onClick={function () { toggleTempDesignerWishlist({id: designer.id, user_id: currentUser, first_name: designer.user.name, last_name: designer.user.last_name, short_bio: designer.user.short_bio, image_url: designer.image, designer_user_id: designer.user.id}); }}
                                                                                //                     >
                                                                                //                     <GoHeart className="text-black" />
                                                                                //                 </div>
                                                                                //                 <div className="kouture-tooltiptext" style={{width: '190px', left: '-22px'}}>
                                                                                //                     Add to Wishlist
                                                                                //                 </div>
                                                                                //             </div>
                                                                                //         }
                                                                                //     </div>
                                                                                // </>
                                                                            }
                                                                            
                                                                        </>
                                                                        :
                                                                        <>

                                                                        </>
                                                                    }
                                                                </div>
                                                            </Col>
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
                                                            <Link to="/sign-up?type=customer&option=designers&redirect_to=/designers">
                                                                <Button type="button" className="btn-primary" variant="primary">View More</Button>
                                                            </Link>
                                                        </Col>
                                                    }
                                                </Row>
                                            </>
                                        ) : (
                                            <Card className="text-center">
                                                <Card.Body>
                                                    <IoShirtSharp size="50px" className="mt-2" />
                                                    <p className="text-center fs-20 mb-2 mt-3">No records found.</p>
                                                </Card.Body>
                                            </Card>
                                        )}
                                    </>
                                }
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>
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
        </Layout>
    );
};

export default Designers;