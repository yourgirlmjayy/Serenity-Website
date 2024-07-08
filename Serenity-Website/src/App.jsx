import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import LandingPage from './Landing-Page/LandingPage.jsx';
import SignUp from './Sign-up/SignUp.jsx';
import MoodBoard from './MoodBoard/MoodBoard.jsx';
import LogIn from './LogIn/LogIn.jsx';
import { UserContext } from '../../UserContext.js';
import Preloader from './Preloader/Preloader.jsx';

function App() {
  const [user, setUser] = useState(() =>{
    
    //Retrieve user data from storage or set to null if not found
    const storedUser = localStorage.getItem('user');
    // return storedUser ? JSON.parse(storedUser) : null;
  })

  const updateUser = (newUser) => {
    setUser(newUser);
  }

  useEffect (() => {
    // save the user data to storage whenever use state changes
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <> 
      <UserContext.Provider value={{ user, updateUser}}>
        <Router>
            <Preloader />
            <Routes>
              <Route path="/" element={<LandingPage />}></Route>
              <Route path="/logIn" element={<LogIn />}></Route>
              <Route path="/get-started" element={<SignUp />}></Route>
              <Route path="/mood-board" element={user ? <MoodBoard /> : <LogIn />}/>
            </Routes>

          </Router>
        </UserContext.Provider>
    </>
  )
}

export default App;
