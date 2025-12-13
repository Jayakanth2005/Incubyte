import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-brand">
                        🍬 Sweet Shop
                    </Link>

                    <ul className="navbar-nav">
                        {user ? (
                            <>
                                <li>
                                    <Link to="/dashboard" className="nav-link">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <span className="nav-link" style={{ cursor: 'default' }}>
                                        👤 {user.name}
                                        {isAdmin && (
                                            <span className="badge badge-success" style={{ marginLeft: '0.5rem' }}>
                                                Admin
                                            </span>
                                        )}
                                    </span>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="btn btn-outline">
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login" className="btn btn-outline">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/register" className="btn btn-primary">
                                        Sign Up
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
