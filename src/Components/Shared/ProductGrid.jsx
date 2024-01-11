import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {  Row, Col, Button } from 'react-bootstrap';
import { Card, CardBody, CardFooter, ModalHeader, ModalBody, Modal } from 'reactstrap';
import toast from 'react-hot-toast';
import GetUserProductsData from 'Utils/GetUserProductsData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";
import { IoDocumentOutline } from "react-icons/io5";
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import Loading from './Loading';
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

    const fetchData = async (e) => {
        // setProductsLoading(true);
        try {
          const productsData = await GetUserProductsData(e);
          if (productsData) {
            setProducts(productsData);
            setProductsLoading(false);

            console.log(productsData);
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

    const deleteConfirm = (e) => {
        setDeleteConfirmShow(true);
        setProductId(e);
    };

    async function ProductDeleteSubmit(e) {
        setProductDeleteLoading(true);
        axios.delete(process.env.REACT_APP_API_ENDPOINT + 'product/'+productId+'?user_id=' + currentUser + '&token=' + token).then((response) => {
            const success = response.data.status;
            if(success == 'Success') {
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

    async function ProductDraftSubmit(e) {
        setProductDraftLoading(true);
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'product/'+e+'?user_id=' + currentUser + '&token=' + token, { status: 'Draft' }).then((response) => {
            const success = response.data.status;
            if(success == 'Success') {
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
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'product/'+e+'?user_id=' + currentUser + '&token=' + token, { status: 'Active' }).then((response) => {
            const success = response.data.status;
            if(success == 'Success') {
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

    async function wishlistUpdate(e) {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'wishlist/update', e).then((response) => {
          const success = response.data.status;
          if (success == 'Success') {
            fetchData(currentUser);
          } else {
            toast.error('Something went wrong, please contact the administrator!');
          }
        }).catch((error) => {
          toast.error('Something went wrong, please contact the administrator!');
        });
    };

    useEffect(() => {
        fetchData(currentUser);
    }, [reloadCount]);

    return (
        <>
            <div id="profile-portfolio">
                {productsLoading ?
                    <>
                        <p className='text-center mb-3 mt-3'>
                            <Loading className="bg-white" />
                        </p>
                    </>
                    :
                    <>
                        {products && products.length > 0 ?
                            <>
                                <Row className="portfolio-row">
                                    {/* <img src={product.url} className='portfolio-img'/> */}
                                    {products.map((product, index) => {
                                        if (product.image_urls?.[0]?.image_url) {
                                            var productImage = process.env.REACT_APP_STORAGE_URL+'product/'+product.image_urls[0].image_url;
                                        } else {
                                            var productImage = PlaceholderImage;
                                        }
                                        var wishlist_user_ids = product.wishlist_user_ids;
                                        const userWishlist = wishlist_user_ids.includes(currentUser);
                                        return (
                                            <Col className={`portfolio-grid mb-3`} xs="4" md="2">
                                                <div className={`portfolio-grid-div w-100 ${product.collection_type == "Limited" ? "limited" : " "} ${product.status == "Draft" ? "draft" : ""}`} style={{ backgroundImage: "url("+productImage+")"}}>
                                                    <div className="portfolio-overlay">
                                                        <div className="portfolio-actions">
                                                            <BsThreeDots className="cursor-pointer action-menu" color="#ffffff" size="30px" onClick={() => handleActionClick(index)} />
                                                            {selectedItemIndex === index && (
                                                                <div className="action-box">
                                                                    <Link className="text-decoration-none" to={`/product/${product.id}/edit`}>
                                                                        <p className="mb-3 text-decoration-none"><GoPencil /> Edit</p>
                                                                    </Link>
                                                                    <p className="mb-3 cursor-pointer" onClick={function() { deleteConfirm(product.id); }}><GoTrash  /> Delete</p>
                                                                    {product.status != "Draft" ?
                                                                        <p className="mb-0 cursor-pointer" onClick={function() {ProductDraftSubmit(product.id);}}><IoDocumentOutline /> {productDraftLoading ? "Drafting..." : "Draft"}</p>
                                                                        :
                                                                        <p className="mb-0 cursor-pointer" onClick={function() {ProductPublishSubmit(product.id);}}><IoDocumentOutline /> {productPublishLoading ? "Publishing..." : "Publish"}</p>
                                                                    }
                                                                    
                                                                    {/* Add other actions as needed */}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="portfolio-details">
                                                            {product.status == "Draft" ?
                                                                <span className="text-warning small fw-600">Draft</span>
                                                                :
                                                                null
                                                            }
                                                            <span className="text-white text-decoration-none portfolio-name">{product.name ?? "-"}</span>
                                                            {currentUser ?
                                                                <div className="other-actions">
                                                                    {userWishlist ?
                                                                        <div className="action-button bg-gold" onClick={function() { wishlistUpdate({user_id: currentUser, product_id: product.id}); }}>
                                                                            <GoHeart className="text-white" />
                                                                        </div>
                                                                        :
                                                                        <div className="action-button bg-white" onClick={function() { wishlistUpdate({user_id: currentUser, product_id: product.id}); }}>
                                                                            <GoHeart className="text-black" />
                                                                        </div>
                                                                    }
                                                                    {/* <div className="action-button bg-white">
                                                                        <GoBookmark className="text-black" />
                                                                    </div> */}
                                                                </div>
                                                                :
                                                                null
                                                            }
                                                        </div>
                                                    </div>
                                                    <Link to={`/product/${product.id}`} className="text-decoration-none">
                                                        <div className="portfolio-overlay" style={{background: 'transparent', height: '85%', bottom: 0}}></div>
                                                    </Link>
                                                </div>
                                            </Col>
                                        )
                                    })}
                                    <Col className="portfolio-grid mb-3" xs="4" md="2">
                                        <div onClick={addNewProduct} className="portfolio-grid-div add-more-box w-100 text-center cursor-pointer background-dashed">
                                            <GoPlus color="#a4a4a4" size="150px" className="mt-3" />
                                            <p className="text-dgray" style={{marginTop: '-15px'}}>Add More</p>
                                        </div>
                                    </Col>
                                </Row>
                            </>
                            :
                            <>
                                <div className="text-center">
                                    <p className="text-center mb-3 mt-3">No records found.</p>
                                    <Link to="/portfolio/add">
                                        <Button className="btn btn-primary">Add Fabric</Button>
                                    </Link>
                                </div>
                            </>
                        }
                    </>
                }
            </div>
            {/* Confirm Delete */}
            <Modal
                isOpen={deleteConfirmShow}
                className='modal-preview'
                fade={false}
                centered
            >
                <ModalHeader className="pb-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button type='button' className='close react-modal-close' onClick={function() {setDeleteConfirmShow(false); }} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </ModalHeader>
                <ModalBody>
                    <h4 className='text-center fs-25 fw-600'>Confirm Delete</h4>
                    <Card>
                        <CardBody className="text-center">
                            <p className="mb-0">Are you sure you want to delete this fabric?</p>
                        </CardBody>
                    </Card>
                    <CardFooter className="text-right mt-3">
                        <button className="btn btn-secondary border-black bg-white text-black me-3" onClick={() => setDeleteConfirmShow(false) } type="button" style={{minWidth: '100px', padding: '9px 20px'}}>Cancel</button>
                        {productDeleteLoading ?
                            <button className="btn btn-primary" type="button" style={{minWidth: '100px', padding: '9px 20px'}}>Deleting...</button>
                            :
                            <button className="btn btn-primary" type="button" onClick={ProductDeleteSubmit} style={{minWidth: '100px', padding: '9px 20px'}}>Delete</button>
                        }
                        
                    </CardFooter>
                </ModalBody>
            </Modal>
        </>
    );
};

export default ProductGrid;