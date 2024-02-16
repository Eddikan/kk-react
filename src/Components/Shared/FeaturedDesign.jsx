import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import GetUserPortfolioData from 'Utils/GetUserPortfolioData';
import { GoHeart } from "react-icons/go";
import PlaceholderImage from 'Assets/images/placeholders/image.png';
import { useLocation } from 'react-router-dom';
import Loading from './Loading';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const PortfolioGrid = (props) => {
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState([]);
    const [portfolioLoading, setPortfolioLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);
    const [isClicked, setIsClicked] = useState(false);

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const token = cookies.token;


    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery();
    const user_id = query.get('user_id');

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

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

    async function wishlistUpdate(e) {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'wishlist/update', e).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                fetchData(user_id);
            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
        }).catch((error) => {
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

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

                                        // var portfolio_items = portfolio.portfolio_items;
                                        // const userWishlist = portfolio_items.includes(user_id);

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
                                                                    {/* {userWishlist ?
                                                                        <div className="action-button bg-gold" onClick={function () { wishlistUpdate({ user_id: user_id, portfolio_items: portfolio.id }); }}>
                                                                            <GoHeart className="text-white" />
                                                                        </div>
                                                                        :
                                                                        <div className="action-button bg-white" onClick={function () { wishlistUpdate({ user_id: user_id, portfolio_items: portfolio.id }); }}>
                                                                            <GoHeart className="text-black" />
                                                                        </div>
                                                                    } */}
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