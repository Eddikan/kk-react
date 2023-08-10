import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Assets/styles/bootstrap.min.css';

const Home = lazy(() => import('./Pages/Home'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" exact element={<Home/>} /> 
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;