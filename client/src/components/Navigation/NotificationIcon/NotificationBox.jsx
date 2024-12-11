import { useEffect, useState, useContext } from "react";
import { IoMdNotifications } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import './NotificationBox.css';
import axios from "axios";
import { AuthContext } from '../../../context/authContext'; // Adjust the path as necessary

const NotificationBox = () => {
  const { notificationsEnabled } = useContext(AuthContext);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  
  const token = localStorage.getItem('token');

  const getNotification = async () => {
    if (!token) {
      setErrorMessage('No token found, please log in.');
      return;
    }

    try {
      const res = await axios.get('http://localhost:4000/api/user/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data && res.data.notifications) {
        setNotificationData(res.data.notifications);
      } else {
        setNotificationData([]);
      }
    } catch (error) {
      setErrorMessage('Error fetching notifications');
    }
  };

  useEffect(() => {
    if (notificationsEnabled) {
      getNotification();
    } else {
      setNotificationData([]);
    }
  }, [notificationsEnabled]);

  const handleShowNotification = () => {
    setShowNotification(!showNotification);
  };

  return (
    <div className="MainNotification">
      <div className="notification_icon">
        <IoMdNotifications color={"black"} size={28} onClick={handleShowNotification} />
      </div>

      {showNotification && (
        <section className="Notification">
          <div id="Notification-Head">
            <div className="mb-2 w-100 d-flex flex-row justify-content-end py-2" style={{ cursor: 'pointer' }}>
              <RxCross2 size={20} onClick={handleShowNotification} />
            </div>
          </div>

          <div id="Notification-body">
            {errorMessage ? (
              <p>{errorMessage}</p>
            ) : notificationData.length > 0 ? (
              notificationData.map((notification, index) => (
                <div key={index} style={{ boxShadow: '1px 1px 1px 1px black', padding: '10px', marginBottom: '10px' }}>
                  <p>{notification.message}</p>
                </div>
              ))
            ) : (
              <p>No notifications available</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default NotificationBox;
