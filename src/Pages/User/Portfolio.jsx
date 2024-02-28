import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import Container from 'react-bootstrap/Container';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col, Button, Card, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import GetUserPortfolioData from 'Utils/GetUserPortfolioData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import { IoDocumentOutline, IoEyeOutline } from "react-icons/io5";
import '../../Assets/styles/Portfolio/ViewPortFolio/style.css';
import GoBack from '../../Components/Shared/GoBack';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import LoadingPage from 'Components/Shared/LoadingPage';
import Sidebar from 'Components/Shared/Sidebar';
import LayoutSellerCenter from 'Components/Layout/LayoutSellerCenter';

const Portfolio = (props) => {
    const navigate = useNavigate();
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [portfolio, setPortfolio] = useState([]);
    const [portfolioLoading, setPortfolioLoading] = useState(true);
    const [portfolioDraftLoading, setPortfolioDraftLoading] = useState(false);
    const [portfolioPublishLoading, setPortfolioPublishLoading] = useState(false);
    const [portfolioDeleteLoading, setPortfolioDeleteLoading] = useState(false);
    const [deleteConfirmShow, setDeleteConfirmShow] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [portfolioId, setPortfolioId] = useState('');
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

    const deleteConfirm = (e) => {
        setDeleteConfirmShow(true);
        setPortfolioId(e);
    };

    const handleActionClick = (index) => {
        // Toggle the selected item index
        setSelectedItemIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const addNewPortfolio = () => {
        navigate('/user/center/design/add')
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

    async function PortfolioDeleteSubmit(e) {
        setPortfolioDeleteLoading(true);
        axios.delete(process.env.REACT_APP_API_ENDPOINT + 'portfolio_item/' + portfolioId + '?user_id=' + currentUser + '&token=' + token).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                toast.success('Design deleted successfully!');
                setReloadCount((prevReloadCount) => prevReloadCount + 1);
                setPortfolioDeleteLoading(false);
                setDeleteConfirmShow(false);
            } else {
                toast.error('An error occured. Please try again or contact the administrator.');
                setPortfolioDeleteLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setPortfolioDraftLoading(false);
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
                                        <Col lg={10} className='mt-5 col-right mx-auto' style={{ maxWidth: '1440px' }}>
                                            <div className='ms-4'>

                                                <Row>
                                                    <Col lg={12}>
                                                        <Row className="pb-4">
                                                            <Col lg={10} className='d-flex justify-content-left align-items-center'>
                                                                <h3 className="fs-30 fw-600 text-black mb-0">Portfolio</h3>
                                                            </Col>

                                                            <Col lg={2} className='text-right'>
                                                                <GoBack fallBack="/" />
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    {portfolio.map((object, index) => (
                                                        <Col className={`portfolio-grid-image mb-3`} xs="4" md="2">
                                                            <div className={`portfolio-grid-div w-100 ${object.collection_type == "Limited" ? "limited" : " "} ${object.status == "Draft" ? "draft" : ""}`}
                                                                style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'portfolio/' + object.image_urls[0].image_url + ")" }}
                                                            >
                                                                <div className="portfolio-overlay">
                                                                    <div className="portfolio-actions">
                                                                        <BsThreeDots className="cursor-pointer action-menu" color="#ffffff" size="30px" onClick={() => handleActionClick(index)} />
                                                                        {selectedItemIndex === index && (
                                                                            <div className="action-box">
                                                                                <Link className="text-decoration-none" to={`/user/center/design/${object.id}/edit`}>
                                                                                    <p className="mb-3 text-decoration-none"><GoPencil /> Edit</p>
                                                                                </Link>
                                                                                <Link className="text-decoration-none" to={`/portfolio/${object.id}`}>
                                                                                    <p className="mb-3 text-decoration-none"><IoEyeOutline /> Preview</p>
                                                                                </Link>
                                                                                <p className="mb-3 cursor-pointer"
                                                                                    onClick={function () { deleteConfirm(object.id); }}
                                                                                >
                                                                                    <GoTrash /> Delete</p>
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
                                                                        <div className="other-actions">
                                                                            {object.user === currentUser && (
                                                                                <>
                                                                                    <div className="action-button bg-white me-2">
                                                                                        <GoBookmark className="text-black" />
                                                                                    </div>
                                                                                    <div className="action-button bg-white">
                                                                                        <GoHeart className="text-black" />
                                                                                    </div>
                                                                                </>
                                                                            )}

                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <Link to={`/user/center/design/${object.id}/edit`} className="text-decoration-none">
                                                                    <div className="portfolio-overlay" style={{ background: 'transparent', height: '85%', bottom: 0 }}></div>
                                                                </Link>
                                                            </div>

                                                            <Row>
                                                                <Col lg="6">
                                                                    <div className="text-black text-decoration-none ellipsis-portfolio-seller rufina-family fs-18 mt-2">{object.name ?? "-"}</div>
                                                                </Col>

                                                                <Col lg="6" className='text-end'>
                                                                    {object.views == null ?
                                                                        <div className='mt-2'>
                                                                            <IoEyeOutline className="text-black ms-2" /> 0
                                                                        </div>
                                                                        :
                                                                        <div className='mt-2'>
                                                                            <IoEyeOutline className="text-black ms-2" /> {object.views}
                                                                        </div>
                                                                    }
                                                                </Col>
                                                            </Row>
                                                            {/* <div className='d-flex mt-2'>
                                                                <div className="text-black text-decoration-none ellipsis rufina-family fs-18">{object.name ?? "-"}</div>
                                                                <div><GoHeart className="text-black ms-3" /></div>

                                                                {object.views == null ?
                                                                    <div>
                                                                        <IoEyeOutline className="text-black ms-2" /> 0
                                                                    </div>
                                                                    :
                                                                    <div>
                                                                        <IoEyeOutline className="text-black ms-2" /> {object.views}
                                                                    </div>
                                                                }
                                                                <div><IoEyeOutline className="text-black ms-2" /> {object.views}</div>
                                                            </div> */}
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
                                            <Link to="/user/center/design/add">
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

            <Modal
                show={deleteConfirmShow}
                className='modal-preview'
                fade={false}
                centered
            >
                <Modal.Header className="pb-0">

                    <Modal.Title className='rufina-family fs-22 text-black'>Confirm Delete</Modal.Title>
                    <button type='button' className='close react-modal-close' onClick={function () { setDeleteConfirmShow(false); }} data-dismiss='modal' aria-label='Close'>
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>

                    {/* <h5 className='modal-title text-left fs-25'>Confirm Delete</h5>
                    <button type='button' className='close react-modal-close' onClick={function () { setDeleteConfirmShow(false); }} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button> */}
                </Modal.Header>
                {/* <hr className="mt-0 mb-0" /> */}

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <p className="mb-0">Are you sure you want to delete this design?</p>
                        </Card.Body>
                    </Card>
                    <Card.Footer className="text-right mt-3">
                        <button className="btn btn-secondary border-black bg-white text-black me-3" onClick={() => setDeleteConfirmShow(false)} type="button" style={{ minWidth: '100px', padding: '9px 20px' }}>Cancel</button>
                        {portfolioDeleteLoading ?
                            <button className="btn btn-primary" type="button" style={{ minWidth: '100px', padding: '9px 20px' }}>Deleting...</button>
                            :
                            <button className="btn btn-primary delete-btn" type="button" onClick={PortfolioDeleteSubmit} style={{ minWidth: '100px', padding: '9px 20px' }}>Delete</button>
                        }
                    </Card.Footer>
                </Modal.Body>
            </Modal>
        </LayoutSellerCenter >
    );
};

export default Portfolio;