import React, { useState, useEffect, useRef } from 'react';
import 'Assets/styles/Components/ImageDragAndDrop/style.css'; // Add your styling here
import { SlCloudUpload } from 'react-icons/sl';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaTimesCircle } from "react-icons/fa";
import { Card, CardBody } from 'reactstrap';
import Loading from './Loading';

const ImageDragAndDrop = (props) => {
  const [images, setImages] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [uploadStatus, setUploadStatus] = useState('standby');
  const [imageUrls, setImageUrls] = useState([]);
  const propImages = props.images;
  const size = props.size;
  const type = props.type;
  const fileInputRef = useRef(null);

  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'token']);

  const token = cookies.token;
  const currentUser = cookies.currentUser;
  const current_user_id = cookies.currentUser;

  const filesUploaded = (e) => {
    props.onImagesChange(e);
  }

  const handleDrop = (e) => {
    e.preventDefault();

    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  let imageType = "portfolio";

  if (type) {
    if (type == "portfolio") {
      imageType = "portfolio";
    } else if (type == "product") {
      imageType = "product";
    }
  }

  const submitDocumentsSequentially = async (images) => {
    setUploadStatus("loading");
    const updatedImageUrls = [...imageUrls];

    for (const imageInfo of images) {
      const dataArray = new FormData();
      dataArray.append("image_url", imageInfo.file);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_ENDPOINT}${imageType}/image?current_user_id=${current_user_id}&token=${token}`,
          dataArray,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );

        if (response.data.status === "Success") {
          const image = response.data.data.image_url;
          const imageUrlObject = { id: imageInfo.id, image_url: image };

          updatedImageUrls.push(imageUrlObject);

          // Image have been uploaded
          const uploadedFiles = [...updatedImageUrls];
          filesUploaded(uploadedFiles);
          setImageUrls((prevImageUrls) => [...prevImageUrls, imageUrlObject]);

          let reader = new FileReader();

          reader.onloadend = () => {
            // Do something with the uploaded image, if needed
            // For example, update state or perform additional actions
            // setDocuments((prevDocuments) => [
            //   ...prevDocuments,
            //   { media_id: mediaId, name: imageInfo.file.name, url: reader.result, type: imageInfo.file.type }
            // ]);
          };

          reader.readAsDataURL(imageInfo.file);
        } else {
          const errors = response.data.errors;
          if (errors.image_url) {
            toast.error(errors.image_url[0]);
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

    // All images have been uploaded
    setUploadStatus("standby");
  };

  const handleFiles = (fileList) => {
    const newImages = Array.from(fileList).map((file) => ({
      id: Date.now(),
      file,
      url: URL.createObjectURL(file),
    }));

    submitDocumentsSequentially(newImages);
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRemove = (id, index) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== id));
    const currentImages = [...imageUrls];
    filesUploaded(currentImages.filter((_, i) => i !== index));
    setImageUrls(currentImages.filter((_, i) => i !== index));
    setFileInputKey(Date.now()); // Update the key to trigger re-render of file input
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInput = (e) => {
    const selectedFiles = e.target.files;
    handleFiles(selectedFiles);
  };

  const handleAdd = () => {
    // Trigger the file input when the "Add More" button is clicked
    fileInputRef.current.click();
  };


  useEffect(() => {
    if (propImages) {
      setImageUrls(propImages);
    }
  }, [propImages]);

  return (
    <div
      className="image-drop-container cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        key={fileInputKey} // Add a key to the file input
        id=""
        onChange={handleFileInput}
        className="file-input d-block opacity-0 d-none"
        ref={fileInputRef}
        accept="image/*"
        multiple
      />
      <label htmlFor="" onClick={handleAdd} className="file-label d-block text-center cursor-pointer">
        <SlCloudUpload className="d-block mx-auto mb-2" color="#CEA835" size="50px" />
        <p className="text-mgray mb-2">Drag and drop file here</p>
        <p className="text-mgray mb-2">Or</p>
        <p>Browse File</p>
      </label>
      {images.length > 0 || imageUrls.length > 0 ?
        <>
          <p>Photos: </p>
          <Card>
            <CardBody>
              <Row>
                {imageUrls.map((image, index) => (
                  <>
                    {size == "small" ?
                      <>
                        {images.length > 3 && index > 2 ?
                          <Col lg={4} key={image.id} className="image-preview mt-3">
                            <div className="image-dnd min" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + imageType + '/' + image.image_url + ")" }}>
                              <div className="dnd-actions-overlay">
                                <FaTimesCircle size="25px" onClick={() => handleRemove(image.id, index)} className="remove-icon cursor-pointer text-danger" />
                              </div>
                            </div>
                          </Col>
                          :
                          <Col lg={4} key={image.id} className="image-preview">
                            <div className="image-dnd min" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + imageType + '/' + image.image_url + ")" }}>
                              <div className="dnd-actions-overlay">
                                <FaTimesCircle size="25px" onClick={() => handleRemove(image.id, index)} className="remove-icon cursor-pointer text-danger" />
                              </div>
                            </div>
                          </Col>
                        }
                      </>
                      : size == "normal" ?
                        <>
                          {images.length > 3 && index + 1 > 3 ?
                            <Col lg={4} key={image.id} className="image-preview mt-3">
                              <div className="image-dnd normal" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + imageType + '/' + image.image_url + ")" }}>
                                <div className="dnd-actions-overlay">
                                  <FaTimesCircle size="25px" onClick={() => handleRemove(image.id, index)} className="remove-icon cursor-pointer text-danger" />
                                </div>
                              </div>
                            </Col>
                            :
                            <Col lg={4} key={image.id} className="image-preview">
                              <div className="image-dnd normal" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + imageType + '/' + image.image_url + ")" }}>
                                <div className="dnd-actions-overlay">
                                  <FaTimesCircle size="25px" onClick={() => handleRemove(image.id, index)} className="remove-icon cursor-pointer text-danger" />
                                </div>
                              </div>
                            </Col>
                          }
                        </>
                        :
                        <>
                          {images.length > 3 && index > 3 ?
                            <Col lg={3} key={image.id} className="image-preview mt-3">
                              <div className="image-dnd large" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + imageType + '/' + image.image_url + ")" }}>
                                <div className="dnd-actions-overlay">
                                  <FaTimesCircle size="25px" onClick={() => handleRemove(image.id, index)} className="remove-icon cursor-pointer text-danger" />
                                </div>
                              </div>
                            </Col>
                            :
                            <Col lg={3} key={image.id} className="image-preview">
                              <div className="image-dnd large" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + imageType + '/' + image.image_url + ")" }}>
                                <div className="dnd-actions-overlay">
                                  <FaTimesCircle size="25px" onClick={() => handleRemove(image.id, index)} className="remove-icon cursor-pointer text-danger" />
                                </div>
                              </div>
                            </Col>
                          }
                        </>
                    }
                  </>
                ))}
                {uploadStatus != "standby" ?
                  <>
                    {size == "small" ?
                      <>
                        {images.length > 3 ?
                          <Col lg={4} className="image-preview mt-3" style={{ minHeight: '150px' }}>
                            <Loading />
                          </Col>
                          :
                          <Col lg={4} className="image-preview" style={{ minHeight: '150px' }}>
                            <Loading />
                          </Col>
                        }
                      </>
                      : size == "normal" ?
                        <>
                          {images.length > 3 ?
                            <Col lg={4} className="image-preview mt-3" style={{ minHeight: '225px' }}>
                              <Loading />
                            </Col>
                            :
                            <Col lg={4} className="image-preview" style={{ minHeight: '225px' }}>
                              <Loading />
                            </Col>
                          }
                        </>
                        :
                        <>
                          {images.length > 4 ?
                            <Col lg={3} className="image-preview mt-3" style={{ minHeight: '250px' }}>
                              <Loading />
                            </Col>
                            :
                            <Col lg={3} className="image-preview" style={{ minHeight: '250px' }}>
                              <Loading />
                            </Col>
                          }
                        </>
                    }
                  </>
                  :
                  null
                }
              </Row>
            </CardBody>
          </Card>
        </>
        :
        null
      }
    </div>
  );
};

export default ImageDragAndDrop;
