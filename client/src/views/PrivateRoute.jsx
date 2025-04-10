// src/components/PrivateRoute.jsx
import React, { useState, useEffect } from 'react';
import Unauthenticated from '../views/Unauthenticated';

const PrivateRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/`, {
      credentials: 'include'
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then((data) => {
        setAuth(data.user);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setAuth(null);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return auth ? children : <Unauthenticated />;
};

export default PrivateRoute;
