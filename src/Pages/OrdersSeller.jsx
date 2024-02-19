import React, { useEffect, useState } from 'react';
import LayoutSellerCenter from '../Components/Layout/LayoutSellerCenter';
import PlaceholderImage from '../Assets/images/placeholders/image.png';
import Container from 'react-bootstrap/Container';
import User from '../Assets/images/user.png';
import InputEmoji from 'react-input-emoji';
import '../Assets/styles/Order/style.css';
import Sidebar from 'Components/Shared/Sidebar';
import { GoAlertFill, GoShareAndroid } from 'react-icons/go';
import { Row, Col, Button, Modal, Card } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { VscSend } from "react-icons/vsc";
import { IoIosAttach } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { AiFillMessage } from "react-icons/ai";
import { CiSearch } from 'react-icons/ci';
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import toast from 'react-hot-toast';
import axios from "axios";
import { useNavigate, useParams, Link } from 'react-router-dom';

const ToastCss = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

const OrdersSeller = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'token', 'userDetails', 'userRole']);
    const { designerId } = useParams();
    const siteCookies = cookies[0];
    const currentUser = cookies.currentUser;
    const token = cookies.token;
    const [reloadCount, setReloadCount] = useState(0);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [inputClicked, setInputClicked] = useState(false);

    const [currentTab, setCurrentTab] = useState('all');
    const [orders, setOrders] = useState('');
    const [chatBox, setChatBox] = useState(false);
    const [fabrics, setFabrics] = useState('');
    const [designerData, setDesignerData] = useState('');
    const [text, setText] = useState('');
    const [query, setQuery] = useState('');

    const [dateTo, setDateTo] = useState('');
    const [dateFrom, setDateFrom] = useState('');


    const getAllOrders = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + '/#');
    };

    const getFabrics = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'product?user_id=' + token);
    };

    const chatBoxModal = (first_name, last_name, image) => {
        setChatBox(true);

        setDesignerData({
            first_name: first_name || '-',
            last_name: last_name || '-',
            image: image || '-'
        })
    };

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    function handleOnEnter(text) {
        console.log('enter', text)
    }

    useEffect(() => {
        document.body.classList.add('designer-calendar-body');
    }, []);

    useEffect(() => {
        if (inputClicked) {
            fetchProducts();
        }
    }, [query, inputClicked]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_ENDPOINT + 'product?user_id=' + currentUser, {
                params: {
                    search: query
                }
            });

            setFabrics(response.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };


    useEffect(() => {
        getFabrics()
            .then((response) => {
                const selectedFabrics = response.data.data;
                if (selectedFabrics) {
                    setFabrics(selectedFabrics);
                } else {
                    toast.error('There has been an error getting the products, please try again!');
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the products, please try again!');
            });

    }, [reloadCount]);

    return (
        <LayoutSellerCenter>
            <section>
                <Container fluid>
                    <Row className='bg-product'>
                        <Col lg={2} className='p-0'>
                            <Sidebar currentTab={currentTab} onChangeTab={(e) => setCurrentTab(e)} />
                        </Col>

                        <Col lg={10} className='top-padding mx-auto' style={{maxWidth: '1440px'}}>
                            <div className='ms-4'>
                                <Row>
                                    <Col lg={12}>
                                        <Row className="pb-4">
                                            <Col md={12} className='d-flex justify-content-left align-items-center'>
                                                <h3 className="fs-30 fw-600 text-black mb-0">All Orders</h3>
                                            </Col>
                                        </Row>

                                        <Row className="mb-4">
                                            <Col lg='8'>
                                                <div className='w-100 d-flex'>
                                                    <div className='d-flex justify-content-center align-items-center'>
                                                        <div className='appointment-date fs-16 text-nowrap me-2 text-black'>Date Created</div>
                                                    </div>

                                                    <div className='w-100 d-flex'>
                                                        <input
                                                            type="date"
                                                            className='form-control w-25 color-date'
                                                            value={dateTo}
                                                            onChange={(e) => { setDateTo(e.target.value); console.log('To value ', e.target.value) }}
                                                        />
                                                        &nbsp;
                                                        <div className='d-flex justify-content-center align-items-center'>-</div>
                                                        &nbsp;
                                                        <input
                                                            type="date"
                                                            className='form-control w-25 color-date'
                                                            value={dateFrom}
                                                            onChange={(e) => { setDateFrom(e.target.value); console.log('To value ', e.target.value) }}
                                                        />
                                                    </div>

                                                </div>
                                            </Col>

                                            <Col lg='4'>
                                                <div
                                                    className='d-flex align-items-end w-100 justify-content-end position-relative'>
                                                    <input
                                                        className='search-bar'
                                                        type="text"
                                                        placeholder="Search"
                                                        value={query}
                                                        onChange={(e) => { setQuery(e.target.value); setInputClicked(true); }}
                                                    />
                                                    <CiSearch size="20px" className='search-style' />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col lg={12}>
                                        <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${currentTab == "all" ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { setCurrentTab("all"); }}>All</span>
                                        <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${currentTab == "active" ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { setCurrentTab("active"); }}>Active</span>
                                        <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${currentTab == "processing" ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { setCurrentTab("processing"); }}>Processing</span>
                                        <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${currentTab == "shipped" ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { setCurrentTab("shipped"); }}>Shipped</span>
                                        <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${currentTab == "delivered" ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { setCurrentTab("delivered"); }}>Delivered</span>
                                        <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${currentTab == "review" ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { setCurrentTab("review"); }}>Review and Feedback</span>
                                        <hr />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col lg={12}>
                                        <Card>
                                            <Card.Body className='bg-light'>
                                                <Row>
                                                    <Col lg={2}>
                                                        <span className='fw-500 text-black'>Date Created</span>
                                                    </Col>

                                                    <Col lg={3}>
                                                        <span className='fw-500 text-black'>Item Title</span>
                                                    </Col>

                                                    <Col lg={2}>
                                                        <span className='fw-500 text-black'>Order Date</span>
                                                    </Col>

                                                    <Col lg={1}>
                                                        <span className='fw-500 text-black'>Total</span>
                                                    </Col>

                                                    <Col lg={2}>
                                                        <span className='fw-500 text-black'>Status <MdKeyboardArrowDown /></span>
                                                    </Col>

                                                    <Col lg={2} className='text-center'>
                                                        <span className='fw-500 text-black'>Action</span>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>


                                {currentTab == 'all' ?
                                    <>
                                        {fabrics ?
                                            <>
                                                {fabrics.length > 0 ?
                                                    <>
                                                        {fabrics.map((fabric) => {

                                                            if (fabric.image_urls?.[0]?.image_url) {
                                                                var fabricImage = process.env.REACT_APP_STORAGE_URL + 'product/' + fabric.image_urls[0].image_url;
                                                            } else {
                                                                var fabricImage = PlaceholderImage;
                                                            }

                                                            const options = {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            };
                                                            const today = (new Date(fabric.created_at)).toLocaleDateString('en-ES', options);

                                                            return (

                                                                <Row>
                                                                    <Col lg={12}>
                                                                        <Card className='mt-2 border-card'>
                                                                            <Card.Header className='order-chat d-flex justify-content-between'>
                                                                                <div>
                                                                                    <div className='d-flex align-items-center user-image-order'>
                                                                                        {fabric.user.image && (
                                                                                            <div
                                                                                                className='user-photo-order me-2'
                                                                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${fabric.user.image})` }}
                                                                                            >
                                                                                            </div>
                                                                                        )}

                                                                                        <div className='name-of-designer'> {fabric.user.first_name}  {fabric.user.last_name}</div>
                                                                                        <AiFillMessage className='ms-2 text-gold cursor-pointer'
                                                                                            onClick={function () { chatBoxModal(fabric.user.first_name, fabric.user.last_name, fabric.user.image) }}
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                <div className='order-id'>
                                                                                    Order ID: 11002345CT
                                                                                </div>
                                                                            </Card.Header>
                                                                            <Card.Body className='bg-white card-body-border'>
                                                                                <Row>
                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>{today}</span>
                                                                                    </Col>

                                                                                    <Col lg={3} className='d-flex'>

                                                                                        <div className="designs-grid-div fabric-image cursor-pointer"
                                                                                            style={{ backgroundImage: "url(" + fabricImage + ")", minHeight: '55px' }}>
                                                                                        </div>

                                                                                        <span className='d-flex text-black ms-2'>
                                                                                            {fabric.name}
                                                                                        </span>
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>December 25, 2023</span>
                                                                                    </Col>

                                                                                    <Col lg={1}>
                                                                                        <span className='text-black'>${fabric.price}</span>
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>{fabric.status}</span>
                                                                                    </Col>

                                                                                    <Col lg={2} className='text-center'>
                                                                                        <a href={`/order-details/${fabric.user.id}`} className="cursor-pointer check-datails-decoration" >
                                                                                            <span className='text-gold'><IoEyeOutline className='me-2' size={20} />Check Details</span>
                                                                                        </a>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    </Col>
                                                                </Row>
                                                            );
                                                        })}

                                                    </>
                                                    :
                                                    <>
                                                        <div className='text-center fs-18 mt-5'>
                                                            No product found.
                                                        </div>
                                                    </>
                                                }
                                            </>
                                            :
                                            <>

                                            </>
                                        }
                                    </>
                                    :
                                    null
                                }

                                {currentTab == 'active' ?
                                    <>
                                        {fabrics ?
                                            <>
                                                {fabrics.length > 0 ?
                                                    <>
                                                        {fabrics.map((fabric) => {

                                                            if (fabric.image_urls?.[0]?.image_url) {
                                                                var fabricImage = process.env.REACT_APP_STORAGE_URL + 'product/' + fabric.image_urls[0].image_url;
                                                            } else {
                                                                var fabricImage = PlaceholderImage;
                                                            }

                                                            const options = {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            };
                                                            const today = (new Date(fabric.created_at)).toLocaleDateString('en-ES', options);
                                                            const formattedDate = (new Date(fabric.consultation_date_time)).toLocaleString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: 'numeric',
                                                                minute: 'numeric',
                                                                timeZone: 'UTC',
                                                            });

                                                            return (

                                                                <Row>
                                                                    <Col lg={12}>
                                                                        <Card className='mt-2 border-card'>
                                                                            <Card.Header className='order-chat d-flex justify-content-between'>
                                                                                <div>
                                                                                    <div className='d-flex align-items-center user-image-order'>
                                                                                        {fabric.user.image && (
                                                                                            <div
                                                                                                className='user-photo-order me-2'
                                                                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${fabric.user.image})` }}
                                                                                            >
                                                                                            </div>
                                                                                        )}


                                                                                        <div className='name-of-designer'> {fabric.user.first_name}  {fabric.user.last_name}</div>
                                                                                        <AiFillMessage className='ms-2 text-gold cursor-pointer'
                                                                                            onClick={function () { chatBoxModal(fabric.user.first_name, fabric.user.last_name, fabric.user.image) }}
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                <div className='order-id'>
                                                                                    Order ID: 11002345CT
                                                                                </div>
                                                                            </Card.Header>
                                                                            <Card.Body className='bg-white card-body-border'>
                                                                                <Row>
                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>{today}</span>
                                                                                    </Col>

                                                                                    <Col lg={3} className='d-flex'>

                                                                                        <div className="designs-grid-div fabric-image cursor-pointer"
                                                                                            style={{ backgroundImage: "url(" + fabricImage + ")", minHeight: '55px' }}>
                                                                                        </div>

                                                                                        <span className='d-flex text-black ms-2'>
                                                                                            {fabric.name}
                                                                                        </span>
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>December 25, 2023</span>
                                                                                    </Col>

                                                                                    <Col lg={1}>
                                                                                        <span className='text-black'>${fabric.price}</span>
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>{fabric.status}</span>
                                                                                    </Col>

                                                                                    <Col lg={2} className='text-center'>
                                                                                        <a href={`/order-details/${fabric.user.id}`} className="cursor-pointer check-datails-decoration" >
                                                                                            <span className='text-gold'><IoEyeOutline className='me-2' size={20} />Check Details</span>
                                                                                        </a>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    </Col>
                                                                </Row>
                                                            );
                                                        })}

                                                    </>
                                                    :
                                                    <>
                                                        <div className='text-center fs-18 mt-5'>
                                                            No product found.
                                                        </div>
                                                    </>
                                                }
                                            </>
                                            :
                                            <>

                                            </>
                                        }
                                    </>
                                    :
                                    null
                                }

                                {currentTab == 'processing' ?
                                    <>
                                        {fabrics ?
                                            <>
                                                {fabrics.length > 0 ?
                                                    <>
                                                        {fabrics.map((fabric) => {

                                                            if (fabric.image_urls?.[0]?.image_url) {
                                                                var fabricImage = process.env.REACT_APP_STORAGE_URL + 'product/' + fabric.image_urls[0].image_url;
                                                            } else {
                                                                var fabricImage = PlaceholderImage;
                                                            }

                                                            const options = {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            };
                                                            const today = (new Date(fabric.created_at)).toLocaleDateString('en-ES', options);
                                                            const formattedDate = (new Date(fabric.consultation_date_time)).toLocaleString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: 'numeric',
                                                                minute: 'numeric',
                                                                timeZone: 'UTC',
                                                            });

                                                            return (

                                                                <Row>
                                                                    <Col lg={12}>
                                                                        <Card className='mt-2 border-card'>
                                                                            <Card.Header className='order-chat d-flex justify-content-between'>
                                                                                <div>
                                                                                    <div className='d-flex align-items-center user-image-order'>
                                                                                        {fabric.user.image && (
                                                                                            <div
                                                                                                className='user-photo-order me-2'
                                                                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${fabric.user.image})` }}
                                                                                            >
                                                                                            </div>
                                                                                        )}


                                                                                        <div className='name-of-designer'> {fabric.user.first_name}  {fabric.user.last_name}</div>
                                                                                        <AiFillMessage className='ms-2 text-gold cursor-pointer'
                                                                                            onClick={function () { chatBoxModal(fabric.user.first_name, fabric.user.last_name, fabric.user.image) }}
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                <div className='order-id'>
                                                                                    Order ID: 11002345CT
                                                                                </div>
                                                                            </Card.Header>
                                                                            <Card.Body className='bg-white card-body-border'>
                                                                                <Row>
                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>{today}</span>
                                                                                    </Col>

                                                                                    <Col lg={3} className='d-flex'>

                                                                                        <div className="designs-grid-div fabric-image cursor-pointer"
                                                                                            style={{ backgroundImage: "url(" + fabricImage + ")", minHeight: '55px' }}>
                                                                                        </div>

                                                                                        <span className='d-flex text-black ms-2'>
                                                                                            {fabric.name}
                                                                                        </span>
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>December 25, 2023</span>
                                                                                    </Col>

                                                                                    <Col lg={1}>
                                                                                        <span className='text-black'>${fabric.price}</span>
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>{fabric.status}</span>
                                                                                    </Col>

                                                                                    <Col lg={2} className='text-center'>
                                                                                        <a href={`/order-details/${fabric.user.id}`} className="cursor-pointer check-datails-decoration" >
                                                                                            <span className='text-gold'><IoEyeOutline className='me-2' size={20} />Check Details</span>
                                                                                        </a>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    </Col>
                                                                </Row>
                                                            );
                                                        })}

                                                    </>
                                                    :
                                                    <>
                                                        <div className='text-center fs-18 mt-5'>
                                                            No product found.
                                                        </div>
                                                    </>
                                                }
                                            </>
                                            :
                                            <>

                                            </>
                                        }
                                    </>
                                    :
                                    null
                                }

                                {currentTab == 'shipped' ?
                                    <>
                                        {fabrics ?
                                            <>
                                                {fabrics.length > 0 ?
                                                    <>
                                                        {fabrics.map((fabric) => {

                                                            if (fabric.image_urls?.[0]?.image_url) {
                                                                var fabricImage = process.env.REACT_APP_STORAGE_URL + 'product/' + fabric.image_urls[0].image_url;
                                                            } else {
                                                                var fabricImage = PlaceholderImage;
                                                            }

                                                            const options = {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            };
                                                            const today = (new Date(fabric.created_at)).toLocaleDateString('en-ES', options);
                                                            const formattedDate = (new Date(fabric.consultation_date_time)).toLocaleString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: 'numeric',
                                                                minute: 'numeric',
                                                                timeZone: 'UTC',
                                                            });

                                                            return (

                                                                <Row>
                                                                    <Col lg={12}>
                                                                        <Card className='mt-2 border-card'>
                                                                            <Card.Header className='order-chat d-flex justify-content-between'>
                                                                                <div>
                                                                                    <div className='d-flex align-items-center user-image-order'>
                                                                                        {fabric.user.image && (
                                                                                            <div
                                                                                                className='user-photo-order me-2'
                                                                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${fabric.user.image})` }}
                                                                                            >
                                                                                            </div>
                                                                                        )}


                                                                                        <div className='name-of-designer'> {fabric.user.first_name}  {fabric.user.last_name}</div>
                                                                                        <AiFillMessage className='ms-2 text-gold cursor-pointer'
                                                                                            onClick={function () { chatBoxModal(fabric.user.first_name, fabric.user.last_name, fabric.user.image) }}
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                <div className='order-id'>
                                                                                    Order ID: 11002345CT
                                                                                </div>
                                                                            </Card.Header>
                                                                            <Card.Body className='bg-white card-body-border'>
                                                                                <Row>
                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>{today}</span>
                                                                                    </Col>

                                                                                    <Col lg={3} className='d-flex'>

                                                                                        <div className="designs-grid-div fabric-image cursor-pointer"
                                                                                            style={{ backgroundImage: "url(" + fabricImage + ")", minHeight: '55px' }}>
                                                                                        </div>

                                                                                        <span className='d-flex text-black ms-2'>
                                                                                            {fabric.name}
                                                                                        </span>
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>December 25, 2023</span>
                                                                                    </Col>

                                                                                    <Col lg={1}>
                                                                                        <span className='text-black'>${fabric.price}</span>
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>{fabric.status}</span>
                                                                                    </Col>

                                                                                    <Col lg={2} className='text-center'>
                                                                                        <a href={`/order-details/${fabric.user.id}`} className="cursor-pointer check-datails-decoration" >
                                                                                            <span className='text-gold'><IoEyeOutline className='me-2' size={20} />Check Details</span>
                                                                                        </a>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    </Col>
                                                                </Row>
                                                            );
                                                        })}

                                                    </>
                                                    :
                                                    <>
                                                        <div className='text-center fs-18 mt-5'>
                                                            No product found.
                                                        </div>
                                                    </>
                                                }
                                            </>
                                            :
                                            <>

                                            </>
                                        }
                                    </>
                                    :
                                    null
                                }

                                {currentTab == 'delivered' ?
                                    <>
                                        {fabrics ?
                                            <>
                                                {fabrics.length > 0 ?
                                                    <>
                                                        {fabrics.map((fabric) => {

                                                            if (fabric.image_urls?.[0]?.image_url) {
                                                                var fabricImage = process.env.REACT_APP_STORAGE_URL + 'product/' + fabric.image_urls[0].image_url;
                                                            } else {
                                                                var fabricImage = PlaceholderImage;
                                                            }

                                                            const options = {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            };
                                                            const today = (new Date(fabric.created_at)).toLocaleDateString('en-ES', options);
                                                            const formattedDate = (new Date(fabric.consultation_date_time)).toLocaleString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: 'numeric',
                                                                minute: 'numeric',
                                                                timeZone: 'UTC',
                                                            });

                                                            return (

                                                                <Row>
                                                                    <Col lg={12}>
                                                                        <Card className='mt-2 border-card'>
                                                                            <Card.Header className='order-chat d-flex justify-content-between'>
                                                                                <div>
                                                                                    <div className='d-flex align-items-center user-image-order'>
                                                                                        {fabric.user.image && (
                                                                                            <div
                                                                                                className='user-photo-order me-2'
                                                                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${fabric.user.image})` }}
                                                                                            >
                                                                                            </div>
                                                                                        )}


                                                                                        <div className='name-of-designer'> {fabric.user.first_name}  {fabric.user.last_name}</div>
                                                                                        <AiFillMessage className='ms-2 text-gold cursor-pointer'
                                                                                            onClick={function () { chatBoxModal(fabric.user.first_name, fabric.user.last_name, fabric.user.image) }}
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                <div className='order-id'>
                                                                                    Order ID: 11002345CT
                                                                                </div>
                                                                            </Card.Header>
                                                                            <Card.Body className='bg-white card-body-border'>
                                                                                <Row>
                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>{today}</span>
                                                                                    </Col>

                                                                                    <Col lg={3} className='d-flex'>

                                                                                        <div className="designs-grid-div fabric-image cursor-pointer"
                                                                                            style={{ backgroundImage: "url(" + fabricImage + ")", minHeight: '55px' }}>
                                                                                        </div>

                                                                                        <span className='d-flex text-black ms-2'>
                                                                                            {fabric.name}
                                                                                        </span>
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>December 25, 2023</span>
                                                                                    </Col>

                                                                                    <Col lg={1}>
                                                                                        <span className='text-black'>${fabric.price}</span>
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>{fabric.status}</span>
                                                                                    </Col>

                                                                                    <Col lg={2} className='text-center'>
                                                                                        <a href={`/order-details/${fabric.user.id}`} className="cursor-pointer check-datails-decoration" >
                                                                                            <span className='text-gold'><IoEyeOutline className='me-2' size={20} />Check Details</span>
                                                                                        </a>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    </Col>
                                                                </Row>
                                                            );
                                                        })}

                                                    </>
                                                    :
                                                    <>
                                                        <div className='text-center fs-18 mt-5'>
                                                            No product found.
                                                        </div>
                                                    </>
                                                }
                                            </>
                                            :
                                            <>

                                            </>
                                        }
                                    </>
                                    :
                                    null
                                }

                                {currentTab == 'review' ?
                                    <>
                                        {fabrics ?
                                            <>
                                                {fabrics.length > 0 ?
                                                    <>
                                                        {fabrics.map((fabric) => {

                                                            if (fabric.image_urls?.[0]?.image_url) {
                                                                var fabricImage = process.env.REACT_APP_STORAGE_URL + 'product/' + fabric.image_urls[0].image_url;
                                                            } else {
                                                                var fabricImage = PlaceholderImage;
                                                            }

                                                            const options = {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            };
                                                            const today = (new Date(fabric.created_at)).toLocaleDateString('en-ES', options);
                                                            const formattedDate = (new Date(fabric.consultation_date_time)).toLocaleString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: 'numeric',
                                                                minute: 'numeric',
                                                                timeZone: 'UTC',
                                                            });

                                                            return (

                                                                <Row>
                                                                    <Col lg={12}>
                                                                        <Card className='mt-2 border-card'>
                                                                            <Card.Header className='order-chat d-flex justify-content-between'>
                                                                                <div>
                                                                                    <div className='d-flex align-items-center user-image-order'>
                                                                                        {fabric.user.image && (
                                                                                            <div
                                                                                                className='user-photo-order me-2'
                                                                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${fabric.user.image})` }}
                                                                                            >
                                                                                            </div>
                                                                                        )}


                                                                                        <div className='name-of-designer'> {fabric.user.first_name}  {fabric.user.last_name}</div>
                                                                                        <AiFillMessage className='ms-2 text-gold cursor-pointer'
                                                                                            onClick={function () { chatBoxModal(fabric.user.first_name, fabric.user.last_name, fabric.user.image) }}
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                <div className='order-id'>
                                                                                    Order ID: 11002345CT
                                                                                </div>
                                                                            </Card.Header>
                                                                            <Card.Body className='bg-white card-body-border'>
                                                                                <Row>
                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>{today}</span>
                                                                                    </Col>

                                                                                    <Col lg={3} className='d-flex'>

                                                                                        <div className="designs-grid-div fabric-image cursor-pointer"
                                                                                            style={{ backgroundImage: "url(" + fabricImage + ")", minHeight: '55px' }}>
                                                                                        </div>

                                                                                        <span className='d-flex text-black ms-2'>
                                                                                            {fabric.name}
                                                                                        </span>
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>December 25, 2023</span>
                                                                                    </Col>

                                                                                    <Col lg={1}>
                                                                                        <span className='text-black'>${fabric.price}</span>
                                                                                    </Col>

                                                                                    <Col lg={2}>
                                                                                        <span className='text-black'>{fabric.status}</span>
                                                                                    </Col>

                                                                                    <Col lg={2} className='text-center'>
                                                                                        <a href={`/product/${fabric.id}`} className="cursor-pointer check-datails-decoration" >
                                                                                            <span className='text-gold'><IoEyeOutline className='me-2' size={20} />Check Review</span>
                                                                                        </a>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    </Col>
                                                                </Row>
                                                            );
                                                        })}

                                                    </>
                                                    :
                                                    <>
                                                        <div className='text-center fs-18 mt-5'>
                                                            No product found.
                                                        </div>
                                                    </>
                                                }
                                            </>
                                            :
                                            <>
                                            </>
                                        }
                                    </>
                                    :
                                    null
                                }

                                {chatBox ?
                                    <>
                                        <Card className='width-chat-card px-0'>
                                            <Card.Header className='order-chat bg-white pt-3 pb-3'>
                                                <div className='d-flex justify-content-between'>
                                                    <div>
                                                        <span className="fs-14 fw-500 mb-0 name-of-user-chat">
                                                            <span className='fw-500'>{designerData.first_name} {designerData.last_name}</span>
                                                        </span>
                                                        <span className='ms-3 active-now fs-14 fw-400'>Active Now</span>
                                                    </div>
                                                    <div className="cursor-pointer" onClick={() => setChatBox(false)}>
                                                        <IoCloseOutline color="#39393A" />
                                                    </div>
                                                </div>
                                            </Card.Header>

                                            <Card.Body >
                                                <div>
                                                    <span className='d-flex user-image'>
                                                        {designerData.image && (
                                                            <div
                                                                className='user-photo'
                                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${designerData.image})` }}
                                                            >
                                                            </div>
                                                        )}

                                                        <div className="designer-info mx-2">

                                                            <div>
                                                                <p className="fs-14 fw-600 mb-0 name-of-user-chat ms-2">
                                                                    <span className=''>{designerData.first_name}{designerData.last_name}</span>
                                                                    <span className='ms-3 fs-14 time-chat fw-400'>2:23 PM</span>
                                                                </p>
                                                            </div>

                                                            <div className='fs-14 ms-2 mt-2 name-of-user-chat'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam.</div>
                                                        </div>
                                                    </span>
                                                </div>

                                                <div className='mt-5 mb-4 text-right d-flex'>
                                                    <div>
                                                        <div className='time-chat-box fs-14 fw-400'>3:30 PM
                                                            <span className='ms-2 you-chat-box fw-600 fs-14'>You</span></div>
                                                        <div className='mt-2 welcome-chat'>
                                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                                                        </div>
                                                    </div>
                                                    <img src={User} className='placeholder-chat ms-3' />
                                                </div>

                                                <div>
                                                    <InputEmoji
                                                        value={text}
                                                        onChange={setText}
                                                        cleanOnEnter
                                                        onEnter={handleOnEnter}
                                                        placeholder="Type a message"
                                                        className="emoji-picker"
                                                    />
                                                    <div className='cursor-pointer position-absolute attach-icon' onClick={() => toggleUnderConstruction("")}><IoIosAttach size={20} /></div>
                                                    <div>
                                                        <div
                                                            className="cursor-pointer fw-500 position-absolute send-button"
                                                            onClick={() => toggleUnderConstruction("Send Message")}
                                                        >
                                                            Send
                                                            <VscSend className='ms-1' />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </>
                                    :
                                    null
                                }
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section >

            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button type='button' className='close react-modal-close' onClick={() => setUnderConstructionShow(false)} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='fs-25 fw-600 mb-3'>{modalHeading}</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        </LayoutSellerCenter >
    );
};

export default OrdersSeller;