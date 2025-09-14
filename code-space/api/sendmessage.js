import nodemailer from 'nodemailer';

export default async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { name, email, message } = req.body;

  // Your email service credentials (set these in Vercel environment variables)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or another service like outlook, etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.YOUR_EMAIL_ADDRESS, // your email address
    subject: `New message from YAAD MOVEMENT website from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Message sent successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending message.');
  }
}