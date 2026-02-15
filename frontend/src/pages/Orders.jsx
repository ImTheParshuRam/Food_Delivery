import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import './Orders.css';

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            if (user?.id) {
                try {
                    const data = await orderService.getUserOrders(user.id);
                    setOrders(data);
                } catch (error) {
                    console.error("Failed to fetch orders", error);
                    setError("Failed to load your orders.");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    if (loading) return <div className="container" style={{ paddingTop: '80px' }}>Loading orders...</div>;

    if (error) return <div className="container" style={{ paddingTop: '80px' }}><div className="alert alert-error">{error}</div></div>;

    return (
        <div className="orders-page" style={{ paddingTop: '80px', minHeight: '80vh' }}>
            <div className="container">
                <h1>My Orders</h1>
                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <p>No orders found. Start ordering now!</p>
                        <a href="/restaurants" className="btn btn-primary">Browse Restaurants</a>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order.id} className="order-card" style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <h3 style={{ margin: 0 }}>Order #{order.id}</h3>
                                    <span className={`status-badge status-${order.orderStatus?.toLowerCase()}`} style={{ fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', background: '#eee' }}>
                                        {order.orderStatus}
                                    </span>
                                </div>
                                <p style={{ color: '#666', fontSize: '0.9rem' }}>Date: {new Date(order.orderTime).toLocaleDateString()}</p>
                                <div className="order-items" style={{ marginTop: '10px', marginBottom: '10px', paddingLeft: '20px', borderLeft: '3px solid #eee' }}>
                                    {order.orderItems?.map((item, idx) => (
                                        <div key={idx} style={{ marginBottom: '5px' }}>
                                            {item.quantity}x {item.name} - ${item.price}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                    <span style={{ fontWeight: 'bold' }}>Total:</span>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>${order.totalAmount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
