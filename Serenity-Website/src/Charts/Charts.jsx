import React, { useEffect, useState } from "react";
import "./Charts.css";
import { Doughnut, Bar } from "react-chartjs-2";
import "chart.js/auto";
import LoadingScreen from "../Loading-Spinner/LoadingSpinner";
import { generateColors } from "./generateColors";

const Charts = () => {
  const [moodData, setMoodData] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const backendURl = import.meta.env.VITE_BACKEND_ADDRESS;
  const url = `${backendURl}/user-analytics`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setMoodData(data.moodFrequency);
        setActivityData(data.activityFrequency);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  // prepare data for doughnut chart(mood data)
  const moodLabels = Object.keys(moodData);
  const moodCounts = Object.values(moodData);
  const moodColors = ["#ff6384", "#36a2eb", "#e7b746", "4bc0c0", "#9966ff"];

  const moodChartData = {
    labels: moodLabels,
    datasets: [
      {
        data: moodCounts,
        backgroundColor: moodColors,
      },
    ],
  };

  // prepare data for bar chart (activity data)
  const activityLabels = Object.keys(activityData);
  const activityCounts = Object.values(activityData);
  const activityColors = generateColors(activityLabels.length);

  const activityChartData = {
    labels: activityLabels,
    datasets: [
      {
        data: activityCounts,
        backgroundColor: activityColors,
      },
    ],
  };

  return (
    <>
      <div className="charts-container">
        <div className="doughnut-container">
          <p>Mood Analytics</p>
          <Doughnut
            data={moodChartData}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </div>
        <div className="bar-chart-container">
          <p>Activities Analytics</p>
          <Bar
            data={activityChartData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
      </div>
    </>
  );
};
export default Charts;
