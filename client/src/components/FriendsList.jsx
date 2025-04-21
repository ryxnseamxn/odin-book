import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../config';

const FriendsList = ({ searchQuery }) => {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/friends`, {
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
      console.error('Error fetching friends:', err);
      setError('Failed to load friends. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFriend = async (friendId) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) {
      return;
    }
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/remove-friend`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Failed to remove friend');
      }

      
      setFriends(prevFriends => prevFriends.filter(friend => friend.id !== friendId));
    } catch (err) {
      console.error('Error removing friend:', err);
      alert('Failed to remove friend. Please try again.');
    }
  };

  
  const filteredFriends = searchQuery
    ? friends.filter(friend => 
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : friends;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
        <button 
          onClick={fetchFriends}
          className="mt-2 px-4 py-2 bg-yellow-400 text-white rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (filteredFriends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 h-full">
        {searchQuery ? (
          <p>No friends match your search for "{searchQuery}"</p>
        ) : (
          <>
            <div className="w-20 h-20 mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
              </svg>
            </div>
            <p className="text-lg font-medium mb-2">No friends yet</p>
            <p className="mb-4">Add some friends to get started!</p>
            <button 
              onClick={() => navigate('/add-friends')}
              className="px-4 py-2 bg-yellow-400 text-white rounded-md"
            >
              Add Friends
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {filteredFriends.map((friend) => (
        <div 
          key={friend.id}
          className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="font-medium">{friend.username}</h3>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => { /* Implement chat functionality */ }}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </button>
            <button
              onClick={() => removeFriend(friend.id)}
              className="p-2 rounded-full bg-gray-100 hover:bg-red-100"
            >
              <svg className="w-5 h-5 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendsList;