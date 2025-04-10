import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    };

    const submit = async (e) => {
        e.preventDefault(); 
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/login`,{
                method: "POST",
                withCredentials: true,
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
                navigate('/')
            }

        } catch (error) {
            console.error("Error submitting message: " + error);
        }
    };

    return (
        <div>
            <form onSubmit={submit}>
                <h1>
                    Login
                </h1>
                <label htmlFor="username">Username: </label>
                <input 
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <label htmlFor="password">Password: </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    )
};

export default Login; 