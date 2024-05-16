import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginProvider } from './LoginProvider'; 
import LoginPage from './Components/LoginPage'; 
import HomePage from './Components/HomePage'; 
import AdminPage from './Components/AdminPage';
import MyReservation from './Components/MyReservation'; 



function App() {



  return (
    <Router>

      <LoginProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/myreservation" element={<MyReservation />} />
        </Routes>
      </LoginProvider>

    </Router>
  );
}

export default App;
