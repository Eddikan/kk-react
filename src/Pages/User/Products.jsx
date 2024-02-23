import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import toast from 'react-hot-toast';
import GetUserProductsData from 'Utils/GetUserProductsData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";
import { IoDocumentOutline, IoEyeOutline } from "react-icons/io5";
import { BsCart2 } from "react-icons/bs";
import { ImLeaf } from 'react-icons/im';
import Loading from 'Components/Shared/Loading';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import LoadingPage from 'Components/Shared/LoadingPage';
import '../../Assets/styles/Product/ViewProduct/style.css';
import Sidebar from 'Components/Shared/Sidebar';
import LayoutSellerCenter from 'Components/Layout/LayoutSellerCenter';

const Products = (props) => {
    const navigate = useNavigate();
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [productDraftLoading, setProductDraftLoading] = useState(false);
    const [productPublishLoading, setProductPublishLoading] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [deleteConfirmShow, setDeleteConfirmShow] = useState(false);
    const [productDeleteLoading, setProductDeleteLoading] = useState(false);
    const [productId, setProductId] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'token']);

    const [count, setCount] = useState(0);

    const token = cookies.token;
    const currentUser = cookies.currentUser;

    const fetchData = async (e) => {
        try {
            const productData = await GetUserProductsData(e);
            if (productData) {
                setProducts(productData);
                setProductsLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setProductsLoading(false);
            }
            // Update state or perform other logic with userData
        } catch (error) {
            toast.error('An error occured. Please try again or contact the administrator.');
            setProductsLoading(false);
            // Handle the error, if needed
        }
    };

    const handleActionClick = (index) => {
        // Toggle the selected item index
        setSelectedItemIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const addNewProduct = () => {
        navigate('/user/center/product/add')
    };

    const deleteConfirm = (e) => {
        setDeleteConfirmShow(true);
        setProductId(e);
    };

    async function ProductDraftSubmit(e) {
        setProductDraftLoading(true);
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'product/' + e + '?user_id=' + currentUser + '&token=' + token, { status: 'Draft' }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                toast.success('Fabric saved as draft successfully!');
                setReloadCount((prevReloadCount) => prevReloadCount + 1);
                setProductDraftLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setProductDraftLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setProductDraftLoading(false);
        });
    };

    async function ProductPublishSubmit(e) {
        setProductPublishLoading(true);
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'product/' + e + '?user_id=' + currentUser + '&token=' + token, { status: 'Active' }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                toast.success('Fabric published successfully!');
                setReloadCount((prevReloadCount) => prevReloadCount + 1);
                setProductPublishLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setProductPublishLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setProductPublishLoading(false);
        });
    };

    async function ProductDeleteSubmit(e) {
        setProductDeleteLoading(true);
        axios.delete(process.env.REACT_APP_API_ENDPOINT + 'product/' + productId + '?user_id=' + currentUser + '&token=' + token).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                toast.success('Fabric deleted successfully!');
                setReloadCount((prevReloadCount) => prevReloadCount + 1);
                setProductDeleteLoading(false);
                setDeleteConfirmShow(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setProductDeleteLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setProductDraftLoading(false);
        });
    };

    useEffect(() => {
        fetchData(currentUser);
    }, [reloadCount]);

    return (
        <LayoutSellerCenter>
            {productsLoading ?
                <LoadingPage />
                :
                <>
                    <section>
                        <Container fluid className='p-0'>

                            {products && products.length > 0 ?
                                <>
                                    <Row className="portfolio-row bg-product">
                                        <Col lg={2}>
                                            <Sidebar />
                                        </Col>

                                        <Col lg={10} className='mt-5 col-right mx-auto' style={{ maxWidth: '1440px' }}>
                                            <div className='ms-4'>
                                                <h2 className='fs-30 mb-3'>Fabrics</h2>
                                                <Row>
                                                    {products.map((object, index) => (
                                                        <Col className={`product-grid-image mb-3`} xs="4" md="2">
                                                            <div className={`product-grid-div w-100 ${object.collection_type == "Limited" ? "limited" : " "} ${object.status == "Draft" ? "draft" : ""}`} style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'product/' + object.image_urls[0].image_url + ")" }}>
                                                                <div className="product-overlay">
                                                                    <div className="product-actions">
                                                                        <BsThreeDots className="cursor-pointer action-menu" color="#ffffff" size="30px" onClick={() => handleActionClick(index)} />
                                                                        {selectedItemIndex === index && (
                                                                            <div className="action-box">
                                                                                <Link className="text-decoration-none" to={`/user/center/product/${object.id}/edit`}>
                                                                                    <p className="mb-3 text-decoration-none"><GoPencil /> Edit</p>
                                                                                </Link>
                                                                                <Link className="text-decoration-none" to={`/product/${object.id}`}>
                                                                                    <p className="mb-3 text-decoration-none"><IoEyeOutline /> Preview</p>
                                                                                </Link>
                                                                                <p className="mb-3 cursor-pointer"
                                                                                    onClick={function () { deleteConfirm(object.id); }}
                                                                                >
                                                                                    <GoTrash /> Delete</p>
                                                                                {object.status != "Draft" ?
                                                                                    <p className="mb-0 cursor-pointer" onClick={function () { ProductDraftSubmit(object.id); }}><IoDocumentOutline /> {productDraftLoading ? "Drafting..." : "Draft"}</p>
                                                                                    :
                                                                                    <p className="mb-0 cursor-pointer" onClick={function () { ProductPublishSubmit(object.id); }}><IoDocumentOutline /> {productPublishLoading ? "Publishing..." : "Publish"}</p>
                                                                                }

                                                                                {/* Add other actions as needed */}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="product-details">
                                                                        <div className="other-actions">
                                                                            {object.user === currentUser && (
                                                                                <>
                                                                                    <div className="action-button bg-white me-2">
                                                                                        <GoHeart className="text-black" />
                                                                                    </div>
                                                                                    <div className="action-button bg-white me-2">
                                                                                        <GoBookmark className="text-black" />
                                                                                    </div>
                                                                                    <div className="action-button bg-white">
                                                                                        <BsCart2 className="text-black" />
                                                                                    </div>
                                                                                </>
                                                                            )}

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Link to={`/user/center/product/${object.id}/edit`} className="text-decoration-none">
                                                                    <div className="product-overlay" style={{ background: 'transparent', height: '85%', bottom: 0 }}></div>
                                                                </Link>
                                                            </div>

                                                            <Row>
                                                                <Col lg="12">
                                                                    <div className='d-flex align-items-center'>
                                                                        <h2 className="text-black text-decoration-none rufina-family fs-18 mt-2">{object.name ?? "-"}</h2>
                                                                        {object.eco_friendly != null && object.eco_friendly != '' && (
                                                                            <span className='fs-14 text-no-wrap mx-2 green-leaf-tooltip'>
                                                                                <div className='tooltip-content'>
                                                                                    <span className="green-leaf-tooltiptext">Eco-friendly fabric</span>
                                                                                </div>
                                                                                <ImLeaf color="#55d140" />
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </Col>

                                                                {/* <Col lg="6" className='text-end'>
                                                                    {object.views == null ?
                                                                        <div className='mt-2'>
                                                                            <IoEyeOutline className="text-black ms-2" /> 0
                                                                        </div>
                                                                        :
                                                                        <div className='mt-2'>
                                                                            <IoEyeOutline className="text-black ms-2" /> {object.views}
                                                                        </div>
                                                                    }
                                                                </Col> */}
                                                            </Row>
                                                        </Col>
                                                    ))}

                                                    <Col className="product-grid mb-3" xs="4" md="2">
                                                        <div onClick={addNewProduct} className="product-grid-div add-more-box w-100 text-center cursor-pointer background-dashed">
                                                            <GoPlus color="#a4a4a4" size="150px" className="mt-3" />
                                                            <p className="text-dgray" style={{ marginTop: '-15px' }}>Add More</p>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                </>
                                :
                                <>
                                    <div className="text-center">
                                        <p className="text-center mb-3 mt-3">No records found.</p>
                                        <Link to="/user/center/product/add">
                                            <Button className="btn btn-primary">Add Product</Button>
                                        </Link>
                                    </div>
                                </>
                            }
                        </Container>
                    </section>
                </>
            }

            <Modal
                show={deleteConfirmShow}
                className='modal-preview'
                fade={false}
                centered
            >
                <Modal.Header className="pb-0">
                    <h5 className='modal-title text-left'>Confirm Delete</h5>
                    <button type='button' className='close react-modal-close' onClick={function () { setDeleteConfirmShow(false); }} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <p className="mb-0">Are you sure you want to delete this fabric?</p>
                        </Card.Body>
                    </Card>
                    <Card.Footer className="text-right mt-3">
                        <button className="btn btn-secondary border-black bg-white text-black me-3" onClick={() => setDeleteConfirmShow(false)} type="button" style={{ minWidth: '100px', padding: '9px 20px' }}>Cancel</button>
                        {productDeleteLoading ?
                            <button className="btn btn-primary" type="button" style={{ minWidth: '100px', padding: '9px 20px' }}>Deleting...</button>
                            :
                            <button className="btn btn-primary" type="button" onClick={ProductDeleteSubmit} style={{ minWidth: '100px', padding: '9px 20px' }}>Delete</button>
                        }

                    </Card.Footer>
                </Modal.Body>
            </Modal>
        </LayoutSellerCenter >
    );
};

export default Products;