import React, { useState } from "react";
import "./ToolTip.css";

const ToolTip = ({ children, text }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="tooltip-container">
      {children}
      {isVisible && <div className="tooltip-text">{text}</div>}
    </div>
  );
};

export default ToolTip;
