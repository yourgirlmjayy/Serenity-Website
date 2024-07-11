import React, { useState, useContext } from "react";
import "./SignUp.css";
import email_icon from "../assets/email-5-xxl.png";
import password_icon from "../assets/password.png";
import hide from "../assets/hide.png";
import view from "../assets/view.png";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../UserContext";
import { validate as validateEmail } from "email-validator";

function SignUp() {
  const action = "Sign Up";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleBackButton = () => {
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

  const backendUrl = import.meta.env.VITE_BACKEND_ADDRESS;
  const url = `${backendUrl}/create`;

  const handleCreate = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (email && password) {
      const isEmailValid = validateEmail(email);
      const isPasswordValid = password.length >= 8;

      // update error messages if both password and email are invalid
      if (!isEmailValid && !isPasswordValid) {
        setEmailError("Invalid email address");
        setPasswordError("Password must be at least 8 characters long");
        return;
      }

      // If email is invalid, notify user
      setEmailError(isEmailValid ? null : "Invalid email address!");

      //If password length is less than required, notify user
      setPasswordError(
        isPasswordValid ? null : "Password must be at least 8 characters long!"
      );

      // Return if either validation fails
      if (!(isEmailValid && isPasswordValid)) {
        return;
      }

      // Proceed with valid input
      const userDetails = {
        email: email,
        password: password,
      };

      try {
        // make api request to backend for signup
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userDetails),
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const loggedInUser = data.user;
          setResult("Create success!");

          //reset form fields
          setPassword("");
          setEmail("");

          // Update the user context
          updateUser(loggedInUser);

          // navigate to mood board page after successful login
          navigate("/mood-and-activities");
        } else {
          // Handle signup failure case
          alert("Failed to create account!");
        }
      } catch (error) {
        // Handle any network or API request errors
        alert(`Failed to create: ${error.message}`);
      }
    } else {
      alert("Please fill out all fields!");
    }
  };

  return (
    <>
      <button className="back-button" onClick={handleBackButton}>
        BACK
      </button>
      <div className="sign-up-container">
        <div className="header">
          <div className="text">{action}</div>
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
          {emailError && (
            <p style={{ color: "red", fontFamily: "serif" }}>{emailError}</p>
          )}
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
          {passwordError && (
            <p style={{ color: "red", fontFamily: "serif" }}>{passwordError}</p>
          )}
        </div>
        <div className="submit-container">
          <div className="submit" onClick={handleCreate}>
            Sign Up
          </div>
        </div>
      </div>
    </>
  );
}
export default SignUp;
