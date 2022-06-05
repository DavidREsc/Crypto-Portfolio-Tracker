const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    },
    tls: {rejectUnauthorized: false}
});

module.exports = transporter;
