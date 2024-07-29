import "./LogIn.css";
import React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import email_icon from "../assets/email-5-xxl.png";
import password_icon from "../assets/password.png";
import hide from "../assets/hide.png";
import view from "../assets/view.png";
import { UserContext } from "../../../UserContext";
import LoginIcon from "@mui/icons-material/Login";

function LogIn() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const action = "Log in";

  const handleBackButton = () => {
    //navigate user to home page if exit bbutton is clicked
    navigate("/");
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  let userDetails = {
    email: "",
    password: "",
  };

  const backendUrlAccess = import.meta.env.VITE_BACKEND_ADDRESS;
  const url = `${backendUrlAccess}/login`;

  const handleLogin = async (e) => {
    e.preventDefault();

    // move on to verifying details if user types in all fields
    if (email && password) {
      userDetails = {
        email: email,
        password: password,
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userDetails),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Login failed");
        }

        const data = await response.json();
        const { user } = data;
        updateUser(user);

        // navigate to user feed page after successful login
        navigate("/user-feed");
        alert("Successfully Logged In");
      } catch (error) {
        console.error("Error logging in:", error.message);
        alert("Unsuccessful login attempt. Try again.");
      }
    } else {
      alert("Please fill out all fields!");
    }
  };

  return (
    <>
      <div className="exit-button-container">
        <button className="exit-button" onClick={handleBackButton}>
          EXIT
        </button>
      </div>
      <div className="sign-in-container">
        <div className="header">
          <div className="text">
            <LoginIcon /> {action}
          </div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <img src={email_icon} alt="email_icon" className="email-icon" />
            <input
              type="email"
              placeholder="Enter email Id..."
              onChange={handleChangeEmail}
              value={email}
            ></input>
          </div>
          <div className="input">
            <img
              src={password_icon}
              alt="password_icon"
              className="password-icon"
            />
            <input
              type={passwordVisible === false ? "password" : "text"}
              placeholder="Password"
              onChange={handleChangePassword}
              value={password}
            ></input>
            <img
              className="eye-icon"
              src={passwordVisible === true ? view : hide}
              alt="hide password"
              onClick={handlePasswordVisibility}
            />
          </div>
        </div>
        <div className="submit-container">
          <button className="submit" type="submit" onClick={handleLogin}>
            Log In
          </button>
        </div>
      </div>
      <p className="sign-up-text">Don't have an account? </p>
      <p className="sign-up-link" onClick={() => navigate("/get-started")}>
        Sign-up
      </p>
    </>
  );
}

export default LogIn;
