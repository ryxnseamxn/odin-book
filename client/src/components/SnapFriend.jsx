import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiUrl } from '../config';

const SnapFriend = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { friend } = location.state || {};
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef(null);
  const captionInputRef = useRef(null);

  useEffect(() => {
    if (!friend) {
      navigate('/friends');
    }
  }, [friend, navigate]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      
      // Clean up previous URL
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      };
    }
  };

  const handleCapture = () => {
    fileInputRef.current.click();
  };

  const handleSendSnap = async () => {
    if (!image) {
      setError('Please select an image to send');
      return;
    }

    try {
      setIsSending(true);
      setError(null);

      const formData = new FormData();
      formData.append('snap', image); 
      formData.append('recipientId', friend.id);
      
      // Add caption if it exists
      if (caption.trim()) {
        formData.append('caption', caption.trim());
      }

      const response = await fetch(`${apiUrl}/snap-friend`, { 
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Failed to send snap');
      }

      navigate('/', { state: { snapSent: true } });
    } catch (err) {
      console.error('Error sending snap:', err);
      setError('Failed to send snap. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // If no friend in state, return early
  if (!friend) {
    return null;
  }

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
            Snap to {friend.username}
          </h2>
          <div className="w-6"></div> {/* Empty div for balance */}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Preview area */}
          {previewUrl ? (
            <div className="relative bg-black aspect-square flex items-center justify-center">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-full max-w-full" 
              />
              
              {/* Caption overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <input
                  type="text"
                  ref={captionInputRef}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption..."
                  className="w-full bg-transparent text-white placeholder-gray-300 border-b border-gray-400 focus:border-yellow-400 outline-none px-2 py-1"
                  maxLength={100}
                />
              </div>
              
              {/* Button to remove selected image */}
              <button 
                onClick={() => {
                  setImage(null);
                  setPreviewUrl(null);
                  setCaption('');
                }}
                className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                aria-label="Remove image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div 
              onClick={handleCapture}
              className="h-72 bg-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <div className="w-20 h-20 mb-4 rounded-full bg-yellow-400 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Tap to take or select a photo</p>
              <p className="text-gray-400 text-sm mt-1">Share a moment with {friend.username}</p>
            </div>
          )}

          {/* Hidden file input */}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          {/* Error display */}
          {error && (
            <div className="m-4 p-3 bg-red-50 text-red-600 rounded-lg text-center border border-red-200">
              <p>{error}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="p-4">
            <button
              onClick={handleSendSnap}
              disabled={!image || isSending}
              className={`w-full py-3 rounded-full font-medium transition-all ${
                !image || isSending 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-yellow-400 text-white hover:bg-yellow-500 shadow-md hover:shadow-lg'
              }`}
            >
              {isSending ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Send Snap'
              )}
            </button>
            
            {/* Additional context text */}
            {previewUrl && (
              <p className="text-center text-gray-500 text-sm mt-3">
                Snap will disappear after 5 seconds
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnapFriend;