import React, { useState } from 'react'
import './SignUp.css'
import email_icon from '../assets/email-5-xxl.png'
import user_icon from '../assets/person.png'
import password_icon from '../assets/password.png'

const SignUp = ()=> {
    const [action, setAction] = useState("Sign Up");
    return(
        <div className="sign-up-container">
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {/* hide name input field if user clicks on log in button*/}
                {action==="Log in" ?<div></div>:<div className='input'>
                    <img src={user_icon} alt="user-icon" className="user-icon"/>
                    <input type="text" placeholder='Enter name...'></input>
                </div>}
                <div className='input'>
                    <img src={email_icon} alt="email_icon" className="email-icon"/>
                    <input type="email" placeholder='Enter email Id...'></input>
                </div>
                <div className='input'>
                    <img src={password_icon} alt="password_icon" className="password-icon"/>
                    <input type="password" placeholder='Password'></input>
                </div>
            </div>
                <div className="submit-container">
                    <div className={action==="Log in"? "submit gray": "submit"} onClick={() => {setAction("Sign Up")}}>Sign Up</div>
                    <div className={action==="Sign Up"? "submit gray": "submit"} onClick={() => {setAction("Log in")}}>Log in</div>
            </div>
        </div>
    )
}
export default SignUp;