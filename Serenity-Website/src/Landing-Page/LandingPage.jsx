import './LandingPage.css'
import { useNavigate } from 'react-router';
import Header from '../Header/Header.jsx';

const LandingPage = () =>{
    const navigate = useNavigate();
    const handleGetStarted = () => {
        navigate('/signup');
    }
    return(
        <>
        <Header />
        <div className='landing-page'>
            <h1 className='welcome-message'> Welcome to Serenity </h1>
            <button className='sign-up-button' onClick={handleGetStarted}>Get started</button>
            <p className='log-in-button'>Already have an account? <a href=''>Sign in</a></p>
        </div>
        </>
    )
}

export default LandingPage;