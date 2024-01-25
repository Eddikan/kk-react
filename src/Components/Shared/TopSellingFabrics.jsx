import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import { Card, CardBody, CardFooter, ModalHeader, ModalBody, Modal } from 'reactstrap';
import toast from 'react-hot-toast';
import GetUserProductsData from 'Utils/GetUserProductsData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";
import { IoDocumentOutline } from "react-icons/io5";
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import Loading from './Loading';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const ProductGrid = (props) => {
    const navigate = useNavigate();
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [productDraftLoading, setProductDraftLoading] = useState(false);
    const [productPublishLoading, setProductPublishLoading] = useState(false);
    const [productDeleteLoading, setProductDeleteLoading] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [deleteConfirmShow, setDeleteConfirmShow] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'token']);
    const [productId, setProductId] = useState('');

    const currentUser = cookies.currentUser;
    const token = cookies.token;
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery();
    const user_id = query.get('user_id');


    const fetchData = async (e) => {
        // setProductsLoading(true);
        try {
            const productsData = await GetUserProductsData(e);
            if (productsData) {
                setProducts(productsData);
                setProductsLoading(false);

            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setProductsLoading(false);
            }
        } catch (error) {
            toast.error('An error occured. Please try again or contact the administrator.');
            setProductsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(user_id);
    }, [reloadCount]);

    return (
        <>
            <div id="profile-portfolio">
                {productsLoading ?
                    <>
                        <p className='text-center mb-3 mt-3'>
                            <Loading className="bg-white top-selling-loading" />
                        </p>
                    </>
                    :
                    <>
                        {products && products.length > 0 ?
                            <>
                                <Row className="portfolio-row">
                                    {/* <img src={product.url} className='portfolio-img'/> */}
                                    {products.slice(0, 3).map((product, index) => {
                                        if (product.image_urls?.[0]?.image_url) {
                                            var productImage = process.env.REACT_APP_STORAGE_URL + 'product/' + product.image_urls[0].image_url;
                                        } else {
                                            var productImage = PlaceholderImage;
                                        }
                                        var wishlist_user_ids = product.wishlist_user_ids;
                                        const userWishlist = wishlist_user_ids.includes(currentUser);
                                        return (
                                            <Col className={`mb-0`} lg="4">
                                                <div className={`portfolio-grid-selling w-100 ${product.collection_type == "Limited" ? "limited" : " "} ${product.status == "Draft" ? "draft" : ""}`} style={{ backgroundImage: "url(" + productImage + ")" }}>
                                                    <div className="portfolio-overlay">
                                                        <div className="portfolio-actions">
                                                            {selectedItemIndex === index && (
                                                                <div className="action-box">
                                                                    <Link className="text-decoration-none" to={`/product/${product.id}/edit`}>
                                                                        <p className="mb-3 text-decoration-none"><GoPencil /> Edit</p>
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="portfolio-details">
                                                            {product.status == "Draft" ?
                                                                <span className="text-warning small fw-600">Draft</span>
                                                                :
                                                                null
                                                            }

                                                            {user_id ?
                                                                <div className="other-actions">
                                                                    <div className="action-button bg-white">
                                                                        <GoHeart className="text-black" />
                                                                    </div>
                                                                </div>
                                                                :
                                                                null
                                                            }
                                                        </div>
                                                    </div>
                                                    <Link to={`/product/${product.id}`} className="text-decoration-none">
                                                        <div className="portfolio-overlay" style={{ background: 'transparent', height: '85%', bottom: 0 }}></div>
                                                    </Link>
                                                </div>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </>
                            :
                            <>
                                <div className="text-center">
                                    <p className="text-center no-records-found">No records found.</p>
                                </div>
                            </>
                        }
                    </>
                }
            </div>
        </>
    );
};

export default ProductGrid;