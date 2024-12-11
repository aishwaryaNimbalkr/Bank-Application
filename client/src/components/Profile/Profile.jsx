import { useContext, useState,useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Container, Row, Col, Card, Form } from 'react-bootstrap';
import PasswordChange from './PasswordChange/PasswordChange';
import TransactionPinChange from './TransactionPinChange/TransactionPinChange';
import { AuthContext } from '../../context/authContext';
import NotificationToggle from './Notification/NotificationToggle';
import './Profile.css'; // Custom CSS

const Profile = () => {
  const [show, setShow] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [balance, setBalance] = useState(0);
  const [userName, setUserName] = useState('');
  const { handleLogout } = useContext(AuthContext);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClosePin = () => setShowPin(false);
  const handleShowPin = () => setShowPin(true);


  useEffect(() => {
    const getData = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:4000/api/user/balance', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(res.data.balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await axios.get('http://localhost:4000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(res.data.name);
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data?.message || error.message);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <Container className="profile-container my-4">
      {/* Balance Section */}
      <Card className="balance-card text-white mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <h4>Welcome</h4>
              <h2 className='text-light'>{userName}</h2>
            </Col>
            <Col className="text-end">
              <h6 className="text-white-50">Available Balance</h6>
              <h1 className="balance-amount text-light">${balance.toLocaleString()}</h1>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Settings Section */}
      <Card className="settings-card">
        <Card.Body>
          <Row className="text-center">
            <Col xs={6} md={3} className="setting-option">
              <NotificationToggle />
              <p>Notifications</p>
            </Col>
            <Col xs={6} md={3} className="setting-option">
              <h1 onClick={handleShow} className="setting-link">Password</h1>
              <p>Change</p>
            </Col>
            <Col xs={6} md={3} className="setting-option">
              <h1 onClick={handleShowPin} className="setting-link">Transaction Pin</h1>
              <p>Change</p>
            </Col>
            <Col xs={6} md={3} className="setting-option">
              <h1 onClick={handleLogout} className="setting-link">Log Out</h1>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Modal for Password Change */}
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PasswordChange />
        </Modal.Body>
      </Modal>

      {/* Modal for Transaction Pin Change */}
      <Modal show={showPin} onHide={handleClosePin} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Change Transaction Pin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TransactionPinChange />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Profile;
