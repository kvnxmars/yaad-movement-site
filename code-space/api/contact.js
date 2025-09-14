// This file should be placed in an "api" folder at the root of your project
// e.g., your-project/api/contact.js
// You must also run "npm install nodemailer" in your project directory.

import nodemailer from 'nodemailer';

// The async function handles incoming HTTP requests
export default async function handler(req, res) {
  // We only want to process POST requests for security
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Extract form data from the request body
  const { name, email, message } = req.body;

  // Validate the data
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Set up the transporter using environment variables for security
  // These variables must be configured in your Vercel Project Settings
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === '465', // true for port 465, false for other ports like 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Define the email content
  const mailOptions = {
    from: process.env.SMTP_FROM, // The sender's email address
    to: process.env.SMTP_TO,     // The recipient's email address (e.g., your email)
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  try {
    // Attempt to send the email
    await transporter.sendMail(mailOptions);
    // If successful, send a 200 OK response
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    // If there's an error, log it and send a 500 error response
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email.' });
  }
}
