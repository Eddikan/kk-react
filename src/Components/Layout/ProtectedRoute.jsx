import { Navigate } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state?.user?.user?.email);
  if (!isLoggedIn) {
    // toast.error("You need to login to access this page");
    return (
      <>
        {/* <Toaster position="top-right" reverseOrder={false} /> */}
        <Navigate to="/login" />;
      </>
    );
  }

  if (!isLoggedIn) {
    return null; // Render nothing while waiting for the redirect
  }

  return children; // Render the protected content if authenticated
};

export default ProtectedRoute;
