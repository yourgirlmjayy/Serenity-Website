import "./Header.css";
import appLogo from "../assets/file.png";
import React, { useContext } from "react";
import { logout } from "../logout";
import { UserContext } from "../../../UserContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const handleLogOut = async () => {
    try {
      // call helper logout function
      logout();
      updateUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error.message);
      alert("Error logging out");
    }
  };

  return (
    <>
      <div className="banner">
        <div className="app-header">
          <img className="app-logo" src={appLogo} alt="web-logo" />
          <h1 className="app-name">Serenity 🧚🏼</h1>
          <button className="log-out-button" onClick={handleLogOut}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
export default Header;
