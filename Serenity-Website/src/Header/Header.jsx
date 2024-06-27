import './Header.css'
import Serenity from './appName.jpg'
import appLogo from './appLogo.jpg'

function Header(){
    return (
        <>
        <div className='banner'>
            <div className='app-header'>
                <img className='app-logo' src={appLogo} alt='web-logo'></img>
                <img className='app-name' src={Serenity} alt='App-name'></img>
                <button text='Email with questions or complaints'>Contact us</button>
            </div>
        </div>
        </>
    )
}
export default Header;