import { lazy } from "react";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AdminCustomerSatisfaction from "./Pages/Admin/AdminCustomerSatisfaction";

const LogIn = lazy(() => import("./Pages/LogIn"));
const TwoFactorAuthentication = lazy(() =>
  import("./Pages/TwoFactorAuthentication")
);
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const SignUp = lazy(() => import("./Pages/SignUp"));
const SignUpPreferences = lazy(() => import("./Pages/SignUpPreference"));
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
// const WhyWorkWithKK = lazy(() => import("./Pages/WhyWorkWithKK"));
const MeasurementGuideFormat = lazy(() =>
  import("./Pages/MeasurementGuideFormat")
);

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
const AdminViewPortFolio = lazy(() =>
  import("./Pages/Admin/AdminViewPortFolio")
);
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

// const ThankYou = lazy(() => import("./Pages/User/ThankYou"));
const ShopAvailability = lazy(() => import("./Pages/User/ShopAvailability"));

const ProfileCompleteness = lazy(() =>
  import("./Pages/User/ProfileCompleteness")
);

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
export const stripeRoutes = [
  {
    path: "/stripe",
    element: <Stripe />,
  },
  {
    path: "/stripe/mobile",
    element: <StripeMobile />,
  },
];
export const unAuthenticatedRoutes = [
  {
    path: "/login",
    element: <LogIn />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/sign-up/preferences",
    element: <SignUpPreferences />,
  },
  {
    path: "/two-factor-authentication",
    element: <TwoFactorAuthentication />,
  },
  {
    path: "/email-confirmation",
    element: <EmailConfirmation />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/elements/buttons",
    element: <Buttons />,
  },
  {
    path: "/forms",
    element: <Forms />,
  },
  {
    path: "/customer",
    element: <CustomerPage />,
  },
  {
    path: "/thankyou",
    element: <ThankYouPage />,
  },
  {
    path: "/email-confirmed/:userCode",
    element: <EmailConfirmed />,
  },
  {
    path: "/questionnaire",
    element: <Questionnaire />,
  },
  // {/* Designs */}

  {
    path: "/find-designs",
    element: <Designs />,
  },
  {
    path: "/designs",
    element: <Designs />,
  },
  {
    path: "/design/:portfolioId",
    element: <ViewPortfolio />,
  },
  {
    path: "/wishlist",
    element: <Wishlists />,
  },
  {
    path: "/favorites",
    element: <Favorites />,
  },
  {
    path: "/designer/wishlist",
    element: <DesignerWishlist />,
  },

  // {/* Under Construction */}
  {
    path: "/inspirations",
    element: <UnderConstruction />,
  },
  {
    path: "/blog",
    element: <UnderConstruction />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
  {
    path: "/category/tops",
    element: <UnderConstruction />,
  },
  {
    path: "/category/pants",
    element: <UnderConstruction />,
  },
  {
    path: "/category/dresses",
    element: <UnderConstruction />,
  },
  {
    path: "/category/skirts",
    element: <UnderConstruction />,
  },

  {
    path: "/about-kouture-konect",
    element: <About />,
  },
  {
    path: "/how-it-works",
    element: <UnderConstruction />,
  },
  {
    path: "/designers",
    element: <Designers />,
  },
  {
    path: "/fabrics",
    element: <Fabrics />,
  },

  {
    path: "/eco-friendly",
    element: <EcoFriendlyFabrics />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/paypal/mobile",
    element: <PaypalMobile />,
  },
  {
    path: "/view-design/:portfolioId",
    element: <ViewDesign />,
  },
  {
    path: "/user/center/calendar",
    element: <UserCalendar />,
  },
  {
    path: "/designer-profile",
    element: <DesignerProfile />,
  },
  // {/* Survey */}

  {
    path: "/customer-satisfaction-survey",
    element: <CustomerSatisfaction />,
  },
  {
    path: "/post-purchase-survey",
    element: <PostPurchaseSurvey />,
  },
  {
    path: "/vendor-feedback-survey",
    element: <VendorFeedBackSurvey />,
  },
  {
    path: "/general-feedback-survey",
    element: <WebsiteFeedBackSurvey />,
  },
  {
    path: "/appointments/:c",
    element: <Appointments />,
  },
  {
    path: "/admin/orders",
    element: <AdminOrders />,
  },
  {
    path: "/admin/order/:orderId/details",
    element: <AdminOrderDetails />,
  },
  {
    path: "/user/center/orders",
    element: <UserOrders />,
  },
  {
    path: "/user/center/order/:orderId/details",
    element: <UserOrderDetails />,
  },
  {
    path: "/messages",
    element: <Messages />,
  },
  {
    path: "/rate-review/:productId",
    element: <RateReview />,
  },
  {
    path: "/order/:orderId/details",
    element: <OrderDetails />,
  },
  {
    path: "/order/:orderItemId/track",
    element: <OrderTrackingDetails />,
  },
  {
    path: "/user/center/appointments",
    element: <UserAppointments />,
  },
  {
    path: "/consultation-meeting/:appointmentId",
    element: <VideoConferencing />,
  },
  {
    path: "/designer/live/stream/:livestreamId",
    element: <LiveStream />,
  },
  {
    path: "/user/center/live/stream",
    element: <LiveStreams />,
  },
  {
    path: "/designer/:designerId/appointment/schedule/:appointmentscheduleId",
    element: <ScheduleConsultation />,
  },
  {
    path: "/body-gram",
    element: <BodyGram />,
  },
  {
    path: "/measurement",
    element: <Measurement />,
  },
  {
    path: "/thank-you",
    element: <ThankYouPage />,
  },
  {
    path: "/why-work-with-kk",
    element: <UnderConstruction />,
  },
  {
    path: "/view/order/:orderId/survey/:surveyId",
    element: <ViewSurvey />,
  },
  {
    path: "/admin/view/order/:orderId/survey/:surveyId",
    element: <AdminViewSurvey />,
  },
  {
    path: "/measurement-guide-format",
    element: <MeasurementGuideFormat />,
  },
  {
    path: "/product/:productId",
    element: <ViewProduct />,
  },

];
export const authenticatedRoutes = [
  {
    path: "/:user/profile",
    element: <UserProfile />,
  },
  {
    path: "/user/complete-profile",
    element: <ProfileCompleteness />,
  },
  {
    path: "/user/shop/setup",
    element: <ShopAvailability />,
  },
  {
    path: "/user/seller-form",
    element: <SellerForm />,
  },
  {
    path: "/user/designer-form",
    element: <DesignerForm />,
  },
  {
    path: "/:user/profile/edit",
    element: <EditUserProfile />,
  },
  {
    path: "/admin/edit/user/:userId",
    element: <AdminEditUser />,
  },
  {
    path: "/admin/edit/designer/:designerId",
    element: <AdminEditDesigner />,
  },
  {
    path: "/admin/edit/seller/:sellerId",
    element: <AdminEditSeller />,
  },
  {
    path: "/user/center/guide",
    element: <UserMeasurementGuide />,
  },
  {
    path: "/user/center/design/add",
    element: <AddNewPortfolio />,
  },
  {
    path: "/portfolio/:portfolioId",
    element: <ViewPortfolio />,
  },
  {
    path: "/admin/portfolio/:portfolioId",
    element: <AdminViewPortFolio />,
  },
  // Shop Manager
  {
    path: "/user/center/design/:portfolioId/edit",
    element: <EditPortfolio />,
  },

  {
    path: "/user/center/portfolio",
    element: <UserPortfolio />,
  },
 
  {
    path: "/user/center/product/add",
    element: <AddNewProduct />,
  },
  {
    path: "/user/center/product/:productId/edit",
    element: <EditProduct />,
  },

  {
    path: "/user/center/products",
    element: <UserProducts />,
  },
  // {/* Admin */}

  {
    path: "/admin/portfolio/:portfolioId/edit",
    element: <AdminEditDesign />,
  },
  {
    path: "/admin/fabric/:productId",
    element: <AdminViewFabric />,
  },
  {
    path: "/admin/product/:productId/edit",
    element: <AdminEditProduct />,
  },

  {
    path: "/admin/users",
    element: <AdminUsers />,
  },
  {
    path: "/admin/designers",
    element: <AdminDesigners />,
  },
  {
    path: "/admin/sellers",
    element: <AdminSellers />,
  },
  {
    path: "/admin/fabrics",
    element: <AdminFabrics />,
  },
  {
    path: "/admin/designs",
    element: <AdminDesigns />,
  },
  {
    path: "/admin/appointments",
    element: <AdminAppointments />,
  },
  {
    path: "/admin/profile/user/:userId",
    element: <AdminViewUserProfile />,
  },
  {
    path: "/admin/profile/seller/:sellerId",
    element: <AdminViewSellerProfile />,
  },
  {
    path: "/admin/post-purchase-survey",
    element: <AdminPostPurchase />,
  },
  {
    path: "/admin/general-feedback-survey",
    element: <AdminGeneralSurvey />,
  },
  {
    path: "/admin/vendor-feedback-survey",
    element: <AdminVendorSurvey />,
  },
  {
    path: "/admin/customer-satisfaction-survey",
    element: <AdminCustomerSatisfaction />,
  },
  {
    path: "/admin/view/customer-satisfaction-survey/:surveyId",
    element: <AdminViewCustomerSurvey />,
  },
  {
    path: "/admin/view/post-purchase-survey/:surveyId",
    element: <AdminViewPostPurchase />,
  },
  {
    path: "/admin/view/vendor-feedback-survey/:surveyId",
    element: <AdminViewVendorSurvey />,
  },
  {
    path: "/admin/view/general-feedback-survey/:surveyId",
    element: <AdminViewGeneralSurvey />,
  },
];

