import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'Assets/styles/overrides.css';

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe("pk_test_NuJ5XLTawKbspF46LKSgwDbk");

const Home = lazy(() => import('./Pages/Home'));
const Buttons = lazy(() => import('./Pages/Elements/Buttons'));
const Forms = lazy(() => import('./Pages/Forms'));
const Stripe = lazy(() => import('./Pages/Stripe'));
<<<<<<< HEAD
const Jackie = lazy(() => import('./Pages/Jackie'));
=======
const Jiboy = lazy(() => import('./Pages/Jiboy'));
>>>>>>> 276a572b4312cde896f559111d46628a55697b13

const App = () => {
  return (
    <Router>
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/stripe" element={<Stripe/>}/>
        </Routes>
      </Elements>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" exact element={<Home/>} />
<<<<<<< HEAD
          <Route path="/jackie" exact element={<Jackie/>} />
=======
          <Route path="/jiboy" exact element={<Jiboy/>} />
>>>>>>> 276a572b4312cde896f559111d46628a55697b13
          <Route path="/elements/buttons" exact element={<Buttons/>} />
          <Route path="/forms" exact element={<Forms/>} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;