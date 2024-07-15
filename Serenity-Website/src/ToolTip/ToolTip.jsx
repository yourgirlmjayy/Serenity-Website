import React, { useState } from "react";
import "./ToolTip.css";

const ToolTip = ({ children, text, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showToolTip = () => {
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, duration);
  };

  return (
    <div className="tooltip-container">
      {children}
      {isVisible && <div className="tooltip-text">{text}</div>}
    </div>
  );
};

export default ToolTip;
