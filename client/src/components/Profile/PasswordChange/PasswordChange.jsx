import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import './PasswordChange.css'; // Import CSS for custom styles

const PasswordChange = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('info');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://localhost:4000/api/user/change-password',
        { currentPassword, newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      setVariant('success');
    } catch (error) {
      setMessage(error.response.data.message || 'Error changing password');
      setVariant('danger');
    }
  };

  return (
    <Container className="password-change-container">
      <h2>Change Password</h2>
      <Form onSubmit={handlePasswordChange} className="password-change-form">
        <Form.Group controlId="formCurrentPassword">
          <Form.Label>Current Password</Form.Label>
          <Form.Control
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="Enter your current password"
          />
        </Form.Group>

        <Form.Group controlId="formNewPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter a new password"
          />
        </Form.Group>

        <Form.Group controlId="formConfirmPassword">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your new password"
          />
        </Form.Group>

        <Button type="submit" className="submit-button">Change Password</Button>
      </Form>

      {message && <Alert variant={variant} className="mt-3">{message}</Alert>}
    </Container>
  );
};

export default PasswordChange;
