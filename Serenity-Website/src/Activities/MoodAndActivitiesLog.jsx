import { useState, useEffect } from "react";
import React from "react";
import MoodLog from "../MoodLog/MoodLog";
import "./MoodAndActivities.css";
import ActivityLog from "./ActivityLog";
import Header from "../Header/Header";
import { useSidebar } from "../sidebarcontext/SidebarContext";
import ToolTip from "../ToolTip/ToolTip";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";

function LogMoodAndActivities() {
  const [mood, setMood] = useState(null);
  const [activities, setActivities] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [categories, setCategories] = useState([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  const navigate = useNavigate();

  const backendURl = import.meta.env.VITE_BACKEND_ADDRESS;
  const url = `${backendURl}/log-mood-activity`;

  const categoriesurl = `${backendURl}/categories`;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(categoriesurl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setErrorMessage("Error fetching categories");
      }
    };
    fetchCategories();
  }, [url]);

  const handlePreviousCategory = () => {
    setCurrentCategoryIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextCategory = () => {
    setCurrentCategoryIndex((prevIndex) =>
      Math.min(prevIndex + 1, categories.length - 1)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const activitiesArray = Object.entries(activities).flatMap(
      ([category, options]) => options.map((option) => ({ category, option }))
    );

    if (!mood && activitiesArray.length === 0) {
      setErrorMessage("Please select a mood and at least one activity");
    }

    if (!mood) {
      setErrorMessage("Please select a mood");
      return;
    }

    if (activitiesArray.length === 0) {
      setErrorMessage("Please select at least one activity");
      return;
    }
    setErrorMessage("");
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
        setErrorMessage("Mood and activities already logged for today");
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
        <ActivityLog
          setActivities={setActivities}
          currentCategoryIndex={currentCategoryIndex}
          categories={categories}
        />
        <div className="navigation-buttons">
          {currentCategoryIndex > 0 && (
            <ToolTip text="View previous activity category">
              <button
                onClick={handlePreviousCategory}
                className="previous-button"
              >
                Previous
              </button>
            </ToolTip>
          )}
          {currentCategoryIndex < categories.length - 1 && (
            <ToolTip text="View next activity category">
              <button onClick={handleNextCategory} className="next-button">
                Next
              </button>
            </ToolTip>
          )}
        </div>
        {currentCategoryIndex === categories.length - 1 && (
          <div className="entry-button-container">
            <ToolTip text="Logs all activities and mood for the day">
              <button className="entry-button" onClick={handleSubmit}>
                Log Mood and Activities
              </button>
            </ToolTip>
          </div>
        )}
      </div>
      {errorMessage && <p className="error-memo">{errorMessage}</p>}
      <Footer />
    </>
  );
}

export default LogMoodAndActivities;
