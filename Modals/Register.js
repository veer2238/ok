import mongoose from "mongoose";


const registerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  domain:{
  type: String, 
  trim: true, 
  enum: ["mern-stack", "cyber-security", "data-analysis", "python", "ML/AI",'full-stack'],
  },
  dob: { type: String, trim: true },
  internshipStartDate: { type: String, trim: true },
  internshipEndDate: { type: String, trim: true },
  project: { type: String, trim: true },
  studentId: { type: String, unique: true, sparse: true },
  university: { type: String, trim: true }, 
 
 linkedin: { type: String, trim: true },

  internshipStatus: {
    type: String,

    default: "Active",
  },

  createdAt: { type: Date, default: Date.now },

  assign: [
    {
      work: { type: String, trim: true },
      date: { type: String },
      comment: { type: String, trim: true }
    }
  ],

  daily: [
    {
      work: { type: String, trim: true },
      date: { type: String },
      comment: { type: String, trim: true }
    }
  ]
});

const Register = mongoose.model("Register", registerSchema);

export default Register;
