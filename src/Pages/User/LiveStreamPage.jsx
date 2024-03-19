import React, { useEffect, useState } from 'react';
import { Row, Col, Modal, Card } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { GoAlertFill } from 'react-icons/go';
import { IoMdVideocam, IoIosAttach } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { AiFillMessage } from "react-icons/ai";
import { PiPlus } from "react-icons/pi";
import 'Assets/styles/LiveStream/style.css';
import LayoutSellerCenter from 'Components/Layout/LayoutSellerCenter';
import GoBack from '../../Components/Shared/GoBack';
import Container from 'react-bootstrap/Container';
import Sidebar from 'Components/Shared/Sidebar';
import LiveStreamChat from 'Components/Chat/LiveStreamChat';
import toast from 'react-hot-toast';
import axios from "axios";

const initialStreamFormData = Object.freeze({
    title: '',
    date: '',
    description: ''
});

const LiveStreamPage = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole']);
    const [livestreamId, setLiveStreamId] = useState('');
    const currentUser = cookies.currentUser;
    const userDetails = cookies.userDetails;
    const [underConstructionShow, setUnderConstructionShow] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [chatBox, setChatBox] = useState(false);
    const [createStreamShow, setCreateStreamShow] = useState(false);
    const [streams, setStreams] = useState('');
    const [reloadCount, setReloadCount] = useState(0);
    const [streamLoading, setStreamLoading] = useState(false);
    const [formStatus, setFormStatus] = useState('standby');
    const [streamFormData, setStreamFormData] = useState(initialStreamFormData);
    const [designer, setDesigner] = useState('');


    function toggleCreateStream() {
        setCreateStreamShow(true);
    }

    function toggleUnderConstruction(message) {
        setUnderConstructionShow(true);
        setModalHeading(message);
    }

    const getLiveStream = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'livestream');
    };

    const postStream = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'livestream', data);
    };

    const handleChangeStream = (e) => {
        const { name, value } = e.target;
        setStreamFormData({
            ...streamFormData,
            [name]: value,
            date: new Date(),
        });
    }

    function returnFormattedDate(date) {
        const targetDate = new Date(date);
        const month = targetDate.toLocaleString('en-US', { month: 'long' });
        const day = targetDate.getDate();
        const year = targetDate.getFullYear();
        const formattedDate = `${month} ${day}, ${year}`;
        return formattedDate;
    }

    const addStreamSubmit = (e) => {
        e.preventDefault();
        setStreamLoading(true);
        postStream({ ...streamFormData, user_id: currentUser }).then(response => {
            const success = response.data.status;
            if (success === "Success") {
                setReloadCount(count => count + 1);
                setStreamLoading(false);
                setStreamFormData(initialStreamFormData);
                setCreateStreamShow(false);
                toast.success('Stream added successfully!');
            } else {
                setFormStatus('standby');
                toast.error('An error occured. Please try again or contact the administrator.');
                setStreamLoading(false);
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setStreamLoading(false);
        });
    }

    useEffect(() => {
        getLiveStream()
            .then((response) => {
                const selectedStream = response.data.data;
                if (selectedStream) {
                    setStreams(selectedStream);
                } else {
                    toast.error('There has been an error getting the appointment, please try again!');
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the appointment, please try again!');
            });

    }, [reloadCount]);

    function toggleChatbox(id, first_name, last_name, image, message) {
        setChatBox(true);
        setLiveStreamId(id.toString());
        setDesigner({
            id: id ?? 0,
            first_name: first_name ?? '-',
            last_name: last_name ?? '-',
            image: image ?? '-'
        });
        setModalHeading(message);
    }

    return (
        <LayoutSellerCenter>
            <section>
                <Container fluid>
                    <Row className='bg-color-page'>
                        <Col lg={2} className='p-0'>
                            <Sidebar />
                        </Col>

                        <Col lg={10} className='mx-auto py-5 padding-right-admin max-width-column'>
                            <div>
                                <Row>
                                    <Col lg={12}>
                                        <Row>
                                            <Col lg={11}>
                                            </Col>

                                            <Col lg={1} className='text-right'>
                                                <GoBack fallBack="/" />
                                            </Col>
                                        </Row>

                                        <Row className="mb-4">
                                            <Col lg={8} className='d-flex justify-content-left align-items-center'>
                                                <h3 className="fs-30 fw-600 text-black mb-0">Live Stream</h3>
                                            </Col>

                                            <Col lg={4} className='text-right'>
                                                <div>
                                                    <button className='btn btn-primary' onClick={toggleCreateStream}>
                                                        <PiPlus className='me-2 mb-1' />
                                                        <span>Create Live Stream</span>
                                                    </button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col lg={12}>
                                        <Card>
                                            <Card.Body className='bg-light'>
                                                <Row>
                                                    <Col lg={3}>
                                                        <span className='fw-500'>Title</span>
                                                    </Col>

                                                    <Col lg={3}>
                                                        <span className='fw-500'>Date</span>
                                                    </Col>

                                                    <Col lg={3}>
                                                        <span className='fw-500'>URL</span>
                                                    </Col>

                                                    <Col lg={2}>
                                                        <span className='fw-500'>Status</span>
                                                    </Col>

                                                    <Col lg={1} className='text-right'>
                                                        <span className='fw-500'>Action</span>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <>
                                        {streams ?
                                            <>
                                                {streams.length > 0 ?
                                                    <>
                                                        {streams.map((stream) => {

                                                            const options = {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            };
                                                            const today = (new Date(stream.created_at)).toLocaleDateString('en-ES', options);

                                                            return (
                                                                <Col lg={12}>
                                                                    <Card className='mt-3'>
                                                                        <Card.Body>
                                                                            <Row className="align-items-center">
                                                                                <Col lg={3}>
                                                                                    <span className='text-black'>{stream.title}</span>
                                                                                </Col>

                                                                                <Col lg={3}>
                                                                                    <span className='text-black'>{returnFormattedDate(stream.date ?? '-')}</span>
                                                                                </Col>

                                                                                <Col lg={3}>
                                                                                    <span className='text-black'>{stream.url}</span>
                                                                                </Col>

                                                                                <Col lg={2}>
                                                                                    <span className='text-black'>{stream.status}</span>
                                                                                </Col>

                                                                                <Col lg={1} className='d-flex justify-content-end'>
                                                                                    <Link to={`/designer/live/stream/${stream.id}`} className="text-decoration-none">
                                                                                        <div className="cursor-pointer live-tooltip">
                                                                                            <span className="icon-tooltiptext fs-14">
                                                                                                Live Stream
                                                                                            </span>
                                                                                            <IoMdVideocam className='video-cam me-3' size={20} color="#000000" />
                                                                                        </div>
                                                                                    </Link>

                                                                                    <div className="cursor-pointer live-tooltip"
                                                                                        onClick={function () {
                                                                                            toggleChatbox(
                                                                                                stream.id,
                                                                                                stream.user?.first_name,
                                                                                                stream.user?.last_name,
                                                                                                stream.user?.image,
                                                                                                "Under Construction");
                                                                                        }}
                                                                                    >
                                                                                        <span className="icon-tooltiptext fs-14">Message</span>
                                                                                        <span><AiFillMessage className='video-cam' size={20} color="#000000" /></span>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </Card.Body>
                                                                    </Card>
                                                                </Col>

                                                            );
                                                        })}
                                                    </>
                                                    :
                                                    <>
                                                        <Col lg={12}>
                                                            <Card className='mt-3'>
                                                                <Card.Body>
                                                                    <p className="text-center mb-0">No records found.</p>
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    </>
                                                }
                                            </>
                                            :
                                            <>
                                                <Col lg={12}>
                                                    <Card className='mt-3'>
                                                        <Card.Body>
                                                            <p className="text-center mb-0">No records found.</p>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </>
                                        }
                                    </>
                                </Row>
                            </div>
                        </Col>

                        {chatBox ?
                            <>
                                <Card className='width-chat-card px-0'>
                                    <Card.Header className='header-chat bg-white'>
                                        <div className='d-flex justify-content-between'>
                                            <div className='d-flex align-items-center'>
                                                <span className='fw-500'>{designer?.first_name} {designer?.last_name}</span>
                                                {/* <span className='ms-2 active-now fs-14 fw-400'>Active Now</span> */}
                                            </div>
                                            <div className="cursor-pointer" onClick={() => setChatBox(false)}>
                                                <IoCloseOutline color="#7e7e7e" size={25} />
                                            </div>
                                        </div>
                                    </Card.Header>
                                    <Card.Body >
                                        <LiveStreamChat
                                            currentUser={currentUser}
                                            livestreamId={livestreamId}
                                            user={userDetails}
                                        />
                                    </Card.Body>
                                </Card>
                            </>
                            :
                            null
                        }
                    </Row>
                </Container>
            </section >

            <Modal
                show={underConstructionShow}
                className='modal-preview'
                fade={false}
                centered
                size="sm"
            >
                <Modal.Header className="py-0">
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={() => setUnderConstructionShow(false)}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-1' />
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <h4 className='fs-25 mb-3'>{modalHeading}</h4>
                    <Card>
                        <Card.Body className="text-center py-5">
                            <GoAlertFill size="60px" className="mb-2 text-gold" />
                            <p className="fs-20 text-black">Under Construction</p>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>


            <Modal
                show={createStreamShow}
                className='modal-preview'
                fade={false}
                centered
            >
                <Modal.Header className="pb-0">
                    <Modal.Title className='rufina-family fs-22 text-black'>Create Live Stream</Modal.Title>
                    <button type='button' className='close react-modal-close' onClick={function () { setCreateStreamShow(false); }} >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col lg="12">
                                    <div className='mb-1'>Title</div>
                                    <div>
                                        <input
                                            type="text"
                                            name="title"
                                            className='form-control'
                                            onChange={handleChangeStream}
                                            value={streamFormData.title}
                                        />
                                    </div>
                                </Col>

                                <Col lg="12" className='mt-3'>
                                    <div className='mb-1'>Description</div>
                                    <div>
                                        <textarea
                                            type="text"
                                            name="description"
                                            className='form-control'
                                            onChange={handleChangeStream}
                                            value={streamFormData.description}
                                        />
                                    </div>
                                </Col>
                            </Row>



                        </Card.Body>
                    </Card>
                    <Card.Footer className="text-right mt-3">
                        <button className="btn btn-secondary border-black bg-white text-black me-3 btn-style" onClick={() => setCreateStreamShow(false)} type="button">Cancel</button>
                        {streamLoading ?
                            <button className="btn btn-primary btn-style" type="button" >Creating...</button>
                            :
                            <button className="btn btn-primary btn-style" type="button" onClick={addStreamSubmit} >Create</button>
                        }
                    </Card.Footer>
                </Modal.Body>
            </Modal>
        </LayoutSellerCenter >
    );
};

export default LiveStreamPage;