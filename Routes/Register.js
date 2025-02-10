import express from "express";
import Register from "../Modals/Register.js";
import jwt from "jsonwebtoken";
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

app.get("/register-domain", async (req, res) => {
  const email = 'Vp41611@gmail.com';
  const domain1 = 'cyber security';
  // const domain1 = 'cyber security';
  // const domain1 = 'ML/AI';
  // const domain1 = 'python';
  // const domain1 = 'data analysis'; 

  try {
    const user = await Register.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.domain = domain1;
    await user.save();

    res.status(201).json({ success: true, message: `${email}Thanks, registration successful` });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/register-info", async (req, res) => {
 


  try {
 
    const userInfo = await Register.find();
  
    

    res.status(201).json({ userInfo });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/register-token", async (req, res) => {
 

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const user = await Register.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }



  


    

      res.json({userInfo:user});
    });
  } catch (error) {
    console.error('Error adding to order:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post("/profile-info", async (req, res) => {
  const {
    name,
    email,
    domain,
    role,
    studentId,
    dob,
    university,
    linkedin,
    internshipStart,
    internshipEnd,
    internshipStatus,
  } = req.body;
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    // Verify JWT Token
    jwt.verify(token, "secret-key", async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }

      // Find user by decoded email from token
      const user = await Register.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Extract form data from request body
     

      // Update user details in the database
      user.name = name
      user.email = email
      user.domain = domain
      user.project = role
      user.studentId = studentId
      user.dob = dob
      user.university = university
      user.linkedin = linkedin
      user.internshipStartDate = internshipStart
      user.internshipEndDate = internshipEnd
      user.internshipStatus = internshipStatus

      // Save updated user information
      await user.save();

      // Return success response
      res.json({ success: true, message: "Thanks Profile updated successfully!"});
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});




app.delete("/delete-user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await Register.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(201).json({ success:true,message: "Thanks user deleted successfully"});
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default app;
