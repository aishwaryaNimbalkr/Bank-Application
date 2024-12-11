// DepositMoney.js

import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import './DepositMoney.css'; // Import the custom CSS file

const DepositMoney = () => {
    const [amount, setAmount] = useState('');
    const [transactionPin, setTransactionPin] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleDeposit = async (e) => {
        e.preventDefault();
        try {
            // Reset error and success messages
            setError('');
            setSuccess('');

            const token = localStorage.getItem('token');
            // Make a deposit request
            const response = await axios.post('http://localhost:4000/api/transactions', 
                {
                    type: 'deposit',
                    amount,
                    transactionPin,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in the request headers
                    },
                }
            );

            console.log(response);

            setSuccess('Deposit successful');
            setAmount('');
            setTransactionPin('');
        } catch (err) {
            setError('Failed to deposit, please check your pin and try again.');
        }
    };

    return (
        <Container className="deposit-money-container mt-5"> {/* Scoped class added */}
            <h2 className="text-center mb-4">Deposit Money</h2>
            <Form onSubmit={handleDeposit}>
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
                    Deposit
                </Button>
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                {success && <Alert variant="success" className="mt-3">{success}</Alert>}
            </Form>
        </Container>
    );
};

export default DepositMoney;
