import React, { useState, useEffect } from "react";
import "./RecommendationsPage.css";
import LoadingScreen from "../Loading-Spinner/LoadingSpinner";
import { useSidebar } from "../sidebarcontext/SidebarContext";
import Header from "../Header/Header";
import { collectUserLocation } from "../utilities/collectUserLocation";
import Footer from "../Footer/Footer";

const RecommendationsPage = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  const { isSidebarOpen, toggleSidebar } = useSidebar();

  const backendUrl = import.meta.env.VITE_BACKEND_ADDRESS;
  const recommendationsUrl = `${backendUrl}/recommendations`;
  const weatherUrl = `${backendUrl}/get-weather`;

  const handleShareLocation = async () => {
    setLoading(true);
    try {
      const userLocation = await collectUserLocation();
      setLocation(userLocation);
      await fetch(weatherUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userLocation),
      });
      fetchRecommendations();
    } catch (error) {
      setError(error.message);
    }
  };

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

  useEffect(() => {
    if (!location.latitude || !location.longitude) {
      handleShareLocation();
    } else {
      fetchRecommendations();
    }
  }, [location]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="recommendations-error-message">Error: {error} </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={`recommendations-page ${isSidebarOpen ? "shifted" : ""}`}>
        <h1>Hi there! Here are some Recommended Activities for you today!</h1>
        {(!location.latitude || !location.longitude) && (
          <button
            className="share-location-button"
            onClick={handleShareLocation}
          >
            Share Location
          </button>
        )}
        <div className="recommendations-list-container">
          <div className="recommendations-list">
            {recommendations.map((rec) => (
              <div className="recommendation-item" key={rec.id}>
                {rec.activity}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RecommendationsPage;
