import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Landing-Page/LandingPage.jsx";
import SignUp from "./Sign-up/SignUp.jsx";
import LogIn from "./LogIn/LogIn.jsx";
import LogMoodAndActivities from "./Activities/MoodAndActivitiesLog.jsx";
import NotFoundPage from "./NotFoundPage/NotFoundPage.jsx";
import { UserContext } from "../../UserContext.js";
import Preloader from "./Preloader/Preloader.jsx";
import Cookies from "js-cookie";
import UserFeed from "./UserFeed/UserFeed.jsx";
import ProfilePage from "./Profile/Profile.jsx";
import { SidebarProvider } from "./sidebarcontext/SidebarContext.jsx";
import ActivityLogSuccess from "./ActivityLogSuccess/ActivityLogSuccess.jsx";
import JournalEntry from "./Journal/JournalPage.jsx";
import JournalEntriesPage from "./AllJournalEntries/JournalEntries.jsx";
import RecommendationsPage from "./RecommendationsPage/RecommendationsPage.jsx";

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
    <UserContext.Provider value={{ user, updateUser }}>
      <SidebarProvider>
        <Router>
          <Preloader />
          <Routes>
            <Route path="/" element={<LandingPage />}></Route>
            <Route path="/logIn" element={<LogIn />}></Route>
            <Route path="/get-started" element={<SignUp />}></Route>
            <Route
              path="/mood-and-activities"
              element={<LogMoodAndActivities />}
            ></Route>
            <Route path="/user-feed" element={<UserFeed />}></Route>
            <Route path="/profile" element={<ProfilePage />}></Route>
            <Route
              path="/log-mood-activity-success"
              element={<ActivityLogSuccess />}
            ></Route>
            <Route
              path="/all-journal-entries"
              element={<JournalEntriesPage />}
            ></Route>
            <Route path="/journal-entry" element={<JournalEntry />}></Route>
            <Route
              path="/recommendations"
              element={<RecommendationsPage />}
            ></Route>
            <Route path="*" element={<NotFoundPage />}></Route>
          </Routes>
        </Router>
      </SidebarProvider>
    </UserContext.Provider>
  );
}

export default App;
