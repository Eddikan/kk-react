import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { IoIosCheckmarkCircle } from "react-icons/io";
import DesignersConnect from 'Components/Shared/DesignersConnect';
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';
import { useCookies } from 'react-cookie';
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import toast from 'react-hot-toast';


const ThankYouPage = (props) => {
    const navigate = useNavigate();
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };
    let query = useQuery();
    const orderId = query.get('order_id');
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'cookieCheckoutDesigner']);
    const [selectedDesigner, setSelectedDesigner] = useState(null);
    const [designerID, setDesignerId] = useState('');
    const [needsDesigner, setNeedsDesigner] = useState('');
    const [selectDesignerShow, setSelectDesignerShow] = useState(false);
    const [connectDesignerLoading, setConnectDesignerLoading] = useState(false);

    const cookieCheckoutDesigner = cookies.cookieCheckoutDesigner;

    const toggleSelectDesignerShow = (e) => {
        setSelectDesignerShow(!selectDesignerShow);
    }

    const handleSelectDesigner = (e) => {
        const designer = {
            id: e.id,
            user: {
                id: e.user.id,
                image: e.user.image,
                first_name: e.user.first_name,
                last_name: e.user.last_name,
                short_bio: e.user.short_bio
            }
        };
        setCookie('cookieCheckoutDesigner', JSON.stringify(designer), { path: '/' });
        setSelectedDesigner(e);
        toggleSelectDesignerShow();
        setDesignerId(e.id);
        setNeedsDesigner("Yes");
    };

    async function addDesignerToOrder(e) {
        setConnectDesignerLoading(true);
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'order/'+orderId, {needs_designer: needsDesigner, designer_id: designerID}).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                // navigate('/orders');
                navigate('/designer-profile?user_id='+selectedDesigner.user.id);
                toast.success('Order updated successfully!');
                setConnectDesignerLoading(false);
            } else {
                toast.error('Something went wrong, please contact the administrator!');
                setConnectDesignerLoading(false);
            }
        }).catch((error) => {
            toast.error('Something went wrong, please contact the administrator!');
            setConnectDesignerLoading(false);
        });
    };

    useEffect(() => {
        if (cookieCheckoutDesigner) {
            setSelectedDesigner(cookieCheckoutDesigner);
            setDesignerId(cookieCheckoutDesigner.id);
            setNeedsDesigner("Yes");
        }
    }, []);

    return (
        <Layout>
            <section>
                <Container className={`py-5 thank-you-height`}>
                    <div>
                        <Card>
                            <Card.Body>
                                <div className='text-center'>
                                    <div className='text-gold mt-3'>
                                        <IoIosCheckmarkCircle size={70} />
                                    </div>
                                </div>
                                <div className='text-center mb-4'>
                                    <div className='fs-30 rufina-family mt-2'>
                                        Thank you for your purchase!
                                    </div>
                                </div>
                                <div>
                                    <p className='fs-18 thank-you text-center mt-3 mb-5'>
                                        Thank you for your purchase! You'll be receiving an email from us shortly.
                                    </p>
                                    {/* <p className='fs-18 thank-you text-center mb-5'>
                                        We greatly value your feedback and would appreciate it if you could take a moment to fill out our survey.
                                    </p> */}
                                </div>

                                {/* <Col lg={12} className='text-center mt-5'>
                                    <Link to={`/post-purchase-survey?order_id=${order_id}`}>
                                        <div>
                                            <button className='btn btn-primary'>Start Survey</button>
                                        </div>
                                    </Link>
                                </Col> */}
                                <div className='text-center mt-5 mb-4'>
                                    <div className="d-inline-block me-4">
                                        <Link to="/">
                                            <Button className='btn-outline'>Back to Home</Button>
                                        </Link>
                                    </div>
                                    <div className="d-inline-block">
                                        <Button onClick={function() { toggleSelectDesignerShow(); removeCookie('cookieCheckoutDesigner', { path: '/' }); }} className=''>Connect to a Designer</Button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                        {selectedDesigner ?
                            <Card className="mb-3 mt-4">
                                <Card.Body>
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <span className="fs-22 rufina-family fw-600">Designer</span>
                                        <Button style={{minWidth: 'auto', padding: '8px 10px'}} onClick={function() { toggleSelectDesignerShow(); removeCookie('cookieCheckoutDesigner', { path: '/' });  }} className="btn-outline">Change Designer</Button>
                                    </div>
                                    <hr className='mt-2' />
                                    <div className='d-flex'>
                                        {selectedDesigner.user.image && selectedDesigner.user.image != "" ?
                                            <div className="designs-grid-div fabric-image"
                                                style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${selectedDesigner.user.image})`, width: '65px', height: '65px', minHeight: 'auto' }}>
                                            </div>
                                            :
                                            <div className="designs-grid-div fabric-image"
                                                style={{ backgroundImage: `url(${selectedDesigner.user.gender === 'Female' ? FemalePlaceholder : MalePlaceholder})`, width: '65px', height: '65px', minHeight: 'auto' }}>
                                            </div>
                                        }
                                        <div className='ms-3'>
                                            <div className='mb-0 fw-500 text-black fs-18'>
                                                <strong>{selectedDesigner.user.first_name} {selectedDesigner.user.last_name}</strong>
                                            </div>
                                            <div className="">
                                                <p>{selectedDesigner.user.short_bio}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="mt-3" />
                                    <div className="text-right">
                                        {connectDesignerLoading ?
                                            <Button type="button" >Sending...</Button>
                                            :
                                            <Button onClick={addDesignerToOrder}>Confirm</Button>
                                        }
                                    </div>
                                    
                                </Card.Body>
                            </Card>
                            :
                            // <Card className="mb-3">
                            //     <Card.Body>
                            //         <div className='d-flex align-items-center justify-content-between'>
                            //             <span className="fs-22 rufina-family fw-600">Designer</span>
                            //             <button onClick={() => { toggleSelectDesignerShow(); }} className="btn bg-gold-hover text-white-hover btn bg-black text-white">Select Designer</button>
                            //         </div>
                            //         <hr className='mt-2' />
                            //         <div className='d-flex'>
                            //             <div className="designs-grid-div fabric-image"
                            //                 style={{ backgroundImage: `url(${MalePlaceholder})`, width: '65px', height: '65px' }}>
                            //             </div>
                            //             <div className='ms-3'>
                            //                 <div className='mb-0 fw-500 text-black fs-18'>
                            //                     <strong>-</strong>
                            //                 </div>
                            //                 <div className="">
                            //                     <p>-</p>
                            //                 </div>
                            //             </div>
                            //         </div>
                            //     </Card.Body>
                            // </Card>
                            null
                        }
                    </div>
                </Container>
            </section>
            <Modal
                show={selectDesignerShow}
                size='xl'
                centered
                id="designers-connect"
            >
                <Modal.Header className='pb-0'>
                    <h5 className='modal-title text-left fs-22'>Designers</h5>
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={function () { toggleSelectDesignerShow(); }}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <DesignersConnect onSelectDesigner={handleSelectDesigner} />
                        </Card.Body>
                    </Card>
                    <Card.Footer className="text-right mt-3">
                        <button
                            className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
                            onClick={() => toggleSelectDesignerShow()} type="button"
                        >
                            Cancel
                        </button>
                    </Card.Footer>
                </Modal.Body>
            </Modal>
        </Layout >
    );
};

export default ThankYouPage;