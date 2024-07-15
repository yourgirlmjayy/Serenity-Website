import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faX } from "@fortawesome/free-solid-svg-icons";

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

  useEffect(() => {
    // Set the current date and render when the component mounts
    const now = new Date();
    const formattedDate = now.toLocaleString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  const handleMoodSelect = (mood) => {
    // handle mood changes
    setSelectedMood((prevMood) => (prevMood === mood ? null : mood));
    setMood(mood);
    setMoodSubmitted(true);
  };

  return (
    <>
      <div className="mood-entry">
        <h2 className="prompt">Check in: mood & activities</h2>
        <h4 className="current-date">
          <FontAwesomeIcon icon={faCalendar} /> {currentDate}
        </h4>
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
              {moods[mood]} <br /> <span>{mood}</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export default MoodLog;
