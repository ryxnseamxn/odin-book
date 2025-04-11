import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

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
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
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
                // Pass success state when navigating to home page
                navigate('/', { 
                    state: { 
                        alert: { 
                            type: 'success', 
                            message: 'Sign up successful! Welcome aboard.' 
                        } 
                    } 
                });
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Sign up failed. Please try again.');
            }
        } catch (error) {
            console.error("Error submitting message: " + error);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={submit}>
                <h1 className="text-2xl font-bold mb-6">
                    Sign Up
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                
                <button 
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUp;