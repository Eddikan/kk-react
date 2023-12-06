import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import PortfolioWhiteDress from 'Assets/images/white-dress.png';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import getPortfolioData from 'Utils/GetPortfolioData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark } from "react-icons/go";
import { IoDocumentOutline } from "react-icons/io5";

const PortfolioGrid = (props) => {
    const reloadCount = props.reloadCount;
    const currentUser = props.currentUser;
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [portfolio, setPortfolio] = useState([]);

    const fetchData = async (e) => {
        try {
          const portfolioData = await getPortfolioData(e);
          if (portfolioData) {
            setPortfolio(portfolioData);
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

    useEffect(() => {
        fetchData(currentUser);
    }, [reloadCount]);

    return (
        <>
            <div id="profile-portfolio">
                {portfolio && portfolio.length > 0 ?
                    <>
                        <Row className="portfolio-row">
                            {/* <img src={object.url} className='portfolio-img'/> */}
                            {portfolio.map((object, index) => (
                                <Col className="portolio-grid mb-3" xs="4" md="2">
                                    <div className="portfolio-grid-div w-100" style={{ backgroundImage: "url(" + PortfolioWhiteDress + ")" }}>
                                        <div className="portfolio-overlay">
                                            <div className="portfolio-actions">
                                                <BsThreeDots className="cursor-pointer action-menu" color="#ffffff" size="30px" onClick={() => handleActionClick(index)} />
                                                {selectedItemIndex === index && (
                                                    <div className="action-box">
                                                        <p className="mb-2"><GoPencil /> Edit</p>
                                                        <p className="mb-2"><GoTrash  /> Delete</p>
                                                        <p className="mb-0"><IoDocumentOutline /> Draft Design</p>
                                                        {/* Add other actions as needed */}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="portfolio-details">
                                                <span className="text-white">{object.stage ?? "Lorem ipsum"}</span>
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
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </>
                    :
                    <p>No records found.</p>
                }
            </div>
        </>
    );
};

export default PortfolioGrid;