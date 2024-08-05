import "./Header.css";
import React, { useContext } from "react";
import { logout } from "../logout";
import { UserContext } from "../../../UserContext";
import { useNavigate } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import { useSidebar } from "../sidebarcontext/SidebarContext";

function Header() {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const { isSidebarOpen, toggleSidebar } = useSidebar();
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
      <div className={`banner`}>
        <SideBar />
        <div className={`app-header${isSidebarOpen ? "shifted" : ""}`}>
          <div className={"header-content"}>
            <div style={{ flex: 1 }}></div>{" "}
            {/* This div is used to push the app name and logout button apart */}
            <h1 className="app-name">Serenity 🧚🏼</h1>
            <button className="log-out-button" onClick={handleLogOut}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Header;
