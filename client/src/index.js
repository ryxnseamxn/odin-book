import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './styles/index.css';
import App from './components/Home';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import SignUp from './components/SignUp';
import AddFriends from './components/AddFriends';
import SnapFriend from './components/SnapFriend';
import ViewSnap from './components/ViewSnap';
import SelectFriend from './components/SelectFriend';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    )
  },
  {
    path: "/add-friends",
    element: (
      <PrivateRoute>
        <AddFriends />
      </PrivateRoute>
    )
  },
  {
    path: "/snap-friend",
    element: (
      <PrivateRoute>
        <SnapFriend />
      </PrivateRoute>
    )
  },
  {
    path: "/select-friend",
    element: (
      <PrivateRoute>
        <SelectFriend />
      </PrivateRoute>
    )
  },
  {
    path: "/view-snaps",
    element: (
      <PrivateRoute>
        <ViewSnap />
      </PrivateRoute>
    )
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <SignUp />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
