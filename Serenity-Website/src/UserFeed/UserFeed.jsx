import "./UserFeed.css";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngry,
  faFaceMeh,
  faFaceSadTear,
  faSmile,
  faSmileBeam,
  faSmileWink,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../Header/Header";
import { useSidebar } from "../sidebarcontext/SidebarContext";
import {
  faBed,
  faBedPulse,
  faUserGroup,
  faHeart,
  faPeopleRoof,
  faChampagneGlasses,
  faUser,
  faTv,
} from "@fortawesome/free-solid-svg-icons";
import {
  faBook,
  faGamepad,
  faCouch,
  faIceCream,
  faBurger,
  faUtensils,
  faBowlRice,
  faCarrot,
} from "@fortawesome/free-solid-svg-icons";
import {
  faSun,
  faCloudRain,
  faWind,
  faBicycle,
  faPersonSwimming,
  faPersonWalking,
  faPersonRunning,
  faBaseball,
} from "@fortawesome/free-solid-svg-icons";

const moodIcons = {
  // mood object
  angry: faAngry,
  sad: faFaceSadTear,
  neutral: faFaceMeh,
  happy: faSmile,
  excited: faSmileBeam,
};

function UserFeed() {
  const [userEntries, setUserEntries] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  const backendURl = import.meta.env.VITE_BACKEND_ADDRESS;
  const userFeedUrl = `${backendURl}/user-feed`;

  useEffect(() => {
    const fetchUserFeed = async () => {
      try {
        const response = await fetch(userFeedUrl, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUserEntries(data);
        } else {
          setErrorMessage("Failed to fetch user feed");
        }
      } catch (error) {
        console.error("Error fetching user entries:", error);
        setErrorMessage("Failed to fetch user feed");
      }
    };
    fetchUserFeed();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const iconMap = {
    "Good sleep": faBed,
    "Moderate sleep": faBed,
    "Bad sleep": faBedPulse,
    "No sleep": faBedPulse,
    Friends: faUserGroup,
    Family: faPeopleRoof,
    Date: faHeart,
    Party: faChampagneGlasses,
    Alone: faUser,
    TV: faTv,
    Reading: faBook,
    Gaming: faGamepad,
    Relax: faCouch,
    Sweets: faIceCream,
    "Fast Food": faBurger,
    Restaurant: faUtensils,
    "Home-made": faBowlRice,
    Vegan: faCarrot,
    Sunny: faSun,
    Rainy: faCloudRain,
    Windy: faWind,
    Cycling: faBicycle,
    Swimming: faPersonSwimming,
    Walking: faPersonWalking,
    Running: faPersonRunning,
    Sports: faBaseball,
  };

  return (
    <>
      <Header />
      <div className={`user-feed ${isSidebarOpen ? "shifted" : ""}`}>
        <h2>
          Get Caught Up <FontAwesomeIcon icon={faSmileWink} />
        </h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="entries-list">
          {userEntries.map((entry) => (
            <div key={entry.id} className="entry-item">
              <div className="entry-header">
                <h3 className="date">{formatDate(entry.date)}</h3>
                <FontAwesomeIcon
                  className="mood-icon"
                  icon={moodIcons[entry.moods[0]?.mood || "good"]}
                />
              </div>
              <div className="entry-content">
                <div className="mood">
                  <p className="mood">
                    MOOD: {entry.moods.map((mood) => mood.mood).join("   ,  ")}
                  </p>
                </div>
                <div className="activities">
                  <ul>
                    {entry.activities.map((activity) => (
                      <li key={activity.id}>
                        <FontAwesomeIcon
                          className="activity-icon"
                          icon={
                            iconMap[activity.activityOption.option] || faSmile
                          }
                        />
                        {activity.activityOption.option}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="journals">
                  {entry.journals.map((journal) => (
                    <span key={journal.id}>{journal.content}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default UserFeed;
