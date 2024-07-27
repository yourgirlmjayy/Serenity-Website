import React, { useState, useEffect } from "react";
import "./RecommendationsPage.css";
import LoadingScreen from "../Loading-Spinner/LoadingSpinner";
import { useSidebar } from "../sidebarcontext/SidebarContext";
import Header from "../Header/Header";

const RecommendationsPage = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const backendUrl = import.meta.env.VITE_BACKEND_ADDRESS;
  const recommendationsUrl = `${backendUrl}/recommendations`;

  useEffect(() => {
    if (!recommendations.length) {
      const fetchRecommendations = async () => {
        setLoading(true);
        try {
          const response = await fetch(recommendationsUrl, {
            method: "GET",
            credentials: "include",
          });
          const data = await response.json();
          if (response.ok) {
            setRecommendations(data);
          } else {
            throw new Error(data.error);
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchRecommendations();
    }
  }, [recommendations]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div className="recommendations-error-message">Error: {error} </div>;
  }

  return (
    <>
      <Header />
      <div className={`recommendations-page ${isSidebarOpen ? "shifted" : ""}`}>
        <h1>"Hi there! Here are some Recommended Activities for you today!"</h1>
        <div classname="recommendations-list">
          {recommendations.map((rec) => (
            <div className="recommendation-item" key={rec.id}>
              {rec.activity}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RecommendationsPage;
