import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import '../Dashboard/Dashboard.css'; // Import the CSS file for custom styles
import { AuthContext } from '../../context/authContext';

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [userName, setUserName] = useState('');
  const [transactions, setTransactions] = useState([]);

  const { user } = useContext(AuthContext);

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

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:4000/api/transactions/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(response.data.slice(0, 5)); // Get only the last five transactions
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  const navigate = useNavigate();

  return (
    <Container className="my-4">
      {/* Balance Section */}
      <Card className="balance-card text-white mb-4">
        <Card.Body>
          <Row className="align-items-center text-light">
            <Col>
              <h4>Welcome</h4>
              <h2 className='text-light'>{userName}</h2>
            </Col>
            <Col className="text-end">
              <h6 className="text-white-50">Available Balance</h6>
              <h1 className="balance-amount text-light">₹{balance.toLocaleString()}</h1>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Recent Transactions</h5>
          <Button variant="link" onClick={() => navigate('/user/history')}>See All</Button>
        </div>

        {/* Transaction List */}
        {transactions.map((transaction, index) => (
          <TransactionItem
            key={index}
            type={transaction.type} // Adjust based on actual data structure
            amount={transaction.amount}
            date={transaction.date}
            userName={transaction.userName} // Adjust based on actual data structure
            status={transaction.status} // Adjust based on actual data structure
          />
        ))}
      </div>
    </Container>
  );
};

// Transaction Item Component
const TransactionItem = ({ type, amount, date, userName, status }) => {
  const statusColors = {
    Success: 'text-success',
    Failed: 'text-danger',
    Waiting: 'text-warning',
  };

  return (
    <Card className="transaction-item mb-2">
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <Card.Text className="fw-bold">{type}</Card.Text>
          <Card.Text className="text-muted">{date} - {userName}</Card.Text>
        </div>
        <div className="text-end">
          <Card.Text className="fw-bold">₹{amount}</Card.Text>
          <Card.Text className={statusColors[status]}>{status}</Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Dashboard;
