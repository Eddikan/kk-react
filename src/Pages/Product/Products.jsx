import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import GetUserProductsData from 'Utils/GetUserProductsData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";
import { IoDocumentOutline, IoEyeOutline } from "react-icons/io5";
import { BsCart2 } from "react-icons/bs";
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
        navigate('/product/add')
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

                                        <Col lg={10} className='mt-5 col-right mx-auto'>
                                            <div className='ms-5'>
                                                <h2 className='fs-30 mb-3'>Products</h2>
                                                <Row>
                                                    {products.map((object, index) => (
                                                        <Col className={`product-grid-image mb-3`} xs="4" md="2">
                                                            <div className={`product-grid-div w-100 ${object.collection_type == "Limited" ? "limited" : " "} ${object.status == "Draft" ? "draft" : ""}`} style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'product/' + object.image_urls[0].image_url + ")" }}>
                                                                <div className="product-overlay">
                                                                    <div className="product-actions">
                                                                        <BsThreeDots className="cursor-pointer action-menu" color="#ffffff" size="30px" onClick={() => handleActionClick(index)} />
                                                                        {selectedItemIndex === index && (
                                                                            <div className="action-box">
                                                                                <Link className="text-decoration-none" to={`/product/${object.id}/edit`}>
                                                                                    <p className="mb-3 text-decoration-none"><GoPencil /> Edit</p>
                                                                                </Link>
                                                                                <p className="mb-3"><GoTrash /> Delete</p>
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
                                                                        {/* <span className="text-white text-decoration-none">{object.name ?? "-"}</span> */}
                                                                        <div className="other-actions">
                                                                            <div className="action-button bg-white me-2">
                                                                                <GoHeart className="text-black" />
                                                                            </div>
                                                                            <div className="action-button bg-white me-2">
                                                                                <GoBookmark className="text-black" />
                                                                            </div>
                                                                            <div className="action-button bg-white">
                                                                                <BsCart2 className="text-black" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Link to={`/product/${object.id}`} className="text-decoration-none">
                                                                    <div className="product-overlay" style={{ background: 'transparent', height: '85%', bottom: 0 }}></div>
                                                                </Link>
                                                            </div>

                                                            <div className='d-flex mt-2'>
                                                                <div className="text-black text-decoration-none ellipsis rufina-family fs-18">{object.name ?? "-"}</div>
                                                                <div><GoHeart className="text-black ms-2" /></div>
                                                                <div><IoEyeOutline className="text-black ms-2" /> {object.views}</div>
                                                            </div>
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
                                        <Link to="/product/add">
                                            <Button className="btn btn-primary">Add Product</Button>
                                        </Link>
                                    </div>
                                </>
                            }
                        </Container>
                    </section>
                </>
            }
        </LayoutSellerCenter >
    );
};

export default Products;