import React, { useState } from 'react';
import 'Assets/styles/Components/ImageDragAndDrop/style.css'; // Add your styling here
import { SlCloudUpload } from 'react-icons/sl';

const ImageDragAndDrop = ({ onImagesChange }) => {
  const [images, setImages] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handleDrop = (e) => {
    e.preventDefault();

    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleFiles = (fileList) => {
    const newImages = Array.from(fileList).map((file) => ({
      id: Date.now(),
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
    onImagesChange((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRemove = (id) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== id));
    onImagesChange((prevImages) => prevImages.filter((img) => img.id !== id));
    setFileInputKey(Date.now()); // Update the key to trigger re-render of file input
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInput = (e) => {
    const selectedFiles = e.target.files;
    handleFiles(selectedFiles);
  };

  return (
    <div
      className="image-drop-container cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        key={fileInputKey} // Add a key to the file input
        id="fileInput"
        onChange={handleFileInput}
        className="file-input d-block opacity-0"
        multiple
      />
      {images.map((image) => (
        <div key={image.id} className="image-preview">
          <img src={image.url} alt="Dropped" className="dropped-image w-100" />
          <button onClick={() => handleRemove(image.id)} className="remove-btn">
            Remove
          </button>
        </div>
      ))}
      <label htmlFor="fileInput" className="file-label d-block text-center cursor-pointer">
        <SlCloudUpload className="d-block mx-auto text-mgray mb-2" size="50px" />
        <p className="text-mgray mb-2">Drag and drop file here</p>
        <p className="text-mgray mb-2">Or</p>
        <p>Browse File</p>
      </label>
    </div>
  );
};

export default ImageDragAndDrop;
