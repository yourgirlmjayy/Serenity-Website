import React from "react";
import "./ActivityLogSuccess.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
import ToolTip from "../ToolTip/ToolTip";

function ActivityLogSuccess() {
  const navigate = useNavigate();

  const handleHomeButton = () => {
    navigate("/user-feed");
  };
  const handleNewEntry = () => {
    navigate("/mood-and-activities");
  };

  return (
    <div className="success-page">
      <h1 className="success-header">Success!</h1>
      <p className="success-text">Activities and moods logged successfully!</p>
      <div className="buttons-container">
        <ToolTip text="Home page displays all your past entries">
          <button className="home-button" onClick={handleHomeButton}>
            <FontAwesomeIcon icon={faHouse} className="home-icon" /> Go to home
            page
          </button>
        </ToolTip>
      </div>
    </div>
  );
}

export default ActivityLogSuccess;
