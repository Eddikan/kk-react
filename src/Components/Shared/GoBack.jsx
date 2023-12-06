import React from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";

function GoBack(props) {
    const navigate = useNavigate();
    const fallBack = props.fallBack;

    const handleGoBack = () => {
        if (window.history.length > 1) {
            // Check if there is a previous page in the history
            navigate(-1); // Navigates back in the history
        } else {
            // There is no previous page, handle accordingly (e.g., go to a specific page)
            if (fallBack && fallBack != "") {
                navigate(fallBack); // Redirect to the home page or another page
            } else {
                navigate('/');
            }
        }
    };

    return (
        <p onClick={handleGoBack} className='cursor-pointer'><IoIosArrowRoundBack /> Back</p>
    );
}

export default GoBack;