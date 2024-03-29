
import React, { useEffect, useState } from 'react';
import { StreamCall, StreamTheme, useCallStateHooks, LivestreamLayout, StreamVideo, StreamVideoClient, useCall, User } from '@stream-io/video-react-sdk';

// add styles for the video UI
import '@stream-io/video-react-sdk/dist/css/styles.css';
import toast from 'react-hot-toast';
let callActive = false;

const MyLivestreamUI = ({ livestream, onHandleJoin, onHandleLeave, joined, joinStatus }) => {
    const call = useCall();
    const {
        useIsCallLive,
        // ... more hooks
    } = useCallStateHooks();

    const isCallLive = useIsCallLive();
    
    // Define a function to handle the onClick event in MyLivestreamUI
    const handleJoin = () => {
        // Call the function passed from GuestView
        if (typeof onHandleJoin === 'function') {
            onHandleJoin();
        }
    };

    const handleLeave = () => {
        // Call the function passed from GuestView
        if (typeof onHandleJoin === 'function') {
            onHandleLeave();
        }
    };

    return (
        <>
            {livestream.status == 'Live'  ?
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <div style={{ flex: 1 }}>
                            <StreamTheme>
                                <LivestreamLayout
                                    showParticipantCount={false}
                                    showDuration={false}
                                    showLiveBadge={true}
                                />
                            </StreamTheme>
                        </div>
                        <div style={{ alignSelf: 'center' }}>
                            {joined ?
                                <>
                                    {joinStatus != "standby" ?
                                        <button className="btn-primary btn mt-3">Leaving Live Stream...</button>
                                        :
                                        <button className="btn-primary btn mt-3" onClick={handleLeave}>Leave Live Stream!</button>
                                    }
                                    
                                </>
                                :
                                <>
                                    {joinStatus != "standby" ?
                                        <button className="btn-primary btn mt-3">Entering Live Stream...</button>
                                        :
                                        <button className="btn-primary btn mt-3" onClick={handleJoin}>View Live Stream!</button>
                                    }
                                </>
                            }
                            <button className="btn btn-primary bg-gold border-gold bg-white-hover mt-3 ms-3">Share Live Stream!</button>
                        </div>
                    </div>
                    
                </>
                :
                <>
                    {livestream.status != 'Ended' ?
                        <p className="text-center">Waiting for livestream to go live!</p>
                        :
                        <p className="text-center">The live stream has ended!</p>
                    }
                    
                </>
            }
        </>

    );
};

const GuestView = ({livestream, userDetails}) => {
    const [joined, setJoined] = useState(false);
    const [joinStatus, setJoinStatus] = useState('standby');
    
    const apiKey = 'at2bxsgqeh8d';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZ3Vlc3QifQ.ZfL1j6zoaTpB2-jB255a2q_SQPfMCN5uuw-us9LINec';
    const callId = livestream.id; // the call id can be found in the "Credentials" section

    // set up the user object
    const user = {
        id: 'guest',
        image: process.env.REACT_APP_STORAGE_URL+'user/'+userDetails.image,
    };

    const client = new StreamVideoClient({ apiKey, user, token });
    const call = client.call('livestream', callId);

     // Define a function to handle the onClick event in GuestView
     const handleJoin = () => {
        setJoinStatus('loading');
        if (call) {
            const hasJoined = call.join({ create: false });
            if (hasJoined) {
                call.camera.disable();
                call.microphone.disable();
                setJoinStatus('standby');
                setJoined(true);
            } else {
                toast.error("Connecting to live stream failed, please try again!");
                setJoinStatus('standby');
                setTimeout(function(){
                    handleJoin();
                }, 500);
            }
        } else {
            setJoinStatus('standby');
            setTimeout(function(){
                handleJoin();
            }, 500);
        }
    };

    const handleLeave = () => {
        setJoinStatus('loading');
        if (call) {
            call.leave();
            setJoinStatus('standby');
            window.location.href="/designers";
        }
    };
    
    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <MyLivestreamUI livestream={livestream} onHandleJoin={handleJoin} onHandleLeave={handleLeave} joined={joined} joinStatus={joinStatus} />
            </StreamCall>
        </StreamVideo>
    );
};

export default GuestView;