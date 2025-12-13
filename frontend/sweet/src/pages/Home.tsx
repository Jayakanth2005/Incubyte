import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="container">
            <div className="hero" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h1 className="hero-title" style={{ fontSize: '4rem' }}>
                    Welcome to Sweet Shop 🍬
                </h1>
                <p className="hero-subtitle" style={{ fontSize: '1.5rem', maxWidth: '700px' }}>
                    Your one-stop destination for the finest sweets and treats.
                    Discover, purchase, and manage your favorite confections with ease.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                    <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                        Get Started
                    </Link>
                    <Link to="/login" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                        Sign In
                    </Link>
                </div>

                <div className="grid grid-3" style={{ marginTop: '4rem' }}>
                    <div className="card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍫</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            Wide Selection
                        </h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Browse through our extensive collection of premium sweets
                        </p>
                    </div>

                    <div className="card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            Easy Purchase
                        </h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Simple and secure checkout process for all your favorites
                        </p>
                    </div>

                    <div className="card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            Real-time Updates
                        </h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Live inventory tracking and instant purchase confirmation
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
