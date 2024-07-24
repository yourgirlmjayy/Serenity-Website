import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./JournalEntries.css";
import ToolTip from "../ToolTip/ToolTip";
import { useSidebar } from "../sidebarcontext/SidebarContext";
import LoadingScreen from "../Loading-Spinner/LoadingSpinner";
import Header from "../Header/Header";

const JournalEntriesPage = () => {
  const [entries, setEntries] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const [filterOption, setFilterOption] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_ADDRESS;
  const journalEntriesUrl = `${backendUrl}/journals?sort=${sortOption}&filter=${filterOption}`;
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      try {
        const response = await fetch(journalEntriesUrl, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setEntries(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
        setLoading(false);
      }
    };

    fetchEntries();
  }, [sortOption, filterOption]);

  const handleSortChange = (e) => setSortOption(e.target.value);
  const handleFilterChange = (e) => setFilterOption(e.target.value);

  const handleEntryClick = (id) => {
    navigate("journal-entry", { replace: true });
  };

  return (
    <>
      <Header />
      {loading ? (
        <LoadingScreen />
      ) : (
        <div
          className={`journal-entries-page ${isSidebarOpen ? "shifted" : ""}`}
        >
          <h1>Journal Entries</h1>
          <div className="select-option">
            <label>Sort by: </label>
            <select value={sortOption} onChange={handleSortChange}>
              <option value="A-Z">Alphabetical (A-Z)</option>
              <option value="Z-A">Alphabetical (Z-A)</option>
              <option value="newest">Date (Newest First)</option>
              <option value="oldest">Date (Oldest First)</option>
            </select>
            <label>Filter by: </label>
            <select value={filterOption} onChange={handleFilterChange}>
              <option value="all">All</option>
              <option value="favorites">Favorites</option>
              <option value="non-favorites">Non-Favorites</option>
            </select>
          </div>
          <ToolTip text="click to view full journal">
            <ul className="journal-list">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  onClick={() => handleEntryClick(entry.id)}
                  className="journal-entry"
                >
                  <div className="journal-prompt">
                    <strong>
                      {entry.refinedPrompt ? entry.refinedPrompt : ""}
                    </strong>
                  </div>
                  <div>{entry.content ? entry.content.split(".")[0] : ""}</div>
                </li>
              ))}
            </ul>
          </ToolTip>
        </div>
      )}
    </>
  );
};

export default JournalEntriesPage;
