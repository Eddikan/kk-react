import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IoShirtSharp } from "react-icons/io5";
import "bootstrap/dist/css/bootstrap.min.css";
import "Assets/styles/overrides.css";

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import Home from "./Pages/Home"
import About from "./Pages/About"

 import AdminCustomerSatisfaction from "./Pages/Admin/AdminCustomerSatisfaction"

// dont delete these comments 
// import PortfolioGrid from "Components/Shared/PortfolioGrid";
// import EcoFriendly from "Components/Shared/EcoFriendly";
const stripePromise = loadStripe("pk_test_51KH5FQEHRDNky8yNuVaslaQXG2zhzUjBuooEw7vp8LKMwMd5eEd5xt5RAL0UdiuVJf7dMAwllXdSiDkvvSp9qzT700fhQD4wrQ");

const LogIn = lazy(() => import("./Pages/LogIn"));
const TwoFactorAuthentication = lazy(() => import("./Pages/TwoFactorAuthentication"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const SignUp = lazy(() => import("./Pages/SignUp"));
const SignUpPreferences = lazy(() => import("./Pages/SignUpPreference"))
const EmailConfirmation = lazy(() => import("./Pages/EmailConfirmation"));
const EmailConfirmed = lazy(() => import("./Pages/EmailConfirmed"));
const Questionnaire = lazy(() => import("./Pages/Questionnaire"));
const Buttons = lazy(() => import("./Pages/Elements/Buttons"));
const Forms = lazy(() => import("./Pages/Forms"));
const Stripe = lazy(() => import("./Pages/Stripe"));
const StripeMobile = lazy(() => import("./Pages/StripeMobile"));
const CustomerPage = lazy(() => import("./Pages/CustomerPage"));
const Cart = lazy(() => import("./Pages/Cart"));
const Checkout = lazy(() => import("./Pages/Checkout"));
const PaypalMobile = lazy(() => import("./Pages/PaypalMobile"));
const ThankYouPage = lazy(() => import("./Pages/ThankYouPage"));
const ViewDesign = lazy(() => import("./Pages/ViewDesign"));
const EcoFriendlyFabrics = lazy(() => import("./Pages/EcoFriendlyFabrics"));
const DesignerProfile = lazy(() => import("./Pages/DesignerProfile"));
const ScheduleConsultation = lazy(() => import("./Pages/ScheduleConsultation"));
const UserOrders = lazy(() => import("./Pages/Seller/Orders"));
const UserOrderDetails = lazy(() => import("./Pages/Seller/OrderDetails"));

// const AdminProfileUser = lazy(() => import("./Pages/Admin/AdminProfileUser"));

const Orders = lazy(() => import("./Pages/Orders"));
const Messages = lazy(() => import("./Pages/Messages"));
const RateReview = lazy(() => import("./Pages/RateReview"));
const OrderTrackingDetails = lazy(() => import("./Pages/OrderTrackingDetails"));
const OrderDetails = lazy(() => import("./Pages/OrderDetails"));
const VideoConferencing = lazy(() => import("./Pages/VideoConferencing"));
const LiveStream = lazy(() => import("./Pages/LiveStream"));
const UserAppointments = lazy(() => import("./Pages/Seller/Appointments"));
const ViewSurvey = lazy(() => import("./Pages/Seller/ViewSurvey"));
const WhyWorkWithKK = lazy(() => import("./Pages/WhyWorkWithKK"));
const MeasurementGuideFormat = lazy(() => import("./Pages/MeasurementGuideFormat"));



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
const AdminOrders = lazy(() => import("./Pages/Admin/Orders"));
const AdminOrderDetails = lazy(() => import("./Pages/Admin/OrderDetails"));
const AdminViewSurvey = lazy(() => import("./Pages/Admin/AdminViewSurvey"));
const AdminFabrics = lazy(() => import("./Pages/Admin/AdminFabrics"));
const AdminDesigns = lazy(() => import("./Pages/Admin/AdminDesigns"));
const AdminDesigners = lazy(() => import("./Pages/Admin/AdminDesigners"));
const AdminSellers = lazy(() => import("./Pages/Admin/AdminSeller"));
const AdminAppointments = lazy(() => import("./Pages/Admin/AdminAppointments"));
const AdminEditUser = lazy(() => import("./Pages/Admin/AdminEditUser"));
const AdminEditDesigner = lazy(() => import("./Pages/Admin/AdminEditDesigner"));
const AdminEditSeller = lazy(() => import("./Pages/Admin/AdminEditSeller"));
const AdminEditDesign = lazy(() => import("./Pages/Admin/AdminEditDesign"));
const AdminEditProduct = lazy(() => import("./Pages/Admin/AdminEditProduct"));
const AdminUsers = lazy(() => import("./Pages/Admin/AdminUsers"));
const AdminPostPurchase = lazy(() => import("./Pages/Admin/AdminPostPurchase"));
const AdminViewFabric = lazy(() => import("./Pages/Admin/AdminViewFabric"));
const AdminViewPortFolio = lazy(() => import("./Pages/Admin/AdminViewPortFolio"));
const AdminVendorSurvey = lazy(() => import("./Pages/Admin/AdminVendorSurvey"));
// const AdminViewProfile = lazy(() => import("./Pages/Admin/AdminViewProfile"));

const AdminViewSellerProfile = lazy(() =>
  import("./Pages/Admin/AdminViewSellerProfile")
);

const AdminViewUserProfile = lazy(() =>
  import("./Pages/Admin/AdminViewUserProfile")
);


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

const SellerForm = lazy(() => import("./Pages/User/SellerForm"));
const DesignerForm = lazy(() => import("./Pages/User/DesignerForm"));

const ThankYou = lazy(() => import("./Pages/User/ThankYou"));
const ShopAvailability = lazy(() => import("./Pages/User/ShopAvailability"));


const ProfileCompleteness = lazy(() => import("./Pages/User/ProfileCompleteness"));

// Wishlist
const Wishlists = lazy(() => import("./Pages/Wishlists"));

// Favorites
const Favorites = lazy(() => import("./Pages/Favorites"));

// Designer Wishlist
const DesignerWishlist = lazy(() => import("./Pages/DesignerWishlist"));

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
          <Route path="/stripe" element={<Stripe />} />
          <Route path="/stripe/mobile" element={<StripeMobile />} />
        </Routes>
      </Elements>
      <Suspense fallback={<DelayedFallback delay={300}><LoadingPage /></DelayedFallback>} >
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/login" exact element={<LogIn />} />
          <Route path="/forgot-password" exact element={<ForgotPassword />} />
          <Route path="/sign-up" exact element={<SignUp />} />
          <Route path="/sign-up/preferences" exact element={<SignUpPreferences/>}/>
          <Route path="/two-factor-authentication" exact element={<TwoFactorAuthentication />} />
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
          <Route path="/user/complete-profile" exact element={<ProfileCompleteness />} />
          <Route path="/thankyou" exact element={<ThankYou />} />
          <Route path="/user/shop/setup" exact element={<ShopAvailability />} />
          
          <Route path="/user/seller-form" exact element={<SellerForm />} />
          <Route path="/user/designer-form" exact element={<DesignerForm />} />

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
            path="/admin/portfolio/:portfolioId"
            exact
            element={<AdminViewPortFolio />}
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
          <Route path="/product/:productId" exact element={<ViewProduct />} />
          <Route path="/admin/fabric/:productId" exact element={<AdminViewFabric />} />
          <Route
            path="/user/center/product/add"
            exact
            element={<AddNewProduct />}
          />
          
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


          <Route path="/wishlist" exact element={<Wishlists />} />
          <Route path="/favorites" exact element={<Favorites />} />
          <Route path="/designer/wishlist" exact element={<DesignerWishlist />} />

          {/* Under Construction */}
          <Route path="/inspirations" exact element={<UnderConstruction />} />
          <Route path="/blog" exact element={<UnderConstruction />} />
          <Route path="/orders" exact element={<Orders />} />
          <Route path="/category/tops" exact element={<UnderConstruction />} />
          <Route path="/category/pants" exact element={<UnderConstruction />} />
          <Route
            path="/category/dresses"
            exact
            element={<UnderConstruction />}
          />
    
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
          <Route path="/checkout" exact element={<Checkout />} />
          <Route path="/paypal/mobile" exact element={<PaypalMobile />} />
          {/* <Route path="/checkout" exact element={
            <Elements stripe={stripePromise}>
              <Checkout />
            </Elements>
          } /> */}
          
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
          <Route path="/admin/orders" exact element={<AdminOrders />} />
          <Route
            path="/admin/order/:orderId/details"
            exact
            element={<AdminOrderDetails />}
          />
          <Route path="/user/center/orders" exact element={<UserOrders />} />
          <Route
            path="/user/center/order/:orderId/details"
            exact
            element={<UserOrderDetails />}
          />



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
          <Route
            path="/designer/:designerId/appointment/schedule/:appointmentscheduleId"
            exact
            element={<ScheduleConsultation />}
          />
          <Route path="/body-gram" exact element={<BodyGram />} />
          <Route path="/measurement" exact element={<Measurement />} />
          <Route path="/thank-you" exact element={<ThankYouPage />} />
          {/* <Route path="/why-work-with-kk" exact element={<WhyWorkWithKK />} /> */}

          <Route path="/why-work-with-kk" exact element={<UnderConstruction />} />

          

          <Route path="/view/order/:orderId/survey/:surveyId" exact element={<ViewSurvey />} />
          <Route path="/admin/view/order/:orderId/survey/:surveyId" exact element={<AdminViewSurvey />} />
          <Route path="/measurement-guide-format" exact element={<MeasurementGuideFormat />} />
          
          
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
