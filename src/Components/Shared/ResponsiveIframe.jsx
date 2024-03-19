import React from 'react';

const ResponsiveIframe = ({ src, title }) => {
  const containerStyle = {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%', // 16:9 aspect ratio (height is 56.25% of width)
    overflow: 'hidden',
  };

  const iframeStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '5px',
  };

  return (
    <div style={containerStyle}>
      <iframe
        src={src}
        frameBorder="0"
        allowFullScreen
        style={iframeStyle}
        title={title}
        allow="camera; microphone; accelerometer; magnetometer; gyroscope"
      ></iframe>
    </div>
  );
};

export default ResponsiveIframe;