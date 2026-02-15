import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyRestaurant = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-page" style={{ paddingTop: '80px', minHeight: '80vh' }}>
            <div className="container">
                <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Restaurant Dashboard</h1>
                        <p className="text-muted">Welcome back, {user?.fullName}</p>
                    </div>
                    <button className="btn btn-primary">Add Menu Item</button>
                </header>

                <div className="dashboard-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    <div className="stat-card" style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                        <h3>Today's Orders</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>12</p>
                    </div>
                    <div className="stat-card" style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                        <h3>Total Earnings</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>$450.00</p>
                    </div>
                    <div className="stat-card" style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                        <h3>Pending Orders</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>3</p>
                    </div>
                </div>

                <div className="recent-orders">
                    <h2>Recent Orders</h2>
                    <div style={{ padding: '20px', background: '#fff', border: '1px solid #eee', borderRadius: '8px', marginTop: '15px' }}>
                        <p style={{ textAlign: 'center', color: '#888' }}>No recent orders to show.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyRestaurant;
