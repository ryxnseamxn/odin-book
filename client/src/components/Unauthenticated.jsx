import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Unauthenticated = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 space-y-6">
        <div className="text-center">
          <svg 
            className="mx-auto h-16 w-16 text-blue-500" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zm-4 7h8m-8 0a6 6 0 01-6-6v-3a6 6 0 1112 0v3a6 6 0 01-6 6z" />
          </svg>
          
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
            Authentication Required
          </h2>
          
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to access the application content
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleLoginRedirect}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in
          </button>
          
          <div className="text-center">
            <span className="text-sm text-gray-500">Don't have an account?</span>
          </div>
          
          <button
            onClick={handleSignupRedirect}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create an account
          </button>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-8">
          <p>© 2025 Your Company. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Unauthenticated;