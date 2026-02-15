import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const { getCartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const cartCount = getCartCount();

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        <UtensilsCrossed className="logo-icon" />
                        <span className="logo-text">FoodHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="navbar-links">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/restaurants" className="nav-link">Restaurants</Link>
                        {isAuthenticated && user?.userRole === 'RESTAURANT_OWNER' && (
                            <Link to="/my-restaurant" className="nav-link">My Restaurant</Link>
                        )}
                        {isAuthenticated && (
                            <Link to="/orders" className="nav-link">My Orders</Link>
                        )}
                    </div>

                    {/* Right Side Actions */}
                    <div className="navbar-actions">
                        {/* Cart */}
                        <Link to="/cart" className="nav-icon-btn">
                            <ShoppingCart size={22} />
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </Link>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="user-menu">
                                <button className="user-btn">
                                    <User size={22} />
                                    <span className="user-name">{user?.name || user?.username}</span>
                                </button>
                                <div className="user-dropdown">
                                    <Link to="/profile" className="dropdown-item">
                                        <User size={18} />
                                        Profile
                                    </Link>
                                    <button onClick={handleLogout} className="dropdown-item">
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="mobile-menu">
                        <Link to="/" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                            Home
                        </Link>
                        <Link to="/restaurants" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                            Restaurants
                        </Link>
                        {isAuthenticated && user?.role === 'RESTAURANT_OWNER' && (
                            <Link to="/my-restaurant" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                                My Restaurant
                            </Link>
                        )}
                        {isAuthenticated && (
                            <Link to="/orders" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                                My Orders
                            </Link>
                        )}
                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                                    Profile
                                </Link>
                                <button onClick={handleLogout} className="mobile-link">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                                    Login
                                </Link>
                                <Link to="/register" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
