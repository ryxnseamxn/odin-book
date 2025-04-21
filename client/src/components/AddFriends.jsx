import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../config';


const AddFriends = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Search for users
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${apiUrl}/search-users?query=${searchQuery}`, {
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
        throw new Error('Failed to search users');
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Failed to search users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Send friend request
  const sendFriendRequest = async (userId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/add-friend`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId: userId }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add friend');
      }

      // Update UI to reflect the change
      setSuccessMessage('Friend added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Update the search results to show the user is now a friend
      setSearchResults(prevResults =>
        prevResults.map(user =>
          user.id === userId ? { ...user, isFriend: true } : user
        )
      );
    } catch (err) {
      console.error('Error adding friend:', err);
      setError(err.message || 'Failed to add friend. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-yellow-400 p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
            >
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 className="ml-3 text-xl font-bold text-white">Add Friends</h1>
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="p-4 bg-white shadow-sm">
        <form onSubmit={handleSubmit} className="flex">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full rounded-l-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Search by username..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <button 
            type="submit" 
            className="bg-yellow-400 text-white px-4 rounded-r-full focus:outline-none hover:bg-yellow-500"
          >
            Search
          </button>
        </form>
      </div>
      
      {/* Status Messages */}
      {error && (
        <div className="m-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="m-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      )}
      
      {/* Search Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {searchResults.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map((user) => (
              <div 
                key={user.id}
                className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">{user.username}</h3>
                  </div>
                </div>
                
                {user.isFriend ? (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    Friends
                  </span>
                ) : user.isCurrentUser ? (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    You
                  </span>
                ) : (
                  <button
                    onClick={() => sendFriendRequest(user.id)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded-full text-sm hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  >
                    Add Friend
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : searchQuery && !isLoading ? (
          <div className="text-center p-8 text-gray-500">
            No users found matching "{searchQuery}"
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AddFriends;