import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';
import { ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useCookies } from 'react-cookie';
import { useLocation } from 'react-router-dom';
import '../Assets/styles/DesignerProfile/style.css';
import PinIcon from 'Assets/images/pin.png';
import UserPlaceholder from 'Assets/images/user.png';
import Loading from 'Assets/images/loading.gif'
import GetUserData from 'Utils/GetUserData';
import toast from 'react-hot-toast';
import PortfolioGrid from 'Components/Shared/PortfolioGrid';
import FeaturedDesign from 'Components/Shared/FeaturedDesign'
import TopSellingFabrics from 'Components/Shared/TopSellingFabrics';
import ProductGrid from 'Components/Shared/ProductGrid';
import LoadingPage from 'Components/Shared/LoadingPage';
import DesignerCalendar from 'Components/Shared/DesignerCalendar';
import { GoAlertFill } from 'react-icons/go';
import { PiNotepadFill } from "react-icons/pi";
import { IoCloseOutline, IoVideocam } from "react-icons/io5";
import { AiFillMessage } from "react-icons/ai";
import { LiaSmileBeam } from "react-icons/lia";
import { IoIosAttach } from "react-icons/io";
import { VscSend } from "react-icons/vsc";
import { FaUserCircle } from "react-icons/fa";

const initialUserData = Object.freeze({
    is_designer: 0,
    is_tailor: 0,
    is_seller: 0,
    email: '',
    short_bio: '',
    long_bio: '',
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    province: '',
    postal_code: '',
    country: '',
    website: '',
    phone_number: '',
    secondary_email_address: '',

});

const initialDesignerData = Object.freeze({
    design_inspirations: '',
    design_process: '',
    areas_of_specialization: '',
    lead_time: '',
    pricing_structure: '',
});

const DesignerProfile = () => {
    const [user, setUser] = useState(initialUserData);
    const [designer, setDesigner] = useState(initialDesignerData);
    const [userLoading, setUserLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);
    const [chatBox, setChatBox] = useState(false);
    const [aboutShow, setAboutShow] = useState(true);
    const [portfolioShow, setPortfolioShow] = useState(false);
    const [fabricShow, setFabricShow] = useState(false);
    const [calendarShow, setCalendarShow] = useState(false);
    const [processShow, setProcessShow] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);
    const [areasOfSpecialization, setAreaOfSpecialization] = useState([]);
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [seller, setSeller] = useState([]);
    const [requestAQuoteModal, setRequestAQuoteModal] = useState(false);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [activeImage, setActiveImage] = useState('');

    const [portfolio, setPortfolio] = useState('');
    const [images, setImages] = useState([]);


    const currentUser = cookies.currentUser;
    const token = cookies.token;
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery();
    const user_id = query.get('user_id');

    // User Image
    const [userImage, setUserImage] = useState();
    const [uploadStatus, setUploadStatus] = useState("standby");


    const chatBoxModal = (e) => {
        setChatBox(true);
    };

    function toggleRequestAQuote(message) {
        setRequestAQuoteModal(true);
        setModalHeading(message);
    }

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }


    const showTab = (tab) => {
        if (tab == "about") {
            setAboutShow(true);
            setPortfolioShow(false);
            setFabricShow(false);
            setProcessShow(false);
            setCalendarShow(false);
        } else if (tab === "portfolio") {
            setPortfolioShow(true);
            setAboutShow(false);
            setFabricShow(false);
            setProcessShow(false);
            setCalendarShow(false);
        } else if (tab === "fabric") {
            setFabricShow(true);
            setPortfolioShow(false);
            setAboutShow(false);
            setProcessShow(false);
            setCalendarShow(false);
        } else if (tab === "calendar") {
            setProcessShow(false);
            setPortfolioShow(false);
            setAboutShow(false);
            setFabricShow(false);
            setCalendarShow(true);
        }
    }

    const fetchData = async (e) => {
        try {
            const userData = await GetUserData(e);
            if (userData.id) {
                setUser(userData);
                setUserImage(userData.image);
                setImages(userData.image_urls);
                setCookie('userDetails', JSON.stringify(userData), { path: '/' });
                if (userData.designer) {
                    setDesigner(userData.designer);
                    setAreaOfSpecialization(userData.designer.areas_of_specialization);
                    setPortfolioItems(userData.portfolio_items);
                    setSeller(userData.seller);
                }
                setUserLoading(false);
            } else {
                setUserLoading(false);
                toast.error('An error occured. Please try again or contact the administrator.');
                console.log(userData);
            }
        } catch (error) {
            setUserLoading(false);
            toast.error('An error occured. Please try again or contact the administrator.');
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData({ token: token, currentUser: user_id });
    }, [reloadCount]);

    return (
        <Layout>
            {userLoading ?
                <LoadingPage />
                :
                <section id='designer-profile' className='py-5 px-2'>
                    <Container>
                        <Row>
                            <Col lg="6" className='mb-5'>
                                <div className='d-flex column-gap-20'>
                                    <div className='text-left position-relative'>
                                        {uploadStatus != "standby" ?
                                            <div className="profile-image" style={{ backgroundImage: "url(" + Loading + ")", backgroundColor: '#f5f6f8' }}></div>
                                            :
                                            <>
                                                {userImage ?
                                                    <div className="profile-image" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'user/' + userImage + ")" }}></div>
                                                    :
                                                    <div className="profile-image" style={{ backgroundImage: "url(" + UserPlaceholder + ")" }}></div>
                                                }
                                            </>
                                        }
                                    </div>

                                    <div>
                                        <h2 className='fs-30 mb-2'>
                                            {user.first_name || user.last_name ?
                                                <span>{user.first_name} {user.last_name}</span>
                                                :
                                                <span>-</span>
                                            }
                                            <AiFillMessage className="ms-3 cursor-pointer" size={20} color="#CEA835" onClick={() => toggleUnderConstruction("Chat Designer")} />
                                        </h2>
                                        <div className='icons-d-flex'>
                                            <img src={PinIcon} alt="location pin" />
                                            {user.city || user.province || user.country ?
                                                <p className='fs-16 place-family'>
                                                    {user.city ? user.city + ',' : ""} {user.province ? user.province + "," : ""} {user.country ? user.country : ""}
                                                </p>
                                                :
                                                <p className='fs-16 color-light-blue'>-</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            <Col lg="6" className='text-right'>
                                <span>
                                    <p className='btn request-quote-btn mb-0 cursor-pointer fs-16 fw-400 bg-transparent text-black request-a-quote'
                                        onClick={() => toggleRequestAQuote(true)}
                                    >
                                        <PiNotepadFill color="#000000" className='me-2 pi-note-pad' size="20" />
                                        Request A Quote
                                    </p>
                                </span>

                                <span className='w-100'>
                                    <a
                                        // onClick={() => toggleUnderConstruction("Schedule A Consultation")}
                                        href={`/appointment/schedule/${designer.id}`}
                                        className='btn ms-3 btn-primary fs-16 fw-400 consultation-btn'
                                    >
                                        <IoVideocam color="#ffffff" className='me-2' size="20" />Schedule A Consultation</a>
                                </span>
                            </Col>

                            <Col lg="12" className='mt-4'>
                                <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${aboutShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("about"); }}>About</span>
                                {user.is_designer == 1 && (
                                    <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${portfolioShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("portfolio"); }}>Portfolio</span>
                                )}
                                {user.is_seller == 1 && (
                                    <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${fabricShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("fabric") }}>Fabrics</span>
                                )}
                                <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${calendarShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("calendar"); }}>Calendar</span>
                                <hr className='mt-2' />
                            </Col>
                        </Row>

                        {aboutShow ?
                            <div id="about-portfolio" className='mt-3'>
                                <Row>
                                    <Col lg="6">
                                        <p className='mb-2 fw-600 text-black'>Title</p>
                                        <p className='mb-4 text-black'>
                                            {user.short_bio && user.short_bio != "" ? user.short_bio : "-"}
                                        </p>
                                        <p className='mb-1 fw-600 text-black'>Long Bio</p>
                                        <p className='mb-5 text-black'>
                                            {user.long_bio && user.long_bio != "" ? user.long_bio : "-"}
                                        </p>
                                        {user.is_designer ?
                                            <>
                                                <p className='mb-3 fw-600 text-black'>Areas of Specialization and Expertise</p>
                                                <div className='mb-4'>
                                                    {areasOfSpecialization && areasOfSpecialization.length > 0 ?
                                                        <>
                                                            {areasOfSpecialization.map((item, index) => (
                                                                <span className='text-gray 600 fs-14 bg-gray item-designer'>{item}</span>
                                                            ))}
                                                        </>
                                                        :
                                                        null
                                                    }
                                                </div>
                                            </>
                                            :
                                            null
                                        }
                                    </Col>

                                    <Col lg="6">
                                        {user.is_designer == 1 && (

                                            <div className='bg-lgray profile-featured  mb-4'>
                                                <div className='d-flex justify-content-between'>
                                                    <span className='fs-16 fw-600 text-black'>Featured Designs</span>
                                                </div>
                                                <FeaturedDesign currentUser={user_id} reloadCount={reloadCount} />
                                            </div>
                                        )}

                                        {user.is_seller == 1 && (
                                            <div className='bg-lgray profile-top-selling '>
                                                <div className='d-flex justify-content-between'>
                                                    <span className='fs-16 fw-600 text-black'>Top Selling Fabrics</span>
                                                </div>
                                                <TopSellingFabrics currentUser={user_id} reloadCount={reloadCount} />
                                            </div>
                                        )
                                        }
                                    </Col>

                                </Row>
                            </div>
                            :
                            null
                        }
                        {portfolioShow ?
                            <div className='mt-3'>
                                <PortfolioGrid currentUser={user_id} reloadCount={reloadCount} />
                            </div>
                            :
                            null
                        }
                        {fabricShow ?
                            <div className='mt-3'>
                                <ProductGrid currentUser={user_id} reloadCount={reloadCount} />
                            </div>
                            :
                            null
                        }

                        {calendarShow ?
                            <div className='mt-3'>
                                <DesignerCalendar />
                            </div>
                            :
                            null
                        }

                        {chatBox ?
                            <>
                                <Card className='width-chat-card px-0'>
                                    <Card.Header className='header-chat bg-white'>
                                        <div className='d-flex justify-content-between'>
                                            <div>
                                                <span className='fw-500'>Dave Napoles</span>
                                                <span className='ms-2 active-now fs-14 fw-400'>Active Now</span>
                                            </div>
                                            <div className="cursor-pointer" onClick={() => setChatBox(false)}>
                                                <IoCloseOutline color="#39393A" />
                                            </div>
                                        </div>
                                    </Card.Header>

                                    <Card.Body >
                                        <div className='product-portfolio-image'>
                                            <span className='d-flex'>
                                                {images && images.length > 0 ?
                                                    <>
                                                        <div className="single-image-chat" style={{ backgroundImage: "url(" + activeImage + ")" }}>
                                                        </div>
                                                        <span className='name-of-portfolio ms-3 d-flex justify-content-center align-items-center'>{user.name ?? "-"}</span>
                                                    </>
                                                    :
                                                    null
                                                }
                                            </span>
                                        </div>

                                        <div>
                                            <div className='mt-4 d-flex portfolio-designer-chat'>
                                                {/* {portfolio.user.image && (
                                                    <div
                                                        className='designer-photo'
                                                        style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${portfolio.user.image})` }}
                                                    >
                                                    </div>
                                                )} */}
                                                <div className="designer-info mx-2">
                                                    <div>
                                                        {/* <p className="fs-14 fw-600 mb-0 name-of-user-chat ms-2">{portfolio.user.first_name && portfolio.user.first_name != "" ? portfolio.user.first_name : "-"} {portfolio.user.last_name && portfolio.user.last_name != "" ? portfolio.user.last_name : "-"}
                                                            <span className='ms-3 fs-14 time-chat fw-400'>2:23 PM</span>
                                                        </p> */}
                                                    </div>

                                                    <div className='fs-14 ms-2 mt-2 name-of-user-chat'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam.</div>
                                                </div>

                                            </div>
                                        </div>


                                        <div className='mt-5 mb-4 text-right d-flex'>
                                            <div>
                                                <div className='time-chat-box fs-14 fw-400'>3:30 PM
                                                    <span className='ms-2 you-chat-box fw-600 fs-14'>You</span></div>
                                                <div className='mt-2 welcome-chat'>
                                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                                                </div>
                                            </div>

                                            <div className=' d-flex align-items-center portfolio-designer ms-3'>
                                                {/* {portfolio.user.image && (
                                                    <div
                                                        className='designer-photo'
                                                        style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${portfolio.user.image})` }}
                                                    >
                                                    </div>
                                                )} */}
                                            </div>
                                        </div>

                                        <div className='mt-3'>
                                            <input type="text" className='form-control' />
                                        </div>

                                        <div className='mt-3 d-flex justify-content-between'>
                                            <div className='d-flex'>
                                                <div className='cursor-pointer'><LiaSmileBeam className='me-2' /></div>
                                                <div className='cursor-pointer'><IoIosAttach /></div>
                                            </div>
                                            <div>
                                                <div
                                                    className="cursor-pointer fw-500"
                                                    onClick={() => toggleUnderConstruction("Send Message")}
                                                >
                                                    Send
                                                    <VscSend className='ms-1' />
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </>
                            :
                            null
                        }

                    </Container>
                </section>
            }

            <Modal
                show={requestAQuoteModal}
                className='modal-preview'
                fade={false}
                size="sm"
            >
                <ModalHeader className='pt-2 pb-2'>
                    <h5 className='modal-title text-left fs-25 rufina-family fw-600 '>New Quote</h5>
                    <button type='button' className='close react-review-items-close' data-dismiss='modal' aria-label='Close' onClick={() => setRequestAQuoteModal(false)}>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                </ModalHeader>
                <hr className="mt-0 mb-0" />
                <Modal.Body className='pt-4 pb-2'>
                    <Row>
                        <Col>
                            <div className='mb-2'>Title</div>
                            <div>
                                <input type="text" className='form-control' name="title" />
                            </div>

                            <div className='mt-3 mb-2'>Details</div>
                            <div>
                                <textarea
                                    type="text"
                                    name="description"
                                    className="d-block form-control bg-white"
                                    placeholder='Provide design details'
                                />
                            </div>

                            <div
                                className="image-drop-container-quote cursor-pointer mt-4"
                            // onDrop={handleDrop}
                            // onDragOver={handleDragOver}
                            >
                                <input
                                    // type="file"
                                    // key={fileInputKey} // Add a key to the file input
                                    id="fileInput"
                                    // onChange={handleFileInput}
                                    className="file-input d-block opacity-0"
                                    accept="image/*"
                                    multiple
                                />
                                <label
                                    htmlFor="fileInput"
                                    className="file-label d-block text-center cursor-pointer"
                                >
                                    <p className="text-black rufina-family fs-18 mb-3 fw-600">Design Preference</p>
                                    <p className="text-black fs-16 mb-3">Share your design preferences to the designer.</p>
                                    <button
                                        className="btn btn-primary mb-4"
                                        onClick={() => { toggleUnderConstruction("Upload Design"); setRequestAQuoteModal(false); }}
                                    >
                                        Upload Design
                                    </button>
                                </label>
                            </div>
                        </Col>
                    </Row>

                </Modal.Body>
                <ModalFooter className='mt-4'>
                    <div className='text-right'>
                        <Button className="cancel-btn me-2" onClick={() => setRequestAQuoteModal(false)}>Cancel</Button>
                        <Button className="btn-save" onClick={() => { toggleUnderConstruction("Request a Quote"); setRequestAQuoteModal(false); }}>Request a Quote</Button>
                    </div>
                </ModalFooter>
            </Modal>

            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button type='button' className='close react-modal-close' onClick={() => setUnderConstructionShow(false)} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='fs-25 fw-600 mb-3'>{modalHeading}</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        </Layout>
    );
};

export default DesignerProfile;