import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../config';

const SelectFriend = () => {
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      setIsLoading(true);
      
      const friendsResponse = await fetch(`${apiUrl}/friends`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!friendsResponse.ok) {
        if (friendsResponse.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch friends');
      }

      const friendsData = await friendsResponse.json();
      setFriends(friendsData);
    } catch (err) {
      console.error('Error fetching friends:', err);
      setError('Failed to load friends. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFriend = (friend) => {
    navigate('/snap-friend', { state: { friend } });
  };
  
  const filteredFriends = searchQuery
    ? friends.filter(friend => 
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : friends;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Top header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto p-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Go back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-center text-gray-800">
            Select a Friend
          </h2>
          <div className="w-6"></div> {/* Empty div for balance */}
        </div>
      </div>

      {/* Search box */}
      <div className="p-4 max-w-md w-full mx-auto">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search friends..."
            className="w-full p-3 pl-10 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <div className="absolute left-3 top-3 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-md w-full mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            <p>{error}</p>
            <button 
              onClick={fetchFriends}
              className="mt-2 px-4 py-2 bg-yellow-400 text-white rounded-md"
            >
              Try Again
            </button>
          </div>
        ) : filteredFriends.length === 0 ? (
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
        ) : (
          <div className="p-4 space-y-3">
            {filteredFriends.map((friend) => (
              <div 
                key={friend.id}
                onClick={() => handleSelectFriend(friend)}
                className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between cursor-pointer hover:bg-yellow-50 transition-colors"
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
                
                <div className="text-yellow-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectFriend;