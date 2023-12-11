import React from "react";
import { IoShirtSharp } from "react-icons/io5";

const Loading = () => {
  return (
    <>
      <div className="loading-container">
        <div className="center-content">
          <IoShirtSharp color="#000000" size="50px" className="blink" />
        </div>
      </div>
    </>
  )
}

export default Loading;