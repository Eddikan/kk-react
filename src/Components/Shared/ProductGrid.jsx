import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import GetUserProductsData from 'Utils/GetUserProductsData';
import { GoHeart } from "react-icons/go";
import '../../Assets/styles/Product/ViewProduct/style.css';
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import Loading from './Loading';
import { ImLeaf } from 'react-icons/im';
import { useCookies } from 'react-cookie';

const ProductGrid = (props) => {
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);
    const [isProductCurrentUser, setIsProductCurrentUser] = useState(false);

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'token']);
    const currentUser = cookies.currentUser;



    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery();
    const user_id = query.get('user_id');

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

            if (currentUser == productsData.user.id) {
                setIsProductCurrentUser(true);
            } else {
                setIsProductCurrentUser(false);
            }
        } catch (error) {
            // toast.error('An error occured. Please try again or contact the administrator.');
            // setProductsLoading(false);
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
                            <Loading className="bg-white loading-height" />
                        </p>
                    </>
                    :
                    <>
                        {products && products.length > 0 ?
                            <>
                                <Row className="portfolio-row">
                                    {products.map((product) => {
                                        if (product.image_urls?.[0]?.image_url) {
                                            var productImage = process.env.REACT_APP_STORAGE_URL + 'product/' + product.image_urls[0].image_url;
                                        } else {
                                            var productImage = PlaceholderImage;
                                        }
                                        return (
                                            <Col className={`portfolio-grid mb-3`} xs="4" md="2">
                                                <div className={`portfolio-grid-div w-100 ${product.collection_type == "Limited" ? "limited" : " "} ${product.status == "Draft" ? "draft" : ""}`} style={{ backgroundImage: "url(" + productImage + ")" }}>
                                                    <div className="portfolio-overlay">
                                                        <div className="portfolio-details">
                                                            {product.status == "Draft" ?
                                                                <span className="text-warning small fw-600">Draft</span>
                                                                :
                                                                null
                                                            }
                                                            {user_id ?
                                                                <div className="other-actions">

                                                                    {user_id ?
                                                                        <div className="other-actions">

                                                                            {isProductCurrentUser ?
                                                                                <>
                                                                                    <div className="action-button bg-white">
                                                                                        <GoHeart className="text-black" />
                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    {/* <div className="action-button bg-white">
                                                                                        <GoHeart className="text-black" />
                                                                                    </div> */}
                                                                                </>
                                                                            }

                                                                        </div>
                                                                        :
                                                                        null
                                                                    }
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

                                                <div className='d-flex align-items-center'>
                                                    <h2 className="text-black text-decoration-none rufina-family fs-18 mt-2 ellipsis">{product.name ?? "-"}</h2>
                                                    {product.eco_friendly != null && product.eco_friendly != '' && (
                                                        <span className='fs-14 text-no-wrap mx-2 green-leaf-tooltip'>
                                                            <div className='tooltip-content'>
                                                                <span className="green-leaf-tooltiptext">Eco-friendly fabric</span>
                                                            </div>
                                                            <ImLeaf color="#55d140" />
                                                        </span>
                                                    )}
                                                </div>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </>
                            :
                            <>
                                <div className="text-center">
                                    <p className="text-center mb-3 mt-3">No records found.</p>
                                    <Link to="/user/center/design/add">
                                        <Button className="btn btn-primary">Add Fabric</Button>
                                    </Link>
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