import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1) Create transporter
  const transporter = nodemailer.createTransport({
    // nodemailer has the  other services like yahoo or hotmail
    // service: 'Gmail',
    /*
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: prcoess.env.EMAII_PASSWORD
    }
    */

    host: process.env.EMAIL_HOST,
    post: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Lov Nimesh <hello@nimesh.io>',
    to: options.email,
    subject: options.message,
    text: options.message,
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
