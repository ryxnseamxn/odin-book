import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FriendsList = ({ searchQuery = '' }) => {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch friends data
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/friends`, {
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
          throw new Error('Failed to fetch friends');
        }

        const data = await response.json();
        setFriends(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [navigate]);

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend => 
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate random color for avatar - Snapchat style
  const getRandomColor = (username) => {
    const colors = [
      'bg-yellow-400', 'bg-red-400', 'bg-pink-400', 
      'bg-purple-400', 'bg-blue-400', 'bg-green-400'
    ];
    
    // Use the username to deterministically pick a color
    const charSum = username.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  // Get initials for avatar
  const getInitials = (username) => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="animate-pulse flex items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="w-14 h-14 rounded-full bg-gray-200"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">
          <p>{error}</p>
          <button 
            className="mt-2 px-4 py-2 bg-yellow-400 rounded-full text-white font-semibold"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : filteredFriends.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          {searchQuery ? "No friends match your search" : "You don't have any friends yet"}
          <div className="mt-4">
            <button className="px-4 py-2 bg-yellow-400 rounded-full text-white font-semibold">
              Add Friends
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFriends.map((friend) => (
            <div 
              key={friend.id} 
              className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50"
            >
              <div className={`w-14 h-14 rounded-full ${getRandomColor(friend.username)} flex items-center justify-center text-white text-xl font-bold`}>
                {getInitials(friend.username)}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-bold text-gray-800">{friend.username}</h3>
                <p className="text-sm text-gray-500">Tap to chat</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsList;