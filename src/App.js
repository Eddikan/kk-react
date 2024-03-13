import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IoShirtSharp } from "react-icons/io5";
import "bootstrap/dist/css/bootstrap.min.css";
import "Assets/styles/overrides.css";

// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
import PortfolioGrid from "Components/Shared/PortfolioGrid";
import EcoFriendly from "Components/Shared/EcoFriendly";
// const stripePromise = loadStripe("pk_test_NuJ5XLTawKbspF46LKSgwDbk");

const Home = lazy(() => import("./Pages/Home"));
const LogIn = lazy(() => import("./Pages/LogIn"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const SignUp = lazy(() => import("./Pages/SignUp"));
const EmailConfirmation = lazy(() => import("./Pages/EmailConfirmation"));
const EmailConfirmed = lazy(() => import("./Pages/EmailConfirmed"));
const Questionnaire = lazy(() => import("./Pages/Questionnaire"));
const About = lazy(() => import("./Pages/About"));
const Buttons = lazy(() => import("./Pages/Elements/Buttons"));
const Forms = lazy(() => import("./Pages/Forms"));
// const Stripe = lazy(() => import("./Pages/Stripe"));
const CustomerPage = lazy(() => import("./Pages/CustomerPage"));
const UserCalendar = lazy(() => import("./Pages/User/Calendar"));
const Users = lazy(() => import("./Pages/Admin/AdminUsers"));
const Cart = lazy(() => import("./Pages/Cart"));
const ViewDesign = lazy(() => import("./Pages/ViewDesign"));
const EcoFriendlyFabrics = lazy(() => import("./Pages/EcoFriendlyFabrics"));
const DesignerProfile = lazy(() => import("./Pages/DesignerProfile"));
const ScheduleConsultation = lazy(() => import("./Pages/ScheduleConsultation"));
const Appointments = lazy(() => import("./Pages/User/Appointments"));
const UserAppointments = lazy(() => import("./Pages/Seller/Appointments"));
const UserOrders = lazy(() => import("./Pages/Seller/Orders"));
const Orders = lazy(() => import("./Pages/Orders"));
const Messages = lazy(() => import("./Pages/Messages"));
const RateReview = lazy(() => import("./Pages/RateReview"));
const OrderTrackingDetails = lazy(() => import("./Pages/OrderTrackingDetails"));
const OrderDetails = lazy(() => import("./Pages/OrderDetails"));
const VideoConferencing = lazy(() => import("./Pages/VideoConferencing"));

// Admin
const AdminFabrics = lazy(() => import("./Pages/Admin/AdminFabrics"));
const AdminDesigns = lazy(() => import("./Pages/Admin/AdminDesigns"));
const AdminDesigners = lazy(() => import("./Pages/Admin/AdminDesigners"));
const AdminSellers = lazy(() => import("./Pages/Admin/AdminSeller"));
const EditUser = lazy(() => import("./Pages/Admin/EditUser"));
const EditDesigner = lazy(() => import("./Pages/Admin/EditDesigner"));
const EditSeller = lazy(() => import("./Pages/Admin/EditSeller"));
const ViewSellerProfile = lazy(() => import("./Pages/Admin/ViewSellerProfile"));
const ViewUserProfile = lazy(() => import("./Pages/Admin/ViewUserProfile"));

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
const AddNewPortfolio = lazy(() => import("./Pages/User/AddNewPortfolio"));
const EditPortfolio = lazy(() => import("./Pages/User/EditPortfolio"));
const ViewPortfolio = lazy(() => import("./Pages/Portfolio/ViewPortfolio"));

// Product
const UserProducts = lazy(() => import("./Pages/User/Products"));
const AddNewProduct = lazy(() => import("./Pages/User/AddNewProduct"));
const EditProduct = lazy(() => import("./Pages/User/EditProduct"));
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
      {/* <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/stripe" element={<Stripe />} />
        </Routes>
      </Elements> */}
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/login" exact element={<LogIn />} />
          <Route path="/forgot-password" exact element={<ForgotPassword />} />
          <Route path="/sign-up" exact element={<SignUp />} />
          <Route
            path="/email-confirmation"
            exact
            element={<EmailConfirmation />}
          />
          <Route
            path="/email-confirmed/:userCode"
            exact
            element={<EmailConfirmed />}
          />
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
          <Route path="/admin/edit/user/:userId" exact element={<EditUser />} />
          <Route
            path="/admin/edit/designer/:designerId"
            exact
            element={<EditDesigner />}
          />

          <Route
            path="/admin/edit/seller/:sellerId"
            exact
            element={<EditSeller />}
          />

          <Route
            path="/user/center/guide"
            exact
            element={<UserMeasurementGuide />}
          />
          {/* Portfolio */}
          <Route
            path="/user/center/design/add"
            exact
            element={<AddNewPortfolio />}
          />
          <Route
            path="/portfolio/:portfolioId"
            exact
            element={<ViewPortfolio />}
          />
          <Route
            path="/user/center/design/:portfolioId/edit"
            exact
            element={<EditPortfolio />}
          />
          <Route
            path="/user/center/portfolio"
            exact
            element={<UserPortfolio />}
          />
          {/* Product */}
          <Route
            path="/user/center/product/add"
            exact
            element={<AddNewProduct />}
          />
          <Route path="/product/:productId" exact element={<ViewProduct />} />
          <Route
            path="/user/center/product/:productId/edit"
            exact
            element={<EditProduct />}
          />
          <Route
            path="/user/center/products"
            exact
            element={<UserProducts />}
          />

          {/* Admin */}
          <Route path="/admin/users" exact element={<Users />} />
          <Route path="/admin/designers" exact element={<AdminDesigners />} />
          <Route path="/admin/sellers" exact element={<AdminSellers />} />
          <Route path="/admin/fabrics" exact element={<AdminFabrics />} />
          <Route path="/admin/designs" exact element={<AdminDesigns />} />
          <Route
            path="/admin/profile/user/:userId"
            exact
            element={<ViewUserProfile />}
          />

          <Route
            path="/admin/profile/seller/:sellerId"
            exact
            element={<ViewSellerProfile />}
          />

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
            path="/view-design/:portfolioId"
            exact
            element={<ViewDesign />}
          />
          <Route
            path="/user/center/calendar"
            exact
            element={<UserCalendar />}
          />
          <Route path="/designer-profile" exact element={<DesignerProfile />} />
          <Route path="/appointments/:c" exact element={<Appointments />} />
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
            path="/consultation-meeting/:appointmentId"
            exact
            element={<VideoConferencing />}
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
