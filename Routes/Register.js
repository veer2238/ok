import express from "express";
import Register from "../Modals/Register.js";
import bcrypt from 'bcrypt'

const app = express();



// Route to handle registration
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;



  try {
 
    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      return res.json({success:false, error: "Email is already registered." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await Register.create({ name, email, password:hashedPassword });

    console.log(newUser)
    

    res.status(201).json({ success:true,message: "Thanks Registration successful"});
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default app;
