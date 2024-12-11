import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const SendMoney = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionPin, setTransactionPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState([]); // List of other users

  // Fetch other users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // Token for authentication
        
        const response = await axios.get('http://localhost:4000/api/user/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response)
        setUsers(response.data); // Set users excluding the current user
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSendMoney = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      const token = localStorage.getItem('token'); // Token for authentication
      const response = await axios.post(
        'http://localhost:4000/api/transactions',
        {
          type: 'send',
          recipient, // Recipient ID
          amount,
          transactionPin,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess('Money sent successfully');
      setRecipient('');
      setAmount('');
      setTransactionPin('');
    } catch (err) {
      setError('Failed to send money. Please check your balance and pin.');
    }
  };

  return (
    <Container className="send-money-container mt-5">
      <h2 className="text-center mb-4">Send Money</h2>
      <Form onSubmit={handleSendMoney}>
        <Form.Group controlId="formRecipient">
          <Form.Label>Recipient</Form.Label>
          <Form.Select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          >
            <option value="">Select a recipient</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="formAmount">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </Form.Group>
        <Form.Group controlId="formTransactionPin">
          <Form.Label>Transaction PIN</Form.Label>
          <Form.Control
            type="password"
            value={transactionPin}
            onChange={(e) => setTransactionPin(e.target.value)}
            placeholder="Enter transaction PIN"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Send Money
        </Button>
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        {success && <Alert variant="success" className="mt-3">{success}</Alert>}
      </Form>
    </Container>
  );
};

export default SendMoney;
