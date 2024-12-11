import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../context/authContext'; // Adjust the path as necessary
import { Form } from 'react-bootstrap';
import '../Notification/NotificationToggle.css'; // Custom CSS file for styling

const NotificationToggle = () => {
  const { notificationsEnabled, toggleNotifications } = useContext(AuthContext);
  const [message, setMessage] = useState('');

  const handleToggle = async () => {
    try {
      await toggleNotifications();
      setMessage(notificationsEnabled ? 'Notifications are turned off' : 'Notifications are turned on');
    } catch (error) {
      setMessage('Error toggling notifications');
    }
  };

  return (
    <div className="notification-toggle-container">
      <h2 className="notification-title">Notification Settings</h2>
      <Form.Check 
        type="switch"
        id="notification-switch"
        label={notificationsEnabled ? 'Notifications ON' : 'Notifications OFF'}
        checked={notificationsEnabled}
        onChange={handleToggle}
        className="notification-switch"
      />
      {message && <p className="notification-message">{message}</p>}
    </div>
  );
};

export default NotificationToggle;
