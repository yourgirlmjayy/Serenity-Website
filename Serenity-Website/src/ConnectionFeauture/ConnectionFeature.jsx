import React, { useState } from "react";
import "./ConnectionFeature.css"; 

function ConnectionFeature() {
  const [notification, setNotification] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "other", text: "Hi, we have similar interests in activities. Would you be open to talking?" }
  ]);

  const [inputText, setInputText] = useState("");

  // Handle Accept Request
  const handleAccept = () => {
    setNotification(false);
    setChatOpen(true);
  };

  // Send Message
  const sendMessage = () => {
    if (inputText.trim() === "") return;
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "me", text: inputText }
    ]);
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "other", text: "That's great! What do you like to do?" }
      ]);
    }, 1000);
    setInputText("");
  };

  return (
    <div>
      {/* Notification Popup */}
      {notification && (
        <div className="notification-popup">
          <p>John Doe wants to connect with you!</p>
          <button onClick={handleAccept}>Accept</button>
          <button onClick={() => setNotification(false)}>Decline</button>
        </div>
      )}

      {/* Chat Window */}
      {chatOpen && (
        <div className="chat-window">
          <h3>Chat with John Doe</h3>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <p
                key={index}
                className={msg.sender === "me" ? "message me" : "message other"}
              >
                {msg.text}
              </p>
            ))}
          </div>
          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConnectionFeature;
