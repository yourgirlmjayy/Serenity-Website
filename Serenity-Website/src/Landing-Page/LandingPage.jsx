import './LandingPage.css'
import { useNavigate } from 'react-router';
import brainImg from '../assets/Brain.png';
import landing_gif from '../assets/backdrop.gif';

const LandingPage = () =>{
    const navigate = useNavigate();
    const handleGetStarted = () => {
        navigate('/get-started');
    }

    const handleLogIn = () => {
        navigate('/logIn');
    }
    return(
        <>
        <div className='landing-page-container'>
            <div className='gif-section'>
                <img src={landing_gif} alt="Welcome" className="landing-gif" />
            </div>
            <div className='login-section'>
                    <svg viewBox="0 0 500 150" className="curved-text">
                        <path id="curve" d="M 50, 150 A 200, 100 0 0, 1 450,150" fill="transparent"/>
                        <text width="50">
                            <textPath href="#curve" textAnchor="middle" startOffset="50%">Welcome to Serenity</textPath>
                        </text>
                    </svg>
                <div className='mental-health-img-div'><img className='mental-health-img' src={brainImg}/></div>
                <div className="button-container">
                    <button className="sign-up-button" onClick={handleGetStarted}>Create Account</button>
                    <button className="sign-up-button" onClick={handleLogIn}>{"Log in"}</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default LandingPage;