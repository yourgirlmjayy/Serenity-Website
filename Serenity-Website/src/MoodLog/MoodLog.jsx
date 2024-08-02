import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./MoodLog.css";
import angry from "../assets/angry.png";
import sad from "../assets/sad.png";
import neutral from "../assets/neutral.png";
import happy from "../assets/happy.png";
import excited from "../assets/excited.png";

const moods = {
  // mood object
  angry: <img src={angry} />,
  sad: <img src={sad} />,
  neutral: <img src={neutral} />,
  happy: <img src={happy} />,
  excited: <img src={excited} />,
};

function MoodLog({ setMood }) {
  // set default mood to null
  const [selectedMood, setSelectedMood] = useState(null);

  //set current date
  const [currentDate, setCurrentDate] = useState("");

  //track if mood has been submitted
  const [moodSubmitted, setMoodSubmitted] = useState(false);

  const handleMoodSelect = (mood) => {
    // handle mood changes
    setSelectedMood((prevMood) => (prevMood === mood ? null : mood));
    setMood(mood);
    setMoodSubmitted(true);
  };

  return (
    <>
      <div className="mood-page">
        <div className="mood-entry">
          <div className="prompt-container">
            <h2 id="prompt">
              Check in:{" "}
              <span className="mood-and-activities"> Mood and Activities </span>{" "}
            </h2>
          </div>
          <div className="mood-options">
            {Object.keys(moods).map((mood) => (
              <span
                key={mood}
                className={`mood-button ${
                  selectedMood === mood ? "selected" : ""
                }`}
                onClick={() => handleMoodSelect(mood)}
                disabled={moodSubmitted}
              >
                {moods[mood]} <br /> <span className="mood-text">{mood}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default MoodLog;
