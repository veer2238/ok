import express from "express";
import Register from "../Modals/Register.js";
import jwt from "jsonwebtoken";
const app = express();



// Route to handle registration
app.post("/work", async (req, res) => {
  const { email, work,date } = req.body;

 
console.log(work)


  try {
 
    const existingUser = await Register.findOne({ email });
    if (!existingUser) {
      return res.json({success:false, error: "Email is not registered." });
    }

 



    
   existingUser.assign.push({
    work,date
   })

   await existingUser.save();

   
    

    res.status(201).json({ success:true,message: "Thanks submited"});
  } catch (error) {
    console.error("Error during work:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/work-info', async (req, res) => {

 
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



  


    

      res.json({ workInfo: user.assign });
    });
  } catch (error) {
    console.error('Error adding to order:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

export default app;
