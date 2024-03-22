
import React from 'react';
import { StreamCall, StreamTheme, useCallStateHooks, LivestreamLayout, StreamVideo, StreamVideoClient, useCall, User } from '@stream-io/video-react-sdk';

// add styles for the video UI
import '@stream-io/video-react-sdk/dist/css/styles.css';
let callActive = false;

const MyLivestreamUI = () => {
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
                <p className="text-center">Waiting for livestream to go live!</p>
            }
        </>

    );
};

const apiKey = 'at2bxsgqeh8d';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMl8yIn0.AyIXCxf5n_WptkX4t-2vEy6N7f5w79NcPfopY23QDqg';
const callId = '1_1'; // the call id can be found in the "Credentials" section

// set up the user object
const user = {
    id: '2_2',
    name: 'James',
    image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call('livestream', callId);
call.microphone.disable();

const GuestView = () => {
    const {
        useIsCallLive,
        // ... more hooks
    } = useCallStateHooks();
    const isCallLive = useIsCallLive();

    if (isCallLive) {
        call.join({ create: false });
    }
    
    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <MyLivestreamUI />
            </StreamCall>
        </StreamVideo>
    );
};

export default GuestView;