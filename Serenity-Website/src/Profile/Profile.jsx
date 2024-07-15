import React, { useState, useEffect } from "react";
import "./Profile.css";
import Header from "../Header/Header";
import { useSidebar } from "../sidebarcontext/SidebarContext";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    age: "",
    birthday: null,
  });

  const [message, setMessage] = useState("");
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  const backendURl = import.meta.env.VITE_BACKEND_ADDRESS;
  const userProfileUrl = `${backendURl}/profile`;
  const userProfileFeed = `${backendURl}/user-profile`;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(userProfileFeed, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setProfile({
            name: data.name || "",
            bio: data.bio || "",
            age: data.age || "",
            birthday: data.birthday
              ? newDate(data.birthday).toISOString().split("T")[0]
              : null,
          });
        } else if (response.status === 404) {
          setProfile({
            name: "",
            bio: "",
            age: "",
            birthday: null,
          });
          setMessage("You don't have a profile, you can create one");
        } else {
          setMessage("Failed to Fetch Profile");
        }
      } catch (error) {
        setMessage("Failed to fetch profile");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(userProfileUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profile),
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setMessage("Profile saved successfully");
      } else {
        setMessage("Failed to save profile");
      }
    } catch (error) {
      setMessage("Failed to save profile");
    }
  };

  return (
    <>
      <Header />
      <div className={`profile-page ${isSidebarOpen ? "shifted" : ""}`}>
        <h2>Profile Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Bio:</label>
            <input
              type="text"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Birthday:</label>
            <input
              type="date"
              name="birthday"
              value={
                profile.birthday
                  ? new Date(profile.birthday).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
            />
          </div>
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </>
  );
};

export default ProfilePage;
