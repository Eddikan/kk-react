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
const Cart = lazy(() => import("./Pages/Cart"));
const ViewDesign = lazy(() => import("./Pages/ViewDesign"));
const EcoFriendlyFabrics = lazy(() => import("./Pages/EcoFriendlyFabrics"));
const DesignerProfile = lazy(() => import("./Pages/DesignerProfile"));
const ScheduleConsultation = lazy(() => import("./Pages/ScheduleConsultation"));
const UserOrders = lazy(() => import("./Pages/Seller/Orders"));

const Orders = lazy(() => import("./Pages/Orders"));
const Messages = lazy(() => import("./Pages/Messages"));
const RateReview = lazy(() => import("./Pages/RateReview"));
const OrderTrackingDetails = lazy(() => import("./Pages/OrderTrackingDetails"));
const OrderDetails = lazy(() => import("./Pages/OrderDetails"));
const VideoConferencing = lazy(() => import("./Pages/VideoConferencing"));
const LiveStream = lazy(() => import("./Pages/LiveStream"));
const UserAppointments = lazy(() => import("./Pages/Seller/Appointments"));
const UserOrderDetails = lazy(() => import("./Pages/Seller/OrderDetails"));

// Survey
const CustomerSatisfaction = lazy(() =>
  import("./Pages/Survey/CustomerSatisfaction")
);

const PostPurchaseSurvey = lazy(() =>
  import("./Pages/Survey/PostPurchaseSurvey")
);

const WebsiteFeedBackSurvey = lazy(() =>
  import("./Pages/Survey/GeneralFeedBackSurvey")
);

const VendorFeedBackSurvey = lazy(() =>
  import("./Pages/Survey/VendorFeedBackSurvey")
);

// Admin
const AdminFabrics = lazy(() => import("./Pages/Admin/AdminFabrics"));
const AdminDesigns = lazy(() => import("./Pages/Admin/AdminDesigns"));
const AdminDesigners = lazy(() => import("./Pages/Admin/AdminDesigners"));
const AdminSellers = lazy(() => import("./Pages/Admin/AdminSeller"));
const AdminAppointments = lazy(() => import("./Pages/Admin/AdminAppointments"));
const AdminEditUser = lazy(() => import("./Pages/Admin/AdminEditUser"));
const AdminEditDesigner = lazy(() => import("./Pages/Admin/AdminEditDesigner"));
const AdminEditSeller = lazy(() => import("./Pages/Admin/AdminEditSeller"));
const AdminViewSellerProfile = lazy(() =>
  import("./Pages/Admin/AdminViewSellerProfile")
);
const AdminViewUserProfile = lazy(() =>
  import("./Pages/Admin/AdminViewUserProfile")
);
const AdminEditDesign = lazy(() => import("./Pages/Admin/AdminEditDesign"));
const AdminEditProduct = lazy(() => import("./Pages/Admin/AdminEditProduct"));
const AdminUsers = lazy(() => import("./Pages/Admin/AdminUsers"));
const AdminPostPurchase = lazy(() => import("./Pages/Admin/AdminPostPurchase"));
const AdminViewPostPurchase = lazy(() =>
  import("./Pages/Admin/AdminViewPostPurchase")
);

const AdminGeneralSurvey = lazy(() =>
  import("./Pages/Admin/AdminGeneralSurvey")
);

const AdminViewGeneralSurvey = lazy(() =>
  import("./Pages/Admin/AdminViewGeneralSurvey")
);

const AdminViewVendorSurvey = lazy(() =>
  import("./Pages/Admin/AdminViewVendorSurvey")
);

const AdminVendorSurvey = lazy(() => import("./Pages/Admin/AdminVendorSurvey"));
const AdminCustomerSatisfaction = lazy(() =>
  import("./Pages/Admin/AdminCustomerSatisfaction")
);

const AdminViewCustomerSurvey = lazy(() =>
  import("./Pages/Admin/AdminViewCustomerSurvey")
);

// User
const UserProfile = lazy(() => import("./Pages/User/Profile"));
const EditUserProfile = lazy(() => import("./Pages/User/EditProfile"));
const LiveStreams = lazy(() => import("./Pages/LiveStreams"));
const UserCalendar = lazy(() => import("./Pages/User/Calendar"));
const Appointments = lazy(() => import("./Pages/User/Appointments"));
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

//Body Gram
const BodyGram = lazy(() => import("./Pages/BodyGram"));

//Measurement
const Measurement = lazy(() => import("./Pages/Measurement"));

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
          <Route
            path="/admin/edit/user/:userId"
            exact
            element={<AdminEditUser />}
          />
          <Route
            path="/admin/edit/designer/:designerId"
            exact
            element={<AdminEditDesigner />}
          />
          <Route
            path="/admin/edit/seller/:sellerId"
            exact
            element={<AdminEditSeller />}
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
            path="/admin/portfolio/:portfolioId/edit"
            exact
            element={<AdminEditDesign />}
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
            path="/admin/product/:productId/edit"
            exact
            element={<AdminEditProduct />}
          />
          <Route
            path="/user/center/products"
            exact
            element={<UserProducts />}
          />
          {/* Admin */}
          <Route path="/admin/users" exact element={<AdminUsers />} />
          <Route path="/admin/designers" exact element={<AdminDesigners />} />
          <Route path="/admin/sellers" exact element={<AdminSellers />} />
          <Route path="/admin/fabrics" exact element={<AdminFabrics />} />
          <Route path="/admin/designs" exact element={<AdminDesigns />} />
          <Route
            path="/admin/appointments"
            exact
            element={<AdminAppointments />}
          />
          <Route
            path="/admin/profile/user/:userId"
            exact
            element={<AdminViewUserProfile />}
          />
          <Route
            path="/admin/profile/seller/:sellerId"
            exact
            element={<AdminViewSellerProfile />}
          />
          <Route
            path="/admin/post-purchase-survey"
            exact
            element={<AdminPostPurchase />}
          />
          <Route
            path="/admin/general-feedback-survey"
            exact
            element={<AdminGeneralSurvey />}
          />

          <Route
            path="/admin/vendor-feedback-survey"
            exact
            element={<AdminVendorSurvey />}
          />

          <Route
            path="/admin/customer-satisfaction-survey"
            exact
            element={<AdminCustomerSatisfaction />}
          />

          <Route
            path="/admin/view/customer-satisfaction-survey/:surveyId"
            exact
            element={<AdminViewCustomerSurvey />}
          />

          <Route
            path="/admin/view/post-purchase-survey/:surveyId"
            exact
            element={<AdminViewPostPurchase />}
          />

          <Route
            path="/admin/view/vendor-feedback-survey/:surveyId"
            exact
            element={<AdminViewVendorSurvey />}
          />

          <Route
            path="/admin/view/general-feedback-survey/:surveyId"
            exact
            element={<AdminViewGeneralSurvey />}
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
          {/* Survey */}
          <Route
            path="/customer-satisfaction-survey"
            exact
            element={<CustomerSatisfaction />}
          />
          <Route
            path="/post-purchase-survey"
            exact
            element={<PostPurchaseSurvey />}
          />
          <Route
            path="/vendor-feedback-survey"
            exact
            element={<VendorFeedBackSurvey />}
          />
          <Route
            path="/general-feedback-survey"
            exact
            element={<WebsiteFeedBackSurvey />}
          />
          <Route path="/appointments/:c" exact element={<Appointments />} />
          <Route path="/user/center/orders" exact element={<UserOrders />} />
          <Route path="/user/center/order/:orderId/details" exact element={<UserOrderDetails />} />
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
            path="/order/:orderItemId/track"
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
            path="/designer/live/stream/:livestreamId"
            exact
            element={<LiveStream />}
          />
          <Route
            path="/user/center/live/stream"
            exact
            element={<LiveStreams />}
          />
          {/* <Route
            path="/appointment/schedule/:designerId"
            exact
            element={<ScheduleConsultation />}
          /> */}
          <Route
            path="/designer/:designerId/appointment/schedule/:appointmentscheduleId"
            exact
            element={<ScheduleConsultation />}
          />
          <Route path="/body-gram" exact element={<BodyGram />} />
          <Route path="/measurement" exact element={<Measurement />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
