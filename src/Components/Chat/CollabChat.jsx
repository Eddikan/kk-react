import React, { useEffect, useState, useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import firestore from "../../firebaseConfig";
import { AiOutlineSend } from "react-icons/ai";
import LoadingIcon from "../Icons/Loading";
import ToastAlert from 'Utils/ToastAlert/ToastAlert';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const CollabChat = ({ meetingId, user, currentUser, video }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'token']);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [formStatus, setFormStatus] = useState("standby");
    // const userImage = user.image_url;
    const chatContainerRef = useRef(null);
    
    const current_user_id = cookies.currentUser;
    const token = cookies.token;

    const postNewMessageNotif = async (data) => {
        return await axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'chat/notification/' + meetingId + '?current_user_id=' + current_user_id + '&token=' + token, data);
    };

    useEffect(() => {
        // Fetch chat messages of the given meeting from Firestore
        const unsubscribe = firestore
            .collection("meetings")
            .doc(meetingId)
            .collection("collab_chats")
            .orderBy("timestamp", "asc")
            .onSnapshot((snapshot) => {
                const chatData = snapshot.docs.map((doc) => doc.data());
                setChatMessages(chatData);
            });
        return () => unsubscribe();
    }, [meetingId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setNewMessage("");
        setFormStatus('loading');
        try {
            await firestore.collection("meetings").doc(meetingId).collection("collab_chats").add({
                user_id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                message: newMessage,
                // image_url: userImage,
                timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
            });
            if (video != 'on') {

            }
            if (chatMessages && chatMessages.length > 2) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
            setFormStatus('standby');
            toggleNewChat();
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = timestamp.toDate();
        return date.toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        });
    };

    const toggleNewChat = () => {
        postNewMessageNotif({ message: newMessage, sender_id: currentUser }).then(response => {
            const status = response.data.status;
            const data = response.data.data;
            if (status == 'Success') {

            } else {
                const message = 'Failed to send notification!';
                ToastAlert({ type: 'warning', message: message });
            }
        })
    }

    return (
        <div>
            <section className={`msger ${video == 'on' ? null : 'collab-msger'}`} ref={chatContainerRef}>
                <div className="msger-chat">
                    {chatMessages && chatMessages.length > 0 ?
                        <>
                            {chatMessages.map((chat) => (
                                <>
                                    {currentUser == chat.user_id ?
                                        <>
                                            <div className="msg right-msg">
                                                <div className="msg-img"></div>
                                                <div className="msg-bubble">
                                                    <div className="msg-info">
                                                        <div className="msg-info-name">{chat.first_name} {chat.last_name}</div>
                                                        {video == 'on' ?
                                                            <div className="msg-info-time">{formatTimestamp(chat.timestamp)}</div>
                                                            :
                                                            null
                                                        }
                                                    </div>
                                                    <div className={`msg-text ${video == 'on' ? null : 'collab-msg-text'}`}>
                                                        {chat.message}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className="msg left-msg">
                                                <div className="msg-img"></div>
                                                <div className="msg-bubble bg-light">
                                                    <div className="msg-info">
                                                        <div className="msg-info-name">{chat.first_name} {chat.last_name}</div>
                                                        {video == 'on' ?
                                                            <div className="msg-info-time">{formatTimestamp(chat.timestamp)}</div>
                                                            :
                                                            null
                                                        }
                                                    </div>
                                                    <div className={`msg-text ${video == 'on' ? null : 'collab-msg-text'}`}>
                                                        {chat.message}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </>
                            ))}
                        </>
                        :
                        null
                    }
                </div>
            </section>
            <form className="msger-inputarea p-3" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    className="form-control form-control-bg text-left msger-input"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => { setNewMessage(e.target.value) }}
                    required
                />
                {formStatus != "standby" ?
                    <button type="button" className="msger-send-btn">
                        <LoadingIcon size="30px" />
                    </button>
                    :
                    <button type="submit" className="msger-send-btn">
                        <AiOutlineSend size="30px" color="#393c41" />
                    </button>
                }
            </form>
        </div>
    );
};

export default CollabChat;