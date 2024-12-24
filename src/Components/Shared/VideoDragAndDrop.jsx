import React, { useState, useRef, useEffect } from 'react';
import 'Assets/styles/Components/VideoDragAndDrop/style.css'; // Add your styling here
import { SlCloudUpload } from 'react-icons/sl';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaTimesCircle } from "react-icons/fa";
import { Card, CardBody } from 'reactstrap';
import Loading from './Loading';
import ResponsiveVideo from './ResponsiveVideo';

const VideoDragAndDrop = (props) => {
  const fileInputRef = useRef(null);

  const [video, setVideo] = useState([]);
  const [videoInputKey, setFileInputKey] = useState(Date.now());
  const [uploadStatus, setUploadStatus] = useState('standby');
  const [videoUrl, setVideoUrl] = useState('');
  const size = props.size;
  const type = props.type;
  const videoLink = props.videoLink;

  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'token']);

  const token = cookies.token;
  const currentUser = cookies.currentUser;
  const current_user_id = cookies.currentUser;

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the value of the input
    }
  };

  const fileUploaded = (e) => {
    props.onVideoChange(e);
  }

  const handleDrop = (e) => {
    e.preventDefault();

    const droppedFiles = e.dataTransfer.files;
    
    // Optionally, check the file types (if you want extra validation)
    const validFiles = Array.from(droppedFiles).filter((file) => file.type.startsWith('video/'));

    if (validFiles.length > 0) {
      handleFiles(validFiles); // Pass valid files to your handler
    } else {
      toast.error('Please select valid video files');
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    setVideo([]);
    setVideoUrl('');
    clearFileInput();
    fileUploaded('');
  }

  let videoType = "portfolio";

  if (type) {
    if (type == "portfolio") {
      videoType = "portfolio";
    } else if (type == "product") {
      videoType = "product";
    }
  }

  const submitDocumentsSequentially = async (video) => {
    setUploadStatus("loading");
    const updatedVideoUrls = [...videoUrl];

    for (const videoInfo of video) {
      const dataArray = new FormData();
      dataArray.append("url", videoInfo.file);

      let apiLink = "";
      if (videoType == "portfolio") {
        apiLink = import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'portfolio/items/video/upload?current_user_id=' + current_user_id + '&token=' + token;
      } else {
        apiLink = import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'product/video/upload?current_user_id=' + current_user_id + '&token=' + token;
      }

      try {
        const response = await axios.post(
          `${apiLink}`,
          dataArray,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );

        if (response.data.status === "Success") {
          const video = response.data.data.url;
          const videoUrlObject = video;

          // Video have been uploaded
          fileUploaded(videoUrlObject);
          setVideoUrl(videoUrlObject);

          let reader = new FileReader();

          reader.onloadend = () => {
            // Do something with the uploaded video, if needed
            // For example, update state or perform additional actions
            // setDocuments((prevDocuments) => [
            //   ...prevDocuments,
            //   { media_id: mediaId, name: videoInfo.file.name, url: reader.result, type: videoInfo.file.type }
            // ]);
          };

          reader.readAsDataURL(videoInfo.file);
        } else {
          const errors = response.data.errors;
          if (errors.video_url) {
            toast.error(errors.video_url[0]);
          } else {
            errors.map((error, index) => {
              toast.error(error);
              return null; // React requires a return value, so we return null here
            });
          }
        }
      } catch (error) {
        toast.error("An error occurred. Please try again or contact the administrator.");
        setUploadStatus("standby");
        // Handle error if needed
      }
    }

    // All video have been uploaded
    setUploadStatus("standby");
  };

  const handleFiles = (fileList) => {
    const newVideo = Array.from(fileList).map((file) => ({
      id: Date.now(),
      file,
      url: URL.createObjectURL(file),
    }));

    submitDocumentsSequentially(newVideo);
    setVideo(newVideo);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // const handleFileInput = (e) => {
  //   const selectedFiles = e.target.files;
  //   handleFiles(selectedFiles);
  // };
  const handleFileInput = (e) => {
    const selectedFiles = e.target.files;
  
    // Optionally, check the file types (if you want extra validation)
    const validFiles = Array.from(selectedFiles).filter((file) => file.type.startsWith('video/'));
  
    if (validFiles.length > 0) {
      handleFiles(validFiles); // Pass valid files to your handler
    } else {
      toast.error('Please select valid video files');
    }
  };
  
  useEffect(() => {
    if (videoLink && videoLink != "") {
      setVideoUrl(videoLink);
    }

  }, [videoLink]);

  return (
    <>
      <div
        className="image-drop-container cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          key={videoInputKey} // Add a key to the file input
          id="videoInput"
          onChange={handleFileInput}
          className="file-input d-block opacity-0"
          accept="video/*"
          ref={fileInputRef}
        />
        <label htmlFor="videoInput" className="file-label d-block text-center cursor-pointer">
          <SlCloudUpload className="d-block mx-auto text-mgray mb-2" size="50px" />
          <p className="text-mgray mb-2">Drag and drop file here</p>
          <p className="text-mgray mb-2">Or</p>
          <p>Browse File</p>
        </label>
      </div>
      {video.length > 0 || videoUrl ?
        <>
          <p className="mt-3">Uploaded Video: </p>
          <Card>
            <CardBody>
              <Row>
                {uploadStatus != "standby" ?
                  <>
                    <Col lg={12} className="video-preview " style={{ minHeight: '150px' }}>
                      <Loading />
                    </Col>
                  </>
                  :
                  <Col lg={12}>
                    <div className='image-dnd' style={{ minHeight: 140 }}>
                      <ResponsiveVideo src={import.meta.env.VITE_REACT_APP_STORAGE_URL + 'products/videos/' + videoUrl} />
                      <div className="dnd-actions-overlay" style={{ top: 0 }}>
                        <FaTimesCircle size="25px" onClick={(e) => handleRemove(e)} className="remove-icon cursor-pointer text-danger" />
                      </div>
                    </div>
                  </Col>
                }
              </Row>
            </CardBody>
          </Card>
        </>
        :
        null
      }
    </>
  );
};

export default VideoDragAndDrop;
