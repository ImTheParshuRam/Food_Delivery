import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, MapPin, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        phone: '',
        role: 'CUSTOMER',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
        },
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [addressField]: value,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card register-card">
                    <div className="auth-header">
                        <div className="auth-icon">
                            <UserPlus size={32} />
                        </div>
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Join FoodHub and start ordering today</p>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    <User size={16} />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <Mail size={16} />
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-input"
                                    placeholder="johndoe"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    <Mail size={16} />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <Phone size={16} />
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-input"
                                    placeholder="+1 234 567 8900"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Lock size={16} />
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <User size={16} />
                                I am a
                            </label>
                            <select
                                name="role"
                                className="form-select"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="CUSTOMER">Customer</option>
                                <option value="RESTAURANT_OWNER">Restaurant Owner</option>
                                <option value="DELIVERY_AGENT">Delivery Agent</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <MapPin size={16} />
                                Address
                            </label>
                            <input
                                type="text"
                                name="address.street"
                                className="form-input"
                                placeholder="Street Address"
                                value={formData.address.street}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="address.city"
                                    className="form-input"
                                    placeholder="City"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    name="address.state"
                                    className="form-input"
                                    placeholder="State"
                                    value={formData.address.state}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    name="address.zipCode"
                                    className="form-input"
                                    placeholder="ZIP Code"
                                    value={formData.address.zipCode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="auth-link">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="auth-visual">
                    <div className="visual-content">
                        <h2>Start Your Food Journey</h2>
                        <p>Create an account and unlock access to hundreds of restaurants</p>
                        <div className="visual-features">
                            <div className="visual-feature">✓ Easy Registration</div>
                            <div className="visual-feature">✓ Secure Account</div>
                            <div className="visual-feature">✓ Exclusive Offers</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
