import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'Assets/styles/User/Profile/style.css';
import GoBack from 'Components/Shared/GoBack';
import EditPortfolioNormal from 'Components/Forms/Portolio/EditPortfolioNormal';
import GetSinglePortfolioData from 'Utils/GetSinglePortfolioData';
import LoadingPage from 'Components/Shared/LoadingPage';
import toast from 'react-hot-toast';

const EditPortfolioDetails = () => {
    const navigate = useNavigate();
    const { portfolioId } = useParams();
    const [portfolio, setPortfolio] = useState('');
    const [portfolioLoading, setPortfolioLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [reloadCount, setReloadCount] = useState(0);

    const editSuccess = (e) => {
        if (e) {
            setTimeout(function () {
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
            const portfolioData = await GetSinglePortfolioData(e);
            if (portfolioData.id) {
                setPortfolio(portfolioData);
                setPortfolioLoading(false);
                setImages(portfolioData.image_urls);
            } else {
                setPortfolioLoading(false);
                toast.error('Portfolio item does not exist!');
            }
            // Update state or perform other logic with portfolioData
        } catch (error) {
            toast.error('Portfolio item does not exist!');
            // Handle the error, if needed
        }
    };

    useEffect(() => {
        fetchData(portfolioId);
    }, [reloadCount]);

    return (
        <Layout>
            {portfolioLoading ?
                <LoadingPage />
                :
                <section className='py-5 px-2'>
                    <Container>
                        <Row>
                            <Col lg="8" className='mb-3'>
                                <h2 className='fs-30 mb-2'>Edit Portfolio</h2>
                            </Col>
                            <Col lg="4" className='mb-3 text-right'>
                                <GoBack fallBack="/user/profile" />
                            </Col>
                        </Row>
                        <EditPortfolioNormal size="normal" portfolioId={portfolioId} portfolio={portfolio} images={images} withDraft={true} onSuccess={editSuccess} onReloadPage={reloadPage} onCancel={cancel} />
                    </Container>
                </section>
            }
        </Layout>
    );
};

export default EditPortfolioDetails;