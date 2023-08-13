import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Assets/styles/overrides.css';

const Home = lazy(() => import('./Pages/Home'));
const Buttons = lazy(() => import('./Pages/Elements/Buttons'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" exact element={<Home/>} /> 
          <Route path="/elements/buttons" exact element={<Buttons/>} /> 
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;