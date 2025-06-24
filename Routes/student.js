// import express from 'express';
// import Register from '../Modals/Register.js';

// const router = express.Router();

// router.get('/get-domain/:email', async (req, res) => {
//   try {
//     const student = await Register.findOne({ email: req.params.email });

//     if (!student) return res.status(404).json({ error: 'Student not found' });

//     return res.json({ domain: student.domain });
//   } catch (err) {
//     return res.status(500).json({ error: 'Server error' });
//   }
// });

// export default router;


import express from 'express';
import Register from '../Modals/Register.js';

const router = express.Router();

router.get('/get-domain/:email', async (req, res) => {
  try {
    const student = await Register.findOne({ email: req.params.email });

    if (!student) return res.status(404).json({ error: 'Student not found' });

    return res.json({ domain: student.domain });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/delete-student/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Find and delete the student by email
    const deletedStudent = await Register.findOneAndDelete({ email });

    if (!deletedStudent) {
      return res.status(404).json({ 
        success: false,
        message: 'Student not found' 
      });
    }

    return res.json({ 
      success: true,
      message: 'Student deleted successfully',
      deletedStudent 
    });

  } catch (err) {
    console.error('Error deleting student:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Server error while deleting student' 
    });
  }
});

export default router;