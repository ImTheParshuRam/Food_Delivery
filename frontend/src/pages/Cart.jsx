import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { orderService, paymentService } from '../services/api';
import './Cart.css';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            // Create order
            const orderData = {
                userId: user.id,
                orderItems: cartItems.map(item => ({
                    foodItemId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
                address: user.address,
            };

            const order = await orderService.createOrder(orderData);

            // Process payment
            const paymentData = {
                orderId: order.id,
                amount: getCartTotal(),
                creditCardInfo: {
                    cardNumber: '4111111111111111', // Demo card
                    cvv: '123',
                    expiryDate: '12/25',
                },
            };

            await paymentService.processPayment(paymentData);

            // Clear cart and show success
            clearCart();
            setOrderPlaced(true);
            setTimeout(() => {
                navigate('/orders');
            }, 3000);
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="order-success">
                        <div className="success-icon">✓</div>
                        <h2>Order Placed Successfully!</h2>
                        <p>Your delicious food is on its way</p>
                        <Link to="/orders" className="btn btn-primary">
                            View Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <ShoppingBag size={80} className="empty-icon" />
                        <h2>Your cart is empty</h2>
                        <p>Add some delicious items to get started</p>
                        <Link to="/restaurants" className="btn btn-primary btn-lg">
                            Browse Restaurants
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const subtotal = getCartTotal();
    const deliveryFee = 5.99;
    const tax = subtotal * 0.1;
    const total = subtotal + deliveryFee + tax;

    return (
        <div className="cart-page">
            <div className="container">
                <h1 className="page-title">Shopping Cart</h1>

                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items-section">
                        <div className="cart-header">
                            <h2>Items ({cartItems.length})</h2>
                            <button onClick={clearCart} className="btn btn-ghost btn-sm">
                                Clear Cart
                            </button>
                        </div>

                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-image">
                                        <img
                                            src={item.imageUrl || `https://source.unsplash.com/150x150/?${item.name},food&sig=${item.id}`}
                                            alt={item.name}
                                        />
                                    </div>

                                    <div className="item-details">
                                        <h3 className="item-name">{item.name}</h3>
                                        <p className="item-restaurant">{item.restaurant?.name}</p>
                                        <div className="item-price">${item.price.toFixed(2)}</div>
                                    </div>

                                    <div className="item-actions">
                                        <div className="quantity-controls">
                                            <button
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="qty-display">{item.quantity}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary">
                        <h2 className="summary-title">Order Summary</h2>

                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Delivery Fee</span>
                                <span>${deliveryFee.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax (10%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-row summary-total">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary btn-lg checkout-btn"
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    Proceed to Checkout
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>

                        {!isAuthenticated && (
                            <p className="login-notice">
                                Please <Link to="/login">login</Link> to complete your order
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
