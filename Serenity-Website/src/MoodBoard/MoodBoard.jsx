import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceAngry, faFaceLaughBeam, faFaceMeh, faFaceSadTear, faFaceSmileBeam, faCalendar } from '@fortawesome/free-regular-svg-icons';
import './MoodBoard.css'
import { useState, useEffect } from 'react';
import Header from "../Header/Header";

const moods = {
    // moood object 
    angry: <FontAwesomeIcon icon={faFaceAngry} />,
    sad: <FontAwesomeIcon icon={faFaceSadTear} />,
    neutral: <FontAwesomeIcon icon={faFaceMeh} />,
    happy: <FontAwesomeIcon icon={faFaceSmileBeam} />,
    excited: <FontAwesomeIcon icon={faFaceLaughBeam} />

};

function MoodBoard (){
    // set default mood to null
    const [selectedMood, setSelectedMood] = useState(null);
    //set current date
    const [currentDate, setCurrentDate] = useState('');
    //state hook to set success message for when user submits a mood.
    const [successMessage, setSuccessMessage] = useState('');
    //update to true when successMessage is non empty
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        // Set the current date when the component mounts
        const now = new Date();
        const formattedDate = now.toLocaleString('en-US', 
            {weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric'});
        setCurrentDate(formattedDate);
    }, []);

    const backendUrlAddress = import.meta.env.VITE_BACKEND_ADDRESS
    const url = `${backendUrlAddress}/moodlog`

    const handleMoodSelect = (mood) => {
        // update selected mood when a mood is picked
        setSelectedMood(mood);
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
                body: JSON.stringify ({
                    date: new Date().toISOString(),
                    mood: selectedMood
                })
            });

            if (!response.ok) {
                throw new Error('Failed to log mood');
            }
            const data = await response.json();
            setSuccessMessage('You have successfully logged your mood');
            setIsSubmitted(true);
        }   catch(error) {
            console.error('Error logging mood', error);
        }
    };

    return (
        <>
        <Header />
        <div className='mood-entry'>
            <h2>How are you feeling today?</h2>
            <h4 className="current-date"><FontAwesomeIcon icon={faCalendar} />{ " " + currentDate}</h4>
            <div className="mood-options">
                {Object.keys(moods).map((mood) => (
                    <button
                        key={mood}
                        className={`mood-button ${selectedMood === mood ? 'selected' : ''}`}
                        onClick={() => handleMoodSelect(mood)}
                    >
                        {moods[mood]} <br /> <span>{mood}</span>
                    </button>
                ))}
            </div>
            <button onClick={handleMoodSubmit} className='submit-button'>Submit</button>
            {isSubmitted && (
                <p className='success-message-show'>
                    {successMessage}
                </p>
            )}
        </div>
        </>
    )

}

export default MoodBoard;