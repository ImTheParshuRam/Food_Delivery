import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="profile-page" style={{ paddingTop: '80px', minHeight: '80vh' }}>
            <div className="container">
                <div className="profile-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #eee', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>My Profile</h1>

                    <div className="profile-info">
                        <div className="info-group" style={{ marginBottom: '15px' }}>
                            <label style={{ fontWeight: 'bold', display: 'block', color: '#666' }}>Full Name</label>
                            <div style={{ fontSize: '1.2rem' }}>{user.fullName || user.name}</div>
                        </div>

                        <div className="info-group" style={{ marginBottom: '15px' }}>
                            <label style={{ fontWeight: 'bold', display: 'block', color: '#666' }}>Email/Username</label>
                            <div style={{ fontSize: '1.2rem' }}>{user.email || user.username}</div>
                        </div>

                        <div className="info-group" style={{ marginBottom: '15px' }}>
                            <label style={{ fontWeight: 'bold', display: 'block', color: '#666' }}>Phone</label>
                            <div style={{ fontSize: '1.2rem' }}>{user.phoneNumber || user.phone || 'Not provided'}</div>
                        </div>

                        <div className="info-group" style={{ marginBottom: '15px' }}>
                            <label style={{ fontWeight: 'bold', display: 'block', color: '#666' }}>Role</label>
                            <div style={{ display: 'inline-block', padding: '5px 10px', background: '#e3f2fd', color: '#1976d2', borderRadius: '15px', fontSize: '0.9rem' }}>
                                {user.userRole || user.role}
                            </div>
                        </div>

                        <div className="info-group" style={{ marginBottom: '15px' }}>
                            <label style={{ fontWeight: 'bold', display: 'block', color: '#666' }}>Address</label>
                            <div style={{ fontSize: '1rem' }}>
                                {user.address ? (
                                    <>
                                        {user.address.street}, {user.address.city}<br />
                                        {user.address.state} - {user.address.zipCode}
                                    </>
                                ) : 'Not provided'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
