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
      
      const formattedLoginTime = `${day}/${month}/${year}`;
      
      console.log(formattedLoginTime);

    

   
     

      console.log('Token:', token);

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
