import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Register from "../Modals/Register.js";

const router = express.Router();

const uploadDir = "uploads/review_screenshots";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/upload-review-screenshot", upload.single("screenshot"), async (req, res) => {
  try {
    const { email } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.reviewScreenshot = req.file.filename;
    await user.save();

    res.json({
      success: true,
      message: "Screenshot uploaded successfully.",
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// ✅ GET route to fetch screenshot by email
router.get("/get-review-screenshot/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await Register.findOne({ email });
    if (!user || !user.reviewScreenshot) {
      return res.status(404).json({ success: false, message: "Screenshot not found" });
    }

    const screenshotUrl = `/uploads/review_screenshots/${user.reviewScreenshot}`;
    res.json({ success: true, screenshotUrl });
  } catch (err) {
    console.error("Fetch screenshot error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});




export default router;
