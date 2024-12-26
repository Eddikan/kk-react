import { Navigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const isAuthenticated = () => {
  return false; // Set to false for testing unauthorized access
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    toast.error("You need to login to access this page");

    return (
      <>
        <Toaster position="top-right" reverseOrder={false} />
        <Navigate to="/" />;
      </>
    );
  }

  if (!isAuthenticated()) {
    return null; // Render nothing while waiting for the redirect
  }

  return children; // Render the protected content if authenticated
};

export default ProtectedRoute;
