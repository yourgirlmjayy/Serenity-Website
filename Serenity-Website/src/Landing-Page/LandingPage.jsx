import './LandingPage.css'
import { useNavigate } from 'react-router';
import Header from '../Header/Header';
import mentalHealthImage from '../assets/file.png';

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
         <Header />
        <div className='landing-page'>
                <svg viewBox="0 0 500 150" className="curved-text">
                    <path id="curve" d="M 50, 150 A 200, 100 0 0, 1 450,150" fill="transparent"/>
                    <text width="500">
                        <textPath href="#curve" textAnchor="middle" startOffset="50%">Welcome to Serenity</textPath>
                    </text>
                </svg>
            <div className='mental-health-img-div'><img className='mental-health-img' src={mentalHealthImage}/></div>
            <button className='sign-up-button' onClick={handleGetStarted}>Get started</button>
            <p className='log-in-text'>Already have an account?{' '}
                <span
                    onClick={handleLogIn}
                    className='log-in-link'
                >
                Log in
                </span>
            </p>
        </div>
        </>
    )
}

export default LandingPage;