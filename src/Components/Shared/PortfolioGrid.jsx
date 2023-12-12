import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import PortfolioWhiteDress from 'Assets/images/white-dress.png';
import toast from 'react-hot-toast';
import GetUserPortfolioData from 'Utils/GetUserPortfolioData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";
import { IoDocumentOutline } from "react-icons/io5";
import Loading from './Loading';

const PortfolioGrid = (props) => {
    const navigate = useNavigate();
    const reloadCount = props.reloadCount;
    const currentUser = props.currentUser;
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [portfolio, setPortfolio] = useState([]);
    const [portfolioLoading, setPortfolioLoading] = useState(true);

    const fetchData = async (e) => {
        try {
          const portfolioData = await GetUserPortfolioData(e);
          if (portfolioData) {
            setPortfolio(portfolioData);
            setPortfolioLoading(false);
          } else {
            toast.error('Fail!');
          }
          // Update state or perform other logic with userData
        } catch (error) {
            toast.error('Fail!');
          // Handle the error, if needed
        }
    };

    const handleActionClick = (index) => {
        // Toggle the selected item index
        setSelectedItemIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const addPortfolio = () => {
        navigate('/portfolio/add')
    }

    useEffect(() => {
        fetchData(currentUser);
    }, [reloadCount]);

    return (
        <>
            <div id="profile-portfolio">
                {portfolioLoading ?
                    <>
                        <p className='text-center mb-3 mt-3'>
                            <Loading className="bg-white" />
                        </p>
                    </>
                    :
                    <>
                        {portfolio && portfolio.length > 0 ?
                            <>
                                <Row className="portfolio-row">
                                    {/* <img src={object.url} className='portfolio-img'/> */}
                                    {portfolio.map((object, index) => (
                                        <Col className={`portfolio-grid mb-3`} xs="4" md="2">
                                                <div className={`portfolio-grid-div w-100 ${object.collection_type == "Limited" ? "limited" : ""}`} style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'portfolio/'+object.image_urls[0].image_url+")"}}>
                                                    <div className="portfolio-overlay">
                                                        <div className="portfolio-actions">
                                                            <BsThreeDots className="cursor-pointer action-menu" color="#ffffff" size="30px" onClick={() => handleActionClick(index)} />
                                                            {selectedItemIndex === index && (
                                                                <div className="action-box">
                                                                    <p className="mb-3"><GoPencil /> Edit</p>
                                                                    <p className="mb-3"><GoTrash  /> Delete</p>
                                                                    <p className="mb-0"><IoDocumentOutline /> Draft Design</p>
                                                                    {/* Add other actions as needed */}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="portfolio-details">
                                                            <span className="text-white text-decoration-none">{object.name ?? "-"}</span>
                                                            <div className="other-actions">
                                                                <div className="action-button bg-white me-2">
                                                                    <GoHeart className="text-black" />
                                                                </div>
                                                                <div className="action-button bg-white">
                                                                    <GoBookmark className="text-black" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Link to={`/portfolio/${object.id}`} className="text-decoration-none">
                                                        <div className="portfolio-overlay" style={{background: 'transparent', height: '85%', bottom: 0}}></div>
                                                    </Link>
                                                </div>
                                        </Col>
                                    ))}
                                    <Col className="portfolio-grid mb-3" xs="4" md="2">
                                        <div onClick={addPortfolio} className="portfolio-grid-div add-more-box w-100 text-center cursor-pointer background-dashed">
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
                                        <Button className="btn btn-primary">Add Portfolio</Button>
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

export default PortfolioGrid;