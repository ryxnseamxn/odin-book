import React, { useState, useEffect } from 'react';
import Unauthenticated from './Unauthenticated';
import { apiUrl } from '../config';


const PrivateRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${apiUrl}/`, {
          credentials: 'include',
        });

        if (res.status === 401) {
          throw new Error('Unauthorized');
        }

        const data = await res.json();
        setAuth(data.user);
      } catch (error) {
        console.error(error);
        setAuth(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return auth ? children : <Unauthenticated />;
};

export default PrivateRoute;
