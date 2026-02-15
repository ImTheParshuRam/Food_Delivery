import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import MyRestaurant from './pages/MyRestaurant';
import './index.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <div className="app">
                        <Navbar />
                        <main>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/restaurants" element={<Restaurants />} />
                                <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/orders" element={<Orders />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/my-restaurant" element={<MyRestaurant />} />
                            </Routes>
                        </main>
                        <footer className="app-footer">
                            <div className="container">
                                <div className="footer-content">
                                    <div className="footer-section">
                                        <h3>FoodHub</h3>
                                        <p>Delicious food delivered to your doorstep</p>
                                    </div>
                                    <div className="footer-section">
                                        <h4>Quick Links</h4>
                                        <a href="/restaurants">Restaurants</a>
                                        <a href="/about">About Us</a>
                                        <a href="/contact">Contact</a>
                                    </div>
                                    <div className="footer-section">
                                        <h4>Support</h4>
                                        <a href="/help">Help Center</a>
                                        <a href="/terms">Terms of Service</a>
                                        <a href="/privacy">Privacy Policy</a>
                                    </div>
                                </div>
                                <div className="footer-bottom">
                                    <p>&copy; 2024 FoodHub. All rights reserved.</p>
                                </div>
                            </div>
                        </footer>
                    </div>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
