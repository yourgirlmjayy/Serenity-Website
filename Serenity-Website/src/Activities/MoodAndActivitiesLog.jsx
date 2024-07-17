import { useState } from "react";
import React from "react";
import MoodLog from "../MoodLog/MoodLog";
import "./MoodAndActivities.css";
import ActivityLog from "./ActivityLog";
import Header from "../Header/Header";
import { useSidebar } from "../sidebarcontext/SidebarContext";
import ToolTip from "../ToolTip/ToolTip";
import { useNavigate } from "react-router-dom";

function LogMoodAndActivities() {
  const [mood, setMood] = useState(null);
  const [activities, setActivities] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const backendURl = import.meta.env.VITE_BACKEND_ADDRESS;
  const url = `${backendURl}/log-mood-activity`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mood) {
      setErrorMessage("Please select a mood");
      return;
    }

    const activitiesArray = Object.entries(activities).flatMap(
      ([category, options]) => options.map((option) => ({ category, option }))
    );

    if (activitiesArray.length === 0) {
      setErrorMessage("Please select at least one activity");
      return;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ mood: mood, activities: activitiesArray }),
      });

      if (response.status === 201) {
        setErrorMessage("");
        setActivities({});
        setMood("");
        navigate("/log-mood-activity-success", { replace: true });
      } else if (response.status === 400) {
        setErrorMessage("Mood already logged for today");
      } else if (response.status === 401) {
        setErrorMessage("Unauthorized! Please log in.");
        setTimeout(() => navigate("/logIn", { replace: true }), 2000);
      } else {
        setErrorMessage("Error logging mood and activities");
      }
    } catch (error) {
      console.error("Error logging ativities and mood:", error);
      setErrorMessage("Error logging activities and mood!");
    }
  };

  return (
    <>
      <Header />
      <div
        className={`mood-and-activities-page ${isSidebarOpen ? "shifted" : ""}`}
      >
        <MoodLog setMood={setMood} />
        <ActivityLog setActivities={setActivities} />
        <div className="entry-button-container">
          <ToolTip text="Click this button to log all activities and mood for the day">
            <button className="entry-button" onClick={handleSubmit}>
              Log Mood and Activities
            </button>
          </ToolTip>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </>
  );
}

export default LogMoodAndActivities;
