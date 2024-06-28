import './LogIn.css'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import email_icon from '../assets/email-5-xxl.png'
import password_icon from '../assets/password.png'
import hide from '../assets/hide.png'
import view from '../assets/view.png'
import Header from '../Header/Header'

function LogIn(){
    const [passwordVisible, setPasswordVisible] = useState(false);
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const [result, setResult] = useState("");
    const navigate = useNavigate();
    const action = "Log in"
    
    const handlePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
      }

    const handleChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const backendUrlAccess = import.meta.env.VITE_BACKEND_ADDRESS;

    const handleLogin = async () => {
    try {
        const response = await fetch(`${backendUrlAccess}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
        });

        if (response.ok) {
        setResult("Login success!");
        } else {
        throw new Error("Failed to login!");
        }
    } catch (error) {
        setResult(`Failed to login: ${error.message}`);
    }
    };


      return(
        <>
        <Header />
        <div className="sign-in-container">
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className='input'>
                    <img src={email_icon} alt="email_icon" className="email-icon"/>
                    <input type="email" placeholder='Enter email Id...' onChange={handleChangeEmail} value={email}></input>
                </div>
                <div className='input'>
                    <img src={password_icon} alt="password_icon" className="password-icon"/>
                    <input type={passwordVisible===false? "password": "text"}  placeholder='Password' onChange={handleChangePassword} value={password}></input>
                    <img className='eye-icon' src={passwordVisible===true ? view: hide} alt='hide password' onClick={handlePasswordVisibility}/>
                </div>
            </div>
                <div className="submit-container">
                    <button className="submit" type="submit" onClick={handleLogin}>Log in</button>
                </div>
        </div>
  </>
    )
}

export default LogIn;