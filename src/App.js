import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { IoShirtSharp } from "react-icons/io5";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'Assets/styles/overrides.css';

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe("pk_test_NuJ5XLTawKbspF46LKSgwDbk");

const Home = lazy(() => import('./Pages/Home'));
const LogIn = lazy(() => import('./Pages/LogIn'));
const SignUp = lazy(() => import('./Pages/SignUp'));
const EmailConfirmation = lazy(() => import('./Pages/EmailConfirmation'));
const EmailConfirmed = lazy(() => import('./Pages/EmailConfirmed'));
const Questionnaire = lazy(() => import('./Pages/Questionnaire'));
const About = lazy(() => import('./Pages/About'));
const Buttons = lazy(() => import('./Pages/Elements/Buttons'));
const Forms = lazy(() => import('./Pages/Forms'));
const Stripe = lazy(() => import('./Pages/Stripe'));
const CustomerPage = lazy(() => import('./Pages/CustomerPage'));

// User
const UserProfile = lazy(() => import('./Pages/User/Profile'));
const EditUserProfile = lazy(() => import('./Pages/User/EditProfile'));

// Portfolio
const AddNewPortfolio = lazy(() => import('./Pages/Portfolio/AddNewPortfolio'));
const ViewPortfolio = lazy(() => import('./Pages/Portfolio/ViewPortfolio'));

const LoadingPage = () => {
  return (
    <>
      <div className="full-screen-container">
        <div className="center-content">
          <IoShirtSharp color="#000000" className="centered-icon" />
        </div>
      </div>
    </>
  )
}

const App = () => {
  return (
    <Router>
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/stripe" element={<Stripe/>}/>
        </Routes>
      </Elements>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" exact element={<Home/>} />
          <Route path="/login" exact element={<LogIn/>} />
          <Route path="/sign-up" exact element={<SignUp/>} />
          <Route path="/email-confirmation" exact element={<EmailConfirmation/>} />
          <Route path="/email-confirmed" exact element={<EmailConfirmed/>} />
          <Route path="/questionnaire" exact element={<Questionnaire/>} />
          <Route path="/about" exact element={<About/>} />
          <Route path="/elements/buttons" exact element={<Buttons/>} />
          <Route path="/forms" exact element={<Forms/>} />
          <Route path="/customer" exact element={<CustomerPage/>} />
          <Route path="/user/profile" exact element={<UserProfile/>} />
          <Route path="/user/profile/edit" exact element={<EditUserProfile/>} />
          <Route path="/portfolio/add" exact element={<AddNewPortfolio/>} />
          <Route path="/portfolio/:portfolioId" exact element={<ViewPortfolio/>} />
          
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;