import React, { useEffect, useState, useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import firestore from "../../firebaseConfig";
import { AiOutlineSend } from "react-icons/ai";
import { GrAttachment } from "react-icons/gr";
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileCsv, FaFilePowerpoint, FaFile } from 'react-icons/fa';
import { FaRegFileZipper, FaImage  } from "react-icons/fa6";
import { RiFolderVideoFill } from "react-icons/ri";
import { FiFileText } from "react-icons/fi";
import { TiDelete } from "react-icons/ti";
import LoadingIcon from "../Icons/Loading";
import Loading from "Components/Shared/Loading";
import UserPlaceholder from 'Assets/images/user.png';
import toast from 'react-hot-toast';
import axios from "axios";
import { useCookies } from 'react-cookie';

const LiveStreamChat = ({ livestreamId, user, currentUser, loading, status }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'token']);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [formStatus, setFormStatus] = useState("standby");
    const [chatLoading, setChatLoading] = useState(loading != "" ? loading : true);
    const [attachedImage, setAttachedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [attachedFile, setAttachedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const userImage = user?.image;
    const chatContainerRef = useRef(null);
    const scrollableDivRef = useRef(null);
    const [uploadStatus, setUploadStatus] = useState("standby");
    const hiddenFileInput = useRef(null);
    const hiddenImgInput = useRef(null);
    const textInputRef = useRef(null);

    const current_user_id = cookies.currentUser;
    const token = cookies.token;

    useEffect(() => {
        // Fetch chat messages of the given meeting from Firestore
        if (livestreamId) {
            setChatLoading(loading != "" ? loading : true);
            const unsubscribe = firestore
                .collection("livestreams")
                .doc(livestreamId)
                .collection("livestream_chats")
                .orderBy("timestamp", "asc")
                .onSnapshot((snapshot) => {
                    const chatData = snapshot.docs.map((doc) => {
                        const chat = doc.data();
                        // Check if the chat is unread and update its status to "read"
                        if (chat.status === "unread" && chat.user_id == currentUser) {
                            firestore
                                .collection("livestreams")
                                .doc(livestreamId)
                                .collection("livestream_chats")
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

    }, [livestreamId]);

    useEffect(() => {
        // Scroll to the bottom of the div when component mounts or updates
        if (scrollableDivRef.current) {
            scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
        }
    });

    const handleClickImg = () => {
        hiddenImgInput.current.click(); 
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    };
    const handleClickFile =() => {
        hiddenFileInput.current.click();
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    }

    const handleChangeImg = ({ target }) => {
        if (target.files.length < 1 || !target.validity.valid) return;
    
        const selectedFile = target.files[0];
        const maxFileSize = 8 * 1024 * 1024; 

        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'
        ];

        // Validate file type
        if (!allowedTypes.includes(selectedFile.type)) {
            toast.error('Invalid file type. Please upload a valid image file.');
            return false;
        }

        if (selectedFile.size > maxFileSize) {
            toast.error("File size exceeds 8MB");
            return;
        }

        if (selectedFile.type.startsWith("image/")) {
            setAttachedImage(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile));
        } else {
            toast.error("Please select a valid Image File")
        }
    
        hiddenFileInput.current.value = ""; 
        hiddenImgInput.current.value = "";
    };

    const handleChangeFile = ({ target }) => {
        if (target.files.length < 1 || !target.validity.valid) return;
    
        const selectedFile = target.files[0];
        const maxFileSize = 8 * 1024 * 1024; 

        const allowedFileTypes = [
            'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain', 'application/zip', 'video/mp4', 'video/x-matroska',
            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];
    
        // Validate file type
        if (!allowedFileTypes.includes(selectedFile.type) && !allowedFileTypes.includes(selectedFile.type)) {
            toast.error('Invalid file type. Please upload a valid file.');
            return false;
        }

        if (selectedFile.size > maxFileSize) {
            toast.error("File size exceeds 8MB");
            return;
        }

        if (selectedFile.type.startsWith("image/")) {
            setAttachedImage(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile));
        } else {
            setAttachedFile(selectedFile);
            setFilePreview(selectedFile.name);
        }
    
        hiddenFileInput.current.value = ""; 
        hiddenImgInput.current.value = "";
    };

    const getFileIcon = (fileType) => {
        if (fileType.includes('pdf')) {
            return <FaFilePdf size={80} color="red" />;
        } else if (fileType.includes('msword') || fileType.includes('word') || fileType.includes('docx') ) {
            return <FaFileWord size={80} color="blue" />;
        } else if (fileType.includes('excel') || fileType.includes('spreadsheet') || fileType.includes('xlsx')) {
            return <FaFileExcel size={80} color="green" />;
        } else if (fileType.includes('csv')) {
            return <FaFileCsv size={80} color="orange" />;
        } else if (fileType.includes('plain')) {
            return <FiFileText size={80} color="gray" />;
        } else if (fileType.includes('powerpoint')) {
            return <FaFilePowerpoint size={80} color="purple" />;
        } else if (fileType.includes('zip') || fileType.includes('rar')) {
            return <FaRegFileZipper size={80} color="orange" />;
        } else if (fileType.includes('mp4') || fileType.includes('mkv')) {
            return <RiFolderVideoFill size={80} color="red" />;
        }else {
            return <FaFile size={80} color="gray" />;
        }
    };
    
    const clearFilePreview = () => {
        setImagePreview(null);
        setAttachedImage(null);
        setAttachedFile(null);
        setFilePreview(null);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setFormStatus("loading");
    
        let uploadedFileUrl = null;
        let uploadedFileType = null;

        if (attachedImage || attachedFile) {
            try {
                const dataArray = new FormData();
                const fileToUpload = attachedImage || attachedFile;
                dataArray.append("file", fileToUpload);
    
                const response = await axios.post(
                    `${import.meta.env.VITE_REACT_APP_API_ENDPOINT}user/file?current_user_id=${current_user_id}&token=${token}`,
                    dataArray,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                if (response.data.status === "Success") {
                    uploadedFileUrl = response.data.data.file; 
                    uploadedFileType = fileToUpload.type;
                }
            } catch (error) {
                toast.error("Failed to upload file. Please try again.");
                setFormStatus("standby");
                return;
            }
        }
        try {
            await firestore.collection("livestreams").doc(livestreamId).collection("livestream_chats").add({
                user_id: currentUser,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                message: newMessage,
                image: userImage,
                attached_file: uploadedFileUrl, 
                file_type: uploadedFileType,
                timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
                status: "unread"
            });
            setNewMessage("");
            clearFilePreview();
            if (chatMessages && chatMessages.length > 2) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }finally {
            setFormStatus("standby");
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
                <div className="msger-chat scroll-chat p-2" ref={scrollableDivRef}>
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
                                                            <div className="msg-img" style={{ backgroundImage: `url(${import.meta.env.VITE_REACT_APP_STORAGE_URL}user/${chat.image})` }}> </div>
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
                                                                {chat.attached_file && (
                                                                    chat.file_type?.startsWith("image/") ? (
                                                                        <img
                                                                            src={`${import.meta.env.VITE_REACT_APP_STORAGE_URL}file/${chat.attached_file}`}
                                                                            alt="Attached"
                                                                            className="w-100"
                                                                        />
                                                                    ) : (
                                                                        <a
                                                                            href={`${import.meta.env.VITE_REACT_APP_STORAGE_URL}file/${chat.attached_file}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            download = {chat.attached_file}
                                                                        >
                                                                            <div className="file-message-container border rounded p-4 h-100 text-center bg-light">
                                                                                {getFileIcon(chat.attached_file)}
                                                                                <p className="fs-14 mt-4 text-ellipsis">{chat.attached_file}</p>
                                                                            </div>
                                                                        </a>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <div className="msg left-msg">
                                                        {chat.image && chat.image != "" ?
                                                            <div className="msg-img" style={{ backgroundImage: `url(${import.meta.env.VITE_REACT_APP_STORAGE_URL}user/${chat.image})` }}> </div>
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
                                                                {chat.attached_file && (
                                                                    chat.file_type?.startsWith("image/") ? (
                                                                        <img
                                                                            src={`${import.meta.env.VITE_REACT_APP_STORAGE_URL}file/${chat.attached_file}`}
                                                                            alt="Attached"
                                                                            className="w-100"
                                                                        />
                                                                    ) : (
                                                                        <a
                                                                            href={`${import.meta.env.VITE_REACT_APP_STORAGE_URL}file/${chat.attached_file}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            download = {chat.attached_file}
                                                                        >   
                                                                            <div className="file-message-container border rounded p-4 h-100 text-center bg-light">
                                                                                {getFileIcon(chat.attached_file)}
                                                                                <p className="fs-14 mt-4 text-ellipsis">{chat.attached_file}</p>
                                                                            </div>
                                                                        </a>
                                                                    )
                                                                )}
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
            {status != "Ended" ?
                <div class="message-input-submit">
                    <form className="msger-inputarea my-2" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            className="form-control border-none bg-white text-left msger-input"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            required={!attachedImage && !attachedFile}
                            id="text-message-input"
                            ref={textInputRef}
                            autocomplete="off"
                        />
                        {formStatus != "standby" ||  uploadStatus != "standby" ?
                            <button type="button" className="msger-send-btn">
                                <LoadingIcon size="30px" />
                            </button>
                            :
                            <div>
                                <button type="button" className="msger-send-btn" title="Upload image" onClick={handleClickImg}>
                                    <FaImage size="28px" color="#393c41" />
                                </button>
                                <button type="button" className="msger-send-btn" title="Upload file" onClick={handleClickFile}>
                                    <GrAttachment size="28px" color="#393c41" />
                                </button>
                                <button type="submit" className="msger-send-btn">
                                    <AiOutlineSend size="30px" color="#393c41" />
                                </button>
                            </div>
                            
                        }
                        <input type="file"
                            ref={hiddenFileInput}
                            onChange={handleChangeFile}
                            style={{ display: 'none' }}
                            name="attached_image"
                        />
                        <input type="file"
                            ref={hiddenImgInput}
                            onChange={handleChangeImg}
                            style={{ display: 'none' }}
                            name="attached_image"
                            accept="image/*"
                        />
                    </form>
                    {(imagePreview || filePreview) && (
                        <div className="preview-attachments-container ms-2 mb-2" style={{ width: '150px', height: '150px' }}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Selected Preview" className="preview-image w-100 h-100" />
                            ) : (                           
                                <div className="file-preview-container rounded p-2 h-100 text-center bg-light">
                                    {getFileIcon(filePreview)}
                                    <p className="fs-14 mt-4 text-ellipsis">{filePreview}</p>
                                </div>                         
                            )}
                            <TiDelete
                                className="delete-image-message-attachment-btn cursor-pointer"
                                size={30}
                                color="red"
                                onClick={clearFilePreview}
                            />
                        </div>
                    )}
                </div>                                  
                :
                null
            }
        </div>
    );
};

export default LiveStreamChat;