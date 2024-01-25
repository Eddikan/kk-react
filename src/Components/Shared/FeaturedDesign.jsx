import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import { Card, CardBody, CardFooter, ModalHeader, ModalBody, Modal } from 'reactstrap';
import toast from 'react-hot-toast';
import GetUserPortfolioData from 'Utils/GetUserPortfolioData';
import { GoPencil, GoHeart } from "react-icons/go";
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import { useLocation } from 'react-router-dom';
import Loading from './Loading';
import { useCookies } from 'react-cookie';

const PortfolioGrid = (props) => {
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState([]);
    const [portfolioLoading, setPortfolioLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);


    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery();
    const user_id = query.get('user_id');

    const fetchData = async (e) => {
        setPortfolioLoading(true);
        try {
            const portfolioData = await GetUserPortfolioData(e);
            if (portfolioData) {
                setPortfolio(portfolioData);
                setPortfolioLoading(false);

                console.log(portfolioData);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setPortfolioLoading(false);
            }
        } catch (error) {
            toast.error('An error occured. Please try again or contact the administrator.');
            setPortfolioLoading(false);
        }
    };


    useEffect(() => {
        fetchData(user_id);
    }, [reloadCount]);

    return (
        <>
            <div id="profile-portfolio">
                {portfolioLoading ?
                    <>
                        <p className='text-center mb-3 mt-3'>
                            <Loading className="bg-white loading-featured-design" />
                        </p>
                    </>
                    :
                    <>
                        {portfolio && portfolio.length > 0 ?
                            <>
                                <Row className="portfolio-row">

                                    {portfolio.slice(0, 3).map((object, index) => {
                                        if (object.image_urls?.[0]?.image_url) {
                                            var portfolioImage = process.env.REACT_APP_STORAGE_URL + 'portfolio/' + object.image_urls[0].image_url;
                                        } else {
                                            var portfolioImage = PlaceholderImage;
                                        }

                                        return (
                                            <Col className={`mb-0`} lg="4">
                                                <div className={`portfolio-grid-featured w-100 ${object.collection_type == "Limited" ? "limited" : " "} ${object.status == "Draft" ? "draft" : ""}`} style={{ backgroundImage: "url(" + portfolioImage + ")" }}>
                                                    <div className="portfolio-overlay">
                                                        <div className="portfolio-details">
                                                            {object.status == "Draft" ?
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
                                                    <Link to={`/portfolio/${object.id}`} className="text-decoration-none">
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

export default PortfolioGrid;