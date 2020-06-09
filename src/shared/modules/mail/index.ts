import nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service:'gmail',
  auth: {
    user: 'dthuctap@gmail.com',
    pass: 'Quang29/06/99',
  },
});

export { transporter };
