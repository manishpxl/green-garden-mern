import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="error-container">
            <h2>Something Went Wrong</h2>
            <p>Please try again later or return to safety.</p>
            <button className="error-btn" onClick={() => navigate('/')}>
                Go Home
            </button>
        </div>
    );
};

export default ErrorPage;
