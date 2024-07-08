import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faX } from "@fortawesome/free-solid-svg-icons";

import './MoodBoard.css';
import angry  from '../assets/angry.png';
import sad from '../assets/sad.png';
import neutral from '../assets/neutral.png';
import happy from '../assets/happy.png';
import excited from '../assets/excited.png';
import Header from "../Header/Header";

const moods = {
    // moood object 
    angry: <img src={angry}/>,
    sad: <img src={sad} />,
    neutral: <img src={neutral}/>,
    happy: <img src={happy}/>,
    excited: <img src={excited} />

};

function MoodBoard (){
    // set default mood to null
    const [selectedMood, setSelectedMood] = useState(null);
    
    //set current date
    const [currentDate, setCurrentDate] = useState('');
    
    //state hook to set success message for when user submits a mood.
    const [successMessage, setSuccessMessage] = useState('');
    
    //track if mood has been submitted
    const [moodSubmitted, setMoodSubmitted] = useState(false);

    // set error message
    const[errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        // Set the current date and render when the component mounts 
        const now = new Date();
        const formattedDate = now.toLocaleString('en-US', 
            {weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric'});
        setCurrentDate(formattedDate);
    }, []);

    const backendUrlAddress = import.meta.env.VITE_BACKEND_ADDRESS
    const url = `${backendUrlAddress}/moodlog`

    const handleMoodSelect = (mood) => {
        // handle mood changes
        setSelectedMood(prevMood => prevMood === mood ? null : mood);
    }

    const handleMoodSubmit = async() => {
        if(!selectedMood) {
            alert('Please select a mood');
            return;
        }

        try {
            const response = await fetch (url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials : 'include',
                body: JSON.stringify ({ mood: selectedMood })
            });

            if (response.status === 400){
                setErrorMessage("Mood already logged for today");
            } else if (!response.ok) {
                setErrorMessage("Error logging mood");
                throw new Error('Failed to log mood');
            } else {
                const data = await response.json();
                setMoodSubmitted(true);
                // set success message if user logs mood successfully
                setSuccessMessage('You have successfully logged your mood');
                // clear error message
                setErrorMessage('');
                console.log('Mood loged successfully:', data);
            }
            
            } catch(error) {
            console.error('Error logging mood', error);
            setErrorMessage("Error logging mood");
        }
    };

    return (
        <>
        <Header />
        <div className='back-button-div'><button className='back-button' onClick={() => navigate('/activites-feed')}> <FontAwesomeIcon icon={faX} /> </button></div>
        <div className='mood-entry'>
            <h2 className="prompt">How are you feeling today?</h2>
            <h4 className="current-date"><FontAwesomeIcon icon={faCalendar} />   {currentDate}</h4>
            <div className="mood-options">
                {Object.keys(moods).map((mood) => (
                    <span
                        key={mood}
                        className={`mood-button ${selectedMood === mood ? 'selected' : ''}`}
                        onClick={() => handleMoodSelect(mood)}
                        disabled={moodSubmitted}
                    >
                        {moods[mood]} <br /> <span>{mood}</span>
                    </span>
                ))}
            </div>
            <button onClick={handleMoodSubmit} disabled={moodSubmitted} className='submit-button'>Log Mood</button>
            
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            
            {moodSubmitted && <button onClick={() => navigate('/past-moods')} className='view-past-moods-button'>View Your Past Moods</button>}

            {/* TO DO: CREATE ROUTE FOR PAST MOODS IN APP */}
            {/* LET PAST MOODS BE EMPTY BUT HAVER A TEXT THAT SAYS "SEEMS TYOU HAVEN'T LOGGED ANY MOOD. DO YOU WANT TO LOG ANY MOOD" */}
        </div>
        </>
    );

};

export default MoodBoard;