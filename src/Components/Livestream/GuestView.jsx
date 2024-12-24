
import React, { useEffect } from 'react';
import { StreamCall, StreamTheme, useCallStateHooks, LivestreamLayout, StreamVideo, StreamVideoClient, useCall, User } from '@stream-io/video-react-sdk';

// add styles for the video UI
import '@stream-io/video-react-sdk/dist/css/styles.css';
let callActive = false;

const MyLivestreamUI = ({ livestream }) => {
    const call = useCall();
    const {
        useIsCallLive,
        // ... more hooks
    } = useCallStateHooks();

    const isCallLive = useIsCallLive();
    
    return (
        <>
            {isCallLive ?
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
    
    const apiKey = 'at2bxsgqeh8d';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZ3Vlc3QifQ.ZfL1j6zoaTpB2-jB255a2q_SQPfMCN5uuw-us9LINec';
    const callId = livestream.id; // the call id can be found in the "Credentials" section

    // set up the user object
    const user = {
        id: 'guest',
        image: import.meta.env.VITE_REACT_APP_STORAGE_URL+'user/'+userDetails.image,
    };

    const client = new StreamVideoClient({ apiKey, user, token });
    const call = client.call('livestream', callId);

    if (call) {
        call.join({ create: false });
        call.camera.disable();
        call.microphone.disable();
    }
    
    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <MyLivestreamUI livestream={livestream} />
            </StreamCall>
        </StreamVideo>
    );
};

export default GuestView;