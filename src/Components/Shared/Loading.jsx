import React from "react";
import { IoShirtSharp } from "react-icons/io5";

const Loading = (props) => {
  const classNames = props.className;

  return (
    <>
      <div className={`loading-container ${classNames ? classNames : ""}`}>
        <div className="center-content">
          <IoShirtSharp color="#000000" size="50px" className="mt-2 blink" />
          <p className="text-center fs-20 mb-2 mt-3">Loading...</p>
        </div>
      </div>
    </>
  )
}

export default Loading;