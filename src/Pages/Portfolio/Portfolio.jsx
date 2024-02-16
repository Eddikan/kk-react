import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import Container from 'react-bootstrap/Container';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import GetUserPortfolioData from 'Utils/GetUserPortfolioData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";
import { IoDocumentOutline, IoEyeOutline } from "react-icons/io5";
import Loading from 'Components/Shared/Loading';
import '../../Assets/styles/Portfolio/ViewPortFolio/style.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import LoadingPage from 'Components/Shared/LoadingPage';
import GoBack from 'Components/Shared/GoBack';
import Sidebar from 'Components/Shared/Sidebar';
import LayoutSellerCenter from 'Components/Layout/LayoutSellerCenter';

const Portfolio = (props) => {
    const navigate = useNavigate();
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [portfolio, setPortfolio] = useState([]);
    const [portfolioLoading, setPortfolioLoading] = useState(true);
    const [portfolioDraftLoading, setPortfolioDraftLoading] = useState(false);
    const [portfolioPublishLoading, setPortfolioPublishLoading] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'token']);

    const token = cookies.token;
    const currentUser = cookies.currentUser;

    const fetchData = async (e) => {
        try {
            const portfolioData = await GetUserPortfolioData(e);
            if (portfolioData) {
                setPortfolio(portfolioData);
                setPortfolioLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setPortfolioLoading(false);
            }
            // Update state or perform other logic with userData
        } catch (error) {
            toast.error('An error occured. Please try again or contact the administrator.');
            setPortfolioLoading(false);
            // Handle the error, if needed
        }
    };

    const handleActionClick = (index) => {
        // Toggle the selected item index
        setSelectedItemIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const addNewPortfolio = () => {
        navigate('/portfolio/add')
    };

    async function PortfolioDraftSubmit(e) {
        setPortfolioDraftLoading(true);
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'portfolio_item/' + e + '?user_id=' + currentUser + '&token=' + token, { status: 'Draft' }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                toast.success('Design saved as draft successfully!');
                setReloadCount((prevReloadCount) => prevReloadCount + 1);
                setPortfolioDraftLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setPortfolioDraftLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setPortfolioDraftLoading(false);
        });
    };

    async function PortfolioPublishSubmit(e) {
        setPortfolioPublishLoading(true);
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'portfolio_item/' + e + '?user_id=' + currentUser + '&token=' + token, { status: 'Active' }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                toast.success('Design published successfully!');
                setReloadCount((prevReloadCount) => prevReloadCount + 1);
                setPortfolioPublishLoading(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setPortfolioPublishLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setPortfolioPublishLoading(false);
        });
    };

    useEffect(() => {
        fetchData(currentUser);
    }, [reloadCount]);

    return (
        <LayoutSellerCenter>

            {portfolioLoading ?
                <LoadingPage />
                :
                <>
                    <section>
                        <Container fluid className='p-0'>
                            <Row className="portfolio-row bg-portfolio">
                                <Col lg={2}>
                                    <Sidebar />
                                </Col>

                                {portfolio && portfolio.length > 0 ?
                                    <>
                                        <Col lg={10} className='mt-5 col-right mx-auto' style={{maxWidth: '1440px'}}>
                                            <div className='ms-4'>
                                                <h2 className='fs-30 mb-3'>Portfolio</h2>
                                                <Row>
                                                    {portfolio.map((object, index) => (
                                                        <Col className={`portfolio-grid-image mb-3`} xs="4" md="2">
                                                            <div className={`portfolio-grid-div w-100 ${object.collection_type == "Limited" ? "limited" : " "} ${object.status == "Draft" ? "draft" : ""}`} style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'portfolio/' + object.image_urls[0].image_url + ")" }}>
                                                                <div className="portfolio-overlay">
                                                                    <div className="portfolio-actions">
                                                                        <BsThreeDots className="cursor-pointer action-menu" color="#ffffff" size="30px" onClick={() => handleActionClick(index)} />
                                                                        {selectedItemIndex === index && (
                                                                            <div className="action-box">
                                                                                <Link className="text-decoration-none" to={`/portfolio/${object.id}/edit`}>
                                                                                    <p className="mb-3 text-decoration-none"><GoPencil /> Edit</p>
                                                                                </Link>
                                                                                <p className="mb-3"><GoTrash /> Delete</p>
                                                                                {object.status != "Draft" ?
                                                                                    <p className="mb-0 cursor-pointer" onClick={function () { PortfolioDraftSubmit(object.id); }}><IoDocumentOutline /> {portfolioDraftLoading ? "Drafting..." : "Draft"}</p>
                                                                                    :
                                                                                    <p className="mb-0 cursor-pointer" onClick={function () { PortfolioPublishSubmit(object.id); }}><IoDocumentOutline /> {portfolioPublishLoading ? "Publishing..." : "Publish"}</p>
                                                                                }

                                                                                {/* Add other actions as needed */}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="portfolio-details">
                                                                        {/* <span className="text-white text-decoration-none">{object.name ?? "-"}</span> */}
                                                                        <div className="other-actions">

                                                                            <div className="action-button bg-white me-2">
                                                                                <GoBookmark className="text-black" />
                                                                            </div>

                                                                            <div className="action-button bg-white">
                                                                                <GoHeart className="text-black" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <Link to={`/portfolio/${object.id}`} className="text-decoration-none">
                                                                    <div className="portfolio-overlay" style={{ background: 'transparent', height: '85%', bottom: 0 }}></div>
                                                                </Link>
                                                            </div>

                                                            <div className='d-flex mt-2'>
                                                                <div className="text-black text-decoration-none ellipsis rufina-family fs-18">{object.name ?? "-"}</div>
                                                                <div><GoHeart className="text-black ms-3" /></div>
                                                                <div><IoEyeOutline className="text-black ms-2" /> {object.views}</div>
                                                            </div>
                                                        </Col>
                                                    ))}

                                                    <Col className="portfolio-grid mb-3" xs="4" md="2">
                                                        <div onClick={addNewPortfolio} className="portfolio-grid-div add-more-box w-100 text-center cursor-pointer background-dashed">
                                                            <GoPlus color="#a4a4a4" size="150px" className="mt-3" />
                                                            <p className="text-dgray" style={{ marginTop: '-15px' }}>Add More</p>
                                                        </div>
                                                    </Col>

                                                </Row>
                                            </div>
                                        </Col>


                                    </>
                                    :
                                    <>
                                        <div className="text-center">
                                            <p className="text-center mb-3 mt-3">No records found.</p>
                                            <Link to="/portfolio/add">
                                                <Button className="btn btn-primary">Add Portfolio</Button>
                                            </Link>
                                        </div>
                                    </>
                                }
                            </Row>
                        </Container>
                    </section>
                </>
            }
        </LayoutSellerCenter >
    );
};

export default Portfolio;