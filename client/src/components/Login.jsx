import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Alert from './Alert'; 
import { apiUrl } from '../config';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [alert, setAlert] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (location.state && location.state.alert) {
            setAlert(location.state.alert);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                }),
                credentials: 'include'
            });

            if (response.ok) {
                setFormData({ username: '', password: '' });
                navigate('/');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Invalid username or password');
            }
        } catch (error) {
            console.error("Error submitting message: " + error);
            setError('Unable to connect to the server. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <div className="bg-yellow-400 p-4 shadow-md">
                <div className="flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                        </svg>
                    </div>
                    <h1 className="ml-3 text-xl font-bold text-white">Login</h1>
                </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                    {alert && (
                        <Alert 
                            message={alert.message} 
                            type={alert.type}
                            onClose={() => setAlert(null)}
                        />
                    )}
                    
                    <form onSubmit={submit}>
                        <h1 className="text-2xl font-bold mb-6 text-center">
                            Sign in to your account
                        </h1>
                        
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                                <p>{error}</p>
                            </div>
                        )}
                        
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700 mb-2">Username: </label>
                            <input 
                                type="text"
                                name="username"
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-400 focus:border-yellow-400"
                                required
                            />
                        </div>
                        
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-700 mb-2">Password: </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-400 focus:border-yellow-400"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                        
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <button 
                                    type="button" 
                                    onClick={() => navigate('/signup')} 
                                    className="font-medium text-yellow-500 hover:text-yellow-600"
                                >
                                    Create one now
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;