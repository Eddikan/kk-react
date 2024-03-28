
import React, { useState } from 'react';
import { StreamCall, useCallStateHooks, ParticipantView, StreamVideo, StreamVideoClient, useCall, User } from '@stream-io/video-react-sdk';

// add styles for the video UI
import '@stream-io/video-react-sdk/dist/css/styles.css';
import axios from 'axios';
import toast from 'react-hot-toast';

const MyLivestreamUI = ({ livestreamId }) => {
    const [liveStatus, setLiveStatus] = useState('standby');

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
        return await axios.put(process.env.REACT_APP_API_ENDPOINT + 'livestream/'+livestreamId, data);
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
                    </>
                ) : (
                    <>
                        {liveStatus != "standby" ?
                            <button className='btn btn-danger mt-3'>Starting Live Stream...</button>
                            :
                            <button className='btn btn-danger mt-3' onClick={() => startLive() }>Start Live!</button>
                        }
                    </>
                )}
            </div>
        </div>
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