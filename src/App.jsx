import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IoShirtSharp } from "react-icons/io5";
import "bootstrap/dist/css/bootstrap.min.css";
import "Assets/styles/overrides.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { unAuthenticatedRoutes, authenticatedRoutes, stripeRoutes } from "./seperatedRoutes";
import ProtectedRoute from "Components/Layout/ProtectedRoute";

// import {unAuthenticatedRoutes,authenticatedRoutes,stripeRoutes} from "./routePages"
// dont delete these comments
// import PortfolioGrid from "Components/Shared/PortfolioGrid";
// import EcoFriendly from "Components/Shared/EcoFriendly";
const stripePromise = loadStripe(
  "pk_test_51KH5FQEHRDNky8yNuVaslaQXG2zhzUjBuooEw7vp8LKMwMd5eEd5xt5RAL0UdiuVJf7dMAwllXdSiDkvvSp9qzT700fhQD4wrQ"
);



const DelayedFallback = ({ delay, children }) => {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return show ? children : null;
};

const LoadingPage = () => {
  return (
    <>
      <div className="full-screen-container">
        <div className="center-content">
          <IoShirtSharp color="#000000" className="centered-icon" />
        </div>
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Elements stripe={stripePromise}>
        <Routes>
          {stripeRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Elements>
      <Suspense
        fallback={
          <DelayedFallback delay={300}>
            <LoadingPage />
          </DelayedFallback>
        }
      >
        <Routes>
          {unAuthenticatedRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact
              element={route.element}
            />
          ))}
          {authenticatedRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact
              element={
                <ProtectedRoute >
                  {route.element}
                </ProtectedRoute>
              }
            />
          ))}

          {/* <Route path="/checkout" exact element={
             <Elements stripe={stripePromise}>
               <Checkout />
             </Elements>
           } /> */}

          {/* Survey */}
          {/* <Route path="/why-work-with-kk" exact element={<WhyWorkWithKK />} /> */}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
