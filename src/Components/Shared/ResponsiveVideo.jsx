import React from 'react';

const ResponsiveVideo = ({ src }) => {
  const containerStyle = {
    width: '100%',
    height: '100%',
    position: 'relative',
  };

  const videoStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    minHeight: 240,
  };

  return (
    <div style={containerStyle}>
      <video src={src} autoPlay loop muted style={videoStyle} />
    </div>
  );
};

export default ResponsiveVideo;
