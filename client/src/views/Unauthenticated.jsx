import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthenticated = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div>
      <h1>You are not authenticated!</h1>
      <p>Please log in to access the application.</p>
      <button onClick={handleLoginRedirect}>Go to Login</button>
    </div>
  );
};

export default Unauthenticated;
