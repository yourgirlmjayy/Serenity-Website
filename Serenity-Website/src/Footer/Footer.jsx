import React from "react";
import "./Footer.css";
import { useSidebar } from "../sidebarcontext/SidebarContext";

function Footer() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  return (
    <div className={`footer ${isSidebarOpen ? "shifted" : ""}`}>
      <footer>
        <p>
          {" "}
          2024 Serenity. All rights reserved. &copy; Mindfully crafted with
          love.
        </p>
      </footer>
    </div>
  );
}
export default Footer;
