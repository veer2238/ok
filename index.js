import express from "express";
const app = express()
import mongoose from "mongoose";
import cors from "cors";
import Registerb from './Routes/Register.js'
import Loginb from './Routes/Login.js'
import Workb from './Routes/Work.js'
import Learning from './Routes/Api.js'

app.use(express.json());

app.use(cors());


mongoose
  .connect(
    "mongodb+srv://veer04agraval:mRU37WQcT8udQc7n@cluster0.lnugf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


  app.use('/',Registerb)
  app.use('/',Learning)
  app.use('/',Loginb)
  app.use('/',Workb)


app.listen(5009,  ()=>  console.log('i am in'))