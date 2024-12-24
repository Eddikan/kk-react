import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Layout from 'Components/Layout/Layout';
import { ImLeaf } from "react-icons/im";
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import toast from 'react-hot-toast';
import { GoHeart } from "react-icons/go";
import GoBack from '../Components/Shared/GoBack';
import { useCookies } from 'react-cookie';
import Loading from 'Components/Shared/Loading';
import { debounce } from 'lodash';
import { Rating } from 'react-simple-star-rating';
import '../Assets/styles/EcoFriendly/style.css';
import axios from 'axios';

const WhyWorkWithKK = (props) => {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);
    const [ecofabrics, setEcofabrics] = useState([]);
    const [ecoFabricsLoading, setEcoFabricsLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);

    // Filter
    const [ecoFriendly, setEcoFriendly] = useState(1);
    const [selectedCompositions, setSelectedCompositions] = useState([]);
    const [selectedWeaves, setSelectedWeaves] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [country, setCountry] = useState('');
    const [priceRange, setPriceRange] = useState({ from: '', to: '' });
    const [search, setSearch] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [selectedSortField, setSelectedSortField] = useState(null);
    const [selectedSortOrder, setSelectedSortOrder] = useState(null);

    const colors = ['Red', 'Blue', 'Green', 'Yellow']; // Replace with your array of colors
    const compositions = ['Polyamide', 'Polyester', 'Polyurethane', 'Acrylic', 'Cashmere', 'Mental']; // Replace with your array of composition options
    const weaves = ['Plain', 'Twill', 'Satin', 'Basket', 'Herringbone', 'Jacquard', 'Dobby', 'Leno']; // Replace with your array of weave options

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const current_user_id = cookies.currentUser;
    const userRole = cookies.userRole;
    const token = cookies.token;
    let PageSize = 10;

    const [sortOptions] = useState([
        { value: 'created_at', label: 'Date' },
        { value: 'price', label: 'Price' },
        { value: 'views', label: 'Views' },
    ]);

    async function onFilterChange(data) {
        setEcoFabricsLoading(true);
        axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'product/filter?current_user_id=' + current_user_id + '&token=' + token, data).then((response) => {
            const selectedDesigns = response.data.data;
            if (selectedDesigns) {
                setEcofabrics(selectedDesigns);
                setEcoFabricsLoading(false);
            } else {
                toast.error('Product does not exist!');
                setEcoFabricsLoading(false);
            }
        }).catch(() => {
            toast.error('Product does not exist!');
            setEcoFabricsLoading(false);
        });
    }

    async function onWishlistChange(data) {
        axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'product/filter?current_user_id=' + current_user_id + '&token=' + token, data).then((response) => {
            const selectedDesigns = response.data.data;
            if (selectedDesigns) {
                setEcofabrics(selectedDesigns);
                setEcoFabricsLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setEcoFabricsLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setEcoFabricsLoading(false);
        });
    }

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
        axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'wishlist/update?current_user_id=' + current_user_id + '&token=' + token, e).then((response) => {
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

    async function toggleAddViewCount(id) {
        axios.get(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'product/view/' + id + '?current_user_id=' + current_user_id + '&token=' + token).then((response) => {
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
    }, [mounted, ecoFriendly, selectedCompositions, selectedWeaves, selectedColors, priceRange, reloadCount, searchValue, country]);

    return (
        <Layout>
            <div className='py-5 px-2 top-bottom-embrace'>
                <section>
                    <Container>
                        <Row>
                            <Col lg="10">
                                <h2 className='fs-40 text-left mb-3 embrace-eco '>Why Work With KK</h2>
                            </Col>

                            <Col lg="2" className='text-right'>
                                <GoBack fallBack="/" />
                            </Col>

                            <Col lg="12" className='text-left'>
                                <p className='fs-16 fw-400 text-black line-height-24'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea </p>
                            </Col>
                        </Row>
                    </Container>
                </section>

                <section className="pt-3">
                    <Container>
                        <Row className="mt-2">
                            <Col lg="12">

                                <div id="profile-designs">
                                    {ecoFabricsLoading ?
                                        <>
                                            <Loading className="bg-white" />
                                        </>
                                        :
                                        <>
                                            {ecofabrics && ecofabrics.length > 0 ?
                                                <>
                                                    <Row className="designs-row">
                                                        {ecofabrics.map((fabric, index) => {
                                                            if (fabric.image_urls?.[0]?.image_url) {
                                                                var fabricImage = import.meta.env.VITE_REACT_APP_STORAGE_URL + 'product/' + fabric.image_urls[0].image_url;
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
                                                                                        <div className="designs-grid-div w-100 cursor-pointer" onClick={function () { toggleAddViewCount(fabric.id); navigate('/product/' + fabric.id); }} style={{ backgroundImage: "url(" + fabricImage + ")", minHeight: '150px' }}>
                                                                                            </div>
                                                                                           
                                                                                        <div className='save-link'>
                                                                                                {userWishlist ?
                                                                                                    <div className="action-button bg-gold" onClick={function () { wishlistUpdate({ user_id: currentUser, product_id: fabric.id }); }}>
                                                                                                        <GoHeart className="text-white" />
                                                                                                    </div>
                                                                                                    :
                                                                                                    <div className="action-button bg-white" onClick={function () { wishlistUpdate({ user_id: currentUser, product_id: fabric.id }); }}>
                                                                                                        <GoHeart className="text-black" />
                                                                                                    </div>
                                                                                                }
                                                                                            </div>
                                                                                </div>
                                                                                <div className="design-details">
                                                                                    <div className='d-flex align-items-center'>
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
                                                                                </div>
                                                                            </Col>
                                                                        </>
                                                                    )}
                                                                </>
                                                            )
                                                        })}
                                                    </Row >
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
            </div >
        </Layout >
    );
};

export default WhyWorkWithKK;