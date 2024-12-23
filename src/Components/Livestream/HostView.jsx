
import React, { useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { StreamCall, useCallStateHooks, ParticipantView, StreamVideo, StreamVideoClient, useCall, User } from '@stream-io/video-react-sdk';
import { Row, Col, Button, Card, Modal, ModalHeader } from 'react-bootstrap';
import LiveStreamCopy from 'Utils/LiveStreamCopyLink';
import { ImEmbed2 } from "react-icons/im";
import { IoShareSocial, IoInformationOutline, IoVideocam, IoCloseOutline, IoDocumentOutline, IoEyeOutline } from "react-icons/io5";
// add styles for the video UI
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';

const MyLivestreamUI = ({ livestreamId }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'token']);
    const [liveStatus, setLiveStatus] = useState('standby');
    const [shareModalShow, setShareModalShow] = useState(false);
    const [copyEmbedLink, setCopyEmbedLink] = useState(false);
    const [copy, setCopy] = useState(false)

    const current_user_id = cookies.currentUser;
    const token = cookies.token;

    let iframeLink = `<iframe src="https://kouture-konect.web.app/designer/live/stream/${livestreamId}" height="316" width="404" allowfullscreen lazyload frameborder="0" allow="clipboard-write" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;


    function toggleShareModal() {
        setShareModalShow(!shareModalShow);
    }

    function toggleCopyEmbedLinkModal() {
        setCopyEmbedLink(true);
    }

    const call = useCall();
    const {
        useIsCallLive,
        useLocalParticipant,
        useParticipantCount,
        // ... more hooks
    } = useCallStateHooks();
    const totalParticipants = useParticipantCount();
    const localParticipant = useLocalParticipant();
    const isCallLive = useIsCallLive();

    const putStream = async (data) => {
        return await axios.put(process.env.REACT_APP_API_ENDPOINT + 'livestream/'+livestreamId + '?current_user_id=' + current_user_id + '&token=' + token, data);
    };

    const stopLive = (e) => {
        setLiveStatus('loading');
        putStream({ status:'Ended' }).then(response => {
            const success = response.data.status;
            if (success === "Success") {
                call?.stopLive();
                window.location.href="/user/center/live/stream";
                setLiveStatus('standby');
            } else {
                setLiveStatus('standby');
                toast.error('An error occured. Please try again or contact the administrator.');
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setLiveStatus('standby');
        });
    }

    const startLive = (e) => {
        setLiveStatus('loading');
        putStream({ status:'Live' }).then(response => {
            const success = response.data.status;
            if (success === "Success") {
                call?.goLive();
                setLiveStatus('standby');
                toast.success('You are now live!');
            } else {
                setLiveStatus('standby');
                toast.error('An error occured. Please try again or contact the administrator.');
            }
        }).catch(() => {
            toast.error('An error occured. Please try again or contact the administrator.');
            setLiveStatus('standby');
        });
    }

    return (
        <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ flex: 1 }}>
                {localParticipant && (
                    <ParticipantView
                        participant={localParticipant}
                        // disables the extra UI elements as such:
                        // name, audio, video indicator, etc...
                        ParticipantViewUI={null}
                    />
                )}
            </div>
            <div style={{ alignSelf: 'center' }}>
                {isCallLive ? (
                    <>
                        {liveStatus != "standby" ?
                            <button className='btn btn-primary mt-3'>Stopping Live Stream...</button>
                            :
                            <button className='btn btn-primary mt-3' onClick={() => stopLive() }>Stop Live!</button>
                        }
                        <button className='btn btn-primary mt-3 ms-3' onClick={toggleShareModal}>Share</button>
                    </>
                ) : (
                    <>
                        {liveStatus != "standby" ?
                            <button className='btn btn-danger mt-3'>Starting Live Stream...</button>
                            :
                            <button className='btn btn-danger mt-3' onClick={() => startLive() }>Start Live!</button>
                        }
                        <button className='btn btn-primary mt-3 ms-3' onClick={toggleShareModal}>Share</button>
                    </>
                )}
                 {/* <button className='btn btn-primary mt-3 ms-3' onClick={toggleShareModal}>Share</button> */}
            </div>
        </div>


         <Modal
                show={shareModalShow}
                className='modal-preview'
                fade={false}
                centered
            >
                <Modal.Header className="pb-0">
                    <Modal.Title className='rufina-family fs-22 text-black'>Share</Modal.Title>
                    <button type='button' className='close react-modal-close' onClick={function () { setShareModalShow(false); }} >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body className="p-4">
                        <div lg='12' className='text-center'>
                                    <LiveStreamCopy
                                        text={`https://kouture-konect.web.app/designer/live/stream/${livestreamId}`}
                                        classes="btn btn-primary border-black bg-white text-black w-100"
                                        standbyTitle="Copy Link"
                                        icon={true}
                                        closeModal={() => setShareModalShow(false)}
                                    />

                                    <button
                                        className="btn btn-primary border-black bg-white text-black mt-2 w-100"
                                        type="button"
                                        onClick={() => {
                                            toggleCopyEmbedLinkModal();
                                            setShareModalShow(false);
                                        }}
                                    >
                                        <ImEmbed2 className='me-2' size={17} />
                                        Copy Embed Code
                                    </button>
                                </div >
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>

            <Modal
                show={copyEmbedLink}
                id='modal-preview-embed'
                fade={false}
                centered
                className='embed-modal-view'

            >
                <Modal.Header className="p-3 pb-0">
                    <h5 className='mb-0 rufina-family fs-22 text-black'>Embed Design</h5>
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={() => setCopyEmbedLink(false)}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} />
                    </button>
                </Modal.Header>
                <Modal.Body className='pb-0 pt-4'>
                    <Row>
                        <Col lg='12' className='px-3'>
                            <textarea className='text-area-embed'>
                                {iframeLink}
                            </textarea>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="text-right border-none">
                    <button
                        className="btn btn-secondary border-black bg-white text-black me-3 btn-style"
                        onClick={() => setCopyEmbedLink(false)}
                        type="button" >
                        Cancel
                    </button>

                    <LiveStreamCopy
                        text={iframeLink}
                        classes="btn btn-primary btn-style"
                        standbyTitle="Copy"
                        icon={false}
                        onCopy={() => setCopy(true)}
                        loadingTitle="Copied"
                        closeModal={() => setCopyEmbedLink(false)}
                    />
                </Modal.Footer>
            </Modal >
            </>
    );
};

const HostView = ({livestream, userDetails}) => {

    const apiKey = process.env.REACT_APP_STREAM_API_KEY;
    const token = livestream.token;
    const callId = livestream.id; // the call id can be found in the "Credentials" section

    // set up the user object
    const user = {
        id: userDetails.first_name+'_'+livestream.id,
        name: userDetails.first_name,
        image: process.env.REACT_APP_STORAGE_URL+'user/'+userDetails.image,
    };

    const client = new StreamVideoClient({ apiKey, user, token });
    const call = client.call('livestream', callId);

    if (call) {
        call.join({ create: true });
    }

    call.camera.enable();
    call.microphone.enable();

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <MyLivestreamUI livestreamId={livestream.id} />
            </StreamCall>
        </StreamVideo>
    );
};


export default HostView;