import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button, Card, Modal, NavItem } from 'react-bootstrap';
import { ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useCookies } from 'react-cookie';
import { useLocation } from 'react-router-dom';
import 'Assets/styles/DesignerProfile/style.css';
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
import { GoAlertFill, GoHeart } from 'react-icons/go';
import GoBack from 'Components/Shared/GoBack';
import { PiNotepadFill } from "react-icons/pi";
import { IoCloseOutline, IoVideocam } from "react-icons/io5";
import { AiFillMessage } from "react-icons/ai";
import InputEmoji from 'react-input-emoji';
import { IoIosAttach } from "react-icons/io";
import { VscSend } from "react-icons/vsc";
import ResponsiveEmbedVideo from 'Components/Shared/ResponsiveEmbeddedVideo';
import ResponsiveVideo from 'Components/Shared/ResponsiveVideo';
import MeetingChat from 'Components/Chat/MeetingChat';
import { BsBroadcast } from 'react-icons/bs';
import axios from 'axios';
import moment from 'moment';

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
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'userDetails', 'userRole']);
    const [areasOfSpecialization, setAreaOfSpecialization] = useState([]);
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [seller, setSeller] = useState([]);
    const [requestAQuoteModal, setRequestAQuoteModal] = useState(false);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [elements, setElements] = useState([]);
    const [designerSchedule, setDesignerSchedule] = useState([]);
    const [isDesignerCurrentUser, setIsDesignerCurrentUser] = useState(false);
    const [designerAvailable, setDesignerAvailable] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [customer, setCustomer] = useState('');
    const [appointmentId, setAppointmentId] = useState('');
    const [guidePreviewModalShow, setGuidePreviewModalShow] = useState(false);
    const [userWishlist, setUserWishlist] = useState(false);

    const currentUser = cookies.currentUser;
    const userDetails = cookies.userDetails;
    const userRole = cookies.userRole;
    const token = cookies.token;
    const activeProfileTab = cookies.activeProfileTab;

    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery();
    const user_id = query.get('user_id');

    // User Image
    const [userImage, setUserImage] = useState();
    const [uploadStatus, setUploadStatus] = useState("standby");

    const getBusinessHours = async (designerId) => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer/availability/' + designerId);
    };

    function toggleChatbox(id, first_name, last_name, image, message) {
        setChatBox(true);
        setAppointmentId(id.toString());
        setCustomer({
            id: id ?? 0,
            first_name: first_name ?? '-',
            last_name: last_name ?? '-',
            image: image ?? '-'
        });
        setModalHeading(message);
    }

    function toggleRequestAQuote(message) {
        setRequestAQuoteModal(true);
        setModalHeading(message);
    };

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    };

    const showTab = (tab) => {
        if (tab === "about") {
            setAboutShow(true);
            setPortfolioShow(false);
            setFabricShow(false);
            setProcessShow(false);
            setCalendarShow(false);
        } else if (tab == "portfolio") {
            setPortfolioShow(true);
            setAboutShow(false);
            setFabricShow(false);
            setProcessShow(false);
            setCalendarShow(false);
        } else if (tab == "fabric") {
            setFabricShow(true);
            setPortfolioShow(false);
            setAboutShow(false);
            setProcessShow(false);
            setCalendarShow(false);
        } else if (tab == "calendar") {
            setProcessShow(false);
            setPortfolioShow(false);
            setAboutShow(false);
            setFabricShow(false);
            setCalendarShow(true);
        }
    };

    const fetchData = async (e) => {
        try {
            const userData = await GetUserData(e);
            if (userData.id) {
                setUser(userData);
                setUserImage(userData.image);
                setImages(userData.image_urls);
                if (userData.measurement_guide) {
                    const measurementGuide = JSON.parse(userData.measurement_guide);
                    setElements(measurementGuide);
                }
                if (userData.designer) {
                    setDesigner(userData.designer);
                    setAreaOfSpecialization(userData.designer.areas_of_specialization);
                    setPortfolioItems(userData.portfolio_items);
                    setSeller(userData.seller);
                }

                if (currentUser == userData.id) {
                    setIsDesignerCurrentUser(true);
                } else {
                    setIsDesignerCurrentUser(false);
                }

                setUserLoading(false);
            } else {
                setUserLoading(false);
                toast.error('An error occured. Please try again or contact the administrator.');
            }
        } catch (error) {
            setUserLoading(false);
            toast.error('An error occured. Please try again or contact the administrator.');
        }
    };

    const toggleGuidePreviewModal = (e) => {
        setGuidePreviewModalShow(!guidePreviewModalShow);
    };

    // Function to format time to "8:00 AM" format
    const formatTime = (time) => {
        return moment(time, 'HH:mm').format('h:mm A');
    };

    async function wishlistDesignerUpdate(e) {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'designer/wishlist/update', e).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                setReloadCount(reloadCount + 1 )
            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
        }).catch((error) => {
            toast.error('Something went wrong, please contact the administrator!');
        });
    };

    useEffect(() => {
        fetchData({ token: token, currentUser: user_id });
    }, [reloadCount]);

    useEffect(() => {
        if (designer) {
            const designerId = designer.id;
            if (designerId) {
                getBusinessHours(designerId).then((response) => {
                    const selectedTime = response.data.data;
                    const status = response.data.status;
                    if (status == "Fail") {
                        // toast.error('No availabilty found!');
                        setDesignerAvailable(false);
                    } else {
                        if (selectedTime) {
                            if (selectedTime.content) {
                                const availableHours = selectedTime.content;
                                const events = [];

                                if (availableHours) {
                                    availableHours.forEach(({ day, availabilities }) => {
                                        availabilities.forEach(({ start, end }) => {
                                            if (start && end && start != "" && end != "") {
                                                const startTime = moment().day(day).set({ hour: parseInt(start.split(':')[0]), minute: parseInt(start.split(':')[1]), second: 0 });
                                                const endTime = moment().day(day).set({ hour: parseInt(end.split(':')[0]), minute: parseInt(end.split(':')[1]), second: 0 });
                                                events.push({
                                                    title: `Schedule: ${formatTime(start)} to ${formatTime(end)}`,
                                                    start: startTime.toDate(),
                                                    end: endTime.toDate(),
                                                });
                                            }
                                        });
                                    });
                                    setDesignerAvailable(true);
                                }
                                setDesignerSchedule(events);
                            }
                        }
                    }
                }).catch((error) => {
                    toast.error('There has been an error getting the schedules, please try again!');
                });
            }
        }

        if (activeProfileTab && activeProfileTab != '') {
            if (activeProfileTab === "about") {
                setAboutShow(true);
                setPortfolioShow(false);
                setFabricShow(false);
                setProcessShow(false);
                setCalendarShow(false);
            } else if (activeProfileTab == "portfolio") {
                setPortfolioShow(true);
                setAboutShow(false);
                setFabricShow(false);
                setProcessShow(false);
                setCalendarShow(false);
            } else if (activeProfileTab == "fabric") {
                setFabricShow(true);
                setPortfolioShow(false);
                setAboutShow(false);
                setProcessShow(false);
                setCalendarShow(false);
            } else if (activeProfileTab == "calendar") {
                setProcessShow(false);
                setPortfolioShow(false);
                setAboutShow(false);
                setFabricShow(false);
                setCalendarShow(true);
            }
        }
    }, [reloadCount, designer]);

    return (
        <Layout>
            {userLoading ?
                <LoadingPage />
                :
                <section id='designer-profile' className='py-5 px-2'>
                    <Container>
                        <Row>
                            <Col lg="4" className='mb-5'>
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
                                            {/* <div className='designer-links-relative d-inline-block ms-3 vertical-align-middle'>
                                                {userWishlist ?
                                                    <div
                                                        className="action-button bg-gold"
                                                        onClick={function () { wishlistDesignerUpdate({ user_id: currentUser, designer_id: designer.id }); }}
                                                    >
                                                        <GoHeart size="16px" className="text-white" style={{marginTop: '-10px' }}/>
                                                    </div>
                                                    :
                                                    <div
                                                        className="action-button bg-white"
                                                        onClick={function () { wishlistDesignerUpdate({ user_id: currentUser, designer_id: designer.id }); }}
                                                    >
                                                        <GoHeart size="16px" className="text-black" style={{marginTop: '-10px' }}/>
                                                    </div>
                                                }
                                            </div> */}
                                            {/* {isDesignerCurrentUser ?
                                                <>
                                                    <AiFillMessage className="ms-3 cursor-pointer" size={20} color="#CEA835" onClick={() => toggleUnderConstruction("Chat Designer")} />
                                                </>
                                                null
                                                :
                                                <>
                                                    <AiFillMessage
                                                        className="ms-3 cursor-pointer"
                                                        onClick={() => toggleChatbox(user.designer.id, user.first_name, user.last_name)}
                                                        size={20} color="#CEA835"
                                                    />
                                                </>
                                            } */}
                                            
                                        </h2>

                                        <div className='icons-d-flex'>
                                            <img src={PinIcon} alt="location pin" className='mt-1' />
                                            {user.city || user.province || user.country ?
                                                <p className='fs-16 place-family'>
                                                    {user.province ? user.province + ',' : user.city ? user.city + ','  : "" } {user.country ? user.country : ""}
                                                    {/* {user.city ? user.city + ',' : ""} {user.province ? user.province + "," : ""} {user.country ? user.country : ""} */}
                                                </p>
                                                :
                                                <p className='fs-16 color-light-blue'>-</p>
                                            }
                                        </div>
                                        <div>
                                            {user.livestream ?
                                                <>
                                                    <a href={`/designer/live/stream/${user.livestream?.id}`} target="_blank">
                                                        <button className="btn btn-danger designer-live default fw-600"> <BsBroadcast size="22px" /> Live</button>
                                                    </a>
                                                </>
                                                :
                                                null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            <Col lg="8" className='text-right'>
                                <Row>
                                    <Col lg={10}>
                                        {userRole !== 'Admin' ?
                                            <>
                                                {isDesignerCurrentUser ?
                                                    null
                                                    :
                                                    <>
                                                        {/* <span>
                                                            <p className='btn request-quote-btn mb-0 cursor-pointer fs-16 fw-400 btn-style ms-3'
                                                                onClick={() => toggleRequestAQuote(true)}
                                                            >
                                                                <PiNotepadFill className='me-2' size="20" />
                                                                Request a Quote
                                                            </p>
                                                        </span> */}
                                                        {designerAvailable ?
                                                            <>
                                                                {currentUser ?
                                                                    <span className='w-100'>
                                                                        <a
                                                                            className='btn ms-3 btn-consultation fs-16 fw-400 btn-style'
                                                                            href={`/designer/${designer.id}/appointment/schedule/0`}
                                                                        >
                                                                            <IoVideocam className='me-2' size="20" />Schedule a Consultation</a>
                                                                    </span> 
                                                                    :
                                                                    <>
                                                                        <span className='w-100'>
                                                                            <a
                                                                                className='btn ms-3 btn-consultation fs-16 fw-400 btn-style'
                                                                                href={`/login?redirect_to=designer/${designer.id}/appointment/schedule/0`}
                                                                            >
                                                                                <IoVideocam className='me-2' size="20" />Schedule a Consultation</a>
                                                                        </span>
                                                                        <p className="text-danger text-small" style={{fontSize: '12px', marginTop: '10px'}}>You must log in to schedule a consultation!</p>
                                                                    </>
                                                                }
                                                            </>
                                                            :
                                                            <span className='w-100'>
                                                                <button className='btn ms-3 btn-consultation fs-16 fw-400 btn-style' disabled>
                                                                    <IoVideocam className='me-2' size="20" />Unavailable for Consultation
                                                                </button>
                                                            </span>
                                                        }
                                                    </>
                                                }
                                            </>
                                            :
                                            null
                                        }
                                    </Col>

                                    <Col lg={2}>
                                        <GoBack fallBack="/" />
                                    </Col>
                                </Row>
                            </Col>

                            <Col lg="12" className='mt-4'>
                                <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${aboutShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("about"); }}>About</span>

                              
                                {user.is_designer == 1 && (
                                    <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${portfolioShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("portfolio"); }}>Portfolio</span>
                                )}
                                {user.is_seller == 1 && (
                                    <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${fabricShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("fabric") }}>Fabrics</span>
                                )}
                                {/* {!isDesignerCurrentUser && (
                                    <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${calendarShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("calendar"); }}>Calendar</span>
                                )} */}

                                {elements && elements.length > 0 ? (
                                    <span className={`cursor-pointer tab-family me-5 mb-3 fs-16 ${guidePreviewModalShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { toggleGuidePreviewModal(); }}>Measurement Guide</span>
                                )
                                    :
                                    null
                                }

                               
                                <hr className='mt-2' />
                            </Col>
                        </Row>

                        {aboutShow ?
                            <div id="about-portfolio">
                                <Row>
                                    <Col lg="6">
                                        <p className='mb-2 fw-600 text-black'>Title</p>
                                        <p className='mb-4 text-black'>
                                            {user.short_bio && user.short_bio != "" ? user.short_bio : "-"}
                                        </p>
                                        <p className='mb-1 fw-600 text-black'>Long Bio</p>
                                        <p className='mb-4 text-black scroll-body'>
                                            {user.long_bio && user.long_bio != "" ? user.long_bio : "-"}
                                        </p>
                                        {user.is_designer ?
                                            <>
                                                <p className='mb-3 fw-600 text-black'>Areas of Specialization and Expertise</p>
                                                <div className='mb-4'>
                                                    {areasOfSpecialization && areasOfSpecialization.length > 0 ?
                                                        <>
                                                            {areasOfSpecialization.map((item, index) => (
                                                                <span className='text-gray 600 fs-14 pill-span bg-light item-designer'>{item}</span>
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

                                            <div className='bg-lgray profile-featured pt-0 mb-4'>
                                                <div className='d-flex justify-content-between'>
                                                    <span className='fs-16 fw-600 text-black mt-3'>Featured Designs</span>
                                                </div>
                                                <FeaturedDesign currentUser={user_id} reloadCount={reloadCount} />
                                            </div>
                                        )}

                                        {user.is_seller == 1 && (
                                            <div className='bg-lgray profile-top-selling '>
                                                <div className='d-flex justify-content-between'>
                                                    <span className='fs-16 fw-600 text-black '>Top Selling Fabrics</span>
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

                    {user.is_designer == 1 && 
                        <>
                        {portfolioShow ?
                            <div>
                                <PortfolioGrid currentUser={user_id} reloadCount={reloadCount} />
                            </div>
                            :
                            null
                        }
                        </>
                    }
                    {user.is_seller == 1 &&
                    <>
                        {fabricShow ?
                            <div>
                                <ProductGrid currentUser={user_id} reloadCount={reloadCount} />
                            </div>
                            :
                            null
                        }
                        </>
                    }

                    </Container>
                </section>
            }

            <Modal
                show={requestAQuoteModal}
                className='modal-preview'
                fade={false}
                size="sm"
                centered

            >
                <ModalHeader className='pb-0'>
                    <h5 className='modal-title text-left fs-22 rufina-family'>New Quote Request</h5>
                    <button type='button' className='close react-review-items-close' data-dismiss='modal' aria-label='Close' onClick={() => setRequestAQuoteModal(false)}>
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>
                </ModalHeader>
                <Modal.Body className='pt-3 pb-3'>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <div className='mb-1'>Title</div>
                                    <div>
                                        <input type="text" className='form-control' name="title" />
                                    </div>

                                    <div className='mt-3 mb-1'>Details</div>
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
                                            <p className="text-black rufina-family fs-18 mb-1 fw-600">Design Preference</p>
                                            <p className="text-black fs-16 mb-3">Share your design preferences to the designer.</p>
                                            <button
                                                className="btn btn-primary mb-4 btn-style"
                                                onClick={() => { toggleUnderConstruction("Upload Design"); setRequestAQuoteModal(false); }}
                                            >
                                                Upload Design
                                            </button>
                                        </label>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                </Modal.Body>
                <ModalFooter className='mt-0 border-none pt-0'>
                    <div className='text-right'>
                        <button
                            className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
                            onClick={() => setRequestAQuoteModal(false)}
                        >
                            Cancel
                        </button>

                        {requestLoading ?
                            <button
                                className="btn btn-primary btn-style"
                                type="button"
                            >
                                Requesting...
                            </button>
                            :
                            <button
                                className="btn btn-primary btn-style"
                                type="button"
                                onClick={() => { toggleUnderConstruction("Request a Quote"); setRequestAQuoteModal(false); }}
                            >
                                Request a Quote
                            </button>
                        }
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
                    <button type='button' className='close react-modal-close' onClick={() => setUnderConstructionShow(false)} data-dismiss='modal' aria-label='Close'>
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-1' />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='fs-22 mb-3 rufina-family'>{modalHeading}</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>

            <Modal
                show={guidePreviewModalShow}
                onHide={toggleGuidePreviewModal}
                className='modal-preview'
                fade={false}
                size="lg"
                id="measurement-guide"
                centered
            >
                <Modal.Header className="pb-0 pt-4">
                    <h4 className='text-left fs-22 rufina-family'>Measurement Guide</h4>
                    <button type='button' className='close react-modal-close' onClick={toggleGuidePreviewModal} data-dismiss='modal' aria-label='Close'>
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <Card className='border-0'>
                        <Card.Body className='p-0'>
                            <Card>
                                <Card.Body>
                                    <div>
                                        {elements && elements.length > 0 ?
                                            <>
                                                {/* Preview based on selected input type */}
                                                {elements.map((element, index) => (
                                                    <>
                                                        {element.type == "Heading" ?
                                                            <h3 className='fs-20 mb-3 mt-1' key={index}>{element.value}</h3>
                                                            : element.type == "Paragraph" ?
                                                                <p className="mb-3 mt-3" key={index}>{element.value}</p>
                                                                : element.type == "Image" ?
                                                                    <>
                                                                        {element.value && element.value.length > 0 && element.value != "" ?
                                                                            <>
                                                                                {element.value.map((image, imageIndex) => (
                                                                                    <img key={imageIndex} src={process.env.REACT_APP_STORAGE_URL + 'product/' + image?.image_url} className="w-100 h-image mb-3" alt="" />
                                                                                ))}
                                                                            </>
                                                                            :
                                                                            null
                                                                        }
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {(element.type == "YouTube Embed Link" || element.type == "Vimeo Embed Link") && element.value != "" ?
                                                                            <>
                                                                                <div className="mb-3">
                                                                                    <ResponsiveEmbedVideo src={element.value} title={element.type} />
                                                                                </div>
                                                                            </>
                                                                            : element.type == "Video" && element.value != "" ?
                                                                                <>
                                                                                    <div className="mb-3">
                                                                                        <ResponsiveVideo src={process.env.REACT_APP_STORAGE_URL + 'products/videos/' + element.value} />
                                                                                    </div>
                                                                                </>
                                                                                : element.type == "Line Break" ?
                                                                                    <p className="mb-0"></p>
                                                                                    :
                                                                                    null
                                                                        }
                                                                    </>
                                                        }

                                                    </>
                                                ))}
                                            </>
                                            :
                                            <Card className="mb-3 mt-3">
                                                <Card.Body className="bg-lgray">
                                                    <p className="text-center mb-0">No measurement guide added.</p>
                                                </Card.Body>
                                            </Card>

                                        }
                                    </div>
                                </Card.Body>
                            </Card>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        </Layout >
    );
};

export default DesignerProfile;