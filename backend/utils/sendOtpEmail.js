// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendOtpEmail = async (to, otp) => {
//   await transporter.sendMail({
//     from: `"E-Cart" <${process.env.EMAIL_USER}>`,
//     to,
//     subject: "Your OTP for Login",
//     html: `
//       <div>
//         <h2>Your OTP</h2>
//         <h1>${otp}</h1>
//         <p>Valid for 5 minutes</p>
//       </div>
//     `,
//   });
// };

// module.exports = sendOtpEmail;


// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// const sendOtpEmail = async (to, otp) => {
//   try {
//     console.log("Connecting to Gmail...");

//     await transporter.verify();
//     console.log("Gmail connected");

//     await transporter.sendMail({
//       from: `"E-Cart" <${process.env.EMAIL_USER}>`,
//       to,
//       subject: "Your OTP for Login",
//       html: `
//         <div>
//           <h2>Your OTP</h2>
//           <h1>${otp}</h1>
//           <p>Valid for 5 minutes</p>
//         </div>
//       `,
//     });

//     console.log("Email sent successfully");
//   } catch (error) {
//     console.error("Email error:", error);
//     throw error;
//   }
// };

// module.exports = sendOtpEmail;


const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpEmail = async (to, otp) => {
  try {
    await resend.emails.send({
      from: "Ecart <onboarding@resend.dev>",
      to: to,
      subject: "Your OTP",
      html: `<h2>Your OTP: ${otp}</h2>`
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = sendOtpEmail;