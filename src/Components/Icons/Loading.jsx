import React from "react";
import { AiOutlineLoading } from "react-icons/ai";

const LoadingIcon = ({ size, color }) => {
    return <AiOutlineLoading className="icon-loading" size={size ? size : "20px"} color={color ? color : "#393c41"} />;
};

export default LoadingIcon;