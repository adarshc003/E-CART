const nodemailer = require("nodemailer");

const sendOtpEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"E-Cart" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP for Login",
    html: `
      <div style="font-family: Arial;">
        <h2>Your OTP</h2>
        <p>Use the OTP below to login:</p>
        <h1 style="letter-spacing:4px">${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      </div>
    `,
  });
};

module.exports = sendOtpEmail;