import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../AdminComponents/AdminNavbar';
import UserNavbar from '../UserComponents/UserNavbar';
import homeBg from '../Assets/HomeBg.jpg';
import './HomePage.css';

const HomePage = () => {
    const { role } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const aboutRef = useRef(null);

    const handleExplorePlants = () => {
        navigate('/user/view-plants');
    };

    const handleLearnMore = () => {
        aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

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
                        Whether you're decorating your home, refreshing your balcony,
                        or building your dream garden, Green Garden helps you bring
                        nature closer to your everyday life.
                    </p>

                    <div className="hero-buttons">
                        <button className="primary-btn" onClick={handleExplorePlants}>
                            Explore Plants
                        </button>
                        <button className="secondary-btn" onClick={handleLearnMore}>
                            Learn More
                        </button>
                    </div>

                    <div className="contact-box">
                        <h3>Contact Us</h3>
                        <p>Email: support@greengarden.com</p>
                        <p>Phone: +1 800 123 4567</p>
                    </div>
                </div>
            </section>

            <section className="about-section" ref={aboutRef}>
                <div className="about-content">
                    <span className="about-tag">Our Story</span>

                    <h2>About Green Garden</h2>

                    <p>
                        At Green Garden, we believe every home and workspace feels better
                        with fresh, healthy plants. Our nursery offers a carefully selected
                        collection of indoor and outdoor plants that add beauty, freshness,
                        and a natural touch to your surroundings.
                    </p>

                    <p>
                        We welcome everyone, from first-time plant buyers to passionate
                        gardening lovers. Each plant is chosen with care, maintained properly,
                        and packed safely so it reaches you in the best condition.
                    </p>

                    <p>
                        More than just a plant store, Green Garden is a place where people
                        can explore different varieties, choose plants that match their space,
                        and enjoy a simple, reliable, and pleasant shopping experience.
                    </p>

                    <div className="about-highlights">
                        <div className="about-point">Healthy Plants</div>
                        <div className="about-point">Safe Packaging</div>
                        <div className="about-point">Trusted Quality</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;