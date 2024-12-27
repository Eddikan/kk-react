import { Navigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useCookies } from "react-cookie";
const ProtectedRoute = ({ children }) => {
  const [cookies] = useCookies(["isLoggedIn"]);
  const isLoggedIn = cookies.isLoggedIn;
  if (!isLoggedIn) {
    toast.error("You need to login to access this page");
    return (
      <>
        <Toaster position="top-right" reverseOrder={false} />
        <Navigate to="/" />;
      </>
    );
  }

  if (!isLoggedIn) {
    return null; // Render nothing while waiting for the redirect
  }

  return children; // Render the protected content if authenticated
};

export default ProtectedRoute;
