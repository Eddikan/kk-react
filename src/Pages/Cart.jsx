import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LayoutNoFooter from '../Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import '../Assets/styles/DesignerCalendar/style.css'
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
import { CiCreditCard2 } from "react-icons/ci";
import '../Assets/styles/Cart/style.css';
import PlaceholderImage from '../Assets/images/placeholders/image.png';
import UserPlaceholder from 'Assets/images/user.png';
import { AiOutlineCheck, AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { PiGridFourThin, PiTableThin, PiTrashThin, PiPencilThin, PiUserCircleThin } from 'react-icons/pi';
import { AiOutlineDelete } from "react-icons/ai";
import { useParams } from 'react-router-dom';
import { GoAlertFill } from 'react-icons/go';
import axios from "axios";
import toast from 'react-hot-toast';

const initialCheckOut = {
    card_name: '',
    card_number: '',
    date: ''
};

const Cart = (props) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Parse search string to get query parameters
    const searchParams = new URLSearchParams(location.search);

    // Access individual query parameters using get method
    const item = searchParams.get('item');

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'token', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const token = cookies.currentUser;
    const userDetails = cookies.userDetails;
    const { designerId } = useParams();
    const [reloadCount, setReloadCount] = useState(0);
    const [formStatus, setFormStatus] = useState('standby');
    const [radioButtonValue, setRadioButtonValue] = useState(0);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [cartItems, setCartItems] = useState('');
    const [cartItemId, setCartItemId] = useState('');
    const [checkOutFormData, setCheckOutFormData] = useState(initialCheckOut);
    const [selectedCartItems, setSelectedCartItems] = useState([]);
    const [cartItemModalDelete, setCartItemModalDelete] = useState(false);

    const [subtotalAmount, setSubtotalAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    const toggleDeleteCartItem = (id) => {
        setCartItemId(id);
        setCartItemModalDelete(!cartItemModalDelete);
    }

    const getUserCartItems = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '/cart');
    };

    const postCheckOut = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'order', data);
    };

    const updateQuantity = async (data) => {
        return await axios.put(process.env.REACT_APP_API_ENDPOINT + 'cart/' + data.id, data);
    };

    const deleteCartItem = async () => {
        return await axios.delete(process.env.REACT_APP_API_ENDPOINT + 'cart/' + cartItemId);
    };


    const handleChangePaymentInfo = (e) => {
        const { name, value } = e.target;
        setCheckOutFormData({
            ...checkOutFormData,
            [name]: value,
        });
    }

    const handleCheckboxChange = (id) => {
        if (selectedCartItems.includes(id)) {
            setSelectedCartItems(selectedCartItems.filter((cartItemId) => cartItemId !== id));
        } else {
            setSelectedCartItems([...selectedCartItems, id]);
        }
    };

    const checkOutSubmit = (e) => {
        e.preventDefault();
        setFormStatus('loading');
        const uniqueSelectedCartItems = [...new Set(selectedCartItems)];
        postCheckOut({ user_id: currentUser, subtotal_amount: subtotalAmount, total_amount: totalAmount, cart_item_ids: uniqueSelectedCartItems }).then(response => {
            const success = response.data.status;
            if (success == success) {
                toast.success('Order added successfully!');
                navigate('/orders');
            } else {
                toast.error('There has been an error adding the order, please try again!');
            }
        }).catch(() => {
            toast.error('There has been an error adding the order, please try again!');
        });
    }

    const updateItemQuantity = (data) => {
        updateQuantity({ user_id: currentUser, quantity: data.quantity, id: data.id }).then(response => {
            const success = response.data.status;
            if (success == success) {
                // toast.success('Product quantity updated successfully!');
                setReloadCount(reloadCount + 1);
            } else {
                toast.error('There has been an error adding the order, please try again!');
            }
        }).catch(() => {
            toast.error('There has been an error adding the order, please try again!');
        });
    }

    const deleteCartItemSubmit = (cartItemId) => {
        setFormStatus('loading');
        deleteCartItem(cartItemId).then(response => {
            const success = response.data.status;
            if (success) {
                setFormStatus('standby');
                setCartItemModalDelete(false);
                setReloadCount(reloadCount + 1);
                toast.success('Cart Item deleted successfully!');
            } else {
                setFormStatus('standby');
                toast.error('There has been an error getting the item, please try again!');
            }
        }).catch(() => {
            toast.error('There has been an error getting the item, please try again!');
        });
    }

    useEffect(() => {
        document.body.classList.add('designer-calendar-body');
    }, []);

    useEffect(() => {
        let cart_total = 0;
        if (cartItems.length > 0 && selectedCartItems.length > 0) {
            // Calculate subtotal for each selected item and sum up to get the total
            cart_total = cartItems.reduce((acc, item) => {
                // Check if the item is selected
                if (selectedCartItems.includes(item.id)) {
                    const subtotal = item.product.price * item.quantity;
                    return acc + subtotal;
                }
                return acc;
            }, 0);
        }
        if (cart_total > 0) {
            setTotalAmount(cart_total.toFixed(2));
            setSubtotalAmount(cart_total.toFixed(2));
        }
    }, [selectedCartItems, item, reloadCount, cartItems]);

    useEffect(() => {
        getUserCartItems()
            .then((response) => {
                const cartItemsData = response.data.data;
                if (cartItemsData) {
                    setCartItems(cartItemsData);
                    if (item && item != "") {
                        setSelectedCartItems([...selectedCartItems, parseInt(item)]);
                    }

                } else {
                    toast.error('There has been an error getting the products, please try again!');
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the products, please try again!');
            });
    }, [reloadCount, item]);

    return (
        <LayoutNoFooter>
            <section>
                <Container className='top-bottom'>
                    <Row>
                        <Col lg={12}>
                            <Row className="pb-4">
                                <Col md={6} className='d-flex justify-content-left align-items-center'>
                                    <h3 className="fs-30 fw-600 text-black mb-0">Cart</h3>
                                </Col>
                                <Col md={6} className="text-right">
                                    <GoBack fallBack="/#" />
                                </Col>
                            </Row>
                        </Col>

                        <Col lg={9}>
                            <Card>
                                <Card.Body className='bg-light'>
                                    <Row>
                                        <Col lg={1}>
                                            <input
                                                type="checkbox"
                                                className="check-box check-box-color date-width mb-1"
                                                checked={selectedCartItems.length === cartItems.length && cartItems.length > 0}
                                                onChange={() => {
                                                    if (selectedCartItems.length === cartItems.length) {
                                                        setSelectedCartItems([]);
                                                    } else {
                                                        setSelectedCartItems(cartItems.map((cartItem) => cartItem.id));
                                                    }
                                                }}
                                            />
                                        </Col>
                                        <Col lg={4}>
                                            Item
                                        </Col>

                                        <Col lg={2}>
                                            Price
                                        </Col>

                                        <Col lg={2}>
                                            Size
                                        </Col>

                                        <Col lg={2}>
                                            Total
                                        </Col>

                                        <Col lg={1} className='text-center'>
                                            Action
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            <>
                                {cartItems ?
                                    <>
                                        {cartItems.length > 0 ?
                                            <>
                                                {cartItems.map((cartItem) => {
                                                    var cart_product = cartItem.product;
                                                    if (cart_product.image_urls) {
                                                        var image_urls = JSON.parse(cart_product.image_urls);
                                                        var fabricImage = process.env.REACT_APP_STORAGE_URL + 'product/' + image_urls[0].image_url;
                                                    } else {
                                                        var fabricImage = PlaceholderImage;
                                                    }

                                                    return (
                                                        <Card className='mt-2'>
                                                            <Card.Body>
                                                                <Row>
                                                                    <Col lg={1}>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="check-box me-2 check-box-color"
                                                                            checked={selectedCartItems.includes(cartItem.id)}
                                                                            onChange={(e) => { handleCheckboxChange(cartItem.id); }}
                                                                        />
                                                                    </Col>
                                                                    <Col lg={4}>
                                                                        <div className='d-flex'>
                                                                            <div className="designs-grid-div fabric-image cursor-pointer"
                                                                                style={{ backgroundImage: "url(" + fabricImage + ")" }}>
                                                                            </div>

                                                                            <div className='ms-3'>
                                                                                <div className='mb-1 fw-500 text-black'>
                                                                                    {cartItem.product.name}
                                                                                </div>

                                                                                <div className='d-flex align-items-center user-image-chat'>
                                                                                    {cartItem.seller.image ? 
                                                                                        <div
                                                                                            className='user-photo-chat'
                                                                                            style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${cartItem.seller.image})` }}
                                                                                        >
                                                                                        </div>
                                                                                        :
                                                                                        <div
                                                                                            className='user-photo-chat'
                                                                                            style={{ backgroundImage: `url(${UserPlaceholder})` }}
                                                                                        >
                                                                                        </div>
                                                                                    }
                                                                                    <span className='name-user ms-2'>
                                                                                        {cartItem.seller.first_name}
                                                                                        &nbsp;
                                                                                        {cartItem.seller.last_name}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </Col>

                                                                    <Col lg={2}>
                                                                        ${cartItem.product.price}
                                                                    </Col>

                                                                    <Col lg={2}>
                                                                        <input type="number" className="form-control p-2 d-inline-block" min="1" style={{ maxWidth: 60 }} defaultValue={cartItem.quantity} onChange={(e) => updateItemQuantity({ quantity: e.target.value, id: cartItem.id })} /> {cartItem.product.unit_measurement}
                                                                    </Col>

                                                                    <Col lg={2}>
                                                                        ${(cartItem.product.price * cartItem.quantity).toFixed(2)}
                                                                    </Col>

                                                                    <Col lg={1} className='text-center cursor-pointer'
                                                                        onClick={function () { toggleDeleteCartItem(cartItem.id); }}
                                                                    >
                                                                        <AiOutlineDelete size="20" />
                                                                    </Col>
                                                                </Row>
                                                            </Card.Body>
                                                        </Card>
                                                    );
                                                })}

                                            </>
                                            :
                                            <>
                                                <div className='text-center my-3'>
                                                    No Item found.
                                                </div>
                                            </>
                                        }
                                    </>
                                    :
                                    <>

                                    </>
                                }
                            </>
                            <Card className='mt-2'>
                                <Card.Body className='bg-light'>
                                    <Row>
                                        <Col lg={1}>
                                        </Col>
                                        <Col lg={6}>
                                        </Col>
                                        <Col lg={2}>
                                            <span className='fs-18'>Total Amount</span>
                                        </Col>
                                        <Col>
                                            <span className='total-price fs-20 fw-600'>${totalAmount}</span>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>


                        <Col lg={3}>
                            <Card>
                                <Card.Body>
                                    <div className='fs-22 rufina-family fw-600'>Payment Info</div>
                                    <hr className='mt-2' />
                                    <div>Payment Method</div>
                                    <div className='mt-3 d-flex'>
                                        <div className='d-flex'>
                                            <input
                                                type="radio"
                                                name="visa"
                                                onChange={(e) => { setRadioButtonValue(1); }}
                                            />
                                        </div>

                                        <div className='ms-3'>
                                            <CiCreditCard2 size={20} />
                                        </div>

                                        <div className='ms-2'>
                                            VISA
                                        </div>
                                    </div>

                                    {radioButtonValue == 1 &&
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
                                    }
                                    <div className='text-center mt-4'
                                    // onClick={() => toggleUnderConstruction("Check Out")}
                                    >
                                        {selectedCartItems.length < 1 ?
                                            <button className='btn btn-primary w-100' disabled={true}>{formStatus != "standby" ? "Loading..." : "Check Out"}</button>
                                            :
                                            <button onClick={checkOutSubmit} className='btn btn-primary w-100'>{formStatus != "standby" ? "Loading..." : "Check Out"}</button>
                                        }

                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button type='button' className='close react-modal-close' onClick={() => setUnderConstructionShow(false)} data-dismiss='modal' aria-label='Close'>
                        <span aria-hidden='true'>&times;</span>
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

            <Modal
                show={cartItemModalDelete}
                size='lg'
                centered
            >
                <Modal.Header>
                    <Modal.Title>Delete Item</Modal.Title>
                    <AiOutlineClose role='button' onClick={() => setCartItemModalDelete(false)} />
                </Modal.Header>

                <Modal.Body className="pb-0 pt-1">
                    <Card className="border-none">
                        <Card.Body>
                            <p className="pt-0 fs-22">Are you sure about deleting the item?</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>
                <Modal.Footer className='text-right modal-footer-border pb-4'>
                    <button
                        type="button"
                        className="btn-cart-cancel btn"
                        onClick={() => setCartItemModalDelete(false)}
                    >
                        <AiOutlineClose
                            size="20px"
                            className="cancel-button me-1"
                        />
                        Cancel
                    </button>

                    {formStatus !== "standby" ?
                        <button className='btn btn-primary' type='button'>
                            <AiOutlineCheck size="20px" /> Deleting...
                        </button>
                        :
                        <button
                            className='btn btn-primary form-hover'
                            type='button'
                            onClick={deleteCartItemSubmit}
                        >
                            <PiTrashThin
                                size="20px"
                                className="cancel-button me-1"
                            />
                            Delete
                        </button>
                    }
                </Modal.Footer>
            </Modal>

        </LayoutNoFooter >
    );
};

export default Cart;