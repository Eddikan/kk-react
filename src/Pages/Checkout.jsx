import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LayoutNoFooter from 'Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card, FormGroup, FormControl } from 'react-bootstrap';
import { PayPalButtons } from "@paypal/react-paypal-js";
import Form from 'react-bootstrap/Form';
import 'Assets/styles/DesignerCalendar/style.css';
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
import SignUp from 'Components/Forms/InsideAuth/Signup';
import Login from 'Components/Forms/InsideAuth/Login';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaTruck, FaCcStripe } from "react-icons/fa";
import LoadingPage from 'Components/Shared/LoadingPage';
import 'Assets/styles/Cart/style.css';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import DesignersConnect from 'Components/Shared/DesignersConnect';
import UserPlaceholder from 'Assets/images/user.png';
import { AiOutlineDelete } from "react-icons/ai";
import { useParams } from 'react-router-dom';
import Countries from 'Utils/Countries';
import CountryCodes from 'Utils/CountryCodes';
import axios from "axios";
import toast from 'react-hot-toast';
import CurrencyConverter from 'Utils/CurrencyConverter';

const initialCheckOut = {
    card_name: '',
    card_number: '',
    date: '',
    ship_to: '',

    first_name: '',
    last_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    province: '',
    province_code: '',
    postal_code: '',
    country: '',
    email: '',
    phone: '',

    designer_id: '',

    delivery_first_name: '',
    delivery_last_name: '',
    delivery_address_line_1: '',
    delivery_address_line_2: '',
    delivery_city: '',
    delivery_province: '',
    delivery_province_code: '',
    delivery_postal_code: '',
    delivery_country: '',
    delivery_country_code: '',
    delivery_email: '',
    delivery_phone: '',
    needs_designer: '',

    currency: '',
    currency_code: '',
    shipping_option: '',
};

const Cart = ({ props }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const formRef = useRef(null);

    // Parse search string to get query parameters
    const searchParams = new URLSearchParams(location.search);

    // Access individual query parameters using get method
    const item = searchParams.get('item');
    const [cookies, setCookie, removeCookie] = useCookies(['userCurrency', 'userCurrencyCode', 'currencyConversions', 'selectedCurrency', 'selectedCurrencyCode', 'currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'selectedCountry', 'tempCart', 'cartItemCount', 'selectedCartItems', 'cookieCheckoutDesigner']);
    const currency = cookies.selectedCurrency || cookies.userCurrency || 'USD';
    const currencyCode = cookies.selectedCurrencyCode || cookies.userCurrencyCode || '$';
    const [reloadCount, setReloadCount] = useState(0);
    const [formStatus, setFormStatus] = useState('standby');
    const [radioButtonValue, setRadioButtonValue] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [cartItemId, setCartItemId] = useState('');
    const [checkOutFormData, setCheckOutFormData] = useState(initialCheckOut);
    const [cartItemModalDelete, setCartItemModalDelete] = useState(false);
    const [cartLoading, setCartLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [subtotalAmount, setSubtotalAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalAmountDisplay, setTotalAmountDisplay] = useState("0.00");
    const [checkoutStep, setCheckoutStep] = useState(1);
    const [selectedCartItems, setSelectedCartItems] = useState(cookies.selectedCartItems ?? []);
    const [tempCartItems, setTempCartItems] = useState(cookies.tempCart ?? []);
    const [tempCartTotal, setTempCartTotal] = useState(0.00);
    const [designerId, setDesignerId] = useState('');
    const [selectedDesigner, setSelectedDesigner] = useState(null);
    const [authModalShow, setAuthModalShow] = useState(false);
    const [activeAuth, setActiveAuth] = useState('login');
    const [currentUser, setCurrentUser] = useState(cookies.currentUser ?? null);
    const [productCount, setProductCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState();

    const [totalAmountConverted, setTotalAmountConverted] = useState(0);
    const [subtotalAmountConverted, setSubtotalAmountConverted] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [countryName, setCountryName] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [provinceName, setProvinceName] = useState('');
    const [provinceCode, setProvinceCode] = useState('');
    const [cityName, setCityName] = useState('');
    const [geonameId, setGeonameId] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [internationalShippingRate, setInternationalShippingRate] = useState([]);
    const [totalShippingAmount, setTotalShippingAmount] = useState(0.00);
    const [totalShippingAmountConverted, setTotalShippingAmountConverted] = useState(0.00);
    const [shippingLoading, setShippingLoading] = useState(false);

    const [showModal, setShowModal] = useState(0);

    const showSignup = (e) => {
        setShowModal(e)
    }

    const showLogin = (e) => {
        setShowModal(e)
    }

    const getTotalQuantity = (cartItems) => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const toggleDeleteCartItem = (id) => {
        setCartItemId(id);
        setCartItemModalDelete(!cartItemModalDelete);
    };

    const handleChangeAuth = (e) => {
        setActiveAuth(e);
    };

    const handleLogin = (e) => {
        setCurrentUser(e.user_id);
        setCartItems(e.cart_items);
        toggleAuthModal();
    }

    const toggleAuthModal = (e) => {
        setAuthModalShow(!authModalShow);
    };

    // const formatPrice = (price) => {
    //     let priceStr = price.toString();
    //     const decimalSeparator = priceStr.includes(',') ? ',' : '.';
    //     let parts = priceStr.split(decimalSeparator);

    //     if (parts.length > 1) {
    //         parts[1] = parts[1].substring(0, 2); // Keep only the first two decimal digits
    //     } else {
    //         parts[1] = '00'; // If there are no decimal parts, add "00"
    //     }

    //     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    //     let finalPrice = parts.join(decimalSeparator);

    //     if (!finalPrice.includes(decimalSeparator)) {
    //         finalPrice += decimalSeparator + "00"; // If there are no decimals, add ".00"
    //     } else if (parts[1].length === 1) {
    //         finalPrice += "0"; // If there is only one decimal, add another zero
    //     }

    //     return finalPrice;
    // };

    const formatPrice = (price) => {
        // Ensure the price is rounded to two decimal places
        let priceStr = parseFloat(price).toFixed(2);

        // Use a period as the decimal separator
        const decimalSeparator = '.';
        let parts = priceStr.split(decimalSeparator);

        // Add thousands separator to the integer part
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // Rejoin the integer and decimal parts
        let finalPrice = parts.join(decimalSeparator);

        return finalPrice;
    };

    const getCountryCode = (countryName) => {
        // Find the country code based on the country name
        const entries = Object.entries(CountryCodes);
        for (const [code, name] of entries) {
            if (name.toLowerCase() === countryName.toLowerCase()) {
                return code; // Return the corresponding country code
            }
        }
        return null; // Return null if no match is found
    }

    const getUserCartItems = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '/cart');
    };

    const getUser = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser);
    };

    const getInternationalRates = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'ups/v2/get/rating/international', data);
    }

    const postCheckOut = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'order', data);
    };

    const updateQuantity = async (data) => {
        return await axios.put(process.env.REACT_APP_API_ENDPOINT + 'cart/' + data.id, data);
    };

    const deleteCartItem = async () => {
        return await axios.delete(process.env.REACT_APP_API_ENDPOINT + 'cart/' + cartItemId);
    };

    const postIntent = async (data) => await axios.post(process.env.REACT_APP_API_ENDPOINT + 'create-intent', data);

    const handleChangeCountry = (e) => {
        setCheckOutFormData({
            ...checkOutFormData,
            delivery_province: '',
        });
    }

    const handleChangePaymentInfo = (e) => {
        const { name, value } = e.target;
        if (name == "ship_to" && value == "Ship to my address") {
            if (user) {
                setCheckOutFormData({
                    ...checkOutFormData,
                    delivery_first_name: user.first_name,
                    delivery_last_name: user.last_name,
                    delivery_email: user.email,
                    delivery_phone: user.phone_number,
                    delivery_address_line_1: user.address_line_1,
                    delivery_address_line_2: user.address_line_2,
                    delivery_city: user.city,
                    delivery_province: user.province,
                    delivery_province_code: user.province_code,
                    delivery_postal_code: user.postal_code,
                    delivery_country: user.country,
                    delivery_country_code: user.code,
                    [name]: value,
                });
                setCountryName(user.country);
            } else {
                setCheckOutFormData({
                    ...checkOutFormData,
                    [name]: value,
                });
            }
        } else if (name == "ship_to" && value == "Ship to designer") {
            setCheckOutFormData({
                ...checkOutFormData,
                delivery_first_name: '',
                delivery_last_name: '',
                delivery_email: '',
                delivery_phone: '',
                delivery_address_line_1: '',
                delivery_address_line_2: '',
                delivery_city: '',
                delivery_province: '',
                delivery_province_code: '',
                delivery_postal_code: '',
                delivery_country: '',
                delivery_country_code: '',
                [name]: value,
            });
        } else {
            setCheckOutFormData({
                ...checkOutFormData,
                [name]: value,
            });
        }


    };

    const checkOutSubmit = (e) => {
        e.preventDefault();
        setFormStatus('loading');
        const uniqueSelectedCartItems = [
            ...new Set(
                cartItems
                    .filter(item => selectedCartItems.includes(item.product.id))
                    .map(item => item.id)
            )
        ];

        postCheckOut({ ...checkOutFormData, delivery_country_code: countryCode, user_id: currentUser, product_count: totalQuantity, subtotal_amount: subtotalAmount, subtotal_amount_converted: subtotalAmountConverted, total_amount: totalAmount, total_amount_converted: totalAmountConverted, shipping_amount: totalShippingAmount, shipping_amount_converted: totalShippingAmountConverted, cart_item_ids: uniqueSelectedCartItems, product_count: productCount, cookies: cookies }).then(response => {
            const success = response.data.status;
            const data = response.data.data;
            if (success == success) {
                toast.success('Order added successfully!');
                console.log("data", data);
                setTimeout(() => {
                    setReloadCount(prevReloadCount => prevReloadCount + 1);
                    removeCookie('setSelectedCartItems', { path: '/' });
                    removeCookie('cookieCheckoutDesigner', { path: '/' });
                    navigate(`/thank-you?order_id=${data.order.id}`);
                }, 1000);
            } else {
                toast.error('There has been an error adding the order, please try again!');
            }
        }).catch(() => {
            toast.error('There has been an error adding the order, please try again!');
        });
    }

    const checkOutSubmitPaypal = (details, data) => {
        setFormStatus('loading');
        const uniqueSelectedCartItems = [
            ...new Set(
                cartItems
                    .filter(item => selectedCartItems.includes(item.product.id))
                    .map(item => item.id)
            )
        ];

        postCheckOut({ ...checkOutFormData, delivery_country_code: countryCode, user_id: currentUser, product_count: totalQuantity, subtotal_amount: subtotalAmount, subtotal_amount_converted: subtotalAmountConverted, total_amount: totalAmount, total_amount_converted: totalAmountConverted, cart_item_ids: uniqueSelectedCartItems, product_count: productCount, payment_status: 'Paid', payment_details: details, cookies: cookies }).then(response => {
            const success = response.data.status;
            const data = response.data.data;
            if (success == success) {
                toast.success('Order added successfully!');
                console.log("data", data);
                setTimeout(() => {
                    setReloadCount(prevReloadCount => prevReloadCount + 1);
                    removeCookie('setSelectedCartItems', { path: '/' });
                    removeCookie('cookieCheckoutDesigner', { path: '/' });
                    navigate(`/thank-you?order_id=${data.order.id}`);
                }, 1000);
            } else {
                toast.error('There has been an error adding the order, please try again!');
            }
        }).catch(() => {
            toast.error('There has been an error adding the order, please try again!');
        });
    }

    const checkOutSubmitStripe = async event => {
        setFormStatus('loading');
        const uniqueSelectedCartItems = [
            ...new Set(
                cartItems
                    .filter(item => selectedCartItems.includes(item.product.id))
                    .map(item => item.id)
            )
        ];

        postCheckOut({ ...checkOutFormData, delivery_country_code: countryCode, user_id: currentUser, product_count: totalQuantity, subtotal_amount: subtotalAmount, subtotal_amount_converted: subtotalAmountConverted, total_amount: totalAmount, total_amount_converted: totalAmountConverted, cart_item_ids: uniqueSelectedCartItems, product_count: productCount, payment_status: 'Processing', cookies: cookies }).then(response => {
            const success = response.data.status;
            const data = response.data.data;
            if (success == success) {
                // toast.success('Order added successfully!');
                // console.log("data", data);
                setTimeout(() => {
                    setReloadCount(prevReloadCount => prevReloadCount + 1);
                    navigate(`/stripe?order_id=${data.order.id}`);
                }, 1000);
            } else {
                toast.error('There has been an error adding the order, please try again!');
            }
        }).catch(() => {
            toast.error('There has been an error adding the order, please try again!');
        });

    };

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            // Your resize logic here
        });

        if (formRef.current) {
            resizeObserver.observe(formRef.current);
        }

        return () => {
            if (formRef.current) {
                resizeObserver.unobserve(formRef.current);
            }
        };
    }, []);

    useEffect(() => {
        document.body.classList.add('designer-calendar-body');
    }, []);

    useEffect(() => {
        // Fetch the geonameId for the country

        if (countryName != "" && checkOutFormData.shipping_option == "UPS") {
            setShippingLoading(true);
            setCountryCode(getCountryCode(countryName));
            setInternationalShippingRate([]);
            var country_code = getCountryCode(countryName);
            const recipient = {
                name: checkOutFormData.delivery_first_name + " " + checkOutFormData.delivery_last_name,
                phone: checkOutFormData.delivery_phone,
                address_line: checkOutFormData.delivery_address_line_1,
                city: checkOutFormData.delivery_city,
                state_code: checkOutFormData.delivery_province_code,
                postal_code: checkOutFormData.delivery_postal_code,
                country_code: country_code,
                residential: "true"
            };

            const shipments = [
                {
                    "seller": {
                        "id": "1",
                        "name": "John Doe",
                        "phone": "0000000000",
                        "address_line": "123 Shipper Street",
                        "city": "Cypress",
                        "state_code": "TX",
                        "postal_code": "77429",
                        "country_code": "US"
                    },
                    "package": {
                        "weight": "12",
                        "description": "",
                        "dimensions": {
                            "length": "5",
                            "width": "5",
                            "unit_of_measurement": "IN"
                        }
                    }
                },
                {
                    "seller": {
                        "id": "2",
                        "name": "Alice Johnson",
                        "phone": "1111111111",
                        "address_line": "789 Shipper Avenue",
                        "city": "Houston",
                        "state_code": "TX",
                        "postal_code": "77001",
                        "country_code": "US"
                    },
                    "package": {
                        "weight": "15",
                        "description": "",
                        "dimensions": {
                            "length": "7",
                            "width": "7",
                            "unit_of_measurement": "IN"
                        }
                    }
                }
            ];


            const data = {
                recipient: recipient,
                shipments: shipments,
            };

            getInternationalRates(data).then(response => {
                const success = response.data.status;
                const data = response.data.data;
                if (success == success) {
                    setInternationalShippingRate(data);
                    setShippingLoading(false);
                } else {
                    toast.error('There has been an error getting the shipping rates, please try again!');
                    setShippingLoading(false);
                }
            }).catch(() => {
                toast.error('There has been an error getting the shipping rates, please try again!');
                setShippingLoading(false);
            });

        }

        // if (countryName != "" && countryName) {
        //     const fetchGeonameId = async () => {
        //         const response = await fetch(
        //             `http://api.geonames.org/searchJSON?q=${countryName}&featureCode=A&maxRows=1&username=vbdev`
        //         );
        //         const data = await response.json();
        //         if (data.geonames.length > 0) {
        //             setGeonameId(data.geonames[0].geonameId);
        //         }
        //     };

        //     fetchGeonameId();
        // }

    }, [countryName, countryCode, checkOutFormData]);

    useEffect(() => {
        // Fetch the provinces once the geonameId is available
        if (geonameId) {
            const fetchProvinces = async () => {
                const response = await fetch(
                    `http://api.geonames.org/childrenJSON?geonameId=${geonameId}&username=vbdev`
                );
                const data = await response.json();
                setProvinces(data.geonames);
                console.log(data);
            };

            fetchProvinces();
        }
    }, [geonameId]);

    useEffect(() => {
        setCheckOutFormData({
            ...checkOutFormData,
            currency: currency,
            currency_code: currencyCode,
        });
    }, [cookies]);

    useEffect(() => {
        if (currentUser) {
            let cart_total = 0;
            let cart_total_converted = 0;
            let cart_total_quantity = 0;
            let total_shipping_amount = 0;
            let total_shipping_amount_converted = 0;
            if (cartItems.length > 0 && selectedCartItems.length > 0) {

                // Should the cart total be a converted price of all?
                // cart_total = cartItems.reduce((ctc, item) => {
                //     if (selectedCartItems.includes(item.product.id)) {
                //         const fabricPrice = item.product.price ?? '0';
                //         const fabricCurrency = item.product.currency ?? 'USD';

                //         const convertedPrice = CurrencyConverter(fabricPrice, 'USD', cookies);
                //         const subtotal = convertedPrice.price_raw * item.quantity;

                //         return ctc + subtotal;
                //     }
                //     return ctc;
                // }, 0);

                cart_total_quantity = cartItems.reduce((ctq, item) => {
                    if (selectedCartItems.includes(item.product.id)) {
                        const quantity = item.quantity;

                        return ctq + quantity;
                    }
                    return ctq;
                }, 0);

                cart_total = cartItems.reduce((ct, item) => {
                    if (selectedCartItems.includes(item.product.id)) {
                        const subtotal = item.product.price * item.quantity;

                        return ct + subtotal;
                    }
                    return ct;
                }, 0);

                if (internationalShippingRate && checkOutFormData.shipping_option == "UPS") {
                    total_shipping_amount = cartItems.reduce((tsa, item, index) => {
                        if (selectedCartItems.includes(item.product.id)) {
                            let shippingPriceConverted = 0.00;
                            let total_shipping_price = 0.00;
                            let total_shipping_price_converted = 0.00;

                            let shipping_currency = 'USD';

                            if (internationalShippingRate && internationalShippingRate.length > 0) {
                                var shippingRate = internationalShippingRate[index];

                                if (shippingRate) {
                                    total_shipping_price = shippingRate.RateResponse.RatedShipment.TotalCharges.MonetaryValue ?? 0;;
                                    shipping_currency = shippingRate.RateResponse.RatedShipment.TotalCharges.CurrencyCode ?? 'USD';

                                }
                            }

                            return parseFloat(tsa) + parseFloat(total_shipping_price);
                        }

                    }, 0);

                    total_shipping_amount_converted = cartItems.reduce((tsa, item, index) => {
                        if (selectedCartItems.includes(item.product.id)) {
                            let shippingPriceConverted = 0.00;
                            let total_shipping_price = 0.00;
                            let total_shipping_price_converted = 0.00;

                            let shipping_currency = 'USD';

                            if (internationalShippingRate && internationalShippingRate.length > 0) {
                                var shippingRate = internationalShippingRate[index];

                                if (shippingRate) {
                                    total_shipping_price = shippingRate.RateResponse.RatedShipment.TotalCharges.MonetaryValue ?? 0;;
                                    shipping_currency = shippingRate.RateResponse.RatedShipment.TotalCharges.CurrencyCode ?? 'USD';

                                    total_shipping_price_converted = CurrencyConverter(total_shipping_price, shipping_currency, cookies);
                                }
                            }

                            return parseFloat(tsa) + parseFloat(total_shipping_price_converted.price_raw ?? 0);
                        }

                    }, 0);
                } else {
                    total_shipping_amount = 0;
                    total_shipping_amount_converted = 0;
                }

                cart_total_converted = cartItems.reduce((ctc, item) => {
                    if (selectedCartItems.includes(item.product.id)) {
                        const fabricPrice = item.product.price ?? '0';
                        const fabricCurrency = item.product.currency ?? 'USD';

                        const convertedPrice = CurrencyConverter(fabricPrice, fabricCurrency, cookies);
                        const subtotal = convertedPrice.price_raw * item.quantity;

                        return ctc + subtotal;
                    }
                    return ctc;
                }, 0);
            }
            if (cart_total > 0) {
                setTotalQuantity(cart_total_quantity);
                setTotalAmount(parseFloat(parseFloat(cart_total) + parseFloat(total_shipping_amount)));
                setTotalAmountConverted(parseFloat(parseFloat(cart_total_converted) + parseFloat(total_shipping_amount_converted)));
                setSubtotalAmount(cart_total);
                setSubtotalAmountConverted(cart_total_converted);
                setTotalAmountDisplay(formatPrice(parseFloat(parseFloat(cart_total_converted) + parseFloat(total_shipping_amount_converted))))
                setTotalShippingAmount(parseFloat(total_shipping_amount));
                setTotalShippingAmountConverted(parseFloat(total_shipping_amount_converted));
            } else {
                setTotalQuantity(0);
                setTotalAmount(0.00);
                setTotalAmountConverted(0.00);
                setSubtotalAmount(0.00);
                setSubtotalAmountConverted(0.00);
                setTotalAmountDisplay("0.00");
                setTotalShippingAmount(0.00);
                setTotalShippingAmountConverted(0.00);
            }
        }
    }, [cookies, selectedCartItems, item, reloadCount, cartItems, internationalShippingRate, checkOutFormData]);

    useEffect(() => {
        getUser()
            .then((response) => {
                const userData = response.data.data;
                if (userData) {
                    setUser(userData);
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the user, please try again!');
                setCartLoading(false);
            });

        getUserCartItems()
            .then((response) => {
                const cartItemsData = response.data.data;
                if (cartItemsData) {
                    setCartItems(cartItemsData);
                    setCartLoading(false);
                    cartItemsData.map((cartItem) => {
                        if (selectedCartItems.includes(cartItem.product.id)) {
                            setProductCount((prevProductCount) => prevProductCount + cartItem.quantity);
                        }
                    });
                } else {
                    toast.error('There has been an error getting the products, please try again!');
                    setCartLoading(false);
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the products, please try again!');
                setCartLoading(false);
            });
    }, [reloadCount, item]);

    useEffect(() => {
        if (!currentUser && tempCartItems) {
            let cart_total = 0;
            let cart_total_converted = 0;
            let cart_total_quantity = 0;

            if (tempCartItems.length > 0 && tempCartItems.length > 0) {
                cart_total_quantity = cartItems.reduce((ctq, item) => {
                    if (selectedCartItems.includes(item.product.id)) {
                        const quantity = item.quantity;

                        return ctq + quantity;
                    }
                    return ctq;
                }, 0);

                cart_total = cartItems.reduce((ct, item) => {
                    if (selectedCartItems.includes(item.product.id)) {
                        const subtotal = item.product.price * item.quantity;

                        return ct + subtotal;
                    }
                    return ct;
                }, 0);

                cart_total_converted = cartItems.reduce((ctc, item) => {
                    if (selectedCartItems.includes(item.product.id)) {
                        const fabricPrice = item.product.price ?? '0';
                        const fabricCurrency = item.product.currency ?? 'USD';

                        const convertedPrice = CurrencyConverter(fabricPrice, fabricCurrency, cookies);
                        const subtotal = convertedPrice.price_raw * item.quantity;

                        return ctc + subtotal;
                    }
                    return ctc;
                }, 0);

            }
            if (cart_total > 0) {
                setTotalQuantity(cart_total_quantity);
                setTotalAmount(cart_total);
                setTotalAmountConverted(cart_total_converted);
                setSubtotalAmount(cart_total);
                setSubtotalAmountConverted(cart_total_converted);
                setTotalAmountDisplay(formatPrice(cart_total_converted))
            } else {
                setTotalQuantity(0);
                setTotalAmount(0.00);
                setTotalAmountConverted(0.00);
                setSubtotalAmount(0.00);
                setSubtotalAmountConverted(0.00);
                setTotalAmountDisplay("0.00");
            }
        }

    }, [cookies, tempCartItems, selectedCartItems, reloadCount, item]);

    return (
        <LayoutNoFooter>
            {cartLoading ?
                <>
                    <LoadingPage />
                </>
                :
                <>
                    <section className="pb-5 pt-30 px-5" ref={formRef}>
                        <Container>
                            <Row>
                                <Col lg={12}>
                                    <Row className="pb-4">
                                        <Col md={6} className='d-flex justify-content-left align-items-center'>
                                            <h3 className="fs-30 fw-600 text-black mb-0">Checkout</h3>
                                        </Col>
                                        <Col md={6} className="text-right">
                                            <GoBack fallBack="/#" />
                                        </Col>
                                    </Row>
                                </Col>

                                <Col lg={7}>
                                    <Card>
                                        <Card.Body className='bg-light'>
                                            <Row>
                                                <Col lg={5}>
                                                    Item
                                                </Col>
                                                <Col className="text-right" lg={2}>
                                                    Price
                                                </Col>
                                                <Col className="text-right" lg={2}>
                                                    Shipping
                                                </Col>
                                                <Col className="text-right" lg={3}>
                                                    Total
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    {currentUser ?
                                        <>
                                            {shippingLoading ?
                                                <Card className='mt-2'>
                                                    <Card.Body>
                                                        <Row>
                                                            <Col lg="12" className='text-center'>
                                                                <span>Loading...</span>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                                :
                                                <>
                                                    {cartItems ?
                                                        <>
                                                            {cartItems.length > 0 && selectedCartItems.length > 0 ?
                                                                <>
                                                                    {cartItems.map((cartItem, index) => {
                                                                        if (selectedCartItems.includes(cartItem.product.id)) {
                                                                            var cart_product = cartItem.product;
                                                                            if (cart_product.image_urls) {
                                                                                var image_urls = JSON.parse(cart_product.image_urls);
                                                                                var fabricImage = process.env.REACT_APP_STORAGE_URL + 'product/' + image_urls[0].image_url;
                                                                            } else {
                                                                                var fabricImage = PlaceholderImage;
                                                                            }

                                                                            const fabricPrice = cart_product.price ?? '0';
                                                                            const fabricCurrency = cart_product.currency ?? 'USD';

                                                                            const convertedPrice = CurrencyConverter(fabricPrice, fabricCurrency, cookies);
                                                                            const subtotal = convertedPrice.price_raw * cartItem.quantity;
                                                                            let cart_item_total = 0;
                                                                            const formattedSubtotal = formatPrice(subtotal);

                                                                            let shippingPriceConverted = 0.00;
                                                                            let totalShippingPrice = 0.00;
                                                                            let totalShippingPriceConverted = 0.00;

                                                                            let shippingCurrency = 'USD';


                                                                            if (internationalShippingRate && internationalShippingRate.length > 0 && checkOutFormData.shipping_option == "UPS") {
                                                                                var shippingRate = internationalShippingRate[index];

                                                                                if (shippingRate) {
                                                                                    totalShippingPrice = shippingRate.RateResponse.RatedShipment.TotalCharges.MonetaryValue ?? 0;;
                                                                                    shippingCurrency = shippingRate.RateResponse.RatedShipment.TotalCharges.CurrencyCode ?? 'USD';

                                                                                    totalShippingPriceConverted = CurrencyConverter(totalShippingPrice, shippingCurrency, cookies);

                                                                                    cart_item_total = parseFloat(subtotal) + parseFloat(totalShippingPriceConverted.price_raw);
                                                                                }

                                                                            } else {
                                                                                cart_item_total = parseFloat(subtotal);
                                                                            }

                                                                            return (
                                                                                <Card className='mt-2'>
                                                                                    <Card.Body>
                                                                                        <Row className="align-items-center">
                                                                                            <Col lg={5}>
                                                                                                <div className='d-flex'>
                                                                                                    <div className="designs-grid-div fabric-image"
                                                                                                        style={{ backgroundImage: "url(" + fabricImage + ")", width: '100px', height: '100px' }}>
                                                                                                    </div>

                                                                                                    <div className='ms-3'>
                                                                                                        <div className='mb-1 fw-500 text-black'>
                                                                                                            {cartItem.product.name}
                                                                                                        </div>
                                                                                                        <div className="">
                                                                                                            <p>Qty. {cartItem.quantity} {cartItem.product.unit_measurement}</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </Col>
                                                                                            <Col lg={2} className="text-right">
                                                                                                <h3 className="rufina-family fs-18"><strong>{convertedPrice.currency_code}{formattedSubtotal}</strong></h3>
                                                                                            </Col>
                                                                                            <Col lg={2} className="text-right">
                                                                                                {checkOutFormData.shipping_option == "UPS" && totalShippingPriceConverted.price_raw && totalShippingPriceConverted.price_raw > 0 ?
                                                                                                    <h3 className="rufina-family fs-18"><strong>{convertedPrice.currency_code}{totalShippingPriceConverted.price}</strong></h3>
                                                                                                    :
                                                                                                    <h3 className="rufina-family fs-18"><strong>{convertedPrice.currency_code}0.00</strong></h3>
                                                                                                }

                                                                                            </Col>
                                                                                            <Col lg={3} className="text-right">
                                                                                                <h3 className="rufina-family"><strong>{convertedPrice.currency_code}{formatPrice(cart_item_total)}</strong></h3>
                                                                                                {cartItem.quantity > 1 ?
                                                                                                    <p className="small text-muted">{convertedPrice.currency_code}{convertedPrice.price} each</p>
                                                                                                    :
                                                                                                    null
                                                                                                }
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </Card.Body>
                                                                                </Card>
                                                                            );
                                                                        }
                                                                    })}

                                                                </>
                                                                :
                                                                <>
                                                                    <Card className='mt-2'>
                                                                        <Card.Body>
                                                                            <Row>
                                                                                <Col lg="12" className='text-center'>
                                                                                    <span>Your cart is empty.</span>
                                                                                </Col>
                                                                            </Row>
                                                                        </Card.Body>
                                                                    </Card>
                                                                </>
                                                            }
                                                        </>
                                                        :
                                                        <>
                                                            <Card className='mt-2'>
                                                                <Card.Body>
                                                                    <Row>
                                                                        <Col lg="12" className='text-center'>
                                                                            <span>Your cart is empty.</span>
                                                                        </Col>
                                                                    </Row>
                                                                </Card.Body>
                                                            </Card>
                                                        </>
                                                    }
                                                </>
                                            }
                                        </>
                                        :
                                        <>
                                            {tempCartItems ?
                                                <>
                                                    {tempCartItems.length > 0 && selectedCartItems.length > 0 ?
                                                        <>
                                                            {tempCartItems.map((cartItem) => {

                                                                if (selectedCartItems.includes(cartItem.id)) {
                                                                    var cart_product = cartItem;
                                                                    if (cart_product.images) {
                                                                        var image = cart_product.images;
                                                                        var fabricImage = process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url;
                                                                    } else {
                                                                        var fabricImage = PlaceholderImage;
                                                                    }

                                                                    const fabricPrice = cart_product.price ?? '0';
                                                                    const fabricCurrency = cart_product.currency ?? 'USD';

                                                                    const convertedPrice = CurrencyConverter(fabricPrice, fabricCurrency, cookies);
                                                                    const subtotal = convertedPrice.price_raw * cartItem.quantity;
                                                                    const formattedSubtotal = formatPrice(subtotal);

                                                                    return (
                                                                        <Card className='mt-2'>
                                                                            <Card.Body>
                                                                                <Row className="align-items-center">
                                                                                    <Col lg={8}>
                                                                                        <div className='d-flex'>
                                                                                            <div className="designs-grid-div fabric-image"
                                                                                                style={{ backgroundImage: "url(" + fabricImage + ")", width: '100px', height: '100px' }}>
                                                                                            </div>

                                                                                            <div className='ms-3'>
                                                                                                <div className='mb-1 fw-500 text-black'>
                                                                                                    {cartItem.name}
                                                                                                </div>
                                                                                                <div className="">
                                                                                                    <p>Qty. {cartItem.quantity} {cartItem.unit_measurement}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </Col>

                                                                                    <Col lg={4} className="text-right">
                                                                                        <h3 className="rufina-family"><strong>{convertedPrice.currency_code}{formattedSubtotal}</strong></h3>
                                                                                        {cartItem.quantity > 1 ?
                                                                                            <p className="small text-muted">{convertedPrice.currency_code}{convertedPrice.price} each</p>
                                                                                            :
                                                                                            null
                                                                                        }
                                                                                    </Col>
                                                                                </Row>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    );
                                                                }
                                                            })}

                                                        </>
                                                        :
                                                        <>
                                                            <Card className='mt-2'>
                                                                <Card.Body>
                                                                    <Row>
                                                                        <Col lg="12" className='text-center'>
                                                                            <span>Your cart is empty.</span>
                                                                        </Col>
                                                                    </Row>
                                                                </Card.Body>
                                                            </Card>
                                                        </>
                                                    }
                                                </>
                                                :
                                                <>
                                                    <Card className='mt-2'>
                                                        <Card.Body>
                                                            <Row>
                                                                <Col lg="12" className='text-center'>
                                                                    <span>Your cart is empty.</span>
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </>
                                            }
                                        </>
                                    }
                                    {shippingLoading ?
                                        null
                                        :
                                        <>
                                            {currentUser ?
                                                <Card className='mt-2'>
                                                    <Card.Body className='bg-light'>
                                                        <Row>
                                                            <Col lg="12" className='text-right'>
                                                                <span className='fs-18 me-3'>Total Amount: </span><span className='total-price fw-600'><h3 className="rufina-family total-price fw-600 d-inline-block">{currencyCode}{totalAmountDisplay}</h3></span>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                                :
                                                <Card className='mt-2'>
                                                    <Card.Body className='bg-light'>
                                                        <Row>
                                                            <Col lg="12" className='text-right'>
                                                                <span className='fs-18 me-3'>Total Amount: </span><span className='total-price fw-600'><h3 className="rufina-family total-price fw-600 d-inline-block">{currencyCode}{totalAmountDisplay}</h3></span>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                            }
                                        </>
                                    }
                                </Col>

                                <Col lg={5}>
                                    <Form onSubmit={checkOutSubmit}>
                                        <Card className="mb-3">
                                            <Card.Body>
                                                <div className='fs-22 rufina-family fw-600'>Shipping Information</div>
                                                <hr className='mt-2' />
                                                <FormGroup>
                                                    <Form.Label htmlFor="ship_to" className='mb-2'>
                                                        Ship to
                                                    </Form.Label>
                                                    <select id="ship_to" name="ship_to" value={checkOutFormData.ship_to} onChange={handleChangePaymentInfo} className="form-control mb-3" required>
                                                        <option value=""></option>
                                                        <option value="Ship to my address">Ship to my address</option>
                                                        <option value="Ship to designer">Ship to designer</option>
                                                    </select>
                                                </FormGroup>
                                                {checkOutFormData.ship_to != "" ?
                                                    <>
                                                        {checkOutFormData.ship_to != "Ship to designer" || !selectedDesigner ?
                                                            <>
                                                                <hr className='mt-2' />
                                                                <Form.Label className='mb-2'>
                                                                    <strong>Shipping Address</strong>
                                                                </Form.Label>
                                                                <FormGroup className="mb-3">
                                                                    <Row>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="first_name" className='mb-2'>
                                                                                First Name <span className="text-danger">*</span>
                                                                            </Form.Label>
                                                                            <FormControl
                                                                                type="text"
                                                                                name="delivery_first_name"
                                                                                value={checkOutFormData.delivery_first_name}
                                                                                onChange={handleChangePaymentInfo}
                                                                                id="first_name"
                                                                                required
                                                                            />
                                                                        </Col>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="last_name" className='mb-2'>
                                                                                Last Name
                                                                            </Form.Label>
                                                                            <FormControl
                                                                                type="text"
                                                                                name="delivery_last_name"
                                                                                value={checkOutFormData.delivery_last_name}
                                                                                onChange={handleChangePaymentInfo}
                                                                                id="last_name"
                                                                                required
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </FormGroup>
                                                                <FormGroup className="mb-3">
                                                                    <Row>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="email" className='mb-2'>
                                                                                Email <span className="text-danger">*</span>
                                                                            </Form.Label>
                                                                            <FormControl
                                                                                type="email"
                                                                                name="delivery_email"
                                                                                value={checkOutFormData.delivery_email}
                                                                                onChange={handleChangePaymentInfo}
                                                                                id="email"
                                                                                required
                                                                            />
                                                                        </Col>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="phone" className='mb-2'>
                                                                                Phone Number <span className="text-danger">*</span>
                                                                            </Form.Label>
                                                                            <FormControl
                                                                                type="text"
                                                                                name="delivery_phone"
                                                                                value={checkOutFormData.delivery_phone}
                                                                                onChange={handleChangePaymentInfo}
                                                                                id="phone"
                                                                                required
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </FormGroup>
                                                                <FormGroup className="mb-3">
                                                                    <Form.Label htmlFor="address_line_1" className='mb-2'>
                                                                        Address Line 1 <span className="text-danger">*</span>
                                                                    </Form.Label>
                                                                    <FormControl
                                                                        type="text"
                                                                        name="delivery_address_line_1"
                                                                        value={checkOutFormData.delivery_address_line_1}
                                                                        onChange={handleChangePaymentInfo}
                                                                        id="address_line_1"
                                                                        required
                                                                    />
                                                                </FormGroup>
                                                                <FormGroup className="mb-3">
                                                                    <Form.Label htmlFor="address_line_2" className='mb-2'>
                                                                        Address Line 2
                                                                    </Form.Label>
                                                                    <FormControl
                                                                        type="text"
                                                                        name="delivery_address_line_2"
                                                                        value={checkOutFormData.delivery_address_line_2}
                                                                        onChange={handleChangePaymentInfo}
                                                                        id="address_line_2"
                                                                    />
                                                                </FormGroup>
                                                                <FormGroup className="mb-3">
                                                                    <Row>
                                                                        <Col lg="12">
                                                                            <Form.Label htmlFor="province" className='mb-2'>
                                                                                Country <span className="text-danger">*</span>
                                                                            </Form.Label>
                                                                            <Form.Control as='select' name='delivery_country' value={checkOutFormData.delivery_country} className=''
                                                                                onChange={function (e) {
                                                                                    // handleChangeCountry(); 
                                                                                    setCountryName(e.target.value);
                                                                                    handleChangePaymentInfo(e);
                                                                                }} required>
                                                                                <option value=''>Select Country</option>
                                                                                {Countries.map((country, index) => (
                                                                                    <option key={country + "-" + index} value={country}>
                                                                                        {country}
                                                                                    </option>
                                                                                ))}
                                                                            </Form.Control>
                                                                        </Col>
                                                                    </Row>
                                                                </FormGroup>
                                                                <FormGroup className="mb-3">
                                                                    <Row>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="province" className='mb-2'>
                                                                                Province/State <span className="text-danger">*</span>
                                                                            </Form.Label>
                                                                            {/* <Form.Control as='select' name='delivery_province' value={checkOutFormData.delivery_province} className='' onChange={function(e) { handleChangePaymentInfo(e); }} required>
                                                                                <option value=''>Select Province/State</option>
                                                                                {provinces.map(province => (
                                                                                    <option key={province.geonameId} value={province.name}>
                                                                                        {province.name}
                                                                                    </option>
                                                                                ))}
                                                                            </Form.Control> */}
                                                                            <FormControl
                                                                                type="text"
                                                                                name="delivery_province"
                                                                                value={checkOutFormData.delivery_province}
                                                                                onChange={handleChangePaymentInfo}
                                                                                id="province"
                                                                                required
                                                                            />
                                                                        </Col>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="province" className='mb-2'>
                                                                                Province/State Code <span className="text-danger">*</span>
                                                                            </Form.Label>
                                                                            <FormControl
                                                                                type="text"
                                                                                name="delivery_province_code"
                                                                                value={checkOutFormData.delivery_province_code}
                                                                                onChange={handleChangePaymentInfo}
                                                                                id="province"
                                                                                required
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </FormGroup>
                                                                <FormGroup className="mb-3">
                                                                    <Row>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="city" className='mb-2'>
                                                                                City <span className="text-danger">*</span>
                                                                            </Form.Label>
                                                                            <FormControl
                                                                                type="text"
                                                                                name="delivery_city"
                                                                                value={checkOutFormData.delivery_city}
                                                                                onChange={handleChangePaymentInfo}
                                                                                id="city"
                                                                                required
                                                                            />
                                                                        </Col>
                                                                        <Col lg="6">
                                                                            <Form.Label htmlFor="postal_code" className='mb-2'>
                                                                                ZIP/Postal Code <span className="text-danger">*</span>
                                                                            </Form.Label>
                                                                            <FormControl
                                                                                type="text"
                                                                                name="delivery_postal_code"
                                                                                value={checkOutFormData.delivery_postal_code}
                                                                                onChange={handleChangePaymentInfo}
                                                                                id="postal_code"
                                                                                required
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </FormGroup>
                                                            </>
                                                            :
                                                            null
                                                        }

                                                    </>
                                                    :
                                                    null
                                                }
                                            </Card.Body>
                                        </Card>
                                        {checkOutFormData.ship_to && checkOutFormData.ship_to != "" && checkOutFormData.delivery_first_name && checkOutFormData.delivery_first_name != "" && checkOutFormData.delivery_email && checkOutFormData.delivery_email != "" && checkOutFormData.delivery_phone && checkOutFormData.delivery_phone != "" && checkOutFormData.delivery_address_line_1 && checkOutFormData.delivery_address_line_1 != "" && checkOutFormData.delivery_city && checkOutFormData.delivery_city != "" && checkOutFormData.delivery_province && checkOutFormData.delivery_province != "" && checkOutFormData.delivery_postal_code && checkOutFormData.delivery_postal_code != "" && checkOutFormData.delivery_country && checkOutFormData.delivery_country != "" && checkOutFormData.delivery_province_code && checkOutFormData.delivery_province_code != "" ?
                                            <>
                                                <Card>
                                                    <Card.Body>
                                                        <div className='fs-22 rufina-family fw-600'>Shipping Option</div>
                                                        <hr className='mt-2' />
                                                        <FormGroup>
                                                            <Row>
                                                                <Col lg="12">
                                                                    <label class="mb-2 form-label" for="shipping_option">Shipping Provider <span class="text-danger">*</span></label>
                                                                    <Form.Control as='select' name='shipping_option' value={checkOutFormData.shipping_option} className='' onChange={handleChangePaymentInfo} required>
                                                                        <option value=''>Select Shipping Option</option>
                                                                        <option value='UPS'>UPS</option>
                                                                        <option value='GIGM'>GIGM</option>
                                                                    </Form.Control>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                    </Card.Body>
                                                </Card>
                                            </>
                                            :
                                            null
                                        }
                                        {checkOutFormData.ship_to && checkOutFormData.ship_to != "" && checkOutFormData.delivery_first_name && checkOutFormData.delivery_first_name != "" && checkOutFormData.delivery_email && checkOutFormData.delivery_email != "" && checkOutFormData.delivery_phone && checkOutFormData.delivery_phone != "" && checkOutFormData.delivery_address_line_1 && checkOutFormData.delivery_address_line_1 != "" && checkOutFormData.delivery_city && checkOutFormData.delivery_city != "" && checkOutFormData.delivery_province && checkOutFormData.delivery_province != "" && checkOutFormData.delivery_postal_code && checkOutFormData.delivery_postal_code != "" && checkOutFormData.delivery_country && checkOutFormData.delivery_country != "" && checkOutFormData.delivery_province_code && checkOutFormData.delivery_province_code != "" && checkOutFormData.shipping_option && checkOutFormData.shipping_option != "" ?
                                            <>
                                                <Card>
                                                    <Card.Body>
                                                        <div className='fs-22 rufina-family fw-600'>Payment Info</div>
                                                        <hr className='mt-2' />
                                                        <div>Payment Method</div>
                                                        {/* <div className='mt-3 d-flex'>
                                                            <div className='d-flex'>
                                                                <input
                                                                    type="radio"
                                                                    name="payment_method"
                                                                    value="VISA"
                                                                    onChange={(e) => { setRadioButtonValue("VISA"); handleChangePaymentInfo(e); }}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className='ms-3'>
                                                                <FaCcVisa size={20} />
                                                            </div>

                                                            <div className='ms-2'>
                                                                VISA
                                                            </div>
                                                        </div> */}

                                                        <label className='mt-3 d-flex cursor-pointer'>
                                                            <div className='d-flex'>
                                                                <input
                                                                    type="radio"
                                                                    name="payment_method"
                                                                    value="Paypal"
                                                                    onChange={(e) => { setRadioButtonValue("Paypal"); handleChangePaymentInfo(e); }}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className='ms-3'>
                                                                <FaCcPaypal size={20} />
                                                            </div>

                                                            <div className='ms-2'>
                                                                Paypal
                                                            </div>
                                                        </label>

                                                        <label className='mt-3 d-flex cursor-pointer'>
                                                            <div className='d-flex'>
                                                                <input
                                                                    type="radio"
                                                                    name="payment_method"
                                                                    value="Stripe"
                                                                    onChange={(e) => { setRadioButtonValue("Stripe"); handleChangePaymentInfo(e); }}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className='ms-3'>
                                                                <FaCcStripe size={20} />
                                                            </div>

                                                            <div className='ms-2'>
                                                                Stripe
                                                            </div>
                                                        </label>

                                                        {/* <div className='mt-2 d-flex'>
                                                            <div className='d-flex'>
                                                                <input
                                                                    type="radio"
                                                                    name="payment_method"
                                                                    value="MasterCard"
                                                                    onChange={(e) => { setRadioButtonValue("MasterCard"); handleChangePaymentInfo(e); }}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className='ms-3'>
                                                                <FaCcMastercard size={20} />
                                                            </div>

                                                            <div className='ms-2'>
                                                                MasterCard
                                                            </div>
                                                        </div> */}
                                                        <label className='mt-2 d-flex cursor-pointer'>
                                                            <div className='d-flex'>
                                                                <input
                                                                    type="radio"
                                                                    name="payment_method"
                                                                    value="Cash on Delivery"
                                                                    onChange={(e) => { setRadioButtonValue("Cash on Delivery"); handleChangePaymentInfo(e); }}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className='ms-3'>
                                                                <FaTruck size={20} />
                                                            </div>

                                                            <div className='ms-2'>
                                                                Cash on Delivery
                                                            </div>
                                                        </label>

                                                        {radioButtonValue != "" && radioButtonValue != "Cash on Delivery" && radioButtonValue != "Paypal" && radioButtonValue != "Stripe" ?
                                                            <div>
                                                                <hr />
                                                                <div className='mb-4'>
                                                                    <div className='mb-2'>Card Name:</div>
                                                                    <input
                                                                        type="text"
                                                                        className='form-control'
                                                                        name="card_name"
                                                                        value={checkOutFormData.card_name}
                                                                        onChange={handleChangePaymentInfo}
                                                                    />
                                                                </div>
                                                                <hr />

                                                                <div>
                                                                    <div className='mb-2'>Card Number:</div>
                                                                    <input
                                                                        type="text"
                                                                        name="card_number"
                                                                        className='form-control mb-2'
                                                                        value={checkOutFormData.card_number}
                                                                        onChange={handleChangePaymentInfo}
                                                                        maxLength={15}
                                                                        pattern="[0-9]*"
                                                                    />
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <div className='mb-2'>Expiration Date:</div>
                                                                    <input
                                                                        type="date"
                                                                        className='form-control'
                                                                        name="date"
                                                                        value={checkOutFormData.date}
                                                                        onChange={handleChangePaymentInfo}
                                                                    />
                                                                </div>

                                                            </div>
                                                            :
                                                            null
                                                        }
                                                        <div className='mt-4'>
                                                            <Row>
                                                                <Col lg="12">
                                                                    {totalAmount < 1 ?
                                                                        <button type="button" className='btn btn-primary' disabled={true}>{formStatus != "standby" ? "Loading..." : "Check Out"}</button>
                                                                        :
                                                                        <>
                                                                            {radioButtonValue != "" ?
                                                                                <>
                                                                                    {radioButtonValue == "Paypal" ?
                                                                                        <>
                                                                                            {currentUser ?
                                                                                                <PayPalButtons
                                                                                                    fundingSource="paypal"
                                                                                                    createOrder={(data, actions) => {
                                                                                                        return actions.order.create({
                                                                                                            purchase_units: [{
                                                                                                                amount: {
                                                                                                                    value: totalAmount // Replace with the actual amount
                                                                                                                },
                                                                                                            }],
                                                                                                        });
                                                                                                    }}
                                                                                                    onApprove={(data, actions) => {
                                                                                                        return actions.order.capture().then((details) => {
                                                                                                            // alert("Transaction completed by " + details.payer.name.given_name);
                                                                                                            checkOutSubmitPaypal(details, data);
                                                                                                            // Call your backend API to save the transaction details
                                                                                                        });
                                                                                                    }}
                                                                                                />
                                                                                                :
                                                                                                <button type="button" onClick={toggleAuthModal} className='btn btn-primary'>{formStatus != "standby" ? "Loading..." : "Sign in to Check Out"}</button>
                                                                                            }
                                                                                        </>
                                                                                        : radioButtonValue == "Stripe" ?
                                                                                            <>
                                                                                                {currentUser ?
                                                                                                    <button type="button" className='btn btn-primary' onClick={() => checkOutSubmitStripe()}>{formStatus != "standby" ? "Loading..." : "Stripe"}</button>
                                                                                                    :
                                                                                                    <button type="button" onClick={toggleAuthModal} className='btn btn-primary'>{formStatus != "standby" ? "Loading..." : "Sign in to Check Out"}</button>
                                                                                                }
                                                                                            </>
                                                                                            :

                                                                                            <>
                                                                                                {currentUser ?
                                                                                                    <button type="submit" className='btn btn-primary'>{formStatus != "standby" ? "Loading..." : "Check Out"}</button>
                                                                                                    :
                                                                                                    <button type="button" onClick={toggleAuthModal} className='btn btn-primary'>{formStatus != "standby" ? "Loading..." : "Sign in to Check Out"}</button>
                                                                                                }
                                                                                            </>
                                                                                    }
                                                                                </>
                                                                                :
                                                                                null
                                                                            }

                                                                        </>

                                                                    }
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </>
                                            :
                                            null
                                        }
                                    </Form>
                                </Col>
                            </Row>
                        </Container>
                    </section>
                </>
            }

            {/* Login */}
            <Modal show={authModalShow} fullscreen={false} onHide={() => setAuthModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className="h-100">
                        <Row className="h-100">
                            <Col lg="12">
                                {/* <Login onLogin={handleLogin} /> */}
                                {showModal === 1 ? <SignUp onSignup={handleLogin} showLogin={(e) => showLogin(e)} /> : <Login showSignup={(e) => showSignup(e)} onLogin={handleLogin} onCloseModal={(e) => setAuthModalShow(e)} />}
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </LayoutNoFooter >
    );
};

export default Cart;