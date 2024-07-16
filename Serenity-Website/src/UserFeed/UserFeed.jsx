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
import ToolTip from "../ToolTip/ToolTip";
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
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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

  //handle when the user does not have any entries
  const handleLogMoodActivity = () => {
    // close modal
    setIsModalOpen(false);
    // navigate user to mood and activities page
    navigate("/mood-and-activities");
  };

  const handlePlusClick = () => {
    // handle when the user clicks the plus sign
    setIsModalOpen(true);
  };

  return (
    <>
      <Header />
      <div className={`user-feed ${isSidebarOpen ? "shifted" : ""}`}>
        <h2>
          Get Caught Up{" "}
          <FontAwesomeIcon icon={faSmileWink} className="wink-icon" />
        </h2>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="entries-list">
          {userEntries.length === 0 ? (
            <div className="empty-feed">
              <ToolTip text="Click to log mood and activities">
                <button onClick={handlePlusClick} className="plus-button">
                  <FontAwesomeIcon icon={faCirclePlus} size="2x" />
                </button>
              </ToolTip>
              <p className="error-message">
                You don't have any activities and moods logged. <br /> <br />{" "}
                Click the plus button to log moods and activities.
              </p>
            </div>
          ) : (
            userEntries.map((entry) => (
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
                      MOOD:{" "}
                      {entry.moods.map((mood) => mood.mood).join("   ,  ")}
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
            ))
          )}
        </div>
        {isModalOpen && (
          <div className="custom-modal-overlay">
            <div className="custom-modal">
              <div className="modal-content">
                <h2>Log mood and activities</h2>
                <p>You haven't logged mood and activities yet.</p>
                <button
                  onClick={handleLogMoodActivity}
                  className="modal-button"
                >
                  Log now
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="modal-button-cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UserFeed;
