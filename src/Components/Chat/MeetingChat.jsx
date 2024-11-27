import React, { useEffect, useState, useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import firestore from "../../firebaseConfig";
import { AiOutlineSend } from "react-icons/ai";
import { FaRegImage } from "react-icons/fa";
import LoadingIcon from "../Icons/Loading";
import Loading from "Components/Shared/Loading";
import UserPlaceholder from 'Assets/images/user.png';
import axios from "axios";
import toast from 'react-hot-toast';

const MeetingChat = ({ appointmentId, user, currentUser, loading }) => {
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [formStatus, setFormStatus] = useState("standby");
    const [chatLoading, setChatLoading] = useState(loading != "" ? loading : true);
    const [attachedImage, setAttachedImage] = useState(null);
    const userImage = user?.image;
    const chatContainerRef = useRef(null);
    const scrollableDivRef = useRef(null);
    const [uploadStatus, setUploadStatus] = useState("standby");
    const hiddenFileInputImg = useRef(null);

    useEffect(() => {
        // Fetch chat messages of the given meeting from Firestore
        if (appointmentId) {
            setChatLoading(loading != "" ? loading : true);
            const unsubscribe = firestore
                .collection("meetings")
                .doc(appointmentId)
                .collection("appointment_chats")
                .orderBy("timestamp", "asc")
                .onSnapshot((snapshot) => {
                    const chatData = snapshot.docs.map((doc) => {
                        const chat = doc.data();
                        // Check if the chat is unread and update its status to "read"
                        if (chat.status === "unread" && chat.user_id == currentUser) {
                            firestore
                                .collection("meetings")
                                .doc(appointmentId)
                                .collection("appointment_chats")
                                .doc(doc.id)
                                .update({ status: "read" })
                                .catch((error) => {
                                    console.error("Error updating chat status:", error);
                                });
                        }
                        return chat;
                    });
                    setChatMessages(chatData);
                    setChatLoading(false);
                });
        }

    }, [appointmentId]);

    useEffect(() => {
        // Scroll to the bottom of the div when component mounts or updates
        if (scrollableDivRef.current) {
            scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
        }
    });

    const submitDocument = (event) => {
        // event.preventDefault();
        setUploadStatus("loading");
        const dataArray = new FormData();
        dataArray.append("image", event);
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'user/image?user_id=' + currentUser.id + '&token=' + currentUser.token, dataArray, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((response) => {
            if (response.data.status == "Success") {
                var media_id = response.data.data.id;
                var attached_image = response.data.data.image;
                setAttachedImage(attached_image);

                let reader = new FileReader();
                let file = event;

                reader.onloadend = () => {
                    // setDocuments(documents => [...documents, { media_id: media_id, name: event.name, url: reader.result, type: event.type }]);
                    // setUserImage(reader.result);
                }
                reader.readAsDataURL(file);
                setUploadStatus("standby");
            }
        })
            .catch(() => {
                toast.error("An error occured. Please try again or contact the administrator.");
                setUploadStatus("standby");
            });
    };

    const handleClickImg = event => {
        hiddenFileInputImg.current.click();
    };

    const handleChangeImg = ({ target }) => {
        if (target.files < 1 || !target.validity.valid) {
            return
        }
        if (target.files[0]) {
            submitDocument(target.files[0]);
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setNewMessage("");
        setAttachedImage('');
        try {
            await firestore.collection("meetings").doc(appointmentId).collection("appointment_chats").add({
                user_id: currentUser,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                message: newMessage,
                image: userImage,
                attached_image: attachedImage, 
                timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
                status: "unread"
            });
            if (chatMessages && chatMessages.length > 2) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
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
                <div className="msger-chat scroll-chat p-2 justify-content-center align-items-center" ref={scrollableDivRef}>
                    {chatLoading ?
                        <>
                            <Loading className="bg-white" />
                        </>
                        :
                        <>
                            {chatMessages && chatMessages.length > 0 ?
                                <>
                                    {chatMessages.map((chat) => (
                                        <>
                                            {currentUser == chat.user_id ?
                                                <>
                                                    <div className="msg right-msg">
                                                        {chat.image && chat.image != "" ?
                                                            <div className="msg-img" style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${chat.image})` }}> </div>
                                                            :
                                                            <div className="msg-img" style={{ backgroundImage: `url(${UserPlaceholder})` }}> </div>
                                                        }
                                                        <div className="msg-bubble">
                                                            <div className="msg-info">
                                                                <div className="msg-info-name">{chat.first_name} {chat.last_name}</div>
                                                                <div className="msg-info-time">{formatTimestamp(chat.timestamp)}</div>
                                                            </div>
                                                            <div className="msg-text">
                                                                {chat.message}
                                                                {chat.attached_image &&
                                                                    <img src={`${process.env.REACT_APP_STORAGE_URL}user/${chat.attached_image}`} className="w-100"/>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <div className="msg left-msg">
                                                        {chat.image && chat.image != "" ?
                                                            <div className="msg-img" style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${chat.image})` }}> </div>
                                                            :
                                                            <div className="msg-img" style={{ backgroundImage: `url(${UserPlaceholder})` }}> </div>
                                                        }
                                                        <div className="msg-bubble bg-light">
                                                            <div className="msg-info">
                                                                <div className="msg-info-name">{chat.first_name} {chat.last_name}</div>
                                                                <div className="msg-info-time">{formatTimestamp(chat.timestamp)}</div>
                                                            </div>
                                                            <div className="msg-text">
                                                                {chat.message}
                                                                {chat.attached_image &&
                                                                    <img src={`${process.env.REACT_APP_STORAGE_URL}user/${chat.attached_image}`} className="w-100"/>
                                                                }
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

                        </>
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
               
                {formStatus != "standby" ||  uploadStatus != "standby" ?
                    <button type="button" className="msger-send-btn">
                        <LoadingIcon size="30px" />
                    </button>
                    :
                    <div>
                        {/* <button type="button" className="msger-send-btn" onClick={handleClickImg}>
                            <FaRegImage size="28px" color="#393c41" />
                        </button> */}
                        <button type="submit" className="msger-send-btn">
                            <AiOutlineSend size="30px" color="#393c41" />
                        </button>
                     </div>
                    
                }
                {/* <input type="file"
                    ref={hiddenFileInputImg}
                    onChange={handleChangeImg}
                    style={{ display: 'none' }}
                    accept="image/*"
                    name="attached_image"
                    required
                /> */}
            </form>
        </div>
    );
};

export default MeetingChat;