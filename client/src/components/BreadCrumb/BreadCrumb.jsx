import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineLeft } from 'react-icons/ai';
import '../BreadCrumb/BreadCrumb.css';

const Breadcrumb = () => {
  const location = useLocation();
  
  const isDashboardPage = location.pathname === '/user/dashboard';
  const isProfilePage = location.pathname === '/user/profile';

  return (
    <div className="breadcrumb-container">
      {!isDashboardPage && (
        <>
          <Link to="/user/dashboard" className="breadcrumb-link">
            <AiOutlineLeft className="breadcrumb-icon" />
            <span>Home</span>
          </Link>
          <span className="breadcrumb-divider">•</span>
        </>
      )}
      <span className="breadcrumb-current">
        {isProfilePage ? 'My Account' : isDashboardPage ? 'Home' : 'Page'}
      </span>
    </div>
  );
};

export default Breadcrumb;
