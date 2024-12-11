// utils/sendEmail.js
const nodemailer = require('nodemailer');
require('dotenv').config()

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, // Your email
      pass: process.env.EMAIL_PASSWORD, // Your app password
    },
  });

  await transporter.sendMail({ from: process.env.EMAIL, to, subject, text });
};

module.exports = sendEmail;
