import { Link } from 'react-router-dom';
import { Search, TrendingUp, Clock, Shield, Star, ChefHat } from 'lucide-react';
import './Home.css';

const Home = () => {
    const features = [
        {
            icon: <Clock size={32} />,
            title: 'Fast Delivery',
            description: 'Get your food delivered hot and fresh within 30 minutes',
        },
        {
            icon: <Shield size={32} />,
            title: 'Secure Payment',
            description: 'Multiple payment options with 100% secure transactions',
        },
        {
            icon: <Star size={32} />,
            title: 'Quality Food',
            description: 'Only the best restaurants and highest quality ingredients',
        },
        {
            icon: <ChefHat size={32} />,
            title: 'Expert Chefs',
            description: 'Food prepared by experienced and certified chefs',
        },
    ];

    const popularCategories = [
        { name: 'Pizza', emoji: '🍕', color: '#FF6B35' },
        { name: 'Burgers', emoji: '🍔', color: '#4ECDC4' },
        { name: 'Sushi', emoji: '🍣', color: '#FFD93D' },
        { name: 'Pasta', emoji: '🍝', color: '#6BCF7F' },
        { name: 'Desserts', emoji: '🍰', color: '#FF8C5F' },
        { name: 'Drinks', emoji: '🥤', color: '#44A08D' },
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1 className="hero-title fade-in">
                                Delicious Food
                                <span className="hero-highlight"> Delivered</span>
                                <br />
                                To Your Doorstep
                            </h1>
                            <p className="hero-description fade-in">
                                Order from your favorite restaurants and enjoy restaurant-quality meals at home.
                                Fast delivery, fresh ingredients, and amazing taste guaranteed!
                            </p>
                            <div className="hero-actions fade-in">
                                <Link to="/restaurants" className="btn btn-primary btn-lg">
                                    <Search size={20} />
                                    Explore Restaurants
                                </Link>
                                <Link to="/register" className="btn btn-outline btn-lg">
                                    Get Started
                                </Link>
                            </div>
                            <div className="hero-stats">
                                <div className="stat-item">
                                    <div className="stat-number">500+</div>
                                    <div className="stat-label">Restaurants</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">10K+</div>
                                    <div className="stat-label">Happy Customers</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">50K+</div>
                                    <div className="stat-label">Orders Delivered</div>
                                </div>
                            </div>
                        </div>
                        <div className="hero-image">
                            <div className="floating-card card-1">
                                <div className="food-emoji">🍕</div>
                                <div className="card-text">
                                    <div className="card-title">Pizza Margherita</div>
                                    <div className="card-price">$12.99</div>
                                </div>
                            </div>
                            <div className="floating-card card-2">
                                <div className="food-emoji">🍔</div>
                                <div className="card-text">
                                    <div className="card-title">Classic Burger</div>
                                    <div className="card-price">$8.99</div>
                                </div>
                            </div>
                            <div className="floating-card card-3">
                                <div className="food-emoji">🍣</div>
                                <div className="card-text">
                                    <div className="card-title">Sushi Platter</div>
                                    <div className="card-price">$24.99</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Categories */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Popular Categories</h2>
                        <p className="section-subtitle">Explore our wide variety of cuisines</p>
                    </div>
                    <div className="categories-grid">
                        {popularCategories.map((category, index) => (
                            <Link
                                key={index}
                                to="/restaurants"
                                className="category-card"
                                style={{ '--category-color': category.color }}
                            >
                                <div className="category-emoji">{category.emoji}</div>
                                <div className="category-name">{category.name}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section bg-light">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Why Choose FoodHub?</h2>
                        <p className="section-subtitle">We make food ordering simple and delightful</p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Order?</h2>
                        <p className="cta-description">
                            Join thousands of happy customers and experience the best food delivery service
                        </p>
                        <Link to="/restaurants" className="btn btn-primary btn-lg">
                            <TrendingUp size={20} />
                            Start Ordering Now
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
