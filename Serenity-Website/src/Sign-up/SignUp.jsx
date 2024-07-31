import React, { useState, useContext } from "react";
import "./SignUp.css";
import email_icon from "../assets/email-5-xxl.png";
import password_icon from "../assets/password.png";
import water_plant from "../assets/SignUp.jpg";
import hide from "../assets/hide.png";
import view from "../assets/view.png";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../UserContext";
import { validate as validateEmail } from "email-validator";
import { FcGoogle } from "react-icons/fc";

function SignUp() {
  const action = "Sign Up";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [result, setResult] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleBackButton = () => {
    //navigate user to home page if exit bbutton is clicked
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/logIn");
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const backendUrl = import.meta.env.VITE_BACKEND_ADDRESS;
  const url = `${backendUrl}/create`;

  const handleCreate = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (email && password && confirmPassword) {
      const isEmailValid = validateEmail(email);
      const isPasswordValid = password.length >= 8;
      const isConfirmPasswordValid = password === confirmPassword;

      // update error messages if both password and email are invalid
      if (!isEmailValid && !isPasswordValid && !isConfirmPasswordValid) {
        setEmailError("Invalid email address");
        setPasswordError("Password must be at least 8 characters long");
        setConfirmPasswordError("Passwords do not match!");
        return;
      }

      if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
        // If email is invalid, notify user
        if (!isEmailValid) {
          setEmailError("Invalid email address!");
        }

        //If password length is less than required, notify user
        if (!isPasswordValid) {
          setPasswordError("Password must be at least 8 characters long!");
        }

        // if confirm password does not match, notify user
        if (!isConfirmPasswordValid) {
          setConfirmPasswordError("Passwords do not match!");
        }
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
          setConfirmPassword("");

          // Update the user context
          updateUser(loggedInUser);

          // navigate to mood board page after successful login
          navigate("/user-feed");
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
      <div className="sign-up-page">
        <div className="sign-up-container">
          <div className="form-container">
            <h1 className="greeting"> Welcome to Serenity! </h1>
            <p className="instruction">Register your account</p>
            <div className="input-group">
              <div className="input">
                <img src={email_icon} alt="email_icon" className="icon" />
                <input
                  type="email"
                  placeholder="Enter email Id..."
                  onChange={handleChangeEmail}
                  value={email}
                />
              </div>
              {emailError && (
                <p style={{ color: "red", fontFamily: "serif" }}>
                  {emailError}
                </p>
              )}

              <div className="input">
                <img src={password_icon} alt="password_icon" className="icon" />
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  onChange={handleChangePassword}
                  value={password}
                />
                <img
                  className="eye-icon"
                  src={passwordVisible ? view : hide}
                  alt={passwordVisible ? "hide" : "view"}
                  onClick={handlePasswordVisibility}
                />
              </div>
              {passwordError && (
                <p style={{ color: "red", fontFamily: "serif" }}>
                  {passwordError}
                </p>
              )}

              <div className="input">
                <img src={password_icon} alt="password_icon" className="icon" />
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm Password"
                  onChange={handleChangeConfirmPassword}
                  value={confirmPassword}
                />
                <img
                  className="eye-icon"
                  src={confirmPasswordVisible ? view : hide}
                  alt={confirmPasswordVisible ? "hide" : "view"}
                  onClick={handleConfirmPasswordVisibility}
                />
              </div>
              {confirmPasswordError && (
                <p style={{ color: "red", fontFamily: "serif" }}>
                  {confirmPasswordError}
                </p>
              )}
              <button id="submit" onClick={handleCreate}>
                Sign Up
              </button>
              <p id="log-in-text">
                Already have an account? {""}
                <span id="log-in-link" onClick={handleLogin}>
                  Log-in
                </span>
              </p>
            </div>
          </div>
          <div className="image-container">
            <img src={water_plant} alt="side-illustration" />
            <div className="button-div">
              <button id="exit-button" onClick={handleBackButton}>
                EXIT
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default SignUp;
