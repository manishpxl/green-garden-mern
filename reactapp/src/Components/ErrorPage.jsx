import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {

    const navigate = useNavigate();

    return (
        <div className="error-container">

            <div className="error-box">

                <h1 className="error-code">500</h1>

                <h2>Something Went Wrong</h2>

                <p>
                    The page you are looking for might have been removed,
                    had its name changed, or is temporarily unavailable.
                </p>

                <button
                    className="error-btn"
                    onClick={() => navigate('/')}
                >
                    Go Back Home
                </button>

            </div>

        </div>
    );
};

export default ErrorPage;