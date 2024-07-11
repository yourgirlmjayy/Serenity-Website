import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./ActivityLog.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBed,
  faBedPulse,
  faUserGroup,
  faHeart,
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
import { fas } from "@fortawesome/free-solid-svg-icons";
import { colors } from "@mui/material";

function ActivityLog({ setActivities }) {
  const [categories, setCategories] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const backendURl = import.meta.env.VITE_BACKEND_ADDRESS;
  const url = `${backendURl}/categories`;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(url, {
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

  const handleOptionSelect = (category, option) => {
    setSelectedActivities((prevState) => {
      const categoryOptions = prevState[category] || [];
      const newOptions = categoryOptions.includes(option)
        ? categoryOptions.filter((opt) => opt !== option)
        : [...categoryOptions, option];
      return { ...prevState, [category]: newOptions };
    });
  };
  useEffect(() => {
    setActivities(selectedActivities);
  }, [selectedActivities, setActivities]);

  return (
    <>
      <div className="activities-page">
        <h2>What have you been up to?</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {categories.map((category) => (
          <div key={category.id}>
            <h4>{category.category}</h4>
            <div className="options-container">
              {category.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() =>
                    handleOptionSelect(category.category, option.option)
                  }
                  className={`option-button ${
                    selectedActivities[category.category] &&
                    selectedActivities[category.category].includes(
                      option.option
                    )
                      ? "selected"
                      : ""
                  }`}
                >
                  {option.icon && <FontAwesomeIcon icon={faCarrot} />}
                  <span>{option.option}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ActivityLog;
