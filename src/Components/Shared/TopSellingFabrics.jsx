import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import GetUserProductsData from 'Utils/GetUserProductsData';
import { GoHeart } from "react-icons/go";
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import Loading from './Loading';
import { useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const ProductGrid = (props) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);
    const [isClicked, setIsClicked] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'token', 'userRole']);
    const currentUser = cookies.currentUser;
    const userRole = cookies.userRole;

    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery();
    const user_id = query.get('user_id');

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    const fetchData = async (e) => {
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

    async function wishlistUpdate(e) {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'wishlist/update', e).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                setReloadCount(reloadCount + 1);
            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
        }).catch((error) => {
            toast.error('Something went wrong, please contact the administrator!');
        });
    };

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
                                                <div className="portfolio-link">
                                                    <div className={`portfolio-grid-selling w-100 ${product.collection_type == "Limited" ? "limited" : " "} ${product.status == "Draft" ? "draft" : ""}`}
                                                        style={{ backgroundImage: "url(" + productImage + ")" }}
                                                    >
                                                {userRole !== 'Admin' ?
                                                            <>
                                                        <Link to={`/product/${product.id}`} className="text-decoration-none">
                                                            <div className="portfolio-overlay" style={{ background: 'transparent', height: '85%', bottom: 0 }}></div>
                                                        </Link>
                                                        </>
                                                        :
                                                        <>
                                                        <Link to={`/admin/fabric/${product.id}`} className="text-decoration-none">
                                                            <div className="portfolio-overlay" style={{ background: 'transparent', height: '85%', bottom: 0 }}></div>
                                                        </Link>
                                                        </>
                                                }
                                                        <div className='save-link'>
                                                            {userRole !== 'Admin' &&
                                                                <>
                                                                    {userWishlist ?
                                                                        <div
                                                                            className="action-button bg-gold"
                                                                            onClick={function () { wishlistUpdate({ user_id: currentUser, product_id: product.id }); }}
                                                                        >
                                                                            <GoHeart className="text-white" />
                                                                        </div>
                                                                        :
                                                                        <div
                                                                            className="action-button bg-white"
                                                                            onClick={function () { wishlistUpdate({ user_id: currentUser, product_id: product.id }); }}
                                                                        >
                                                                            <GoHeart className="text-black" />
                                                                        </div>
                                                                    }
                                                                </>
                                                            }
                                                        </div>


                                                        <div className="portfolio-details">
                                                            {product.status == "Draft" ?
                                                                <span className="text-warning small fw-600">Draft</span>
                                                                :
                                                                null
                                                            }

                                                            {/* {user_id ?
                                                                <div className="other-actions">
                                                                    <div
                                                                        className={`heart-btn ${isClicked ? '#CEA835' : 'bg-white'}`}
                                                                        onClick={handleClick}
                                                                    >
                                                                        <GoHeart className={isClicked ? '#CEA835' : 'text-black'} />
                                                                    </div>
                                                                </div>
                                                                :
                                                                null
                                                            } */}
                                                        </div>
                                                        {/* </div> */}

                                                    </div>
                                                </div>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </>
                            :
                            <>
                                <div className="text-center">
                                    <p className="text-center mt-3">No records found.</p>
                                </div>
                            </>
                        }
                    </>
                }
            </div >
        </>
    );
};

export default ProductGrid;