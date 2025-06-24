import express from "express";
import mongoose from "mongoose";
import Register from "../Modals/Register.js";
import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const router = express.Router();
const __dirname = path.resolve();

// SECOND DB CONNECTION
const certiDB = await mongoose.createConnection(
  "mongodb+srv://veer2238rajput:STrgrNlEXyfMZHBs@cluster0.3chkue4.mongodb.net/Contact?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// CERTIFICATE MODEL IN SECOND DB
const certiSchema = new mongoose.Schema({
  name: { type: String, required: true },
  work: { type: String, required: true },
  certiId: { type: String, required: true, unique: true },
});
const Certi = certiDB.model("Certificate", certiSchema);

// PATCH: Approve or Decline certificate
// router.patch("/approve-certificate/:email", async (req, res) => {
//   const { status } = req.body;

//   try {
//     const student = await Register.findOneAndUpdate(
//       { email: req.params.email },
//       { certificateStatus: status },
//       { new: true }
//     );

//     if (!student) {
//       return res.status(404).json({ success: false, message: "Student not found" });
//     }

//     if (status === "approved") {
//       // Generate unique certiId
//       let certiId;
//       let isUnique = false;

//       while (!isUnique) {
//         const randNum = Math.floor(1000 + Math.random() * 9000); // 1000-9999
//         certiId = `@V-Ex-Int${randNum}`;
//         const existing = await Certi.findOne({ certiId });
//         if (!existing) isUnique = true;
//       }

//      // Construct work message
// const domain = student.domain || "Intern";
// const name = student.name || "Student";
// const workMsg = `This is to certify that ${name} has successfully completed their internship as a ${domain} Intern at V-Ex Tech Solution. The internship duration was 4 months. The internship has been verified, and the status is marked as Completed.`;

// // Save to second DB
// await Certi.create({
//   name: student.name,
//   work: workMsg,
//   certiId,
// });

//       // Optionally, save certiId to main DB if you want to reuse in PDF
//       student.certiId = certiId;
//       await student.save();
//     }

//     res.json({ success: true, message: `Certificate ${status}` });
//   } catch (error) {
//     console.error("Approval error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

router.patch("/approve-certificate/:email", async (req, res) => {
  const { status, duration } = req.body;

  try {
    const student = await Register.findOneAndUpdate(
      { email: req.params.email },
      { certificateStatus: status },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (status === "approved") {
      let certiId;
      let isUnique = false;

      while (!isUnique) {
        const randNum = Math.floor(1000 + Math.random() * 9000);
        certiId = `@V-Ex-Int${randNum}`;
        const existing = await Certi.findOne({ certiId });
        if (!existing) isUnique = true;
      }

      const domain = student.domain || "Intern";
      const name = student.name || "Student";
      const workMsg = `This is to certify that ${name} has successfully completed their internship as a ${domain} Intern at V-Ex Tech Solution. The internship duration was ${duration || "unspecified"}. The internship has been verified, and the status is marked as Completed.`;

      await Certi.create({
        name: student.name,
        work: workMsg,
        certiId,
      });

      student.certiId = certiId;
      await student.save();
    }

    res.json({ success: true, message: `Certificate ${status}` });
  } catch (error) {
    console.error("Approval error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// GET: Check certificate approval status
router.get("/check-certificate-status/:email", async (req, res) => {
  try {
    const student = await Register.findOne({ email: req.params.email });

    if (!student) {
      return res.status(404).json({ approved: false });
    }

    res.json({ approved: student.certificateStatus === "approved" });
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({ approved: false });
  }
});

// GET: Generate certificate PDF
router.get("/generate-certificate/:email", async (req, res) => {
  try {
    const student = await Register.findOne({ email: req.params.email });

    if (!student || student.certificateStatus !== "approved") {
      return res.status(403).json({ success: false, message: "Not approved for certificate" });
    }

    // Get certiId from Certi DB
    const certiRecord = await Certi.findOne({ name: student.name });
    const certiId = certiRecord?.certiId || "@V-Ex-IntXXXX";

    const templatePath = path.join(__dirname, "public", "Certificate.pdf");
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({ success: false, message: "Certificate template not found" });
    }

    const existingPdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const studentName = student.name || "Student Name";
    const domain = student.domain || "your domain";

    // Add certi ID for verification
    firstPage.drawText(`CERTI ID: ${certiId}`, {
      x: 1150,
      y: 1000,
      size: 28,
      font,
      color: rgb(0, 0, 0),
    });

    // Add "CERTIFICATE"
firstPage.drawText("C E R T I F I C A T E", {
  x: 450,
  y: 900,
  size: 70,
  font,
  color: rgb(0,0,0),
});

// Add "of Completion"
firstPage.drawText("of Completion", {
  x: 630,
  y: 800,
  size: 40,
  font,
  color: rgb(0, 0, 0),
});

firstPage.drawText(`${domain.toUpperCase()} INTERNSHIP`, {
      x: 600,
      y: 700,
      size: 40,
      font,
      color: rgb(0, 0, 0),
    });


    // Customize text and positions
    firstPage.drawText(studentName.toUpperCase(), {
      x: 630,
      y: 600,
      size: 50,
      font,
      color: rgb(0, 0, 0),
    });

    

    // First line
firstPage.drawText(
  "THIS CERTIFICATE IS GIVEN TO YOU BECAUSE YOU HAD", 
  {
    x: 250,
    y: 500,
    size: 40,
    font,
    color: rgb(0, 0, 0),
  }
);

// Second line
firstPage.drawText(
  `DONE INTERNSHIP OF ${domain.toUpperCase()} AT V-EX TECH SOLUTION.`, 
  {
    x: 250,
    y: 450,
    size: 40,
    font,
    color: rgb(0, 0, 0),
  }
);



    

    const modifiedPdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=certificate.pdf");
    res.send(Buffer.from(modifiedPdfBytes));
  } catch (err) {
    console.error("Certificate generation failed:", err);
    res.status(500).json({ success: false, message: "Server error generating certificate" });
  }
});

export default router;
