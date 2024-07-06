import './Header.css'
import appLogo from '../assets/file.png';
import React, { useContext } from 'react';
import { logout } from '../../../backend/utils';
import { UserContext } from '../../../UserContext';


function Header(){
    const { updateUser } = useContext(UserContext);
    const handleLogOut = () => {
    
        try {
            // call helper logout function
            logout();
            updateUser(null);
        } catch (error){
            console.log('Error logging out:', error.message);
            alert('Error logging out');
        }
    }
    
    return (
        <>
        <div className='banner'>
            <div className='app-header'>
                <img className='app-logo' src={appLogo} alt='web-logo'/>
                <h1 className='app-name'>Serenity 🧚🏼</h1>
                <button className='log-out-button' onClick={handleLogOut}>Logout</button>
            </div>
        </div>
        </>
    )
}
export default Header;