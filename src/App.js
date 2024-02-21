import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IoShirtSharp } from "react-icons/io5";
import "bootstrap/dist/css/bootstrap.min.css";
import "Assets/styles/overrides.css";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PortfolioGrid from "Components/Shared/PortfolioGrid";
import EcoFriendly from "Components/Shared/EcoFriendly";
const stripePromise = loadStripe("pk_test_NuJ5XLTawKbspF46LKSgwDbk");

const Home = lazy(() => import("./Pages/Home"));
const LogIn = lazy(() => import("./Pages/LogIn"));
const SignUp = lazy(() => import("./Pages/SignUp"));
const EmailConfirmation = lazy(() => import("./Pages/EmailConfirmation"));
const EmailConfirmed = lazy(() => import("./Pages/EmailConfirmed"));
const Questionnaire = lazy(() => import("./Pages/Questionnaire"));
const About = lazy(() => import("./Pages/About"));
const Buttons = lazy(() => import("./Pages/Elements/Buttons"));
const Forms = lazy(() => import("./Pages/Forms"));
const Stripe = lazy(() => import("./Pages/Stripe"));
const CustomerPage = lazy(() => import("./Pages/CustomerPage"));
const UserCalendar = lazy(() => import("./Pages/User/Calendar"));
const Cart = lazy(() => import("./Pages/Cart"));
const EcoFriendlyFabrics = lazy(() => import("./Pages/EcoFriendlyFabrics"));
const DesignerProfile = lazy(() => import("./Pages/DesignerProfile"));
const ScheduleConsultation = lazy(() => import("./Pages/ScheduleConsultation"));
const Appointments = lazy(() => import("./Pages/Appointments"));
const UserAppointments = lazy(() => import("./Pages/User/Appointments"));
const UserOrders = lazy(() => import("./Pages/User/Orders"));
const Orders = lazy(() => import("./Pages/Orders"));
const Messages = lazy(() => import("./Pages/Messages"));
const RateReview = lazy(() => import("./Pages/RateReview"));
const OrderTrackingDetails = lazy(() => import("./Pages/OrderTrackingDetails"));
const OrderDetails = lazy(() => import("./Pages/OrderDetails"));

// User
const UserProfile = lazy(() => import("./Pages/User/Profile"));
const EditUserProfile = lazy(() => import("./Pages/User/EditProfile"));
const UserMeasurementGuide = lazy(() =>
  import("./Pages/User/MeasurementGuide")
);

// Wishlist
const Wishlists = lazy(() => import("./Pages/Wishlists"));

// Portfolio
const UserPortfolio = lazy(() => import("./Pages/User/Portfolio"));
const AddNewPortfolio = lazy(() => import("./Pages/Portfolio/AddNewPortfolio"));
const EditPortfolio = lazy(() => import("./Pages/Portfolio/EditPortfolio"));
const ViewPortfolio = lazy(() => import("./Pages/Portfolio/ViewPortfolio"));

// Product
const UserProducts = lazy(() => import("./Pages/User/Products"));
const AddNewProduct = lazy(() => import("./Pages/Product/AddNewProduct"));
const EditProduct = lazy(() => import("./Pages/Product/EditProduct"));
const ViewProduct = lazy(() => import("./Pages/Product/ViewProduct"));

// Design
const Designs = lazy(() => import("./Pages/Designs"));

// Fabrics
const Fabrics = lazy(() => import("./Pages/Fabrics"));

// Designers
const Designers = lazy(() => import("./Pages/Designers"));

// Under Construction
const UnderConstruction = lazy(() => import("./Pages/UnderConstruction"));

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
          <Route path="/stripe" element={<Stripe />} />
        </Routes>
      </Elements>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/login" exact element={<LogIn />} />
          <Route path="/sign-up" exact element={<SignUp />} />
          <Route
            path="/email-confirmation"
            exact
            element={<EmailConfirmation />}
          />
          <Route path="/email-confirmed/:userCode" exact element={<EmailConfirmed />} />
          <Route path="/questionnaire" exact element={<Questionnaire />} />
          <Route path="/about" exact element={<About />} />
          <Route path="/elements/buttons" exact element={<Buttons />} />
          <Route path="/forms" exact element={<Forms />} />
          <Route path="/customer" exact element={<CustomerPage />} />
          <Route path="/:user/profile" exact element={<UserProfile />} />
          <Route
            path="/:user/profile/edit"
            exact
            element={<EditUserProfile />}
          />
          <Route
            path="/user/center/guide"
            exact
            element={<UserMeasurementGuide />}
          />

          {/* Portfolio */}
          <Route path="/portfolio/add" exact element={<AddNewPortfolio />} />
          <Route
            path="/portfolio/:portfolioId"
            exact
            element={<ViewPortfolio />}
          />
          <Route
            path="/portfolio/:portfolioId/edit"
            exact
            element={<EditPortfolio />}
          />
          <Route path="/user/center/portfolio" exact element={<UserPortfolio />} />

          {/* Product */}
          <Route path="/product/add" exact element={<AddNewProduct />} />
          <Route path="/product/:productId" exact element={<ViewProduct />} />
          <Route
            path="/product/:productId/edit"
            exact
            element={<EditProduct />}
          />
          <Route path="/user/center/products" exact element={<UserProducts />} />

          {/* Designs */}
          <Route path="/find-designs" exact element={<Designs />} />
          <Route path="/designs" exact element={<Designs />} />
          <Route
            path="/design/:portfolioId"
            exact
            element={<ViewPortfolio />}
          />

          {/* Under Construction */}

          <Route path="/inspirations" exact element={<UnderConstruction />} />
          <Route path="/blog" exact element={<UnderConstruction />} />
          <Route path="/wishlist" exact element={<Wishlists />} />
          <Route path="/orders" exact element={<Orders />} />

          <Route path="/category/tops" exact element={<UnderConstruction />} />
          <Route
            path="/category/dresses"
            exact
            element={<UnderConstruction />}
          />
          <Route path="/category/pants" exact element={<UnderConstruction />} />
          <Route
            path="/category/skirts"
            exact
            element={<UnderConstruction />}
          />

          <Route path="/about-kouture-konect" exact element={<About />} />
          <Route path="/how-it-works" exact element={<UnderConstruction />} />

          <Route path="/designers" exact element={<Designers />} />
          <Route path="/fabrics" exact element={<Fabrics />} />
          <Route path="/designs" exact element={<Designs />} />
          <Route path="/eco-friendly" exact element={<EcoFriendlyFabrics />} />
          <Route path="/cart" exact element={<Cart />} />
          <Route
            path="/user/center/calendar"
            exact
            element={<UserCalendar />}
          />
          <Route path="/designer-profile" exact element={<DesignerProfile />} />
          <Route
            path="/appointments/:designerId"
            exact
            element={<Appointments />}
          />
          <Route path="/user/center/orders" exact element={<UserOrders />} />
          <Route path="/messages" exact element={<Messages />} />
          <Route
            path="/rate-review/:productId"
            exact
            element={<RateReview />}
          />
          <Route
            path="/order/:orderId/details"
            exact
            element={<OrderDetails />}
          />
          <Route
            path="/order/:orderId/track"
            exact
            element={<OrderTrackingDetails />}
          />
          <Route
            path="/user/center/appointments"
            exact
            element={<UserAppointments />}
          />
          <Route
            path="/appointment/schedule/:designerId"
            exact
            element={<ScheduleConsultation />}
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
