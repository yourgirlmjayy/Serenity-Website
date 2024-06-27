import './LandingPage.css'
import { useNavigate } from 'react-router';

const LandingPage = () =>{
    const navigate = useNavigate();
    const handleGetStarted = () => {
        navigate('/get-started');
    }
    return(
        <>
        <div className='landing-page'>
            <h1 className='welcome-message'> Welcome to Serenity </h1>
            <h3>💗</h3>
            <button className='sign-up-button' onClick={handleGetStarted}>Get started</button>
        </div>
        </>
    )
}

export default LandingPage;