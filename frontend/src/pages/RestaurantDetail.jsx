import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Clock, Star, Plus, Minus, ShoppingCart } from 'lucide-react';
import { restaurantService, foodItemService } from '../services/api';
import { useCart } from '../context/CartContext';
import './RestaurantDetail.css';

const RestaurantDetail = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchRestaurantDetails();
    }, [id]);

    const fetchRestaurantDetails = async () => {
        try {
            setLoading(true);
            const [restaurantData, foodItemsData] = await Promise.all([
                restaurantService.getRestaurantById(id),
                foodItemService.getFoodItemsByRestaurant(id),
            ]);
            setRestaurant(restaurantData);
            setFoodItems(foodItemsData);
        } catch (err) {
            setError('Failed to load restaurant details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (item) => {
        const success = addToCart(item, restaurant);
        if (success) {
            // Show success feedback
            const btn = document.getElementById(`add-btn-${item.id}`);
            if (btn) {
                btn.textContent = 'Added!';
                setTimeout(() => {
                    btn.innerHTML = '<svg>...</svg> Add to Cart';
                }, 1500);
            }
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p className="mt-md">Loading restaurant...</p>
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="error-container">
                <h2>Restaurant not found</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="restaurant-detail-page">
            {/* Restaurant Header */}
            <div className="restaurant-header-detail">
                <div className="restaurant-cover">
                    <img
                        src={restaurant.imageUrl || `https://source.unsplash.com/1200x400/?restaurant&sig=${id}`}
                        alt={restaurant.name}
                    />
                    <div className="cover-overlay"></div>
                </div>

                <div className="container">
                    <div className="restaurant-header-content">
                        <div>
                            <h1 className="restaurant-title">{restaurant.name}</h1>
                            <div className="restaurant-details">
                                <div className="detail-item">
                                    <Star size={18} fill="currentColor" />
                                    <span>{restaurant.rating || '4.5'} Rating</span>
                                </div>
                                <div className="detail-item">
                                    <MapPin size={18} />
                                    <span>{restaurant.address?.street}, {restaurant.address?.city}</span>
                                </div>
                                <div className="detail-item">
                                    <Clock size={18} />
                                    <span>{restaurant.deliveryTime || '30-40'} mins</span>
                                </div>
                            </div>
                            {restaurant.description && (
                                <p className="restaurant-description">{restaurant.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title">Our Menu</h2>

                    {foodItems.length === 0 ? (
                        <div className="empty-menu">
                            <p>No menu items available at the moment</p>
                        </div>
                    ) : (
                        <div className="menu-grid">
                            {foodItems.map((item) => (
                                <FoodItemCard
                                    key={item.id}
                                    item={item}
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

const FoodItemCard = ({ item, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="food-item-card">
            <div className="food-item-image">
                <img
                    src={item.imageUrl || `https://source.unsplash.com/300x200/?${item.name},food&sig=${item.id}`}
                    alt={item.name}
                />
                {item.isVegetarian && (
                    <span className="veg-badge">🌱 Veg</span>
                )}
            </div>

            <div className="food-item-content">
                <h3 className="food-item-name">{item.name}</h3>
                {item.description && (
                    <p className="food-item-description">{item.description}</p>
                )}

                <div className="food-item-footer">
                    <div className="food-item-price">${item.price?.toFixed(2)}</div>

                    <div className="quantity-controls">
                        <button
                            className="qty-btn"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                            <Minus size={16} />
                        </button>
                        <span className="qty-display">{quantity}</span>
                        <button
                            className="qty-btn"
                            onClick={() => setQuantity(quantity + 1)}
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <button
                        id={`add-btn-${item.id}`}
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                            for (let i = 0; i < quantity; i++) {
                                onAddToCart(item);
                            }
                            setQuantity(1);
                        }}
                    >
                        <ShoppingCart size={16} />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetail;
