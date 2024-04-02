import React, { useEffect, useState } from 'react';
import LayoutSellerCenter from 'Components/Layout/LayoutSellerCenter';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import Container from 'react-bootstrap/Container';
import User from 'Assets/images/user.png';
import InputEmoji from 'react-input-emoji';
import 'Assets/styles/Order/style.css';
import Sidebar from 'Components/Shared/Sidebar';
import { GoAlertFill, GoShareAndroid } from 'react-icons/go';
import { Row, Col, Button, Modal, Card } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { VscSend } from "react-icons/vsc";
import GoBack from '../../Components/Shared/GoBack';
import { IoIosAttach } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { AiFillMessage } from "react-icons/ai";
import { CiSearch } from 'react-icons/ci';
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import Pagination from 'Components/Pagination/Pagination';
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

const Orders = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'token', 'userDetails', 'userRole']);
    const { designerId } = useParams();
    const siteCookies = cookies[0];
    const currentUser = cookies.currentUser;
    const token = cookies.token;
    const [reloadCount, setReloadCount] = useState(0);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [inputClicked, setInputClicked] = useState(false);

    const [currentTab, setCurrentTab] = useState('All');
    const [orders, setOrders] = useState('');
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [orderStatus, setOrderStatus] = useState('All');
    const [chatBox, setChatBox] = useState(false);
    const [fabrics, setFabrics] = useState('');
    const [designerData, setDesignerData] = useState('');
    const [text, setText] = useState('');
    const [query, setQuery] = useState('');
    const [underConstruction, setUnderConstruction] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(1);

    const [dateTo, setDateTo] = useState('');
    const [dateFrom, setDateFrom] = useState('');

    const getOrders = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '/seller/order?page='+currentPage+'&status=' + currentTab);
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

    const handleChangePage = (pageNumber) => {
        setOrdersLoading(true);
        setCurrentPage(pageNumber);
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '/seller/order?status=' + currentTab+'&user_id=' + currentUser +'&page='+pageNumber)
            .then((response) => {
                const data = response.data;
                const selectedOrders = response.data.data;
                if (selectedOrders) {
                    setOrders(selectedOrders);
                    setCurrentPage(() => data.pagination.current_page);
                    setPageCount(() => data.pagination.total);
                    setPageSize(() => data.pagination.per_page);
                    setOrdersLoading(false);
                } else {
                    setOrdersLoading(false);
                    toast.error('There has been an error getting the orders, please try again!');
                }
            }).catch(error => {
                setOrdersLoading(false);
                toast.error('There has been an error getting the orders, please try again!');
            });
    };

    useEffect(() => {
        setOrdersLoading(true);
        getOrders()
            .then((response) => {
                const selectedOrders = response.data.data;
                const data = response.data;
                if (selectedOrders) {
                    setOrders(selectedOrders);
                    setCurrentPage(() => data.pagination.current_page);
                    setPageCount(() => data.pagination.total);
                    setPageSize(() => data.pagination.per_page);
                    setOrdersLoading(false);
                } else {
                    toast.error('There has been an error getting the orders');
                    setOrdersLoading(false);
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the orders');
                setOrdersLoading(false);
            });
    }, [reloadCount, currentTab]);

    return (
        <LayoutSellerCenter>
            <section>
                <Container fluid>
                    <Row className='bg-product'>
                        <Col lg={2} className='p-0'>
                            <Sidebar currentTab={currentTab} onChangeTab={(e) => setCurrentTab(e)} />
                        </Col>

                        <Col lg={10} className='py-5 mx-auto padding-right-admin max-width-column'>
                            <div>
                                <Row>
                                    <Col lg={12}>
                                        <Row className="pb-4">
                                            <Col lg={11}>
                                            </Col>

                                            <Col lg={1} className='text-right'>
                                                <GoBack fallBack="/" />
                                            </Col>

                                            <Col lg={12} className='d-flex justify-content-left align-items-center'>
                                                <h3 className="fs-30 fw-600 text-black mb-0">Orders</h3>
                                            </Col>
                                        </Row>
                                        <Row className="mb-4 d-none">
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
                                        <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${currentTab == "All" ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { setCurrentTab("All"); }}>All</span>
                                        <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${currentTab == "Pending" ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { setCurrentTab("Pending"); }}>Pending</span>
                                        <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${currentTab == "Processing" ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { setCurrentTab("Processing"); }}>Processing</span>
                                        <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${currentTab == "Shipped" ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { setCurrentTab("Shipped"); }}>Shipped</span>
                                        <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${currentTab == "Delivered" ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { setCurrentTab("Delivered"); }}>Delivered</span>
                                        {/* <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${currentTab == "Review" ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { setCurrentTab("Review"); }}>Review and Feedback</span> */}
                                        <hr />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col lg={12}>
                                        <Card>
                                            <Card.Body className='bg-light'>
                                                <Row>
                                                    <Col>
                                                        <span className='fw-500 text-black'>Date</span>
                                                    </Col>

                                                    <Col className="text-right">
                                                        <span className='fw-500 text-black'># of Items</span>
                                                    </Col>

                                                    <Col className="text-right">
                                                        <span className='fw-500 text-black'>Total Amount</span>
                                                    </Col>

                                                    <Col className="text-left">
                                                        <span className='fw-500 text-black'>Payment Status</span>
                                                    </Col>

                                                    <Col className="text-left">
                                                        <span className='fw-500 text-black'>Order Status</span>
                                                    </Col>

                                                    <Col className="text-right">
                                                        <span className='fw-500 text-black'></span>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                {underConstruction ?
                                    <>
                                        <Card className='mt-3'>
                                            <Card.Body className="text-center py-5">
                                                <GoAlertFill size="60px" color="#000" className="mb-2" />
                                                <p className="fs-20 text-black">Under Construction</p>
                                                {/* <DatePicker onSelectedDate={handleDateChange} date={questionnaire1Data.target_date} /> */}
                                            </Card.Body>
                                        </Card>
                                    </>
                                    :
                                    <>
                                        {ordersLoading ?
                                            <>
                                                <Card className="mt-3">
                                                    <Card.Body>
                                                        <p className="mb-0 text-center">Loading...</p>
                                                    </Card.Body>
                                                </Card>
                                            </>
                                            :
                                            <>
                                                {orders ?
                                                    <>
                                                        {orders.length > 0 ?
                                                            <>
                                                                {orders.map((order) => {
                                                                    var order_items = order.order_items;
                                                                    var order_product = order_items[0].product;
                                                                    if (order_product.image_urls) {
                                                                        var image_urls = JSON.parse(order_product.image_urls);
                                                                        var cartItemImage = process.env.REACT_APP_STORAGE_URL + 'product/' + image_urls[0].image_url;
                                                                    } else {
                                                                        var cartItemImage = PlaceholderImage;
                                                                    }

                                                                    const options = {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric',
                                                                    };
                                                                    const created_at = (new Date(order.created_at)).toLocaleDateString('en-ES', options);

                                                                    // Use map() to extract quantities from each item
                                                                    var quantities = order_items.map(function (item) {
                                                                        return parseInt(item.quantity);
                                                                    });

                                                                    // Use reduce() to calculate the sum of quantities
                                                                    var number_of_items = quantities.reduce(function (total, quantity) {
                                                                        return total + quantity;
                                                                    }, 0);


                                                                    return (
                                                                        <Row className='mb-2'>
                                                                            <Col lg={12}>
                                                                                <Card className='mt-2 border-card'>
                                                                                    <Card.Header className='order-chat d-flex justify-content-between'>
                                                                                        <div>
                                                                                            <a href={`/user/center/order/${order.id}/details`} className="cursor-pointer text-decoration-none" >
                                                                                                <strong>Order #{order.id}</strong>
                                                                                            </a>
                                                                                        </div>
                                                                                    </Card.Header>
                                                                                    <Card.Body className='bg-white card-body-border'>
                                                                                        <Row>
                                                                                            <Col>
                                                                                                <span className='text-black'>{created_at}</span>
                                                                                            </Col>

                                                                                            <Col className="text-right">
                                                                                                <span className='text-black'>{number_of_items}</span>
                                                                                            </Col>

                                                                                            <Col className="text-right">
                                                                                                <span className='text-black'>${order.total_amount}</span>
                                                                                            </Col>

                                                                                            <Col className="text-left">
                                                                                                <span className='text-black'>{order.payment_status ?? "Pending"}</span>
                                                                                            </Col>

                                                                                            <Col className="text-left">
                                                                                                <span className='text-black'>{order.status ?? "Pending"}</span>
                                                                                            </Col>

                                                                                            <Col className='text-right'>
                                                                                                <a href={`/user/center/order/${order.id}/details`} className="cursor-pointer check-datails-decoration" >
                                                                                                    <span className='text-gold'><IoEyeOutline className='me-2' size={20} />View Details</span>
                                                                                                </a>
                                                                                                {/* {reorderLoading ?
                                                                                                    <button type="button" className='btn btn-primary'>Loading...</button>
                                                                                                    :
                                                                                                    <button onClick={() => { reorderProducts(order_items); }}className='btn btn-primary'>Buy Again</button>
                                                                                                } */}
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </Card.Body>
                                                                                </Card>
                                                                            </Col>
                                                                        </Row>
                                                                    );
                                                                })}
                                                                <Pagination
                                                                    className="mt-4 mb-0"
                                                                    currentPage={currentPage}
                                                                    totalCount={pageCount}
                                                                    pageSize={pageSize}
                                                                    onPageChange={page => handleChangePage(page)}
                                                                />
                                                            </>
                                                            :
                                                            <>
                                                                <Card className='mt-3'>
                                                                    <Card.Body>
                                                                        <p className="mb-0 text-center">No records found.</p>
                                                                    </Card.Body>
                                                                </Card>
                                                            </>
                                                        }
                                                    </>
                                                    :
                                                    <>
                                                        <Card className='mt-3'>
                                                            <Card.Body>
                                                                <p className="mb-0 text-center">No records found.</p>
                                                            </Card.Body>
                                                        </Card>
                                                    </>
                                                }
                                            </>
                                        }
                                    </>
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
                                                        {/* <span className='ms-3 active-now fs-14 fw-400'>Active Now</span> */}
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

export default Orders;