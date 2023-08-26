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
const Howell = lazy(() => import('./Pages/Howell'));
const Jackie = lazy(() => import('./Pages/Jackie'));
const Jiboy = lazy(() => import('./Pages/Jiboy'));
const Juriel = lazy(() => import('./Pages/Juriel'));
const Lhemar = lazy(() => import('./Pages/Lhemar'));
const Bien = lazy(() => import('./Pages/Bien'));
const Aj = lazy(() => import('./Pages/Aj'));

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
          <Route path="/howell" exact element={<Howell/>} />
          <Route path="/jackie" exact element={<Jackie/>} />
          <Route path="/jiboy" exact element={<Jiboy/>} />
          <Route path="/elements/buttons" exact element={<Buttons/>} />
          <Route path="/forms" exact element={<Forms/>} />
          <Route path="/bien" exact element={<Bien/>} />
          <Route path="/juriel" exact element={<Juriel/>} />
          <Route path="/john_lhemar" exact element={<Lhemar/>} />
          <Route path="/Aj" exact element={<Aj/>} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;