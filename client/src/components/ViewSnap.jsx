import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiUrl } from '../config';

const ViewSnap = () => {
  const [snaps, setSnaps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const location = useLocation();
  const navigate = useNavigate();
  const friendId = location.state?.friendId;

  useEffect(() => {
    if (!friendId) {
      setError('No friend specified');
      setIsLoading(false);
      return;
    }
    fetchPendingSnaps();
  }, [friendId]);

  const fetchPendingSnaps = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/pending-snaps?friendId=${friendId}`, {
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
        throw new Error('Failed to fetch snaps');
      }
      const data = await response.json();
      // Make sure we're only showing snaps from this friend that haven't been opened
      const validSnaps = data.filter(snap => 
        snap.sender.id === friendId && 
        !snap.isOpened &&
        snap.imageUrl // Make sure we have a valid URL
      );
      setSnaps(validSnaps);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (snaps.length > 0 && currentIndex < snaps.length) {
      markSnapAsViewed(snaps[currentIndex].id);
      setTimeLeft(5);
      
      const timerInterval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerInterval);
            proceedToNextSnap();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => clearInterval(timerInterval);
    } else if (snaps.length > 0 && currentIndex >= snaps.length) {
      navigate('/');
    }
  }, [currentIndex, snaps]);

  const markSnapAsViewed = async (snapId) => {
    try {
      await fetch(`${apiUrl}/mark-snap-viewed`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ snapId }),
      });
    } catch (err) {
      console.error('Failed to mark snap as viewed:', err);
    }
  };

  const proceedToNextSnap = () => {
    if (currentIndex < snaps.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setImgError(false);
    } else {
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white">
        <p className="text-xl mb-4">{error}</p>
        <button
          onClick={fetchPendingSnaps}
          className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-500 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (snaps.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white">
        <p className="text-xl mb-4">No snaps to view from this friend.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-500 transition-colors"
        >
          Back to Friends
        </button>
      </div>
    );
  }

  const currentSnap = snaps[currentIndex];

  return (
    <div className="fixed inset-0 bg-black">
      {/* Top header with username and close button */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold mr-2">
            {currentSnap.sender.username.charAt(0).toUpperCase()}
          </div>
          <div className="text-white text-lg font-semibold">{currentSnap.sender.username}</div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/');
          }}
          className="text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-gray-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      {/* Progress bar at the top */}
      <div className="absolute top-16 left-4 right-4 flex space-x-1 z-10">
        {snaps.map((_, index) => (
          <div 
            key={index} 
            className={`h-1 rounded-full flex-grow ${
              index < currentIndex ? 'bg-white' : 
              index === currentIndex ? 'bg-yellow-400' : 
              'bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Timer circle */}
      <div className="absolute top-4 right-16 z-10">
        <div className="relative w-10 h-10">
          <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
            <circle 
              cx="18" cy="18" r="16" 
              fill="none" 
              stroke="#4b5563" 
              strokeWidth="2" 
            />
            <circle 
              cx="18" cy="18" r="16" 
              fill="none" 
              stroke="#eab308" 
              strokeWidth="2" 
              strokeDasharray="100" 
              strokeDashoffset={100 - ((timeLeft / 5) * 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white font-bold">
            {timeLeft}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className="flex items-center justify-center h-full w-full"
        onClick={proceedToNextSnap}
      >
        {imgError ? (
          <div className="text-white text-center">
            <p className="text-xl mb-2">Image couldn't be loaded</p>
            <p className="text-gray-400">Tap to continue</p>
          </div>
        ) : (
          <img
            src={currentSnap.imageUrl}
            alt="Snap"
            className="max-w-full max-h-full object-contain"
            onError={() => setImgError(true)}
          />
        )}

        {/* Caption */}
        {currentSnap.caption && (
          <div className="absolute bottom-8 left-0 right-0 text-center px-4">
            <p className="text-white text-xl font-medium bg-black bg-opacity-60 p-4 mx-auto rounded-lg max-w-lg">
              {currentSnap.caption}
            </p>
          </div>
        )}
      </div>

      {/* Snap index indicator */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
        {currentIndex + 1} of {snaps.length}
      </div>
    </div>
  );
};

export default ViewSnap;