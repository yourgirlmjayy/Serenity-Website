import "./JournalPage.css";

import react, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-regular-svg-icons";
import ToolTip from "../ToolTip/ToolTip";
import { useSidebar } from "../sidebarcontext/SidebarContext";
import Header from "../Header/Header";
import LoadingScreen from "../Loading-Spinner/LoadingSpinner";
import { useNavigate, useParams } from "react-router-dom";

const JournalEntry = () => {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [content, setContent] = useState("");
  const [journalId, setJournalId] = useState();

  // stores the journal ID from the request body

  // tracks if user marks journal as favorite
  const [isFavorite, setIsFavorite] = useState(false);

  // Tracks whether the user has submitted the journal entry (true) or not (false).
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Controls the edit mode state for the journal entry, toggling between read-only and editable states.
  //When set to true, enables typing in the text area for editing journal content.
  const [isEditing, setIsEditing] = useState(false);

  // state hooks for upvote/downvote status
  const [upvotes, setUpVotes] = useState(0);
  const [downvotes, setDownVotes] = useState(0);
  const [userUpVoted, setUserUpVoted] = useState(false);
  const [userDownVoted, setUserDownVoted] = useState(false);

  const { isSidebarOpen, toggleSidebar } = useSidebar();

  // state hook for loading ui
  const [loading, setLoading] = useState(false);

  const FavoriteIcon = <FontAwesomeIcon icon={faStar} />;

  const backendUrl = import.meta.env.VITE_BACKEND_ADDRESS;
  const promptUrl = `${backendUrl}/generateJournalPrompt`;
  const createJournalUrl = `${backendUrl}/create-journal-entry`;
  const checkJournalExists = `${backendUrl}/journal/check/journal-entry`;
  const updateJournalUrl = `${backendUrl}/update-journal-entry`;
  const favoriteJournalUrl = `${backendUrl}/journal/favorite`;
  const votesUrl = `${backendUrl}/journal/vote`;
  const journalUrl = `${backendUrl}/journals/latest`;

  useEffect(() => {
    // fetch the prompt when the component mounts
    const checkOrCreateJournalEntry = async () => {
      setLoading(true);
      try {
        // if journal id is not null, fetch the journal data
        if (journalId) {
          const response = await fetch(journalUrl, {
            credentials: "include",
          });
          const data = await response.json();
          setPrompt(data.refinedPrompt);
          setContent(data.content || "");
          setIsFavorite(data.favorite);
          setUpVotes(data.upvote);
          setDownVotes(data.downvote);
          setJournalId(data.id);
          setIsSubmitted(true);
        }

        // if journal id is null, check if the journal exists for the day
        else {
          const response = await fetch(checkJournalExists, {
            method: "GET",
            credentials: "include",
          });
          const checkData = await response.json();

          // if the journal has been created, get the data needed
          if (checkData.exists) {
            const { journal } = checkData;
            setPrompt(journal.refinedPrompt);
            setContent(journal.content || "");
            setJournalId(journal.id);
            setIsFavorite(journal.favorite);
            setUpVotes(journal.upvote);
            setDownVotes(journal.downvote);
            setIsSubmitted(true);

            // navigate to the journal entry page with the journal id
            navigate("/journal-entry");
          }

          // if journal has not already been created, make a post request to the api
          else {
            const createResponse = await fetch(promptUrl, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            });
            const createData = await createResponse.json();
            setPrompt(createData.refinedPrompt);
            setJournalId(createData.journalId);
            navigate("/journal-entry");
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching journal prompt:", error);

        // Stop loading on error
        setLoading(false);
      }
    };

    checkOrCreateJournalEntry();
  }, [navigate, setJournalId, journalId]);

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(createJournalUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ journalId: journalId, content: content }),
      });
      if (response.ok) {
        setIsSubmitted(true);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error submitting journal entry:", error);
    }
  };

  const handleEditContent = async () => {
    try {
      const response = await fetch(updateJournalUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ journalId, content }),
      });
      const data = await response.json();
      // Exits editing mode after successful update
      setIsEditing(false);
      // Confirms the content is submitted/updated
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error updating journal entry: ", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    await handleEditContent();
  };

  // Handle upvote functionality
  const handleUpVote = async () => {
    try {
      // Toggle the current upvote status
      const newUpVoted = !userUpVoted;

      // Determine the change to send to the server: +1 for a new upvote, -1 to retract an upvote
      const voteChange = newUpVoted ? 1 : -1;

      // Prepare to retract a downvote if the user had previously downvoted
      const downVoteChange = userDownVoted ? -1 : 0;

      // Send a PATCH request to update the vote counts on the server
      const response = await fetch(votesUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          journalId,
          upvote: voteChange,
          downvote: downVoteChange,
        }),
      });
      if (response.ok) {
        // Update the local upvote count based on the vote change
        setUpVotes(upvotes + voteChange);

        // Update the local downvote count if a downvote was retracted
        setDownVotes(downvotes + downVoteChange);

        // Update the local state to reflect the new upvote status
        setUserUpVoted(newUpVoted);

        // If a downvote was retracted, update the local downvote status
        setUserDownVoted(userDownVoted && !newUpVoted);
      }
    } catch (error) {
      console.error("Error upvoting journal entry:", error);
    }
  };

  const handleDownVote = async () => {
    try {
      // Toggle the current downvote status
      const newDownVoted = !userDownVoted;

      // Determine the change to send to the server: +1 for a new downvote, -1 to retract a downvote
      const voteChange = newDownVoted ? 1 : -1;

      // Prepare to retract an upvote if the user had previously upvoted
      const upVoteChange = userUpVoted ? -1 : 0;

      // Send a PATCH request to update the vote counts on the server
      const response = await fetch(votesUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          journalId,
          upvote: upVoteChange,
          downvote: voteChange,
        }),
      });
      if (response.ok) {
        // Update the local downvote count based on the vote change
        setDownVotes(downvotes + voteChange);

        // Update the local upvote count if an upvote was retracted
        setUpVotes(upvotes + upVoteChange);

        // Update the local state to reflect the new downvote status
        setUserDownVoted(newDownVoted);

        // If an upvote was retracted, update the local upvote status
        setUserUpVoted(userUpVoted && !newDownVoted);
      }
    } catch (error) {
      console.error("Error downvoting journal entry:", error);
    }
  };

  const handleFavorite = async () => {
    try {
      // Determine the new favorite status to toggle
      const newFavoriteStatus = !isFavorite;
      // Send PATCH request to update favorite status on server
      const response = await fetch(favoriteJournalUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ journalId, favorite: newFavoriteStatus }),
      });
      if (response.ok) {
        // Toggle local favorite status only after successful server response
        setIsFavorite(newFavoriteStatus);
      } else {
        // Handle non-successful responses by showing an error message
        console.error("Failed to update favorite status on server.");
      }
    } catch (error) {
      console.error("Error favoriting journal entry:", error);
    }
  };

  return (
    <>
      <Header />
      <div>
        {loading ? (
          <LoadingScreen />
        ) : (
          <div className={`journal-entry ${isSidebarOpen ? "shifted" : ""}`}>
            <div className="journal-header">
              <ToolTip text="Mark journal entry as favorite">
                <button
                  onClick={handleFavorite}
                  className={
                    isFavorite ? "favorited-icon" : "not-favorited-icon"
                  }
                >
                  {FavoriteIcon}
                </button>
              </ToolTip>
            </div>

            <h2 className="journal-prompt">{prompt}</h2>

            <div className="feedback-buttons">
              <ToolTip text="Do you like this prompt? Give it a thumbs up if you do!">
                <button className="up-vote-button" onClick={handleUpVote}>
                  <FontAwesomeIcon icon={faThumbsUp} />
                </button>
                <span className="vote-count">{upvotes}</span>
              </ToolTip>

              <ToolTip text="Do you like this prompt? Give it a thumbs down if you do not.">
                <button className="down-vote-button" onClick={handleDownVote}>
                  <FontAwesomeIcon icon={faThumbsDown} />
                </button>
                <span className="vote-count">{downvotes}</span>
              </ToolTip>
            </div>

            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Write your journal entry here..."
              className="journal-textarea"
              rows={30}
              cols={20}
              disabled={!isEditing && isSubmitted}
            />
            <div className="action-buttons">
              {!isSubmitted && !isEditing && (
                <ToolTip text="Click button to submit journal entry">
                  <button
                    onClick={handleSubmit}
                    className="submit-content-button"
                  >
                    Submit
                  </button>
                </ToolTip>
              )}
              {isSubmitted && !isEditing && (
                <ToolTip text="Edit journal entry">
                  <button onClick={handleEdit} className="edit-button">
                    Edit
                  </button>
                </ToolTip>
              )}
              {isEditing && (
                <ToolTip text="Save new changes made to journal entry">
                  <button
                    onClick={handleSaveEdit}
                    className="save-changes-button"
                  >
                    Save Changes
                  </button>
                </ToolTip>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default JournalEntry;
