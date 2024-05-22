import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'Assets/styles/User/Profile/style.css';
import GoBack from 'Components/Shared/GoBack';
import EditProductNormal from 'Components/Forms/Product/EditProductNormal';
import GetSingleProductData from 'Utils/GetSingleProductData';
import LoadingPage from 'Components/Shared/LoadingPage';
import toast from 'react-hot-toast';

const EditProductDetails = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [product, setProduct] = useState('');
    const [productLoading, setProductLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [finalProductImages, setFinalProductImages] = useState([]);
    const [reloadCount, setReloadCount] = useState(0);

    const editSuccess = (e) => {
        if (e) {
            setTimeout(function(){
                // navigate("/user/profile");
                if (window.history.length > 1) {
                    // Check if there is a previous page in the history
                    navigate(-1); // Navigates back in the history
                }
            }, 1000);
        }
    };

    const reloadPage = (e) => {

    };

    const cancel = (e) => {
        navigate("/user/profile");
    };

    const fetchData = async (e) => {
        try {
          const productData = await GetSingleProductData(e);
          if (productData.id) {
            setProduct(productData);
            setProductLoading(false);
            setImages(productData.image_urls);
            setFinalProductImages(productData.final_product_image_urls);

          } else {
            setProductLoading(false);
            toast.error('Product item does not exist!');
          }
          // Update state or perform other logic with productData
        } catch (error) {
            toast.error('Product item does not exist!');
          // Handle the error, if needed
        }
    };

    useEffect(() => {
        fetchData(productId);
    }, [reloadCount]);

    return (
        <Layout>
            {productLoading ?
                <LoadingPage />
                :
                <section className='py-5 px-2 bg-white'>
                    <Container>
                        <Row>
                            <Col lg="8" className='mb-3'>
                                <h2 className='fs-30 mb-2'>Edit Fabric</h2>
                            </Col>
                            <Col lg="4" className='mb-3 text-right'>
                                <GoBack fallBack="/user/profile" />
                            </Col>
                        </Row>
                        <EditProductNormal size="normal" productId={productId} product={product} images={images} finalProductImages={finalProductImages} withDraft={true} onSuccess={editSuccess} onReloadPage={reloadPage} onCancel={cancel} />
                    </Container> 
                </section>
            }
        </Layout>
    );
};

export default EditProductDetails;