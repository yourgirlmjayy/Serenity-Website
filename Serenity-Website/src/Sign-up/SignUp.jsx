import React, { useState } from 'react';
import './SignUp.css'
import email_icon from '../assets/email-5-xxl.png'
import user_icon from '../assets/person.png'
import password_icon from '../assets/password.png'
import hide from '../assets/hide.png'
import view from '../assets/view.png'
import { useNavigate } from 'react-router-dom'
// import { UserContext } from '../../../UserContext';

const SignUp = ()=> {
    const [action, setAction] = useState("Sign Up");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [result, setResult] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    // const { updateUser } = useContext(UserContext);
    
    const navigate = useNavigate();
    const handleBackButton = () =>{
        navigate('/');
    }
    const handlePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }
    
    const handleChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }
    
    const handleChangeName= (e) => {
        setName(e.target.value);
    }

    const backendUrl = import.meta.env.VITE_BACKEND_ADDRESS;

    const handleCreate = () => {
        fetch(`${backendUrl}/create`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            email,
            password,
            }), 
        })
        .then(response => {
            console.log(response)
            if (response.ok) {
            setResult("create success!");
            }
            else {
            setResult("failed to create!");
            }
        })
        .catch(error => {
            setResult("failed to create!");
        });
    }
    // const handleCreate = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await fetch(`${backendUrl}/create`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 email,
    //                 password,
    //                 name: name || "", // optional field, defaults to empty string if not provided
    //             }),
    //             });
        
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 const loggedInUser = data.name ?? data.email;
    //                 console.log("Signup successful");
    //                 setResult("Create success!");

    //                 //reset form fields
    //                 setName("");
    //                 setPassword("");
    //                 setEmail("");

    //                 // //update user context
    //                 // updateUser(loggedInUser);
                    
    //                 // navigate to mood board page after successful login
    //                 navigate('/mood-board');

    //             } else {
    //                 alert("Failed to create!");
    //             }
    //         } catch (error) {
    //             console.log(error.message);
    //             setResult(`Failed to create: ${error.message}`);
    //         }
    //     };


    return(
        <>
         <button className='back-button' onClick={handleBackButton}>BACK</button> 
        <div className="sign-up-container">
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className='input'>
                    <img src={user_icon} alt="user-icon" className="user-icon"/>
                    <input type="text" placeholder='Enter name...' onChange={handleChangeName} value={name}></input>
                </div>
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
                    <div className="submit" onClick={handleCreate}>Sign Up</div>
                </div>
        </div>
        </>
    )
}
export default SignUp;

// import React, { useState } from 'react'
// import './SignUp.css'
// import email_icon from '../assets/email-5-xxl.png'
// import user_icon from '../assets/person.png'
// import password_icon from '../assets/password.png'
// import hide from '../assets/hide.png'
// import view from '../assets/view.png'
// import signUp from '../assets/SignUp.jpg'
// import LogIn from '../assets/LogInImage.jpg'
// import { useNavigate } from 'react-router-dom'

// const SignUp = ()=> {
//     const[isSignUpMode, setIsSignUpMode] = useState(false)
//     const [passwordVisible, setPasswordVisible] = useState(false);
//     const navigate = useNavigate();
    
//     const handleBackButton = () =>{
//         navigate('/');
//     }

//     const handleSignUpClick = ()=> {
//         setIsSignUpMode(true);
//     }

//     const handleSignInClick = () =>{
//         setIsSignUpMode(false);
//     }

//     const handlePasswordVisibility = () => {
//         setPasswordVisible(!passwordVisible);
//       }

    
//     return(
//         <>
//         <button className='back-button' onClick={handleBackButton}>BACK</button>
//         <div className={`loginContainer ${isSignUpMode ? "sign-up-mode" : ''}`}>
//             <div className="forms-container">
//                 <div className="signin-signup">
//                     <form action="#" className='sign-in-form' loginform>
//                         <h2 className='title'>Sign in</h2>

//                         <div className='input-field'>
//                             <img src={email_icon} alt="email_icon" className="email-icon"/>
//                             <input className="LoginInput" type="email" placeholder='Email'></input>
//                         </div>
//                         <div className='input-field'>
//                             <img src={password_icon} alt="password_icon" className="password-icon"/>
//                             <input className="LoginInput" type={passwordVisible===false? "password": "text"} placeholder='Password'></input>
//                             <img className='eye-icon' src={passwordVisible===true ? view: hide} alt='hide password' onClick={handlePasswordVisibility}/>
//                         </div>
//                         <button className='button'>Sign In</button>
//                     </form>

//                     <form action="#" className="sign-up-form loginForm">
//                         <h2 className='title'>Sign up</h2>
//                         <div className='input-field'>
//                             <img src={user_icon} alt="user-icon" className="user-icon"/>
//                             <input type="text" placeholder='Enter name...'></input>
//                         </div>
//                         <div className='input-field'>
//                             <img src={email_icon} alt="email_icon" className="email-icon"/>
//                             <input type="email" placeholder='Enter email...'></input>
//                         </div>
//                         <div className='input-field'>
//                             <img src={password_icon} alt="password_icon" className="password-icon"/>
//                             <input type={passwordVisible===false? "password": "text"} placeholder='Password'></input>
//                             <img className='eye-icon' src={passwordVisible===true ? view: hide} alt='hide password' onClick={handlePasswordVisibility}/>
//                         </div>
//                         <button className='button'>Sign Up</button>
//                     </form>
//                 </div>
//             </div>
                
//             <div className="panels-container">
//                 <div className="panel left-panel">
//                     <div className="content">
//                         <h3 className="loginh3">New here?</h3>
//                         <p className="loginp">
//                             Welcome to Serenity! Here, you can log your moods, and track your mental health status. 
//                             We're here to support you on your journey to better mental health.
//                         </p>
//                         <button className="button transparent" onClick={handleSignUpClick}>Sign Up</button>
//                     </div>
//                     <img src={LogIn} className="image" alt="Welcome!"/>
//                 </div>
                
//                 <div className="panel right-panel">
//                     <div className="content">
//                         <h3 className="loginh3"> One of us?</h3>
//                         <p className="loginp">
//                             Welcome Back! 
//                             We're here to support you on your journey to better mental health.
//                         </p>
//                         <button className="button transparent" onClick={handleSignInClick}>Sign In</button>
//                     </div>
//                     <img src={signUp} className="image" alt="Welcome back!"/>
//                 </div>
//             </div>
//         </div>
//         </>
//     )
// }
// export default SignUp;