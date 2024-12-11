import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import NotFound from './components/NotFound/NotFound';
import 'bootstrap/dist/css/bootstrap.min.css';
import DepositMoney from './components/Deposit/DepositMoney';
import SendMoney from './components/SendMoney/SendMoney';
import History from './components/History/TransactionHistory';
import Profile from './components/Profile/Profile';
import Dashboard from './components/Dashboard/Dashboard';
import LoginForm from './components/Login/LoginFrom';
import RegisterForm from './components/Registration/RegisterForm';
import DetailTransaction from './components/History/DetailTransactions/DetailTransaction';

const App = () => {
  return (

   

      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        <Route path='/user' element={<PrivateRoute />}>

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="deposit" element={<DepositMoney />} />
          <Route path="send" element={<SendMoney />} />
          <Route path="history" element={<History />} />
          <Route path="history/:transactionId" element={<DetailTransaction />} />
          <Route path="profile" element={< Profile />} />

        </Route>

        <Route path="/" element={<LoginForm />} />

        <Route path="*" element={<NotFound />} />
      </Routes>


  );
};

export default App;
