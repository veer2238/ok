// config/certiDB.js
import mongoose from "mongoose";

const connectCertiDB = async () => {
  try {
    await mongoose.createConnection(
      "mongodb+srv://veer2238rajput:STrgrNlEXyfMZHBs@cluster0.3chkue4.mongodb.net/Contact?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    ).asPromise();

    console.log("Connected to certificate DB");
  } catch (error) {
    console.error("Certificate DB connection error:", error);
  }
};

export default connectCertiDB;
