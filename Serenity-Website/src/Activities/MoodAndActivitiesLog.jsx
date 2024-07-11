import { useState } from "react";
import React from "react";
import MoodLog from "../MoodLog/MoodLog";
import "./MoodAndActivities.css";
import ActivityLog from "./ActivityLog";
import Header from "../Header/Header";

function LogMoodAndActivities() {
  const [mood, setMood] = useState(null);
  const [activities, setActivities] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      setErrorMessage("Please select at least one activities");
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
        setSuccessMessage("Activities and mood logged successfully!");
        setErrorMessage("");
        setActivities({});
        setMood("");
      } else if (response.status === 400) {
        setErrorMessage("Mood already logged for today");
      } else if (response.status === 401) {
        setErrorMessage("Unauthorized! Please log in.");
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
      <div className="mood-and-activities-page">
        <MoodLog setMood={setMood} />
        <ActivityLog setActivities={setActivities} />
        <button className="entry-button" onClick={handleSubmit}>
          Log Mood and Activities
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </>
  );
}

export default LogMoodAndActivities;
