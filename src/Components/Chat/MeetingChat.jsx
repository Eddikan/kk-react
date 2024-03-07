import React, { useEffect, useState, useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import firestore from "../../firebaseConfig";
import { AiOutlineSend } from "react-icons/ai";
import LoadingIcon from "../Icons/Loading";

const MeetingChat = ({ appointmentId, user, currentUser }) => {
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [formStatus, setFormStatus] = useState("standby");
    const userImage = user?.image;
    const chatContainerRef = useRef(null);

    useEffect(() => {
        // Fetch chat messages of the given meeting from Firestore
        const unsubscribe = firestore
            .collection("meetings")
            .doc(appointmentId)
            .collection("appointment_chats")
            .orderBy("timestamp", "asc")
            .onSnapshot((snapshot) => {
                const chatData = snapshot.docs.map((doc) => doc.data());
                setChatMessages(chatData);
            });
        return () => unsubscribe();
    }, [appointmentId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setNewMessage("");
        setFormStatus('loading');
        try {
            await firestore.collection("meetings").doc(appointmentId).collection("appointment_chats").add({
                user_id: currentUser,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                message: newMessage,
                image: userImage,
                timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
            });
            if (chatMessages && chatMessages.length > 2) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
            setFormStatus('standby');
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

    return (
        <div>
            <section className="msger mt-1" ref={chatContainerRef}>
                <div className="msger-chat scroll-chat p-2">
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
                                                        <div className="msg-info-time">{formatTimestamp(chat.timestamp)}</div>
                                                    </div>
                                                    <div className="msg-text">
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
                                                        <div className="msg-info-time">{formatTimestamp(chat.timestamp)}</div>
                                                    </div>
                                                    <div className="msg-text">
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
            <form className="msger-inputarea mb-3 mt-4" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    className="form-control form-control-bg text-left msger-input"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
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

export default MeetingChat;