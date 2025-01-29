import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  email: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  domain: { type: String},

  // details:
  //   {
  //     dob:{
  //       type: Number,
        
  //     },
  //     dob:{
  //       type: Number,
       
  //     }
  //   },

 
  createdAt: { type: Date, default: Date.now },

  assign:[
    {


      work:{
type: String,
      },
      date:{
        type:String
      },


      comment:{
        type:String,
        
      }
      
    }
  ]
});

const Register = mongoose.model("Register", registerSchema);

export default Register;
