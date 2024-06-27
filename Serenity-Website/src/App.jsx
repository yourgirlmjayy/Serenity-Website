import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './Header/Header'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Landing-Page/LandingPage.jsx'
import SignUp from './Sign-up/SignUp.jsx'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/signUp" element={<SignUp />}></Route>
      </Routes>

    </Router>
  )
}

export default App;
