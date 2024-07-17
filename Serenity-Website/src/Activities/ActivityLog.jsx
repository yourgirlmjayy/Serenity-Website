import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./ActivityLog.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

function ActivityLog({ setActivities }) {
  const [categories, setCategories] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const iconMap = {
    faBed: faBed,
    faBed: faBed,
    faBedPulse: faBedPulse,
    faBedPulse: faBedPulse,
    faUserGroup: faUserGroup,
    faPeopleRoof: faPeopleRoof,
    faHeart: faHeart,
    faChampagneGlasses: faChampagneGlasses,
    faUser: faUser,
    faTV: faTv,
    faBook: faBook,
    faGamepad: faGamepad,
    faCouch: faCouch,
    faIceCream: faIceCream,
    faBurger: faBurger,
    faUtensils: faUtensils,
    faBowlRice: faBowlRice,
    faCarrot: faCarrot,
    faSun: faSun,
    faCloudRain: faCloudRain,
    faWind: faWind,
    faBicycle: faBicycle,
    faPersonSwimming: faPersonSwimming,
    faPersonWalking: faPersonWalking,
    faPersonRunning: faPersonRunning,
    faBaseball: faBaseball,
  };

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
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {categories.map((category) => (
          <div className="category-container" key={category.id}>
            <h4 className="category-name">{category.category}</h4>
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
                  {option.icon && (
                    <FontAwesomeIcon
                      icon={iconMap[option.icon]}
                      className={`option-icon ${
                        selectedActivities[category.category] &&
                        selectedActivities[category.category].includes(
                          option.option
                        )
                          ? "selected-option-icon"
                          : ""
                      }`}
                    />
                  )}
                  <span className="option-name">{option.option}</span>
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
