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

function ActivityLog({ setActivities, currentCategoryIndex, categories }) {
  const [selectedActivities, setSelectedActivities] = useState({});

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

  const currentCategory = categories[currentCategoryIndex];

  const handleOptionSelect = (category, option) => {
    setSelectedActivities((prevState) => {
      const categoryOptions = prevState[category] || [];
      const newOptions = categoryOptions.includes(option)
        ? categoryOptions.filter((opt) => opt !== option)
        : [...categoryOptions, option];

      const updatedActivities = { ...prevState, [category]: newOptions };
      setActivities(updatedActivities);
      return updatedActivities;
    });
  };

  return (
    <div className="activities-page">
      {currentCategory && (
        <div className="category-container">
          <div className="category-name-container">
            <h2 className="category-name">{currentCategory.category}</h2>
          </div>
          <div className="options-container">
            {currentCategory.options.map((option) => (
              <button
                key={option.id}
                onClick={() =>
                  handleOptionSelect(currentCategory.category, option.option)
                }
                className={`option-button ${
                  selectedActivities[currentCategory.category]?.includes(
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
                      selectedActivities[currentCategory.category]?.includes(
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
      )}
    </div>
  );
}

export default ActivityLog;
