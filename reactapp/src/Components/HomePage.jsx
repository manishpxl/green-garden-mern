import React from 'react';
import { useSelector } from 'react-redux';
import AdminNavbar from '../AdminComponents/AdminNavbar';
import UserNavbar from '../UserComponents/UserNavbar';
import './HomePage.css';

const HomePage = () => {
    const { role } = useSelector((state) => state.user);

    return (
        <div className="homepage-container">
            {role === 'admin' ? <AdminNavbar /> : <UserNavbar />}

            <div className="hero-section">
                {/* We'll assume you have a background.webp in public/images or src/assets */}
                <div className="hero-content">
                    <h1>Welcome to Green Garden</h1>
                    <p>
                        Your ultimate destination for the freshest plants and gardening essentials.
                        Cultivate your passion for nature and bring life to every corner of your home.
                    </p>

                    <div className="contact-details">
                        <p><strong>Contact Us:</strong></p>
                        <p>Email: support@greengarden.com</p>
                        <p>Phone: +1 800 123 4567</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
