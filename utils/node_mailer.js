const nodemailer = require('nodemailer');

module.exports = transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_EMAIL_PASSWORD
  }
})