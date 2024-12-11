import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:4000/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          setUser(response.data);
          fetchNotificationPreference(token); // Fetch notification preference on user load
        })
        .catch(() => setUser(null)); // If the token is invalid, log out
    }
  }, []);

  const fetchNotificationPreference = async (token) => {
    try {
      const response = await axios.get('http://localhost:4000/api/user/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotificationsEnabled(response.data.notificationsEnabled);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    navigate('/login'); // Redirect to login page
  };

  const toggleNotifications = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:4000/api/user/notifications/toggle',
        {}, // Empty body for the POST request
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotificationsEnabled(response.data.notificationsEnabled);
    } catch (error) {
      console.error('Error toggling notifications:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, handleLogout, notificationsEnabled, toggleNotifications }}>
      {children}
    </AuthContext.Provider>
  );
};
