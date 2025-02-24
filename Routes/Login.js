import express from "express";
import Register from "../Modals/Register.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import dotenv from "dotenv";
import nodemailer from 'nodemailer';
dotenv.config();

const app = express();




// Route to handle registration
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
      const user = await Register.findOne({ email });

      if (!user) {
          return res.json({ success: false, error: 'Invalid credentials' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
          return res.json({ success: false, error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ email }, 'secret-key', { expiresIn: '450h' });

      
      const loginTime = new Date();
      const day = String(loginTime.getDate()).padStart(2, '0');
      const month = String(loginTime.getMonth() + 1).padStart(2, '0'); 
      const year = loginTime.getFullYear();
      
      // Format the time as hh:mm:ss
    //   const hours = String(loginTime.getHours()).padStart(2, '0');
    //   const minutes = String(loginTime.getMinutes()).padStart(2, '0');
    //   const seconds = String(loginTime.getSeconds()).padStart(2, '0');
      
      // Combine the date and time
      const formattedLoginTime = `${day}/${month}/${year}`;
      
      console.log(formattedLoginTime);

    

   
     

      console.log('Token:', token);

      // Send notification email
      const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
          },
      });

      const info = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER1,
          subject: "New Login Notification",
          html: `
              <div>
                  <h2>${user.name},</h2>
                  <p>Logged in at: ${formattedLoginTime}</p>
                 
              </div>
          `,
      });

      console.log("Message sent:", info.messageId);

      // Respond with success, token, and times
      res.json({
          success: true,
          data: token,
          name: user.name,
          loginTime: formattedLoginTime,
          domain: user.domain
          
      });

  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, error: 'An error occurred during login' });
  }
});


export default app;
