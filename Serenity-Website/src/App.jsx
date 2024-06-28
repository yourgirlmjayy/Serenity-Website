import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Landing-Page/LandingPage.jsx';
import SignUp from './Sign-up/SignUp.jsx';
import MoodBoard from './MoodBoard/MoodBoard.jsx';
import LogIn from './LogIn/LogIn.jsx';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/logIn" element={<LogIn />}></Route>
        <Route path="/get-started" element={<SignUp />}></Route>
        <Route path="/mood-board"  element={<MoodBoard />}></Route>
      </Routes>

    </Router>
    </>
  )
}

export default App;
