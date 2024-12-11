import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import '../Login/Login.css';
import image from './bank.png'

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/user/dashboard'); // Redirect to the dashboard after successful login
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Container fluid className="p-0 d-flex" style={{backgroundColor:"#1e6466"}} >
      

    {/* Login Section */}
    <Col lg={3} md={3} sm={12} xs={12} className="d-flex justify-content-center align-items-center position-relative">
   
      <Container className="login-container ">
        <Row className="w-100">
          <Col md={12}>
         
            <Form onSubmit={handleLogin} className="login-form">
              <h2 className="text-center mb-4">Login</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
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

              <Button type="submit" variant="primary" className="w-100">
                Login
              </Button>
            </Form>
            <Button variant='primary' className="position-absolute top-0 start-0 m-3 register" onClick={()=>{navigate('/register')}}>Register</Button>
          </Col>
        </Row>
      </Container>
    </Col >
    <Col lg={9} md={9} className="overflow-hidden d-none d-sm-block  " >
    <img src={image} alt="bank" style={{maxHeight:"100vh",objectFit:"contain" }}/>
    
    </Col>
  
</Container>
  );
};

export default LoginForm;
