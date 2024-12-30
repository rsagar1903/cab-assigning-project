import { useState } from 'react'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';
import RideRequests from './Riderequests';
import Navbar from './navbar';
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<Login />} />
      {/* Other routes can go here */}
      <Route path="/requests" element={<RideRequests/>} />
    </Routes>
  </Router>
  )
}

export default App
