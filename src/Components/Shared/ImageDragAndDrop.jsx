import React, { useState, useRef, useEffect } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { SlCloudUpload } from "react-icons/sl";

const ImageDragAndDrop = ({ setImages }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const handleDrop = (e) => {
    e.preventDefault();

    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };
  const handleFiles = (files) => {
    const forEmit = Array.from(files); // Convert FileList to Array
    setImages((prev) => [...prev, ...forEmit]);
    const newImageUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setImageUrls((prevImageUrls) => [...prevImageUrls, ...newImageUrls]);
  };

  const handleImageUpload = (event) => {
    const files = event.target.files;
    handleFiles(files);
  };

  const handleDeleteImage = (index) => {
    setImageUrls((prevImageUrls) =>
      prevImageUrls.filter((_, i) => i !== index)
    );
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const fileInputRef = useRef(null);

  const handleAdd = () => {
    // Trigger the file input when the "Add More" button is clicked
    fileInputRef.current.click();
  };

  return (
    <div
      className="image-drop-container cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        ref={fileInputRef}
        id=""
        onChange={handleImageUpload}
        className="file-input d-block opacity-0 d-none"
        accept="image/*"
        multiple
      />
      <label
        htmlFor=""
        onClick={handleAdd}
        className="file-label d-block text-center cursor-pointer"
      >
        <SlCloudUpload
          className="d-block mx-auto mb-2"
          color="#CEA835"
          size="50px"
        />
        <p className="text-mgray mb-2">Drag and drop file here</p>
        <p className="text-mgray mb-2">Or</p>
        <p>Browse File</p>
      </label>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {imageUrls.map((url, index) => (
          <div
            key={index}
            style={{ position: "relative", margin: "10px" }}
            className="image-preview mt-3"
          >
            <div key={index}>
              <div
                className="image-dnd normal"
                style={{
                  background: "red",
                }}
              >
                <img
                  src={url}
                  alt={`Uploaded ${index}`}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
                <div
                  className="dnd-actions-overlay"
                  style={{
                    position: "absolute",
                    top: "0px",
                    right: "0px",
                  }}
                >
                  <FaTimesCircle
                    size="25px"
                    onClick={() => handleDeleteImage(index)}
                    className="remove-icon cursor-pointer text-danger"
                  />
                </div>
              </div>
            </div>

            {/* <button
              onClick={() => handleDeleteImage(index)}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                cursor: "pointer",
              }}
            >
              X
            </button> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageDragAndDrop;
