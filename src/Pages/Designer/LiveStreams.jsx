import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Modal, ModalFooter } from 'react-bootstrap';
import Layout from 'Components/Layout/Layout';
import { useCookies } from 'react-cookie';
import GoBack from 'Components/Shared/GoBack';
import { MdOutlineVideocam, MdOutlineVideocamOff, MdOutlineCalendarMonth } from 'react-icons/md';
import { BiDetail } from "react-icons/bi";
import { GoAlertFill } from 'react-icons/go';
import { IoCloseOutline } from "react-icons/io5";
import 'Assets/styles/DesignerLiveStream/style.css';
import toast from 'react-hot-toast';
import axios from 'axios';
import LiveStream from 'Components/Chat/LiveStream';

const LiveStreams = (props) => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const currentUser = cookies.currentUser;
    const userDetails = cookies.userDetails;
    const { livestreamId } = useParams();
    const [live, setLive] = useState([]);
    const [liveLoading, setLiveLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);
    const [chatShow, setChatShow] = useState(true);
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');

    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };

    const getLiveStream = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'livestream/' + livestreamId);
    };

    function returnFormattedDate(date) {
        const targetDate = new Date(date);
        const month = targetDate.toLocaleString('en-US', { month: 'long' });
        const day = targetDate.getDate();
        const year = targetDate.getFullYear();
        const formattedDate = `${month} ${day}, ${year}`;
        return formattedDate;
    }

    useEffect(() => {
        getLiveStream()
            .then((response) => {
                setLiveLoading(false);
                const selectedLiveStream = response.data.data;
                if (selectedLiveStream) {
                    setLive(selectedLiveStream);
                } else {
                    toast.error('There has been an error getting the stream, please try again!');
                    setLiveLoading(false);
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the stream, please try again!');
                setLiveLoading(false);
            });
    },
        [reloadCount]);

    return (
        <Layout>
            <div className='px-2 stream-top-bottom'>
                <section>
                    <Container>
                        <Row>
                            <Row>
                                <Col lg={6}>
                                </Col>
                                <Col lg={6} className="text-right px-0">
                                    <GoBack fallBack="/#" />
                                </Col>
                            </Row>
                            <Col lg="8">
                                <Card className="bordered-top-primary mb-3">
                                    <Card.Body>
                                        <Row>
                                            <Col lg="12">
                                                <div className='fw-600 fs-18'>Live Stream</div>
                                                <hr />
                                            </Col>

                                            <Col lg="6">
                                                <div className='mt-1 mb-2'>
                                                    <span className='fw-600 me-2'>Title:</span>
                                                    <span className='mt-1'>{live.title}</span>
                                                </div>
                                            </Col>

                                            <Col lg="6">
                                                <div className='mt-1 mb-2'>
                                                    <span className='fw-600 me-2'>Date:</span>
                                                    <span className='mt-1'>{returnFormattedDate(live.date ?? '-')}</span>
                                                </div>
                                            </Col>

                                            <Col lg="12">
                                                <Card className='mt-3'>
                                                    <Card.Body>
                                                        <div className='mt-1'>
                                                            <span className='fw-600 me-2'>Description:</span>
                                                            <div className='mt-3'>{live?.description}</div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                <Card>
                                    <Card.Body className='live-stream-height'>
                                        <Row>
                                            <Col lg="12">
                                                <iframe
                                                    // src={live.url} 
                                                    src="https://kouture-konect.web.app/admin/users"
                                                    height="385" width="817"
                                                >
                                                </iframe>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col lg="4">
                                <Card>
                                    <Card.Body>
                                        {chatShow ?
                                            <>
                                                <Row>
                                                    <Col lg="12">
                                                        <div className='fw-600 fs-18 text-gold'>Chat</div>
                                                        <hr />
                                                    </Col>

                                                    <Col lg="12">
                                                        <LiveStream
                                                            currentUser={currentUser}
                                                            livestreamId={livestreamId}
                                                            user={userDetails}
                                                        />
                                                    </Col>
                                                </Row>
                                            </>
                                            :
                                            null
                                        }

                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </div >

            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-uppercase text-left'></h5>
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={() => setUnderConstructionShow(false)}
                        data-dismiss='modal'
                        aria-label='Close'
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-1' />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='fs-22 rufina-family mb-3'>{modalHeading}</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        </Layout >
    );
};

export default LiveStreams;