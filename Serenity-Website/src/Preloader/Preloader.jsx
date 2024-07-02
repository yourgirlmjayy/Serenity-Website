import { preLoaderAnim } from '../Animations'
import './Preloader.css'
import React, { useEffect } from 'react'


const Preloader = () => {

    useEffect (() => {
        preLoaderAnim()
    }, []);

    return (
        <>
        <div className="preloader">
            <div className="texts-container">
                <span>Feel,</span>
                <span>Share,</span>
                <span>Grow.</span>
            </div>
        </div>
        </>
    )
}
export default Preloader;