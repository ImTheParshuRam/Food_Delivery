import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Clock, TrendingUp } from 'lucide-react';
import { restaurantService } from '../services/api';
import './Restaurants.css';

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const data = await restaurantService.getAllRestaurants();
            setRestaurants(data);
        } catch (err) {
            setError('Failed to load restaurants. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredRestaurants = restaurants.filter((restaurant) =>
        restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p className="mt-md">Loading restaurants...</p>
            </div>
        );
    }

    return (
        <div className="restaurants-page">
            {/* Header Section */}
            <section className="restaurants-header">
                <div className="container">
                    <h1 className="page-title">Discover Restaurants</h1>
                    <p className="page-subtitle">
                        Explore our curated selection of the finest restaurants in your area
                    </p>

                    {/* Search Bar */}
                    <div className="search-container">
                        <div className="search-box">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search restaurants or cuisines..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Restaurants Grid */}
            <section className="section">
                <div className="container">
                    {error && (
                        <div className="error-message">
                            <p>{error}</p>
                            <button onClick={fetchRestaurants} className="btn btn-primary">
                                Try Again
                            </button>
                        </div>
                    )}

                    {!error && filteredRestaurants.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">🔍</div>
                            <h3>No restaurants found</h3>
                            <p>Try adjusting your search or check back later</p>
                        </div>
                    )}

                    {!error && filteredRestaurants.length > 0 && (
                        <>
                            <div className="results-count">
                                <TrendingUp size={20} />
                                <span>{filteredRestaurants.length} restaurants available</span>
                            </div>

                            <div className="restaurants-grid">
                                {filteredRestaurants.map((restaurant) => (
                                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

const RestaurantCard = ({ restaurant }) => {
    const rating = restaurant.rating || 4.5;
    const deliveryTime = restaurant.deliveryTime || '30-40';

    return (
        <Link to={`/restaurant/${restaurant.id}`} className="restaurant-card">
            <div className="restaurant-image">
                <img
                    src={restaurant.imageUrl || `https://source.unsplash.com/400x300/?restaurant,food&sig=${restaurant.id}`}
                    alt={restaurant.name}
                />
                <div className="restaurant-badge">
                    <Star size={14} fill="currentColor" />
                    <span>{rating.toFixed(1)}</span>
                </div>
            </div>

            <div className="restaurant-info">
                <h3 className="restaurant-name">{restaurant.name}</h3>

                <div className="restaurant-meta">
                    <div className="meta-item">
                        <MapPin size={16} />
                        <span>{restaurant.address?.city || 'City'}</span>
                    </div>
                    <div className="meta-item">
                        <Clock size={16} />
                        <span>{deliveryTime} min</span>
                    </div>
                </div>

                {restaurant.cuisine && (
                    <div className="restaurant-cuisine">
                        {restaurant.cuisine}
                    </div>
                )}

                <div className="restaurant-footer">
                    <span className="view-menu-btn">View Menu →</span>
                </div>
            </div>
        </Link>
    );
};

export default Restaurants;
