import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../config';

const FriendsList = ({ searchQuery }) => {
  const [friends, setFriends] = useState([]);
  const [pendingSnaps, setPendingSnaps] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFriendsAndSnaps();
  }, []);

  const fetchFriendsAndSnaps = async () => {
    try {
      setIsLoading(true);
      
      // Fetch friends list
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

      const snapsResponse = await fetch(`${apiUrl}/pending-snaps`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (snapsResponse.ok) {
        const snapsData = await snapsResponse.json();
        
        const pendingSnapsMap = {};
        snapsData.forEach(snap => {
          pendingSnapsMap[snap.sender.id] = (pendingSnapsMap[snap.sender.id] || 0) + 1;
        });
        
        setPendingSnaps(pendingSnapsMap);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
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
      const response = await fetch(`${apiUrl}/remove-friend`, {
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

  const navigateToSnapFriend = (friend) => {
    navigate('/snap-friend', { state: { friend } });
  };
  
  const navigateToViewSnaps = (friend) => {
    navigate('/view-snaps', { state: { friendId: friend.id } });
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
          onClick={fetchFriendsAndSnaps}
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
              {pendingSnaps[friend.id] && (
                <p className="text-xs text-yellow-500 font-medium">
                  {pendingSnaps[friend.id]} new {pendingSnaps[friend.id] === 1 ? 'snap' : 'snaps'}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            {/* New Snap button */}
            <button
              onClick={() => navigateToSnapFriend(friend)}
              className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200"
              aria-label="Send snap"
            >
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
            
            {/* Chat/Snap button - changes based on pending snaps */}
            <button
              onClick={() => pendingSnaps[friend.id] ? navigateToViewSnaps(friend) : null}
              className={`p-2 rounded-full ${
                pendingSnaps[friend.id] 
                  ? 'bg-yellow-400 hover:bg-yellow-500' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              aria-label={pendingSnaps[friend.id] ? "View pending snaps" : "Chat"}
            >
              {pendingSnaps[friend.id] ? (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.12.23-2.18.65-3.15C5.53 8.95 6.15 9 6.8 9c.96 0 1.73-.27 2.3-.82.37-.36.65-.85.82-1.38.17-.53.17-1.08.17-1.6 0-.35.12-.65.35-.83.23-.19.54-.29.85-.29.43 0 .79.18 1.04.53.25.35.33.78.33 1.29 0 .52 0 1.07.17 1.6.17.53.44 1.02.82 1.38.57.55 1.34.82 2.3.82.65 0 1.27-.05 1.87-.15.42.97.65 2.03.65 3.15 0 4.41-3.59 8-8 8z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              )}
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