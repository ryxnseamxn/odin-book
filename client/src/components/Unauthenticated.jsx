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
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-yellow-400 p-4 shadow-md">
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
            </svg>
          </div>
          <h1 className="ml-3 text-xl font-bold text-white">Authentication Required</h1>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">
              Authentication Required
            </h2>
            
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to access the application content
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={handleLoginRedirect}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign in
            </button>
            
            <div className="text-center">
              <span className="text-sm text-gray-600">Don't have an account?</span>
            </div>
            
            <button
              onClick={handleSignupRedirect}
              className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create an account
            </button>
          </div>
          
          <div className="text-center text-xs text-gray-500 mt-8">
            <p>© 2025 Your Company. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthenticated;