
import React from 'react';
import { StreamCall, useCallStateHooks, ParticipantView, StreamVideo, StreamVideoClient, useCall, User } from '@stream-io/video-react-sdk';

// add styles for the video UI
import '@stream-io/video-react-sdk/dist/css/styles.css';

const MyLivestreamUI = () => {
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
    return (
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
                    <button className='btn btn-primary mt-3' onClick={() => call?.stopLive()}>Stop Livestream</button>
                ) : (
                    <button className='btn btn-primary mt-3' onClick={() => call?.goLive()}>Start Livestream</button>
                )}
            </div>
        </div>
    );
};

const apiKey = 'at2bxsgqeh8d';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMV8xIn0.QkmHZgRU1NPoUjj5j2pmcs0K86CnylCz9OinVWtAiWU';
const callId = '1_1'; // the call id can be found in the "Credentials" section

// set up the user object
const user = {
    id: '1_1',
    name: 'Oliver',
    image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call('livestream', callId);
call.camera.enable();
call.microphone.enable();

call.join({ create: true });

const HostView = () => {
    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <MyLivestreamUI />
            </StreamCall>
        </StreamVideo>
    );
};

export default HostView;