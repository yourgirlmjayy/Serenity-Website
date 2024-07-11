import "./UserFeed.css";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmileWink } from "@fortawesome/free-solid-svg-icons";

function UserFeed() {
  const [userEntries, setUserEntries] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
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

  return (
    <div className="user-feed">
      <h2>
        Get Caught Up <FontAwesomeIcon icon={faSmileWink} />
      </h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="entries-list">
        {userEntries.map((entry) => (
          <div key={entry.id} className="entry-item">
            <h3>{new Date(entry.date).toLocaleDateString()}</h3>
            <p>Mood: {entry.moods.map((mood) => mood.mood).join(", ")}</p>
            <p>
              Activities:{" "}
              {entry.activities
                .map((activity) => activity.activityOption.option)
                .join(", ")}
            </p>
            <p>
              Journal:{" "}
              {entry.journals.map((journal) => journal.content).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserFeed;
