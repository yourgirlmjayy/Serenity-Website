import './NotFoundPage.css';
import NotFound from '../assets/notFound.jpg';
import React from 'react';

function NotFoundPage () {
    return (
        <>

        <img src={NotFound} alt="Page not found!" className="not-found-image"></img>

        </>
    )
}

export default NotFoundPage;