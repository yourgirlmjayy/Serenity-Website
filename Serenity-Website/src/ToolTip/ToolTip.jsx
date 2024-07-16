import React, { useState } from "react";
import "./ToolTip.css";

const ToolTip = ({ children, text }) => {
  return (
    <div className="tooltip-container">
      {children}
      <div className="tooltip-text">{text}</div>
    </div>
  );
};

export default ToolTip;
