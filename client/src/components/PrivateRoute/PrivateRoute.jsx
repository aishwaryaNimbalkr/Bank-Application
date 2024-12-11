import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import Navigation from '../Navigation/Navigation';
import Sidebar from '../Sidebar/Sidebar';
import '../PrivateRoute/PrivateRoute.css';
import { IoIosArrowBack } from "react-icons/io";
import Breadcrumb from '../BreadCrumb/BreadCrumb';

const PrivateRoute = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();


  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const location = useLocation()
  const active = location.pathname

  return token ? (
    <div className="private-route-layout">
      <div className="content-area">
        <Row className="sidebar-layout g-0"> {/* g-0 removes gutter spacing */}
          <Col md={2} xs={12} className="sidebar-col"> {/* Added class for further styling */}
            <Sidebar /> {/* Sidebar */}
          </Col>

          <Col md={10} className="main-content-col"> {/* Added class for further styling */}
            <div className="main-content">
              <Navigation /> {/* Navbar */}
              <section className='Outlet'>





                <Outlet /> {/* Render the child components */}
              </section>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  ) : null;
};

export default PrivateRoute;
