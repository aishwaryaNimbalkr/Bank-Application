import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import '../Registration/Registration.css'; // Custom CSS for styling

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [transactionPin, setTransactionPin] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      await axios.post('http://localhost:4000/api/auth/register', {
        name,
        email,
        password,
        confirmPassword, 
        transactionPin,
      });
      setIsOtpSent(true);
    } catch (err) {
      setError('Error registering, please try again.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      setError('');
      await axios.post('http://localhost:4000/api/auth/verify-otp', { email, otp });
      setSuccess('Registration successful!');
      setError('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <Container className="register-container d-flex justify-content-center align-items-center">
      <Row className="w-100">
        <Col md={6} lg={5} className="mx-auto">
          {!isOtpSent ? (
            <Form onSubmit={handleRegister} className="register-form">
              <h2 className="text-center mb-4">Register</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formConfirmPassword" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formTransactionPin" className="mb-3">
                <Form.Label>Transaction PIN</Form.Label>
                <Form.Control
                  type="password"
                  value={transactionPin}
                  onChange={(e) => setTransactionPin(e.target.value)}
                  placeholder="Transaction PIN"
                  required
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100">
                Register
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleVerifyOtp} className="register-form">
              <h2 className="text-center mb-4">Verify OTP</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form.Group controlId="formOtp" className="mb-3">
                <Form.Label>OTP</Form.Label>
                <Form.Control
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                />
              </Form.Group>
              <Button type="submit" variant="success" className="w-100">
                Verify OTP
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;
