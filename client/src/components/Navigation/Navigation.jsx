import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import NotificationBox from './NotificationIcon/NotificationBox';
import '../Navigation/Navigation.css'

const Navigation = () => {
  const [userName, setUserName] = useState('');



  // Fetch user profile when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

      try {
        const res = await axios.get('http://localhost:4000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data)
        setUserName(res.data.name); // Assuming the user's name is returned in res.data.name
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data?.message || error.message);
      }
    };

    fetchUserProfile();
  }, []);



  return (
    <nav className=" bg-white text-white" style={{ width: '100%' }}>
      <div className="navbar-container mx-auto py-2" style={{ width: '96%' }} >




        <div className="navbar-links">

          <div className='d-flex flex-row align-items-center'>
          <span className="navbar-user p-2">{userName}</span>

          <Link to={'/user/profile'}>
            <div id='profile' >{userName.slice(0, 1)}</div>
          </Link>
          </div>

          <div >
            <NotificationBox />
          </div>

        </div>



      </div>
    </nav>
  );
};

export default Navigation;
