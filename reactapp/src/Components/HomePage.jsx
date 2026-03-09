import React from 'react';
import { useSelector } from 'react-redux';
import AdminNavbar from '../AdminComponents/AdminNavbar';
import UserNavbar from '../UserComponents/UserNavbar';
import homeBg from '../Assets/HomeBg.jpg';
import './HomePage.css';

const HomePage = () => {

    const { role } = useSelector((state) => state.user);

    return (
        <div className="homepage-container">

            {role === 'admin' ? <AdminNavbar /> : <UserNavbar />}

            <section
                className="hero-section"
                style={{ backgroundImage: `url(${homeBg})` }}
            >

                <div className="hero-overlay"></div>

                <div className="hero-card">

                    <h1 className="hero-title">
                        Welcome to <span>Green Garden</span>
                    </h1>

                    <p className="hero-description">
                        Discover a world of beautiful plants and gardening essentials.
                        Whether you're decorating your home or building your dream garden,
                        Green Garden helps you bring nature closer to you.
                    </p>

                    <div className="hero-buttons">
                        <button className="primary-btn">Explore Plants</button>
                        <button className="secondary-btn">Learn More</button>
                    </div>

                    <div className="contact-box">

                        <h3>Contact Us</h3>

                        <p>Email: support@greengarden.com</p>
                        <p>Phone: +1 800 123 4567</p>

                    </div>

                </div>

            </section>

        </div>
    );
};

export default HomePage;