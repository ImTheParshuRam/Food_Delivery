import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { restaurantService, orderService } from '../services/api';
import { Link } from 'react-router-dom';

const MyRestaurant = () => {
    const { user } = useAuth();
    const [restaurant, setRestaurant] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.username) return;

            try {
                // 1. Fetch Restaurant by Owner Username
                const restResponse = await restaurantService.getRestaurantByOwner(user.username);

                if (restResponse.responseCode === 200 && restResponse.restaurantDto) {
                    const restData = restResponse.restaurantDto;
                    setRestaurant(restData);

                    // 2. Fetch Orders for this Restaurant
                    try {
                        const ordersData = await orderService.getRestaurantOrders(restData.id);
                        setOrders(ordersData);
                    } catch (ordErr) {
                        console.error("Failed to fetch restaurant orders", ordErr);
                    }
                } else {
                    setError("You don't have a restaurant registered yet.");
                }
            } catch (err) {
                console.error("Error fetching restaurant:", err);
                setError("Failed to load restaurant data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    if (loading) return <div className="container" style={{ paddingTop: '80px' }}>Loading dashboard...</div>;

    if (error) {
        return (
            <div className="container" style={{ paddingTop: '80px' }}>
                <div className="alert alert-error">{error}</div>
                <button className="btn btn-primary" style={{ marginTop: '20px' }}>Register a Restaurant</button>
            </div>
        );
    }

    if (!restaurant) return <div className="container" style={{ paddingTop: '80px' }}>No restaurant found.</div>;

    // Calculate stats
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.orderStatus === 'PENDING').length;
    const totalEarnings = orders
        .filter(o => o.orderStatus === 'COMPLETED')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return (
        <div className="dashboard-page" style={{ paddingTop: '80px', minHeight: '80vh' }}>
            <div className="container">
                <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>{restaurant.name} Dashboard</h1>
                        <p className="text-muted">Managed by {user?.fullName}</p>
                    </div>
                    <button className="btn btn-primary">Add Menu Item</button>
                </header>

                <div className="dashboard-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    <div className="stat-card" style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                        <h3>Total Orders</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{totalOrders}</p>
                    </div>
                    <div className="stat-card" style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                        <h3>Total Earnings</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>${totalEarnings.toFixed(2)}</p>
                    </div>
                    <div className="stat-card" style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                        <h3>Pending Orders</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{pendingOrders}</p>
                    </div>
                </div>

                <div className="recent-orders">
                    <h2>Incoming Orders</h2>
                    {orders.length === 0 ? (
                        <div style={{ padding: '20px', background: '#fff', border: '1px solid #eee', borderRadius: '8px', marginTop: '15px' }}>
                            <p style={{ textAlign: 'center', color: '#888' }}>No orders yet.</p>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map(order => (
                                <div key={order.id} className="order-card" style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4>Order #{order.id}</h4>
                                        <p>Status: <span style={{ fontWeight: 'bold', color: order.orderStatus === 'PENDING' ? 'orange' : 'green' }}>{order.orderStatus}</span></p>
                                        <p>Items: {order.orderItems?.length || 0}</p>
                                    </div>
                                    <div className="order-actions">
                                        <button className="btn btn-sm btn-outline">View Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyRestaurant;
