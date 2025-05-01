import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FriendsList from './FriendsList';
import { apiUrl } from '../config';

const Home = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${apiUrl}/user`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user data:', err);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${apiUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSnapClick = () => {
    navigate('/select-friend'); // Navigate to the SelectFriend component
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-pulse">
          <div className="w-24 h-24 bg-yellow-400 rounded-full mb-4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-yellow-400 p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
              </svg>
            </div>
            <h1 className="ml-3 text-xl font-bold text-white">My Friends</h1>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-white text-red-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="p-4 bg-white shadow-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Friends List Component */}
      <div className="flex-1 overflow-y-auto">
        <FriendsList searchQuery={searchQuery} />
      </div>
      
      {/* Simplified Bottom Navigation - Only Snap Button */}
      <div className="bg-white p-4 shadow-t-sm border-t border-gray-200 flex justify-center">
        <button 
          onClick={handleSnapClick}
          className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg"
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Home;