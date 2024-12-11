import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import Graph from './Graph/Graph';
import HHeader from './HistoryHeader/HHeader';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import './TransactionHistory.css'; // Custom CSS file

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalSent, setTotalSent] = useState(0);

  const navigate = useNavigate();
  const transactionsPerPage = 5;

  const retrived = (deposit, send) => {
    setTotalDeposit(deposit);
    setTotalSent(send);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:4000/api/transactions/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(response.data);

        // Calculate totals here
        const depositTotal = response.data
          .filter(transaction => transaction.type === 'deposit')
          .reduce((acc, transaction) => acc + transaction.amount, 0);

        const sentTotal = response.data
          .filter(transaction => transaction.type === 'send')
          .reduce((acc, transaction) => acc + transaction.amount, 0);

        retrived(depositTotal, sentTotal); // Pass totals here
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const currentTransactions = transactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  const handleTransactionClick = (id) => {
    navigate(`/user/history/${id}`);
  };

  const downloadPDF = () => {
    if (transactions.length === 0) {
      alert('No transactions to download.');
      return;
    }
    const pdf = new jsPDF();
    pdf.text('Transaction History', 10, 10);

    transactions.forEach((transaction, index) => {
      const yPosition = 20 + index * 10;
      pdf.text(
        `${transaction.type}: ₹${transaction.amount} - ${transaction.status}`,
        10,
        yPosition
      );

      if (yPosition > 280) {
        pdf.addPage();
      }
    });

    pdf.save('TransactionHistory.pdf');
  };

  return (
    <Container className="transaction-history-container">
      <HHeader retrived={retrived} downloadPDF={downloadPDF} />
      <Graph />

      <div className="transaction-info d-flex d-md-none align-items-center gap-3">
        <div className="transaction-item d-flex align-items-center gap-2 p-2">
          <div className="indicator deposit bg-success"></div>
          <span className="text-muted">Deposit</span>
          <h6 className="mb-0">${totalDeposit.toLocaleString()}</h6>
        </div>
        <div className="transaction-item d-flex align-items-center gap-2 p-2">
          <div className="indicator sent bg-primary"></div>
          <span className="text-muted">Sent</span>
          <h6 className="mb-0 ">${totalSent.toLocaleString()}</h6>
        </div>
      </div>

      <Row className="mt-4">
        {currentTransactions.length === 0 ? (
          <Col className="text-center">
            <p>No transactions found.</p>
          </Col>
        ) : (
          currentTransactions.map((transaction) => (
            <Col md={6} lg={4} key={transaction._id} className="mb-3">
              <Card
                onClick={() => handleTransactionClick(transaction._id)}
                className="transaction-card shadow-sm"
              >
                <Card.Body>
                  <Card.Title>Transaction ID: {transaction._id}</Card.Title>
                  <Card.Text
                    className={transaction.type === 'deposit' ? 'text-success' : 'text-danger'}
                  >
                    {transaction.type === "deposit" ? "↓ Deposit" : "↑ Money Sent"}
                  </Card.Text>
                  <Card.Text>User: {transaction.userName}</Card.Text>
                  <Card.Text>Amount: ₦{transaction.amount}</Card.Text>
                  <Card.Text className={transaction.status === 'Completed' ? 'text-success' : 'text-warning'}>
                    Status: {transaction.status}
                  </Card.Text>
                  <Card.Text>Date: {new Date(transaction.date).toLocaleString()}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <div className="d-flex justify-content-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="me-2"
        >
          Prev
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="ms-2"
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

export default TransactionHistory;
