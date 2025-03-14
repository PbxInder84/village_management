const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Create a test account
    const testAccount = await nodemailer.createTestAccount();

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    // Define email options
    const mailOptions = {
      from: `${process.env.FROM_NAME} <${testAccount.user}>`,
      to: options.email,
      subject: options.subject,
      html: options.message
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    
    // Log the URL where you can preview the email
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('Preview URL: %s', previewUrl);
    
    // Add the preview URL to the info object
    info.previewUrl = previewUrl;
    
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

module.exports = sendEmail; 