import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import './Orders.css'; // Will create CSS later or use inline/existing

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (user?.id) {
                try {
                    const data = await orderService.getUserOrders(user.id);
                    setOrders(data);
                } catch (error) {
                    console.error("Failed to fetch orders", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchOrders();
    }, [user]);

    if (loading) return <div className="container" style={{ paddingTop: '80px' }}>Loading orders...</div>;

    return (
        <div className="orders-page" style={{ paddingTop: '80px', minHeight: '80vh' }}>
            <div className="container">
                <h1>My Orders</h1>
                {orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order.id} className="order-card" style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
                                <h3>Order #{order.id}</h3>
                                <p>Status: {order.status}</p>
                                <p>Total: ${order.totalAmount}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
