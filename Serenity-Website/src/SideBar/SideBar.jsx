import "./SideBar.css";
import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { SideBarData } from "./SideBarData";
import { IconContext } from "react-icons/lib";
import { useSidebar } from "../sidebarcontext/SidebarContext";

function SideBar() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="side-bar-container">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={toggleSidebar} />
          </Link>
          <nav className={isSidebarOpen ? "nav-menu active" : "nav-menu"}>
            <ul className="nav-menu-items" onClick={toggleSidebar}>
              <li className="navbar-toggle">
                <Link to="#" className="menu-bars">
                  <AiIcons.AiOutlineClose />
                </Link>
              </li>
              {SideBarData.map((item, index) => {
                return (
                  <li key={index} className={item.cName}>
                    <Link to={item.path}>
                      {item.icon}
                      <span className="item-title">{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </IconContext.Provider>
    </>
  );
}

export default SideBar;
