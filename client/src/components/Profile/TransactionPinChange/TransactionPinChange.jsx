import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import '../TransactionPinChange/TransactionPinChange.css'; // Import CSS for custom styles

const TransactionPinChange = () => {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('info');

  const handlePinChange = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://localhost:4000/api/user/change-pin',
        { currentPin, newPin, confirmNewPin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      setVariant('success');
    } catch (error) {
      setMessage(error.response.data.message || 'Error changing pin');
      setVariant('danger');
    }
  };

  return (
    <Container className="pin-change-container">
      <h2>Change Transaction Pin</h2>
      <Form onSubmit={handlePinChange} className="pin-change-form">
        <Form.Group controlId="formCurrentPin">
          <Form.Label>Current Pin</Form.Label>
          <Form.Control
            type="password"
            value={currentPin}
            onChange={(e) => setCurrentPin(e.target.value)}
            required
            placeholder="Enter your current pin"
          />
        </Form.Group>

        <Form.Group controlId="formNewPin">
          <Form.Label>New Pin</Form.Label>
          <Form.Control
            type="password"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            required
            placeholder="Enter a new pin"
          />
        </Form.Group>

        <Form.Group controlId="formConfirmNewPin">
          <Form.Label>Confirm New Pin</Form.Label>
          <Form.Control
            type="password"
            value={confirmNewPin}
            onChange={(e) => setConfirmNewPin(e.target.value)}
            required
            placeholder="Confirm your new pin"
          />
        </Form.Group>

        <Button type="submit" className="submit-button">Change Pin</Button>
      </Form>

      {message && <Alert variant={variant} className="mt-3">{message}</Alert>}
    </Container>
  );
};

export default TransactionPinChange;
