import { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import LandingPage from "./Landing-Page/LandingPage.jsx";
import SignUp from "./Sign-up/SignUp.jsx";
import LogIn from "./LogIn/LogIn.jsx";
import LogMoodAndActivities from "./Activities/MoodAndActivitiesLog.jsx";
import NotFoundPage from "./NotFoundPage/NotFoundPage.jsx";
import { UserContext } from "../../UserContext.js";
import Preloader from "./Preloader/Preloader.jsx";
import Cookies from "js-cookie";

function App() {
  const [user, setUser] = useState(() => {
    //Retrieve user data from cookie or set to null if not found
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const updateUser = (newUser) => {
    setUser(newUser);
    Cookies.set("user", JSON.stringify(newUser), { expires: 7 });
  };

  useEffect(() => {
    // save the user data whenever use state changes
    Cookies.set("user", JSON.stringify(user), { expires: 7 });
  }, [user]);

  return (
    <>
      <UserContext.Provider value={{ user, updateUser }}>
        <Router>
          <Preloader />
          <Routes>
            <Route path="/" element={<LandingPage />}></Route>
            <Route path="/logIn" element={<LogIn />}></Route>
            <Route path="/get-started" element={<SignUp />}></Route>
            <Route
              path="/mood-and-activities"
              element={<LogMoodAndActivities />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </>
  );
}

export default App;
