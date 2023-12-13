import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Card, CardBody, CardFooter, ModalHeader, ModalBody, Modal } from 'reactstrap';
import PortfolioWhiteDress from 'Assets/images/white-dress.png';
import toast from 'react-hot-toast';
import GetUserPortfolioData from 'Utils/GetUserPortfolioData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";
import { IoDocumentOutline } from "react-icons/io5";
import Loading from './Loading';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const PortfolioGrid = (props) => {
    const navigate = useNavigate();
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [portfolio, setPortfolio] = useState([]);
    const [portfolioLoading, setPortfolioLoading] = useState(true);
    const [portfolioDraftLoading, setPortfolioDraftLoading] = useState(false);
    const [portfolioPublishLoading, setPortfolioPublishLoading] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [deleteConfirmShow, setDeleteConfirmShow] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'token']);
    const [portfolioId, setPortfolioId] = useState(''); 

    const currentUser = cookies.currentUser;
    const token = cookies.token;

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

    const addPortfolio = () => {
        navigate('/portfolio/add')
    };

    const deleteConfirm = (e) => {
        setDeleteConfirmShow(true);
        setPortfolioId(e);
    }

    async function PortfolioDraftSubmit(e) {
        setPortfolioDraftLoading(true);
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'portfolio_item/'+e+'?user_id=' + currentUser + '&token=' + token, { status: 'Draft' }).then((response) => {
            const success = response.data.status;
            if(success == 'Success') {
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
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'portfolio_item/'+e+'?user_id=' + currentUser + '&token=' + token, { status: 'Active' }).then((response) => {
            const success = response.data.status;
            if(success == 'Success') {
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
                                                <div className={`portfolio-grid-div w-100 ${object.collection_type == "Limited" ? "limited" : " "} ${object.status == "Draft" ? "draft" : ""}`} style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'portfolio/'+object.image_urls[0].image_url+")"}}>
                                                    <div className="portfolio-overlay">
                                                        <div className="portfolio-actions">
                                                            <BsThreeDots className="cursor-pointer action-menu" color="#ffffff" size="30px" onClick={() => handleActionClick(index)} />
                                                            {selectedItemIndex === index && (
                                                                <div className="action-box">
                                                                    <Link className="text-decoration-none" to={`/portfolio/${object.id}/edit`}>
                                                                        <p className="mb-3 text-decoration-none"><GoPencil /> Edit</p>
                                                                    </Link>
                                                                    <p className="mb-3 cursor-pointer" onClick={function() { deleteConfirm(object.id); }}><GoTrash  /> Delete</p>
                                                                    {object.status != "Draft" ?
                                                                        <p className="mb-0 cursor-pointer" onClick={function() {PortfolioDraftSubmit(object.id);}}><IoDocumentOutline /> {portfolioDraftLoading ? "Drafting..." : "Draft"}</p>
                                                                        :
                                                                        <p className="mb-0 cursor-pointer" onClick={function() {PortfolioPublishSubmit(object.id);}}><IoDocumentOutline /> {portfolioPublishLoading ? "Publishing..." : "Publish"}</p>
                                                                    }
                                                                    
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
            {/* Confirm Delete */}
            {/* <Modal
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
                            <p className="">Are you sure you want to delete this?</p>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal> */}
        </>
    );
};

export default PortfolioGrid;